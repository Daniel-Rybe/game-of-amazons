

//let gameBoard = <Board size="600" myColor="white"/>;

//ReactDOM.render(gameBoard, document.querySelector('#board-container'));

var HOST = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(HOST, 'echo-protocol');

ws.addEventListener('message', function (event) {
	handleMessage(JSON.parse(event.data));
});

var mainContainer = document.querySelector("#main-container");
var users_online = [];
var users_list = void 0;
var game_board = void 0;

function handleMessage(messageObj) {
	console.log(messageObj);

	var newPieces = void 0;

	switch (messageObj.type) {
		case "set-name-result":
			if (messageObj.result == "ok") ReactDOM.render(React.createElement(List, { width: '300', elemHeight: '30' }), mainContainer, function (ref) {
				users_list = ref;
			});
			nameInput = undefined;
			break;

		case "current-player-list":
			users_online = messageObj.names.copyWithin();
			if (users_list) users_list.update();
			break;

		case "player-join":
			users_online.push(messageObj.name);
			if (users_list) users_list.update();
			break;

		case "player-leave":
			users_online.pop(messageObj.name);
			if (users_list) users_list.update();
			break;

		case "play-request-from":
			if (!users_list.buttons[messageObj.name]) return;
			users_list.buttons[messageObj.name].setState({ type: "accept" });
			break;

		case "play-request-cancel-from":
			if (!users_list.buttons[messageObj.name]) return;
			users_list.buttons[messageObj.name].setState({ type: "send" });
			break;

		case "get-ready-to-play":
			ReactDOM.render(React.createElement(Board, { size: '300', myColor: messageObj.color }), mainContainer, function (ref) {
				game_board = ref;
			});
			users_list = undefined;
			ws.send(JSON.stringify({ type: "ready-to-play" }));
			break;

		case "opponent-resigned":
			alert("Opponent resigned. You win!");
			ReactDOM.render(React.createElement(List, { width: '300', elemHeight: '30' }), mainContainer, function (ref) {
				users_list = ref;
			});
			game_board = undefined;
			break;

		case "opponent-disconnected":
			alert("Opponent disconnected. You win!");
			ReactDOM.render(React.createElement(List, { width: '300', elemHeight: '30' }), mainContainer, function (ref) {
				users_list = ref;
			});
			game_board = undefined;
			break;

		case "move":
			var prevX = messageObj.prevX;
			var prevY = messageObj.prevY;
			var newX = messageObj.newX;
			var newY = messageObj.newY;
			newPieces = game_board.state.pieces.copyWithin();

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = newPieces[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var piece = _step.value;

					if (piece.x == prevX && piece.y == prevY) {
						piece.x = newX;
						piece.y = newY;
						game_board.setState({ pieces: newPieces });
						break;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			break;

		case "fire":
			var x = messageObj.x;
			var y = messageObj.y;
			newPieces = game_board.state.pieces.copyWithin();
			newPieces.push({ x: x, y: y, type: "fire" });
			game_board.setState({ pieces: newPieces, phase: 0 });
			break;
	}
}

var nameInput = void 0;
ReactDOM.render(React.createElement(NameInput, null), mainContainer, function (ref) {
	nameInput = ref;
});