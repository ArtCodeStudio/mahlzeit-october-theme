// JumpLink object
window.jumplink = window.jumplink || {};
window.jumplink.partials = {};

// debugging https://github.com/visionmedia/debug
window.jumplink.debug = window.jumplink.debug || {};
window.jumplink.debug.partials = debug('theme:partials');

/**
 * Search for partials and init them if init function is defined
 * @see https://help.shopify.com/themes/development/theme-editor/partials
 */
window.jumplink.partials.init = function(dataset, data) {
  window.jumplink.debug.partials('init');
  var $partials = $('.jumplink-partial');
  $partials.each(function(index) {
    var $partial = $(this);
    window.jumplink.debug.partials('$partial', $partial);
    var partialID = $partial.data('partialName'); // allways the second class is the partial name
    
    if(window.jumplink.utilities.isFunction(window.jumplink.partials[partialID])) {
        if(!$partial.hasClass('partial-initialized')) {
            window.jumplink.debug.partials('init '+partialID);
            window.jumplink.partials[partialID]($partials, $partial, dataset, data);
            $partial.addClass('partial-initialized');
        } else {
            window.jumplink.debug.partials('partial '+partialID+' allready initialized');
        }

      
    } else {
      window.jumplink.debug.partials('no javascript for partial:', partialID);
    }
  });
};

