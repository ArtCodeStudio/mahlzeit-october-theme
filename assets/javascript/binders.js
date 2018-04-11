// rivets.js binders


window.jumplink.debug = window.jumplink.debug || {};
window.jumplink.debug.binders = debug('rivets:binders');

/**
 * 
 * @see https://getbootstrap.com/docs/4.0/components/navs/#via-javascript
 */
rivets.binders.tabs = function (el, handle) {
    var $el = $(el);
    var $tabLinks = $el.find('.nav-tabs a');
    $tabLinks.on('click', function(event) {
        event.preventDefault();
        $(this).tab('show');
        
        // to load lasy images
        setTimeout(function() {
            $(document).trigger('resize'); 
        }, 200);
        
    });
    $tabLinks.first().tab('show');
};

/**
 * pignose-calendar
 * @see https://www.pigno.se/barn/PIGNOSE-Calendar/
 */
rivets.binders['pignose-calendar'] = {
    bind: function(el) {
        var self = this;
        
        this.$el = $(el);
        this.options = this.$el.data('options') || {};
        
        switch(this.options.minDate) {
            case 'today':
                this.options.minDate = moment().subtract(1, 'days');
                break;
        }
        
        this.options.select = this.publish;
        this.options.apply = this.publish;
        
        self.$el.pignoseCalendar(this.options);
    },

    unbind: function(el) {
        window.jumplink.debug.binders('[pignose-calendar] unbind TODO!', this);
        delete this.$el;
    },

    routine: function(el, value) {
        if (value) {
            this.$el.pignoseCalendar('set', value);
            this.$el.val(value);
        }
    },

    getValue: function(el) {
        var value = this.$el.val();
        return value; 
    }
};

/**
 * summernote
 * @see https://summernote.org/
 */
rivets.binders.summernote = {
    bind: function(el) {
        this.$el = $(el);
        this.options = this.$el.data('options') || {};
        
        this.options.callbacks = {
            onChange: this.publish
        };
        window.jumplink.debug.binders('[summernote] options', this.options);
        this.$el.summernote(this.options);
    },

    unbind: function(el) {
        this.$el.summernote('destroy');
    },

    routine: function(el, newValue) {
        if (newValue) {
            var oldValue = this.getValue(el);
            if(oldValue !== newValue) {
                this.$el.summernote('code', newValue);
            }
        }
    },

    getValue: function(el) {
        var value = this.$el.summernote('code');
        return value; 
    }
};


rivets.binders.html = function (el, value) {
  $(el).html(value ? value : '');
};

/**
 * Move text shadow position of element by mouse position
 */
rivets.binders['moving-shadow-by-mouse-pos'] = function (el, divisor) {
    if(!divisor) {
        divisor = 200;
    }
    $(document).on('mousemove', function(event) {
    	var pos = {
    		x: event.pageX,
    		y: event.pageY
    	};
        $(el).css('text-shadow', 'rgba(0, 0, 0, 0.1) '+ pos.x/divisor +'px '+ pos.y/divisor +'px');
    });
};

/**
 * Move position of element by mouse position
 */
rivets.binders['moving-by-mouse-pos'] = function (el, divisor) {
    var $el = $(el);
    // Do not overwrite other transforms like rotation, so give me the current values for reusage
    var transformStrings = $el.css('transform').replace('matrix(', '').replace(')', '').split(',');
    var rotate = transformStrings[4];
    
    
    if(!divisor) {
        divisor = 200;
    }
    $(document).on('mousemove', function(event) {
    	var pos = {
    		x: event.pageX,
    		y: event.pageY
    	};
        $el.css('transform', 'matrix('+ transformStrings[0] +', '+ transformStrings[1] +', '+transformStrings[2]+', '+transformStrings[3]+', '+pos.x/divisor+', '+pos.y/divisor+')');
    });
};

/**
 * Set element fixed on top edge (Oberkante) of the element
 */
