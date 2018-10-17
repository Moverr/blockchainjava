'use strict';
$(function () {
    var allInputs = $(":input");
    for (var i = 0; i < allInputs.length; i++) {
        var input = allInputs[i];
        if (input.hasAttribute('required')) {
            var nearestDiv = input.parentElement;
            var housingDiv = nearestDiv;//.parentElement
            var closestLabel = $('label', housingDiv);
            if (closestLabel !== null || typeof (closestLabel) !== 'undefined') {
                var labelText = closestLabel.html();
                if (exists(labelText)) {
                    if (labelText.indexOf("*") === -1) {
                        closestLabel.html(labelText + '<i style="color:red;margin-left:5px">*</i>');
                    }
                }
            }
        }

        if (input.hasAttribute('type')) {
            var attrVal = input.getAttribute('type');
            if (exists(attrVal) && attrVal === 'number') {
                if (!input.hasAttribute('min')) {
                    var attr = document.createAttribute("min");
                    attr.value = 0;
                    input.setAttributeNode(attr);
                    var jqInput = $(input);
                    var parentDiv = jqInput.parent();
                    if (!parentDiv.hasClass('input-group')) {
                        jqInput.after('<span style="color:red;display:none">this value can not be negative,and has to be a number</span>')
                    } else {
                        parentDiv.parent().siblings('span').html('this value can not be negative,and has to be a number');
                    }

                    jqInput.on('keyup', function () {
                        var that = $(this);
                        var inputValue = that.val();
                        if (exists(inputValue)) {
                            if (inputValue < 0 || !$.isNumeric(inputValue)) {
                                //that.val(0);
                                that.css('border', '2px solid red');
                                var parentDiv = that.parent();
                                if (!parentDiv.hasClass('input-group')) {
                                    that.siblings('span').show()
                                } else {
                                    parentDiv.siblings('span').show()
                                }

                                var timer = setTimeout(function () {
                                    that.css('border', '1px solid #ccc');
                                    if (!parentDiv.hasClass('input-group')) {
                                        that.siblings('span').hide()
                                    } else {
                                        parentDiv.siblings('span').hide()
                                    }
                                    timer = null;
                                }, 5000)
                                //alert("this value can not be negative,and has to be a number");
                            }
                        }
                        //console.log(inputValue);
                    })
                }
            }
        }
    }
})

function showValidationMessage($input, message) {
    var label = $input.siblings('label');
    var labelText = label.html();
    $input.after('<p style="color:red;display:none">' + typeof (labelText) === 'undefined' ? '' : labelText + '  ' + message + '</p>');
    $input.css('border', '2px solid red');
    $input.siblings('p').show()
    var timer = setTimeout(function () {
        $input.css('border', '1px solid #ccc');
        $input.siblings('p').hide
        timer = null;
    }, 5000)


}