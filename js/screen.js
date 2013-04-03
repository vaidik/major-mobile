function screen() {
    var screen = {};
    
    screen.switch = function(className) {
        console.log(className);
        $('[role=screen]').addClass('hide');
        $('.' + className).removeClass('hide');

        return screen;
    }

    return screen;
}
