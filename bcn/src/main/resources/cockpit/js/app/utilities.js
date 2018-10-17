/* ****************************************************************************
 * general                                                                    *
 **************************************************************************** */
/* global LoanHandler, SavingsAccountHandler, currencyCode, groupList, savingsAccountList, loanList, currentChangedFil, transactionsToDate, transactionsFromDate, clientList, ReportingHandler, GroupHandler, asDataTable, config, parseFloat, cssClass, host */
String.prototype.capitalize = function () {
    return this.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
    });
};

var utilities = function () {};
var AlertTypes = Object.freeze({
    success: 'modal-header modal-header-success',
    info: 'modal-header modal-header-info',
    warning: 'modal-header modal-header-warning',
    danger: 'modal-header modal-header-danger'
});

var datatables = Object.freeze({
    editGroup: 'editGroupTable'
});
var inputFieldTypes = Object.freeze({
    string: 'string',
    email: 'email',
    number: 'number',
    phone: 'phone',
    date: 'date',
    thousandCommas: 'thousand-commas',
    unformattedCurrency: 'unformattedCurrency'
});
var validationGlaphicons = Object.freeze({
    okay: '<span class="glyphicon glyphicon-ok form-control-feedback"></span>',
    warning: '<span class="glyphicon glyphicon-warning-sign form-control-feedback"></span>',
    error: '<span class="glyphicon glyphicon-remove form-control-feedback"></span>',
    loading: '<span class="glyphicon glyphicon-refresh form-control-feedback"></span>'
});
var validationClasses = Object.freeze({
    okay: 'has-success',
    warning: 'has-warning',
    error: 'has-error',
    loading: 'has-info'
});
var exportAction = Object.freeze({
    print: 'print',
    xls: 'xls',
    xlsx: 'xlsx'
});
var exportListName = Object.freeze({
    savingsAccounts: 'Savings Accounts',
    clients: 'Clients',
    loans: 'Loans',
    groups: 'Groups',
    transactions: 'Transactions'
});
var exportListFilter = Object.freeze({
    submitted: 'SUBMITTED',
    active: 'ACTIVE',
    closed: 'CLOSED',
    all: 'ALL',
    approved: 'APPROVED',
    rejected: 'REJECTED',
    contract_signed: 'CONTRACT_SIGNED',
    awaiting_disbursement: 'AWAITING_DISBURSEMENT'
});
hideControlsForReporting = function (type) {
    if ((SavingsAccountHandler.forReporting === true && type === 'SavingsAccount')) {
        // console.log('reached');
        var $singleActions = $('#singleActions');
        $('li a', $singleActions).each(function (el, index) {
            if ($(this).data('action') !== 'back') {
                $(this).css('display', 'none');
            }
        });
    }
    if (LoanHandler.forReporting === true && type === 'Loans') {
        var $singleActions = $('#loansSingleActions');
        $('button', $singleActions).each(function (el, index) {
            if ($(this).data('action') !== 'back') {
                $(this).css('display', 'none');
            }
        });
    }
};
//convergence mt
function hideContent() {
    $('.content').hide();
}
;

function showContent($element) {
    do {

        $element.show();
        $element = $element.parent();
    } while ($element.hasClass('content'));
}
;

if (jQuery.fn.dataTableExt) {
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        //12 May 2017
        "date_sorter-asc": function (a, b) {
            return jQuery.fn.dataTableExt.oSort["date_sorter-desc"](b, a);
        },
        "date_sorter-desc": function (a, b) {


            //get array from date string :
            var date_a = new Date(a);
            //new ::
            var date_b = new Date(b);

            return (date_a - date_b);
        }


    });

    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "currency_sorter-asc": function (a, b) {

            a = a.replace("" + currencyCode, "");
            a = (a === "-") ? 0 : a.replace(/[^\d\-\.]/g, "");

            b = b.replace("" + currencyCode, "");
            b = (b === "-") ? 0 : b.replace(/[^\d\-\.]/g, "");

            return (parseFloat(b) - parseFloat(a));

        },
        "currency_sorter-desc": function (a, b) {

            a = a.replace("" + currencyCode, "");
            a = (a === "-") ? 0 : a.replace(/[^\d\-\.]/g, "");

            b = b.replace("" + currencyCode, "");
            b = (b === "-") ? 0 : b.replace(/[^\d\-\.]/g, "");

            return (parseFloat(a) - parseFloat(b));

        }
    });

}
var css_selector = [];

function addRow($rowContainer, data, object, handler, id) {
    var celltype = $rowContainer.is('thead') ? 'th' : 'td';
    var $row = $('<tr>');
    $row.data('object', object);

    var counter = 0;
    var cssCounter = 0;
    for (var property in data) {
        if (data.hasOwnProperty(property)) {
            var css_rule = "";
            if (celltype === 'th') {
                var _property = data[property];
                _property = _property.trim().replace(/ /g, "_");
                var decider = _property.replace(/&nbsp;/gi, '_').toUpperCase();
                switch (decider) {
                    case undefined:
                        css_rule = "_normal";
                        break;
                    case 'REGISTRATION':
                        this.mSortingString.push({
                            "sType": "date_sorter",
                            "bSortable": true
                        });
                        css_rule = "_dateColumn";
                        break;
                    case 'BIRTH_DATE':
                        this.mSortingString.push({
                            "sType": "date_sorter",
                            "bSortable": true
                        });
                        css_rule = "_dateColumn";
                        break;
                    case "SUBMISSION_DATE":
                        this.mSortingString.push({
                            "bSortable": false
                        });
                        css_rule = "_dateColumn";
                        break;
                    case "APPROVAL_DATE":
                        this.mSortingString.push({
                            "bSortable": false
                        });
                        css_rule = "_dateColumn";
                        break;
                    case "ALLOWED_DATE":
                        this.mSortingString.push({
                            "bSortable": false
                        });
                        css_rule = "_dateColumn";
                        break;
                    case "SIGNED_DATE":
                        this.mSortingString.push({
                            "bSortable": false
                        });
                        css_rule = "_dateColumn";
                        break;
                    case "MODIFIED":
                        this.mSortingString.push({
                            "bSortable": false
                        });
                        css_rule = "_dateColumn";
                        break;
                    case "DATE":
                        this.mSortingString.push({
                            "bSortable": false
                        });
                        css_rule = "_dateColumn";
                        break;
                    case "D.DATE":
                        this.mSortingString.push({
                            "bSortable": false
                        });
                        css_rule = "_dateColumn";
                        break;
                    case "E.END":
                        this.mSortingString.push({
                            "bSortable": false
                        });
                        css_rule = "_dateColumn";
                        break;
                    case "A.END":
                        this.mSortingString.push({
                            "bSortable": false
                        });
                        css_rule = "_dateColumn";
                        break;
                    case 'EXPECTED_END':
                        this.mSortingString.push({
                            "sType": "date_sorter",
                            "bSortable": true
                        });
                        css_rule = "_normal";
                        break;
                    case 'ACTUAL_END':
                        this.mSortingString.push({
                            "sType": "date_sorter",
                            "bSortable": true
                        });
                        css_rule = "_normal";
                        break;
                    case 'DISBURSED_IN':
                        this.mSortingString.push({
                            "sType": "date_sorter",
                            "bSortable": true
                        });
                        css_rule = "_normal";
                        break;
                    case 'DISBURSEMENT':
                        this.mSortingString.push({
                            "sType": "date_sorter",
                            "bSortable": true
                        });
                        css_rule = "_normal";
                        break;
                    case 'DATE':
                        this.mSortingString.push({
                            "sType": "date_sorter",
                            "bSortable": true
                        });
                        css_rule = "_normal";
                        break;
                    case 'DATE_OPENED':
                        this.mSortingString.push({
                            "sType": "date_sorter",
                            "bSortable": true
                        });
                        css_rule = "_normal";
                        break;
                    case 'DUE_DATE':
                        this.mSortingString.push({
                            "sType": "date_sorter",
                            "bSortable": true
                        });
                        css_rule = "_normal";
                        break;
                    case 'BALANCE':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'INSTALLMENT':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'INTEREST':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'OUTSTANDING':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'CREDIT':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'DEBIT':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'PAID':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'AMOUNT':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'AMORTIZATION_PART':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'INTEREST_PART':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'NEW_BALANCE':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'LOAN':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'EXPECTED_INTEREST':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'PRINCIPAL_BALANCE':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'PRINCIPAL':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'PAID':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": false
                        });
                        css_rule = "_money";
                        break;
                    case 'P.BALANCE':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": false
                        });
                        css_rule = "_money";
                        break;
                    case 'D.AMOUNT':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": false
                        });
                        css_rule = "_money";
                        break;
                    case 'DISBURSED_AMOUNT':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case 'E.RATE':
                        this.mSortingString.push({
                            "sType": "currency_sorter",
                            "bSortable": true
                        });
                        css_rule = "_money";
                        break;
                    case "INTERESTRATE":
                        this.mSortingString.push({
                            "bSortable": true
                        });
                        css_rule = "rateColumn";
                        break;
                    case "RATE":
                        this.mSortingString.push({
                            "bSortable": true
                        });
                        css_rule = "rateColumn";
                        break;
                    case "INTEREST_RATE_P_A":
                        this.mSortingString.push({
                            "bSortable": true
                        });
                        css_rule = "rateColumn";
                        break;
                    case "LOANID":
                        this.mSortingString.push({
                            "bSortable": true
                        });
                        css_rule = "idTableColumn";
                        break;
                    case "NAME":
                        this.mSortingString.push({
                            "bSortable": true
                        });
                        css_rule = "nameColumn";
                        break;
                    case "SEX":
                        this.mSortingString.push({
                            "bSortable": true
                        });
                        css_rule = "_sex";
                        break;
                    case "PHONE":
                        css_rule = "_phone";
                        this.mSortingString.push({
                            "bSortable": true
                        });
                        break;
                    case 'IMAGE':
                        this.mSortingString.push({
                            "bSortable": false
                        });
                        css_rule = "_tableImage";
                        break;
                    case '#_OF_MEMBERS':
                        this.mSortingString.push({
                            "bSortable": false
                        });
                        css_rule = "numOfMembers";
                        break;
                    case "REMOVE":
                        this.mSortingString.push({
                            "bSortable": false
                        });
                        css_rule = "_IconColumn";
                        break;
                    case "EDIT":
                        this.mSortingString.push({
                            "bSortable": false
                        });
                        css_rule = "text-align-center";
                        break;
                    default:
                        this.mSortingString.push({
                            "bSortable": true
                        });
                        css_rule = "_normal";
                        break;
                }
                css_selector[counter] = css_rule;
                counter++;
            }
            //            // add a class depending on type :
            //            if(property.toUpperCase() === "LOANID" || property.toUpperCase() === "INTERESTRATE")
            //            {
            //                $row.append($('<' + celltype + ' class="' + css_selector[cssCounter] + ' idTableColumn" >').html(data[property]));
            //            }
            //            else
            //            {
            $row.append($('<' + celltype + ' class="' + css_selector[cssCounter] + '" >').html(data[property]));
            // }
        }
        cssCounter++;
    }
    $row.on('click touch', handler);
    $row.attr('data-id', id);
    $rowContainer.append($row);
    return $row;
}
;

function highlightUpdatedCell($cell) {
    var oldColor = $cell.css('background-color');
    $cell.css('background-color', '#66cc00');
    $cell.animate({
        backgroundColor: oldColor
    }, 1500, function () {
        $cell.css('background-color', '');
    });
}
;

function addClassToTableColumn($table, columnNumber, clazz) {
    // arrays in the DOM tree start with index one, not zero, so always add one
    columnNumber += 1;
    $table.find('tr td:nth-child(' + columnNumber + ')').addClass(clazz);
}
;

function addClassToColumnOfTableRow($row, columnNumber, clazz) {
    $row.find('td:nth-child(' + columnNumber + ')').addClass(clazz);
}
;

function addClassToDefaultTableColumn(columnNumber, clazz) {
    $('#defaultTableContainer table').find('tr td:nth-child(' + columnNumber + ')').addClass(clazz);
}
;

function formatCurrency(amount) {
    amount = parseFloat(amount / 100).toFixed(2);
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
;

//
//function formatCurrency(amount) {
//    var negative = amount < 0;
//    //amount = Math.abs(amount);
//    amount = parseFloat(amount / 100).toFixed(2);
//    // amount = Math.floor(amount / 100); // don't display Cents
//    var lastAmount = amount;
//    var display = '';
//    amount = Math.floor(amount / 1000);
//    while (amount > 0) {
//        display = ',' + numberToThreeDigits(lastAmount % 1000) + display;
//        lastAmount = amount;
//        amount = Math.floor(amount / 1000);
//    }
//
//    display = lastAmount + display;
//    if (negative) {
//        display = '-' + display;
//    }
//    return display.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
//    // return display;
//}
//;
function removeThousandCommas(currency) {
    var thousands = currency.split(',');
    return thousands.join('');
}
function unformatCurrency(text) {
//	if (!$.isNumeric(text.substr(-1))) { // the currency code
//		text = text.substr(0, text.length - 4);
//	}
//	return text.replace(/,/g, '') + '00';
    if (!$.isNumeric(text.substr(-1))) { // the currency code
        text = text.substr(0, text.length - 4);
    }
    var numString = text.replace(/,/g, '');
    var numValue = parseFloat(numString) * 100;
    return numValue;
}
;

function unformatCurrencyWithDecimals(text) {
    if (!$.isNumeric(text.substr(-1))) { // the currency code
        text = text.substr(0, text.length - 4);
    }
    var numString = text.replace(/,/g, '');
    var numValue = parseFloat(numString) * 100;
    return numValue;
}
;

function getMonth(month_number) {
    return months[month_number - 1];
}
;
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(date) {
    var dateObject = '';
    try {
        var dateObject = new Date(parseInt(date));
        if (isNaN(dateObject.getTime())) {
            // date is not valid
            return '';
        } else {
            // date is valid
            return numberToTwoDigits(dateObject.getDate()) + " " + months[dateObject.getMonth()] + " " + dateObject.getFullYear();
        }
    } catch (err) {
        return '';
    }
}
;

function unformatDate(text) {
    var parts = text.split(' ');
    var day = parseInt(parts[0]);
    var month = months.indexOf(parts[1]);
    var year = parseInt(parts[2]);
    var date = new Date(year, month, day, 12, 0, 0);
    return date;
}
;

function formatDateNarrow(date) {
    var dateObject = new Date(date);
    return numberToTwoDigits(dateObject.getDate()) + "/" + months[dateObject.getMonth()] + "/" + dateObject.getFullYear();
}
;

function formatDateShort(date) {
    var dateObject = new Date(date);
    return numberToTwoDigits(dateObject.getDate()) + "/" + numberToTwoDigits(dateObject.getMonth() + 1) + "/" + dateObject.getFullYear();
}
;

function formatLocalDate() {
    var now = new Date(),
            tzo = -now.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function (num) {
                var norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };
    return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + 'T' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()) + dif + pad(tzo / 60) + ':' + pad(tzo % 60);
}
;

function formatPercentage(amount) {
    return (amount / 1000).toFixed(2);
}
;

function formatPercentageShort(amount) {
    return Math.round(amount / 1000);
}
;

function unformatPercentage(text) {
    if (text.endsWith(' %')) {
        text = text.substr(0, text.length - 2);
    }

    var index = text.indexOf('.');
    if (index < 0) {
        return text + "000";
    } else {
        return text.replace(/\./g, '') + "000".substr(0, 4 - (text.length - index));
    }
}
;

function unformatPercentageCustom(text) {
    if (text.endsWith(' %')) {
        text = text.substr(0, text.length - 2);
    }

    var index = text.indexOf('.');
    if (index < 0) {
        return text + "00";
    } else {
        return text.replace(/\./g, '') + "00".substr(0, 4 - (text.length - index));
    }
}
;

