var btn_send = By.id('btn-send'),
	input_text = By.id('input-text'),
	chat_area = By.id('chat-area');



var nickname = prompt("Please enter a nickname");
xhr.request('POST', {
	url: '/join',
	data: {nickname: nickname},
	success: function(res) {
		console.log(res.responseText);
	}
});

