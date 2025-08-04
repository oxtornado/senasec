import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, User, Mail, Loader2, Shield, Eye, AlertCircle, CheckCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import FaceCapture from '../components/FaceCapture';

interface UserData {
  id: number;
  documento: string;
  email: string;
  username: string;
  face_token?: string;
}

const Login = () => {
  const navigate = useNavigate();

  const [documento, setDocumento] = useState('');
  const [temporalToken, setTemporalToken] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [authMethod, setAuthMethod] = useState<'face' | 'email'>('face');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userNotFound, setUserNotFound] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  // Search for user when document is filled
  useEffect(() => {
    const searchUser = async () => {
      if (documento.length >= 6) { // Start searching when at least 6 digits
        setIsSearchingUser(true);
        setUserNotFound(false);
        setUserData(null);
        
        try {
          const response = await axios.get(`http://localhost:8000/users/usuarios/`);
          const users = response.data;
          
          const foundUser = users.find((user: UserData) => user.documento === documento);
          
          if (foundUser) {
            setUserData(foundUser);
            setUserNotFound(false);
          } else {
            setUserData(null);
            setUserNotFound(true);
          }
        } catch (error) {
          console.error('Error searching for user:', error);
          setUserData(null);
          setUserNotFound(true);
        } finally {
          setIsSearchingUser(false);
        }
      } else {
        setUserData(null);
        setUserNotFound(false);
        setCodeSent(false);
      }
    };

    const debounceTimer = setTimeout(searchUser, 500);
    return () => clearTimeout(debounceTimer);
  }, [documento]);

  const handleSendEmailCode = async () => {
    if (!userData) {
      toast.error('User not found');
      return;
    }

    setIsSendingCode(true);
    try {
      await axios.post('http://localhost:8000/users/verify-email-code/', {
        documento: userData.documento,
        email: userData.email
      });
      setCodeSent(true);
      toast.success(`Verification code sent to ${userData.email}`);
    } catch (err: any) {
      console.error("❌ Error sending email:", err);
      const msg = err.response?.data?.error || 'Error sending verification code';
      toast.error(msg);
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData) {
      toast.error('Please enter a valid document number');
      return;
    }

    if (authMethod === 'face' && !temporalToken) {
      toast.error('Please capture your face before signing in');
      return;
    }

    if (authMethod === 'email' && !emailCode) {
      toast.error('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    try {
      if (authMethod === 'face') {
        if (!userData.face_token) {
          toast.error('This user has no face capture registered');
          return;
        }

        // Compare faces
        const formData = new FormData();
        formData.append('registered_token', userData.face_token);
        formData.append('temporal_token', temporalToken);

        const compareRes = await axios.post('http://0.0.0.0:8001/compare-face/', formData);
        const result = compareRes.data;

        if (result.match) {
          toast.success('Login successful!');
          setTimeout(() => navigate('/inventory'), 1500);
        } else {
          toast.error('Face verification failed');
        }

      } else if (authMethod === 'email') {
        // Verify email code
        const verifyRes = await axios.post('http://localhost:8000/users/verify-code/', {
          email: userData.email,
          documento: userData.documento,
          code: emailCode,
        });

        toast.success('Code verified. Login successful!');
        setTimeout(() => navigate('/inventory'), 1500);
      }

    } catch (error: any) {
      console.error("❌ Login error:", error);
      const msg = error.response?.data?.error || 'Login process failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        
        <h2 className="text-center text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          SENASEC
        </h2>
        <p className="mt-3 text-center text-lg text-gray-600 font-medium">
          Smart Security System
        </p>
        <p className="mt-1 text-center text-sm text-gray-500">
          Secure access to your workspace
        </p>
      </div>

      {/* Login Form */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-10 px-6 shadow-2xl border border-white/20 rounded-2xl">
          <form className="space-y-8" onSubmit={handleSubmit}>
            
            {/* Document Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Document Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={documento}
                  onChange={(e) => {
                    // Only allow numbers
                    if (/^\d*$/.test(e.target.value)) {
                      setDocumento(e.target.value);
                      setEmailCode(''); // Reset email code when document changes
                      setCodeSent(false);
                    }
                  }}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your document number"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {isSearchingUser && (
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  )}
                  {!isSearchingUser && documento.length >= 6 && userData && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {!isSearchingUser && documento.length >= 6 && userNotFound && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
              
              {/* User Status Messages */}
              {documento.length >= 6 && (
                <div className="mt-2">
                  {isSearchingUser && (
                    <div className="flex items-center text-sm text-blue-600">
                      <Search className="w-4 h-4 mr-2" />
                      Searching for user...
                    </div>
                  )}
                  {!isSearchingUser && userData && (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      User found: {userData.username} ({userData.email})
                    </div>
                  )}
                  {!isSearchingUser && userNotFound && (
                    <div className="flex items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      No user found with this document number
                    </div>
                  )}
                </div>
              )}
              
              {documento.length > 0 && documento.length < 6 && (
                <div className="flex items-center text-sm text-gray-500">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Enter at least 6 digits to search for user
                </div>
              )}
            </div>

            {/* Authentication Method Selector - Only show if user is found */}
            {userData && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Authentication Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('face')}
                    disabled={isLoading || !userData.face_token}
                    className={`relative flex flex-col items-center justify-center py-4 px-3 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                      authMethod === 'face'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg transform scale-105'
                        : userData.face_token 
                          ? 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <Eye className="h-6 w-6 mb-2" />
                    Face Recognition
                    {!userData.face_token && (
                      <span className="text-xs mt-1">Not available</span>
                    )}
                    {authMethod === 'face' && userData.face_token && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setAuthMethod('email')}
                    disabled={isLoading}
                    className={`relative flex flex-col items-center justify-center py-4 px-3 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                      authMethod === 'email'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg transform scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <Mail className="h-6 w-6 mb-2" />
                    Email Code
                    {authMethod === 'email' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Face Capture - Only show if user found and has face token */}
            {userData && authMethod === 'face' && userData.face_token && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Face Capture
                </label>
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
                  <FaceCapture onCapture={(token) => setTemporalToken(token)} />
                  {temporalToken && (
                    <div className="mt-3 flex items-center text-sm text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Face captured successfully
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Email Verification - Only show if user found and email method selected */}
            {userData && authMethod === 'email' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-gray-700">
                    Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={handleSendEmailCode}
                    disabled={isSendingCode || isLoading}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isSendingCode ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Sending...
                      </>
                    ) : codeSent ? (
                      'Resend Code'
                    ) : (
                      'Send Code'
                    )}
                  </button>
                </div>
                
                {codeSent && (
                  <div className="flex items-center text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Code sent to {userData.email}
                  </div>
                )}
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter verification code"
                    disabled={isLoading || !codeSent}
                  />
                </div>
                
                {!codeSent && (
                  <div className="flex items-center text-sm text-gray-500">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Click "Send Code" to receive verification code
                  </div>
                )}
              </div>
            )}

            {/* Show message if no face token available for face auth */}
            {userData && authMethod === 'face' && !userData.face_token && (
              <div className="flex items-center text-sm text-amber-600 bg-amber-50 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5 mr-2" />
                This user has no face capture registered. Please use email verification or register face capture.
              </div>
            )}

            {/* Login Button - Only show if user is found */}
            {userData && (
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !userData ||
                    (authMethod === 'face' && (!temporalToken || !userData.face_token)) ||
                    (authMethod === 'email' && (!emailCode || !codeSent))
                  }
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Sign In
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Additional Links */}
          <div className="mt-8 space-y-4">
            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div>
              <Link
                to="/register"
                className="w-full flex justify-center items-center py-3 px-4 border-2 border-blue-200 rounded-xl text-base font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                <User className="w-5 h-5 mr-2" />
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Secure access powered by advanced biometric technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;