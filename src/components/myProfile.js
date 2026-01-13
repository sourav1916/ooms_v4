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
  FiSearch
} from 'react-icons/fi';

// Mock Header Component
// function Header({ mobileMenuOpen, setMobileMenuOpen, isMinimized }) {
//   return (
//     <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
//       <div className={`flex items-center justify-between h-16 px-4 transition-all duration-300 ${
//         isMinimized ? 'lg:pl-20' : 'lg:pl-64'
//       }`}>
//         {/* Left side */}
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="lg:hidden text-gray-600 hover:text-gray-900"
//           >
//             <FiMenu size={24} />
//           </button>
          
//           <div className="hidden md:flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg w-96">
//             <FiSearch className="text-gray-400" size={18} />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="bg-transparent border-none outline-none w-full text-sm"
//             />
//           </div>
//         </div>

//         {/* Right side */}
//         <div className="flex items-center gap-4">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="relative text-gray-600 hover:text-gray-900"
//           >
//             <FiBell size={20} />
//             <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//           </motion.button>
          
//           <div className="flex items-center gap-3">
//             <div className="hidden sm:block text-right">
//               <p className="text-sm font-semibold text-gray-900">John Doe</p>
//               <p className="text-xs text-gray-500">john@example.com</p>
//             </div>
//             <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">
//               JD
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// Mock Sidebar Component
// function Sidebar({ mobileMenuOpen, setMobileMenuOpen, isMinimized, setIsMinimized }) {
//   const menuItems = [
//     { icon: <FiHome size={20} />, label: 'Dashboard', path: '/' },
//     { icon: <FiBarChart2 size={20} />, label: 'Analytics', path: '/analytics' },
//     { icon: <FiFileText size={20} />, label: 'Reports', path: '/reports' },
//     { icon: <FiUser size={20} />, label: 'My Profile', path: '/profile', active: true },
//     { icon: <FiSettings size={20} />, label: 'Settings', path: '/settings' },
//   ];

//   return (
//     <>
//       {/* Mobile Overlay */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setMobileMenuOpen(false)}
//             className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           />
//         )}
//       </AnimatePresence>

//       {/* Sidebar */}
//       <motion.aside
//         initial={false}
//         animate={{
//           width: isMinimized ? '5rem' : '16rem',
//           x: mobileMenuOpen ? 0 : '-100%'
//         }}
//         transition={{ duration: 0.3 }}
//         className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 lg:translate-x-0`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Logo */}
//           <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
//             <motion.div
//               animate={{ opacity: isMinimized ? 0 : 1 }}
//               className="flex items-center gap-2"
//             >
//               <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
//                 W
//               </div>
//               {!isMinimized && <span className="font-bold text-gray-900">WICHAT</span>}
//             </motion.div>
            
//             <button
//               onClick={() => setIsMinimized(!isMinimized)}
//               className="hidden lg:block text-gray-500 hover:text-gray-900"
//             >
//               {isMinimized ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
//             </button>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//             {menuItems.map((item, index) => (
//               <motion.button
//                 key={index}
//                 whileHover={{ x: 4 }}
//                 className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
//                   item.active
//                     ? 'bg-gray-900 text-white'
//                     : 'text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 <span className="flex-shrink-0">{item.icon}</span>
//                 <motion.span
//                   animate={{ opacity: isMinimized ? 0 : 1 }}
//                   className="font-medium whitespace-nowrap"
//                 >
//                   {!isMinimized && item.label}
//                 </motion.span>
//               </motion.button>
//             ))}
//           </nav>

//           {/* Logout */}
//           <div className="p-3 border-t border-gray-200">
//             <motion.button
//               whileHover={{ x: 4 }}
//               className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
//             >
//               <FiLogOut size={20} />
//               <motion.span
//                 animate={{ opacity: isMinimized ? 0 : 1 }}
//                 className="font-medium"
//               >
//                 {!isMinimized && 'Logout'}
//               </motion.span>
//             </motion.button>
//           </div>
//         </div>
//       </motion.aside>
//     </>
//   );
// }

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
    timezone: 'EST (UTC-5)'
  });

  const [tempProfile, setTempProfile] = useState(profile);

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

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <FiUser /> },
    { id: 'professional', label: 'Professional', icon: <FiBriefcase /> },
    { id: 'social', label: 'Social Links', icon: <FiGlobe /> },
    { id: 'preferences', label: 'Preferences', icon: <FiSettings /> }
  ];

  const stats = [
    { label: 'Projects', value: '24', icon: <FiBriefcase /> },
    { label: 'Tasks Completed', value: '156', icon: <FiAward /> },
    { label: 'Team Members', value: '8', icon: <FiUser /> }
  ];

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
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center">
                      <span className="text-4xl font-semibold text-gray-700">
                        {profile.name.charAt(0)}
                      </span>
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
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {profile.name}
                  </h1>
                  <p className="text-gray-600 mb-2 flex items-center gap-2">
                    <FiBriefcase size={16} />
                    {profile.jobTitle} • {profile.company}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FiMapPin size={14} />
                    {profile.location}
                  </p>
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
                        />
                        <InfoField
                          icon={<FiPhone />}
                          label="Phone Number"
                          value={isEditing ? tempProfile.phone : profile.phone}
                          isEditing={isEditing}
                          onChange={(v) => handleChange('phone', v)}
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
    </div>
  );
}

function InfoField({ icon, label, value, isEditing, onChange }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <span className="text-gray-500">{icon}</span>
        {label}
      </label>
      {isEditing ? (
        <motion.input
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
        />
      ) : (
        <div className="bg-gray-50 px-4 py-2.5 rounded-lg text-gray-900 border border-gray-200">
          {value}
        </div>
      )}
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