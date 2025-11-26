import close from "../assets/close.svg";

function FollowedChannel({ChannelName,icon}){
    return(
        <div className="flex justify-between items-center bg-zinc-800 p-2 pl-4 pr-4 rounded-full gap-3 hover:bg-blue-400/20 transition-colors">
            <img src={icon} alt="icon" />
            <h3>{ChannelName}</h3>
            <img src={close} alt="close" />
        </div>
    )

}

export default FollowedChannel;