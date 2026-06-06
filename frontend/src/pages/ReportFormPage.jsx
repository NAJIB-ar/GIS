import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useAuth } from "../contexts/AuthContext";
import { reportService, providerService } from "../api/services";
import { createMarkerIcon } from "../utils/helpers";
import {
  Camera,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  LogOut,
  Crosshair,
  X,
  Cable,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? (
    <Marker position={position} icon={createMarkerIcon("pending")} />
  ) : null;
}

export default function ReportFormPage() {
  const { user, logout } = useAuth();
  const [position, setPosition] = useState(null);
  const [providers, setProviders] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [providerId, setProviderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const mapRef = useRef(null);

  // Madiun City center
  const MADIUN_CENTER = [-7.6298, 111.5239];

  const detectGPS = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        if (mapRef.current) {
          mapRef.current.flyTo(coords, 17, { duration: 1.5 });
        }
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  useEffect(() => {
    providerService
      .getAll()
      .then((res) => setProviders(res.data.providers))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/set-state-in-effect
    detectGPS();
  }, []);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) return setError("Pilih lokasi pada peta terlebih dahulu.");
    if (!photo) return setError("Foto wajib dilampirkan.");

    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("latitude", position[0]);
      formData.append("longitude", position[1]);
      formData.append("photo", photo);
      formData.append("description", description);
      if (providerId) formData.append("provider_id", providerId);

      await reportService.create(formData);
      setSuccess(true);
      // Reset form
      setTimeout(() => {
        setSuccess(false);
        setPhoto(null);
        setPhotoPreview(null);
        setDescription("");
        setProviderId("");
        setPosition(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengirim laporan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Cable className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">
              Lapor Kabel Semrawut
            </h1>
            <p className="text-xs text-dark-400">{user?.name}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-2 text-dark-400 hover:text-white transition-colors cursor-pointer"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Success overlay */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass rounded-2xl p-8 text-center max-w-sm mx-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Laporan Terkirim!
            </h2>
            <p className="text-dark-400 text-sm">
              Terima kasih. Laporan Anda sedang diproses.
            </p>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="relative h-64 md:h-80 shrink-0">
        <MapContainer
          center={MADIUN_CENTER}
          zoom={14}
          ref={mapRef}
          className="h-full w-full rounded-none!"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationPicker position={position} setPosition={setPosition} />
        </MapContainer>

        {/* GPS button */}
        <button
          onClick={detectGPS}
          disabled={gpsLoading}
          className="absolute bottom-4 right-4 z-1000 p-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/30 transition-all cursor-pointer disabled:opacity-50"
          title="Gunakan GPS"
        >
          <Crosshair
            className={`w-5 h-5 ${gpsLoading ? "animate-spin" : ""}`}
          />
        </button>

        {position && (
          <div className="absolute bottom-4 left-4 z-1000 glass rounded-xl px-3 py-2 text-xs text-dark-300">
            <MapPin className="w-3 h-3 inline mr-1" />
            {position[0].toFixed(5)}, {position[1].toFixed(5)}
          </div>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 p-4 space-y-4 overflow-auto animate-fade-in"
      >
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Foto Kabel Semrawut *
          </label>
          {photoPreview ? (
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPhoto(null);
                  setPhotoPreview(null);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 border-2 border-dashed border-dark-600 rounded-xl flex flex-col items-center gap-2 text-dark-400 hover:border-primary-500 hover:text-primary-400 transition-colors cursor-pointer"
            >
              <Camera className="w-8 h-8" />
              <span className="text-sm">Tap untuk ambil foto</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhoto}
            className="hidden"
            id="photo-input"
          />
        </div>

        {/* Provider Select */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Provider (opsional)
          </label>
          <select
            id="provider-select"
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">— Pilih Provider —</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Deskripsi (opsional)
          </label>
          <textarea
            id="description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none"
            placeholder="Deskripsikan kondisi kabel..."
          />
        </div>

        {/* Submit */}
        <button
          id="submit-report"
          type="submit"
          disabled={loading || !position || !photo}
          className="w-full py-3.5 px-4 bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary-600/25 cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Kirim Laporan
            </>
          )}
        </button>
      </form>
    </div>
  );
}