function numberToTwoDigits(number) {
    return (number < 10 ? "0" : "") + number;
}
;

function numberToThreeDigits(number) {
    return (number < 100 ? "0" : "") + numberToTwoDigits(number);
}
;

function getTargetFromObject($item, object) {
    var targets = $item.data('target').split('.');
    var target = object;
    $.each(targets, function (index, item) {
        target = target[item];
    });
    return target;
}
;

function toggleElementFocus(element) {
    element.focus();
}
;

function exists(obj) {
    return typeof (obj) !== "undefined" && obj !== null;
}
;

function getRowContainer(tableContainerSelector, titles, searchable, cssClass) {
    var $tableContainer = $(tableContainerSelector);
    $tableContainer.empty();
    showContent($tableContainer);
    var $table = getEmptyTable(true);
    $tableContainer.append($table);
    if (cssClass) {
        $table.addClass(cssClass);
    }
    var $rowContainer = $table.find('thead');
    mSortingString = [];
    css_selector = [];
    addRow($rowContainer, titles);
    if (searchable === true)
        addSearchRow($rowContainer, titles);
    $rowContainer = $table.find('tbody');
    $tableContainer.append($('<p class="content" id="tableMessage"></p>'));
    return $rowContainer;
}
;

function getDefaultRowContainer(titles, asDataTable, config, cssClass) {
    var $rowContainer = getRowContainer('#defaultTableContainer', titles, false, cssClass);
    if (exists(asDataTable) && asDataTable === true) {
        return attachDatatable($rowContainer, config);
    }
    return $rowContainer;
}
;

function addSearchRow($rowContainer, data, object, handler, id) {
    var celltype = 'td';
    //$rowContainer.is('thead') ? 'th' : 'td';
    var $row = $('<tr>');
    $row.data('object', object);
    for (var property in data) {
        if (data.hasOwnProperty(property)) {

            var _property = data[property];
            _property = _property.trim().replace(/ /g, "_");
            var decider = _property.replace(/&nbsp;/gi, '_').toUpperCase();
            switch (decider) {
                case "IMAGE":
                    $row.append($('<' + celltype + '>'));
                    break;
                case "REMOVE":
                    $row.append($('<' + celltype + '>'));
                    break;
                case "EDIT":
                    $row.append($('<' + celltype + '>'));
                    break;
                default:
                    $row.append($('<' + celltype + '>').html('<input type="text" class="form-control tableSearchField" title="Search ' + data[property] + '" />'));

                    break;
            }



        }
    }
    $row.off();
    //$row.on('click touch', handler);
    $row.attr('data-id', id);
    $rowContainer.append($row);
    return $row;
}
;

function attachDatatable($rowContainer, config) {

    if (!exists(config)) {
        config = {
            searching: true,
            paging: true,
            ordering: false
        };
    }
    $rowContainer.parent().DataTable({
        //searching:config.searching,
        paging: config.paging,
        //ordering: config.ordering,
        //     "oLanguage": {
        //     "sStripClasses": "",
        //     "sSearch": "",
        //     "sSearchPlaceholder": "Enter Keywords Here",
        //     "sInfo": "_START_ -_END_ of _TOTAL_",
        //     "sLengthMenu": '<span>Rows per p searching:config.searching,
        //         paging:config.paging,
        //         ordering: config.orderingage:</span><select class="browser-default">' +
        //     '<option value="10">10</option>' +
        //     '<option value="20">20</option>' +
        //     '<option value="30">30</option>' +
        //     '<option value="40">40</option>' +
        //     '<option value="50">50</option>' +
        //     '<option value="-1">All</option>' +
        //     '</select></div>'
        //     },
        //     bAutoWidth: false,
        scrollY: '50vh'
                //scrollCollapse:false,
                //paging:true,
                //scrollX:true
    }); /**/
    return $rowContainer;
}

function getDefaultRowContainer(titles, searchable, cssClass) {
    return getRowContainer('#defaultTableContainer', titles, searchable, cssClass);
}
;
var _table = null;

var initialize_specific_datatable = function (table, tableSpec, htmlTemplate) {
    var config = {};
    switch (tableSpec) {
        case datatables.editGroup:
            config = {
                "autoWidth": false,
                "dom": '<i<"toolbar"><t>lp>',
                initComplete: function () {
                    $("div.toolbar").html(htmlTemplate);
                },
                "language": {
                    "info": "_TOTAL_ Total Members"
                },
                "scrollX": true,
                "iDisplayLength": 25,
                "aoColumns": this.mSortingString,
                "bInfo": false
            };
            break;
        default:
            break;
    }
    if (table.find('theader '))
        _table = table.DataTable(config);
    _table.columns().every(function () {
        var that = this;
        $('input', this.header()).on('keyup change', function () {
            if (that.search() !== this.value) {
                that.search(this.value).draw();
            }
        });
    });
    $('.dataTables_filter input').addClass(' search-query');
    $('.dataTables_filter input').addClass('form-control');
    $('.dataTables_filter input').attr('placeholder', 'What are you searching for ');
    $('.dataTables_filter input').attr('type', 'search');
    return _table;
};

var initialize_datatable = function (table, config) {
    if (config) {
        config = config;
        //$.extend($.fn.dataTable.defaults, config);
    } else {
        config = {
            "dom": '<i<t>lp>',
            "language": {
                "info": "_TOTAL_ Total Entries"
            },
            "scrollX": true,
            "iDisplayLength": 25,
            "aoColumns": this.mSortingString
                    // "sClass"
        };
        //$.extend($.fn.dataTable.defaults, {});
    }
    if (table.find('theader '))
        _table = table.DataTable(config);
    _table.columns().every(function () {
        var that = this;
        $('input', this.header()).on('keyup change', function () {
            if (that.search() !== this.value) {
                that.search(this.value).draw();
            }
        });
    });
    $('.dataTables_filter input').addClass(' search-query');
    $('.dataTables_filter input').addClass('form-control');
    $('.dataTables_filter input').attr('placeholder', 'What are you searching for ');
    $('.dataTables_filter input').attr('type', 'search');
    return _table;
};

function initDefaultContent(title) {
    hideContent();
    $('h3.page-header').text(title);
    $('h3.page-header').show();
    $('h4.sub-header').hide();
}
;

function showCockpitHeader() {
    $('h4.sub-header').hide();
    hideContent();
    $('#headerBreadCrumb').show();
}
;

function updateNavigationBreadCrumb(arrayOfLinks) {

}
;

function updateDefaultSortableTable() {
    $('#defaultTableContainer table').trigger('updateAll');
}
;
var MessageType = Object.freeze({
    SUCCESS: 'alert-success',
    INFO: 'alert-info',
    WARNING: 'alert-warning',
    DANGER: 'alert-danger'
});

function message(title, text, type, timeout) {
    timeout = timeout || 2000;
    $('#messagebox strong').text(title);
    $('#messagebox span').text(text);
    $("#messagebox").removeClass();
    $("#messagebox").addClass('alert ' + type);
    //    $("#messagebox").fadeTo(timeout, 500).slideUp(500);
    $("#messagebox").slideDown(500).delay(timeout).slideUp(500);
}
;

function getEmptyTable(sortable) {
    //the defaultDataTable selector is used when aligning the width of the cells for the scrollable functionality
    var $table = $('<table class="table table-striped table-bordered" id="defaultDataTable">');
    if (sortable) {
        $table.addClass('tablesorter tablesorter-bootstrap');
    }
    $table.append($('<thead>'));
    $table.append($('<tbody>'));
    return $table;
}
;

function manageErrors(err) {

    // console.log('global error manager callback not implemented');
    // console.log(err);
}

