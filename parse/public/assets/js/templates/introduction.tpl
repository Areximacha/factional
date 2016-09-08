<section class="introduction">
	<div class="heading-module invert">
		<h2>Introduce</h2>
		<h1>Yourself</h1>
	</div>

	<form id="intro-form" class="simform">
		<div class="status-module">
			<div class="progress-bar"><span></span></div>
			<span class="progress-num"><i>0</i>/4</span>
			<span class="error-msg">You forgot to answer the question, chuckles.</span>
		</div>
		<div class="simform-inner">
			<% _.each(questions, function(question, index){ %>
				<fieldset <% if(index == 0) { %> class="active" <% } %>>
					<label for="question-<%= index + 1 %>"><%= question.attributes.question %></label>
					<div class="input-wrapper">
						<textarea id="question-<%= index + 1 %>" data-question-id="<%= question.id %>" maxlength="140"></textarea>
						<span class="text-count">140</span>
					</div>
					<a href="#" class="link-btn <% if(index == questions.length - 1) { %>cta-submit<% } else { %>cta-next<% } %>"><% if(index == questions.length - 1) { %>Finish<% } else { %>Next<% } %></a>
					<a<% if(index != 0) { %> href="#" class="cta-back" <% } else { %> style="opacity:0;" <% } %>><i class="fa fa-chevron-left"></i> BACK</a>
				</fieldset>
			<% }) %>
		</div>
	</form>

	<div class="feedback">
		<h3>Saved!</h3>
	</div>
</section>