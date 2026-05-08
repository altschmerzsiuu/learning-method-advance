import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { PageWrapper, TopBar, Card, Button } from '../components/ui';
import { toast } from '../lib/toast';
import { Camera, Mail, Lock, Calendar } from 'lucide-react';

export default function EditProfilScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile, uploadAvatar } = useProfile(user?.id);

  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('');
  const [sekolah, setSekolah] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setNama(profile.nama || '');
      setKelas(profile.kelas || '');
      setSekolah(profile.sekolah || '');
      setTanggalLahir(profile.tanggal_lahir || '');
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ 
        nama, 
        kelas, 
        sekolah, 
        tanggal_lahir: tanggalLahir || null 
      });
      toast.success('Profil berhasil diperbarui!');
      navigate('/profil');
    } catch (err) {
      console.error("Gagal update profil:", err);
      toast.error('Gagal menyimpan profil: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadAvatar(file);
      toast.success('Foto berhasil diperbarui!');
    } catch (err) {
      console.error("Gagal upload avatar:", err);
      toast.error('Gagal mengupload foto: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (profileLoading) return <div className="p-6 text-center">Memuat...</div>;

  return (
    <PageWrapper bottomNav>
      <TopBar title="Edit Profil" showBack={true} />
      
      <div className="container py-6 pb-32 flex flex-col items-center px-4">
        {/* Avatar Upload */}
        <div className="relative mb-8">
          <div className="w-[100px] h-[100px] rounded-full border-[3px] border-transparent bg-gradient-to-tr from-primary-300 to-secondary p-0.5 shadow-xl">
            <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>
          </div>
          <label className="absolute bottom-0 right-0 bg-white border border-border rounded-full p-2 shadow-lg cursor-pointer hover:bg-surface-muted transition-colors">
            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} disabled={uploading} />
            <Camera size={16} className="text-primary-300" />
          </label>
        </div>

        {/* Form Bio */}
        <Card className="w-full max-w-md p-6 mb-6">
          <h3 className="font-serif font-black text-lg mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-primary-300 rounded-full" />
            Informasi Dasar
          </h3>
          
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Email Akun</label>
              <div className="flex items-center gap-3 p-3.5 bg-surface-muted rounded-xl border border-border text-ink-faint">
                <Mail size={16} />
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
              <p className="text-[10px] text-ink-faint italic mt-1">* Email tidak dapat diubah</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Nama Lengkap</label>
              <input 
                type="text" value={nama} onChange={(e) => setNama(e.target.value)}
                className="p-3.5 bg-white border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                placeholder="Nama kamu..." required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Kelas</label>
                <select 
                  value={kelas} onChange={(e) => setKelas(e.target.value)}
                  className="p-3.5 bg-white border border-border rounded-xl text-sm outline-none"
                >
                  <option value="VII">VII</option>
                  <option value="VIII">VIII</option>
                  <option value="IX">IX</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Tanggal Lahir</label>
                <div className="relative">
                  <input 
                    type="date" value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)}
                    className="w-full p-3.5 bg-white border border-border rounded-xl text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Nama Sekolah</label>
              <input 
                type="text" value={sekolah} onChange={(e) => setSekolah(e.target.value)}
                className="p-3.5 bg-white border border-border rounded-xl text-sm outline-none"
                placeholder="Nama sekolah kamu..."
              />
            </div>

            <Button type="submit" disabled={saving || uploading} fullWidth className="mt-2">
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </form>
        </Card>

      </div>
    </PageWrapper>
  );
}
