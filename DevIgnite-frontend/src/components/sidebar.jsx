import React from 'react'


const Section = (icon, departement) => {
  return (
    <div>
      <div>
        <img src={icon} alt="icon" />
        <p>{departement}</p>
      </div>
        <img src="" alt="" />
    </div>
  )
}


const Sidebar = () => {
  return (
    <section>
        <div>
          <img src="" alt="" />
          <p>Cse<span>Hub</span></p>
        </div>
        <Section icon="" departement="" ></Section>
        <Section icon="" departement="" ></Section>
        <Section icon="" departement="" ></Section>
        <Section icon="" departement="" ></Section>
        <Section icon="" departement="" ></Section>
        <Section icon="" departement="" ></Section>
        <div>

        </div>
        <div>
        <Section icon="" departement="" ></Section>
        </div>
    </section>
  )
}

export default sidebar