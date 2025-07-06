import express, { response } from "express";
import axios from "axios";
import fetch from "node-fetch";
import LED from "../models/Led.js";
import DHT from "../models/DHT.js";
import rateLimit from 'express-rate-limit';
import Fan from "../models/Fan.js";
import MOTION from "../models/Motion.js";
import RANGE from "../models/Range.js";



const router = express.Router();
const espIP = "http://192.168.2.14";
const esp8266IP = "http://192.168.2.15";
const TIMEOUT = 3000; // ms

const timeoutFetch = (url, options = {}) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), TIMEOUT)
    ),
  ]);
};
// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 10 * 1000, // 10s
  max: 10,
  message: "Too many requests, please try again later.",
});



//Manage LED
// router.post("/manageLed", async (req, res) => {
//   const body = {
//     name: req.body.name,
//     mode: req.body.mode,
//     status: req.body.status,
//   };

//   const response = await fetch(`${espIP}/handleLED`, {
//     method: "post",
//     body: JSON.stringify(body),
//     headers: { "Content-Type": "application/json" },
//   });
//   const responseData = await response.json();

//   if (responseData.success == true) {
//     const data = new LED({
//       name: req.body.name,
//       time: Date.now(),
//       ledStatus: req.body.status,
//       mode: req.body.mode,
//       userId: req.body.userId,
//     });

//     try {
//       const dataToSave = await data.save();
//       res.status(200).json(dataToSave);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   }
// });
router.post("/manageLed", limiter, async (req, res) => {
  try {
    const { name, mode, status, userId } = req.body;
    const body = { name, mode, status };

    const response = await timeoutFetch(`${espIP}/handleLED`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (data.success !== true) return res.status(400).json({ message: "ESP32 failed" });

    const ledData = new LED({ name, time: Date.now(), ledStatus: status, mode, userId });
    const saved = await ledData.save();
    res.status(200).json(saved);
  } catch (err) {
    console.error("LED Error:", err.message);
    res.status(500).json({ message: err.message || "Internal error" });
  }
});

router.post("/manageRelay", limiter, async (req, res) => {
  try {
    const { name, status, mode, userId } = req.body;
    const body = { name, status }; 

    const response = await timeoutFetch(`${esp8266IP}/relay`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (data.status !== "ON" && data.status !== "OFF") {
      return res.status(400).json({ message: "ESP8266 relay failed" });
    }

    // Ghi log trạng thái relay (quạt)
    const FanData = new Fan({
      name,
      time: Date.now(),
      status,
      mode,
      userId,
    });

    const saved = await FanData.save();
    res.status(200).json(saved);

  } catch (err) {
    console.error("Relay Error:", err.message);
    res.status(500).json({ message: err.message || "Internal error" });
  }
});





//Manage DHT(Temperature and Humidity)
router.post("/manageDHT", async (req, res) => {
  const response = await fetch(`${espIP}/handleDHT`);

  const responseData = await response.json();

  if (responseData.success == true) {
    const data = new DHT({
      temperature: responseData.temperature,
      humidity: responseData.humidity,
      time: Date.now(),
      userId: req.body.userId,
    });

    try {
      const dataToSave = await data.save();
      res.status(200).json(dataToSave);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});




//Manage Motion
router.post("/manageMotion", async (req, res) => {
  const body = {
    status: req.body.status,
  };

  const response = await fetch(`${espIP}/handleMotion`, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  const responseData = await response.json();

  if (responseData.success == true) {
    const data = new MOTION({
      time: Date.now(),
      status: req.body.status,
      userId: req.body.userId,
    });

    try {
      const dataToSave = await data.save();
      res.status(200).json(dataToSave);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

//Save and update Temperature and humidity Range Data
router.put("/saveRange", async (req, res) => {
  const body = {
    tempMax: parseInt(req.body.tempVal),
    tempMin: parseInt(req.body.humVal),
    time: Date.now(),
    humMax: parseInt(req.body.minRange),
    humMin: parseInt(req.body.maxRange),
    userId: req.body.userId,
  };

  try {
    const dataToSave = await RANGE.findOneAndUpdate(
      { userId: req.body.userId },
      {
        $set: req.body,
      },
      { upsert: true }
    );
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get Temperature and humidity Range Data
router.get("/saveRange", async (req, res) => {
  try {
    const data = await RANGE.findOne();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});



// Get Data from DHTS
router.get("/dht",async (req, res) => {
  try {
    const data = await DHT.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Data from led
router.get("/leds",async (req, res) => {
  try {
    const data = await LED.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


