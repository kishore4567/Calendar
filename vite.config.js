


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "./", // ✅ Use relative paths — do NOT use '/calendar/' on Render
});
