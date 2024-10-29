module.exports = {
  server: {
    baseDir: "jest-stare",
    routes: {
      "/coverage": "coverage",
    },
  },
  files: ["jest-stare/*.html", "coverage/**/*.html"],
  port: 8080,
  open: false,
  notify: false,
};
