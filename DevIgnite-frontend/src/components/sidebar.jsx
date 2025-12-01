import React from 'react'
import Logo from '../assets/Logo.svg'
import Home from '../assets/home.svg'
import People from '../assets/people.svg'
import Design from '../assets/design.svg'
import Video from '../assets/video.svg'
import Comm from '../assets/comm.svg'
import Layer from '../assets/layer.svg'
import Code from '../assets/code.svg'
import Game from '../assets/game.svg'
import Setting from '../assets/settings.svg'

const Section = ({icon, departement, className}) => {
  return (
    <div className={className}>
      <button className='p cursor-pointer w-full'>
      <div className='flex items-center justify-start gap-4 py-2 pr-40'>
        <img src={icon} alt="icon" />
        <p className='text-white font-bold'>{departement}</p>
      </div>
      </button>

    </div>
  )
}


const Sidebar = () => {
  return (
    <section className='flex flex-col m-4 ml-8 '>
        <div className='flex gap-4 items-center mb-9'>
          <img src={Logo} alt="" />
          <p className='font-bold'>Cse<span className='text-[#FFD429]'>Hub</span></p>
        </div>
        <Section className='border-b border-gray-700' icon={Home} departement="General" ></Section>
        <Section className='border-b border-gray-700' icon={People} departement="HR" ></Section>
        <Section  className='border-b border-gray-700' icon={People} departement="RELEV" ></Section>
        <Section  className='border-b border-gray-700' icon={Design} departement="Design" ></Section>
        <Section className='border-b border-gray-700' icon={Video} departement="Multimedia" ></Section>
        <Section className='border-b border-gray-700' icon={Comm} departement="Communication" ></Section>
        <Section className='border-b border-gray-700' icon={Layer} departement="UI/UX" ></Section>
        <Section className='border-b border-gray-700' icon={Code} departement="Development" ></Section>
        <Section className='border-b border-gray-700' icon={Game} departement="Internal Activities" ></Section>
        <div>

        </div>
        <div className='mt-7'>
        <Section  icon={Setting} departement="Settings"></Section>
        </div>
    </section>
  )
}

export default Sidebar