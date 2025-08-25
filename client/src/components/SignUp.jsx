import { useState, useEffect } from 'react'
import { EyeIcon, EyeOffIcon, ArrowLeft, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router';
import { ENDPOINTS } from '../config/api';
import { handleApiError } from '../utils/errorHandler';

export default function Signup() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);

  const checkPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, confirmPassword }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('hashedPassword', data.hashedPassword);
        localStorage.setItem('saltForKey', data.saltForKey);
        localStorage.setItem('encryptedMnemonic', data.encryptedMnemonic);
        localStorage.setItem('encryptedSeed', data.encryptedSeed);
        localStorage.setItem('iv', data.iv);
        
        toast.success('Wallet created successfully!');
        setTimeout(() => navigate('/seed'), 1500);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      handleApiError(error, 'Failed to create wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Create a password
            </h2>
            <p className="mt-3 text-gray-300">
              This password will unlock your wallet. Make it strong and memorable.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`w-full px-4 py-3 bg-[#2a2b35] border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      errors.password ? 'border-red-500' : 'border-gray-600 focus:border-purple-500'
                    }`}
                    placeholder="Enter a strong password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
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
                {errors.password && (
                  <div className="flex items-center space-x-1 mt-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-sm text-red-400">{errors.password}</p>
                  </div>
                )}
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Password strength</span>
                      <span className={`text-sm font-medium ${passwordStrength <= 2 ? 'text-red-400' : passwordStrength <= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className={`w-full px-4 py-3 bg-[#2a2b35] border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-600 focus:border-purple-500'
                    }`}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center space-x-1 mt-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-sm text-red-400">{errors.confirmPassword}</p>
                  </div>
                )}
                {confirmPassword && password === confirmPassword && (
                  <div className="flex items-center space-x-1 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <p className="text-sm text-green-400">Passwords match</p>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                    }}
                    className={`mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-[#2a2b35] ${
                      errors.terms ? 'border-red-500' : ''
                    }`}
                  />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-300 leading-relaxed">
                    I understand that Crypto Wallet cannot recover this password for me.{' '}
                    <span className="text-purple-400 hover:text-purple-300 cursor-pointer">
                      Learn more
                    </span>
                  </label>
                </div>
                {errors.terms && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-sm text-red-400">{errors.terms}</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !password || !confirmPassword || !termsAccepted}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50 shadow-lg flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Wallet...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Create Wallet</span>
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* Footer */}
          <div className="text-center pt-6">
            <p className="text-sm text-gray-400">
              Already have a wallet?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Sign in instead
              </button>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}