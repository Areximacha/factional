// Edit profile page view
App.Views.EditDetails = Backbone.View.extend({
    el: ".overlay-view",
    events: {
        submit: "submit",
        "click .back": "destroy",
        "click .toggle-edit": "toggleEdit"
    },
    initialize: function() {
        var self = this;
        $.ajax("assets/js/templates/edit-details.tpl").success(function(html) {
            self.template = _.template(html);
            self.render();
        });
    },
    render: function() {
        var self = this;
        // POPULATE WITH USER DATS
        var userData = {};
        userData.name = Parse.User.current().get("name");
        userData.title = Parse.User.current().get("jobTitle");
        Parse.User.current().get("department").fetch(function(userDepartment) {
            userData.departmentId = userDepartment.id;
        });
        Parse.User.current().get("office").fetch(function(userOffice) {
            userData.officeId = userOffice.id;
        });
        Parse.Cloud.run("registrationForm", {}, {
            success: function(result) {
                userData.companyInformation = result;
            },
            error: function(error) {
                console.log(error);
            }
        }).then(function() {
            Parse.User.current().get("photo").fetch(function(photo) {
                userData.photo = photo.attributes.originalFile;
                self.$el.html(self.template(userData));
                self.$el.find('option[value="' + userData.departmentId + '"]').attr("selected", "selected");
                self.$el.find('option[value="' + userData.officeId + '"]').attr("selected", "selected");
            });
            self.$el.addClass("active");
            $("body").addClass("blocked");
        });
        return this;
    },
    toggleEdit: function(e) {
        e.preventDefault();
        var self = this, detailsForm = self.$el.find("#editDetails"), inputTitle = detailsForm.find("#title"), inputDepartment = detailsForm.find("#department"), inputOffice = detailsForm.find("#office"), inputSubmit = detailsForm.find("#submit");
        if (detailsForm.hasClass("active")) {
            detailsForm.removeClass("active");
            inputTitle.attr("disabled", "disabled");
            inputDepartment.attr("disabled", "disabled");
            inputOffice.attr("disabled", "disabled");
            inputSubmit.attr("disabled", "disabled");
        } else {
            detailsForm.addClass("active");
            inputTitle.removeAttr("disabled");
            inputDepartment.removeAttr("disabled");
            inputOffice.removeAttr("disabled");
            inputSubmit.removeAttr("disabled");
        }
    },
    submit: function(e) {
        e.preventDefault();
        var newName = $(e.currentTarget).find("#name").val(), newTitle = $(e.currentTarget).find("#title").val(), newDepartment = $(e.currentTarget).find("#department").val();
        var user = Parse.User.current();
        user.set("name", newName);
        user.set("jobTitle", newTitle);
        user.set("department", {
            __type: "Pointer",
            className: "JobDepartments",
            objectId: newDepartment
        });
        user.save(null, {
            success: function(user) {
                user.save();
                Backbone.history.navigate("home", true);
            },
            error: function(user, error) {
                console.log(error);
            }
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
    }
});