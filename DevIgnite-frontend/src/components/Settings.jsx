import React, { useState } from "react";
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

  return (
    <div className="flex flex-row justify-center h-screen bg-[#0B0E11] text-white font-sans overflow-hidden">
      {/* Spacer and vertical line */}
      <div className="w-10 bg-transparent"></div>
      <div className="w-px h-full bg-[#ABAFB3] mt-10"></div>
      <div className="w-5 bg-transparent"></div>

      {/* Main content */}
      <div className="flex-1 p-8 px-5 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center h-12 px-4 mb-10 text-lg font-bold">
          <img
            src={SettingsLogo}
            alt="Settings logo"
            className="w-6 h-6 mr-3"
          />
          Settings
        </div>

        {/* Notifications section */}
        <div
          onClick={() => setShowNotifications(!showNotifications)}
          className="flex items-center justify-between w-[394px] h-10 px-2.5 text-base cursor-pointer"
        >
          <span>Notifications</span>
          <span
            className={`inline-block w-2.5 h-2.5 border-l-2 border-b-2 border-white transition-transform duration-300 ${
              showNotifications ? "rotate-45" : "-rotate-45"
            }`}
          ></span>
        </div>
        <div className="h-px bg-[#444] my-1 w-full"></div>

        {/* Notifications list */}
        {showNotifications &&
          notificationsList.map((item) => (
            <div
              key={item}
              className="bg-[#1A1E22] rounded-lg p-1.5 px-2.5 my-1 w-1/2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={Code} alt="icon" className="w-5 h-5" />
                  <span>{item}</span>
                </div>
                <div
                  onClick={() => handleToggle(item)}
                  className="w-8 h-4 rounded-full bg-[#0B0E11] border border-[#777] relative cursor-pointer"
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all duration-300 ${
                      toggles[item] ? "left-[18px]" : "left-0.5"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          ))}

        {/* Change Username section */}
        <div
          onClick={() => setShowChangeUsername(!showChangeUsername)}
          className="flex items-center justify-between w-[394px] h-10 px-2.5 text-base cursor-pointer"
        >
          <span>Change Username</span>
          <span
            className={`inline-block w-2.5 h-2.5 border-l-2 border-b-2 border-white transition-transform duration-300 ${
              showChangeUsername ? "rotate-45" : "-rotate-45"
            }`}
          ></span>
        </div>
        <div className="h-px bg-[#444] my-1 w-full"></div>
        
        {showChangeUsername && (
          <div className="flex items-center gap-3 mt-1.5">
            <input
              type="text"
              placeholder="username"
              className="w-50 h-7 px-2.5 py-1 rounded border border-[#777] bg-[#0B0E11] text-white text-base"
            />
            <button className="w-25 h-7 px-2.5 py-1 rounded-lg bg-[#148745] text-white text-base font-bold border border-[#aaa] cursor-pointer font-sans">
              Confirm
            </button>
          </div>
        )}

        {/* Change Password section */}
        <div
          onClick={() => setShowChangePassword(!showChangePassword)}
          className="flex items-center justify-between w-[394px] h-10 px-2.5 text-base cursor-pointer"
        >
          <span>Change Password</span>
          <span
            className={`inline-block w-2.5 h-2.5 border-l-2 border-b-2 border-white transition-transform duration-300 ${
              showChangePassword ? "rotate-45" : "-rotate-45"
            }`}
          ></span>
        </div>
        <div className="h-px bg-[#444] my-1 w-full"></div>
        
        {showChangePassword && (
          <div className="flex flex-col gap-1 mt-1.5">
            {["Password", "New Password", "Confirm Password"].map((placeholder) => (
              <input
                key={placeholder}
                type="password"
                placeholder={placeholder}
                className="w-50 h-7 px-2.5 py-1 rounded border border-[#777] bg-[#0B0E11] text-white text-base"
              />
            ))}
            <button className="w-25 h-7 px-2.5 py-1 rounded-lg bg-[#148745] text-white text-base font-bold border border-[#aaa] cursor-pointer font-sans mt-1">
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}