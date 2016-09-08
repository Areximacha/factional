// Profile model
App.Models.Profile = Backbone.Model.extend({

	defaults: {
		id: '',
		username: '',
		name: '',
		title: '',
		department: '',
		office: '',
		createdAt: '',
		photo: ''
	}

});