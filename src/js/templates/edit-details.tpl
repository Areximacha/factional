<!-- EDIT PROFILE -->

<div class="profile">
	<div class="contact">
		<a href="#" class="fa fa-arrow-left fa-2x back"></a>
		<p>Edit Profile</p>
		<a href="#" class="fa fa-pencil-square-o fa-2x toggle-edit"></a>	
	</div>

	<img src="<%= photo %>" />
	<div class="department">
		<p><%= name %></p>
	</div>

	<form id="editDetails" action="" class="invert">
		<input id="title" type="text" value="<%= title %>" disabled />
		<select id="department" name="department" disabled>
			<% _.each(companyInformation.JobDepartments, function(department){ %>
				<option value="<%= department.id %>"><%= department.name %></option>
			<% }) %>
		</select>
		<select id="office" name="office" disabled>
			<% _.each(companyInformation.Offices, function(office){ %>
				<option value="<%= office.id %>"><%= office.name %></option>
			<% }) %>
		</select>
		<input id="submit" type="submit" value="Save" disabled />
	</form>
</div>
