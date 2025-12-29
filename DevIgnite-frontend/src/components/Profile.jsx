import arrow from "../assets/arrow-up.svg";
import profilePic from "../assets/Ellipse 1.svg";
import logoutButton from "../assets/logout.svg";
import FollowedChannel from "./FollowedChannel";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import { logout, authFetch, setupTokenRefresh, refreshAccessToken } from '../utils/auth.js'


import home from '../assets/home.svg'
import people from '../assets/people.svg'
import design from '../assets/design.svg'
import comm from '../assets/comm.svg'
import layer from '../assets/layer.svg'
import code from '../assets/code.svg'

function Profile() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); 
  const toggle = () => {
    setOpen(prev => !prev); 
  };

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cleanup = setupTokenRefresh();
    return cleanup;
  }, []);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        const response = await authFetch('/api/me/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.log('Token expired, redirecting to login');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            navigate('/login');
            return;
          }
          if (response.status === 404) {
            console.log('User not found, redirecting to signup');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            navigate('/signup');
            return;
          }
          throw new Error(`Failed to fetch user info: ${response.status}`);
        }

        const data = await response.json();
        console.log('User data received:', data);
        
        if (!data.user) {
          console.log('No user data returned, redirecting to signup');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          navigate('/signup');
          return;
        }
        
        setUserInfo(data.user);
      } catch (err) {
        console.error('Error fetching user info:', err);

        if (err.message.includes('fetch') || err.message.includes('Network')) {
          setError('Cannot connect to server. Please try again later.');
        } else if (err.message.includes('token') || err.message.includes('auth')) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        } else {
          setError(err.message);
        }
        
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const getDepartmentIcon = (department) => {
    const iconMap = {
      'DEV': code,
      'UIUX': layer,
      'DESIGN': design,
      'HR': people,
      'COM': comm,
      'RELV': people,
      'General': home
    };
    return iconMap[department] || code;
  };

  if (!loading && !userInfo && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="max-w-md w-full bg-gray-900/50 rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Welcome to CseHub</h2>
          <p className="text-gray-400 mb-6">
            Please login or create an account to access your profile.
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="max-w-md w-full">
          <div className="text-red-400 text-xl mb-4">Error loading profile</div>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-bold flex flex-col justify-center items-center text-[#F3F7FE] p-6">
      <h1 className="text-4xl">Profile</h1>
      <div className="flex flex-col justify-center gap-8 w-[80%]">   
        <div className="flex flex-col justify-center items-center gap-2">
          <img src={profilePic} alt="profile" className="w-24 h-24" />
          <h2 className="text-2xl font-black">
            {userInfo?.username || 'Username'}
          </h2>
          <p className="text-gray-400 font-normal">
            {userInfo?.email || 'user@example.com'}
          </p>
          <div className="flex gap-3 mt-2">
            <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm font-normal">
              {userInfo?.role || 'Member'}
            </span>
            {userInfo?.department && (
              <span className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm font-normal">
                {userInfo.department}
              </span>
            )}
          </div>
        </div>

        <div className="w-full">
          <div className="flex flex-col justify-between w-full">
            <div 
              onClick={toggle} 
              className="flex justify-between items-center border-b border-zinc-700
                   hover:bg-zinc-900 p-4 cursor-pointer text-xl rounded-lg transition-colors"
            > 
              <h2>Following</h2>
              <img 
                src={arrow} 
                alt="arrow" 
                className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              />
            </div>
            {open && (
              <div className="flex flex-wrap gap-4 p-4 bg-gray-900/50 rounded-lg">
                {userInfo?.followedDepartments && userInfo.followedDepartments.length > 0 ? (
                  userInfo.followedDepartments.map((dept, index) => (
                    <FollowedChannel 
                      key={index}
                      ChannelName={dept}
                      icon={getDepartmentIcon(dept)}
                    />
                  ))
                ) : (
                  <p className="text-gray-400 font-normal text-center w-full">
                    Not following any departments yet
                  </p>
                )}
              </div>
            )}
          </div>

          <button className="flex justify-between items-center border-b border-zinc-700
                         hover:bg-zinc-900 p-4 cursor-pointer text-xl rounded-lg w-full"
                  onClick={()=> navigate('/liked')}>
            <h2>Liked Posts</h2>
            <img src={arrow} alt="arrow" />
          </button>

          <button className="flex justify-between items-center border-b border-zinc-700
                         hover:bg-zinc-900 p-4 cursor-pointer text-xl rounded-lg w-full"
               onClick={()=> navigate('/saved')}>
            <h2>Saved Posts</h2>
            <img src={arrow} alt="arrow" />
          </button>
        </div>

        <div 
          onClick={handleLogout}
          className="flex justify-between items-center hover:bg-red-900/30 p-4
           cursor-pointer rounded-lg transition-colors w-full border border-red-700/30"
        >
          <h2 className="text-red-500">Log out</h2>
          <img src={logoutButton} alt="logout" className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default Profile;