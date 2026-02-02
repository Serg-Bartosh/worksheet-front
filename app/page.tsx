'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import TaskCard from './components/TaskCard';

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const [isLoginView, setIsLoginView] = useState(true);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const savedToken = sessionStorage.getItem('session_token');
    if (savedToken) {
      setToken(savedToken);
      fetchTasks(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTasks = async (authToken: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/worksheet-tasks/tasks`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch tasks failed", err);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = isLoginView
      ? `${API_URL}/user/login`
      : `${API_URL}/user/create-user`;

    try {
      const res = await axios.post(url, { login, password });
      const newToken = res.data.token;

      if (newToken) {
        sessionStorage.setItem('session_token', newToken);
        setToken(newToken);
        await fetchTasks(newToken);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('session_token');
    setToken(null);
    setTasks([]);
    setLogin('');
    setPassword('');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header isLoggedIn={false} onLogout={() => { }} />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isLoginView ? 'Welcome Back' : 'Create Account'}
            </h2>
            <form onSubmit={handleAuth}>
              <input
                type="text"
                placeholder="Login"
                value={login}
                required
                className="w-full mb-4 p-3 border rounded-lg focus:outline-[#50c878]"
                onChange={e => setLogin(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                required
                className="w-full mb-6 p-3 border rounded-lg focus:outline-[#50c878]"
                onChange={e => setPassword(e.target.value)}
              />
              <button type="submit" className="w-full bg-[#50c878] text-white p-3 rounded-lg font-bold hover:bg-[#45b36b] transition">
                {isLoginView ? 'Login' : 'Register'}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              {isLoginView ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="text-[#50c878] font-bold hover:underline"
                onClick={() => setIsLoginView(!isLoginView)}
              >
                {isLoginView ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={true} onLogout={handleLogout} />
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">English Grammar Tasks</h1>
        <p className="text-gray-500 mb-10">You are logged in as <span className="font-bold text-gray-800">{login}</span></p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#50c878]"></div>
          </div>
        ) : (
          tasks.map((task: any) => <TaskCard key={task.id} {...task} />)
        )}
      </div>
    </div>
  );
}