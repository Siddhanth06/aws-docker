import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// monaco-editor >= 0.56 ships an "exports" map ("./*": "./esm/vs/*.js") that
// already injects esm/vs, so the legacy deep specifier y-monaco hardcodes
// (monaco-editor/esm/vs/editor/editor.api.js) no longer resolves. Point it at
// the real file.
const monacoApi = fileURLToPath(
  new URL('./node_modules/monaco-editor/esm/vs/editor/editor.api.js', import.meta.url)
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: [
      { find: 'monaco-editor/esm/vs/editor/editor.api.js', replacement: monacoApi },
    ],
  },
})
