import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InputGroup from '../components/InputGroup';
import DynamicInput from '../components/DynamicInput';

export default function EditRecipePage() {
  const navigate = useNavigate();
  const { recipeId } = useParams(); // Mengambil ID resep dari URL /edit-recipe/:recipeId
  
  // State untuk field form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [calories, setCalories] = useState('');

  // State untuk dynamic field (Array)
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);

  // State untuk Feedback UI dan Loading
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const primaryColor = '#f26835';

  // 1. FETCH DATA LAMA SAAT HALAMAN DI-LOAD
  useEffect(() => {
    const fetchOldRecipeData = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        const response = await fetch(`https://foodly-backend-5mci.onrender.com/api/recipes/${recipeId}`, {
          headers: {
            'Authorization': `Bearer ${savedToken}`,
            'Accept': 'application/json'
          }
        });

        const resData = await response.json();
        const data = resData.data || resData; // Antisipasi jika ada pembungkus .data dari backend

        if (response.ok) {
          // Isi data resep ke dalam state form
          setTitle(data.title || '');
          setDescription(data.description || '');
          setImageUrl(data.image_url || '');
          setCalories(data.calories ? data.calories.toString() : '');

          // Mengubah string bahan dari backend menjadi array kembali
          if (data.ingredients) {
            setIngredients(data.ingredients.split(',').map(item => item.trim()));
          }

          // Mengubah string cara membuat dari backend menjadi array kembali (menghapus nomor "1. ", "2. ")
          if (data.steps) {
            const parsedSteps = data.steps
              .split('\n')
              .map(step => step.replace(/^\d+\.\s*/, '').trim())
              .filter(step => step !== '');
            setSteps(parsedSteps.length > 0 ? parsedSteps : ['']);
          }
        } else {
          setError(data.message || "Gagal mengambil data resep lama.");
        }
      } catch (err) {
        setError("Terjadi kesalahan jaringan saat memuat data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (recipeId) {
      fetchOldRecipeData();
    }
  }, [recipeId]);

  // Handler untuk mengupdate item array
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  // 2. HANDLER UNTUK SUBMIT PERUBAHAN (PUT/PATCH)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const savedToken = localStorage.getItem('token'); 
    
    if (!savedToken) {
      setError("Sesi Anda telah berakhir. Silakan login kembali.");
      setIsSubmitting(false);
      return;
    }

    // Susun kembali payload dalam format string seperti saat membuat resep
    const payload = {
      title,
      description,
      ingredients: ingredients.filter(i => i.trim() !== '').join(', '),
      steps: steps.filter(s => s.trim() !== '').map((s, i) => `${i + 1}. ${s}`).join('\n'),
      image_url: imageUrl,
      calories: parseInt(calories)
    };

    try {
      // Menggunakan method PUT untuk memperbarui data resep spesifik
      const response = await fetch(`https://foodly-backend-5mci.onrender.com/api/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${savedToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Kembali ke halaman detail resep setelah berhasil diedit
        navigate(-1); 
      } else {
        setError(data.message || "Gagal memperbarui resep. Periksa kembali data Anda.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tampilan loading data awal resep
  if (isLoading) {
    return (
      <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Memuat Data Resep...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div className="mb-3">
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-link text-dark text-decoration-none px-0 fw-semibold d-flex align-items-center gap-2"
          >
            <i className="bi bi-arrow-left"></i> Kembali
          </button>
        </div>

        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4 p-md-5">
            <h2 className="fw-bold mb-4">Edit Resep</h2>

            {error && (
              <div className="alert alert-danger border-0 rounded-3 small mb-4">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <InputGroup 
                label="Judul Resep" 
                placeholder="Contoh: Nasi Goreng Spesial" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <InputGroup 
                label="Deskripsi" 
                placeholder="Deskripsi singkat resep ini..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              
              <InputGroup 
                label="URL Gambar" 
                type="url" 
                placeholder="https://example.com/image.jpg" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />

              <InputGroup 
                label="Jumlah Kalori" 
                type="number" 
                placeholder="Contoh: 450" 
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required
              />

              <DynamicInput 
                label="Bahan-Bahan" 
                items={ingredients} 
                onAdd={() => setIngredients([...ingredients, ''])} 
                onChangeItem={handleIngredientChange}
                placeholder="Contoh: 2 siung bawang putih" 
              />

              <DynamicInput 
                label="Cara Membuat" 
                items={steps} 
                onAdd={() => setSteps([...steps, ''])} 
                onChangeItem={handleStepChange}
                placeholder="Langkah memasak..." 
                isTextArea 
                showNumber 
              />

              <div className="row g-3 mt-4">
                <div className="col-12 col-md-5">
                  <button 
                    type="button" 
                    onClick={() => navigate(-1)}
                    className="btn btn-outline-secondary w-100 py-2 rounded-3"
                  >
                    Batal
                  </button>
                </div>
                <div className="col-12 col-md-7">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn w-100 py-2 rounded-3 text-white fw-bold d-flex align-items-center justify-content-center gap-2" 
                    style={{ backgroundColor: primaryColor }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Menyimpan...
                      </>
                    ) : 'Simpan Perubahan'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}