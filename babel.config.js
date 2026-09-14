module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // react-native-reanimated 4.x moved its worklet transform out into its
    // own package (react-native-worklets) — this plugin must be listed
    // last (reanimated's own install docs), and is what makes any
    // "worklet"-tagged function (including ones expo-router/react-native-
    // screens use internally for navigation transitions) actually compile,
    // not just resolve at import time.
    plugins: ["react-native-worklets/plugin"],
  };
};
