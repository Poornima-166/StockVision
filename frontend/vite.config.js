import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Fix: tell Vite not to scan 'chartjs-chart-financial'
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['chartjs-chart-financial']
  },
});
