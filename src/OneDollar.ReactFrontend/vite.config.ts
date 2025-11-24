
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as packageJson from "./package.json"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Expose the app version from package.json as a ENV variable to be displayed on the page
    'import.meta.env.VITE_APP_VERSION' : JSON.stringify(packageJson.version)
  }
})
