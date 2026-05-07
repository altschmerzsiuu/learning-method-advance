import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import materiData from '../data/materi.json';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
    kelas: 'VII',
    sekolah: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Password dan Konfirmasi Password tidak cocok!');
    }

    setLoading(true);
    try {
      // 1. Sign up user
      const data = await signUp(formData.email, formData.password, {
        nama: formData.nama,
        kelas: formData.kelas,
        sekolah: formData.sekolah
      });

      if (data?.user) {
        if (data.session) {
          // If Confirm Email is OFF, session exists.
          navigate('/beranda', { replace: true });
        } else {
          // If Confirm Email is ON, session is null.
          setError('Registrasi berhasil! Silakan cek email Anda untuk konfirmasi sebelum Masuk.');
          // Don't navigate, let them read the message. Or we could navigate to /login.
          // Let's just reset the form and show success message using the error state but styled differently, 
          // or just navigate to login with a query param. 
          // Simplest is to just navigate to login.
          setTimeout(() => navigate('/login'), 2000);
        }
      }
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-surface relative flex items-center justify-center p-6 py-12 overflow-x-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-secondary-light rounded-full blur-3xl opacity-60" />
      
      <div className="w-full max-w-sm z-10 flex flex-col items-center">
        <h1 className="font-serif font-black text-4xl italic text-ink mb-6">
          explay<span className="text-primary-300">.</span>
        </h1>

        <Card className="w-full border-border shadow-none">
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            
            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm border border-rose-200">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-ink">Nama Lengkap</label>
              <input type="text" name="nama" required value={formData.nama} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary-300 focus:outline-none transition-colors" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-ink">Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary-300 focus:outline-none transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-sm font-bold text-ink">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary-300 focus:outline-none transition-colors" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-sm font-bold text-ink text-[12px]">Konfirmasi</label>
                <input type={showPassword ? 'text' : 'password'} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary-300 focus:outline-none transition-colors" />
              </div>
            </div>

            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-primary-600 hover:text-primary-700 text-xs font-bold self-end mt-[-8px]">
              {showPassword ? 'Sembunyikan Password' : 'Lihat Password'}
            </button>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-ink">Kelas</label>
              <select name="kelas" value={formData.kelas} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary-300 focus:outline-none transition-colors bg-white">
                <option value="VII">VII</option>
                <option value="VIII">VIII</option>
                <option value="IX">IX</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-ink">Nama Sekolah</label>
              <input type="text" name="sekolah" required value={formData.sekolah} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary-300 focus:outline-none transition-colors" />
            </div>

            <Button type="submit" disabled={loading} fullWidth className="mt-4">
              {loading ? <span className="animate-pulse">Mendaftar...</span> : 'Daftar Sekarang'}
            </Button>
          </form>

          <p className="text-center text-sm text-ink-muted mt-6">
            Sudah punya akun? <Link to="/login" className="text-primary-600 font-bold hover:underline">Masuk</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
