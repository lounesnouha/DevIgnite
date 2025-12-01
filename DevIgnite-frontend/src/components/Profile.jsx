import arrow from "../assets/arrow-up.svg";
import profilePic from "../assets/Ellipse 1.svg";
import logout from "../assets/logout.svg";
import FollowedChannel from "./FollowedChannel";
import { useState } from "react";
import code from "../assets/code.svg";

function Profile() {

    const [open, setOpen] = useState(false); 
    const toggle = () => {
        setOpen(prev => !prev); 
    };

  return (
    <div className="font-[quicksand] font-bold flex flex-col text-[#F3F7FE] p-6 ">
      <h1 className="text-4xl font-black">Profile</h1>
      <div className="flex flex-col justify-center gap-20 mt-12 w-lg">   
        <div className="flex flex-col justify-center items-center gap-2">
          <img src={profilePic} alt="profile" />
          <h2 className="text-2xl font-black">Username</h2>
        </div>

        <div>
            <div className="flex flex-col justify-between  w-full">
                <div onClick={toggle} className="flex justify-between items-center mb-2 border-b border-zinc-700 hover:bg-zinc-900 p-2 cursor-pointer text-xl" > 
                    <h2>Following</h2>
                    <img src={arrow} alt="arrow" />
                </div>
                {open && (
                    <div className="flex flex-wrap gap-4">
                        <FollowedChannel ChannelName="dev" icon={code} />
                        <FollowedChannel ChannelName="dev" icon={code} />
                        <FollowedChannel ChannelName="dev" icon={code} />
                        <FollowedChannel ChannelName="dev" icon={code} />
                        <FollowedChannel ChannelName="dev" icon={code} />
                    </div>
                    )}
            </div>
          

          <div className="flex justify-between  items-center mb-2 border-b border-zinc-700 hover:bg-zinc-900 p-2 cursor-pointer text-xl">
            <h2>Favorite</h2>
            <img src={arrow} alt="arrow" />
          </div>
        </div>
        

        <div className="flex justify-between  items-center hover:bg-zinc-900 p-2 cursor-pointer">
          <h2 className="text-red-700">Log out</h2>
          <img src={logout} alt="logout" />
        </div>

      </div>
    </div>
  );
}

export default Profile;
