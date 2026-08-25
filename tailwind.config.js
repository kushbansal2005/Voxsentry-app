/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          start: '#0A0A1F',
          end: '#1E1042'
        },
        cyan: {
          DEFAULT: '#22D3EE'
        },
        purple: {
          DEFAULT: '#A855F7'
        },
        danger: {
          DEFAULT: '#EF4444'
        },
        safe: {
          DEFAULT: '#10B981'
        }
      }
    },
  },
  plugins: [],
}
