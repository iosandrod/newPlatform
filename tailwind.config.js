// tailwind.config.js
// const spacing = Object.fromEntries(
//   Array.from({ length: 201 }, (_, i) => [i, `${i}px`])
// )
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    // spacing, // ✅ 彻底覆盖
    // minWidth: spacing,
    // maxWidth: spacing,
    // minHeight: spacing,
    // maxHeight: spacing,
  },
  plugins: [],
}
