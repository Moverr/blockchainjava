/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.db.controllers;
  
import com.kodeinc.bcn.db.EngineJpaController;
import com.kodeinc.bcn.db.entities.UserProfile;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.ws.rs.BadRequestException;

/**
 *
 * @author mover 4/25/2018
 */
public class UserProfileJpaController extends EngineJpaController {

    protected static final Logger LOG = Logger.getLogger(UserProfileJpaController.class.getName());

    private static UserProfileJpaController controller = null;

    public static UserProfileJpaController getInstance() {
        if (controller == null) {
            controller = new UserProfileJpaController();
        }
        return controller;
    }

    public UserProfileJpaController() {
        super(UserProfile.class);
    }

    public UserProfile create(UserProfile entity) {
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

    public UserProfile edit(UserProfile user_role) throws Exception {
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
                if (findUserProfile(id) == null) {
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

    public UserProfile findUserProfile(Integer id) {
        EntityManager em = getEntityManager();

        try {
            return em.find(UserProfile.class, id);
        } finally {
            em.close();
        }
    }

    public void destroy(Integer id) throws Exception {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            UserProfile _user_profile;
            try {
                _user_profile = em.getReference(UserProfile.class, id.longValue());
                _user_profile.getId();
            } catch (EntityNotFoundException enfe) {
                throw enfe;

            }
            em.remove(_user_profile);
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }



}
