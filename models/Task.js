const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  tdate: {
    type: Date,
    required: [true, "must provide date"],
    default: Date.now,
  },
  desc: {
    type: String,
    required: [true, "must provide desc"],
    trim: true,
    maxlength: [200, "desc can not be more than 200 characters"],
  },

  completed: {
    type: Boolean,
    default: false,
  },
  amt: { type: Number },
  year: { type: Number },
  month: { type: Number },
  year_month: { type: String },
  date_string: { type: String },
  transtype: {
    type: String,
    required: [true, "must provide transtype"],
    trim: true,
    maxlength: [200, "transtype can not be more than 200 characters"],
  },
  person: {
    type: String,
    required: [true, "must provide transtype"],
    trim: true,
    maxlength: [200, "transtype can not be more than 200 characters"],
  },
});

module.exports = mongoose.model("Task", TaskSchema);
