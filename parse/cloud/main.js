/*                                                            
########  ########  ######   ####  ######  ######## ########     ###    ######## ####  #######  ##    ## 
##     ## ##       ##    ##   ##  ##    ##    ##    ##     ##   ## ##      ##     ##  ##     ## ###   ## 
##     ## ##       ##         ##  ##          ##    ##     ##  ##   ##     ##     ##  ##     ## ####  ## 
########  ######   ##   ####  ##   ######     ##    ########  ##     ##    ##     ##  ##     ## ## ## ## 
##   ##   ##       ##    ##   ##        ##    ##    ##   ##   #########    ##     ##  ##     ## ##  #### 
##    ##  ##       ##    ##   ##  ##    ##    ##    ##    ##  ##     ##    ##     ##  ##     ## ##   ### 
##     ## ########  ######   ####  ######     ##    ##     ## ##     ##    ##    ####  #######  ##    ## 
########  #######  ########  ##     ##                                                                   
##       ##     ## ##     ## ###   ###                                                                   
##       ##     ## ##     ## #### ####                                                                   
######   ##     ## ########  ## ### ##                                                                   
##       ##     ## ##   ##   ##     ##                                                                   
##       ##     ## ##    ##  ##     ##                                                                   
##        #######  ##     ## ##     ##                                                                    
*/

Parse.Cloud.define("registrationForm", function(request, response) {
	var data = {
		JobDepartments: [],
		Offices: []
	};

	var JobDepartments = Parse.Object.extend("JobDepartments");
    var query = new Parse.Query(JobDepartments);
	query.ascending("department");
	query.find({
		success: function(results) {

			for (var i = 0; i < results.length; i++) {
				
				data.JobDepartments.push({
					id: results[i].id,
					name: results[i].attributes.department,
				});

			};

			var Offices = Parse.Object.extend("Offices");
			var query = new Parse.Query(Offices);
			query.ascending("office");
			query.find({
				success: function(results) {

					for (var i = 0; i < results.length; i++) {
						
						data.Offices.push({
							id: results[i].id,
							name: results[i].attributes.office,
						});

					};

					response.success(data);

				},
				error: function(error) {
					response.error(error.message);
				}
			});

		},
		error: function(error) {
			response.error(error.message);
		}
	});
		
});

/*
##     ##  ######  ######## ########                                                   
##     ## ##    ## ##       ##     ##                                                  
##     ## ##       ##       ##     ##                                                  
##     ##  ######  ######   ########                                                   
##     ##       ## ##       ##   ##                                                    
##     ## ##    ## ##       ##    ##                                                   
 #######   ######  ######## ##     ##                                                  
##     ##    ###    ##       #### ########     ###    ######## ####  #######  ##    ## 
##     ##   ## ##   ##        ##  ##     ##   ## ##      ##     ##  ##     ## ###   ## 
##     ##  ##   ##  ##        ##  ##     ##  ##   ##     ##     ##  ##     ## ####  ## 
##     ## ##     ## ##        ##  ##     ## ##     ##    ##     ##  ##     ## ## ## ## 
 ##   ##  ######### ##        ##  ##     ## #########    ##     ##  ##     ## ##  #### 
  ## ##   ##     ## ##        ##  ##     ## ##     ##    ##     ##  ##     ## ##   ### 
   ###    ##     ## ######## #### ########  ##     ##    ##    ####  #######  ##    ## 
*/

Parse.Cloud.beforeSave(Parse.User, function(request, response) {
	var errors = [];
	

	if(request.user){
		// Current user, updating their records

	} else {
		// New user, creating a record

		if (
			!request.object.get("email")
			|| request.object.get("email").indexOf("@analogfolk.com") === -1
		) {
			errors.push("Please enter a valid @analogfolk.com email address");
		};

		if (
			!request.object.get("name")
			|| request.object.get("name").length < 4
		) {
			errors.push("Please enter your fullname");
		};
	}

	if (request.object.get("name")) {

    	request.object.set("nameLowerCase", request.object.get("name").toLowerCase());

  	}

	if(errors.length > 0){

		// Just return the first error
		response.error(errors[0]);

	} else {

		response.success();

	}
});

/*                                                            
##    ##  #######  ######## #### ######## ####  ######     ###    ######## ####  #######  ##    ## 
###   ## ##     ##    ##     ##  ##        ##  ##    ##   ## ##      ##     ##  ##     ## ###   ## 
####  ## ##     ##    ##     ##  ##        ##  ##        ##   ##     ##     ##  ##     ## ####  ## 
## ## ## ##     ##    ##     ##  ######    ##  ##       ##     ##    ##     ##  ##     ## ## ## ## 
##  #### ##     ##    ##     ##  ##        ##  ##       #########    ##     ##  ##     ## ##  #### 
##   ### ##     ##    ##     ##  ##        ##  ##    ## ##     ##    ##     ##  ##     ## ##   ### 
##    ##  #######     ##    #### ##       ####  ######  ##     ##    ##    ####  #######  ##    ## 
*/

Parse.Cloud.define("notification", function(request, response) {

	if(!request.user){

		response.error("Request must be triggered by a valid user");

		return false;

	};

	switch (request.params.type) {

		case "new user" : {
			// The request has come from the new user, as it's triggered during the sign up flow.
			// We should notify everyone in the same office.

			var user = request.user;

			if(!user.get("office")){

				response.error("User doesn't have a valid office set");

				return false;

			}

			response.success(user);

	        break;
		}

		default : {

			response.error("Not a valid notification type");

			break;
		}

	}

});