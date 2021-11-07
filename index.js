const express = require('express');
const app = express();
const ws = require('ws');

const port = process.env.PORT || 3000;

app.use('', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/html/index.html');
});

//testing
app.get('/test', (req, res) => {
	res.sendFile(__dirname + '/public/html/test.html');
});
//testing

const httpServer = app.listen(port);
const wsServer = new ws.Server({noServer: true});

httpServer.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});


let users_online = {};

function onMessage(message, socket) {
	let messageObj;
	try { messageObj = JSON.parse(message); }
	catch {
		console.log(`ws client with id: ${socket.id || 'undefined'} sent message that could not be parsed.
			Closing the socket...`);
		socket.close();
		return;
	}

	let name;

	switch (messageObj.type) {
		case "set-name":
			if (socket.plays) return;
			name = messageObj.name;
			if (users_online[name])
				socket.send(JSON.stringify({type: "set-name-result", result: "name-taken"}));
			else {
				users_online[name] = socket;
				socket.name = name;
				socket.send(JSON.stringify({type: "set-name-result", result: "ok"}));

				for (let user in users_online) {
					if (user == name) continue;
					users_online[user].send(JSON.stringify({type: "player-join", name: name}));
				}

				let names_list = [];
				for (let user in users_online) {
					if (user == name) continue;
					names_list.push(user);
				}
				socket.send(JSON.stringify({type: "current-player-list", names: names_list}));
			}
			break;

		case "play-request":
			if (socket.plays) return;
			name = messageObj.name;
			if (!name) return;

			if (users_online[name]) {
				socket.wants = name;

				if (users_online[name].wants == socket.name) {
					let color1 = Math.random() > 0.5 ? "white" : "black";
					let color2 = color1 == "white" ? "black" : "white";
					users_online[name].send(JSON.stringify({type: "get-ready-to-play", color: color1, name: socket.name}));
					socket.send(JSON.stringify({type: "get-ready-to-play", color: color2, name: name}));
				} else {
					users_online[name].send(JSON.stringify({type: "play-request-from", name: socket.name}));
				}
			}
			break;

		case "play-request-cancel":
			if (socket.plays) return;
			if (!socket.wants || !users_online[socket.wants]) return;
			name = socket.wants;
			delete socket.wants;
			users_online[name].send(JSON.stringify({type: "play-request-cancel-from", name: socket.name}));
			break;

		case "ready-to-play":
			if (socket.plays) return;
			if (!socket.wants || !socket.name || !users_online[socket.wants] || !users_online[socket.name]) return;
			if (socket.wants != users_online[socket.name].wants) return;

			socket.ready = true;
			if (!users_online[socket.wants].ready) return;

			name = socket.wants;
			delete socket.wants;
			delete users_online[name].wants;
			delete socket.ready;
			delete users_online[name].ready;

			socket.plays = name;
			users_online[name].plays = socket.name;
			break;

		case "end-game":
			if (!socket.plays || !users_online[socket.plays]) return;

			socket.send(JSON.stringify({type: "you-won"}));
			users_online[socket.plays].send(JSON.stringify({type: "you-lost"}));

			delete users_online[socket.plays].plays;
			delete socket.plays;
			break;

		case "resign":
			if (!socket.plays || !users_online[socket.plays]) return;

			users_online[socket.plays].send(JSON.stringify({type: "opponent-resigned"}));
			delete users_online[socket.plays].plays;
			delete socket.plays;
			break;

		case "move": case "fire":
			if (!socket.plays || !users_online[socket.plays].plays) return;

			users_online[socket.plays].send(JSON.stringify(messageObj));
			break;

	}
}

wsServer.on('connection', socket => {

	socket.on('close', () => {
		if (socket.name) {
			for (let user in users_online) {
				if (user == socket.name) continue;
				users_online[user].send(JSON.stringify({type: "player-leave", name: socket.name}));
				if (user == socket.plays) {
					delete users_online[user].plays;
					users_online[user].send(JSON.stringify({type: "opponent-disconnected"}));
				}
			}

			delete users_online[socket.name];
		}
	});

	socket.on('message', data => {
		onMessage(data.toString(), socket)
	});

	socket.alive = true;

	socket.on('pong', () => {
		socket.alive = true;
	});
});

const interval = setInterval(() => {
	wsServer.clients.forEach(socket => {
		if (!socket.alive) {
			if (socket.name) {
			delete users_online[socket.name];
				for (let user in users_online) {
					users_online[user].send(JSON.stringify({type: "player-leave", name: socket.name}));
					if (user == socket.plays) {
						delete users_online[user].plays;
						users_online[user].send(JSON.stringify({type: "opponent-disconnected"}));
					}
				}
			}
			socket.terminate();
			return;
		}

		socket.alive = false;
		socket.ping();
	});
}, 30000);

wsServer.on('close', () => {
	clearInterval(interval);
});