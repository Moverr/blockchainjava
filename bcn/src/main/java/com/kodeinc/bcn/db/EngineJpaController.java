/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.db;

import com.codemovers.scholar.engine.helper.annotation.MainId;
import com.kodeinc.bcn.db.helper.Utilities;
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
import javax.ws.rs.BadRequestException;

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

    private final EntityManagerFactoryProvider.DBModule dBModule = EntityManagerFactoryProvider.DBModule.SC_ENGINE;

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
        if (dBModule == null || database_name == null) {
            throw new BadRequestException("DB MODULE OR DATABASE NOT SET");

        }
        return FACTORY_PROVIDER.getFactory().createEntityManager();
    }

    public Integer create(T entity) {
        EntityManager em = null;
        try {
            em = getEntityManager(database_name);
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
            em = getEntityManager(database_name);
            entity = em.find(entityClass, id);
        } finally {
            if (em != null) {
                em.close();
            }
        }
        return entity;
    }

    public List<T> findEntities(String database_name) {
        return findEntities(true, -1, -1, database_name);
    }

    public List<T> findEntities(int maxResults, int firstResult) {
        return findEntities(false, maxResults, firstResult, database_name);
    }

    private List<T> findEntities(boolean all, int maxResults, int firstResult) {
        EntityManager em = getEntityManager(database_name);
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
        EntityManager em = getEntityManager(database_name);
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
            em = getEntityManager(database_name);
            em.getTransaction().begin();
            em.merge(entity);
            em.getTransaction().commit();
        } catch (Exception ex) {
            String msg = ex.getLocalizedMessage();
            if (msg == null || msg.length() == 0) {
                Integer id = entity.getId();
                if (find(id, database_name) == null) {
                    throw new Exception("The entity with id " + id + " no longer exists.");
                }
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

        EntityManager entityManager = getEntityManager(database_name);
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
