// Introduction page view
App.Views.Introduction = Backbone.View.extend({
    el: ".content",
    events: {
        "click .cta-submit": "submitAnswers",
        "click .cta-next": "nextQuestion",
        "click .cta-back": "lastQuestion",
        "keyup textarea": "countCharacters",
        "focus textarea": "showArrow"
    },
    initialize: function() {
        var self = this;
        $.ajax("assets/js/templates/introduction.tpl").success(function(html) {
            var questions = Parse.Object.extend("Questions"), query = new Parse.Query(questions);
            query.find({
                success: function(results) {
                    self.shuffle(results);
                    self.questions = results.slice(0, 4);
                    self.template = _.template(html);
                    self.render();
                },
                error: function(error) {
                    console.log(error);
                }
            });
        });
    },
    render: function() {
        this.$el.html(this.template({
            questions: this.questions
        }));
        return this;
    },
    shuffle: function(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], 
        o[j] = x) ;
        return o;
    },
    nextQuestion: function(e) {
        e.preventDefault();
        var self = this, currentFieldset = $(e.currentTarget).parent(), nextFieldset = currentFieldset.next(), currentInput = currentFieldset.find("textarea");
        if (self.validateField(currentInput)) {
            self.$el.find(".error-msg").hide();
            currentFieldset.removeClass("active");
            nextFieldset.addClass("active");
            nextFieldset.find("textarea").focus();
            self.updateProgress(true);
        } else {
            self.$el.find(".error-msg").show();
        }
    },
    lastQuestion: function(e) {
        e.preventDefault();
        var self = this, currentFieldset = $(e.currentTarget).parent(), prevFieldset = currentFieldset.prev(), currentInput = currentFieldset.find("textarea");
        currentFieldset.removeClass("active");
        prevFieldset.addClass("active");
        prevFieldset.find("textarea").focus();
        self.updateProgress(false);
    },
    updateProgress: function(increase) {
        var self = this, incrementValue = self.$el.find(".progress-bar").width() / 4, progressBar = self.$el.find(".progress-bar span"), progressNum = self.$el.find(".progress-num i"), progress = parseInt(progressNum.html(), 10);
        if (increase) {
            progress++;
            progressNum.html(progress);
            progressBar.width(progressBar.width() + incrementValue);
        } else {
            progress--;
            progressNum.html(progress);
            progressBar.width(progressBar.width() - incrementValue);
        }
    },
    validateField: function(input) {
        if ($(input).val() == "") {
            return false;
        } else {
            return true;
        }
    },
    countCharacters: function(e) {
        var self = this, counter = $(e.currentTarget).siblings(".text-count"), currentCount = $(e.currentTarget).val().length, counterValue;
        counterValue = 140 - currentCount;
        counter.html(counterValue);
    },
    showArrow: function(e) {
        this.$el.find("i.hidden").removeClass("hidden");
    },
    submitAnswers: function(e) {
        e.preventDefault();
        var self = this, answers = self.$el.find("textarea"), currentInput = $(e.currentTarget).parentsUntil(".active").parent().find("textarea");
        $(e.currentTarget).removeClass("cta-submit");
        if (self.validateField(currentInput)) {
            self.updateProgress(true);
            _.each(answers, function(answer) {
                var QuestionResponses = Parse.Object.extend("QuestionResponses");
                var questionResponses = new QuestionResponses();
                questionResponses.set("response", $(answer).val());
                questionResponses.set("question", {
                    __type: "Pointer",
                    className: "Questions",
                    objectId: $(answer).data("question-id")
                });
                questionResponses.set("answeredBy", {
                    __type: "Pointer",
                    className: "User",
                    objectId: Parse.User.current().id
                });
                questionResponses.save(null, {
                    success: function(questionResponses) {
                        self.$el.find(".feedback").addClass("show");
                        setTimeout(function() {
                            Backbone.history.navigate("home", true);
                            var profileId = Parse.User.current().id;
                            $.getScript("assets/js/views/Profile.js", function(view) {
                                var view = new App.Views.Profile(profileId);
                            });
                        }, 2e3);
                    },
                    error: function(questionResponses, error) {
                        console.log(error);
                    }
                });
            });
        } else {
            self.$el.find(".error-msg").show();
        }
    }
});