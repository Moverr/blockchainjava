/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.db.controllers;


import com.kodeinc.bcn.db.EngineJpaController;
import com.kodeinc.bcn.db.entities.UserRole;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.ws.rs.BadRequestException;

/**
 *
 * @author mover 12/22/2017
 */
public class UserRoleJpaController extends EngineJpaController {

    protected static final Logger LOG = Logger.getLogger(UserRoleJpaController.class.getName());

    private static UserRoleJpaController controller = null;

    public static UserRoleJpaController getInstance() {
        if (controller == null) {
            controller = new UserRoleJpaController();
        }
        return controller;
    }

    public UserRoleJpaController() {
        super(UserRole.class);
    }

    public UserRole create(UserRole entity) {
        EntityManager em = null;
        try {
            em = getEntityManager();
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

    public UserRole edit(UserRole user_role) throws Exception {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            user_role = em.merge(user_role);
            em.getTransaction().commit();
        } catch (Exception ex) {
            String msg = ex.getLocalizedMessage();
            if (msg == null || msg.length() == 0) {
                Integer id = user_role.getId().intValue();
                if (findUser(id) == null) {
                    throw new BadRequestException("The Inventory with id " + id + " no longer exists.");
                }
            }
            throw ex;
        } finally {
            if (em != null) {
                em.close();
            }
        }

        return user_role;
    }

    public UserRole findUser(Integer id) {
        EntityManager em = getEntityManager();

        try {
            return em.find(UserRole.class, id);
        } finally {
            em.close();
        }
    }

    public void destroy(Integer id) throws Exception {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            UserRole _user_role;
            try {
                _user_role = em.getReference(UserRole.class, id.longValue());
                _user_role.getId();
            } catch (EntityNotFoundException enfe) {
                throw enfe;

            }
            em.remove(_user_role);
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

}
