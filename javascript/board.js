var state = function(id, name) {
	var id;
	var name;
	
	return {
		id: id,
		name: name,
	
		render: function() {
			return $('<div></div>').addClass('task').text(name);
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
			return $('<div></div>').addClass('task').text(name);
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

	function renderHeader() {
		var header = $('<tr><th></th></tr>');
		$.each(states, function(s, state) { 
			header.append($('<th></th>').addClass('state').addClass(state.id).text(state.name));
		});
		return header;
	}
	
	function renderStories() {
		var storyBody = $('<tbody></tbody>');
		$.each(stories, function(key, story) {
			var row = $('<tr></tr>').attr('id', story.prio).
				append($('<td></td>').addClass('story').
				append(story.render()).
				append($('<a></a>').attr('href','#task').text('+ Task').click(function() { 
					$('#storyForm').hide();
					$('#taskForm').show();
				})));
		
			$.each(states, function(s, state) { 
				var column = $('<td></td>');
				
				$.each(story.tasks, function(key, task) {
					if(task.state == state.id) {
						column.append(task.render());
					}
				});
				
				row.append(column);
			});
			
			storyBody.append(row);
		});
		return storyBody;
	}
	
	return {
		// public interface
		init: function(persistedStates, persistedStories) {
			stories = persistedStories;
			states = persistedStates;
		},
		
		addStory: function(story){
			stories.push(story);
		},
		
		addTask: function(task, story){
			story.addTask(task);
		},
		
		addState: function(state){
			states.push(state);
		},
		
		render: function(container){
			$.each(states, function(s, state) {
				 $('#states').append($('<option></option>').attr('value', state.id).text(state.name));	
			});
			$.each(stories, function(key, story) {
				 $('#stories').append($('<option></option>').attr('value', story.name).text(story.name));
			});

			$('body').append($('<a></a>').attr('href','#story').attr('id','addStory').text('+ Story').click(function() { 
				$('#taskForm').hide();
				$('#storyForm').show();
			}));
			
			// board
			$('body').append($('<table></table>').attr('id', 'board').append(renderHeader()).append(renderStories()));
			$('#board').tableDnD({dragHandle: 'story', onDragClass: 'dragRow', 
				onDrop: function(table, row) {
					$('#board tr').not(':first').each(function(i, row) {
						var prio = i+1;
						var story = stories[row.id-1];
						
						if(prio != story.prio) {
							dao.updatePriority(story.prio, prio);
							story.prio = prio;
						}
					});
				}
			});
			$('.story').hover(function() {
				$(this).addClass('dragHandle');
			}, function() {
				$(this).removeClass('dragHandle');
			});
		},		
		
		reset: function(container){
			$("#addStory").remove();
			$("#board").remove();
			stories = [];
			states = [];
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
		
		findAllStates: function(){
			var s1 = new state("n","New");
			var s2 = new state("pr","Product Management");
			var s3 = new state("d","Desin");
			var s4 = new state("dev","Development");
			var s5 = new state("t","Test");
			var s6 = new state("r","Release");
			
			return [s1, s2, s3, s4, s5, s6];
		},
		
		updatePriority: function(oPrio, nPrio) {
			//alert('old: ' + oPrio + ', new: ' + nPrio);
		}
	};
}();

$(document).ready(function() {
	board.init(dao.findAllStates(), dao.findAllStories());
	board.render();
});

function load()
{
	var	location = $('#location').val();
	$.getJSON(location, 
				function(data)
				{
					board.reset();
					$.each(data.states, function(i,item)
										{
											board.addState(new state(item.id, item.name));
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
			);
}