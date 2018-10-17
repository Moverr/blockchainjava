/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global SettingsHandler, OfficeHandler, printData, shareProductList, currencyCode, headers, host, AlertTypes, handlers */

var ProductsHandler = function () {
    ProductsHandler.self = this;
};


ProductsHandler.DISPLAY_SHAREPRODUCT_TITLES = {
    fullname: 'Name',
    parentOffice: 'Short name ',
    date_created: ' Total Shares '
};


/* external */
ProductsHandler.prototype.shareproducts_sub_menu = function () {

    addHistory('Share Products overview', '#sharesProducts', '#sharesProducts');
    initDefaultContent('Share Products Overview');
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    currentTable = 'ShareProductsOverview';

    var $rowContainer = getDefaultRowContainer({type: 'Items Available'});

    addRow($rowContainer, {type: 'Manage Share Products '/*, number: 7*/}, 'Products', ProductsHandler.self.manageShareProducts, 'manageShareProducts');
    addRow($rowContainer, {type: 'Add Share Product '/*, number: 1*/}, 'Products', ProductsHandler.self.addShareProducts, 'addShareProducts');

};

ProductsHandler.prototype.getShareProductDataList = function () {
    var shareProducts = null;
    shareProducts = shareProductList.getEntities();
    return shareProducts.length > 1 ? shareProducts : null;
};


//TODO: Manage Share Products
ProductsHandler.prototype.manageShareProducts = function () {
    OfficeHandler.self.currentOffice = null;
    initDefaultContent('Share Products  ');
    $('#printNow').off('click touch');
    $('#printNow').on('click touch', printData);
    $('#printNow').show();
    $('#create_object').off('click touch');

    $('#create_object').text("Create Product  ");
    $('#create_object').on('click touch', ProductsHandler.self.addShareProducts);
    $('#create_object').show();


    // Get the OFfices List from
    var dataList = ProductsHandler.self.getShareProductDataList();
    var $rowContainer = getDefaultRowContainer(ProductsHandler.DISPLAY_SHAREPRODUCT_TITLES, true);
    var $table = $rowContainer.parent();
    for (var i = 0; i < dataList.length; i++) {
        var rowdata = {};
        var formattedValue = dataList[i];
        rowdata['name'] = formattedValue.name;
        rowdata['shortName'] = formattedValue.shortName;
        rowdata['totalShares'] = formattedValue.totalShares;

        addRow($rowContainer, rowdata, dataList[i], ProductsHandler.self.editShareProduct, dataList[i].id);
    }
    var tableSorter = getDefaultTableSorter();
    tableSorter.headers = {
        3: {
            sorter: 'awamoDateSorter'
        },
        4: {
            sorter: 'awamoDateSorter'
        }
    };
    //$table.tablesorter(tableSorter);
    initialize_datatable($table);
    var els = document.getElementById("defaultTableContainer").getElementsByTagName("table");
    for (var i = 0; i < els.length; i++) {
        els[i].style.textAlign = "right";
    }
    $('#tableTotal').text(dataList.length);
    showContent($('#tableTotalSum'));
    showContent($('#emailLoanReportDiv'));
    var tables = $('#defaultTableContainer').tableExport();
    tables.tableExport.update({
        formats: ["xls", "xlsx"],
        fileName: "Share Products" + (new Date().toJSON().slice(0, 10).replace(/-/g, '_')),
        headings: true
    });
    $("#hiddenPrintedTitle").val("Users Report");
};


