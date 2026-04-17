import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/resistencies/', // <-- Afegeix aquesta línia amb el nom exacte del teu repositori
})

Un cop tinguis el `.yml` a la seva carpeta i el `vite.config.js` configurat, només has de fer un *push* dels teus canvis a GitHub. Veuràs que apareix un puntet groc (o a la pestanya "Actions") indicant que s'està construint. Quan acabi, la teva web estarà actualitzada!
