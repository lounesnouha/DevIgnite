import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import save from '../assets/save.svg';
import like_button from '../assets/like.svg';
import imgBlank from '../assets/imgBlank.svg';
import pfp from '../assets/pfp.svg';  
import { authFetch } from '../utils/auth';

function PostCard({dep, content, img, likes, time, onLike}){

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Unknown time';
    }
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString();
    } catch (error) {
      return 'Unknown date';
    }
  };

  return(
    <div className='w-[90%] flex flex-col justify-center items-center 
          border-b border-[#ABAFB3] gap-8 pb-8'>
      <div className='flex flex-row w-full justify-between items-center'>
        <h2 className='font-bold text-2xl'>{dep}</h2>
        <p className='text-sm text-[#ABAFB3]'>{formatDate(time)} at {formatTime(time)}</p> 
      </div>
      <div className='flex flex-col w-full justify-center items-start'>
        <p className='text-start'>{content}</p>
        {img && img !== imgBlank && (
          <img src={img}  alt="Post content" 
            className="rounded-lg my-4"
          />
        )}
      </div>
      <div className="flex flex-row w-full justify-between items-center">
        <div className='flex flex-row w-[10%] justify-center items-center gap-2'>
          <button onClick={onLike} className='flex flex-row justify-center items-center'>
            <img className='w-8 h-8' src={like_button} alt="Like" />
          </button>
          <p className='text-2xl'>{likes}</p>
        </div>
        <button>
          <img className='w-8 h-8' src={save} alt="Save" />
        </button>
      </div>
    </div>
  )
}


function Feed({department}){

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const getPosts = async () => {
      setLoading(true);
      setError(null);
      let endpoint = '';
      if (department === "General") {
        endpoint = '/api/posts/general';
      } else if (department === "Followings"){
        endpoint = '/api/posts/feed';
      }
      else if (department) {
        endpoint = `/api/posts/department/${department}`;
      } else {
        setLoading(false);
        return;
      }
      try{
        let response;
        if (endpoint === '/api/posts/feed'){
          response = await authFetch(endpoint);
        }else{
          response = await fetch(endpoint);
        }

        if (!response.ok) {
          if (response.status === 401){
            throw new Error('Please log into your account to see your followings feed')
          }
          if (response.status === 400) {
            throw new Error('Invalid department');
          }
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data.posts || []);
      }catch(err){
        console.error('Error fetching posts:', err);
        setError(err.message);
        setPosts([]);
      }finally {
        setLoading(false);
      }
    };

    if (department) {
      getPosts();
    } else {
      setLoading(false);
    }

  },[department]);


  const handleLike = async (postId)=>{
    try{
      const response = await fetch(`/api/posts/${postId}/like`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
       )
      if (response.ok) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, likesCount: (post.likesCount || 0) + 1 } 
            : post
        ));
      } else if (response.status === 401) {
        navigate('/login');
      }
    }catch(err){
      console.error('Error liking post:', err);
    }
  }



  const handleSave = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (response.ok) {
      }
       else if (response.status === 401) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-400">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col'>
        <button 
          className='flex justify-end mt-10 mr-10'
          onClick={() => navigate('/profile')}
        >
          <img src={pfp} alt="Profile" />
        </button>
        
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="text-red-400 text-xl mb-4">Error loading posts</div>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return(
    <div className='flex flex-col w-full justify-center items-center gap-8 '>
      <button 
        className='flex self-end mt-10 mr-10'
        onClick={() => navigate('/profile')}
      >
        <img src={pfp} alt="Profile" />
      </button>

      <h1 className='font-[quicksand] text-center font-bold text-3xl'>{department}</h1>
      <div className="flex flex-col w-full justify-center items-center gap-4">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-gray-400 text-center max-w-md">
              {department 
                ? `There are no posts in the ${department} department yet.`
                : 'No posts available. Be the first to post!'
              }
            </p>
          </div>
        ) :(
          posts.map((post, index)=>(
            <PostCard 
              key={post._id || index}
              dep={post.department}
              content={post.content}
              img={post.image || imgBlank}
              likes={post.likesCount || 0}
              time={post.createdAt}
              onLike={() => handleLike(post._id)}/>
          ))
        )}
      </div>
    </div>
  )
}

export default Feed;