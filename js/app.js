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
        });
        $('#button-left').show();
        $('#button-right').show();
    });

    /*
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
    */

    $('#button-left').click(function() {
        $('#button-left, #button-right').css('display', 'none');

        screen().switch('home');
        //History.back();
    });
}(window));

function url(uri) {
    var HOST = 'http://192.168.2.12:8000';
    //var HOST = 'http://172.16.92.178:8000';
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

function save_note(callback) {
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

    var type = 'POST';
    var submit_url = '/api/note/';
    if ($('.notes form').attr('data-mode') == 'edit') {
        $('.notes form').attr('data-mode', '');
        type = 'PUT';
        submit_url += $('.notes form').attr('data-note-id') + '/';
        form_data.id = $('.notes form').attr('data-note-id');
    }

    $.ajax({
        url: url(submit_url),
        data: JSON.stringify(form_data),
        type: type,
        headers: {
            'content-type': 'application/json',
        },
        success: function(data) {
            if (typeof callback !== "undefined") {
                callback();
            }

            reset_editor();
            $("html, body").animate({ scrollTop: 0 }, "fast");
        },
    });
};

function reset_editor() {
    $('.notes form')[0].reset();
    $('#editor').html('');
    $('#attachments .attachments-inner').html('')
                                        .css('width', '');
}

$(document).ready(function() {
    $('#editor').wysiwyg();

    $('#button-right').click(save_note);

    /*
    screen().switch('list', function() {
        $('.screen-container').css('padding', 0);
    });
    */

    $('.notes-toolbar #save').click(function() {
        save_note(function() {
            screen().switch('list');
        });
    });

    $('.notes-toolbar #cancel').click(function() {
        if (confirm('Are you sure you want to go back? All the changes will be discarded.')) {
            screen().switch('list');
        }
    });

    Hooks.call('screen_list');
});

function get_list() {
    $.ajax({
        url: url('/api/note/?sort_by=-id'),
        success: function(data) {
            $('.list ul').html('');
            for (item in data.objects) {
                var obj = data.objects[item];
                add_item(obj);
            }

            $('.list ul > li').longpress(function() {
                if (confirm("Are you sure you want to delete this note?")) {
                    $.ajax({
                        url: url('/api/note/' + $(this).attr('data-note-id') +  '/'),
                        method: 'DELETE',

                        success: function(data) {
                            get_list();
                        },
                    });
                }
            });

            $('.list ul > li').click(function() {
                var $this = $(this);
                var id = $this.attr('data-note-id');

                $.ajax({
                    url: url('/api/note/' + id + '/'),
                    success: function(data) {
                        $('.notes form').attr('data-mode', 'edit');
                        $('.notes form').attr('data-note-id', data.id);

                        screen().switch('notes', function() {
                            var $form = $('.notes form');
                            $('[name=name]', $form).val(data.name);
                            $('#editor', $form).html(data.note);

                            var tags = data.tags;
                            var select_tags = [];
                            for (tag in tags) {
                                select_tags.push({
                                    id: tags[tag].tag,
                                    text: tags[tag].tag,
                                });

                                if (tag == tags.length - 1)
                                {
                                    window.setTimeout(function() {
                                        $('[name=tags]', $form).select2("data", select_tags);
                                    }, 50);
                                }
                            }
                        });
                    }
                });
            });
        },
    });

    function add_item(obj) {
        var name = obj.name.trunc(15);
        if (obj.name == '') {
            name = obj.note.trunc(15);
        }

        var markup = '<li data-note-id="' + obj.id + '">';
        markup += '<div class="side-box thumb"><i class="icon-file-alt"></i></div>' 
        + '<div class="content">'
        + '<div class="name">' + name + '</div>'
        + '<p>' + obj.note + '</p>'
        + '</div>'
        + '<div class="side-box tags">'
        + '</div>'
        + '<div style="clear:both;"></div>'
        + '</li>';

        $('.list ul').append(markup);
    }
}

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

String.prototype.trunc = function(n){
    return this.substr(0,n-1)+(this.length>n?'&hellip;':'');
};

function screen_notes_hook() {
    $('.quick').fadeOut(200);
    $('.notes-toolbar').delay(100).fadeIn(200);
    $('[role=toolbar]').animate({
        height: '42px',
    }, 400);
}
Hooks.register('screen_notes', screen_notes_hook);

Hooks.register('screen_notes', function() {
    get_tags();
});

function screen_list_toolbar_hook() {
    $('.notes-toolbar').fadeOut(200);
    $('[role=toolbar]').animate({
        height: '80px',
    }, 400);
    $('.quick').delay(100).fadeIn(200);
}
Hooks.register('screen_list', screen_list_toolbar_hook);

Hooks.register('screen_list', function() {
    get_list();
    reset_editor();
});
