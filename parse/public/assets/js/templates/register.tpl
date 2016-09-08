<section class="register">

	<div class="step-1 reg-step">
		<a href="#" class="fa fa-arrow-left fa-2x back"></a>
		<div class="heading-module">
			<h2>A few</h2>
			<h1>Details</h1>
		</div>
		<form id="editDetails" action="">
			<input id="email" type="text" placeholder="Email" required />
			<span class="error email-error">This is not a valid AnalogFolk email</span>
			<input id="name" type="text" placeholder="Full Name" required />
			<input id="title" type="text" placeholder="Job Title" required />
			<select id="department" name="department">
				<option value="" class="select-placeholder" disabled selected>Department</option>
				<% _.each(JobDepartments, function(department){ %>
					<option value="<%= department.id %>"><%= department.name %></option>
				<% }) %>
			</select>
			<select id="office" name="office">
				<option value=""  class="select-placeholder" disabled selected>Office</option>
				<% _.each(Offices, function(office){ %>
					<option value="<%= office.id %>"><%= office.name %></option>
				<% }) %>
			</select>
			<input id="password" type="password" placeholder="Password" required />
			<input id="submit" type="submit" value="Next step" style="display: none" disabled />
			<span class="error invalid-details">You're missing a detail or two there, cowboy.</span>
			<button class="next-step">Next step</button>
		</form>
	</div>

	<div class="step-2 reg-step">
		<div class="heading-module invert">
			<h2>Take a</h2>
			<h1>Selfie</h1>
		</div>

		<img src="http://placehold.it/300x300" />

		<p>Some insructions go here.</p>
		<p>Some insructions go here.</p>
		<p>Some insructions go here.</p>

		<button class="take-selfie">Go ahead</button>
	</div>

	<div class="step-3 reg-step">
		<video autoplay id="camera" class="camera"></video>
		<button class="capture">Capture</button>
	</div>

	<div class="step-4 reg-step">
		<div class="heading-module invert">
			<h2>Your</h2>
			<h1>Selfie</h1>
		</div>
		<% if(window.navigator.camera) { %>
			<img src="" id="selfie" class="selfie" />
		<% } else { %>
			<canvas id="selfie" class="selfie" width="300" height="300"></canvas>
		<% } %>
		<div class="upload-progress">
			<div class="upload-progress-bar">
				<span></span>
			</div>
			<p class="progress-message">Uploading...</p>
			<p class="success-message">Upload successful!</p>
			<p class="fail-message">Oh no! Something went wrong!</p>
		</div>
		<div class="btn-module grid">
			<div class="grid-5 offset-1">
				<button class="re-take">Again</button>
			</div>
			<div class="grid-5">
				<button class="submit-selfie dark">I'm Happy</button>
			</div>
		</div>
	</div>

</section>