import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from "./pages/home";
import Teacher from "./pages/teacher";
import SearchResults from "./pages/serach-results";

function App() {
  return <Router>
    <Switch>
      <Route exact path='/'>
        <Home/>
      </Route>
      <Route path='/teacher/:id'>
        <Teacher/>
      </Route>
      <Route path='/search'>
        <SearchResults/>
      </Route>
      <Route path='*'>
        <Home/>
      </Route>
    </Switch>
  </Router>;
}

export default App;
