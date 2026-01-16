import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        svgr()
    ],
    resolve: {
        alias: {
            // Thiết lập alias '@' trỏ về thư mục src (nếu dự án có dùng)
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000, // Giữ port 3000 giống CRA để không ảnh hưởng cấu hình khác
        open: true, // Tự động mở trình duyệt khi chạy
    },
    build: {
        outDir: 'build', // CRA build ra thư mục 'build', Vite mặc định là 'dist'. Giữ 'build' để đỡ sửa CI/CD.
    },

});