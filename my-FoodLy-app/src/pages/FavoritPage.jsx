import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import FoodCard from "../components/FoodCard";
import axios from "axios";
import { useRecipe } from "../hooks/useRecipe"; // Memanggil hook buatan Anda

export default function FavoritPage() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading
  const { formatDate } = useRecipe(); // Mengambil fungsi format tanggal

  // Mengambil data dari Backend saat halaman pertama kali dibuka
  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // CATATAN: Pastikan endpoint ini sesuai dengan yang dibuat Kennata (Backend)
        // Contoh umumnya: /api/user/favorites atau /api/liked-recipes
        const response = await axios.get("http://127.0.0.1:8000/api/likes", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Sesuaikan dengan struktur JSON dari Laravel
        // Biasanya data ada di response.data atau response.data.data
        const data = response.data.data || response.data;
        setFavoriteRecipes(data);
        
      } catch (error) {
        console.error("Gagal mengambil resep favorit:", error);
      } finally {
        setIsLoading(false); // Matikan loading setelah selesai (sukses/gagal)
      }
    };

    fetchFavoriteRecipes();
  }, []);

  return (
    <div className="bg-light min-vh-100 pt-5 pb-5">
      <div className="container">
        
        {/* BAGIAN HEADER */}
        <div className="d-flex align-items-center gap-4 mb-5">
          <div 
            className="d-flex justify-content-center align-items-center rounded-circle shadow-sm"
            style={{ width: "70px", height: "70px", backgroundColor: "#ff471a", flexShrink: 0 }}
          >
            <Heart size={32} color="white" fill="white" />
          </div>
          
          <div>
            <h1 className="fw-bold m-0" style={{ fontSize: "2.5rem", color: "#1a1a1a" }}>
              Resep Favorit Saya
            </h1>
            <p className="text-secondary fs-6 m-0 mt-1">
              {favoriteRecipes.length} resep yang Anda sukai
            </p>
          </div>
        </div>

        {/* TAMPILAN LOADING */}
        {isLoading ? (
          <div className="text-center mt-5">
            <div className="spinner-border" style={{ color: "#ff471a" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-secondary">Memuat resep favorit Anda...</p>
          </div>
        ) : (
          /* BAGIAN GRID CARD RESEP */
          <div className="row gy-4">
            {favoriteRecipes.length > 0 ? (
              favoriteRecipes.map(recipe => (
                <div className="col-4" key={recipe.id}>
                  <FoodCard
                    id={recipe.id}
                    image={recipe.image}
                    name={recipe.title}
                    userName={recipe.user.name}
                    calCount={recipe.calories}
                    likeCount={recipe.likes_count}
                    date={formatDate(recipe.created_at)}
                    initialIsLiked={true} // Pasti true karena ada di daftar favorit
                  />
                </div>
              ))
            ) : (
              /* TAMPILAN KETIKA KOSONG */
              <div className="col-12 text-center mt-5">
                <Heart size={50} className="text-muted mb-3" />
                <h4 className="text-secondary">Belum ada resep favorit</h4>
                <p className="text-muted">Jelajahi resep di halaman Home dan klik tombol hati untuk menyimpannya di sini.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}