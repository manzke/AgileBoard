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
			header.append($('<th></th>').addClass('state').css("background-color", state.color).text(state.name));
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
		save: function(id){
			var location = $(id).val();
			console.log("saving to "+location+" if online: "+isOnline);
			save(location, isOnline, states, stories);
		},
		
		load: function(id){
			var location = $(id).val();
			console.log("loading from "+location+" if online: "+isOnline);
			load(location, isOnline);
		},

		addState: function(state){
			states.push(state);
		},

		addStory: function(story){
			stories.push(story);
		},
		
		addTask: function(task, story){
			story.addTask(task);
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

$(document).ready(function() {
	$(document.body).bind("online", checkNetworkStatus);
    $(document.body).bind("offline", checkNetworkStatus);

	var location = getQueryVariable("location");
	if(location == null){
		$('#location').val("data.json");	
	}
	checkNetworkStatus();
	board.load('#location');
});

function save(location, isOnline, states, stories){
	/*if(isOnline){
			alert("Saving at a remote location is not implemented");
	}else{*/
		if (window.localStorage) {
			console.log("saving states: "+JSON.stringify(states));
			console.log("saving stories: "+JSON.stringify(stories));
			localStorage.setItem(location, JSON.stringify({"states":states,"stories":stories}));
		} else {
			alert("Your Browser does not support LocalStorage.");
		}		
	//}
}

function load(location, isOnline){
	if(isOnline){
		$.getJSON(location, parse);
	}else{
		if (window.localStorage) {
			var data = localStorage.getItem(location);
			parse(JSON.parse(data));
		} else {
			alert("Your Browser does not support LocalStorage.");
		}
	}
}

function parse(data){
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

function getQueryVariable(variable) { 
	var query = window.location.search.substring(1); 
	var vars = query.split("&"); 
	for (var i=0;i<vars.length;i++) { 
		var pair = vars[i].split("="); 
		if (pair[0] == variable) { 
			return pair[1]; 
		} 
	} 
	return null;
} 

function updateOnlineStatus(online) {
	isOnline = online;
	if(online){
		$('#feedback').append($('<span></span').addClass('ok').text('You are online!'));
	}else{
		$('#feedback').append($('<span></span').addClass('info').text('You are offline!'));
	}     
}   

function checkNetworkStatus() {
    if (navigator.onLine) {
        $.ajaxSetup({
            async: true,
            cache: false,
            dataType: "json",
            error: function (req, status, ex) {
                updateOnlineStatus(false);
            },
            success: function (data, status, req) {
                updateOnlineStatus(true);
            },
            timeout: 5000,
            type: "GET",
            url: "javascript/ping.json"
        });
        $.ajax();
    }
    else {
        updateOnlineStatus(false);
    }
} 