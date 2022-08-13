import { render } from "pug"
import { readFileSync } from "fs"

export default async filePath => {
  let f = readFileSync(filePath, "utf-8")
  if (f.trim().startsWith("doctype html")) {
    const result = await new Promise(r => {
      render(f, { filename: filePath }, { globals: [data] }, (err, result) => {
        if (err) console.log(err)
        r(result)
      })
    })
    return { ext: ".html", file: result }
  }
  return { skip: true }
}
