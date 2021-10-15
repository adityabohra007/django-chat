import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import GlobalStyles from "./styles/globals";
import * as serviceWorker from "./serviceWorker";
//import rootReducer from './reducers';
//const store = createStore(rootReducer)

const renderApp = () => {
  ReactDOM.render(
    <div>
      <React.StrictMode>
        <GlobalStyles />
        <App />
      </React.StrictMode>
    </div>,
    document.getElementById("root")
  );
};

renderApp();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
