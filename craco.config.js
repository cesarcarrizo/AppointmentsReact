// Tailwindcss plugins configurations

module.exports = {
  style: {
    postcss: { plugins: [require("tailwindcss"), require("autoprefixer")] },
  },
};
