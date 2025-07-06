// Modified WaterControl.jsx to control Relay (Fan) instead of Soil/LED

import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import FourColumnDiv from "../../components/main/FourColumnDiv";
import "./watercontrol.css";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../context/Context";
import ForestIcon from "@mui/icons-material/Forest";
import { Grid, styled } from "@mui/material";

const SidebarGrid = styled(Grid)`
  max-width: 10%;
`;
const TopbarGrid = styled(Grid)`
  right: 0;
  top: 0;
  float: right;
`;
const ContainerGrid = styled(Grid)`
  justify-content: center;
  width: 100%;
`;
const MainGrid = styled(Grid)`
  padding-left: 2vw;
`;

const RelayControl = () => {
  const [relayName, setRelayName] = useState("Quạt thông gió");
  const [relayStatus, setRelayStatus] = useState(false);
  const { user } = useContext(Context);

  useEffect(() => {
    const savedStatus = localStorage.getItem("Relay");
    setRelayStatus(savedStatus === "ON");
  }, []);

  const handleRelayToggle = async () => {
    const newStatus = !relayStatus;
    setRelayStatus(newStatus);
    localStorage.setItem("Relay", newStatus ? "ON" : "OFF");

    try {
      await axios.post("/api/routes/manageRelay", {
        name: "fan",
        status: newStatus ? "ON" : "OFF",
        userId: user._id,
      });
    } catch (err) {
      console.log("Lỗi khi điều khiển relay:", err);
    }
  };

  return (
    <ContainerGrid container spacing={2} justifyContent="flex-start">
      <SidebarGrid item xs={1}>
        <Sidebar />
      </SidebarGrid>

      <MainGrid item className="water__herosection" xs={8}>
        <div className="water__wrapper">
          <div className="water__switches">
            <FourColumnDiv
              switches={[
                {
                  name: relayName,
                  state: relayStatus,
                  icon: <ForestIcon />,
                  handleChange: handleRelayToggle,
                  color: "#7a40f2",
                },
              ]}
            />
          </div>
        </div>
      </MainGrid>

      <TopbarGrid className="rightColumn" item xs={3}>
        <Topbar />
      </TopbarGrid>
    </ContainerGrid>
  );
};

export default RelayControl;
