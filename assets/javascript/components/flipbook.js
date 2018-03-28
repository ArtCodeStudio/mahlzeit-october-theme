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
    
    controller.book.width = Number(controller.book.w);
    controller.book.height = Number(controller.book.h) / 2;
    
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
    var scaleFlipbookToPreview = function () {
        var preview = getPreviewPosition();
        $zoom = $el.find('.flipbook-zoom-wrapper');
        
        var scaleX = preview.w / controller.book.width;
        var scaleY = preview.h / controller.book.height;
        
        ready();

        $zoom
        .css('visibility', 'visible')
        .css('transform', 'translate3d('+(preview.x - (controller.book.width / 2))+'px, '+ (preview.y - ((controller.book.height  - preview.h) / 2))+'px, 0px) scale3d('+(scaleX * 2)+', '+(scaleY)+', 1)' );
        
        setTimeout(function() {
            $zoom.addClass('animate');
        }, 0);
        
    };
    
    /**
     * Starts the zoome in animation and opens the first page if there are more then 2 pages
     */
    var scaleFlipbookToOriginal = function () {
        var $flipbook = $el.find('.flipbook-zoom-wrapper .flipbook');
        $zoom = $el.find('.flipbook-zoom-wrapper');
        
        setTimeout(function() {
            if(data.book.pages.length > 2) {
                $flipbook.turn('page', 2);
            }
        }, 0);
             
        setTimeout(function() {
            $zoom
            .css('transform', 'translate3d(-'+0+'px, -'+0+'px, 0px) scale3d(1, 1, 1)' );
        }, 0);
    };
    
    controller.zoomBook = function() {

        scaleFlipbookToPreview();

        scaleFlipbookToOriginal();
    };

    
    var ready = function() {
        var $flipbook = $el.find('.flipbook-zoom-wrapper .flipbook');
        
    	$flipbook.turn({
    		width: controller.book.width,
    		height: controller.book.height,
    		autoCenter: false,
    		// duration: 1000,
    	});
    	 setTimeout(function() {
    	    // $flipbook.turn('page', 2);
    	 }, 0);
    };
    
    
    $el.one('DOMSubtreeModified', function() {
        setTimeout(function() {
            // eady();
        }, 500);
    });
            
    return controller;
  }
};