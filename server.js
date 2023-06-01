import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/final-project";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


// ROUTES:

app.get("/", (req, res) => {
  res.json(listEndpoints(app))
});

//GET endpoint: Gets list of all products
app.get("/products", (req, res) => {
  res.send("This is a list of all products")
})

//POST endpoint: Posts product to the database
app.post("/products", (req, res) => {
  // create based on schema/model
})

//GET endpoint: Gets a single product
app.get("/products/id/:id", (req, res) => {
  res.send("This is a single product")
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
