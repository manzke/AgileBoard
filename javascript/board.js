var story = function(name, prio) {
	var name = name;
	var prio = prio;
	
	return {
		name: name,
		prio: prio,
		tasks: [],
	
		render: function() {
			return $('<div></div>').text(name);
		}
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

var board = function() {
	// private
	var stories = [];
	var states = {
		n: 'New',
		pr: 'ProductManagement', 
		d: 'Design', 
		dev: 'Development', 
		t: 'Test', 
		r: 'Release'
	};
	
	function renderStory(story) {
		var row = $('<li></li>').attr('id', story.prio).addClass('story');
		
		// render story title
		$('<div></div>').addClass('desc').append(story.render()).appendTo(row);
		
		$.each(states, function(abbr, state) { 
			var column = $('<ol></ol>').addClass('tasks').appendTo(row);
			
			// assign tasks
			$.each(story.tasks, function(key, task) {
				if(task.state == abbr) {
					column.append(task.render());
				}
			});
		});			
		return row;
	}
		
	return {
		init: function(persistedStories) {
			stories = persistedStories;
		},
		
		addStory: function(story){
			//stories.push(story);
		},
		
		addTask: function(task, story){
			//stories.push(story);
		},
		
		render: function(){
			// create board
			var board = $('<ol></ol>').attr('id', 'board');
			
			// render header
			board.append($('<li></li>').addClass('desc').text(''));
			$.each(states, function(abbr, state) { 
				board.append($('<li></li>').addClass('state').addClass(abbr).text(state));
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
		}
    };
}();

var dao = function() {
	
	if (!window.google || !google.gears) {
		$('#feedback').append($('<span></span').addClass('error').text('Persistence not available'));
	}
		
	return {
		findAllStories: function() {
			var x = new story('Do some stuff.', 1)
			x.tasks.push(new task('Fix YSlow','pr'));
			x.tasks.push(new task('Make application faster','dev'));
			x.tasks.push(new task('Build something astonishing','pr'));
			x.tasks.push(new task('Google Page Speed fix','d'));
			
			var y = new story('Rethink.', 2)
			y.tasks.push(new task('Do something with OpenID','d'));
			y.tasks.push(new task('Checkout optimize','dev'));
			
			var a = new story('Rethink.', 3)
			a.tasks.push(new task('Credit Card Payment','r'));
			a.tasks.push(new task('Rebuild with REST','dev'));
			a.tasks.push(new task('Rebuild with SOAP','dev'));
			
			var b = new story('Rethink.', 4)
			b.tasks.push(new task('Do something with OpenID','d'));
			b.tasks.push(new task('Checkout optimize','dev'));
			b.tasks.push(new task('Rebuild with REST','dev'));
					
			return [x, y, a, b];
		},
		
		updatePriority: function(oPrio, nPrio) {
			//alert('old: ' + oPrio + ', new: ' + nPrio);
		}
    };
}();

var addStory = function() {

}

var addTask = function() {

}

$(document).ready(function() {
//	$.each(states, function(abbr, state) {
//		 $('#states').append($('<option></option>').attr('value', abbr).text(state));	
//	});
//	$.each(stories, function(key, story) {
//		 $('#stories').append($('<option></option>').attr('value', story.name).text(story.name));
//	});
//
//	$('body').append($('<a></a>').attr('href','#story').text('+ Story').click(function() { 
//		$('#taskForm').hide();
//		$('#storyForm').show();
//	}));
	
	board.init(dao.findAllStories());
	board.render();
});