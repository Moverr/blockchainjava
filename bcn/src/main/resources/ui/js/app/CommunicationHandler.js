/* global handlers, tenantId, authentication, host, username, handleMainMenu, tenant, URL, loanList, clientList, officerList, groupList, savingsAccountList, accountList, shareList, esponse, AlertTypes, DashboardHandler, MessageType, shareProductList */

var CommunicationHandler = function() {
    CommunicationHandler.self = this;
    $('#profileIdT').on('input', CommunicationHandler.prototype.documentTypeSelectHandler);
    $('#sendHelpMessageButtonId').on('click', CommunicationHandler.prototype.sendMessage);
    $('#cancelProfileBottom').on('click', CommunicationHandler.prototype.resetProfileParameter);
    $('#backProfileBottom').on('click', CommunicationHandler.prototype.backProfileParameter);
    $('#editProfileBottom').on('click', CommunicationHandler.prototype.editProfileParameter);
    $('#confirmProfileBottom').on('click', CommunicationHandler.prototype.editProfileParameter);

    $("#helpMessageForm").submit(function(e) {
        e.preventDefault();
    });
    $("#profileEditForm").submit(function(e) {
        e.preventDefault();
    });
};

CommunicationHandler.SPEED = 350;

/* external */
CommunicationHandler.prototype.loginFormSubmitHandler = function(event) {
    event.preventDefault();

    var actionValue = $('#actionValue').val(); // login or forgotPassword

    if ('login' === actionValue) {
        $('.loginFormSubmitButtonText').hide();

        $('.loginFormSubmitButtonImage').show();
        statusbar('waiting for server reply on login');

        var headers = {
            tenantId: tenantId,
            username: $('#loginname').val(),
            password: $('#password').val()
        };

        username = headers['username'];

        ajax(
            '/tenant/v1d/mis/user',
            'GET',
            CommunicationHandler.self.loginResponseHandler,
            null,
            headers,
            CommunicationHandler.self.loginFailedHandler
        );
    } else if ('forgotPassword' === actionValue) {
        // not using default ajax call here because user handling is done against a different endpoint

        $(".forgotPasswordSubmitImage").hide();

        var passworddata = $('#forgotPasswordData').val();
        if (passworddata == null || passworddata == undefined || passworddata == "") {
            $(".message").html("Fill In the Blanks").show();
            return;
        }

        headers = {
            tenantId: tenantId,
            data: $('#forgotPasswordData').val()
        };

        $(".message").html("Proccessing ... ").show();
        //CommunicationHandler.self.forgotPasswordResponseHandler();

        ajax(
            '/tenant/v1d/mis/forgotPassword',
            'POST',
            CommunicationHandler.self.forgotPasswordResponseHandler,
            null,
            headers,
            CommunicationHandler.self.forgotPasswordFailedHandler);
    } else if ('update' === actionValue) {
        var codedata = $("#codedata").val();
        var newpassword = $("#newpassword").val();
        var repeatnewpassword = $("#repeatnewpassword").val();
        if (codedata.length === '' || newpassword === '' || repeatnewpassword === '') {
            $(".message").html("Fill In the Blanks").show();
            return;
        }
        if (newpassword !== repeatnewpassword) {
            $(".message").html("Passwords Dont Match ").show();
            return;
        }
        $(".message").html("Proccessing ... ").show();
        var data = '{"code": "' + codedata + '", "password":"' + newpassword + '", "repeatPassword": "' + repeatnewpassword + '"}';
        //  {"code": "6BEE26LY", "password": "P@qwerty?!@#", "repeatPassword": "P@qwerty?!@#"}
        var headers = {
            tenantId: tenantId
        };
        console.log(data);
        $.ajax({
            url: host + '/tenant/v1d/mis/updatePassword',
            data: data,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            headers: headers,
            type: 'POST',
            success: function(data) {
                CommunicationHandler.self.updatePasswordResponseHandler();
            },
            complete: function() {

            }
        }).fail(function(Response) {
            if (Response.status == 200) {
                CommunicationHandler.self.updatePasswordResponseHandler();
            } else {
                CommunicationHandler.self.updatePasswordfailHandler();
            }
        });
    } else {
        // TODO
    }
};

