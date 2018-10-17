/* global DEV_NO_MODEL_INIT, eventtype, Storage */

// TODO: add all lists as internal variable such that each list has access to
//       all others without relying on global variables
// TODO: some better handling for eventtype? class constant?
var totalListCounts = 0;
var totalListLeft = 0;
var percentageLoaded = 0;

var totalLists = 0;
var progressLoaded = false;
var failedRequests = [];
var retries = 0;
function AbstractList() {
    this.mainIds = [];
    this.entityMap = {};
    this.entityArray = [];
    this.dataModelChangedEventListenerCallbacks = [];
    this.entityChangedEventListenerCallbacks = [];
    this.callbacks = {};
    this.reloadIds = [];
    this.reloadInProgress = false;
    this.totalServerCount = 0;
    this.tempTotalServerCount = 0;
    this.syncInProgress = false;
}

AbstractList.prototype = {
    rootPath: null,
    alternativeGetAllLoansUrl: null,
    defaultPageSize: null,
    storagePrefix: null,
    constructor: AbstractList,
    initLocal: function (callbackList) {
        this.loadAllFromLocal(callbackList);
    },
    init: function (callbackList) {
        progressLoaded = false;
        totalLists = callbackList.length + 1;
        // the callbackList gets destroyed recursively, so clone it first
        var callbackListClone = [];
        callbackList.forEach(function (callback) {
            callbackListClone.push(callback);
        });

        // then fill GUI from local storage with cloned list
        this.initLocal(callbackListClone);

        // then synchronize with server with untouched original list
        if (!this.updated) {
            this.updated = true;
            showProgress(false, true, 0, self);
            this.loadAllAtOnce(callbackList);
            //this.loadAll(callbackList); // load once immediately
            var self = this;
            //console.log(this);
            this.reloadTimer = window.setInterval(function () {
                //self.loadAll();
                //self.loadAllAtOnce();
            }, 1000 * 60 * 60); // every 30 minutes
        }
    },
    reload: function () {
        progressLoaded = false;
        this.syncInProgress = true;
        this.loadAllAtOnce();
    },
    get: function (id, callback) {
        if (!exists(this.entityMap[id])) {
            callback(this.entityMap[id]);
        } else {
            callback(this.entityMap[id]);
        }
    },
    getTotalCount: function () {
        return this.mainIds.length;
    },
    getMainIds: function () {
        return this.mainIds;
    },
    getEntities: function () {
        return this.entityArray;
    },
    hideLoading: function () {
        hideLoader();
    },
    showLoading: function () {
        showLoader();
    },
    addDataModelChangedEventListenerCallback: function (dataModelChangedEventListenerCallback) {
        this.dataModelChangedEventListenerCallbacks.push(dataModelChangedEventListenerCallback);
    },
    removeDataModelChangedEventListenerCallback: function (dataModelChangedEventListenerCallback) {
        var index = this.dataModelChangedEventListenerCallbacks.indexOf(dataModelChangedEventListenerCallback);
        if (index > -1) {
            this.dataModelChangedEventListenerCallbacks.splice(index, 1);
        }
    },
    addEntityChangedEventListenerCallback: function (entityChangedEventListenerCallback) {
        this.entityChangedEventListenerCallbacks.push(entityChangedEventListenerCallback);
    },
    removeEntityChangedEventListenerCallback: function (entityChangedEventListenerCallback) {
        var index = this.entityChangedEventListenerCallbacks.indexOf(entityChangedEventListenerCallback);
        if (index > -1) {
            this.entityChangedEventListenerCallbacks.splice(index, 1);
        }
    },
    store: function (entity) {
        entity = this.enrich(entity);
        if (!exists(entity)) {
            return;
        }

        var type = eventtype.CREATE;
        var len = this.entityArray.length;
        var index = 0;
        for (; index < len; index++) {
            if (this.entityArray[index].mainId === entity.mainId) {
                if (this.equals(this.entityArray[index], entity)) {
                    type = eventtype.UNCHANGED;
                } else {
                    type = eventtype.UPDATE;
                }
                break;
            }
        }

        if (type !== eventtype.UNCHANGED) {
            if (!this.mainIds.includes(entity.mainId)) {
                this.mainIds.push(entity.mainId);
            }
            this.entityMap[entity.mainId] = entity;
            this.entityArray[index] = entity;
            if (typeof (Storage) !== "undefined") {
                try {
                    localStorage.setItem(this.storagePrefix + entity.mainId, JSON.stringify(entity));
                } catch (err) {
                    console.log(JSON.stringify(err));
                }
            }
            this.notifyEntityChangedListener(entity, type);
            this.notifyDataModelChangedListener();
            ActionRequiredHandler.prototype._dataModelChanged()
        }
    },
    loadOne: function (id, callback) { // should not be needed, see comment on branch in get method
        this.callbacks[id] = [callback];
        var self = this;
        ajax(this.rootPath + id, 'GET', function (entity) {
            hideLoader();
            console.log(entity);
            self.put(self, entity);
            try {
                var callback = self.callbacks[id].pop();
                while (exists(callback)) {
                    callback(entity);
                    callback = self.callbacks[id].pop();
                }
            } catch (err) {
                // noop
                console.log(err);
            }
            delete self.callbacks[id];
        }, null, undefined, function (err) {
            hideLoader();
            if (err.status === 0) {
                //TO DO, CREATE A RETRY STRATEGY
                console.log('Network lost');
                showAlertMessage('Network Lost , please reload your page and try again', AlertTypes.warning);
            }
            console.error(err);
            manageErrors(err);
        }, function () {
            hideLoader();
            //callback(null);
        });
    },
    loadAllFromLocal: function (callbackList) {
        if (typeof (Storage) !== "undefined") {
            for (var i = 0, len = localStorage.length; i < len; ++i) {
                var key = localStorage.key(i);
                if (key.startsWith(this.storagePrefix)) {
                    var value = localStorage.getItem(key);
                    var entity = JSON.parse(value);
                    this.store(entity);
                }
            }
            if (Array.isArray(callbackList)) {
                var nextInitializer = callbackList.shift();

                if (exists(nextInitializer)) {
                    nextInitializer.initLocal(callbackList);
                }
            }
        }
    },
    loadAll: function (callbackList) {

        // TODO: can I use this.mainIds for that?
        var knownMainIds = [];

        // fill list from local storage if possible
        if (typeof (Storage) !== "undefined") {
            for (var i = 0, len = localStorage.length; i < len; ++i) {
                var key = localStorage.key(i);
                if (key.startsWith(this.storagePrefix)) {
                    var value = localStorage.getItem(key);
                    var entity = JSON.parse(value);
                    knownMainIds.push(entity.mainId);
                    this.store(entity);
                }
            }
        }

        // get new or changed ones
        var self = this;
        ajax(this.rootPath + 'mainIds/0' + '?limit=' + pageSize || -1, 'GET', function (ids) {
            console.log("loaded main ids for " + self.entityName + " are " + ids.length)
            knownMainIds.forEach(function (mainId) {
                if (!ids.includes(mainId)) {
                    // delete entity from local browser storage
                    if (typeof (Storage) !== "undefined") {
                        localStorage.removeItem(self.storagePrefix + mainId);
                    }

                    // delete from class internal storages
                    self.mainIds.remove(mainId);
                    delete self.entityMap[mainId];
                    self.entityArray = self.entityArray.filter(function (entity) {
                        return entity.mainId !== mainId;
                    });

                    // notify listeners of deletion
                    self.notifyDataModelChangedListener();
                    self.notifyEntityChangedListener(mainId, eventtype.DELETE);
                }
            });

            // sort descending to get the newest ones first
            ids.sort(function (one, other) {
                return parseInt(one) > parseInt(other);
            }).reverse();

            self.reloadIds = ids;
            if (!self.reloadInProgress) {
                self.loadNext(self, callbackList);
            }
        });
    },
    loadNext: function (self, callbackList) {
        console.log("inside loadNext ")
        if (!exists(self.reloadIds)) {
            console.log("self.reloadIds not exists ");
            return;
        }

        var id = self.reloadIds.shift();

        if (exists(id)) {
            self.reloadInProgress = true;
            var path = self.rootPath + id;
            if (self.entityName === 'client') {
                path = self.rootPath + "get/full/" + id;
            }
            console.log(self.entityName);
            console.log(path);
            ajax(path, 'GET', function (entity) {
                self.put(self, entity, self.loadNext, callbackList);
            }, undefined, undefined, function (err) {
                if (err.status === 0) {
                    //TO DO, CREATE A RETRY STRATEGY
                    console.log('Network lost');
                }
                console.error(err);
            }, function () {
                console.log('using complete to calload next');
                self.loadNext(self, callbackList);
            });
            self.loadNext(self, callbackList);
        } else {
            self.reloadInProgress = false;
            if (Array.isArray(callbackList)) {
                var nextInitializer = callbackList.shift();

                if (exists(nextInitializer)) {
                    nextInitializer.init(callbackList);
                }
            }
        }
    },
    loadNextList: function (self, callbackList) {
//        if (!exists(self.reloadIds)) {
//            return;
//        }
//        
//        var id = self.reloadIds.shift();

//        if (exists(id)) {
//            self.reloadInProgress = true;
//            ajax(self.rootPath + id, 'GET', function(entity) {
//                self.put(self, entity, self.loadNext, callbackList);
//            }, undefined, undefined, function() { self.loadNext(self, callbackList); });
//        } else
        {

            if (Array.isArray(callbackList)) {
                var nextInitializer = callbackList.shift();

                if (exists(nextInitializer)) {
                    self.reloadInProgress = true;
                    nextInitializer.loadAllAtOnce(callbackList);
                } else {
                    $body = $("body");
                    $body.removeClass("loading");
                }
            }
        }
    },
    getserverTotals: function (self, callbackList, callbackFn) {
        self.totalServerCount = 0;
        if (self.totalServerCount === 0) {
            ajax(self.rootPath + 'count', 'GET', function (totalServerCount) {
                var logMessageHeader = "Loading Totals";
                var logMessage = [];
                if (totalServerCount >= 0) {
                    self.tempTotalServerCount = totalServerCount;
                    self.totalServerCount = totalServerCount;
                    totalListCounts += totalServerCount;
                    totalListLeft = totalListCounts;
                    logMessage.push("Added " + self.totalServerCount + " " + self.entityName + "s to total");
                } else {
                    console.error("Loading Totals\nError, the server returned a negative total: " + totalServerCount + "!!!");
                }

                logMessage.push("The total entities to load are: " + totalListCounts);
                logMessage.push("The pending entities are: " + totalListLeft);
                logColor = "blue";
                logFancyMessage(logMessageHeader, logMessage, logColor);

                callbackFn(self, callbackList);
            }, undefined, undefined, function (err) {
                console.log(err);
            }, function () {
            });
        } else {
            callbackFn(self, callbackList);
        }
    },
    loadAllAtOnce: function (callbackList, callbackFn) {
        var knownMainIds = [];
        var ids = [];
        if (typeof (Storage) !== "undefined") {
            for (var i = 0, len = localStorage.length; i < len; ++i) {
                var key = localStorage.key(i);
                if (key.startsWith(this.storagePrefix)) {
                    var value = localStorage.getItem(key);
                    var entity = JSON.parse(value);
                    knownMainIds.push(entity.mainId);
                    this.store(entity);
                }
            }
        }
        var self = this;
        statusbar('Synchronizing ' + self.entityName + 's, ' + ' please wait...');
        var findPagesToFetch = function (serverCount) {
            var pages = [];
            if (self.entityName === 'account') {
                pages.push(self.totalServerCount);
            } else {
                var selfPageSize = self.defaultPageSize === null ? pageSize : self.defaultPageSize;
                var numOfpages = Math.floor(serverCount / selfPageSize);
                var remainingItems = serverCount % selfPageSize;
                for (var i = 0; i < numOfpages; i++) {
                    pages.push(selfPageSize);
                }
                if (remainingItems > 0) {
                    pages.push(remainingItems);
                }
            }
            return pages;
        }
        var pagesToFetch = findPagesToFetch(self.totalServerCount);
        if (pagesToFetch.length === 0) {
            percentageLoaded = parseFloat((((totalListCounts - totalListLeft) / totalListCounts) * 100).toFixed(1));
            if (percentageLoaded === 0) {
                statusbar("Sorry, nothing to load from the server");
                percentageLoaded = 100.0;
            }
            self.checkComplete(self);
            if (totalListLeft > 0) {
                self.loadNextList(self, callbackList);
            }
        }
        pagesToFetch.forEach(function (consideredPageSize, index) {
            var selfPageSize = self.defaultPageSize === null ? pageSize : self.defaultPageSize;
            var offset = index * selfPageSize;
            var url = "";
            if (self.alternativeGetAllLoansUrl !== null)
            {
                url = self.alternativeGetAllLoansUrl + '?awamoId=0&limit=' + (consideredPageSize + 1) + '&offset=' + offset;
            } else
            {
                url = self.rootPath + 'all?awamoId=0&limit=' + consideredPageSize + '&offset=' + offset;
            }
            var xhr = ajax(url, 'GET', function (entities, statusText, XMLHttpRequest) {
                if (exists(entities)) {
                    var logMessageHeader = self.entityName;
                    var logMessage = [];
                    logMessage.push(entities.length + " " + self.entityName + "s returned from the server.");
                    var serverReturnDifference = consideredPageSize - entities.length;
                    if (self.entityName === 'loan')
                    {
                        console.log("loan entities");
                        console.log(entities);
                    }
                    entities.forEach(function (entity) {
                        if (exists(entity)) {
                            if (self.entityName === 'loan')
                            {
                                console.log("startingloan ...........................................................");
                                console.log("loan entity b4 push");
                                console.log(entity);
                            }
                            ids.push(entity.mainId);
                            if (self.entityName === 'loan')
                            {
                                console.log("loan entity b4 populate");
                                console.log(entity);
                            }
                            self.populate(self, entity, null, null);
                        }
                    });
                    var statusMessage = "";
                    if (self.tempTotalServerCount > 0) {
                        statusMessage = self.tempTotalServerCount + " " + self.entityName + "s pending to load.";
                        var logColor = "yellow";
                    } else {
                        statusMessage = "All " + self.entityName + "s loaded successfully!";
                        var logColor = "green";
                    }
                    logMessage.push(statusMessage);
                    statusbar('Synchronizing ' + self.entityName + 's, ' + statusMessage);
                    console.log("The server return differences: ", serverReturnDifference);
                    logFancyMessage(logMessageHeader, logMessage, logColor);
                    if (serverReturnDifference !== 0) {
                        logFancyMessage(self.entityName, ["The values returned by the server are out of sync, we requested {"
                                    + consideredPageSize + "} and {" + entities.length + "} were returned"],
                                "red");
                        totalListLeft -= serverReturnDifference;
                    }
                    self.checkComplete(self);
                }
            }, undefined, undefined, function (XMLHttpRequest, statusText, err) {
                failedRequests.push({list: self, failedUrl: XMLHttpRequest.uniqueUrl, failedItems: consideredPageSize});
                var failedEntities = parseInt(XMLHttpRequest.pageSize || consideredPageSize);
                var percentageLoadedBeforeFail = parseFloat((((totalListCounts - totalListLeft) / totalListCounts) * 100).toFixed(1));
                totalListLeft = totalListLeft - failedEntities;
                percentageLoaded = parseFloat((((totalListCounts - totalListLeft) / totalListCounts) * 100).toFixed(1));
                var percentageFailed = parseFloat(((failedEntities / totalListCounts) * 100).toFixed(1));
                self.checkComplete(self);
                showProgressFailure(percentageLoadedBeforeFail, percentageFailed);
                var logMessageHeader = self.entityName;
                var logMessage = [];
                logMessage.push(XMLHttpRequest.pageSize + " " + self.entityName + "s failed to return from the server.");
                var logColor = "orange";
                logFancyMessage(logMessageHeader, logMessage, logColor);
            }, function (XMLHttpRequest, statusText, XMLHttpRequestOrError) {
                if (exists(callbackFn)) {
                    callbackFn();
                }
                var logMessageHeader = "Loading Totals";
                var logMessage = [];
                logMessage.push("Subtracted " + consideredPageSize + " " + self.entityName + "s from total");
                logMessage.push("The total entities to load are: " + totalListCounts);
                logMessage.push("The pending entities are: " + totalListLeft);
                var logColor = "teal";
                if (totalListLeft == 0) {
                    logMessage.push("Completed Successfully");
                    logColor = "lime";
                }
                logFancyMessage(logMessageHeader, logMessage, logColor);
                if (!self.reloadInProgress) {
                    self.reloadInProgress = false;
                    self.loadNextList(self, callbackList);
                }
            });
            xhr.pageSize = consideredPageSize;
            xhr.entityName = self.entityName;
            xhr.uniqueUrl = url;
            xhr.offset = offset;
            var logMessageHeader = self.entityName;
            var logMessage = [];
            logMessage.push("Request sent to server for {" + consideredPageSize + "} " + self.entityName + "s");
            logFancyMessage(logMessageHeader, logMessage, "yellow");
        });
        // if (!self.reloadInProgress) {
        // 	self.reloadInProgress = false;
        // 	self.loadNextList(self, callbackList);
        // }
    },
    checkComplete: function (self) {
        if (percentageLoaded === 100.0) {
            self.syncInProgress = false;
            hideLoader();

            if (failedRequests.length > 0) {
                var totalFailedItems = 0;
                failedRequests.forEach(function (request) {
                    totalFailedItems += request.failedItems;
                });

                var confirmDialogHeader = "";
                var confirmDialogBody = "";
                var confirmDialogNegativeText = "";

                if (retries < 3) {
                    confirmDialogHeader = totalFailedItems + " items didn't load successfully from the server.";
                    confirmDialogBody = "Do you want to retry loading these items?";
                    confirmDialogNegativeText = "No";
                    var confirmDialogPositiveText = "Yes";
                    showDialogPopupWithHandlers(confirmDialogHeader,
                            confirmDialogBody,
                            confirmDialogPositiveText,
                            function () {
                                self.retry(totalFailedItems);
                            },
                            confirmDialogNegativeText,
                            function () {
                                // We do nothing
                            });
                } else {
                    confirmDialogHeader = "You seem to have retried 3 times";
                    confirmDialogBody = "Please use the Sync button later to synchronize your activities";
                    confirmDialogNegativeText = "Ok";
                    showDialogPopupWithHandlers(confirmDialogHeader,
                            confirmDialogBody,
                            confirmDialogPositiveText,
                            function () {
                                // They tried 3 times
                            },
                            confirmDialogNegativeText,
                            function () {
                                // We do nothing
                            }, true);
                }
            } else if (totalListCounts > 0) {
                statusbar("Completed Successfully");
            }
        } else {
            showProgress(false, false, percentageLoaded, self);
        }
    },
    retry: function (itemsToFetch) {
        totalListCounts = itemsToFetch;
        totalListLeft = itemsToFetch;
        showProgress(false, true, 0, self);
        failedRequests.forEach(function (request, i) {
            var xhr = ajax(request.failedUrl, 'GET', function (entities, statusText, XMLHttpRequest) {
                failedRequests.splice(i, 1);
                if (exists(entities)) {
                    entities.forEach(function (entity) {
                        if (exists(entity)) {
                            request.list.populate(request.list, entity, null, null);
                        }
                    });
                }
            }, undefined, undefined, function (XMLHttpRequest, statusText, err) {
                var failedEntities = request.failedItems;
                var percentageLoadedBeforeFail = parseFloat((((totalListCounts - totalListLeft) / totalListCounts) * 100).toFixed(1));
                totalListLeft = totalListLeft - failedEntities;
                percentageLoaded = parseFloat((((totalListCounts - totalListLeft) / totalListCounts) * 100).toFixed(1));
                var percentageFailed = parseFloat(((failedEntities / totalListCounts) * 100).toFixed(1));
                request.list.checkComplete(request.list);
                showProgressFailure(percentageLoadedBeforeFail, percentageFailed);
            }, function (XMLHttpRequest, statusText, XMLHttpRequestOrError) {
                // Do Nothing
            });
        });
        retries++;
    },
    populate: function (self, entity, callback, callbackArgs) {
        if (self.entityName === 'loan')
        {
            console.log('populate loan');
            console.log(entity);
            if ('INDIVIDUAL' === entity.loanType) {
                // TODO: use private client list from parent prototype of AbstractList
                clientList.get(entity.awamoId, function (client) {
                    (function (entity, client) {
                        if (exists(client)) {
                            entity.client = client;
                            entity.ownerName = client.fullname;
                        }
                    })(entity, client);
                });
            } else if ('GROUP' === entity.loanType) {
                // TODO: use private group list from parent prototype of AbstractList
                groupList.get(entity.awamoId, function (group) {
                    (function (entity, group) {
                        if (exists(group)) {
                            entity.group = group;
                            entity.ownerName = group.name;
                        }
                    })(entity, group);
                });
            }
            AbstractList.prototype.put(self, entity, callback, callbackArgs);
            self.tempTotalServerCount--;
            totalListLeft--;
            percentageLoaded = parseFloat((((totalListCounts - totalListLeft) / totalListCounts) * 100).toFixed(1));
            self.checkComplete(self);
            return;
        }
        self.put(self, entity, callback, callbackArgs);
        // statusbar('Synchronizing ' + self.entityName + 's, ' + Math.abs(self.tempTotalServerCount--) + ' left to load');
        self.tempTotalServerCount--;
        totalListLeft--;
        percentageLoaded = parseFloat((((totalListCounts - totalListLeft) / totalListCounts) * 100).toFixed(1));
        self.checkComplete(self);
    },
    put: function (self, entity, callback, callbackArgs) {
        //console.log('put called')
        if (self.entityName === 'client') {
            var client = entity;
            if (exists(entity.loans)) {
                client.loans.splice(client.loans.length, 0);
            }
            if (exists(entity.savingsAccount)) {
                client.savingsAccount.splice(client.savingsAccount.length, 0);
            }
            self.store(client);
            if (exists(entity.loans)) {
                for (var i = 0, len = entity.loans.length; i < len; i++) {
                    var loan = entity.loans[i];
                    loanList.addOwner(loanList, loan, null, null);
                    loanList.store(loan);

                }
            }
            if (exists(entity.savingsAccount)) {
                for (var i = 0, len = entity.savingsAccount.length; i < len; i++) {
                    var savingsAccount = entity.savingsAccount[i];
                    savingsAccountList.addOwner(savingsAccountList, savingsAccount, null, null);
                    savingsAccountList.store(savingsAccount);
                }
            }
        } else {
            if (self.entityName === 'loan')
            {
                console.log("Putting Loan entity . . ." + entity.loanId);
                console.log(entity);
            }
            self.store(entity);
        }
        if ($.isFunction(callback)) {
            console.log('calling next in put')
            callback(self, callbackArgs);
        }
    },
    notifyDataModelChangedListener: function () {
        this.dataModelChangedEventListenerCallbacks.forEach(function (callback) {
            if(callback)
            {
                callback();
            }
        });
    },
    // if the change was "add", the new entity is passed
    // if it was "delete", the mainId of the deleted entity is passed
    notifyEntityChangedListener: function (entity, type) {
        this.entityChangedEventListenerCallbacks.forEach(function (callback) {
            if(callback)
            {
                callback(entity, type);
            }
        });// TODO: don't know if this works, test!
    },
    sorter: function (one, other) {
        return one > other;
    },
    equals: function (one, other) {
        if (one === other) {
            return true;
        }

        if (!exists(one) || !exists(other)) {
            return false;
        }

        var onesKeys = Object.keys(one).sort();
        var othersKeys = Object.keys(other).sort();
        var onesLength = onesKeys.length;
        var othersLength = othersKeys.length;

        if (onesLength !== othersLength) {
            return false;
        }

        for (var i = 0; i < onesLength; i++) {
            var onesKey = onesKeys[i];
            var otherKey = othersKeys[i];
            if (onesKey !== otherKey) {
                return false;
            } else {
                if (one[onesKey] !== other[otherKey]) {
                    return false;
                }
            }
        }

        return true;
    },
    getById: function (id) {
        var idFilter = function (entity) {
            return entity.mainId === id;
        };

        var filtered = this.getEntities().filter(idFilter);
        if (filtered.length === 1) {
            return filtered[0];
        }

        return null;
    }
};
