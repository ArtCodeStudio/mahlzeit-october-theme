/**
 * Single file of the preview-files component
 */
rivets.components['load-script'] = {

  template: function() {
    // Return empty template - the script will inject content into the element
    return "";
  },

  initialize: function(el, data) {
    var controller = this;
    controller.debug = debug('rivets:load-script');
    controller.debug('initialize', el, data);
    var $el = $(el);
    controller.src = data.src;
    
    // Remove surrounding quotes if present (Rivets may pass strings with quotes)
    if (typeof controller.src === 'string') {
      controller.src = controller.src.replace(/^['"]|['"]$/g, '');
    }
    
    // Ensure protocol-relative URLs work correctly
    if (controller.src && controller.src.indexOf('//') === 0) {
      controller.src = window.location.protocol + controller.src;
    }
    
    $el.attr('data-src', controller.src);
    
    // Create a script element and append it to the element
    // This allows the loaded script to inject content (like iframes) into the container
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = controller.src;
    script.async = true;
    
    script.onload = function() {
      controller.debug('Script loaded successfully');
    };
    
    script.onerror = function() {
      controller.debug('Script load failed');
      console.error('Failed to load script:', controller.src);
    };
    
    // Append script to the element so the widget can render inside it
    el.appendChild(script);
    
    return controller;
  }
};