import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card } from '../ui';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message || 'Gagal login. Cek kembali email dan passwordmu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-surface relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-secondary-light rounded-full blur-3xl opacity-60" />
      
      <div className="w-full max-w-sm z-10 flex flex-col items-center">
        <h1 className="font-serif font-black text-5xl italic text-ink mb-2">
          explay<span className="text-primary-300">.</span>
        </h1>
        <p className="font-sans text-ink-muted mb-8 text-center">Belajar Teks Eksposisi jadi seru!</p>

        <Card className="w-full border-border shadow-none relative">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            
            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm border border-rose-200">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-ink">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary-300 focus:outline-none transition-colors"
                placeholder="nama@email.com"
              />
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-sm font-bold text-ink">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary-300 focus:outline-none transition-colors pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink text-sm"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} fullWidth className="mt-2">
              {loading ? <span className="animate-pulse">Memuat...</span> : 'Masuk'}
            </Button>
          </form>

          <p className="text-center text-sm text-ink-muted mt-6">
            Belum punya akun? <Link to="/register" className="text-primary-600 font-bold hover:underline">Daftar</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