//TODO: template:  mfi-products
ProductsHandler.prototype.addShareProducts = function () {
    // createshareproduct_template_page
    initDefaultContent(' Share Product  ');
    hideContent();

    $("#_createNewShareProduct").off();
    $("#_createNewShareProduct").on('submit', ProductsHandler.self.submitShareProduct);
    $("#submitShareProductbtn").val("submit");

    $("#backtoShareProductsbtn").off();
    $("#backtoShareProductsbtn").on('click', ProductsHandler.self.manageShareProducts);
    var currency_option = "<option value='" + currencyCode + "' selected >" + currencyCode + "</option>";

    $("#shareproductcurrency").html(currency_option);

    //ASSET
    var chart_of_accounts = handlers['Accounting'].getChartofAccountsByType('ASSET');
    var select_options = "";
    select_options += "<option   value=''  >  Select an Option  </option>";

    if (chart_of_accounts != undefined && chart_of_accounts != null) {
        for (var row = 0; row < chart_of_accounts.length; row++) {
            select_options += "<option title=' " + chart_of_accounts[row].name + "'   value='" + chart_of_accounts[row].accountId + "' id='" + chart_of_accounts[row].accountId + "'  > " + chart_of_accounts[row].name + " </option>";
        }

    }
    $("#shares_reference").html(select_options);


    //LIABILITY
    chart_of_accounts = handlers['Accounting'].getChartofAccountsByType('LIABILITY');
    select_options = "";
    select_options += "<option   value=''  >  Select an Option  </option>";

    if (chart_of_accounts != undefined && chart_of_accounts != null) {
        for (var row = 0; row < chart_of_accounts.length; row++) {
            select_options += "<option title=' " + chart_of_accounts[row].name + "'   value='" + chart_of_accounts[row].accountId + "' id='" + chart_of_accounts[row].accountId + "'  > " + chart_of_accounts[row].name + " </option>";
        }

    }
    $("#shares_suspense_control").html(select_options);

    //EQUITY
    chart_of_accounts = handlers['Accounting'].getChartofAccountsByType('EQUITY');
    select_options = "";
    select_options += "<option   value=''  >  Select an Option  </option>";

    if (chart_of_accounts != undefined && chart_of_accounts != null) {
        for (var row = 0; row < chart_of_accounts.length; row++) {
            select_options += "<option title=' " + chart_of_accounts[row].name + "'   value='" + chart_of_accounts[row].accountId + "' id='" + chart_of_accounts[row].accountId + "'  > " + chart_of_accounts[row].name + " </option>";
        }

    }
    $("#shares_equity").html(select_options);

    //INCOME
    chart_of_accounts = handlers['Accounting'].getChartofAccountsByType('INCOME');
    select_options = "";
    select_options += "<option   value=''  >  Select an Option  </option>";

    if (chart_of_accounts != undefined && chart_of_accounts != null) {
        for (var row = 0; row < chart_of_accounts.length; row++) {
            select_options += "<option title=' " + chart_of_accounts[row].name + "'   value='" + chart_of_accounts[row].accountId + "' id='" + chart_of_accounts[row].accountId + "'  > " + chart_of_accounts[row].name + " </option>";
        }

    }
    $("#income_from_fees").html(select_options);





    $(".shareproductaccountingRule").on('click', ProductsHandler.self.manage_accounting_rule);

    showContent($('#createshareproduct_template_page'));

    ProductsHandler.self.manage_accounting_rule();

};

ProductsHandler.prototype.manage_accounting_rule = function () {


    var accounting_type = $("input[name='shareproductaccountingRule']:checked").val();


    $("#shares_reference").removeAttr("required");
    $("#shares_suspense_control").removeAttr("required");
    $("#income_from_fees").removeAttr("required");
    $("#shares_equity").removeAttr("required");

    switch (parseInt(accounting_type)) {
        case 1:
            $(".cash_level_accounting").fadeOut('fast');
            break;
        case 2:

            $("#shares_reference").attr("required", "required");
            $("#shares_suspense_control").attr("required", "required");
            $("#income_from_fees").attr("required", "required");
            $("#shares_equity").attr("required", "required");

            $(".cash_level_accounting").fadeIn('fast');
            break;
        default:
            $(".cash_level_accounting").fadeOut('fast');
            break;
    }

};


