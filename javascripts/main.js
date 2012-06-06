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
			
	$( "#loadDialog-form" ).dialog({
			autoOpen: false,
			modal: true,
			buttons: {
				"Load a Board": function() {
					var internalLocation = $('#internalLocation');
					var location = internalLocation.val();
					if(location == null || location.length == 0){
						location = $('#offlineBoards :selected').val();
					}
					$('#location').val(location);
					console.log("load from location: "+location+" and store it offline? "+ $('#offlineAvailable').is(':checked'));
					utils.load('#location', $('#offlineAvailable').is(':checked'));
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			open: function(){
				var offlineBoards = $('#offlineBoards');
				offlineBoards.empty();
				for (var i = 0; i < localStorage.length; i++){
					var key = localStorage.key(i);	
					offlineBoards.append(new Option(key, key));
				}				
			},
			close: function() {
				$('#internalLocation').val("");
			}
		});
