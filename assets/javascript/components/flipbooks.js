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
    data.books = JSON.parse(data.books);
    
    controller.books = $.map(data.books, function(book, index) {
        return [book];
    });
    
    controller.background = data.background;
    controller.handle = data.handle;
    controller.debug('initialize flipbooks component', $el, data);
    
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