import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import CSE_logo from '../assets/CSE_logo.svg';
import settings from '../assets/settings.svg';

import Home from '../assets/home.svg'
import People from '../assets/people.svg'
import Design from '../assets/design.svg'
import Comm from '../assets/comm.svg'
import Layer from '../assets/layer.svg'
import Code from '../assets/code.svg'
import followings from '../assets/followings.svg';

const Section = ({ icon, department, onClick, isOpen }) => {
  return (
    <button 
      onClick={onClick}
      className='cursor-pointer w-full hover:bg-zinc-900
            flex vflex-row justify-start items-center gap-4 py-2'>
      <img src={icon} alt="icon" className='w-8 h-8' />
      {isOpen && (
        <p className='text-white font-bold whitespace-nowrap'>{department}</p>
      )}
    </button>
  )
}

function Sidebar({ onDepartmentSelect }){
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const departments = [
    { id: 'General', name: 'General', icon: Home },
    { id: 'DEV', name: 'Development', icon: Code },
    { id: 'UIUX', name: 'UI/UX', icon: Layer },
    { id: 'DESIGN', name: 'Design', icon: Design },
    { id: 'HR', name: 'Human Resources', icon: People },
    { id: 'COM', name: 'Communications', icon: Comm },
    { id: 'RELV', name: 'Relev', icon: People },
    {id: 'Followings', name: 'Followings', icon: followings}
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleDepartmentClick = (departmentId) => {
    if (onDepartmentSelect) {
      onDepartmentSelect(departmentId);
    }
    navigate('/');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return(
    <section className={`flex flex-col min-h-screen transition-all duration-300 
                        justify-between items-start 
                        ${isOpen ? 'w-[30vw]' : 'w-[5vw]'}`}>

      <button onClick={()=> toggleSidebar()} 
              className="flex flex-row justify-center items-center">
        <img src={CSE_logo} alt="CSE"></img>
        {isOpen && (
            <p className='font-bold text-white text-lg'>Cse<span className='text-[#FFD429]'>Hub</span></p>
          )}
      </button>
      <div className="flex flex-col w-full">
        {departments.map((dept)=>(
          <div 
            key={dept.id} 
            className={'border-b border-[#ABAFB3]'}
          >
            <Section
              icon={dept.icon}
              department={dept.name}
              onClick={() => handleDepartmentClick(dept.id)}
              isOpen={isOpen}
            />
          </div>
        ))}
      </div>
      <div >
        <Section
          icon={settings}
          department="Settings"
          onClick={handleSettingsClick}
          isOpen={isOpen}
        />
      </div>
    </section>
  )
}
export default Sidebar;