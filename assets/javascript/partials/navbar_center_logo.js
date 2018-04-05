/**
 * Create Leaflet map with data attributes
 */
window.jumplink.partials.navbar_center_logo = function($partials, $partial, dataset, data) {
    var partialData = $partial.data();
    window.jumplink.debug.partials('navbar_center_logo', partialData);
    
    jumplink.dependencies.platform()
    .then(function(platform) {
        jumplink.model.platform = platform;
        
        rivets.init('top-sidebar', $('#layout-content top-sidebar'), window.jumplink.model);
    })
    .catch(function(exception) {
        window.jumplink.debug.partials('cant load platform', exception);
    });
    

 
};