function capitalize(text) {
    if (!exists(text)) {
        return null;
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
;

function tableMessage(text) {
    $('#tableMessage').text(text);
    $('#tableMessage').show();
}
;

function getDefaultTableSorter(sorting) {
    var sortList;
    if ("unsorted" !== sorting) {
        sortList = [
            [0, 1]
        ]; // first column, descending order (ascending would be 0 at second parameter)
    }

    return {
        //        debug           : true,
        theme: "bootstrap",
        widthFixed: false,
        headerTemplate: '{content} {icon}',
        sortReset: true,
        // third click on the header will reset column to default - unsorted
        sortRestart: true,
        // Resets the sort direction so that clicking on an unsorted column will sort in the sortInitialOrder direction.
        sortList: sortList,
        widgets: ["uitheme", "filter", "zebra"],
        widgetOptions: {
            filter_reset: ".reset",
            filter_cssFilter: "form-control"
        }
    };
}
;

function sortAssociateArray(dataArray) {
    if (Array.isArray(dataArray)) {
        return dataArray.sort(function (a, b) {
            return a.data - b.data;
        });
    }
    return null;
}
;
var status_bar_disable = false;

function statusbar(text) {
    // print text, wait two seconds, fadeout text within two seconds, empty text
    var $statusbar = $('#statusbar');
    $statusbar.text(text);
    // $('#footerContainer').show().delay(2000).fadeOut();
    if (status_bar_disable === false)
        $('#footerContainer').show().delay(2000).fadeOut();
}
;

function getSidebarSubitemSelector(parent, handler, action) {
    return 'li[data-parent="' + parent + '"][data-handler="' + handler + '"][data-action="' + action + '"] a';
}
;

function handleNonSideMenuHistoryAction(handler, action, args)
{
    handlers[handler][action](args);
}
;

function addHistory(title, url, selector, args) {
    if (doHistoryUpdate) {
        history.pushState({
            selector: selector
        }, title, url);
    } else {
        doHistoryUpdate = true;
    }
}
;

function printData() {
    tab = $('#defaultTableContainer table').get(0); // id of table
    newWin = window.open("");
    var htmlToPrint = '' + '<style type="text/css">' + 'table th, table td {' + 'border:1px solid #000;' + 'padding;0.5em;' + '}' + '</style>';
    htmlToPrint += tab.outerHTML;
    htmlToPrint = "<h1>" + $("#hiddenPrintedTitle").val() + "</h1>" + htmlToPrint;
    newWin.document.write(htmlToPrint);
    newWin.print();
    newWin.close();
}
;

function allLetter(inputtxt) {
    var letters = /^[A-Za-z]+$/;
    if (inputtxt.value.match(letters)) {
        return true;
    } else {
        return false;
    }
}
;
exportArea = function (exportType, contentDiv, title) {

    switch (exportType) {
        case 'image':
            //TODO: Functionality Missing
            break;
        case 'pdf':

            newWin = window.open("");
            var htmlToPrint = '' + '<style type="text/css">' + 'table th, table td {' + 'border:1px solid #000;' + 'padding;0.5em;' + '}' + '</style>';
            htmlToPrint += $("#" + contentDiv).html();
            htmlToPrint += $("#" + contentDiv + "-details").fadeIn('fast').html();
            $("#" + contentDiv + "-details").fadeOut('fast');
            htmlToPrint = "<h1> " + title + " </h1>" + htmlToPrint;
            newWin.document.write(htmlToPrint);
            newWin.print();
            newWin.close();
            break;
    }
};
calcuate_percentage = function (total, number) {

    var percentage = Math.round((number / total) * 100);
    return percentage;
};
generatePassword = function () {
    var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};
// Show Fading Message;
showFadingMessage = function (msg) {
    $("#alertDiv").html(msg).show().delay(4000).fadeOut();
};

showDialogPopupWithHandlers = function (headerMsg, bodyMsg, PostiveActionButtonText, PositiveActionButtonhandler, NegativeActionButtonText, NegativeActionButtonHandler, showOnlyNegativeButton) {
    $('#dailogModalBoxHeader').html('');
    $('#dailogModalBoxHeader').html('<strong>' + headerMsg + '</strong> <button type="button" class="close" data-dismiss="modal" style="color:white;opacity:1;">x</button>');
    $('#dialogModalBoxContent').html('').html('<strong>' + bodyMsg + '</strong>');
    $('#dialogModalBoxPositiveActionBtn').text('').text(PostiveActionButtonText);
    $('#dialogModalBoxPositiveActionBtn').off('click touch').on('click touch', function () {
        $('#dialogModalBox').modal('hide');
        PositiveActionButtonhandler();
    });
    $('#dialogModalBoxNegativeActionBtn').text('').text(NegativeActionButtonText);
    $('#dialogModalBoxNegativeActionBtn').off('click touch').on('click touch', function () {
        $('#dialogModalBox').modal('hide');
        NegativeActionButtonHandler();
    });
    $('#dialogModalBoxPositiveActionBtn').show();
    if (showOnlyNegativeButton) {
        $('#dialogModalBoxPositiveActionBtn').hide();
    }
    $('#dialogModalBox').modal('show');
};
showDialogHtmlPopupWithHandlers = function (headerMsg, htmlBody, PostiveActionButtonText, PositiveActionButtonhandler, NegativeActionButtonText, NegativeActionButtonHandler, showOnlyNegativeButton) {
    $('#dailogModalBoxHeader').html('');
    $('#dailogModalBoxHeader').html('<strong>' + headerMsg + '</strong> <button type="button" class="close" data-dismiss="modal">x</button>');
    $('#dialogModalBoxContent').html('').html(htmlBody);
    $('#dialogModalBoxPositiveActionBtn').text('').text(PostiveActionButtonText);
    $('#dialogModalBoxPositiveActionBtn').off('click touch').on('click touch', function () {
        $('#dialogModalBox').modal('hide');
        PositiveActionButtonhandler();
    });
    $('#dialogModalBoxNegativeActionBtn').text('').text(NegativeActionButtonText);
    $('#dialogModalBoxNegativeActionBtn').off('click touch').on('click touch', function () {
        $('#dialogModalBox').modal('hide');
        NegativeActionButtonHandler();
    });
    $('#dialogModalBoxPositiveActionBtn').show();
    if (showOnlyNegativeButton) {
        $('#dialogModalBoxPositiveActionBtn').hide();
    }
    $('#dialogModalBox').modal('show');
};

showDialogPopupWithReturnTypes = function (headerMsg, bodyMsg, PostiveActionButtonText, PositiveActionButtonResponse, NegativeActionButtonText, NegativeActionButtonResponse) {

};

showAlertMessage = function (msg, msgType) {
    $('body').scrollTop(0);
    $("#messageBoxHeader").parent().removeClass();
    $("#messageBoxHeader").removeClass();
    $("#messageBoxHeader").addClass(msgType);
    switch (msgType) {
        case AlertTypes.danger:
            $("#messageBoxHeader").addClass('dangerMsgBckGround');
            $("#messageBoxHeader").parent().addClass('dangerMsgBckGround');
            $("#messageBoxHeader").html('<span class="mdl-color-text--white material-icons" role="presentation">error</span> <strong>' + msg + '</strong> <button type="button" class="close" data-dismiss="modal" style="opacity: 1;"><span class="mdl-color-text--white material-icons" role="presentation">cancel</span></button>');
            $('#messageBox').modal('toggle');
            break;
        case AlertTypes.warning:
            $("#messageBoxHeader").addClass('warningMsgBckGround');
            $("#messageBoxHeader").parent().addClass('warningMsgBckGround');
            $("#messageBoxHeader").html('<span class="mdl-color-text--white material-icons" role="presentation">warning</span> <strong>' + msg + '</strong> <button type="button" class="close" data-dismiss="modal" style="opacity: 1;"><span class="mdl-color-text--white material-icons" role="presentation">cancel</span></button>');
            $('#messageBox').modal('toggle');
            break;
        case AlertTypes.info:
            $("#messageBoxHeader").addClass('infoMsgBckGround');
            $("#messageBoxHeader").parent().addClass('infoMsgBckGround');
            $("#messageBoxHeader").html('<span class="mdl-color-text--white material-icons" role="presentation">info</span> <strong>' + msg + '</strong>');
            $('#messageBox').modal('show');
            setTimeout(function () {
                $('#messageBox').modal('hide');
            }, 3000);
            break;
        case AlertTypes.success:
            $("#messageBoxHeader").addClass('successMsgBckGround');
            $("#messageBoxHeader").parent().addClass('successMsgBckGround');
            $("#messageBoxHeader").html('<span class="mdl-color-text--white material-icons" role="presentation">check_circle</span> <strong>' + msg + '</strong>');
            $('#messageBox').modal('show');
            setTimeout(function () {
                $('#messageBox').modal('hide');
            }, 3000);
            break;
        default:
            //$('#messageBox').modal('show').delay(8000).modal('hide');
            break;
    }
};
showNetworkError = function () {
    $('body').append('<div id="network-status">' + 'Please check your internet connection and try again' + '<span class="dismiss">&Cross;</span>' + '</div>');
    $('#network-status .dismiss').on('click', function () {
        $('#network-status').remove();
    });
};
showNetworkError();
removeCommas = function (str) {
    return (str.replace(/,/g, ""));
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

clearExportButtons = function () {
    // console.log("clear export buttons called");
    $('#exportActionButtons').hide();
    $('#exportActionPrintButton').hide();
    $('#exportActionPrintButton').off('click touch');
    $('#exportActionsXlsButton').hide();
    $('#exportActionsXlsButton').off('click touch');
};

populatePhoneInputFlagAddon = function ($phoneInputField, $buttonSelector, $listSelector) {
    var countryPhoneCodes = {
        "BD": "880",
        "BE": "32",
        "BF": "226",
        "BG": "359",
        "BA": "387",
        "BB": "+1-246",
        "WF": "681",
        "BL": "590",
        "BM": "+1-441",
        "BN": "673",
        "BO": "591",
        "BH": "973",
        "BI": "257",
        "BJ": "229",
        "BT": "975",
        "JM": "+1-876",
        "BV": "",
        "BW": "267",
        "WS": "685",
        "BQ": "599",
        "BR": "55",
        "BS": "+1-242",
        "JE": "+44-1534",
        "BY": "375",
        "BZ": "501",
        "RU": "7",
        "RW": "250",
        "RS": "381",
        "TL": "670",
        "RE": "262",
        "TM": "993",
        "TJ": "992",
        "RO": "40",
        "TK": "690",
        "GW": "245",
        "GU": "+1-671",
        "GT": "502",
        "GS": "",
        "GR": "30",
        "GQ": "240",
        "GP": "590",
        "JP": "81",
        "GY": "592",
        "GG": "+44-1481",
        "GF": "594",
        "GE": "995",
        "GD": "+1-473",
        "GB": "44",
        "GA": "241",
        "SV": "503",
        "GN": "224",
        "GM": "220",
        "GL": "299",
        "GI": "350",
        "GH": "233",
        "OM": "968",
        "TN": "216",
        "JO": "962",
        "HR": "385",
        "HT": "509",
        "HU": "36",
        "HK": "852",
        "HN": "504",
        "HM": " ",
        "VE": "58",
        "PR": "+1-787 and 1-939",
        "PS": "970",
        "PW": "680",
        "PT": "351",
        "SJ": "47",
        "PY": "595",
        "IQ": "964",
        "PA": "507",
        "PF": "689",
        "PG": "675",
        "PE": "51",
        "PK": "92",
        "PH": "63",
        "PN": "870",
        "PL": "48",
        "PM": "508",
        "ZM": "260",
        "EH": "212",
        "EE": "372",
        "EG": "20",
        "ZA": "27",
        "EC": "593",
        "IT": "39",
        "VN": "84",
        "SB": "677",
        "ET": "251",
        "SO": "252",
        "ZW": "263",
        "SA": "966",
        "ES": "34",
        "ER": "291",
        "ME": "382",
        "MD": "373",
        "MG": "261",
        "MF": "590",
        "MA": "212",
        "MC": "377",
        "UZ": "998",
        "MM": "95",
        "ML": "223",
        "MO": "853",
        "MN": "976",
        "MH": "692",
        "MK": "389",
        "MU": "230",
        "MT": "356",
        "MW": "265",
        "MV": "960",
        "MQ": "596",
        "MP": "+1-670",
        "MS": "+1-664",
        "MR": "222",
        "IM": "+44-1624",
        "UG": "256",
        "TZ": "255",
        "MY": "60",
        "MX": "52",
        "IL": "972",
        "FR": "33",
        "IO": "246",
        "SH": "290",
        "FI": "358",
        "FJ": "679",
        "FK": "500",
        "FM": "691",
        "FO": "298",
        "NI": "505",
        "NL": "31",
        "NO": "47",
        "NA": "264",
        "VU": "678",
        "NC": "687",
        "NE": "227",
        "NF": "672",
        "NG": "234",
        "NZ": "64",
        "NP": "977",
        "NR": "674",
        "NU": "683",
        "CK": "682",
        "XK": "",
        "CI": "225",
        "CH": "41",
        "CO": "57",
        "CN": "86",
        "CM": "237",
        "CL": "56",
        "CC": "61",
        "CA": "1",
        "CG": "242",
        "CF": "236",
        "CD": "243",
        "CZ": "420",
        "CY": "357",
        "CX": "61",
        "CR": "506",
        "CW": "599",
        "CV": "238",
        "CU": "53",
        "SZ": "268",
        "SY": "963",
        "SX": "599",
        "KG": "996",
        "KE": "254",
        "SS": "211",
        "SR": "597",
        "KI": "686",
        "KH": "855",
        "KN": "+1-869",
        "KM": "269",
        "ST": "239",
        "SK": "421",
        "KR": "82",
        "SI": "386",
        "KP": "850",
        "KW": "965",
        "SN": "221",
        "SM": "378",
        "SL": "232",
        "SC": "248",
        "KZ": "7",
        "KY": "+1-345",
        "SG": "65",
        "SE": "46",
        "SD": "249",
        "DO": "+1-809 and 1-829",
        "DM": "+1-767",
        "DJ": "253",
        "DK": "45",
        "VG": "+1-284",
        "DE": "49",
        "YE": "967",
        "DZ": "213",
        "US": "1",
        "UY": "598",
        "YT": "262",
        "UM": "1",
        "LB": "961",
        "LC": "+1-758",
        "LA": "856",
        "TV": "688",
        "TW": "886",
        "TT": "+1-868",
        "TR": "90",
        "LK": "94",
        "LI": "423",
        "LV": "371",
        "TO": "676",
        "LT": "370",
        "LU": "352",
        "LR": "231",
        "LS": "266",
        "TH": "66",
        "TF": "",
        "TG": "228",
        "TD": "235",
        "TC": "+1-649",
        "LY": "218",
        "VA": "379",
        "VC": "+1-784",
        "AE": "971",
        "AD": "376",
        "AG": "+1-268",
        "AF": "93",
        "AI": "+1-264",
        "VI": "+1-340",
        "IS": "354",
        "IR": "98",
        "AM": "374",
        "AL": "355",
        "AO": "244",
        "AQ": "",
        "AS": "+1-684",
        "AR": "54",
        "AU": "61",
        "AT": "43",
        "AW": "297",
        "IN": "91",
        "AX": "+358-18",
        "AZ": "994",
        "IE": "353",
        "ID": "62",
        "UA": "380",
        "QA": "974",
        "MZ": "258"
    };
    var countryNames = {
        "BD": "Bangladesh",
        "BE": "Belgium",
        "BF": "Burkina Faso",
        "BG": "Bulgaria",
        "BA": "Bosnia and Herzegovina",
        "BB": "Barbados",
        "WF": "Wallis and Futuna",
        "BL": "Saint Barthelemy",
        "BM": "Bermuda",
        "BN": "Brunei",
        "BO": "Bolivia",
        "BH": "Bahrain",
        "BI": "Burundi",
        "BJ": "Benin",
        "BT": "Bhutan",
        "JM": "Jamaica",
        "BV": "Bouvet Island",
        "BW": "Botswana",
        "WS": "Samoa",
        "BQ": "Bonaire, Saint Eustatius and Saba ",
        "BR": "Brazil",
        "BS": "Bahamas",
        "JE": "Jersey",
        "BY": "Belarus",
        "BZ": "Belize",
        "RU": "Russia",
        "RW": "Rwanda",
        "RS": "Serbia",
        "TL": "East Timor",
        "RE": "Reunion",
        "TM": "Turkmenistan",
        "TJ": "Tajikistan",
        "RO": "Romania",
        "TK": "Tokelau",
        "GW": "Guinea-Bissau",
        "GU": "Guam",
        "GT": "Guatemala",
        "GS": "South Georgia and the South Sandwich Islands",
        "GR": "Greece",
        "GQ": "Equatorial Guinea",
        "GP": "Guadeloupe",
        "JP": "Japan",
        "GY": "Guyana",
        "GG": "Guernsey",
        "GF": "French Guiana",
        "GE": "Georgia",
        "GD": "Grenada",
        "GB": "United Kingdom",
        "GA": "Gabon",
        "SV": "El Salvador",
        "GN": "Guinea",
        "GM": "Gambia",
        "GL": "Greenland",
        "GI": "Gibraltar",
        "GH": "Ghana",
        "OM": "Oman",
        "TN": "Tunisia",
        "JO": "Jordan",
        "HR": "Croatia",
        "HT": "Haiti",
        "HU": "Hungary",
        "HK": "Hong Kong",
        "HN": "Honduras",
        "HM": "Heard Island and McDonald Islands",
        "VE": "Venezuela",
        "PR": "Puerto Rico",
        "PS": "Palestinian Territory",
        "PW": "Palau",
        "PT": "Portugal",
        "SJ": "Svalbard and Jan Mayen",
        "PY": "Paraguay",
        "IQ": "Iraq",
        "PA": "Panama",
        "PF": "French Polynesia",
        "PG": "Papua New Guinea",
        "PE": "Peru",
        "PK": "Pakistan",
        "PH": "Philippines",
        "PN": "Pitcairn",
        "PL": "Poland",
        "PM": "Saint Pierre and Miquelon",
        "ZM": "Zambia",
        "EH": "Western Sahara",
        "EE": "Estonia",
        "EG": "Egypt",
        "ZA": "South Africa",
        "EC": "Ecuador",
        "IT": "Italy",
        "VN": "Vietnam",
        "SB": "Solomon Islands",
        "ET": "Ethiopia",
        "SO": "Somalia",
        "ZW": "Zimbabwe",
        "SA": "Saudi Arabia",
        "ES": "Spain",
        "ER": "Eritrea",
        "ME": "Montenegro",
        "MD": "Moldova",
        "MG": "Madagascar",
        "MF": "Saint Martin",
        "MA": "Morocco",
        "MC": "Monaco",
        "UZ": "Uzbekistan",
        "MM": "Myanmar",
        "ML": "Mali",
        "MO": "Macao",
        "MN": "Mongolia",
        "MH": "Marshall Islands",
        "MK": "Macedonia",
        "MU": "Mauritius",
        "MT": "Malta",
        "MW": "Malawi",
        "MV": "Maldives",
        "MQ": "Martinique",
        "MP": "Northern Mariana Islands",
        "MS": "Montserrat",
        "MR": "Mauritania",
        "IM": "Isle of Man",
        "UG": "Uganda",
        "TZ": "Tanzania",
        "MY": "Malaysia",
        "MX": "Mexico",
        "IL": "Israel",
        "FR": "France",
        "IO": "British Indian Ocean Territory",
        "SH": "Saint Helena",
        "FI": "Finland",
        "FJ": "Fiji",
        "FK": "Falkland Islands",
        "FM": "Micronesia",
        "FO": "Faroe Islands",
        "NI": "Nicaragua",
        "NL": "Netherlands",
        "NO": "Norway",
        "NA": "Namibia",
        "VU": "Vanuatu",
        "NC": "New Caledonia",
        "NE": "Niger",
        "NF": "Norfolk Island",
        "NG": "Nigeria",
        "NZ": "New Zealand",
        "NP": "Nepal",
        "NR": "Nauru",
        "NU": "Niue",
        "CK": "Cook Islands",
        "XK": "Kosovo",
        "CI": "Ivory Coast",
        "CH": "Switzerland",
        "CO": "Colombia",
        "CN": "China",
        "CM": "Cameroon",
        "CL": "Chile",
        "CC": "Cocos Islands",
        "CA": "Canada",
        "CG": "Republic of the Congo",
        "CF": "Central African Republic",
        "CD": "Democratic Republic of the Congo",
        "CZ": "Czech Republic",
        "CY": "Cyprus",
        "CX": "Christmas Island",
        "CR": "Costa Rica",
        "CW": "Curacao",
        "CV": "Cape Verde",
        "CU": "Cuba",
        "SZ": "Swaziland",
        "SY": "Syria",
        "SX": "Sint Maarten",
        "KG": "Kyrgyzstan",
        "KE": "Kenya",
        "SS": "South Sudan",
        "SR": "Suriname",
        "KI": "Kiribati",
        "KH": "Cambodia",
        "KN": "Saint Kitts and Nevis",
        "KM": "Comoros",
        "ST": "Sao Tome and Principe",
        "SK": "Slovakia",
        "KR": "South Korea",
        "SI": "Slovenia",
        "KP": "North Korea",
        "KW": "Kuwait",
        "SN": "Senegal",
        "SM": "San Marino",
        "SL": "Sierra Leone",
        "SC": "Seychelles",
        "KZ": "Kazakhstan",
        "KY": "Cayman Islands",
        "SG": "Singapore",
        "SE": "Sweden",
        "SD": "Sudan",
        "DO": "Dominican Republic",
        "DM": "Dominica",
        "DJ": "Djibouti",
        "DK": "Denmark",
        "VG": "British Virgin Islands",
        "DE": "Germany",
        "YE": "Yemen",
        "DZ": "Algeria",
        "US": "United States",
        "UY": "Uruguay",
        "YT": "Mayotte",
        "UM": "United States Minor Outlying Islands",
        "LB": "Lebanon",
        "LC": "Saint Lucia",
        "LA": "Laos",
        "TV": "Tuvalu",
        "TW": "Taiwan",
        "TT": "Trinidad and Tobago",
        "TR": "Turkey",
        "LK": "Sri Lanka",
        "LI": "Liechtenstein",
        "LV": "Latvia",
        "TO": "Tonga",
        "LT": "Lithuania",
        "LU": "Luxembourg",
        "LR": "Liberia",
        "LS": "Lesotho",
        "TH": "Thailand",
        "TF": "French Southern Territories",
        "TG": "Togo",
        "TD": "Chad",
        "TC": "Turks and Caicos Islands",
        "LY": "Libya",
        "VA": "Vatican",
        "VC": "Saint Vincent and the Grenadines",
        "AE": "United Arab Emirates",
        "AD": "Andorra",
        "AG": "Antigua and Barbuda",
        "AF": "Afghanistan",
        "AI": "Anguilla",
        "VI": "U.S. Virgin Islands",
        "IS": "Iceland",
        "IR": "Iran",
        "AM": "Armenia",
        "AL": "Albania",
        "AO": "Angola",
        "AQ": "Antarctica",
        "AS": "American Samoa",
        "AR": "Argentina",
        "AU": "Australia",
        "AT": "Austria",
        "AW": "Aruba",
        "IN": "India",
        "AX": "Aland Islands",
        "AZ": "Azerbaijan",
        "IE": "Ireland",
        "ID": "Indonesia",
        "UA": "Ukraine",
        "QA": "Qatar",
        "MZ": "Mozambique"
    };
    var allCountriesData = [{
            "name": "Uganda",
            "dial_code": "+256",
            "code": "UG"
        }, {
            "name": "Kenya",
            "dial_code": "+254",
            "code": "KE"
        }, {
            "name": "Tanzania, United Republic of",
            "dial_code": "+255",
            "code": "TZ"
        }, {
            "name": "Afghanistan",
            "dial_code": "+93",
            "code": "AF"
        }, {
            "name": "Albania",
            "dial_code": "+355",
            "code": "AL"
        }, {
            "name": "Algeria",
            "dial_code": "+213",
            "code": "DZ"
        }, {
            "name": "AmericanSamoa",
            "dial_code": "+1 684",
            "code": "AS"
        }, {
            "name": "Andorra",
            "dial_code": "+376",
            "code": "AD"
        }, {
            "name": "Angola",
            "dial_code": "+244",
            "code": "AO"
        }, {
            "name": "Anguilla",
            "dial_code": "+1 264",
            "code": "AI"
        }, {
            "name": "Antigua and Barbuda",
            "dial_code": "+1268",
            "code": "AG"
        }, {
            "name": "Argentina",
            "dial_code": "+54",
            "code": "AR"
        }, {
            "name": "Armenia",
            "dial_code": "+374",
            "code": "AM"
        }, {
            "name": "Aruba",
            "dial_code": "+297",
            "code": "AW"
        }, {
            "name": "Australia",
            "dial_code": "+61",
            "code": "AU"
        }, {
            "name": "Austria",
            "dial_code": "+43",
            "code": "AT"
        }, {
            "name": "Azerbaijan",
            "dial_code": "+994",
            "code": "AZ"
        }, {
            "name": "Bahamas",
            "dial_code": "+1 242",
            "code": "BS"
        }, {
            "name": "Bahrain",
            "dial_code": "+973",
            "code": "BH"
        }, {
            "name": "Bangladesh",
            "dial_code": "+880",
            "code": "BD"
        }, {
            "name": "Barbados",
            "dial_code": "+1 246",
            "code": "BB"
        }, {
            "name": "Belarus",
            "dial_code": "+375",
            "code": "BY"
        }, {
            "name": "Belgium",
            "dial_code": "+32",
            "code": "BE"
        }, {
            "name": "Belize",
            "dial_code": "+501",
            "code": "BZ"
        }, {
            "name": "Benin",
            "dial_code": "+229",
            "code": "BJ"
        }, {
            "name": "Bermuda",
            "dial_code": "+1 441",
            "code": "BM"
        }, {
            "name": "Bhutan",
            "dial_code": "+975",
            "code": "BT"
        }, {
            "name": "Bolivia, Plurinational State of",
            "dial_code": "+591",
            "code": "BO"
        }, {
            "name": "Bosnia and Herzegovina",
            "dial_code": "+387",
            "code": "BA"
        }, {
            "name": "Botswana",
            "dial_code": "+267",
            "code": "BW"
        }, {
            "name": "Brazil",
            "dial_code": "+55",
            "code": "BR"
        }, {
            "name": "Brunei Darussalam",
            "dial_code": "+673",
            "code": "BN"
        }, {
            "name": "British Indian Ocean Territory",
            "dial_code": "+246",
            "code": "IO"
        }, {
            "name": "Bulgaria",
            "dial_code": "+359",
            "code": "BG"
        }, {
            "name": "Burkina Faso",
            "dial_code": "+226",
            "code": "BF"
        }, {
            "name": "Burundi",
            "dial_code": "+257",
            "code": "BI"
        }, {
            "name": "Cambodia",
            "dial_code": "+855",
            "code": "KH"
        }, {
            "name": "Cameroon",
            "dial_code": "+237",
            "code": "CM"
        }, {
            "name": "Canada",
            "dial_code": "+1",
            "code": "CA"
        }, {
            "name": "Cape Verde",
            "dial_code": "+238",
            "code": "CV"
        }, {
            "name": "Cayman Islands",
            "dial_code": "+ 345",
            "code": "KY"
        }, {
            "name": "Central African Republic",
            "dial_code": "+236",
            "code": "CF"
        }, {
            "name": "Chad",
            "dial_code": "+235",
            "code": "TD"
        }, {
            "name": "Chile",
            "dial_code": "+56",
            "code": "CL"
        }, {
            "name": "China",
            "dial_code": "+86",
            "code": "CN"
        }, {
            "name": "Christmas Island",
            "dial_code": "+61",
            "code": "CX"
        }, {
            "name": "Cocos (Keeling) Islands",
            "dial_code": "+61",
            "code": "CC"
        }, {
            "name": "Colombia",
            "dial_code": "+57",
            "code": "CO"
        }, {
            "name": "Comoros",
            "dial_code": "+269",
            "code": "KM"
        }, {
            "name": "Congo",
            "dial_code": "+242",
            "code": "CG"
        }, {
            "name": "Congo, The Democratic Republic of the",
            "dial_code": "+243",
            "code": "CD"
        }, {
            "name": "Cook Islands",
            "dial_code": "+682",
            "code": "CK"
        }, {
            "name": "Costa Rica",
            "dial_code": "+506",
            "code": "CR"
        }, {
            "name": "Cote d'Ivoire",
            "dial_code": "+225",
            "code": "CI"
        }, {
            "name": "Croatia",
            "dial_code": "+385",
            "code": "HR"
        }, {
            "name": "Cuba",
            "dial_code": "+53",
            "code": "CU"
        }, {
            "name": "Cyprus",
            "dial_code": "+537",
            "code": "CY"
        }, {
            "name": "Czech Republic",
            "dial_code": "+420",
            "code": "CZ"
        }, {
            "name": "Denmark",
            "dial_code": "+45",
            "code": "DK"
        }, {
            "name": "Djibouti",
            "dial_code": "+253",
            "code": "DJ"
        }, {
            "name": "Dominica",
            "dial_code": "+1 767",
            "code": "DM"
        }, {
            "name": "Dominican Republic",
            "dial_code": "+1 849",
            "code": "DO"
        }, {
            "name": "Ecuador",
            "dial_code": "+593",
            "code": "EC"
        }, {
            "name": "Egypt",
            "dial_code": "+20",
            "code": "EG"
        }, {
            "name": "El Salvador",
            "dial_code": "+503",
            "code": "SV"
        }, {
            "name": "Equatorial Guinea",
            "dial_code": "+240",
            "code": "GQ"
        }, {
            "name": "Eritrea",
            "dial_code": "+291",
            "code": "ER"
        }, {
            "name": "Estonia",
            "dial_code": "+372",
            "code": "EE"
        }, {
            "name": "Ethiopia",
            "dial_code": "+251",
            "code": "ET"
        }, {
            "name": "Falkland Islands (Malvinas)",
            "dial_code": "+500",
            "code": "FK"
        }, {
            "name": "Faroe Islands",
            "dial_code": "+298",
            "code": "FO"
        }, {
            "name": "Fiji",
            "dial_code": "+679",
            "code": "FJ"
        }, {
            "name": "Finland",
            "dial_code": "+358",
            "code": "FI"
        }, {
            "name": "France",
            "dial_code": "+33",
            "code": "FR"
        }, {
            "name": "French Guiana",
            "dial_code": "+594",
            "code": "GF"
        }, {
            "name": "French Polynesia",
            "dial_code": "+689",
            "code": "PF"
        }, {
            "name": "Gabon",
            "dial_code": "+241",
            "code": "GA"
        }, {
            "name": "Gambia",
            "dial_code": "+220",
            "code": "GM"
        }, {
            "name": "Georgia",
            "dial_code": "+995",
            "code": "GE"
        }, {
            "name": "Germany",
            "dial_code": "+49",
            "code": "DE"
        }, {
            "name": "Ghana",
            "dial_code": "+233",
            "code": "GH"
        }, {
            "name": "Gibraltar",
            "dial_code": "+350",
            "code": "GI"
        }, {
            "name": "Greece",
            "dial_code": "+30",
            "code": "GR"
        }, {
            "name": "Greenland",
            "dial_code": "+299",
            "code": "GL"
        }, {
            "name": "Grenada",
            "dial_code": "+1 473",
            "code": "GD"
        }, {
            "name": "Guadeloupe",
            "dial_code": "+590",
            "code": "GP"
        }, {
            "name": "Guam",
            "dial_code": "+1 671",
            "code": "GU"
        }, {
            "name": "Guatemala",
            "dial_code": "+502",
            "code": "GT"
        }, {
            "name": "Guernsey",
            "dial_code": "+44",
            "code": "GG"
        }, {
            "name": "Guinea",
            "dial_code": "+224",
            "code": "GN"
        }, {
            "name": "Guinea-Bissau",
            "dial_code": "+245",
            "code": "GW"
        }, {
            "name": "Guyana",
            "dial_code": "+595",
            "code": "GY"
        }, {
            "name": "Haiti",
            "dial_code": "+509",
            "code": "HT"
        }, {
            "name": "Holy See (Vatican City State)",
            "dial_code": "+379",
            "code": "VA"
        }, {
            "name": "Honduras",
            "dial_code": "+504",
            "code": "HN"
        }, {
            "name": "Hong Kong",
            "dial_code": "+852",
            "code": "HK"
        }, {
            "name": "Hungary",
            "dial_code": "+36",
            "code": "HU"
        }, {
            "name": "Iceland",
            "dial_code": "+354",
            "code": "IS"
        }, {
            "name": "India",
            "dial_code": "+91",
            "code": "IN"
        }, {
            "name": "Indonesia",
            "dial_code": "+62",
            "code": "ID"
        }, {
            "name": "Iraq",
            "dial_code": "+964",
            "code": "IQ"
        }, {
            "name": "Iran, Islamic Republic of",
            "dial_code": "+98",
            "code": "IR"
        }, {
            "name": "Ireland",
            "dial_code": "+353",
            "code": "IE"
        }, {
            "name": "Isle of Man",
            "dial_code": "+44",
            "code": "IM"
        }, {
            "name": "Israel",
            "dial_code": "+972",
            "code": "IL"
        }, {
            "name": "Israel",
            "dial_code": "+972",
            "code": "IL"
        }, {
            "name": "Italy",
            "dial_code": "+39",
            "code": "IT"
        }, {
            "name": "Jamaica",
            "dial_code": "+1 876",
            "code": "JM"
        }, {
            "name": "Japan",
            "dial_code": "+81",
            "code": "JP"
        }, {
            "name": "Jersey",
            "dial_code": "+44",
            "code": "JE"
        }, {
            "name": "Jordan",
            "dial_code": "+962",
            "code": "JO"
        }, {
            "name": "Kazakhstan",
            "dial_code": "+7",
            "code": "KZ"
        }, {
            "name": "Kiribati",
            "dial_code": "+686",
            "code": "KI"
        }, {
            "name": "Korea, Democratic People's Republic of",
            "dial_code": "+850",
            "code": "KP"
        }, {
            "name": "Korea, Republic of",
            "dial_code": "+82",
            "code": "KR"
        }, {
            "name": "Kuwait",
            "dial_code": "+965",
            "code": "KW"
        }, {
            "name": "Kyrgyzstan",
            "dial_code": "+996",
            "code": "KG"
        }, {
            "name": "Lao People's Democratic Republic",
            "dial_code": "+856",
            "code": "LA"
        }, {
            "name": "Latvia",
            "dial_code": "+371",
            "code": "LV"
        }, {
            "name": "Lebanon",
            "dial_code": "+961",
            "code": "LB"
        }, {
            "name": "Lesotho",
            "dial_code": "+266",
            "code": "LS"
        }, {
            "name": "Liberia",
            "dial_code": "+231",
            "code": "LR"
        }, {
            "name": "Libyan Arab Jamahiriya",
            "dial_code": "+218",
            "code": "LY"
        }, {
            "name": "Liechtenstein",
            "dial_code": "+423",
            "code": "LI"
        }, {
            "name": "Lithuania",
            "dial_code": "+370",
            "code": "LT"
        }, {
            "name": "Luxembourg",
            "dial_code": "+352",
            "code": "LU"
        }, {
            "name": "Macao",
            "dial_code": "+853",
            "code": "MO"
        }, {
            "name": "Macedonia, The Former Yugoslav Republic of",
            "dial_code": "+389",
            "code": "MK"
        }, {
            "name": "Madagascar",
            "dial_code": "+261",
            "code": "MG"
        }, {
            "name": "Malawi",
            "dial_code": "+265",
            "code": "MW"
        }, {
            "name": "Malaysia",
            "dial_code": "+60",
            "code": "MY"
        }, {
            "name": "Maldives",
            "dial_code": "+960",
            "code": "MV"
        }, {
            "name": "Mali",
            "dial_code": "+223",
            "code": "ML"
        }, {
            "name": "Malta",
            "dial_code": "+356",
            "code": "MT"
        }, {
            "name": "Marshall Islands",
            "dial_code": "+692",
            "code": "MH"
        }, {
            "name": "Martinique",
            "dial_code": "+596",
            "code": "MQ"
        }, {
            "name": "Mauritania",
            "dial_code": "+222",
            "code": "MR"
        }, {
            "name": "Mauritius",
            "dial_code": "+230",
            "code": "MU"
        }, {
            "name": "Mayotte",
            "dial_code": "+262",
            "code": "YT"
        }, {
            "name": "Mexico",
            "dial_code": "+52",
            "code": "MX"
        }, {
            "name": "Micronesia, Federated States of",
            "dial_code": "+691",
            "code": "FM"
        }, {
            "name": "Moldova, Republic of",
            "dial_code": "+373",
            "code": "MD"
        }, {
            "name": "Monaco",
            "dial_code": "+377",
            "code": "MC"
        }, {
            "name": "Mongolia",
            "dial_code": "+976",
            "code": "MN"
        }, {
            "name": "Montenegro",
            "dial_code": "+382",
            "code": "ME"
        }, {
            "name": "Montserrat",
            "dial_code": "+1664",
            "code": "MS"
        }, {
            "name": "Morocco",
            "dial_code": "+212",
            "code": "MA"
        }, {
            "name": "Mozambique",
            "dial_code": "+258",
            "code": "MZ"
        }, {
            "name": "Myanmar",
            "dial_code": "+95",
            "code": "MM"
        }, {
            "name": "Namibia",
            "dial_code": "+264",
            "code": "NA"
        }, {
            "name": "Nauru",
            "dial_code": "+674",
            "code": "NR"
        }, {
            "name": "Nepal",
            "dial_code": "+977",
            "code": "NP"
        }, {
            "name": "Netherlands",
            "dial_code": "+31",
            "code": "NL"
        }, {
            "name": "Netherlands Antilles",
            "dial_code": "+599",
            "code": "AN"
        }, {
            "name": "New Caledonia",
            "dial_code": "+687",
            "code": "NC"
        }, {
            "name": "New Zealand",
            "dial_code": "+64",
            "code": "NZ"
        }, {
            "name": "Nicaragua",
            "dial_code": "+505",
            "code": "NI"
        }, {
            "name": "Niger",
            "dial_code": "+227",
            "code": "NE"
        }, {
            "name": "Nigeria",
            "dial_code": "+234",
            "code": "NG"
        }, {
            "name": "Niue",
            "dial_code": "+683",
            "code": "NU"
        }, {
            "name": "Norfolk Island",
            "dial_code": "+672",
            "code": "NF"
        }, {
            "name": "Northern Mariana Islands",
            "dial_code": "+1 670",
            "code": "MP"
        }, {
            "name": "Norway",
            "dial_code": "+47",
            "code": "NO"
        }, {
            "name": "Oman",
            "dial_code": "+968",
            "code": "OM"
        }, {
            "name": "Pakistan",
            "dial_code": "+92",
            "code": "PK"
        }, {
            "name": "Palestinian Territory, Occupied",
            "dial_code": "+970",
            "code": "PS"
        }, {
            "name": "Palau",
            "dial_code": "+680",
            "code": "PW"
        }, {
            "name": "Panama",
            "dial_code": "+507",
            "code": "PA"
        }, {
            "name": "Papua New Guinea",
            "dial_code": "+675",
            "code": "PG"
        }, {
            "name": "Paraguay",
            "dial_code": "+595",
            "code": "PY"
        }, {
            "name": "Peru",
            "dial_code": "+51",
            "code": "PE"
        }, {
            "name": "Philippines",
            "dial_code": "+63",
            "code": "PH"
        }, {
            "name": "Pitcairn",
            "dial_code": "+872",
            "code": "PN"
        }, {
            "name": "Poland",
            "dial_code": "+48",
            "code": "PL"
        }, {
            "name": "Portugal",
            "dial_code": "+351",
            "code": "PT"
        }, {
            "name": "Puerto Rico",
            "dial_code": "+1 939",
            "code": "PR"
        }, {
            "name": "Qatar",
            "dial_code": "+974",
            "code": "QA"
        }, {
            "name": "Romania",
            "dial_code": "+40",
            "code": "RO"
        }, {
            "name": "Russia",
            "dial_code": "+7",
            "code": "RU"
        }, {
            "name": "Rwanda",
            "dial_code": "+250",
            "code": "RW"
        }, {
            "name": "Saint Barthelemy",
            "dial_code": "+590",
            "code": "BL"
        }, {
            "name": "Saint Helena, Ascension and Tristan Da Cunha",
            "dial_code": "+290",
            "code": "SH"
        }, {
            "name": "Saint Kitts and Nevis",
            "dial_code": "+1 869",
            "code": "KN"
        }, {
            "name": "Saint Lucia",
            "dial_code": "+1 758",
            "code": "LC"
        }, {
            "name": "Saint Martin",
            "dial_code": "+590",
            "code": "MF"
        }, {
            "name": "Saint Pierre and Miquelon",
            "dial_code": "+508",
            "code": "PM"
        }, {
            "name": "Saint Vincent and the Grenadines",
            "dial_code": "+1 784",
            "code": "VC"
        }, {
            "name": "Samoa",
            "dial_code": "+685",
            "code": "WS"
        }, {
            "name": "Sao Tome and Principe",
            "dial_code": "+239",
            "code": "ST"
        }, {
            "name": "San Marino",
            "dial_code": "+378",
            "code": "SM"
        }, {
            "name": "Saudi Arabia",
            "dial_code": "+966",
            "code": "SA"
        }, {
            "name": "Senegal",
            "dial_code": "+221",
            "code": "SN"
        }, {
            "name": "Serbia",
            "dial_code": "+381",
            "code": "RS"
        }, {
            "name": "Seychelles",
            "dial_code": "+248",
            "code": "SC"
        }, {
            "name": "Sierra Leone",
            "dial_code": "+232",
            "code": "SL"
        }, {
            "name": "Singapore",
            "dial_code": "+65",
            "code": "SG"
        }, {
            "name": "Slovakia",
            "dial_code": "+421",
            "code": "SK"
        }, {
            "name": "Slovenia",
            "dial_code": "+386",
            "code": "SI"
        }, {
            "name": "Solomon Islands",
            "dial_code": "+677",
            "code": "SB"
        }, {
            "name": "Somalia",
            "dial_code": "+252",
            "code": "SO"
        }, {
            "name": "South Africa",
            "dial_code": "+27",
            "code": "ZA"
        }, {
            "name": "South Georgia and the South Sandwich Islands",
            "dial_code": "+500",
            "code": "GS"
        }, {
            "name": "Spain",
            "dial_code": "+34",
            "code": "ES"
        }, {
            "name": "Sri Lanka",
            "dial_code": "+94",
            "code": "LK"
        }, {
            "name": "Sudan",
            "dial_code": "+249",
            "code": "SD"
        }, {
            "name": "Suriname",
            "dial_code": "+597",
            "code": "SR"
        }, {
            "name": "Svalbard and Jan Mayen",
            "dial_code": "+47",
            "code": "SJ"
        }, {
            "name": "Swaziland",
            "dial_code": "+268",
            "code": "SZ"
        }, {
            "name": "Sweden",
            "dial_code": "+46",
            "code": "SE"
        }, {
            "name": "Switzerland",
            "dial_code": "+41",
            "code": "CH"
        }, {
            "name": "Syrian Arab Republic",
            "dial_code": "+963",
            "code": "SY"
        }, {
            "name": "Taiwan, Province of China",
            "dial_code": "+886",
            "code": "TW"
        }, {
            "name": "Tajikistan",
            "dial_code": "+992",
            "code": "TJ"
        }, {
            "name": "Thailand",
            "dial_code": "+66",
            "code": "TH"
        }, {
            "name": "Timor-Leste",
            "dial_code": "+670",
            "code": "TL"
        }, {
            "name": "Togo",
            "dial_code": "+228",
            "code": "TG"
        }, {
            "name": "Tokelau",
            "dial_code": "+690",
            "code": "TK"
        }, {
            "name": "Tonga",
            "dial_code": "+676",
            "code": "TO"
        }, {
            "name": "Trinidad and Tobago",
            "dial_code": "+1 868",
            "code": "TT"
        }, {
            "name": "Tunisia",
            "dial_code": "+216",
            "code": "TN"
        }, {
            "name": "Turkey",
            "dial_code": "+90",
            "code": "TR"
        }, {
            "name": "Turkmenistan",
            "dial_code": "+993",
            "code": "TM"
        }, {
            "name": "Turks and Caicos Islands",
            "dial_code": "+1 649",
            "code": "TC"
        }, {
            "name": "Tuvalu",
            "dial_code": "+688",
            "code": "TV"
        }, {
            "name": "Ukraine",
            "dial_code": "+380",
            "code": "UA"
        }, {
            "name": "United Arab Emirates",
            "dial_code": "+971",
            "code": "AE"
        }, {
            "name": "United Kingdom",
            "dial_code": "+44",
            "code": "GB"
        }, {
            "name": "United States",
            "dial_code": "+1",
            "code": "US"
        }, {
            "name": "Uruguay",
            "dial_code": "+598",
            "code": "UY"
        }, {
            "name": "Uzbekistan",
            "dial_code": "+998",
            "code": "UZ"
        }, {
            "name": "Vanuatu",
            "dial_code": "+678",
            "code": "VU"
        }, {
            "name": "Venezuela, Bolivarian Republic of",
            "dial_code": "+58",
            "code": "VE"
        }, {
            "name": "Viet Nam",
            "dial_code": "+84",
            "code": "VN"
        }, {
            "name": "Virgin Islands, British",
            "dial_code": "+1 284",
            "code": "VG"
        }, {
            "name": "Virgin Islands, U.S.",
            "dial_code": "+1 340",
            "code": "VI"
        }, {
            "name": "Wallis and Futuna",
            "dial_code": "+681",
            "code": "WF"
        }, {
            "name": "Yemen",
            "dial_code": "+967",
            "code": "YE"
        }, {
            "name": "Zambia",
            "dial_code": "+260",
            "code": "ZM"
        }, {
            "name": "Zimbabwe",
            "dial_code": "+263",
            "code": "ZW"
        }];
    $($buttonSelector).html('');
    $($buttonSelector).html('<img src="img/flags/ug.png" style="height: 20px;width: 20px"><span class="caret"></span>');
    $($phoneInputField).attr('countryCode', 'UG');
    $($listSelector).empty();
    $.each(allCountriesData, function (index, countryData) {
        //        "name":"Israel","dial_code":"+972","code":"IL"
        var countryCode = countryData.code;
        var countryName = countryData.name;
        var countryPhoneCode = countryData.dial_code;
        var countryListItem = document.createElement('li');
        $(countryListItem).removeClass().addClass('phoneCountryPickerListItem');
        var countryFlagImg = '<img src="img/flags/' + countryCode.toLowerCase() + '.png" style="height: 20px;width: 20px">';
        $(countryListItem).html('&nbsp; ' + countryFlagImg + ' ' + countryName + ' (' + countryPhoneCode + ')');
        $(countryListItem).off('click touch').on('click touch', function () {
            $($buttonSelector).html('');
            $($buttonSelector).html('<img src="img/flags/' + countryCode.toLowerCase() + '.png" style="height: 20px;width: 20px"><span class="caret"></span>');
            $($phoneInputField).attr('countryCode', countryCode.toUpperCase());
            $($phoneInputField).trigger('change');
        });
        $($listSelector).append($(countryListItem));
    });
};
registerKeyPressValidators = function ($formSelector) {
    var validationStatus = true;
    $formSelector.find('input[type="currency"]').currencyInput();
    var $formFields = $formSelector.find(".form-control");
    $($formFields).each(function () {
        $(this).on("focusout change", function () {
            var that = this;
            if (!($(this).is(":visible"))) {
                return;
            }
            if ($(this).prop('disabled')) {
                return;
            }
            if ($(this).prop('disabled')) {
                //same thing as using continue for normal loops
                return;
            }
            var dataType = $(this).attr('data-type');
            var fieldValue = $(this).val();
            var containingFormGroup = $(this).parent().parent();
            var containingInputGroup = $(this).parent();
            if ($(this).prop('required') && fieldValue.length < 1) {
                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Please provide a value");
                validationStatus = false;
                return;
            }
            if ($(this).prop('required') && fieldValue.length > 1) {
                validationStatus = true;
            }
            if (!($(this).prop('required')) && fieldValue.length < 1) {
                validationStatus = true;
            }
            switch (dataType) {
                case inputFieldTypes.string:
                    if (!($(this).prop('required')) && fieldValue.toString().length < 1) {
                        validationStatus = true;
                        break;
                    }
                    if ($(this).prop('minLength')) {
                        var minLength = parseInt($(this).prop('minLength'));
                        if (fieldValue.length < minLength) {
                            validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "At least " + minLength + " characters required");
                            validationStatus = false;
                            break;
                        } else {
                            //the reason why this doesnt have a break is because the validation can continue to the next check even after passing this one
                            validationStatus = true;
                        }
                    }
                    if ($(this).prop('maxLength')) {
                        var maxLength = parseInt($(this).prop('maxLength'));
                        if (maxLength >= 1) {
                            if (fieldValue.length > maxLength) {
                                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "At most " + maxLength + " characters required");
                                validationStatus = false;
                                break;
                            } else {
                                validationStatus = true;
                            }
                        }
                    }
                    break;
                case inputFieldTypes.email:
                    // console.log('email validator');
                    if (!($(this).prop('required')) && fieldValue.toString().length < 1) {
                        validationStatus = true;
                        break;
                    }
                    var regex = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
                    if (!regex.test(fieldValue)) {
                        validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Invalid email");
                        validationStatus = false;
                        break;
                    } else {
                        // console.log('valid email');
                        validationStatus = true;
                        break;
                    }
                    break;
                case inputFieldTypes.number:
                    if (!($(this).prop('required')) && fieldValue.toString().length < 1) {
                        validationStatus = true;
                        break;
                    }
                    if ($.isNumeric(fieldValue)) {
                        if ($(this).attr('maxAmount')) {
                            var maxAmount = parseInt($(this).attr('maxAmount'));
                            if (parseInt(fieldValue) > maxAmount) {
                                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Maximum amount is " + maxAmount);
                                validationStatus = false;
                                break;
                            } else {
                                validationStatus = true;
                            }
                        }
                        if ($(this).attr('minAmount')) {
                            var minAmount = parseInt($(this).attr('minAmount'));
                            if (parseInt(fieldValue) < minAmount) {
                                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Minimum amount is " + minAmount);
                                validationStatus = false;
                                break;
                            } else {
                                validationStatus = true;
                            }
                        }
                        break;
                    } else {
                        validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Invalid value, numbers expected");
                        validationStatus = false;
                        break;
                    }
                    break;
                case inputFieldTypes.unformattedCurrency:
                    if (!($(this).prop('required')) && fieldValue.toString().length < 1) {
                        validationStatus = true;
                        break;
                    }
                    var monetaryValue = unformatCurrency(fieldValue);
                    if ($.isNumeric(monetaryValue)) {
                        if ($(this).attr('minAmount')) {
                            var minAmount = parseInt($(this).attr('minAmount'));
                            if ((parseInt(monetaryValue) / 100) < minAmount) {
                                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Minimum amount is " + minAmount);
                                validationStatus = false;
                                break;
                            } else {
                                validationStatus = true;
                            }
                        }
                        if ($(this).attr('maxAmount')) {
                            var maxAmount = parseInt($(this).attr('maxAmount'));
                            if ((parseInt(monetaryValue) / 100) > maxAmount) {
                                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Maximum amount is " + maxAmount);
                                validationStatus = false;
                                break;
                            } else {
                                validationStatus = true;
                            }
                        }
                    } else {
                        validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Invalid amount, only numbers expected");
                        validationStatus = false;
                        break;
                    }
                    break;
                case inputFieldTypes.phone:
                    if (!($(this).prop('required')) && fieldValue.toString().length < 1) {
                        validationStatus = true;
                        break;
                    }
                    var countryCode = $(this).attr('countryCode').length > 1 ? $(this).attr('countryCode') : 'UG';
                    validateElement(containingFormGroup, containingInputGroup, validationClasses.loading, "Validating");
                    $.ajax({
                        url: host + '/validateNumber/' + fieldValue + '/' + countryCode,
                        contentType: false,
                        type: 'POST',
                        timeout: 3000,
                        beforeSend: function () {},
                        error: function () {
                            // console.log("error");
                            validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Invalid phone number");
                            validationStatus = false;
                        },
                        success: function (data) {
                            // console.log(data);
                            if (data === 'invalid') {
                                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Invalid phone number");
                                validationStatus = false;
                            } else {
                                $(that).val(data);
                                validationStatus = true;
                            }
                        }
                    }).fail(function (Response) {
                        // console.log("fail");
                        // console.log(Response);
                        validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Invalid phone number");
                        validationStatus = false;
                    });
                    break;
                case inputFieldTypes.date:
                    if (!($(this).prop('required')) && fieldValue.toString().length < 1) {
                        validationStatus = true;
                        break;
                    }
                    if (Date.parse(fieldValue)) {
                        // console.log('valid date');
                        var inputDate = Date.parse(fieldValue);
                        if ($(this).prop('minDate')) {
                            var minDate = Date.parse($(this).prop('minDate').toString());
                            if (inputDate < minDate) {
                                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Minimum date is " + $(this).prop('minDate').toString());
                                validationStatus = false;
                                break;
                            } else {
                                validationStatus = true;
                                break;
                            }
                        }
                        if ($(this).prop('maxDate')) {
                            var maxDate = Date.parse($(this).prop('maxDate').toString());
                            if (inputDate > maxDate) {
                                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Maximum date is " + $(this).prop('maxDate').toString());
                                validationStatus = false;
                                break;
                            } else {
                                validationStatus = true;
                                break;
                            }
                        }
                        //Valid date
                        validationStatus = true;
                        break;
                    } else {
                        //Not a valid date
                        // console.log('invalid date');
                        validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Invalid date");
                        validationStatus = false;
                        break;
                    }
                    break;
                case inputFieldTypes.thousandCommas:
                    // Validate the thousand commas
                    break;
                default:
                    break;
            }
            if (validationStatus) {
                validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
            }
        });
    });

    // var thousandCommaFields = $formSelector.find('.thousand-commas');

    // // insert commas as thousands separators 
    // function addCommas(n) {
    //     var regX = /(\d+)(\d{3})/;
    //     return String(n).replace(/^\d+/, function (w) {
    //         while (regX.test(w)) {
    //             w = w.replace(regX, '$1,$2');
    //         }
    //         return w;
    //     });
    // }
    // // return integers and decimal numbers from input
    // // optionally truncates decimals- does not 'round' input
    // function validDigits(n, dec) {
    //     n = n.replace(/[^\d\.]+/g, '');
    //     var ax1 = n.indexOf('.'),
    //             ax2 = -1;
    //     if (ax1 != -1) {
    //         ++ax1;
    //         ax2 = n.indexOf('.', ax1);
    //         if (ax2 > ax1)
    //             n = n.substring(0, ax2);
    //         if (typeof dec === 'number')
    //             n = n.substring(0, ax1 + dec);
    //     }
    //     return n;
    // }

    // $(thousandCommaFields).each(function () {
    //     $(this).on('keyup change', function (e) {
    //         e = e || window.event;
    //         var inputField = e.target || e.srcElement,
    //                 temp;
    //         temp = validDigits(inputField.value);
    //         inputField.value = addCommas(temp);
    //     });
    // });
};
calculateAge = function (birthMonth, birthDay, birthYear) {
    var todayDate = new Date();
    var todayYear = todayDate.getFullYear();
    var todayMonth = todayDate.getMonth();
    var todayDay = todayDate.getDate();
    var age = todayYear - birthYear;
    if (todayMonth < birthMonth - 1) {
        age--;
    }
    if ((birthMonth - 1) === todayMonth && todayDay < birthDay) {
        age--;
    }
    return age;
};
validateForm = function ($formSelector) {
    var validationStatus = true;
    var $formFields = $formSelector.find(".form-control");
    $($formFields).each(function () {
        var dataType = $(this).attr('data-type');
        var fieldValue = $(this).val();
        var containingFormGroup = $(this).parent().parent();
        var containingInputGroup = $(this).parent();
        if ($(this).is('[readonly]')) {
            if (dataType === inputFieldTypes.date) {
            } else {
                return;
            }
        }
        if (!($(this).is(":visible"))) {
            return;
        }
        if ($(this).prop('disabled')) {
            return;
        }
        if ($(this).prop('required') && fieldValue.toString().length < 1) {
            validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Please provide a value");
            validationStatus = false;
            return;
        }
        if (!($(this).prop('required')) && fieldValue.toString().length < 1) {
            validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
            return;
        }
        switch (dataType) {
            case inputFieldTypes.string:
                if (!($(this).prop('required')) && fieldValue.toString().length < 1) {
                    validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
                    if (!validationStatus) {
                        return;
                    }
                    validationStatus = true;
                    break;
                }
                if ($(this).prop('minLength')) {
                    var minLength = parseInt($(this).prop('minLength'));
                    if (fieldValue.length < minLength) {
                        validateElement(containingFormGroup, containingInputGroup, validationClasses.error, minLength + " minimum characters");
                        validationStatus = false;
                        break;
                    } else {
                        validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
                        if (!validationStatus) {
                            return;
                        }
                        validationStatus = true;
                        break;
                    }
                }
                if ($(this).prop('maxLength')) {
                    var maxLength = parseInt($(this).prop('maxLength'));
                    if (maxLength >= 1) {
                        if (fieldValue.length > maxLength) {
                            validateElement(containingFormGroup, containingInputGroup, validationClasses.error, minLength + " maximum characters");
                            validationStatus = false;
                            break;
                        } else {
                            validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
                            if (!validationStatus) {
                                return;
                            }
                            validationStatus = true;
                            break;
                        }
                    }
                }
                break;
            case inputFieldTypes.email:
                if (!($(this).prop('required')) && fieldValue.toString().length < 1) {
                    validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
                    if (!validationStatus) {
                        return;
                    }
                    validationStatus = true;
                    break;
                }
                var regex = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
                if (!regex.test(fieldValue)) {
                    validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Invalid email");
                    validationStatus = false;
                    break;
                } else {
                    validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
                    if (!validationStatus) {
                        return;
                    }
                    validationStatus = true;
                    break;
                }
                break;
            case inputFieldTypes.number:
                if (!($(this).prop('required')) && fieldValue.toString().length < 1) {
                    validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
                    if (!validationStatus) {
                        return;
                    }
                    validationStatus = true;
                    break;
                }
                if ($.isNumeric(fieldValue)) {
                    if ($(this).prop('maxAmount')) {
                        var maxAmount = parseInt($(this).attr('maxAmount'));
                        if (parseInt(fieldValue) > maxAmount) {
                            validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Maximum amount is " + maxAmount);
                            validationStatus = false;
                            break;
                        } else {
                            validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
                            if (!validationStatus) {
                                return;
                            }
                            validationStatus = true;
                        }
                    }
                    if ($(this).attr('minAmount')) {
                        var minAmount = parseInt($(this).attr('minAmount'));
                        if (parseInt(fieldValue) < minAmount) {
                            validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Minimum amount is " + minAmount);
                            validationStatus = false;
                            break;
                        } else {
                            validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
                            if (!validationStatus) {
                                return;
                            }
                            validationStatus = true;
                        }
                    }
                    break;
                } else {
                    validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Invalid value, numbers expected");
                    validationStatus = false;
                    break;
                }
                break;
            case inputFieldTypes.unformattedCurrency:
                if (!($(this).prop('required')) && fieldValue.toString().length < 1) {
                    validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
                    if (!validationStatus) {
                        return;
                    }
                    validationStatus = true;
                    break;
                }
                var monetaryValue = unformatCurrency(fieldValue);
                if ($.isNumeric(monetaryValue)) {
                    if ($(this).attr('minAmount')) {
                        var minAmount = parseInt($(this).attr('minAmount'));
                        if ((parseInt(monetaryValue) / 100) < minAmount) {
                            validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Minimum amount is " + minAmount);
                            validationStatus = false;
                            break;
                        } else {
                            validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
                            if (!validationStatus) {
                                return;
                            }
                            validationStatus = true;
                        }
                    }
                    if ($(this).attr('maxAmount')) {
                        var maxAmount = parseInt($(this).attr('maxAmount'));
                        if ((parseInt(monetaryValue) / 100) > maxAmount) {
                            validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Maximum amount is " + maxAmount);
                            validationStatus = false;
                            break;
                        } else {
                            validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
                            if (!validationStatus) {
                                return;
                            }
                            validationStatus = true;
                        }
                    }
                    break;
                } else {
                    validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Invalid amount, numbers expected");
                    validationStatus = false;
                    break;
                }
                break;
            case inputFieldTypes.phone:
                if (!($(this).prop('required')) && fieldValue.toString().length < 1) {
                    validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
                    if (!validationStatus) {
                        return;
                    }
                    validationStatus = true;
                    break;
                }
                break;
            case inputFieldTypes.date:
                if (!($(this).prop('required')) && fieldValue.toString().length < 1) {
                    validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
                    if (!validationStatus) {
                        return;
                    }
                    validationStatus = true;
                    break;
                }
                if (Date.parse(fieldValue)) {
                    var inputDate = Date.parse(fieldValue);
                    if ($(this).prop('minDate')) {
                        // console.log('form validator date minDate');
                        var minDate = Date.parse($(this).prop('minDate').toString());
                        if (inputDate < minDate) {
                            validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Minimum date is " + $(this).prop('minDate').toString());
                            validationStatus = false;
                            break;
                        } else {
                            if (!validationStatus) {
                                return;
                            }
                            validationStatus = true;
                            break;
                        }
                    }
                    if ($(this).prop('maxDate')) {
                        var maxDate = Date.parse($(this).prop('maxDate').toString());
                        if (inputDate > maxDate) {
                            validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Maximum date is " + $(this).prop('maxDate').toString());
                            validationStatus = false;
                            break;
                        } else {
                            if (!validationStatus) {
                                return;
                            }
                            validationStatus = true;
                            break;
                        }
                    }
                    validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
                    //Valid date
                    if (!validationStatus) {
                        return;
                    }
                    validationStatus = true;
                    break;
                } else {
                    //Not a valid date
                    validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Invalid date");
                    validationStatus = false;
                    break;
                }
                break;
            default:
                break;
        }
        if (validationStatus) {
            validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
        }
    });
    return validationStatus;
};

validatePhoneInput = function ($inputSelector, successCallBack, failCallBack) {
    var fieldValue = $($inputSelector).val();
    var containingFormGroup = $($inputSelector).parent().parent();
    var containingInputGroup = $($inputSelector).parent();
    var countryCode = $($inputSelector).attr('countryCode').length > 1 ? $(this).attr('countryCode') : 'UG';
    $.ajax({
        url: host + '/validateNumber/' + fieldValue + '/' + countryCode,
        contentType: false,
        type: 'POST',
        timeout: 3000,
        beforeSend: function () {
            validateElement(containingFormGroup, containingInputGroup, validationClasses.loading, "Validating");
        },
        error: function () {
            validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Invalid phone number");
            failCallBack();
        },
        success: function (data) {
            // console.log('Phone Validation Result : ');
            // console.log(data);
            if (data === 'invalid') {
                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Invalid phone number");
                failCallBack();
            } else {
                validateElement(containingFormGroup, containingInputGroup, validationClasses.okay, "");
                $($inputSelector).val(data);
                successCallBack();
            }
        }
    }).fail(function (Response) {
        validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Invalid phone number");
        failCallBack();
    });
};
validateElement = function (containingFormGroup, containingInputGroup, validationType, message) {
    containingFormGroup.removeClass(validationClasses.error);
    containingFormGroup.removeClass(validationClasses.okay);
    containingFormGroup.removeClass(validationClasses.warning);
    containingInputGroup.find('.form-control-feedback').remove();
    switch (validationType) {
        case validationClasses.error:
            containingFormGroup.addClass(validationClasses.error);
            //containingInputGroup.append(validationGlaphicons.error);
            containingFormGroup.find(".help-block").text(message);
            break;
        case validationClasses.okay:
            containingFormGroup.addClass(validationClasses.okay);
            //containingInputGroup.append(validationGlaphicons.okay);
            containingFormGroup.find(".help-block").text('');
            break;
        case validationClasses.warning:
            containingFormGroup.addClass(validationClasses.warning);
            //containingInputGroup.append(validationGlaphicons.warning);
            containingFormGroup.find(".help-block").text(message);
            break;
        case validationClasses.loading:
            containingFormGroup.addClass(validationClasses.warning);
            //containingInputGroup.append(validationGlaphicons.loading);
            containingFormGroup.find(".help-block").text(message);
            break;
        default:
            break;
    }
};
clearElementValidator = function (containingFormGroup, containingInputGroup) {
    containingFormGroup.removeClass();
    containingFormGroup.addClass('form-group');
    containingFormGroup.addClass('inputGroupContainer');
    containingInputGroup.find('.form-control-feedback').remove();
    containingFormGroup.find(".help-block").text('');
};

clearFormValidators = function ($formSelector) {
    var $formFields = $formSelector.find(".form-control");
    $($formFields).each(function () {
        var containingFormGroup = $(this).parent().parent();
        var containingInputGroup = $(this).parent();
        clearElementValidator(containingFormGroup, containingInputGroup);
    });
};
clearElementValidators = function ($elementSelector) {
    var containingFormGroup = $elementSelector.parent().parent();
    var containingInputGroup = $elementSelector.parent();
    clearElementValidator(containingFormGroup, containingInputGroup);
};
showExcelButton = function (listName, dataListFilters, listTitles) {
    $('#exportActionButtons').show();
    $('#exportActionsXlsButton').show();
    $('#exportActionsXlsButton').off('click touch').on('click touch', function () {
        $('#executeExportActionBtn').html('Export');
        $('#executeExportActionBtn').off('click touch');
        $('#executeExportActionBtn').on('click touch', function () {
            dataListExportToExcelButtonEventListener(listName, dataListFilters);
        });
        populateExportModalContent(listTitles);
        $('#exportBoxContentAlertContainer').empty().html();
        $('#exportBoxHeader').empty().html('Export ' + listName + ' to excel <button type="button" class="close" data-dismiss="modal">x</button>');
        $('#exportBox').modal('show');
    });
};
showPrintButton = function (listName, dataListFilters, listTitles) {
    $('#exportActionButtons').show();
    $('#exportActionPrintButton').show();
    $('#exportActionPrintButton').off('click touch').on('click touch', function () {
        $('#executeExportActionBtn').html('Print');
        $('#executeExportActionBtn').off('click touch');
        $('#executeExportActionBtn').on('click touch', function () {
            dataListPrintButtonEventListener(listName, dataListFilters);
        });
        populateExportModalContent(listTitles);
        $('#exportBoxContentAlertContainer').empty().html();
        $('#exportBoxHeader').empty().html('Print ' + listName + ' <button type="button" class="close" data-dismiss="modal">x</button>');
        $('#exportBox').modal('show');
    });
};
resetExportModal = function () {

};

dataListPrintButtonEventListener = function (dataListName, dataListFilters) {
    var selectedColumns = $('#tableExportFormTitles option:selected');
    clearFormValidators($('#tableExportForm'));
    clearElementValidators($('#tableExportFormTitles'));
    $('#exportBoxContentAlertContainer').empty();
    if (selectedColumns.length < 1) {
        showExportErrorMessage('Please select columns for printing');
    } else if (selectedColumns.length >= 1) {
        var printableTitles = [];
        var selectedPrintableColumns = $('#tableExportFormTitles option:selected');
        var count = 0;
        $(selectedPrintableColumns).each(function (index, brand) {
            var title = new Object();
            title.key = $(this).val();
            title.value = $(this).text();
            printableTitles[count] = title;
            count++;
        });
        var userFilters = [];
        var formInputElements = $('#tableExportForm').find(".form-control");
        count = 0;
        $(formInputElements).each(function (index, brand) {
            if ($(this).val().length > 0) {
                var elementId = $(this).attr('id').replace("exportFormControl_", "");
                var userFilter = new Object();
                userFilter[elementId] = $(this).val();
                userFilters[count] = userFilter;
            }
        });
        handlePrintDataListAction(dataListName, dataListFilters, printableTitles, userFilters);
    }
};
dataListExportToExcelButtonEventListener = function (dataListName, dataListFilters) {
    var selectedColumns = $('#tableExportFormTitles option:selected');
    clearFormValidators($('#tableExportForm'));
    clearElementValidators($('#tableExportFormTitles'));
    $('#exportBoxContentAlertContainer').empty();
    if (selectedColumns.length < 1) {
        showExportErrorMessage('Please select columns for exporting');
    } else if (selectedColumns.length >= 1) {
        var exportableTitles = [];
        var selectedPrintableColumns = $('#tableExportFormTitles option:selected');
        var count = 0;
        $(selectedPrintableColumns).each(function (index, brand) {
            var title = new Object();
            title.key = $(this).val();
            title.value = $(this).text();
            exportableTitles[count] = title;
            count++;
        });
        var userFilters = [];
        var formInputElements = $('#tableExportForm').find(".form-control");
        count = 0;
        $(formInputElements).each(function (index, brand) {
            if ($(this).val().length > 0) {
                var elementId = $(this).attr('id').replace("exportFormControl_", "");
                var userFilter = new Object();
                userFilter[elementId] = $(this).val();
                userFilters[count] = userFilter;
            }
        });
        handleExportToExcelAction(dataListName, dataListFilters, exportableTitles, userFilters);
    }
};
showExportErrorMessage = function (errorText) {
    var alertBox = document.createElement('div');
    $(alertBox).addClass('alert alert-dismissible alert-danger');
    var alertDismissableButton = document.createElement('button');
    $(alertDismissableButton).attr('data-dismiss', 'alert');
    $(alertDismissableButton).attr('type', 'button');
    $(alertDismissableButton).html('x');
    $(alertDismissableButton).addClass('close');
    var alertText = document.createElement('p');
    $(alertText).html('<strong>' + errorText + '</strong>');
    $(alertDismissableButton).appendTo($(alertBox));
    $(alertText).appendTo($(alertBox));
    $(alertBox).appendTo($('#exportBoxContentAlertContainer'));
};
handleExportToExcelAction = function (dataListName, dataListFilter, exportableTitles, userFilters) {
    var dataList = new Object();
    switch (dataListName) {
        case exportListName.savingsAccounts:
            switch (dataListFilter) {
                case exportListFilter.submitted:
                    dataList = savingsAccountList.getListByStatus('' + exportListFilter.submitted);
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Submitted Savings Accounts");
                    break;
                case exportListFilter.active:
                    dataList = savingsAccountList.getListByStatus('' + exportListFilter.active);
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Active Savings Accounts");
                    break;
                case exportListFilter.closed:
                    dataList = savingsAccountList.getListByStatus('' + exportListFilter.closed);
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Closed Savings Accounts");
                    break;
                case exportListFilter.all:
                    dataList = savingsAccountList.getEntities();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "All Savings Accounts");
                    break;
                default:
                    dataList = savingsAccountList.getEntities();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "All Savings Accounts");
                    break;
            }
            break;
        case exportListName.clients:
            switch (dataListFilter) {
                case exportListFilter.all:
                    dataList = clientList.getEntities();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Clients");
                    break;
                default:
                    dataList = clientList.getEntities();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Clients");
                    break;
            }
            break;
        case exportListName.loans:
            switch (dataListFilter) {
                case exportListFilter.submitted:
                    dataList = loanList.getSubmittedLoanList();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Submitted Loan Applications");
                    break;
                case exportListFilter.approved:
                    dataList = loanList.getApprovedLoanList();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Approved Loan Applications");
                    break;
                case exportListFilter.rejected:
                    dataList = loanList.getRejectedLoanList();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Rejected Loan Applications");
                    break;
                case exportListFilter.active:
                    dataList = loanList.getActiveLoanList();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Active Loans");
                    break;
                case exportListFilter.contract_signed:
                    dataList = loanList.getContractSignedLoanList();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Signed Contract Loans");
                    break;
                case exportListFilter.awaiting_disbursement:
                    dataList = loanList.getDisburesmentAllowedList();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Loans Awaiting Disbursement");
                    break;
                case exportListFilter.all:
                    dataList = loanList.getEntities();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Loans");
                    break;
                default:
                    dataList = loanList.getEntities();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Loans");
                    break;
            }
            break;
        case exportListName.groups:
            switch (dataListFilter) {
                case exportListFilter.all:
                    dataList = groupList.getAll();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Groups");
                    break;
                default:
                    dataList = groupList.getAll();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Groups");
                    break;
            }
            break;
        case exportListName.transactions:
            switch (dataListFilter) {
                case exportListFilter.all:
                    dataList = getTransactionsDataList();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Transactions");
                    break;
                default:
                    dataList = getTransactionsDataList();
                    exportDataListToExcel(dataList, userFilters, exportableTitles, "Transactions");
                    break;
            }
            break;
        default:
            break;
    }
};
getTransactionsDataList = function () {
    var latestTransactions = [];
    var savingsAccounts = savingsAccountList.getEntities();
    var savingsAccountsNumber = savingsAccounts.length;
    for (var i = 0; i < savingsAccountsNumber; i++) {
        var savingsAccount = savingsAccounts[i];
        var transactions = savingsAccount.transactionList;
        if (exists(transactions)) {
            var transactionsNumber = transactions.length;
            for (var j = 0; j < transactionsNumber; j++) {
                if (Date.now() - transactions[j].transactionDate < ReportingHandler.MAX_TRANSACTION_AGE) {
                    if (currentChangedFil === 'ALL') {
                        if (transactions[j]['transactionDate'] < transactionsToDate && transactions[j]['transactionDate'] > transactionsFromDate) {
                            latestTransactions.push(transactions[j]);
                        }
                    } else {
                        if (currentChangedFil === transactions[j]['transactionType'])
                            if (transactions[j]['transactionDate'] < transactionsToDate && transactions[j]['transactionDate'] > transactionsFromDate) {
                                latestTransactions.push(transactions[j]);
                            }
                    }
                }
            }
        }
    }
    var loans = loanList.getEntities();
    var loansNumber = loans.length;
    for (var i = 0; i < loansNumber; i++) {
        var loan = loans[i];
        var transactions = loan.transactionList;
        if (exists(transactions)) {
            var transactionsNumber = transactions.length;
            for (var j = 0; j < transactionsNumber; j++) {
                if (Date.now() - transactions[j].transactionDate < ReportingHandler.MAX_TRANSACTION_AGE) {
                    if (currentChangedFil === 'ALL') {
                        if (transactions[j]['transactionDate'] < transactionsToDate && transactions[j]['transactionDate'] > transactionsFromDate) {
                            latestTransactions.push(transactions[j]);
                        }
                    } else {
                        if (currentChangedFil === transactions[j]['transactionType'])
                            if (transactions[j]['transactionDate'] < transactionsToDate && transactions[j]['transactionDate'] > transactionsFromDate) {
                                latestTransactions.push(transactions[j]);
                            }
                    }
                }
            }
        }
    }
    return latestTransactions;
};
handlePrintDataListAction = function (dataListName, dataListFilter, printableTitles, userFilters) {
    var dataList = new Object();
    switch (dataListName) {
        case exportListName.savingsAccounts:
            switch (dataListFilter) {
                case exportListFilter.submitted:
                    dataList = savingsAccountList.getListByStatus('' + exportListFilter.submitted);
                    printDataList(dataList, userFilters, printableTitles, "Submitted Savings Accounts");
                    break;
                case exportListFilter.active:
                    dataList = savingsAccountList.getListByStatus('' + exportListFilter.active);
                    printDataList(dataList, userFilters, printableTitles, "Active Savings Accounts");
                    break;
                case exportListFilter.closed:
                    dataList = savingsAccountList.getListByStatus('' + exportListFilter.closed);
                    printDataList(dataList, userFilters, printableTitles, "Closed Savings Accounts");
                    break;
                case exportListFilter.all:
                    dataList = savingsAccountList.getEntities();
                    printDataList(dataList, userFilters, printableTitles, "All Savings Accounts");
                    break;
                default:
                    dataList = savingsAccountList.getEntities();
                    printDataList(dataList, userFilters, printableTitles, "All Savings Accounts");
                    break;
            }
            break;
        case exportListName.clients:
            switch (dataListFilter) {
                case exportListFilter.all:
                    dataList = clientList.getEntities();
                    printDataList(dataList, userFilters, printableTitles, "Clients");
                    break;
                default:
                    dataList = clientList.getEntities();
                    printDataList(dataList, userFilters, printableTitles, "Clients");
                    break;
            }
            break;
        case exportListName.loans:
            switch (dataListFilter) {
                case exportListFilter.submitted:
                    dataList = loanList.getSubmittedLoanList();
                    printDataList(dataList, userFilters, printableTitles, "Submitted Loan Applications");
                    break;
                case exportListFilter.approved:
                    dataList = loanList.getApprovedLoanList();
                    printDataList(dataList, userFilters, printableTitles, "Approved Loan Applications");
                    break;
                case exportListFilter.rejected:
                    dataList = loanList.getRejectedLoanList();
                    printDataList(dataList, userFilters, printableTitles, "Rejected Loan Applications");
                    break;
                case exportListFilter.active:
                    dataList = loanList.getActiveLoanList();
                    printDataList(dataList, userFilters, printableTitles, "Active Loans");
                    break;
                case exportListFilter.contract_signed:
                    dataList = loanList.getContractSignedLoanList();
                    printDataList(dataList, userFilters, printableTitles, "Signed Contract Loans");
                    break;
                case exportListFilter.awaiting_disbursement:
                    dataList = loanList.getDisburesmentAllowedList();
                    printDataList(dataList, userFilters, printableTitles, "Loans Awaiting Disbursement");
                    break;
                case exportListFilter.all:
                    dataList = loanList.getEntities();
                    printDataList(dataList, userFilters, printableTitles, "Loans");
                    break;
                default:
                    dataList = loanList.getSubmittedLoanList();
                    printDataList(dataList, userFilters, printableTitles, "Submitted Loan Applications");
                    break;
            }
            break;
        case exportListName.groups:
            switch (dataListFilter) {
                case exportListFilter.all:
                    dataList = groupList.getAll();
                    printDataList(dataList, userFilters, printableTitles, "Groups");
                    break;
                default:
                    dataList = groupList.getAll();
                    printDataList(dataList, userFilters, printableTitles, "Groups");
                    break;
            }
            break;
        case exportListName.transactions:
            switch (dataListFilter) {
                case exportListFilter.all:
                    dataList = getTransactionsDataList();
                    printDataList(dataList, userFilters, printableTitles, "Transactions");
                    break;
                default:
                    dataList = getTransactionsDataList();
                    printDataList(dataList, userFilters, printableTitles, "Transactions");
                    break;
            }
            break;
        default:
            break;
    }
};
exportDataListToExcel = function (dataList, userFilters, exportableTitles, listTitle) {
    var dataListJson = [];
    //dataListJson[0] = getDefaultExportToExcelRow(exportableTitles);
    var count = 0;
    for (var i = 0; i < dataList.length; i++) {
        var dataListItem = dataList[i];
        if (userFilters.length > 0) {
            $.each(userFilters, function (idx, obj) { //looping thru array of user filters
                $.each(obj, function (key, value) { //looping thru each filter
                    var dataItemValue = dataListItem[key];
                    if (key === "interestRate") {
                        dataItemValue = formatPercentage(dataListItem[key]);
                    } else if (key === "loan") {
                        var loans = loanList.getByClient(dataListItem['awamoId']);
                        var len = loans.length;
                        if (len > 0) {
                            var sum = 0;
                            for (var j = 0; j < len; j++) {
                                var loan = loans[j];
                                if (loan.status === "ACTIVE") {
                                    sum = sum + loan['principal'];
                                }
                            }
                            dataItemValue = currencyCode + " " + formatCurrency(sum);
                        } else {
                            dataItemValue = currencyCode + " " + 0;
                        }
                    } else if (key === "birthdate" || key === "submitDate") {
                        dataItemValue = formatDate(dataListItem[key]);
                    } else if (key === "account") {
                        var savingsAccounts = savingsAccountList.getByClient(dataListItem['awamoId']);
                        var len = savingsAccounts.length;
                        if (len > 0) {
                            var sum = 0;
                            for (var j = 0; j < len; j++) {
                                var savingsAccount = savingsAccounts[j];
                                sum = sum + savingsAccount['balance'];
                            }
                            dataItemValue = currencyCode + " " + formatCurrency(sum);
                        } else {
                            dataItemValue = currencyCode + " " + 0;
                        }
                    } else if (key === "balance") {
                        dataItemValue = formatCurrency(dataListItem[key]) + ' ' + currencyCode;
                    } else if (key === "name") {
                        if (exists(dataListItem.fullname)) {
                            dataItemValue = dataListItem.fullname;
                        } else {
                            dataItemValue = dataListItem[key];
                        }
                    } else if (key === "responsibleLO") {
                        dataItemValue = GroupHandler.self.getResponsibleLOName(dataListItem[key]);
                    } else if (key === "accountType") {
                        if (exists(dataListItem.accountId)) {
                            dataItemValue = 'savings account';
                        } else if (exists(dataListItem.loanId)) {
                            dataItemValue = 'loan account';
                        } else {
                            dataItemValue = 'unknown';
                        }
                    } else if (key === "transactionDate") {
                        dataItemValue = formatDate(dataListItem[key]);
                    } else {
                        dataItemValue = "" + dataListItem[key];
                    }
                    if (dataItemValue.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                        var returnedJson = getExportToExcelFormattedRow(dataListItem, exportableTitles);
                        dataListJson[count] = returnedJson;
                        count++;
                    }
                });
            });
        } else {
            var returnedJson = getExportToExcelFormattedRow(dataListItem, exportableTitles);
            dataListJson[count] = returnedJson;
            count++;
        }
    }
    // console.log('dataJson');
    // console.log(dataListJson);
    $('#exportBox').modal('hide');
    $('#exportAnchorDiv').excelexportjs({
        containerid: "exportAnchorDiv",
        datatype: 'json',
        dataset: dataListJson,
        columns: getColumns(dataListJson),
        worksheetName: listTitle,
        fileName: listTitle
    });
};
getDefaultExportToExcelRow = function (exportableTitles) {
    var jsonObject = new Object();
    $.each(exportableTitles, function (index, value) {
        jsonObject[value.value] = value.value;
    });
    return jsonObject;
};
printDataList = function (dataList, userFilters, printableTitles, listTitle) {
    var printableHtml = "<h3>" + listTitle + "</h3>";
    var printableTable = "<table border='1'>";
    printableTable += getDefaultPrintableRow(printableTitles);
    for (var i = 0; i < dataList.length; i++) {
        var dataListItem = dataList[i];
        if (userFilters.length > 0) {
            $.each(userFilters, function (idx, obj) { //looping thru array of user filters
                $.each(obj, function (key, value) { //looping thru each filter
                    var dataItemValue = dataListItem[key];
                    if (key === "interestRate") {
                        dataItemValue = formatPercentage(dataListItem[key]);
                    } else if (key === "loan") {
                        var loans = loanList.getByClient(dataListItem['awamoId']);
                        var len = loans.length;
                        if (len > 0) {
                            var sum = 0;
                            for (var j = 0; j < len; j++) {
                                var loan = loans[j];
                                if (loan.status === "ACTIVE") {
                                    sum = sum + loan['principal'];
                                }
                            }
                            dataItemValue = currencyCode + " " + formatCurrency(sum);
                        } else {
                            dataItemValue = currencyCode + " " + 0;
                        }
                    } else if (key === "birthdate" || key === "submitDate") {
                        dataItemValue = formatDate(dataListItem[key]);
                    } else if (key === "account") {
                        var savingsAccounts = savingsAccountList.getByClient(dataListItem['awamoId']);
                        var len = savingsAccounts.length;
                        if (len > 0) {
                            var sum = 0;
                            for (var j = 0; j < len; j++) {
                                var savingsAccount = savingsAccounts[j];
                                sum = sum + savingsAccount['balance'];
                            }
                            dataItemValue = currencyCode + " " + formatCurrency(sum);
                        } else {
                            dataItemValue = currencyCode + " " + 0;
                        }
                    } else if (key === "balance") {
                        dataItemValue = formatCurrency(dataListItem[key]) + ' ' + currencyCode;
                    } else if (key === "name") {
                        if (exists(dataListItem.fullname)) {
                            dataItemValue = dataListItem.fullname;
                        } else {
                            dataItemValue = dataListItem[key];
                        }
                    } else if (key === "responsibleLO") {
                        dataItemValue = GroupHandler.self.getResponsibleLOName(dataListItem[key]);
                    } else if (key === "accountType") {
                        if (exists(dataListItem.accountId)) {
                            dataItemValue = 'savings account';
                        } else if (exists(dataListItem.loanId)) {
                            dataItemValue = 'loan account';
                        } else {
                            dataItemValue = 'unknown';
                        }
                    } else if (key === "transactionDate") {
                        dataItemValue = formatDate(dataListItem[key]);
                    } else if (key === "submitDate") {
                        dataItemValue = formatDate(dataListItem[key]);
                    } else {
                        dataItemValue = "" + dataListItem[key];
                    }
                    if (dataItemValue.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                        printableTable += getPrintableFormattedRow(dataListItem, printableTitles);
                    }
                });
            });
        } else {
            printableTable += getPrintableFormattedRow(dataListItem, printableTitles);
        }
    }
    $('#exportBox').modal('hide');
    printableTable += "</table>";
    printableHtml += printableTable;
    var newWin = window.open('', 'Print-Window');
    newWin.document.open();
    newWin.document.write('<html>\n\
								<head>\n\
								</head>\n\
								<body onload="window.print()">\n\
									' + printableHtml + '\
								</body>\n\
						   </html>');
    newWin.document.close();
};
getDefaultPrintableRow = function (printableTitles) {
    var printableRow = "<tr>";
    $.each(printableTitles, function (index, value) {
        printableRow += "<th>" + value.value + "</th>";
    });
    printableRow += "</tr>";
    return printableRow;
};
getExportToExcelFormattedRow = function (dataListItem, exportableTitles) {
    var jsonObject = new Object();
    $.each(exportableTitles, function (index, value) {
        var dataItemValue = "";
        if (value.key === "interestRate") {
            dataItemValue = formatPercentage(dataListItem[value.key]);
        } else if (value.key === "loan") {
            var loans = loanList.getByClient(dataListItem['awamoId']);
            var len = loans.length;
            if (len > 0) {
                var sum = 0;
                for (var j = 0; j < len; j++) {
                    var loan = loans[j];
                    if (loan.status === "ACTIVE") {
                        sum = sum + loan['principal'];
                    }
                }
                dataItemValue = currencyCode + " " + formatCurrency(sum);
            } else {
                dataItemValue = currencyCode + " " + 0;
            }
        } else if (value.key === "birthdate" || value.key === "submitDate") {
            dataItemValue = formatDate(dataListItem[value.key]);
        } else if (value.key === "account") {
            var savingsAccounts = savingsAccountList.getByClient(dataListItem['awamoId']);
            var len = savingsAccounts.length;
            if (len > 0) {
                var sum = 0;
                for (var j = 0; j < len; j++) {
                    var savingsAccount = savingsAccounts[j];
                    sum = sum + savingsAccount['balance'];
                }
                dataItemValue = currencyCode + " " + formatCurrency(sum);
            } else {
                dataItemValue = currencyCode + " " + 0;
            }
        } else if (value.key === "balance") {
            dataItemValue = formatCurrency(dataListItem[value.key]) + ' ' + currencyCode;
        } else if (value.key === "name") {
            if (exists(dataListItem.fullname)) {
                dataItemValue = dataListItem.fullname;
            } else {
                dataItemValue = dataListItem[value.key];
            }
        } else if (value.key === "responsibleLO") {
            dataItemValue = GroupHandler.self.getResponsibleLOName(dataListItem[value.key]);
        } else if (value.key === "accountType") {
            if (exists(dataListItem.accountId)) {
                dataItemValue = 'savings account';
            } else if (exists(dataItemValue.loanId)) {
                dataItemValue = 'loan account';
            } else {
                dataItemValue = 'unknown';
            }
        } else if (value.key === "transactionDate") {
            dataItemValue = formatDate(dataListItem[value.key]);
        } else if (value.key === "submitDate") {
            dataItemValue = formatDate(dataListItem[value.key]);
        } else {
            dataItemValue = "" + dataListItem[value.key];
        }
        jsonObject[value.value] = dataItemValue;
    });
    return jsonObject;
};
getPrintableFormattedRow = function (dataListItem, printableTitles) {
    var printableRow = "<tr>";
    $.each(printableTitles, function (index, value) {
        var dataItemValue = "";
        if (value.key === "interestRate") {
            dataItemValue = formatPercentage(dataListItem[value.key]);
        } else if (value.key === "loan") {
            var loans = loanList.getByClient(dataListItem['awamoId']);
            var len = loans.length;
            if (len > 0) {
                var sum = 0;
                for (var j = 0; j < len; j++) {
                    var loan = loans[j];
                    if (loan.status === "ACTIVE") {
                        sum = sum + loan['principal'];
                    }
                }
                dataItemValue = currencyCode + " " + formatCurrency(sum);
            } else {
                dataItemValue = currencyCode + " " + 0;
            }
        } else if (value.key === "birthdate" || value.key === "submitDate") {
            dataItemValue = formatDate(dataListItem[value.key]);
        } else if (value.key === "account") {
            var savingsAccounts = savingsAccountList.getByClient(dataListItem['awamoId']);
            var len = savingsAccounts.length;
            if (len > 0) {
                var sum = 0;
                for (var j = 0; j < len; j++) {
                    var savingsAccount = savingsAccounts[j];
                    sum = sum + savingsAccount['balance'];
                }
                dataItemValue = currencyCode + " " + formatCurrency(sum);
            } else {
                dataItemValue = currencyCode + " " + 0;
            }
        } else if (value.key === "balance") {
            dataItemValue = formatCurrency(dataListItem[value.key]) + ' ' + currencyCode;
        } else if (value.key === "name") {
            if (exists(dataListItem.fullname)) {
                dataItemValue = dataListItem.fullname;
            } else {
                dataItemValue = dataListItem[value.key];
            }
        } else if (value.key === "responsibleLO") {
            dataItemValue = GroupHandler.self.getResponsibleLOName(dataListItem[value.key]);
        } else if (value.key === "accountType") {
            if (exists(dataListItem.accountId)) {
                dataItemValue = 'savings account';
            } else if (exists(dataItemValue.loanId)) {
                dataItemValue = 'loan account';
            } else {
                dataItemValue = 'unknown';
            }
        } else if (value.key === "transactionDate") {
            dataItemValue = formatDate(dataListItem[value.key]);
        } else {
            dataItemValue = "" + dataListItem[value.key];
        }
        printableRow += "<td>" + dataItemValue + "</td>";
    });
    printableRow += "</tr>";
    return printableRow;
};
populateExportModalContent = function (listTitles) {
    $('#tableExportForm').empty();
    $('#tableExportForm').html('');
    var tableExportFormTitlesSelectInput = document.createElement('select');
    $(tableExportFormTitlesSelectInput).attr('id', 'tableExportFormTitles');
    $(tableExportFormTitlesSelectInput).attr('multiple', 'multiple');
    var tableExportInputGroupContainer = document.createElement('div');
    $(tableExportInputGroupContainer).addClass('input-group');
    $(tableExportFormTitlesSelectInput).appendTo($(tableExportInputGroupContainer));
    var tableExportFormGroupContainer = document.createElement('div');
    $(tableExportFormGroupContainer).addClass('form-group inputGroupContainer');
    $(tableExportInputGroupContainer).appendTo($(tableExportFormGroupContainer));
    $(tableExportFormGroupContainer).appendTo($('#tableExportForm'));
    $.each(listTitles, function (key, value) {
        $(tableExportFormTitlesSelectInput).append($('<option/>', {
            value: key,
            text: value
        }));
        var elementInputFormControl = document.createElement('input');
        $(elementInputFormControl).attr('id', 'exportFormControl_' + key);
        $(elementInputFormControl).attr('placeholder', 'Filter By ' + value);
        $(elementInputFormControl).addClass('form-control');
        var elementFormGroup = document.createElement('div');
        $(elementInputFormControl).addClass("form-group inputGroupContainer");
        var elementInputGroup = document.createElement('div');
        $(elementInputGroup).addClass("input-group");
        var elementInputGroupAddon = document.createElement('div');
        $(elementInputGroupAddon).addClass("input-group-addon");
        $(elementInputGroupAddon).html('' + value);
        var elementFormGroupHelpBlock = document.createElement('p');
        $(elementFormGroupHelpBlock).addClass("help-block");
        $(elementInputGroupAddon).appendTo($(elementInputGroup));
        $(elementInputFormControl).appendTo($(elementInputGroup));
        $(elementFormGroupHelpBlock).appendTo($(elementFormGroup));
        $(elementInputGroup).appendTo($(elementFormGroup));
        $(elementFormGroup).insertAfter($(tableExportFormGroupContainer));
    });
    $(tableExportFormTitlesSelectInput).removeClass();
    $(tableExportFormTitlesSelectInput).multiselect();
};

