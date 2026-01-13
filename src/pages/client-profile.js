import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, Sidebar } from '../components/header';
import {
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
    FiBriefcase,
    FiKey,
    FiClipboard,
    FiFileText,
    FiDollarSign,
    FiFile,
    FiSettings,
    FiEdit,
    FiArchive,
    FiMessageSquare,
    FiRepeat,
    FiCheckSquare,
    FiPlus,
    FiTrash2,
    FiEye,
    FiDownload,
    FiSearch,
    FiCheck,
    FiX,
    FiUpload,
    FiSend,
    FiHome,
    FiUserCheck,
    FiCreditCard,
    FiClock
} from 'react-icons/fi';

// Common Modal Components
const EditModal = ({ isOpen, onClose, field, value, onSave, type = 'text' }) => {
    const [inputValue, setInputValue] = useState(value);

    const handleSave = () => {
        onSave(inputValue);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Edit {field}</h2>
                        <button onClick={onClose} className="text-white hover:text-blue-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field}
                    </label>
                    {type === 'textarea' ? (
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        />
                    ) : (
                        <input
                            type={type}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    )}
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{title}</h2>
                        <button onClick={onClose} className="text-white hover:text-red-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <p className="text-gray-700">{message}</p>
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper Component for Detail Rows
const DetailRow = ({ label, value, editable = false, onEdit }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100">
        <span className="font-medium text-gray-700 text-sm">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-gray-900 font-medium">{value}</span>
            {editable && (
                <motion.button
                    onClick={onEdit}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FiEdit className="w-4 h-4" />
                </motion.button>
            )}
        </div>
    </div>
);

// Individual Tab Components
const BasicDetailsTab = ({ clientData, onEdit }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
        >
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Basic Details</h3>
                <p className="text-sm text-gray-600">Personal and address information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FiUserCheck className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Personal Information</h4>
                    </div>
                    
                    <div className="space-y-3">
                        <DetailRow 
                            label="Full Name" 
                            value={clientData.name} 
                            editable 
                            onEdit={() => onEdit('name', clientData.name)} 
                        />
                        <DetailRow 
                            label="Email" 
                            value={clientData.email} 
                            editable 
                            onEdit={() => onEdit('email', clientData.email)} 
                        />
                        <DetailRow 
                            label="Mobile" 
                            value={clientData.mobile} 
                            editable 
                            onEdit={() => onEdit('mobile', clientData.mobile)} 
                        />
                        <DetailRow 
                            label="Date of Birth" 
                            value={clientData.dob} 
                            editable 
                            onEdit={() => onEdit('dob', clientData.dob)} 
                        />
                        <DetailRow 
                            label="Father's Name" 
                            value={clientData.fatherName} 
                            editable 
                            onEdit={() => onEdit('fatherName', clientData.fatherName)} 
                        />
                        <DetailRow 
                            label="Gender" 
                            value={clientData.gender} 
                            editable 
                            onEdit={() => onEdit('gender', clientData.gender)} 
                        />
                    </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FiHome className="w-5 h-5 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Address Information</h4>
                    </div>
                    
                    <div className="space-y-3">
                        <DetailRow 
                            label="Address Line 1" 
                            value={clientData.address1} 
                            editable 
                            onEdit={() => onEdit('address1', clientData.address1)} 
                        />
                        <DetailRow 
                            label="Address Line 2" 
                            value={clientData.address2} 
                            editable 
                            onEdit={() => onEdit('address2', clientData.address2)} 
                        />
                        <DetailRow 
                            label="Town/City" 
                            value={clientData.town} 
                            editable 
                            onEdit={() => onEdit('town', clientData.town)} 
                        />
                        <DetailRow 
                            label="District" 
                            value={clientData.district} 
                            editable 
                            onEdit={() => onEdit('district', clientData.district)} 
                        />
                        <DetailRow 
                            label="State" 
                            value={clientData.state} 
                            editable 
                            onEdit={() => onEdit('state', clientData.state)} 
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const FirmsTab = () => {
    const [firms, setFirms] = useState([
        { id: 1, name: "VENKATESH R AND ASSOCIATES", type: "Proprietorship", pan: "ABCPR1234F", gst: "29ABCPR1234F1Z5", status: "Active" },
        { id: 2, name: "RAMAPPA ENTERPRISES", type: "Partnership", pan: "DEFPR5678G", gst: "29DEFPR5678G1Z6", status: "Active" },
        { id: 3, name: "BANASHANKARI TRADERS", type: "LLP", pan: "GHIPR9012H", gst: "29GHIPR9012H1Z7", status: "Inactive" }
    ]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedFirm, setSelectedFirm] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFirms = firms.filter(firm =>
        firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firm.pan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addFirm = (newFirm) => {
        const firm = {
            id: firms.length + 1,
            ...newFirm,
            status: 'Active'
        };
        setFirms([...firms, firm]);
    };

    const editFirm = (updatedFirm) => {
        setFirms(firms.map(firm => 
            firm.id === selectedFirm.id ? { ...firm, ...updatedFirm } : firm
        ));
        setShowEditModal(false);
    };

    const deleteFirm = () => {
        setFirms(firms.filter(firm => firm.id !== selectedFirm.id));
        setShowDeleteModal(false);
    };

    const toggleStatus = (id) => {
        setFirms(firms.map(firm => 
            firm.id === id ? { ...firm, status: firm.status === 'Active' ? 'Inactive' : 'Active' } : firm
        ));
    };

    const openEditModal = (firm) => {
        setSelectedFirm(firm);
        setShowEditModal(true);
    };

    const openDeleteModal = (firm) => {
        setSelectedFirm(firm);
        setShowDeleteModal(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Business Firms</h3>
                    <p className="text-sm text-gray-600">Manage client's business entities</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search firms..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <motion.button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiPlus className="w-4 h-4" />
                        Add Firm
                    </motion.button>
                </div>
            </div>

            <div className="space-y-4">
                {filteredFirms.map((firm, index) => (
                    <motion.div
                        key={firm.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FiBriefcase className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{firm.name}</div>
                                    <div className="text-sm text-gray-600">
                                        {firm.type} • PAN: {firm.pan} {firm.gst && `• GST: ${firm.gst}`}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <motion.button
                                onClick={() => toggleStatus(firm.id)}
                                className={`px-3 py-1 rounded text-xs font-medium ${
                                    firm.status === 'Active' 
                                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {firm.status}
                            </motion.button>
                            <motion.button
                                onClick={() => openEditModal(firm)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiEdit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                onClick={() => openDeleteModal(firm)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiTrash2 className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Add Firm Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">Add New Firm</h2>
                                <button onClick={() => setShowAddModal(false)} className="text-white hover:text-blue-200">
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter firm name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="Proprietorship">Proprietorship</option>
                                    <option value="Partnership">Partnership</option>
                                    <option value="LLP">LLP</option>
                                    <option value="Private Limited">Private Limited</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter PAN number"
                                />
                            </div>
                        </div>
                        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={() => { addFirm({}); setShowAddModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Add Firm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

const PasswordTab = () => {
    const [passwords, setPasswords] = useState([
        { id: 1, platform: "Client Portal", username: "venkatesh_r", password: "password123", lastChanged: "2024-01-15", showPassword: false },
        { id: 2, platform: "GST Portal", username: "venkatesh_gst", password: "gstpass456", lastChanged: "2024-01-10", showPassword: false },
        { id: 3, platform: "Income Tax Portal", username: "venkatesh_it", password: "itpass789", lastChanged: "2024-01-05", showPassword: false }
    ]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPassword, setSelectedPassword] = useState(null);

    const togglePasswordVisibility = (id) => {
        setPasswords(passwords.map(pwd => 
            pwd.id === id ? { ...pwd, showPassword: !pwd.showPassword } : pwd
        ));
    };

    const openDeleteModal = (password) => {
        setSelectedPassword(password);
        setShowDeleteModal(true);
    };

    const deletePassword = () => {
        setPasswords(passwords.filter(pwd => pwd.id !== selectedPassword.id));
        setShowDeleteModal(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
        >
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Password Management</h3>
                <p className="text-sm text-gray-600">Secure access to various portals</p>
            </div>

            <div className="space-y-4">
                {passwords.map((pwd, index) => (
                    <motion.div
                        key={pwd.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FiKey className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{pwd.platform}</div>
                                    <div className="text-sm text-gray-600">
                                        Username: {pwd.username} • 
                                        Password: {pwd.showPassword ? pwd.password : '••••••••'}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Last changed: {pwd.lastChanged}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    onClick={() => togglePasswordVisibility(pwd.id)}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {pwd.showPassword ? 'Hide' : 'Show'}
                                </motion.button>
                                <motion.button
                                    onClick={() => openDeleteModal(pwd)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {showDeleteModal && (
                <DeleteModal 
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={deletePassword}
                    title="Delete Password"
                    message={`Are you sure you want to delete the password for "${selectedPassword?.platform}"?`}
                />
            )}
        </motion.div>
    );
};

const QuotationTab = () => {
    const [quotations, setQuotations] = useState([
        { id: 1, quoteNo: "QTN-001", date: "2024-01-15", service: "GST Filing - Quarterly", amount: "2500", status: "Accepted", description: "Quarterly GST return filing for Q3" },
        { id: 2, quoteNo: "QTN-002", date: "2024-01-10", service: "Income Tax Return", amount: "3000", status: "Pending", description: "Income tax return filing for FY 2023-24" },
        { id: 3, quoteNo: "QTN-003", date: "2024-01-05", service: "Company Registration", amount: "8000", status: "Rejected", description: "Private limited company registration" }
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Quotation History</h3>
                    <p className="text-sm text-gray-600">Client service proposals and approvals</p>
                </div>
                <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiPlus className="w-4 h-4" />
                    New Quotation
                </motion.button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-gray-900">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Quote No</th>
                            <th className="px-4 py-3 font-semibold">Date</th>
                            <th className="px-4 py-3 font-semibold">Service</th>
                            <th className="px-4 py-3 font-semibold">Amount</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotations.map((quote, index) => (
                            <motion.tr
                                key={quote.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td className="px-4 py-3 font-medium">{quote.quoteNo}</td>
                                <td className="px-4 py-3">{quote.date}</td>
                                <td className="px-4 py-3">{quote.service}</td>
                                <td className="px-4 py-3 font-semibold">₹{quote.amount}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(quote.status)}`}>
                                        {quote.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <motion.button
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FiEdit className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FiDownload className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

const TaskTab = () => {
    const [tasks, setTasks] = useState([
        { id: 1, task: "GST Return Filing", dueDate: "2024-01-31", status: "Pending", assigned: "Rajesh", priority: "High", description: "File GSTR-1 and GSTR-3B for Q3" },
        { id: 2, task: "TDS Payment", dueDate: "2024-01-20", status: "In Progress", assigned: "Priya", priority: "Medium", description: "Quarterly TDS payment and return" },
        { id: 3, task: "Audit Report", dueDate: "2024-02-15", status: "Completed", assigned: "Ramesh", priority: "Low", description: "Annual financial audit" }
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Active Tasks</h3>
                    <p className="text-sm text-gray-600">Track and manage client tasks</p>
                </div>
                <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiPlus className="w-4 h-4" />
                    New Task
                </motion.button>
            </div>

            <div className="space-y-4">
                {tasks.map((task, index) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="font-semibold text-gray-900">{task.task}</div>
                                <div className="text-sm text-gray-600">
                                    Assigned to: {task.assigned} • Due: {task.dueDate}
                                </div>
                                {task.description && (
                                    <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                                <motion.button
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiEdit className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

const BillingTab = () => {
    const [invoices, setInvoices] = useState([
        { id: 1, invoice: "INV-001", date: "2024-01-15", amount: "15000", status: "Paid", dueDate: "2024-01-30", description: "Q3 Professional Services" },
        { id: 2, invoice: "INV-002", date: "2024-01-10", amount: "8500", status: "Pending", dueDate: "2024-01-25", description: "Tax Consultation Services" },
        { id: 3, invoice: "INV-003", date: "2024-01-05", amount: "12000", status: "Paid", dueDate: "2024-01-20", description: "Annual Compliance Fees" }
    ]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
                    <p className="text-sm text-gray-600">Invoice and payment tracking</p>
                </div>
                <div className="flex gap-2">
                    <motion.button
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiPlus className="w-4 h-4" />
                        New Invoice
                    </motion.button>
                    <motion.button
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiDownload className="w-4 h-4" />
                        Export
                    </motion.button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-gray-900">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Invoice No</th>
                            <th className="px-4 py-3 font-semibold">Date</th>
                            <th className="px-4 py-3 font-semibold">Due Date</th>
                            <th className="px-4 py-3 font-semibold">Amount</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv, index) => (
                            <motion.tr
                                key={inv.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td className="px-4 py-3 font-medium">{inv.invoice}</td>
                                <td className="px-4 py-3">{inv.date}</td>
                                <td className="px-4 py-3">{inv.dueDate}</td>
                                <td className="px-4 py-3 font-semibold">₹{inv.amount}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        inv.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <motion.button
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FiEye className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FiDownload className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

const LedgerTab = () => {
    const [ledger, setLedger] = useState({
        period: "01/01/2024 - 31/01/2024",
        openingBalance: "0.00",
        closingBalance: "6500.00",
        entries: [
            { id: 1, date: "2024-01-15", description: "Consulting Fees", debit: "15000", credit: "-", balance: "15000" },
            { id: 2, date: "2024-01-10", description: "Office Expenses", debit: "-", credit: "8500", balance: "6500" },
            { id: 3, date: "2024-01-05", description: "Service Charges", debit: "12000", credit: "-", balance: "18500" }
        ]
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Financial Ledger</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">Period: {ledger.period}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <motion.button
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiDownload className="w-4 h-4" />
                        Export
                    </motion.button>
                    <motion.button
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiFileText className="w-4 h-4" />
                        Report
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium">Opening Balance</div>
                    <div className="text-2xl font-bold text-blue-700">₹{ledger.openingBalance}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-sm text-green-600 font-medium">Closing Balance</div>
                    <div className="text-2xl font-bold text-green-700">₹{ledger.closingBalance}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-sm text-purple-600 font-medium">Total Transactions</div>
                    <div className="text-2xl font-bold text-purple-700">{ledger.entries.length}</div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-gray-900">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Date</th>
                            <th className="px-4 py-3 font-semibold">Description</th>
                            <th className="px-4 py-3 font-semibold">Debit</th>
                            <th className="px-4 py-3 font-semibold">Credit</th>
                            <th className="px-4 py-3 font-semibold">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ledger.entries.map((entry, index) => (
                            <motion.tr
                                key={entry.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td className="px-4 py-3">{entry.date}</td>
                                <td className="px-4 py-3">{entry.description}</td>
                                <td className="px-4 py-3 font-medium">{entry.debit === '-' ? '-' : `₹${entry.debit}`}</td>
                                <td className="px-4 py-3 font-medium">{entry.credit === '-' ? '-' : `₹${entry.credit}`}</td>
                                <td className="px-4 py-3 font-semibold">₹{entry.balance}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

const NotesTab = () => {
    const [notes, setNotes] = useState([
        { id: 1, date: "2024-01-15", note: "Client requested GST filing for Q3. Documents submitted.", author: "Rajesh", category: "Compliance" },
        { id: 2, date: "2024-01-10", note: "Discussion about tax planning for FY 2024-25.", author: "Priya", category: "Advisory" },
        { id: 3, date: "2024-01-05", note: "New business registration completed successfully.", author: "Ramesh", category: "Registration" }
    ]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

    const deleteNote = () => {
        setNotes(notes.filter(note => note.id !== selectedNote.id));
        setShowDeleteModal(false);
    };

    const openDeleteModal = (note) => {
        setSelectedNote(note);
        setShowDeleteModal(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
        >
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Client Notes</h3>
                <p className="text-sm text-gray-600">Important notes and communication records</p>
            </div>

            <div className="mb-6">
                <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiPlus className="w-4 h-4" />
                    Add Note
                </motion.button>
            </div>

            <div className="space-y-4">
                {notes.map((note, index) => (
                    <motion.div
                        key={note.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-gray-900">{note.note}</div>
                            <div className="flex gap-2">
                                <motion.button
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiEdit className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    onClick={() => openDeleteModal(note)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>By {note.author}</span>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    {note.category}
                                </span>
                                <span>{note.date}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {showDeleteModal && (
                <DeleteModal 
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={deleteNote}
                    title="Delete Note"
                    message="Are you sure you want to delete this note? This action cannot be undone."
                />
            )}
        </motion.div>
    );
};

const RecurringTab = () => {
    const [services, setServices] = useState([
        { id: 1, service: "Monthly GST Filing", frequency: "Monthly", nextDue: "2024-02-10", amount: "2000", status: "Active", description: "Monthly GST return filing" },
        { id: 2, service: "Quarterly TDS", frequency: "Quarterly", nextDue: "2024-03-31", amount: "5000", status: "Active", description: "Quarterly TDS payment and return" },
        { id: 3, service: "Annual Compliance", frequency: "Yearly", nextDue: "2024-12-31", amount: "15000", status: "Inactive", description: "Annual business compliance" }
    ]);

    const toggleService = (id) => {
        setServices(services.map(service => 
            service.id === id ? { ...service, status: service.status === 'Active' ? 'Inactive' : 'Active' } : service
        ));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recurring Services</h3>
                    <p className="text-sm text-gray-600">Automated recurring service management</p>
                </div>
                <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiPlus className="w-4 h-4" />
                    Add Service
                </motion.button>
            </div>

            <div className="space-y-4">
                {services.map((service, index) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="font-semibold text-gray-900">{service.service}</div>
                                <div className="text-sm text-gray-600">
                                    Frequency: {service.frequency} • Next Due: {service.nextDue}
                                </div>
                                {service.description && (
                                    <div className="text-sm text-gray-500 mt-1">{service.description}</div>
                                )}
                                <div className="font-medium text-gray-900 mt-1">₹{service.amount}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <motion.button
                                    onClick={() => toggleService(service.id)}
                                    className={`px-3 py-1 rounded text-xs font-medium ${
                                        service.status === 'Active' 
                                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {service.status}
                                </motion.button>
                                <motion.button
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiEdit className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

const DocumentsTab = () => {
    const [documents, setDocuments] = useState([
        { id: 1, name: "PAN Card", type: "Identity", uploaded: "2024-01-15", size: "2.1 MB", category: "KYC" },
        { id: 2, name: "Aadhaar Card", type: "Identity", uploaded: "2024-01-15", size: "1.8 MB", category: "KYC" },
        { id: 3, name: "Bank Statement", type: "Financial", uploaded: "2024-01-10", size: "3.2 MB", category: "Financial" }
    ]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Document Repository</h3>
                    <p className="text-sm text-gray-600">Client documents and file management</p>
                </div>
                <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiUpload className="w-4 h-4" />
                    Upload Document
                </motion.button>
            </div>

            <div className="space-y-4">
                {documents.map((doc, index) => (
                    <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FiFile className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">{doc.name}</div>
                                <div className="text-sm text-gray-600">
                                    Type: {doc.type} • Category: {doc.category} • Size: {doc.size}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Uploaded: {doc.uploaded}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <motion.button
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiEye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiDownload className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

const ChattingTab = () => {
    const [chatMessage, setChatMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            sender: 'client',
            message: 'Hello, I need help with my GST filing for this quarter.',
            timestamp: '2024-01-20 10:30 AM',
            read: true
        },
        {
            id: 2,
            sender: 'advisor',
            message: 'Sure, I can help with that. Please share your purchase and sales details.',
            timestamp: '2024-01-20 10:32 AM',
            read: true
        },
        {
            id: 3,
            sender: 'client',
            message: 'I will upload the documents by tomorrow.',
            timestamp: '2024-01-20 10:35 AM',
            read: true
        }
    ]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (chatMessage.trim()) {
            const newMessage = {
                id: chatMessages.length + 1,
                sender: 'advisor',
                message: chatMessage,
                timestamp: new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }),
                read: true
            };
            setChatMessages([...chatMessages, newMessage]);
            setChatMessage('');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg border border-gray-200 p-6 h-96 flex flex-col"
        >
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chat with Client</h3>
                <p className="text-sm text-gray-600">Real-time communication</p>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {chatMessages.map((msg, index) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${msg.sender === 'advisor' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === 'advisor'
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                }`}
                        >
                            <div className="text-sm">{msg.message}</div>
                            <div className={`text-xs mt-1 ${msg.sender === 'advisor' ? 'text-blue-100' : 'text-gray-600'}`}>
                                {msg.timestamp}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <motion.button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!chatMessage.trim()}
                >
                    <FiSend className="w-4 h-4" />
                </motion.button>
            </form>
        </motion.div>
    );
};

const AutomationTab = () => {
    const [automationSettings, setAutomationSettings] = useState({
        recurringTasks: true,
        autoBilling: false,
        paymentReminders: true,
        documentReminders: true,
        complianceAlerts: false
    });

    const handleAutomationChange = (setting) => {
        setAutomationSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const automationFeatures = [
        {
            key: 'recurringTasks',
            title: 'Recurring Task Setup',
            description: 'Automatically create recurring tasks for regular compliance work',
            icon: FiRepeat
        },
        {
            key: 'autoBilling',
            title: 'Auto Bill Create',
            description: 'Automatically generate invoices for recurring services',
            icon: FiFileText
        },
        {
            key: 'paymentReminders',
            title: 'Auto Payment Reminder',
            description: 'Send automatic payment reminders before due dates',
            icon: FiCheckSquare
        },
        {
            key: 'documentReminders',
            title: 'Document Collection Reminder',
            description: 'Remind clients to submit required documents',
            icon: FiClipboard
        },
        {
            key: 'complianceAlerts',
            title: 'Compliance Deadline Alerts',
            description: 'Get alerts for upcoming compliance deadlines',
            icon: FiSettings
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
        >
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Automation Settings</h3>
                <p className="text-sm text-gray-600">Configure automated workflows and reminders</p>
            </div>

            <div className="space-y-4">
                {automationFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div
                            key={feature.key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">{feature.title}</div>
                                    <div className="text-sm text-gray-600">{feature.description}</div>
                                </div>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <input
                                    type="checkbox"
                                    checked={automationSettings[feature.key]}
                                    onChange={() => handleAutomationChange(feature.key)}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                />
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div
                className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex items-center gap-2 text-sm text-green-800">
                    <FiCheckSquare className="w-4 h-4" />
                    <span>Automation settings will take effect immediately</span>
                </div>
            </motion.div>
        </motion.div>
    );
};


// Modal Components
const AddFirmModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Proprietorship',
        pan: '',
        gst: ''
    });

    const handleSubmit = () => {
        if (formData.name.trim() && formData.pan.trim()) {
            onAdd(formData);
            setFormData({ name: '', type: 'Proprietorship', pan: '', gst: '' });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Add New Firm</h2>
                        <button onClick={onClose} className="text-white hover:text-blue-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter firm name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                        <select 
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Proprietorship">Proprietorship</option>
                            <option value="Partnership">Partnership</option>
                            <option value="LLP">LLP</option>
                            <option value="Private Limited">Private Limited</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                        <input
                            type="text"
                            value={formData.pan}
                            onChange={(e) => setFormData({...formData, pan: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter PAN number"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GST Number (Optional)</label>
                        <input
                            type="text"
                            value={formData.gst}
                            onChange={(e) => setFormData({...formData, gst: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter GST number"
                        />
                    </div>
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Add Firm
                    </button>
                </div>
            </div>
        </div>
    );
};

const EditFirmModal = ({ isOpen, onClose, onSave, firm }) => {
    const [formData, setFormData] = useState({
        name: firm?.name || '',
        type: firm?.type || 'Proprietorship',
        pan: firm?.pan || '',
        gst: firm?.gst || ''
    });

    React.useEffect(() => {
        if (firm) {
            setFormData({
                name: firm.name,
                type: firm.type,
                pan: firm.pan,
                gst: firm.gst
            });
        }
    }, [firm]);

    const handleSubmit = () => {
        if (formData.name.trim() && formData.pan.trim()) {
            onSave(formData);
            onClose();
        }
    };

    if (!isOpen || !firm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Edit Firm</h2>
                        <button onClick={onClose} className="text-white hover:text-blue-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                        <select 
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Proprietorship">Proprietorship</option>
                            <option value="Partnership">Partnership</option>
                            <option value="LLP">LLP</option>
                            <option value="Private Limited">Private Limited</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                        <input
                            type="text"
                            value={formData.pan}
                            onChange={(e) => setFormData({...formData, pan: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                        <input
                            type="text"
                            value={formData.gst}
                            onChange={(e) => setFormData({...formData, gst: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const EditPasswordModal = ({ isOpen, onClose, onSave, password }) => {
    const [formData, setFormData] = useState({
        platform: password?.platform || '',
        username: password?.username || '',
        password: password?.password || ''
    });

    React.useEffect(() => {
        if (password) {
            setFormData({
                platform: password.platform,
                username: password.username,
                password: password.password
            });
        }
    }, [password]);

    const handleSubmit = () => {
        if (formData.platform.trim() && formData.username.trim() && formData.password.trim()) {
            onSave(formData);
            onClose();
        }
    };

    if (!isOpen || !password) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Edit Password</h2>
                        <button onClick={onClose} className="text-white hover:text-purple-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                        <input
                            type="text"
                            value={formData.platform}
                            onChange={(e) => setFormData({...formData, platform: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="text"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddQuotationModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        service: '',
        amount: '',
        status: 'Pending',
        description: ''
    });

    const handleSubmit = () => {
        if (formData.service.trim() && formData.amount) {
            onAdd(formData);
            setFormData({ service: '', amount: '', status: 'Pending', description: '' });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Create Quotation</h2>
                        <button onClick={onClose} className="text-white hover:text-green-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                        <input
                            type="text"
                            value={formData.service}
                            onChange={(e) => setFormData({...formData, service: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Enter service name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Enter amount"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select 
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
                            placeholder="Enter description"
                        />
                    </div>
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Create Quotation
                    </button>
                </div>
            </div>
        </div>
    );
};

const EditQuotationModal = ({ isOpen, onClose, onSave, quotation }) => {
    const [formData, setFormData] = useState({
        service: quotation?.service || '',
        amount: quotation?.amount || '',
        status: quotation?.status || 'Pending',
        description: quotation?.description || ''
    });

    React.useEffect(() => {
        if (quotation) {
            setFormData({
                service: quotation.service,
                amount: quotation.amount,
                status: quotation.status,
                description: quotation.description
            });
        }
    }, [quotation]);

    const handleSubmit = () => {
        if (formData.service.trim() && formData.amount) {
            onSave(formData);
            onClose();
        }
    };

    if (!isOpen || !quotation) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Edit Quotation</h2>
                        <button onClick={onClose} className="text-white hover:text-green-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                        <input
                            type="text"
                            value={formData.service}
                            onChange={(e) => setFormData({...formData, service: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select 
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
                        />
                    </div>
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        task: '',
        dueDate: '',
        status: 'Pending',
        assigned: '',
        priority: 'Medium',
        description: ''
    });

    const handleSubmit = () => {
        if (formData.task.trim() && formData.dueDate) {
            onAdd(formData);
            setFormData({ task: '', dueDate: '', status: 'Pending', assigned: '', priority: 'Medium', description: '' });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Create Task</h2>
                        <button onClick={onClose} className="text-white hover:text-blue-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
                        <input
                            type="text"
                            value={formData.task}
                            onChange={(e) => setFormData({...formData, task: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter task name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                        <input
                            type="text"
                            value={formData.assigned}
                            onChange={(e) => setFormData({...formData, assigned: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter assignee name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select 
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select 
                            value={formData.priority}
                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Enter task description"
                        />
                    </div>
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
};

const EditTaskModal = ({ isOpen, onClose, onSave, task }) => {
    const [formData, setFormData] = useState({
        task: task?.task || '',
        dueDate: task?.dueDate || '',
        status: task?.status || 'Pending',
        assigned: task?.assigned || '',
        priority: task?.priority || 'Medium',
        description: task?.description || ''
    });

    React.useEffect(() => {
        if (task) {
            setFormData({
                task: task.task,
                dueDate: task.dueDate,
                status: task.status,
                assigned: task.assigned,
                priority: task.priority,
                description: task.description
            });
        }
    }, [task]);

    const handleSubmit = () => {
        if (formData.task.trim() && formData.dueDate) {
            onSave(formData);
            onClose();
        }
    };

    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Edit Task</h2>
                        <button onClick={onClose} className="text-white hover:text-blue-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
                        <input
                            type="text"
                            value={formData.task}
                            onChange={(e) => setFormData({...formData, task: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                        <input
                            type="text"
                            value={formData.assigned}
                            onChange={(e) => setFormData({...formData, assigned: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select 
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select 
                            value={formData.priority}
                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddInvoiceModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        date: '',
        dueDate: '',
        amount: '',
        status: 'Pending',
        description: ''
    });

    const handleSubmit = () => {
        if (formData.date && formData.dueDate && formData.amount) {
            onAdd(formData);
            setFormData({ date: '', dueDate: '', amount: '', status: 'Pending', description: '' });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Create Invoice</h2>
                        <button onClick={onClose} className="text-white hover:text-green-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Enter amount"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select 
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
                            placeholder="Enter invoice description"
                        />
                    </div>
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Create Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};

const DateRangeModal = ({ isOpen, onClose, onUpdate, currentRange }) => {
    const [startDate, setStartDate] = useState(currentRange.startDate);
    const [endDate, setEndDate] = useState(currentRange.endDate);

    const handleUpdate = () => {
        onUpdate({ startDate, endDate });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Change Date Range</h2>
                        <button onClick={onClose} className="text-white hover:text-teal-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                            type="text"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                            placeholder="DD/MM/YYYY"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                            type="text"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                            placeholder="DD/MM/YYYY"
                        />
                    </div>
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleUpdate} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                        Update Range
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddNoteModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        note: '',
        category: 'General'
    });

    const handleSubmit = () => {
        if (formData.note.trim()) {
            onAdd(formData);
            setFormData({ note: '', category: 'General' });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Add Note</h2>
                        <button onClick={onClose} className="text-white hover:text-blue-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select 
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="General">General</option>
                            <option value="Compliance">Compliance</option>
                            <option value="Advisory">Advisory</option>
                            <option value="Registration">Registration</option>
                            <option value="Financial">Financial</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({...formData, note: e.target.value})}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Enter your note here..."
                        />
                    </div>
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Add Note
                    </button>
                </div>
            </div>
        </div>
    );
};

const EditNoteModal = ({ isOpen, onClose, onSave, note }) => {
    const [formData, setFormData] = useState({
        note: note?.note || '',
        category: note?.category || 'General'
    });

    React.useEffect(() => {
        if (note) {
            setFormData({
                note: note.note,
                category: note.category
            });
        }
    }, [note]);

    const handleSubmit = () => {
        if (formData.note.trim()) {
            onSave(formData);
            onClose();
        }
    };

    if (!isOpen || !note) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Edit Note</h2>
                        <button onClick={onClose} className="text-white hover:text-blue-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select 
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="General">General</option>
                            <option value="Compliance">Compliance</option>
                            <option value="Advisory">Advisory</option>
                            <option value="Registration">Registration</option>
                            <option value="Financial">Financial</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({...formData, note: e.target.value})}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddServiceModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        service: '',
        frequency: 'Monthly',
        nextDue: '',
        amount: '',
        description: ''
    });

    const handleSubmit = () => {
        if (formData.service.trim() && formData.nextDue && formData.amount) {
            onAdd(formData);
            setFormData({ service: '', frequency: 'Monthly', nextDue: '', amount: '', description: '' });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Add Recurring Service</h2>
                        <button onClick={onClose} className="text-white hover:text-green-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                        <input
                            type="text"
                            value={formData.service}
                            onChange={(e) => setFormData({...formData, service: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Enter service name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                        <select 
                            value={formData.frequency}
                            onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Yearly">Yearly</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Next Due Date</label>
                        <input
                            type="date"
                            value={formData.nextDue}
                            onChange={(e) => setFormData({...formData, nextDue: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Enter amount"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
                            placeholder="Enter service description"
                        />
                    </div>
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Add Service
                    </button>
                </div>
            </div>
        </div>
    );
};

const EditServiceModal = ({ isOpen, onClose, onSave, service }) => {
    const [formData, setFormData] = useState({
        service: service?.service || '',
        frequency: service?.frequency || 'Monthly',
        nextDue: service?.nextDue || '',
        amount: service?.amount || '',
        description: service?.description || ''
    });

    React.useEffect(() => {
        if (service) {
            setFormData({
                service: service.service,
                frequency: service.frequency,
                nextDue: service.nextDue,
                amount: service.amount,
                description: service.description
            });
        }
    }, [service]);

    const handleSubmit = () => {
        if (formData.service.trim() && formData.nextDue && formData.amount) {
            onSave(formData);
            onClose();
        }
    };

    if (!isOpen || !service) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Edit Service</h2>
                        <button onClick={onClose} className="text-white hover:text-green-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                        <input
                            type="text"
                            value={formData.service}
                            onChange={(e) => setFormData({...formData, service: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                        <select 
                            value={formData.frequency}
                            onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Yearly">Yearly</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Next Due Date</label>
                        <input
                            type="date"
                            value={formData.nextDue}
                            onChange={(e) => setFormData({...formData, nextDue: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
                        />
                    </div>
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const DocumentUploadModal = ({ isOpen, onClose, onAdd }) => {
    const [documents, setDocuments] = useState([
        { id: 1, name: '', remark: '', file: null }
    ]);

    const addDocumentField = () => {
        setDocuments(prev => [
            ...prev,
            { id: prev.length + 1, name: '', remark: '', file: null }
        ]);
    };

    const removeDocumentField = (id) => {
        if (documents.length > 1) {
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        }
    };

    const updateDocument = (id, field, value) => {
        setDocuments(prev => prev.map(doc => 
            doc.id === id ? { ...doc, [field]: value } : doc
        ));
    };

    const handleFileUpload = (id, file) => {
        updateDocument(id, 'file', file);
        if (!documents.find(doc => doc.id === id)?.name) {
            updateDocument(id, 'name', file.name.split('.')[0]);
        }
    };

    const handleAdd = () => {
        const validDocuments = documents.filter(doc => 
            doc.name.trim() && doc.file
        );
        
        if (validDocuments.length > 0) {
            onAdd(validDocuments);
            setDocuments([{ id: 1, name: '', remark: '', file: null }]);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Upload Documents</h2>
                        <button onClick={onClose} className="text-white hover:text-blue-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                    {documents.map((doc, index) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-800">Document #{index + 1}</h3>
                                {documents.length > 1 && (
                                    <button
                                        onClick={() => removeDocumentField(doc.id)}
                                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Document Name
                                    </label>
                                    <input
                                        type="text"
                                        value={doc.name}
                                        onChange={(e) => updateDocument(doc.id, 'name', e.target.value)}
                                        placeholder="Enter document name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        File Upload
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileUpload(doc.id, e.target.files[0])}
                                            className="w-full opacity-0 absolute inset-0 cursor-pointer"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                        />
                                        <div className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors ${
                                            doc.file 
                                                ? 'border-green-500 bg-green-50' 
                                                : 'border-gray-300 hover:border-blue-400'
                                        }`}>
                                            {doc.file ? (
                                                <div className="text-green-700">
                                                    <FiCheck className="w-5 h-5 mx-auto mb-1" />
                                                    <div className="text-sm font-medium">{doc.file.name}</div>
                                                    <div className="text-xs text-green-600">
                                                        {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-gray-600">
                                                    <FiUpload className="w-5 h-5 mx-auto mb-1" />
                                                    <div className="text-sm">Click to upload file</div>
                                                    <div className="text-xs">PDF, DOC, XLS, JPG, PNG</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Remarks
                                </label>
                                <textarea
                                    value={doc.remark}
                                    onChange={(e) => updateDocument(doc.id, 'remark', e.target.value)}
                                    placeholder="Enter remarks for this document"
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                />
                            </div>
                        </motion.div>
                    ))}

                    <motion.button
                        onClick={addDocumentField}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiPlus className="w-5 h-5" />
                        Add Another Document
                    </motion.button>
                </div>
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleAdd} disabled={documents.filter(doc => doc.name.trim() && doc.file).length === 0} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        Upload {documents.filter(doc => doc.name.trim() && doc.file).length} Document(s)
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Component
const ClientProfile = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [activeTab, setActiveTab] = useState('basic');
    const [editModal, setEditModal] = useState({ isOpen: false, field: '', value: '' });

    // Client data
    const [clientData, setClientData] = useState({
        name: "VENKATESH R AND ASSOCIATES",
        mobile: "9632196321",
        email: "venkateshrg@gmail.com",
        dob: "01/06/1994",
        balance: "100.00",
        fatherName: "ramappa",
        gender: "Male",
        state: "Karnataka",
        district: "Bengaluru (Bangalore) Urban",
        town: "NO.17",
        address1: "BANASHANKARI",
        address2: "BENGALURU"
    });

    // Profile tabs data
    const profileTabs = [
        { id: 'basic', name: 'Basic Details', icon: FiUser },
        { id: 'firms', name: 'Firms', icon: FiBriefcase },
        { id: 'password', name: 'Password', icon: FiKey },
        { id: 'quotation', name: 'Quotation', icon: FiClipboard },
        { id: 'task', name: 'Task', icon: FiCheckSquare },
        { id: 'billing', name: 'Billing', icon: FiFileText },
        { id: 'ledger', name: 'Ledger', icon: FiDollarSign },
        { id: 'notes', name: 'Notes', icon: FiFile },
        { id: 'recurring', name: 'Recurring', icon: FiRepeat },
        { id: 'documents', name: 'Documents', icon: FiArchive },
        { id: 'chatting', name: 'Chatting', icon: FiMessageSquare },
        { id: 'automation', name: 'Automation', icon: FiSettings }
    ];

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

    // Handle field editing
    const handleEditField = (field, value) => {
        setEditModal({ isOpen: true, field, value });
    };

    const saveEdit = (newValue) => {
        setClientData(prev => ({
            ...prev,
            [editModal.field]: newValue
        }));
        setEditModal({ isOpen: false, field: '', value: '' });
    };

    // Render content based on active tab
    const renderTabContent = () => {
        const tabComponents = {
            basic: <BasicDetailsTab clientData={clientData} onEdit={handleEditField} />,
            firms: <FirmsTab />,
            password: <PasswordTab />,
            quotation: <QuotationTab />,
            task: <TaskTab />,
            billing: <BillingTab />,
            ledger: <LedgerTab />,
            notes: <NotesTab />,
            recurring: <RecurringTab />,
            documents: <DocumentsTab />,
            chatting: <ChattingTab />,
            automation: <AutomationTab />
        };

        return tabComponents[activeTab];
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                isMinimized={isMinimized}
                setIsMinimized={setIsMinimized}
            />
            <Sidebar
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                isMinimized={isMinimized}
                setIsMinimized={setIsMinimized}
            />

            {/* Main content */}
            <div className={`pt-16 transition-all duration-300 ease-in-out ${isMinimized ? 'md:pl-20' : 'md:pl-72'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Header Card */}
                        <motion.div
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <motion.div
                                        className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center"
                                        whileHover={{ scale: 1.05, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <FiUser className="w-8 h-8 text-blue-600" />
                                    </motion.div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{clientData.name}</h1>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FiPhone className="w-4 h-4" />
                                                {clientData.mobile}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiMail className="w-4 h-4" />
                                                {clientData.email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiCalendar className="w-4 h-4" />
                                                {clientData.dob}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiMapPin className="w-4 h-4" />
                                                {clientData.state}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <motion.div
                                    className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold text-lg"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    Balance: ₹{clientData.balance}
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Profile Tabs */}
                        <motion.div
                            className="bg-white rounded-lg border border-gray-200 p-1 mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex overflow-x-auto scrollbar-hide">
                                {profileTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;

                                    return (
                                        <motion.button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${isActive
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <motion.div
                                                animate={{ rotate: isActive ? 360 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </motion.div>
                                            {tab.name}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Tab Content with AnimatePresence */}
                        <AnimatePresence mode="wait">
                            {renderTabContent()}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Edit Modal */}
            <EditModal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, field: '', value: '' })}
                field={editModal.field}
                value={editModal.value}
                onSave={saveEdit}
            />
        </div>
    );
};

export default ClientProfile;

