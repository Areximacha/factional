// Set up the router here
App.Router = Backbone.Router.extend({
	// Set the app routes
	routes: {
		'': 'index',
		'home': 'home',
		'register': 'register',
		'introduction': 'introduction',
		'login': 'login',
		'resetpassword': 'resetPassword',
		'edit': 'editDetails',
		'profile/:id': 'profile',
		'logout': 'logOut',
		'*other': 'fourohfour'
	},

	index: function() {

		if (!checkUser()) {

			$.getScript('assets/js/views/Welcome.js', function(view){

				var view = new App.Views.Welcome;

			});

		} else {

			Backbone.history.navigate('home', true);

		}

	},

	home: function() {

		if (checkUser()) {

			navView();

			$.getScript('assets/js/views/Home.js', function(view){

				var view = new App.Views.Home;

			});

		} else {

			Backbone.history.navigate('', true);

		}

	},

	register: function() {

		if (!checkUser()) {

			$.getScript('assets/js/views/Register.js', function(view){

				var view = new App.Views.Register;

			});

		} else {

			Backbone.history.navigate('home', true);
			
		}

	},

	introduction: function() {

		if (checkUser()) {

			if(App.Rendered.Navigation){

				App.Rendered.Navigation.destroy();

			};

			$.getScript('assets/js/views/Introduction.js', function(view){

				var view = new App.Views.Introduction;

			});

		} else {

			Backbone.history.navigate('', true);
			
		}

	},

	login: function() {

		if (!checkUser()) {

			$.getScript('assets/js/views/Login.js', function(view){

				var view = new App.Views.Login;

			});

		} else {

			Backbone.history.navigate('home', true);

		}
	},

	resetPassword: function() {

		if (!checkUser()) {

			$.getScript('assets/js/views/ResetPassword.js', function(view){

				var view = new App.Views.ResetPassword;

			});

		} else {

			Backbone.history.navigate('home', true);

		}
	},

	editDetails: function() {

		if (checkUser()) {

			navView();

			$.getScript('assets/js/views/EditDetails.js', function(view){

				var view = new App.Views.EditDetails;

			});

		} else {

			Backbone.history.navigate('', true);

		}
	},

	profile: function(profileId) {

		if (checkUser()) {

			navView();

			$.getScript('assets/js/views/Profile.js', function(view){

				var view = new App.Views.Profile(profileId);

			});

		} else {

			Backbone.history.navigate('', true);

		}
	},

	logOut : function(){

		try {

			App.Rendered.Navigation.destroy();
			Parse.User.logOut();

		} catch(error){
			console.log(error);
		}


		Backbone.history.navigate('', true);

	},

	fourohfour: function() {
		//trgger 404 event
	}
	
});

var checkUser = function() {

	return Parse.User.current();
}

var navView = function(){

	if(App.Rendered.Navigation){

		return false;

	};

	$.getScript('assets/js/views/Navigation.js', function(view){

		App.Rendered.Navigation = new App.Views.Navigation;

	});

};

new App.Router;

Backbone.history.start();