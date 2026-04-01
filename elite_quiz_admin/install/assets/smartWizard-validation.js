"use strict"

$(document).ready(function () {
    // Smart Wizard         
    $('#wizard_verticle').smartWizard({
        transitionEffect: 'slideleft',
        onLeaveStep: leaveAStepCallback,
        onFinish: onFinishCallback,
    });

    function leaveAStepCallback(obj) {
        var step_num = obj.attr('rel');
        return validateSteps(step_num);
    }

    function onFinishCallback() {
        if (validateAllSteps()) {
            $('form').submit();
        }
    }

});

function validateAllSteps() {
    var isStepValid = true;

    if (validateStep1() == false) {
        isStepValid = false;
        $('#wizard_verticle').smartWizard('setError', { stepnum: 1, iserror: true });
    } else {
        $('#wizard_verticle').smartWizard('setError', { stepnum: 1, iserror: false });
    }

    var res = validateStep2();
    if (res.error == true) {
        isStepValid = false;
        $('#wizard_verticle').smartWizard('showMessage', res.message);
        $('#wizard_verticle').smartWizard('setError', { stepnum: 2, iserror: true });
    } else {
        $('#wizard_verticle').smartWizard('hideMessage');
        $('#wizard_verticle').smartWizard('setError', { stepnum: 2, iserror: false });
    }

    if (!isStepValid) {
        $('#wizard_verticle').smartWizard('showMessage', 'Please required all field.!');
    }
    return isStepValid;
}

function validateSteps(step) {
    var isStepValid = true;
    // validate step 1
    if (step == 1) {
        if (validateStep1() == false) {
            isStepValid = false;
            $('#wizard_verticle').smartWizard('showMessage', "Please check above server requirement.");
            $('#wizard_verticle').smartWizard('setError', { stepnum: step, iserror: true });
        } else {
            $('#wizard_verticle').smartWizard('hideMessage');
            $('#wizard_verticle').smartWizard('setError', { stepnum: step, iserror: false });
        }
    }

    // validate step 2
    if (step == 2) {
        var res = validateStep2();
        if (res.error == true) {
            isStepValid = false;
            $('#wizard_verticle').smartWizard('showMessage', res.message);
            $('#wizard_verticle').smartWizard('setError', { stepnum: step, iserror: true });
        } else {
            $('#wizard_verticle').smartWizard('hideMessage');
            $('#wizard_verticle').smartWizard('setError', { stepnum: step, iserror: false });
        }
    }

    return isStepValid;
}

function validateStep1() {
    var isValid = true;
    $('#step-1 input').each(function () {
        if ($(this).val() == 0) {
            isValid = false;
        }
    });
    return isValid;
}

function validateStep2() {
    var data = {
        'error': false,
        'message': ""
    };

    var hostname = $("#step-2 input#hostname").val();
    var database = $("#step-2 input#database").val();
    var username = $("#step-2 input#username").val();

    if (hostname != "" && database != "" && username != "") {
        data = {
            'error': false,
            'message': ""
        };
    } else {
        data = {
            'error': true,
            'message': "Please required all field."
        };
    }

    return data;
}

