/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.codemovers.scholar.engine.api.v1.profile;

import com.codemovers.scholar.engine.api.v1.abstracts.AbstractService;
import com.codemovers.scholar.engine.api.v1.accounts.entities.AuthenticationResponse;
import com.codemovers.scholar.engine.api.v1.profile.entities.ProfileResponse;
import com.codemovers.scholar.engine.api.v1.profile.entities.Profiles;
import com.codemovers.scholar.engine.db.controllers.ProfileJpaController;
import com.codemovers.scholar.engine.db.entities.Profile;
import com.codemovers.scholar.engine.db.entities.SchoolData;
import com.codemovers.scholar.engine.db.entities.Users;
import com.codemovers.scholar.engine.helper.Utilities;
import com.codemovers.scholar.engine.helper.enums.StatusEnum;
import com.codemovers.scholar.engine.helper.exceptions.BadRequestException;
import java.util.Date;
import java.util.logging.Logger;

/**
 * mm/dd/yyyy
 *
 * @author Mover 12/14/2017
 */
public class ProfileService extends AbstractService<Profiles, ProfileResponse> {

    private static final Logger LOG = Logger.getLogger(ProfileService.class.getName());

    private final ProfileJpaController controller;

    private static ProfileService service = null;

    public ProfileService() {
        controller = ProfileJpaController.getInstance();
    }

    public static ProfileService getInstance() {
        if (service == null) {
            service = new ProfileService();
        }
        return service;
    }

    /**
     *
     * @param data
     * @param entity
     * @param authentication
     * @return
     * @throws Exception
     */
    @Override
    public ProfileResponse create(SchoolData data, Profiles entity, AuthenticationResponse authentication) throws Exception {
        try {
            entity.validate();
            entity.setAuthorId(authentication.getId());
            Profile profile = ProfileService.this.populateEntity(entity);
            profile = createProfile(profile, data);

            return populateResponse(profile);
        } catch (Exception er) {
            throw new BadRequestException(er.getMessage());
        }
    }

    @Override
    public ProfileResponse update(SchoolData data, Profiles entity, AuthenticationResponse authentication) throws Exception {
        try {
            entity.validate();
            if (entity.getId() == null) {
                throw new BadRequestException("UNIQUE ID MISSING");
            }
            Profile profile = getProfile(entity.getId(), data);
            ProfileService.this.populateEntity(entity, profile);

            profile = updateProfile(profile, data);

            return populateResponse(profile);
        } catch (Exception er) {
            throw new BadRequestException(er.getMessage());
        }
    }

    public Profile getProfile(Integer id, SchoolData data) {
        Profile profile = controller.findProfile(id, data);
        return profile;
    }

    public Profile updateProfile(Profile profile, SchoolData data) throws Exception {
        profile = controller.edit(profile, data);
        return profile;
    }

    /**
     *
     * @param profile
     * @param data
     * @return
     */
    public Profile createProfile(Profile profile, SchoolData data) {
        profile = controller.create(profile, data);
        return profile;
    }

    /**
     *
     * @param entity
     * @return
     */
    public Profile populateEntity(Profiles entity) {
        Profile profile = new Profile();
        if (entity.getFirstName() != null) {
            profile.setFirstName(entity.getFirstName());
        }
        if (entity.getMiddleName() != null) {
            profile.setMiddleName(entity.getMiddleName());
        }
        if (entity.getLastName() != null) {
            profile.setLastName(entity.getLastName());
        }
        if (entity.getPrefix() != null) {
            profile.setPrefix(entity.getPrefix());
        }
        if (entity.getSex() != null) {
            profile.setSex(entity.getSex());
        }

        if (entity.getDateOfBirth() != null) {
            profile.setDateOfBirth(Utilities.getDateInUTC(entity.getDateOfBirth()));
        }

        if (entity.getImage() != null) {
            profile.setImage(entity.getImage());
        }
        if (entity.getProfileType() != null) {
            profile.setParentType(entity.getProfileType().toString());
        }

        profile.setStatus(StatusEnum.ACTIVE.toString());
        if (entity.getStatus() != null) {
            profile.setStatus(entity.getStatus().toString());
        }
        profile.setDateCreated(new Date());
        if (entity.getDateCreated() != null) {
            profile.setDateCreated(Utilities.getDateInUTC(entity.getDateCreated()));
        }
        if (entity.getAuthorId() != null) {
            profile.setAuthor(new Users(entity.getAuthorId().longValue()));
        }

        return profile;
    }

    /**
     *
     * @param entity
     * @param profile
     */
    public void populateEntity(Profiles entity, Profile profile) {
        if (entity.getFirstName() != null && !entity.getFirstName().equalsIgnoreCase(profile.getFirstName())) {
            profile.setFirstName(entity.getFirstName());
        }

        if (entity.getMiddleName() != null && !entity.getMiddleName().equalsIgnoreCase(profile.getMiddleName())) {
            profile.setMiddleName(entity.getMiddleName());
        }

        if (entity.getLastName() != null && !entity.getLastName().equalsIgnoreCase(profile.getLastName())) {
            profile.setLastName(entity.getLastName());
        }

        if (entity.getSex() != null && !entity.getSex().equalsIgnoreCase(profile.getSex())) {
            profile.setSex(entity.getSex());
        }

        if (entity.getPrefix() != null && !entity.getPrefix().equalsIgnoreCase(profile.getPrefix())) {
            profile.setPrefix(entity.getPrefix());
        }

        if (entity.getDateOfBirth() != null && entity.getDateOfBirth() != profile.getDateOfBirth().getTime()) {
            profile.setDateOfBirth(new Date(entity.getDateOfBirth()));
        }
    }

    /**
     *
     * @param entity
     * @return
     */
    public Profile populateEntity(ProfileResponse entity) {
        Profile profile = new Profile();
        profile.setId(entity.getId().longValue());
        profile.setFirstName(entity.getFirstName());
        profile.setLastName(entity.getLastName());
        profile.setMiddleName(entity.getMiddleName());
        profile.setDateCreated(new Date(entity.getDateCreated()));
        profile.setDateOfBirth(new Date(entity.getDateOfBirth()));
        return profile;
    }

    /**
     *
     * @param entity
     * @return
     */
    public ProfileResponse populateResponse(Profile entity) {
        ProfileResponse pr = populateBasicResponse(entity);
        if (entity.getDateOfBirth() != null) {
            pr.setDateOfBirth(entity.getDateOfBirth().getTime());
        }
        if (entity.getDateCreated() != null) {
            pr.setDateCreated(entity.getDateCreated().getTime());
        }
        pr.setPrefix(entity.getPrefix());
        pr.setSex(entity.getSex());
        pr.setStatus(entity.getStatus());

        return pr;
    }

    public ProfileResponse populateBasicResponse(Profile entity) {
        ProfileResponse pr = new ProfileResponse();
        pr.setId(entity.getId().intValue());
        pr.setFirstName(entity.getFirstName());
        pr.setLastName(entity.getLastName());
        pr.setMiddleName(entity.getMiddleName());
        return pr;
    }

}
