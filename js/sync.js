// ============================================
// LITTLE TOWN - SYNC.JS  
// Đồng bộ dữ liệu đa thiết bị qua server REST API hoặc Firebase
// ============================================

// ============================================
// CONFIGURATION: Cấu hình Firebase tại đây
// Nếu dùng Firebase, hãy nhập URL Firebase Realtime Database của bạn vào đây.
// Ví dụ: "https://little-town-demo-default-rtdb.asia-southeast1.firebasedatabase.app/"
// Nếu để trống "", hệ thống sẽ tự động dùng Server Python local hiện tại.
// ============================================
const FIREBASE_DB_URL = "";

// Global variable for local network IP
window.SERVER_NETWORK_IP = '';

const SYNC = (() => {
  const KEYS = ['lt_teachers','lt_classes','lt_students','lt_history','lt_initialized','lt_theme'];
  // Chỉ sync khi chạy qua server, không phải file://
  const enabled = window.location.protocol !== 'file:';
  let _saveTimer = null;

  function isFirebase() {
    return FIREBASE_DB_URL && FIREBASE_DB_URL.trim() !== "";
  }

  function getDbUrl() {
    if (isFirebase()) {
      let clean = FIREBASE_DB_URL.trim();
      if (clean.endsWith('/')) {
        clean = clean.slice(0, -1);
      }
      if (!clean.endsWith('.json')) {
        clean += '/.json';
      }
      return clean;
    }
    return '/api/db';
  }

  // Lấy IP mạng nội bộ từ server khi load (chỉ khi không dùng Firebase)
  let infoPromise = null;
  if (enabled && !isFirebase()) {
    infoPromise = fetch('/api/info')
      .then(res => res.json())
      .then(info => {
        if (info.network && info.network.length > 0) {
          window.SERVER_NETWORK_IP = info.network[0];
        } else {
          window.SERVER_NETWORK_IP = info.localhost || '';
        }
      })
      .catch(() => {});
  }

  // ---- LOAD: kéo dữ liệu từ server/Firebase về localStorage ----
  async function load() {
    if (!enabled) return false;
    if (_saveTimer !== null) return false; // Tránh đè dữ liệu cục bộ khi đang chờ lưu!
    if (infoPromise) {
      try {
        await infoPromise;
      } catch (e) {}
    }
    try {
      const url = getDbUrl();
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return false;
      const data = await res.json();
      if (!data || typeof data !== 'object') return false; // Tránh lỗi khi db trống hoặc null
      let changed = false;
      KEYS.forEach(key => {
        if (data[key] !== undefined) {
          // Lưu nguyên string (data đã JSON.stringify rồi)
          const raw = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
          const current = Object.getPrototypeOf(localStorage).getItem.call(localStorage, key);
          if (current !== raw) {
            // Bypass patch bên dưới để tránh vòng lặp
            Object.getPrototypeOf(localStorage).setItem.call(localStorage, key, raw);
            changed = true;
          }
        }
      });
      return changed;
    } catch (e) {
      return false;
    }
  }

  // ---- SAVE: đẩy localStorage lên server/Firebase (debounced 300ms) ----
  function save() {
    if (!enabled) return;
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => {
      _saveTimer = null;
      const data = {};
      KEYS.forEach(key => {
        const val = Object.getPrototypeOf(localStorage).getItem.call(localStorage, key);
        if (val !== null) data[key] = val;
      });
      
      const url = getDbUrl();
      const usePut = isFirebase(); // Firebase REST cần PUT để ghi đè toàn bộ DB
      
      fetch(url, {
        method: usePut ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    }, 300);
  }

  // ---- RESET: xóa db.json trên server/Firebase ----
  async function reset() {
    if (!enabled) return;
    const url = getDbUrl();
    if (isFirebase()) {
      await fetch(url, { method: 'DELETE' }).catch(() => {});
    } else {
      await fetch('/api/db/reset', { method: 'POST' }).catch(() => {});
    }
  }

  // ---- Patch localStorage.setItem để tự động sync ----
  if (enabled) {
    const _origSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      _origSet.call(this, key, value);
      if (this === localStorage && KEYS.includes(key)) {
        SYNC.save();
      }
    };
  }

  // ---- Hiển thị URL mạng nội bộ hoặc link public ----
  async function showNetworkInfo(containerId) {
    if (!enabled) return;
    const el = document.getElementById(containerId);
    if (!el) return;

    if (isFirebase()) {
      // Đổi nhãn giải thích
      const label = el.previousElementSibling;
      if (label) {
        label.textContent = "🌐 Đường link trang chủ website (Giáo viên & Học sinh dùng chung):";
      }
      const currentOrigin = window.location.origin;
      const currentPath = window.location.pathname.replace('teacher.html', '').replace(/\/$/, '');
      const studentUrl = `${currentOrigin}${currentPath}/student.html`;
      el.innerHTML = `<a href="${studentUrl}" target="_blank" style="color:var(--accent);font-weight:700;font-size:0.82rem;">${studentUrl}</a>`;
    } else {
      try {
        const res = await fetch('/api/info');
        const info = await res.json();
        const urls = info.network.length > 0 ? info.network : [info.localhost];
        el.innerHTML = urls.map(u =>
          `<a href="${u}" target="_blank" style="color:var(--accent);font-weight:700;font-size:0.82rem;">${u}</a>`
        ).join('<br>');
      } catch (e) {}
    }
  }

  return { load, save, reset, enabled, showNetworkInfo, isFirebase };
})();
