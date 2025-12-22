import './App.css'
<<<<<<< HEAD
import Profile from './components/Profile.jsx'
import Login from './components/Login.jsx'

function App() {
  return (
    <div className="bg-[#0B0E11] h-screen">
      <Login />
=======
import Sidebar from './components/sidebar'
import Posts from './components/Post'
import Profile from './components/Profile'

function App() {
  return (
    <div className='flex  bg-[#0B0E11] h-screen'>
     {/* <Profile /> */}
     <Sidebar></Sidebar>
     <Posts></Posts>
>>>>>>> origin/main
    </div>
  )
}
export default App
