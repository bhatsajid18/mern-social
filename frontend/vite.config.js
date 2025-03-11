import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {
      Google_Api:"AIzaSyBu_J0kg7C5-VEH_wop_xf6LfoifQgGEeY"
    }
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
      },
    },
  },
});

