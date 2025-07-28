const express = require("express");
const router = express.Router();
const Category = require("../models/categorySchema");
const Product = require("../models/productSchema");

router.get("/", async (req, res) => {
  try {
    const allData = await Category.find().sort({rating:-1}).select("name");
    return res.status(200).json({ category: allData });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// below route is for admin

router.post("/add", async (req, res) => {
  try {

    const {name} = req.body;

    // do not add duplicate data

    const categoryExit = await Category.findOne({name: {$regex: `^${name}$`, $options: 'i'}});

    if(categoryExit){
      return res.status(200).json({message:`${name} is alredy present`});
    }

    const newCategory = new Category({name});

    await newCategory.save();
    return res.status(201).json({ data: newCategory });
  } 
  catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const newData = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return res.status(201).json({ message: newData });
  } catch {
    return res.status(402).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await Category.findByIdAndDelete(id);
    return res.status(201).json({ message: deletedData });
  } catch {
    return res.status(402).json({ message: error.message });
  }
});

module.exports = router;
