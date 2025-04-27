import { useState, useEffect } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router';

export default function Signup() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [isChecked, setisChecked] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsButtonDisabled(!isChecked);
  }, [isChecked]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(e)
    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    // console.log('hello')
    try {
      // console.log('block')
      const response = await fetch('https://web-wallet-backend.onrender.com/api/auth/register', {
        // mode:'no-cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: password, confirmPassword: confirmPassword }),
      });
      const data = await response.json();
      // console.log(data)
      if (response.ok) {
        localStorage.setItem('hashedPassword', data.hashedPassword);
        localStorage.setItem('saltForKey', data.saltForKey);
        localStorage.setItem('encryptedMnemonic', data.encryptedMnemonic);
        localStorage.setItem('encryptedSeed', data.encryptedSeed);
        localStorage.setItem('iv', data.iv);
        // toast.success('Registration successful!');
        setTimeout(() => navigate('/seed'), 2000);
      } else {
        toast.error('Registration failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1b23] flex flex-col items-center justify-center px-4 text-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">Create a password</h2>
          <p className="mt-2 text-sm text-gray-400">
            This password will be used to unlock your Phantom wallet
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-700 bg-[#2a2b35] placeholder-gray-500 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
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
            <div className="relative">
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-700 bg-[#2a2b35] placeholder-gray-500 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={isChecked}
                onChange={() => setisChecked(!isChecked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-[#2a2b35]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                I understand that Phantom cannot recover this password for me.
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Create
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}