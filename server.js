import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
// import productData from "./products.json"

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


// Schema + model for products
const { Schema } = mongoose;
const productSchema = new Schema ({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    trim: true,
    enum: {
      values: ["læringsmaterialer", "workshop", "forløb", "klippekort"]
    }
  },
  price: {
    type: Number,
    required: true
  },
  imgUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    minlength: 10,
    maxlength: 400,
    required: true,
    trim: true
  }
})

const Product = mongoose.model("Product", productSchema)


// ROUTES:

app.get("/", (req, res) => {
  res.json(listEndpoints(app))
});

// GET endpoint: Gets list of all products
// Just for now, these products are gotten from a json.file, just for testing.
app.get("/products", async (req, res) => {
  const products = await Product.find()

  try {
    if (products) {
      res.status(200).json({
        success: true,
        body: products
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Products not found"
        }
      })
    }
  } catch(err) {
    res.status(404).json({
      success: false,
      body: {
        message: err
      }
    })
  }
})

//POST endpoint: Posts product to the database
app.post("/products", async (req, res) => {
  const { name, type, imgUrl, price, description } = req.body;
  try {
    const newProduct = await new Product({
      name: name,
      type: type,
      price: price,
      imgUrl: imgUrl,
      description: description
    }).save()
    res.status(200).json({
      success: true,
      response: `Product ${newProduct.name} was added to database`
    })
  } catch(err) {
    res.status(400).json({
      success: false,
      response: 'Product could not be added to database',
      errors: err.errors
    })
  }
})

//GET endpoint: Gets a single product
app.get("/products/id/:id", async (req, res) => {
  try {
    const singleProduct = await Product.findById(req.params.id)
    if (singleProduct) {
      res.status(200).json({
        success: true,
        body: singleProduct
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Product not found"
        }
      })
    }
  } catch(err) {
    res.status(404).json({
      success: false,
      body: {
        message: err
      }
    })
  }
})

//DELETE endpoint: Deletes a single product from the database.
app.delete("/products/id/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (deletedProduct) {
      res.status(200).json({
        success: true,
        response: `Product ${deletedProduct.name} was deleted from the database`
      })
    } else {
      res.status(404).json({
        success: false,
        response: "Product not found"
      })
    } 
  } catch (err) {
    res.status(500).json({
      success: false,
      response: err
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
