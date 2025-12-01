import './App.css'
import Sidebar from './components/sidebar'
import Posts from './components/Post'
import Profile from './components/Profile'

function App() {
  return (
    <div className='flex  bg-[#0B0E11] h-screen'>
     {/* <Profile /> */}
     <Sidebar></Sidebar>
     <Posts></Posts>
    </div>
  )
}
export default App
