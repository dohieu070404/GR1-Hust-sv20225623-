import { Typography, styled, Grid, Button } from "@mui/material";
import KitchenIcon from "@mui/icons-material/Kitchen";
import React, { useContext, useEffect, useState } from "react";
import FourColumnDiv from "../main/FourColumnDiv";
import axios from "axios";
import { Context } from "../../context/Context";

const ContainerGrid = styled(Grid)`
  justify-content: center;
  width: 100%;
`;

const AcControlMain = () => {
  const { user } = useContext(Context);

  const [sensorData, setSensorData] = useState({ temperature: "--", humidity: "--" });
  const [dhtActive, setDhtActive] = useState(false);

  const toggleDhtSensor = async () => {
    const status = dhtActive ? "OFF" : "ON";
    try {
      await axios.post("/api/routes/manageDHT", {
        userId: user._id,
        status: status,
      });
      setDhtActive(!dhtActive);
    } catch (err) {
      console.log(err);
    }
  };

  const getTempAndHum = async () => {
    try {
      const res = await axios.post("/api/routes/manageDHT", {
        userId: user._id,
      });
      setSensorData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (dhtActive) {
      const interval = setInterval(() => {
        getTempAndHum();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [dhtActive]);

  return (
    <div>
      <div className="M">DHT Sensor Control</div>
      <div>
        <FourColumnDiv
          switches={[
            {
              name: "DHT Sensor",
              state: dhtActive,
              icon: <KitchenIcon />,
              handleChange: toggleDhtSensor,
              color: "#7a40f2",
            },
          ]}
        />
      </div>
      <div className="Ac-Main">
        <div className="Controls">
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Dữ liệu cảm biến:
          </Typography>
          <Typography variant="h6">Nhiệt độ: {sensorData.temperature}°C</Typography>
          <Typography variant="h6">Độ ẩm: {sensorData.humidity}%</Typography>
        </div>
      </div>
    </div>
  );
};

export default AcControlMain;
