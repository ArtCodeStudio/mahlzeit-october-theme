/**
 * flipbooks
 */
rivets.components.flipbooks = {
  template: function() {
    return jumplink.templates.flipbooks;
  },
  initialize: function(el, data) {
    var controller = this;
    controller.debug = debug('rivets:flipbooks');
    var $el = $(el);
    data.books = JSON.parse(data.books);
    
    controller.books = $.map(data.books, function(book, index) {
        book.handle = rivets.formatters.handleize(book.name);
        book.previewPage = book.pages[0];
        book.ratio = book.w + ':' + book.h;
        return [book];
    });

    for (var i = 0; i < controller.books.length; i++) {
        var book = controller.books[i];
        book.photoswipe = [];
        for (var k = 0; k < book.pages.length; k++) {
            var page = book.pages[k];
            var imageSrc = jumplink.settings.media_path + (page.image.replace(jumplink.settings.media_path, ''));
            book.photoswipe.push({
                src: imageSrc,
                msrc: imageSrc,
                w: book.w,
                h: book.h,
            });
        }
    }
    
    controller.debug('controller.books', controller.books);
    
    controller.background = data.background;
    controller.handle = data.handle;
    controller.debug('initialize flipbooks component', $el, data);
    
    controller.ready = false;

    controller.openPhotoswipe = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var $target = $(e.target || e.srcElement).closest('[data-index]'); // parent to get the rivets rv-img component root element
        var data = $target.data();
        var book = getBookByHandle(data.handle);
        var $imagesWrapper = $el.find('.photoswipe-wrapper-' + data.handle);

        controller.debug('[openPhotoswipe]', data, book);

        if(data.index >= 0) {
            // open PhotoSwipe if valid index found
            jumplink.utilities.openPhotoSwipe(data.handle, $imagesWrapper, data.index, book.photoswipe);
        }
        return false;
    };

    var getBookByHandle = function(handle) {
        for (var index = 0; index < controller.books.length; index++) {
            var book = controller.books[index];
            if (book.handle === handle) {
                return book;
            }
        }
        return null;
    }

    var ready = function() {
        jumplink.dependencies['turn.js']()
        .then(function() {
            return jumplink.dependencies['vague.js']();
        })
        .then(function() {
            return jumplink.dependencies.photoswipe();
        })
        .then(function() {
            controller.ready = true;
        });
    };
    
    //ready();

    // $el.one('DOMSubtreeModified', function() {
    //     setTimeout(function() {
    //         ready();
    //     }, 0);     
    // });

    var observerOptions = {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    };

    // Replace the DOMSubtreeModified event with MutationObserver
    var observer = new MutationObserver(function(mutations) {
        observer.disconnect(); // Stop observing once we've detected a change
        setTimeout(function() {
          ready();
        }, 0);
    });

    // Start observing the element for childList changes
    observer.observe(el, observerOptions);
              
            
    return controller;
  }
};
