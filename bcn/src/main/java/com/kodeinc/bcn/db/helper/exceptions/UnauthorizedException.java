package com.kodeinc.bcn.db.helper.exceptions;

import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 *
 * @author mover
 */
public class UnauthorizedException extends WebApplicationException {

    private static final Logger LOG = Logger.getLogger(UnauthorizedException.class.getName());

    public UnauthorizedException() {
        super(Response
                .status(Response.Status.UNAUTHORIZED)
                .entity(new Message("invalid security credentials"))
                .type(MediaType.APPLICATION_JSON_TYPE)
                .build());

    }

    public UnauthorizedException(String message) {
        this(message, message);
    }

    public UnauthorizedException(String message, String logMessage) {
        super(
                Response
                        .status(Response.Status.UNAUTHORIZED)
                        .entity(new Message(message))
                        .type(MediaType.APPLICATION_JSON_TYPE)
                        .build()
        );
        LOG.log(Level.WARNING, logMessage, Response.Status.BAD_REQUEST);
    }

}
