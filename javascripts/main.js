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

			
		return row;
	}
		
	return {
		getData: function(){
			return {"states":states, "stories":stories};
		},

		addState: function(state){
		
		},

		addStory: function(story){
			
		},
		
		addTask: function(task, story){
			
		},
		
		render: function(){
		
		},
				
		reset: function(container){
			
		}
    };
}();

var dao = function(){
	return {
		save: function(location, isOnline){
				
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
