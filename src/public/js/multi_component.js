class MultiComponent extends React.Component {
	constructor(props) {
		//boardSize listWidth listElemHeight
		super(props);
		this.state = {mode: "name-input", boardColor: "white"};
		this.elements = {};

		mainComponent = this; 
	}

	render() {
		switch (this.state.mode) {
			case "users-list":
				delete this.elements["game-board"];
				delete this.elements["name-input"];
				return (<List width={this.props.listWidth}
					elemHeight={this.props.listElemHeight}
					elements={this.elements} />);
			case "game-board":
				delete this.elements["users-list"];
				delete this.elements["name-input"];
				return (<Board size={this.props.boardSize}
					myColor={this.state.boardColor}
					elements={this.elements} />);
			case "name-input":
				delete this.elements["users-list"];
				delete this.elements["game-board"];
				return (<NameInput elements={this.elements} width="300"/>);
		}
	}
}