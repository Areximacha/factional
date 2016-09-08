// Navigation page view
App.Views.Navigation = Backbone.View.extend({
    el: "nav",
    searchResults: ".search-results",
    events: {
        "submit #search": "search",
        "click .clear-search": "clearSearch",
        "click .close-search": "closeSearch",
        "keyup #search input": "toggleClear",
        "click .menu": "openNavigationMenu",
        "click .mobile-nav .close": "closeNavigationMenu",
        "click .cta-search": "searchIconClick",
        "click .offices li": "officeTab",
        "click .cta-profile": "openProfile",
        "click .cta-edit": "openEdit"
    },
    initialize: function() {
        var self = this;
        App.Collections.Profiles;
        App.Collections.Profiles.on("reset", this.autocomplete, this);
        $.ajax("assets/js/templates/navigation.tpl").success(function(html) {
            self.template = _.template(html);
            self.render();
        });
    },
    render: function() {
        this.$el.html(this.template());
        return this;
    },
    availableNames: [],
    autocomplete: function() {
        var self = this;
        if (self.availableNames.length > 0) {
            // Already rendered the autocomplete for names, no need to do it again
            return false;
        }
        _.each(App.Collections.Profiles.models, function(user) {
            self.availableNames.push(user.get("name"));
        });
        $("#search input").autocomplete({
            source: self.availableNames,
            select: function(event, ui) {
                $("#search").submit();
            }
        });
    },
    openNavigationMenu: function(e) {
        e.preventDefault();
        this.$el.find(".mobile-nav").addClass("active");
    },
    closeNavigationMenu: function(e) {
        e.preventDefault();
        this.$el.find(".mobile-nav").removeClass("active");
    },
    searchIconClick: function(e) {
        e.preventDefault();
        $(e.currentTarget).parent().addClass("active");
        $(".offices").slideUp();
    },
    toggleClear: function(e) {
        var self = this, clearBtn = self.$el.find(".clear-search");
        if ($(e.currentTarget).val() != "" && !clearBtn.hasClass("show")) {
            clearBtn.addClass("show");
        } else if ($(e.currentTarget).val() == "") {
            clearBtn.removeClass("show");
        }
    },
    search: function(e) {
        e.preventDefault();
        Backbone.history.fragment = null;
        Backbone.history.navigate("home", true);
    },
    clearSearch: function(e) {
        this.$el.find("#search input").val("");
        $(e.currentTarget).removeClass("show");
    },
    closeSearch: function() {
        $(".offices").slideDown();
        $("#search input[name='search']").val("").parent().submit();
        this.$el.find(".search-form").removeClass("active");
    },
    officeTab: function(e) {
        var self = this;
        Backbone.history.fragment = null;
        Backbone.history.navigate("home", true);
        self.selectedOfficeTab($(".offices li[data-value='" + e.currentTarget.dataset.value + "']"));
    },
    selectedOfficeTab: function($target) {
        $(".offices li").removeClass("selected");
        $target.addClass("selected");
    },
    openProfile: function(e) {
        e.preventDefault();
        var profileId = Parse.User.current().id;
        $.getScript("assets/js/views/Profile.js", function(view) {
            var view = new App.Views.Profile(profileId);
        });
    },
    openEdit: function(e) {
        e.preventDefault();
        $.getScript("assets/js/views/EditDetails.js", function(view) {
            var view = new App.Views.EditDetails();
        });
    },
    destroy: function() {
        this.undelegateEvents();
        this.$el.empty();
        this.stopListening();
        App.Rendered.Navigation = undefined;
        return this;
    }
});