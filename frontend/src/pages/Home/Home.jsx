import "./home.css";
import { Box, Typography, styled } from "@mui/material";
import { useState, useContext } from "react";
import axios from "axios";

import Sidebar from "../../components/Sidebar/Sidebar";
import Main from "../../components/main/Main";
import FourColumnDiv from "../../components/main/FourColumnDiv";
import Userlist from "../../components/Userslist/Userlist";
// import ChartExpense from "../../components/ChartExpense/ChartExpense";

import WaterPumpIcon from "@mui/icons-material/Opacity";
import TemperatureIcon from "@mui/icons-material/DeviceThermostat";
import LightIcon from "@mui/icons-material/TipsAndUpdates";
import MotionSensorIcon from "@mui/icons-material/DirectionsRun";

import { Context } from "../../context/Context"; // ✅ Thêm dòng này

// Layout containers
const Layout = styled(Box)(() => ({
  display: "flex",
  height: "100vh",
  backgroundColor: "#f5f7fa",
  overflow: "hidden",
}));

const SidebarWrapper = styled(Box)(() => ({
  width: "260px",
  backgroundColor: "#ffffff",
  boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
  zIndex: 100,
}));

const MainWrapper = styled(Box)(() => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}));

const ContentWrapper = styled(Box)(() => ({
  display: "flex",
  flex: 1,
  overflow: "hidden",
}));

const MainContent = styled(Box)(() => ({
  flex: 1,
  padding: "2rem 3rem",
  overflowY: "auto",
  backgroundColor: "#f9fafc",
}));

const RightPanel = styled(Box)(() => ({
  width: "340px",
  backgroundColor: "#ffffff",
  padding: "2rem",
  boxShadow: "-2px 0 6px rgba(0,0,0,0.04)",
  borderLeft: "1px solid #e0e0e0",
  overflowY: "auto",
}));

const SectionTitle = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: "20px",
  marginBottom: "1rem",
  color: "#333",
}));

const Home = () => {
  const mode = "normal";
  const { user } = useContext(Context); // ✅ Lấy user từ context

  const [devices, setDevices] = useState([
    { name: "Water Pump", state: false, icon: <WaterPumpIcon /> },
    { name: "Temperature", state: false, icon: <TemperatureIcon /> },
    { name: "Motion Sensor", state: false, icon: <MotionSensorIcon /> },
    { name: "Lights", state: false, icon: <LightIcon /> },
  ]);

  const handleToggle = async (index) => {
  const updated = [...devices];
  updated[index].state = !updated[index].state;
  setDevices(updated);

  const { name } = updated[index];
  const status = updated[index].state ? "ON" : "OFF";

  try {
    if (name === "Motion Sensor") {
      await axios.post("/api/routes/manageMotion", {
        status,
        userId: user._id,
      });
    } else {
      await axios.post("/api/routes/manageLed", {
        name,
        mode,
        status,
        userId: user._id,
      });
    }
  } catch (error) {
    console.error("Toggle error:", error);
  }
};


  return (
    <Layout>
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>

      <MainWrapper>
        <ContentWrapper>
          <MainContent>
            <SectionTitle>Dashboard Overview</SectionTitle>
            <Main />
            <Box mt={4}>
              <FourColumnDiv
                switches={devices.map((device, idx) => ({
                  name: device.name,
                  state: device.state,
                  icon: device.icon,
                  handleChange: () => handleToggle(idx),
                  color: "#7a40f2",
                }))}
              />
            </Box>
          </MainContent>

          <RightPanel>
            <SectionTitle>User Monitoring</SectionTitle>
            <Userlist />
            {/* <ChartExpense /> */}
          </RightPanel>
        </ContentWrapper>
      </MainWrapper>
    </Layout>
  );
};

export default Home;
