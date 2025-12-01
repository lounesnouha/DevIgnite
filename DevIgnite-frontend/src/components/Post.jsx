
import save from '../assets/save.svg'
import imgBlank from '../assets/imgBlank.svg'
import pfp from '../assets/pfp.svg'
import Profile from './Profile'


const Post = ({title, text, newPost}) => {
  return (
    <section className='ml-15 mr-10 my-[1.88rem] border-b border-gray-700'>
      <div className='flex justify-between'>
        <h2 className='font-bold text-[1.5rem]'>{title}</h2>
        <p>15:36</p> 
      </div>
      <div>
        <p className='my-6'>{text}</p>
        <img src={newPost} alt="" />
      </div>
      <button>
      <img className='my-2' src={save} alt="" />
      </button>
    </section>
  )
}


import { useState } from 'react';

function Posts() {
    const [showProfile, setShowProfile] = useState(false);
  return (
    <div className='flex flex-col h-screen overflow-y-auto'>
     {showProfile ? (
      <Profile onClose={() => setShowProfile(false)} />
    ) : (
      <>
        <button className='flex justify-end mt-10 mr-10'
          onClick={() => setShowProfile(true)} 
        >
          <img src={pfp} alt="" />
        </button>
        <Post title='General'
        text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
         ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum 
         eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque 
         commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros
         , eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id,
          ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque 
          vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, 
          tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi.'
        newPost={imgBlank}
        />
        <Post
        title='Members of the month November'
         text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
         ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum 
         eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque 
         commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros
        , eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id,
        ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque 
        vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, 
        tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi.'
        newPost={imgBlank}
        />
        <Post
        title='18th anniversary of CSE'
        text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
         ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum 
         eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque 
         commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros
         , eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id,
          ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque 
          vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, 
          tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi.'
        newPost={imgBlank}
        />
      </>
    )}
    </div>
  )
}
export default Posts;