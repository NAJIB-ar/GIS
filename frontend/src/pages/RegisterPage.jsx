import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserPlus, Mail, Lock, User, AlertCircle, Cable } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      navigate("/report");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
      setError(err.response?.data?.message || "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full pl-10 pr-4 py-3 bg-dark-800 border rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all ${
      errors[field] ? "border-red-500" : "border-dark-600"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-400/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
            <Cable className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Daftar Akun
          </h1>
          <p className="text-dark-400 mt-2">Daftar sebagai petugas lapangan</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  id="register-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass("name")}
                  placeholder="Nama Anda"
                  required
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  id="register-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass("email")}
                  placeholder="email@example.com"
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  id="register-password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className={inputClass("password")}
                  placeholder="Minimal 8 karakter"
                  required
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  id="register-confirm"
                  type="password"
                  value={form.password_confirmation}
                  onChange={(e) =>
                    setForm({ ...form, password_confirmation: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  placeholder="Ulangi password"
                  required
                />
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/25 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Daftar
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-dark-400">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
