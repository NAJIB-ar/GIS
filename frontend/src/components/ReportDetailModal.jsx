import {
  getStatusLabel,
  getStatusColor,
  formatDate,
  getPhotoUrl,
} from "../utils/helpers";
import { X, MapPin, User, Clock, Building2, Trash2 } from "lucide-react";

const STATUSES = ["pending", "investigating", "resolved"];

export default function ReportDetailModal({ report, onClose, onStatusUpdate, onDelete }) {
  if (!report) return null;


  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="glass rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 glass rounded-t-2xl flex items-center justify-between px-5 py-4 border-b border-dark-600/50 z-10">
          <h2 className="text-lg font-bold text-white">Detail Laporan</h2>
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={() => onDelete(report.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-dark-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Hapus Laporan"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-dark-400" />
            </button>
          </div>
        </div>

        {/* Photo */}
        {report.photo_path && (
          <div className="px-5 pt-4">
            <img
              src={getPhotoUrl(report.photo_path)}
              alt="Foto kabel semrawut"
              className="w-full h-56 object-cover rounded-xl border border-dark-600/50"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-dark-500 mb-1">Status</p>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium status-${report.status}`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getStatusColor(report.status) }}
                />
                {getStatusLabel(report.status)}
              </span>
            </div>
          </div>

          {/* Status Update Buttons */}
          <div>
            <p className="text-xs text-dark-500 mb-2">Ubah Status</p>
            <div className="flex gap-2">
              {STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusUpdate(report.id, status)}
                  disabled={report.status === status}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                    report.status === status
                      ? "ring-2 ring-offset-2 ring-offset-dark-800"
                      : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: `${getStatusColor(status)}20`,
                    color: getStatusColor(status),
                    borderColor: getStatusColor(status),
                    ...(report.status === status
                      ? { ringColor: getStatusColor(status) }
                      : {}),
                  }}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          {report.description && (
            <div>
              <p className="text-xs text-dark-500 mb-1">Deskripsi</p>
              <p className="text-sm text-dark-200 leading-relaxed">
                {report.description}
              </p>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-light rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-primary-400" />
                <span className="text-xs text-dark-500">Koordinat</span>
              </div>
              <p className="text-sm text-dark-200 font-mono">
                {parseFloat(report.latitude).toFixed(5)},<br />
                {parseFloat(report.longitude).toFixed(5)}
              </p>
            </div>

            <div className="glass-light rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-primary-400" />
                <span className="text-xs text-dark-500">Waktu Lapor</span>
              </div>
              <p className="text-sm text-dark-200">
                {formatDate(report.created_at)}
              </p>
            </div>

            <div className="glass-light rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-primary-400" />
                <span className="text-xs text-dark-500">Pelapor</span>
              </div>
              <p className="text-sm text-dark-200">
                {report.user?.name || "-"}
              </p>
            </div>

            <div className="glass-light rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-primary-400" />
                <span className="text-xs text-dark-500">Provider</span>
              </div>
              <p className="text-sm text-dark-200">
                {report.provider ? (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: report.provider.color_code }}
                    />
                    {report.provider.name}
                  </span>
                ) : (
                  "Tidak diketahui"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
