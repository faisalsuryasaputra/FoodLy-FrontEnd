import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Cek apakah ada token di localStorage (disesuaikan dengan logic backend FoodLy Anda)
  const token = localStorage.getItem("token");

  // Jika tidak ada token, arahkan paksa ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, izinkan masuk ke halaman yang dituju
  return <Outlet />;
};

export default ProtectedRoute;