// Registration page view
App.Views.Login = Backbone.View.extend({
	el: '.content',

    events: {
        'submit': 'submit',
        'click .back': 'destroy'
    },

    initialize: function() {
    	var self = this;

		$.ajax("assets/js/templates/login.tpl").success(function(html){

			self.template = _.template(html);

			self.render();

		});
    },

    render: function() {

        this.$el.html(this.template());
        return this;
    },

    submit: function(e) {
        e.preventDefault();

        var self = this,
            username = $('#email').val().toLowerCase(),
            password = $('#password').val();

        self.$el.find('.error').removeClass('show');
        
        if (username == "" || password == "") {
            self.$el.find('.error').addClass('show');
        } else {

            Parse.User.logIn(username, password, {
                success: function(user) {
                    Backbone.history.navigate('home', true);
                },
                error: function(user, error) {
                    self.$el.find('.error').addClass('show');
                }
            });
        }
    },

    destroy: function (e) {
        e.preventDefault();
        
        Backbone.history.navigate('', true);
        this.undelegateEvents();
        this.stopListening();
        return this;
    }
});