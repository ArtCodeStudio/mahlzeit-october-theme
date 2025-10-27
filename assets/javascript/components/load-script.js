/**
 * Single file of the preview-files component
 */
rivets.components['load-script'] = {

  template: function() {
    // return $('template#spinner').html();
    return "<script type='text/javascript' rv-src='src'></script>";
  },

  initialize: function(el, data) {
    var controller = this;
    controller.debug = debug('rivets:load-script');
    controller.debug('initialize', el, data);
    var $el = $(el);
    controller.src = data.src;
    $el.attr('data-src', controller.src);
    
     $.getScript(data.src, function( data, textStatus, jqxhr ) {
      controller.debug( data ); // Data returned
      controller.debug( textStatus ); // Success
      controller.debug( jqxhr.status ); // 200
      controller.debug( "Load was performed." );
    });
    
    return controller;
  }
};