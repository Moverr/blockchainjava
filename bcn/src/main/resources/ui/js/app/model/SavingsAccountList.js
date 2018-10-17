'use strict';

/* global Storage, DEV_NO_MODEL_INIT, clientList, groupList, AbstractList */

var SavingsAccountList = function () {
    AbstractList.call(this);

    this.rootPath = '/savingsaccount/v1d/';
    this.defaultPageSize = 250;
    this.newGetMtd = '/savingsaccount/v1d/allSavingsAccounts';
    this.entityName = 'savingsAccount';
    this.storagePrefix = this.entityName + '_';
};

SavingsAccountList.prototype = Object.create(AbstractList.prototype, {
    constructor: SavingsAccountList,

    sorter: {value: function (one, other) {
            return one.accountId > other.accountId;
        }, enumerable: true},

    addTransactions: {value: function (self, savingsAccount, callback, callbackArgs) {
            if (exists(savingsAccount.transactions)) {
                savingsAccount.transactionList = savingsAccount.transactions;
                AbstractList.prototype.put.call(this, self, savingsAccount, callback, callbackArgs);
            } else {
                var lastKnownTransactionId = exists(savingsAccount.transactionList) && savingsAccount.transactionList.length > 0 ?
                        savingsAccount.transactionList[savingsAccount.transactionList.length - 1].transactionId : 0;
                ajax(this.rootPath + savingsAccount.accountId + '/transactions/' + lastKnownTransactionId, 'GET', function (transactionList) {
                    (function (savingsAccount, transactionList) {
                        if (exists(transactionList)) {
                            savingsAccount.transactionList = transactionList;
                            AbstractList.prototype.put.call(this, self, savingsAccount, callback, callbackArgs);
                        } else {
                            console.log('could not load transactions of savings account  ' + savingsAccount.accountId);
                        }
                    })(savingsAccount, transactionList);
                });
            }

        }, enumerable: true},
    addLatestAccountProperties: {value: function (self, savingsAccount, callback, callbackArgs) {
            console.log('SavingsAccountHandler#addLatestAccountProperties : chck1');
            if (exists(savingsAccount))
            {
                console.log('SavingsAccountHandler#addLatestAccountProperties : chck2');
                ajax(this.rootPath + savingsAccount.accountId, 'GET', function (returnedSavingsAccount) {
                    (function (returnedSavingsAccount) {
                        if (exists(returnedSavingsAccount)) {
                            console.log('SavingsAccountHandler#addLatestAccountProperties : chck3');
                            savingsAccount = returnedSavingsAccount;
                            console.log('SavingsAccountHandler#addLatestAccountProperties : chck4');
                            AbstractList.prototype.put.call(this, self, savingsAccount, callback, callbackArgs);
                            console.log('SavingsAccountHandler#addLatestAccountProperties : chck5');
                        } else {
                            console.log('could not get savings account  ' + savingsAccount.accountId);
                        }
                    })(returnedSavingsAccount);
                });
            }
        }, enumerable: true},
    addOwner: {value: function (self, savingsAccount, callback, callbackArgs) {
            if ('INDIVIDUAL' === savingsAccount.savingsAccountType) {
// TODO: use private client list from parent prototype of AbstractList
                clientList.get(savingsAccount.awamoId, function (client) {
                    (function (savingsAccount, client) {
                        if (exists(client)) {
                            savingsAccount.clientName = client.fullname;
                            self.addTransactions(self, savingsAccount, callback, callbackArgs);
                        }
                    })(savingsAccount, client);
                });
            } else if ('GROUP' === savingsAccount.savingsAccountType) {
// TODO: use private group list from parent prototype of AbstractList
                groupList.get(savingsAccount.awamoId, function (group) {
                    (function (savingsAccount, group) {
                        if (exists(group)) {
                            savingsAccount.clientName = group.name;
                            self.addTransactions(self, savingsAccount, callback, callbackArgs);
                        }
                    })(savingsAccount, group);
                });
            }
        }, enumerable: true},
    put: {value: function (self, entity, callback, callbackArgs) {
            if (!exists(entity)) {
                entity = self;
                self = this;
            }
            this.addOwner(self, entity, callback, callbackArgs);
        }, enumerable: true},
    enrich: {value: function (object) {
            object.mainId = object.accountId;
            return object;
        }, enumerable: true},
    clientFilter: {value: function (awamoId) {
            return function (savingsAccount) {
                return savingsAccount.awamoId === awamoId;
            };
        }, enumerable: true},
    accountIdFilter: {value: function (accountId) {
            return function (savingsAccount) {
                return savingsAccount.accountId === accountId;
            };
        }, enumerable: true},
    getByAccountId: {value: function (accountId) {
            return this.entityArray.filter(this.accountIdFilter(accountId));
        }, enumerable: true},
    getByClient: {value: function (awamoId) {
            return this.entityArray.filter(this.clientFilter(awamoId));
        }, enumerable: true},
    getListByStatus: {value: function (status) {
            return this.getEntities().reduce(function (reducedObjectList, object) {
                if (object.status === status) {
                    reducedObjectList.push(object);
                }
                return reducedObjectList;
            }, []);
        }, enumerable: true},
    getCountByStatus: {value: function (status) {
            return this.getEntities().reduce(function (accumulator, object) {
                if (object.status === status) {
                    accumulator = accumulator + 1;
                }
                return accumulator;
            }, 0);
        }, enumerable: true}
});
