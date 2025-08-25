import { useState } from 'react'
import { useNavigate } from 'react-router'
import { EyeIcon, EyeOffIcon, ArrowLeft, Key, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { ENDPOINTS } from '../config/api'
import { handleApiError } from '../utils/errorHandler'

export default function Login() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate();
 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password) {
      setError('Password is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const hashedPassword = localStorage.getItem('hashedPassword');
      
      if (!hashedPassword) {
        setError('No wallet found. Please create a new wallet.');
        setIsLoading(false);
        return;
      }
      
      const response = await fetch(ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          password,
          hashedPasswordFromStorage: hashedPassword
        }), 
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        toast.success('Welcome back!');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError(data.message || 'Invalid password. Please try again.');
      }
    } catch (error) {
      setError('Connection failed. Please check your internet connection.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1b23] via-[#2a2b35] to-[#1a1b23] flex flex-col px-4 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-3 rounded-2xl shadow-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Welcome back
            </h2>
            <p className="mt-3 text-gray-300">
              Enter your password to unlock your wallet
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`w-full px-4 py-3 bg-[#2a2b35] border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      error ? 'border-red-500' : 'border-gray-600 focus:border-purple-500'
                    }`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {error && (
                  <div className="flex items-center space-x-1 mt-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50 shadow-lg flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Unlocking...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    <span>Unlock Wallet</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Forgot Password */}
          <div className="text-center space-y-4">
            <button
              onClick={() => {
                toast.info('Please create a new wallet if you forgot your password');
              }}
              className="text-purple-400 hover:text-purple-300 font-medium text-sm"
            >
              Forgot your password?
            </button>
            
            <div className="border-t border-gray-700 pt-4">
              <p className="text-sm text-gray-400">
                Don't have a wallet?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Create new wallet
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}