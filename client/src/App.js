import "./styles/styles.scss";
import "./App.css";

import { BrowserRouter as Router, Route } from "react-router-dom";
import React from "react";

import { Provider } from "react-redux";
import store from "./store";

import Register from "./components/Auth/Register";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <div className="App">
            <Route exact path="/" component={Register} />
          </div>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
