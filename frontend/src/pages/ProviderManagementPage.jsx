import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { providerService } from "../api/services";
import { Link } from "react-router-dom";
import {
  Cable,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  Building2,
  ArrowLeft,
  Mail,
  Palette,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const INITIAL_FORM = { name: "", contact_email: "", color_code: "#3b82f6" };

export default function ProviderManagementPage() {
  const { user, logout } = useAuth();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await providerService.getAll();
      setProviders(res.data.providers);
    } catch {
      // handle silently
    }
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditingProvider(null);
    setForm(INITIAL_FORM);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (provider) => {
    setEditingProvider(provider);
    setForm({
      name: provider.name,
      contact_email: provider.contact_email || "",
      color_code: provider.color_code || "#3b82f6",
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProvider(null);
    setForm(INITIAL_FORM);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editingProvider) {
        const res = await providerService.update(editingProvider.id, form);
        setProviders((prev) =>
          prev.map((p) =>
            p.id === editingProvider.id ? res.data.provider : p,
          ),
        );
        setSuccess("Provider berhasil diperbarui.");
      } else {
        const res = await providerService.create(form);
        setProviders((prev) => [...prev, res.data.provider]);
        setSuccess("Provider berhasil ditambahkan.");
      }
      closeModal();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan provider.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (provider) => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin menghapus provider "${provider.name}"?`,
      )
    )
      return;
    try {
      await providerService.delete(provider.id);
      setProviders((prev) => prev.filter((p) => p.id !== provider.id));
      setSuccess("Provider berhasil dihapus.");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      // handle error
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50 shrink-0 px-4 lg:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 text-dark-400 hover:text-white transition-colors cursor-pointer"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-white leading-tight">
              Kelola Provider
            </h1>
            <p className="text-xs text-dark-400">
              Tambah, edit, dan hapus provider kabel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass-light rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-dark-300">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="p-2 text-dark-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 lg:p-6 max-w-4xl mx-auto w-full">
        {/* Success Toast */}
        {success && (
          <div className="mb-4 flex items-center gap-2 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3 animate-fade-in">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {success}
          </div>
        )}

        {/* Title bar + Add button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Daftar Provider</h2>
            <p className="text-sm text-dark-400 mt-0.5">
              {providers.length} provider terdaftar
            </p>
          </div>
          <button
            onClick={openCreateModal}
            id="create-provider-btn"
            className="inline-flex items-center gap-2 py-2.5 px-5 bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-primary-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Provider
          </button>
        </div>

        {/* Provider Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-20 text-dark-500 animate-fade-in">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Belum ada provider terdaftar</p>
            <p className="text-xs text-dark-600 mt-1">
              Klik &quot;Tambah Provider&quot; untuk menambahkan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((provider, i) => (
              <div
                key={provider.id}
                className="glass-light rounded-2xl p-5 hover:bg-white/8 transition-all group animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Color + Name */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0"
                      style={{ backgroundColor: `${provider.color_code}25` }}
                    >
                      <Cable
                        className="w-5 h-5"
                        style={{ color: provider.color_code }}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {provider.name}
                      </h3>
                      {provider.contact_email && (
                        <p className="text-xs text-dark-400 mt-0.5 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {provider.contact_email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Color badge */}
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-3.5 h-3.5 text-dark-500" />
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-md border border-dark-600"
                      style={{ backgroundColor: provider.color_code }}
                    />
                    <span className="text-xs text-dark-400 font-mono">
                      {provider.color_code}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-dark-700/50">
                  <button
                    onClick={() => openEditModal(provider)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-dark-300 hover:text-white glass-light rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(provider)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-dark-400 hover:text-red-400 glass-light rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-2000 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="glass rounded-2xl w-full max-w-md shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-dark-600/50">
              <h2 className="text-lg font-bold text-white">
                {editingProvider ? "Edit Provider" : "Tambah Provider"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-dark-400" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Nama Provider *
                </label>
                <input
                  id="provider-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  placeholder="Contoh: Telkom, Indosat, dll"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Email Kontak
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    id="provider-email"
                    type="email"
                    value={form.contact_email}
                    onChange={(e) =>
                      setForm({ ...form, contact_email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                    placeholder="kontak@provider.com"
                  />
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Warna Identitas *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="provider-color"
                    type="color"
                    value={form.color_code}
                    onChange={(e) =>
                      setForm({ ...form, color_code: e.target.value })
                    }
                    className="w-12 h-12 rounded-xl border border-dark-600 cursor-pointer bg-dark-800 p-1"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={form.color_code}
                      onChange={(e) =>
                        setForm({ ...form, color_code: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white font-mono text-sm placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                      placeholder="#3b82f6"
                      pattern="^#[0-9A-Fa-f]{6}$"
                      required
                    />
                  </div>
                  {/* Preview */}
                  <div
                    className="w-12 h-12 rounded-xl border border-dark-600 shadow-inner"
                    style={{ backgroundColor: form.color_code }}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                id="provider-submit"
                type="submit"
                disabled={saving}
                className="w-full py-3 px-4 bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/25 cursor-pointer"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {editingProvider ? "Simpan Perubahan" : "Tambah Provider"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
