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

var story = function(name, prio) {
	var name = name;
	var prio = prio;
	var tasks = [];
	
	return {
		name: name,
		prio: prio,
		tasks: tasks,
	
		render: function() {
			return $('<div></div>').text(name);
		},
		
		addTask: function(item) {
			tasks.push(item);
		}
	};
}

var board = function() {
	// private
	var stories = [];
	var states = [];

	function renderStory(story) {
		var row = $('<li></li>').attr('id', story.prio).addClass('story');

		// render story title
		$('<div></div>').addClass('desc').addClass('.ui-widget-header').append(story.render()).appendTo(row);
		
		$.each(states, function(abbr, state) { 
			var column = $('<ol></ol>').addClass('tasks').appendTo(row);
			
			// assign tasks
			$.each(story.tasks, function(key, task) {
				if(task.state == state.id) {
					column.append(task.render());
				}
			});

		});			
		return row;
	}
		
	return {
		getData: function(){
			return {"states":states, "stories":stories};
		},

		addState: function(state){
			states.push(state);
		},

		addStory: function(story){
			//stories.push(story);
		},
		
		addTask: function(task, story){
			story.addTask(task);
		},
		
		render: function(){
			// create board
			var board = $('<ol></ol>').attr('id', 'board');
			
			// render header
			board.append($('<li></li>').addClass('desc').text(''));

			$.each(states, function(s, state) {
				board.append($('<li></li>').addClass('state').css("background-color", state.color).text(state.name)); //.addClass("ui-state-default")				
			});		
			
			// render stories
			$.each(stories, function(key, story) {
				board.append(renderStory(story));
			});
			
			// enable sortable
			board.sortable();
			board.disableSelection();
			
			// board
			$('body').append(board);

			// enable drag'n drop for tasks
			$(".tasks").sortable({
				connectWith: ".tasks"
			}).disableSelection();
		},
				
		reset: function(container){
			$('#board').remove();
			stories.length=0;
			states.length=0;
		}
    };
}();


var dao = function(){
	return {
		save: function(dataURL, isOnline){
			if (window.localStorage) {
				localStorage.setItem(dataURL, JSON.stringify(board.getData()));
			} else {
				alert("Your Browser does not support LocalStorage.");
			}	
		},
		load: function(dataURL, isOnline, store){
			if(isOnline){
				$.ajax({
					async: true,
					dataType: "json",
					error: function (req, status, ex) {
						utils.updateOnlineStatus(false, true);
						utils.feedback('#feedback', 'error', 'No data was fetched from url: '+dataURL);
					},
					success: function (data, status, req) {
						utils.updateOnlineStatus(true, true);
						utils.parse(data);
						if(store){
							dao.save(dataURL, isOnline);
						}
					},
					timeout: 5000,
					type: "GET",
					url: dataURL
				});
			}else{
				if (window.localStorage) {
					var data = localStorage.getItem(dataURL);
					utils.parse(JSON.parse(data));
				} else {
					utils.feedback('#feedback', 'error', 'Your Browser does not support LocalStorage.');
				}
			}
		}
	};
}();

$( "#saveButton" )
		.button()
		.click(function() {
			utils.save('#dataURL');
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
				var internalLocation = $('#internalDataURL');
				var dataURL = internalLocation.val();
				if(dataURL == null || dataURL.length == 0){
					dataURL = $('#offlineBoards :selected').val();
				}
				$('#dataURL').val(dataURL);
				console.log("load from url: "+dataURL+" and store it offline? "+ $('#offlineAvailable').is(':checked'));
				//utils.load('#dataURL', $('#offlineAvailable').is(':checked'));
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
			$('#internalDataURL').val("");
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

var dataURL = "data.json";//utils.getQueryVariable("#dataURL");
//if(dataURL == null){
//	$('#dataURL').val("data.json");	
//}

$(document.body).bind("online", utils.checkNetworkStatus);
$(document.body).bind("offline", utils.checkNetworkStatus);

setInterval(function() {
		utils.checkNetworkStatus();
	}, 5000 );