import React, { useState, useEffect, useRef } from 'react';
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
    FiClock,
    FiChevronLeft,
    FiChevronRight,
    FiChevronsRight,
    FiStar,
    FiTrendingUp,
    FiSave,
    FiGlobe,
    FiNavigation,
    FiGrid
} from 'react-icons/fi';

// Import other components
import FirmsTab from "../ClientComponents/FirmsTab";
import PasswordTab from "../ClientComponents/PasswordTab";
import QuotationTab from "../ClientComponents/QuotationTab";
import TaskTab from "../ClientComponents/TaskTab";
import BillingTab from "../ClientComponents/BillingTab";
import LedgerTab from "../ClientComponents/LedgerTab";
import NotesTab from "../ClientComponents/NotesTab";
import RecurringTab from "../ClientComponents/RecurringTab";
import DocumentsTab from "../ClientComponents/DocumentsTab";
import ChattingTab from "../ClientComponents/ChattingTab";
import AutomationTab from "../ClientComponents/AutomationTab";

// Enhanced DetailRow Component with inline editing
const DetailRow = ({ 
    label, 
    value, 
    field, 
    isEditing, 
    editedValue, 
    onEdit, 
    onSave, 
    onCancel, 
    onChange,
    type = 'text'
}) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 rounded-lg px-3 -mx-3">
            <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-blue-600 uppercase">
                        {label.charAt(0)}
                    </span>
                </div>
                <span className="font-medium text-gray-700 text-sm min-w-[120px]">{label}</span>
            </div>
            
            {/* SIMPLIFIED VERSION WITHOUT INDIVIDUAL EDIT BUTTON */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <span className="text-gray-900 font-medium text-sm sm:text-base truncate">{value}</span>
            </div>
        </div>
    );
};

