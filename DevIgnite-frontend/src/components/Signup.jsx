import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email:'',
        username:'',
        password:''
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
        try{
            const response = await fetch("/api/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const rawText = await response.text();
            let data;
            try {
                data = JSON.parse(rawText);
            } catch {
                throw new Error('Invalid response from server');
            }

            if (!response.ok) {
                throw new Error(data.msg || 'Signup failed');
            }
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            setSuccess('Signup successful! Redirecting...');

            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        }catch(err){
            setError(err.message);
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="flex flex-col items-center justify-center h-full text-[#F3F7FE] gap-12">
            <h1 className="font-black text-6xl m-4">SignUp</h1>
    
            {error && (
            <div className="p-4 bg-red-900/30 border border-red-700 rounded-2xl max-w-md">
                <p className="text-red-400 text-lg font-medium">{error}</p>
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
                        <input name="email" type="email" value={formData.email} onChange={handleChange} 
                        required disabled={loading} placeholder="Email" className="p-5 pt-3 pb-3
                         border-2 rounded-2xl border-neutral-800 focus:outline-0 
                         focus:border-blue-600 bg-transparent"/>

                        <input name="username" type="username" value={formData.username} onChange={handleChange}
                        required disabled={loading} placeholder="Username" className="p-5 pt-3 pb-3 
                        border-2 rounded-2xl border-neutral-800 focus:outline-0 
                        focus:border-blue-600 bg-transparent"/>

                        <input name="password" type="password" value={formData.password} onChange={handleChange}
                        required disabled={loading} placeholder="Password" className="p-5 pt-3 pb-3 
                        border-2 rounded-2xl border-neutral-800 focus:outline-0 
                        focus:border-blue-600 bg-transparent"/>
                    </div>
                    <button type="submit" disabled={loading} className="p-4 bg-amber-300 
                    text-[#0B0E11] font-bold text-2xl rounded-2xl hover:cursor-pointer 
                    hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-gray-400 font-[quicksand]">
                        already have an account?{' '}
                        <button onClick={()=>navigate("/login")} className="text-amber-300 
                        hover:text-amber-400 font-bold transition-colors">
                            Log In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup;