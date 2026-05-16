import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo">
        <span>Cine</span> Searcher
      </div>

      <nav className="nav-links">
        <NavLink exact to="/" activeClassName="active">
          Home
        </NavLink>

        <NavLink to="/favourites" activeClassName="active">
          Favourites
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;