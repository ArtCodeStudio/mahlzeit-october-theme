/**
 * contact-form
 */
rivets.components['contact-form'] = {
  template: function() {
    return jumplink.templates['contact-form'];
  },
  initialize: function(el, data) {
    var controller = this;
    controller.debug = debug('rivets:contact-form');
    var $el = $(el);

    controller.handle = data.handle;
    controller.debug('initialize contact-form component', $el, data);
    
    controller.ready = false;
    controller.layout = data.layout;
    
    data.inModal = !!data.inModal;
    data.requestName = data.requestName || 'onSubmitContact';
    
    controller.form = {
        name: "",
        email: "",
        phone: "",
        message: "",
    };
    
    var getValidation = function() {
        var validation = {
            valid: true,
            name: {
                required: true,
                minlength: 3,
                error: '',
            },
            email: {
                required: true,
                isEmail: true,
                minlength: 3,
                error: '',
            },
            phone: {
                required: false,
                isPhone: true,
                minlength: 4,
                error: '',
            },
            message: {
                required: true,
                minlength: 50,
                error: '',
            },
        };
        return validation;
    };
    
    controller.validation = getValidation();
    
    /**
     * validate form
     * @param validation object with the validation rules
     * @param the form with the values from the form
     * @param keys keys you want to validate
     */
    var validate = function(validation, form, keys) {
        validation.valid = true;
        
        keys.forEach(function(key) {
            validation[key].error = '';
            
            // value is requred
            if(validation[key].required) {
                if(jumplink.utilities.isString(form[key])) {
                    if(form[key].length <= 0) {
                        validation[key].error = 'Dieses Feld ist erforderlich.';
                    }
                }
                
                if(jumplink.utilities.isUndefined(form[key])) {
                    validation[key].error = 'Dieses Feld ist erforderlich.';
                }
            }
            
            // validation for numbers
            if(jumplink.utilities.isNumber(form[key])) {
                
                // maximum value for number
                if(jumplink.utilities.isNumber(validation[key].max)) {
                    if(form[key] > validation[key].max) {            
                        validation[key].error = 'Die Anzahl darf nur maximal '+ validation[key].max + ' betragen.';
                    }
                }
                
                // minimum value for number
                if(jumplink.utilities.isNumber(validation[key].min)) {
                    if(form[key] < validation[key].min) {            
                        validation[key].error = 'Die Anzahl darf nur mindestens '+ validation[key].min + ' betragen.';
                    }
                }
            }
            
            // validation for strings
            if(jumplink.utilities.isString(form[key]) && form[key].length >= 1 ) {
                
                // maximum value for string length 
                if(jumplink.utilities.isNumber(validation[key].maxlength)) {
                    if(form[key].length > validation[key].maxlength) {            
                        validation[key].error = 'Die Anzahl der Zeichen darf nur maximal '+ validation[key].maxlength + ' betragen.';
                    }
                }
                
                // minimum value for string length 
                if(jumplink.utilities.isNumber(validation[key].minlength)) {
                    if(form[key].length < validation[key].minlength) {            
                        validation[key].error = 'Die Anzahl der Zeichen muss mindestens '+ validation[key].minlength + ' betragen.';
                    }
                }
                
                // email
                if(validation[key].isEmail) {
                    if(form[key].indexOf('@') <= -1) {
                        validation[key].error = 'Die E-Mail muss ein @ enthalten.';
                    }
                    
                    if(form[key].indexOf('.') <= -1) {
                        validation[key].error = 'Die E-Mail muss ein Punkt enthalten.';
                    }
                }
                
                // phone number
                if(validation[key].isPhone) {
                    if(!jumplink.utilities.stringIsPhoneNumber(form[key])) {
                        validation[key].error = 'Die Telefonnummer darf nur Zahlen, +, -, ( und ) enthalten.';
                    }
                }
                
                
                // only numbers
                if(validation[key].onlyNumbers) {
                    if(!jumplink.utilities.stringHasOnlyNumbers(form[key])) {            
                        validation[key].error = 'Der Wert darf nur Nummern enthalten.';
                    }
                }
            }
            
            // is all valid?
            if(validation[key].error.length) {
                validation.valid = false;
            }
        });
    
        window.jumplink.debug.events('validate', validation);        
        return validation;
    };

    controller.hideGlobalModal = function() {
        controller.debug('hideGlobalModal');
        jumplink.utilities.triggerComponentEvent('global-modal', 'hide', null, null);
    };
    
    /**
     * Submit contact form by send a octobercms request with the informations from the form.
     * The PHP funtion `onReguestEvent` is defined in the layout file
     * 
     * @see https://octobercms.com/docs/ajax/javascript-api
     */
    controller.submit = function() {
        controller.debug(data.requestName);
        controller.validation = jumplink.events.validate(controller.validation, controller.form, ['name', 'email', 'phone', 'message']);
        controller.debug('validation', controller.validation, 'form', controller.form);
        
        if(controller.validation.valid) {
            // use the october cms javascript api function
            $.request(data.requestName, {
                data: controller.form,
                success: function(responseData) {
                    this.success(responseData)
                    .done(function() {
                        controller.debug('reuqest success 2', responseData);
                        
                        var message = 'Anfrage erfolgreich abgeschickt.';
                        alertify.notify(message, 'success', 5);
                                            
                         controller.form.message = "";
                        
                        // collapse('hide');
                        if(data.inModal) {
                            controller.hideGlobalModal();
                        }
                        
                    });
                }
            });
        } else {
            var message = 'Bitte überprüfen Sie Ihr Eingabeformular';
            var notification = alertify.notify(message, 'error', 5);
        }
    };
    

    var ready = function() {
        controller.ready = true;
    };
    
    setTimeout(ready, 0);   
    return controller;
  }
};