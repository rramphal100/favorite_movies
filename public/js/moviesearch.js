$("#form").on("submit", function(e){
	e.preventDefault();
	$.getJSON("http://www.omdbapi.com/?",
	{
		t: $("#term").val(),
		type: "movie"
	},
	function(response) {
		console.log(response);
		var title = response.Title;
		$("#title").text(title);
		$("#image").html("<img src='"+response.Poster+"'>");
		$("#actors").text(response.Actors);
		$("#country").text(response.Country);
		$("#genres").text(response.Genres);
		$("#rating").text(response.Rating);
		$("#release_date").text(response.Released);
		$("#plot").text(response.Plot);
		$("#result").css({"display": "block", "background-color": "#000000"});
		$("#id").val(response.imdbID);
		$("#description").val(response.Plot);
		$("#poster").val(response.Poster);
	});
});

$("#term").on("keyup", function(){
	var current_text = $("#term").val();
	$.getJSON("http://www.omdbapi.com/?",
	{
		t: current_text.substring(0,current_text.length-2)
	},
	function(response) {
		$("#suggestion2").text(response.Title);
	});
	$.getJSON("http://www.omdbapi.com/?",
	{
		t: current_text.substring(0,current_text.length-1)
	},
	function(response) {
		$("#suggestion1").text(response.Title);
	});
});

$("#suggestion1").on("click", function(){
	$("#term").val($("#suggestion1").text());
});

$("#suggestion2").on("click", function(){
	$("#term").val($("#suggestion2").text());
})