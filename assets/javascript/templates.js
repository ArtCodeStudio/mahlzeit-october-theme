// JumpLink object
window.jumplink = window.jumplink || {};
window.jumplink.templates = {};
window.jumplink.pages = {};


// debugging https://github.com/visionmedia/debug
window.jumplink.debug = window.jumplink.debug || {};
window.jumplink.debug.templates = debug('theme:templates');


// rivets model
window.jumplink.model = {};
window.jumplink.boundView;


window.jumplink.templates.init = function(dataset, data) {
  if(typeof(window.jumplink.templates[dataset.namespace]) === 'function' ) {
    window.jumplink.templates[dataset.namespace](dataset, data);
    $(document).trigger('jumplink.initTemplateReady', [dataset, data]);
  } else {
    window.jumplink.debug.templates('No javascript for template:', dataset.namespace);
  }
};

/**
 * To test if the jumplink.newPageReady was called at the first
 */
window.jumplink.firstNewPageReadyEvent = true;


window.jumplink.templates.prepairTemplate = function(container, dataset) {
    
    // window.jumplink.debug.templates('newPageReady');
    var data = jumplink.utilities.parseDatasetJsonStrings(dataset);
    var $container = $(container);
    jumplink.model.dataset = dataset;
    
    // if(window.jumplink.boundView) {
    //  jumplink.boundView.unbind();
    // }
    
    
    

    
    jumplink.dependencies.platform()
    .then(function(platform) {
        jumplink.model.platform = platform;
        jumplink.boundView = rivets.bind($container, window.jumplink.model);
        
        // init browser-detection-bar seperate because its outsite of barba container
        if(!platform.supported) {
            rivets.init('browser-detection-bar', $('body'), window.jumplink.model);
        }
    })
    .catch(function(exception) {
        window.jumplink.debug.templates('cant load platform', exception);
    });
    
    
    jumplink.utilities.closeAllModals();
    jumplink.initDataApi();
    jumplink.resetNav();
    jumplink.utilities.setBodyId(dataset.namespace);
    
    jumplink.initMomentDataApi();
    
    if(typeof(Prism) !== 'undefined') {
        Prism.highlightAll(); // To make a component for this
    }

    // preload images again if failed in barba or this is the first page request
    // window.jumplink.loadImagesByNamespace();
    
    // window.jumplink.loadVideos();
    
    // window.jumplink.showHideNewsletterForm(dataset, data);
    
    // window.jumplink.initDataAttributes(dataset);
    
    // window.jumplink.setNavActive(dataset, data);
    
    
    jumplink.utilities.hyphenate(); // todo make a component for this
    
    jumplink.debug.templates('dataset', dataset, 'data', data);
    
    // window.jumplink.utilities.loadImages();
    
    window.jumplink.partials.init(dataset, data);
    window.jumplink.templates.init(dataset, data);
    
    if(window.jumplink.firstNewPageReadyEvent) {
        $(document).trigger('jumplink.newPageReady', [true, dataset, data]);
    jumplink.firstNewPageReadyEvent = false;
    } else {
        $(document).trigger('jumplink.newPageReady', [false, dataset, data]);
    }
    
    
};

/**
 * init no-barba template like I am not a robot captcha (url /challenge)
 */
window.jumplink.templates['no-barba'] = function (dataset, data) {
  // disable barba
  console.warn('disable barba');
  Barba.Pjax.preventCheck = function() {
    return false;
  };
};

/**
 * init templates/page.browser-browser-detection.liquid
 * e.g. /pages/browser-detection
 */
window.jumplink.templates['system-browser-detection'] = function (dataset, data) {
  // window.jumplink.initBrowserDetectionTemplate('#browser-info');
};

/**
 * Barba.js template
 */
window.jumplink.templates.index = function (dataset, data) {
    window.jumplink.debug.templates('init home');
    jumplink.setNavActive('home');
    // jumplink.cache.$barbaWrapper.css( 'padding-top', jumplink.utilities.getNavHeight()+'px');
    // initProductList();
    // jumplink.initCarousel('home-slideshow');
};