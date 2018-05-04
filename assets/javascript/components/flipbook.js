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
    var vagues;
    
    data.book.pages.forEach(function(page, index) {
        page.image = jumplink.settings.media_path+page.image;
    });
        
    controller.book = data.book;
    
    controller.platform = data.platform;
    
    controller.open = false;
    controller.zoom = 1;
    controller.currentPageIndex = 1;
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
        var result = jumplink.utilities.getElementPosition($thumbnail);
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
        .css('transform', 'translate3d('+(preview.x - (flipbookDim.w / 2))+'px, '+ (preview['fixed-y'] - ((flipbookDim.h  - preview.h) / 2))+'px, 0px) scale3d('+(scaleX * 2)+', '+(scaleY)+', 1)' );
        
        setTimeout(function() {
            $zoom.addClass('animate');
        }, 0);
    };
    
    var scaleFlipbookBackToPreview = function (flipbookDim) {
        var $flipbookWrapper = $el.find('.flipbook-zoom-wrapper');
        var $flipbook = $flipbookWrapper.find('.flipbook');
        var preview = getPreviewPosition();
        preview.w = Math.round(preview.w);
        preview.h = Math.round(preview.h);       
        
        var scaleX = preview.w / flipbookDim.w;
        var scaleY = preview.h / flipbookDim.h;
        
        return new Promise(function(resolve, reject) {
            zoomOut($flipbook, $flipbookWrapper);
            if(controller.currentPageIndex > 1) {
                $flipbook.turn('page', 1);
                setTimeout(function() {
                    $flipbookWrapper
                    .css('transform', 'translate3d('+(preview.x - (flipbookDim.w / 2))+'px, '+ (preview['fixed-y'] - ((flipbookDim.h  - preview.h) / 2))+'px, 0px) scale3d('+(scaleX * 2)+', '+(scaleY)+', 1)' )
                    .css('padding', 0);
                    
                    closeFlipbook(flipbookDim);
                    resolve();
                }, 1000);
            } else {
                $flipbookWrapper
                .css('transform', 'translate3d('+(preview.x - (flipbookDim.w / 2))+'px, '+ (preview['fixed-y'] - ((flipbookDim.h  - preview.h) / 2))+'px, 0px) scale3d('+(scaleX * 2)+', '+(scaleY)+', 1)' )
                .css('padding', 0);
                closeFlipbook(flipbookDim);
                resolve();
            }
        });
    };
    
    /**
     * Starts the zoome in animation and opens the first page if there are more then 2 pages
     */
    var scaleFlipbookToOriginal = function (flipbookDim) {
        var $flipbookWrapper = $el.find('.flipbook-zoom-wrapper');
        var $flipbook = $flipbookWrapper.find('.flipbook');
        var $zoom = $el.find('.flipbook-zoom-wrapper');
        
        setTimeout(function() {
            if(data.book.pages.length > 2) {
                $flipbook.turn('page', 2);
            }
        }, 0);
             
             
        setTimeout(function() {
            $zoom
            .css('transform', 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1)' );

            $flipbookWrapper
            .css('padding-top', flipbookDim.y +'px')
            .css('padding-bottom', flipbookDim.y +'px')
            .css('padding-left', flipbookDim.x +'px')
            .css('padding-right', flipbookDim.x +'px');
            // .css('transform', 'translate3d('+ (flipbookDim.x) +'px, '+ (flipbookDim.y) +'px, 0px) scale3d(1, 1, 1)' );
        }, 0);
    };
    
    var getFlipbookDim = function() {
        var viewportDim = jumplink.utilities.getViewportDimensions();
        
        var offsetX = 5; // 5
        var offseetY = 5; // 50
        
        /* Generate the demensions of the flipbook with border
         * - controller.book.w * 2 because we have to pages
         * - w and h -100 for 50px spacing on all sites
         */
        var flipbookDim = jumplink.utilities.calculateAspectRatioFit(controller.book.w * 2, controller.book.h, viewportDim.w - (offsetX * 2), viewportDim.h - (offseetY * 2) );
        
        flipbookDim.w = Math.round(flipbookDim.w);
        flipbookDim.h = Math.round(flipbookDim.h);
        
        flipbookDim.x = Math.round((viewportDim.w - flipbookDim.w) / 2);
        flipbookDim.y = Math.round((viewportDim.h - flipbookDim.h) / 2);
        
        flipbookDim.vw = Math.round(viewportDim.w);
        flipbookDim.vh = Math.round(viewportDim.h);
        
        flipbookDim.offsetX = offsetX;
        flipbookDim.offseetY = offseetY;
        
        controller.debug('viewportDim', viewportDim, 'flipbookDim', flipbookDim);
        
        return flipbookDim;
    };
    

    
    controller.openBook = function() {
        
        var flipbookDim = getFlipbookDim();

        scaleFlipbookToPreview(flipbookDim);

        scaleFlipbookToOriginal(flipbookDim);
        
        blur();
        
        $( window ).resize(function() {
            var $flipbook = $el.find('.flipbook-zoom-wrapper .flipbook');
            var $flipbookWrapper = $el.find('.flipbook-zoom-wrapper');
            flipbookDim = getFlipbookDim();
            $flipbook.turn('size', flipbookDim.w, flipbookDim.h);
            $flipbookWrapper
            .css('padding-top', flipbookDim.y +'px')
            .css('padding-bottom', flipbookDim.y +'px')
            .css('padding-left', flipbookDim.x +'px')
            .css('padding-right', flipbookDim.x +'px');
        });
    };
    
    controller.closeBook = function(event) {
        controller.debug('closeBook');
        var flipbookDim = getFlipbookDim();
        
        scaleFlipbookBackToPreview(flipbookDim)
        .then(function() {
            unblur();
        });
        
        if(event) {
            event.stopPropagation();
        }
    };
    
    controller.prevPage = function(event) {
        controller.debug('nextPage');
        var $flipbook = $el.find('.flipbook-zoom-wrapper .flipbook');
        $flipbook.turn('previous');   
        event.stopPropagation();
    };
    
    controller.nextPage = function(event) {
        controller.debug('prevPage');
        var $flipbook = $el.find('.flipbook-zoom-wrapper .flipbook');
        $flipbook.turn('next');        
        event.stopPropagation();
    };
    
    var blur = function() {
        var animationOptions = {
          duration: 500,
          easing: 'linear' // here you can use also custom jQuery easing functions
        };
     
        vagues.forEach(function(vague, index) {
            vague.animate(10, animationOptions);
        });
        
        // resolve after animation is done
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve();
            }, animationOptions.duration);
        });
    };
    
    var unblur = function() {
        var animationOptions = {
          duration: 500,
          easing: 'linear' // here you can use also custom jQuery easing functions
        };
     
        vagues.forEach(function(vague, index) {
            vague.animate(0, animationOptions);
        });
        
        // resolve after animation is done
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve();
            }, animationOptions.duration);
        });
    };

    
    var initFlipbook = function(flipbookDim) {
        var $flipbook = $el.find('.flipbook-zoom-wrapper .flipbook');
        var options = {
    		width: flipbookDim.w,
    		height: flipbookDim.h,
    		autoCenter: false,
    		duration: 1000,
    	};

        if($flipbook.find('.page-wrapper').length !== 0) {
            controller.debug('turn already initialized');
        } else {
        	$flipbook.turn(options);
        	
            $flipbook.unbind('turning').bind('turning', function(event, newPageIndex, view) {
                controller.debug('turning', newPageIndex);
                controller.currentPageIndex = newPageIndex;
            });
        }
        
        initControls(flipbookDim);
    	
    	controller.open = true;
    	
    	// resolve after animation is done
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve();
            }, options.duration);
        });
    };
    
    var closeFlipbook = function(flipbookDim) {
        var $flipbook = $el.find('.flipbook-zoom-wrapper .flipbook');
        var $zoom = $el.find('.flipbook-zoom-wrapper');
                        
        setTimeout(function() {
            // $flipbook.turn('destroy');
            setTimeout(function() {
                $zoom.removeClass('animate');
            }, 0);
            
            $zoom
            .css('visibility', 'hidden')
            .css('transform', 'scale3d(0, 0, 0)' );
            
            controller.open = false;
            
        }, 1000);
    };
    
    var initControls = function(flipbookDim) {
        var $close = $el.find('.close-book');
        var $prev = $el.find('.prev-page');
        var $next = $el.find('.next-page');
        
        var offsetX = flipbookDim.offsetX + 50;
        
        var x = flipbookDim.x - offsetX;
        x = x >= 0 ? x : 0;
        
        // $close.css('right', (x) + 'px');
        
        // $prev.css('left', (x) + 'px');
        
        // $next.css('right', (x) + 'px');
    };
    
    var initBlur = function() {
        
        var $blurElements = $(
            '#speisenimmahlzeitammeer > div > div.container, '
            +'#speisenimmahlzeitammeer > div > div.container-fluid, '
            +'.jumplink-footer, #main-navbar, '
            +'#speisenimmahlzeitammeer > div > flipbooks > div > div:nth-child(1) > div > rv-img, '
            +'.flipbook-preview'
        );
        
        var vagueOptions = {
        	intensity:      0,      // Blur Intensity
        	forceSVGUrl:    false,   // Force absolute path to the SVG filter,
        };
        
        controller.debug('$blurElements', $blurElements);
        
        vagues = [];
        $blurElements.each(function() {
            var $this = $(this);
            var vague = $this.Vague(vagueOptions);
            
            controller.debug('Vague', $this);
            vague.blur();
            vagues.push(vague);
        });
    };
    
    var zoomIn = function(event, $flipbook, $flipbookWrapper) {
        
        var zoomFactor = 2;
        
        var mousePos = jumplink.utilities.mousePositionElementInPercent(event, $flipbook.get(0));
        
        var scrollLeft = mousePos.w * zoomFactor * mousePos.left;
        var scrollTop = mousePos.h * zoomFactor * mousePos.top;
        
        if(scrollLeft > mousePos.w) {
            scrollLeft += (mousePos.w / 2);
        }
        
        if(scrollLeft > mousePos.w) {
            scrollLeft += (mousePos.w / 2);
        } else {
            scrollLeft -= (mousePos.w / 2);
        }
        
        if(scrollTop > mousePos.h) {
            scrollTop += (mousePos.h / 2);
        } else {
            scrollTop -= (mousePos.h / 2);
        }
        
        controller.debug('zoomIn', 'event', event, 'mousePos', mousePos, 'scrollLeft', scrollLeft, 'scrollTop', scrollTop);
        
        if(controller.zoom === 1) {
    		$flipbook.turn('zoom', zoomFactor, 500);
    		$flipbook.turn('disable', true);
    		$flipbookWrapper.addClass('dragscroll');
    		
    		$flipbookWrapper.scrollLeft(scrollLeft);
    		$flipbookWrapper.scrollTop(scrollTop);
    		
    		// $flipbook.addClass('cursor-zoom-in').removeClass('cursor-zoom-out');
    		setTimeout(dragscroll.reset, 0);
    		controller.zoom = zoomFactor;
        }
    }
    
    var zoomOut = function($flipbook, $flipbookWrapper) {
        if(controller.zoom !== 1) {
    	    $flipbookWrapper.removeClass('dragscroll');
    	    $// flipbook.addClass('cursor-zoom-in').removeClass('cursor-zoom-out');
    	    setTimeout(dragscroll.reset, 0);
    		$flipbook.turn('zoom', 1, 500);
    		$flipbook.turn('disable', false);
    		controller.zoom = 1;
        }
    }
    
    controller.showPrevPageAction = function (currentPageIndex, zoom, open) {
        if(currentPageIndex > 1 && zoom === 1 && open) {
            return true;
        }
    }
    
    controller.showNextPageAction = function (pages, currentPageIndex, zoom, open) {
        if(currentPageIndex < pages.length && zoom === 1 && open) {
            return true;
        }
    }
    
    controller.showCloseAction = function (zoom, open) {
        if(zoom === 1 && open) {
            return true;
        }
    }
    
    controller.zoomTo = function(event) {
        var $flipbookWrapper = $el.find('.flipbook-zoom-wrapper');
        var $flipbook = $flipbookWrapper.find('.flipbook');
        controller.zoom = $flipbook.turn('zoom');
		if (controller.zoom === 1) {
			zoomIn(event, $flipbook, $flipbookWrapper);
		} else {
		    zoomOut($flipbook, $flipbookWrapper);
		}
		return event.stopPropagation();
    };
    
    
    var ready = function() {
        jumplink.dependencies['turn.js']()
        .then(function() {
            return jumplink.dependencies['vague.js']();
        })
        .then(function() {
            return jumplink.dependencies.dragscroll()
        })
        .then(function() {
            return jumplink.dependencies['jquery-touch-events']();
        })
        .then(function() {
            initBlur();
        });
    };
    
    setTimeout(function() {
        ready();
    }, 0);
    
    

            
    return controller;
  }
};