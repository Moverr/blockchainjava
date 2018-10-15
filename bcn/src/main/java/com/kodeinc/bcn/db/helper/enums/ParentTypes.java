/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.codemovers.scholar.engine.helper.enums;

/**
 *
 * @author Mover 6/7/2017
 */
public enum ParentTypes {
    PROFILE, SCHOOL, GUADIAN, SPONSOR, STUDENT, OTHERS, TEACHER;

    public static final ParentTypes fromString(String text) {
        ParentTypes returnValue = OTHERS;

        try {
            if (text != null) {
                returnValue = ParentTypes.valueOf(text.toUpperCase());
            }
        } catch (IllegalArgumentException e) {

            returnValue = OTHERS;
        }

        return returnValue;
    }

    public static final ParentTypes fromObject(Object text) {
        return fromString(text.toString());
    }

}
