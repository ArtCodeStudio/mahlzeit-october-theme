/**
 * init sections/jumplink-pages.liquid
 * * show fixed logo as svg on page
 * * hide element by scroll down of svg
 */
window.jumplink.partials['jumplink-fixed-logo'] = function($partials, $partial, dataset, data) {
    var partialData = $partial.data();
    var $hideShowElement = $('.jumplink-fixed-logo '+partialData.hideSelectorOnScroll);
    window.jumplink.debug.partials('init jumplink-fixed-logo', partialData);
    $(window).scroll(function() {
        pos = $(this).scrollTop();        
        if(pos > partialData.offsetInPx) {
            $hideShowElement.fadeOut();
            // $hideShowElement.css('pointer-events', 'none');
        } else {
            $hideShowElement.fadeIn();
            // $hideShowElement.css('pointer-events', 'auto');
        }
    });
};