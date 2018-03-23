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
    var observer;
    var $imagesWrapper = $el.find('.images-row');

    controller.handle = data.data.handle;
    controller.imagesPath = data.imagesPath;
    controller.headerTitle = data.data.title;
    controller.headerText = data.data.description;
    controller.container = '';
    controller.images = [];
    
    if(jumplink.utilities.isString(data.containerClass)) {
        controller.container = data.containerClass;
    } else {
        controller.container = 'container';
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
        controller.debug('openPhotoSwipe', [$imagesWrapper, index, controller.images]);
        $.event.trigger('rivets:photoswipe:open', [$imagesWrapper, index, controller.images]);
    };
    
    // triggers when user clicks on thumbnail
    controller.onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var $target = $(e.target || e.srcElement).parent().parent(); // parent to get the rivets rv-img component root element
        var data = $target.data();

        controller.debug('[onThumbnailsClick] $target', $target, $target, data);

        if(data.index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe(data.index);
        }
        return false;
    };
    
    controller.ready = true;
        
    controller.images = themeSettingImagesToArray(data.data.images);
    controller.debug('images', controller.images);
    
    var ready = function(mutationsList) {
        // $imagesWrapper.masonry({
        //   itemSelector: '.image-col',
        // });
        observer.disconnect();
    };
    
    observer = new MutationObserver(ready);
    observer.observe(el, {
      attributes: true,
      childList: true
    });

    return controller;
  }
};
