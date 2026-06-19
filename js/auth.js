// =============================================
// LITTLE TOWN - AUTH.JS
// Authentication: teacher login, student QR/link
// =============================================

const AUTH = {
  // Initialize default teacher accounts
  initDefaultData() {
    if (!localStorage.getItem('lt_initialized')) {
      const defaultTeachers = [
        { 
          id: 'teacher_demo', 
          email: 'giaovien@demo.com', 
          password: 'demo123',
          name: 'Cô Lan', 
          avatar: '👩‍🏫',
          createdAt: Date.now()
        }
      ];
      
      const defaultClasses = [
        { id: 'class_3a', name: 'Lớp 3A', teacherId: 'teacher_demo', createdAt: Date.now(), houseColor: 0 }
      ];
      
      const defaultStudents = [
        { id: 'stu_001', name: 'An', classId: 'class_3a', points: 350, gender: 'male', characterStyle: 'boy_1', pets: [], inventory: [], outfit: {}, house: { furniture: [], decor: [] }, setupDone: true, houseColor: 0 },
        { id: 'stu_002', name: 'Bình', classId: 'class_3a', points: 520, gender: 'female', characterStyle: 'girl_1', pets: [], inventory: [], outfit: {}, house: { furniture: [], decor: [] }, setupDone: true, houseColor: 2 },
        { id: 'stu_003', name: 'Chi', classId: 'class_3a', points: 180, gender: 'female', characterStyle: 'girl_2', pets: [], inventory: [], outfit: {}, house: { furniture: [], decor: [] }, setupDone: true, houseColor: 4 },
        { id: 'stu_004', name: 'Dũng', classId: 'class_3a', points: 750, gender: 'male', characterStyle: 'boy_2', pets: [], inventory: [], outfit: {}, house: { furniture: [], decor: [] }, setupDone: true, houseColor: 6 },
        { id: 'stu_005', name: 'Em', classId: 'class_3a', points: 290, gender: 'female', characterStyle: 'girl_3', pets: [], inventory: [], outfit: {}, house: { furniture: [], decor: [] }, setupDone: true, houseColor: 8 },
      ];
      
      // Give default pets to students
      defaultStudents[0].pets = [{ ...GAME_DATA.pets.dogs[1], customName: 'Bông', stats: { hunger: 80, happiness: 90, cleanliness: 70, energy: 85 }, lastUpdate: Date.now() }];
      defaultStudents[1].pets = [{ ...GAME_DATA.pets.cats[0], customName: 'Mimi', stats: { hunger: 65, happiness: 75, cleanliness: 90, energy: 60 }, lastUpdate: Date.now() }];
      defaultStudents[2].pets = [{ ...GAME_DATA.pets.dogs[2], customName: 'Fluffy', stats: { hunger: 90, happiness: 80, cleanliness: 85, energy: 75 }, lastUpdate: Date.now() }];
      defaultStudents[3].pets = [{ ...GAME_DATA.pets.cats[1], customName: 'Shadow', stats: { hunger: 50, happiness: 60, cleanliness: 70, energy: 80 }, lastUpdate: Date.now() }];
      defaultStudents[4].pets = [{ ...GAME_DATA.pets.dogs[0], customName: 'Lucky', stats: { hunger: 95, happiness: 95, cleanliness: 80, energy: 90 }, lastUpdate: Date.now() }];
      
      // Give starter clothing inventories so outfit system works from day 1
      const starterInventory = (items) => items.map(id => {
        const allItems = [
          ...GAME_DATA.shops.clothes.items,
          ...GAME_DATA.shops.accessories.items,
          ...GAME_DATA.shops.food.items,
          ...GAME_DATA.shops.furniture.items,
          ...GAME_DATA.shops.decor.items,
        ];
        const found = allItems.find(i => i.id === id);
        return found ? { ...found, qty: 1 } : null;
      }).filter(Boolean);

      defaultStudents[0].outfit = { top: 'top_sport_red', bottom: 'bot_jeans_blue', shoes: 'shoe_sneaker_white' };
      defaultStudents[0].inventory = starterInventory(['top_sport_red','top_tshirt_blue','top_hoodie_grey','bot_jeans_blue','bot_shorts_red','shoe_sneaker_white','shoe_sneaker_red','food_bone','food_treat','food_meat']);

      defaultStudents[1].outfit = { top: 'top_dress_floral', shoes: 'shoe_heels' };
      defaultStudents[1].inventory = starterInventory(['top_dress_floral','top_dress_summer','top_hoodie_pink','bot_skirt_plaid','bot_skirt_tutu','shoe_heels','shoe_sandals','acc_hairpin','acc_hairband','food_fish','food_cake']);

      defaultStudents[2].outfit = { top: 'top_tshirt_white', bottom: 'bot_jeans_black', shoes: 'shoe_sneaker_white' };
      defaultStudents[2].inventory = starterInventory(['top_tshirt_white','top_shirt_school','bot_jeans_black','bot_pants_school','shoe_sneaker_white','shoe_loafers','food_kibble','food_water']);

      defaultStudents[3].outfit = { top: 'top_blazer_navy', bottom: 'bot_trouser_formal', shoes: 'shoe_loafers' };
      defaultStudents[3].inventory = starterInventory(['top_blazer_navy','top_polo_stripe','bot_trouser_formal','bot_jeans_blue','shoe_loafers','shoe_sneaker_white','acc_glasses_round','acc_watch','food_meat','food_soup','fur_bed_single','fur_desk_study']);

      defaultStudents[4].outfit = { top: 'top_cardigan', bottom: 'bot_leggings', shoes: 'shoe_boots_brown' };
      defaultStudents[4].inventory = starterInventory(['top_cardigan','top_raincoat','bot_leggings','bot_flare','shoe_boots_brown','shoe_sandals','acc_scarf','acc_bow','food_kibble','food_treat','dec_plant_small','dec_led_lights']);
      
      const defaultHistory = [];
      
      localStorage.setItem('lt_teachers', JSON.stringify(defaultTeachers));
      localStorage.setItem('lt_classes', JSON.stringify(defaultClasses));
      localStorage.setItem('lt_students', JSON.stringify(defaultStudents));
      localStorage.setItem('lt_history', JSON.stringify(defaultHistory));
      localStorage.setItem('lt_initialized', 'true');
    }
  },

  // Teacher login (email không phân biệt hoa/thường)
  teacherLogin(email, password) {
    const teachers = JSON.parse(localStorage.getItem('lt_teachers') || '[]');
    const teacher = teachers.find(t => t.email.toLowerCase() === email.toLowerCase().trim() && t.password === password);
    if (teacher) {
      // Dùng native setItem để không trigger SYNC
      Object.getPrototypeOf(localStorage).setItem.call(localStorage, 'lt_current_teacher', JSON.stringify(teacher));
      return { success: true, teacher };
    }
    return { success: false, error: 'Email hoặc mật khẩu không đúng' };
  },

  // Teacher self-register
  teacherRegister({ name, email, password }) {
    const teachers = JSON.parse(localStorage.getItem('lt_teachers') || '[]');

    // Check duplicate email
    if (teachers.find(t => t.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email này đã được đăng ký rồi!' };
    }

    const newTeacher = {
      id: 'teacher_' + Date.now(),
      email: email.toLowerCase(),
      password,
      name,
      avatar: '👩‍🏫',
      createdAt: Date.now()
    };

    teachers.push(newTeacher);
    localStorage.setItem('lt_teachers', JSON.stringify(teachers));

    // Auto login (dùng native setItem)
    Object.getPrototypeOf(localStorage).setItem.call(localStorage, 'lt_current_teacher', JSON.stringify(newTeacher));
    return { success: true, teacher: newTeacher };
  },

  // Teacher logout
  teacherLogout() {
    Object.getPrototypeOf(localStorage).removeItem.call(localStorage, 'lt_current_teacher');
    window.location.href = 'index.html';
  },

  // Get current teacher
  getCurrentTeacher() {
    const data = Object.getPrototypeOf(localStorage).getItem.call(localStorage, 'lt_current_teacher');
    return data ? JSON.parse(data) : null;
  },

  // Student login via token / ID
  studentLogin(studentId) {
    const students = JSON.parse(localStorage.getItem('lt_students') || '[]');
    const student = students.find(s => s.id === studentId);
    if (student) {
      Object.getPrototypeOf(localStorage).setItem.call(localStorage, 'lt_current_student', JSON.stringify(student));
      // Lưu ID vào thiết bị (không sync lên server) để tự đăng nhập lần sau
      this.saveDeviceStudent(studentId);
      return { success: true, student };
    }
    return { success: false, error: 'Không tìm thấy học sinh' };
  },

  // Lưu student ID vào thiết bị này (chỉ local, không sync lên server)
  saveDeviceStudent(studentId) {
    try {
      window.localStorage.setItem('lt_device_student_id', studentId);
    } catch(e) {}
  },

  // Lấy student ID đã lưu trên thiết bị này
  getDeviceStudentId() {
    try {
      return window.localStorage.getItem('lt_device_student_id') || null;
    } catch(e) { return null; }
  },

  // Xóa thông tin thiết bị (khi logout hoàn toàn)
  clearDeviceStudent() {
    try {
      window.localStorage.removeItem('lt_device_student_id');
    } catch(e) {}
  },

  // Student logout
  studentLogout() {
    Object.getPrototypeOf(localStorage).removeItem.call(localStorage, 'lt_current_student');
    // KHÔNG xóa lt_device_student_id để lần sau vẫn tự đăng nhập
    window.location.href = 'index.html';
  },

  // Student logout hoàn toàn (xóa cả thiết bị - dùng khi muốn đổi tài khoản)
  studentLogoutFull() {
    Object.getPrototypeOf(localStorage).removeItem.call(localStorage, 'lt_current_student');
    this.clearDeviceStudent();
    window.location.href = 'index.html';
  },

  // Get current student (luôn lấy dữ liệu mới nhất)
  getCurrentStudent() {
    const stored = Object.getPrototypeOf(localStorage).getItem.call(localStorage, 'lt_current_student');
    if (!stored) return null;
    const student = JSON.parse(stored);
    // Luôn lấy bản mới nhất từ localStorage
    const students = JSON.parse(localStorage.getItem('lt_students') || '[]');
    const fresh = students.find(s => s.id === student.id);
    if (fresh) {
      Object.getPrototypeOf(localStorage).setItem.call(localStorage, 'lt_current_student', JSON.stringify(fresh));
    }
    return fresh || student;
  },

  // Generate student login URL (works for both http:// and file://)
  generateStudentUrl(studentId) {
    const token = btoa(studentId);
    let base = '';
    
    if (window.location.protocol === 'file:') {
      base = window.location.href.replace(/[^/\\]*$/, 'index.html');
      return `${base}?student=${token}`;
    }
    
    // Nếu chạy qua http/https web, tự động lấy origin + đường dẫn thư mục hiện tại
    const currentPath = window.location.pathname;
    const dirPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    base = window.location.origin + dirPath;
    
    const cleanBase = base.includes('index.html') ? base.split('index.html')[0] : base;
    const endSep = cleanBase.endsWith('/') ? '' : '/';
    return `${cleanBase}${endSep}index.html?student=${token}`;
  },

  // Generate QR code data URL using QR library
  generateQRData(studentId) {
    return this.generateStudentUrl(studentId);
  },

  // Check URL for student token on page load
  checkStudentToken() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('student');
    if (token) {
      try {
        const studentId = atob(token);
        return studentId;
      } catch (e) {}
    }
    return null;
  }
};

