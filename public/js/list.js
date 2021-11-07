var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListButton = function (_React$Component) {
	_inherits(ListButton, _React$Component);

	function ListButton(props) {
		_classCallCheck(this, ListButton);

		var _this = _possibleConstructorReturn(this, (ListButton.__proto__ || Object.getPrototypeOf(ListButton)).call(this, props));
		//width height name buttons onclick


		_this.state = { bgState: "inactive", type: "send" };
		_this.onMouseOver = _this.onMouseOver.bind(_this);
		_this.onMouseOut = _this.onMouseOut.bind(_this);
		_this.onMouseDown = _this.onMouseDown.bind(_this);
		_this.onMouseUp = _this.onMouseUp.bind(_this);

		_this.props.buttons[_this.props.name] = _this;
		_this.onClick = _this.props.onclick;
		return _this;
	}

	_createClass(ListButton, [{
		key: "onClick",
		value: function onClick(name) {}
	}, {
		key: "onMouseOver",
		value: function onMouseOver(event) {
			this.setState({ bgState: "hover" });
		}
	}, {
		key: "onMouseOut",
		value: function onMouseOut(event) {
			this.setState({ bgState: "inactive" });
		}
	}, {
		key: "onMouseDown",
		value: function onMouseDown(event) {
			this.setState({ bgState: "active" });
		}
	}, {
		key: "onMouseUp",
		value: function onMouseUp(event) {
			this.setState({ bgState: "hover" });
			this.onClick(this.props.name);
		}
	}, {
		key: "render",
		value: function render() {
			var buttonSrc = "../svg/send_button.svg";
			if (this.state.type == "accept") buttonSrc = "../svg/accept_button.svg";
			if (this.state.type == "cancel") buttonSrc = "../svg/cancel_button.svg";

			var bgSrc = "../svg/inactive_bg.svg";
			if (this.state.bgState == "hover") bgSrc = "../svg/hover_bg.svg";
			if (this.state.bgState == "active") bgSrc = "../svg/active_bg.svg";

			return React.createElement(
				"div",
				{ className: "button-wrapper",
					onMouseOver: this.onMouseOver,
					onMouseOut: this.onMouseOut,
					onMouseDown: this.onMouseDown,
					onMouseUp: this.onMouseUp },
				React.createElement("img", { src: bgSrc,
					className: "challenge-button-bg",
					width: this.props.height,
					height: this.props.height,
					style: { left: this.props.width - this.props.height, top: 0 } }),
				React.createElement("img", { src: buttonSrc,
					className: "challenge-button",
					width: this.props.height,
					height: this.props.height,
					style: { left: this.props.width - this.props.height, top: 0 } })
			);
		}
	}]);

	return ListButton;
}(React.Component);

var ListItem = function (_React$Component2) {
	_inherits(ListItem, _React$Component2);

	function ListItem(props) {
		_classCallCheck(this, ListItem);

		//name, width, height, buttons onclick
		return _possibleConstructorReturn(this, (ListItem.__proto__ || Object.getPrototypeOf(ListItem)).call(this, props));
	}

	_createClass(ListItem, [{
		key: "render",
		value: function render(props) {
			return React.createElement(
				"div",
				{ className: "list-item-wrapper" },
				React.createElement(
					"span",
					{ className: "list-name",
						style: { width: this.props.width - this.props.height, height: this.props.height } },
					this.props.name
				),
				React.createElement(ListButton, { width: this.props.width,
					height: this.props.height,
					name: this.props.name,
					buttons: this.props.buttons,
					onclick: this.props.onclick })
			);
		}
	}]);

	return ListItem;
}(React.Component);

var List = function (_React$Component3) {
	_inherits(List, _React$Component3);

	function List(props) {
		_classCallCheck(this, List);

		var _this3 = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));
		//width, elemHeight elements


		_this3.state = { elems: users_online.copyWithin() };
		_this3.buttons = {};

		_this3.onclick = _this3.onclick.bind(_this3);

		_this3.props.elements["users_list"] = _this3;
		return _this3;
	}

	_createClass(List, [{
		key: "onclick",
		value: function onclick(name) {
			if (!users_online || !users_online.includes(name)) return;

			if (this.buttons[name].state.type == "send") {
				ws.send(JSON.stringify({ type: "play-request", name: name }));
				this.buttons[name].setState({ type: "cancel" });
			} else if (this.buttons[name].state.type == "accept") ws.send(JSON.stringify({ type: "play-request", name: name }));else if (this.buttons[name].state.type == "cancel") {
				ws.send(JSON.stringify({ type: "play-request-cancel", name: name }));
				this.buttons[name].setState({ type: "send" });
			}
		}
	}, {
		key: "update",
		value: function update() {
			this.setState({ elems: users_online.copyWithin() });
		}
	}, {
		key: "render",
		value: function render() {
			var listItems = [];
			var key = 0;

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.state.elems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var elemName = _step.value;

					listItems.push(React.createElement(ListItem, { name: elemName,
						width: this.props.width - 6,
						height: this.props.elemHeight,
						buttons: this.buttons,
						onclick: this.onclick,
						key: key++ }));
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

			return React.createElement(
				"div",
				{ className: "list-wrapper",
					style: { left: (window.innerWidth - this.props.width) / 2, top: 50, height: window.innerHeight - 100 } },
				React.createElement(
					"span",
					null,
					listItems.length > 0 ? "Players online:" : "Nobody's online right now :("
				),
				listItems
			);
		}
	}]);

	return List;
}(React.Component);