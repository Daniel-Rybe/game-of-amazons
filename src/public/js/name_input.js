class NameInput extends React.Component {
	constructor(props) {
		// width elements
		super(props);
		this.state = {value: ''};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.props.elements["name-input"] = this;
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	handleSubmit(event) {
		if (this.state.value != "")
			ws.send(JSON.stringify({type: "set-name", name: this.state.value}));
		event.preventDefault();
	}

	render() {
		return (
			<div className="name-input-wrapper"
			style={{left: (window.innerWidth - this.props.width) / 2, top: 50, height: window.innerHeight - 100}} >
				<span>Choose Name</span>
				<form onSubmit={this.handleSubmit}>
					<label>
						<input type="text"
						value={this.state.value}
						onChange={this.handleChange}
						style={{width: this.props.width - 6}} />
					</label>
				</form>
			</div>
		);
	}
}