import './App.css'
import Sidebar from './components/sidebar'
import Posts from './components/Post'

function App() {
  return (
    <div className='flex'>
     <Sidebar></Sidebar>
     <Posts></Posts>
    </div>
    
  )
}

export default App
