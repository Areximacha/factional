// Welcome page view
App.Views.Welcome = Backbone.View.extend({
	el: '.content',

    initialize: function() {
    	var self = this;
        //StatusBar.show();
        //StatusBar.styleLightContent();

		$.ajax("assets/js/templates/welcome.tpl").success(function(html){

			self.template = _.template(html);

			self.render();

		});
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});