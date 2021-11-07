

//let gameBoard = <Board size="600" myColor="white"/>;

//ReactDOM.render(gameBoard, document.querySelector('#board-container'));

let HOST = location.origin.replace(/^http/, 'ws')
let ws = new WebSocket(HOST, 'echo-protocol');

ws.addEventListener('message', event => {
	handleMessage(JSON.parse(event.data));
});

let mainContainer = document.querySelector("#main-container");
let users_online = [];
let users_list;
let game_board;
let name_input;

function handleMessage(messageObj) {
	console.log(messageObj);

	let newPieces;

	switch (messageObj.type) {
		case "set-name-result":
			if (messageObj.result == "ok")
				ReactDOM.render(<List width="300" elemHeight="30" />, mainContainer);
			name_input = undefined;
			break;

		case "current-player-list":
			users_online = messageObj.names.copyWithin();
			if (users_list)
				users_list.update();
			break;

		case "player-join":
			users_online.push(messageObj.name);
			if (users_list)
				users_list.update();
			break;

		case "player-leave":
			users_online.pop(messageObj.name);
			if (users_list)
				users_list.update();
			break;

		case "play-request-from":
			if (!users_list.buttons[messageObj.name]) return;
			users_list.buttons[messageObj.name].setState({type: "accept"});
			break;

		case "play-request-cancel-from":
			if (!users_list.buttons[messageObj.name]) return;
			users_list.buttons[messageObj.name].setState({type: "send"});
			break;

		case "get-ready-to-play":
			ReactDOM.render(<Board size="300" myColor={messageObj.color} />, mainContainer);
			users_list = undefined;
			ws.send(JSON.stringify({type: "ready-to-play"}));
			break;

		case "opponent-resigned":
			alert("Opponent resigned. You win!");
			ReactDOM.render(<List width="300" elemHeight="30" />, mainContainer);
			game_board = undefined;
			break;

		case "opponent-disconnected":
			alert("Opponent disconnected. You win!");
			ReactDOM.render(<List width="300" elemHeight="30" />, mainContainer);
			game_board = undefined;
			break;

		case "move":
			let prevX = messageObj.prevX;
			let prevY = messageObj.prevY;
			let newX = messageObj.newX;
			let newY = messageObj.newY;
			newPieces = game_board.state.pieces.copyWithin();

			for (let piece of newPieces) {
				if (piece.x == prevX && piece.y == prevY) {
					piece.x = newX;
					piece.y = newY;
					game_board.setState({pieces: newPieces});
					break;
				}
			}
			break;

		case "fire":
			let x = messageObj.x;
			let y = messageObj.y;
			newPieces = game_board.state.pieces.copyWithin();
			newPieces.push({x: x, y: y, type: "fire"});
			game_board.setState({pieces: newPieces, phase: 0});
			break;
	}
}

ReactDOM.render(<NameInput />, mainContainer);