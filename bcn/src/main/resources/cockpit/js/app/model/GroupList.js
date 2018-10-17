'use strict';

/* global Storage, DEV_NO_MODEL_INIT, AbstractList */

var GroupList = function () {
    AbstractList.call(this);

    this.rootPath = '/group/v1d/';
    this.defaultPageSize = 250;
    this.newGetMtd = '/group/v1d/allGroups';
    this.entityName = 'group';
    this.storagePrefix = this.entityName + '_';
};

GroupList.prototype = Object.create(AbstractList.prototype, {
    constructor: GroupList,
    enrich: {value: function (object) {
            object.mainId = object.awamoId;
            return object;
        }, enumerable: true},
    getOfficerByAwamoId: {value: function (awamoId, type, successCallback, data, headers, failCallback, alwaysCallback) {
            var url = '/officer/v1d/' + awamoId;

            if (typeof (headers) === "undefined") {
                headers = getAuthenticationHeader();
            }

            if (typeof (failCallback) === "undefined") {
                failCallback = function (e) {
                    console.log('fail');
                    console.log(e);
                };
            }

            $.ajax({
                url: host + url,
                type: type,
                data: data,
                headers: headers,
                dataType: 'json',
                contentType: "application/json; charset=utf-8"
            })
                    .done(successCallback)
                    .fail(failCallback)
                    .always(alwaysCallback);

        }, enumerable: false},
    getOfficer: {value: function (officerId) {
            var officers = officerList.getEntities();            
            var filteredOfficers = officers.filter(function (officer) {
                return officer.awamoId === officerId;
            })
            return exists(filteredOfficers) ? filteredOfficers[0] : null;
        }, enuemerable: true},
    getOfficers: {value: function () {
            return  officerList.getEntities();
        }, enuemerable: true},
    getAll: {value: function () {
            return this.getEntities();
        }, enumerable: true},
    getClients: {value: function () {
            return clientList.getEntities();
        }, enumerable: true},
    getClient: {value: function (awamoId) {
            var clients = clientList.getEntities();            
            var filteredClients = clients.filter(function (client) {
                return client.awamoId === awamoId;
            })
            console.log(filteredClients)
            return exists(filteredClients) ? filteredClients[0] : null;

        }, enuemerable: true},
    getGroup:{value:function(groupAwamoId){
            return this.entityArray.filter(this.groupFilter(groupAwamoId));
            
    },enumerable:true},
    groupFilter:{value:function(awamoId){
            return function(group){
               return group.awamoId===awamoId;
            }
    },enumerable:true}
// //,
//    officerFilter: {value: function (awamoId) {
//                return function (group) {
//                    return loan.awamoId === awamoId;
//                };
//            }, enumerable: true},
//    getByOfficer: {value: function (awamoId) {
//            return this.entityArray.filter(this.officerFilter(awamoId));
//        }, enumerable: true}
});
