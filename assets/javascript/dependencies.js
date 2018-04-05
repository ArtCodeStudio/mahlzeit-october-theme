// JumpLink object
window.jumplink = window.jumplink || {};
window.jumplink.dependencies = {};

// debugging https://github.com/visionmedia/debug
window.jumplink.debug = window.jumplink.debug || {};
window.jumplink.debug.dependencies = debug('theme:dependencies');

jumplink.dependencies['turn.js'] = function() {
  return new Promise(function(resolve, reject) {
    if ($().turn) {
      jumplink.debug.dependencies('turn.js is already loaded');
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
      jumplink.debug.dependencies('vague.js is already loaded');
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
      jumplink.debug.dependencies('masonry is already loaded');
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
      jumplink.debug.dependencies('photoswipe is already loaded');
      resolve(PhotoSwipe);
    } else {
      jumplink.debug.dependencies('load photoswipe');
      $.getScript(jumplink.settings.active_theme_path + '/assets/vendor/photoswipe/dist/photoswipe.js')
        .done(function( script, textStatus ) {
          jumplink.debug.dependencies('load photoswipe ui default');
          jumplink.debug.dependencies(textStatus);
          $.getScript(jumplink.settings.active_theme_path + '/assets/vendor/photoswipe/dist/photoswipe-ui-default.js')
            .done(function( script, textStatus ) {
              jumplink.debug.dependencies(textStatus);
              resolve(PhotoSwipe);
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

/**
 * 
 * @see https://github.com/bestiejs/platform.js/
 */
jumplink.dependencies.platform = function() {
  return new Promise(function(resolve, reject) {
    if (typeof(window.platform) !== 'undefined') {
      jumplink.debug.dependencies('platform is already loaded');
      resolve(window.platform);
    } else {
      jumplink.debug.dependencies('load platform');

      $.getScript(jumplink.settings.active_theme_path + '/assets/vendor/platform.js/platform.js')
        .done(function( script, textStatus ) {
          jumplink.debug.dependencies(textStatus);
          window.platform = jumplink.utilities.initPlatform(window.platform);
          resolve(window.platform);
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
 * @see https://github.com/asvd/dragscroll
 */
jumplink.dependencies.dragscroll = function() {
  return new Promise(function(resolve, reject) {
    if (typeof(window.dragscroll) !== 'undefined') {
      jumplink.debug.dependencies('dragscroll is already loaded');
      resolve(window.dragscroll);
    } else {
      jumplink.debug.dependencies('load dragscroll');

      $.getScript(jumplink.settings.active_theme_path + '/assets/vendor/dragscroll/dragscroll.js')
        .done(function( script, textStatus ) {
          jumplink.debug.dependencies(textStatus);
          resolve(window.dragscroll);
        })
        .fail(function( jqxhr, settings, exception ) {
          jumplink.debug.dependencies(exception);
          reject(exception);
      });
    }
  });
};

/**
 * New element events: tapstart, tapend, tapmove, tap, singletap, doubletap, taphold, swipe, swipeup, swiperight, swipedown, swipeleft, swipeend, scrollstart, scrollend, orientationchange
 * 
 * FIXME can#t load async because this is a jquery plugin which is initialized as soon as jquery is ready, but this can not be fired manually
 * 
 * @see https://github.com/benmajor/jQuery-Touch-Events
 */
jumplink.dependencies['jquery-touch-events'] = function() {
  return new Promise(function(resolve, reject) {
    if (jumplink.utilities.isFunction($().tap)) {
      jumplink.debug.dependencies('jquery-touch-events is already loaded');
      resolve($);
    } else {
      var error = new Error('currently it is not possible to load jquery-touch-events with ajax, please add the dependency into your body');
      jumplink.debug.dependencies(error);
      reject(error);
      /*
      $.getScript(jumplink.settings.active_theme_path + '/assets/vendor/jquery-touch-events/src/jquery.mobile-events.js')
        .done(function( script, textStatus ) {
          jumplink.debug.dependencies(textStatus);
          resolve($);
        })
        .fail(function( jqxhr, settings, exception ) {
          jumplink.debug.dependencies(exception);
          reject(exception);
      });
      */
    }
  });
};