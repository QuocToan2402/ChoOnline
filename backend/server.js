import express from "express";
import data from "./data.js";

const app = express(); //create express server
app.get("/api/products", (req, res) => {
  //get array of product
  res.send(data.products);
});

app.get("/", (req, res) => {
  res.send("Server is ready"); //return status of server
});
const port = process.env.PORT || 5000; //port 5000, run at http://
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
