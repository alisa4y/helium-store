import { Connection } from "tedious"

// Create connection to database
var config = {
  port: "1433",
  server: "127.0.0.1",
  authentication: {
    type: "default",
    options: {
      userName: "test", // update me
      password: "1234", // update me
    },
  },
  options: {
    database: "heliumStore",
  },
}
var connection = new Connection(config)

// Attempt to connect and execute queries if connection goes through
connection.on("connect", function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log("Connected")
  }
})

export default {
  signup: () => {},
  info: () => {
    return {
      name: "ali",
    }
  },
  buy: ({ orders, phoneNumber }) => {
    // transaction ot database to set order
  },
}
