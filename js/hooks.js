var Hooks = {
    hooks: {},

    register: function(hook, callback) {
        if (typeof Hooks.hooks[hook] === "undefined") {
            Hooks.hooks[hook] = [];
        }
        
        Hooks.hooks[hook].push(callback);
    },

    call: function(hook, params) {
        var hooks = Hooks.hooks[hook];
        if (typeof hooks !== "undefined") {
            for (hook in hooks) {
                hooks[hook].apply();
            }
        }
    }
};
