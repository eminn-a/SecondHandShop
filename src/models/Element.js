const mongoose = require("mongoose");

const elementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "All fields are required"],
    minLength: [10, "Name at least 10"],
  },
  type: {
    type: String,
    required: [true, "All fields are required"],
    minLength: [2, "Type at least 2"],
  },
  damages: {
    type: String,
    required: [true, "All fields are required"],
    minLength: [10, "Damages at least 10"],
  },
  image: {
    type: String,
    required: true,
    match: [/^https?:\/\//, "invalid URL"],
  },
  description: {
    type: String,
    required: [true, "All fields are required"],
    minLength: [10, "Description at least 10"],
    maxLenght: [200, "Max description 200"],
  },
  production: {
    type: Number,
    required: [true, "All fields are required"],
    min: [1900, "Min production 1900"],
    max: [2023, "Max production 2023"],
  },
  exploitation: {
    type: Number,
    required: [true, "All fields are required"],
    default: 0,
    min: [1, "Must be positive number"],
  },
  price: {
    type: Number,
    required: [true, "All fields are required"],
    default: 0,
    min: [1, "Must be positive number"],
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: [true, "All fields are required"],
  },
  buyingList: [
    {
      type: mongoose.Types.ObjectId,
      required: [true, "All fields are required"],
    },
  ],
});

//change if you want (depends on exam)
const Element = mongoose.model("Element", elementSchema);

module.exports = Element;
