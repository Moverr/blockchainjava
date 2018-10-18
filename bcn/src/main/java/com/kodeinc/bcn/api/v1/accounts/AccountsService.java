/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.codemovers.scholar.engine.api.v1.accounts;

import com.codemovers.scholar.engine.api.v1.abstracts.AbstractService;
import com.codemovers.scholar.engine.api.v1.accounts.entities._Account;
import java.util.logging.Logger;

/**
 *
 * @author mover 11/18/2017
 */
public class AccountsService extends AbstractService<_Account, AccountResponse> {

    private static final Logger LOG = Logger.getLogger(AccountsService.class.getName());

    private static AccountsService service = null;

    public AccountsService() {

    }

    public static AccountsService getInstance() {
        if (service == null) {
            service = new AccountsService();
        }
        return service;
    }

}
