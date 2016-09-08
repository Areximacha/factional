// Home page view
App.Views.Home = Backbone.View.extend({
	el: '.content',

    previousFirstChar: "@",

    events: {
        "click .refresh" : "initialize",
        "click .profiles a": "openProfile"
    },

    initialize: function() {
    	var self = this;

		$.ajax("assets/js/templates/home.tpl").success(function(html){

            self.$el.empty();
            $('.loading').show();

            var isSearch = false,
                isFiltered = false;

            if(
                $("#search input[name='search']").length > 0 &&
                $("#search input[name='search']").val() !== ""
            ){

                isSearch = true;

            };

            if($(".offices li.selected").length > 0) {

                isFiltered = true;

            };
			
            var users = Parse.Object.extend("User");
            var query = new Parse.Query(users);
            query.ascending("nameLowerCase");
            query.include("photo");

            if(isSearch){
                query.startsWith("nameLowerCase", $("#search input[name='search']").val().toLowerCase());
            }

            query.limit(1000);
            query.include("department");
            query.include("office");
            query.find({
                success: function(results) {
                    
                    var profiles = [];
                    
                    _.each(results, function(user){

                        var profile = new App.Models.Profile({
                            id : user.id,
                            username : user.attributes.username,
                            name : user.attributes.nameLowerCase,
                            title : user.attributes.jobTitle,
                            department : user.attributes.department.attributes.department,
                            office : user.attributes.office.attributes.office,
                            createdAt : user.createdAt,
                            photo : user.attributes.photo.attributes.originalFile
                        });

                        profiles.push(profile);

                    });

                    App.Collections.Profiles.reset(profiles);

                    self.template = _.template(html);

                    if(isSearch){

                        self.render();

                    } else {

                        if (isFiltered) {

                            self.render($(".offices li.selected").data('value'));

                        } else {

                            Parse.User.current().get("office").fetch(function(office){

                                self.render(office.get("office"));

                                self.selectedOfficeTab($(".offices li[data-value='" + office.get("office") + "']"));

                            });
                        }

                    };


                },
                error: function(error) {
                    console.log(error);
                }
            });

		});
    },

    selectedOfficeTab : function($target){

        $(".offices li").removeClass("selected");

        $target.addClass("selected");

    },

    addNew:function(profile) {
        var self = this,
            profileName = profile.get("name"),
            currentFirstChar = profileName.slice(0,1),
            profileContainer = self.$el.find('.profiles');

        if(currentFirstChar == self.previousFirstChar) {
            profileContainer.append('<a href="#profile/' + profile.get("id") +'"><img src="' + profile.get("photo") +'" /><p>' + profile.get("name") +'</p></a>');
        } else {
            profileContainer.append('<a><h1 class="alphabet-index">'+ currentFirstChar +'</h1></a>');
            profileContainer.append('<a href="#profile/' + profile.get("id") +'"><img src="' + profile.get("photo") +'" /><p>' + profile.get("name") +'</p></a>');
        }

         self.previousFirstChar = currentFirstChar;
    },

    openProfile: function(e) {
        e.preventDefault();

        var profileId = $(e.currentTarget).attr('href').split('/')[1];

        $.getScript('assets/js/views/Profile.js', function(view){

            var view = new App.Views.Profile(profileId);

        });
    },

    render: function(office) {
        var self = this;

        if(!office || office == "all"){

            var profiles = App.Collections.Profiles.models;

        } else {
            
            var profiles = App.Collections.Profiles.where({office : office});

        }

        $('.loading').hide();

        // Only render the container
        self.$el.html(self.template());

        // loop through models in collection and render them individually depending on comparison between this and last
        _.each(profiles, function(profile){
            self.addNew(profile);
        });

        return self;

    }
});