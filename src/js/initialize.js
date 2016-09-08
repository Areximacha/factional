var App = {
	Models: {},
	Collections: {},
	Views: {},
	Router: {},
	Rendered: {}
};

document.addEventListener("deviceready", onDeviceReady, false);
// device APIs are available
function onDeviceReady() {
	if (navigator.network.connection.type == Connection.NONE){
		alert("No network connection detected. You need a network connection to use this application.");
	}
}

$(function() {
    FastClick.attach(document.body);
});

Parse.initialize("9QrMvUdOmb3smTEhEd7BUTZzPHeBz5Wagh9eVnh6", "Kj4MUQS455Gzs4C05Y3IQ6ryOueOCJ4XP9uGbOfC");