/**
 * flipbooks
 */
rivets.components.flipbooks = {
  template: function() {
    return jumplink.templates.flipbooks;
  },
  initialize: function(el, data) {
    var controller = this;
    controller.debug = debug('rivets:flipbooks');
    var $el = $(el);
    controller.books = JSON.parse(data.books);
    controller.debug('initialize flipbooks component', $el, controller.books);
    
    controller.ready = false;
    

    var ready = function() {
        jumplink.dependencies['turn.js']()
        .then(function() {
            controller.ready = true;
        });
    };
    
    ready();

    /*$el.one('DOMSubtreeModified', function() {
        setTimeout(function() {
            ready();
        }, 0);     
    });*/
            
    return controller;
  }
};