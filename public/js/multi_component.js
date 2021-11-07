var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MultiComponent = function (_React$Component) {
	_inherits(MultiComponent, _React$Component);

	function MultiComponent(props) {
		_classCallCheck(this, MultiComponent);

		var _this = _possibleConstructorReturn(this, (MultiComponent.__proto__ || Object.getPrototypeOf(MultiComponent)).call(this, props));
		//boardSize listWidth listElemHeight


		_this.state = { mode: "name-input", boardColor: "white" };
		_this.elements = {};

		mainComponent = _this;
		return _this;
	}

	_createClass(MultiComponent, [{
		key: "render",
		value: function render() {
			switch (this.state.mode) {
				case "users-list":
					delete this.elements["game-board"];
					delete this.elements["name-input"];
					return React.createElement(List, { width: this.props.listWidth,
						elemHeight: this.props.listElemHeight,
						elements: this.elements });
				case "game-board":
					delete this.elements["users-list"];
					delete this.elements["name-input"];
					return React.createElement(Board, { size: this.props.boardSize,
						myColor: this.state.boardColor,
						elements: this.elements });
				case "name-input":
					delete this.elements["users-list"];
					delete this.elements["game-board"];
					return React.createElement(NameInput, { elements: this.elements, width: "300" });
			}
		}
	}]);

	return MultiComponent;
}(React.Component);