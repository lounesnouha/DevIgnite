import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', 
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response URL:', response.url);
      console.log('🔍 Response headers:', response.headers.get('content-type'));

      // First, get the raw text to see what we're receiving
      const rawText = await response.text();
      console.log('🔍 Raw response (first 300 chars):', rawText.substring(0, 300));

      // Check if we got HTML (proxy failed)
      if (rawText.trim().startsWith('<!doctype') || rawText.includes('CseHub') || rawText.includes('<html')) {
        throw new Error(`
          ⚠️ PROXY ISSUE DETECTED!
          
          Your proxy isn't working. You're getting the React app HTML instead of API JSON.
          
          Quick fixes:
          1. Check your vite.config.js proxy config
          2. Or use absolute URL: http://localhost:5000/api/login
          3. Make sure backend is running on port 5000
          
          What you should see at: http://localhost:5000/api/login
          → JSON like: {"msg":"Bad request"}
          
          What you're getting:
          → HTML page (React app)
        `);
      }

      // Check if empty response
      if (!rawText || rawText.trim() === '') {
        throw new Error('Server returned empty response. Check backend logs.');
      }

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error(`Invalid JSON from server. Response: ${rawText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.msg || `Login failed: ${response.status}`);
      }

      // Store tokens and user data
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccess('Login successful! Redirecting...');
      
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-[#F3F7FE] gap-12">
      <h1 className="font-black text-6xl m-4">LogIn</h1>
    
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-2xl max-w-md">
          <p className="text-red-400 text-lg font-medium whitespace-pre-line">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-900/30 border border-green-700 rounded-2xl">
          <p className="text-green-400 text-lg font-medium">{success}</p>
        </div>
      )}

      <div className="flex flex-col gap-12 mt-4 w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-12">
          <div className="flex flex-col gap-2 font-[quicksand] text-xl">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="p-5 pt-3 pb-3 border-2 rounded-2xl border-neutral-800 focus:outline-0 focus:border-blue-600 bg-transparent"
              placeholder="Email" 
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="p-5 pt-3 pb-3 border-2 rounded-2xl border-neutral-800 focus:outline-0 focus:border-blue-600 bg-transparent"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="p-4 bg-amber-300 text-[#0B0E11] font-bold text-2xl rounded-2xl hover:cursor-pointer hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-400 font-[quicksand]">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-amber-300 hover:text-amber-400 font-bold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;