import pugPlugin from "./pugPlugin.js"

export default {
  port: 3000,
  host: "localhost",
  protocol: "http",
  publicDir: "public",
  defaultFile: "home",
  watch: true,
  skipExtensions: [], // skip watching files with these extensions
  reloadExtRgx: /^(?:(?!\.css).)+$/, // server won't send reload signal for css files
  plugins: { ".pug": pugPlugin }, // { [extension] : (fileContent) => ({ext: <newExtension>, file: <newFileContent>, skip: <booloan>}) }
}
