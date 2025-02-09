const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 4000;

app.use(express.json());

let products = [
  { id: uuidv4(), name: "Laptop", price: 1200 },
  { id: uuidv4(), name: "Phone", price: 800 },
];

let orders = [];

function logRequest(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

app.use(logRequest);

// Get all products
app.get("/products", (req, res) => {
  res.json(products);
});

// Get a product by ID
app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// Add a new product
app.post("/products", (req, res) => {
  const { name, price } = req.body;
  if (!name || !price || price <= 0) {
    return res.status(400).json({ error: "Invalid product data" });
  }

  const newProduct = { id: uuidv4(), name, price };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update a product
app.put("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const { name, price } = req.body;
  if (name) product.name = name;
  if (price) product.price = price;

  res.json(product);
});

// Delete a product
app.delete("/products/:id", (req, res) => {
  products = products.filter((p) => p.id !== req.params.id);
  res.json({ message: "Product deleted" });
});

// Get all orders
app.get("/orders", (req, res) => {
  res.json(orders);
});

// Place an order
app.post("/orders", (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find((p) => p.id === productId);
  
  if (!product || quantity <= 0) {
    return res.status(400).json({ error: "Invalid order data" });
  }
  
  const order = {
    id: uuidv4(),
    product: { ...product },
    quantity,
    total: product.price * quantity,
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  res.status(201).json(order);
});

// Get order by ID
app.get("/orders/:id", (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// Delete an order
app.delete("/orders/:id", (req, res) => {
  orders = orders.filter((o) => o.id !== req.params.id);
  res.json({ message: "Order deleted" });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Shop server running on http://localhost:${PORT}`);
});


