// uno.config.js
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'py-2 px-4 font-semibold rounded-lg shadow-md'],
    [/^card-(.*)$/, ([, c]) => `bg-${c}-100 text-${c}-800 p-4 rounded-lg`],
  ],
  theme: {
    colors: {
      'custom-blue': '#2196f3',
    }
  },
  presets: [
    presetUno({dark: 'class'}),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      provider: 'google', // default provider
      fonts: {
        sans: 'Inter',
      },
    }),
  ],
})
