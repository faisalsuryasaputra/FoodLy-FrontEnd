import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react"; 
import axios from "axios"; 
import NasiGoreng from "../assets/NasiGoreng.png";
import CalorIcon from "../assets/CalorIcon.svg";
import DateIcon from "../assets/DateIcon.svg";

export default function FoodCard({ id, image, name, userName, likeCount, calCount, date, initialIsLiked }) {
  const navigate = useNavigate();

  // State untuk menyimpan status Like secara optimis
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [currentLikes, setCurrentLikes] = useState(likeCount);

  // State pembantu untuk melacak apakah ada data baru dari backend (Home)
  const [prevInitialIsLiked, setPrevInitialIsLiked] = useState(initialIsLiked);
  const [prevLikeCount, setPrevLikeCount] = useState(likeCount);

  // KUNCI PERBAIKAN (Derived State):
  // Jika props dari halaman Home berubah (karena re-fetch data setelah kembali dari Detail),
  // otomatis update state lokal FoodCard. Ini sangat aman dan bebas error linter.
  if (initialIsLiked !== prevInitialIsLiked || likeCount !== prevLikeCount) {
    setPrevInitialIsLiked(initialIsLiked);
    setPrevLikeCount(likeCount);
    setIsLiked(initialIsLiked || false);
    setCurrentLikes(likeCount);
  }

  // Fungsi untuk pindah ke halaman detail
  const handleCardClick = () => {
    navigate("/detailrecipe", { state: { recipeId: id } });
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation(); // Mencegah pindah ke halaman detail saat klik like

    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Silakan login terlebih dahulu untuk menyukai resep.");
      return; 
    }

    const previousLikedState = isLiked;
    const previousLikesCount = currentLikes;

    // Optimistic Update: Ubah UI seketika sebelum menunggu respon server
    setIsLiked(!isLiked);
    setCurrentLikes(isLiked ? currentLikes - 1 : currentLikes + 1);

    try {
      await axios.post(
        `https://foodly-backend-5mci.onrender.com/api/recipes/${id}/like`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );
    } catch (error) {
      console.error("Gagal menyukai resep:", error);
      
      // Rollback: Kembalikan seperti semula jika API gagal
      setIsLiked(previousLikedState);
      setCurrentLikes(previousLikesCount);
      
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      }
    }
  };

  return (
    <>
      <div 
        className="card border-0 shadow-sm transition-transform" 
        style={{ width: "100%", cursor: "pointer" }} 
        onClick={handleCardClick}
      >
        <img 
          src={image ? image : NasiGoreng} 
          alt={name} 
          className="card-img-top rounded-top-3" 
          style={{ height: "200px", objectFit: "cover" }} 
        />

        <div className="card-body mt-2">
          <h6 className="card-title fw-bold mb-2 text-truncate">{name}</h6>
          <p className="card-text text-secondary small mb-3">oleh {userName}</p>

          <div className="d-flex justify-content-between align-items-center">
            
            {/* Area Tombol Like */}
            <div 
              className="d-flex align-items-center gap-1" 
              onClick={handleLikeClick}
              style={{ cursor: "pointer" }}
            >
              <Heart 
                size={18} 
                fill={isLiked ? "#ff471a" : "none"} 
                color={isLiked ? "#ff471a" : "#6c757d"} 
              />
              <p className="m-0 small" style={{ color: isLiked ? "#ff471a" : "#6c757d", fontWeight: isLiked ? "bold" : "normal" }}>
                {currentLikes}
              </p>
            </div>

            <div className="d-flex align-items-center gap-1">
              <img src={CalorIcon} style={{ height: "16px" }} alt="calories" />
              <p className="text-secondary m-0 small">{calCount} kal</p>
            </div>

            <div className="d-flex align-items-center gap-1">
              <img src={DateIcon} style={{ height: "16px" }} alt="date" />
              <p className="text-secondary m-0 small">{date}</p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}