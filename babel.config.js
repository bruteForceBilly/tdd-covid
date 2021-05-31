module.exports = {
  plugins: [
    "@babel/plugin-transform-regenerator",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-for-of",
  ],
  presets: ["@vue/cli-plugin-babel/preset", "@babel/preset-env"],
  env: {
    test: {
      presets: [["@babel/preset-env", { targets: { node: "current" } }]],
    },
  },
};
