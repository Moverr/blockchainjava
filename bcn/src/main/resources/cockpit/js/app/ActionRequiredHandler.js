/* global handlers, savingsAccountList, loanList, shareList, doHistoryUpdate */

var ActionRequiredHandler = function () {
    ActionRequiredHandler.self = this;
    loanList.addDataModelChangedEventListenerCallback(ActionRequiredHandler.prototype._dataModelChanged);
    savingsAccountList.addDataModelChangedEventListenerCallback(ActionRequiredHandler.prototype._dataModelChanged);
    shareList.addDataModelChangedEventListenerCallback(ActionRequiredHandler.prototype._dataModelChanged);
};

ActionRequiredHandler.OVERVIEW_TITLES = {
    type: 'Items Available',
    number: 'Number'
};

/* external */
ActionRequiredHandler.prototype.overview = function () {
    addHistory('Action required overview', '#actionRequiredOverview', '#actionRequired');
    initDefaultContent('Action Required');
    currentTable = 'actionRequired';
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title','Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();

    var $rowContainer = getDefaultRowContainer(ActionRequiredHandler.OVERVIEW_TITLES);
    var loanApplicationsNumber = $('span[data-counterkey="loanApplications"]').data('counter');
    var loanApprovedNumber = $('span[data-counterkey="loanApproved"]').data('counter');
    var loanDisbursementsNumber = $('span[data-counterkey="loanDisbursements"]').data('counter');
    var loanAllowedDisbursementsNumber = $('span[data-counterkey="loanDisburse"]').data('counter');
    var savingsAccountApplicationsNumber = $('span[data-counterkey="savingsAccountApplications"]').data('counter');
    var sharePurchaseApplicationsNumber = $('span[data-counterkey="sharePurchaseApplications"]').data('counter');
    var shareSaleApplicationsNumber = $('span[data-counterkey="shareSaleApplications"]').data('counter');

    if (handlers['Permissions'].check_access('_APPROVE_LOAN_APPLICATIONS'))
        addRow($rowContainer, {type: 'Approve Loan Applications', number: '<span data-counter="' + loanApplicationsNumber + '" data-counterkey="loanApplications">' + loanApplicationsNumber + '</span>'}, 'Loan', ActionRequiredHandler.self.rowClickHandler, 'getApplications');

    if (handlers['Permissions'].check_access('_SIGN_LOAN_CONTRACT'))
        addRow($rowContainer, {type: 'Sign Loan Contracts', number: '<span data-counter="' + loanApprovedNumber + '" data-counterkey="loanApproved">' + loanApprovedNumber + '</span>'}, 'Loan', ActionRequiredHandler.self.rowClickHandler, 'getSingngContracts');

    if (handlers['Permissions'].check_access('_MANAGE_LOAN_DISBURSEMENT'))
        addRow($rowContainer, {type: 'Allow Loan Disbursements', number: '<span data-counter="' + loanDisbursementsNumber + '" data-counterkey="loanDisbursements">' + loanDisbursementsNumber + '</span>'}, 'Loan', ActionRequiredHandler.self.rowClickHandler, 'getDisbursements');

    if (handlers['Permissions'].check_access('_APPROVE_LOAN_DISBURSEMENT'))
        addRow($rowContainer, {type: 'Disburse Loan', number: '<span data-counter="' + loanAllowedDisbursementsNumber + '" data-counterkey="loanDisburse">' + loanAllowedDisbursementsNumber + '</span>'}, 'Loan', ActionRequiredHandler.self.rowClickHandler, 'getAllowedDisbursements');

    if (handlers['Permissions'].check_access('_MANAGE_SAVINGS_ACCOUNTS'))
        addRow($rowContainer, {type: 'Savings Account Applications', number: '<span data-counter="' + savingsAccountApplicationsNumber + '" data-counterkey="savingsAccountApplications">' + savingsAccountApplicationsNumber + '</span>'}, 'SavingsAccount', ActionRequiredHandler.self.rowClickHandler, 'getApplications');

//    addRow($rowContainer, { type: 'Purchase share', number: 0 }, 'Share', ActionRequiredHandler.self.rowClickHandler, 'purchase');
//    addRow($rowContainer, {type: 'Approve share purchase', number: sharePurchaseApplicationsNumber}, 'Share', ActionRequiredHandler.self.rowClickHandler, 'approvePurchase');
//    addRow($rowContainer, { type: 'Sell share', number: 0 }, 'Share', ActionRequiredHandler.self.rowClickHandler, 'sale');
//    addRow($rowContainer, {type: 'Approve share sale', number: shareSaleApplicationsNumber}, 'Share', ActionRequiredHandler.self.rowClickHandler, 'approveSale');
};

ActionRequiredHandler.prototype.rowClickHandler = function () {
    var action = $(this).data('id');
    var handler = $(this).data('object');
    $('li[data-parent~="actionRequired"][data-handler="' + handler + '"][data-action~="' + action + '"] a').click();
};

/* internal */
ActionRequiredHandler.prototype._loanApplicationsRowClickHandler = function () {
    $('#actionRequired-loanApplications').click();
};

ActionRequiredHandler.prototype._loanDisbursementsRowClickHandler = function () {
    $('#actionRequired-loanDisbursements').click();
};

ActionRequiredHandler.prototype._savingsAccountApplicationsRowClickHandler = function () {
    $('#actionRequired-savingsAccountApplications').click();
};

