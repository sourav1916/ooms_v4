import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar, Header } from '../components/header';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiEdit2, 
  FiSave, 
  FiX,
  FiCamera,
  FiBriefcase,
  FiCalendar,
  FiGlobe,
  FiLinkedin,
  FiGithub,
  FiTwitter,
  FiAward,
  FiSettings,
  FiMenu,
  FiHome,
  FiBarChart2,
  FiFileText,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiBell,
  FiSearch,
  FiLock,
  FiUpload,
  FiFile,
  FiCreditCard,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw
} from 'react-icons/fi';

// Main Profile Component
export default function MyProfile() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('sidebarMinimized') : null;
    return saved ? JSON.parse(saved) : false;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    jobTitle: 'Senior Product Manager',
    company: 'Tech Innovations Inc.',
    department: 'Product Development',
    employeeId: 'EMP-2024-001',
    joinDate: 'January 2022',
    bio: 'Passionate about building innovative solutions and leading high-performing teams. Focused on user-centric design and data-driven decision making.',
    website: 'johndoe.com',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
    twitter: '@johndoe',
    skills: ['Product Strategy', 'Team Leadership', 'Agile', 'Data Analysis'],
    language: 'English',
    timezone: 'EST (UTC-5)',
    documents: {
      aadharCard: null,
      panCard: null,
      bankStatement: null,
      idProof: null
    },
    bankDetails: {
      accountNumber: '',
      accountHolder: '',
      bankName: '',
      ifscCode: '',
      branch: ''
    },
    // Add verification status
    verification: {
      email: false, // false = pending, true = verified
      phone: false,
      emailVerificationSent: false,
      phoneVerificationSent: false,
      emailVerificationCode: '',
      phoneVerificationCode: '',
      emailVerifiedAt: null,
      phoneVerifiedAt: null
    }
  });

  const [tempProfile, setTempProfile] = useState(JSON.parse(JSON.stringify(profile)));
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [uploadingFile, setUploadingFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [verificationModal, setVerificationModal] = useState({
    open: false,
    type: 'email', // 'email' or 'phone'
    code: '',
    inputCode: ''
  });
  const [resendTimer, setResendTimer] = useState({
    email: 0,
    phone: 0
  });

  // Persist sidebar minimized state
  useEffect(() => {
    localStorage.setItem('sidebarMinimized', JSON.stringify(isMinimized));
  }, [isMinimized]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  // Resend timer effect
  useEffect(() => {
    const emailInterval = setInterval(() => {
      if (resendTimer.email > 0) {
        setResendTimer(prev => ({ ...prev, email: prev.email - 1 }));
      }
    }, 1000);

    const phoneInterval = setInterval(() => {
      if (resendTimer.phone > 0) {
        setResendTimer(prev => ({ ...prev, phone: prev.phone - 1 }));
      }
    }, 1000);

    return () => {
      clearInterval(emailInterval);
      clearInterval(phoneInterval);
    };
  }, [resendTimer]);

  const handleEdit = () => {
    setTempProfile(JSON.parse(JSON.stringify(profile)));
    setIsEditing(true);
  };

  const handleSave = () => {
    // Check if email or phone changed and reset verification if changed
    const updatedProfile = JSON.parse(JSON.stringify(tempProfile));
    if (tempProfile.email !== profile.email) {
      updatedProfile.verification.email = false;
      updatedProfile.verification.emailVerificationSent = false;
      updatedProfile.verification.emailVerificationCode = '';
      updatedProfile.verification.emailVerifiedAt = null;
    }
    if (tempProfile.phone !== profile.phone) {
      updatedProfile.verification.phone = false;
      updatedProfile.verification.phoneVerificationSent = false;
      updatedProfile.verification.phoneVerificationCode = '';
      updatedProfile.verification.phoneVerifiedAt = null;
    }
    
    setProfile(updatedProfile);
    setTempProfile(JSON.parse(JSON.stringify(updatedProfile)));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(JSON.parse(JSON.stringify(profile)));
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleBankDetailChange = (field, value) => {
    setTempProfile(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value
      }
    }));
  };

  // Generate OTP
  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    setShowOTPModal(true);
    
    // Show OTP in console and alert
    console.log('🔐 Password Change OTP:', otp);
    alert(`Password change OTP has been generated. Check console for OTP.\n\n(In production, this would be sent to your email/phone)`);
    
    // Auto-clear OTP after 10 minutes
    setTimeout(() => {
      setGeneratedOTP('');
      setOtpInput(['', '', '', '', '', '']);
    }, 600000);
  };

  // Handle password change
  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password don't match!");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    generateOTP();
  };

  // Verify OTP
  const verifyOTP = () => {
    const enteredOTP = otpInput.join('');
    console.log('Entered OTP:', enteredOTP);
    console.log('Generated OTP:', generatedOTP);
    
    if (enteredOTP === generatedOTP) {
      alert('Password changed successfully!');
      setShowOTPModal(false);
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setOtpInput(['', '', '', '', '', '']);
    } else {
      alert('Invalid OTP! Please try again.');
    }
  };

  // Handle file upload
  const handleFileUpload = (documentType, file) => {
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, PNG, and PDF files are allowed');
      return;
    }
    
    setUploadingFile(documentType);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Update profile with uploaded file
          const fileName = file.name;
          setTempProfile(prev => ({
            ...prev,
            documents: {
              ...prev.documents,
              [documentType]: {
                name: fileName,
                size: file.size,
                type: file.type,
                uploadedAt: new Date().toISOString()
              }
            }
          }));
          
          setUploadingFile(null);
          alert(`${documentType.replace(/([A-Z])/g, ' $1')} uploaded successfully!`);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    const newOtpInput = [...otpInput];
    newOtpInput[index] = value;
    setOtpInput(newOtpInput);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Generate verification code
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Handle email/phone verification request
  const handleVerificationRequest = (type) => {
    const code = generateVerificationCode();
    const contact = type === 'email' ? tempProfile.email : tempProfile.phone;
    
    // Update temp profile with verification code
    setTempProfile(prev => ({
      ...prev,
      verification: {
        ...prev.verification,
        [`${type}VerificationSent`]: true,
        [`${type}VerificationCode`]: code
      }
    }));
    
    // Set resend timer (30 seconds)
    setResendTimer(prev => ({ ...prev, [type]: 30 }));
    
    // Show the verification modal
    setVerificationModal({
      open: true,
      type,
      code,
      inputCode: ''
    });
    
    // Show the verification code in console instead of alert
    console.log(`📧 ${type === 'email' ? 'Email' : 'Phone'} Verification Code for ${contact}:`, code);
    console.log(`🔢 Enter this code in the verification modal: ${code}`);
    
    // Show user-friendly message
    alert(`Code Sended`);
  };

  // Resend verification code
  const handleResendCode = (type) => {
    if (resendTimer[type] > 0) return;
    
    const code = generateVerificationCode();
    const contact = type === 'email' ? tempProfile.email : tempProfile.phone;
    
    setTempProfile(prev => ({
      ...prev,
      verification: {
        ...prev.verification,
        [`${type}VerificationCode`]: code
      }
    }));
    
    // Update modal code if it's open for this type
    if (verificationModal.open && verificationModal.type === type) {
      setVerificationModal(prev => ({ ...prev, code }));
    }
    
    // Reset timer
    setResendTimer(prev => ({ ...prev, [type]: 30 }));
    
    // Log to console instead of alert
    console.log(`📧 New ${type} verification code sent to ${contact}:`, code);
    console.log(`🔢 New verification code: ${code}`);
    
    alert(`New ${type === 'email' ? 'email' : 'SMS'} verification code has been generated.\n\n✅ Please check your browser console (F12 → Console tab) to see the new verification code.`);
  };

  // Verify with code
  const verifyWithCode = () => {
    const { type, inputCode, code } = verificationModal;
    
    console.log('🔍 Verification Attempt:');
    console.log('Type:', type);
    console.log('User entered:', inputCode);
    console.log('Expected code:', code);
    
    if (!inputCode || inputCode.length !== 6) {
      alert('Please enter the complete 6-digit verification code');
      return;
    }
    
    if (inputCode !== code) {
      console.log('❌ Verification failed: Codes do not match');
      alert('Invalid verification code. Please try again.');
      return;
    }
    
    console.log('✅ Verification successful!');
    
    // Update verification status in temp profile
    const updatedTempProfile = JSON.parse(JSON.stringify(tempProfile));
    updatedTempProfile.verification[type] = true;
    updatedTempProfile.verification[`${type}VerificationSent`] = false;
    updatedTempProfile.verification[`${type}VerifiedAt`] = new Date().toISOString();
    
    setTempProfile(updatedTempProfile);
    
    // Also update main profile if we're in edit mode
    if (isEditing) {
      const updatedProfile = JSON.parse(JSON.stringify(profile));
      updatedProfile.verification[type] = true;
      updatedProfile.verification[`${type}VerificationSent`] = false;
      updatedProfile.verification[`${type}VerifiedAt`] = new Date().toISOString();
      setProfile(updatedProfile);
    } else {
      // If not editing, update main profile directly
      const updatedProfile = JSON.parse(JSON.stringify(profile));
      updatedProfile.verification[type] = true;
      updatedProfile.verification[`${type}VerificationSent`] = false;
      updatedProfile.verification[`${type}VerifiedAt`] = new Date().toISOString();
      setProfile(updatedProfile);
      setTempProfile(updatedProfile);
    }
    
    // Close modal
    setVerificationModal({
      open: false,
      type: 'email',
      code: '',
      inputCode: ''
    });
    
    console.log(`🎉 ${type === 'email' ? 'Email' : 'Phone'} verified successfully!`);
    alert(`${type === 'email' ? 'Email' : 'Phone'} verified successfully! ✅\n\nBlue checkmark should now appear next to your ${type}.`);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <FiUser /> },
    { id: 'professional', label: 'Professional', icon: <FiBriefcase /> },
    { id: 'documents', label: 'Documents', icon: <FiFile /> },
    { id: 'security', label: 'Security', icon: <FiShield /> },
    { id: 'social', label: 'Social Links', icon: <FiGlobe /> },
    { id: 'preferences', label: 'Preferences', icon: <FiSettings /> }
  ];

  const stats = [
    { label: 'Projects', value: '24', icon: <FiBriefcase /> },
    { label: 'Tasks Completed', value: '156', icon: <FiAward /> },
    { label: 'Team Members', value: '8', icon: <FiUser /> }
  ];

  // Get current profile for display
  const displayProfile = isEditing ? tempProfile : profile;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isMinimized={isMinimized}
      />
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isMinimized={isMinimized}
        setIsMinimized={setIsMinimized}
      />

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          isMinimized ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6"
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                
                {/* Profile Image */}
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center relative">
                      <span className="text-4xl font-semibold text-gray-700">
                        {displayProfile.name.charAt(0)}
                      </span>
                      {/* Verification badge on profile image */}
                      {displayProfile.verification.email && displayProfile.verification.phone && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1.5 border-2 border-white shadow-md"
                        >
                          <FiCheckCircle size={16} />
                        </motion.div>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute bottom-0 right-0 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                    >
                      <FiCamera size={14} />
                    </motion.button>
                  </motion.div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {displayProfile.name}
                    </h1>
                    {/* Verification Status Indicator */}
                    <div className="flex items-center gap-2">
                      {displayProfile.verification.email && displayProfile.verification.phone ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200"
                        >
                          <FiCheckCircle size={14} className="text-blue-600" />
                          <span>Fully Verified</span>
                        </motion.div>
                      ) : displayProfile.verification.email || displayProfile.verification.phone ? (
                        <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-sm font-medium border border-yellow-200">
                          <FiAlertCircle size={14} />
                          <span>Partially Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium border border-red-200">
                          <FiAlertCircle size={14} />
                          <span>Verification Required</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3 flex items-center gap-2">
                    <FiBriefcase size={16} />
                    {displayProfile.jobTitle} • {displayProfile.company}
                  </p>
                  
                  {/* Contact Info with Verification Status */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <FiMail size={16} className="text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{displayProfile.email}</span>
                      </div>
                      <div className="flex items-center">
                        {displayProfile.verification.email ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1.5 text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-full"
                          >
                            <FiCheckCircle size={12} />
                            <span className="hidden sm:inline">Verified</span>
                          </motion.div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleVerificationRequest('email')}
                              disabled={displayProfile.verification.emailVerificationSent}
                              className={`flex items-center gap-1 text-xs ${displayProfile.verification.emailVerificationSent ? 'text-orange-600' : 'text-red-600 hover:text-red-700 hover:underline'}`}
                            >
                              {displayProfile.verification.emailVerificationSent ? (
                                <>
                                  <FiRefreshCw className="animate-spin" size={12} />
                                  <span className="hidden sm:inline">Verification Sent</span>
                                </>
                              ) : (
                                <>
                                  <FiAlertCircle size={12} />
                                  <span className="hidden sm:inline">Not Verified</span>
                                </>
                              )}
                            </button>
                            {resendTimer.email > 0 && (
                              <span className="text-xs text-gray-500 ml-1">
                                ({resendTimer.email}s)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <FiPhone size={16} className="text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{displayProfile.phone}</span>
                      </div>
                      <div className="flex items-center">
                        {displayProfile.verification.phone ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1.5 text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-full"
                          >
                            <FiCheckCircle size={12} />
                            <span className="hidden sm:inline">Verified</span>
                          </motion.div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleVerificationRequest('phone')}
                              disabled={displayProfile.verification.phoneVerificationSent}
                              className={`flex items-center gap-1 text-xs ${displayProfile.verification.phoneVerificationSent ? 'text-orange-600' : 'text-red-600 hover:text-red-700 hover:underline'}`}
                            >
                              {displayProfile.verification.phoneVerificationSent ? (
                                <>
                                  <FiRefreshCw className="animate-spin" size={12} />
                                  <span className="hidden sm:inline">Verification Sent</span>
                                </>
                              ) : (
                                <>
                                  <FiAlertCircle size={12} />
                                  <span className="hidden sm:inline">Not Verified</span>
                                </>
                              )}
                            </button>
                            {resendTimer.phone > 0 && (
                              <span className="text-xs text-gray-500 ml-1">
                                ({resendTimer.phone}s)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <FiMapPin size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-700">{displayProfile.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full md:w-auto">
                  <AnimatePresence mode="wait">
                    {!isEditing ? (
                      <motion.button
                        key="edit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleEdit}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <FiEdit2 size={16} />
                        Edit Profile
                      </motion.button>
                    ) : (
                      <motion.div
                        key="actions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-2"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSave}
                          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
                        >
                          <FiSave size={16} />
                          Save
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCancel}
                          className="flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                          <FiX size={16} />
                          Cancel
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="text-gray-400">
                    {React.cloneElement(stat.icon, { size: 28 })}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Sidebar Tabs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                {tabs.map((tab, index) => (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ x: 4 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all mb-1 ${
                      activeTab === tab.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8"
                >
                  {activeTab === 'personal' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Personal Information</h2>
                        <p className="text-sm text-gray-500">Manage your personal details and contact information</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <InfoField
                          icon={<FiUser />}
                          label="Full Name"
                          value={isEditing ? tempProfile.name : profile.name}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('name', v)}
                        />
                        <InfoField
                          icon={<FiMail />}
                          label="Email Address"
                          value={isEditing ? tempProfile.email : profile.email}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('email', v)}
                          verificationStatus={displayProfile.verification.email}
                          verificationSent={displayProfile.verification.emailVerificationSent}
                          onVerify={() => handleVerificationRequest('email')}
                          resendTimer={resendTimer.email}
                        />
                        <InfoField
                          icon={<FiPhone />}
                          label="Phone Number"
                          value={isEditing ? tempProfile.phone : profile.phone}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('phone', v)}
                          verificationStatus={displayProfile.verification.phone}
                          verificationSent={displayProfile.verification.phoneVerificationSent}
                          onVerify={() => handleVerificationRequest('phone')}
                          resendTimer={resendTimer.phone}
                        />
                        <InfoField
                          icon={<FiMapPin />}
                          label="Location"
                          value={isEditing ? tempProfile.location : profile.location}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('location', v)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
                        {isEditing ? (
                          <textarea
                            value={tempProfile.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                            rows={4}
                          />
                        ) : (
                          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">{profile.bio}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'professional' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Professional Details</h2>
                        <p className="text-sm text-gray-500">Your work information and employment details</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <InfoField
                          icon={<FiBriefcase />}
                          label="Job Title"
                          value={isEditing ? tempProfile.jobTitle : profile.jobTitle}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('jobTitle', v)}
                        />
                        <InfoField
                          icon={<FiBriefcase />}
                          label="Company"
                          value={isEditing ? tempProfile.company : profile.company}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('company', v)}
                        />
                        <InfoField
                          icon={<FiBriefcase />}
                          label="Department"
                          value={isEditing ? tempProfile.department : profile.department}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('department', v)}
                        />
                        <InfoField
                          icon={<FiAward />}
                          label="Employee ID"
                          value={isEditing ? tempProfile.employeeId : profile.employeeId}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('employeeId', v)}
                        />
                        <InfoField
                          icon={<FiCalendar />}
                          label="Join Date"
                          value={isEditing ? tempProfile.joinDate : profile.joinDate}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('joinDate', v)}
                        />
                        <InfoField
                          icon={<FiGlobe />}
                          label="Website"
                          value={isEditing ? tempProfile.website : profile.website}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('website', v)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill, idx) => (
                            <motion.span
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              whileHover={{ scale: 1.05 }}
                              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium border border-gray-200"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'documents' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Documents & Verification</h2>
                        <p className="text-sm text-gray-500">Upload and manage your identity documents</p>
                      </div>
                      
                      {/* Bank Details */}
                      <div className="border-b border-gray-200 pb-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <FiCreditCard />
                          Bank Details
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <InfoField
                            icon={<FiUser />}
                            label="Account Holder Name"
                            value={isEditing ? tempProfile.bankDetails.accountHolder : profile.bankDetails.accountHolder}
                            isEditing={isEditing}
                            onChange={(v) => handleBankDetailChange('accountHolder', v)}
                          />
                          <InfoField
                            icon={<FiCreditCard />}
                            label="Account Number"
                            value={isEditing ? tempProfile.bankDetails.accountNumber : profile.bankDetails.accountNumber}
                            isEditing={isEditing}
                            onChange={(v) => handleBankDetailChange('accountNumber', v)}
                            type="password"
                          />
                          <InfoField
                            icon={<FiBriefcase />}
                            label="Bank Name"
                            value={isEditing ? tempProfile.bankDetails.bankName : profile.bankDetails.bankName}
                            isEditing={isEditing}
                            onChange={(v) => handleBankDetailChange('bankName', v)}
                          />
                          <InfoField
                            icon={<FiFile />}
                            label="IFSC Code"
                            value={isEditing ? tempProfile.bankDetails.ifscCode : profile.bankDetails.ifscCode}
                            isEditing={isEditing}
                            onChange={(v) => handleBankDetailChange('ifscCode', v)}
                          />
                          <InfoField
                            icon={<FiMapPin />}
                            label="Branch"
                            value={isEditing ? tempProfile.bankDetails.branch : profile.bankDetails.branch}
                            isEditing={isEditing}
                            onChange={(v) => handleBankDetailChange('branch', v)}
                          />
                        </div>
                      </div>

                      {/* Document Uploads */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Upload Documents</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <DocumentUpload
                            title="Aadhar Card"
                            documentType="aadharCard"
                            document={isEditing ? tempProfile.documents.aadharCard : profile.documents.aadharCard}
                            isEditing={isEditing}
                            onUpload={handleFileUpload}
                            uploading={uploadingFile === 'aadharCard'}
                            uploadProgress={uploadProgress}
                          />
                          <DocumentUpload
                            title="PAN Card"
                            documentType="panCard"
                            document={isEditing ? tempProfile.documents.panCard : profile.documents.panCard}
                            isEditing={isEditing}
                            onUpload={handleFileUpload}
                            uploading={uploadingFile === 'panCard'}
                            uploadProgress={uploadProgress}
                          />
                          <DocumentUpload
                            title="Bank Statement"
                            documentType="bankStatement"
                            document={isEditing ? tempProfile.documents.bankStatement : profile.documents.bankStatement}
                            isEditing={isEditing}
                            onUpload={handleFileUpload}
                            uploading={uploadingFile === 'bankStatement'}
                            uploadProgress={uploadProgress}
                          />
                          <DocumentUpload
                            title="ID Proof"
                            documentType="idProof"
                            document={isEditing ? tempProfile.documents.idProof : profile.documents.idProof}
                            isEditing={isEditing}
                            onUpload={handleFileUpload}
                            uploading={uploadingFile === 'idProof'}
                            uploadProgress={uploadProgress}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Security Settings</h2>
                        <p className="text-sm text-gray-500">Manage your password and account security</p>
                      </div>
                      
                      {!showChangePassword ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">Password</h3>
                              <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setShowChangePassword(true)}
                              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              <FiLock size={16} />
                              Change Password
                            </motion.button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-4"
                        >
                          <h3 className="font-semibold text-gray-900">Change Password</h3>
                          
                          <div className="space-y-3">
                            <PasswordField
                              label="Current Password"
                              value={passwordData.currentPassword}
                              onChange={(v) => setPasswordData(prev => ({ ...prev, currentPassword: v }))}
                            />
                            <PasswordField
                              label="New Password"
                              value={passwordData.newPassword}
                              onChange={(v) => setPasswordData(prev => ({ ...prev, newPassword: v }))}
                            />
                            <PasswordField
                              label="Confirm New Password"
                              value={passwordData.confirmPassword}
                              onChange={(v) => setPasswordData(prev => ({ ...prev, confirmPassword: v }))}
                            />
                          </div>
                          
                          <div className="flex gap-3 pt-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handlePasswordChange}
                              className="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
                            >
                              Generate OTP & Change Password
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setShowChangePassword(false);
                                setPasswordData({
                                  currentPassword: '',
                                  newPassword: '',
                                  confirmPassword: ''
                                });
                              }}
                              className="bg-white text-gray-700 px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50"
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {activeTab === 'social' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Social Links</h2>
                        <p className="text-sm text-gray-500">Connect your social media accounts</p>
                      </div>
                      
                      <div className="space-y-4">
                        <InfoField
                          icon={<FiLinkedin />}
                          label="LinkedIn"
                          value={isEditing ? tempProfile.linkedin : profile.linkedin}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('linkedin', v)}
                        />
                        <InfoField
                          icon={<FiGithub />}
                          label="GitHub"
                          value={isEditing ? tempProfile.github : profile.github}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('github', v)}
                        />
                        <InfoField
                          icon={<FiTwitter />}
                          label="Twitter"
                          value={isEditing ? tempProfile.twitter : profile.twitter}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('twitter', v)}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'preferences' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Preferences</h2>
                        <p className="text-sm text-gray-500">Customize your account settings</p>
                      </div>
                      
                      <div className="space-y-4">
                        <InfoField
                          icon={<FiGlobe />}
                          label="Language"
                          value={isEditing ? tempProfile.language : profile.language}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('language', v)}
                        />
                        <InfoField
                          icon={<FiCalendar />}
                          label="Timezone"
                          value={isEditing ? tempProfile.timezone : profile.timezone}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('timezone', v)}
                        />
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
                        <div className="space-y-3">
                          <NotificationToggle label="Email notifications" />
                          <NotificationToggle label="Push notifications" />
                          <NotificationToggle label="Weekly digest" />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOTPModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowOTPModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verify OTP</h3>
              <p className="text-sm text-gray-500 mb-6">
                Enter the 6-digit OTP sent to your registered email/phone
              </p>
              
              <div className="mb-6">
                <div className="flex justify-between gap-2 mb-4">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={otpInput[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-0 transition-colors"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                
                <div className="text-center">
                  <button
                    onClick={() => {
                      const otp = Math.floor(100000 + Math.random() * 900000).toString();
                      setGeneratedOTP(otp);
                      console.log('🔐 New Password Change OTP:', otp);
                      alert(`New OTP has been generated.`);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={verifyOTP}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800"
                >
                  Verify & Change Password
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowOTPModal(false);
                    setOtpInput(['', '', '', '', '', '']);
                  }}
                  className="flex-1 bg-white text-gray-700 py-3 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Modal */}
      <AnimatePresence>
        {verificationModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setVerificationModal(prev => ({ ...prev, open: false }))}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Verify {verificationModal.type === 'email' ? 'Email' : 'Phone'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {verificationModal.type === 'email' 
                  ? `Enter the 6-digit verification code sent to ${tempProfile.email}`
                  : `Enter the 6-digit verification code sent to ${tempProfile.phone}`
                }
              </p>
              
              <div className="mb-6">
                <div className="flex justify-between gap-2 mb-4">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={verificationModal.inputCode[index] || ''}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 1);
                        const newInputCode = verificationModal.inputCode.split('');
                        newInputCode[index] = value;
                        setVerificationModal(prev => ({
                          ...prev,
                          inputCode: newInputCode.join('')
                        }));
                        
                        // Auto-focus next input
                        if (value && index < 5) {
                          const nextInput = document.getElementById(`verify-otp-${index + 1}`);
                          if (nextInput) nextInput.focus();
                        }
                      }}
                      id={`verify-otp-${index}`}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-0 transition-colors"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                
                <div className="text-center">
                  <button
                    onClick={() => handleResendCode(verificationModal.type)}
                    disabled={resendTimer[verificationModal.type] > 0}
                    className={`text-sm ${resendTimer[verificationModal.type] > 0 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800 hover:underline'}`}
                  >
                    {resendTimer[verificationModal.type] > 0
                      ? `Resend code in ${resendTimer[verificationModal.type]}s`
                      : 'Resend verification code'
                    }
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={verifyWithCode}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800"
                >
                  Verify {verificationModal.type === 'email' ? 'Email' : 'Phone'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setVerificationModal(prev => ({ ...prev, open: false }))}
                  className="flex-1 bg-white text-gray-700 py-3 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoField({ icon, label, value, isEditing, onChange, type = 'text', verificationStatus, verificationSent, onVerify, resendTimer }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <span className="text-gray-500">{icon}</span>
          {label}
        </label>
        {verificationStatus !== undefined && (
          <div className="flex items-center gap-1">
            {verificationStatus ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-full"
              >
                <FiCheckCircle size={12} />
                <span>Verified</span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={onVerify}
                  disabled={verificationSent}
                  className={`flex items-center gap-1 text-xs ${verificationSent ? 'text-orange-600' : 'text-red-600 hover:text-red-700 hover:underline'}`}
                >
                  {verificationSent ? (
                    <>
                      <FiRefreshCw className="animate-spin" size={12} />
                      <span>Verification Sent</span>
                    </>
                  ) : (
                    <>
                      <FiAlertCircle size={12} />
                      <span>Not Verified</span>
                    </>
                  )}
                </button>
                {resendTimer > 0 && (
                  <span className="text-xs text-gray-500">({resendTimer}s)</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {isEditing ? (
        <motion.input
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
        />
      ) : (
        <div className="bg-gray-50 px-4 py-2.5 rounded-lg text-gray-900 border border-gray-200">
          {type === 'password' ? '••••••••' : value}
        </div>
      )}
    </div>
  );
}

function PasswordField({ label, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  );
}

function DocumentUpload({ title, documentType, document, isEditing, onUpload, uploading, uploadProgress }) {
  const fileInputRef = React.useRef(null);
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(documentType, file);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{title}</label>
      
      {document ? (
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <FiFile className="text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{document.name}</p>
              <p className="text-xs text-gray-500">
                {Math.round(document.size / 1024)} KB • Uploaded {
                  new Date(document.uploadedAt).toLocaleDateString()
                }
              </p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Replace
            </button>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
          {uploading ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uploading...</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gray-900"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
              <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-sm text-gray-900 hover:text-gray-700 font-medium"
                >
                  Select File
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        disabled={!isEditing || uploading}
      />
    </div>
  );
}

function NotificationToggle({ label }) {
  const [enabled, setEnabled] = useState(true);
  
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setEnabled(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-gray-900' : 'bg-gray-300'
        }`}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
          style={{ left: enabled ? '28px' : '4px' }}
        />
      </motion.button>
    </div>
  );
}