ProductsHandler.prototype.submitShareProduct = function (e) {
    e.preventDefault();

    //Details :basic
    var share_product_name = $("#share_product_name").val();
    var share_product_shortname = $("#share_product_shortname").val();
    var share_product_description = $("#share_product_description").val();

    //Currency 
    var shareproductcurrency = $("#shareproductcurrency").val();
    var shareproductmultiplesof = $("#shareproductmultiplesof").val();
    var shareproductdecimalplaces = $("#shareproductdecimalplaces").val();

    //Terms
    var shareproducttotalnumberofshares = $("#shareproducttotalnumberofshares").val();
    var shareproductsharestobeissued = $("#shareproductsharestobeissued").val();
    var shareproductnominalprice = $("#shareproductnominalprice").val();

    //<!-- Shares per Client -->
    var shareproductsharesperclient_minimum = $("#shareproductsharesperclient_minimum").val();
    var shareproductsharesperclient_default = $("#shareproductsharesperclient_default").val();
    var shareproductsharesperclient_maximum = $("#shareproductsharesperclient_maximum").val();

    //Minimum Active Period
    var shareproductminimumactiveperiod = $("#shareproductminimumactiveperiod").val();
    var shareproductminimumactiveperiod_option = $("#shareproductminimumactiveperiod_option").val();

    //LOckin period  
    var shareproductlockinperiod = $("#shareproductlockinperiod").val();
    var shareproductlockinperiod_option = $("#shareproductlockinperiod_option").val();

    //Allow dividends for inactive clients
    var shareproductallowdividends = $("#shareproductallowdividends:checkbox:checked").length > 0 ? true : false;

// Accounting Rule
    var accounting_type = $("input[name='shareproductaccountingRule']:checked").val();

    //Maketshare value sharesMaketPrice
    var sharesMaketPrice = $("#sharesMaketPrice").val();

    {
        //1: Check all Mandatory Fields 

        if (
                (share_product_name.trim().length <= 0)
                || (share_product_shortname.trim().length <= 0)
                || (share_product_description.trim().length <= 0)
                || (shareproductcurrency.trim().length <= 0)
                || (shareproductmultiplesof.trim().length <= 0)
                || (shareproductdecimalplaces.trim().length <= 0)
                || (shareproducttotalnumberofshares.trim().length <= 0)
                || (shareproductsharestobeissued.trim().length <= 0)
                || (shareproductnominalprice.trim().length <= 0)
                || (shareproductsharesperclient_minimum.trim().length <= 0)
                || (shareproductsharesperclient_default.trim().length <= 0)
                || (shareproductsharesperclient_maximum.trim().length <= 0)
                || (accounting_type.trim().length <= 0)
                || (sharesMaketPrice.trim().length <= 0)

                ) {
            showAlertMessage("Fill Mandatory Fields", AlertTypes.warning);
            return;
        }

        //2: shareproducttotalnumberofshares vs shareproductsharestobeissued
        if (parseInt(shareproducttotalnumberofshares) < parseInt(shareproductsharestobeissued)) {
            showAlertMessage("Shares Issued can not be greater than Total Number of Shares", AlertTypes.warning);
            return;
        }


        //3: Check Minimum Active Period
        if ((
                isEmpty(shareproductminimumactiveperiod) === false
                &&
                isEmpty(shareproductminimumactiveperiod_option) === true
                )
                ||
                (
                        isEmpty(shareproductminimumactiveperiod) === true
                        &&
                        isEmpty(shareproductminimumactiveperiod_option) === false
                        )

                ) {
            showAlertMessage("Check Minimum Active Period", AlertTypes.warning);
            return;
        }

        //3: Check Lockin Period
        if ((
                isEmpty(shareproductlockinperiod) === false
                &&
                isEmpty(shareproductlockinperiod_option) === true
                )
                ||
                (
                        isEmpty(shareproductlockinperiod) === true
                        &&
                        isEmpty(shareproductlockinperiod_option) === false
                        )

                ){

            showAlertMessage("Check Lockin Period", AlertTypes.warning);
            return;
        }

        // shareproductsharestobeissued vs  shareproductsharesperclient_minimum
        if (parseInt(shareproductsharesperclient_minimum) > parseInt(shareproductsharestobeissued)) {
            showAlertMessage("Minimum shares per client can not be greater than total issued shares  ", AlertTypes.warning);
            return;
        }
        //shareproductsharesperclient_default vs  shareproductsharesperclient_minimum
        if (parseInt(shareproductsharesperclient_default) > parseInt(shareproductsharestobeissued)) {
            showAlertMessage("Default shares per client can not be greater  than total issued shares ", AlertTypes.warning);
            return;
        }

        //shareproductsharesperclient_default vs  shareproductsharesperclient_minimum
        if (parseInt(shareproductsharesperclient_default) < parseInt(shareproductsharesperclient_minimum)) {
            showAlertMessage("Default shares per client can not be greater  than minimum shares per client  ", AlertTypes.warning);
            return;
        }

        //shareproductsharesperclient_default vs  shareproductsharesperclient_maximum
        if (parseInt(shareproductsharesperclient_maximum) < parseInt(shareproductsharesperclient_default)) {
            showAlertMessage("Maximum shares per client can not be less  than default shares per client  ", AlertTypes.warning);
            return;
        }

        //shareproductsharesperclient_default vs  shareproductsharesperclient_maximum
        if (parseInt(shareproductsharesperclient_maximum) > parseInt(shareproductsharestobeissued)) {
            showAlertMessage("Maximum shares per client can not be greater  than total issued shares  ", AlertTypes.warning);
            return;
        }






    }


    var body = ' {';


    switch (parseInt(accounting_type)) {
        case 2:

            //Assets,Liabalities,Share equity,income, should not be null
            var shares_reference = $("#shares_reference").val();
            var shares_suspense = $("#shares_suspense_control").val();
            var shares_equity = $("#shares_equity").val();
            var income_from_fees = $("#income_from_fees").val();

            if ((isEmpty(shares_reference) === false)
                    ||
                    (isEmpty(shares_suspense) === false)
                    ||
                    (isEmpty(shares_equity) === false)
                    ||
                    (isEmpty(income_from_fees) === false)

                    ) {
                showAlertMessage("Accounting Section is Mandatory for this accounting type", AlertTypes.warning);
                return;
            }
            break;
        case 1:
            break;
        default:
            break;
    }




    body += '"name":"' + share_product_name + '",'
            + '"shortName":"' + share_product_shortname + '",'
            + '"description":"' + share_product_description + '",'
            + '"currencyCode":"' + currencyCode + '",'
            + '"currencyDigits":' + shareproductdecimalplaces + ', '
            + '"currencyMultiplesof":' + shareproductmultiplesof + ' , '
            + '"totalShares":' + shareproducttotalnumberofshares + ','
            + '"issuedShares":' + shareproductsharestobeissued + ','
            + '"unitPrice":' + shareproductnominalprice + ','
            + '"capitalAmount":' + (parseFloat(shareproductnominalprice) * parseFloat(shareproductnominalprice)) + ','
            + '"minimumClientShares":' + shareproductsharesperclient_minimum + ','
            + '"nominalClientShares":' + shareproductsharesperclient_default + ','
            + '"maximumClientShares":' + shareproductsharesperclient_maximum + ','
            + '"accountingRule": ' + accounting_type + ' ,';




    if (isEmpty(shareproductminimumactiveperiod) === true
            &&
            isEmpty(shareproductminimumactiveperiod_option) === true
            )
    {

        body += '"minimumActivePeriodFrequency":"' + shareproductminimumactiveperiod + '",';
        body += '"minimumActivePeriodFrequencyEnum":"' + shareproductminimumactiveperiod_option + '",';
    }


    if (isEmpty(shareproductminimumactiveperiod) === true
            &&
            isEmpty(shareproductminimumactiveperiod_option) === true
            )
    {
        body += '"lockinPeriodFrequency":"' + shareproductminimumactiveperiod + '",';
        body += '"lockinPeriodFrequencyEnum":"' + shareproductminimumactiveperiod_option + '",';

    }

    if ((isEmpty(shares_reference) === true)
            ||
            (isEmpty(shares_suspense) === true)
            ||
            (isEmpty(shares_equity) === true)
            ||
            (isEmpty(income_from_fees) === true)

            ) {
        body += '"shares_reference":"' + shares_reference + '",';
        body += '"shares_suspense":"' + shares_suspense + '",';
        body += '"shares_equity":"' + shares_equity + '",';
        body += '"income_from_fees":"' + income_from_fees + '",';
    }

    body += '"marketprice": ' + sharesMaketPrice + ' ';

    body += ' }';

    headers = getAuthenticationHeader();
    console.log(body);

            $.ajax({
                url: host + '/shareproduct/v1d/',
                data: body,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                headers: headers,
                type: 'POST',
                beforeSend: function () {
                    showLoader();
                },
                success: function (data) {
                    // TODO : Redirect to Manage Users Page
                    showAlertMessage("Record Saved Successfully", AlertTypes.success);
                    hideLoader();

                },
                complete: function () {
                    hideLoader();
                }
            }).fail(function (Response) {

                if (Response.status === 403) {
                    showAlertMessage("Record was not saved Correctly ", AlertTypes.warning);
                } else if (Response.status === 500) {
                    showAlertMessage("Something went wrong, if persists contact Server Admin", AlertTypes.danger);
                } else if (Response.status === 404) {
                    showAlertMessage("Check Your Network Connection", AlertTypes.danger);
                } else
                {
                    showAlertMessage("Something went Wrong contact Administrator ", AlertTypes.danger);
                }
                hideLoader();
            });

    console.log(shareproductallowdividends);

    console.log(accounting_type);


};

//TODOD: Edit Share Product 
ProductsHandler.prototype.editShareProduct = function (event) {
    // createshareproduct_template_page
    initDefaultContent(' Share Product  ');
    hideContent();
    var product = $(event.currentTarget).data('object');
    console.log("Product");
    console.log(product);

    $("#share_product_name").val(product.name);
    $("#share_product_shortname").val(product.shortName);
    $("#share_product_description").val(product.description);
    $("#shareproductmultiplesof").val(product.currencyMultiplesof);


    $("#shareproducttotalnumberofshares").val(product.totalShares);
    $("#shareproductsharestobeissued").val(product.issueShares);

    $("#shareproductnominalprice").val(product.unitPrice);
    //$("#shareproductnominalprice").val(product.capitalAmount);

//    $("#shareproductsharesperclient_minimum").val();
//    $("#shareproductsharesperclient_default").val();
//    $("#shareproductsharesperclient_maximum").val();
//
//




    $("#_createNewShareProduct").off();
    $("#_createNewShareProduct").on('submit', ProductsHandler.self.submitShareProduct);
    $("#submitShareProductbtn").val("edit");

    $("#backtoShareProductsbtn").off();
    $("#backtoShareProductsbtn").on('click', ProductsHandler.self.manageShareProducts);
    var currency_option = "<option value='" + currencyCode + "' selected >" + currencyCode + "</option>";

    $("#shareproductcurrency").html(currency_option);

    //ASSET
    var chart_of_accounts = handlers['Accounting'].getChartofAccountsByType('ASSET');
    var select_options = "";
    select_options += "<option   value=''  >  Select an Option  </option>";

    if (chart_of_accounts != undefined && chart_of_accounts != null) {
        for (var row = 0; row < chart_of_accounts.length; row++) {
            select_options += "<option title=' " + chart_of_accounts[row].name + "'   value='" + chart_of_accounts[row].accountId + "' id='" + chart_of_accounts[row].accountId + "'  > " + chart_of_accounts[row].name + " </option>";
        }

    }
    $("#shares_reference").html(select_options);


    //LIABILITY
    chart_of_accounts = handlers['Accounting'].getChartofAccountsByType('LIABILITY');
    select_options = "";
    select_options += "<option   value=''  >  Select an Option  </option>";

    if (chart_of_accounts != undefined && chart_of_accounts != null) {
        for (var row = 0; row < chart_of_accounts.length; row++) {
            select_options += "<option title=' " + chart_of_accounts[row].name + "'   value='" + chart_of_accounts[row].accountId + "' id='" + chart_of_accounts[row].accountId + "'  > " + chart_of_accounts[row].name + " </option>";
        }

    }
    $("#shares_suspense_control").html(select_options);

    //EQUITY
    chart_of_accounts = handlers['Accounting'].getChartofAccountsByType('EQUITY');
    select_options = "";
    select_options += "<option   value=''  >  Select an Option  </option>";

    if (chart_of_accounts != undefined && chart_of_accounts != null) {
        for (var row = 0; row < chart_of_accounts.length; row++) {
            select_options += "<option title=' " + chart_of_accounts[row].name + "'   value='" + chart_of_accounts[row].accountId + "' id='" + chart_of_accounts[row].accountId + "'  > " + chart_of_accounts[row].name + " </option>";
        }

    }
    $("#shares_equity").html(select_options);

    //INCOME
    chart_of_accounts = handlers['Accounting'].getChartofAccountsByType('INCOME');
    select_options = "";
    select_options += "<option   value=''  >  Select an Option  </option>";

    if (chart_of_accounts != undefined && chart_of_accounts != null) {
        for (var row = 0; row < chart_of_accounts.length; row++) {
            select_options += "<option title=' " + chart_of_accounts[row].name + "'   value='" + chart_of_accounts[row].accountId + "' id='" + chart_of_accounts[row].accountId + "'  > " + chart_of_accounts[row].name + " </option>";
        }

    }
    $("#income_from_fees").html(select_options);





    $(".shareproductaccountingRule").on('click', ProductsHandler.self.manage_accounting_rule);

    showContent($('#createshareproduct_template_page'));

    ProductsHandler.self.manage_accounting_rule();


};

