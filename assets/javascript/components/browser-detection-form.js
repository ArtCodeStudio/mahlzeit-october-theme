/**
 */
rivets.components['browser-detection-form'] = {

  template: function() {
    return jumplink.templates['browser-detection-form'];
  },

  initialize: function(el, data) {
    var controller = this;
    controller.debug = debug('rivets:browser-detection-form');
    var $el = $(el);
    controller.debug('initialize', $el, data);
    controller.ready = false;
    controller.platform = {};
        
    var ready = function() {
        jumplink.dependencies.platform()
        .then(function(platform) {
            controller.debug('platform is ready', platform);
            controller.ready = true;
            controller.platform = platform;
        })
        .catch(function(exception) {
            controller.debug('cant load platform', exception);
        });
    };
    
    setTimeout(function() {
        ready();
    }, 0);  
    
    return controller;
  }
};