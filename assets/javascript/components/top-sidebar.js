/**
 * top-sidebar
 */
rivets.components['top-sidebar'] = {
  template: function() {
    return jumplink.templates['top-sidebar'];
  },
  initialize: function(el, data) {
    var controller = this;
    controller.debug = debug('rivets:top-sidebar');
    var $el = $(el);
    controller.shown = false;
    controller.menuItems = JSON.parse(data.menuItems);
    controller.debug('initialize', $el, controller.menuItems);
    var $tcon = $('.top-sidebar-toggler.tcon');
    var $toggler = $('.top-sidebar-toggler');

    controller.show = function() {
        var offset = jumplink.utilities.getNavHeight();
        var vh = $(window).height();
        transformicons.transform($tcon[0]);
        controller.debug('show', offset, vh);
        var height = vh - offset;
        $el.height(height);
        $el.removeClass('hidden').addClass('shown animate');
        setTimeout(function() {
            $el.removeClass('animate');
        }, 300);
        
        controller.shown = true;
    };
    
    controller.hide = function() {
        controller.debug('hide');
        transformicons.revert($tcon[0]);
        $el.height(0);
        $el.removeClass('shown').addClass('hidden animate');
        setTimeout(function() {
            $el.removeClass('animate');
        }, 300);
        
        controller.shown = false;
    };
    
    controller.toggle = function() {
        if(controller.shown) {
            controller.hide();
        } else {
            controller.show();
        }
    };


    var ready = function() {
        controller.hide();
    };
    
    $toggler.on('click', function(event) {
        controller.toggle();
    });

    $el.one('DOMSubtreeModified', function() {
        setTimeout(function() {
            ready();
        }, 0);     
    });
            
    return controller;
  }
};