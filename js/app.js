(function() {
    console.log('Firing up.');

    $('#home-nav li a').click(function() {
        screen().switch($(this).attr('id'));
        $('#button-left').show();
        $('#button-right').show();
    });

    $('[role=toolbar] ul li').click(function() {
        screen().switch($('i', this).attr('id'));
        $('#button-left').css('display', 'none');
        $('#button-right').css('display', 'none');
    });
}())