/* internal */
CommunicationHandler.prototype.loginResponseHandler = function(userResponse) {
    statusbar('login successful');
    logFancyMessage(userResponse.username + " logging in with permissions:", userResponse.permissions, "lime");
    authentication = userResponse.authentication;
    user = userResponse;
    user.fullname = user.lastname.capitalizeFirstLetter() + ' ' + user.firstname.capitalizeFirstLetter();
    var current_tenant_id = user.tenantId;
    var previous_tenant_id = localStorage['tenantId'];

    officeId = userResponse.officeId;

    //for cases where the prevously logged in tenant is the same as the tenant currently logged in
    if (current_tenant_id === previous_tenant_id) {

    }
    //for cases where the prevously logged in tenant is NOT the same as the tenant currently logged in
    else {
        localStorage.clear();
    }
    handlers['Permissions'].assign_user_permissions(userResponse.permissions);
    ajax(
        '/tenant/v1d/currencycode',
        'GET',
        function(currencyResponse) {
            currencyCode = currencyResponse.code;
            localStorage['currencyCode'] = currencyCode;
            $('.currencyExtensionAddon').html(currencyCode);
        }
    );
    $.ajax({
            url: host + '/officer/v1d/find?' +
                'awamoId=' + user.officerMasterData.awamoId + '&' +
                'deviceId=cockpit&' +
                'datatype=PHOTOGRAPHY',
            type: 'GET',
            headers: getAuthenticationHeader(),
            xhrFields: {
                responseType: 'arraybuffer'
            }
        })
        .done(function(e) {
            var blob = new Blob([e], { type: 'image/jpg' });
            var fr = new FileReader();
            fr.onload = function(e) {
                localStorage['icon'] = e.target.result;
                $('#dashboardProfileImage img').attr('src', localStorage['icon']);
                $('#profilePanel img').attr('src', localStorage['icon']);
            };
            fr.readAsDataURL(blob);
        })
        .fail(function(e) {
            // console.log('fail');
            // console.log(e);
        })
        .always(function(e) {
            //            console.log('always');
            //            console.log(e);
        });
    $('#username').val(username);
    // init menu handler
    $('.navbar-fixed-top a.navbar-brand').on('click touch', function() {
        $('#dashboard a').click();
    });
    $('.navbar-fixed-top .nav li ul li').on('click touch', CommunicationHandler.prototype.handleMainMenu);
    $('.sidebar .nav li').on('click touch', CommunicationHandler.prototype.sidebarNavigationHandler);
    // init navigation
    $('nav.navbar-fixed-top ul.nav').show();
    $('#login').hide();
    // init content (start with dashboard)
    handlers['Dashboard'].init();
    // init action buttons
    $('#singleActions a[data-action]').on('click touch', function() {
        $("#messagebox").stop().slideUp(500);
    });
    // start background loading of data   
};

CommunicationHandler.prototype.initData = function() {
    showLoader("Loading data, Please wait...");
    handlers['Roles'].init();
    handlers['Settings'].init();
    handlers['Offices'].init();
    handlers['Countries'].init();
    /*officerList.init([clientList]);
     clientList.init([clientList]);
     groupList.init([groupList]);
     savingsAccountList.init([savingsAccountList]);*/
    //loanList.init([loanList]);
    var initializerList = [
        groupList,
        officerList,
//        loanList,
        savingsAccountList,
        accountList,
        shareProductList,
                shareList
    ];

    CommunicationHandler.self.getServerTotals(initializerList, function() {
        clientList.init(initializerList);
    });
};
CommunicationHandler.prototype.getServerTotals = function(initializerList, callback) {
    var listCount = 1;
    var callbackListClone = [];
    callbackListClone.push(clientList);
    initializerList.forEach(function(entityList) {
        callbackListClone.push(entityList);
    });

    callbackListClone.forEach(function (self) {
        self.getserverTotals(self, callbackListClone, function (self, callbackList) {
            listCount++;
            if (listCount === callbackList.length) {
                callback();
            }
            var logMessageHeader = self.entityName;
            var logMessage = ["The server totals for {" + self.entityName + "} are " + self.totalServerCount];
            logMessage.push("Fetching total results count for " + self.entityName + " completed");
            var logColor = "yellow";
            logFancyMessage(logMessageHeader, logMessage, logColor);
        });
    });
}


