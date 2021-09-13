const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors,
    },
  },
  variants: {},
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
  // xwind options
  xwind: {
    mode: "objectstyles",
  },
};
