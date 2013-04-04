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

    navigation.switch = function(id) {
        var $li = $('[role=toolbar] ul.nav li');
        $li.removeClass('active');
        $('#' + id, $li).parent().addClass('active');
    }

    return navigation;
}
