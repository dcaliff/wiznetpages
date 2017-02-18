
var faviconBlueHREF = "TemplateData/favicon.ico";
var faviconRedHREF = "TemplateData/faviconRed.ico";

var chatInput = document.getElementById('chatInput');
var chatBox = document.getElementById("chatBox");
var gameCanvas = document.getElementById("canvas");
var favicon = document.getElementById('favicon');

var urlRegexString = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
var urlRegex = new RegExp(urlRegexString);

chatInput.onblur = function() {
   setTimeout(function() {
    chatInput.focus();
  }, 0);
};

var windowIsActive = true;
window.onfocus = function () { 
	windowIsActive = true; 
	stopFlashFavicon();
}; 

window.onblur = function () { 
	windowIsActive = false;
}; 

var m_username;

function onSubmit(msg) {
	SendMessage('ChatClient', 'SubmitMessage', msg);
}

function login(username, password) {
	SendMessage('ClientSession', 'RequestLogin', username + " " + password);
}

function loginSuccessful() {
	loggedIn = true;
}

function createUser(username, password) {
	SendMessage('ClientSession', 'RequestCreateUser', username + " " + password);
}

function sendChatMsg(msg) {
	SendMessage('ChatClient', 'SendChatMessage', msg);
}

function recieveChatMsg(username, playerColor, msg, color, atPlayer) {
	var newChatLine = "";
	if(username) {
		newChatLine += "<font color=\"" + playerColor + "\">";
		newChatLine += username + ":</font> ";
	}

	if(atPlayer) {
		console.log(windowIsActive + "window active");
		console.log("at this player");
		if(!windowIsActive) {
			flashFavicon();
		} else {
			flashFaviconOnce();
		}
	}

	var urlMatches = msg.match(urlRegex);
	if(urlMatches) {
		var url = urlMatches[0];
		if(url.indexOf("http://") < 0 && url.indexOf("https://") < 0) {
			url = "http://" + url;
		}
		var matchInd = msg.indexOf(urlMatches[0]);
		var hyperlinkOpen = "<a href=\"" + url + "\" target=\"_blank\">";
		var hyperlinkClose = "</a>";

		msg = msg.substr(0, matchInd) + hyperlinkOpen 
		+ msg.substr(matchInd, urlMatches[0].length) + hyperlinkClose 
		+ msg.substr(matchInd + urlMatches[0].length);
	}

	newChatLine += "<font color=\"" + color + "\">"+msg+"</font></br>";

	chatBox.innerHTML += newChatLine;
	chatBox.scrollTop = chatBox.scrollHeight;
}

var isFaviconRed = false;
var faviconFlashInterval;
function flashFavicon() {
	switchFavicon();
	faviconFlashInterval = setInterval(switchFavicon, 1000);
}

function flashFaviconOnce() {
	switchFavicon();
	setTimeout(switchFavicon, 1000);
}

function switchFavicon() {
	if(isFaviconRed) {
		isFaviconRed = false;
		favicon.href = faviconBlueHREF;
	} else {
		isFaviconRed = true;
		favicon.href = faviconRedHREF;
	}
}

function stopFlashFavicon() {
	if(faviconFlashInterval) {
		clearInterval(faviconFlashInterval);
	}
	isFaviconRed = false;
	favicon.href = faviconBlueHREF;
}

function setUsername(username) {	
	m_username = username;
}

chatInput.onkeydown = function(event) {

  	//enter
	if (event.keyCode == 13) { 
		onSubmit(chatInput.value); 
		chatInput.value = "";
		return false; 
	//left
	} else if (event.keyCode == 37) {
		SendMessage(m_username, 'RotateLeftStart');
		return false; 
	//right
	} else if (event.keyCode == 39) {
		SendMessage(m_username, 'RotateRightStart');
		return false; 
	//up
	} else if (event.keyCode == 38) {
		SendMessage(m_username, 'RotateUpStart');
		return false; 
	//down
	} else if (event.keyCode == 40) {
		SendMessage(m_username, 'RotateDownStart');
		return false; 
	}
};

chatInput.onkeyup = function(event) {
	//left
	if (event.keyCode == 37) {
		SendMessage(m_username, 'RotateLeftStop');
		return false; 
	//right
	} else if (event.keyCode == 39) {
		SendMessage(m_username, 'RotateRightStop');
		return false; 
	//up
	} else if (event.keyCode == 38) {
		SendMessage(m_username, 'RotateUpStop');
		return false; 
	//down
	} else if (event.keyCode == 40) {
		SendMessage(m_username, 'RotateDownStop');
		return false; 
	}
};

/*function hackWebGLKeyboard ()
 {
     var webGLInput = chatInput;
     for (var i in JSEvents.eventHandlers)
     {
         var event = JSEvents.eventHandlers[i];
         if (event.eventTypeString == 'keydown' || event.eventTypeString == 'keypress' || event.eventTypeString == 'keyup')
         {
             webGLInput.addEventListener(event.eventTypeString, event.eventListenerFunc, event.useCapture);
             window.removeEventListener(event.eventTypeString, event.eventListenerFunc, event.useCapture);
         }
     }

     var event = new MouseEvent('click', {
    'view': window,
    'bubbles': true,
    'cancelable': true
  });
  var cb = document.querySelector('input[type=submit][name=btnK]'); 
  var canceled = !cb.dispatchEvent(event);
 }*/

 /*chatInput.onkeypress = function forwardKey (e) {
 	var evt = document.createEvent("KeyboardEvent");
  evt.initKeyboardEvent("keypress", true, true, window,
                    0, 0, 0, 0,
                    0, e.keyCode);
  var canceled = !gameCanvas.dispatchEvent(evt);
 	//chatInput.dispatchEvent(e);
 	//return true;
 }*/