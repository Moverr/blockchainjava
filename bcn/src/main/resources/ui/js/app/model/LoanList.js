'use strict';

/* global Storage, clientList, groupList, DEV_NO_MODEL_INIT, loanList, eventtype, AbstractList, officerList */

var LoanList = function() {
	AbstractList.call(this);

	this.rootPath = '/loan/v1d/';
        this.alternativeGetAllLoansUrl = '/loan/v1d/allLoans';
        this.defaultPageSize = 250;
	this.entityName = 'loan';
	this.storagePrefix = this.entityName + '_';
};

LoanList.prototype = Object.create(AbstractList.prototype, {
	constructor: LoanList,
	sorter: {
		value: function(one, other) {
			return one.loanId > other.loanId;
		},
		enumerable: true
	},
	addTransactions: {
		value: function(self, loan, callback, callbackArgs) {
			var lastKnownTransactionId = exists(loan.transactionList) && loan.transactionList.length > 0 ?
				loan.transactionList[loan.transactionList.length - 1].transactionId : 0;
			if (exists(loan.transactionList)) {
				//console.log('transactionlist exists')
				loan.transactionList = loan.transactionList;
				AbstractList.prototype.put.call(this, self, loan, callback, callbackArgs);
			} else {
				ajax(this.rootPath + loan.loanId + '/transactions/' + lastKnownTransactionId, 'GET', function(transactionList) {
					(function(loan, transactionList) {
						if (exists(transactionList)) {
							loan.transactionList = transactionList;
							AbstractList.prototype.put.call(this, self, loan, callback, callbackArgs);
						} else {
							//console.log('could not load transactions of loan ' + loan.loanId);
						}
					})(loan, transactionList);
				});
			}
		},
		enumerable: true
	},
	addRepaymentSchedule: {
		value: function(self, loan, callback, callbackArgs) {
			if (exists(loan.repaymentSchedule)) {
				//console.log('repaymentSchedule exists')
				var repaymentSchedule = loan.repaymentSchedule;
				var len = repaymentSchedule.rows.length;
				for (var i = len; i > 0; i--) {
					repaymentSchedule.rows[i] = repaymentSchedule.rows[i - 1];
					repaymentSchedule.rows[i].amortization = repaymentSchedule.rows[i].due - repaymentSchedule.rows[i].interest;
				}
				repaymentSchedule.rows[0] = {
					dueDate: -1,
					paidDate: -1,
					balance: loan.principal,
					due: -1,
					paid: -1,
					outstanding: -1,
					interest: -1,
					amortization: -1
				};
				loan.repaymentSchedule = repaymentSchedule;
				self.addTransactions(self, loan, callback, callbackArgs);
			} else {
				ajax(this.rootPath + loan.loanId + '/repaymentSchedule', 'GET', function(repaymentSchedule) {
					(function(loan, repaymentSchedule) {
						if (exists(repaymentSchedule)) {
							var len = repaymentSchedule.rows.length;
							for (var i = len; i > 0; i--) {
								repaymentSchedule.rows[i] = repaymentSchedule.rows[i - 1];
								repaymentSchedule.rows[i].amortization = repaymentSchedule.rows[i].due - repaymentSchedule.rows[i].interest;
							}
							repaymentSchedule.rows[0] = {
								dueDate: -1,
								paidDate: -1,
								balance: loan.principal,
								due: -1,
								paid: -1,
								outstanding: -1,
								interest: -1,
								amortization: -1
							};
							loan.repaymentSchedule = repaymentSchedule;
							self.addTransactions(self, loan, callback, callbackArgs);
						} else {
							//console.log('could not load repayment schedule of loan ' + loan.loanId);
						}
					})(loan, repaymentSchedule);
				});
			}
		},
		enumerable: true
	},
	addResponsibleLoanOfficer: {
		value: function(self, loan, callback, callbackArgs) {
			if ('GROUP' === loan.loanType) {
				// TODO: use private group list from parent prototype of AbstractList
				officerList.get(loan.loanOfficer, function(officer) {
					(function(loan, officer) {
						if (exists(officer)) {
							loan.officer = officer;
							self.addRepaymentSchedule(self, loan, callback, callbackArgs);
						}
					})(loan, officer);
				});
			}
		},
		enumerable: true
	},
	addOwner: {
		value: function(self, loan, callback, callbackArgs) {
			if ('INDIVIDUAL' === loan.loanType) {
				// TODO: use private client list from parent prototype of AbstractList
				clientList.get(loan.awamoId, function(client) {
					(function(loan, client) {
						if (exists(client)) {
							loan.client = client;
							loan.ownerName = client.fullname;
							self.addRepaymentSchedule(self, loan, callback, callbackArgs);
						}
					})(loan, client);
				});
			} else if ('GROUP' === loan.loanType) {
				// TODO: use private group list from parent prototype of AbstractList
				groupList.get(loan.awamoId, function(group) {
					(function(loan, group) {
						if (exists(group)) {
							loan.group = group;
							loan.ownerName = group.name;
							self.addResponsibleLoanOfficer(self, loan, callback, callbackArgs);
						}
					})(loan, group);
				});
			}
		},
		enumerable: true
	},
	put: {
		value: function(self, entity, callback, callbackArgs) {
			if (self.entityName === 'loan') {
				ActionRequiredHandler.prototype._dataModelChanged();
				if (exists(entity)) {

				}
			}
			this.addOwner(self, entity, callback, callbackArgs);
		},
		enumerable: true
	},
	getListByStatus: {
		value: function(status) {
			return this.getEntities().filter(function(share) {
				return share.status === status;
			});
		},
		enumerable: true
	},
	getCountByStatus: {
		value: function(status) {
			return this.getEntities().reduce(function(accumulator, object) {
				if (object.status === status) {
					accumulator = accumulator + 1;
				}
				return accumulator;
			}, 0);
		},
		enumerable: true
	},
	clientFilter: {
		value: function(awamoId) {
			return function(loan) {
				return loan.awamoId === awamoId;
			};
		},
		enumerable: true
	},
	getByClient: {
		value: function(awamoId) {
			return this.entityArray.filter(this.clientFilter(awamoId));
		},
		enumerable: true
	},
	getSubmittedCount: {
		value: function() {
			return this.getCountByStatus('SUBMITTED');
		},
		enumerable: true
	},
	getSubmittedLoanList: {
		value: function() {
			return this.getListByStatus('SUBMITTED');
		},
		enumerable: true
	},
	getApprovedLoanList: {
		value: function() {
			var approvedLoans = this.getListByStatus('APPROVED');
			var approvedLoansWithModifications = this.getListByStatus('APPROVED_WITH_MODIFICATIONS');
			return approvedLoans.concat(approvedLoansWithModifications);
		},
		enumerable: true
	},
	getApprovedWithModificationsLoanList: {
		value: function() {
			//TO DO IN THE USER INTERFACE AFTER BUSINESS DESIDES how to go about this
			var approvedLoansWithModifications = this.getListByStatus('APPROVED_WITH_MODIFICATIONS');
			return approvedLoansWithModifications;
		},
		enumerable: true
	},
	getRejectedCount: {
		value: function() {
			return this.getCountByStatus('REJECTED');
		},
		enumerable: true
	},
	getRejectedLoanList: {
		value: function() {
			return this.getListByStatus('REJECTED');
		},
		enumerable: true
	},
	getActiveCount: {
		value: function() {
			return this.getCountByStatus('ACTIVE');
		},
		enumerable: true
	},
	getApprovedCount: {
		value: function() {
			var approvedLoansCount = this.getCountByStatus('APPROVED');
			var approvedLoansWithModificationsCount = this.getCountByStatus('APPROVED_WITH_MODIFICATIONS');
			var totalApprovedCount = parseInt(approvedLoansCount) + parseInt(approvedLoansWithModificationsCount);
			return totalApprovedCount;
		},
		enumerable: true
	},
	getActiveLoanList: {
		value: function() {
			return this.getListByStatus('ACTIVE');
		},
		enumerable: true
	},
	getContractSignedCount: {
		value: function() {
			return this.getCountByStatus('CONTRACT_SIGNED');
		},
		enumerable: true
	},
	getContractSignedLoanList: {
		value: function() {
			return this.getListByStatus('CONTRACT_SIGNED');
		},
		enumerable: true
	},
	getDisburesmentAllowedCount: {
		value: function() {
			return this.getCountByStatus('AWAITING_DISBURSEMENT');
		},
		enumerable: true
	},
	getDisburesmentAllowedList: {
		value: function() {
			return this.getListByStatus('AWAITING_DISBURSEMENT');
		},
		enumerable: true
	},
	getLoanIds: {
		value: function() { // TODO: remove, replace call with getMainIds in AbstractList
			return this.mainIds;
		},
		enumerable: true
	},
	enrich: {
		value: function(object) {
			object.mainId = object.loanId;
			return object;
		},
		enumerable: true
	}
});
