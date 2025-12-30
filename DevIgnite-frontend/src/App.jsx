import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/sidebar';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import Settings from './components/Settings';
import AddPost from './components/AddPost';
import ChangeRole from './components/ChangeRole';

function App() {
  const [selectedDepartment, setSelectedDepartment] = useState('General');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <Router>
      <div className="flex flex-row w-full bg-[#0B0E11]">
        <Sidebar 
          onDepartmentSelect={setSelectedDepartment} 
        />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'w-[70vw]' : 'w-[95vw]'}`}>
          <Routes>
            <Route path="/" element={<Feed department={selectedDepartment} />} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/profile" element={<Profile />} />
            <Route path="/department/:department" element={<Feed />} />
            <Route path="/settings" element={<Settings/>}/>
            <Route path="/liked" element={<Feed department="Liked"/>}/>
            <Route path="/saved" element={<Feed department="Saved"/>}/>
            <Route path="/addPost" element={<AddPost department={selectedDepartment}/>}/>
            <Route path="/change-role" element={<ChangeRole/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;