// =============================================
// DATA MANAGEMENT
// =============================================
const DB = {
  getStudents() { return JSON.parse(localStorage.getItem('lt_students') || '[]'); },
  getClasses() { return JSON.parse(localStorage.getItem('lt_classes') || '[]'); },
  getTeachers() { return JSON.parse(localStorage.getItem('lt_teachers') || '[]'); },
  getHistory() { return JSON.parse(localStorage.getItem('lt_history') || '[]'); },

  saveStudents(students) { localStorage.setItem('lt_students', JSON.stringify(students)); },
  saveClasses(classes) { localStorage.setItem('lt_classes', JSON.stringify(classes)); },
  saveTeachers(teachers) { localStorage.setItem('lt_teachers', JSON.stringify(teachers)); },
  saveHistory(history) { localStorage.setItem('lt_history', JSON.stringify(history)); },

  getStudent(id) {
    return this.getStudents().find(s => s.id === id) || null;
  },

  updateStudent(id, updates) {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.id === id);
    if (idx !== -1) {
      students[idx] = { ...students[idx], ...updates };
      this.saveStudents(students);
      // Cập nhật auth state nếu đây là học sinh đang đăng nhập
      const _get = Object.getPrototypeOf(localStorage).getItem.bind(localStorage);
      const _set = Object.getPrototypeOf(localStorage).setItem.bind(localStorage);
      const current = _get('lt_current_student');
      if (current) {
        const curr = JSON.parse(current);
        if (curr.id === id) {
          _set('lt_current_student', JSON.stringify(students[idx]));
        }
      }
      return students[idx];
    }
    return null;

  },

  addStudent(student) {
    const students = this.getStudents();
    const newStudent = {
      id: 'stu_' + Date.now(),
      points: 0,
      gender: null,
      characterStyle: null,
      pets: [],
      inventory: [],
      outfit: {},
      house: { furniture: [], decor: [] },
      setupDone: false,
      houseColor: Math.floor(Math.random() * HOUSE_COLORS.length),
      gameLevel: 1,
      gameLives: 3,
      lastLifeLostTime: null,
      ...student
    };
    students.push(newStudent);
    this.saveStudents(students);
    return newStudent;
  },

  removeStudent(id) {
    const students = this.getStudents().filter(s => s.id !== id);
    this.saveStudents(students);
  },

  addClass(cls) {
    const classes = this.getClasses();
    const newClass = {
      id: 'class_' + Date.now(),
      createdAt: Date.now(),
      ...cls
    };
    classes.push(newClass);
    this.saveClasses(classes);
    return newClass;
  },

  removeClass(id) {
    // Also remove students in that class
    const students = this.getStudents().filter(s => s.classId !== id);
    this.saveStudents(students);
    const classes = this.getClasses().filter(c => c.id !== id);
    this.saveClasses(classes);
  },

  addPoints(studentId, points, teacherId, teacherName, note = '') {
    const student = this.getStudent(studentId);
    if (!student) return null;
    const newPoints = Math.max(0, (student.points || 0) + points);
    this.updateStudent(studentId, { points: newPoints });
    
    // Log history
    const history = this.getHistory();
    history.unshift({
      id: 'hist_' + Date.now(),
      studentId,
      studentName: student.name,
      teacherId,
      teacherName,
      change: points,
      newTotal: newPoints,
      note,
      timestamp: Date.now()
    });
    this.saveHistory(history.slice(0, 500)); // Keep last 500 records
    return newPoints;
  },

  buyItem(studentId, item) {
    const student = this.getStudent(studentId);
    if (!student) return { success: false, error: 'Không tìm thấy học sinh' };
    if (student.points < item.price) return { success: false, error: 'Không đủ điểm' };
    
    // Check if pet (max 3)
    if (item.type === 'dog' || item.type === 'cat') {
      if ((student.pets || []).length >= 3) return { success: false, error: 'Tối đa 3 thú cưng' };
      const newPet = { 
        ...item, 
        customName: item.nameVi, 
        stats: { hunger: 100, happiness: 100, cleanliness: 100, energy: 100 },
        lastUpdate: Date.now()
      };
      const pets = [...(student.pets || []), newPet];
      this.updateStudent(studentId, { pets, points: student.points - item.price });
    } else {
      // Add to inventory
      const inventory = [...(student.inventory || [])];
      const existing = inventory.find(i => i.id === item.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        inventory.push({ ...item, qty: 1 });
      }
      this.updateStudent(studentId, { inventory, points: student.points - item.price });
    }
    return { success: true };
  },

  useFoodItem(studentId, itemId, petIndex) {
    const student = this.getStudent(studentId);
    if (!student) return { success: false };
    
    const invItem = (student.inventory || []).find(i => i.id === itemId);
    if (!invItem || !invItem.qty) return { success: false, error: 'Không có vật phẩm' };
    
    const pet = (student.pets || [])[petIndex];
    if (!pet) return { success: false, error: 'Không có thú cưng' };
    
    // Apply effect
    const effect = invItem.effect || {};
    const newStats = { ...pet.stats };
    Object.keys(effect).forEach(key => {
      newStats[key] = Math.min(100, (newStats[key] || 0) + effect[key]);
    });
    
    // Update pet stats
    const pets = [...student.pets];
    pets[petIndex] = { ...pet, stats: newStats, lastUpdate: Date.now() };
    
    // Reduce inventory
    const inventory = [...student.inventory];
    const invIdx = inventory.findIndex(i => i.id === itemId);
    inventory[invIdx].qty--;
    if (inventory[invIdx].qty <= 0) inventory.splice(invIdx, 1);
    
    this.updateStudent(studentId, { pets, inventory });
    return { success: true, newStats };
  }
};
