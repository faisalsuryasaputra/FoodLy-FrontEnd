import Logo from "../assets/LogoFoodly.svg";
import HomeIcon from "../assets/HomeIcon.svg"
import SearchIcon from "../assets/SearchIcon.svg"
import FavoritIcon from "../assets/FavoritIcon.svg"
import LogoutIcon from "../assets/LogoutIcon.svg"
import MyRecipeIcon from "../assets/MyRecipeIcon.svg"
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault(); 
    
    setTimeout(() => {
      // 1. Hapus data dari localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user'); 

      // 2. Arahkan ke halaman login
      navigate("/login");
    }, 1000);
  }; 

  return ( // <--- Return harus berada di luar handleLogout
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container">
        <Link to="/">
           <img src={Logo} alt="Logo" />
        </Link>
        <Link className="navbar-brand fw-bold ps-2 brand-color" to="/">Foodly</Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-4">
            <li className="nav-item">
              <Link className="nav-link fw-medium d-flex align-items-center gap-2" to="/">
                <img src={HomeIcon} alt="Home" />
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-medium d-flex align-items-center gap-2" to="/myrecipes">
                <img src={MyRecipeIcon} alt="MyRecipeIcon" />
                My Recipes
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-medium d-flex align-items-center gap-2" to="/search">
                <img src={SearchIcon} alt="SearchIcon" />
                Cari
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-medium d-flex align-items-center gap-2" to="/favorit">
                <img src={FavoritIcon} alt="Favorit" />
                Favorit
              </Link>
            </li>

            <li className="nav-item">
              <Link className="btn btn-custom fw-medium d-flex align-items-center gap-2" to="/recipe">
                + Buat Resep
              </Link>
            </li>

            <li className="nav-item">
              <button 
                className="nav-link fw-medium d-flex align-items-center gap-2 border-0 bg-transparent" 
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}
              >
                <img src={LogoutIcon} alt="Logout" />
                Keluar
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
} // <--- Hanya butuh satu kurung penutup untuk function Header