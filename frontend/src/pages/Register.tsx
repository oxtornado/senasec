import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import React, { useState, useCallback } from 'react';
import { User, Mail, KeyRound, Phone, Loader2 } from 'lucide-react';
import FaceCapture from '../components/FaceCapture';

interface FormData {
  username: string;
  documento: string;
  email: string;
  telefono: string;
  rol: string;
  password: string;
  face_token: string;
}

const Register = () => {
  const navigate = useNavigate();
  
  // Step management (1: data collection, 2: email verification, 3: complete registration)
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Verification states
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [isSendingCode, setIsSendingCode] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    username: '',
    documento: '',
    email: '',
    telefono: '',
    rol: '',
    password: '',
    face_token: '',
  });

  // Handle form input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Sanitization for documento - only allow numbers
    if (name === "documento" && !/^\d*$/.test(value)) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Step 1: Collect user data and send verification code
  const handleSendVerificationCode = useCallback(async () => {
    if (!formData.email || !formData.documento) {
      setErrorMessage('Please enter your email and document first');
      return;
    }
    
    setIsSendingCode(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const response = await axios.post("http://localhost:8000/users/verify-email-code/", {
        email: formData.email,
        documento: formData.documento
      });
      
      setSuccessMessage(response.data.message || 'Verification code sent to your email');
      setCurrentStep(2); // Move to verification step
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || 'Error sending verification code');
    } finally {
      setIsSendingCode(false);
    }
  }, [formData.email, formData.documento]);
  
  // Step 2: Verify the code
  const handleVerifyCode = useCallback(async () => {
    if (!verificationCode) {
      setErrorMessage('Please enter the verification code');
      return;
    }
    
    setIsVerifying(true);
    setErrorMessage('');
    
    try {
      await axios.post("http://localhost:8000/users/verify-code/", {
        email: formData.email,
        documento: formData.documento,
        code: verificationCode
      });
      
      setSuccessMessage('Email verified successfully');
      setIsEmailVerified(true);
      setCurrentStep(3); // Move to final registration step
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || 'Invalid or expired code');
    } finally {
      setIsVerifying(false);
    }
  }, [verificationCode, formData.email, formData.documento]);
  
  // Step 3: Complete registration
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailVerified) {
      setErrorMessage('Please verify your email first');
      return;
    }
    
    setIsRegistering(true);
    setErrorMessage('');
    
    try {
      const response = await axios.post("http://localhost:8000/users/registrar/", {
        ...formData,
        verificationCode: verificationCode // Include the verification code
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      setSuccessMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrorMessage(error.response?.data?.error || 'Registration error. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  }, [formData, isEmailVerified, navigate, verificationCode]);

  // Navigation between steps
  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setErrorMessage('');
      setSuccessMessage('');
    }
  };

  // Step 1: Collect basic user data
  const renderDataCollectionStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Step 1: Basic Information</h2>
        <p className="text-sm text-gray-500">Enter your basic information to start registration.</p>
      </div>
      
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Juan Pérez"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="usuario@ejemplo.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="documento" className="block text-sm font-medium text-gray-700">
          Document Number
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyRound className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="documento"
            name="documento"
            type="text"
            required
            value={formData.documento}
            onChange={handleChange}
            className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="1234567890"
          />
        </div>
      </div>

      <div>
        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            required
            value={formData.telefono}
            onChange={handleChange}
            className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="(123) 456-7890"
          />
        </div>
      </div>

      <div>
        <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <div className="mt-1">
          <select
            id="rol"
            name="rol"
            required
            value={formData.rol}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select a role</option>
            <option value="admin">Inventory Manager</option>
            <option value="instructor">Instructor</option>
            <option value="seguridad">Security Manager</option>
            <option value="aseo">Cleaning Staff</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyRound className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSendVerificationCode}
          disabled={!formData.email || !formData.documento || !formData.username || !formData.telefono || !formData.rol || !formData.password || isSendingCode}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSendingCode ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : 'Send Verification Code'}
        </button>
      </div>
    </div>
  );

  // Step 2: Email verification
  const renderEmailVerificationStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Step 2: Email Verification</h2>
        <p className="text-sm text-gray-500">
          We sent a verification code to <strong>{formData.email}</strong>. Please enter it below.
        </p>
      </div>
      
      <div>
        <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
          Verification Code
        </label>
        <div className="mt-1">
          <input
            id="verificationCode"
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter verification code"
            disabled={isVerifying}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBackStep}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back
        </button>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleSendVerificationCode}
            disabled={isSendingCode}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSendingCode ? 'Resending...' : 'Resend Code'}
          </button>
          
          <button
            type="button"
            onClick={handleVerifyCode}
            disabled={!verificationCode || isVerifying}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : 'Verify Code'}
          </button>
        </div>
      </div>
    </div>
  );

  // Step 3: Complete registration with face capture
  const renderRegistrationStep = () => (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-lg font-medium text-gray-900">Step 3: Complete Registration</h2>
        <p className="text-sm text-gray-500">Almost done! Please capture your face for security purposes.</p>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Face Capture
        </label>
        <FaceCapture onCapture={(token: string) => setFormData({ ...formData, face_token: token })} />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBackStep}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back
        </button>
        
        <button
          type="submit"
          disabled={!formData.face_token || isRegistering}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRegistering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : 'Complete Registration'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Account
          </h1>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium ${
                      currentStep >= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error and success messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {/* Render current step */}
          {currentStep === 1 && renderDataCollectionStep()}
          {currentStep === 2 && renderEmailVerificationStep()}
          {currentStep === 3 && renderRegistrationStep()}
        </div>
        
        <div className="text-center text-sm">
          <p className="text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;  