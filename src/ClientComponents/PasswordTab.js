import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiKey, FiTrash2, FiX, FiEye, FiEyeOff, FiCopy, FiShield, FiLock, FiGlobe, FiEdit2, FiMoreVertical } from 'react-icons/fi';

const PasswordTab = () => {
    const [passwords, setPasswords] = useState([
        { id: 1, platform: "Client Portal", username: "venkatesh_r", password: "password123", lastChanged: "2024-01-15", showPassword: false, category: "Finance", strength: "Medium", description: "Main client management portal", group: "Business" },
        { id: 2, platform: "GST Portal", username: "venkatesh_gst", password: "gstpass456", lastChanged: "2024-01-10", showPassword: false, category: "Government", strength: "Strong", description: "GST filing and compliance", group: "Government" },
        { id: 3, platform: "Income Tax Portal", username: "venkatesh_it", password: "itpass789", lastChanged: "2024-01-05", showPassword: false, category: "Government", strength: "Weak", description: "Income tax filing system", group: "Government" }
    ]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPassword, setSelectedPassword] = useState(null);
    const [copiedItem, setCopiedItem] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);

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
        setActiveMenu(null);
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

    const getGroupColor = (group) => {
        switch(group) {
            case 'Business': return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700';
            case 'Government': return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700';
            case 'Finance': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700';
            default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700';
        }
    };

    const toggleMenu = (id) => {
        setActiveMenu(activeMenu === id ? null : id);
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

            {/* Passwords Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
                    <div className="col-span-1 text-center pl-8">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">SL No</span>
                    </div>
                    <div className="col-span-2 text-center">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Firms</span>
                    </div>
                    <div className="col-span-2 text-center">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</span>
                    </div>
                    <div className="col-span-2 text-center">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Password</span>
                    </div>
                    <div className="col-span-3 text-center">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</span>
                    </div>
                    <div className="col-span-1 text-center">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Group</span>
                    </div>
                    <div className="col-span-1 text-center pr-8">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</span>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
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
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50 transition-all duration-200 relative"
                            >
                                {/* SL No Column */}
                                <div className="col-span-1 flex items-center justify-center pl-8">
                                    <span className="font-bold text-gray-500 text-sm">{pwd.id}</span>
                                </div>

                                {/* Firms Column */}
                                <div className="col-span-2 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="font-semibold text-gray-900">{pwd.platform}</span>
                                        <span className={`block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${getStrengthColor(pwd.strength)}`}>
                                            {pwd.strength}
                                        </span>
                                    </div>
                                </div>

                                {/* Username Column */}
                                <div className="col-span-2 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="font-medium text-gray-900 block">{pwd.username}</span>
                                        <div className="mt-2">
                                            <motion.button
                                                onClick={() => copyToClipboard(pwd.username, 'username', pwd.id)}
                                                className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:shadow-sm rounded-lg text-sm font-medium transition-all"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Copy
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>

                                {/* Password Column */}
                                <div className="col-span-2 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="px-3 py-2 bg-gray-100 rounded-lg">
                                            <span className="font-mono text-gray-900">
                                                {pwd.showPassword ? pwd.password : '••••••••••••'}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 mt-2 justify-center">
                                            <motion.button
                                                onClick={() => togglePasswordVisibility(pwd.id)}
                                                className="px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:shadow-sm rounded-lg text-sm font-medium"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {pwd.showPassword ? 'Hide' : 'Show'}
                                            </motion.button>
                                            <motion.button
                                                onClick={() => copyToClipboard(pwd.password, 'password', pwd.id)}
                                                className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:shadow-sm rounded-lg text-sm font-medium"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Copy
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>

                                {/* Description Column */}
                                <div className="col-span-3 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-gray-800">{pwd.description}</p>
                                        <p className="text-sm text-gray-500 mt-1">Last changed: {pwd.lastChanged}</p>
                                    </div>
                                </div>

                                {/* Group Column */}
                                <div className="col-span-1 flex items-center justify-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getGroupColor(pwd.group)}`}>
                                        {pwd.group}
                                    </span>
                                </div>

                                {/* Actions Column */}
                                <div className="col-span-1 flex items-center justify-center pr-8 relative">
                                    <motion.button
                                        onClick={() => toggleMenu(pwd.id)}
                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FiMoreVertical className="w-5 h-5" />
                                    </motion.button>

                                    {/* Dropdown Menu */}
                                    {activeMenu === pwd.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute right-12 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[140px] z-10"
                                        >
                                            <button
                                                onClick={() => {
                                                    // Add edit functionality here
                                                    setActiveMenu(null);
                                                }}
                                                className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(pwd)}
                                                className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
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