showLoader = function (message) {
    hideLoader();
    // console.log("The loader was called!");
    if (!message)
        message = ' Just a moment...';
    $.blockUI({message: '<h5 id="statusIndicator"><img src="../../img/ajax-loader.gif" /><span>' + message + '</span></h5>'});
};
showProgress = function (entityName, initial, percentage, context) {
    // console.log("The entity name: " + entityName + " | Initial: " + initial + " | Percentage: " + percentage);
    if (entityName) {
        var loadingText = '' + entityName + 's, ' + percentage + '%';
    } else {
        var loadingText = percentage + '%';
    }
    var progressBarHeaderMessage = '<div>Preparing your data, this might take a while please wait...</div>';
    if (exists(context)) {
        if (context.syncInProgress) {
            progressBarHeaderMessage = '<div>Synchronizing ' + context.entityName + 's, this might take a while please wait...</div>'
        }
    }
    var message = progressBarHeaderMessage + '<h5 id="progressbar" class="progress">' + '<span class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></span>' + '<span class="progress-bar progress-bar-text" role="progressbar" style="width: 0%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">' + loadingText + '</span>' + '</h5>';
    '<h5 id="progressbar" class="progress">' +
            '<span class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></span>' +
            '<span class="progress-bar progress-bar-text" role="progressbar" style="width: 0%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">' + loadingText + '</span>' +
            '</h5>';
    if (initial) {
        $.blockUI({message: message});
    } else {
        var $progressbar = $('#progressbar');
        $('.progress-bar', $progressbar).css('width', percentage + '%');
        $('.progress-bar-text', $progressbar).text(loadingText);
    }

};
showProgressFailure = function (location, percentage) {
    var failureDisplay = $('<span>', {class: 'progress-failure'});
    failureDisplay.css({
        left: location + '%',
        width: percentage + '%'
    });
    var $progressbar = $('#progressbar');
    $('#progressbar').append(failureDisplay);
};
hideLoader = function () {
    $.unblockUI();
    // console.log("The loader was dismissed");
};
$('.sidebar').on('mouseover', function () {
    status_bar_disable = true;
    $('#footerContainer').hide();
});
$('.sidebar').on('mouseout', function () {
    status_bar_disable = false;
});

