'use strict';

class BoardBackGround extends React.Component {
  constructor(props) {
    //size
    super(props);
  }

  render() {
    return (
        <img className="board-background"
        src="../svg/board.svg"
        width={this.props.size}
        height={this.props.size} />
    );
  }
}

class Piece extends React.Component {

  constructor(props) {
    //x, y, type, size
    super(props);

    this.state = {x: props.x, y: props.y};
  }

  getSVGFromType(type) {
    switch(type) {
      case "white": default:
        return "../svg/white_piece.svg";
      case "black":
        return "../svg/black_piece.svg";
      case "fire": case "fire-ghost":
        return "../svg/fire_piece.svg";
    }
  }

  render() {
    let offset = (this.props.type == "fire-ghost") * 0.2 * this.props.size;
    return (
      <img className="piece"
      style={{left: this.state.x + offset / 2, top: this.state.y + offset / 2,
        opacity: this.props.type == "fire-ghost" ? 0.5: 1}}
      src={this.getSVGFromType(this.props.type)}
      width={this.props.size - offset}
      height={this.props.size - offset} />
    );
  }
}

class ResignButton extends React.Component {
  constructor(props) {
    //boardHeight
    super(props);
  }

  onClick() {
    ws.send(JSON.stringify({type:"resign"}));
    ReactDOM.render(<List width="300" elemHeight="30" />, mainContainer, (ref) => {users_list = ref});
    game_board = undefined;
  }

