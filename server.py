#!/usr/bin/env python3
"""
Little Town - Server đa thiết bị + Public Internet Access
Serves static files + REST API + Cloudflare Tunnel để học sinh truy cập từ mọi nơi
"""
import http.server
import socketserver
import json
import os
import socket
import sys
import subprocess
import threading
import time
import re

PORT = 5500
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(SCRIPT_DIR, 'db.json')
CLOUDFLARED_PATH = os.path.join(SCRIPT_DIR, 'cloudflared')

# Lưu URL công khai toàn cục
public_url = None

class LittleTownHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=SCRIPT_DIR, **kwargs)

    def send_cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors()
        self.end_headers()

    def do_GET(self):
        # ---- API: Read DB ----
        if self.path == '/api/db':
            try:
                data = {}
                if os.path.exists(DB_FILE):
                    with open(DB_FILE, encoding='utf-8') as f:
                        data = json.load(f)
                body = json.dumps(data, ensure_ascii=False).encode('utf-8')
                self.send_response(200)
                self.send_cors()
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', len(body))
                self.send_header('Cache-Control', 'no-store')
                self.end_headers()
                self.wfile.write(body)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode())
            return

        # ---- API: Server info (IP, port, public URL) ----
        if self.path == '/api/info':
            ips = get_local_ips()
            info = {
                'port': PORT,
                'localhost': f'http://localhost:{PORT}',
                'network': [f'http://{ip}:{PORT}' for ip in ips],
                'public': public_url  # URL công khai qua Cloudflare
            }
            body = json.dumps(info).encode()
            self.send_response(200)
            self.send_cors()
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', len(body))
            self.end_headers()
            self.wfile.write(body)
            return

        super().do_GET()

    def do_POST(self):
        # ---- API: Write DB ----
        if self.path == '/api/db':
            try:
                length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(length)
                data = json.loads(body.decode('utf-8'))
                with open(DB_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                resp = b'{"ok":true}'
                self.send_response(200)
                self.send_cors()
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', len(resp))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                err = json.dumps({'ok': False, 'error': str(e)}).encode()
                self.send_response(500)
                self.end_headers()
                self.wfile.write(err)
            return

        # ---- API: Reset DB ----
        if self.path == '/api/db/reset':
            if os.path.exists(DB_FILE):
                os.remove(DB_FILE)
            resp = b'{"ok":true}'
            self.send_response(200)
            self.send_cors()
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', len(resp))
            self.end_headers()
            self.wfile.write(resp)
            return

        self.send_response(404)
        self.end_headers()

    def log_message(self, fmt, *args):
        # Only log API calls and errors safely
        path = getattr(self, 'path', '')
        try:
            code_str = ""
            if len(args) > 1 and isinstance(args[0], str) and ('GET' in args[0] or 'POST' in args[0] or 'OPTIONS' in args[0]):
                code_str = str(args[1])
            elif len(args) > 0:
                code_str = str(args[0])
            
            is_api = '/api/' in path
            is_error = code_str not in ('200', '304', '206')
            if is_api or is_error:
                method = getattr(self, 'command', '')
                print(f'  [{code_str}] {method} {path}')
        except Exception:
            pass


def get_local_ips():
    ips = []
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ips.append(s.getsockname()[0])
        s.close()
    except Exception:
        pass
    try:
        hostname = socket.gethostname()
        for info in socket.getaddrinfo(hostname, None, socket.AF_INET):
            ip = info[4][0]
            if ip and ip != '127.0.0.1' and ip not in ips:
                ips.append(ip)
    except Exception:
        pass
    return ips


def start_cloudflare_tunnel():
    """Khởi động Cloudflare Tunnel trong background và lấy URL công khai."""
    global public_url

    cloudflared_bin = CLOUDFLARED_PATH if os.path.exists(CLOUDFLARED_PATH) else 'cloudflared'

    if not os.path.exists(cloudflared_bin) and cloudflared_bin != 'cloudflared':
        print('  ⚠️  Không tìm thấy cloudflared. Bỏ qua tunnel công khai.')
        return

    try:
        proc = subprocess.Popen(
            [cloudflared_bin, 'tunnel', '--url', f'http://localhost:{PORT}'],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )

        # Đọc output để lấy URL công khai
        url_pattern = re.compile(r'https://[a-z0-9\-]+\.trycloudflare\.com')
        timeout = 30  # giây
        start = time.time()

        for line in proc.stdout:
            if time.time() - start > timeout:
                break
            match = url_pattern.search(line)
            if match:
                public_url = match.group(0)
                print('\n' + '='*55)
                print('  🌍  ĐƯỜNG LINK CÔNG KHAI (dùng từ mọi nơi):')
                print('='*55)
                print(f'  🔗  {public_url}')
                print(f'  🔗  {public_url}/student.html')
                print('='*55)
                print('  📌  Chia sẻ link trên cho học sinh - dùng được')
                print('      từ điện thoại, máy tính ở BẤT KỲ đâu!')
                print('='*55 + '\n')
                # Tiếp tục giữ proc chạy (không break - để tunnel sống)
                # Chỉ thoát khỏi vòng lặp đọc URL
                break

        if not public_url:
            print('  ⚠️  Không lấy được URL công khai từ Cloudflare.')

        # Giữ tunnel process chạy liên tục trong background
        def keep_alive():
            for _ in proc.stdout:
                pass
            proc.wait()

        t = threading.Thread(target=keep_alive, daemon=True)
        t.start()

    except FileNotFoundError:
        print('  ⚠️  cloudflared chưa được cài đặt. Bỏ qua tunnel công khai.')
    except Exception as e:
        print(f'  ⚠️  Lỗi khi khởi động Cloudflare Tunnel: {e}')


if __name__ == '__main__':
    os.chdir(SCRIPT_DIR)
    socketserver.TCPServer.allow_reuse_address = True

    with socketserver.TCPServer(('0.0.0.0', PORT), LittleTownHandler) as httpd:
        local_ips = get_local_ips()

        print('\n' + '='*55)
        print('  🏘️   LITTLE TOWN SERVER - Đang chạy!')
        print('='*55)
        print(f'  📱  Trên máy này  :  http://localhost:{PORT}')
        for ip in local_ips:
            print(f'  🌐  Mạng nội bộ   :  http://{ip}:{PORT}')
        print('='*55)
        print('  ⏳  Đang kết nối Cloudflare Tunnel... vui lòng chờ')
        print('='*55 + '\n')

        # Chạy Cloudflare Tunnel trong background thread
        tunnel_thread = threading.Thread(target=start_cloudflare_tunnel, daemon=True)
        tunnel_thread.start()

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\n[Server] Đã dừng. Tạm biệt! 👋')