function calculateInterestPeriodCalculation(loanClientAIRElemId) {
    var $loanClientAIR = $('#' + loanClientAIRElemId);
    var interestRate = parseFloat($loanClientAIR.val());
    var resultingInterestRate = 0;
    var interestPeriodCalculationType = $loanClientAIR.attr('interestPeriodCalculationType');

    switch (interestPeriodCalculationType) {

        case 'Daily':
            resultingInterestRate = interestRate * 365; //365days a year
            // console.log(interestPeriodCalculationType)
            break;
        case 'Weekly':
            resultingInterestRate = interestRate * 52; //52 weeks a year
            // console.log(interestPeriodCalculationType)
            break;
        case 'Monthly':
            resultingInterestRate = interestRate * 12; //12 months a year
            // console.log(interestPeriodCalculationType)
            break;
        case 'Yearly':
            resultingInterestRate = interestRate;
            // console.log(interestPeriodCalculationType)
            break;
    }
    // console.log('Original Interest Rate');
    // console.log(interestRate);
    // console.log('Resulting Interest Rate After Conversion');
    // console.log(resultingInterestRate);

    return resultingInterestRate;
}

function calculateLoanDuration(loanClientDurationElemId, loanClientDuTyElemId) {
    var calculatedDuration = $('#' + loanClientDurationElemId).val();

    if ($('#' + loanClientDuTyElemId).val() === "WEEKS") {
        calculatedDuration = calculatedDuration * 7;
    }

    if ($('#' + loanClientDuTyElemId).val() === "MONTHS") {
        calculatedDuration = calculatedDuration * 30;
    }

    if ($('#' + loanClientDuTyElemId).val() === "YEARS") {
        calculatedDuration = calculatedDuration * 365;
    }
    return calculatedDuration;
}
validateClientDocument = function (requestBody, callBack) {
    var headers = getAuthenticationHeader();
    // console.log('validate doc');
    // console.log(requestBody);
    showLoader('Validating Identification Details');
    $.ajax({
        url: host + '/client/v1d/checkExtension',
        headers: headers,
        contentType: 'application/json',
        data: requestBody,
        type: 'POST',
        beforeSend: function () {},
        error: function () {
            hideLoader();
            showAlertMessage("Failed to validate ID Document, Please try again", AlertTypes.danger);
        },
        success: function (data) {
            hideLoader();
            callBack(data);
        }
    }).fail(function (Response) {
        hideLoader();
        showAlertMessage("Failed to validate ID Document, Please try again", AlertTypes.danger);
    });
};


