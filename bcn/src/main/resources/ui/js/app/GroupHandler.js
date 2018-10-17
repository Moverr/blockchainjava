/* global officerList, groupList, AlertTypes, isTest, loanEmpStartDate, loanSelfEmpStartDate, loanDisDate, loanList, LoanHandler */
var GroupHandler = function() {
    GroupHandler.self = this;
    $('#groupRegistrationForm input').on('input', GroupHandler.prototype.dataChangedHandler);
    GroupHandler.ROOT_PATH = "/group/v1d/";
    GroupHandler.RESISTRATION_TITLES = {
        name: "Name",
        responsibleLO: "Responsible LO"

    };
    GroupHandler.LIST_TITLES = {
        name: "Name",
        numOfMembers: "# Of Members",
        responsibleLO: "Responsible LO" //,
            //remove: 'Remove'
    };
    GroupHandler.MEMBER_LIST_TITLES = {
        image: "Image",
        name: "Name",
        remove: 'Remove'
    };
    GroupHandler.MEMBER_EDIT_LIST_TITLES = {
        image: "Image",
        name: "Name",
        edit: 'Edit'
    };
    GroupHandler.MEMBER_ADD_LIST_TITLES = {
        image: "Image",
        name: "Name",
        gender: "Sex",
        birthdate: "Birth Date",
        submitDate: "Registration",
        phone1: "Phone"
            //add: 'Add'
    };
    GroupHandler.prototype.calculateInterestPeriodCalculation = function() {
        var $loanClientAIR = $('#groupLoanClientAIR');
        var interestRate = parseFloat($loanClientAIR.val());
        var resultingInterestRate = 0;
        var interestPeriodCalculationType = $loanClientAIR.attr('interestPeriodCalculationType');

        switch (interestPeriodCalculationType) {

            case 'Daily':
                resultingInterestRate = interestRate * 365;
                console.log(interestPeriodCalculationType)
                break;
            case 'Weekly':
                resultingInterestRate = interestRate * 4 * 12;
                console.log(interestPeriodCalculationType)
                break;
            case 'Monthly':
                resultingInterestRate = interestRate * 12;
                console.log(interestPeriodCalculationType)
                break;
            case 'Yearly':
                resultingInterestRate = interestRate;
                console.log(interestPeriodCalculationType)
                break;
        }
        console.log('Original Interest Rate');
        console.log(interestRate);
        console.log('Resulting Interest Rate After Conversion');
        console.log(resultingInterestRate);

        return resultingInterestRate;
    }
    GroupHandler.prototype.registerNew = function() {
        clearFormValidators($('#createOrEditGroupContainerForm'));
        initDefaultContent('Register New Group');
        addHistory('New Group', '#manageGroups', getSidebarSubitemSelector('manageGroups', 'Group', 'registerNew'));
        clearExportButtons();
        $('#syncNow').off('click touch');
        $('#syncNow').attr('title', 'Nothing to sync');
        $('#printNow').off('click touch');
        $('#printNow').hide();
        GroupHandler.prototype.emptyAndUnbindEvents();
        $('#inGroupName').val('');
        var $officersSelectList = $('#stGroupResponsibleOfficer');

        $officersSelectList.html('');
        var officers = GroupHandler.self.getOfficers();
        $officersSelectList.append('<option value=\'\'>' + 'Select a LO' + '</option>');
        if (exists(officers)) {
            officers.forEach(function(officer) {
                $officersSelectList.append('<option value=' + officer.awamoId + '>' + GroupHandler.self.getResponsibleLOName(officer.awamoId) + '</option>');
            });
        } else {
            //alert('loading officers from server');
            officerList.loadAllAtOnce(officerList, GroupHandler.self.registerNew);
        }
        var $createOrEditGroupContainer = $('#createOrEditGroupContainer');
        $('div.col-removeble', $createOrEditGroupContainer).removeClass('col-sm-2');
        showContent($createOrEditGroupContainer);
        var $rowContainer = getRowContainer("#groupMembersTableContainer", GroupHandler.MEMBER_LIST_TITLES, true);
        //   $rowContainer.css('text-align', 'right');
        var $table = $rowContainer.parent();
        var tableSorter = getDefaultTableSorter();
        tableSorter.headers = {
            3: { sorter: 'awamoDateSorter' },
            4: { sorter: 'awamoDateSorter' }
        };
        //$table.tablesorter(tableSorter);
        //initialize_datatable($table);
        var memberBtnHtml = '<button id="groupAddMemberTop" style="margin-bottom :5px;" type="button" class="btn customSubmitButton pull-right"><span class=" mdl-color-text--white material-icons">&#xE7FE;</span>Add Member</button>';
        initialize_specific_datatable($table, datatables.editGroup, memberBtnHtml);

        $('#defaultTableContainer').hide();
        $("#groupSubmit").attr('disabled', 'disabled');
        var $groupAddMemberTop = $('#groupAddMemberTop');
        $groupAddMemberTop.attr('disabled', 'disabled');

        var emptyGroup = {
            "name": null,
            "awamoId": null,
            "responsibleLO": null,
            "clients": []
        };

        $groupAddMemberTop.data('object', emptyGroup);
        $groupAddMemberTop.off('click touch').on('click touch', function(e) {
            e.preventDefault();
            var groupObj = $(this).data('object');
            console.log(groupObj);
            GroupHandler.self.showAddClientScreen(groupObj);
        });
        $officersSelectList.on('change', function(e) {
            var newValue = $(this).val();
            console.log(newValue);
            var groupObj = GroupHandler.self.getGroupObject();
            if ( /*groupObj.name === null*/ $('#inGroupName').val().length <= 3) {
                //alert('group name can not be empty');
                var $groupName = $('#inGroupName');
                if ($groupName.parent().siblings('p').length) {
                    $groupName.parent().siblings('p').show();
                } else {
                    $groupName.parent().after('<p style="color:red;">group name should be more than 3 characters</p>');
                }

                var timer = setTimeout(function() {
                    $groupName.parent().siblings('p').hide();
                    timer = null;
                }, 5000); /**/


            } else {
                $('#groupAddMemberTop').removeAttr('disabled');
                console.log(groupObj);
                groupObj.name = $('#inGroupName').val();
                groupObj.responsibleLO = newValue;
                $groupAddMemberTop.data('object', groupObj);
                console.log(groupObj);
            }

        });

        $('#inGroupName').on('blur change', function(e) {
            var that = $(this);
            if (that.val().length > 3) {
                if ($('#stGroupResponsibleOfficer').val() === '') {
                    var officerSelect = $('#stGroupResponsibleOfficer');
                    if (officerSelect.parent().siblings('p').length) {
                        officerSelect.parent().siblings('p').show();
                    } else {
                        officerSelect.parent().after('<p style="color:red;">select a responsible LO</p>');
                    }

                    var timer = setTimeout(function() {
                        officerSelect.parent().siblings('p').hide();
                        timer = null;
                    }, 5000) /**/
                } else {
                    $('#groupAddMemberTop').removeAttr('disabled');
                    var groupObj = GroupHandler.self.getGroupObject();
                    console.log(groupObj);
                    groupObj.name = $('#inGroupName').val();
                    groupObj.responsibleLO = $officersSelectList.val();
                    $groupAddMemberTop.data('object', groupObj);
                    console.log(groupObj);
                    $('#groupAddMemberTop').removeAttr('disabled');
                }

            } else {
                //showValidationMessage(that, 'should be more than 3 characters')
                // var label = $input.siblings('label');
                // var labelText = label.html();
                $('#groupAddMemberTop').attr('disabled', 'disabled');
                if (that.parent().siblings('p').length) {
                    that.parent().siblings('p').show();
                } else {
                    that.parent().after('<p style="color:red;">group name should be more than 3 characters</p>');
                }

                var timer = setTimeout(function() {
                    that.parent().siblings('p').hide();
                    timer = null;
                }, 5000); /**/
            }
        });
        //        $("#groupSubmit").on('click touch', function (e) {
        //            e.preventDefault();
        //            GroupHandler.self.submitNewGroup($(this));
        //            //$("#groupNewApplication").show();//css('display','block');
        //            //$('#groupSubmit').hide();
        //        })


        /*$("#groupSubmit").on('click touch', function (e) {
         e.preventDefault();
         if ($officersSelectList.validate() && $('#inGroupName').validate()) {

         }else{
         alert("group name and responsible Loan Officer are required");
         }
         var groupObj = GroupHandler.self.getGroupObject();
         if ($officersSelectList.validate() && $('#inGroupName').validate()) {
         if (exists(groupObj)) {
         var clients = groupObj.clients
         GroupHandler.self.submitNewGroup($(this));
         $('#groupSubmit').hide();
         }

         }

         })*/
        registerKeyPressValidators($('#createOrEditGroupContainerForm'));
        showContent($("#saveGroupActionButtons"));
        //$('#groupNewApplication').on('click touch', GroupHandler.prototype.createNewLoanApplication);
        $('#groupCancelCreateBtn').on('click touch', GroupHandler.self.displayAllGroups);

        $('#inGroupName').prop('disabled', '');
        $('#stGroupResponsibleOfficer').prop('disabled', '');
        $('#groupAddMemberTop').css('display', 'block');
        //$('#groupNewApplication').show();
        $("#groupSubmit").show();
        $('#groupCancelCreateBtn').show();
        $('#saveGroupLoanActionButtons').hide();
        $('#groupNewApplication').hide();
        $('#groupNewApplication').hide();
        $('#groupLoanInformation').hide();
        $('#groupSubmit').hide();
    };
    GroupHandler.prototype.submitNewGroup = function(e) {
        if (validateForm($('#createOrEditGroupContainer'))) {
            var $groupAddMemberTop = $('#groupAddMemberTop');
            var group = $groupAddMemberTop.data('object');
            group.name = $('#inGroupName').val();
            group.responsibleLO = $('#stGroupResponsibleOfficer').val();
            $groupAddMemberTop.data('object', group);
            console.log(group);
            console.log(JSON.stringify(group));
            GroupHandler.self.postNewGroup(group);
        } else {
            showAlertMessage('Please ensure all fields are filled in correctly', AlertTypes.danger);
        }
    };
    GroupHandler.prototype.postNewGroup = function(group) {
        if ($('#stGroupResponsibleOfficer').val() === '') {
            showAlertMessage('Select a responsible Loan Officer', AlertTypes.warning);
            return;
        }
        if (($('#inGroupName').val()).length < 3) {
            showAlertMessage('Group Must a name', AlertTypes.warning);
            return;
        }
        //$('#groupAddMemberTop').data('object', group);
        var headers = getAuthenticationHeader(); /**/ //{tenantId: "test12", authentication: "YXdhbW9BZG1pbjpqYmUzNTUxamtyZnU=", "Content-Type": "application/json"};
        $('#groupSubmit').attr('disabled', 'disabled');
        $("#groupSubmit").hide();
        var uri = "/group/v1d";
        var body = JSON.stringify(group);
        if (!exists(group.awamoId) || group.awamoId.length < 3) {
            var confirmDialogHeader = 'Confirm Group Creation';
            var confirmDialogBody = 'Are you sure you want to create this group with the provided details';
            var confirmDialogPositiveText = 'Yes';
            var confirmDialogNegativeText = 'No';
            showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText, function() {
                //yes create group
                showLoader();
                ajax(uri, 'POST', GroupHandler.prototype.groupCreatedResponseHandler, body, headers, GroupHandler.prototype.groupCreatedFailedResponseHandler);
            }, confirmDialogNegativeText, function() {
                //no dont create group
            });
        } else {
            var confirmDialogHeader = 'Confirm Group Update';
            var confirmDialogBody = 'Are you sure you want to edit this group with the provided details';
            var confirmDialogPositiveText = 'Yes';
            var confirmDialogNegativeText = 'No';
            showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText, function() {
                //yes create group
                showLoader();
                ajax(uri, 'PUT', GroupHandler.prototype.groupCreatedResponseHandler, body, headers, GroupHandler.prototype.groupCreatedFailedResponseHandler);
            }, confirmDialogNegativeText, function() {
                //no dont create group
            });
        }

    };
    GroupHandler.prototype.groupCreatedResponseHandler = function(response) {
        hideLoader();
        showAlertMessage('Group created successfully', AlertTypes.success);
        $('#groupSubmit').removeAttr('disabled');
        $('#groupSubmit').show();
        $("#groupNewApplication").show(); //css('display','block');
        //$('#groupSubmit').hide();//.css('display','none');
        var group = GroupHandler.prototype.getGroupObject();
        if (exists(response)) {
            var newGroupAwamoIdObj = JSON.parse(JSON.stringify(response));
            if (exists(response) && exists(newGroupAwamoIdObj.awamoId)) {
                group.awamoId = newGroupAwamoIdObj.awamoId;
                console.log(group);
                $('#groupAddMemberTop').data('object', group);
            }
            showAlertMessage('Group created Successfully', AlertTypes.success);
        } else {
            showAlertMessage('Group edited Successfully', AlertTypes.success);
        }
        if (exists(groupList))
            groupList.store(group);
        GroupHandler.prototype.displayAllGroups();
    };

    GroupHandler.prototype.groupCreatedFailedResponseHandler = function(response) {
        hideLoader();
        console.log(response);
        $('#groupSubmit').removeAttr('disabled');
        $('#groupSubmit').show();
        if (response) {

            //message('Error', exists(response.responseJSON) ? response.responseJSON.message : ' register group failed', MessageType.WARNING);
            showAlertMessage(exists(response.responseJSON) ? response.responseJSON.message : ' register group failed', AlertTypes.danger);
        } else {
            //message('Error', " Failed to save group", MessageType.WARNING);
            showAlertMessage(exists(response.responseJSON) ? response.responseJSON.message : ' Failed to save group', AlertTypes.danger);
        }
    };
    GroupHandler.prototype.getExistingGroups = function() {
        addHistory('Edit Group', '#manageGroups', getSidebarSubitemSelector('manageGroups', 'Group', 'getExistingGroups'));
        GroupHandler.self.getAll();
    };
    GroupHandler.prototype.overview = function() {
        addHistory("Manage Groups", '#manageGroupsOverview', '#manageGroups');
        initDefaultContent('Manage Group');
        clearExportButtons();
        $('#syncNow').off('click touch');
        $('#syncNow').attr('title', 'Nothing to sync');
        $('#printNow').off('click touch');
        $('#printNow').hide();
        currentTable = 'groups';
        var $rowContainer = getDefaultRowContainer({ type: 'Items Available' });
        //addRow($rowContainer, {type: 'Register New'}, 'Group', GroupHandler.prototype.registerNew, 'groupTableContainer');
        addRow($rowContainer, { type: 'Create New Group' }, 'Group', GroupHandler.prototype.registerNew, 'groupTableContainer');
        addRow($rowContainer, { type: 'Edit Group' }, 'Group', GroupHandler.prototype.getExistingGroups, 'groupTableContainer');
    };
    GroupHandler.prototype.bankingServicesOverview = function() {
        addHistory('Banking Services Group Loans', '#bankingServicesGroupLoansOverview', getSidebarSubitemSelector('bankingServices', 'Group', 'createGroupLaonOverview'));
        initDefaultContent('Group Loans');
        clearExportButtons();
        $('#syncNow').off('click touch');
        $('#syncNow').attr('title', 'Nothing to sync');
        $('#printNow').off('click touch');
        $('#printNow').hide();
        currentTable = 'groups';
        var $rowContainer = getDefaultRowContainer({ type: 'Items available' });
        //addRow($rowContainer, {type: 'Register New'}, 'Group', GroupHandler.prototype.registerNew, 'groupTableContainer');
        //addRow($rowContainer, {type: 'Create New Group'}, 'Group', GroupHandler.prototype.registerNew, 'groupTableContainer');
        addRow($rowContainer, { type: 'Create Group Loan' }, 'Group', GroupHandler.prototype.displayAllGroupsForLoanApplication, 'groupTableContainer');
    };
    GroupHandler.prototype.createGroupLaonOverview = function() {
        addHistory('Banking Services Group Loan', '#bankingServicesGroupLoanOverview', getSidebarSubitemSelector('bankingServices', 'Group', 'createGroupLaonOverview'));
        initDefaultContent('Group Loans');
        clearExportButtons();
        $('#syncNow').off('click touch');
        $('#syncNow').attr('title', 'Nothing to sync');
        $('#printNow').off('click touch');
        $('#printNow').hide();
        scrollToTop();
        currentTable = 'groups';
        var $rowContainer = getDefaultRowContainer({ type: 'Items Available' });
        //addRow($rowContainer, {type: 'Register New'}, 'Group', GroupHandler.prototype.registerNew, 'groupTableContainer');
        //addRow($rowContainer, {type: 'Create New'}, 'Group', GroupHandler.prototype.registerNew, 'groupTableContainer');
        addRow($rowContainer, { type: 'Create Group Loan' }, 'Group', GroupHandler.prototype.displayAllGroupsForLoanApplication, 'groupTableContainer');
    };
    GroupHandler.prototype.getAll = function() {
        currentTable = 'allGroups';
        GroupHandler.self.previousPage = GroupHandler.self.getAll;
        GroupHandler.self.displayAllGroups();
    };
    GroupHandler.prototype.displayAllGroups = function() {
        initDefaultContent('Select A Group To Edit');
        $('#syncNow').off('click touch');
        $('#syncNow').on('click touch', GroupHandler.self.synchronizeNow);
        $('#syncNow').attr('title', 'Sync Groups');
        $('#syncNow').show();

        var dataList = GroupHandler.self.getGroupsDataList(); //getLocalFakeGroupDataList();//groupList.getEntities();
        var officers = GroupHandler.self.getOfficers();
        hideLoader();
        if (!exists(dataList)) {
            showLoader();
            groupList.loadAllAtOnce(groupList, GroupHandler.self.displayAllGroups);
        }
        if (!exists(officers)) {
            showLoader();
            officerList.loadAllAtOnce(officerList, GroupHandler.self.displayAllGroups);
        }

        var $rowContainer = getDefaultRowContainer(GroupHandler.LIST_TITLES, true, "editGroupTable"); /*getRowContainer("#groupContainer",GroupHandler.LIST_TITLES)*/
        // $rowContainer.css('text-align', 'right');
        if (exists(dataList) && exists(officerList)) {

            for (var i = 0; i <= dataList.length; i++) {
                if (exists(dataList[i])) {
                    var rowdata = GroupHandler.self.getRowData(dataList[i], GroupHandler.LIST_TITLES);
                    addRow($rowContainer, rowdata, dataList[i], GroupHandler.self.rowClickHandler, dataList[i].awamoId);
                }
            }
            showPrintButton(exportListName.groups, exportListFilter.all, GroupHandler.LIST_TITLES);
            showExcelButton(exportListName.groups, exportListFilter.all, GroupHandler.LIST_TITLES);
            var $table = $rowContainer.parent();
            var tableSorter = getDefaultTableSorter();
            tableSorter.headers = {
                3: { sorter: 'awamoDateSorter' },
                4: { sorter: 'awamoDateSorter' }
            };
            // $table.tablesorter(tableSorter);
            initialize_datatable($table);
        }
    };
    GroupHandler.prototype.displayAllGroupsForLoanApplication = function() {
        initDefaultContent('Select a Group to start creating a loan application');
        $('#syncNow').off('click touch');
        $('#syncNow').on('click touch', GroupHandler.self.synchronizeNow);
        $('#syncNow').show();
        var dataList = GroupHandler.self.getGroupsDataList(); //getLocalFakeGroupDataList();//groupList.getEntities();
        var $rowContainer = getDefaultRowContainer(GroupHandler.LIST_TITLES, true); /*getRowContainer("#groupContainer",GroupHandler.LIST_TITLES)*/
        // $rowContainer.css('text-align', 'right');
        hideLoader();
        var officers = GroupHandler.self.getOfficers();
        if (!exists(dataList)) {
            //showLoader();
            //groupList.loadAllAtOnce(groupList, GroupHandler.self.displayAllGroupsForLoanApplication);
            groupList.reload();
        }
        if (!exists(officers)) {
            //officerList.showLoading();
            //officerList.loadAllAtOnce(officerList, null/*GroupHandler.self.displayAllGroupsForLoanApplication*/);
            officerList.reload();
        }

        if (exists(dataList) && exists(officerList)) {
            for (var i = 0; i <= dataList.length; i++) {
                if (exists(dataList[i])) {
                    var rowdata = GroupHandler.self.getRowData(dataList[i], GroupHandler.LIST_TITLES);
                    addRow($rowContainer, rowdata, dataList[i], GroupHandler.self.rowClickHandlerForLoanApplication, dataList[i].awamoId);
                }
            }
            var $table = $rowContainer.parent();
            var tableSorter = getDefaultTableSorter();
            tableSorter.headers = {
                3: { sorter: 'awamoDateSorter' },
                4: { sorter: 'awamoDateSorter' }
            };
            //$table.tablesorter(tableSorter);
            initialize_datatable($table);

        }
    };
    GroupHandler.prototype.displayGroupWithoutLoanApplication = function(group) {
        var groupObj = null;
        if (exists(group)) {
            groupObj = group
        } else {
            groupObj = GroupHandler.prototype.getGroupObject();
        }
        GroupHandler.prototype.emptyAndUnbindEvents();
        initDefaultContent('Edit Group ' + group.name);
        $('#inGroupName').val(group.name);
        var responsibleLO = GroupHandler.self.getOfficer(group.responsibleLO);
        var responsibleLOFullName = GroupHandler.self.getResponsibleLOName(group.responsibleLO);
        var $officersSelectList = $('#stGroupResponsibleOfficer');

        var officers = GroupHandler.self.getOfficers();
        if (exists(officers)) {
            if (!exists(responsibleLO)) {
                $officersSelectList.append('<option value="">Select a Responsible LO</option>');
            }
            officers.forEach(function(officer) {
                if (exists(responsibleLO) && exists(officer) && responsibleLO.awamoId === officer.awamoId) {
                    $officersSelectList.append('<option value=' + responsibleLO.awamoId + ' selected>' + responsibleLOFullName + '</option>');
                } else {
                    $officersSelectList.append('<option value=' + officer.awamoId + '>' + GroupHandler.self.getResponsibleLOName(officer.awamoId) + '</option>');
                }

            });
        }
        //        else{
        //             officerList.loadAllAtOnce(officerList,GroupHandler.self.registerNew);
        //        }

        showContent($('#createOrEditGroupContainer'));
        var $rowContainer = getRowContainer("#groupMembersTableContainer", GroupHandler.MEMBER_LIST_TITLES, true);
        //  $rowContainer.css('text-align', 'right');
        $('#defaultTableContainer').hide();
        //var $rowContainer = getDefaultRowContainer(GroupHandler.MEMBER_LIST_TITLES);
        var clientIds = group.clients;
        GroupHandler.prototype.initializeGroupObjectDomStorage($rowContainer.parent(), groupObj)
        if (exists(clientIds)) {
            clientIds.forEach(function(clientId) {
                var client = GroupHandler.self.getClient(clientId);
                console.log(clientId);
                console.log(client);
                if (exists(client)) {

                    var rowData = GroupHandler.self.getRowData(client, GroupHandler.MEMBER_LIST_TITLES);
                    addRow($rowContainer, rowData, client, GroupHandler.self.groupMemberRowClickHandler, client.awamoId);
                    var $row = $rowContainer.find("[data-id='" + client.awamoId + "']");
                    var $tds = $('td', $row);
                    $tds.css('text-align', 'center');
                    var addclientAnchor = $('a', $row);
                    if (exists(client.image)) {
                        var clientImageEl = $('img', $row);
                        var src = 'data:image/jpeg;base64,' + client.image;
                        clientImageEl.attr('src', src);
                    }
                    var removeclientAnchor = $('span', $row);
                    removeclientAnchor.on('click touch', GroupHandler.self.removeClientFromGroup);
                }
            });
        }
        var $table = $rowContainer.parent();
        var tableSorter = getDefaultTableSorter();
        tableSorter.headers = {
            3: { sorter: 'awamoDateSorter' },
            4: { sorter: 'awamoDateSorter' }
        };
        //$table.tablesorter(tableSorter);
        //initialize_datatable($table);
        var memberBtnHtml = '<button id="groupAddMemberTop" style="margin-bottom :5px" type="button" class="btn customSubmitButton pull-right"><span class=" mdl-color-text--white material-icons">&#xE7FE;</span>Add Member</button>';
        initialize_specific_datatable($table, datatables.editGroup, memberBtnHtml);
        GroupHandler.prototype.initializeGroupObjectDomStorage($rowContainer.parent(), groupObj)
        var $groupAddMemberTop = $('#groupAddMemberTop');
        //$groupAddMemberTop.data('object', group);
        $groupAddMemberTop.off('click touch').on('click touch', function(e) {
            e.preventDefault();
            var groupObj = $(this).data('object');
            console.log(groupObj);
            GroupHandler.self.previousPage = GroupHandler.self.displayGroupWithoutLoanApplication;
            GroupHandler.self.showAddClientScreen(groupObj);
        });
        $officersSelectList.on('change', function(e) {
            var newValue = $(this).val();
            console.log(newValue);
            var groupObj = GroupHandler.self.getGroupObject();
            console.log(groupObj);
            groupObj.responsibleLO = newValue;
            $groupAddMemberTop.data('object', groupObj);
            console.log(groupObj);
        });
        $("#groupSubmit").on('click touch', function(e) {
            e.preventDefault();
            var that = this;
            GroupHandler.self.submitNewGroup($(that));
        });
        /*$('#groupLoanCancelCreateBtn').on('click touch', function (e) {
         e.preventDefault();
         var groupObj = GroupHandler.self.getGroupObject();
         GroupHandler.self.displayGroupWithoutLoanApplication(groupObj, false);
         });*/
        $('#groupCancelCreateBtn').on('click touch', GroupHandler.self.displayAllGroups);
        showContent($("#saveGroupActionButtons"));
        $('#groupNewApplication').on('click touch', GroupHandler.prototype.createNewLoanApplication);
        $('#inGroupName').prop('disabled', '');
        $('#stGroupResponsibleOfficer').prop('disabled', '');
        $('#groupAddMemberTop').css('display', 'block');
        $("#groupSubmit").show();
        $('#groupLoanCancelCreateBtn').hide();
        $('#groupCancelCreateBtn').show();
        $('#saveGroupLoanActionButtons').hide();
        $('#groupNewApplication').hide();
        console.log('group has: ' + group.clients.length + ' members');
        console.log(group.clients);
        if (group.clients.length < 2) {
            $("#groupSubmit").attr('disabled', 'disabled');
            $("#groupSubmit").hide();
            $('#groupAddMemberTop').removeAttr('disabled');
            //showAlertMessage('A group must have more than one client,add more clients to continue!', AlertTypes.warning);
            GroupHandler.self.showValidNumClientsNotification();

        }
        $('#groupAddMemberTop').removeAttr('disabled');
    };
    GroupHandler.prototype.displayGroupWithLoanApplication = function(group) {
        console.log(group);
        var groupObject = null;
        if (exists(group)) {
            groupObject = group;
        } else {
            groupObject = GroupHandler.prototype.getGroupObject();
        }
        GroupHandler.prototype.emptyAndUnbindEvents();
        console.log(group);
        initDefaultContent('Group Loan Application Form for ' + group.name);
        //scrollToTop();
        currentTable = "Group Loan Application Form";
        $('#inGroupName').val(group.name);
        $('#groupLoanAwamoId').val('').attr('disabled', 'disabled');
        $('#groupLoanAwamoId').val(group.awamoId);
        //var groupObj=GroupHandler.self.getGroupObject();
        $('#groupLoanClientDiDate').val(group.disbursementDate);
        $('#groupLoanClientNORe').val(group.numberOfRepayments);
        $('#groupLoanClientAmortizationType').val(group.amortizationType);
        $('#groupLoanClientICPT').val(group.interestCalculationPeriodType),
            $('#groupLoanClientReason').val(group.reason);
        $('#groupLoanClientInType').val(group.interestType);
        $('#groupLoanClientDiDate').val(group.disbursementDate);
        $('#groupLoanClientAIR').val(group.interestRate);
        $('#groupLoanClientPrincipal').val(group.principal);
        $('#groupLoanClientDuration').val(group.duration);
        console.log("#####The group responsible officer", group.responsibleLO);
        if (!exists(group.responsibleLO)) {
            showAlertMessage('This group does not have a responsible loan officer attached to it,please first attach one from Manage Groups menu Item to continue', AlertTypes.warning)
            GroupHandler.prototype.displayAllGroupsForLoanApplication();
            return;
        }
        var responsibleLO = GroupHandler.self.getOfficer(group.responsibleLO);
        var responsibleLOFullName = GroupHandler.self.getResponsibleLOName(group.responsibleLO);
        var $officersSelectList = $('#stGroupResponsibleOfficer');

        var officers = GroupHandler.self.getOfficers();
        if (exists(officers)) {
            officers.forEach(function(officer) {
                if (exists(responsibleLO) && responsibleLO.awamoId === officer.awamoId) {
                    $officersSelectList.append('<option value=' + responsibleLO.awamoId + ' selected>' + responsibleLOFullName + '</option>');

                } else {

                    if (responsibleLO.awamoId !== officer.awamoId) {
                        $officersSelectList.append('<option value=' + officer.awamoId + '>' + GroupHandler.self.getResponsibleLOName(officer.awamoId) + '</option>');
                    }
                }
            });
        }
        $("#groupMembersTableContainer").empty();
        var $rowContainer = getRowContainer("#groupMembersTableContainer", GroupHandler.MEMBER_EDIT_LIST_TITLES, true);
        var $table = $rowContainer.parent();
        GroupHandler.self.initializeGroupObjectDomStorage($table, group);
        showContent($('#createOrEditGroupContainer'));
        clearFormValidators($('#groupLoanApplicationForm'));
        registerKeyPressValidators($('#groupLoanApplicationForm'));

        // $rowContainer.css('text-align', 'right');
        var clientIds = group.clients;
        if (exists(clientIds)) {
            clientIds.forEach(function(clientId) {
                var client = GroupHandler.self.getClient(clientId);
                if (exists(client)) {
                    GroupHandler.self.attachClientsToLoanApplication(client, $rowContainer);
                } else {
                    showLoader();
                    clientList.loadOne(clientId, function(client) {
                        hideLoader();
                        if (exists(client)) {
                            GroupHandler.self.attachClientsToLoanApplication(client, $rowContainer);
                            //var $table = $rowContainer.parent();
                            //initialize_datatable($table);

                        } else {
                            showAlertMessage("Failed to load all clients of this group, please refresh and try again", AlertTypes.warning);
                        }
                    })
                }
            });
        } else {
            showAlertMessage("Selected group does not have clients, please add clients to continue", AlertTypes.warning);
        }

        var tableSorter = getDefaultTableSorter();
        tableSorter.headers = {
            3: { sorter: 'awamoDateSorter' },
            4: { sorter: 'awamoDateSorter' }
        };
        //$table.tablesorter(tableSorter);
        //initialize_datatable($table);
        var memberBtnHtml = '<button id="groupAddMemberTop" style="margin-bottom :5px" type="button" class="btn customSubmitButton pull-right"><span class=" mdl-color-text--white material-icons">&#xE7FE;</span>Add Member</button>';
        //var groupObject=GroupHandler.self.getGroupObject();
        initialize_specific_datatable($table, datatables.editGroup, memberBtnHtml);
        //var $groupAddMemberTop = $('#groupAddMemberTop', $table);
        GroupHandler.self.initializeGroupObjectDomStorage($table, groupObject);
        groupObj = GroupHandler.self.getGroupObject();
        console.log('Group Object')
        console.log(groupObj);


        $('#groupLoanCancelCreateBtn').on('click touch', function(e) {
            //alert('hit')
            //e.preventDefault();
            var groupObj = GroupHandler.self.getGroupObject();
            GroupHandler.self.displayAllGroupsForLoanApplication();

        });
        showContent($("#saveGroupActionButtons"));
        $('#groupLoanSubmit').show();
        $('#groupNewApplication').on('click touch', GroupHandler.prototype.createNewLoanApplication);
        $('#groupLoanSubmit').on('click touch', GroupHandler.prototype.toComfirmLoanApplication);
        $('#groupLoanConfirmCreate').on('click touch', GroupHandler.prototype.submitNewGroupLoanApplication);
        $('#inGroupName').prop('disabled', 'disabled');
        $('#stGroupResponsibleOfficer').prop('disabled', 'disabled');
        $('#groupAddMemberTop').hide();
        $('#groupNewApplication').hide();
        $('#groupCancelCreateBtn').hide();
        $('#groupLoanCancelCreateBtn').show();
        $('#saveGroupLoanActionButtons').show();
        $('#groupLoanConfirmCreate').hide();
        $('#groupLoanSubmit').removeAttr('disabled');
        $('#groupLoanConfirmCreate').removeAttr('disabled');
        $('#groupSubmit').hide();

        if (isTest) {
            GroupHandler.prototype.initTestData();
        }
    };
    GroupHandler.prototype.showValidNumClientsNotification = function() {
        var $groupNotication = $("#groupNotication");
        console.log($groupNotication);
        if (!exists($groupNotication.attr('style'))) {
            var $groupNotificationContainer = $('#groupNotificationContainer');
            var $notificationEl = $('<div id="groupNotication" style="width: 100%" class="no-info-to-display hidden alert alert-warning alert-dismissable" role="alert">' + '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + '<i class="material-icons">&#xE88F;</i> A group must have more than one client,add more clients to continue!' + '</div>').attr('id', 'groupNotication');
            $groupNotificationContainer.append($notificationEl);
        }
        $groupNotication = $("#groupNotication");
        $groupNotication.removeClass('hidden');
        scrollToTop();
        setTimeout(function() {
            $groupNotication.addClass('hidden')
        }, 5000)
    }
    GroupHandler.prototype.initializeGroupObjectDomStorage = function($table, group) {
        var $groupAddMemberTop = $('#groupAddMemberTop');
        if (!exists($groupAddMemberTop.attr('id'))) {
            //alert('hit');
            var memberBtnHtml = '<button id="groupAddMemberTop" type="button" class="btn customSubmitButton pull-right hidden"><span class=" mdl-color-text--white material-icons">&#xE7FE;</span>Add Member</button>';
            $table.prepend($(memberBtnHtml));
        }
        $groupAddMemberTop = $('#groupAddMemberTop');
        $groupAddMemberTop.data('object', group);
        console.log($groupAddMemberTop);
        console.log($groupAddMemberTop.data('object'));
    }

    GroupHandler.prototype.attachClientsToLoanApplication = function(client, $rowContainer) {
        var rowData = GroupHandler.self.getRowData(client, GroupHandler.MEMBER_EDIT_LIST_TITLES);
        addRow($rowContainer, rowData, client, GroupHandler.self.groupMemberRowClickHandler, client.awamoId);
        var $row = $rowContainer.find("[data-id='" + client.awamoId + "']");
        var $tds = $('td', $row);
        $tds.css('text-align', 'center');
        //var addclientAnchor = $('a', $row);

        if (exists(client.image)) {
            var clientImageEl = $('img', $row);
            var src = 'data:image/jpeg;base64,' + client.image;
            clientImageEl.attr('src', src);
        }
        var $editClientDataAnchor = $('span', $row);
        $editClientDataAnchor.on('click touch', GroupHandler.prototype.addClientExtendedData);
    };
    GroupHandler.prototype.displayGroupLoan = function(group, withLoanApplication) {
        $('#groupCancelCreateBtn').off('click touch');
        $('#saveGroupActionButtons').removeAttr('disabled');
        $('#groupLoanClientDuTy').val("MONTHS");
        $('#groupLoanDurationTypeDayOption').off('click');
        $('#groupLoanDurationTypeDayOption').on('click', GroupHandler.prototype.handleDurationItemsSelection);
        $('#groupLoanDurationTypeWeeksOption').off('click');
        $('#groupLoanDurationTypeWeeksOption').on('click', GroupHandler.prototype.handleDurationItemsSelection);
        $('#groupLoanDurationTypeMonthsOption').off('click');
        $('#groupLoanDurationTypeMonthsOption').on('click', GroupHandler.prototype.handleDurationItemsSelection);
        $('#groupLoanDurationTypeYearsOption').off('click');
        $('#groupLoanDurationTypeYearsOption').on('click', GroupHandler.prototype.handleDurationItemsSelection);
        GroupHandler.prototype.clearGroupLoanApplicationForm();
        // clearFormValidators($('#groupLoanApplicationForm'));
        // registerKeyPressValidators($('#groupLoanApplicationForm'));
        $('#groupCancelCreateBtn').off('click touch');
        $('#groupCancelCreateBtn').on('click touch', function(e) {
            clearFormValidators($('#groupLoanApplicationForm'));
            GroupHandler.prototype.cancelGroupLoanCreation();
        });
        if (group.awamoId === null) {
            $('#groupSubmit').html('<span class=" mdl-color-text--white material-icons">&#xE7F0;</span>  Register ');
        } else {
            $('#groupSubmit').html('<span class=" mdl-color-text--white material-icons">&#xE150;</span> Update ');
        }
        if (exists(group.name) && exists(group.responsibleLO) && group.clients.length > 0) {
            $('#groupSubmit').removeAttr('disabled');
            $('#groupSubmit').show();
        }
        if (exists(group.name) && exists(group.responsibleLO) && group.clients.length === 0) {
            $('#groupSubmit').attr('disabled', 'disabled');
            $("#groupSubmit").hide();
            $('#groupAddMemberTop').removeAttr('disabled');
        }
        if (withLoanApplication) {
            console.log("with  laon application");
            var $createOrEditGroupContainer = $('#createOrEditGroupContainer');
            $('div.col-removeble', $createOrEditGroupContainer).addClass('col-sm-2');
            $('#groupLoanInformation').show();
            GroupHandler.self.displayGroupWithLoanApplication(group);
        } else {
            //with clients only
            console.log("with out laon application");
            $('#groupLoanInformation').hide();
            var $createOrEditGroupContainer = $('#createOrEditGroupContainer');
            $('div.col-removeble', $createOrEditGroupContainer).removeClass('col-sm-2');
            GroupHandler.self.displayGroupWithoutLoanApplication(group);
        }
    };
    GroupHandler.prototype.clearGroupLoanApplicationForm = function() {
        var groupLoanAwamoId = $('#groupLoanAwamoId');
        groupLoanAwamoId.val('');
        groupLoanAwamoId.removeAttr('disabled');

        var groupLoanClientPrincipal = $('#groupLoanClientPrincipal');
        groupLoanClientPrincipal.val('');
        groupLoanClientPrincipal.removeAttr('disabled');

        var groupLoanClientDuration = $('#groupLoanClientDuration');
        groupLoanClientDuration.val('');
        groupLoanClientDuration.removeAttr('disabled');

        var groupLoanClientNORe = $('#groupLoanClientNORe');
        groupLoanClientNORe.val('');
        groupLoanClientNORe.removeAttr('disabled');

        var groupLoanClientAmortizationType = $('#groupLoanClientAmortizationType');
        groupLoanClientAmortizationType.val('');
        groupLoanClientAmortizationType.removeAttr('disabled');

        var groupLoanClientAIR = $('#groupLoanClientAIR');
        groupLoanClientAIR.val('');
        groupLoanClientAIR.removeAttr('disabled');

        var groupLoanClientDuTy = $('#groupLoanClientDuTy');
        groupLoanClientDuTy.val('DAYS');
        groupLoanClientDuTy.removeAttr('disabled');

        var groupLoanClientDiDate = $('#groupLoanClientDiDate');
        groupLoanClientDiDate.val('');
        groupLoanClientDiDate.removeAttr('disabled');

        var groupLoanClientInType = $('#groupLoanClientInType');
        groupLoanClientInType.val('');
        groupLoanClientInType.removeAttr('disabled');

        var groupLoanClientICPT = $('#groupLoanClientICPT');
        groupLoanClientICPT.val('');
        groupLoanClientICPT.removeAttr('disabled');

        var groupLoanClientReason = $('#groupLoanClientReason');
        groupLoanClientReason.val('');
        groupLoanClientReason.removeAttr('disabled');
    };
    GroupHandler.prototype.handleDurationItemsSelection = function() {
        var sourceId = $(this).attr('id');
        console.log('grpHandler : ' + sourceId);
        switch (sourceId) {
            case 'groupLoanDurationTypeDayOption':
                $('#groupLoanDurationTypeSelectorBtn').html("Days<span class='caret'></span>");
                $('#groupLoanClientDuTy').val("DAYS");
                break;
            case 'groupLoanDurationTypeWeeksOption':
                $('#groupLoanDurationTypeSelectorBtn').html("Weeks<span class='caret'></span>");
                $('#groupLoanClientDuTy').val("WEEKS");
                break;
            case 'groupLoanDurationTypeMonthsOption':
                $('#groupLoanDurationTypeSelectorBtn').html("Months<span class='caret'></span>");
                $('#groupLoanClientDuTy').val("MONTHS");
                break;
            case 'groupLoanDurationTypeYearsOption':
                $('#groupLoanDurationTypeSelectorBtn').html("Years<span class='caret'></span>");
                $('#groupLoanClientDuTy').val("YEARS");
                break;
            default:
                break;
        }
    };
    GroupHandler.prototype.toComfirmLoanApplication = function(e) {
        e.preventDefault();

        var groupObj = GroupHandler.prototype.getGroupObject();
        console.log(groupObj)
        var groupLoan = GroupHandler.prototype.getGroupLoan();
        if (!validateForm($('#groupLoanApplicationForm'))) {
            showAlertMessage('Please ensure that all the fields are filled in correctly', AlertTypes.danger);
            //return;

        } else if (!GroupHandler.prototype.validateGroupLoan(groupLoan, groupObj)) {
            var errMesseges = "Incomplete Group Loan Application data : <br>" + errors.join('<br>');
            showAlertMessage(errMesseges + '', AlertTypes.danger);
            //showAlertMessage('errMesseges' + '', AlertTypes.danger);
            //return;
        } else {
            if (document.getElementById("groupLoanClientDuration").checkValidity() &&
                document.getElementById("groupLoanClientPrincipal").checkValidity() &&
                document.getElementById("groupLoanClientNORe").checkValidity() &&
                document.getElementById("groupLoanClientAIR").checkValidity() &&
                document.getElementById("groupLoanClientDuTy").checkValidity() &&
                document.getElementById("groupLoanClientDiDate").checkValidity() &&
                document.getElementById("groupLoanClientInType").checkValidity() &&
                document.getElementById("groupLoanClientICPT").checkValidity() &&
                document.getElementById("groupLoanClientReason").checkValidity()) {

                document.getElementById("groupLoanClientDuration").disabled = true;
                document.getElementById("groupLoanClientAmortizationType").disabled = true;
                document.getElementById("groupLoanClientPrincipal").disabled = true;
                document.getElementById("groupLoanClientNORe").disabled = true;
                document.getElementById("groupLoanClientAIR").disabled = true;
                document.getElementById("groupLoanClientDuTy").disabled = true;
                document.getElementById("groupLoanClientDiDate").disabled = true;
                document.getElementById("groupLoanClientInType").disabled = true;
                document.getElementById("groupLoanClientICPT").disabled = true;
                document.getElementById("groupLoanClientReason").disabled = true;
                document.getElementById("groupLoanClientDiDate").style.backgroundColor = "#eee";
                $('#groupLoanSubmit').prop('disabled', 'disabled');
                showAlertMessage('Please click the confirm button to submit the application', AlertTypes.info);
                $('#groupLoanConfirmCreate').show();
                $('#groupLoanSubmit').hide();

            } else {
                //alert('failed to hit jackpot')
                $('#groupLoanConfirmCreate').show();
                $('#groupLoanSubmit').hide();
                $('#groupLoanSubmit').prop('disabled', 'disabled');

            }
        }
    };
    GroupHandler.prototype.cancelGroupLoanCreation = function() {
        GroupHandler.self.displayAllGroups();
    };
    GroupHandler.prototype.getCollateral = function(groupLoan) {

        if ((exists(document.getElementById("loanClientCerditCT")) && exists(document.getElementById("loanClientCerditCT")))) {
            if (document.getElementById("loanClientCerditCT").value !== "UNSECURED" && document.getElementById("loanClientCerditCT").value !== "") {
                var collateral = [{
                    'index': 0,
                    'type': $('#loanClientCerditCT').val(),
                    'description': "",
                    'value': $('#loanClientCerditCTV').val()

                }];
                groupLoan.creditCollaterals = collateral;
            }
        }

        return groupLoan;
    };
    GroupHandler.prototype.getGuarantor = function(loanClient) {

        if (exists(document.getElementById('loanClientHaveGuarantor')) && document.getElementById("loanClientHaveGuarantor").value === "YES") {
            var guarantor = {
                'guarantorName': $('#loanClientGuarantorName').val(),
                'guarantorValue': $('#loanClientGuarantorIncome').val()
            };
            loanClient.guarantor = guarantor;
        }
        return loanClient;
    };
    GroupHandler.prototype.getForEmployed = function() {
        var clientEmplAddress = {
            "province": $('#loanClientEmpProvince').val(),
            "city": $('#loanClientEmpCity').val(),
            "street": $('#loanClientEmpStreet').val()
        };


        var clientEmployment = {
            "employmentType": 'EMPLOYED',
            "startDate": Date.parse($('#loanClientStartDate').val()).getTime(), //loanEmpStartDate,
            "monthlyIncome": $('#loanClientEmpMonIncome').val(),
            "formallyRegistered": $('#loanClientEmpFoRe').val(),
            "numberOfEmployees": $('#loanClientEmpNOE').val(),
            "address": clientEmplAddress,
            "businessSector": $('#loanClientEmpSector').val(),
            "sector": 'BUSINESS_SECTOR',
            "awamoId": $('#loanClientAwamoId').val(),
            "name": $('#loanClientEmpCompanyName').val()
        };
        return clientEmployment;
    };
    GroupHandler.prototype.getForEmployment = function(loanClient) {
        //var empLineJsonString = '';
        //if (document.getElementById("loanClientSelfEmployed").value === "YES" && document.getElementById("loanClientEmployed").value === "YES") {
        /*var empLineJsonString={
         "clientEmployments":[ GroupHandler.prototype.getForSelfEmployed() + "," +  GroupHandler.prototype.getForEmployed()  ]
         }
         return JSON.stringify(empLineJsonString);*/
        /*if (document.getElementById("loanClientSelfEmployed").value === "YES" && document.getElementById("loanClientEmployed").value === "YES") {
         empLineJsonString = ',' + "clientEmployments" + ':' + [GroupHandler.prototype.getForSelfEmployed() + "," + GroupHandler.prototype.getForEmployment()];
         } else {
         if (document.getElementById("loanClientSelfEmployed").value === "YES") {
         empLineJsonString = ',' + "clientEmployments" + ':' + [GroupHandler.prototype.getForSelfEmployed()];
         }

         if (document.getElementById("loanClientEmployed").value === "YES") {
         empLineJsonString = ',' + "clientEmployments" + ':' + [GroupHandler.prototype.getForEmployed()];
         }
         }*/
        loanClient.clientEmployments = new Array();
        if (document.getElementById("loanClientSelfEmployed").value === "YES" && document.getElementById("loanClientEmployed").value === "YES") {
            loanClient.clientEmployments.push(GroupHandler.prototype.getForSelfEmployed(loanClient));
            loanClient.clientEmployments.push(GroupHandler.prototype.getForEmployed());
        } else if (document.getElementById("loanClientSelfEmployed").value === "YES" && document.getElementById("loanClientEmployed").value === "NO") {
            loanClient.clientEmployments.push(GroupHandler.prototype.getForSelfEmployed(loanClient));
        } else if (document.getElementById("loanClientSelfEmployed").value === "NO" && document.getElementById("loanClientEmployed").value === "YES") {
            loanClient.clientEmployments.push(GroupHandler.prototype.getForEmployed());
        }

        return loanClient;
    };
    GroupHandler.prototype.getForSelfEmployed = function(loanClient) {
        //alert('hit ,please change awamoId to be be obtained from the input as originally designed to be');
        if (loanClient.awamoId === null || typeof(loanClient.awamoId) === 'undefined') {
            throw new Error('can not build client client information with a non existent awamoId');
        }
        var clientSelfEmplAddress = {
            "province": $('#loanClientSelfEmpProvince').val(),
            "city": $('#loanClientSelfEmpCity').val(),
            "street": $('#loanClientSelfEmpStreet').val()
        };
        var clientSelfEmployment = {
            "employmentType": 'SELF_EMPLOYED',
            "selfEmploymentType": $('#loanClientSelfEmpType').val(),
            "startDate": Date.parse($('#loanClientSelfStartDate').val()).getTime(), //loanSelfEmpStartDate,
            "monthlyIncome": $('#loanClientSelfEmpMonIncome').val(),
            "formallyRegistered": $('#loanClientSelfEmpFoRe').val(),
            "numberOfEmployees": $('#loanClientSelfEmpNOE').val(),
            "address": clientSelfEmplAddress,
            "awamoId": loanClient.awamoId, //$('#loanClientAwamoId').val() ,
            "name": $('#loanClientSelfEmpCompanyName').val()
        };


        if (document.getElementById("loanClientSelfEmpType").value === "FARMER") {
            clientSelfEmployment.agriculturalSector = $('#loanClientSelfEmpAPro').val();
        }

        if (document.getElementById("loanClientSelfEmpType").value === "OTHER") {
            clientSelfEmployment.businessSector = $('#loanClientSelfEmpBSector').val();
        }

        console.log(clientSelfEmployment)
        return clientSelfEmployment;
    };
    GroupHandler.prototype.getLoanClientExtendedData = function() {
        var clientAddressJsonString = {
            "province": $('#loanClientProvince').val(),
            "city": $('#loanClientCity').val(),
            "street": $('#loanClientStreet').val()
        };


        var loanClientJson = {};

        var loanClient = {
            "awamoId": $('#loanClientAwamoId').val(),
            "numberOfChildren": $('#loanClientNOC').val(),
            "numberOfChildrenInHouseHold": $('#loanClientFirstNOCIH').val(),
            "maritalStatus": $('#loanClientMartialStatus').val(),
            "livingArea": $('#loanClientLivingArea').val(),
            "address": clientAddressJsonString
        };
        var loanClientWithGuaranter = GroupHandler.prototype.getGuarantor(loanClient);
        var loanClientWithEmployment = GroupHandler.prototype.getForEmployment(loanClientWithGuaranter);
        loanClientJson = loanClientWithEmployment;
        return loanClientJson;
    };
    GroupHandler.prototype.trim = function(strToEscape) {
        /*var escapeRegExp = function (charToEscape) {
         // Escape special characters for use in a regular expression
         return charToEscape.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
         };
         var trimChar = function (origString, charToTrim) {
         charToTrim = escapeRegExp(charToTrim);
         var regEx = new RegExp("^[" + charToTrim + "]+|[" + charToTrim + "]+$", "g");
         return origString.replace(regEx, "");
         };
         var y = trimChar(strToEscape, "\\");
         //var z = trimChar(y, "\"");
         return y*/
        //return strToEscape.replace(/\\\//g, "/");
        return strToEscape = strToEscape.replace(/\\/g, '');


    };
    /*GroupHandler.prototype.calculateLoanDuration = function ()
     {
     var calculatedDuration = $('#groupLoanClientDuration').val();

     if ($('#groupLoanClientDuTy').val() === "WEEKS")
     {
     calculatedDuration = calculatedDuration * 7;
     }

     if ($('#groupLoanClientDuTy').val() === "MONTHS")
     {
     calculatedDuration = calculatedDuration * 30;
     }

     if ($('#groupLoanClientDuTy').val() === "YEARS")
     {
     calculatedDuration = calculatedDuration * 365;
     }
     return calculatedDuration;
     };*/
    GroupHandler.prototype.calculateLoanDuration = function() {
        return calculateLoanDuration('groupLoanClientDuration', 'groupLoanClientDuTy');

    };
    GroupHandler.prototype.getLoanClientsWithExtendedData = function() {
        var groupObject = GroupHandler.prototype.getGroupObject();
        if (exists(groupObject)) {
            if (exists(groupObject.clientsExtendedData)) {
                return groupObject.clientsExtendedData;
            } else {
                //alert('No additional Loan Client data to submit');
                console.log('No additional Loan Client data to submit');
            }

        } else {
            //alert('No Loan data to submit');
            showAlertMessage('No Loan data to submit', AlertTypes.warning);
            console.log('No Loan data to submit');
        }
        return groupObject.clientsExtendedData;
    };
    GroupHandler.prototype.getCurrentTime = function() {
        var currentTime = new Date().getTime();
        return currentTime;
    };
    GroupHandler.prototype.persistGroupLoanToDom = function() {
        var groupObj = GroupHandler.self.getGroupObject();
        groupObj.numberOfRepayments = $('#groupLoanClientNORe').val();
        groupObj.amortizationType = $('#groupLoanClientAmortizationType').val();
        groupObj.interestCalculationPeriodType = $('#groupLoanClientICPT').val(),
            groupObj.reason = $('#groupLoanClientReason').val();
        groupObj.interestType = $('#groupLoanClientInType').val();
        groupObj.disbursementDate = $('#groupLoanClientDiDate').val();
        groupObj.interestRate = $('#groupLoanClientAIR').val();
        groupObj.principal = $('#groupLoanClientPrincipal').val();
        groupObj.duration = $('#groupLoanClientDuration').val();
        $('#groupAddMemberTop').data('object', groupObj);

    }
    GroupHandler.prototype.getGroupLoan = function() {
        var groupObject = GroupHandler.prototype.getGroupObject();
        var body = {
            "awamoId": groupObject.awamoId,
            "numberOfRepayments": $('#groupLoanClientNORe').val(),
            "amortizationType": $('#groupLoanClientAmortizationType').val(),
            "interestCalculationPeriodType": $('#groupLoanClientICPT').val(),
            "reason": $('#groupLoanClientReason').val(),
            "interestType": $('#groupLoanClientInType').val(),
            "disbursementDate": isNaN($('#groupLoanClientDiDate').val()) ? Date.parse($('#groupLoanClientDiDate').val()).getTime() : null,
            "submitDate": GroupHandler.prototype.getCurrentTime(),
            "loanType": "GROUP",
            "interestRate": unformatPercentage(calculateInterestPeriodCalculation('groupLoanClientAIR') + ''),
            "principal": $('#groupLoanClientPrincipal').val() + '00',
            "duration": GroupHandler.prototype.calculateLoanDuration(),
            "loanClients": GroupHandler.prototype.getLoanClientsWithExtendedData(),
            "loanOfficer": groupObject.responsibleLO
        };
        var bodyWithCollateral = GroupHandler.prototype.getCollateral(body);
        return bodyWithCollateral;
    };
    GroupHandler.prototype.validateGroupLoan = function(loan, groupObject) {

        errors = []
        if (!GroupHandler.self.validateLoanClientsExtendedData(loan, groupObject)) {
            errors.push('  -Some group members data is incomplete, please click the orange buttons on the member list update the info!');
        }
        if (parseFloat(GroupHandler.prototype.calculateLoanDuration()) < parseFloat($('#groupLoanClientNORe').val())) {
            var durationEl = $('#groupLoanClientDuration');
            var groupLoanClientNORe = $('#groupLoanClientNORe').val();
            var groupLoanClientDuTy = $('#groupLoanClientDuTy').val();
            var mess = '  -A Duration of (' + durationEl.val() + " " + groupLoanClientDuTy + ')' + ' is too small for ' + groupLoanClientNORe + ' Number Of Repayments to be made, please adjust your options'
            errors.push(mess);
        }

        if (loan.awamoId.length < 5) {
            errors.push("  awamoId is missing ");
        }
        if (loan.numberOfRepayments === "") {
            errors.push("  -Number of repayments is required");
        }
        if (loan.amortizationType === "") {
            errors.push("  -Amortization Type  is required");
        }
        if (loan.interestCalculationPeriodType === "") {
            errors.push("  -Interest Calculation Period Type is required ");
        }

        if (loan.disbursementDate === null || loan.disbursementDate === "") {
            errors.push("  -Disbursement Date is required ");
        }
        if (loan.interestRate === "000") {
            errors.push("  -Interest Rate  is required ");
        }
        if (loan.principal == "00") {
            errors.push("  -Principal is required ");
        }
        if (loan.duration == "") {
            errors.push("  -Duration is required ");
        }
        if (loan.reason === "") {
            errors.push("  -Loan Purpose is required ");
        }
        if (errors.length > 0) {
            return false;
        }

        return true;
    }
    GroupHandler.prototype.submitNewGroupLoanApplication = function() {

        //GroupHandler.prototype.submitLoanData()

        var groupObject = GroupHandler.prototype.getGroupObject();
        console.log(JSON.stringify(groupObject));
        var uri = '/loan/v1d/apply/group';
        console.log('req url : ' + uri);
        var loanObj = GroupHandler.prototype.getGroupLoan();
        if (!GroupHandler.prototype.validateGroupLoan(loanObj, groupObject)) {
            var errMesseges = errors.join('<br>')
            showAlertMessage("Group Loan Missing some mandatory fields: <br>" + errMesseges, AlertTypes.warning);
            return;
        }

        var body = GroupHandler.prototype.trim(JSON.stringify(loanObj));
        console.log(body);
        //        if (!GroupHandler.self.validateLoanClientsExtendedData(loanObj, groupObject))
        //        {
        //            return;
        //        }

        var body = GroupHandler.prototype.trim(JSON.stringify(loanObj));
        console.log(body);


        //        if (!GroupHandler.self.validateLoanClientsExtendedData(loanObj, groupObject)) {
        //            showAlertMessage('One of the group members data is incomplete, please fill it in to continue', AlertTypes.warning);
        //            return;
        //        }
        //        if (parseFloat(GroupHandler.prototype.calculateLoanDuration()) < parseFloat($('#groupLoanClientNORe').val())) {
        //            showAlertMessage('The chosen Duration is too small for the chosen Number Of Repayments, please adjust your options', AlertTypes.warning);
        //            return;
        //        }
        $.ajax({
            url: host + uri,
            type: 'POST',
            data: body,
            headers: getAuthenticationHeader(),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function() {
                showLoader();
                $('#groupLoanConfirmCreate').attr('disabled', 'disabled');
            },
            success: function(data) {
                //Options.prototype.loanCreationPassed();
                hideLoader();
                console.log("group loan creation succeeded");
                console.log(data);
                showAlertMessage(" Group Loan Application creation succeeded", AlertTypes.success);
                if (exists(data) & exists(data.loanId)) {
                    try {
                        var loan = JSON.parse(body);
                        loan.loanId = data.loanId;
                        var group = GroupHandler.self.getGroup(loan.awamoId);
                        console.log("----Group  Entity From List")
                        console.log(group)
                        if (exists(group))
                            loan.clientName = group.name;
                        console.log(loan)
                        loanList.put(loanList, loan);
                        loanList.loadOne(data.loanId, function(loan) {
                            if (exists(loan))
                                loanList.put(loanList, loan);
                        });
                    } catch (err) {
                        console.log(err.message);
                    }
                    GroupHandler.prototype.displayAllGroupsForLoanApplication();
                } else {

                    GroupHandler.prototype.displayAllGroupsForLoanApplication();
                }
                $('#groupAddMemberTop').data('object', null);
                $('#groupLoanConfirmCreate').attr('disabled', 'disabled');

                var groupLoanAwamoId = $('#groupLoanAwamoId');
                groupLoanAwamoId.val('');
                //groupLoanAwamoId.removeAttr('disabled');

                var groupLoanClientPrincipal = $('#groupLoanClientPrincipal');
                groupLoanClientPrincipal.val('');
                groupLoanClientPrincipal.removeAttr('disabled');

                var groupLoanClientDuration = $('#groupLoanClientDuration');
                groupLoanClientDuration.val('');
                groupLoanClientDuration.removeAttr('disabled');

                var groupLoanClientNORe = $('#groupLoanClientNORe');
                groupLoanClientNORe.val('');
                groupLoanClientNORe.removeAttr('disabled');

                var groupLoanClientAmortizationType = $('#groupLoanClientAmortizationType');
                groupLoanClientAmortizationType.val('');
                groupLoanClientAmortizationType.removeAttr('disabled');

                var groupLoanClientAIR = $('#groupLoanClientAIR');
                groupLoanClientAIR.val('');
                groupLoanClientAIR.removeAttr('disabled');

                var groupLoanClientDuTy = $('#groupLoanClientDuTy');
                groupLoanClientDuTy.val('DAYS');
                groupLoanClientDuTy.removeAttr('disabled');

                var groupLoanClientDiDate = $('#groupLoanClientDiDate');
                groupLoanClientDiDate.val('');
                groupLoanClientDiDate.removeAttr('disabled');

                var groupLoanClientInType = $('#groupLoanClientInType');
                groupLoanClientInType.val('');
                groupLoanClientInType.removeAttr('disabled');

                var groupLoanClientICPT = $('#groupLoanClientICPT');
                groupLoanClientICPT.val('');
                groupLoanClientICPT.removeAttr('disabled');

                var groupLoanClientReason = $('#groupLoanClientReason');
                groupLoanClientReason.val('');
                groupLoanClientReason.removeAttr('disabled');
            },
            complete: function() {
                hideLoader();
            }
        }).fail(function(Response) {
            hideLoader();
            document.getElementById("groupLoanClientPrincipal").disabled = false;
            document.getElementById("groupLoanClientDuration").disabled = false;
            document.getElementById("groupLoanClientNORe").disabled = false;
            document.getElementById("groupLoanClientAmortizationType").disabled = false;
            document.getElementById("groupLoanClientAIR").disabled = false;
            document.getElementById("groupLoanClientDuTy").disabled = false;
            document.getElementById("groupLoanClientDiDate").disabled = false;
            document.getElementById("groupLoanClientInType").disabled = false;
            document.getElementById("groupLoanClientICPT").disabled = false;
            document.getElementById("groupLoanClientReason").disabled = false;
            document.getElementById("groupLoanSubmit").disabled = false;
            $("#groupLoanSubmit").show();
            document.getElementById("groupLoanConfirmCreate").disabled = false;
            $("#groupLoanConfirmCreate").hide();
            console.log("group loan creation failed");
            console.log(Response);
            var jsonFormatedMessage = null;
            try {
                jsonFormatedMessage = Response.responseJSON
                var errObj = JSON.parse(jsonFormatedMessage.message)
                var errMsg = errObj.errors[0].developerMessage;
                showAlertMessage(errMsg, AlertTypes.danger);
            } catch (err) {
                console.log(err);
                showAlertMessage('Group Loan Application creation failed, please contact the support', AlertTypes.danger);

            }
            //showAlertMessage('Group Loan Application creation failed, please contact the support', AlertTypes.danger);
            scrollToTop();
        });
    };

    GroupHandler.prototype.validateLoanClientsExtendedData = function(loanObj, groupObj) {
        if (!exists(loanObj.loanClients) || loanObj.loanClients.length < groupObj.clients.length) {
            //showAlertMessage('all group members must have their personal information attached, click add data on the group members!', AlertTypes.warning);
            return false;
        }
        return true;
    };
    GroupHandler.prototype.submitLoanData = function() {
        var uri = '/loan/v1d';

        //constructing loan body

        //<editor-fold defaultstate="collapsed" desc="Collateral String">
        var collateralJsonString =
            '[{"' +
            'index":"' + '0' + '"' +
            ',"type":"' + $('#loanClientCerditCT').val() + '"' +
            ',"description":"' + "" + '"' +
            ',"value":"' + $('#loanClientCerditCTV').val() + '"' +
            '}]';

        var collatoralJsonLine = "";

        if (document.getElementById("loanClientCerditCT").value !== "UNSECURED" && document.getElementById("loanClientCerditCT").value !== "") {
            collatoralJsonLine = ',"creditCollaterals":' + collateralJsonString + '';
        }
        //</editor-fold>

        //<editor-fold defaultstate="collapsed" desc="Guarantor String">
        var guarantorJsonString =
            '{"' +
            'guarantorName":"' + $('#loanClientGuarantorName').val() + '"' +
            ',"guarantorValue":"' + $('#loanClientGuarantorIncome').val() + '"' +
            '}';

        var guarantorJsonLine = '';

        if (document.getElementById("loanClientHaveGuarantor").value === "YES") {
            guarantorJsonLine = ',"guarantor":' + guarantorJsonString + '';
        }
        //</editor-fold>

        //<editor-fold defaultstate="collapsed" desc="Employed">
        var clientEmplAddressJsonString =
            '{"' +
            'province":"' + $('#loanClientEmpProvince').val() + '"' +
            ',"city":"' + $('#loanClientEmpCity').val() + '"' +
            ',"street":"' + $('#loanClientEmpStreet').val() + '"' +
            '}';

        var clientEmploymentJsonString =
            '{"' +
            'employmentType":"' + 'EMPLOYED' + '"' +
            ',"startDate":"' + loanEmpStartDate + '"' +
            ',"monthlyIncome":"' + $('#loanClientEmpMonIncome').val() + '"' +
            ',"formallyRegistered":"' + $('#loanClientEmpFoRe').val() + '"' +
            ',"numberOfEmployees":"' + $('#loanClientEmpNOE').val() + '"' +
            ',"address":' + clientEmplAddressJsonString + '' +
            ',"businessSector":"' + $('#loanClientEmpSector').val() + '"' +
            ',"sector":"' + 'BUSINESS_SECTOR' + '"' +
            ',"awamoId":"' + $('#loanClientAwamoId').val() + '"' +
            ',"name":"' + $('#loanClientEmpCompanyName').val() + '"' +
            '}';
        //</editor-fold>

        //<editor-fold defaultstate="collapsed" desc="SelfEmplyed">
        var clientSelfEmplAddressJsonString =
            '{"' +
            'province":"' + $('#loanClientSelfEmpProvince').val() + '"' +
            ',"city":"' + $('#loanClientSelfEmpCity').val() + '"' +
            ',"street":"' + $('#loanClientSelfEmpStreet').val() + '"' +
            '}';

        var selfEmplymentSecotrLine = "";

        if (document.getElementById("loanClientSelfEmpType").value === "FARMER") {
            selfEmplymentSecotrLine = ',"agriculturalSector":"' + $('#loanClientSelfEmpAPro').val() + '"';
        }

        if (document.getElementById("loanClientSelfEmpType").value === "OTHER") {
            selfEmplymentSecotrLine = ',"businessSector":"' + $('#loanClientSelfEmpBSector').val() + '"';
        }

        var clientSelfEmploymentJsonString =
            '{"' +
            'employmentType":"' + 'SELF_EMPLOYED' + '"' +
            ',"selfEmploymentType":"' + $('#loanClientSelfEmpType').val() + '"' +
            ',"startDate":"' + loanSelfEmpStartDate + '"' +
            ',"monthlyIncome":"' + $('#loanClientSelfEmpMonIncome').val() + '"' +
            ',"formallyRegistered":"' + $('#loanClientSelfEmpFoRe').val() + '"' +
            ',"numberOfEmployees":"' + $('#loanClientSelfEmpNOE').val() + '"' +
            ',"address":' + clientSelfEmplAddressJsonString + '' +
            selfEmplymentSecotrLine +
            ',"awamoId":"' + $('#loanClientAwamoId').val() + '"' +
            ',"name":"' + $('#loanClientSelfEmpCompanyName').val() + '"' +
            '}';
        //</editor-fold>

        //<editor-fold defaultstate="collapsed" desc="Employments line">
        var empLineJsonString = '';

        if (document.getElementById("loanClientSelfEmployed").value === "YES" && document.getElementById("loanClientEmployed").value === "YES") {
            empLineJsonString = ',"clientEmployments":' + "[" + clientSelfEmploymentJsonString + "," + clientEmploymentJsonString + "]";
        } else {
            if (document.getElementById("loanClientSelfEmployed").value === "YES") {
                empLineJsonString = ',"clientEmployments":' + "[" + clientSelfEmploymentJsonString + "]";
            }

            if (document.getElementById("loanClientEmployed").value === "YES") {
                empLineJsonString = ',"clientEmployments":' + "[" + clientEmploymentJsonString + "]";
            }
        }
        //</editor-fold>

        //<editor-fold defaultstate="collapsed" desc="Loan Clients">
        var clientAddressJsonString =
            '{"' +
            'province":"' + $('#loanClientProvince').val() + '"' +
            ',"city":"' + $('#loanClientCity').val() + '"' +
            ',"street":"' + $('#loanClientStreet').val() + '"' +
            '}';


        var loanClientsJsonString =
            '[{"' +
            'awamoId":"' + $('#loanClientAwamoId').val() + '"' +
            ',"numberOfChildren":"' + $('#loanClientNOC').val() + '"' +
            ',"numberOfChildrenInHouseHold":"' + $('#loanClientFirstNOCIH').val() + '"' +
            ',"maritalStatus":"' + $('#loanClientMartialStatus').val() + '"' +
            ',"livingArea":"' + $('#loanClientLivingArea').val() + '"' +
            ',"address":' + clientAddressJsonString + '' +
            guarantorJsonLine +
            empLineJsonString +
            '}]';
        //</editor-fold>

        //<editor-fold defaultstate="collapsed" desc="Calculate Duration">
        var calculatedDuration = $('#loanClientDuration').val();

        if ($('#loanClientDuTy').val() === "WEEKS") {
            calculatedDuration = calculatedDuration * 7;
        }

        if ($('#loanClientDuTy').val() === "MONTHS") {
            calculatedDuration = calculatedDuration * 30;
        }

        if ($('#loanClientDuTy').val() === "YEARS") {
            calculatedDuration = calculatedDuration * 365;
        }
        //</editor-fold>

        var currentTime = new Date().getTime();

        var body = '{"' +
            'awamoId":"' + $('#loanClientAwamoId').val() + '"' +
            ',"numberOfRepayments":"' + $('#loanClientNORe').val() + '"' +
            ',"amortizationType":"' + $('#loanClientAmortizationType').val() + '"' +
            ',"interestCalculationPeriodType":"' + $('#loanClientICPT').val() + '"' +
            ',"reason":"' + $('#loanClientReason').val() + '"' +
            ',"interestType":"' + $('#loanClientInType').val() + '"' +
            ',"disbursementDate":"' + loanDisDate + '"' +
            ',"submitDate":"' + currentTime + '"' +
            ',"loanType":"' + "INDIVIDUAL" + '"' +
            ',"interestRate":"' + $('#loanClientAIR').val() + '000' + '"' +
            ',"principal":"' + $('#loanClientPrincipal').val() + '00' + '"' +
            ',"duration":"' + calculatedDuration + '"' +
            ',"loanClients":' + loanClientsJsonString + '' +
            collatoralJsonLine +
            ',"loanOfficer":"' + user.fullname + '"' +
            '}';

        $.ajax({
            url: host + uri,
            type: 'POST',
            data: body,
            headers: getAuthenticationHeader(),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function() {
                $body = $("body");
                $body.addClass("loading");
                //$body.removeClass("loading");
            },
            success: function(data) {
                Options.prototype.loanCreationPassed();
            },
            complete: function() {
                $body = $("body");
                $body.removeClass("loading");
            }
        }).fail(function(Response) {
            console.log(Response);
            //            message(
            //                    'Warning',
            //                    " Loan Application creation failed, please contact the support",
            //                    MessageType.WARNING);
            if (exists(Response) && exists(Response.responseJSON)) {
                showAlertMessage('Group Loan Application creation failed, ' + Response.responseJSON.message, AlertTypes.danger);
            } else {
                showAlertMessage('Loan Application creation failed, please contact the support', AlertTypes.danger);
            }

            $('html, body').animate({ scrollTop: document.body.scrollHeight }, 'fast');
        });
    };
    GroupHandler.prototype.getGroupObject = function() {
        var $groupAddMemberTop = $('#groupAddMemberTop');
        var groupObj = $groupAddMemberTop.data('object');
        return groupObj;

    }
    GroupHandler.prototype.createNewLoanApplication = function(e) {
        console.log("hit craateNewLoanApplication");
        var groupObj = GroupHandler.self.getGroupObject();
        console.log(groupObj);
        Options.prototype.createLoanApplication(groupObj, 'GROUP');

    };
    GroupHandler.prototype.emptyAndUnbindEvents = function() {
        var $groupAddMemberTop = $('#groupAddMemberTop');
        $groupAddMemberTop.data('object', null);
        $groupAddMemberTop.off('click touch');
        $("#groupSubmit").off('click touch');
        $('#groupLoanSubmit').off('click touch');
        $('#groupLoanConfirmCreate').off('click touch');
        $('#groupLoanCancelCreateBtn').off('click touch');
        $('#groupCancelCreateBtn').off('click touch');
        $('#inGroupName').off('blur change');
    };
    GroupHandler.prototype.rowClickHandler = function() {
        var action = $(this).data('id');
        var rowData = $(this).data('object');
        //console.log(rowData);
        if (!exists(rowData))
            return;
        clearFormValidators($('#createOrEditGroupContainerForm'));
        GroupHandler.self.displayGroupLoan(rowData, false);
    };
    GroupHandler.prototype.rowClickHandlerForLoanApplication = function() {
        var action = $(this).data('id');
        var rowData = $(this).data('object');
        console.log("The row data: ", rowData);
        console.log("The action: ", action);
        if (!exists(rowData))
            return;
        // GroupHandler.self.displayGroupLoan(rowData, true);

        // Protect the scope of this
        var group = $(this).data('object');

        // Check loan application status
        var uri = "/loan/v1d/getGroupLoanApplicationStatus/" + group.awamoId;
        $.ajax({
            url: host + uri,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            headers: getAuthenticationHeader(),
            type: 'GET',
            beforeSend: function() {
                showLoader();
            },
            success: function(ok) {
                if (ok) {
                    GroupHandler.self.displayGroupLoan(rowData, true);
                } else {
                    showAlertMessage('Sorry, the group has already made a loan application.', AlertTypes.danger);
                }
            },
            complete: function() {
                hideLoader();
            }
        }).fail(function(Response) {

        });
    };
    GroupHandler.prototype.groupMemberRowClickHandler = function() {

        var action = $(this).data('id');
        var rowData = $(this).data('object');
        if (!exists(rowData))
            return;
        //alert("handle group member row not yet implemented");
    }
    GroupHandler.prototype.excludeFromArray = function(arrObject, awamoId) {
        var returnArr = arrObject.filter(function(obj) {
            return obj.awamoId !== awamoId;
        })
        console.log(returnArr.length)
        return returnArr;
    };
    GroupHandler.prototype.showAddClientScreen = function(group) {
        $groupClientAddBackBtn = $('#groupClientAddBackBtn');
        $groupClientAddBackBtn.off('click touch');
        $groupClientAddBackBtn.on('click touch', function(e) {
            var groupObject = GroupHandler.self.getGroupObject();
            GroupHandler.self.previousPage(groupObject);
        })
        initDefaultContent("Select a client to add to " + group.name);
        var $rowContainer = getRowContainer("#groupTableContainer", GroupHandler.MEMBER_ADD_LIST_TITLES, true);
        //  $rowContainer.css('text-align', 'right');
        var clients = GroupHandler.self.getClients();
        var filteredClients = null;
        if (exists(group.clients) && group.clients.length > 0) {
            filteredClients = clients;
            group.clients.forEach(function(clientAwamoId) {
                filteredClients = GroupHandler.self.excludeFromArray(filteredClients, clientAwamoId);
            });
        } else {
            filteredClients = clients;
        }
        if (exists(filteredClients)) {
            filteredClients.forEach(function(client) {
                console.log(client);

                var rowData = GroupHandler.self.getRowData(client, GroupHandler.MEMBER_ADD_LIST_TITLES);
                addRow($rowContainer, rowData, client, GroupHandler.self.groupMemberRowClickHandler, client.awamoId);
                var $row = $rowContainer.find("[data-id='" + client.awamoId + "']");
                var $tds = $('td', $row);
                $tds.css('text-align', 'center');
                //var addclientAnchor = $('a', $row);

                if (exists(client) && exists(client.image)) {
                    var clientImageEl = $('img', $row);
                    var src = 'data:image/jpeg;base64,' + client.image;
                    clientImageEl.attr('src', src);
                }
                $row.on('click touch', GroupHandler.self.addClientToGroup);
                //var addclientAnchor = $('a', $row);
                //addclientAnchor.on('click touch', GroupHandler.self.addClientToGroup);
            });
        }
        var $table = $rowContainer.parent();
        var tableSorter = getDefaultTableSorter();
        tableSorter.headers = {
            3: { sorter: 'awamoDateSorter' },
            4: { sorter: 'awamoDateSorter' }
        };
        // $table.tablesorter(tableSorter);
        initialize_datatable($table);
    };
    GroupHandler.prototype.addClientToGroup = function() {
        //var clientRowData = $(this).parent().parent().data('object');
        var clientRowData = $(this).data('object');
        console.log(clientRowData);
        var $groupAddMemberTop = $('#groupAddMemberTop');
        var groupData = $groupAddMemberTop.data('object');
        console.log(groupData);
        if (exists(groupData)) {
            var client = GroupHandler.self.getClient(clientRowData.awamoId);
            if (exists(client)) {
                groupData.clients.push(client.awamoId);
                console.log(groupData);
            } else {
                showAlertMessage('client does not exist in the list', AlertTypes.warning);
            }
        }

        GroupHandler.self.displayGroupLoan(groupData, false);
    }
    GroupHandler.prototype.removeClientFromGroup = function() {
        var clientRowData = $(this).parent().parent().data('object');
        console.log(clientRowData);
        var $groupAddMemberTop = $('#groupAddMemberTop');
        var groupData = $groupAddMemberTop.data('object');
        console.log(groupData);
        if (exists(groupData)) {
            var client = GroupHandler.self.getClient(clientRowData.awamoId);
            if (exists(client)) {
                var index = groupData.clients.indexOf(client.awamoId);
                groupData.clients.splice(index, 1);
                $groupAddMemberTop.data('object', groupData);
                console.log(groupData);
            } else {
                showAlertMessage('client already removed in the list', AlertTypes.warning);
            }
        }

        GroupHandler.self.displayGroupLoan(groupData, false);
    }
    GroupHandler.prototype.addClientExtendedData = function() {
        GroupHandler.self.previousPage = GroupHandler.prototype.displayGroupWithLoanApplication
        $('#cancelCreateLoanInfoApplicationBottom').off('click touch').on('click touch', function() {
            var groupObj = GroupHandler.self.getGroupObject();
            GroupHandler.self.previousPage(groupObj);
            $(this).hide();
        }).show();
        var clientRowData = $(this).parent().parent().data('object');
        console.log(clientRowData);
        if (exists(clientRowData)) {
            var client = GroupHandler.self.getClient(clientRowData.awamoId);
            console.log(client);
            if (exists(client)) {
                var clientLoanExtendedData = GroupHandler.prototype.getClientExtendedData(client.awamoId);
                if (exists(clientLoanExtendedData)) {
                    // TO DO, populate the data to the UI for Editing
                    console.log('extended data  exists bind form and edit');
                    isClientTestData = false;
                    GroupHandler.self.persistGroupLoanToDom();
                    //GroupHandler.prototype.bindPersonalInfoFields(clientLoanExtendedData);
                    Options.prototype.addPersonalDataForLoanApplication(client.awamoId, GroupHandler.prototype.getGroupObject());
                } else {
                    //TO DO create new loan data
                    isClientTestData = true;
                    GroupHandler.self.persistGroupLoanToDom();
                    console.log('extended data not exists refresh form and populate new')
                    Options.prototype.addPersonalDataForLoanApplication(client.awamoId, GroupHandler.prototype.getGroupObject());
                }
            }
            console.log(client);
        } else {
            alert("client does not exist in the list");
        }
    }
    GroupHandler.prototype.putExtendedClientData = function(clientData) {
        $('#cancelCreateLoanInfoApplicationBottom').hide();
        console.log(JSON.stringify(clientData));
        if (exists(clientData)) {
            var groupObject = GroupHandler.prototype.getGroupObject();
            console.log("----group Loan before  client extended data manipulation----");
            console.log(groupObject)
            if (exists(groupObject)) {
                if (exists(groupObject.clientsExtendedData)) {
                    var clientExtentedData = groupObject.clientsExtendedData.filter(function(item) {
                        return item.awamoId === clientData.awamoId;
                    });
                    console.log("----clientExtentedData before  client extended data maninuplation----");
                    console.log(clientExtentedData)
                    if (clientExtentedData.length === 0) {
                        console.log("----appending another group client extended data----");
                        groupObject.clientsExtendedData.push(clientData);
                        console.log(groupObject);
                        var $groupAddMemberTop = $('#groupAddMemberTop');
                        $groupAddMemberTop.data('object', groupObject);
                        GroupHandler.prototype.displayGroupLoan(groupObject, true);
                    } else {
                        var index = groupObject.clientsExtendedData.indexOf(clientExtentedData[0])
                        groupObject.clientsExtendedData.splice(index, 1);
                        console.log("----replacing group client extended data----");
                        groupObject.clientsExtendedData.push(clientData);
                        console.log(groupObject)
                        var $groupAddMemberTop = $('#groupAddMemberTop');
                        $groupAddMemberTop.data('object', groupObject);
                        GroupHandler.prototype.displayGroupLoan(groupObject, true);
                    }
                } else {
                    groupObject.clientsExtendedData = new Array()
                    groupObject.clientsExtendedData.push(clientData);
                    console.log("----adding new group client extended data----");
                    console.log(groupObject);
                    var $groupAddMemberTop = $('#groupAddMemberTop');
                    $groupAddMemberTop.data('object', groupObject);
                    GroupHandler.prototype.displayGroupLoan(groupObject, true);
                }
            }
        }
    }
    GroupHandler.prototype.getClientExtendedData = function(clientAwamoId) {
        var groupObject = GroupHandler.prototype.getGroupObject();
        if (exists(groupObject) && exists(groupObject.clientsExtendedData)) {
            var clientLoanData = groupObject.clientsExtendedData.filter(function(data) {
                return data.awamoId === clientAwamoId;
            })
            console.log(clientLoanData)
            return exists(clientLoanData) ? clientLoanData[0] : null;
        } else {
            return null;
        }

    }
    GroupHandler.prototype.bindPersonalInfoFields = function(clientData) {
        //alert('hit bindPersonalInfoFields');
        console.log(clientData)
            //client information
            //var clientAwamoId=$('#loanClientAwamoId');
            //clientAwamoId.val(clientData.awamoId);
        var loanClientNOC = $("#loanClientNOC");
        loanClientNOC.val(clientData.numberOfChildren);

        var loanClientFirstNOCIH = $("#loanClientFirstNOCIH");
        loanClientFirstNOCIH.val(clientData.numberOfChildrenInHouseHold);

        var $loanClientLivingArea = $("#loanClientLivingArea");
        $loanClientLivingArea.val(clientData.livingArea);

        var $loanClientMartialStatus = $("#loanClientMartialStatus");
        $loanClientMartialStatus.val(clientData.maritalStatus);

        if (exists(clientData.address)) {
            var $loanClientProvince = $("#loanClientProvince");
            var $loanClientCity = $("#loanClientCity");
            var $loanClientStreet = $("#loanClientStreet");
            $loanClientProvince.val(clientData.address.province);
            $loanClientCity.val(clientData.address.city);
            $loanClientStreet.val(clientData.address.street);
        }

        if (exists(clientData.clientEmployments)) {
            clientData.clientEmployments.forEach(function(clientEmployment, index) {
                if (clientEmployment.employmentType === "SELF_EMPLOYED") {
                    if (exists(clientEmployment.address)) {
                        var loanClientSelfEmpProvince = $("#loanClientSelfEmpProvince");
                        var loanClientSelfEmpCity = $("#loanClientSelfEmpCity");
                        var loanClientSelfEmpStreet = $("#loanClientSelfEmpStreet");
                        loanClientSelfEmpProvince.val(clientEmployment.address.province).removeAttr('disabled');
                        loanClientSelfEmpCity.val(clientEmployment.address.city).removeAttr('disabled');
                        loanClientSelfEmpStreet.val(clientEmployment.address.street).removeAttr('disabled');
                    }
                    var loanClientSelfEmployed = $('#loanClientSelfEmployed');
                    loanClientSelfEmployed.val('YES');
                    var loanClientSelfEmpCompanyName = $("#loanClientSelfEmpCompanyName");
                    loanClientSelfEmpCompanyName.removeAttr('disabled');
                    loanClientSelfEmpCompanyName.val(clientEmployment.name);
                    var loanClientSelfEmpMonIncome = $("#loanClientSelfEmpMonIncome");
                    loanClientSelfEmpMonIncome.val(clientEmployment.monthlyIncome);
                    loanClientSelfEmpMonIncome.removeAttr('disabled');
                    var loanClientSelfStartDate = $("#loanClientSelfStartDate");
                    loanClientSelfStartDate.val(formatDate(clientEmployment.startDate)).removeAttr('disabled');
                    var loanClientSelfEmpNOE = $("#loanClientSelfEmpNOE");
                    loanClientSelfEmpNOE.val(clientEmployment.numberOfEmployees).removeAttr('disabled');
                    var loanClientSelfEmpFoRe = $("#loanClientSelfEmpFoRe");
                    loanClientSelfEmpFoRe.val(clientEmployment.formallyRegistered).removeAttr('disabled');
                    if (clientEmployment.selfEmploymentType === 'FARMER') {
                        $('#loanClientSelfEmpAPro').val(clientEmployment.agriculturalSector).removeAttr('disabled');
                        $('#loanClientSelfEmpBSector').attr('disabled', 'disabled');
                        $('#loanClientSelfEmpType').val('FARMER').removeAttr('disabled');
                        $('#loanClientSelfEmpBSector').val('').attr('disabled', 'disabled');
                    } else if (clientEmployment.selfEmploymentType === 'OTHER') {
                        $('#loanClientSelfEmpType').val('OTHER').removeAttr('disabled')
                        $('#loanClientSelfEmpAPro').attr('disabled', 'disabled');
                        $('#loanClientSelfEmpBSector').val(clientEmployment.businessSector)

                    }
                } else if (clientEmployment.employmentType === "EMPLOYED") {
                    if (exists(clientEmployment.address)) {
                        var loanClientEmpProvince = $("#loanClientEmpProvince");
                        var loanClientEmpCity = $("#loanClientEmpCity");
                        var loanClientEmpStreet = $("#loanClientEmpStreet");
                        loanClientEmpProvince.val(clientEmployment.address.province);
                        loanClientEmpCity.val(clientEmployment.address.city);
                        loanClientEmpStreet.val(clientEmployment.address.street);
                    }
                    var loanClientEmployed = $('#loanClientEmployed');
                    loanClientEmployed.val('YES');
                    var loanClientEmpCompanyName = $("#loanClientEmpCompanyName");
                    loanClientEmpCompanyName.val(clientEmployment.name)
                    var loanClientEmpMonIncome = $("#loanClientEmpMonIncome");
                    loanClientEmpMonIncome.val(clientEmployment.monthlyIncome)
                    var loanClientEmpSector = $("#loanClientEmpSector");
                    loanClientEmpSector.val(clientEmployment.businessSector);
                    var loanClientStartDate = $("#loanClientStartDate");
                    loanClientStartDate.val(formatDate(clientEmployment.startDate));
                    var loanClientEmpNOE = $("#loanClientEmpNOE");
                    loanClientEmpNOE.val(clientEmployment.numberOfEmployees);
                    var loanClientEmpFoRe = $("#loanClientEmpFoRe");
                    loanClientEmpFoRe.val(clientEmployment.formallyRegistered);

                    loanClientEmpCompanyName.removeAttr('disabled');
                    loanClientEmpMonIncome.removeAttr('disabled');
                    loanClientEmpSector.removeAttr('disabled');
                    loanClientEmpProvince.removeAttr('disabled');
                    loanClientStartDate.removeAttr('disabled');
                    loanClientEmpNOE.removeAttr('disabled');
                    loanClientEmpFoRe.removeAttr('disabled');
                    loanClientEmpCity.removeAttr('disabled');
                    loanClientEmpStreet.removeAttr('disabled');



                    if (clientEmployment.selfEmploymentType === 'FARMER') {
                        $('#loanClientSelfEmpAPro').val(clientEmployment.agriculturalSector);
                        $('#loanClientSelfEmpBSector').attr('disabled', 'disabled');
                        $('#loanClientSelfEmpType').val('FARMER');
                    } else {
                        $('#loanClientSelfEmpType').val('OTHER');
                        $('#loanClientSelfEmpAPro').attr('disabled', 'disabled');
                        $('#loanClientSelfEmpBSector').val(clientEmployment.businessSector)

                    }
                }
            })
        }

        /*document.getElementById("loanClientProvince").disabled = false;
         document.getElementById("loanClientCity").disabled = false;
         document.getElementById("loanClientFirstNOCIH").disabled = false;
         document.getElementById("loanClientLivingArea").disabled = false;
         document.getElementById("loanClientStreet").disabled = false;
         document.getElementById("loanClientNOC").disabled = false;
         document.getElementById("loanClientMartialStatus").disabled = false;
         document.getElementById("loanClientEmployed").disabled = false;
         document.getElementById("loanClientSelfEmployed").disabled = false;

         document.getElementById("loanClientProvince").value = "";
         document.getElementById("loanClientCity").value = "";
         document.getElementById("loanClientFirstNOCIH").value = "";
         document.getElementById("loanClientLivingArea").value = "";
         document.getElementById("loanClientStreet").value = "";
         document.getElementById("loanClientNOC").value = "";
         document.getElementById("loanClientMartialStatus").value = "";
         document.getElementById("loanClientEmployed").value = "";
         document.getElementById("loanClientSelfEmployed").value = "";

         //Employment Fields
         document.getElementById("loanClientEmpCompanyName").disabled = true;
         document.getElementById("loanClientEmpMonIncome").disabled = true;
         document.getElementById("loanClientEmpSector").disabled = true;
         document.getElementById("loanClientEmpProvince").disabled = true;
         document.getElementById("loanClientEmpStreet").disabled = true;
         document.getElementById("loanClientStartDate").disabled = true;
         document.getElementById("loanClientEmpNOE").disabled = true;
         document.getElementById("loanClientEmpFoRe").disabled = true;
         document.getElementById("loanClientEmpCity").disabled = true;
         document.getElementById("loanClientStartDate").style.backgroundColor = "#eee";

         document.getElementById("loanClientEmpCompanyName").required = false;
         document.getElementById("loanClientEmpMonIncome").required = false;
         document.getElementById("loanClientEmpSector").required = false;
         document.getElementById("loanClientEmpProvince").required = false;
         document.getElementById("loanClientEmpStreet").required = false;
         document.getElementById("loanClientStartDate").required = false;
         document.getElementById("loanClientEmpNOE").required = false;
         document.getElementById("loanClientEmpFoRe").required = false;
         document.getElementById("loanClientEmpCity").required = false;

         document.getElementById("loanClientEmpCompanyName").value = "";
         document.getElementById("loanClientEmpMonIncome").value = "";
         document.getElementById("loanClientEmpSector").value = "";
         document.getElementById("loanClientEmpProvince").value = "";
         document.getElementById("loanClientEmpStreet").value = "";
         document.getElementById("loanClientStartDate").value = "";
         document.getElementById("loanClientEmpNOE").value = "";
         document.getElementById("loanClientEmpFoRe").value = "";
         document.getElementById("loanClientEmpCity").value = "";

         //Self Employment Fields
         document.getElementById("loanClientSelfEmpCompanyName").disabled = true;
         document.getElementById("loanClientSelfEmpMonIncome").disabled = true;
         document.getElementById("loanClientSelfEmpType").disabled = true;
         document.getElementById("loanClientSelfEmpAPro").disabled = true;
         document.getElementById("loanClientSelfEmpProvince").disabled = true;
         document.getElementById("loanClientSelfEmpStreet").disabled = true;
         document.getElementById("loanClientSelfStartDate").disabled = true;
         document.getElementById("loanClientSelfEmpNOE").disabled = true;
         document.getElementById("loanClientSelfEmpBSector").disabled = true;
         document.getElementById("loanClientSelfEmpFoRe").disabled = true;
         document.getElementById("loanClientSelfEmpCity").disabled = true;
         document.getElementById("loanClientSelfStartDate").style.backgroundColor = "#eee";

         document.getElementById("loanClientSelfEmpCompanyName").required = false;
         document.getElementById("loanClientSelfEmpMonIncome").required = false;
         document.getElementById("loanClientSelfEmpType").required = false;
         document.getElementById("loanClientSelfEmpAPro").required = false;
         document.getElementById("loanClientSelfEmpProvince").required = false;
         document.getElementById("loanClientSelfEmpStreet").required = false;
         document.getElementById("loanClientSelfStartDate").required = false;
         document.getElementById("loanClientSelfEmpNOE").required = false;
         document.getElementById("loanClientSelfEmpBSector").required = false;
         document.getElementById("loanClientSelfEmpFoRe").required = false;
         document.getElementById("loanClientSelfEmpCity").required = false;

         document.getElementById("loanClientSelfEmpCompanyName").value = "";
         document.getElementById("loanClientSelfEmpMonIncome").value = "";
         document.getElementById("loanClientSelfEmpType").value = "";
         document.getElementById("loanClientSelfEmpAPro").value = "";
         document.getElementById("loanClientSelfEmpProvince").value = "";
         document.getElementById("loanClientSelfEmpStreet").value = "";
         document.getElementById("loanClientSelfStartDate").value = "";
         document.getElementById("loanClientSelfEmpNOE").value = "";
         document.getElementById("loanClientSelfEmpBSector").value = "";
         document.getElementById("loanClientSelfEmpFoRe").value = "";
         document.getElementById("loanClientSelfEmpCity").value = "";

         //loan information

         document.getElementById("loanClientDuration").disabled = false;
         document.getElementById("loanClientPrincipal").disabled = false;
         document.getElementById("loanClientNORe").disabled = false;
         document.getElementById("loanClientAIR").disabled = false;
         document.getElementById("loanClientDuTy").disabled = false;
         document.getElementById("loanClientDiDate").disabled = false;
         document.getElementById("loanClientInType").disabled = false;
         document.getElementById("loanClientICPT").disabled = false;
         document.getElementById("loanClientReason").disabled = false;

         document.getElementById("loanClientDuration").value = "";
         document.getElementById("loanClientPrincipal").value = "";
         document.getElementById("loanClientNORe").value = "";
         document.getElementById("loanClientAIR").value = "";
         document.getElementById("loanClientDuTy").value = "";
         document.getElementById("loanClientDiDate").value = "";
         document.getElementById("loanClientInType").value = "";
         document.getElementById("loanClientICPT").value = "";
         document.getElementById("loanClientReason").value = "";


         //credit information
         document.getElementById("loanClientCerditCT").disabled = false;
         document.getElementById("loanClientCerditCTV").disabled = true;

         document.getElementById("loanClientCerditCT").value = "";
         document.getElementById("loanClientCerditCTV").value = "";

         document.getElementById("loanClientCerditCTV").required = false;

         //guarantor
         document.getElementById("loanClientHaveGuarantor").disabled = false;
         document.getElementById("loanClientGuarantorName").disabled = true;
         document.getElementById("loanClientGuarantorIncome").disabled = true;

         document.getElementById("loanClientGuarantorName").value = "";
         document.getElementById("loanClientGuarantorIncome").value = "";
         document.getElementById("loanClientHaveGuarantor").value = "";*/



        $("#createLoanApplicationBottom").show();
        $("#confirmLoanApplicationBottom").hide();
        $("#modifyLoanApplicationBottom").hide();
        $("#listLoanApplicationBottom").hide();
        $("#newLoanApplicationBottom").hide();
        if (isTest) {
            Options.self.initTestData();
        }

    }
    GroupHandler.prototype.synchronizeNow = function() {
        groupList.reload();
    }
    GroupHandler.prototype.getRowData = function(objectData, titles) {
        var rowdata = {};
        var groupObj = GroupHandler.self.getGroupObject();
        console.log(groupObj);
        for (var key in titles) {
            var formattedValue = exists(objectData) ? objectData[key] : null;
            switch (key) {
                case 'name':
                    if (exists(objectData.fullname)) {
                        formattedValue = objectData.fullname;
                    } else {
                        formattedValue = formattedValue;
                    }
                    break;
                case 'birthdate':
                    formattedValue = formatDate(formattedValue);
                    break;
                case 'numOfMembers':
                    formattedValue = objectData.clients.length;
                    break;
                case 'submitDate':
                    formattedValue = formatDate(formattedValue);

                    break;
                case 'responsibleLO':
                    formattedValue = GroupHandler.self.getResponsibleLOName(formattedValue);
                    break;
                case 'remove':
                    formattedValue = '<span class="no-link-style" "href="#"> <i class="material-icons">&#xE15D;</i> </span>'
                    break;
                case 'edit':
                    var clientExtendedData = GroupHandler.self.getClientExtendedData(objectData.awamoId);
                    if (exists(groupObj) && exists(groupObj.clientsExtendedData) && exists(clientExtendedData)) {
                        //alert('alert Edit')
                        formattedValue = '<span href="#" class="btn btn-primary customCancelButton "> Edit Data</span>'
                    } else {
                        formattedValue = '<span href="#" class="btn btn-primary customSubmitButton default"> Add Data</span>'
                            // alert('alert add')
                    }

                    break;
                case 'add':
                    formattedValue = '<span class="no-link-style " href="#"></span>';
                    break;
                case 'image':
                    if (exists(objectData) && exists(objectData.image)) {
                        //formattedValue = '<img class="manImg" height=50px  width=50px src="images/personPlaceholderNoText.png"/>';
                        formattedValue = '<i class="mdl-color-text--black material-icons">person</i>'
                    } else {
                        //formattedValue = '<img class="manImg" height=50px  width=50px src="images/personPlaceholderNoText.png"/>'
                        formattedValue = '<i class="mdl-color-text--black material-icons">person</i>'
                    }

                    break;
                default:
                    break;

            }
            if (!exists(formattedValue) || formattedValue === ' ') {
                formattedValue = 'n.a.';
            }
            rowdata[key] = String(formattedValue);
        }
        return rowdata;

    }
    GroupHandler.prototype.getResponsibleLOName = function(responsibleLOId) {

        var officer = GroupHandler.self.getOfficer(responsibleLOId);

        if (exists(officer))
            return sentenceCase(officer.firstname + ", " + officer.lastname);
        return 'Not Loaded, wait & click again';
    }
    GroupHandler.prototype.getOfficer = function(responsibleLOId) {
        //var responsibleLO=officerList.getById(responsibleLOId);
        /*groupList.getOfficerByAwamoId(responsibleLOId,'GET',function(officer){
         console.log(officer)
         return officer===null || typeof officer==='undefined'?'N/A':officer.firstname +", "+officer.lastname;
         },null,{tenantId: 'test12', authentication: 'ZGlyazpvc2gyM3ZubGRwbzQ='},function(error){
         console.log(error)
         });*/
        //return responsibleLO===null?'N/A':responsibleLO.firstname +", "+responsibleLO.lastname;
        //var officer=groupList.getOfficer(responsibleLOId);
        var officer = null;
        if (isTest) {
            console.log("fake officer")
                //alert("using test data")
            officer = GroupHandler.getFakeOfficer(responsibleLOId);
        } else {
            console.log("actual officer")
            officer = groupList.getOfficer(responsibleLOId);
        }
        return officer;

    }
    GroupHandler.prototype.getOfficers = function() {
        //TO DO fectch officers from officerList global variable or server
        var officers = null;
        if (isTest) {
            console.log("fake officers");
            //alert("using test data")
            officers = GroupHandler.getFakeOfficers();
        } else {
            console.log("actual officer")
            officers = officerList.getEntities() //groupList.getOfficers();
            console.log(officers);
        }

        return officers.length > 0 ? officers : null;

    }
    GroupHandler.prototype.getGroupsDataList = function() {
        var groups = null;

        if (isTest) {
            console.log("fake groups")
                //alert("using test data")
            groups = GroupHandler.self.getLocalFakeGroupDataList();
        } else {
            //alert('getting groups')
            console.log("actual groups")
            groups = groupList.getAll();
        }
        return groups.length > 1 ? groups : null;
    }
    GroupHandler.prototype.getGroup = function(groupAwamoId) {
        var group = groupList.getGroup(groupAwamoId);
        return exists(group) ? group[0] : null;
    }
    GroupHandler.prototype.getClient = function(awamoId) {
        //TO DO fectch officers from clientList global variable or server
        var client = null;
        if (isTest) {
            console.log("fake client");
            client = GroupHandler.getFakeClient(awamoId);
        } else {
            console.log("actual client")
            client = groupList.getClient(awamoId);
            console.log(client);
        }
        return client;

    }
    GroupHandler.prototype.getClients = function() {
        //TO DO fectch officers from clientList global variable or server
        var clients = null;
        if (isTest) {
            console.log("fake clients");
            clients = GroupHandler.getFakeClients();
        } else {
            console.log("actual clients")
            clients = groupList.getClients();
        }
        return clients;

    }

    GroupHandler.getFakeOfficer = function(responsibleLOId) {
        var fakeOfficers = GroupHandler.self.getLocalFakeOfficerDataList();
        //console.log(fakeOfficers);
        var fakeOfficer = fakeOfficers.filter(function(officer) {
                return officer.awamoId === responsibleLOId;
            })
            //console.log(fakeOfficer)
        return exists(fakeOfficer) ? fakeOfficer[0] : null;

    }
    GroupHandler.getFakeClient = function(awamoId) {
        var fakeClients = GroupHandler.self.getLocalFakeClientDataList();
        //console.log(fakeClients);
        var fakeClient = fakeClients.filter(function(client) {
            return client.awamoId === awamoId;
        })
        console.log(fakeClient)
        return exists(fakeClient) ? fakeClient[0] : null;
    }
    GroupHandler.getFakeClients = function() {
        var fakeClients = GroupHandler.self.getLocalFakeClientDataList();
        return exists(fakeClients) ? fakeClients : null;
    }
    GroupHandler.getFakeOfficers = function() {
        var fakeOfficers = GroupHandler.self.getLocalFakeOfficerDataList();
        return exists(fakeOfficers) ? fakeOfficers : null;

    }
    GroupHandler.prototype.getLocalFakeGroupDataList = function() {
        //<editor-fold desc="fakeGroups" default-state="collapsed">
        var fakeData = `[{"name":"Kayole Savings Group","awamoId":"5ZHWAFKH","responsibleLO":"5ZGOTMSE",
		"clients":["5ZGP6ISU"	,"5ZGPD1GO"]},
						{"name":"Odinga Savings Scheme","awamoId":"5ZI5BQGO","responsibleLO":"5ZI3QTAU","clients":[]},
						{"name":"Beforward Savings Group","awamoId":"5ZNKB461","responsibleLO":"5ZJQZKY2","clients":[]},
						{"name":"PodoGroup1","awamoId":"5ZOVOT0A","responsibleLO":"5ZJDYW1E","clients":[]},
						{"name":"DirkGroup1","awamoId":"5ZTJXMG4","responsibleLO":"5ZS4T228","clients":[]},
						{"name":"Twende Kazi","awamoId":"601Y7PZX","responsibleLO":"5ZZ005UD","clients":[]},
						{"name":"The Bomberz","awamoId":"63DYQQ0D","responsibleLO":"62TW0HCN","clients":[]},
						{"name":"FirstLiners","awamoId":"63L1I2QT","responsibleLO":"63CKQ5NE","clients":[]},
						{"name":"Ggaba Market","awamoId":"67X465KW","responsibleLO":"66YITM75","clients":[]}]`;
        //</editor-fold>
        return JSON.parse(fakeData);
    }
    GroupHandler.prototype.getLocalFakeOfficerDataList = function() {
        //<editor-fold desc="OfficerFakeData" default-state="collapsed">
        var fakeData = `[{"awamoId":"5ZGHO63W","firstname":"dirk","middlename":null,"lastname":"dirk","birthdate":"1478559600000","nationality":"AFGHAN","iddocumenttype":"NONE","iddocument":"","phone1":"54235466","phone2":"","location":null,"gender":"MALE","submitDate":null,"token":"dummytoken","mainId":"5ZGHO63W","fullname":"DIRK, dirk"}	,
	{"awamoId":"5ZGHR4QW","firstname":"podolak","middlename":null,"lastname":"podolak","birthdate":null,"nationality":null,"iddocumenttype":null,"iddocument":null,"phone1":null,"phone2":null,"location":null,"gender":null,"submitDate":null,"token":"dummytoken","mainId":"5ZGHR4QW","fullname":"PODOLAK, podolak"}	,
	{"awamoId":"5ZGNU2P0","firstname":"Bernd","middlename":"","lastname":"Breadbox","birthdate":"-45792000000","nationality":"ANDORRAN","iddocumenttype":"NONE","iddocument":"NA","phone1":"","phone2":"","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":null,"token":"dummytoken","mainId":"5ZGNU2P0","fullname":"BREADBOX, Bernd"}	,
	{"awamoId":"5ZGOTMSE","firstname":"Samson","middlename":"Officer","lastname":"Akol","birthdate":"636076800000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":"0712152593","phone2":"","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":null,"token":"174816c8-6838-4cec-8d9a-03a3c29c35b4","mainId":"5ZGOTMSE","fullname":"AKOL, Samson"}	,
	{"awamoId":"5ZGOWZDF","firstname":"Charlie","middlename":"","lastname":"Cup","birthdate":"944784000000","nationality":"CAMEROONIAN","iddocumenttype":"DRIVER_LICENSE","iddocument":"Ccccc","phone1":"","phone2":"","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":null,"token":"1a5dd1c2-91ea-4341-85d5-743a586d069d","mainId":"5ZGOWZDF","fullname":"CUP, Charlie"}	,
	{"awamoId":"5ZI1BY3C","firstname":"Samson","middlename":"","lastname":"Akol","birthdate":"1469059200000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":"","phone2":"","location":{"latitude":0.29491333333333336,"longitude":32.59802833333333},"gender":"MALE","submitDate":null,"token":"ed8c9582-4a6f-4d7c-96a4-a614235b0778","mainId":"5ZI1BY3C","fullname":"AKOL, Samson"}	,
	{"awamoId":"5ZI3QTAU","firstname":"Samson","middlename":"","lastname":"Akol","birthdate":"1469059200000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":"0712152593","phone2":"","location":{"latitude":0.2948566666666667,"longitude":32.59822333333333},"gender":"MALE","submitDate":null,"token":"2936ec76-7b52-4f2a-9264-ce080356f726","mainId":"5ZI3QTAU","fullname":"AKOL, Samson"}	,
	{"awamoId":"5ZJDUQQB","firstname":"Samson","middlename":"Officer","lastname":"Akol","birthdate":"636076800000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":"0712152593","phone2":"","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":null,"token":"49ba5a8e-fd54-43c7-80bd-a0005d023554","mainId":"5ZJDUQQB","fullname":"AKOL, Samson"}	,
	{"awamoId":"5ZJDYW1E","firstname":"Dirk","middlename":"","lastname":"Podo","birthdate":"173750400000","nationality":"GERMAN","iddocumenttype":"NATIONAL_ID","iddocument":"Abcde12","phone1":"","phone2":"","location":{"latitude":50.108043333333335,"longitude":8.668626666666666},"gender":"MALE","submitDate":null,"token":"b2a13080-4cc5-4561-b47c-2fd5d5bb723f","mainId":"5ZJDYW1E","fullname":"PODO, Dirk"}	,
	{"awamoId":"5ZJH3N1O","firstname":"OFFICER","middlename":"","lastname":"Claussen","birthdate":"112147200000","nationality":"UGANDAN","iddocumenttype":"NATIONAL_ID","iddocument":"AC27406","phone1":"00491733455808","phone2":"","location":{"latitude":50.108783333333335,"longitude":8.669098333333332},"gender":"MALE","submitDate":null,"token":"f006a81b-ac08-4fc9-bc97-fbf5101e2198","mainId":"5ZJH3N1O","fullname":"CLAUSSEN, OFFICER"}	,
	{"awamoId":"5ZJQZKY2","firstname":"Allan","middlename":"","lastname":"Ssenoga","birthdate":"636076800000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":"0777563123","phone2":"","location":{"latitude":0.2948816666666667,"longitude":32.598205},"gender":"MALE","submitDate":null,"token":"f3c678e5-2f3b-4d51-b6b2-035fea44ffc6","mainId":"5ZJQZKY2","fullname":"SSENOGA, Allan"}	,
	{"awamoId":"5ZQO1CFT","firstname":"Philipp","middlename":"LO left","lastname":"Neub","birthdate":"348192000000","nationality":"GERMAN","iddocumenttype":"PASSPORT","iddocument":"C7GTYH8R","phone1":"+491728877537","phone2":"+256798645312","location":{"latitude":50.107013333333335,"longitude":8.667658333333332},"gender":"MALE","submitDate":null,"token":"96190890-bb56-4fcd-b582-09c85dd7e0b4","mainId":"5ZQO1CFT","fullname":"NEUB, Philipp"}	,
	{"awamoId":"5ZS4T228","firstname":"Dirk","middlename":"","lastname":"Podolak","birthdate":"173750400000","nationality":"GERMAN","iddocumenttype":"DRIVER_LICENSE","iddocument":"Ajjfbjf123","phone1":"","phone2":"","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":null,"token":"e6fb7764-0ec2-481f-bf91-a0f1601ffa95","mainId":"5ZS4T228","fullname":"PODOLAK, Dirk"}	,
	{"awamoId":"5ZZ005UD","firstname":"Samson","middlename":"Officer","lastname":"Akol","birthdate":"636076800000","nationality":"UGANDAN","iddocumenttype":"NATIONAL_ID","iddocument":"CBJ0789232K2","phone1":"0712152593","phone2":"","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":null,"token":"3347c0e8-4c0d-46b4-8880-eff2c5df8708","mainId":"5ZZ005UD","fullname":"AKOL,, Samson"}	,
	{"awamoId":"62SK2O28","firstname":"Samson","middlename":"Officer","lastname":"Akol","birthdate":"1034380800000","nationality":"UGANDAN","iddocumenttype":"NATIONAL_ID","iddocument":"075448253","phone1":"0712152593","phone2":"","location":{"latitude":0.2950233333333333,"longitude":32.59816},"gender":"MALE","submitDate":null,"token":"14f4daa2-f3aa-48b7-9858-8e9d2955df3d","mainId":"62SK2O28","fullname":"AKOL, Samson"}	,
	{"awamoId":"62SPEH97","firstname":"Samson","middlename":"Officer","lastname":"Akol","birthdate":"1034380800000","nationality":"UGANDAN","iddocumenttype":"NATIONAL_ID","iddocument":"780256636","phone1":"0712152593","phone2":"","location":{"latitude":0.29496500000000003,"longitude":32.5981},"gender":"MALE","submitDate":null,"token":"c7636318-dbba-4cb3-89c2-0ee8a5d328b4","mainId":"62SPEH97","fullname":"AKOL, Samson"}	,
	{"awamoId":"62SU5VIY","firstname":"Edison","middlename":"","lastname":"Oluka","birthdate":"1034380800000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":"0712152593","phone2":"","location":{"latitude":0.2951366666666667,"longitude":32.59803333333333},"gender":"MALE","submitDate":null,"token":"b095a9c2-6687-444e-82da-e0b6b369b61b","mainId":"62SU5VIY","fullname":"OLUKA, Edison"}	,
	{"awamoId":"62TW0HCN","firstname":"Elijah","middlename":"","lastname":"Okupa","birthdate":"1034467200000","nationality":"UGANDAN","iddocumenttype":"NATIONAL_ID","iddocument":"CM08537324","phone1":"0702601936","phone2":"","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":null,"token":"f3c886c2-985b-419d-b78a-824ed44a8027","mainId":"62TW0HCN","fullname":"OKUPA, Elijah"}	,
	{"awamoId":"63CKQ5NE","firstname":"Moses","middlename":"","lastname":"Rurangwa","birthdate":"1035590400000","nationality":"KENYAN","iddocumenttype":"NONE","iddocument":"NA","phone1":"","phone2":"","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":null,"token":"dummytoken","mainId":"63CKQ5NE","fullname":"RURANGWA, Moses"}	,
	{"awamoId":"65CZQGJX","firstname":"Oscar","middlename":"","lastname":"Musana","birthdate":"756000000000","nationality":"UGANDAN","iddocumenttype":"NATIONAL_ID","iddocument":"627288282882","phone1":"845245466464","phone2":"545424649","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":null,"token":"ae81a4a9-8b4c-44b2-9c89-e7ca7506c3e9","mainId":"65CZQGJX","fullname":"MUSANA, Oscar"}	,
	{"awamoId":"66RNHOW9","firstname":"Vincent","middlename":"","lastname":"Ssebudde","birthdate":"238809600000","nationality":"UGANDAN","iddocumenttype":"PASSPORT","iddocument":"B0586388","phone1":"+256786223309","phone2":"+256754986953","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":null,"token":"0d712b38-d457-44c7-abcf-8957136b7274","mainId":"66RNHOW9","fullname":"SSEBUDDE, Vincent"}	,
	{"awamoId":"66YHQH62","firstname":"Mous","middlename":"","lastname":"Kamps","birthdate":"631152000000","nationality":"UGANDAN","iddocumenttype":"NATIONAL_ID","iddocument":"Chtggu","phone1":"","phone2":"","location":{"latitude":0.29494000000000004,"longitude":32.598135},"gender":"MALE","submitDate":null,"token":"6d5521ba-14af-4dee-ba86-c9ce0fae6ccb","mainId":"66YHQH62","fullname":"KAMPS, Mous"}	,
	{"awamoId":"66YITM75","firstname":"Samson","middlename":"","lastname":"Akol","birthdate":"636076800000","nationality":"UGANDAN","iddocumenttype":"NATIONAL_ID","iddocument":"C00954782357","phone1":"0712152593","phone2":"","location":{"latitude":0.29488833333333336,"longitude":32.59818},"gender":"MALE","submitDate":null,"token":"7cebd0bd-862f-48d5-b156-65aeb9061752","mainId":"66YITM75","fullname":"AKOL, Samson"}	,
	{"awamoId":"67IF25UU","firstname":"Officer","middlename":"","lastname":"Rurangwa","birthdate":"1044662400000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":"078465162","phone2":"","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":null,"token":"7bf74866-7228-497b-8789-3b188ccff282","mainId":"67IF25UU","fullname":"RURANGWA, Officer"}	,
	{"awamoId":"68AYFMF2","firstname":"Samson","middlename":"","lastname":"Akol","birthdate":"636076800000","nationality":"UGANDAN","iddocumenttype":"NATIONAL_ID","iddocument":"CM900381012VCL","phone1":"0775705402","phone2":"","location":{"latitude":0.2894225,"longitude":32.6160823},"gender":"MALE","submitDate":null,"token":"4238e91b-7ecf-49a0-aec1-d710dd31234b","mainId":"68AYFMF2","fullname":"AKOL, Samson"}	]`;
        //</editor-fold>
        return JSON.parse(fakeData);
    }
    GroupHandler.prototype.getLocalFakeClientDataList = function() {
        //return;
        //<editor-fold desc="FakeClientsList" default-state="collapsed">
        var fakeClients = `[{"awamoId":"5ZGO21U8","firstname":"Bülent","middlename":null,"lastname":"Brimborium","birthdate":"918471816000","nationality":"GERMAN","iddocumenttype":"NONE","iddocument":"NONE","phone1":null,"phone2":null,"location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1469005200000,"site":"OTHER","mainId":"5ZGO21U8","fullname":"BRIMBORIUM, Bülent","age":18,"createdWithin":8},
	{"awamoId":"5ZGP6ISU","firstname":"Chris","middlename":"X.","lastname":"Minion","birthdate":"1086739200000","nationality":"COOK_ISLAND","iddocumenttype":"PASSPORT","iddocument":"Mmmmm","phone1":null,"phone2":null,"location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1469005200000,"site":"CLIENT_RESIDENCE","mainId":"5ZGP6ISU","fullname":"MINION, Chris","age":12,"createdWithin":8}	,
	{"awamoId":"5ZGPD1GO","firstname":"Samson","middlename":"Client","lastname":"Akol","birthdate":"648432000000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":"0712152593","phone2":null,"location":{"latitude":0.29545666666666665,"longitude":32.59880666666666},"gender":"MALE","submitDate":1469005200000,"site":"MFI_OFFICE","mainId":"5ZGPD1GO","fullname":"AKOL, Samson","age":26,"createdWithin":8}	,
	{"awamoId":"5ZI4F2DY","firstname":"Samson","middlename":"Client","lastname":"Akol","birthdate":"1469059200000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":null,"phone2":null,"location":{"latitude":0.2948566666666667,"longitude":32.59822333333333},"gender":"MALE","submitDate":1469091600000,"site":"MFI_OFFICE","mainId":"5ZI4F2DY","fullname":"AKOL, Samson","age":0,"createdWithin":8}	,
	{"awamoId":"5ZJFXQ7F","firstname":"Dirk","middlename":"Client","lastname":"Podolak","birthdate":"173750400000","nationality":"GERMAN","iddocumenttype":"PASSPORT","iddocument":"DirkPass1","phone1":null,"phone2":null,"location":{"latitude":50.10826166666667,"longitude":8.669056666666668},"gender":"MALE","submitDate":1437555600000,"site":"MFI_OFFICE","mainId":"5ZJFXQ7F","fullname":"PODOLAK, Dirk","age":41,"createdWithin":8}	,
	{"awamoId":"5ZJJ6O5W","firstname":"James","middlename":null,"lastname":"Okello","birthdate":"-486000000000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":"0712806048","phone2":null,"location":{"latitude":0.29494666666666663,"longitude":32.598085},"gender":"MALE","submitDate":1469178000000,"site":"MFI_OFFICE","mainId":"5ZJJ6O5W","fullname":"OKELLO, James","age":62,"createdWithin":8}	,
	{"awamoId":"5ZJS3QQ6","firstname":"Mesika","middlename":"Makang'a","lastname":"Mongitta","birthdate":"1468972800000","nationality":"TANZANIAN","iddocumenttype":"DRIVER_LICENSE","iddocument":"Sdfgghh","phone1":"078542323","phone2":null,"location":{"latitude":50.108196666666664,"longitude":8.66845},"gender":"MALE","submitDate":1469178000000,"site":"MFI_OFFICE","mainId":"5ZJS3QQ6","fullname":"MONGITTA, Mesika","age":0,"createdWithin":8}	,
	{"awamoId":"5ZNMC6PK","firstname":"Lawrence","middlename":"Nickie2","lastname":"Mutekanga","birthdate":"573609600000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":null,"phone2":null,"location":{"latitude":0.29579,"longitude":32.59712666666667},"gender":"MALE","submitDate":1469437200000,"site":"MFI_OFFICE","mainId":"5ZNMC6PK","fullname":"MUTEKANGA, Lawrence","age":29,"createdWithin":8}	,
	{"awamoId":"5ZQR3YJE","firstname":"Phil","middlename":"Client right","lastname":"Neub","birthdate":"134870400000","nationality":"GERMAN","iddocumenttype":"DRIVER_LICENSE","iddocument":"7566dg5","phone1":"+256897352654","phone2":null,"location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1469610000000,"site":"MFI_OFFICE","mainId":"5ZQR3YJE","fullname":"NEUB, Phil","age":42,"createdWithin":8}	,
	{"awamoId":"5ZS58HPO","firstname":"Dirk","middlename":null,"lastname":"Podolak","birthdate":"173750400000","nationality":"GERMAN","iddocumenttype":"PASSPORT","iddocument":"Ioggjgty","phone1":null,"phone2":null,"location":{"latitude":50.10872333333334,"longitude":8.669324999999999},"gender":"MALE","submitDate":1469696400000,"site":"MFI_OFFICE","mainId":"5ZS58HPO","fullname":"PODOLAK, Dirk","age":41,"createdWithin":8}	,
	{"awamoId":"5ZZ8F9HI","firstname":"Samson","middlename":"Client","lastname":"Akol","birthdate":"636076800000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":"0702601936","phone2":null,"location":{"latitude":0.2949783333333333,"longitude":32.598085},"gender":"MALE","submitDate":1470128400000,"site":"MFI_OFFICE","mainId":"5ZZ8F9HI","fullname":"AKOL, Samson","age":27,"createdWithin":8}	,
	{"awamoId":"634BBU5M","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BBU5M","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"634BBUXR","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BBUXR","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"634BBVM3","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BBVM3","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"634BBW4G","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BBW4G","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"634BBWZA","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BBWZA","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"634BBXFI","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BBXFI","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"634BBXZX","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BBXZX","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"634BBYKX","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BBYKX","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"634BBYZH","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BBYZH","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"634BBZST","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BBZST","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"634BC0H4","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BC0H4","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"634BC0RJ","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BC0RJ","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"634BC1F9","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BC1F9","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"634BC1V1","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BC1V1","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"634BC27X","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BC27X","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"634BC2ZQ","firstname":"Max","middlename":"M.","lastname":"Mustermann","birthdate":"1369442834000","nationality":"ugandan","iddocumenttype":"NONE","iddocument":"#A123","phone1":"0123456789","phone2":"NA","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1476954000000,"site":"MFI_OFFICE","mainId":"634BC2ZQ","fullname":"MUSTERMANN, Max","age":3,"createdWithin":8}	,
	{"awamoId":"639UU5IG","firstname":"Ocom","middlename":null,"lastname":"Ronnie","birthdate":"1035417600000","nationality":"UGANDAN","iddocumenttype":"NATIONAL_ID","iddocument":"Cm08545","phone1":"0775705402","phone2":null,"location":{"latitude":0.294905,"longitude":32.598103333333334},"gender":"MALE","submitDate":1477299600000,"site":"MFI_OFFICE","mainId":"639UU5IG","fullname":"RONNIE, Ocom","age":14,"createdWithin":8}	,
	{"awamoId":"63CPJL95","firstname":"Clent","middlename":null,"lastname":"Rurangwa","birthdate":"1035590400000","nationality":"KENYAN","iddocumenttype":"NONE","iddocument":"NA","phone1":null,"phone2":null,"location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1477472400000,"site":"CLIENT_RESIDENCE","mainId":"63CPJL95","fullname":"RURANGWA, Clent","age":14,"createdWithin":8}	,
	{"awamoId":"64M9WL2F","firstname":"walid","middlename":"mido","lastname":"lasto","birthdate":"1477954800000","nationality":"american","iddocumenttype":"NONE","iddocument":null,"phone1":"0158964479","phone2":"2254489544","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64M9WL2F","fullname":"LASTO, walid","age":0,"createdWithin":8}	,
	{"awamoId":"64MF61D1","firstname":"gfsd","middlename":"gfsd","lastname":"gfsd","birthdate":"1477954800000","nationality":"albanian","iddocumenttype":"NONE","iddocument":null,"phone1":"gfds","phone2":"gfsd","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MF61D1","fullname":"GFSD, gfsd","age":0,"createdWithin":8}	,
	{"awamoId":"64MF6MSF","firstname":"gfsd","middlename":"gfsd","lastname":"gfsd","birthdate":"1477954800000","nationality":"albanian","iddocumenttype":"NONE","iddocument":null,"phone1":"gfds","phone2":"gfsd","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MF6MSF","fullname":"GFSD, gfsd","age":0,"createdWithin":8}	,
	{"awamoId":"64MF80AO","firstname":"hjhg","middlename":"jfg","lastname":"jhfg","birthdate":"1477954800000","nationality":"albanian","iddocumenttype":"NONE","iddocument":null,"phone1":"jhf","phone2":"jhfg","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MF80AO","fullname":"JHFG, hjhg","age":0,"createdWithin":8}	,
	{"awamoId":"64MFB8W4","firstname":"nhgdfh","middlename":"hgf","lastname":"hdf","birthdate":"1477954800000","nationality":"estonian","iddocumenttype":"NONE","iddocument":null,"phone1":"hgdf","phone2":"hgd","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MFB8W4","fullname":"HDF, nhgdfh","age":0,"createdWithin":8}	,
	{"awamoId":"64MFBEE6","firstname":"nhgdfh","middlename":"hgf","lastname":"hdf","birthdate":"1477954800000","nationality":"estonian","iddocumenttype":"NONE","iddocument":null,"phone1":"hgdf","phone2":"hgd","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MFBEE6","fullname":"HDF, nhgdfh","age":0,"createdWithin":8}	,
	{"awamoId":"64MFBTFB","firstname":"nhgdfh","middlename":"hgf","lastname":"hdf","birthdate":"1477954800000","nationality":"estonian","iddocumenttype":"NONE","iddocument":null,"phone1":"hgdf","phone2":"hgd","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MFBTFB","fullname":"HDF, nhgdfh","age":0,"createdWithin":8}	,
	{"awamoId":"64MFBZO6","firstname":"nhgdfh","middlename":"hgf","lastname":"hdf","birthdate":"1477954800000","nationality":"estonian","iddocumenttype":"NONE","iddocument":null,"phone1":"hgdf","phone2":"hgd","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MFBZO6","fullname":"HDF, nhgdfh","age":0,"createdWithin":8}	,
	{"awamoId":"64MFCOMD","firstname":"nhgdfh","middlename":"hgf","lastname":"hdf","birthdate":"1477954800000","nationality":"estonian","iddocumenttype":"NONE","iddocument":null,"phone1":"hgdf","phone2":"hgd","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MFCOMD","fullname":"HDF, nhgdfh","age":0,"createdWithin":8}	,
	{"awamoId":"64MFD6PZ","firstname":"nhgdfh","middlename":"hgf","lastname":"hdf","birthdate":"1477954800000","nationality":"estonian","iddocumenttype":"NONE","iddocument":null,"phone1":"hgdf","phone2":"hgd","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MFD6PZ","fullname":"HDF, nhgdfh","age":0,"createdWithin":8}	,
	{"awamoId":"64MFE0JO","firstname":"nhgdfh","middlename":"hgf","lastname":"hdf","birthdate":"1477954800000","nationality":"estonian","iddocumenttype":"NONE","iddocument":null,"phone1":"hgdf","phone2":"hgd","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MFE0JO","fullname":"HDF, nhgdfh","age":0,"createdWithin":8}	,
	{"awamoId":"64MFEFF5","firstname":"nhgdfh","middlename":"hgf","lastname":"hdf","birthdate":"1477954800000","nationality":"estonian","iddocumenttype":"NONE","iddocument":null,"phone1":"hgdf","phone2":"hgd","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MFEFF5","fullname":"HDF, nhgdfh","age":0,"createdWithin":8}	,
	{"awamoId":"64MFGS8J","firstname":"hgd","middlename":"hgd","lastname":"hgdf","birthdate":"1477954800000","nationality":"albanian","iddocumenttype":"NONE","iddocument":null,"phone1":"hgdf","phone2":"hd","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MFGS8J","fullname":"HGDF, hgd","age":0,"createdWithin":8}	,
	{"awamoId":"64MFKHH3","firstname":"fds","middlename":"gfsd","lastname":"gds","birthdate":"1478041200000","nationality":"algerian","iddocumenttype":"NONE","iddocument":null,"phone1":"gfsd","phone2":"gfsd","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MFKHH3","fullname":"GDS, fds","age":0,"createdWithin":8}	,
	{"awamoId":"64MFNFZY","firstname":"jhg","middlename":"jhfg","lastname":"jhfg","birthdate":"1477954800000","nationality":"argentinean","iddocumenttype":"NONE","iddocument":null,"phone1":"jhfg","phone2":"jhf","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MFNFZY","fullname":"JHFG, jhg","age":0,"createdWithin":8}	,
	{"awamoId":"64MFO79D","firstname":"jhg","middlename":"jhfg","lastname":"jhfg","birthdate":"1477954800000","nationality":"argentinean","iddocumenttype":"NONE","iddocument":null,"phone1":"jhfg","phone2":"jhf","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MFO79D","fullname":"JHFG, jhg","age":0,"createdWithin":8}	,
	{"awamoId":"64MFTCRN","firstname":"vfds","middlename":"vfds","lastname":"vfds","birthdate":"1477954800000","nationality":"albanian","iddocumenttype":"NONE","iddocument":null,"phone1":"vfd","phone2":"vfsd","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MFTCRN","fullname":"VFDS, vfds","age":0,"createdWithin":8}	,
	{"awamoId":"64MGRII7","firstname":"trwe","middlename":"trwe","lastname":"trwe","birthdate":"1477954800000","nationality":"algerian","iddocumenttype":"NONE","iddocument":null,"phone1":"trwe","phone2":"trwe","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MGRII7","fullname":"TRWE, trwe","age":0,"createdWithin":8}	,
	{"awamoId":"64MGST2R","firstname":"trwe","middlename":"trwe","lastname":"trwe","birthdate":"1477954800000","nationality":"algerian","iddocumenttype":"NONE","iddocument":null,"phone1":"trwe","phone2":"trwe","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MGST2R","fullname":"TRWE, trwe","age":0,"createdWithin":8}	,
	{"awamoId":"64MGUKC5","firstname":"dsa","middlename":"dsa","lastname":"dsa","birthdate":"1478646000000","nationality":"albanian","iddocumenttype":"NONE","iddocument":null,"phone1":"dsa","phone2":"dsa","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MGUKC5","fullname":"DSA, dsa","age":0,"createdWithin":8}	,
	{"awamoId":"64MH2JRL","firstname":"fd","middlename":"fdas","lastname":"asdf","birthdate":"1477954800000","nationality":"albanian","iddocumenttype":"NONE","iddocument":null,"phone1":"fdsa","phone2":"fdas","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MH2JRL","fullname":"ASDF, fd","age":0,"createdWithin":8}	,
	{"awamoId":"64MH3PPZ","firstname":"fd","middlename":"fdas","lastname":"asdf","birthdate":"1477954800000","nationality":"albanian","iddocumenttype":"NONE","iddocument":null,"phone1":"fdsa","phone2":"fdas","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MH3PPZ","fullname":"ASDF, fd","age":0,"createdWithin":8}	,
	{"awamoId":"64MH7992","firstname":"fd","middlename":"fdas","lastname":"asdf","birthdate":"1477954800000","nationality":"albanian","iddocumenttype":"NONE","iddocument":null,"phone1":"fdsa","phone2":"fdas","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MH7992","fullname":"ASDF, fd","age":0,"createdWithin":8}	,
	{"awamoId":"64MH79EX","firstname":"fd","middlename":"fdas","lastname":"asdf","birthdate":"1477954800000","nationality":"albanian","iddocumenttype":"NONE","iddocument":null,"phone1":"fdsa","phone2":"fdas","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MH79EX","fullname":"ASDF, fd","age":0,"createdWithin":8}	,
	{"awamoId":"64MHEA6P","firstname":"fd","middlename":"fdas","lastname":"asdf","birthdate":"1477954800000","nationality":"albanian","iddocumenttype":"NONE","iddocument":null,"phone1":"fdsa","phone2":"fdas","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MHEA6P","fullname":"ASDF, fd","age":0,"createdWithin":8}	,
	{"awamoId":"64MHGN7M","firstname":"eses","middlename":"eses","lastname":"eses","birthdate":"1477954800000","nationality":"albanian","iddocumenttype":"NONE","iddocument":null,"phone1":"eses","phone2":"eses","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MHGN7M","fullname":"ESES, eses","age":0,"createdWithin":8}	,
	{"awamoId":"64MI2K3G","firstname":"hdf","middlename":"hgdf","lastname":"hgdf","birthdate":"1478646000000","nationality":"albanian","iddocumenttype":"NONE","iddocument":null,"phone1":"hgdf","phone2":"hgdf","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MI2K3G","fullname":"HGDF, hdf","age":0,"createdWithin":8}	,
	{"awamoId":"64MTD0HK","firstname":"fas","middlename":"fas","lastname":"fdsa11","birthdate":"1477954800000","nationality":"algerian","iddocumenttype":"NONE","iddocument":null,"phone1":"fas","phone2":"fdsa","location":null,"gender":"MALE","submitDate":1480237200000,"site":"MFI_OFFICE","mainId":"64MTD0HK","fullname":"FDSA11, fas","age":0,"createdWithin":8}	,
	{"awamoId":"64P3VBCW","firstname":"gfdgds","middlename":"gfdsgfds","lastname":"gfdsgfds","birthdate":"1477954800000","nationality":"algerian","iddocumenttype":"NATIONAL_ID","iddocument":"gfdsgds","phone1":"6546","phone2":"654654","location":null,"gender":"MALE","submitDate":1480410000000,"site":"MFI_OFFICE","mainId":"64P3VBCW","fullname":"GFDSGFDS, gfdgds","age":0,"createdWithin":8}	,
	{"awamoId":"64RZB55F","firstname":"gfsd","middlename":"gfsd","lastname":"gfs","birthdate":"1481670000000","nationality":"albanian","iddocumenttype":"NONE","iddocument":null,"phone1":"542","phone2":"5423","location":null,"gender":"MALE","submitDate":1480582800000,"site":"MFI_OFFICE","mainId":"64RZB55F","fullname":"GFS, gfsd","age":0,"createdWithin":8}	,
	{"awamoId":"64RZKUTX","firstname":"fdsa","middlename":"fdsa","lastname":"fdsa","birthdate":"1482361200000","nationality":"albanian","iddocumenttype":"NONE","iddocument":null,"phone1":"fdas","phone2":"fdsa","location":null,"gender":"MALE","submitDate":1480582800000,"site":"MFI_OFFICE","mainId":"64RZKUTX","fullname":"FDSA, fdsa","age":0,"createdWithin":8}	,
	{"awamoId":"6596CMYN","firstname":"isbel","middlename":"fdjsakl","lastname":"hgfjhgj","birthdate":"1476223200000","nationality":"french","iddocumenttype":"NONE","iddocument":null,"phone1":"7646765","phone2":null,"location":null,"gender":"MALE","submitDate":1481619600000,"site":"MFI_OFFICE","mainId":"6596CMYN","fullname":"HGFJHGJ, isbel","age":0,"createdWithin":8}	,
	{"awamoId":"65NGB6NA","firstname":"Muyinda","middlename":"mover","lastname":"Rogers","birthdate":"1107205200000","nationality":"ugandan","iddocumenttype":"NATIONAL_ID","iddocument":"23456789","phone1":"072727272723","phone2":null,"location":null,"gender":"MALE","submitDate":1482483600000,"site":"MFI_OFFICE","mainId":"65NGB6NA","fullname":"ROGERS, Muyinda","age":12,"createdWithin":8}	,
	{"awamoId":"66YJ6S6Y","firstname":"Samson","middlename":"Client","lastname":"Akol","birthdate":"636076800000","nationality":"UGANDAN","iddocumenttype":"NATIONAL_ID","iddocument":"C0092443324","phone1":null,"phone2":null,"location":{"latitude":0.2949283333333333,"longitude":32.598240000000004},"gender":"MALE","submitDate":1485334800000,"site":"MFI_OFFICE","mainId":"66YJ6S6Y","fullname":"AKOL, Samson","age":27,"createdWithin":8}	,
	{"awamoId":"671TKLET","firstname":"Eliot","middlename":"Agira","lastname":"Mukama","birthdate":"475977600000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":null,"phone2":null,"location":{"latitude":-0.6951016666666666,"longitude":30.706155},"gender":"MALE","submitDate":1485507600000,"site":"MFI_OFFICE","mainId":"671TKLET","fullname":"MUKAMA, Eliot","age":32,"createdWithin":8}	,
	{"awamoId":"671U1WPF","firstname":"Test","middlename":null,"lastname":"Data","birthdate":"570240000000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":null,"phone2":null,"location":{"latitude":-0.6915866666666666,"longitude":30.69530666666667},"gender":"MALE","submitDate":1485507600000,"site":"MFI_OFFICE","mainId":"671U1WPF","fullname":"DATA, Test","age":29,"createdWithin":8}	,
	{"awamoId":"67IFLT89","firstname":"Client","middlename":"Rura","lastname":"Rurangwa","birthdate":"1044662400000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":"9786524889","phone2":"88656226","location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1486544400000,"site":"MFI_OFFICE","mainId":"67IFLT89","fullname":"RURANGWA, Client","age":14,"createdWithin":8}	,
	{"awamoId":"67K8ZLYX","firstname":"Rurangwa","middlename":null,"lastname":"Client2","birthdate":"1044748800000","nationality":"KENYAN","iddocumenttype":"NONE","iddocument":"NA","phone1":null,"phone2":null,"location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1486630800000,"site":"MFI_OFFICE","mainId":"67K8ZLYX","fullname":"CLIENT2, Rurangwa","age":14,"createdWithin":8}	,
	{"awamoId":"67VC11QH","firstname":"Vincent","middlename":null,"lastname":"Ssebudde","birthdate":"301881600000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":null,"phone2":null,"location":{"latitude":0.2896586,"longitude":32.6159957},"gender":"MALE","submitDate":1487322000000,"site":"MFI_OFFICE","mainId":"67VC11QH","fullname":"SSEBUDDE, Vincent","age":37,"createdWithin":12}	,
	{"awamoId":"685OELXZ","firstname":"Client","middlename":null,"lastname":"Eva","birthdate":"1046044800000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":"07645215","phone2":null,"location":{"latitude":0.2894233,"longitude":32.6160991},"gender":"MALE","submitDate":1487926800000,"site":"MFI_OFFICE","mainId":"685OELXZ","fullname":"EVA, Client","age":14,"createdWithin":12}	,
	{"awamoId":"685PHKUV","firstname":"Bimbi","middlename":null,"lastname":"Omotola","birthdate":"1046044800000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":null,"phone2":null,"location":{"latitude":0.2894233,"longitude":32.6160991},"gender":"MALE","submitDate":1487926800000,"site":"MFI_OFFICE","mainId":"685PHKUV","fullname":"OMOTOLA, Bimbi","age":14,"createdWithin":12}	,
	{"awamoId":"689JPRLU","firstname":"Samson","middlename":"Client","lastname":"Akol","birthdate":"636076800000","nationality":"UGANDAN","iddocumenttype":"NONE","iddocument":"NA","phone1":null,"phone2":null,"location":{"latitude":0,"longitude":0},"gender":"MALE","submitDate":1488186000000,"site":"OTHER","mainId":"689JPRLU","fullname":"AKOL, Samson","age":27,"createdWithin":12}]`;
        //</editor-fold>
        return JSON.parse(fakeClients);
    }

    function submitGroupLoanTest() {
        var uri = '/loan/v1d/apply/group';
        var body = { "awamoId": "6B661P3S", "numberOfRepayments": "2", "amortizationType": "EQUAL_PRINCIPAL_PAYMENTS", "interestCalculationPeriodType": "DAILY", "reason": "EQUIPMENT", "interestType": "DECLINING_BALANCE", "disbursementDate": 1496350800000, "submitDate": 1496422450206, "loanType": "GROUP", "interestRate": "12000", "principal": "200000", "duration": "2", "loanClients": [{ "awamoId": "634BC2ZQ", "numberOfChildren": "3", "numberOfChildrenInHouseHold": "2", "maritalStatus": "MARRIED", "livingArea": "RURAL", "address": { "province": "dhjkh", "city": "bjbj ", "street": "vjl sfjqq" }, "clientEmployments": [] }, { "awamoId": "685OELXZ", "numberOfChildren": "2", "numberOfChildrenInHouseHold": "2", "maritalStatus": "MARRIED", "livingArea": "RURAL", "address": { "province": "h hd sdh", "city": ".kjbvajhk ", "street": "vj blj" }, "clientEmployments": [] }], "loanOfficer": "697VO7JG" }
        body = GroupHandler.prototype.trim(JSON.stringify(body));
        $.ajax({
            url: /*host*/ 'http://localhost:2060' + uri,
            type: 'POST',
            data: body,
            headers: getAuthenticationHeader(),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function() {
                showLoader();
                $('#groupLoanConfirmCreate').attr('disabled', 'disabled');
            },
            success: function(data) {
                //Options.prototype.loanCreationPassed();
                hideLoader();
                console.log("group loan creation succeeded");
                console.log(data);
                showAlertMessage(" Group Loan Application creation succeeded", AlertTypes.success);
                if (exists(data) & exists(data.loanId)) {
                    try {
                        var loan = JSON.parse(body);
                        loan.loanId = data.loanId;
                        var group = GroupHandler.self.getGroup(loan.awamoId);
                        console.log("----Group  Entity From List")
                        console.log(group)
                        if (exists(group))
                            loan.clientName = group.name;
                        console.log(loan)
                        loanList.put(loanList, loan);
                        loanList.loadOne(data.loanId, function(loan) {
                            if (exists(loan))
                                loanList.put(loanList, loan);
                        });
                    } catch (err) {
                        console.log(err.message);
                    }
                    GroupHandler.prototype.displayAllGroupsForLoanApplication();
                } else {

                    GroupHandler.prototype.displayAllGroupsForLoanApplication();
                }
                $('#groupAddMemberTop').data('object', null);
                $('#groupLoanConfirmCreate').attr('disabled', 'disabled');

                var groupLoanAwamoId = $('#groupLoanAwamoId');
                groupLoanAwamoId.val('');
                //groupLoanAwamoId.removeAttr('disabled');

                var groupLoanClientPrincipal = $('#groupLoanClientPrincipal');
                groupLoanClientPrincipal.val('');
                groupLoanClientPrincipal.removeAttr('disabled');

                var groupLoanClientDuration = $('#groupLoanClientDuration');
                groupLoanClientDuration.val('');
                groupLoanClientDuration.removeAttr('disabled');

                var groupLoanClientNORe = $('#groupLoanClientNORe');
                groupLoanClientNORe.val('');
                groupLoanClientNORe.removeAttr('disabled');

                var groupLoanClientAmortizationType = $('#groupLoanClientAmortizationType');
                groupLoanClientAmortizationType.val('');
                groupLoanClientAmortizationType.removeAttr('disabled');

                var groupLoanClientAIR = $('#groupLoanClientAIR');
                groupLoanClientAIR.val('');
                groupLoanClientAIR.removeAttr('disabled');

                var groupLoanClientDuTy = $('#groupLoanClientDuTy');
                groupLoanClientDuTy.val('DAYS');
                groupLoanClientDuTy.removeAttr('disabled');

                var groupLoanClientDiDate = $('#groupLoanClientDiDate');
                groupLoanClientDiDate.val('');
                groupLoanClientDiDate.removeAttr('disabled');

                var groupLoanClientInType = $('#groupLoanClientInType');
                groupLoanClientInType.val('');
                groupLoanClientInType.removeAttr('disabled');

                var groupLoanClientICPT = $('#groupLoanClientICPT');
                groupLoanClientICPT.val('');
                groupLoanClientICPT.removeAttr('disabled');

                var groupLoanClientReason = $('#groupLoanClientReason');
                groupLoanClientReason.val('');
                groupLoanClientReason.removeAttr('disabled');
            },
            complete: function() {
                hideLoader();
            }
        }).fail(function(Response) {
            hideLoader();
            document.getElementById("groupLoanClientPrincipal").disabled = false;
            document.getElementById("groupLoanClientDuration").disabled = false;
            document.getElementById("groupLoanClientNORe").disabled = false;
            document.getElementById("groupLoanClientAmortizationType").disabled = false;
            document.getElementById("groupLoanClientAIR").disabled = false;
            document.getElementById("groupLoanClientDuTy").disabled = false;
            document.getElementById("groupLoanClientDiDate").disabled = false;
            document.getElementById("groupLoanClientInType").disabled = false;
            document.getElementById("groupLoanClientICPT").disabled = false;
            document.getElementById("groupLoanClientReason").disabled = false;
            document.getElementById("groupLoanSubmit").disabled = false;
            $("#groupLoanSubmit").show();
            document.getElementById("groupLoanConfirmCreate").disabled = false;
            $("#groupLoanConfirmCreate").hide();
            console.log("group loan creation failed");
            console.log(Response);
            var jsonFormatedMessage = null;
            try {
                jsonFormatedMessage = Response.responseJSON
                var errObj = JSON.parse(jsonFormatedMessage.message)
                var errMsg = errObj.errors[0].developerMessage;
                showAlertMessage(errMsg, AlertTypes.danger);
            } catch (err) {
                console.log(err);
                showAlertMessage('Group Loan Application creation failed, please contact the support', AlertTypes.danger);

            }
            //showAlertMessage('Group Loan Application creation failed, please contact the support', AlertTypes.danger);
            scrollToTop();
        });

    }
    GroupHandler.prototype.initTestData = function() {
        return;
        document.getElementById("groupLoanClientDuration").disabled = false;
        document.getElementById("groupLoanClientAmortizationType").disabled = false;
        document.getElementById("groupLoanClientPrincipal").disabled = false;
        document.getElementById("groupLoanClientNORe").disabled = false;
        document.getElementById("groupLoanClientAIR").disabled = false;
        document.getElementById("groupLoanClientDuTy").disabled = false;
        document.getElementById("groupLoanClientDiDate").disabled = false;
        document.getElementById("groupLoanClientInType").disabled = false;
        document.getElementById("groupLoanClientICPT").disabled = false;
        document.getElementById("groupLoanClientReason").disabled = false;
        document.getElementById("groupLoanClientDiDate").style.backgroundColor = "#fff";

        document.getElementById("groupLoanClientPrincipal").value = 50000000;
        document.getElementById("groupLoanClientDuration").value = 2;
        document.getElementById("groupLoanClientNORe").value = 50000000;
        document.getElementById("groupLoanClientAmortizationType").value = 'EQUAL_INSTALLMENTS';
        document.getElementById("groupLoanClientAIR").value = 18;
        document.getElementById("groupLoanClientDuTy").value = 'YEARS';
        $('#groupLoanDurationTypeSelectorBtn').html('YEARS<span class="caret"></span>');
        document.getElementById("groupLoanClientDiDate").value = 1490967481085;
        document.getElementById("groupLoanClientInType").value = 'FLAT';
        document.getElementById("groupLoanClientICPT").value = 'LIKE_REPAYMENT';
        document.getElementById("groupLoanClientReason").value = 'WORKING_CAPITAL';
    };
};