CommunicationHandler.prototype.loginFailedHandler = function(response) {
    user = null;
    username = null;
    $('.loginbox .message').show();
    $('.loginFormSubmitButtonText').show();
    $('.loginFormSubmitButtonImage').hide();
};


CommunicationHandler.prototype.updatePasswordResponseHandler = function() {
    $('#actionValue').val('login');
    $('#loginRow input').attr('required', 'required');
    $('#forgotPasswordRow input').removeAttr('required');
    $('#loginRow').show();
    $('#forgotPasswordRow').hide();
    $('#updatePasswordRow input').removeAttr('required');
    $('#updatePasswordRow').hide();
    $('.loginFormSubmitButtonText').show();
    $('.loginFormSubmitButtonImage').hide();
    $('.loginbox .message').html('Password has successfully been updated ');
    $('.loginbox .message').show();
};

CommunicationHandler.prototype.updatePasswordfailHandler = function() {
    $(".message").html('Something Went Wrong Passowrd not updated ');
    $(".message").show();
};

CommunicationHandler.prototype.forgotPasswordResponseHandler = function(response) {
    $("#updatePasswordRow").show();
    $('#updatePasswordRow input').attr('required', 'required');
    $('#forgotPasswordRow input').removeAttr('required');
    $('#forgotPasswordRow').hide();
    $('#loginRow input').removeAttr('required');
    $('#loginRow').hide();
    $(".message").hide();
    $("#codedata").val("");
    $("#newpassword").val("");
    $("#repeatnewpassword").val("");
    $('#actionValue').val('update');
};

CommunicationHandler.prototype.forgotPasswordFailedHandler = function(response) {
    user = null;
    username = null;
    $('.loginbox .message').html('Your password request was not successful, please try again to enter valid data.<br>If you do not have a user name yet contact awamo support to register a new account. If you already have a user name, please check the spelling or contact awamo support.');
    $('.loginbox .message').show();
    $('.loginFormSubmitButtonText').show();
    $('.loginFormSubmitButtonImage').hide();
};

/* navigation */
CommunicationHandler.prototype.sidebarNavigationHandler = function(e) {
    e.preventDefault();
    $("#messagebox").stop().slideUp(500);
    var openParent = function($listitem) {
        var speed = 350;
        var id = $listitem.attr('id');
        var $subitems = $listitem.parent().find('.subitem[data-parent!="' + id + '"]');
        $subitems.each(function(index, subitem) {
            $(subitem).animate({ height: '0' }, speed, function() {
                $(subitem).addClass('hidden');
            });
        });

        var $subitems = $listitem.parent().find('[data-parent="' + id + '"]');
        $subitems.each(function(index, subitem) {
            $(subitem).removeClass('hidden');
            // [CO-#75]: remove this if block (including the inner line of code) when "key performance indicators" have been done
            if ('reporting' === id && $(subitem).data('action') === 'keyPerformanceIndicators' && 'SHOWROOM' !== tenantId.toUpperCase()) {
                $(subitem).addClass('hidden');
            }

            $(subitem).animate({ height: $(subitem).css('max-height') }, speed);
        });
    };

    var $li = $(this);

    /* move active state on navbar items */
    $('.sidebar .nav li.active').removeClass('active');
    $li.addClass('active');

    if ($li.hasClass('parentitem')) {
        openParent($li);
    } else if ($li.hasClass('subitem')) {
        openParent($('#' + $li.data('parent')));
    }

    /* dispatch to action handler */
    var handler = $li.data('handler');
    var action = $li.data('action');
    var args = $li.data('args');

    if (exists(handler) && exists(action)) {
        handlers[handler][action](args);
    }

    // TODO: can all history code be moved here?
};

CommunicationHandler.prototype.handleMainMenu = function() {
    var $li = $(this);
    /* dispatch to action handler */
    var handler = $li.data('handler');
    var action = $li.data('action');
    var args = $li.data('args');
    if (exists(handler) && exists(action)) {
        handlers[handler][action](args);
    }

    // TODO: can all history code be moved here?
};

