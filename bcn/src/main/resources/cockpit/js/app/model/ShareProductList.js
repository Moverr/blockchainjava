/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global AbstractList */

var ShareProductList = function () {
    AbstractList.call(this);

    this.rootPath = '/shareproduct/v1d/';
    this.entityName = 'shareproduct';
    this.storagePrefix = this.entityName + '_';
};

ShareProductList.prototype = Object.create(AbstractList.prototype, {
    constructor: ShareProductList,
    enrich: {value: function (object) {
            console.log(object);
            object.mainId = object.id;
            return object;
        }, enumerable: true}
});

