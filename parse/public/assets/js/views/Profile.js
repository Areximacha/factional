// Profile page view
App.Views.Profile = Backbone.View.extend({
    el: ".overlay-view",
    events: {
        "click .back": "destroy"
    },
    initialize: function(profileId) {
        var self = this;
        $.ajax("assets/js/templates/profile.tpl").success(function(html) {
            var answers = Parse.Object.extend("QuestionResponses");
            var query = new Parse.Query(answers);
            var pointer = new Parse.Object("User");
            pointer.id = profileId;
            query.equalTo("answeredBy", pointer);
            query.include("question");
            query.find({
                success: function(results) {
                    self.template = _.template(html);
                    self.render(profileId, results);
                    self.$el.addClass("active");
                    $("body").addClass("blocked");
                },
                error: function(error) {
                    console.log(error);
                }
            });
        });
    },
    destroy: function(e) {
        e.preventDefault();
        var self = this;
        //$('.content').show();
        $("body").removeClass("blocked");
        self.$el.removeClass("active");
        setTimeout(function() {
            self.undelegateEvents();
            self.$el.empty();
            self.stopListening();
            return self;
        }, 300);
    },
    render: function(profileId, questions) {
        var self = this;
        // POPULATE WITH PROFILE DATA
        this.$el.html(this.template({
            profile: App.Collections.Profiles.findWhere({
                id: profileId
            }),
            questions: questions
        }));
        return this;
    }
});