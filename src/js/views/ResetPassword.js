// Registration page view
App.Views.ResetPassword = Backbone.View.extend({
	el: '.content',

    events: {
        'submit': 'submit',
        'click .back': 'destroy'
    },

    initialize: function() {
    	var self = this;

		$.ajax("assets/js/templates/reset-password.tpl").success(function(html){

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
            username = $('#email').val().toLowerCase();

        self.$el.find('.error').removeClass('show');

        Parse.User.requestPasswordReset(username, {
            success: function() {
                self.$el.find('.reset-confirmation').addClass('show');
            },
            error: function(error) {
                self.$el.find('.error').addClass('show');
                console.log(error);
            }
        });
    },

    destroy: function (e) {
        e.preventDefault();
        
        Backbone.history.navigate('', true);
        this.undelegateEvents();
        this.stopListening();
        return this;
    }
});