CommunicationHandler.prototype.showProfile = function() {
    addHistory('Profile', '#userProfile', '#profile');
    // close open menu block
    var $activeItem = $('.sidebar .nav li.active');
    var id = $activeItem.attr('id');
    var $subitems = $activeItem.parent().find('.subitem[data-parent="' + id + '"]');
    $subitems.each(function(index, subitem) {
        $(subitem).animate({ height: '0' }, CommunicationHandler.SPEED, function() {
            $(subitem).addClass('hidden');
        });
    });
    $activeItem.removeClass('active');
    // create content
    initDefaultContent('User Profile');
    // fill data
    $('#profilePanel .panel-heading span').text(user.fullname);
    var profileArea = $('#profileArea');
    $('#cancelProfileBottom').hide();
    $('#backProfileBottom').show();
    $('#confirmProfileBottom').hide();
    $('#editProfileBottom').show();
    profileArea.find('input[data-target]').each(function() {
        $(this).val(getTargetFromObject($(this), user));
    });

    $('#profileGender').val(user.officerMasterData['gender']);
    if (user.officerMasterData['nationality'] !== null) {
        $('#profileNationality').val(user.officerMasterData['nationality'].toLowerCase());
    }
    if (user.officerMasterData['iddocumenttype'] !== null) {
        $('#profileIdT').val(user.officerMasterData['iddocumenttype']);
    }
    if (user.officerMasterData['birthdate'] !== null) {
        $('#profileBirthdate').val(formatDate(user.officerMasterData['birthdate']));
    }
    // actions
    $('#singleActions a').off('click touch');
    $('#singleActions a').on('click touch', CommunicationHandler.prototype.actionButtonHandler);
    $('#singleActions a[data-action]').hide();
    $('#singleActions a[data-action="back"]').hide();
    $('#singleActions a[data-action="submit"]').hide();
    $('#singleActions a[data-action="resetChanges"]').hide();
    showContent($('#singleActions'));
    // show content
    showContent(profileArea);
};

CommunicationHandler.prototype.showAccount = function() {
    addHistory('account', '#tenantAccount', '#tenantAccount');
    initDefaultContent('Account');
    // fill data
    $('#accountPanel .panel-heading span').text(tenant.name);
    var accountArea = $('#accountArea');
    accountArea.find('input[data-target]').each(function() {
        $(this).val(getTargetFromObject($(this), tenant));
    });

    // show content
    showContent(accountArea);
};

CommunicationHandler.prototype.help = function() {
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    addHistory('Help', '#help', '#help');
    $('#nameC').val('');
    $('#nameC').val(user.fullname);
    $('#emailC').val('');
    $('#emailC').val(user.email);
    $('#phoneNumberC').val('');
    $('#phoneNumberC').val(user.officerMasterData.phone1);

    initDefaultContent('Help');
    registerKeyPressValidators($('#helpMessageForm'));
    populatePhoneInputFlagAddon($('#phoneNumberC'), $('#phoneNumberCCountryBtn'), $('#phoneNumberCCountryList'));
    showContent($('#helpOverview'));
};