/* Ronald Utilities: Not needed, just to make life easier and fun */
var logFancyMessage = function (header, message, color, paddingLength) {
    var lineLength = 120;
    var spaceChar = " ";
    var padding = "";
    paddingLength = paddingLength || 3;
    for (var i = 0; i < paddingLength; i++) {
        padding += spaceChar;
    }
    var printLine = function (type, text) {
        space = (type && (type === "divider")) ? text : spaceChar;
        var verticalBar = "*";
        var line = "";
        var indent = "";
        var indentLength = 0;

        line += padding;
        switch (type) {
            case "header":
                indentLength = Math.floor((lineLength - (padding.length * 2) - text.length) / 2);
                for (var i = 0; i < indentLength; i++) {
                    indent += space;
                }
                break;
            case "section":
                indent = verticalBar;
                indentLength = 4;
                for (var i = 0; i < indentLength; i++) {
                    indent += space;
                }
                break;
        }
        line += indent;

        line += text || "";

        var fillerSpaceLength = text ? (lineLength - text.length) : lineLength;
        fillerSpaceLength -= (padding.length * 2);
        fillerSpaceLength -= indent.length;
        fillerSpaceLength -= (type == "section") ? verticalBar.length : 0;

        for (var i = 0; i < fillerSpaceLength; i++) {
            line += space;
        }
        line += (type == "section") ? verticalBar : "";
        line += padding;
        line += "\n";
        return line;
    };
    var output = printLine();
    output += printLine("header", header);
    output += printLine("divider", "*");
    message.forEach(function (messageLine) {
        output += printLine("section", messageLine);
    });
    output += printLine("divider", "*");
    output += printLine();
    var consoleStyles = "";
    switch (color) {
        case "blue":
            consoleStyles = "color: #0054ff; font-weight: bold; background-color: rgba(0,84,255,.1); display: block;";
            break;
        case "yellow":
            consoleStyles = "color: #c0ff00; font-weight: bold; background-color: rgba(192,255,0,.1); display: block;";
            break;
        case "green":
            consoleStyles = "color: green; font-weight: bold; background-color: rgba(0,255,0,.1); display: block;";
            break;
        case "orange":
            consoleStyles = "color: #ff6000; font-weight: bold; background-color: rgba(255,96,0,.1); display: block;";
            break;
        case "red":
            consoleStyles = "color: #ff0000; font-weight: bold; background-color: rgba(255,0,0,.1); display: block;";
            break;
        case "teal":
            consoleStyles = "color: #00ffcc; font-weight: bold; background-color: rgba(0,255,204,.1); display: block;";
            break;
        case "lime":
            consoleStyles = "color: #00ff42; font-weight: bold; background-color: rgba(0,255,66,.1); display: block;";
    }
    console.log(header);
    console.log(message[message.length - 1]);
    // console.log("%c" + output, consoleStyles);
};
var saveFormData = function (form) {
    var fields = form.find('input[type="text"], input[type="number"], input[type="email"], select, textarea');
    var formData = {};
    fields.each(function (index, field) {
        formData[field.id] = field.value;
    });
    var formKey = form.attr('id');
    var formWithDataToSave = {};
    if (sessionStorage.savedFormData) {
        var formWithDataToSave = JSON.parse(sessionStorage.savedFormData);
    }
    formWithDataToSave[formKey] = formData;
    sessionStorage.setItem("savedFormData", JSON.stringify(formWithDataToSave));
    console.log(sessionStorage);
};
var autoFillForm = function (form) {
    if (sessionStorage.savedFormData) {
        var formData = JSON.parse(sessionStorage.savedFormData);
        var data = formData[form.attr('id')];
        for (key in data) {
            form.find('#' + key).val(data[key]);
        }
    }
};
var findParentForm = function (element) {
    var parent = element.parent();
    return parent.is('form') ? parent : findParentForm(parent);
};
var sentenceCase = function (/*sentence*/ str) {
    // sentence = sentence.split(' ');
    // sentence.forEach(function(word, index) {
    //     var firstLetter = word.shift().toUpperCase();
    //     word = firstLetter + word;
    //     sentence[index] = word;
    // });
    // return sentence.join(' ');
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

checkTenantId = function (tenant) {
    if (tenant !== null && tenant !== undefined && tenant !== "" && tenant.length > 0) {
        return true;
    }
    return false;

};

isEmpty = function (input_value) {
    if (input_value == null || input_value == "", input_value == null || input_value == "", input_value == null || input_value == "", input_value == null || input_value == "")
    {
        return false;
    }
    return true;

};