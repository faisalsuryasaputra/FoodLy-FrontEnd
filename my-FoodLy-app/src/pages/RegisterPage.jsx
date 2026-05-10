import { User, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"; // 1. TAMBAHKAN INI
import BgLogin from "../assets/BgLogin.jpg";
import FoodlyLogoIcon from "../assets/FoodlyLoginIcon.svg";
import InputGroup from "../components/Auth/InputGroup";
import { AuthTabs } from "../components/Auth/AuthTabs";
import { registerUser } from "../services/AuthService"; // 2. IMPORT SERVICE NYA

export default function RegisterPage() {
    const navigate = useNavigate();
    // 3. PASANG STATE DI SINI
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // 4. FUNGSI UNTUK MENANGKAP KETIKAN USER
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 5. FUNGSI SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset pesan
        setErrorMessage("");
        setSuccessMessage("");

        // 1. VALIDASI MANUAL EMAIL DI REACT
        // Pengecekan format: harus ada @ dan huruf setelah titik (misal .com atau .id)
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(formData.email)) {
            setErrorMessage("Format email tidak lengkap! Pastikan menggunakan domain (contoh: @gmail.com)");
            return; // Hentikan fungsi di sini, jangan kirim ke backend
        }

        // 2. VALIDASI MANUAL PASSWORD (Opsional tapi sangat disarankan)
        if (formData.password.length < 8) {
            setErrorMessage("Password terlalu pendek! Minimal harus 8 karakter.");
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            setErrorMessage("Konfirmasi password tidak cocok!");
            return;
        }

        // 3. JIKA SEMUA LOLOS, KIRIM KE BACKEND
        try {
            const response = await registerUser(formData);
            console.log("Berhasil:", response);
            // --- TAMBAHKAN LOGIKA PENYIMPANAN DI SINI ---
            if (response.token) {
                // Jika bentuknya langsung response.token dan response.user
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            } else if (response.data && response.data.token) {
                // Jika dari axios terbungkus response.data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            setSuccessMessage("Registrasi Berhasil! Mengalihkan ke halaman utama...");
            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {
            console.error("Gagal:", error);

            // PERBAIKAN: Menangkap error spesifik dari Laravel (Error 422)
            if (error.response && error.response.status === 422) {
                const laravelErrors = error.response.data.errors;
                // Ambil pesan error urutan pertama yang dikirim Laravel
                const firstError = Object.values(laravelErrors)[0][0];
                setErrorMessage(firstError);
            }
            else if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            }
            else {
                setErrorMessage("Registrasi Gagal. Pastikan server Backend menyala.");
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
                                <div className="d-flex flex-column align-items-center gap-2 mb-4">
                                    <img src={FoodlyLogoIcon} alt="login" />
                                    <h2 className="fw-bold fs-2" style={{ background: 'linear-gradient(to right, #FF6900, #FB2C36)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: '"Sora", sans-serif' }}>Foodly</h2>
                                </div>

                                <AuthTabs type="Register" />
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

                                {/* 6. PASANG onSubmit DI SINI */}
                                <form className="d-flex flex-column" onSubmit={handleSubmit} noValidate>
                                    <InputGroup
                                        icon={User}
                                        type="text"
                                        name="name"
                                        value={formData.name} // <--- WAJIB ADA
                                        placeholder="Username"
                                        onChange={handleChange}
                                    />
                                    <InputGroup
                                        icon={Mail}
                                        type="email"
                                        name="email"
                                        value={formData.email} // <--- WAJIB ADA
                                        placeholder="Email"
                                        onChange={handleChange}
                                        required
                                    />
                                    <InputGroup
                                        icon={Lock}
                                        type="password"
                                        name="password"
                                        value={formData.password} // <--- WAJIB ADA
                                        placeholder="Password"
                                        onChange={handleChange}
                                    />
                                    <InputGroup
                                        icon={Lock}
                                        type="password"
                                        name="password_confirmation"
                                        value={formData.password_confirmation} // <--- WAJIB ADA
                                        placeholder="Confirm Password"
                                        onChange={handleChange}
                                    />

                                    <button type="submit" className="btn py-3 mt-2 fw-bold text-white rounded-pill shadow-sm" style={{ background: 'linear-gradient(to right, #FF6900, #FB2C36)', border: 'none', fontFamily: '"Sora", sans-serif' }}>
                                        Continue
                                    </button>
                                </form>

                                <div className="text-center mt-4">
                                    <span className="text-secondary small">
                                        Sudah punya akun?{" "}
                                        <Link to="/login" className="text-decoration-none fw-bold" style={{ color: '#FF6900' }}>
                                            Login
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