CommunicationHandler.prototype.logout = function() {
    ajax(
        '/tenant/v1d/mis/logout',
        'POST',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
    location.reload();
};

CommunicationHandler.prototype.about = function() {
    addHistory('About', '#about', '#about');
    initDefaultContent('About');
    $('h4.sub-header').html('<p id="aboutLink">Please visit our <a href="http://www.awamo.com" target="_blank">website</a> to get more information about awamo.</p>');
    $('h4.sub-header').show();
};

/* ContactMessage */
CommunicationHandler.prototype.sendMessage = function() {
    // not using default ajax call here because user handling is done against a different endpoint
    if (validateForm($('#helpMessageForm'))) {
        showLoader("Validating phone input");
        validatePhoneInput(('#phoneNumberC'), function() {
                //function called on success of valid phone2 validation
                hideLoader();
                if (
                    document.getElementById("nameC").checkValidity() &&
                    document.getElementById("phoneNumberC").checkValidity() &&
                    document.getElementById("emailC").checkValidity() &&
                    document.getElementById("messageC").checkValidity() &&
                    document.getElementById("subjectC").checkValidity()
                ) {
                    headers = {
                        tenantId: tenantId
                    };

                    var uri = '/tenant/v1d/mis/contactForm';
                    var body = '{"name":"' + $('#nameC').val() +
                        '","phone":"' + $('#phoneNumberC').val() +
                        '","email":"' + $('#emailC').val() +
                        '","message":"' + $('#messageC').val() +
                        '","subject":"' + $('#subjectC').val() +
                        '"}';
                    clientList.showLoading();
                    ajax(uri, 'POST', CommunicationHandler.prototype.messageSentResponseHandler, body, headers, CommunicationHandler.prototype.messageSentFailedResponseHandler);
                }
            },
            function() {
                //function called on failed of valid phone2 validation
                hideLoader();
                showAlertMessage("Invalid Phone input", AlertTypes.danger);
            });
    } else {
        showAlertMessage('Please ensure all the fields are filled in correctly.', AlertTypes.danger);
    }
};

CommunicationHandler.prototype.messageSentResponseHandler = function(response) {
    //    message('Success',
    //            'Message Sent Successfully',
    //            MessageType.SUCCESS);
    document.getElementById('nameC').value = "";
    document.getElementById('phoneNumberC').value = "";
    document.getElementById('emailC').value = "";
    document.getElementById('messageC').value = "";
    clientList.hideLoading();
    showAlertMessage('Message Sent Successfully', AlertTypes.success);
    DashboardHandler.prototype.overview();
};

CommunicationHandler.prototype.messageSentFailedResponseHandler = function(response) {
    clientList.hideLoading();
    showAlertMessage('Error ' + esponse.responseJSON.message, AlertTypes.warning);
    //message('Error', response.responseJSON.message, MessageType.WARNING);
};

CommunicationHandler.prototype.actionButtonHandler = function(event) {
    event.preventDefault();
    hideContent();
    switch ($(this).data('action')) {
        case 'back':
            history.back();
            break;
        case 'resetChanges':

            break;
        case 'submit':

            break;
        default:
            // noop
            break;
    }


};

CommunicationHandler.prototype.resetProfileParameter = function() {
    $("#profilePhone").val($("#profilePhoneHidden").val());
    $("#profilePhone1").val($("#profilePhoneHidden1").val());
    $("#profileEmail").val($("#profileEmailHidden").val());
    $("#profileGender").val($("#profileGenderHidden").val());
    $("#profileBirthdate").val($("#profileBirthdateHidden").val());
    $("#profileNationality").val($("#profileNationalityHidden").val());
    $("#profileIdT").val($("#profileIdTHidden").val());
    $("#profileIdN").val($("#profileIdNHidden").val());
    $('#profileBirthdate').val(formatDate($("#profileBirthdateHidden").val()));
    CommunicationHandler.prototype.showProfile();
};

CommunicationHandler.prototype.backProfileParameter = function() {
    handlers['Dashboard'].overview();
};

CommunicationHandler.prototype.editProfileParameter = function() {
    showAlertMessage('Unfortunately you cannot edit your profile right now', AlertTypes.info);
};

CommunicationHandler.prototype.submitProfileParameter = function() {
    if (
        document.getElementById("profilePhone").checkValidity() &&
        document.getElementById("profilePhone1").checkValidity() &&
        document.getElementById("profileEmail").checkValidity() &&
        document.getElementById("profileBirthdate").checkValidity() &&
        document.getElementById("profileGender").checkValidity() &&
        document.getElementById("profileIdT").checkValidity() &&
        document.getElementById("profileIdN").checkValidity() &&
        document.getElementById("profileNationality").checkValidity()
    ) {
        ajax(
            '/officer/v1d/' + user.officerMasterData.awamoId,
            'GET',
            function(Response) {

                //Gender
                if ($("#profileGender").val() !== 'NULL') {
                    Response['gender'] = $("#profileGender").val();
                }
                //Email
                Response['email'] = $("#profileEmail").val();
                //Phone1
                Response['phone1'] = $("#profilePhone").val();
                //Phone2
                Response['phone2'] = $("#profilePhone1").val();
                //Nationality
                if ($("#profileNationality").val() !== 'NULL') {
                    Response['nationality'] = $("#profileNationality").val().toUpperCase();
                }
                //Birthdate
                if ($("#profileBirthdate").datepicker("getDate") !== null) {
                    Response['birthdate'] = $("#profileBirthdate").datepicker("getDate").getTime();
                }
                //iddocumenttype
                Response['iddocumenttype'] = $("#profileIdT").val();
                //iddocumenttype
                Response['iddocument'] = $("#profileIdN").val();
                var sentData = Response;
                console.log(Response);

                var body = '{"iddocument":"' + Response['iddocument'] +
                    '","iddocumenttype":"' + Response['iddocumenttype'] +
                    '","birthdate":"' + Response['birthdate'] +
                    '","nationality":"' + Response['nationality'] +
                    '","phone2":"' + Response['phone2'] +
                    '","phone1":"' + Response['phone1'] +
                    '","email":"' + Response['email'] +
                    '","gender":"' + Response['gender'] +
                    '","awamoId":"' + Response['awamoId'] +
                    '","firstname":"' + Response['firstname'] +
                    '","lastname":"' + Response['lastname'] +
                    '","submitDate":"' + Response['submitDate'] +
                    '","location":"' + Response['location'] +
                    '"}';
                ajax(
                    '/officer/v1d/update',
                    'POST',
                    function(Response) {
                        user.officerMasterData.gender = sentData['gender'];
                        user.officerMasterData.iddocumenttype = sentData['iddocumenttype'];
                        user.officerMasterData.iddocument = sentData['iddocument'];
                        user.officerMasterData.birthdate = sentData['birthdate'];
                        user.officerMasterData.nationality = sentData['nationality'];
                        user.officerMasterData.phone2 = sentData['phone2'];
                        user.officerMasterData.phone1 = sentData['phone1'];
                        user.officerMasterData.email = sentData['email'];
                        user.officerMasterData.submitDate = sentData['submitDate'];
                        CommunicationHandler.prototype.showProfile();
                        message('Success',
                            'Data updated Successfully',
                            MessageType.SUCCESS);
                    },
                    body,
                    getAuthenticationHeader(),
                    function(Response) {
                        console.log(Response);
                        $("#profilePhone").val($("#profilePhoneHidden").val());
                        $("#profilePhone1").val($("#profilePhoneHidden1").val());
                        $("#profileEmail").val($("#profileEmailHidden").val());
                        $("#profileGender").val($("#profileGenderHidden").val());
                        $("#profileBirthdate").val($("#profileBirthdateHidden").val());
                        $("#profileNationality").val($("#profileNationalityHidden").val());
                        $("#profileIdT").val($("#profileIdTHidden").val());
                        $("#profileIdN").val($("#profileIdNHidden").val());
                        $('#profileBirthdate').val(formatDate($("#profileBirthdateHidden").val()));
                        CommunicationHandler.prototype.showProfile();
                        message('Warning',
                            " Please fill all fields before Submitting",
                            MessageType.WARNING);
                    }
                );


            },
            null,
            getAuthenticationHeader(),
            function(Response) {
                console.log(Response);
                $("#profilePhone").val($("#profilePhoneHidden").val());
                $("#profilePhone1").val($("#profilePhoneHidden1").val());
                $("#profileEmail").val($("#profileEmailHidden").val());
                $("#profileGender").val($("#profileGenderHidden").val());
                $("#profileBirthdate").val($("#profileBirthdateHidden").val());
                $("#profileNationality").val($("#profileNationalityHidden").val());
                $("#profileIdT").val($("#profileIdTHidden").val());
                $("#profileIdN").val($("#profileIdNHidden").val());
                $('#profileBirthdate').val(formatDate($("#profileBirthdateHidden").val()));
                CommunicationHandler.prototype.showProfile();
                message('Warning',
                    " Please fill all fields before Submitting",
                    MessageType.WARNING);
            }
        );
    }
};

CommunicationHandler.prototype.documentTypeSelectHandler = function() {
    if (document.getElementById("profileIdT").value !== "NONE") {
        document.getElementById("profileIdN").required = true;
        document.getElementById("profileIdN").disabled = false;
    } else {
        document.getElementById("profileIdN").required = false;
        document.getElementById("profileIdN").disabled = true;
        document.getElementById("profileIdN").value = "";
    }
};
