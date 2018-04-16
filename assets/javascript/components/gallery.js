/**
 * Component to show the images of all events
 */
rivets.components.gallery = {

  template: function() {
    return jumplink.templates.gallery;
  },

  initialize: function(el, data) {
    var controller = this;
    data.data = JSON.parse(data.data);
    var $el = $(el);
    controller.debug = debug('rivets:gallery');
    controller.debug('initialize', $el, data);
    // var observer;
    var $imagesWrapper = $el.find('[data-photoswipe-thumbs]');

    controller.handle = data.data.handle;
    controller.type = data.type;
    controller.imagesPath = data.imagesPath;
    controller.headerTitle = data.data.title;
    controller.headerText = data.data.description;
    controller.container = '';
    controller.images = [];
    controller.handle = data.handle;
    
    data.autoscroll = !!data.autoscroll;
    data.mousescroll = !!data.mousescroll;
    
    if(jumplink.utilities.isString(data.containerClass)) {
        controller.container = data.containerClass;
    } else {
        controller.container = controller.type === 'grid' ? 'container' : 'container-fluid';
    }
            
    
    var themeSettingImagesToArray = function(themeImages) {
        var images = [];
        
        for (var index in themeImages) {
            if (themeImages.hasOwnProperty(index)) {
                var image = themeImages[index];
                image.index = Number(index);
                controller.debug('image', image, 'index', index);
                images.push(image);
            }
        }
        return images;
    };
    
    var openPhotoSwipe = function(index) {
        jumplink.utilities.openPhotoSwipe(data.handle, $imagesWrapper, index, controller.images);
    };
    
    
    // triggers when user clicks on thumbnail
    controller.onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var $target = $(e.target || e.srcElement).closest('[data-index]'); // parent to get the rivets rv-img component root element
        var data = $target.data();

        controller.debug('[onThumbnailsClick] $target', $target, $target, data);

        if(data.index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe(data.index);
        }
        return false;
    };
    
    /**
     * Scoll vertivally on horizontal mouse scroll
     * @see https://stackoverflow.com/a/28172102/1465919
     */
    var initMouseScroll = function ($slideScrollbar) {
        /**
         * Check which wheel event is supported. Don't use both as it would fire each event 
         * in browsers where both events are supported.
         * 
         */
        var wheelEvent = jumplink.utilities.isEventSupported('mousewheel') ? 'mousewheel' : 'wheel';
        
        controller.debug($el.find('.slide_scrollbar'));
            
        $slideScrollbar.off(wheelEvent).on(wheelEvent, function(event) {
            var oEvent = event.originalEvent;
            var delta  = oEvent.deltaY || oEvent.wheelDelta;
            this.scrollLeft += (delta * 5);
            event.preventDefault();
        });   
    };
    
    var setScrollbarMargin = function($slideScrollbar) {
        var scrollbarWidth = jumplink.utilities.getScrollbarWidth('scrollbar-primary');
        $slideScrollbar.css('margin-bottom', scrollbarWidth + 'px');
    };
    
    var initAutoscroll = function($slideScrollbar) {
        var scrollDirection = 1;
        var jumps = 25;
        var stop = false;
        var delay = 500;
        var position = null;
        var maxScrollWidth = $slideScrollbar.prop('scrollWidth') - $slideScrollbar.outerWidth();
        
        var scroll = function (event) {
            if(stop) {
                return;
            }
            
            console.log('scroll');
            
            position = $slideScrollbar.scrollLeft();
            
            if(scrollDirection > 0) {
                position = position + jumps;
            } else {
                position = position - jumps;
            }
            
            if ( position <= 5) {
                scrollDirection = 1;
            } else if (position >= maxScrollWidth) {
                scrollDirection = -1;
            }
            
            return $slideScrollbar.animate({
                scrollLeft: position
            }, delay, 'linear', scroll);
        };
        $slideScrollbar.off('mouseenter mouseover').on('mouseenter mouseover', function(e) {
            
            setTimeout(function() {
                if($slideScrollbar.filter(':hover').length) {
                    stop = true;
                }
            }, 200);
            
        });
        $slideScrollbar.off('mouseleave').on('mouseleave', function(e) {
            setTimeout(function() {
                if(stop && !$slideScrollbar.filter(':hover').length) {
                    stop = false;
                    return scroll(e);
                }
            }, 200);
        });
        
        return scroll();
    };
    
    var initScrollbar = function() {        
        jumplink.dependencies.dragscroll()
        .then(function() {
            return jumplink.dependencies.platform();
        })
        .then(function(platform) {
            controller.debug('dragscroll is ready', dragscroll);
            
            var $slideScrollbar = $el.find('.slide_scrollbar');
            setScrollbarMargin($slideScrollbar);
            
            if(data.mousescroll) {
                initMouseScroll($slideScrollbar);
            }
            
            if(data.autoscroll && !platform.os.isTouch) {
                initAutoscroll($slideScrollbar);
            }
            
            dragscroll.reset();
            return jumplink.dependencies['jquery-touch-events']();
        })
        .catch(function(exception) {
            controller.debug('cant load dependencies', exception);
        });
    };
   
        
    controller.images = themeSettingImagesToArray(data.data.images);
    controller.debug('images', controller.images);
    
    var ready = function(mutationsList) {
        controller.ready = true;
        controller.debug('ready');
        
        initScrollbar();
    };
        
    setTimeout(ready, 100);

    return controller;
  }
};
