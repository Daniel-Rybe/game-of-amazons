'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BoardBackGround = function (_React$Component) {
  _inherits(BoardBackGround, _React$Component);

  function BoardBackGround(props) {
    _classCallCheck(this, BoardBackGround);

    //size
    return _possibleConstructorReturn(this, (BoardBackGround.__proto__ || Object.getPrototypeOf(BoardBackGround)).call(this, props));
  }

  _createClass(BoardBackGround, [{
    key: "render",
    value: function render() {
      return React.createElement("img", { className: "board-background",
        src: "../svg/board.svg",
        width: this.props.size,
        height: this.props.size });
    }
  }]);

  return BoardBackGround;
}(React.Component);

var Piece = function (_React$Component2) {
  _inherits(Piece, _React$Component2);

  function Piece(props) {
    _classCallCheck(this, Piece);

    var _this2 = _possibleConstructorReturn(this, (Piece.__proto__ || Object.getPrototypeOf(Piece)).call(this, props));
    //x, y, type, size


    _this2.state = { x: props.x, y: props.y };
    return _this2;
  }

  _createClass(Piece, [{
    key: "getSVGFromType",
    value: function getSVGFromType(type) {
      switch (type) {
        case "white":default:
          return "../svg/white_piece.svg";
        case "black":
          return "../svg/black_piece.svg";
        case "fire":case "fire-ghost":
          return "../svg/fire_piece.svg";
      }
    }
  }, {
    key: "render",
    value: function render() {
      var offset = (this.props.type == "fire-ghost") * 0.2 * this.props.size;
      return React.createElement("img", { className: "piece",
        style: { left: this.state.x + offset / 2, top: this.state.y + offset / 2,
          opacity: this.props.type == "fire-ghost" ? 0.5 : 1 },
        src: this.getSVGFromType(this.props.type),
        width: this.props.size - offset,
        height: this.props.size - offset });
    }
  }]);

  return Piece;
}(React.Component);

var ResignButton = function (_React$Component3) {
  _inherits(ResignButton, _React$Component3);

  function ResignButton(props) {
    _classCallCheck(this, ResignButton);

    //boardHeight
    return _possibleConstructorReturn(this, (ResignButton.__proto__ || Object.getPrototypeOf(ResignButton)).call(this, props));
  }

  _createClass(ResignButton, [{
    key: "onClick",
    value: function onClick() {
      ws.send(JSON.stringify({ type: "resign" }));
      ReactDOM.render(React.createElement(List, { width: "300", elemHeight: "30" }), mainContainer, function (ref) {
        users_list = ref;
      });
      game_board = undefined;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "p",
        { className: "resign-button",
          style: { left: 0, top: this.props.boardHeight },
          width: "60",
          height: "30",
          onClick: this.onClick },
        "Resign"
      );
    }
  }]);

  return ResignButton;
}(React.Component);

