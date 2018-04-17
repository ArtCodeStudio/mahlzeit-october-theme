/**
 * firebase-calendar-form
 */
rivets.components['firebase-calendar-form'] = {

  template: function() {
    // return $('template#firebase-calendar-form').html();
    return jumplink.templates['firebase-calendar-form'];
  },

  initialize: function(el, data) {
    var controller = this;
    controller.debug = debug('rivets:firebase-calendar-form');
    controller.debug('initialize', el, data);
    
    var $el = $(el);
    
    // if id is set the event will be updated otherwise it will be created
    controller.id = data.id;
    
    controller.titleEdit = 'Kalender bearbeiten';
    controller.titleCreate = 'Kalender anlegen';
    
    // to store uploaded Images in event
    controller.uploadedImages = [];
    
    // start values of a event to have it not undefined, will be replaced in next steps
    controller.calendar = {
        active: true,
        name: '',
        title: '',
        subtitle: '',
        description: '',
        note: '',
        type: '',
        images: [],
    };
    
    // TODO save types in own db
    controller.types = [
        {id:1, label: 'Veranstaltungen', value: 'events'},
        {id:2, label: 'Zimmerreservierungen', value: 'room-reservations'},
        
    ];
    
    /**
     *  Get event by id and set it to the forms
     */
    var getCalendar = function (id) {
        controller.debug('controller', id);
        
        return jumplink.events.getCalendarById(id)
        .then(function(calendar) {                   
            controller.debug('getCalendar', calendar);
            
            calendar.active = !!calendar.active;
            
            controller.calendar = calendar;
            
            controller.debug('getCalendar done', controller.calendar);
            
            return controller.calendar;
        })
        .catch(function(error) {  
            var title = 'Kalender konnte nicht geladen werden';
            alertify.alert(title, error.message);
            console.error(title, error);
        });
    };
    
    controller.updateCalendar = function() {        
        return jumplink.events.updateCalendar(controller.id, controller.calendar, controller.uploadedImages)
        .then(function() {
            controller.uploadedImages = [];
            var message = 'Kalender erfolgreich aktualisiert';
            var notification = alertify.notify(message, 'success' ,5, function(){
                // console.log('dismissed');
            });
            
            controller.debug(message);
            return getCalendar(controller.id);
        })
        .catch(function(error) {
            console.error('error', error);
            var title = 'Kalender konnte nicht aktualisiert werden';
            alertify.alert(title, error.message);
            console.error(error);
        });
    };
      
    controller.createCalendar = function() {
        jumplink.events.addCalendar(controller.calendar, controller.uploadedImages)
        .then(function(result) {
            // remove uploadedImages images
            controller.uploadedImages = [];
            
            controller.id = result.id;
            var message = 'Kalender mit der ID ' + controller.id + ' erfolgreich eingetragen';
            controller.debug(message, result);            
            var notification = alertify.notify(message, 'success', 5);
            
            return getCalendar(controller.id);
        })
        .catch(function(error) {
            console.error('error', error);
            var title = 'Kalender konnte nicht angelegt werden';
            alertify.alert(title, error.message);
        });
    };
    
    
    var ready = function() {
        /**
         *  Set default values or get event by id
         */
        if(controller.id) {
            getCalendar(controller.id);
        } else {
            controller.event = jumplink.events.getDefaultCalendarValues(controller.types);
        }
    };
    
    setTimeout(ready, 0);

    return controller;
  }
};
