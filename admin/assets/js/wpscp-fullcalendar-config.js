document.addEventListener('DOMContentLoaded', function() {
  var Calendar = FullCalendar.Calendar;
  var Draggable = FullCalendarInteraction.Draggable;
  var containerEl = document.getElementById('external-events');
  var calendarEl = document.getElementById('calendar');
  //center any element in jquery center function
    jQuery.fn.center = function(parent) {
        if (parent) {
            parent = this.parent();
        } else {
            parent = window;
        }
        this.css({
            "position": "absolute",
            "top": (((jQuery(parent).height() - this.outerHeight()) / 2) + jQuery(parent).scrollTop() + "px"),
            "left": (((jQuery(parent).width() - this.outerWidth()) / 2) + jQuery(parent).scrollLeft() + "px")
        });
        return this;
    }

    /**
     * initialize the external events
     */
    new Draggable(containerEl, {
        itemSelector: '.fc-event',
        eventData: function(eventEl) {
        return {
            title: eventEl.innerHTML
        };
        }
    });

    /**
     * initialize the main calendar
     */
    var calendar = new Calendar(calendarEl, {
        plugins: [ 'interaction', 'dayGrid', 'timeGrid' ],
        header: {
        left: 'prev,next today',
        center: 'title',
        // right: 'dayGridMonth'
        },
        editable: true,
        droppable: true, // this allows things to be dropped onto the calendar
        textEscape: true,
        dragRevertDuration: 0,
        eventLimit: true, // for all non-TimeGrid views
        views: {
            dayGrid: {
                eventLimit: 2
            }
        },
        drop: function(info) {
            // old event remove after drop
        info.draggedEl.parentNode.removeChild(info.draggedEl);
        // send ajax request
        var eventDate = new Date(info.date);
            jQuery('*[data-date="'+wpscpFormatDate(eventDate)+'"]').children('.spinner').css('visibility', 'visible');
            wpscp_calender_ajax_request({
                id: jQuery(info.draggedEl).find('.wpscp-event-post').data('postid'),
                type: 'drop',
                date: info.date
            });
        },
        eventRender: function( info ) {
            info.el.firstChild.innerHTML = info.event._def.title;
        },
        eventDragStart: function(){
            containerEl.classList.add('highlight');
        },
        eventDragStop: function( info ) {
            if(isEventOverDiv(info.jsEvent.clientX, info.jsEvent.clientY)) {
                info.event.remove();
                var el = jQuery( "<div class='fc-event'>" ).appendTo( '#external-events-listing' ).html( '<div id="draft_loading">Loading....</div>' );
                el.draggable({
                zIndex: 999,
                revert: true, 
                revertDuration: 0,
                });
                el.data('event', { title: info.event.title, id: info.event.id, stick: true });
                // send ajax request
                jQuery('#external-events-listing .spinner').css('visibility', 'visible');
                wpscp_calender_ajax_request({
                    id: jQuery(info.el).find('.wpscp-event-post').data('postid'),
                    type: 'draftDrop',
                });
            }

        },
        eventDrop: function( info ){
            var eventDate = new Date(info.event.start);
            jQuery('*[data-date="'+wpscpFormatDate(eventDate)+'"]').children('.spinner').css('visibility', 'visible');
            // send ajax request
            jQuery(info.el).prev('.spinner').css('visibility', 'visible');
            wpscp_calender_ajax_request({
                id: jQuery(info.el).find('.wpscp-event-post').data('postid'),
                post_status : 'Scheduled',
                type: 'eventDrop',
                date: info.event.start,
            });
        }
    });
    calendar.render();
    // end main calendar functionality

    /**
     * Necessary Functions for Calendar and ajax call
     */

  
    /*
    * add Future Post Event Via ajax Call
    */
    function wpscpAllEvents(){
        jQuery.ajax({
            url: wpscpGetHomeUrl() + '/wp-json/wpscp/v1/post/future',
        }).done(function( data ) {
            data.posts.forEach(function(item, index){
                calendar.addEvent({
                  title: wpscpEventTemplateStructure(item),
                  start: item.post_date,
                  allDay: true
                });
            });

        });
    }
    wpscpAllEvents();

    /*
    * Check Dragable Event is out of calendar div
    */
    var isEventOverDiv = function(x, y) {
        var external_events = jQuery( '#external-events' );
        var offset = external_events.offset();
        offset.right = external_events.width() + offset.left;
        offset.bottom = external_events.height() + offset.top;

        // Compare
        if (x >= offset.left
            && y >= offset.top
            && x <= offset.right
            && y <= offset .bottom) { return true; }
        return false;
    }

   
    /**
     * Calendar Event markup
     * @param {*} obj 
     */
    function wpscpEventTemplateStructure(obj){
            var markup = '';
            markup +='<div class="wpscp-event-post" data-postid="'+obj.ID+'">';
            markup +='<div class="postlink "><span><span class="posttime">['+wpscpFormatAMPM(new Date(obj.post_modified))+']</span> '+obj.post_title+' ['+obj.post_status+']</span></div>';
            var link = '';
            link += '<div class="edit"><a href="'+wpscpGetHomeUrl()+'/wp-admin/post.php?post='+obj.ID+'&action=edit"><i class="dashicons dashicons-edit"></i>Edit</a><a class="wpscpquickedit" href="#" data-type="quickedit"><i class="dashicons dashicons-welcome-write-blog"></i>Quick Edit</a></div>';
            link += '<div class="deleteview"><a class="wpscpEventDelete" href="#"><i class="dashicons dashicons-trash"></i> Delete</a><a href="'+obj.guid+'"><i class="dashicons dashicons-admin-links"></i> View</a></div>';
            markup += '<div class="postactions"><div>'+link+'</div></div>';
            markup +='</div>';
        return markup;
    }

    /**
     * Main function for calendar ajax request
     * @param {*} obj 
     */
    function wpscp_calender_ajax_request(obj){
        var data = {
            'action': 'wpscp_calender_ajax_request',
            'nonce': wpscp_calendar_ajax_object.nonce,
            'post_status': obj.post_status,
            'type': obj.type,
            'date': obj.date,
            'time': obj.time,
            'id': obj.id,
            'postTitle': obj.postTitle,
            'postContent': obj.postContent,
        };

        // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
        jQuery.post(wpscp_calendar_ajax_object.ajax_url, data, function(response, status) {
           if(status == 'success'){
                var jsonData = ((response !== null && response !== '') ? JSON.parse(response) : []);
                if(obj.type == 'addEvent' && obj.post_status == 'Scheduled'){
                    var notifi_type = 'newpost';
                    // if find post id then it will be post update action
                    if(obj.id !== ''){
                        notifi_type = 'updatepost';
                         // remove event
                        var allevents = calendar.getEvents();
                        allevents.forEach(function(el){
                            var eventTitle = el.title;
                            if(jQuery(eventTitle).data('postid') == obj.id){
                                el.remove();
                            }
                        });
                    }
                    // add event
                    calendar.addEvent({
                        title: wpscpEventTemplateStructure(jsonData[0]),
                        start: jsonData[0].post_date,
                        allDay: true
                    });

                    // send notification
                    wpscp_calendar_notifi({
                        type: notifi_type,
                        post_status: obj.post_status,
                        post_date: jsonData[0].post_date
                    });
                }else if(obj.type == 'drop'){
                     // send notification
                     wpscp_calendar_notifi({
                        type: 'draft_to_future',
                        post_status: 'future',
                        post_date: obj.date
                    });
                }else if(obj.type == 'eventDrop'){
                     // send notification
                     wpscp_calendar_notifi({
                        type: 'future_post_update',
                        post_status: 'future',
                        post_date: obj.date
                    });
                }else if(obj.type == 'draftDrop'){
                    jQuery('#draft_loading').parent().remove();
                    jQuery( "<div class='fc-event'>" ).appendTo( '#external-events-listing' ).html( wpscpEventTemplateStructure(jsonData[0]) );
                    // send notification
                    wpscp_calendar_notifi({
                        type: 'future_to_draft',
                        post_status: 'draft',
                    });
                }else if(obj.post_status == 'Draft') {
                    jQuery( "<div class='fc-event'>" ).appendTo( '#external-events-listing' ).html( wpscpEventTemplateStructure(jsonData[0]) );
                    // send notification
                    wpscp_calendar_notifi({
                        type: (obj.id !== '' ? 'draft_post_update' : 'draft_new_post'),
                        post_status: 'draft',
                    });
                }
                // hide all spinner after complete ajax request
                jQuery('.spinner').css('visibility', 'hidden');
                containerEl.classList.remove('highlight');
           }
        }); 
    }


    /**
    * Add New Post Button Button
    */ 
    jQuery('.fc-button').on('click', function(e) {
        e.preventDefault();
        //calling 'new post' btn in calendqr item
        wpscpNewPostBtn();
    })
    //calling 'new post' btn in calendqr item
    wpscpNewPostBtn();
    //add 'new post' btn in calendqr item
    function wpscpNewPostBtn() {
        var items = document.querySelectorAll('.fc-day-grid td.fc-day-top');
        if(items) {
            items.forEach( function(item) {
                // spainner generate
                var spinner = document.createElement('span');
                spinner.classList.add('spinner');
                // anchor link generate
                var newPostBtn = document.createElement('a');
                newPostBtn.classList.add('daynewlink');
                newPostBtn.setAttribute('href', "#wpscp_quickedit");
                newPostBtn.setAttribute('rel', "modal:open");
                newPostBtn.textContent = 'New Post';

                var anchor = item.querySelector(".daynewlink")
                var hasBtnClass = item.contains(anchor);
                
                if(hasBtnClass == false) {
                    item.append(spinner);
                    item.append(newPostBtn);
                }
            } )
        }
       
    }

    // necessary selector for calendar
    var dayNewLink = jQuery('.daynewlink');
    var modalClose = jQuery('*[rel="modal:close"]');
    var modalCloseClass = jQuery('.close-modal');
    var modalDate = jQuery('#date');
    var postID = jQuery('#postID');
    var modalTitle = jQuery('#title');
    var modalContent = jQuery('#content');
    var modalTime = jQuery('#wpsp_time');
    var modalStatus = jQuery('#wpsp-status');
    var modalSubmit = jQuery('#wpcNewPostScheduleButton');
    var quickEdit = jQuery('#wpsp_quickedit');

    // wpscp_calendar_modal
    wpscp_calendar_modal();
    // modal submit
    wpscp_calendar_modal_submit();

    /**
     * After Modal hide this function will be fire
     */
    function wpscp_calendar_modal_hide(){
        modalTitle.val('');
        modalContent.val('');
        modalTime.val('');
        modalStatus.val('');
        modalDate.val('');
        postID.val('');
        jQuery.modal.close();
        jQuery('.spinner').css('visibility', 'hidden');
    }
    /**
     * Showing Calendar Event Modal
     */
    function wpscp_calendar_modal(){
        dayNewLink.on('click', function(e) {
            e.preventDefault();
            if(jQuery(this).data('type') != 'Draft'){
                jQuery('select#wpsp-status').val('Scheduled');
                jQuery('#timeEditControls').show();
            }
            jQuery(this).prev('.spinner').css('visibility', 'visible');
            modalDate.val(jQuery(this).parent('.fc-day-top').data('date'));
        });
        modalClose.add(modalCloseClass).on('click', function(e){
            //hide modal
            wpscp_calendar_modal_hide();
        });
    }
    /**
     * Calendar Modal Popup Submit
     */
    function wpscp_calendar_modal_submit(){
        // quick post submit button
        modalSubmit.on('click', function(e){
            e.preventDefault();
            var dateTime = modalTime.val();
            var dateStr = new Date(modalDate.val() + ' ' + dateTime); 
            jQuery('*[data-date="'+modalDate.val()+'"]').children('.spinner').css('visibility', 'visible');
            // send ajax request
            wpscp_calender_ajax_request({
                'type': 'addEvent',
                'date': dateStr,
                'time': dateTime,
                'post_status' : modalStatus.val(),
                'id': postID.val(),
                'postTitle': modalTitle.val(),
                'postContent': modalContent.val(),
            });

            // hide modal
            wpscp_calendar_modal_hide();
        });
    }

    /**
     * Date Format Change
     * @param {date string} date 
     */
    function wpscpFormatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
    /**
     * Date Format AmPm
     * @param {date string} date 
     */
    function wpscpFormatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }
    /**
     * Get WP Host URL for hit restapi endpoint
     */
    function wpscpGetHomeUrl() {
        var href = window.location.href;
        var index = href.indexOf('/wp-admin');
        var homeUrl = href.substring(0, index);
        return homeUrl;
    }


    /**
     * Ajax Request For Update Post
     */
   jQuery(document).on('click', 'a.wpscpquickedit', function(e){
        e.preventDefault();
        var editPostId = jQuery(this).closest("[data-postid], .wpscp-event-post").data("postid");
        var data = {
            'action': 'wpscp_quick_edit',
            'id': editPostId
        };

        // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
        jQuery.post(wpscp_calendar_ajax_object.ajax_url, data, function(response, status) {
            if(status == 'success'){
                var jsonData = (response != "" ? JSON.parse(response) : []);

                var PostDate = jsonData[0].post_date;
                var PostDateArray = PostDate.split(" ");

                modalTitle.val(jsonData[0].post_title);
                modalContent.val(jsonData[0].post_content);
                modalDate.val(PostDateArray[0]);
                postID.val(jsonData[0].ID);
                modalTime.val(wpscpFormatAMPM(new Date(jsonData[0].post_date)));
                modalStatus.val((jsonData[0].post_status == 'future' ? 'Scheduled' : 'Draft'));
                jQuery('#wpscp_quickedit').modal('show');
            }
        });
    });


   /**
    * Ajax Request For Delete Post
    */
   jQuery(document).on('click', 'a.wpscpEventDelete', function(e){
        e.preventDefault();
        var deletePostId = jQuery(this).closest("[data-postid], .wpscp-event-post").data("postid");
        var result = confirm("(Delete)- Are you sure you want to delete this post?");
        if(result){
            var data = {
                'action': 'wpscp_delete_event',
                'id': deletePostId
            };

            // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
            jQuery.post(wpscp_calendar_ajax_object.ajax_url, data, function(response, status) {
                if(status == 'success'){
                    jQuery('*[data-postid="'+response+'"]').closest('.fc-event').remove();
                    // send notification
                    wpscp_calendar_notifi({
                        type: 'post_delete',
                    });
                }
            });
        } // result
   });
});