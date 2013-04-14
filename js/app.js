(function(window) {
    console.log('Firing up.');

    // Prepare
    var History = window.History; // Note: We are using a capital H instead of a lower h
    if ( !History.enabled ) {
         // History.js is disabled for this browser.
         // This is because we can optionally choose to support HTML4 browsers or not.
        return false;
    }

    // Bind to StateChange Event
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
        History.log(State.data, State.title, State.url);
    });

    $('#home-nav li a').click(function() {
        var id = $(this).attr('id');
        screen().switch($(this).attr('id'), function() {
            get_tags();
        });
        $('#button-left').show();
        $('#button-right').show();
    });

    $('[role=toolbar] ul li').click(function() {
        var id = $('i', this).attr('id');
        screen().switch(id);
        if (id == 'list') {
            $('.screen-container').css('padding', 0);
        } else {
            $('.screen-container').css('padding', '');
        }

        $('#button-left').css('display', 'none');
        $('#button-right').css('display', 'none');
    });

    $('#button-left').click(function() {
        $('#button-left, #button-right').css('display', 'none');

        screen().switch('home');
        //History.back();
    });
}(window));

function url(uri) {
    var HOST = 'http://192.168.2.12:8000';
    return HOST + uri;
}

/**
 * get latest tags from the server and update auto complete
 */
function get_tags() {
    $.ajax({
        url: url('/api/tag'),
        success: function(data) {
            var tags = [];
            for (tag in data.objects) {
                tags.push(data.objects[tag].tag);
            }

            $('#tags').select2({
                tags: tags,
                tokenSeparators: [",", " "],
            });
        },
    });
}

$(document).ready(function() {
    $('#editor').wysiwyg();

    $('#button-right').click(function() {
        var $form = $('.notes form');
        var form_data = {
            'user': 1,
            'name': $('[name=name]', $form).val(),
            'note': $('#editor').cleanHtml(),
            'tags': [],
        };

        var tags = $('[name=tags]', $form).val().split(',');
        for (tag in tags) {
            form_data.tags.push({ tag: tags[tag] });
        }

        $.ajax({
            url: url('/api/note/'),
            data: JSON.stringify(form_data),
            type: 'POST',
            headers: {
                'content-type': 'application/json',
            },
        });
    });
});

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