var Board = function (_React$Component4) {
  _inherits(Board, _React$Component4);

  function Board(props) {
    _classCallCheck(this, Board);

    var _this4 = _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).call(this, props));
    //size myColor


    _this4.state = {
      pieces: [{ x: 0, y: 2, type: "white" }, { x: 5, y: 3, type: "white" }, { x: 3, y: 0, type: "black" }, { x: 2, y: 5, type: "black" }],
      phase: props.myColor == "white" ? 0 : 2,
      activePieceIndex: -1 };

    _this4.cellSize = _this4.props.size / 6;
    _this4.key = 0;

    _this4.onMouseDown = _this4.onMouseDown.bind(_this4);
    _this4.onMouseMove = _this4.onMouseMove.bind(_this4);
    _this4.onMouseUp = _this4.onMouseUp.bind(_this4);
    return _this4;
  }

  _createClass(Board, [{
    key: "onMouseDown",
    value: function onMouseDown(e) {
      if (this.state.phase != 0) return;

      var currentTargetRect = e.currentTarget.getBoundingClientRect();
      var x = (e.pageX - currentTargetRect.left) * 6 / this.props.size;
      var y = (e.pageY - currentTargetRect.top) * 6 / this.props.size;
      var i = ~~x;
      var j = ~~y;

      for (var k = 0; k < this.state.pieces.length; k++) {
        var piece = this.state.pieces[k];
        if (piece.x == i && piece.y == j) {
          if (piece.type != this.props.myColor) return;
          var newPieces = this.state.pieces.copyWithin();
          newPieces[k].x = x - 0.5;
          newPieces[k].y = y - 0.5;
          this.setState({ activePieceIndex: k, pieces: newPieces });
          this.lastI = i;
          this.lastJ = j;
        }
      }
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(e) {
      if (this.state.phase != 0) return;
      if (this.state.activePieceIndex == -1) return;

      var currentTargetRect = e.currentTarget.getBoundingClientRect();
      var x = (e.pageX - currentTargetRect.left) * 6 / this.props.size;
      var y = (e.pageY - currentTargetRect.top) * 6 / this.props.size;

      var newPieces = this.state.pieces.copyWithin();
      newPieces[this.state.activePieceIndex].x = x - 0.5;
      newPieces[this.state.activePieceIndex].y = y - 0.5;
      this.setState({ pieces: newPieces });
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(e) {
      if (this.state.phase == 0) {
        if (this.state.activePieceIndex == -1) return;

        var k = this.state.activePieceIndex;

        var newPieces = this.state.pieces.copyWithin();
        var x = ~~(newPieces[k].x + 0.5);
        var y = ~~(newPieces[k].y + 0.5);

        if (this.moveIsValid(x, y)) {
          newPieces[k].x = x;
          newPieces[k].y = y;
        } else {
          newPieces[k].x = this.lastI;
          newPieces[k].y = this.lastJ;
          this.setState({ pieces: newPieces, activePieceIndex: -1 });
          return;
        }

        ws.send(JSON.stringify({ type: "move", prevX: this.lastI, prevY: this.lastJ, newX: x, newY: y }));
        this.setState({ pieces: newPieces, phase: 1 });
      } else if (this.state.phase == 1) {
        var currentTargetRect = e.currentTarget.getBoundingClientRect();
        var _x = ~~((e.pageX - currentTargetRect.left) * 6 / this.props.size);
        var _y = ~~((e.pageY - currentTargetRect.top) * 6 / this.props.size);

        this.lastI = this.state.pieces[this.state.activePieceIndex].x;
        this.lastJ = this.state.pieces[this.state.activePieceIndex].y;

        if (this.moveIsValid(_x, _y)) {
          var _newPieces = this.state.pieces.copyWithin();
          _newPieces.push({ x: _x, y: _y, type: "fire" });

          ws.send(JSON.stringify({ type: "fire", x: _x, y: _y }));
          this.setState({ pieces: _newPieces, activePieceIndex: -1, phase: 2 });
        }
      }
    }
  }, {
    key: "moveIsValid",
    value: function moveIsValid(x, y) {
      if (x < 0 || x > 5 || y < 0 || y > 5) return false;
      if (x == this.lastI && y == this.lastJ) return false;
      if (!(x == this.lastI || y == this.lastJ || Math.abs(x - this.lastI) == Math.abs(y - this.lastJ))) return false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.state.pieces[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var piece = _step.value;

          if (~~piece.x != piece.x || ~~piece.y != piece.y) continue;
          if (piece.x == this.lastI && piece.y == this.lastJ) continue;

          if (piece.x < Math.min(x, this.lastI) || piece.x > Math.max(x, this.lastI) || piece.y < Math.min(y, this.lastJ) || piece.y > Math.max(y, this.lastJ)) continue;

          if ((piece.x - x) * (this.lastJ - y) == (piece.y - y) * (this.lastI - x)) return false;
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

      return true;
    }
  }, {
    key: "render",
    value: function render() {
      var pieces = [];

      for (var i = 0; i < this.state.pieces.length; i++) {
        if (i == this.state.activePieceIndex) continue;
        var piece = this.state.pieces[i];
        pieces.push(React.createElement(Piece, {
          x: piece.x * this.cellSize,
          y: piece.y * this.cellSize,
          type: piece.type,
          size: this.cellSize,
          key: this.key++ }));
      }

      if (this.state.phase == 0 || this.state.phase == 2) {
        if (this.state.activePieceIndex != -1) {
          var _piece = this.state.pieces[this.state.activePieceIndex];
          var offset = 0.1 * this.cellSize;
          pieces.push(React.createElement(Piece, {
            x: _piece.x * this.cellSize - offset / 2,
            y: _piece.y * this.cellSize - offset / 2,
            type: _piece.type,
            size: this.cellSize + offset,
            key: this.key++ }));
        }
      } else if (this.state.phase == 1) {
        if (this.state.activePieceIndex == -1) console.log("something isn't right...");

        var _piece2 = this.state.pieces[this.state.activePieceIndex];

        pieces.push(React.createElement(Piece, {
          x: _piece2.x * this.cellSize,
          y: _piece2.y * this.cellSize,
          type: _piece2.type,
          size: this.cellSize,
          key: this.key++ }));

        for (var _i = -1; _i <= 1; _i++) {
          for (var j = -1; j <= 1; j++) {
            if (_i == 0 && j == 0) continue;

            var x = _piece2.x + _i;
            var y = _piece2.y + j;

            while (x >= 0 && x <= 5 && y >= 0 && y <= 5) {

              var cellHasPiece = false;
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = this.state.pieces[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var _piece3 = _step2.value;

                  if (_piece3.x == x && _piece3.y == y) {
                    cellHasPiece = true;
                    break;
                  }
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }

              if (cellHasPiece) break;

              pieces.push(React.createElement(Piece, {
                x: x * this.cellSize,
                y: y * this.cellSize,
                type: "fire-ghost",
                size: this.cellSize,
                key: this.key++ }));

              x += _i;
              y += j;
            }
          }
        }
      }

      return React.createElement(
        "div",
        { className: "board",
          onMouseDown: this.onMouseDown,
          onMouseMove: this.onMouseMove,
          onMouseUp: this.onMouseUp },
        React.createElement(BoardBackGround, { size: this.props.size }),
        pieces,
        React.createElement(ResignButton, { boardHeight: this.props.size })
      );
    }
  }]);

  return Board;
}(React.Component);