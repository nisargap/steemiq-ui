import React, { Component } from 'react';

import App from 'grommet/components/App';
import Title from 'grommet/components/Title';
import Search from 'grommet/components/Search';
import Spinning from 'grommet/components/icons/Spinning';
import Form from 'grommet/components/Form';
import axios from "axios";
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';

export default class BasicApp extends Component {
  constructor() {
    super();
    this.state = {
      searchQuery: "",
      showLoader: false,
      message: "",
      results: null
    }
  }
  updateQuery(event) {
    this.setState({
      searchQuery: event.target.value,
      results: null
    });
  }
  handleSubmit(event) {
    event.preventDefault();

    this.setState({
      message: "",
      results: null
    })
    if(this.state.searchQuery) {
      this.setState({
        showLoader: true,
        results: null
      });
      axios.get("https://steemiq.herokuapp.com/grade/" +  this.state.searchQuery).then((response) => {
        console.log(response.data);
        const data = response.data;
        console.log(data)
        if(data.status !== false){
          this.setState({
            showLoader: false,
            results: response.data,
            message: ""
          });
        } else {
          this.setState({
            showLoader: false,
            message: "User data could not be retrieved"
          })
        }
      });
    } else {
      this.setState({
        message: "No username entered",
        results: null
      })
    }
  }
  render() {

    const styles = {
      headerText: {
        fontSize: "5em",
        margin: "0 auto",
        textAlign: "center",
        marginTop: "0.5em"
      }
    }

    let postList = null;

    if(this.state.results !== null) {
      postList = this.state.results.payload.grades.map((obj) => {
        if(obj.grade < 20) {
        return (
          <ListItem justify='between' separator='horizontal'>
            <span>
              {obj.title}
            </span>
            <span className="secondary">
              Grade: {obj.grade.toFixed(2)}
            </span>
          </ListItem>
        );
      } else {
        return null;
      }
      })
    }
    return (
      <App>
        <h1 style={styles.headerText}>SteemIQ</h1>
        <h2 className="faded">how smart is your writing?</h2>
        <br />
        <Form className="searchForm" onSubmit={this.handleSubmit.bind(this)}>
          <Search placeHolder='Type a username and press enter'
            className="searchbox"
            responsive={true}
            onDOMChange={this.updateQuery.bind(this)}
            size="medium"
            inline={true}/>
        </Form>
        { this.state.showLoader ? (
          <div style={{ margin: "3.5em auto", textAlign: "center" }}>
          <h2>Analyzing writing on the Steem Blockchain for @{ this.state.searchQuery }</h2>
          <Spinning size="huge" />
          </div>
        ) : (<div className="plug">
        Created by <a href="https://steemit.com/@nphacker">@nphacker</a> with ♥
      </div>) }

      <div className="results">
      { this.state.message !== "" ? (
        <span>{ this.state.message }</span>
      ) : ""
      }

      { this.state.results !== null ? (
        <div>
          <h1 className="iqtext"><img src="/img/logo.png" className="icon-image" /> IQ: {this.state.results.payload.iq}</h1>
          <h2><img src="/img/graduationcap.png" className="icon-image" /> School Grade: { this.state.results.payload.average.toFixed(2) }</h2>
          {postList !== null ? (
            <div>
            <h2><a href={"https://steemit.com/" + "@" + this.state.searchQuery}>@{this.state.searchQuery + "'s"}</a> Graded Posts</h2>
            <List>
              {postList}
            </List>
            </div>
          ) : ""}
        </div>
      ) : ""}
      </div>
      </App>
    );
  }
}
