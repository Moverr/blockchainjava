/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.db.helper.exceptions;

import com.kodeinc.bcn.db.helper.Utilities;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 *
 * @author mover
 */
public class ValidationErrorException extends WebApplicationException {

    private static final Logger LOG = Logger.getLogger(InternalErrorException.class.getName());

    public ValidationErrorException() {
        super(Response.Status.BAD_REQUEST);
    }

    public ValidationErrorException(String message) {
        this(message, null);
    }

    public ValidationErrorException(String message, Throwable ex) {
        super(
                Response
                        .status(Response.Status.BAD_REQUEST)
                        .entity(new Message(message))
                        .type(MediaType.APPLICATION_JSON_TYPE)
                        .build()
        );
        LOG.log(Level.SEVERE, message, Response.Status.BAD_REQUEST);

        if (ex != null) {
            LOG.log(Level.SEVERE, Utilities.getStackTrace(ex));
        }
    }

}
