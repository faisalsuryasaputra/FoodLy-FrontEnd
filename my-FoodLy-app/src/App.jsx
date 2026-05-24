import { Routes, Route } from "react-router-dom";
import Header from "./components/Header"
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import RecipePage from "./pages/RecipePage"
import FavoritPage from "./pages/FavoritPage"
import DetailRecipePage from "./pages/DetailRecipePage"
import MyRecipesPage from "./pages/MyRecipesPage";


function App() {

  
  return(
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="recipe" element={<RecipePage />} />
          <Route path="favorit" element={<FavoritPage />} />
          <Route path="detailrecipe" element={<DetailRecipePage />} />
          <Route path="myrecipes" element={<MyRecipesPage />} />
        </Route>
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}

export default App
