var HOST = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(HOST, 'echo-protocol');

ws.addEventListener('message', function (event) {
	handleMessage(JSON.parse(event.data));
});

var mainContainer = document.querySelector("#main-container");
var users_online = [];
var mainComponent = void 0;

function handleMessage(messageObj) {

	var newPieces = void 0;

	switch (messageObj.type) {
		case "set-name-result":
			if (messageObj.result == "ok") mainComponent.setState({ mode: "users-list" });
			break;

		case "current-player-list":
			users_online = messageObj.names.copyWithin();
			if (mainComponent.elements["users_list"]) mainComponent.elements["users_list"].update();
			break;

		case "player-join":
			users_online.push(messageObj.name);
			if (mainComponent.elements["users_list"]) mainComponent.elements["users_list"].update();
			break;

		case "player-leave":
			users_online.pop(messageObj.name);
			if (mainComponent.elements["users_list"]) mainComponent.elements["users_list"].update();
			break;

		case "play-request-from":
			if (!mainComponent.elements["users_list"].buttons[messageObj.name]) return;
			mainComponent.elements["users_list"].buttons[messageObj.name].setState({ type: "accept" });
			break;

		case "play-request-cancel-from":
			if (!mainComponent.elements["users_list"].buttons[messageObj.name]) return;
			mainComponent.elements["users_list"].buttons[messageObj.name].setState({ type: "send" });
			break;

		case "get-ready-to-play":
			mainComponent.setState({ mode: "game-board", boardColor: messageObj.color });
			ws.send(JSON.stringify({ type: "ready-to-play" }));
			break;

		case "opponent-resigned":
			alert("Opponent resigned. You win!");
			mainComponent.setState({ mode: "users-list" });
			break;

		case "opponent-disconnected":
			alert("Opponent disconnected. You win!");
			mainComponent.setState({ mode: "users-list" });
			break;

		case "move":
			var prevX = messageObj.prevX;
			var prevY = messageObj.prevY;
			var newX = messageObj.newX;
			var newY = messageObj.newY;
			newPieces = mainComponent.elements["game-board"].state.pieces.copyWithin();

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = newPieces[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var piece = _step.value;

					if (piece.x == prevX && piece.y == prevY) {
						piece.x = newX;
						piece.y = newY;
						mainComponent.elements["game-board"].setState({ pieces: newPieces });
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
			newPieces = mainComponent.elements["game-board"].state.pieces.copyWithin();
			newPieces.push({ x: x, y: y, type: "fire" });
			mainComponent.elements["game-board"].setState({ pieces: newPieces, phase: 0 });
			break;

		case "you-won":
			alert("You win!");
			mainComponent.setState({ mode: "users-list" });
			break;

		case "you-lost":
			alert("You lose!");
			mainComponent.setState({ mode: "users-list" });
			break;
	}
}

ReactDOM.render(React.createElement(MultiComponent, { boardSize: '500', listWidth: '300', listElemHeight: '30' }), mainContainer);

function onResize(event) {
	mainComponent.setState({});
}

window.addEventListener("resize", onResize);