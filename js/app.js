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
        screen().switch($(this).attr('id'));
        $('#button-left').show();
        $('#button-right').show();
        console.log('asd');
        History.pushState({state:1}, "Notes", "notes");
    });

    $('[role=toolbar] ul li').click(function() {
        screen().switch($('i', this).attr('id'));
        $('#button-left').css('display', 'none');
        $('#button-right').css('display', 'none');
    });
}(window));
