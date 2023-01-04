const express = require("express")
const app = express()
const fs = require("fs")
const bodyParser = require("body-parser")
const jsonParser = bodyParser.json()

app.get("/api/allcases", (request, response) => {
  try {
    const data = fs.readFileSync("./cases.txt", "utf8")
    response.status(200).send(data)
  } catch (err) {
    response.status(404).send(err)
  }
})

app.post("/api/case", jsonParser, (request, response) => {
  let allCases = []

  try {
    const data = fs.readFileSync("./cases.txt", "utf8")
    allCases = JSON.parse(data)
  } catch (err) {
    console.error("theres no such file yet")
  }

  const highestNumberArray = allCases.map((item) => parseInt(item.fxFileId.slice(-2)))

  console.log(Date())
  let highestNumber

  if (highestNumberArray.length === 0) {
    highestNumber = 1
  } else {
    highestNumber = Math.max(...highestNumberArray) + 1
  }

  const newCounter = highestNumber < 10 ? `0${highestNumber}` : `${highestNumber}`

  const newCase = {
    customerName: request.body.customerName,
    startDate: request.body.startDate,
    isFinished: request.body.isFinished,
    fxFileId: `${request.body.customerName}-${request.body.startDate.substring(13, 15)}-${newCounter}`,
  }

  allCases.push(newCase)

  const fileText = JSON.stringify(allCases)

  fs.writeFile("./cases.txt", fileText, (err) => {
    if (err) {
      console.error(err)
      return
    }

    console.log("case successfully added")
  })

  response.status(200).json(allCases)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
