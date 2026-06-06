import L from 'leaflet';

// Status-based marker colors
const STATUS_COLORS = {
  pending: '#ef4444',
  investigating: '#f59e0b',
  resolved: '#10b981',
};

const STATUS_LABELS = {
  pending: 'Pending',
  investigating: 'Investigating',
  resolved: 'Resolved',
};

export function getStatusColor(status) {
  return STATUS_COLORS[status] || '#6b7280';
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export function createMarkerIcon(status) {
  const color = getStatusColor(status);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="40">
      <defs>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.4"/>
        </filter>
      </defs>
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" 
            fill="${color}" filter="url(#shadow)"/>
      <circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
  });
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getPhotoUrl(photoPath) {
  if (!photoPath) return null;
  return `/storage/${photoPath}`;
}
