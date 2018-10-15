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
public class InternalErrorException extends WebApplicationException {

    private static final Logger LOG = Logger.getLogger(InternalErrorException.class.getName());

    public InternalErrorException() {
        super(Response.Status.INTERNAL_SERVER_ERROR);
    }

    public InternalErrorException(String message) {
        this(message, null);
    }

    public InternalErrorException(String message, Throwable ex) {
        super(
                Response
                        .status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity(new Message(message))
                        .type(MediaType.APPLICATION_JSON_TYPE)
                        .build()
        );
        LOG.log(Level.SEVERE, message, Response.Status.INTERNAL_SERVER_ERROR);

        if (ex != null) {
            LOG.log(Level.SEVERE, Utilities.getStackTrace(ex));
        }
    }

}
