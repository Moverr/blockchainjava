/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.codemovers.scholar.engine.api.v1.users;

import com.codemovers.scholar.engine.api.v1.accounts.entities.AuthenticationResponse;
import com.codemovers.scholar.engine.api.v1.users.entities.Login;
import com.codemovers.scholar.engine.api.v1.users.entities.UserResponse;
import com.codemovers.scholar.engine.api.v1.users.entities._User;
import com.codemovers.scholar.engine.db.entities.SchoolData;
import com.codemovers.scholar.engine.db.entities.Users;

/**
 *
 * @author mover
 */
public interface UserServiceInterface {

    /**
     *
     * @param username
     * @param Password
     * @return
     */
    String convertToBasicAuth(String username, String Password);

    /**
     *
     * @param data
     * @param entity
     * @return
     * @throws Exception
     */
    UserResponse create(SchoolData data, _User entity) throws Exception;

    /**
     *
     * @param schoolData
     * @param Id
     * @return
     * @throws Exception
     */
    UserResponse getById(SchoolData schoolData, Integer Id) throws Exception;

    //todo: retrieve authentication
    /**
     *
     * @param schoolData
     * @param login
     * @param password
     * @param logid
     * @return
     * @throws Exception
     */
    AuthenticationResponse login(SchoolData schoolData, Login login, String logid) throws Exception;

    //todo: validate authenticaton
    /**
     *
     * @param schoolData
     * @param authentication
     * @return
     * @throws Exception
     */
    AuthenticationResponse validateAuthentication(SchoolData schoolData, String authentication) throws Exception;

}
