import { useState } from "react";
import { Mail, Lock } from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom"; // Tambah useNavigate
import BgLogin from "../assets/BgLogin.jpg";
import FoodlyLogoIcon from "../assets/FoodLyLoginIcon.svg";
import InputGroup from "../components/Auth/InputGroup";
import { AuthTabs } from "../components/Auth/AuthTabs";
import { loginUser } from "../services/AuthService"; // Import fungsi login

export default function LoginPage() {
    const navigate = useNavigate();

    // 1. STATE UNTUK INPUT USER
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    
    // STATE UNTUK PESAN ERROR/SUKSES
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // 2. FUNGSI MENANGKAP KETIKAN
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 3. FUNGSI SUBMIT KE BACKEND
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        // Validasi kosong
        if (!formData.email || !formData.password) {
            setErrorMessage("Email dan Password wajib diisi!");
            return;
        }

        try {
            // Mengirim data ke Laravel
            const response = await loginUser(formData);
            console.log("Login Berhasil:", response);
            
            if (response.token) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));
            } else if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }

            setSuccessMessage("Login Berhasil! Mengalihkan...");
            
            // Pindah ke Homepage setelah 1 detik
            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {
            console.error("Login Gagal:", error);
            // Menangkap error dari Laravel (biasanya 401 Unauthorized atau 422)
            if (error.response && error.response.status === 401) {
                setErrorMessage("Email atau Password salah!");
            } 
            else if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } 
            else {
                setErrorMessage("Gagal terhubung ke server.");
            }
        }
    };

    return (
        <div className="bg-custom-color min-vh-100 overflow-hidden">
            <div className="container-fluid p-0">
                <div className="row g-0 min-vh-100 flex-nowrap">

                    {/* SISI KIRI (Image) */}
                    <div className="col-6 d-none d-md-block" style={{ backgroundImage: `url(${BgLogin})`, backgroundSize: 'cover' }} />

                    {/* SISI KANAN (Form) */}
                    <div className="col-md-6 d-flex p-0">
                        <div className="col d-flex flex-column align-items-center bg-white rounded-start-5 shadow-lg" style={{ zIndex: 1, marginLeft: '-80px', paddingLeft: '30px', minHeight: '100vh' }}>

                            <div className="p-4 w-100" style={{ maxWidth: '450px', marginTop: '80px' }}>
                                {/* Logo & Brand */}
                                <div className="d-flex flex-column align-items-center gap-2 mb-4">
                                    <img src={FoodlyLogoIcon} alt="login" />
                                    <h2 className="fw-bold fs-2" style={{ background: 'linear-gradient(to right, #FF6900, #FB2C36)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: '"Sora", sans-serif' }}>Foodly</h2>
                                </div>

                                <AuthTabs type="Login" />

                                {/* AREA PESAN ERROR / SUKSES */}
                                {errorMessage && (
                                    <div className="alert alert-danger py-2 px-3 text-center" style={{ fontSize: '14px', borderRadius: '10px' }} role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                {successMessage && (
                                    <div className="alert alert-success py-2 px-3 text-center" style={{ fontSize: '14px', borderRadius: '10px' }} role="alert">
                                        {successMessage}
                                    </div>
                                )}

                                {/* PASANG onSubmit DI SINI */}
                                <form className="d-flex flex-column gap-2" onSubmit={handleSubmit} noValidate>
                                    
                                    {/* TAMBAHKAN name, value, dan onChange */}
                                    <InputGroup 
                                        icon={Mail} 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        placeholder="Email" 
                                        onChange={handleChange}
                                    />
                                    <InputGroup 
                                        icon={Lock} 
                                        type="password" 
                                        name="password"
                                        value={formData.password}
                                        placeholder="Password" 
                                        onChange={handleChange}
                                    />

                                    <button type="submit" className="btn py-3 mt-3 fw-bold text-white rounded-pill shadow-sm" style={{ background: 'linear-gradient(to right, #FF6900, #FB2C36)', border: 'none', fontFamily: '"Sora", sans-serif' }}>
                                        Continue
                                    </button>
                                </form>

                                <div className="text-center mt-4">
                                    <span className="text-secondary small">
                                        Belum punya akun?{" "}
                                        <Link to="/register" className="text-decoration-none fw-bold" style={{ color: '#FF6900' }}>
                                            Daftar
                                        </Link>
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}