import { Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Favourites from "./pages/Favourites";

const App = () => {
  return (
    <>
      <Header />

      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/favourites" component={Favourites} />
      </Switch>
    </>
  );
};

export default App;