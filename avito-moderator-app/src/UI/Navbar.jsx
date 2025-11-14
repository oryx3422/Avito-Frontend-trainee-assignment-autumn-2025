// for testing
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <nav className="navbar__links">
        {/* <Link to="/">Home-temp</Link> */}
        <Link to="/list">Объявления</Link>
        <Link to="/stats">Статистика</Link>
      </nav>
    </div>
  );
};

export default Navbar;
