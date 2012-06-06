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
		save: function(location, isOnline){
			if (window.localStorage) {
				localStorage.setItem(location, JSON.stringify(board.getData()));
			} else {
				alert("Your Browser does not support LocalStorage.");
			}	
		},
		load: function(location, isOnline, store){
			
		}
	};
}();

var utils = function(){
	return {
		getQueryVariable: function(variable) { 
			return null;
		}, 
		updateOnlineStatus: function(online, hide) {
			
		}, 
		checkNetworkStatus: function(onAction) {
			
		},
		parse: function(data){
			
		},
		feedback: function(field, clazz, text){
		
		},
		save: function(id){
		
		},
		load: function(id, store){
		
		}
	};
}();
