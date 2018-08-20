// index.jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App"

let access_token = document.getElementById("content").getAttribute("access_token")

if (access_token) {
    ReactDOM.render(<App access_token={ access_token } />, document.getElementById("content"));
} else {
    ReactDOM.render(<App />, document.getElementById("content"));
}
