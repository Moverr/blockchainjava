'use strict'
var LoanClient = function () {
    this.awamoId = null;
    this.numberOfChildren = 0;
    this.numberOfChildrenInHouseHold = 0;
    this.maritalStatus = ''//new MaritalStatus();
    this.livingArea = '';
    this.address = new Address();
    this.guarantor = new Guarantor();
    this.clientEmployments = new Array()
}

var MaritalStatus = function () {
    //SINGLE, MARRIED, DIVORCED, WIDOWED, SEPARATED, IN_A_RELATIONSHIP;
}

var LivingArea = function () {
    // RURAL, SLUM, URBAN;
}
var Address = function () {
    this.province = null;
    this.city = null;
    this.street = null;
}
var Guarantor = function () {
 this.guarantorName=null;
    this.guarantorValue=null;
}
var ClientEmployment = function () {

}
