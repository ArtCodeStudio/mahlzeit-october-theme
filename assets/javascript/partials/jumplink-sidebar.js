/**
 * Init the rightsidebar using simpler-sidebar and transformicons
 * @see http://dcdeiv.github.io/simpler-sidebar/
 * @see http://www.transformicons.com/
 * TODO move to partials?
 */
window.jumplink.partials['jumplink-sidebar'] = function($partials, $partial, dataset, data) {
    var partialData = $partial.data();
    window.jumplink.debug.partials('jumplink-sidebar', partialData);
    
    // init tree before sidebar to cache tree events in sidebar to close the sidebar
    var closingLinks = '.close-sidebar';
    var align = partialData.position;
    var paddingTopByNavbar = partialData.paddingTopByNavbar;
    var trigger = '[data-toggle="sidebar"][data-target="#'+align+'-sidebar"]';
    var mask = partialData.mask;
    var $sidebar = $('#'+align+'-sidebar');
    // var $leftSidebar = $('#left-sidebar');
    // var $Sidebars = $('#right-sidebar, #left-sidebar');
    var $tcon = $('.'+align+'-sidebar-toggler.tcon');
    var defaultPaddingTop = 0;
    var $listItemsCarousel = window.jumplink.cache.$listItemsCarousel;
    var $window = $(window);
    
    var close = function () {
        $(closingLinks).trigger('click');
    };
    
    $sidebar.simplerSidebar({
        attr: "simplersidebar",
        init: "closed",
        top: 0,
        align: align, // sidebar.align
        gap: 0, // sidebar.gap
        animation: {
          duration: 500,
          easing: "swing"
        },
        selectors: {
          trigger: trigger, // opener
          quitter: closingLinks // sidebar.closingLinks
        },
        sidebar: {
          width: function() {return $(window).width() > 768 ? 500 : '40vw'},
        },
        mask: {
          display: mask,
          css: {
            backgroundColor: "black",
            opacity: 0.5,
            filter: "Alpha(opacity=50)",
            'z-index': 3003,
          }
        },
        events: {
          on: {
            animation: {
              open: function() {
                window.jumplink.debug.partials('open');
                // icon animation for open
                if($tcon.length) {
                    transformicons.transform($tcon[0]);
                }
              },
              close: function() {
                window.jumplink.debug.partials('close');
                // icon animation for close
                if($tcon.length) {
                    transformicons.revert($tcon[0]);
                }
                
                if($listItemsCarousel) {
                    setTimeout(function(){
                        $listItemsCarousel.gotoSlide(0);
                    }, 200);
                }
              },
              both: function() {
        
              },
            }
          },
          callbacks: {
            animation: {
              open: function() {
        
              },
              close: function() {
        
              },
              both: function() {
                
              },
              freezePage: true,
            }
          }
        }
    });
    
    $sidebar.off('swipe'+align).on('swipe'+align, function(e) { 
        window.jumplink.debug.partials('swipe'+align);
        close();
    });
      
    $sidebar.show();
    jumplink.utilities.triggerResize();
    
    // if slide navigation is avable
    if($listItemsCarousel) {
    
        if($listItemsCarousel.hasClass('itemsilde-initialized')) {
            // window.jumplink.debug.itemslide('[initProductCarouselWithItemSlide] already created, stop');
            $listItemsCarousel.reload();
            return;
        }
        
        window.jumplink.debug.partials('init $listItemsCarousel', $listItemsCarousel);
        
        var width = $listItemsCarousel.width();
        $listItemsCarousel.parent().css('min-width', width);
        
        $listItemsCarousel.itemslide({
            disable_slide: true,
            disable_autowidth: true,
            // left_sided: true,
            disable_scroll: true,
            one_item: true,
            parent_width: true,
            // duration: 1500
        });
        
        window.jumplink.dataApi.initItemslide('list-items-carousel', $listItemsCarousel);
    }
    
    if($sidebar) {
        if(paddingTopByNavbar) {
            $window.resize(function() {
              $sidebar.css( 'padding-top', jumplink.utilities.getNavHeight() + defaultPaddingTop +'px');
            });
            $sidebar.css( 'padding-top', jumplink.utilities.getNavHeight() + defaultPaddingTop +'px');
        } else {
            $sidebar.css( 'padding-top', defaultPaddingTop +'px');
        }
        
        if($listItemsCarousel) {
            var minWidth = $listItemsCarousel.width();
            $listItemsCarousel.parent().css('min-width', minWidth);
            $listItemsCarousel.reload();
        }
    } else {
        console.error(new Error('$sidebar is undefined'));
    }
};