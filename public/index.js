var myScript = {
    template: '<div id="obj">{{content}}</div>',
    updated: function() {
        this.DOMModify();
    },
    mounted: function() {
        setTimeout(function(){
            this.content++; 
        }.bind(this), 1000);
    },
    data: function () {
        /* body... */
        return{
           content: 1
        };
    },

    methods: {
        DOMModify:function () {
            /* body... */
            console.log(
                document.getElementById('obj').firstChild
            );
        }
    }
};

var myApp = {
    template: '<div><my-script /></div>',
    data: function () {
        /* body... */
        return {

        };
    },
    components: {
        'my-script': myScript
    }
};


var app = new Vue({
    el: '#app',
    components: {
        'my-app': myApp
    },
    data: {
        message: 'ok'
    }
});
