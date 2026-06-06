import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useAuth } from "../contexts/AuthContext";
import { reportService, providerService } from "../api/services";
import {
  createMarkerIcon,
  getStatusLabel,
  getStatusColor,
  formatDate,
  getPhotoUrl,
} from "../utils/helpers";
import ReportDetailModal from "../components/ReportDetailModal";
import {
  LogOut,
  Cable,
  BarChart3,
  AlertTriangle,
  Search,
  Eye,
  Clock,
  CheckCircle,
  Filter,
  RefreshCw,
  FileText,
  ChevronDown,
  Building2,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({ status: "", provider_id: "" });
  const [showFilters, setShowFilters] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [view, setView] = useState("map"); // 'map' | 'list'

  const MADIUN_CENTER = [-7.6298, 111.5239];

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.provider_id) params.provider_id = filters.provider_id;
      const res = await reportService.getAll(params);
      setReports(res.data.reports);
    } catch {
      // handle error silently
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReports();
    providerService
      .getAll()
      .then((res) => setProviders(res.data.providers))
      .catch(() => {});
  }, [fetchReports]);

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await reportService.updateStatus(reportId, newStatus);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r)),
      );
      if (selectedReport?.id === reportId) {
        setSelectedReport((prev) => ({ ...prev, status: newStatus }));
      }
    } catch {
      // handle error
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus laporan ini?")) return;
    try {
      await reportService.delete(reportId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      setSelectedReport(null);
    } catch {
      // handle error
    }
  };

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    investigating: reports.filter((r) => r.status === "investigating").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  };

  return (
    <div className="h-screen flex flex-col bg-dark-900">
      {/* Header */}
      <header className="glass shrink-0 px-4 lg:px-6 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
            <Cable className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-white leading-tight">
              WebGIS Kabel Semrawut
            </h1>
            <p className="text-xs text-dark-400">
              Dashboard Admin — Kota Madiun
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReports}
            className="p-2 text-dark-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            to="/providers"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 glass-light rounded-lg text-sm text-dark-300 hover:text-white transition-colors cursor-pointer"
            title="Kelola Provider"
          >
            <Building2 className="w-4 h-4" />
            Provider
          </Link>
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

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 lg:w-96 shrink-0 flex flex-col border-r border-dark-700/50 md:flex">
          {/* Stats */}
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              {
                label: "Total",
                value: stats.total,
                icon: BarChart3,
                color: "text-primary-400",
                bg: "bg-primary-500/10",
              },
              {
                label: "Pending",
                value: stats.pending,
                icon: AlertTriangle,
                color: "text-red-400",
                bg: "bg-red-500/10",
              },
              {
                label: "Investigasi",
                value: stats.investigating,
                icon: Search,
                color: "text-yellow-400",
                bg: "bg-yellow-500/10",
              },
              {
                label: "Selesai",
                value: stats.resolved,
                icon: CheckCircle,
                color: "text-green-400",
                bg: "bg-green-500/10",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-light rounded-xl p-3 animate-fade-in"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                  </div>
                  <span className="text-xs text-dark-400">{stat.label}</span>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="px-4 pb-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              Filter
              <ChevronDown
                className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
            {showFilters && (
              <div className="mt-3 space-y-2 animate-fade-in">
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                >
                  <option value="">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select
                  value={filters.provider_id}
                  onChange={(e) =>
                    setFilters({ ...filters, provider_id: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                >
                  <option value="">Semua Provider</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Report List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
            {reports.length === 0 && !loading && (
              <div className="text-center py-12 text-dark-500">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Tidak ada laporan</p>
              </div>
            )}
            {reports.map((report, i) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="w-full text-left glass-light rounded-xl p-3 hover:bg-white/10 transition-all group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  {report.photo_path && (
                    <img
                      src={getPhotoUrl(report.photo_path)}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full status-${report.status}`}
                      >
                        {getStatusLabel(report.status)}
                      </span>
                      <Eye className="w-3.5 h-3.5 text-dark-500 group-hover:text-primary-400 transition-colors" />
                    </div>
                    <p className="text-sm text-dark-200 truncate">
                      {report.description || "Tidak ada deskripsi"}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-dark-500">
                      <Clock className="w-3 h-3" />
                      {formatDate(report.created_at)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          <MapContainer
            center={MADIUN_CENTER}
            zoom={14}
            className="h-full w-full rounded-none!"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {reports.map((report) => (
              <Marker
                key={report.id}
                position={[
                  parseFloat(report.latitude),
                  parseFloat(report.longitude),
                ]}
                icon={createMarkerIcon(report.status)}
                eventHandlers={{ click: () => setSelectedReport(report) }}
              >
                <Popup>
                  <div className="min-w-48">
                    {report.photo_path && (
                      <img
                        src={getPhotoUrl(report.photo_path)}
                        alt="Cable"
                        className="w-full h-28 object-cover rounded-lg mb-2"
                      />
                    )}
                    <p className="text-sm font-semibold text-dark-100 mb-1">
                      {report.description || "Kabel semrawut"}
                    </p>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: getStatusColor(report.status),
                        }}
                      />
                      <span className="text-xs text-dark-300">
                        {getStatusLabel(report.status)}
                      </span>
                    </div>
                    {report.provider && (
                      <p className="text-xs text-dark-400">
                        Provider: {report.provider.name}
                      </p>
                    )}
                    <p className="text-xs text-dark-500 mt-1">
                      {formatDate(report.created_at)}
                    </p>
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="mt-2 w-full py-1.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 z-1000 glass rounded-xl p-3">
            <p className="text-xs font-semibold text-dark-300 mb-2">Status</p>
            <div className="space-y-1.5">
              {[
                { status: "pending", label: "Pending" },
                { status: "investigating", label: "Investigasi" },
                { status: "resolved", label: "Selesai" },
              ].map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getStatusColor(item.status) }}
                  />
                  <span className="text-xs text-dark-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats badge (mobile) */}
          <div className="absolute top-4 left-4 z-1000 glass rounded-xl px-3 py-2 md:hidden">
            <p className="text-xs font-semibold text-dark-300">
              {reports.length} Laporan
            </p>
          </div>
        </main>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDeleteReport}
        />
      )}
    </div>
  );
}
