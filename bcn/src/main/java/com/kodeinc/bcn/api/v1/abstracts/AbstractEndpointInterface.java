/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.api.v1.abstracts;
 
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

/**
 *
 * @author mover
 * @param <T>
 * @param <Z>
 */
public interface AbstractEndpointInterface<T, Z> {

    /**
     *
     * @param id
     * @param authentication
     * @param httpRequest
     * @return
     * @throws java.lang.Exception
     */
    Z archive(@PathParam(value = "id") Integer id, @HeaderParam(value = "authentication") String authentication, @Context HttpServletRequest httpRequest) throws Exception;

    /**
     *
     * @param entity
     * @param authentication
     * @param httpRequest
     * @return
     * @throws Exception
     */
    Z create(T entity, @HeaderParam(value = "authentication") String authentication, @Context HttpServletRequest httpRequest) throws Exception;

    /**
     *
     * @param id
     * @param authentication
     * @param httpRequest
     * @return
     */
    Response delete(@PathParam(value = "id") Integer id, @HeaderParam(value = "authentication") String authentication, @Context HttpServletRequest httpRequest);

    /**
     *
     * @param id
     * @param authentication
     * @param httpRequest
     * @return
     * @throws Exception
     */
    Z get(@QueryParam(value = "id") Integer id, @HeaderParam(value = "authentication") String authentication, @Context HttpServletRequest httpRequest) throws Exception;

    /**
     *
     * @param start
     * @param end
     * @param authentication
     * @param httpRequest
     * @return
     * @throws java.lang.Exception
     */
    List<Z> list(@QueryParam(value = "start") int start, @QueryParam(value = "end") int end, @HeaderParam(value = "authentication") String authentication, @Context HttpServletRequest httpRequest) throws Exception;

    /**
     *
     * @param authentication
     * @param entity
     * @param httpRequest
     * @return
     * @throws java.lang.Exception
     */
    Z update(T entity, @HeaderParam(value = "authentication") String authentication, @Context HttpServletRequest httpRequest) throws Exception;

    void validateAuthentication( String authentication);

}
