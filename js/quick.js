$(function() {
    var $quick = $('.quick');

    $('#open-note', $quick).click(function() {
        screen().switch('notes', function() {
            $('#editor').text($('form [name=note]', $quick).val());
            get_tags();
        });
    });

    $('#photoBtn', $quick).click(function() {
        Capture.takePhoto();
    });

    $('#audioBtn', $quick).click(function() {
        Capture.recordAudio();
    });

    $('#videoBtn', $quick).click(function() {
        Capture.recordVideo();
    });

    $('#save', $quick).click(function() {
        $('#editor').text($('form [name=note]', $quick).val());
        save_note(function() {
            get_list();
            $('form', $quick)[0].reset();
        });
    });
});
