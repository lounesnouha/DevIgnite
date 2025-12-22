import React, { useState } from "react";
import Sidebar from "./sidebar2";
import SettingsLogo from "../assets/settings.svg";
import Code from "../assets/code.svg";

const notificationsList = [
  "General",
  "HR",
  "Relev",
  "Relex",
  "Design",
  "Multimedia",
  "Communication",
  "UI/UX",
  "Development",
  "Internal Activities",
];

export default function Settings() {
  const [toggles, setToggles] = useState(
    notificationsList.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );
  const [showNotifications, setShowNotifications] = useState(true);
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleToggle = (item) => {
    setToggles({ ...toggles, [item]: !toggles[item] });
  };

  const arrowStyle = {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderLeft: "2px solid white",
    borderBottom: "2px solid white",
    transform: "rotate(-45deg)",
    transition: "transform 0.3s",
  };

  const inputStyle = {
    width: "200px",
    height: "28px",
    padding: "4px 10px",
    borderRadius: "6px",
    border: "1px solid #777",
    backgroundColor: "#0B0E11",
    color: "white",
    fontSize: "16px",
  };

  const buttonStyle = {
    width: "100px",
    height: "28px",
    padding: "4px 10px",
    borderRadius: "8px",
    backgroundColor: "#148745",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    border: "1px solid #aaa",
    cursor: "pointer",
  };

  const blockStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "394px",
    height: "40px",
    padding: "0 10px",
    fontSize: "16px",
    cursor: "pointer",
  };

  const separatorStyle = {
    height: "1px",
    backgroundColor: "#444",
    margin: "4px 0",
    width: "100%",
  };

  // Nouveau style pour les notifications, largeur réduite jusqu'au milieu
  const lightBackgroundStyle = {
    backgroundColor: "#1A1E22",
    borderRadius: "8px",
    padding: "6px 10px",
    margin: "4px 0",
    width: "50%", // commence à gauche et s'arrête au milieu
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#0B0E11",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      {/* Sidebar */}
      <div style={{ width: "250px" }}>
        <Sidebar />
      </div>

      {/* Espacement + séparateur */}
      <div style={{ width: "40px", backgroundColor: "transparent" }}></div>
      <div
        style={{
          width: "0.5px",
          height: "100%",
          backgroundColor: "#ABAFB3",
          marginTop: "40px",
        }}
      ></div>
      <div style={{ width: "20px", backgroundColor: "transparent" }}></div>

      {/* Contenu principal */}
      <div style={{ flex: 1, padding: "32px 20px", overflowY: "auto" }}>
        {/* Header Settings */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "50px",
            padding: "0 16px",
            marginBottom: "40px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          <img
            src={SettingsLogo}
            alt="Settings logo"
            style={{ width: "24px", height: "24px", marginRight: "12px" }}
          />
          Settings
        </div>

        {/* Notifications */}
        <div
          onClick={() => setShowNotifications(!showNotifications)}
          style={blockStyle}
        >
          <span>Notifications</span>
          <span
            style={{
              ...arrowStyle,
              transform: showNotifications ? "rotate(45deg)" : "rotate(-45deg)",
            }}
          ></span>
        </div>
        <div style={separatorStyle}></div>

        {showNotifications &&
          notificationsList.map((item) => (
            <div key={item} style={lightBackgroundStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={Code} alt="icon" style={{ width: "20px", height: "20px" }} />
                  <span>{item}</span>
                </div>
                <div
                  onClick={() => handleToggle(item)}
                  style={{
                    width: "32px",
                    height: "16px",
                    borderRadius: "8px",
                    backgroundColor: "#0B0E11",
                    border: "1px solid #777",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      position: "absolute",
                      top: "2px",
                      left: toggles[item] ? "18px" : "2px",
                      transition: "left 0.3s",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}

        {/* Change Username */}
        <div
          onClick={() => setShowChangeUsername(!showChangeUsername)}
          style={blockStyle}
        >
          <span>Change Username</span>
          <span
            style={{
              ...arrowStyle,
              transform: showChangeUsername ? "rotate(45deg)" : "rotate(-45deg)",
            }}
          ></span>
        </div>
        <div style={separatorStyle}></div>
        {showChangeUsername && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px" }}>
            <input type="text" placeholder="username" style={inputStyle} />
            <button style={{ ...buttonStyle, fontFamily: "sans-serif" }}>Confirm</button>
          </div>
        )}

        {/* Change Password */}
        <div
          onClick={() => setShowChangePassword(!showChangePassword)}
          style={blockStyle}
        >
          <span>Change Password</span>
          <span
            style={{
              ...arrowStyle,
              transform: showChangePassword ? "rotate(45deg)" : "rotate(-45deg)",
            }}
          ></span>
        </div>
        <div style={separatorStyle}></div>
        {showChangePassword && (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "6px" }}>
            {["Password", "New Password", "Confirm Password"].map((placeholder) => (
              <input type="password" placeholder={placeholder} style={inputStyle} key={placeholder} />
            ))}
            <button style={{ ...buttonStyle, fontFamily: "sans-serif" }}>Confirm</button>
          </div>
        )}
      </div>
    </div>
  );
}