ActionRequiredHandler.prototype._savingsAccountApplicationsRowClickHandler = function () {
    $('#actionRequired-savingsAccountApplications').click();
};

ActionRequiredHandler.prototype._dataModelChanged = function () {
    //console.log('_dataModelChanged hit')
    // update badges
    var loanApplicationsNumber = loanList.getSubmittedCount();
    var loanDisbursementsNumber = loanList.getContractSignedCount();
    var loanApprovedNumber = loanList.getApprovedCount();
    var loanAllowedDisburseNumber = loanList.getDisburesmentAllowedCount();
    var savingsAccountApplicationsNumber = savingsAccountList.getCountByStatus('SUBMITTED');
    var sharePurchaseApplicationsNumber = shareList.getCountByStatus('SUBMITTED_FOR_PURCHASE');
    var shareSaleApplicationsNumber = shareList.getCountByStatus('SUBMITTED_FOR_SALE');

    var $counterspan;

    $counterspan = $('span[data-counterkey="loanApplications"]');    
    $counterspan.data('counter', loanApplicationsNumber);
    $counterspan.text(loanApplicationsNumber);
    if (loanApplicationsNumber === 0 && !$counterspan.parent().is('td')) {
        $counterspan.hide();
    } else {
        $counterspan.show();
    }

    $counterspan = $('span[data-counterkey="loanApproved"]');
    $counterspan.data('counter', loanApprovedNumber);
    $counterspan.text(loanApprovedNumber);
    if (loanApprovedNumber === 0 && !$counterspan.parent().is('td')) {
        $counterspan.hide();
    } else {
        $counterspan.show();
    }

    $counterspan = $('span[data-counterkey="loanDisburse"]');
    $counterspan.data('counter', loanAllowedDisburseNumber);
    $counterspan.text(loanAllowedDisburseNumber);
    if (loanAllowedDisburseNumber === 0 && !$counterspan.parent().is('td')) {
        $counterspan.hide();
    } else {
        $counterspan.show();
    }

    $counterspan = $('span[data-counterkey="loanDisbursements"]');
    $counterspan.data('counter', loanDisbursementsNumber);
    $counterspan.text(loanDisbursementsNumber);
    if (loanDisbursementsNumber === 0 && !$counterspan.parent().is('td')) {
        $counterspan.hide();
    } else {
        $counterspan.show();
    }

    $counterspan = $('span[data-counterkey="savingsAccountApplications"]');
    $counterspan.data('counter', savingsAccountApplicationsNumber);
    $counterspan.text(savingsAccountApplicationsNumber);
    if (savingsAccountApplicationsNumber === 0 && !$counterspan.parent().is('td')) {
        $counterspan.hide();
    } else {
        $counterspan.show();
    }

    $counterspan = $('span[data-counterkey="sharePurchaseApplications"]');
    $counterspan.data('counter', sharePurchaseApplicationsNumber);
    $counterspan.text(sharePurchaseApplicationsNumber);
    if (sharePurchaseApplicationsNumber === 0 && !$counterspan.parent().is('td')) {
        $counterspan.hide();
    } else {
        $counterspan.show();
    }

    $counterspan = $('span[data-counterkey="shareSaleApplications"]');
    $counterspan.data('counter', shareSaleApplicationsNumber);
    $counterspan.text(shareSaleApplicationsNumber);
    if (shareSaleApplicationsNumber === 0 && !$counterspan.parent().is('td')) {
        $counterspan.hide();
    } else {
        $counterspan.show();
    }

    $counterspan = $('span[data-counterkey="actionRequired"]');
    $counterspan.data('counter', loanApplicationsNumber + loanAllowedDisburseNumber + loanDisbursementsNumber + loanApprovedNumber + savingsAccountApplicationsNumber + sharePurchaseApplicationsNumber + shareSaleApplicationsNumber);
    var count = 0;


    if (handlers['Permissions'].check_access('_MANAGE_SAVINGS_ACCOUNTS'))
        count += savingsAccountApplicationsNumber;

    if (handlers['Permissions'].check_access('_APPROVE_LOAN_DISBURSEMENT'))
        count += loanAllowedDisburseNumber;

    if (handlers['Permissions'].check_access('_MANAGE_LOAN_DISBURSEMENT'))
        count += loanDisbursementsNumber;

    if (handlers['Permissions'].check_access('_SIGN_LOAN_CONTRACT'))
        count += loanApplicationsNumber;

    if (handlers['Permissions'].check_access('_APPROVE_LOAN_APPLICATIONS'))
        count += loanApprovedNumber;

    if (count > 0) {
        $counterspan.text(count);
        $counterspan.show();
    } else {
        $counterspan.hide();
    }

//    $counterspan.text(loanApplicationsNumber + loanAllowedDisburseNumber + loanDisbursementsNumber + loanApprovedNumber + savingsAccountApplicationsNumber + sharePurchaseApplicationsNumber + shareSaleApplicationsNumber);
//    if (loanApplicationsNumber + loanAllowedDisburseNumber + loanDisbursementsNumber + loanApprovedNumber + savingsAccountApplicationsNumber + sharePurchaseApplicationsNumber + shareSaleApplicationsNumber === 0 && !$counterspan.parent().is('td')) {
//        $counterspan.hide();
//    } else {
//        $counterspan.show();
//    }
};
