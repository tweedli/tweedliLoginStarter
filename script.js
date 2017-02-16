$(function (event) {
	console.log("script is on")

	var signupInfo = {}
	var loginInfo  = {}

	$('#signupSubmit').submit(function(event){
		event.preventDefault()
		signupInfo.username = $('#signupUsername').val()
		signupInfo.password = $('#signupPassword').val()

		$.ajax({
			type: 'post',
			url: '/auth/signup',
			dataType: 'json',
			data: signupInfo,
			success: function(info){
				$('#signupMessage').empty()
				$('#signupMessage').append('<div id="message">You have created an account with tweedli! Your username is ' + signupInfo.username)
				signupInfo = {}
			},
			error: function(info){
				$('#signupMessage').empty()
				$('#signupMessage').append('<div id="message">I\'m sorry, there seems to be an error with your request: ' + info.statusText)
				signupInfo = {}
			}
		})
	})

	$('#loginSubmit').submit(function(event){
		event.preventDefault()
		loginInfo.username = $('#loginUsername').val()
		loginInfo.password = $('#loginPassword').val()

		$.ajax({
			type: 'post',
			url: '/auth/login',
			dataType: 'json',
			data: loginInfo,
			success: function(info){
				$('#loginMessage').empty()
				$('#loginMessage').append('<div id="message">Logged in!</div>')
				loginInfo = {}
			},
			error: function(info){
				$('#loginMessage').empty()
				$('#loginMessage').append('<div id="message">I\'m sorry, your Username/Password combo is incorrect')
				loginInfo = {}
			}
		})
	})
});


