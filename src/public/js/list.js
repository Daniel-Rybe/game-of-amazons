class ListButton extends React.Component {
	constructor(props) {
		//width height name buttons onclick
		super(props);

		this.state = {bgState: "inactive", type: "send"};
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);

		this.props.buttons[this.props.name] = this;
		this.onClick = this.props.onclick;
	}

	onClick(name) {}

	onMouseOver(event) {
		this.setState({bgState: "hover"});
	}

	onMouseOut(event) {
		this.setState({bgState: "inactive"});
	}

	onMouseDown(event) {
		this.setState({bgState: "active"});
	}

	onMouseUp(event) {
		this.setState({bgState: "hover"});
		this.onClick(this.props.name);
	}

	render() {
		let buttonSrc = "../svg/send_button.svg";
		if (this.state.type == "accept")
			buttonSrc = "../svg/accept_button.svg";
		if (this.state.type == "cancel")
			buttonSrc = "../svg/cancel_button.svg";

		let bgSrc = "../svg/inactive_bg.svg";
		if (this.state.bgState == "hover")
			bgSrc = "../svg/hover_bg.svg";
		if (this.state.bgState == "active")
			bgSrc = "../svg/active_bg.svg";

		return (
			<div className="button-wrapper"
			onMouseOver={this.onMouseOver}
			onMouseOut={this.onMouseOut}
			onMouseDown={this.onMouseDown}
			onMouseUp={this.onMouseUp}>
				<img src={bgSrc}
				className="challenge-button-bg"
				width={this.props.height}
				height={this.props.height}
				style={{left: this.props.width - this.props.height, top: 0}} />

				<img src={buttonSrc}
				className="challenge-button"
				width={this.props.height}
				height={this.props.height}
				style={{left: this.props.width - this.props.height, top: 0}} />
			</div>
		);
	}
}

class ListItem extends React.Component {
	constructor(props) {
		//name, width, height, buttons onclick, id
		super(props);
	}

	render(props) {
		return (
			<div className="list-item-wrapper"
			style={{left: 0, top: this.props.height * this.props.id}}>
				<span className="list-name"
				style={{width: this.props.width - this.props.height, height: this.props.height}} >
				{this.props.name}
				</span>

				<ListButton width={this.props.width}
				height={this.props.height}
				name={this.props.name}
				buttons={this.props.buttons}
				onclick={this.props.onclick} /> 

			</div>
		);
	}
}

class List extends React.Component {
	constructor(props) {
		//width, elemHeight
		super(props);

		this.state = {elems: users_online.copyWithin()};
		this.buttons = {};

		this.onclick = this.onclick.bind(this);

		users_list = this;
	}

	onclick(name) {
		if (!users_online || !users_online.includes(name)) return;

		if (this.buttons[name].state.type == "send") {
			ws.send(JSON.stringify({type: "play-request", name: name}));
			this.buttons[name].setState({type: "cancel"});
		}
		else if (this.buttons[name].state.type == "accept")
			ws.send(JSON.stringify({type: "play-request", name: name}));

		else if (this.buttons[name].state.type == "cancel") {
			ws.send(JSON.stringify({type: "play-request-cancel", name: name}));
			this.buttons[name].setState({type: "send"});
		}
	}

	update() {
		this.setState({elems: users_online.copyWithin()});
	}

	render() {
		let listItems = [];
		let id = 0;
		let key = 0;

		for (let elemName of this.state.elems) {
			listItems.push(
				<ListItem name={elemName}
				width={this.props.width}
				height={this.props.elemHeight}
				buttons={this.buttons}
				onclick={this.onclick}
				id={id++}
				key={key++} />
			);
		}

		return (
			<div className="list-wrapper">
				{listItems}
			</div>
		);
	}
}