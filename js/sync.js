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
const FIREBASE_DB_URL = "https://little-town-70d02-default-rtdb.asia-southeast1.firebasedatabase.app/";

// Global variable for local network IP
window.SERVER_NETWORK_IP = '';

const SYNC = (() => {
  const KEYS = ['lt_teachers', 'lt_classes', 'lt_students', 'lt_history', 'lt_initialized', 'lt_theme'];
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
      .catch(() => { });
  }

  // Private helper to merge local and server array data to prevent data overwrites
  function mergeArrays(key, localRaw, serverRaw) {
    const safeParse = (str) => {
      if (!str) return [];
      try { return typeof str === 'string' ? JSON.parse(str) : str; } catch(e) { return []; }
    };
    const localArr = safeParse(localRaw);
    const serverArr = safeParse(serverRaw);
    
    if (key === 'lt_students') {
      const mergedMap = new Map();
      // Put server students first
      serverArr.forEach(s => { if (s && s.id) mergedMap.set(s.id, s); });
      
      // Merge local students
      const localCurrentStudent = safeParse(Object.getPrototypeOf(localStorage).getItem.call(localStorage, 'lt_current_student'));
      localArr.forEach(localS => {
        if (!localS || !localS.id) return;
        const serverS = mergedMap.get(localS.id);
        if (serverS) {
          let merged = { ...serverS, ...localS };
          
          // Merge rules:
          // Keep highest progress level and points
          merged.points = Math.max(localS.points || 0, serverS.points || 0);
          merged.gameLevel = Math.max(localS.gameLevel || 1, serverS.gameLevel || 1);
          
          // If this student is currently active, preserve their local inventory/outfit/pets
          const isActive = localCurrentStudent && localCurrentStudent.id === localS.id;
          if (isActive) {
            merged.inventory = localS.inventory || merged.inventory || [];
            merged.outfit = localS.outfit || merged.outfit || {};
            merged.pets = localS.pets || merged.pets || [];
            merged.setupDone = localS.setupDone || merged.setupDone || false;
          } else {
            // Take whichever has larger arrays to avoid losing purchased items
            if ((localS.inventory || []).length > (serverS.inventory || []).length) {
              merged.inventory = localS.inventory;
            }
            if ((localS.pets || []).length > (serverS.pets || []).length) {
              merged.pets = localS.pets;
            }
          }
          mergedMap.set(localS.id, merged);
        } else {
          // Local student not on server, keep it
          mergedMap.set(localS.id, localS);
        }
      });
      return Array.from(mergedMap.values());
    }
    
    if (key === 'lt_teachers' || key === 'lt_classes') {
      const mergedMap = new Map();
      serverArr.forEach(item => { if (item && item.id) mergedMap.set(item.id, item); });
      localArr.forEach(item => { if (item && item.id) mergedMap.set(item.id, item); });
      return Array.from(mergedMap.values());
    }
    
    if (key === 'lt_history') {
      const mergedMap = new Map();
      serverArr.forEach(item => { if (item && item.id) mergedMap.set(item.id, item); });
      localArr.forEach(item => { if (item && item.id) mergedMap.set(item.id, item); });
      return Array.from(mergedMap.values())
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 500);
    }
    
    return serverArr;
  }

  // ---- LOAD: kéo dữ liệu từ server/Firebase về localStorage ----
  async function load() {
    if (!enabled) return false;
    if (_saveTimer !== null) return false; // Tránh đè dữ liệu cục bộ khi đang chờ lưu!
    if (infoPromise) {
      try {
        await infoPromise;
      } catch (e) { }
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
          const raw = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
          const current = Object.getPrototypeOf(localStorage).getItem.call(localStorage, key);
          if (current !== raw) {
            let mergedRaw = raw;
            if (key === 'lt_students' || key === 'lt_teachers' || key === 'lt_classes' || key === 'lt_history') {
              mergedRaw = JSON.stringify(mergeArrays(key, current, raw));
            }
            if (current !== mergedRaw) {
              // Bypass patch bên dưới để tránh vòng lặp
              Object.getPrototypeOf(localStorage).setItem.call(localStorage, key, mergedRaw);
              changed = true;
            }
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
    _saveTimer = setTimeout(async () => {
      _saveTimer = null;
      
      // Fetch latest server data to merge before writing
      let serverData = {};
      try {
        const url = getDbUrl();
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          serverData = await res.json() || {};
        }
      } catch (e) {
        console.error("Error fetching for sync merge:", e);
      }

      const mergedData = {};
      KEYS.forEach(key => {
        const localVal = Object.getPrototypeOf(localStorage).getItem.call(localStorage, key);
        const serverVal = serverData[key];
        
        let mergedVal = localVal;
        if (localVal !== null && serverVal !== undefined) {
          if (key === 'lt_students' || key === 'lt_teachers' || key === 'lt_classes' || key === 'lt_history') {
            const localRaw = typeof localVal === 'string' ? localVal : JSON.stringify(localVal);
            const serverRaw = typeof serverVal === 'string' ? serverVal : JSON.stringify(serverVal);
            mergedVal = JSON.stringify(mergeArrays(key, localRaw, serverRaw));
          }
        } else if (localVal === null && serverVal !== undefined) {
          mergedVal = typeof serverVal === 'string' ? serverVal : JSON.stringify(serverVal);
        }
        
        if (mergedVal !== null) {
          mergedData[key] = mergedVal;
          // Bypass patch to update local storage with the merged data
          Object.getPrototypeOf(localStorage).setItem.call(localStorage, key, mergedVal);
        }
      });

      // Update lt_current_student if it matches the merged list
      const localCurrentStudentRaw = Object.getPrototypeOf(localStorage).getItem.call(localStorage, 'lt_current_student');
      if (localCurrentStudentRaw && mergedData.lt_students) {
        try {
          const localCurrentStudent = JSON.parse(localCurrentStudentRaw);
          const mergedStudents = JSON.parse(mergedData.lt_students);
          const updatedCurrent = mergedStudents.find(s => s.id === localCurrentStudent.id);
          if (updatedCurrent) {
            Object.getPrototypeOf(localStorage).setItem.call(localStorage, 'lt_current_student', JSON.stringify(updatedCurrent));
          }
        } catch(e) {}
      }

      const url = getDbUrl();
      const usePut = isFirebase(); // Firebase REST cần PUT để ghi đè toàn bộ DB

      fetch(url, {
        method: usePut ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mergedData)
      }).catch(() => { });
    }, 300);
  }

  // ---- RESET: xóa db.json trên server/Firebase ----
  async function reset() {
    if (!enabled) return;
    const url = getDbUrl();
    if (isFirebase()) {
      await fetch(url, { method: 'DELETE' }).catch(() => { });
    } else {
      await fetch('/api/db/reset', { method: 'POST' }).catch(() => { });
    }
  }

  // ---- Patch localStorage.setItem để tự động sync ----
  if (enabled) {
    const _origSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
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
      } catch (e) { }
    }
  }

  return { load, save, reset, enabled, showNetworkInfo, isFirebase };
})();
