(function() {
    console.log('Firing up.');

    $('[role=toolbar] ul li').click(function() {
        screen().switch($('i', this).attr('id'));
    });
}())
