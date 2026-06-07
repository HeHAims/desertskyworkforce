export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#fdf8f0',
          100: '#f8ead7',
          200: '#ecd1ad',
          300: '#deb57c',
          400: '#c98f4e',
          500: '#b56c2b',
          600: '#934d1d',
          700: '#743d1a',
          800: '#4e2b14',
          900: '#2e1b0d'
        },
        dusk: '#0e1b27',
        horizon: '#22496d',
        signal: '#18a999',
        ember: '#f97316'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 45px rgba(0,0,0,0.25)'
      },
      backgroundImage: {
        'desert-grid': 'radial-gradient(circle at top, rgba(249,115,22,0.16), transparent 35%), linear-gradient(135deg, rgba(14,27,39,0.98), rgba(17,24,39,0.94))'
      }
    }
  },
  plugins: []
};
