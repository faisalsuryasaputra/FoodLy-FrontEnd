import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsArrowLeft, BsPerson, BsHeartFill, BsCalendar3, BsPencil, BsTrash } from 'react-icons/bs';
import { FaFire } from 'react-icons/fa';
import { ListSection } from '../components/ListSection';
import { RecipeBadge } from '../components/RecipeBadge';
import { useRecipe } from '../hooks/useRecipe';

export default function DetailRecipePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formatDate } = useRecipe();

  // Menangkap ID resep yang dikirim dari halaman Home/Favorit saat kartu diklik
  const recipeId = location.state?.recipeId;

  const userData = localStorage.getItem("user");
  const currentUser = userData ? JSON.parse(userData) : null;

  // State untuk menyimpan data
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // State khusus untuk tombol Like interaktif
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    // Jika user mengakses halaman ini langsung dari URL (tanpa klik kartu), kembalikan ke Home
    if (!recipeId) {
      navigate('/');
      return;
    }

    const fetchDetailRecipe = async () => {
      try {
        const token = localStorage.getItem("token");
        // Panggil endpoint detail resep
        const response = await axios.get(`http://127.0.0.1:8000/api/recipes/${recipeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data.data || response.data;
        setRecipe(data);
        
        // Memasukkan data awal like dari backend ke state (otomatis true/false dari withExists)
        setIsLiked(data.is_liked || false);
        setLikesCount(data.likes_count || 0);

      } catch (error) {
        console.error("Gagal mengambil detail resep:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailRecipe();
  }, [recipeId, navigate]);

  // FUNGSI UNTUK MENEKAN TOMBOL LIKE
  const handleLikeClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu untuk menyukai resep.");
      return;
    }

    // Simpan state lama untuk jaga-jaga jika API error (jaringan putus, dll)
    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;

    // Ubah UI seketika (Optimistic Update) agar terasa cepat di mata user
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      // Kirim request ke Backend
      await axios.post(
        `http://127.0.0.1:8000/api/recipes/${recipeId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Gagal menyukai resep:", error);
      // Jika Backend menolak atau error, kembalikan tampilan tombol ke semula
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikesCount);
    }
  };

  // FUNGSI UNTUK MENGHAPUS RESEP
  const handleDelete = async () => {
    const isConfirm = window.confirm("Apakah Anda yakin ingin menghapus resep ini?");
    
    if (isConfirm) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://127.0.0.1:8000/api/recipes/${recipeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Arahkan kembali ke halaman utama setelah berhasil dihapus
        navigate('/'); 
      } catch (error) {
        console.error("Gagal menghapus resep:", error);
        alert("Terjadi kesalahan saat menghapus resep.");
      }
    }
  };

  // Tampilan saat data sedang dimuat
  if (isLoading) {
    return (
      <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Jika data gagal dimuat atau tidak ada
  if (!recipe) {
    return (
      <div className="bg-light min-vh-100 py-5 text-center">
        <h3 className="text-secondary">Resep tidak ditemukan.</h3>
        <button className="btn btn-outline-danger mt-3" onClick={() => navigate('/')}>Kembali ke Home</button>
      </div>
    );
  }

  // --- PROSES MEMECAH STRING DARI BACKEND MENJADI ARRAY ---
  const bahanBahan = recipe.ingredients 
    ? recipe.ingredients.split(',').map(item => item.trim()) 
    : [];

  const caraMembuat = recipe.steps 
    ? recipe.steps.split('\n').map(step => step.replace(/^\d+\.\s*/, '').trim()).filter(step => step !== '') 
    : [];

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-link text-decoration-none text-dark fw-medium mb-3 d-flex align-items-center gap-2 px-0"
        >
          <BsArrowLeft size={20} /> Kembali
        </button>

        <div className="card border-0 shadow-sm rounded-4 mb-5">
          <div className="card-body p-4 p-md-5">
            
            {/* GAMBAR RESEP */}
            <img 
              src={recipe.image_url || "https://via.placeholder.com/900x350?text=Gambar+Tidak+Tersedia"} 
              alt={recipe.title} 
              className="w-100 rounded-4 mb-4" 
              style={{ height: '350px', objectFit: 'cover' }} 
            />

            {/* JUDUL, TOMBOL EDIT & HAPUS */}
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h2 className="fw-bold mb-0">{recipe.title}</h2>
              
              {/* KUNCI PERBAIKAN: Cek apakah ID user login sama dengan user_id pembuat resep */}
              {currentUser && currentUser.id === recipe.user_id && (
                <div className="d-flex gap-2">
                  <button 
                    onClick={() => navigate(`/edit-recipe/${recipeId}`)} 
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 rounded-pill px-3"
                  >
                    <BsPencil size={14} /> Edit
                  </button>
                  <button 
                    onClick={handleDelete} 
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 rounded-pill px-3"
                  >
                    <BsTrash size={14} /> Hapus
                  </button>
                </div>
              )}

            </div>

            {/* PENULIS */}
            <div className="text-secondary d-flex align-items-center gap-2 mb-4 mt-2">
              <BsPerson size={18} /> <span>oleh {recipe.user?.name || "Anonim"}</span>
            </div>

            {/* BADGE INFO */}
            <div className="d-flex flex-wrap align-items-center gap-4 text-secondary mb-4 small">
              <RecipeBadge icon={FaFire} text={`${recipe.calories} kalori`} colorClass="text-warning" />
              <RecipeBadge icon={BsHeartFill} text={`${likesCount} like`} colorClass="text-danger" />
              <RecipeBadge icon={BsCalendar3} text={formatDate(recipe.created_at)} />
            </div>

            {/* TOMBOL LIKE INTERAKTIF */}
            <button 
              onClick={handleLikeClick}
              className="btn rounded-pill px-3 py-1 mb-4 d-flex align-items-center gap-2 text-white" 
              style={{ 
                fontSize: '14px', 
                backgroundColor: isLiked ? '#dc3545' : '#ff4d4f', // Merah gelap saat di-like, pinkish saat belum
                border: 'none',
                transition: 'background-color 0.2s ease-in-out'
              }}
            >
              <BsHeartFill size={14} /> 
              {isLiked ? "Tidak Suka" : "Suka"}
            </button>

            {/* DESKRIPSI */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Deskripsi</h5>
              <p className="text-secondary">{recipe.description}</p>
            </div>

            {/* KOMPONEN LIST SECTION */}
            <ListSection title="Bahan-Bahan" items={bahanBahan} />
            <ListSection title="Cara Membuat" items={caraMembuat} isStep={true} />

          </div>
        </div>
      </div>
    </div>
  );
}