// Enhanced BasicDetailsTab Component with bulk edit mode
const BasicDetailsTab = ({ clientData, onEdit }) => {
    const [editingField, setEditingField] = useState(null);
    const [editedValue, setEditedValue] = useState('');
    const [isBulkEditMode, setIsBulkEditMode] = useState(false);
    const [bulkEditData, setBulkEditData] = useState({});
    const [saveStatus, setSaveStatus] = useState(null);

    const handleEditClick = (field, value) => {
        setEditingField(field);
        setEditedValue(value);
    };

    const handleSave = (field, value) => {
        onEdit(field, value);
        setEditingField(null);
        setEditedValue('');
        
        // Show success feedback
        setSaveStatus({ type: 'success', message: `${field} updated successfully!` });
        setTimeout(() => setSaveStatus(null), 3000);
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditedValue('');
    };

    const handleBulkEditToggle = () => {
        if (!isBulkEditMode) {
            setBulkEditData({ ...clientData });
        }
        setIsBulkEditMode(!isBulkEditMode);
    };

    const handleBulkSave = () => {
        Object.entries(bulkEditData).forEach(([field, value]) => {
            if (value !== clientData[field]) {
                onEdit(field, value);
            }
        });
        
        setIsBulkEditMode(false);
        setSaveStatus({ type: 'success', message: 'All changes saved successfully!' });
        setTimeout(() => setSaveStatus(null), 3000);
    };

    const handleBulkCancel = () => {
        setIsBulkEditMode(false);
        setBulkEditData({});
    };

    const handleBulkFieldChange = (field, value) => {
        setBulkEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

   const renderField = (label, field, value, type = 'text') => {
    if (isBulkEditMode) {
        return (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-100 hover:bg-blue-50/30 transition-colors duration-200 rounded-lg px-3 -mx-3">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-blue-700 uppercase">
                            {label.charAt(0)}
                        </span>
                    </div>
                    <span className="font-medium text-gray-700 text-sm min-w-[120px]">{label}</span>
                </div>
                
                <div className="w-full sm:w-48">
                    {type === 'select' ? (
                        <select
                            value={bulkEditData[field] || value}
                            onChange={(e) => handleBulkFieldChange(field, e.target.value)}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    ) : (
                        <input
                            type={type}
                            value={bulkEditData[field] || value}
                            onChange={(e) => handleBulkFieldChange(field, e.target.value)}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm"
                        />
                    )}
                </div>
            </div>
        );
    }

    // Always show non-editing version when not in bulk edit mode
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 rounded-lg px-3 -mx-3">
            <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-blue-600 uppercase">
                        {label.charAt(0)}
                    </span>
                </div>
                <span className="font-medium text-gray-700 text-sm min-w-[120px]">{label}</span>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <span className="text-gray-900 font-medium text-sm sm:text-base truncate">{value}</span>
            </div>
        </div>
    );
};

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
            {/* Header with Bulk Edit Controls */}
            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                                <FiUserCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Basic Details</h3>
                                <p className="text-sm text-gray-600 mt-1">Manage and update client information</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {saveStatus && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`px-4 py-2 rounded-lg ${saveStatus.type === 'success' ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <FiCheck className="w-4 h-4" />
                                    <span className="text-sm font-medium">{saveStatus.message}</span>
                                </div>
                            </motion.div>
                        )}
                        
                        <motion.button
                            onClick={handleBulkEditToggle}
                            className={`px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200 ${isBulkEditMode 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg' 
                                : 'bg-white text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-gray-300 hover:border-blue-300'}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isBulkEditMode ? (
                                <>
                                    <FiGrid className="w-4 h-4" />
                                    Exit Edit
                                </>
                            ) : (
                                <>
                                    <FiEdit className="w-4 h-4" />
                                 Edit 
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Bulk Edit Mode Banner */}
            {isBulkEditMode && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-blue-200"
                >
                    <div className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <FiEdit className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Bulk Edit Mode Active</h4>
                                    <p className="text-sm text-gray-600">You can edit multiple fields at once</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    onClick={handleBulkCancel}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-all duration-200 text-sm border border-gray-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={handleBulkSave}
                                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-green-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg text-sm flex items-center gap-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiSave className="w-4 h-4" />
                                    Save All Changes
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Content Grid */}
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Personal Information Card */}
                    <motion.div
                        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    >
                        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-gray-200 p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                                    <FiUserCheck className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-lg">Personal Information</h4>
                                    <p className="text-sm text-gray-600">Client's personal details</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="space-y-1">
                                {renderField("Full Name", "name", clientData.name)}
                                {renderField("Email", "email", clientData.email, "email")}
                                {renderField("Mobile", "mobile", clientData.mobile, "tel")}
                                {renderField("Date of Birth", "dob", clientData.dob, "date")}
                                {renderField("Father's Name", "fatherName", clientData.fatherName)}
                                {renderField("Gender", "gender", clientData.gender, "select")}
                            </div>
                        </div>
                    </motion.div>

                    {/* Address Information Card */}
                    <motion.div
                        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    >
                        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-b border-gray-200 p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-lg flex items-center justify-center">
                                    <FiNavigation className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-lg">Address Information</h4>
                                    <p className="text-sm text-gray-600">Contact and location details</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="space-y-1">
                                {renderField("Address Line 1", "address1", clientData.address1)}
                                {renderField("Address Line 2", "address2", clientData.address2)}
                                {renderField("Town/City", "town", clientData.town)}
                                {renderField("District", "district", clientData.district)}
                                {renderField("State", "state", clientData.state)}
                            </div>
                            
                            {/* Map Preview (Placeholder) */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <FiGlobe className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Location Preview</span>
                                </div>
                                <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
                                    <div className="text-center">
                                        <FiMapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">{clientData.town}, {clientData.state}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Stats Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Profile Status</p>
                                <p className="text-lg font-bold text-gray-900 mt-1">Complete</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <FiCheck className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Last Updated</p>
                                <p className="text-lg font-bold text-gray-900 mt-1">Just Now</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                                <FiClock className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-purple-700 uppercase tracking-wide">Fields Edited</p>
                                <p className="text-lg font-bold text-gray-900 mt-1">0</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                                <FiEdit className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Data Accuracy</p>
                                <p className="text-lg font-bold text-gray-900 mt-1">100%</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                                <FiTrendingUp className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

// Rest of the code remains the same (EditModal, DeleteModal, AddFirmModal, EditFirmModal)...

// Keep all other modal components exactly as they were
const EditModal = ({ isOpen, onClose, field, value, onSave, type = 'text' }) => {
    const [inputValue, setInputValue] = useState(value);

    const handleSave = () => {
        onSave(inputValue);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200"
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold">Edit {field}</h2>
                            <p className="text-blue-100 text-xs mt-1">Update the {field.toLowerCase()} information</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="p-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        {field}
                    </label>
                    {type === 'textarea' ? (
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all bg-gray-50/50 text-sm"
                        />
                    ) : (
                        <input
                            type={type}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50/50 text-sm"
                        />
                    )}
                </div>
                <div className="px-5 py-4 bg-gray-50/80 border-t border-gray-200 flex justify-end gap-2">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200 text-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200"
            >
                <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold">{title}</h2>
                            <p className="text-red-100 text-xs mt-1">This action cannot be undone</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex items-center justify-center mb-3">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                            <FiTrash2 className="w-7 h-7 text-red-600" />
                        </div>
                    </div>
                    <p className="text-gray-700 text-center font-medium">{message}</p>
                </div>
                <div className="px-5 py-4 bg-gray-50/80 border-t border-gray-200 flex justify-end gap-2">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200 text-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-rose-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                    >
                        Delete
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200"
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold">Add New Firm</h2>
                            <p className="text-blue-100 text-xs mt-1">Register a new business entity</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Firm Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50/50 text-sm"
                            placeholder="Enter firm name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Business Type</label>
                        <select 
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50/50 text-sm"
                        >
                            <option value="Proprietorship">Proprietorship</option>
                            <option value="Partnership">Partnership</option>
                            <option value="LLP">LLP</option>
                            <option value="Private Limited">Private Limited</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">PAN Number</label>
                        <input
                            type="text"
                            value={formData.pan}
                            onChange={(e) => setFormData({...formData, pan: e.target.value})}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50/50 text-sm"
                            placeholder="Enter PAN number"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">GST Number (Optional)</label>
                        <input
                            type="text"
                            value={formData.gst}
                            onChange={(e) => setFormData({...formData, gst: e.target.value})}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50/50 text-sm"
                            placeholder="Enter GST number"
                        />
                    </div>
                </div>
                <div className="px-5 py-4 bg-gray-50/80 border-t border-gray-200 flex justify-end gap-2">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200 text-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                    >
                        Add Firm
                    </button>
                </div>
            </motion.div>
        </motion.div>
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200"
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold">Edit Firm</h2>
                            <p className="text-blue-100 text-xs mt-1">Update firm details</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Firm Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50/50 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Business Type</label>
                        <select 
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50/50 text-sm"
                        >
                            <option value="Proprietorship">Proprietorship</option>
                            <option value="Partnership">Partnership</option>
                            <option value="LLP">LLP</option>
                            <option value="Private Limited">Private Limited</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">PAN Number</label>
                        <input
                            type="text"
                            value={formData.pan}
                            onChange={(e) => setFormData({...formData, pan: e.target.value})}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50/50 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">GST Number</label>
                        <input
                            type="text"
                            value={formData.gst}
                            onChange={(e) => setFormData({...formData, gst: e.target.value})}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50/50 text-sm"
                        />
                    </div>
                </div>
                <div className="px-5 py-4 bg-gray-50/80 border-t border-gray-200 flex justify-end gap-2">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200 text-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Main Component - ClientProfile remains exactly the same
const ClientProfile = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [activeTab, setActiveTab] = useState('basic');
    const [editModal, setEditModal] = useState({ isOpen: false, field: '', value: '' });
    const [isMobileView, setIsMobileView] = useState(false);
    const tabsContainerRef = useRef(null);

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

    // Check mobile view on resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
        setClientData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const saveEdit = (newValue) => {
        setClientData(prev => ({
            ...prev,
            [editModal.field]: newValue
        }));
        setEditModal({ isOpen: false, field: '', value: '' });
    };

    // Scroll tabs
    const scrollTabs = (direction) => {
        if (tabsContainerRef.current) {
            const scrollAmount = 200;
            tabsContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
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
            <div className={`pt-16 transition-all duration-300 ease-in-out ${isMinimized ? 'md:pl-20' : 'md:pl-64'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Compact Header Card */}
                        <motion.div
                            className="bg-white rounded-xl shadow-md border border-gray-200 p-5 mb-6 relative overflow-hidden"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="relative">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                                        <motion.div
                                            className="relative flex-shrink-0"
                                            whileHover={{ scale: 1.03 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                                                <FiUser className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                                                <FiStar className="w-3 h-3 text-white" />
                                            </div>
                                        </motion.div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                                <h1 className="text-xl font-bold text-gray-900 truncate">{clientData.name}</h1>
                                                <span className="px-2.5 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                                                    <FiTrendingUp className="w-3 h-3" />
                                                    Active
                                                </span>
                                            </div>
                                            
                                            {/* Mobile - Collapsible Contact Info */}
                                            <div className={`grid ${isMobileView ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'} gap-3`}>
                                                <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FiPhone className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium text-gray-500">Mobile</p>
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{clientData.mobile}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FiMail className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium text-gray-500">Email</p>
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{clientData.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                                                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FiCalendar className="w-4 h-4 text-amber-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium text-gray-500">Date of Birth</p>
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{clientData.dob}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FiMapPin className="w-4 h-4 text-emerald-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium text-gray-500">Location</p>
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{clientData.state}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <motion.div
                                        className="mt-4 lg:mt-0 flex-shrink-0"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-3 rounded-lg font-bold text-lg shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-200 min-w-[180px]">
                                            <div className="flex items-center justify-center gap-2">
                                                <FiDollarSign className="w-5 h-5" />
                                                <div>
                                                    <p className="text-xs font-medium text-emerald-100">Balance</p>
                                                    <p className="text-xl">₹{clientData.balance}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Enhanced Profile Tabs - No Underline Version */}
                        <motion.div
                            className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="relative">
                                {/* Gradient overlay for scroll indicators */}
                                <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden sm:block"></div>
                                <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden sm:block"></div>
                                
                                {/* Left scroll button */}
                                <div className="hidden sm:flex absolute left-0 top-0 bottom-0 items-center z-20">
                                    <button
                                        onClick={() => scrollTabs('left')}
                                        className="h-full px-2 bg-gradient-to-r from-white via-white to-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all"
                                    >
                                        <FiChevronLeft className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                {/* Tabs container - No underline */}
                                <div 
                                    ref={tabsContainerRef}
                                    className="flex overflow-x-auto scrollbar-hide px-2 py-3"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    {profileTabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;

                                        return (
                                            <motion.button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap mx-1 ${isActive
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                    }`}
                                                whileHover={{ scale: 1.03, y: -1 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <motion.div
                                                    animate={{ 
                                                        rotate: isActive ? [0, 5, 0] : 0,
                                                        scale: isActive ? 1.1 : 1
                                                    }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                </motion.div>
                                                <span className="font-medium">{tab.name}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* Right scroll button */}
                                <div className="hidden sm:flex absolute right-0 top-0 bottom-0 items-center z-20">
                                    <button
                                        onClick={() => scrollTabs('right')}
                                        className="h-full px-2 bg-gradient-to-l from-white via-white to-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all"
                                    >
                                        <FiChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tab Content with AnimatePresence */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
                            >
                                {renderTabContent()}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Edit Modal - Keep for other tabs if needed */}
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