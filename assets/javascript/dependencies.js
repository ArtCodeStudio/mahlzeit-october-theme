// JumpLink object
window.jumplink = window.jumplink || {};
window.jumplink.dependencies = {};

// debugging https://github.com/visionmedia/debug
window.jumplink.debug = window.jumplink.debug || {};
window.jumplink.debug.dependencies = debug('theme:dependencies');

jumplink.dependencies['turn.js'] = function() {
  return new Promise(function(resolve, reject) {
    if ($().turn) {
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
};

jumplink.dependencies['vague.js'] = function() {
  return new Promise(function(resolve, reject) {
    if ($().Vague) {
      jumplink.debug.dependencies('vague.js is loaded');
      resolve();
    } else {
      jumplink.debug.dependencies('load vague.js');

      $.getScript(jumplink.settings.active_theme_path + '/assets/vendor/Vague.js/Vague.js')
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
};

/**
 * 
 * @see https://github.com/desandro/masonry
 */
jumplink.dependencies.masonry = function() {
  return new Promise(function(resolve, reject) {
    if ($().masonry) {
      jumplink.debug.dependencies('masonry is loaded');
      resolve();
    } else {
      jumplink.debug.dependencies('load masonry');

      $.getScript(jumplink.settings.active_theme_path + '/assets/vendor/masonry-layout/dist/masonry.pkgd.js')
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
};

/**
 * 
 * @see http://photoswipe.com/
 */
jumplink.dependencies.photoswipe = function() {
  return new Promise(function(resolve, reject) {
    if (typeof(PhotoSwipe) !== 'undefined') {
      jumplink.debug.dependencies('photoswipe is loaded');
      resolve();
    } else {
      jumplink.debug.dependencies('load photoswipe');
      $.getScript(jumplink.settings.active_theme_path + '/assets/vendor/photoswipe/dist/photoswipe.js')
        .done(function( script, textStatus ) {
          jumplink.debug.dependencies('load photoswipe ui default');
          jumplink.debug.dependencies(textStatus);
          $.getScript(jumplink.settings.active_theme_path + '/assets/vendor/photoswipe/dist/photoswipe-ui-default.js')
            .done(function( script, textStatus ) {
              jumplink.debug.dependencies(textStatus);
              resolve(script);
            })
            .fail(function( jqxhr, settings, exception ) {
              jumplink.debug.dependencies(exception);
              reject(exception);
          });
        })
        .fail(function( jqxhr, settings, exception ) {
          jumplink.debug.dependencies(exception);
          reject(exception);
      });
    }
  });
};