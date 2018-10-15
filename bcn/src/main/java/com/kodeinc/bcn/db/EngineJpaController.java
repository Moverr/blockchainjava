/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.db;

import com.kodeinc.bcn.helper.annotation.MainId;
import com.kodeinc.bcn.helper.Utilities;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceException;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaQuery;

/**
 *
 * @author mover
 * @param <T>
 */
public class EngineJpaController<T extends Entity> implements Serializable {

    private static final Logger LOG = Logger.getLogger(EngineJpaController.class.getName());
    public static final EntityManagerFactoryProvider FACTORY_PROVIDER = EntityManagerFactoryProvider.getInstance();

    private final Class<T> entityClass;
    private final Field mainIdField;

    
    public EngineJpaController(Class<T> entityClass) {
        this.entityClass = entityClass;
        Field f = null;

        for (Field field : entityClass.getDeclaredFields()) {
            if (field.getDeclaredAnnotation(MainId.class) != null) {
                field.setAccessible(true);
                f = field;
                break;
            }
        }
        mainIdField = f;

    }

    public EntityManager getEntityManager() {
        LOG.log(Level.INFO, " Creating Entity Manager ");
        
        return FACTORY_PROVIDER.getFactory().createEntityManager();
    }

    public Integer create(T entity) {
        EntityManager em = null;
        try {
            
            em.getTransaction().begin();
            em.persist(entity);
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
        return entity.getId();
    }

    public T find(Integer id) {
        T entity;
        EntityManager em = null;
        try {
            em = getEntityManager();
            entity = em.find(entityClass, id);
        } finally {
            if (em != null) {
                em.close();
            }
        }
        return entity;
    }

    

    private List<T> findEntities(boolean all, int maxResults, int firstResult) {
        EntityManager em = getEntityManager();
        try {
            CriteriaQuery cq = em.getCriteriaBuilder().createQuery();

            cq.select(cq.from(entityClass));

            Query q = em.createQuery(cq);
            if (!all) {
                q.setMaxResults(maxResults);
                q.setFirstResult(firstResult);
            }
            return q.getResultList();

        } finally {
            em.close();
        }
    }

    public List<T> findByNamedQuery(String namedQuery, String[] parameterKeys, Object[] parameterValues, String logId) {
        if (parameterKeys == null && parameterValues == null) {
            return null;
        } else if (parameterKeys != null && parameterValues == null) {
            return null;
        } else if (parameterKeys == null && parameterValues != null) {
            return null;
        } else if (parameterKeys.length != parameterValues.length) {
            return null;
        }

        List<T> returnValue = new ArrayList<>();
        EntityManager em = getEntityManager();
        try {
            TypedQuery<T> query = em.createNamedQuery(namedQuery, entityClass);

            for (int i = 0; i < parameterValues.length; i++) {
                query.setParameter(parameterKeys[i], parameterValues[i]);
            }

            returnValue = query.getResultList();
        } catch (PersistenceException ex) {
            LOG.log(Level.SEVERE, "unexpected exception {0}\n{1}", new Object[]{ex.getMessage()});
            // don't throw WebApplicationException, force caller to handle this
        } finally {
            em.close();
        }

        return returnValue;
    }

    public void edit(T entity) throws Exception {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            em.merge(entity);
            em.getTransaction().commit();
        } catch (Exception ex) {
            String msg = ex.getLocalizedMessage();
            if (msg == null || msg.length() == 0) {
                Integer id = entity.getId();
               
            }
            throw ex;
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public List<T> getMainIds(boolean all, Object startMainId, Integer offset, Integer limit) {
        if (mainIdField == null) {
            return null;
        }

        if (startMainId == null) {
            Class<?> type = mainIdField.getType();
            if (type == String.class) {
                startMainId = "00000000";
            } else if (type == Long.class) {
                startMainId = 0L;
            } else if (type == Integer.class) {
                startMainId = 0;
            }
        }

        EntityManager entityManager = getEntityManager();
        List mainIdList = null;

        try {
            Query query = entityManager.createQuery(
                    "SELECT obj." + mainIdField.getName() + " "
                    + "FROM " + entityClass.getSimpleName() + " obj "
                    + "WHERE obj." + mainIdField.getName() + " > ?1");
            query.setParameter(1, startMainId);
            mainIdList = query.getResultList();
        } catch (NoResultException ex) {
            LOG.log(Level.FINE, "no main ids found");
            return null;
        } catch (PersistenceException ex) {
            LOG.log(Level.SEVERE, "unexpected persistence exception {0}\n{1}", new Object[]{ex.getMessage(),
                Utilities.getStackTrace(ex)

            });
            // don't throw WebApplicationException, force caller to handle this
        } catch (Exception ex) {
            LOG.log(Level.SEVERE, "unexpected exception {0}\n{1}", new Object[]{ex.getMessage(), Utilities.getStackTrace(ex)});
            return null;
        } finally {
            LOG.log(Level.FINER, "closing entity manager {0}", entityManager);
            entityManager.close();
        }

        return mainIdList;
    }

}
