import { render } from "pug"
import { readFileSync } from "fs"

const dataFile = readFileSync("./data.json", "utf8").replace(/[\n\r]/g, "")

export default async filePath => {
  let f = readFileSync(filePath, "utf-8")
  if (f.trim().startsWith("doctype html")) {
    f = `- var data = ${dataFile}\n` + f
    const result = await new Promise(r => {
      render(f, { filename: filePath }, (err, result) => {
        if (err) console.log(err)
        r(result)
      })
    })
    return { ext: ".html", file: result }
  }
  return { skip: true }
}
