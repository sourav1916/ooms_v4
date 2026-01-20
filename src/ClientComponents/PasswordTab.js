import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiKey, FiTrash2, FiX, FiEye, FiEyeOff, FiCopy, FiShield, FiLock, FiGlobe } from 'react-icons/fi';

const PasswordTab = () => {
    const [passwords, setPasswords] = useState([
        { id: 1, platform: "Client Portal", username: "venkatesh_r", password: "password123", lastChanged: "2024-01-15", showPassword: false, category: "Finance", strength: "Medium" },
        { id: 2, platform: "GST Portal", username: "venkatesh_gst", password: "gstpass456", lastChanged: "2024-01-10", showPassword: false, category: "Government", strength: "Strong" },
        { id: 3, platform: "Income Tax Portal", username: "venkatesh_it", password: "itpass789", lastChanged: "2024-01-05", showPassword: false, category: "Government", strength: "Weak" }
    ]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPassword, setSelectedPassword] = useState(null);
    const [copiedItem, setCopiedItem] = useState(null);

    const togglePasswordVisibility = (id) => {
        setPasswords(passwords.map(pwd => 
            pwd.id === id ? { ...pwd, showPassword: !pwd.showPassword } : pwd
        ));
    };

    const copyToClipboard = (text, type, id) => {
        navigator.clipboard.writeText(text);
        setCopiedItem({ type, id });
        setTimeout(() => setCopiedItem(null), 2000);
    };

    const openDeleteModal = (password) => {
        setSelectedPassword(password);
        setShowDeleteModal(true);
    };

    const deletePassword = () => {
        setPasswords(passwords.filter(pwd => pwd.id !== selectedPassword.id));
        setShowDeleteModal(false);
    };

    const getStrengthColor = (strength) => {
        switch(strength) {
            case 'Strong': return 'text-green-600 bg-green-100';
            case 'Medium': return 'text-yellow-600 bg-yellow-100';
            case 'Weak': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getPlatformIcon = (platform) => {
        if (platform.includes('Portal')) return <FiGlobe className="w-5 h-5" />;
        if (platform.includes('GST') || platform.includes('Tax')) return <FiShield className="w-5 h-5" />;
        return <FiLock className="w-5 h-5" />;
    };

    const getCategoryColor = (category) => {
        switch(category) {
            case 'Finance': return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200';
            case 'Government': return 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200';
            case 'Business': return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
            default: return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-xl p-6"
        >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                        Password Management
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">Secure access credentials for all client portals</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl font-semibold text-sm">
                        {passwords.length} Passwords Stored
                    </div>
                    <motion.button
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        + Add Password
                    </motion.button>
                </div>
            </div>

            {/* Security Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Strong Passwords</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {passwords.filter(p => p.strength === 'Strong').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                            <FiShield className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center">
                            <FiKey className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Security Score</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">85%</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                            <FiLock className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Passwords List */}
            <div className="space-y-4">
                {passwords.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                            <FiKey className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No passwords stored</h3>
                        <p className="text-gray-600">Add your first password to get started</p>
                    </div>
                ) : (
                    passwords.map((pwd, index) => (
                        <motion.div
                            key={pwd.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-6 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md ${getCategoryColor(pwd.category)}`}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white">
                                        {getPlatformIcon(pwd.platform)}
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-lg font-bold text-gray-900">{pwd.platform}</h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStrengthColor(pwd.strength)}`}>
                                                {pwd.strength}
                                            </span>
                                            <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-semibold">
                                                {pwd.category}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</label>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">{pwd.username}</span>
                                                    <motion.button
                                                        onClick={() => copyToClipboard(pwd.username, 'username', pwd.id)}
                                                        className="p-1.5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:shadow-sm transition-all duration-200"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <FiCopy className={`w-3.5 h-3.5 ${copiedItem?.type === 'username' && copiedItem?.id === pwd.id ? 'text-green-600' : 'text-gray-500'}`} />
                                                    </motion.button>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-xl">
                                                        <span className="font-mono font-medium text-gray-900">
                                                            {pwd.showPassword ? pwd.password : '••••••••••••'}
                                                        </span>
                                                        {copiedItem?.type === 'password' && copiedItem?.id === pwd.id && (
                                                            <span className="text-xs text-green-600 font-semibold animate-pulse">Copied!</span>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <motion.button
                                                            onClick={() => togglePasswordVisibility(pwd.id)}
                                                            className="p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:shadow-md rounded-xl transition-all duration-200"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            {pwd.showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => copyToClipboard(pwd.password, 'password', pwd.id)}
                                                            className="p-2.5 bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 hover:shadow-md rounded-xl transition-all duration-200"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <FiCopy className="w-4 h-4" />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FiKey className="w-4 h-4" />
                                                <span>Last changed: <span className="font-semibold text-gray-900">{pwd.lastChanged}</span></span>
                                            </div>
                                            <div className="text-xs px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full">
                                                30 days remaining
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        onClick={() => openDeleteModal(pwd)}
                                        className="p-3 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:shadow-md rounded-xl transition-all duration-200"
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Security Tips */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                        <FiShield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Security Recommendations</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Change passwords every 90 days for optimal security</li>
                            <li>• Use a mix of uppercase, lowercase, numbers, and special characters</li>
                            <li>• Never share passwords via email or unsecured channels</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedPassword && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <FiTrash2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Delete Password</h2>
                                    <p className="text-red-100 text-sm mt-1">This action is irreversible</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                                    <FiKey className="w-10 h-10 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                                    <p className="text-gray-600 mt-2">
                                        You're about to permanently delete the password for 
                                        <span className="font-bold text-red-600"> {selectedPassword.platform}</span>. 
                                        This credential will no longer be accessible.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="border-t px-8 py-6 bg-gray-50 flex justify-center gap-4">
                            <motion.button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-3 text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                onClick={deletePassword}
                                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Delete Password
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default PasswordTab;