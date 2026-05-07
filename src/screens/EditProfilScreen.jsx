import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper, TopBar, Button, Card } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { Camera } from 'lucide-react';

export default function EditProfilScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile, uploadAvatar } = useProfile(user?.id);

  const [formData, setFormData] = useState({ nama: '', kelas: 'VII', sekolah: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        nama: profile.nama || '',
        kelas: profile.kelas || 'VII',
        sekolah: profile.sekolah || ''
      });
      setAvatarPreview(profile.avatar_url);
    }
  }, [profile]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      // Show preview immediately
      setAvatarPreview(URL.createObjectURL(file));
      const url = await uploadAvatar(file);
      setAvatarPreview(url);
    } catch (err) {
      setError(err.message || 'Gagal upload foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateProfile(formData);
      navigate('/profil', { replace: true });
    } catch (err) {
      setError('Gagal menyimpan profil.');
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) return <div className="p-6 text-center">Memuat...</div>;

  return (
    <PageWrapper>
      <TopBar title="Edit Profil" showBack />
      
      <div className="container py-6 flex flex-col items-center">
        {/* Avatar Editor */}
        <div className="relative mb-8 group">
          <div className="w-[100px] h-[100px] rounded-full border-4 border-transparent bg-gradient-to-tr from-primary-300 to-secondary p-1">
            <div className="w-full h-full rounded-full bg-white overflow-hidden relative">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className={`w-full h-full object-cover ${uploading ? 'opacity-50' : ''}`} />
              ) : (
                <div className="w-full h-full bg-surface-muted flex items-center justify-center text-ink-faint text-3xl">👤</div>
              )}
            </div>
          </div>
          
          <label className="absolute bottom-0 right-0 w-8 h-8 bg-surface-card rounded-full border border-border flex items-center justify-center cursor-pointer shadow-none hover:border-primary-300 transition-colors">
            <Camera size={16} className="text-ink-muted" />
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
          </label>
        </div>

        {error && <div className="text-rose-500 text-sm mb-4 bg-rose-50 p-2 rounded-lg">{error}</div>}

        <Card className="w-full">
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-ink">Nama Lengkap</label>
              <input type="text" name="nama" required value={formData.nama} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary-300 focus:outline-none transition-colors" />
            </div>

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
              <input type="text" name="sekolah" value={formData.sekolah} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary-300 focus:outline-none transition-colors" />
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <Button type="submit" disabled={saving || uploading} fullWidth>
                {saving ? 'Menyimpan...' : 'Simpan Profil'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/profil')} fullWidth>
                Batal
              </Button>
            </div>
          </form>
        </Card>

      </div>
    </PageWrapper>
  );
}
