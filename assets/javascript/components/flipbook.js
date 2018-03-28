/**
 * flipbook
 */
rivets.components.flipbook = {
  template: function() {
    return jumplink.templates.flipbook;
  },
  initialize: function(el, data) {
    var controller = this;
    controller.debug = debug('rivets:flipbook');
    var $el = $(el);
    
    // convert object to array
    data.book.pages = $.map(data.book.pages, function(page, index) {
        page.image = jumplink.settings.media_path+page.image;
        return [page];
    });
        
    controller.book = data.book;
    
    controller.showMask = false;
    
    // controller.book.width = Number(controller.book.w);
    // controller.book.height = Number(controller.book.h) / 2;
    
    controller.previewPage = controller.book.pages[0];
    controller.ratio = data.book.w + ':' + data.book.h;
    controller.debug('initialize flipbook component', $el, controller.book);
    
    
    /**
     * Function should return an object with coordinates from which initial zoom-in animation will start (or zoom-out animation will end).
     * Good guide on how to get element coordinates:
     * http://javascript.info/tutorial/coordinates
     */
    var getPreviewPosition = function() {
        controller.debug('[getPreviewPosition]');
        // find thumbnail element
        var $thumbnail = $el.find('.flipbook-preview');
        controller.debug('[getPreviewPosition] $thumbnail', $thumbnail);
        // get window scroll Y
        var pageYScroll = window.pageYOffset || document.documentElement.scrollTop; 
        // optionally get horizontal scroll
        // get position of element relative to viewport
        var rect = $thumbnail[0].getBoundingClientRect();
        var result = {x: rect.left, y: rect.top /*- pageYScroll*/, w: rect.width, h: rect.height};
        controller.debug('[getPreviewPosition] result', result);
        return result;
    };
    
    /**
     * Scales the flipbook to the size of the preview and set the position over the preview for a nice zoome in animation
     */
    var scaleFlipbookToPreview = function (flipbookDim) {
        var preview = getPreviewPosition();
        preview.w = Math.round(preview.w);
        preview.h = Math.round(preview.h);
        $zoom = $el.find('.flipbook-zoom-wrapper');
        
        var scaleX = preview.w / flipbookDim.w;
        var scaleY = preview.h / flipbookDim.h;
        
        initFlipbook(flipbookDim);

        $zoom
        .css('visibility', 'visible')
        .css('transform', 'translate3d('+(preview.x - (flipbookDim.w / 2))+'px, '+ (preview.y - ((flipbookDim.h  - preview.h) / 2))+'px, 0px) scale3d('+(scaleX * 2)+', '+(scaleY)+', 1)' );
        
        setTimeout(function() {
            $zoom.addClass('animate');
        }, 0);
    };
    
    
    var scaleFlipbookBackToPreview = function (flipbookDim) {
        var preview = getPreviewPosition();
        preview.w = Math.round(preview.w);
        preview.h = Math.round(preview.h);
        $zoom = $el.find('.flipbook-zoom-wrapper');
        
        var scaleX = preview.w / flipbookDim.w;
        var scaleY = preview.h / flipbookDim.h;

        $zoom
        .css('transform', 'translate3d('+(preview.x - (flipbookDim.w / 2))+'px, '+ (preview.y - ((flipbookDim.h  - preview.h) / 2))+'px, 0px) scale3d('+(scaleX * 2)+', '+(scaleY)+', 1)' );
        
        closeFlipbook(flipbookDim);
        
    };
    
    /**
     * Starts the zoome in animation and opens the first page if there are more then 2 pages
     */
    var scaleFlipbookToOriginal = function (flipbookDim) {
        var $flipbook = $el.find('.flipbook-zoom-wrapper .flipbook');
        var $zoom = $el.find('.flipbook-zoom-wrapper');
        
        setTimeout(function() {
            if(data.book.pages.length > 2) {
                $flipbook.turn('page', 2);
            }
        }, 0);
             
        setTimeout(function() {
            $zoom
            .css('transform', 'translate3d('+ (flipbookDim.x) +'px, '+ (flipbookDim.y) +'px, 0px) scale3d(1, 1, 1)' );
        }, 0);
    };
    
    var getFlipbookDim = function() {
        var viewportDim = jumplink.utilities.getViewportDimensions();
        
        /* Generate the demensions of the flipbook with border
         * - controller.book.w * 2 because we have to pages
         * - w and h -100 for 50px spacing on all sites
         */
        var flipbookDim = jumplink.utilities.calculateAspectRatioFit(controller.book.w * 2, controller.book.h, viewportDim.w - 10, viewportDim.h - 100);
        
        flipbookDim.w = Math.round(flipbookDim.w);
        flipbookDim.h = Math.round(flipbookDim.h);
        
        flipbookDim.x = Math.round((viewportDim.w - flipbookDim.w) / 2);
        flipbookDim.y = Math.round((viewportDim.h - flipbookDim.h) / 2);
        
        controller.debug('viewportDim', viewportDim, 'flipbookDim', flipbookDim);
        
        return flipbookDim;
    };
    
    controller.zoomInBook = function() {
        
        var flipbookDim = getFlipbookDim();

        scaleFlipbookToPreview(flipbookDim);

        scaleFlipbookToOriginal(flipbookDim);
    };
    
    controller.zoomOutBook = function() {
        controller.debug('zoomOutBook');
        var flipbookDim = getFlipbookDim();
        
        scaleFlipbookBackToPreview(flipbookDim);
        
    };

    
    var initFlipbook = function(flipbookDim) {
        var $flipbook = $el.find('.flipbook-zoom-wrapper .flipbook');
        

        if($flipbook.find('.page-wrapper').length !== 0) {
            controller.debug('turn already initialized');
        } else {
        	$flipbook.turn({
        		width: flipbookDim.w,
        		height: flipbookDim.h,
        		autoCenter: false,
        		duration: 1000,
        	});
        }
    	
    	controller.showMask = true;
    };
    
    var closeFlipbook = function(flipbookDim) {
        var $flipbook = $el.find('.flipbook-zoom-wrapper .flipbook');
        var $zoom = $el.find('.flipbook-zoom-wrapper');
        
        controller.showMask = false;
        
        $flipbook.turn('page', 1);
        
                        
        setTimeout(function() {
            // $flipbook.turn('destroy');
            setTimeout(function() {
                $zoom.removeClass('animate');
            }, 0);
            
            $zoom
            .css('visibility', 'hidden')
            .css('transform', 'scale3d(0, 0, 0)' );
        }, 1000);
                
    };
    
    var ready = function() {
        var $flipbook = $el.find('.flipbook-zoom-wrapper .flipbook');
        var $mask = $el.find('.mask');
        $mask.click(function(event) {
            controller.debug('click');
            controller.zoomOutBook();
        });
    };

    
    setTimeout(function() {
        ready();
    }, 100);
    
    

            
    return controller;
  }
};