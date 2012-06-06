var utils = function(){
	return {
		getQueryVariable: function(variable) { 
			var query = window.location.search.substring(1); 
			var vars = query.split("&"); 
			for (var i=0;i<vars.length;i++) { 
				var pair = vars[i].split("="); 
				if (pair[0] == variable) { 
					return pair[1]; 
				} 
			} 
			return null;
		}, 
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
		parse: function(data){
			if((data == null) || (data.states == null) || (data.stories == null)){
				console.log('no data could be loaded');
				utils.feedback('#feedback', 'error', 'No data could be loaded from backend.');
			}else{
				board.reset();
				$.each(data.states, function(i,item)
									{
										board.addState(new state(item.id, item.name, item.color));
									}
				);
				$.each(data.stories, function(i,item)
									{
										var st = new story(item.name, item.prio);
										board.addStory(st);
										$.each(item.tasks, function(j,jitem)
															{
																board.addTask(new task(jitem.name,jitem.state), st);
															}
										); 
									}
				);
				board.render();
			}
		},
		feedback: function(field, clazz, text){
			$(field).append($('<span></span').addClass(clazz).text(text));					
			setTimeout(function() {
						$(field).empty();
					}, 3000 );
		},
		save: function(id){
			var location = $(id).val();
			dao.save(location, isOnline);
			utils.feedback('#feedback', 'ok', 'Saved!');
		},
		load: function(id, store){
			var location = $(id).val();
			dao.load(location, isOnline, store);
			utils.feedback('#feedback', 'ok', 'Loaded!');
		}
	};
}();

	$(document.body).bind("online", utils.checkNetworkStatus);
    $(document.body).bind("offline", utils.checkNetworkStatus);

	var location = utils.getQueryVariable("#location");
	if(location == null){
		$('#location').val("data.json");	
	}
	utils.checkNetworkStatus(function(online){
		utils.load('#location');
	});
	
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
		
	setInterval(function() {
					utils.checkNetworkStatus();
				}, 5000 );