rivets.binders['fixed-top-edge'] = function (el, selector) {
    var $el = $(el);
    var setPosition = function() {
        var $under = $(selector);
        if($under.length) {
            var pos = jumplink.utilities.getElementPosition($under);
            $el
            .css('top', pos['fixed-y'] + 'px')
            .css('position', 'fixed');
        }
    };
    $(window).on('resize', function() {
        setTimeout(setPosition, 0);
    });
    if(Barba) {
        Barba.Dispatcher.on('newPageReady', function() {
            setTimeout(setPosition, 0);
        });
    }
};

/**
 * Set element fixed on lower edge (Unterkante) the element
 */
rivets.binders['fixed-lower-edge'] = function (el, selector) {
    var $el = $(el);
    var setPosition = function() {
        var $under = $(selector);
        if($under.length) {
            var pos = jumplink.utilities.getElementPosition($under);
            $el
            .css('top', pos['fixed-y'] + pos.h + 'px')
            .css('position', 'fixed');
        }
    };
    $(window).on('resize', function() {
        setTimeout(setPosition, 0);
    });
    if(Barba) {
        Barba.Dispatcher.on('newPageReady', function() {
            setTimeout(setPosition, 0);
        });
    }
};

/**
 * Set element absolute on top edge (Oberkante) of the element
 */
rivets.binders['absolute-top-edge'] = function (el, selector) {
    var $el = $(el);
    var setPosition = function() {
        var $under = $(selector);
        if($under.length) {
            var pos = jumplink.utilities.getElementPosition($under);
            $el.css('top', pos.y + 'px')
            .css('position', 'absolute');
        }
    };
    $(window).on('resize', function() {
        setTimeout(setPosition, 0);
    });
    if(Barba) {
        Barba.Dispatcher.on('newPageReady', function() {
            setTimeout(setPosition, 0);
        });
    }
};

/**
 * Set element absolute on lower edge (Unterkante) of the element
 */
rivets.binders['absolute-lower-edge'] = function (el, selector) {
    var $el = $(el);
    var setPosition = function() {
        var $under = $(selector);
        if($under.length) {
            var pos = jumplink.utilities.getElementPosition($under);
            $el
            .css('top', pos.y + pos.h + 'px')
            .css('position', 'absolute');
        }
    };
    $(window).on('resize', function() {
        setTimeout(setPosition, 0);
    });
    if(Barba) {
        Barba.Dispatcher.on('newPageReady', function() {
            setTimeout(setPosition, 0);
        });
    }
};


rivets.binders['show-on-url'] = function (el, url) {
    var $el = $(el);
    
    var checkURL = function() {
        console.log('url changed');
        var pathname = window.jumplink.getCurrentLocation().pathname;
        if(url === pathname) {
            setTimeout(function() {
                $el.show();
            }, 300);
        } else {
            $el.hide();
        }
    };
    
    if(Barba) {
        Barba.Dispatcher.on('newPageReady', checkURL);
    } else {
        $(window).on('hashchange', checkURL);
    }
    checkURL();    
};

rivets.binders['show-global-modal-on-click'] = function (el, data) {
    var $el = $(el);
    try {
        data = JSON.parse(data);
    } catch(e) {
        console.error(e, data);
    }
    console.log(data);
    $el.on('click', function(event) {
        jumplink.utilities.triggerComponentEvent('global-modal', 'show', null, data);
    });   
};

rivets.binders.class = {
   bind: function(el) {
        this.$el = $(el);
        this.staticClasses = this.$el.attr('class');
   },
   
    unbind: function(el) {
        delete this.$el;
        delete this.staticClasses;
    },
    
    routine: function(el, newValue) {
        if (newValue) {
            this.$el.attr('class', this.staticClasses);
            $(el).addClass(newValue);
        }
    }
};


/**
 * TODO support select
 */
