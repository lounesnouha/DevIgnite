import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/auth.js';
import arrow from '../assets/arrow-up.svg';

function ChangeRole() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validDepartments = ['DEV', 'UIUX', 'DESIGN', 'HR', 'COM', 'RELV'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const findUserResponse = await authFetch(`/api/users?email=${encodeURIComponent(email)}`);
      
      if (!findUserResponse.ok) {
        throw new Error('User not found');
      }

      const userData = await findUserResponse.json();
      const userId = userData.user._id;

      const requestBody = { newRole };
      if (newRole === "manager" || newRole === "assistant_manager") {
        if (!newDepartment) {
          throw new Error('Select a department');
        }
        requestBody.newDepartment = newDepartment;
      }

      const response = await authFetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to change role');
      }

      const data = await response.json();
      setSuccess(`Role changed! ${data.msg}`);
      setEmail('');
      setNewRole('');
      setNewDepartment('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const requiresDepartment = newRole === 'manager' || newRole === 'assistant_manager';

  return (
    <div className="font-bold flex flex-col justify-center items-center text-[#F3F7FE] p-6">
      <div className="w-full max-w-md">
        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8"
        >
          <img src={arrow} alt="back" className="w-6 h-6" />
          Back
        </button>

        <h1 className="text-3xl mb-8">Change User Role</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2">User Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
              placeholder="user@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">New Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
              required
            >
              <option value="">Select role</option>
              <option value="vice_president">Vice President</option>
              <option value="manager">Manager</option>
              <option value="assistant_manager">Assistant Manager</option>
            </select>
          </div>

          {requiresDepartment && (
            <div>
              <label className="block text-gray-400 mb-2">Department</label>
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                required
              >
                <option value="">Select department</option>
                {validDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-red-400">{error}</p>}
          {success && <p className="text-green-400">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold ${
              loading ? 'bg-gray-600' : 'bg-amber-300 text-[#0B0E11] hover:bg-amber-400'
            }`}
          >
            {loading ? 'Changing...' : 'Change Role'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangeRole;