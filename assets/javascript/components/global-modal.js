/**
 * A modal component for alerts, do you need to use this component in dom only once
 * and you can call by tigger a global event:
 * @example $.event.trigger('rivets:global-modal', [true, data]);
 * 
 * The data param should have title, body, ..
 * 
 * @events
 *  * rivets:global-modal:show (event, data)
 */
rivets.components['global-modal'] = {

  template: function() {
    return jumplink.templates['global-modal'];
  },

  initialize: function(el, data) {
    var controller = this;
    controller.debug = debug('rivets:global-modal');
    controller.debug('initialize', controller, el, data);
    
    controller.title = '';
    controller.body = '';
    
    controller.width = 'lg'; // sm | md | lg
    
    var $el = $(el);
    var $modal = $el.find('#modal');
    
    /**
     * global event to show / hide this modal 
     * 
     */
    var showEvent = jumplink.utilities.getComponentEventName('global-modal', 'show', data.handle);
    controller.debug('showEvent', showEvent);
    $(document).bind(showEvent, function (event, data) {        
        controller.debug('['+showEvent+']', event, data);
        
        if(data.title) {
            controller.title = data.title;
        } else {
            controller.title = '';
        }
        
        if(data.templateName) {
            controller.body = jumplink.templates[data.templateName];
        } else {
            controller.body = data.template;
        }
        
        rivets.bind($el.find('.modal-body').children(), data);
        
        controller.debug('show', event, data, controller.data);
        controller.show(event, controller);
    });
    
    var hideEvent = jumplink.utilities.getComponentEventName('global-modal', 'hide', data.handle);
    controller.debug('hideEvent', hideEvent);
    $(document).bind(hideEvent, function (event, data) {
        controller.debug('['+hideEvent+']', event, data);
        controller.hide(event, controller);
    });
    
    $modal.modal({
        show: false,
        focus: false,
        keyboard: true,
        backdrop: true,
    });
    
    controller.toggle = function(event, controller, show) {
        controller.debug('toggle', event, controller, show);
        $modal.modal('toggle');
    };
    
    controller.show = function(event, controller) {
       controller.debug('show', controller.data);
       $modal.modal('show');
    };
    
    controller.hide = function(event, controller) {
       $modal.modal('hide');
    };

    return controller;
  }
};