/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.codemovers.scholar.engine.api.v1.permissions;

import com.codemovers.scholar.engine.api.v1.abstracts.AbstractService;
import com.codemovers.scholar.engine.api.v1.accounts.entities.AuthenticationResponse;
import com.codemovers.scholar.engine.api.v1.permissions.entities.PermissionsResponse;
import com.codemovers.scholar.engine.api.v1.permissions.entities._Permission;
import com.codemovers.scholar.engine.api.v1.roles.RolesService;
import com.codemovers.scholar.engine.db.controllers.PermissionsJpaController;
import com.codemovers.scholar.engine.db.controllers.RolesJpaController;
import com.codemovers.scholar.engine.db.entities.Permissions;
import com.codemovers.scholar.engine.db.entities.SchoolData;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author mover 5/19/2018
 */
public class PermissionsService extends AbstractService<_Permission, PermissionsResponse> {

    private final PermissionsJpaController controller;

    private static PermissionsService service = null;

    public PermissionsService() {
        controller = PermissionsJpaController.getInstance();
    }

    public static PermissionsService getInstance() {
        if (service == null) {
            service = new PermissionsService();
        }
        return service;
    }

    @Override
    public List<PermissionsResponse> list(SchoolData data, Integer ofset, Integer limit, AuthenticationResponse authentication) throws Exception {
        //todo: check for permisions to view this list 
        try {
            List<Permissions> permissionsList = controller.findPermissions(limit,ofset,  data);
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
        permissionsResponse.setCode(p.getCode());
        permissionsResponse.setName(p.getName());
        permissionsResponse.setCategory(p.getCategory());
        permissionsResponse.setId(p.getId().intValue());
        return permissionsResponse;

    }
}
