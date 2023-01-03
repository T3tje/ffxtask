
const express = require("express")
const app = express()
const fs = require("fs")


app.get("/api/allcases", (request,response) => {

   try {
      const data = fs.readFileSync("./cases.txt", "utf8");
      response.status(200).send(data)
    } catch (err) {
      response.status(404).send(err);
    }

})

app.post("/api/case", (request,response) => {
      
   let allCases = []

   try {
   const data = fs.readFileSync("./cases.txt", "utf8");
   allCases = JSON.parse(data)
   } catch (err) {
   console.error("theres no such file yet");
   }


   const highestNumberArray = allCases.map(item => parseInt(item.fxFileId.slice(-2)))
   
   let highestNumber
  
   if (highestNumberArray.length === 0) {
      highestNumber = 1
   } else {
      highestNumber = Math.max(...highestNumberArray) + 1
   }

   const newCounter = highestNumber < 10 ? `0${highestNumber}` : `${highestNumber}`
   

   const newCase = {
      customerName: request.query.customerName,
      startDate: request.query.startDate,
      isFinished: request.query.isFinished === "true" ? true : false,
      fxFileId: `${request.query.customerName}-${request.query.startDate.substring(8,10)}-${newCounter}`
   }
         
   allCases.push(newCase)

   
   const fileText = JSON.stringify(allCases)
      
   fs.writeFile("./cases.txt", fileText, (err) => {
      if(err) {
         console.error(err);
         return
      }

      console.log("case successfully added");
   })

   response.status(200).json(allCases)

  })

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)