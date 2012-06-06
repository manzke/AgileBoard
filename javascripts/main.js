var isOnline = true;

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


var utils = function(){
	return {
		updateOnlineStatus: function(online, hide) {
			isOnline = online;
			if(!hide){
				if(online){
					$('#onlineStatus').empty().append($('<span></span').addClass('ok').text('You are online!'));
				}else{
					$('#onlineStatus').empty().append($('<span></span').addClass('info').text('You are offline!'));
				}
			}
		}, 
		checkNetworkStatus: function(onAction) {
			if (navigator.onLine) {
				$.ajax({
					async: true,
					cache: false,
					dataType: "json",
					error: function (req, status, ex) {
						utils.updateOnlineStatus(false);
						if(typeof(onAction) != 'undefined'){
							onAction(false);
						};
					},
					success: function (data, status, req) {
						utils.updateOnlineStatus(true);
						if(typeof(onAction) != 'undefined'){
							onAction(true);
						};
					},
					timeout: 5000,
					type: "GET",
					url: "javascripts/ping.json"
				});
			}
			else {
				utils.updateOnlineStatus(false);
				if(typeof(onAction) != 'undefined'){
					onAction(false);
				};
			}
		},
		feedback: function(field, clazz, text){
			$(field).append($('<span></span').addClass(clazz).text(text));					
			setTimeout(function() {
						$(field).empty();
					}, 3000 );
		}
	};
}();

var location = utils.getQueryVariable("#location");
if(location == null){
	$('#location').val("data.json");	
}

$(document.body).bind("online", utils.checkNetworkStatus);
$(document.body).bind("offline", utils.checkNetworkStatus);

setInterval(function() {
		utils.checkNetworkStatus();
	}, 5000 );