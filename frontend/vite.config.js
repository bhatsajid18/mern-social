import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": {
      Google_Api: "AIzaSyDgNNvlnU2rJ1WC36VEIpM_H1Q_UmFPl2w",
    },
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5555",
      },
    },
  },
});
