import mongoose from "mongoose";

const FanSchema = new mongoose.Schema({
  time: {
    type: Date,
    required: true,
    default: Date.now
  },
  userId: {
    type: String,
    required: true
  },
  speed: {
    type: Number,
    required: true,
    default: 100 
  },
  status: {
    type: String,
    required: true,
    enum: ["ON", "OFF"]
  }
});

const Fan = mongoose.model("Fan", FanSchema);

export default Fan;
