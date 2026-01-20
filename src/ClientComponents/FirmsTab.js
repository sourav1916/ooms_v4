import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiEdit, FiTrash2, FiSearch, FiPlus, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

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
    const [newFirm, setNewFirm] = useState({
        name: '',
        type: 'Proprietorship',
        pan: '',
        gst: ''
    });
    const [editFirmData, setEditFirmData] = useState({
        name: '',
        type: 'Proprietorship',
        pan: '',
        gst: ''
    });

    const filteredFirms = firms.filter(firm =>
        firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firm.pan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddFirm = () => {
        const firm = {
            id: firms.length + 1,
            ...newFirm,
            status: 'Active'
        };
        setFirms([...firms, firm]);
        setShowAddModal(false);
        setNewFirm({ name: '', type: 'Proprietorship', pan: '', gst: '' });
    };

    const handleEditFirm = () => {
        setFirms(firms.map(firm => 
            firm.id === selectedFirm.id ? { ...firm, ...editFirmData } : firm
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
        setEditFirmData({
            name: firm.name,
            type: firm.type,
            pan: firm.pan,
            gst: firm.gst
        });
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
            className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-xl p-6"
        >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                        Business Firms
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">Manage and organize all client business entities in one place</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or PAN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                        />
                    </div>
                    <motion.button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiPlus className="w-5 h-5" />
                        Add New Firm
                    </motion.button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Firms</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{firms.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                            <FiBriefcase className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Firms</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {firms.filter(f => f.status === 'Active').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                            <FiCheck className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Inactive Firms</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {firms.filter(f => f.status === 'Inactive').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-slate-100 rounded-xl flex items-center justify-center">
                            <FiAlertCircle className="w-6 h-6 text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Firms List */}
            <div className="space-y-4">
                {filteredFirms.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                            <FiBriefcase className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No firms found</h3>
                        <p className="text-gray-600">Try adjusting your search or add a new firm</p>
                    </div>
                ) : (
                    filteredFirms.map((firm, index) => (
                        <motion.div
                            key={firm.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                        <FiBriefcase className="w-7 h-7 text-gradient-to-r from-blue-600 to-indigo-700" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-lg font-semibold text-gray-900">{firm.name}</h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${firm.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {firm.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-600">Type:</span>
                                                <span className="text-sm text-gray-900 font-semibold">{firm.type}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-600">PAN:</span>
                                                <span className="text-sm text-gray-900 font-semibold">{firm.pan}</span>
                                            </div>
                                            {firm.gst && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-gray-600">GST:</span>
                                                    <span className="text-sm text-gray-900 font-semibold">{firm.gst}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <motion.button
                                        onClick={() => toggleStatus(firm.id)}
                                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${firm.status === 'Active' 
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25' 
                                            : 'bg-gradient-to-r from-gray-500 to-slate-600 text-white hover:shadow-lg hover:shadow-gray-500/25'
                                        }`}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {firm.status === 'Active' ? 'Deactivate' : 'Activate'}
                                    </motion.button>
                                    <motion.button
                                        onClick={() => openEditModal(firm)}
                                        className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:shadow-md rounded-xl transition-all duration-300"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FiEdit className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                        onClick={() => openDeleteModal(firm)}
                                        className="p-3 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:shadow-md rounded-xl transition-all duration-300"
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

            {/* Add Firm Modal */}
            {showAddModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">Add New Firm</h2>
                                    <p className="text-blue-100 text-sm mt-1">Enter firm details below</p>
                                </div>
                                <motion.button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiX className="w-6 h-6" />
                                </motion.button>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Firm Name *</label>
                                <input
                                    type="text"
                                    value={newFirm.name}
                                    onChange={(e) => setNewFirm({...newFirm, name: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                                    placeholder="Enter firm name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Business Type *</label>
                                <select
                                    value={newFirm.type}
                                    onChange={(e) => setNewFirm({...newFirm, type: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                                >
                                    <option value="Proprietorship">Proprietorship</option>
                                    <option value="Partnership">Partnership</option>
                                    <option value="LLP">LLP</option>
                                    <option value="Private Limited">Private Limited</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">PAN Number *</label>
                                <input
                                    type="text"
                                    value={newFirm.pan}
                                    onChange={(e) => setNewFirm({...newFirm, pan: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                                    placeholder="Enter PAN number"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">GST Number (Optional)</label>
                                <input
                                    type="text"
                                    value={newFirm.gst}
                                    onChange={(e) => setNewFirm({...newFirm, gst: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                                    placeholder="Enter GST number"
                                />
                            </div>
                        </div>
                        <div className="border-t px-8 py-6 bg-gray-50 flex justify-end gap-4">
                            <motion.button
                                onClick={() => setShowAddModal(false)}
                                className="px-6 py-3 text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                onClick={handleAddFirm}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Add Firm
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Edit Firm Modal */}
            {showEditModal && selectedFirm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">Edit Firm Details</h2>
                                    <p className="text-blue-100 text-sm mt-1">Update firm information</p>
                                </div>
                                <motion.button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiX className="w-6 h-6" />
                                </motion.button>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Firm Name</label>
                                <input
                                    type="text"
                                    value={editFirmData.name}
                                    onChange={(e) => setEditFirmData({...editFirmData, name: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Business Type</label>
                                <select
                                    value={editFirmData.type}
                                    onChange={(e) => setEditFirmData({...editFirmData, type: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                                >
                                    <option value="Proprietorship">Proprietorship</option>
                                    <option value="Partnership">Partnership</option>
                                    <option value="LLP">LLP</option>
                                    <option value="Private Limited">Private Limited</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">PAN Number</label>
                                <input
                                    type="text"
                                    value={editFirmData.pan}
                                    onChange={(e) => setEditFirmData({...editFirmData, pan: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">GST Number</label>
                                <input
                                    type="text"
                                    value={editFirmData.gst}
                                    onChange={(e) => setEditFirmData({...editFirmData, gst: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="border-t px-8 py-6 bg-gray-50 flex justify-end gap-4">
                            <motion.button
                                onClick={() => setShowEditModal(false)}
                                className="px-6 py-3 text-gray-600 hover:bg-gray-200 rounded-xl font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                onClick={handleEditFirm}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Update Firm
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedFirm && (
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
                                    <h2 className="text-2xl font-bold">Delete Firm</h2>
                                    <p className="text-red-100 text-sm mt-1">This action cannot be undone</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                                    <FiAlertCircle className="w-10 h-10 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Are you sure?</h3>
                                    <p className="text-gray-600 mt-2">
                                        You're about to delete <span className="font-semibold text-red-600">{selectedFirm.name}</span>. This will permanently remove all associated data.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="border-t px-8 py-6 bg-gray-50 flex justify-center gap-4">
                            <motion.button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-3 text-gray-600 hover:bg-gray-200 rounded-xl font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                onClick={deleteFirm}
                                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Delete Firm
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default FirmsTab;