rivets.binders.value = {
    publishes: true,
    priority: 3000,
    
    bind: function(el) {
        this.$el = $(el);
        this.type = this.$el.prop("type");
        this.tagName = this.$el.prop('tagName');
        this.$el.on('change input', this.publish);
    },

    unbind: function(el) {
        this.$el.off('change');
        delete this.$el;
        delete this.type;
        delete this.tagName;
    },

    routine: function(el, newValue) {
        if (newValue) {
            var oldValue = this.getValue(el);
            if(oldValue !== newValue) {
                switch(this.tagName) {
                    case 'INPUT':
                        this.$el.val(newValue);
                        break;
                    case 'TEXTAREA':
                        this.$el.val(newValue);
                        break;
                }
                
            }
        }
    },

    getValue: function(el) {
        var value;
        var type = this.$el.prop("type");
        var tagName = this.$el.prop('tagName');
        
        switch(this.tagName) {
            case 'INPUT':
                switch(this.type) {
                    case 'number':
                        value = parseFloat(this.$el.val()) || 0;
                    break; 
                    default:
                        value = this.$el.val().toString();
                        break;   
                }
                break;
            case 'TEXTAREA':
                value = this.$el.val().toString();
                break;
        }
        

        return value; 
    }
};



/**
 * TODO not working with rv-checkbox component
 */
rivets.binders.checked = {
    publishes: true,
    priority: 2000,
    
    bind: function(el) {
        
        this.initTemplateSelector = function(el) {
            if(this.type === 'checkbox') {
                this.$checkbox = this.$el;
            } else {
                this.$checkbox = this.$el.find('input[type="checkbox"]');
            }
        };
        
        this.$el = $(el);
        this.type = this.$el.prop("type");
        this.initTemplateSelector(el);
        this.$el.on('change', this.publish);
        
    },

    unbind: function(el) {
        this.$el.off('change');
        delete this.$el;
        delete this.type;
        delete this.$checkbox;
    },

    routine: function(el, newValue) {
        newValue = newValue === true;
        
        /**
         * If this binder is ussed on a component it could be that the component template
         * was not ready at the time this binder was called, so we check here if the element was found and if not we try it again
         */
        if(!this.$checkbox.length) {
            this.initTemplateSelector(el);
        }
        
        this.$checkbox.prop('checked', newValue);
    },

    getValue: function(el) {
        var value = this.$checkbox.is(":checked");
        return value;
    }
};

rivets.binders.selected = {

    bind: function(el) {
        
        this.initTemplateSelector = function(el) {
            if(this.tagName === 'SELECT') {
                this.$select = this.$el;
            } else {
                this.$select = this.$el.find('select');
            }
        };
        
        this.$el = $(el);
        this.tagName = this.$el.prop('tagName');
        this.initTemplateSelector(el);
        this.$el.on('change', this.publish);
    },

    unbind: function(el) {
        this.$el.off('change');
        delete this.$el;
        delete this.tagName;
        delete this.$select;
    },

    routine: function(el, newValue) {
        window.jumplink.debug.binders('[selected] this.$select', this.$select, 'newValue', newValue);
        
        /**
         * If this binder is ussed on a component it could be that the component template
         * was not ready at the time this binder was called, so we check here if the element was found and if not we try it again
         */
        if(!this.$select.length) {
            this.initTemplateSelector();
        }
        
        if(!newValue) {
            newValue = jumplink.utilities.getFirstSelectValue(this.$select);
        }
        
        var oldValue = this.getValue(el);
        window.jumplink.debug.binders('[selected] newValue', newValue, 'oldValue', oldValue);
        if(oldValue !== newValue) {
            jumplink.utilities.setSelectedValue(this.$select, newValue);
        }
    },

    getValue: function(el) {
        if(!this.$select.length) {
            this.initTemplateSelector();
        }
        var value = jumplink.utilities.getSelectedValue(this.$select);
        window.jumplink.debug.binders('[selected] getValue', value);
        return value; 
    }
};