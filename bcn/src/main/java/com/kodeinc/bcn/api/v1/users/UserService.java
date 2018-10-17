/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.codemovers.scholar.engine.api.v1.users;

import com.codemovers.scholar.engine.api.v1.abstracts.AbstractService;
import com.codemovers.scholar.engine.api.v1.accounts.entities.AuthenticationResponse;
import com.codemovers.scholar.engine.api.v1.profile.ProfileService;
import com.codemovers.scholar.engine.api.v1.profile.entities.ProfileResponse;
import com.codemovers.scholar.engine.api.v1.users.entities.Login;
import com.codemovers.scholar.engine.api.v1.roles.RolesService;
import com.codemovers.scholar.engine.api.v1.permissions.entities.PermissionsResponse;
import com.codemovers.scholar.engine.api.v1.roles.entities.RoleResponse;
import com.codemovers.scholar.engine.api.v1.staff.StaffService;
import com.codemovers.scholar.engine.api.v1.users.entities.UserResponse;
import com.codemovers.scholar.engine.api.v1.users.entities._User;
import com.codemovers.scholar.engine.db.controllers.UserProfileJpaController;
import com.codemovers.scholar.engine.db.controllers.UserRoleJpaController;
import com.codemovers.scholar.engine.db.controllers.UsersJpaController;
import com.codemovers.scholar.engine.db.entities.Permissions;
import com.codemovers.scholar.engine.db.entities.Profile;
import com.codemovers.scholar.engine.db.entities.Roles;
import com.codemovers.scholar.engine.db.entities.SchoolData;
import com.codemovers.scholar.engine.db.entities.Staff;
import com.codemovers.scholar.engine.db.entities.UserProfile;
import com.codemovers.scholar.engine.db.entities.UserRole;
import com.codemovers.scholar.engine.db.entities.Users;
import static com.codemovers.scholar.engine.helper.Utilities.encryptPassword_md5;
import com.codemovers.scholar.engine.helper.enums.StatusEnum;
import com.codemovers.scholar.engine.helper.exceptions.BadRequestException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.Base64;
import java.util.Collection;

/**
 *
 * @author MOver 11/19/2017
 */
public class UserService extends AbstractService<_User, UserResponse> implements UserServiceInterface {

    private static final Logger LOG = Logger.getLogger(UserService.class.getName());

    private final UsersJpaController controller;

    private static UserService service = null;

    public UserService() {
        controller = UsersJpaController.getInstance();
    }

    public static UserService getInstance() {
        if (service == null) {
            service = new UserService();
        }
        return service;
    }

    @Override
    public UserResponse create(SchoolData data, _User entity, AuthenticationResponse authentication) throws BadRequestException, Exception {
        entity.validate();
        Users USER = getUser(entity);

        //todo: check to see if there is a user with this this username
        List<Users> list = controller.findByUserName(USER.getUsername(), data);
        if (!list.isEmpty()) {
            throw new BadRequestException("User with username " + USER.getUsername() + " exists in the system");
        }

        Profile profile = null;
        if (entity.getProfile() != null) {
            profile = ProfileService.getInstance().populateEntity(entity.getProfile());
            profile = ProfileService.getInstance().createProfile(profile, data);
        }

        if (entity.getStaff() != null) {
            Staff staff = StaffService.getInstance().getStaff(profile, entity.getStaff(), authentication);
            StaffService.getInstance().create(data, staff, authentication);
        }

        System.out.println("USERS" + entity.toString());

        USER = controller.create(USER, data);

        AttachUserProfile(USER, profile, data);
        AttachRoles(entity, data, USER);
        return populateResponse(USER, true);
    }

    //todo: retrieve authentication 
    /**
     *
     * @param schoolData
     * @param Id
     * @return
     * @throws Exception
     */
    @Override
    public UserResponse getById(SchoolData schoolData, Integer Id) throws Exception {

        Users _user = controller.findUser(Id, schoolData);
        if (_user == null) {
            throw new BadRequestException("USER DOES NOT EXIST");
        }
        return populateResponse(_user, true);

    }

