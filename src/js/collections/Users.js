// A collection of profile models
App.Collections.Users = Backbone.Collection.extend({
	model: App.Models.Profile
});

// Create our global Profiles collection
App.Collections.Profiles = new App.Collections.Users([]);