import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isRegister ? 'http://localhost:8080/api/auth/register' : 'http://localhost:8080/api/auth/login';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process request');
      }

      const data = await response.json();
      if (isRegister) {
        toast.success(data.message);
        setUsername('');
        setPassword('');
        setIsRegister(false);
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        await new Promise(resolve => setTimeout(resolve, 100)); // Đảm bảo token được lưu trước khi chuyển hướng
        toast.success('Login successful!');
        router.push('/');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fbfc]">
      <div className="flex items-center justify-between w-full max-w-4xl p-6">
        <div className="flex-1">
          <div className="relative">
            <img src="/path-to-illustration.png" alt="Workspace" className="w-full max-w-md" />
          </div>
        </div>
        <div className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h1 className="text-xl font-semibold mb-4 text-black text-center">
              {isRegister ? 'Register' : 'Login'}
            </h1>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Username"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Password"
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm text-gray-700">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password</a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {isRegister ? 'Register' : 'Log In'}
            </button>
            <div className="text-center mt-4 text-gray-500 text-sm">
              — or login with —
            </div>
            <div className="flex justify-center mt-2 space-x-4">
              <button className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
                <span className="text-white">F</span>
              </button>
              <button className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-white">T</span>
              </button>
              <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white">G</span>
              </button>
            </div>
            <p className="mt-4 text-center text-sm text-gray-700">
              {isRegister ? 'Already have an account?' : 'No account yet?'}
              <span
                className="text-blue-500 ml-2 cursor-pointer hover:underline"
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister ? 'Login' : 'Register'}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;