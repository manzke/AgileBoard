  $( "#saveButton" )
			.button()
			.click(function() {
				utils.save('#location');
			});
	
	$( "#loadButton" )
			.button()
			.click(function() {
				$( "#loadDialog-form" ).dialog( "open" );
			});
