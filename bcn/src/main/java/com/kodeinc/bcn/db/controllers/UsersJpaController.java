/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.db.controllers;

import com.codemovers.scholar.engine.db.EngineJpaController;
import com.codemovers.scholar.engine.db.entities.Roles;
import com.codemovers.scholar.engine.db.entities.SchoolData;
import com.codemovers.scholar.engine.db.entities.Users;
import com.codemovers.scholar.engine.helper.Utilities;
import com.codemovers.scholar.engine.helper.exceptions.BadRequestException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Root;

/**
 *
 * @author Mover
 */
public class UsersJpaController extends EngineJpaController {

    protected static final Logger LOG = Logger.getLogger(UsersJpaController.class.getName());

    private static UsersJpaController controller = null;

    public static UsersJpaController getInstance() {
        if (controller == null) {
            controller = new UsersJpaController();
        }
        return controller;
    }

    public UsersJpaController() {
        super(Users.class);
    }

    public Users create(Users entity, SchoolData data) {
        EntityManager em = null;
        try {
            em = getEntityManager(data.getExternalId());
            em.getTransaction().begin();
            em.persist(entity);
            em.getTransaction().commit();
        } catch (Exception eml) {
            LOG.log(Level.INFO, eml.toString());
            throw eml;
        } finally {
            if (em != null) {
                em.close();
            }
        }
        return entity;

    }

    public void edit(Users user, SchoolData data) throws Exception {
        EntityManager em = null;
        try {
            em = getEntityManager(data.getExternalId());
            em.getTransaction().begin();
            user = em.merge(user);
            em.getTransaction().commit();
        } catch (Exception ex) {
            String msg = ex.getLocalizedMessage();
            if (msg == null || msg.length() == 0) {
                Integer id = user.getId().intValue();
                if (findUser(id, data) == null) {
                    throw new BadRequestException("The Inventory with id " + id + " no longer exists.");
                }
            }
            throw ex;
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public Users findUser(Integer id, SchoolData data) {
        EntityManager em = getEntityManager(data.getExternalId());

        try {
            return em.find(Users.class, id);
        } finally {
            em.close();
        }
    }

    private List<Users> findUsers(boolean all, int maxResults, int firstResult, SchoolData data) {
        EntityManager em = getEntityManager(data.getExternalId());
        try {
            CriteriaBuilder cb = em.getCriteriaBuilder();
            CriteriaQuery<Users> cq = cb.createQuery(Users.class);
            Root<Users> user = cq.from(Users.class);
            cq.select(cq.from(Users.class));
            cq.orderBy(cb.desc(user.get("dateCreated")));

            Query q = em.createQuery(cq);
            if (!all) {
                q.setMaxResults(firstResult);
                q.setFirstResult(maxResults);
            }
            return q.getResultList();
        } finally {
            em.close();
        }
    }

    public List<Users> findUsers(SchoolData data) {
        return findUsers(true, -1, -1, data);
    }

    public List<Users> findUsers(int maxResults, int firstResult, SchoolData data) {
        return findUsers(false, maxResults, firstResult, data);
    }

    public int getCount(SchoolData data) {
        EntityManager em = getEntityManager(data.getExternalId());
        try {
            CriteriaQuery cq = em.getCriteriaBuilder().createQuery();

            Root<Users> rt = cq.from(Users.class);
            cq.select(em.getCriteriaBuilder().count(rt));

            Query q = em.createQuery(cq);
            return (Integer) q.getSingleResult();
        } finally {
            em.close();
        }
    }

    public List<Users> findByUserName(String username, SchoolData data) {
        List<Users> userList = new ArrayList<>();
        EntityManager em = getEntityManager(data.getExternalId());
        Query query = em.createNamedQuery("Users.findByUsername");
        query.setParameter("username", username);
        try {
            userList = query.getResultList();
            LOG.log(Level.FINE, "offices found for username {0}", new Object[]{username});
        } catch (Exception ex) {
            LOG.log(Level.SEVERE, "unexpected exception {0}\n{1}", new Object[]{ex.getMessage(), Utilities.getStackTrace(ex)});
            return null;
            // don't throw WebApplicationException, force caller to handle this
        } finally {
            LOG.log(Level.FINER, "closing entity manager {0}", em);
            em.close();
        }
        return userList;
    }

    public Users login(String username, String password, SchoolData data) {

        Users users = null;
        EntityManager em = getEntityManager(data.getExternalId());

        try {
            Query query = em.createNamedQuery("Users.login");
            query.setParameter("username", username);
            query.setParameter("password", password);

            LOG.log(Level.INFO, " TEST 1234    ");
            List<Users> list = query.getResultList();
            LOG.log(Level.FINE, " User with username {0} found ", new Object[]{username});
            if (list != null && list.size() > 0) {
                users = list.get(0);
            }

        } catch (Exception ex) {
            LOG.log(Level.SEVERE, "unexpected exception {0}\n{1}", new Object[]{ex.getMessage(), Utilities.getStackTrace(ex)});
            return null;
        } finally {
            LOG.log(Level.FINER, "closing entity manager {0}", em);
            em.close();
        }

        return users;

    }

    public void destroy(Integer id, SchoolData tenantdata) throws Exception {
        EntityManager em = null;
        try {
            em = getEntityManager(tenantdata.getExternalId());
            em.getTransaction().begin();
            Users _user;
            try {
                _user = em.getReference(Users.class, id.longValue());
                _user.getId();
            } catch (EntityNotFoundException enfe) {
                throw enfe;

            }
            em.remove(_user);
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

}
