import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "./css/alerts.css";
import "./css/buttons.css";
import "./css/core.css";
import "./css/form.css";
import "./css/map.css";
import "./css/modal.css";
import "./css/nav.css";
import "./css/panels.css";
import "./css/table.css";
import "./css/siteSpecific.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import { Provider } from "react-redux";
import { ApplicationState } from "./store";
import { createBrowserHistory } from "history";
import configureStore from "./configureStore";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href")!;
const history = createBrowserHistory({ basename: baseUrl });

const initialState = (window as any).initialReduxState as ApplicationState;
const store = configureStore(history, initialState);

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root") as HTMLElement
);
