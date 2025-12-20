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
    
    controller.loading = false;
    controller.errorMessage = "";
    
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
     * Extract error message from HTML response (e.g. 504 Gateway Timeout)
     */
    var extractErrorMessage = function(errorText) {
        if (!errorText) {
            return 'Ein unbekannter Fehler ist aufgetreten.';
        }
        
        // Try to parse HTML error pages
        var parser = new DOMParser();
        var doc = parser.parseFromString(errorText, 'text/html');
        var title = doc.querySelector('title');
        var h1 = doc.querySelector('h1');
        
        if (title && title.textContent) {
            // Extract meaningful error message
            var errorMsg = title.textContent.trim();
            
            // Map common HTTP errors to user-friendly messages
            if (errorMsg.indexOf('504') !== -1 || errorMsg.indexOf('Gateway Timeout') !== -1) {
                return 'Die Anfrage dauerte zu lange. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per Telefon.';
            }
            if (errorMsg.indexOf('500') !== -1 || errorMsg.indexOf('Internal Server Error') !== -1) {
                return 'Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
            }
            if (errorMsg.indexOf('503') !== -1 || errorMsg.indexOf('Service Unavailable') !== -1) {
                return 'Der Service ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.';
            }
            
            return errorMsg;
        }
        
        if (h1 && h1.textContent) {
            return h1.textContent.trim();
        }
        
        // If it's not HTML, try to extract JSON error message
        try {
            var jsonError = JSON.parse(errorText);
            if (jsonError.X_WINTER_ERROR_MESSAGE) {
                return jsonError.X_WINTER_ERROR_MESSAGE;
            }
        } catch (e) {
            // Not JSON, continue
        }
        
        // Return first 200 characters if it's plain text
        return errorText.length > 200 ? errorText.substring(0, 200) + '...' : errorText;
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
            // Clear any previous error message
            controller.errorMessage = "";
            
            // Set loading state
            controller.loading = true;
            
            // use the october cms javascript api function
            var request = $.request(data.requestName, {
                data: controller.form,
                timeout: 15000, // 15 seconds timeout (reduced from 30)
                success: function(responseData) {
                    controller.debug('request success', responseData, typeof responseData);
                    
                    // Clear any previous error message
                    controller.errorMessage = "";
                    
                    // October CMS returns X_WINTER_ERROR_MESSAGE directly in the response object
                    // Check for error message first (even if status is 200)
                    if (responseData && responseData.hasOwnProperty('X_WINTER_ERROR_MESSAGE') && responseData.X_WINTER_ERROR_MESSAGE) {
                        controller.loading = false;
                        controller.errorMessage = responseData.X_WINTER_ERROR_MESSAGE;
                        controller.debug('Found X_WINTER_ERROR_MESSAGE', responseData.X_WINTER_ERROR_MESSAGE);
                        alertify.notify(responseData.X_WINTER_ERROR_MESSAGE, 'error', 8);
                        return;
                    }
                    
                    this.success(responseData)
                    .done(function() {
                        controller.debug('reuqest success 2', responseData);
                        
                        // Clear error message on success
                        controller.errorMessage = "";
                        
                        var message = 'Anfrage erfolgreich abgeschickt.';
                        alertify.notify(message, 'success', 5);
                                            
                        controller.form.message = "";
                        controller.loading = false;
                        
                        // collapse('hide');
                        if(data.inModal) {
                            controller.hideGlobalModal();
                        }
                        
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    controller.debug('request error', jqXHR, textStatus, errorThrown, jqXHR.responseJSON);
                    controller.loading = false;
                    
                    var errorMessage = 'Die E-Mail konnte nicht gesendet werden.';
                    
                    // October CMS returns 406 for AjaxException in AJAX requests
                    // Check for X_WINTER_ERROR_MESSAGE in JSON response
                    if (jqXHR.status === 406 && jqXHR.responseJSON && jqXHR.responseJSON.X_WINTER_ERROR_MESSAGE) {
                        errorMessage = jqXHR.responseJSON.X_WINTER_ERROR_MESSAGE;
                    }
                    // Check for X_WINTER_ERROR_MESSAGE in JSON response (even if status is 500)
                    else if (jqXHR.responseJSON && jqXHR.responseJSON.X_WINTER_ERROR_MESSAGE) {
                        errorMessage = jqXHR.responseJSON.X_WINTER_ERROR_MESSAGE;
                    }
                    // Try to extract error message from response text
                    else if (jqXHR.responseText) {
                        // Try to parse as JSON first
                        try {
                            var jsonResponse = JSON.parse(jqXHR.responseText);
                            if (jsonResponse.X_WINTER_ERROR_MESSAGE) {
                                errorMessage = jsonResponse.X_WINTER_ERROR_MESSAGE;
                            } else if (jsonResponse.message) {
                                // Sometimes the error message is in 'message' field
                                errorMessage = jsonResponse.message;
                            } else {
                                errorMessage = extractErrorMessage(jqXHR.responseText);
                            }
                        } catch (e) {
                            errorMessage = extractErrorMessage(jqXHR.responseText);
                        }
                    } else if (textStatus === 'timeout') {
                        errorMessage = 'Die Anfrage dauerte zu lange. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per Telefon.';
                    } else if (textStatus === 'error') {
                        errorMessage = 'Ein Verbindungsfehler ist aufgetreten. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.';
                    }
                    
                    // Set error message for Rivets.js binding
                    controller.errorMessage = errorMessage;
                    
                    alertify.notify(errorMessage, 'error', 8);
                },
                complete: function() {
                    // Only reset loading if not already reset
                    if (controller.loading) {
                        controller.loading = false;
                    }
                }
            });
            
            // Also listen to ajaxError event as fallback
            $el.on('ajaxError', function(event, context, errorMsg, textStatus, jqXHR) {
                controller.debug('ajaxError event', errorMsg, textStatus, jqXHR);
                if (controller.loading) {
                    controller.loading = false;
                    var errorMessage = errorMsg || 'Die E-Mail konnte nicht gesendet werden.';
                    alertify.notify(errorMessage, 'error', 8);
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