    /**
     *
     * @param username
     * @param Password
     * @return
     */
    @Override
    public String convertToBasicAuth(String username, String Password) {
        String authString = username + ":" + Password;
        byte[] authEncBytes = Base64.getEncoder().encode(authString.getBytes());
        String authStringEnc = new String(authEncBytes);
        return ("Basic:" + authStringEnc);
    }

    //todo: validate authenticaton
    /**
     *
     * @param schoolData
     * @param authentication
     * @return
     * @throws Exception
     */
    @Override
    public AuthenticationResponse validateAuthentication(SchoolData schoolData, String authentication) throws BadRequestException, Exception {
        LOG.log(Level.INFO, "AUTHENTICATION STRING " + authentication);
        authentication = authentication.replace("Basic:", "");
        String usernamePassword = new String(Base64.getDecoder().decode(authentication));
        String[] parts = usernamePassword.split(":");

        if (parts.length != 2) {
            LOG.log(Level.WARNING, "{0} :: invalid security credentials");
            throw new BadRequestException("invalid security credentials");
        }

        Login login = getLogin(parts);

        return login(schoolData, login, "LOGID");

    }

    /**
     *
     * @param tenantData
     * @param login
     * @param logId
     * @return
     * @throws Exception
     */
    @Override
    public AuthenticationResponse login(SchoolData tenantData, Login login, String logId) throws BadRequestException, Exception {

        AuthenticationResponse response = new AuthenticationResponse();

        LOG.log(Level.INFO, "School Name {0} ", tenantData.getName());
        login.validate();
        try {
            LOG.log(Level.INFO, " School User Login ");
            String authentication = null;

            {
                if (login.getPassword() != null && login.getUsername() != null) {
                    // todo : encrypt password

                    String username = login.getUsername();
                    String password = login.getPassword();

                    password = encryptPassword_md5(password);

                    Users users = controller.login(username, password, tenantData);

                    if (users == null) {
                        throw new BadRequestException("INVALID USERNAME AND OR PASSWORD ");
                    } else {
                        // createProfile response ::
                        authentication = convertToBasicAuth(login.getUsername(), login.getPassword());

                        Set<Roles> roleslist = users.getUserRoles();

                        List<PermissionsResponse> permissionsResponses = new ArrayList<>();

                        Collection<UserRole> arolesList = null;
                        //users.getUserRoleCollection();

                        if (arolesList == null) {
                            LOG.log(Level.INFO, " RESPONSE S  EMPTY ");
                        }

                        for (Roles r : roleslist) {

//                            Set<Permissions> _permissionset = r.getPermissions();
//                            PermissionsResponse permissionsResponse = new PermissionsResponse();
//                            permissionsResponse.setName(r.getName());
//                            permissionsResponses.add(permissionsResponse);
                        }

                        response.setId(users.getId().intValue());
                        response.setAuthentication(authentication);
                        response.setPermissions(permissionsResponses);
                        response.setIsLoggedIn(true);

                    }
                    //todo : check username and password
                } else {
                    throw new BadRequestException(" USERNAME AND OR PASSWORD IS MANDATORY  ");
                }

            }

        } catch (BadRequestException er) {
            throw er;
        }

        return response;
    }

    @Override
    public List<UserResponse> list(SchoolData data, Integer ofset, Integer limit, AuthenticationResponse authentication) throws Exception {

        List<Users> _users = controller.findUsers(ofset, limit, data);
        List<UserResponse> userResponses = new ArrayList<>();
        if (_users != null) {
            for (Users users : _users) {
                UserResponse userResponse = populateResponse(users, false);
                userResponses.add(userResponse);
            }
        }

        return userResponses;
    }

    /**
     *
     * @param tenantData
     * @param account_id
     */
    public void deactivate(SchoolData schoolData, Integer account_id) throws Exception {
        Users _user = controller.findUser(account_id, schoolData);
        if (_user == null) {
            throw new BadRequestException("USER DOES NOT EXIST");

        }
        _user.setStatus("DISABLED");

    }

