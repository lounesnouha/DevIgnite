import close from "../assets/close.svg";
import { authFetch } from '../utils/auth';


function FollowedChannel({ChannelName,icon, onUnfollow}){
    const handleUnfollow = async ()=>{
        try{
            const response = await authFetch(`/api/users/follow/${ChannelName}`, {
                method: 'POST',
                Headers:{
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok){
                const data = await response.json();
                const user = JSON.parse(localStorage.getItem('user') || {});
                if (user.followedDepartments){
                    user.followedDepartments = user.followedDepartments.filter(dep => dep !== ChannelName);
                    localStorage.setItem('user', JSON.stringify(user))
                }
                if (onUnfollow) {
                    onUnfollow(ChannelName);
                }
            }else{
                console.error('Failed to unfollow channel');
            }

        }catch(err){
            console.error('Error unfollowing channel:', error);
        }
    }
    return(
        <div className="flex justify-between items-center bg-zinc-800 p-2 pl-4 pr-4 rounded-full gap-3 hover:bg-blue-400/20 transition-colors">
            <img src={icon} alt="icon" />
            <h3>{ChannelName}</h3>
            <button onClick={handleUnfollow}>
                <img src={close} alt="close" />
            </button>
        </div>
    )

}

export default FollowedChannel;