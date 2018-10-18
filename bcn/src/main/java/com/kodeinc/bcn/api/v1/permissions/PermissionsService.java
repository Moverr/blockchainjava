/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.api.v1.permissions;
 
import com.kodeinc.bcn.api.v1.abstracts.AbstractService;
import com.kodeinc.bcn.api.v1.accounts.entities.AuthenticationResponse;
import com.kodeinc.bcn.api.v1.permissions.entities.PermissionsResponse;
import com.kodeinc.bcn.api.v1.permissions.entities._Permission;
import java.security.Permissions;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author mover 5/19/2018
 */
public class PermissionsService extends AbstractService<_Permission, PermissionsResponse> {

//    private final PermissionsJpaController controller;

    private static PermissionsService service = null;

    public PermissionsService() {
//        controller = PermissionsJpaController.getInstance();
    }

    public static PermissionsService getInstance() {
        if (service == null) {
            service = new PermissionsService();
        }
        return service;
    }

    @Override
    public List<PermissionsResponse> list( Integer ofset, Integer limit, AuthenticationResponse authentication) throws Exception {
        //todo: check for permisions to view this list 
        try {
            List<Permissions> permissionsList =  null;
//                    controller.findPermissions(limit,ofset);
            List<PermissionsResponse> permissionsResponses = new ArrayList<>();
            permissionsList.forEach((permission) -> {
                permissionsResponses.add(getResponse(permission));
            });
            return permissionsResponses;
        } catch (Exception er) {

            er.printStackTrace();
            throw er;
        }
    }

    public PermissionsResponse getResponse(Permissions p) {
        PermissionsResponse permissionsResponse = new PermissionsResponse();
      
        return permissionsResponse;

    }
}