  render() {
    return (
      <p className="resign-button"
      style={{left: 0, top: this.props.boardHeight}}
      width="60"
      height="30"
      onClick={this.onClick} >
      Resign
      </p>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    //size myColor
    super(props);

    this.state = {
      pieces: [
      {x: 0, y: 2, type: "white"},
      {x: 5, y: 3, type: "white"},
      {x: 3, y: 0, type: "black"},
      {x: 2, y: 5, type: "black"}
      ],
      phase: props.myColor == "white" ? 0 : 2,
      activePieceIndex: -1};

    this.cellSize = this.props.size / 6;
    this.key = 0;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    game_board = this;
  }

  onMouseDown(e) {
    if (this.state.phase != 0) return;

    let currentTargetRect = e.currentTarget.getBoundingClientRect();
    let x = (e.pageX - currentTargetRect.left) * 6 / this.props.size;
    let y = (e.pageY - currentTargetRect.top) * 6 / this.props.size;
    let i = ~~x;
    let j = ~~y;
    
    for (let k = 0; k < this.state.pieces.length; k++) {
      let piece = this.state.pieces[k];
      if (piece.x == i && piece.y == j) {
        if (piece.type != this.props.myColor) return;
        let newPieces = this.state.pieces.copyWithin();
        newPieces[k].x = x - 0.5;
        newPieces[k].y = y - 0.5;
        this.setState({activePieceIndex: k, pieces: newPieces});
        this.lastI = i;
        this.lastJ = j;
      }
    }
  }

  onMouseMove(e) {
    if (this.state.phase != 0) return;
    if (this.state.activePieceIndex == -1) return;

    let currentTargetRect = e.currentTarget.getBoundingClientRect();
    let x = (e.pageX - currentTargetRect.left) * 6 / this.props.size;
    let y = (e.pageY - currentTargetRect.top) * 6 / this.props.size;

    let newPieces = this.state.pieces.copyWithin();
    newPieces[this.state.activePieceIndex].x = x - 0.5;
    newPieces[this.state.activePieceIndex].y = y - 0.5;
    this.setState({pieces: newPieces});
  }

  onMouseUp(e) {
    if (this.state.phase == 0) {
      if (this.state.activePieceIndex == -1) return;

      let k = this.state.activePieceIndex;

      let newPieces = this.state.pieces.copyWithin();
      let x = ~~(newPieces[k].x + 0.5);
      let y = ~~(newPieces[k].y + 0.5);

      if (this.moveIsValid(x, y)) {
        newPieces[k].x = x;
        newPieces[k].y = y;   
      } else {
        newPieces[k].x = this.lastI;
        newPieces[k].y = this.lastJ;
        this.setState({pieces: newPieces, activePieceIndex: -1});
        return;
      }

      ws.send(JSON.stringify({type: "move", prevX: this.lastI, prevY: this.lastJ, newX: x, newY: y}));
      this.setState({pieces: newPieces, phase: 1});
    }
    else if (this.state.phase == 1) {
      let currentTargetRect = e.currentTarget.getBoundingClientRect();
      let x = ~~((e.pageX - currentTargetRect.left) * 6 / this.props.size);
      let y = ~~((e.pageY - currentTargetRect.top) * 6 / this.props.size);

      this.lastI = this.state.pieces[this.state.activePieceIndex].x;
      this.lastJ = this.state.pieces[this.state.activePieceIndex].y;

      if (this.moveIsValid(x, y)) {
        let newPieces = this.state.pieces.copyWithin();
        newPieces.push({x: x, y: y, type: "fire"});

        ws.send(JSON.stringify({type: "fire", x: x, y: y}));
        this.setState({pieces: newPieces, activePieceIndex: -1, phase: 2});
      }
    }
  }

  moveIsValid(x, y) {
    if (x < 0 || x > 5 || y < 0 || y > 5) return false;
    if (x == this.lastI && y == this.lastJ) return false;
    if (!(x == this.lastI || y == this.lastJ || Math.abs(x - this.lastI) == Math.abs(y - this.lastJ))) return false;
    for (let piece of this.state.pieces) {
      if (~~piece.x != piece.x || ~~piece.y != piece.y) continue;
      if (piece.x == this.lastI && piece.y == this.lastJ) continue;

      if (piece.x < Math.min(x, this.lastI) || piece.x > Math.max(x, this.lastI) ||
          piece.y < Math.min(y, this.lastJ) || piece.y > Math.max(y, this.lastJ))
        continue;

      if ((piece.x - x) * (this.lastJ - y) == (piece.y - y) * (this.lastI - x))
        return false;
    }

    return true;
  }

  render() {
    let pieces = [];

    for (let i = 0; i < this.state.pieces.length; i++) {
      if (i == this.state.activePieceIndex) continue;
      let piece = this.state.pieces[i];
      pieces.push(
        <Piece
        x={piece.x * this.cellSize}
        y={piece.y * this.cellSize}
        type={piece.type}
        size={this.cellSize}
        key={this.key++} />
      );
    }

    if (this.state.phase == 0 || this.state.phase == 2) {
      if (this.state.activePieceIndex != -1) {
        let piece = this.state.pieces[this.state.activePieceIndex];
        let offset = 0.1 * this.cellSize;
        pieces.push(
          <Piece
          x={piece.x * this.cellSize - offset / 2}
          y={piece.y * this.cellSize - offset / 2}
          type={piece.type}
          size={this.cellSize + offset}
          key={this.key++} />
        );
      }
    }
    else if (this.state.phase == 1) {
      if (this.state.activePieceIndex == -1)
        console.log("something isn't right...");

      let piece = this.state.pieces[this.state.activePieceIndex];

      pieces.push(
        <Piece
        x={piece.x * this.cellSize}
        y={piece.y * this.cellSize}
        type={piece.type}
        size={this.cellSize}
        key={this.key++} />
       );

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i == 0 && j == 0) continue;

          let x = piece.x + i;
          let y = piece.y + j;

          while (x >= 0 && x <= 5 && y >= 0 && y <= 5) {

            let cellHasPiece = false;
            for (let piece of this.state.pieces)
              if (piece.x == x && piece.y == y) {
                cellHasPiece = true;
                break;
              }

            if (cellHasPiece) break;

            pieces.push(
              <Piece
                x={x * this.cellSize}
                y={y * this.cellSize}
                type="fire-ghost"
                size={this.cellSize}
                key={this.key++} />
            );

            x += i;
            y += j;
          }
        }
      }
    }

    return (
      <div className="board"
      onMouseDown={this.onMouseDown}
      onMouseMove={this.onMouseMove}
      onMouseUp={this.onMouseUp}>
        <BoardBackGround size={this.props.size} />
        {pieces}
        <ResignButton boardHeight={this.props.size} />
      </div>
    );
  }
}