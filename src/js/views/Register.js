// Registration page view
App.Views.Register = Backbone.View.extend({
	el: '.content',

    events: {
        'submit': 'savePicture',
        'click .next-step': 'nextStep',
        'click .take-selfie': 'selfie',
        'click .capture': 'capture',
        'click .re-take': 'selfie',
        'click .submit-selfie': 'triggerSave',
        'change #email': 'suggestName',
        'click .back': 'destroy'
    },

    user : {},

    initialize: function() {
    	var self = this;

		$.ajax("assets/js/templates/register.tpl").success(function(html){

			self.template = _.template(html);

			self.render();

		});
    },

    render: function() {

        var self = this;

        Parse.Cloud.run('registrationForm', {}, {
            success: function(result) {

                self.$el.html(self.template(result));

                
                var registerEl = $(".register"),
                    cameraEl = $("#camera");

                //device orientation detection
                if(window.innerHeight < window.innerWidth){
                    registerEl.addClass("landscape");
                    cameraEl.addClass("landscape");
                }

                $(window).on("orientationchange", function(){
                    if(window.innerHeight < window.innerWidth){
                        registerEl.addClass("landscape");
                        cameraEl.addClass("landscape");
                    } else {
                        registerEl.removeClass("landscape");
                        cameraEl.removeClass("landscape");
                    }
                });

            },
            error: function(error) {

                console.log(error);

            }
        });
        
        return this;
    },

    nextStep: function(e) {

        e.preventDefault();

        var self = this;

        self.$el.find('.invalid-details').removeClass('show');

        if(self.validateForm()) {

            self.$el.find(".step-1").hide();
            self.$el.find(".step-2").show();

        } else {

            self.$el.find('.invalid-details').addClass('show');

            return false;

        }
    },

    validateForm: function(result) {

        var self = this,
            validate = false;

        if(self.$el.find('#email').val().length < 1) {
            console.log("Email required");
            return validate;
        }

        if(self.$el.find('#name').val().length < 1) {
            console.log("name required");
            return validate;
        }

        if(self.$el.find('#title').val().length < 1) {
            console.log("title required");
            return validate;
        }

        if(self.$el.find('#department').val() === null) {
            console.log("department required");
            return validate;
        }

        if(self.$el.find('#office').val() === null) {
            console.log("office required");
            return validate;
        }

        if(self.$el.find('#password').val().length < 1) {
            console.log("password required");
            return validate;
        }

        validate = true;
        return validate;


    },

    selfie: function(e) {

        e.preventDefault();

        var self = this;

        if(window.navigator.camera){

            navigator.camera.getPicture(onSuccess, onFail, { 
                quality: 80,
                destinationType: Camera.DestinationType.DATA_URL,
                cameraDirection: 1,
                allowEdit : true,
                targetWidth: 300,
                targetHeight: 300,
                saveToPhotoAlbum: false
            });

            function onSuccess(imageData) {

                self.$el.find(".step-2").hide();
                self.$el.find(".step-3").hide();
                self.$el.find(".step-4").show();

                var selfie = document.getElementById('selfie');
                selfie.src = "data:image/jpeg;base64," + imageData;

            }

            function onFail(message) {
                console.log(message);

                self.$el.find(".step-2").show();
                self.$el.find(".step-4").hide();
                self.$el.find(".step-3").hide();
            }

        } else {

            self.$el.find(".step-2").hide();
            self.$el.find(".step-4").hide();
            self.$el.find(".step-3").show();

            navigator.getUserMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

            // chrome and opera use outdated constraints syntax. Firefox 38+ uses new syntax.
            // may require fix for older versions of firefox
            if (navigator.mozGetUserMedia) {
                vidConstraints = { width: 500, height: 500 }
            } else {
                vidConstraints = { mandatory: {maxWidth: 500, maxHeight: 500} }
            }

            if (navigator.getUserMedia) {

                navigator.getUserMedia({
                    audio: false, video: vidConstraints
                }, function(localMediaStream) {
                    var video = document.getElementById('camera');
                    video.src = window.URL.createObjectURL(localMediaStream);

                 }, function(error){

                    console.log(error);

                 });

            } else {

                alert("Browser not supported");

            }

        }

    },

    capture: function(e){

        var self = this;

        if(!window.navigator.camera) {

            e.preventDefault();

            self.$el.find(".step-3").hide();
            self.$el.find(".step-4").show();

            var selfie = document.getElementById('selfie');

            var video = document.getElementById('camera'),
                selfieContext = selfie.getContext('2d');

            selfieContext.fillRect(0, 0, 300, 300);

            selfieContext.drawImage(video, 0, 0, 300, 300);
        }

    },

    triggerSave: function() {

        var self = this;

        self.$el.find("#submit").removeAttr("disabled").trigger("click");
    },

    submit: function(e) {
        var self = this,
            newEmail = $('input#email').val().toLowerCase(),
            newName = $('input#name').val(),
            newTitle = $('input#title').val().toLowerCase(),
            newPassword = $('input#password').val(),
            newDepartment = $('select#department').val(),
            newOffice = $('select#office').val();

        var user = new Parse.User();

        user.set("username", newEmail);

        user.set("password", newPassword);

        user.set("email", newEmail);

        user.set("name", newName);

        user.set("jobTitle", newTitle);

        user.set("photo", self.user.photo);

        // parse requires custom type to be sent to it as a "pointer" ie this object
        user.set('department', {
            __type: 'Pointer',
            className: 'JobDepartments',
            objectId: newDepartment
        });

        user.set("office", {
            __type: "Pointer",
            className: "Offices",
            objectId: newOffice
        });

        user.signUp(null, {
            success: function(user) {

                self.$el.find('.upload-progress-bar span').addClass('uploaded');
                self.$el.find('.progress-message').hide();
                self.$el.find('.success-message').show();

                setTimeout(function(){ 
                    Backbone.history.navigate('introduction', true);
                }, 2000);
            },
            error: function(user, error) {

                self.$el.find('.progress-message').hide();
                self.$el.find('.fail-message').show();

                setTimeout(function(){ 
                    Backbone.history.navigate('register', true);
                }, 3000);

            }
        });
    },

    savePicture: function(e) {
        var self = this;

        e.preventDefault();

        // show and start progress bar
        self.$el.find('.upload-progress').addClass('show');
        self.$el.find('.upload-progress-bar span').addClass('uploading');
        self.$el.find('.btn-module').hide();

        if(window.navigator.camera) {
            var base64 = document.getElementById("selfie").src;
        } else {
            var base64 = document.getElementById("selfie").toDataURL("image/png").replace("data:image/png;base64,","");
        }
        
        var fileName = $("input#name").val().replace(/ /g,'-').toLowerCase() + ".jpg";

        var file = new Parse.File(fileName, {
            base64: base64
        }, 'image/jpeg');


        file.save().then(function(file){

            var Photos = Parse.Object.extend("Photos"),
                photo = new Photos();

            photo.set("originalFile", file._url);

            photo.save(null, {
                success: function(photo) {

                    self.user.photo = {
                        __type: "Pointer",
                        className: "Photos",
                        objectId: photo.id
                    };

                    self.submit();

                },
                error: function(photo, error) {

                    self.$el.find('.progress-message').hide();
                    self.$el.find('.fail-message').show();

                    setTimeout(function(){ 
                        Backbone.history.navigate('register', true);
                    }, 3000);

                }
            });

        }, function(error){

            self.$el.find('.progress-message').hide();
            self.$el.find('.fail-message').show();

            setTimeout(function(){ 
                Backbone.history.navigate('register', true);
            }, 3000);

        });

    },

    suggestName: function(e) {

        var self = this,
            input = e.currentTarget.value.toLowerCase();

        self.$el.find('.email-error').removeClass('show');

        if(input.indexOf("@analogfolk.com") !== -1) {
            
            var name = input.split('@')[0].replace('.', ' ');

            this.$el.find('#name').val(name);

        } else {
            self.$el.find('.email-error').addClass('show');
        }

    },

    destroy: function (e) {
        e.preventDefault();
        
        Backbone.history.navigate('', true);
        this.undelegateEvents();
        this.stopListening();
        return this;
    }
});