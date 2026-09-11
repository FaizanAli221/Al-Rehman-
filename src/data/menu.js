/**
 * In-memory data layer for the Al Rehman Biryani catalog.
 * In a production system this would be swapped for a database
 * (Postgres/Mongo) behind the same shape, so routes/consumers
 * never need to change.
 */

const categories = [
  {
    id: "biryani",
    title: "Biryani",
    banner: {
      text: "BIRYANI",
      subtitle: "Slow-cooked daig-style biryani, made fresh every day",
    },
  },
  {
    id: "pulao",
    title: "Pulao",
    banner: {
      text: "PULAO",
      subtitle: "Fragrant rice layered with tender chicken or beef",
    },
  },
  {
    id: "desserts",
    title: "Desserts",
    banner: {
      text: "DESSERTS",
      subtitle: "Traditional sweets to finish your meal",
    },
  },
  {
    id: "side-orders",
    title: "Side Orders",
    banner: {
      text: "SIDE ORDERS",
      subtitle: "Salads & raita to complete your order",
    },
  },
];

/**
 * variants: when present, price is fully determined by the chosen
 * variant. When absent/empty, `basePrice` is the final unit price.
 */
const products = [
  {
    id: 1,
    name: "Aloo Biryani Box",
    description:
      "Sada biryani rice with soft potatoes, mild spices, and a boiled egg.",
    category: "biryani",
    weight: "400gm",
    basePrice: 250,
    variants: [],
    tags: ["hot-selling", "vegetarian"],
  },
  {
    id: 2,
    name: "Chicken Biryani Box",
    description:
      "Our signature daig-style chicken biryani, layered with fried onions and whole garam masala.",
    category: "biryani",
    weight: "450gm / 850gm",
    basePrice: 400,
    variants: [
      { name: "single", label: "Single Boti", price: 400 },
      { name: "double", label: "Double Boti", price: 750 },
    ],
    tags: ["chef-special", "popular"],
  },
  {
    id: 3,
    name: "Chicken Pulao Box",
    description:
      "Fragrant chicken pulao slow-cooked in seasoned yakhni stock.",
    category: "pulao",
    weight: "450gm / 850gm",
    basePrice: 430,
    variants: [
      { name: "single", label: "Single Boti", price: 430 },
      { name: "double", label: "Double Boti", price: 800 },
    ],
    tags: ["popular"],
  },
  {
    id: 4,
    name: "Beef Pulao Box",
    description: "Tender beef chunks in aromatic, lightly spiced pulao rice.",
    category: "pulao",
    weight: "450gm / 850gm",
    basePrice: 500,
    variants: [
      { name: "single", label: "Single Piece", price: 500 },
      { name: "double", label: "Double Piece", price: 930 },
    ],
    tags: ["popular"],
  },
  {
    id: 5,
    name: "Special Zarda",
    description:
      "Sweet saffron rice garnished with dry fruits, cherries, and coconut.",
    category: "desserts",
    weight: "200gm",
    basePrice: 130,
    variants: [],
    tags: ["trending", "vegetarian"],
  },
  {
    id: 6,
    name: "Special Kheer",
    description: "Creamy rice pudding topped with almonds and pistachios.",
    category: "desserts",
    weight: "200ml",
    basePrice: 150,
    variants: [],
    tags: ["vegetarian"],
  },
  {
    id: 7,
    name: "Salad",
    description: "Fresh mixed salad with cucumber, tomato, and onion.",
    category: "side-orders",
    weight: "150gm",
    basePrice: 50,
    variants: [],
    tags: ["vegetarian"],
  },
  {
    id: 8,
    name: "Podina Raita",
    description: "Chilled mint yogurt dip — the perfect biryani companion.",
    category: "side-orders",
    weight: "200ml",
    basePrice: 75,
    variants: [],
    tags: ["vegetarian"],
  },
];

module.exports = { categories, products };
