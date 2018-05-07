window.jumplink.partials['jumplink-snippet-video'] = function($partials, $partial, dataset, data) {
    var partialData = $partial.data();
    window.jumplink.debug.partials('jumplink-snippet-video', partialData);
    var $video = $('#'+partialData.handle);
    $video.off('click').on('click', function() {
        $video.get(0).play();
    });
};