    public void activate(SchoolData schoolData, Integer account_id) throws Exception {
        Users _user = controller.findUser(account_id, schoolData);
        if (_user == null) {
            throw new BadRequestException("USER DOES NOT EXIST");

        }
        _user.setStatus("ACTIVE");

    }

    public void AttachRoles(_User entity, SchoolData data, Users USER) throws Exception {
        UserRole userRole = new UserRole();
        String[] rs = entity.getRoles();
        List<Roles> roleses = getRoles(rs, data);
        Roles[] _roles = new Roles[roleses.size()];

        userRole.setUser(USER);
        if (roleses != null) {
            for (Roles r : roleses) {
                userRole.setRole(r);
                UserRoleJpaController.getInstance().create(userRole, data);
            }
        }
    }

    public void AttachUserProfile(Users USER, Profile profile, SchoolData data) {
        UserProfile userProfile = new UserProfile();
        userProfile.setUser(USER);
        userProfile.setProfile(profile);

        userProfile = UserProfileJpaController.getInstance().create(userProfile, data);
    }

    public Users getUser(_User entity) throws Exception {
        Users USER = new Users();
        USER.setUsername(entity.getUsername());
        String encryptedPassword = encryptPassword_md5(entity.getPassword());
        USER.setPassword(encryptedPassword);
        System.out.println("USER : " + USER.getPassword());
        USER.setStatus(StatusEnum.ACTIVE.toString());

        //    USER.setUserRoles(roles);
        USER.setDateCreated(new Date());

        return USER;
    }

    public List<Roles> getRoles(String[] rs, SchoolData data) throws BadRequestException, Exception {
        List<Roles> roleses = new ArrayList<>();
        if (rs != null) {
            for (String rolename : rs) {
                Roles _role = RolesService.getInstance().getRoleByName(data, rolename);
                if (_role != null) {
                    roleses.add(_role);
                }
            }
        }
        if (roleses.isEmpty()) {
            throw new BadRequestException(" Roles do not exist");
        }
        return roleses;
    }

    public Login getLogin(String[] parts) {
        String username = parts[0];
        String password = parts[1];
        Login login = new Login();
        login.setUsername(username);
        login.setPassword(password);
        return login;
    }

    private UserResponse populateResponse(Users entity, boolean extended) throws Exception {

        UserResponse response = new UserResponse();
        response.setId(entity.getId().intValue());
        response.setUsername(entity.getUsername());
        if (entity.getDateCreated() != null) {
            response.setDateCreated(entity.getDateCreated().getTime());
        }
        response.setStatus(entity.getStatus());
        Set<Roles> roleSet = entity.getUserRoles();
        List<RoleResponse> roleResponses = new ArrayList<>();
        response.setRoles(roleResponses);

        if (roleSet != null) {
            for (Roles role : roleSet) {
                roleResponses.add(RolesService.getInstance().populateResponse(role, false));
            }
        }
        response.setRoles(roleResponses);

        Set<Profile> userProfiles = entity.getUserProfiles();

        if (userProfiles != null) {

            for (Profile profile : userProfiles) {
                Profile _profile = profile;
                ProfileResponse personResponse = ProfileService.getInstance().populateResponse(_profile);
                response.setProfile(personResponse);
                break;
            }

        }

        if (entity.getStaff() != null) {
            response.setStaff(StaffService.getInstance().populateResponse(entity.getStaff()));
        }

        return response;
    }

    public RoleResponse[] getRolesResponse(Set<Roles> roleSet, boolean extended) {
        //PersonResponse
        RoleResponse[] roleResponses = null;
        if (roleSet != null) {
            String[] rsArray = new String[roleSet.size()];

            List<RoleResponse> rrs = new ArrayList<>();
            List<RoleResponse> rsList = new ArrayList<>();
            roleSet.forEach((_role) -> {
                rsList.add(RolesService.getInstance().populateResponse(_role, extended));
            });

            roleResponses = new RoleResponse[rsList.size()];

        }

        return roleResponses;
    }

}
