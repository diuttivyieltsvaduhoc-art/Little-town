# 🚀 Hướng Dẫn Đưa Little Town Lên Internet (GitHub Pages + Firebase)

Tài liệu này hướng dẫn bạn từng bước cách đưa website **Little Town** lên Internet miễn phí, chạy vĩnh viễn, không cần bật máy tính cá nhân.

---

## 📌 Tổng quan các bước thực hiện
1. **Tạo Database Firebase** để lưu trữ dữ liệu của lớp học trực tuyến.
2. **Cấu hình URL Database** vào dự án.
3. **Đẩy mã nguồn lên GitHub** để quản lý mã nguồn.
4. **Bật GitHub Pages** để chạy trang web công khai trên Internet.

---

## 🛠️ Bước 1: Tạo Database Firebase (Miễn phí)

1. Truy cập vào **[Firebase Console](https://console.firebase.google.com/)** và đăng nhập bằng tài khoản Google của bạn.
2. Nhấn nút **Add project** (Tạo dự án mới).
   - Đặt tên dự án là `little-town` (hoặc tên bất kỳ bạn thích).
   - Bấm **Continue** qua các bước (bạn có thể tắt Google Analytics để tạo nhanh hơn).
3. Sau khi dự án được tạo xong, tại danh sách menu bên trái, tìm mục **Build** ➜ Chọn **Realtime Database**.
4. Nhấn **Create Database** (Tạo cơ sở dữ liệu).
   - Chọn vị trí lưu trữ (Location): Bạn nên chọn **Singapore (asia-southeast1)** để tốc độ mạng từ Việt Nam được nhanh nhất.
   - Nhấn **Next**.
   - Chọn chế độ ban đầu: Chọn **Start in test mode** (Chế độ thử nghiệm) ➜ Nhấn **Enable**.
5. **Cấu hình Quyền đọc/ghi công khai (Quan trọng):**
   - Chuyển sang tab **Rules** (ở phía trên cùng).
   - Thay đổi luật bảo mật thành như dưới đây (cho phép đọc và ghi công khai để các thiết bị học sinh đều gửi/nhận dữ liệu được):
     ```json
     {
       "rules": {
         ".read": true,
         ".write": true
       }
     }
     ```
   - Nhấn nút **Publish** (Xuất bản) để lưu luật mới.
6. **Lấy link Database:**
   - Chuyển lại về tab **Data**.
   - Copy đường dẫn URL có dạng: `https://xxxx-default-rtdb.asia-southeast1.firebasedatabase.app/` (có biểu tượng nút copy ngay cạnh đường dẫn).

---

## ⚙️ Bước 2: Cấu hình URL vào mã nguồn

1. Mở file [js/sync.js](file:///Users/tranthidiu/.gemini/antigravity-ide/scratch/little-town/js/sync.js) trên máy tính của bạn.
2. Tìm dòng số **12** chứa biến `const FIREBASE_DB_URL = "";`.
3. Dán đường dẫn URL Firebase bạn vừa copy vào giữa hai dấu ngoặc kép.
   *Ví dụ:*
   ```javascript
   const FIREBASE_DB_URL = "https://xxxx-default-rtdb.asia-southeast1.firebasedatabase.app/";
   ```
4. Lưu file lại.

---

## 📤 Bước 3: Đẩy mã nguồn lên GitHub

1. Truy cập vào **[GitHub](https://github.com)** và đăng nhập vào tài khoản của bạn.
2. Nhấn nút **New** (ở góc trái hoặc góc phải trên) để tạo một repository mới.
   - **Repository name:** Nhập `little-town`.
   - Chọn chế độ **Public** (Bắt buộc phải chọn Public để dùng được GitHub Pages miễn phí).
   - Không tích chọn bất kỳ mục nào khác (như Add a README, .gitignore, license...).
   - Bấm **Create repository**.
3. Sau khi tạo xong, bạn sẽ thấy danh sách lệnh Git. Hãy chạy các lệnh sau trong Terminal của IDE hoặc Terminal trên máy tính của bạn (đứng tại thư mục `little-town`):
   
   ```bash
   # 1. Khởi tạo Git trong thư mục dự án
   git init

   # 2. Add toàn bộ các file vào git
   git add .

   # 3. Commit lần đầu tiên
   git commit -m "Initial commit with Firebase support"

   # 4. Tạo nhánh chính main
   git branch -M main

   # 5. Kết nối với repo trên GitHub (Thay URL GitHub của bạn vào đây)
   git remote add origin https://github.com/TEN_TAI_KHOAN_CUA_BAN/little-town.git

   # 6. Đẩy code lên GitHub
   git push -u origin main
   ```

---

## 🌐 Bước 4: Kích hoạt GitHub Pages (Website trực tuyến)

Sau khi code đã đẩy lên GitHub thành công:
1. Tại trang repository `little-town` trên GitHub, chọn tab **Settings** (Cài đặt) ở thanh menu trên cùng.
2. Tại danh sách menu bên trái, tìm mục **Code and automation** ➜ Chọn **Pages**.
3. Ở mục **Build and deployment**:
   - **Source:** Chọn `Deploy from a branch`.
   - **Branch:** Chọn nhánh `main` và thư mục `/ (root)` ➜ Nhấn **Save**.
4. Chờ khoảng 1 - 2 phút, sau đó tải lại trang này. Bạn sẽ thấy một thông báo màu xanh lá cây chứa đường link trang web của bạn:
   `Your site is live at https://ten_tai_khoan.github.io/little-town/`
5. **Cách truy cập:**
   - **Trang chủ (Giáo viên & Học sinh đăng nhập chung):** `https://ten_tai_khoan.github.io/little-town/`
   - **Bảng điều khiển Giáo viên:** `https://ten_tai_khoan.github.io/little-town/teacher.html`
   - **Trang nhà của Học sinh:** `https://ten_tai_khoan.github.io/little-town/student.html`

---

## 🔒 Kiểm tra & Hoàn tất
- Khi giáo viên vào trang `teacher.html` đã được deploy, hệ thống sẽ tự động hiển thị link website chính thức trong phần **Link đăng nhập học sinh**.
- Khi giáo viên tạo học sinh và copy link hoặc QR Code, link đăng nhập của học sinh sẽ tự động định dạng theo trang web online (ví dụ: `https://ten_tai_khoan.github.io/little-town/index.html?student=xxxx`).
- Học sinh quét mã QR hoặc click link từ điện thoại/máy tính ở bất kỳ đâu đều đăng nhập thành công và dữ liệu sẽ lưu ngay lập tức lên Firebase.
- Bản chạy cục bộ trên máy tính của bạn thông qua `server.py` hoặc click trực tiếp file HTML vẫn có thể hoạt động song song để bạn thử nghiệm trước khi đẩy lên GitHub!
