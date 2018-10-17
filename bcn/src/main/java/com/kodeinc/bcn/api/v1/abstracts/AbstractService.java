/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.api.v1.abstracts;

import com.kodeinc.bcn.api.v1.accounts.entities.AuthenticationResponse;
import java.util.List;

/**
 *
 * @author Mover 11/24/2017
 * @param <T>
 * @param <Z>
 */
public abstract class AbstractService<T, Z> {

    /**
     *
     * @param entity
     * @return
     * @throws Exception
     */
    public Z create(T entity) throws Exception {
        throw new UnsupportedOperationException("Not Supported ");

    }

    public Z create(T entity, AuthenticationResponse authentication) throws Exception {
        throw new UnsupportedOperationException("Not Supported ");
    }

    /**
     *
     * @param Id
     * @return
     * @throws Exception
     */
    public Z getById(Integer Id) throws Exception {
        throw new UnsupportedOperationException("Not Supported ");
    }

    public Z getById(Integer Id, AuthenticationResponse authentication) throws Exception {
        throw new UnsupportedOperationException("Not Supported ");
    }

    /**
     *
     * @param authentication
     */
    protected void validate(String authentication) {
        //todo: checkout to see that the user exiss in the db befor creation

    }

    public Z update(T entity) throws Exception {
        throw new UnsupportedOperationException("Not Supported ");
    }

    public Z update(T entity, AuthenticationResponse authentication) throws Exception {
        throw new UnsupportedOperationException("Not Supported ");
    }

    public Z archive(Integer id) throws Exception {
        throw new UnsupportedOperationException("Not Supported ");
    }

    public Z archive(Integer id, AuthenticationResponse authentication) throws Exception {
        throw new UnsupportedOperationException("Not Supported ");
    }

    public Z delete(Integer id) throws Exception {
        throw new UnsupportedOperationException("Not Supported ");
    }

    public List<Z> list(Integer ofset, Integer limit) throws Exception {
        throw new UnsupportedOperationException("Not Supported ");
    }

    public List<Z> list(Integer ofset, Integer limit, AuthenticationResponse authentication) throws Exception {
        throw new UnsupportedOperationException("Not Supported ");
    }

    public List<Z> search(String query, Integer ofset, Integer limit, AuthenticationResponse authentication) throws Exception {
        throw new UnsupportedOperationException("Not Supported ");
    }

}
