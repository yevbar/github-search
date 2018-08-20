// App.jsx
import axios from "axios";
import React from "react";

export default class App extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    username: "user",
	    repos: [],
	    searchString: ""
	};

	this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    getUsername() {
	let url = "https://api.github.com/user?access_token=" + this.props.access_token;
	axios(url)
	    .then(res => res.data)
	    .then(res => {
		this.setState({username: res.login})
	    })
	    .then(() => this.getRepos());
    }

    getRepos() {
	axios("https://api.github.com/users/" + this.state.username + "/repos?access_token=" + this.props.access_token)
	    .then(res => res.data)
	    .then(res => {
		res.map((item) => {
		    let currentRepos = this.state.repos;
		    currentRepos.push(item.name)
		    this.setState({repos: currentRepos})
		})});
    }

    componentDidMount() {
	if (this.props.access_token) {
	    this.getUsername();
	}
    }

    handleKeyPress(event) {
	this.setState({
	    searchString: event.target.value
	});
    }
    
    render() {
	if (this.props.access_token) {
	    let repos = this.state.repos;
	    let searchString = this.state.searchString;
	    let listOfRepos;
	    if (repos) {
		listOfRepos = repos.map(function(name, index) {
		    if (searchString && name.toLowerCase().includes(searchString.toLowerCase())) {
			    return <li key={ index }>{ name }</li>;
		    } else {
			if (!searchString) {
				return <li key={ index }>{ name }</li>;
			}}})
	    } else {
		listOfRepos = <li key="0">Loading</li>
	    }
	    
	    return (
		<div>
		  <h1>Welcome {this.state.username}</h1>
		  <input type="text" id="search-bar" onChange={this.handleKeyPress}/>
		  <ul>
		    {listOfRepos}
		  </ul>
		</div>
	    );
	}
	return (
	    <div>
	      <p>Well, hello there!</p>
	      <p>
		We are going to now talk to the Github API. Ready?
		<a href="http://github.com/login/oauth/authorize?scope=repo:status&client_id=2b4ff89d2dd91e089b98">Click here</a> to begin!
	      </p>
	    </div>
	);
    }
}
