import { useState} from 'react'
import { Navigate, useNavigate } from 'react-router'
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react'
import { toast } from 'react-toastify'
import Loader from './Loader'

export default function Login() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate=useNavigate();
 
  
const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch('https://web-wallet-backend.onrender.com/api/auth/login', {
          // mode:'no-cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password,hashedPasswordFromStorage:localStorage.getItem('hashedPassword') }), 
        });
  
        const data = await response.json();
  
        if (response.ok) {
          localStorage.setItem('authToken', data.token);
          // toast.success('Login successful!');
          setTimeout(() => navigate('/'), 1000);
          
          <Loader size="medium" color="white" />
          // navigate('/'); 
        } else {
          toast.error('Login failed: ' + data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Something went wrong with the login process!');
      }
    };

  return (
    <div className="min-h-screen bg-[#1a1b23] flex flex-col items-center justify-center px-4 text-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
            <LockIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your password to unlock your wallet
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-[#2a2b35] placeholder-gray-500 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Unlock
            </button>
          </div>
        </form>

        <div className="text-center">
          <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  )
}