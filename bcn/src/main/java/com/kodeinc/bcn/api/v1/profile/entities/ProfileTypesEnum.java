/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.codemovers.scholar.engine.api.v1.profile.entities;

/**
 *
 * @author Mover
 */
public enum ProfileTypesEnum {
    INVALID(0, "INVALID", "invalid"),
    STUDENT(1, "STUDENT", "student"),
    USER(2, "USER", "user");

    private final Integer id;
    private final String code;
    private final String value;

    private ProfileTypesEnum(Integer id, String code, String value) {
        this.id = id;
        this.code = code;
        this.value = value;
    }

    public Integer getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getValue() {
        return value;
    }

    public static ProfileTypesEnum fromInt(Integer profileId) {

        ProfileTypesEnum profile_type = ProfileTypesEnum.INVALID;

        if (profileId != null) {
            switch (profileId) {
                case 1:
                    profile_type = ProfileTypesEnum.STUDENT;
                    break;
                case 2:
                    profile_type = ProfileTypesEnum.USER;
                    break;

                default:
                    profile_type = INVALID;
                    break;
            }
        }

        return profile_type;

    }

    public static ProfileTypesEnum fromString(String profile_name) {

        ProfileTypesEnum profile_type = ProfileTypesEnum.INVALID;

        if (profile_name != null) {
            switch (profile_name.toUpperCase()) {
                case "STUDENT":
                    profile_type = ProfileTypesEnum.STUDENT;
                    break;
                case "USER":
                    profile_type = ProfileTypesEnum.USER;
                    break;

                default:
                    profile_type = INVALID;
                    break;
            }
        }

        return profile_type;

    }

}
