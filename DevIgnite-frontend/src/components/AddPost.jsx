import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/auth';

function AddPost({ department }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    content: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Department names mapping
  const departmentNames = {
    'General': 'General',
    'DEV': 'Development',
    'UIUX': 'UI/UX',
    'DESIGN': 'Design',
    'HR': 'Human Resources',
    'COM': 'Communications',
    'RELV': 'Relev',
    'Followings': 'Followings',
    'Liked': 'Liked Posts',
    'Saved': 'Saved Posts'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }
    
    if (!department || department === 'Followings' || department === 'Liked' || department === 'Saved' || department === 'General') {
      setError('Cannot post to this section. Please select a specific department.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authFetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: formData.content,
          department: department, 
          image: formData.image || undefined
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || 'Failed to create post');
      }

      const data = await response.json();
      setSuccess('Post created successfully!');
      
      setFormData({
        content: '',
        image: ''
      });
      setTimeout(() => {
        navigate(`/?department=${department}`);
      }, 1500);

    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message || 'An error occurred while creating the post');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/?department=${department}`);
  };

  const canPostInDepartment = department && 
    !['Followings', 'Liked', 'Saved'].includes(department);

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Create New Post</h1>
            {canPostInDepartment && (
              <p className="text-gray-400 mt-2">
                Posting in: <span className="text-amber-300 font-medium">
                  {departmentNames[department] || department}
                </span>
              </p>
            )}
          </div>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
        {!canPostInDepartment && (
          <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-xl">
            <p className="text-yellow-400 font-medium mb-2">
              Cannot Create Post Here
            </p>
            <p className="text-yellow-300">
              You can only create posts in specific departments. 
              Please navigate to a department (e.g., General, Development, Design) to create a post.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-3 px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Go to General Feed
            </button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-xl">
            <p className="text-green-400">{success}</p>
            <p className="text-green-300 text-sm mt-1">
              Redirecting to {departmentNames[department] || department} feed...
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        {canPostInDepartment && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2">
                What would you like to share?
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                disabled={loading}
                rows="8"
                placeholder={`Share your thoughts in ${departmentNames[department] || department}...`}
                className="w-full p-4 bg-transparent border-2 border-neutral-800 rounded-xl text-white focus:outline-none focus:border-blue-600 resize-none disabled:opacity-50"
                autoFocus
              />
              <div className="flex justify-end mt-2">
                <span className="text-gray-400 text-sm">
                  {formData.content.length} characters
                </span>
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">
                Add an Image (Optional)
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://example.com/your-image.jpg"
                className="w-full p-4 bg-transparent border-2 border-neutral-800 rounded-xl text-white focus:outline-none focus:border-blue-600 disabled:opacity-50"
              />
            </div>
            {formData.image && (
              <div>
                <label className="block text-lg font-medium mb-2">
                  Image Preview
                </label>
                <div className="border-2 border-neutral-800 rounded-xl p-4">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="max-w-full h-auto rounded-lg max-h-64 object-contain mx-auto"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+SW1hZ2UgTm90IExvYWRlZDwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-amber-300 text-[#0B0E11] font-bold rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Post...
                  </span>
                ) : (
                  `Post to ${departmentNames[department] || department}`
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddPost;