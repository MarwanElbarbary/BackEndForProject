const express = require("express");
const mongoose = require("mongoose");
const app = express();


mongoose.connect("mongodb://localhost:27017")
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log("MongoDB connection error:", err));
app.use(express.json());


const User = mongoose.model("User", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

const Clothing = mongoose.model("Clothing", new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    size: { type: String },
    frontImage: { type: String },
    backImage: { type: String },
    stock: { type: Number, default: 0 }
}));


app.post("/api/users/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
});

app.post("/api/users/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", user });
});


app.post("/api/clothes/add", async (req, res) => {
    const { name, description, price, size, frontImage, backImage, stock } = req.body;
    const newClothing = new Clothing({ name, description, price, size, frontImage, backImage, stock });
    await newClothing.save();
    res.status(201).json({ message: "Clothing item added successfully", item: newClothing });
});

app.put("/api/clothes/update/:id", async (req, res) => {
    const updatedClothing = await Clothing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Clothing item updated", item: updatedClothing });
});

app.delete("/api/clothes/delete/:id", async (req, res) => {
    await Clothing.findByIdAndDelete(req.params.id);
    res.json({ message: "Clothing item deleted" });
});

app.get("/api/clothes", async (req, res) => {
    const clothes = await Clothing.find();
    res.json(clothes);
});

app.get("/api/clothes/:id", async (req, res) => {
    const item = await Clothing.findById(req.params.id);
    res.json(item);
});

let cart = [];

app.post("/api/cart/add", (req, res) => {
    const { itemId, quantity } = req.body;
    cart.push({ itemId, quantity });
    res.json({ message: "Item added to cart", cart });
});

app.get("/api/cart", (req, res) => {
    res.json({ cart });
});


let reviews = [];

app.post("/api/reviews/add", (req, res) => {
    const { itemId, user, comment } = req.body;
    reviews.push({ itemId, user, comment });
    res.json({ message: "Review added", reviews });
});

app.get("/api/reviews", (req, res) => {
    res.json({ reviews });
});

app.post("/api/clothes/add", async (req, res) => {
    const { name, description, price, size, frontImage, backImage, stock } = req.body;
    const newClothing = new Clothing({
        name,
        description,
        price,
        size,
        frontImage,
        backImage,
        stock
    });

    try {
        await newClothing.save();
        res.status(201).json({ message: "Clothing item added successfully", item: newClothing });
    } catch (error) {
        res.status(500).json({ message: "Error adding clothing item", error });
    }
});

app.post("/api/cart/add", (req, res) => {
    const { itemId, quantity } = req.body;

    cart.push({ itemId, quantity });
    res.json({ message: "تم إضافة المنتج إلى العربة", cart });
});



app.get("/", (req, res) => {
    res.send("Welcome to the Clothing Store API!");
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
