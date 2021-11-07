class NameInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
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
			<form onSubmit={this.handleSubmit}>
			<label>
				Имя:
				<input type="text" value={this.state.value} onChange={this.handleChange} />
			</label>
				<input type="submit" value="Choose name" />
			</form>
		);
	}
}