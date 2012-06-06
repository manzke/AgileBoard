var isOnline = true;

var state = function(id, name, color) {
  var id;
	var name;
	var color;
	
	return {
		id: id,
		name: name,
		color: color
	};
}

var task = function(name, state) {
	var name;
	var state;
	
	return {
		name: name,
		state: state,
	
		render: function() {
			return $('<li></li>').text(name);
		}
	};
}




	$( "#saveButton" )
			.button()
			.click(function() {
				//utils.save('#location');
			});
	
	$( "#loadButton" )
			.button()
			.click(function() {
				$( "#loadDialog-form" ).dialog( "open" );
			});
