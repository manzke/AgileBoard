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
