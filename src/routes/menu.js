const express = require("express");
const { categories, products } = require("../data/menu");

const router = express.Router();

// GET /api/categories
router.get("/categories", (req, res) => {
  res.json({ success: true, count: categories.length, data: categories });
});

// GET /api/products?category=biryani&search=aloo&tag=hot-selling
router.get("/products", (req, res) => {
  const { category, search, tag } = req.query;
  let results = products;

  if (category) {
    results = results.filter(
      (p) => p.category.toLowerCase() === String(category).toLowerCase()
    );
  }

  if (tag) {
    results = results.filter((p) =>
      p.tags.map((t) => t.toLowerCase()).includes(String(tag).toLowerCase())
    );
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: results.length, data: results });
});

// GET /api/products/:id
router.get("/products/:id", (req, res, next) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    const err = new Error("Product id must be a number");
    err.status = 400;
    return next(err);
  }

  const product = products.find((p) => p.id === id);
  if (!product) {
    const err = new Error(`Product with id ${id} not found`);
    err.status = 404;
    return next(err);
  }

  res.json({ success: true, data: product });
});

module.exports = router;
