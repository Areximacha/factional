<!-- PROFILE -->

<div class="profile">
	<div class="contact">
		<a href="#" class="fa fa-arrow-left fa-2x back"></a>
		<p><%= profile.attributes.name %></p>
		<a href="mailto:<%= profile.attributes.username %>" class="fa fa-envelope-o fa-2x"></a>	
	</div>

	<img src="<%= profile.attributes.photo %>" />
	<!-- <p><%= profile.attributes.title %></p> -->

	<div class="department">
		<p><%= profile.attributes.department %></p>
		<p><%= profile.attributes.office %></p>
	</div>

	<div class="questions">
		<% _.each(questions, function(question){ %>
			<p class="question"><%= question.attributes.question.attributes.question %></p>
			<p class="answer"><%= question.attributes.response %></p>
		<% }) %>
	</div>
</div>

