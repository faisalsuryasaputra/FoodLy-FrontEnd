import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react"; 
import axios from "axios"; // 1. PASTIKAN IMPORT AXIOS
import NasiGoreng from "../assets/NasiGoreng.png";
import CalorIcon from "../assets/CalorIcon.svg";
import DateIcon from "../assets/DateIcon.svg";

export default function FoodCard({ id, image, name, userName, likeCount, calCount, date, initialIsLiked }) {
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(initialIsLiked ||false);
  const [currentLikes, setCurrentLikes] = useState(likeCount);

  // Fungsi untuk pindah ke halaman detail (Ini sudah benar dan akan berfungsi)
  const handleCardClick = () => {
    navigate("/detailrecipe", { state: { recipeId: id } });
  };

  // 2. UBAH MENJADI ASYNC FUNCTION
  const handleLikeClick = async (e) => {
    e.stopPropagation(); // Mencegah pindah ke halaman detail saat klik like

    // Ambil token dari localStorage untuk otorisasi
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Silakan login terlebih dahulu untuk menyukai resep.");
      return; // Hentikan fungsi jika belum login
    }

    // Simpan state lama untuk berjaga-jaga jika API gagal (Rollback)
    const previousLikedState = isLiked;
    const previousLikesCount = currentLikes;

    // Update UI secara instan (Optimistic Update)
    setIsLiked(!isLiked);
    setCurrentLikes(isLiked ? currentLikes - 1 : currentLikes + 1);

    // 3. KIRIM DATA KE BACKEND
    try {
      // PERHATIAN: Endpoint URL ini bisa berbeda tergantung buatan backend
      // Umumnya formatnya seperti ini untuk fitur toggle like:
      await axios.post(
        `http://127.0.0.1:8000/api/recipes/${id}/like`, 
        {}, // Body request kosong
        {
          headers: {
            Authorization: `Bearer ${token}` // Mengirimkan token user
          }
        }
      );
      // Jika sukses, tidak perlu lakukan apa-apa karena UI sudah terupdate
      
    } catch (error) {
      console.error("Gagal menyukai resep:", error);
      
      // Jika terjadi error (misal internet mati), kembalikan UI ke awal
      setIsLiked(previousLikedState);
      setCurrentLikes(previousLikesCount);
      
      // Tampilkan pesan error jika server mengembalikan pesan khusus
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      }
    }
  };

  return (
    <>
      {/* Tambahkan onClick pada div utama dan ubah kursor menjadi pointer */}
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
                // Jika isLiked true, warna isi dan garisnya jadi orange FoodLy
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