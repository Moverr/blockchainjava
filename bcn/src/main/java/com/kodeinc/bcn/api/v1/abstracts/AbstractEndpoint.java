/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.api.v1.abstracts;

import com.codemovers.scholar.engine.api.v1.users.UserService; 
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

/**
 *
 * @author mover 11/15/2017
 * @param <T>
 * @param <Z>
 */
@Path("/")
public abstract class AbstractEndpoint<T, Z> implements AbstractEndpointInterface<T, Z> {

    UserService service = null;

    @Override
    public void validateAuthentication(String authentication) {
        try {
            //todo: validate login functionality
            UserService.getInstance().validateAuthentication(schoolData, authentication);
        } catch (Exception ex) {
            Logger.getLogger(AbstractEndpoint.class.getName()).log(Level.SEVERE, null, ex);
            throw new BadRequestException("INVALID CREDENTIALS");
        }
    }

    /**
     *
     * @param entity
     * @param authentication
     * @param httpRequest
     * @return
     * @throws Exception
     */
    @Override
    public Z create(T entity,
            @HeaderParam("authentication") String authentication,
            @Context HttpServletRequest httpRequest
    ) throws Exception {
        throw new UnsupportedOperationException();
    }

    /**
     *
     * @param authentication
     * @param entity
     * @param httpRequest
     * @return
     */
    @Override
    public Z update(
            T entity,
            @HeaderParam("authentication") String authentication,
            @Context HttpServletRequest httpRequest) throws Exception {
        throw new UnsupportedOperationException();
    }

    /**
     *
     * @param id
     * @return
     */
    @Override
    public Z archive(@PathParam("id") Integer id,
            @HeaderParam("authentication") String authentication,
            @Context HttpServletRequest httpRequest) throws Exception {
        throw new UnsupportedOperationException();
    }

    /**
     *
     * @param id
     * @param authentication
     * @return
     */
    @Override
    public Response delete(@PathParam("id") Integer id,
            @HeaderParam("authentication") String authentication,
            @Context HttpServletRequest httpRequest
    ) {
        throw new UnsupportedOperationException();
    }

    /**
     *
     * @param start
     * @param end
     * @return
     */
    @Override
    public List<Z> list(
            @QueryParam("start") int start,
            @QueryParam("end") int end,
            @HeaderParam("authentication") String authentication,
            @Context HttpServletRequest httpRequest
    ) throws Exception {
        throw new UnsupportedOperationException();
    }

    /**
     *
     * @param id
     * @param httpRequest
     * @return
     * @throws Exception
     */
    @Override
    public Z get(
            @QueryParam("id") Integer id,
            @HeaderParam("authentication") String authentication,
            @Context HttpServletRequest httpRequest
    ) throws Exception {
        throw new UnsupportedOperationException();
    }

    protected void validate(String authentication) throws Exception {
        //todo: checkout to see that the user exiss in the db befor creation

    }

}
