import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import * as path from "node:path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      "#continuum": path.resolve(__dirname, "vendor/continuum-engine/src/js/"),
      "#ui": path.resolve(__dirname, "ui"),
      "#lib": path.resolve(__dirname, "lib"),
    },
  },
})
