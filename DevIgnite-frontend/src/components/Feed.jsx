import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import save from '../assets/save.svg';
import like_button from '../assets/like.svg';
import imgBlank from '../assets/imgBlank.svg';
import pfp from '../assets/pfp.svg';  
import add_button from '../assets/add.svg';
import { authFetch } from '../utils/auth';

function PostCard({ dep, content, img, likes, time, onLike, onSave }) {
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

  return (
    <div className='w-[90%] flex flex-col justify-center items-center border-b border-[#ABAFB3] gap-8 pb-8'>
      <div className='flex flex-row w-full justify-between items-center'>
        <h2 className='font-bold text-2xl'>{dep}</h2>
        <p className='text-sm text-[#ABAFB3]'>{formatDate(time)} at {formatTime(time)}</p> 
      </div>
      <div className='flex flex-col w-full justify-center items-start'>
        <p className='text-start'>{content}</p>
        {img && img !== imgBlank && (
          <img src={img} alt="Post content" className="rounded-lg my-4" />
        )}
      </div>
      <div className="flex flex-row w-full justify-between items-center">
        <div className='flex flex-row w-[10%] justify-center items-center gap-2'>
          <button onClick={onLike} className='flex flex-row justify-center items-center'>
            <img className='w-8 h-8' src={like_button} alt="Like" />
          </button>
          <p className='text-2xl'>{likes}</p>
        </div>
        <button onClick={onSave}>
          <img className='w-8 h-8' src={save} alt="Save" />
        </button>
      </div>
    </div>
  );
}

function Feed({ department }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState('');
  const [followStatus, setFollowStatus] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const followedDepartments = user.followedDepartments || [];
    const initialFollowStatus = {};
    followedDepartments.forEach(dep => {
      initialFollowStatus[dep] = true;
    });
    setFollowStatus(initialFollowStatus);
  }, []);

  const isFollowing = department ? followStatus[department] || false : false;

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      setError(null);
      let endpoint = '';
      if (department === "General") {
        endpoint = '/api/posts/general';
      } else if (department === "Followings") {
        endpoint = '/api/posts/feed';
      } else if (department === "Liked") {
        endpoint = '/api/posts/me/liked';
      } else if (department === "Saved") {
        endpoint = '/api/posts/me/saved';
      } else if (department) {
        endpoint = `/api/posts/department/${department}`;
      } else {
        setLoading(false);
        return;
      }

      try {
        let response;
        if (endpoint === '/api/posts/feed' || endpoint === '/api/posts/me/liked' || endpoint === '/api/posts/me/saved') {
          response = await authFetch(endpoint);
        } else {
          response = await fetch(endpoint);
        }

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Please log into your account to see your followings feed');
          }
          if (response.status === 400) {
            throw new Error('Invalid department');
          }
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data.posts || []);
      } catch(err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (department) {
      getPosts();
    } else {
      setLoading(false);
    }
  }, [department]);

  const handleLike = async (postId) => {
    try {
      const response = await authFetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, likesCount: (post.likesCount || 0) + 1 } 
            : post
        ));
      } else if (response.status === 401) {
        navigate('/login');
      }
    } catch(err) {
      console.error('Error liking post:', err);
    }
  };

  const handleSave = async (postId) => {
    try {
      const response = await authFetch(`/api/posts/${postId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('Post saved successfully');
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleAdd = () => {
      navigate('/addPost');
    };

  const handleFollow = async () => {
    const invalidDepartments = ['General', 'Followings', 'Liked', 'Saved'];
    if (!department || invalidDepartments.includes(department)) {
      return;
    }

    setFollowLoading(true);
    setFollowError('');

    try {
      const response = await authFetch(`/api/users/follow/${department}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to follow department');
      }

      const data = await response.json();
      const isNowFollowing = data.msg.includes('followed successfully') && 
                           !data.msg.includes('unfollowed');
      
      setFollowStatus(prev => ({
        ...prev,
        [department]: isNowFollowing
      }));
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.followedDepartments) {
        user.followedDepartments = [];
      }
      
      if (isNowFollowing) {
        if (!user.followedDepartments.includes(department)) {
          user.followedDepartments.push(department);
        }
      } else {
        user.followedDepartments = user.followedDepartments.filter(dep => dep !== department);
      }
      localStorage.setItem('user', JSON.stringify(user));

    } catch(err) {
      console.error('Error following department:', err);
      setFollowError(err.message);
      alert(`Failed to follow: ${err.message}`);
    } finally {
      setFollowLoading(false);
    }
  };

  const showFollowButton = department && 
    !['General', 'Followings', 'Liked', 'Saved'].includes(department);

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

  return (
    <div className='flex flex-col w-full justify-center items-center gap-8'>
      <div className='flex flex-row justify-between w-full items-center p-4'>
        <button className='w-12 h-12' onClick={handleAdd}>
          <img src={add_button} alt="Add post" />
        </button>
        <button 
          className='w-12 h-12'
          onClick={() => navigate('/profile')}
        >
          <img src={pfp} alt="Profile" />
        </button>
      </div>

      <div className='grid grid-cols-3 w-full items-center px-8'>
        <div></div>
        <h1 className='font-[quicksand] text-center font-bold text-3xl'>{department}</h1>
        
        {showFollowButton && (
          <div className='flex justify-end'>
            <button 
              onClick={handleFollow}
              disabled={followLoading}
              className={`px-4 py-2 font-bold rounded-lg transition-colors duration-200 text-sm w-32
                         ${followLoading 
                           ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                           : isFollowing 
                             ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                             : 'bg-amber-300 text-[#0B0E11] hover:bg-amber-400'}`}
            >
              {followLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isFollowing ? 'Unfollowing...' : 'Following...'}
                </span>
              ) : isFollowing ? (
                'Following'
              ) : (
                `Follow ${department}`
              )}
            </button>
          </div>
        )}
      </div>

      {followError && (
        <div className="w-full max-w-2xl px-4">
          <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-400 text-sm">{followError}</p>
          </div>
        </div>
      )}

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
        ) : (
          posts.map((post, index) => (
            <PostCard 
              key={post._id || index}
              dep={post.department}
              content={post.content}
              img={post.image || imgBlank}
              likes={post.likesCount || 0}
              time={post.createdAt}
              onLike={() => handleLike(post._id)}
              onSave={() => handleSave(post._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Feed;