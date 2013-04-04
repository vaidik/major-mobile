function screen() {
    var screen = {};
    
    screen.switch = function(className, switchNav) {
        if (!switchNav) {
            navigation().switch(className);
        }

        $('[role=screen]').addClass('hide');
        $('.' + className).removeClass('hide');

        return screen;
    }

    return screen;
}

function navigation() {
    var navigation = {};
    var $li = $('[role=toolbar] ul.nav li');

    navigation.switch = function(id) {
        navigation.empty();
        $('#' + id, $li).parent().addClass('active');
        
        return navigation;
    }

    navigation.empty = function() {
        $li.removeClass('active');
        return navigation;
    }

    return navigation;
}
