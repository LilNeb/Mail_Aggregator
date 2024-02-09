const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.post("/data", (req, res) => {
  console.log(req.body); // Affiche les données reçues
  res.status(200).send("Data received successfully!");
});

app.listen(port, () => {
  console.log(`scrapper microservice listening on port : ${port}`);
});
