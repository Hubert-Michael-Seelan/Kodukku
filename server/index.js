const express = require("express");
const app = express();
const db = require("./db");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const multer = require("multer")
const path = require("path");

// Image Upload
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename:(req, file, cb)=>{
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})
const upload = multer({storage:storage})

//Creating Upload EndPoint for Images
app.use("/images", express.static("upload/images"))
app.post("/upload", upload.single("product"),(req, res)=>{
  res.json({
    success: 1,
    image_url: `http://localhost:${PORT}/images/${req.file.filename}`
  })
})

db.raw("SELECT 1")
  .then(() => console.log("DB Connected"))
  .catch(() => console.log("Error"));
// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// POST endpoint to create a new user
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert the new user into the database
    await db('users').insert({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await db.select("*").from("users");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
// PUT endpoint to edit a user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  if (!name && !email && !password) {
    return res
      .status(400)
      .json({
        error: "At least one field (name, email, or password) is required",
      });
  }
  try {
    // Update the user in the database
    const updatedUser = await db("users")
      .where({ id })
      .update({ name, email, password });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE endpoint to delete a user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Delete the user from the database
    const deletedUser = await db("users").where({ id }).del();
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// add_product 
app.post('/products', async (req, res) => {
  const { product_name, product_image_url, product_price } = req.body;
  // Basic validation
  if (!product_name || !product_image_url || !product_price) {
    return res.status(400).json({ error: 'Product name, image URL, and price are required' });
  }
  try {
    // Insert the new product into the database
    await db('products').insert({
      product_name,
      product_image_url,
      product_price
    });
    res.status(201).json({ message: 'Product created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Delete the product from the database
    const deletedProduct = await db('products').where({ product_id: id }).del();
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is Connected to ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Express App is Running");
});
