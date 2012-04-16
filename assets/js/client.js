var btn_send = By.id('btn-send'),
	input_text = By.id('input-text'),
	chat_area = By.id('chat-area');

var last_message = 0,
	username = null,
	id = null;



listener.add(btn_send, 'click', function() {
	xhr.post({
		url: '/send',
		data: {text: input_text.value, name: username}
	});
	input_text.value = "";
});

function join() {
	var name = prompt('please enter a username');
	if( name != '' ) {
		xhr.post({
			url: '/join',
			data: {name: name},
			success: function(data) {
				var userdata = JSON.parse(data.responseText);
				username = userdata.name;
				id = userdata.id;
				poll();
			}
		});
	} else {
		alert('you cannot chat without a name');
		join();
	}
}

function poll() {
	xhr.post({
		url: '/recv',
		data: {'since': last_message},
		success: function(data) {
			var messages = JSON.parse(data.responseText);
			if( messages.length > 0 ) {
				messages.forEach(function(message) {
					chat_area.innerHTML += "<div><span>" + message.user + "</span><span>" + message.timestamp + "</span><span>" + message.text + "</span></div>";
				});
				last_message = (new Date()).getTime();
			}
			setTimeout(poll, 10);
		},
		failure: function(){
			setTimeout(poll, 1000*10);
		}
	});
}
join();
