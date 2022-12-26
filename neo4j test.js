import neo4j from "neo4j-driver"

const driver = neo4j.driver(
  "bolt://127.0.0.1:7687",
  neo4j.auth.basic("neo4j", "1234")
)
const session = driver.session()
const personName = "Alice"

try {
  const result = await session.run(
    `match (a:Person {name: "Tom Hanks"}) return a`
  )

  const singleRecord = result.records[0]
  const node = singleRecord.get(0)

  console.log(node.properties)
} finally {
  await session.close()
}

// on application exit:
await driver.close()
