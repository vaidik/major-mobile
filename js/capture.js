var Capture = function() {
    var capture = {};

    capture.takePhoto = function() {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 75,
            destinationType : Camera.DestinationType.FILE_URI,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true,
        });

        function onSuccess(imageURI) {
            // copy to app's data directory
            FS().moveFile(imageURI, "Major", new Date().getTime() + ".jpg",
                function(fileEntry) {
                    capture.add_to_attachments('image', fileEntry.fullPath);
                });
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    };

    capture.recordAudio = function() {
        navigator.device.capture.captureAudio(onSuccess, onFail, { limit: 1 });

        function onSuccess(mediaFiles) {
            var i, path, len;

            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                fileEntry = mediaFiles[i];

                // copy to app's data directory
                FS().moveFile(fileEntry.fullPath, "Major", fileEntry.name, function(fileEntry) {
                    capture.add_to_attachments('audio', fileEntry.fullPath);
                });

            }
        }

        function onFail(error) {
            navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
        };
    };

    capture.recordVideo = function() {
        var captureSuccess = function(mediaFiles) {
            var i, path, len;
            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                fileEntry = mediaFiles[i];

                // copy to app's data directory
                FS().moveFile(fileEntry.fullPath, "Major", fileEntry.name, function(fileEntry) {
                    capture.add_to_attachments('video', fileEntry.fullPath);
                });
            }
        };

        // capture error callback
        var captureError = function(error) {
            navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
        };

        // start video capture
        navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:1});
    };

    capture.add_to_attachments = function(type, source) {
        var $attachments = $('#attachments .attachments-inner');
        var $element = $('<div></div>');
        $element.addClass('item');

        if (type == 'image') {
            var $img_element = $('<img>');
            var r = new RegExp('(http|https|file):\/\/.*');
            if (r.exec(source)) {
                $img_element[0].src = source;
            } else {
                $img_element[0].src = "data:image/jpeg;base64," + source;
            }

            $element.append($img_element);
        } else if (type == 'audio') {
            $element.append('<i class="icon-music"></i>');
        } else if (type == 'video') {
            $element.append('<i class="icon-facetime-video"></i>');
        } else if (type == 'file') {
            $element.append('<i class="icon-file-alt"></i>');
        }

        $element.attr('data-uri', source);

        // TODO
        // Add data attribute for every element

        $attachments.append($element);
        var shortpress;
        if (type == 'image') {
            var ratio = $img_element.width()/$img_element.height();
            if ($img_element.width() >= $img_element.height()) { 
                $img_element.height(58);
                $img_element.width(ratio * 58);
            } else {
                $img_element.width(58);
                $img_element.height(58 / ratio);
            }

        } else {
            shortpress = capture.play;
        }

        $element.longpress(function() {
            var response = confirm('Sure you want to delete this file? This can\'t be undone.');
            if (response == true) {
                capture.remove_attachment($element);
            }
        }, shortpress);

        update_attachments_width($attachments);
    }

    // resize attachments for horizontal scrolling
    function update_attachments_width($attachments) {
        if (typeof $attachments === "undefined") {
            var $attachments = $('#attachments .attachments-inner');
        }
        $attachments.width(($('img,div', $attachments).length * 64) + 50);
    }

    capture.remove_attachment = function($element) {
        var uri = $element.attr('data-uri');

        // remove the element from DOM
        $element.remove();

        // update the attachments inner div size
        update_attachments_width();

        // remove the file from filesystem
        FS().removeFile(uri);
    }

    capture.play = function() {
        var $this = $(this);
        var uri = $this.attr('data-uri');

        window.plugins.videoPlayer.play(uri);
    }

    return capture;
}

(function() {
    var $notes = $('.notes');

    $('#photoBtn', $notes).click(function() {
        Capture.takePhoto();
    });

    $('#audioBtn', $notes).click(function() {
        Capture.recordAudio();
    });

    $('#videoBtn', $notes).click(function() {
        Capture.recordVideo();
    });
}());
