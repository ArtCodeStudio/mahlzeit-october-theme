// JumpLink object
window.jumplink = window.jumplink || {};
window.jumplink.dependencies = {};

// debugging https://github.com/visionmedia/debug
window.jumplink.debug = window.jumplink.debug || {};
window.jumplink.debug.dependencies = debug('theme:dependencies');

jumplink.dependencies['turn.js'] = function() {
  return new Promise(function(resolve, reject) {
    if ($.turn) {
      jumplink.debug.dependencies('turn.js is loaded');
      resolve();
    } else {
      jumplink.debug.dependencies('load turn.js');

      $.getScript(jumplink.settings.active_theme_path + '/assets/vendor/turnjs4/lib/turn.min.js')
        .done(function( script, textStatus ) {
          jumplink.debug.dependencies(textStatus);
          resolve(script);
        })
        .fail(function( jqxhr, settings, exception ) {
          jumplink.debug.dependencies(exception);
          reject(exception);
      });
    }
  });
}