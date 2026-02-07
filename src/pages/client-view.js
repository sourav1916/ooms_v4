import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, Header } from '../components/header';
import { useNavigate } from 'react-router-dom';
import {
    FiUsers,
    FiDollarSign,
    FiUserCheck,
    FiUserPlus,
    FiFileText,
    FiPlus,
    FiSearch,
    FiX,
    FiUser,
    FiLoader,
    FiCheckCircle,
    FiTrash2,
    FiClock,
    FiMoreVertical,
    FiInfo,
    FiEdit,
    FiEye,
    FiSettings,
    FiGrid,
    FiMail,
    FiPhone,
    FiTrendingUp,
    FiTrendingDown,
    FiMessageSquare,
    FiPrinter,
    FiDownload,
    FiFilter,
    FiMoreHorizontal,
    FiArrowRight,
    FiArrowLeft,
    FiCalendar,
    FiBriefcase,
    FiMove,
    FiSave,
    FiList,
    FiRefreshCw
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa6";
import DeleteConfirmationModal from '../components/delete-confirmation';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Import DnD Kit
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// // API Configuration
const API_BASE_URL = 'https://api.ooms.in/api/v1';
const CLIENT_LIST_API = `${API_BASE_URL}/client/list`;

// export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// export const CLIENT_LIST_API = `${API_BASE_URL}/client/list`;

// Status Change Modal Component - NEW: For changing status from dropdown
const StatusChangeModal = ({ isOpen, onClose, clientId, currentStatus, onStatusChange, statusOptions }) => {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);
    
    if (!isOpen) return null;
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-300';
            case 'INACTIVE': return 'bg-red-100 text-red-700 border-red-300';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };
    
    const getStatusIcon = (status) => {
        switch (status) {
            case 'ACTIVE': return <FiCheckCircle className="w-4 h-4" />;
            case 'INACTIVE': return <FiX className="w-4 h-4" />;
            case 'PENDING': return <FiClock className="w-4 h-4" />;
            default: return <FiClock className="w-4 h-4" />;
        }
    };
    
    const handleConfirm = () => {
        onStatusChange(clientId, selectedStatus);
        onClose();
    };
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                        <FiCheckCircle className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold">Change Status</h3>
                                        <p className="text-blue-100 text-xs">Update client status</p>
                                    </div>
                                </div>
                                <motion.button
                                    onClick={onClose}
                                    className="text-white hover:text-blue-200 transition-colors p-1 rounded-lg hover:bg-white/10"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiX className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                        
                        {/* Current Status */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="mb-3">
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Current Status</label>
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getStatusColor(currentStatus)}`}>
                                    {getStatusIcon(currentStatus)}
                                    <span className="font-medium text-sm">
                                        {statusOptions.find(s => s.value === currentStatus)?.name || currentStatus}
                                    </span>
                                </div>
                            </div>
                            
                            {/* New Status Selection */}
                            <div className="mb-2">
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Select New Status</label>
                                <div className="space-y-1.5">
                                    {statusOptions.map((status) => (
                                        <motion.button
                                            key={status.value}
                                            onClick={() => setSelectedStatus(status.value)}
                                            className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${selectedStatus === status.value ? 'ring-1 ring-blue-500 ring-offset-1 ' : ''} ${getStatusColor(status.value)}`}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(status.value)}
                                                <span className="font-medium text-sm">{status.name}</span>
                                            </div>
                                            {selectedStatus === status.value && (
                                                <FiCheckCircle className="w-4 h-4" />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="px-4 py-3 bg-gray-50 flex justify-end gap-2">
                            <motion.button
                                onClick={onClose}
                                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                onClick={handleConfirm}
                                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Update
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// NEW: Firms Details Modal Component - UPDATED with professional design and View Details button
const FirmsDetailsModal = ({ isOpen, onClose, firms, clientName }) => {
    const [expandedFirm, setExpandedFirm] = useState(null);
    
    if (!isOpen || !firms || firms.length === 0) return null;
    
    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };
    
    // Format address
    const formatAddress = (address) => {
        if (!address) return 'N/A';
        const parts = [
            address.address_line_1,
            address.address_line_2,
            address.city,
            address.state,
            address.pincode,
            address.country
        ].filter(Boolean);
        return parts.join(', ') || 'N/A';
    };
    
    const toggleFirmDetails = (firmId) => {
        setExpandedFirm(expandedFirm === firmId ? null : firmId);
    };
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <FiBriefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Firms Details</h3>
                                        <p className="text-blue-100 text-sm">{clientName}</p>
                                    </div>
                                </div>
                                <motion.button
                                    onClick={onClose}
                                    className="text-white hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-white/10"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiX className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                        
                        {/* Firms List */}
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <div className="space-y-4">
                                {firms.map((firm, index) => (
                                    <motion.div
                                        key={firm.firm_id || index}
                                        className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl overflow-hidden"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        {/* Firm Header */}
                                        <div className="p-4 bg-white border-b border-gray-200">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                                            <FiBriefcase className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-gray-900 text-lg mb-1">
                                                                {firm.firm_name || 'Unnamed Firm'}
                                                            </h4>
                                                            <div className="flex flex-wrap gap-2 mb-2">
                                                                {firm.firm_type && (
                                                                    <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                                                                        {firm.firm_type}
                                                                    </span>
                                                                )}
                                                                {firm.status && (
                                                                    <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                                                        Active
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                <span className="font-medium">Firm #{index + 1}</span>
                                                                <span className="mx-2">•</span>
                                                                <span>Created: {formatDate(firm.create_date)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-start md:items-end gap-2">
                                                    <motion.button
                                                        onClick={() => toggleFirmDetails(firm.firm_id || index)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FiEye className="w-4 h-4" />
                                                        {expandedFirm === (firm.firm_id || index) ? 'Hide Details' : 'View Details'}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Basic Details - Always visible */}
                                        <div className="p-4">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {firm.pan_no && (
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">PAN No</div>
                                                        <div className="font-bold text-gray-900 text-sm truncate">{firm.pan_no}</div>
                                                    </div>
                                                )}
                                                {firm.file_no && (
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">File No</div>
                                                        <div className="font-bold text-gray-900 text-sm truncate">{firm.file_no}</div>
                                                    </div>
                                                )}
                                                {firm.gst_no && (
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">GST No</div>
                                                        <div className="font-bold text-gray-900 text-sm truncate">{firm.gst_no}</div>
                                                    </div>
                                                )}
                                                {firm.registration_no && (
                                                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Registration No</div>
                                                        <div className="font-bold text-gray-900 text-sm truncate">{firm.registration_no}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Expanded Details - Only shown when expanded */}
                                        <AnimatePresence>
                                            {expandedFirm === (firm.firm_id || index) && (
                                                <motion.div
                                                    className="border-t border-gray-200 p-6 bg-gradient-to-b from-gray-50 to-white"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                        {/* Additional Registration Numbers */}
                                                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                            <h5 className="font-bold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-100">Registration Details</h5>
                                                            <div className="space-y-3">
                                                                {firm.cin_no && (
                                                                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                                                        <span className="text-sm text-gray-600 font-medium">CIN No:</span>
                                                                        <span className="font-semibold text-gray-900 text-sm">{firm.cin_no}</span>
                                                                    </div>
                                                                )}
                                                                {firm.vat_no && (
                                                                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                                                        <span className="text-sm text-gray-600 font-medium">VAT No:</span>
                                                                        <span className="font-semibold text-gray-900 text-sm">{firm.vat_no}</span>
                                                                    </div>
                                                                )}
                                                                {firm.tan_no && (
                                                                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                                                        <span className="text-sm text-gray-600 font-medium">TAN No:</span>
                                                                        <span className="font-semibold text-gray-900 text-sm">{firm.tan_no}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Address Information */}
                                                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                            <h5 className="font-bold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-100">Address</h5>
                                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                                <p className="text-sm text-gray-800 leading-relaxed">
                                                                    {formatAddress(firm.address)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Creation Details */}
                                                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                            <h5 className="font-bold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-100">Created By</h5>
                                                            {firm.create_by && (
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                                                        <span className="text-sm text-gray-600 font-medium">Name:</span>
                                                                        <span className="font-semibold text-gray-900 text-sm">{firm.create_by.name || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                                                        <span className="text-sm text-gray-600 font-medium">Email:</span>
                                                                        <span className="font-semibold text-gray-900 text-sm">{firm.create_by.email || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                                                        <span className="text-sm text-gray-600 font-medium">Mobile:</span>
                                                                        <span className="font-semibold text-gray-900 text-sm">{firm.create_by.mobile || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                                                        <span className="text-sm text-gray-600 font-medium">Created Date:</span>
                                                                        <span className="font-semibold text-gray-900 text-sm">{formatDate(firm.create_date)}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Modification Details */}
                                                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                            <h5 className="font-bold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-100">Last Modified</h5>
                                                            {firm.modify_by && Object.keys(firm.modify_by).length > 0 && firm.modify_by.name ? (
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                                                        <span className="text-sm text-gray-600 font-medium">By:</span>
                                                                        <span className="font-semibold text-gray-900 text-sm">{firm.modify_by.name}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                                                        <span className="text-sm text-gray-600 font-medium">Date:</span>
                                                                        <span className="font-semibold text-gray-900 text-sm">{formatDate(firm.modify_date)}</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-center py-6">
                                                                    <div className="text-gray-400 text-sm italic">Not modified yet</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                            <div className="text-sm text-gray-600 font-medium">
                                Total: {firms.length} firm{firms.length !== 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    onClick={onClose}
                                    className="px-5 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 text-sm font-medium rounded-lg hover:from-gray-300 hover:to-gray-400 transition-colors shadow-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Close
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// View Mode Toggle Component - Updated button size to match Filter
const TableViewSwitch = ({ viewMode, setViewMode }) => {
    return (
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <motion.button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FiList className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">Table</span>
            </motion.button>
            
            <motion.button
                onClick={() => setViewMode('card')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${viewMode === 'card' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FiGrid className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">Cards</span>
            </motion.button>
        </div>
    );
};

// Client Table Component - ULTRA PROFESSIONAL DESIGN
const ClientTable = ({ 
    clients, 
    selectedClients, 
    handleClientSelect, 
    selectAll, 
    handleSelectAll, 
    columnConfig, 
    renderCellContent,
    loading,
    toggleRowDropdown,
    activeRowDropdown,
    setActiveRowDropdown,
    handleStatusChange,
    openStatusModal,
    navigate,
    handleExport,
    showFirmsModal
}) => {
    // Skeleton loader
    const SkeletonRow = () => (
        <div className="flex items-center border-b border-gray-100 animate-pulse p-3">
            <div className="w-8 md:w-10 flex-shrink-0 mr-2">
                <div className="h-4 bg-gray-200 rounded w-4"></div>
            </div>
            <div className="w-8 flex-shrink-0 mr-3">
                <div className="h-4 bg-gray-200 rounded w-4"></div>
            </div>
            {columnConfig.map((column, index) => (
                <div key={index} className="hidden md:block flex-1 p-2">
                    <div className="space-y-1">
                        {column.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="min-h-[1.25rem] flex items-center justify-center">
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    // Mobile client card for table view
    const MobileClientCard = ({ client, index, handleExport, showFirmsModal }) => {
        const getLastUpdatedFirm = () => {
            if (!client.firms || client.firms.length === 0) return null;
            
            const sortedFirms = [...client.firms].sort((a, b) => {
                const dateA = a.modify_date || a.create_date;
                const dateB = b.modify_date || b.create_date;
                return new Date(dateB) - new Date(dateA);
            });
            
            return sortedFirms[0];
        };
        
        const lastFirm = getLastUpdatedFirm();
        
        return (
            <motion.div
                className="bg-white border border-gray-200 rounded-lg p-3 mb-2 md:hidden"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Mobile Card Header */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={selectedClients.has(client._id)}
                            onChange={() => handleClientSelect(client.username)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-400 focus:ring-blue-500"
                        />
                        <div className="font-bold text-gray-800 text-sm w-4">{index + 1}</div>
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <FiUser className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800 text-sm">{client.name || 'N/A'}</div>
                        </div>
                    </div>
                    {/* Vertical 3-dot menu for mobile */}
                    <div className="relative">
                        <motion.button
                            onClick={() => toggleRowDropdown(client._id)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="flex flex-col items-center justify-center space-y-0.5">
                                <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                                <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                                <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                            </div>
                        </motion.button>
                        
                        {/* Mobile dropdown */}
                        <AnimatePresence>
                            {activeRowDropdown === client._id && (
                                <motion.div
                                    className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                >
                                    <button
                                        onClick={() => {
                                            openStatusModal(client._id, client.status);
                                            setActiveRowDropdown(null);
                                        }}
                                        className="flex items-center w-full px-4 py-3 text-sm text-blue-600 hover:bg-blue-50"
                                    >
                                        <FiCheckCircle className="mr-3" />
                                        Change Status
                                    </button>

                                    <div className="border-t my-1"></div>

                                    <button
                                        onClick={() => {
                                            setActiveRowDropdown(null);
                                            navigate(`/client/profile/${client.username}`);
                                        }}
                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <FiEye className="mr-3" />
                                        View Details
                                    </button>

                                    <button
                                        onClick={() => {
                                            setActiveRowDropdown(null);
                                            navigate(`/client/edit/${client._id}`);
                                        }}
                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <FiEdit className="mr-3" />
                                        Edit Client
                                    </button>

                                    <button
                                        onClick={() => {
                                            setActiveRowDropdown(null);
                                        }}
                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <FiMessageSquare className="mr-3" />
                                        Send Message
                                    </button>

                                    <div className="border-t my-1"></div>

                                    <button
                                        onClick={() => {
                                            setActiveRowDropdown(null);
                                        }}
                                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <FiTrash2 className="mr-3" />
                                        Delete Client
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Card Content */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <FiPhone className="w-3 h-3 text-gray-400" />
                            <span>{client.mobile || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className={`text-sm font-semibold ${client.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ₹{Math.abs(client.balance || 0).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <FiUsers className="w-3 h-3 text-gray-400" />
                        <span>{client.firms?.length || 0} firms</span>
                    </div>

                    {/* Last updated firm display */}
                    {lastFirm && (
                        <div className="text-xs text-gray-700 bg-gray-50 rounded p-2 border border-gray-200">
                            <div className="font-semibold mb-1">Latest Firm:</div>
                            <div>{lastFirm.firm_name || 'N/A'}</div>
                        </div>
                    )}

                    {/* Status display in mobile */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-600">Status:</span>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            client.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                            client.status === 'INACTIVE' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                            {client.status === 'ACTIVE' ? 'Active' :
                             client.status === 'INACTIVE' ? 'Inactive' : 'Pending'}
                        </div>
                    </div>

                    <div className="text-xs text-gray-500">
                        Guardian: {client.guardian_name || 'N/A'}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Professional Table Header */}
            <div className="hidden md:block border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white sticky top-0 z-10">
                <div className="flex items-center min-w-max bg-white">
                    {/* Select All Toggle */}
                    <div className="w-12 p-3 flex-shrink-0 flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                            <div className={`w-8 h-4 ${selectAll ? 'bg-blue-600' : 'bg-gray-300'} peer-focus:outline-none rounded-full peer after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all ${selectAll ? 'after:translate-x-full' : ''}`}></div>
                        </label>
                    </div>

                    {/* SL No Column */}
                    <div className="w-12 p-3 font-bold text-gray-700 text-xs flex-shrink-0 text-center border-l border-gray-100">
                        SL No
                    </div>

                    {/* Dynamic Columns - Fixed Widths */}
                    {columnConfig.map(column => (
                        <div
                            key={column.id}
                            className="p-3 font-semibold text-gray-700 text-xs flex-1 min-w-0 text-center border-l border-gray-100"
                            style={{ 
                                flex: column.id === '1' ? '1.5' : 
                                       column.id === '3' ? '1.2' : 
                                       column.id === '5' ? '0.8' : 
                                       column.id === '6' ? '0.8' : '1'
                            }}
                        >
                            <div className="truncate">{column.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile header */}
            <div className="md:hidden border-b border-gray-200 bg-white px-3 py-2 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-blue-600 rounded border-gray-400 focus:ring-blue-500"
                        />
                        <span className="font-semibold text-gray-800 text-sm">Clients</span>
                    </div>
                    <span className="text-xs text-gray-600">{clients.length} clients</span>
                </div>
            </div>

            {/* Scrollable Table Body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {loading ? (
                    // Skeleton Loaders
                    <div className="md:min-w-max">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <SkeletonRow key={index} />
                        ))}
                    </div>
                ) : clients.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-gray-500 px-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FiUser className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium text-sm">No clients found</p>
                            <p className="text-gray-400 text-xs mt-1">Try adjusting your search or filters</p>
                        </div>
                    </div>
                ) : (
                    <div className="md:min-w-max">
                        {/* Mobile view - cards */}
                        <div className="md:hidden px-3 py-1">
                            {clients.map((client, index) => (
                                <MobileClientCard key={client._id} client={client} index={index} handleExport={handleExport} showFirmsModal={showFirmsModal} />
                            ))}
                        </div>

                        {/* Professional Desktop Table */}
                        <div className="hidden md:block">
                            {clients.map((client, index) => (
                                <motion.div
                                    key={client._id}
                                    className="flex items-center border-b border-gray-100 hover:bg-gray-50 transition-colors group bg-white"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    {/* Select Toggle */}
                                    <div className="w-12 p-3 flex-shrink-0 flex justify-center">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={selectedClients.has(client._id)}
                                                onChange={() => handleClientSelect(client._id)}
                                            />
                                            <div className={`w-8 h-4 ${selectedClients.has(client._id) ? 'bg-blue-600' : 'bg-gray-300'} peer-focus:outline-none rounded-full peer after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all ${selectedClients.has(client._id) ? 'after:translate-x-full' : ''}`}></div>
                                        </label>
                                    </div>

                                    {/* SL No */}
                                    <div className="w-12 p-3 flex-shrink-0 text-center border-l border-gray-100">
                                        <span className="font-bold text-gray-800 text-xs">
                                            {index + 1}
                                        </span>
                                    </div>

                                    {/* Dynamic Columns - Professional Layout with Fixed Widths */}
                                    {columnConfig.map(column => (
                                        <div 
                                            key={column.id} 
                                            className="p-3 min-w-0 text-center border-l border-gray-100"
                                            style={{ 
                                                flex: column.id === '1' ? '1.5' : 
                                                       column.id === '3' ? '1.2' : 
                                                       column.id === '5' ? '0.8' : 
                                                       column.id === '6' ? '0.8' : '1'
                                            }}
                                        >
                                            <div className="flex items-center justify-center">
                                                {renderCellContent(client, column.items[0].id, openStatusModal, showFirmsModal)}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Client Cards Component - Professional Design
const ClientCards = ({ 
    clients, 
    selectedClients, 
    handleClientSelect, 
    columnConfig,
    renderCellContent,
    loading,
    toggleRowDropdown,
    activeRowDropdown,
    setActiveRowDropdown,
    handleStatusChange,
    statusOptions,
    openStatusModal,
    navigate,
    handleExport,
    showFirmsModal
}) => {
    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700';
            case 'INACTIVE': return 'bg-red-100 text-red-700';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Format balance
    const formatBalance = (balance) => {
        return `₹${Math.abs(balance || 0).toLocaleString()}`;
    };

    // Get the last updated firm
    const getLastUpdatedFirm = (firms) => {
        if (!firms || firms.length === 0) return null;
        
        const sortedFirms = [...firms].sort((a, b) => {
            const dateA = a.modify_date || a.create_date;
            const dateB = b.modify_date || b.create_date;
            return new Date(dateB) - new Date(dateA);
        });
        
        return sortedFirms[0];
    };

    // Skeleton loader
    const SkeletonCard = () => (
        <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    );

    return (
        <div className="p-3 md:p-4">
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            ) : clients.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-gray-500 px-4">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiUser className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium text-sm">No clients found</p>
                        <p className="text-gray-400 text-xs mt-1">Try adjusting your search or filters</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {clients.map((client, index) => {
                        const lastFirm = getLastUpdatedFirm(client.firms);
                        
                        return (
                        <motion.div
                            key={client._id}
                            className={`bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden ${selectedClients.has(client._id) ? 'ring-2 ring-blue-500' : ''}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            {/* Card Header */}
                            <div className="p-3 border-b border-gray-100">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <input
                                                type="checkbox"
                                                checked={selectedClients.has(client._id)}
                                                onChange={() => handleClientSelect(client.username)}
                                                className="w-3.5 h-3.5 text-blue-600 rounded border-gray-400 focus:ring-blue-500 flex-shrink-0"
                                            />
                                            <div className="font-bold text-gray-800 text-xs w-4">{index + 1}</div>
                                            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                                                <FiUser className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-800 text-xs truncate">{client.name || 'N/A'}</h3>
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-sm truncate">{client.guardian_name || 'N/A'}</h4>
                                        <p className="text-gray-600 text-xs truncate">{client.firms?.length || 0} firms</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {/* Vertical 3-dot menu */}
                                        <div className="relative">
                                            <motion.button
                                                onClick={() => toggleRowDropdown(`card-${client._id}`)}
                                                className="w-6 h-6 flex flex-col items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors space-y-0.5"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                                                <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                                                <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                                            </motion.button>

                                            {/* Dropdown for cards */}
                                            <AnimatePresence>
                                                {activeRowDropdown === `card-${client._id}` && (
                                                    <motion.div
                                                        className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                                                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                openStatusModal(client._id, client.status);
                                                                setActiveRowDropdown(null);
                                                            }}
                                                            className="flex items-center w-full px-4 py-3 text-sm text-blue-600 hover:bg-blue-50"
                                                        >
                                                            <FiCheckCircle className="mr-3" />
                                                            Change Status
                                                        </button>

                                                        <div className="border-t my-1"></div>

                                                        <button
                                                            onClick={() => {
                                                                setActiveRowDropdown(null);
                                                                navigate(`/client/profile/${client.username}`);
                                                            }}
                                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <FiEye className="mr-3" />
                                                            View Details
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setActiveRowDropdown(null);
                                                                navigate(`/client/edit/${client._id}`);
                                                            }}
                                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <FiEdit className="mr-3" />
                                                            Edit Client
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setActiveRowDropdown(null);
                                                            }}
                                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <FiMessageSquare className="mr-3" />
                                                            Send Message
                                                        </button>

                                                        <div className="border-t my-1"></div>

                                                        <button
                                                            onClick={() => {
                                                                setActiveRowDropdown(null);
                                                            }}
                                                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                                                        >
                                                            <FiTrash2 className="mr-3" />
                                                            Delete Client
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-3">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-gray-700 text-xs">
                                            <FiPhone className="w-3 h-3 text-gray-400" />
                                            <span>{client.mobile || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className={`text-xs font-semibold ${(client.balance || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {formatBalance(client.balance)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Firm Information */}
                                    <div className="text-xs text-gray-700">
                                        <div className="font-medium mb-1">Firms ({client.firms?.length || 0}):</div>
                                        {lastFirm && (
                                            <div className="text-xs bg-gray-50 rounded p-1 border border-gray-200 mb-1 cursor-pointer hover:bg-gray-100 transition-colors" 
                                                 onClick={() => showFirmsModal(client.firms, client.name)}>
                                                <div className="font-semibold">{lastFirm.firm_name || 'N/A'}</div>
                                            </div>
                                        )}
                                        
                                        {client.firms && client.firms.length > 1 && (
                                            <div className="text-blue-600 font-medium text-xs mt-1 cursor-pointer hover:text-blue-700 transition-colors"
                                                 onClick={() => showFirmsModal(client.firms, client.name)}>
                                                +{client.firms.length - 1} more firm{client.firms.length - 1 > 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Display */}
                                    <div className="pt-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-gray-600">Status:</span>
                                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(client.status)}`}>
                                                {client.status === 'ACTIVE' ? 'Active' :
                                                 client.status === 'INACTIVE' ? 'Inactive' : 'Pending'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )})}
                </div>
            )}
        </div>
    );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
    const pageOptions = [5, 10, 15, 20, 25, 50, 100];
    
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                    {pageOptions.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <span className="text-sm text-gray-600">per page</span>
            </div>
            
            <div className="flex items-center gap-2">
                <motion.button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiArrowLeft className="w-4 h-4" />
                </motion.button>
                
                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = idx + 1;
                        } else if (currentPage <= 3) {
                            pageNum = idx + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + idx;
                        } else {
                            pageNum = currentPage - 2 + idx;
                        }
                        
                        return (
                            <motion.button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`w-8 h-8 rounded text-sm font-medium ${
                                    currentPage === pageNum
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {pageNum}
                            </motion.button>
                        );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                            <span className="text-gray-400">...</span>
                            <motion.button
                                onClick={() => onPageChange(totalPages)}
                                className="w-8 h-8 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {totalPages}
                            </motion.button>
                        </>
                    )}
                </div>
                
                <motion.button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiArrowRight className="w-4 h-4" />
                </motion.button>
            </div>
            
            <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </div>
        </div>
    );
};

const ViewClients = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [columnConfig, setColumnConfig] = useState([]);
    const [selectedClients, setSelectedClients] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [activeRowDropdown, setActiveRowDropdown] = useState(null);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [exportModal, setExportModal] = useState({ open: false, type: '', data: null });
    const navigate = useNavigate();
    const [deleteModal, SetDeleteModal] = useState(false);
    const [deleteOtp, SetDeleteOtp] = useState('');
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [activeDragId, setActiveDragId] = useState(null);
    const [activeItemDragId, setActiveItemDragId] = useState(null);
    const [viewMode, setViewMode] = useState('table');
    const [isMobile, setIsMobile] = useState(false);
    const [statusModal, setStatusModal] = useState({ open: false, clientId: null, currentStatus: '' });
    const [firmsModal, setFirmsModal] = useState({ open: false, firms: [], clientName: '' });
    
    // Pagination and API states
    const [clients, setClients] = useState([]);
    const [clientStats, setClientStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        withBalance: 0
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Initialize DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Get headers from localStorage
  const getHeaders = useCallback(() => {
    try {
        const userName = localStorage.getItem('userName') || 
                         localStorage.getItem('user_username') || '';
        const token = localStorage.getItem('token') || 
                      localStorage.getItem('user_token') || '';
        const branchId = localStorage.getItem('branchId') || 
                         localStorage.getItem('branch_id') || '';
        
        if (!userName || !token || !branchId) {
            console.error('Missing authentication data in localStorage');
            return null;
        }
        
        return {
            'Content-Type': 'application/json',
            'username': userName,
            'token':token,
            'branch': branchId
        };
    } catch (error) {
        console.error('Error getting headers from localStorage:', error);
        return null;
    }
}, []);

// Fetch clients from API
const fetchClients = useCallback(async (page = 1, limit = 10, isLoadMore = false) => {
    const headers = getHeaders();
    if (!headers) {
        console.error('Cannot fetch clients: Missing authentication headers');
        return;
    }

    try {
        if (isLoadMore) {
            setIsFetchingMore(true);
        } else {
            setLoading(true);
        }

        const params = new URLSearchParams({
            search: searchQuery,
            page: page.toString(),
            limit: limit.toString(),
            ...(selectedStatus && { status: selectedStatus }),
            ...(selectedGroup && { group: selectedGroup })
        });

        const response = await axios.get(`${CLIENT_LIST_API}?${params}`, {
            headers: headers,
            timeout: 10000
        });

        if (response.data) {
            let clientsData = [];
            let total = 0;
            let totalPages = 1;
            
            if (Array.isArray(response.data)) {
                clientsData = response.data;
                total = response.data.length;
            } else if (response.data.data && Array.isArray(response.data.data)) {
                clientsData = response.data.data;
                total = response.data.total || response.data.data.length;
                totalPages = response.data.total_pages || Math.ceil(total / limit);
            } else if (response.data.clients && Array.isArray(response.data.clients)) {
                clientsData = response.data.clients;
                total = response.data.total || response.data.clients.length;
                totalPages = response.data.totalPages || Math.ceil(total / limit);
            } else if (response.data.success && Array.isArray(response.data.data)) {
                clientsData = response.data.data;
                total = response.data.total || response.data.data.length;
                totalPages = response.data.total_pages || Math.ceil(total / limit);
            }
            
            const transformedClients = clientsData.map((client, index) => {
                return {
                    _id: client.profile_id || client._id || client.id || `temp-${index}-${Date.now()}`,
                    id: client.profile_id || client._id || client.id || `temp-${index}-${Date.now()}`,
                    username: client.username || client.email || client.user_name || `user${index + 1}`,
                    name: client.name || client.full_name || client.client_name || `Client ${index + 1}`,
                    guardian_name: client.guardian_name || client.father_name || client.guardian || 'N/A',
                    mobile: client.mobile || client.phone || client.contact_number || 'N/A',
                    status: client.status === "1" || client.status === "ACTIVE" || client.active ? "ACTIVE" : "INACTIVE",
                    balance: parseFloat(client.balance) || parseFloat(client.outstanding) || 0,
                    firms: client.firms || [],
                    firm_count: client.firms ? client.firms.length : 0
                };
            });

            if (isLoadMore) {
                setClients(prev => [...prev, ...transformedClients]);
            } else {
                setClients(transformedClients);
            }

            setPagination(prev => ({
                ...prev,
                currentPage: page,
                totalPages: totalPages,
                totalItems: total
            }));

            setHasMore(page < totalPages);
        } else {
            console.error('No data in response');
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        if (error.response) {
            if (error.response.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else if (error.response.status === 403) {
                alert('You do not have permission to view clients.');
            } else {
                alert(`Error ${error.response.status}: ${error.response.data?.message || 'Failed to fetch clients'}`);
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
            alert('No response from server. Please check your connection.');
        } else {
            console.error('Request setup error:', error.message);
            alert(`Error: ${error.message}`);
        }
        
        // Dummy data for testing
        const dummyData = [
            {
                _id: '1',
                id: '1',
                username: 'john_doe',
                name: 'John Doe',
                guardian_name: 'Robert Doe',
                mobile: '9876543210',
                status: 'ACTIVE',
                balance: 15000,
                firms: [
                    {
                        firm_id: 'f1',
                        firm_name: 'Doe Enterprises',
                        pan_no: 'ABCDE1234F',
                        file_no: 'FN001',
                        firm_type: 'partnership',
                        create_date: '2024-01-15T10:30:00.000Z',
                        modify_date: '2024-01-20T14:45:00.000Z',
                        create_by: {
                            name: 'Admin',
                            email: 'admin@example.com',
                            mobile: '9876543210'
                        },
                        modify_by: {
                            name: 'Admin',
                            email: 'admin@example.com',
                            mobile: '9876543210'
                        },
                        address: {
                            address_line_1: '123 Main Street',
                            address_line_2: 'Suite 101',
                            city: 'Mumbai',
                            state: 'Maharashtra',
                            pincode: '400001',
                            country: 'India'
                        }
                    },
                    {
                        firm_id: 'f2',
                        firm_name: 'Doe Trading Co',
                        pan_no: 'ABCDE1235F',
                        file_no: 'FN002',
                        firm_type: 'proprietorship',
                        create_date: '2024-02-10T09:15:00.000Z',
                        modify_date: '2024-02-12T11:20:00.000Z',
                        create_by: {
                            name: 'Admin',
                            email: 'admin@example.com',
                            mobile: '9876543210'
                        },
                        address: {
                            address_line_1: '456 Market Road',
                            city: 'Delhi',
                            state: 'Delhi',
                            pincode: '110001',
                            country: 'India'
                        }
                    },
                    {
                        firm_id: 'f3',
                        firm_name: 'Doe Manufacturing',
                        pan_no: 'ABCDE1236F',
                        file_no: 'FN003',
                        firm_type: 'llp',
                        create_date: '2024-03-05T14:30:00.000Z',
                        modify_date: '2024-03-10T16:45:00.000Z',
                        create_by: {
                            name: 'Admin',
                            email: 'admin@example.com',
                            mobile: '9876543210'
                        },
                        address: {
                            address_line_1: '789 Industrial Area',
                            address_line_2: 'Sector 5',
                            city: 'Chennai',
                            state: 'Tamil Nadu',
                            pincode: '600001',
                            country: 'India'
                        }
                    }
                ],
                firm_count: 3
            },
            {
                _id: '2',
                id: '2',
                username: 'jane_smith',
                name: 'Jane Smith',
                guardian_name: 'William Smith',
                mobile: '9876543211',
                status: 'ACTIVE',
                balance: -5000,
                firms: [
                    {
                        firm_id: 'f4',
                        firm_name: 'Smith & Co',
                        pan_no: 'XYZAB5678G',
                        file_no: 'FN004',
                        firm_type: 'partnership',
                        create_date: '2024-01-20T11:45:00.000Z',
                        modify_date: '2024-01-25T16:30:00.000Z',
                        create_by: {
                            name: 'Admin',
                            email: 'admin@example.com',
                            mobile: '9876543210'
                        },
                        modify_by: {
                            name: 'Admin',
                            email: 'admin@example.com',
                            mobile: '9876543210'
                        },
                        address: {
                            address_line_1: '789 Business Avenue',
                            address_line_2: 'Floor 5',
                            city: 'Bangalore',
                            state: 'Karnataka',
                            pincode: '560001',
                            country: 'India'
                        }
                    },
                    {
                        firm_id: 'f5',
                        firm_name: 'Smith Industries',
                        pan_no: 'XYZAB5679G',
                        file_no: 'FN005',
                        firm_type: 'private limited',
                        create_date: '2024-02-15T09:30:00.000Z',
                        modify_date: '2024-02-20T13:15:00.000Z',
                        create_by: {
                            name: 'Admin',
                            email: 'admin@example.com',
                            mobile: '9876543210'
                        },
                        address: {
                            address_line_1: '101 Corporate Park',
                            city: 'Hyderabad',
                            state: 'Telangana',
                            pincode: '500001',
                            country: 'India'
                        }
                    }
                ],
                firm_count: 2
            },
            {
                _id: '3',
                id: '3',
                username: 'alex_wilson',
                name: 'Alexander Wilson',
                guardian_name: 'Michael Wilson',
                mobile: '9876543212',
                status: 'INACTIVE',
                balance: 25000,
                firms: [
                    {
                        firm_id: 'f6',
                        firm_name: 'Wilson Enterprises',
                        pan_no: 'PQRS1234T',
                        file_no: 'FN006',
                        firm_type: 'proprietorship',
                        create_date: '2024-01-10T08:45:00.000Z',
                        modify_date: '2024-01-18T12:30:00.000Z',
                        create_by: {
                            name: 'Admin',
                            email: 'admin@example.com',
                            mobile: '9876543210'
                        },
                        address: {
                            address_line_1: '222 Wilson Street',
                            city: 'Kolkata',
                            state: 'West Bengal',
                            pincode: '700001',
                            country: 'India'
                        }
                    }
                ],
                firm_count: 1
            }
        ];
        
        setClients(dummyData);
        setPagination(prev => ({
            ...prev,
            currentPage: 1,
            totalPages: 1,
            totalItems: 3
        }));
    } finally {
        setLoading(false);
        setIsFetchingMore(false);
    }
}, [searchQuery, selectedStatus, selectedGroup, pagination.itemsPerPage, getHeaders, navigate]);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
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

    // All available data fields from clients
    const availableFields = [
        { id: 'id', label: 'ID', type: 'text' },
        { id: 'username', label: 'Username', type: 'text' },
        { id: 'name', label: 'Client Name', type: 'text' },
        { id: 'guardian_name', label: 'Guardian Name', type: 'text' },
        { id: 'mobile', label: 'Mobile', type: 'text' },
        { id: 'balance', label: 'Balance', type: 'currency' },
        { id: 'firm_count', label: 'Firm Count', type: 'number' },
        { id: 'firms', label: 'Firms', type: 'array' },
        { id: 'pan', label: 'PAN', type: 'text' },
        { id: 'file_no', label: 'File No', type: 'text' },
        { id: 'status', label: 'Status', type: 'status' },
        { id: 'actions', label: 'Actions', type: 'actions' }
    ];

    // Default column configuration - ULTRA PROFESSIONAL LAYOUT
    const defaultColumnConfig = [
        {
            id: '1',
            name: 'Client Details',
            items: [
                { id: 'name', label: 'Client Name' }
            ]
        },
        {
            id: '2',
            name: 'Mobile',
            items: [
                { id: 'mobile', label: 'Mobile' }
            ]
        },
        {
            id: '3',
            name: 'Firms',
            items: [
                { id: 'firms', label: 'Firms' }
            ]
        },
        {
            id: '4',
            name: 'Balance',
            items: [
                { id: 'balance', label: 'Balance' }
            ]
        },
        {
            id: '5',
            name: 'Status',
            items: [
                { id: 'status', label: 'Status' }
            ],
            fixed: true
        },
        {
            id: '6',
            name: 'Actions',
            items: [
                { id: 'actions', label: 'Actions' }
            ],
            fixed: true
        }
    ];

    // Initialize column config
    useEffect(() => {
        const savedConfig = localStorage.getItem('clientColumnConfig');
        if (savedConfig) {
            setColumnConfig(JSON.parse(savedConfig));
        } else {
            setColumnConfig(defaultColumnConfig);
        }
    }, []);

    // Save column config
    const saveColumnConfig = (config) => {
        setColumnConfig(config);
        localStorage.setItem('clientColumnConfig', JSON.stringify(config));
    };

    const [statusOptions] = useState([
        { value: 'ACTIVE', name: 'Active' },
        { value: 'INACTIVE', name: 'Inactive' },
        { value: 'PENDING', name: 'Pending' }
    ]);

    const [groupOptions] = useState([
        { value: 'gst', name: 'GST' },
        { value: 'itr', name: 'ITR' },
        { value: 'company', name: 'Company' }
    ]);

    // Initial load and when filters change
    useEffect(() => {
        fetchClients(1, pagination.itemsPerPage);
    }, [searchQuery, selectedStatus, selectedGroup, pagination.itemsPerPage]);

    // Handle export
    const handleExport = (type, data = null) => {
        setExportModal({ open: true, type, data });

        // Simulate export process
        setTimeout(() => {
            setExportModal({ open: false, type: '', data: null });
            alert(`${type.toUpperCase()} export completed successfully!`);
        }, 1500);
    };

    // Handle client selection
     const handleClientSelect = (clientId) => {
        const newSelected = new Set(selectedClients);
        if (newSelected.has(clientId)) {
            newSelected.delete(clientId);
        } else {
            newSelected.add(clientId);
        }
        setSelectedClients(newSelected);
        
        // Update selectAll state
        if (clients.length > 0) {
            const allSelected = newSelected.size === clients.length;
            setSelectAll(allSelected);
        }
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedClients(new Set());
        } else {
            const allClientIds = new Set(filteredClients.map(client => client._id));
            setSelectedClients(allClientIds);
        }
        setSelectAll(!selectAll);
    };

    // Format balance
    const formatBalance = (balance) => {
        return `₹${Math.abs(balance || 0).toLocaleString()}`;
    };

    // Handle status change
    const handleStatusChange = (clientId, newStatus) => {
        setClients(prev => prev.map(client =>
            client._id === clientId ? { ...client, status: newStatus } : client
        ));
    };

    // Open status modal
    const openStatusModal = (clientId, currentStatus) => {
        setStatusModal({
            open: true,
            clientId,
            currentStatus
        });
    };

    // Close status modal
    const closeStatusModal = () => {
        setStatusModal({
            open: false,
            clientId: null,
            currentStatus: ''
        });
    };

    // Open firms modal
    const openFirmsModal = (firms, clientName) => {
        setFirmsModal({
            open: true,
            firms,
            clientName
        });
    };

    // Close firms modal
    const closeFirmsModal = () => {
        setFirmsModal({
            open: false,
            firms: [],
            clientName: ''
        });
    };

    // Filter clients
    const filteredClients = clients.filter(client => {
        const matchesSearch = searchQuery === '' ||
            (client.name && client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (client.mobile && client.mobile.includes(searchQuery)) ||
            (client.firms && client.firms.some(firm =>
                firm.firm_name && firm.firm_name.toLowerCase().includes(searchQuery.toLowerCase())
            ));

        const matchesStatus = selectedStatus === '' || client.status === selectedStatus;
        const matchesGroup = selectedGroup === '';

        return matchesSearch && matchesStatus && matchesGroup;
    });

    // Toggle row dropdown
    const toggleRowDropdown = (clientId) => {
        setActiveRowDropdown(activeRowDropdown === clientId ? null : clientId);
    };

    // Close all dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setActiveRowDropdown(null);
                setShowExportDropdown(false);
                setShowFilterDropdown(false);
                setShowMoreMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle scroll for infinite loading
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || 
                isFetchingMore || 
                !hasMore || 
                loading) {
                return;
            }
            
            if (pagination.currentPage < pagination.totalPages) {
                fetchClients(pagination.currentPage + 1, pagination.itemsPerPage, true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isFetchingMore, hasMore, loading, pagination, fetchClients]);

    // Helper functions for column management
    const addItemToColumn = (columnIndex, fieldId) => {
        const field = availableFields.find(f => f.id === fieldId);
        if (!field) return;

        const newConfig = [...columnConfig];
        if (newConfig[columnIndex].items.length < 5) {
            newConfig[columnIndex].items.push({
                id: field.id,
                label: field.label
            });
            saveColumnConfig(newConfig);
        }
    };

    const removeItemFromColumn = (columnIndex, itemIndex) => {
        const newConfig = [...columnConfig];
        newConfig[columnIndex].items.splice(itemIndex, 1);
        saveColumnConfig(newConfig);
    };

    const removeColumn = (columnIndex) => {
        const newConfig = [...columnConfig];
        if (!newConfig[columnIndex].fixed) {
            newConfig.splice(columnIndex, 1);
            saveColumnConfig(newConfig);
        }
    };

    // Handle drag end for columns
    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (!over || active.id === over.id) {
            setActiveDragId(null);
            return;
        }
        
        const oldIndex = columnConfig.findIndex((col) => col.id === active.id);
        const newIndex = columnConfig.findIndex((col) => col.id === over.id);
        
        if (oldIndex === -1 || newIndex === -1) {
            setActiveDragId(null);
            return;
        }
        
        const sourceColumn = columnConfig[oldIndex];
        
        if (sourceColumn.fixed) {
            setActiveDragId(null);
            return;
        }
        
        const firstFixedIndex = columnConfig.findIndex(col => col.fixed);
        
        if (newIndex >= firstFixedIndex && newIndex < columnConfig.length) {
            if (firstFixedIndex > 0) {
                const newConfig = arrayMove(columnConfig, oldIndex, firstFixedIndex - 1);
                saveColumnConfig(newConfig);
            }
        } else {
            const newConfig = arrayMove(columnConfig, oldIndex, newIndex);
            saveColumnConfig(newConfig);
        }
        
        setActiveDragId(null);
    };

    // Handle drag end for items within a column
    const handleItemDragEnd = (event, columnIndex) => {
        const { active, over } = event;
        
        if (active.id !== over.id) {
            setColumnConfig((items) => {
                const newConfig = [...items];
                const columnItems = newConfig[columnIndex].items;
                const oldIndex = columnItems.findIndex((item) => item.id === active.id);
                const newIndex = columnItems.findIndex((item) => item.id === over.id);
                
                newConfig[columnIndex].items = arrayMove(columnItems, oldIndex, newIndex);
                saveColumnConfig(newConfig);
                return newConfig;
            });
        }
        
        setActiveItemDragId(null);
    };

    // Add a new column
    const addNewColumn = () => {
        const newConfig = [...columnConfig];
        const newColumnId = (Date.now()).toString();
        
        const firstFixedIndex = newConfig.findIndex(col => col.fixed);
        const insertIndex = firstFixedIndex >= 0 ? firstFixedIndex : newConfig.length - 1;
        
        newConfig.splice(insertIndex, 0, {
            id: newColumnId,
            name: `New Column`,
            items: []
        });
        saveColumnConfig(newConfig);
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700';
            case 'INACTIVE': return 'bg-red-100 text-red-700';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Get status display text
    const getStatusText = (status) => {
        switch (status) {
            case 'ACTIVE': return 'Active';
            case 'INACTIVE': return 'Inactive';
            case 'PENDING': return 'Pending';
            default: return status;
        }
    };

    // Get last updated firm
    const getLastUpdatedFirm = (firms) => {
        if (!firms || firms.length === 0) return null;
        
        const sortedFirms = [...firms].sort((a, b) => {
            const dateA = a.modify_date || a.create_date;
            const dateB = b.modify_date || b.create_date;
            return new Date(dateB) - new Date(dateA);
        });
        
        return sortedFirms[0];
    };

    // ULTRA PROFESSIONAL RENDER CELL CONTENT - UPDATED WITH PHONE ICON AND FIRM NAME
    const renderCellContent = (client, fieldId, openStatusModal, showFirmsModal) => {
        switch (fieldId) {
            case 'name':
                return (
                    <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <FiUser className="w-4 h-4 text-white" />
                        </div>
                        <div 
                            className="min-w-0 flex-1 text-left cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => navigate(`/client/profile/${client.username}`)}
                        >
                            <div className="font-semibold text-gray-800 text-sm truncate">
                                {client.name || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                                {client.guardian_name || 'N/A'}
                            </div>
                        </div>
                    </div>
                );
            case 'mobile':
                return (
                    <div className="flex items-center justify-center text-gray-700 font-medium text-sm gap-2">
                        <FiPhone className="w-4 h-4 text-gray-400" />
                        {client.mobile || 'N/A'}
                    </div>
                );
            case 'balance':
                return (
                    <div className="flex items-center justify-center">
                        <div className={`inline-flex items-center px-3 py-1 rounded text-sm font-semibold ${(client.balance || 0) < 0
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-green-50 text-green-700 border border-green-200'
                            }`}>
                            {formatBalance(client.balance)}
                        </div>
                    </div>
                );
          case 'firms':
    const lastFirm = getLastUpdatedFirm(client.firms);
    const firmCount = client.firms?.length || 0;
    
    return (
        <div className="text-center">
            {firmCount > 0 ? (
                <div 
                    className="cursor-pointer hover:bg-gray-100 transition-colors text-center p-2"
                    onClick={() => showFirmsModal(client.firms, client.name)}
                >
                    <div className="font-medium text-gray-800 text-sm mb-1">
                        {lastFirm?.firm_name || 'N/A'}
                    </div>
                    <div className="space-y-1">
                        <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200`}>
                            {firmCount} firm{firmCount !== 1 ? 's' : ''}
                        </div>
                        {client.firms.length > 1 && (
                            <div className="text-xs text-blue-600 font-medium">
                                +{client.firms.length - 1} more firm{client.firms.length - 1 > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-sm text-gray-500 italic">No firms</div>
            )}
        </div>
    );
            case 'status':
                return (
                    <div className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(client.status)}`}>
                        {getStatusText(client.status)}
                    </div>
                );
            case 'actions':
                return (
                    <div className="relative dropdown-container flex justify-center">
                        {/* Compact Action Button */}
                        <motion.button
                            onClick={() => toggleRowDropdown(client._id)}
                            className="w-8 h-8 flex items-center justify-center rounded
                           bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiMoreVertical className="w-4 h-4 text-gray-700" />
                        </motion.button>

                        {/* Professional Dropdown */}
                        <AnimatePresence>
                            {activeRowDropdown === client._id && (
                                <motion.div
                                    className="absolute right-0 mt-1 w-48 bg-white rounded-lg
                                   shadow-xl border border-gray-200 z-50 overflow-hidden"
                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                openStatusModal(client._id, client.status);
                                                setActiveRowDropdown(null);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm
                                           text-blue-600 hover:bg-blue-50 transition-colors"
                                        >
                                            <FiCheckCircle className="mr-3 text-blue-600 w-4 h-4" />
                                            Change Status
                                        </button>

                                        <div className="border-t my-1"></div>

                                        <button
                                            onClick={() => {
                                                setActiveRowDropdown(null);
                                                navigate(`/client/profile/${client.username}`);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm
                                           text-gray-700 hover:bg-blue-50 transition-colors"
                                        >
                                            <FiEye className="mr-3 text-blue-600 w-4 h-4" />
                                            View Details
                                        </button>

                                        <button
                                            onClick={() => {
                                                setActiveRowDropdown(null);
                                                navigate(`/client/edit/${client._id}`);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm
                                           text-gray-700 hover:bg-green-50 transition-colors"
                                        >
                                            <FiEdit className="mr-3 text-green-600 w-4 h-4" />
                                            Edit Client
                                        </button>

                                        <button
                                            onClick={() => {
                                                setActiveRowDropdown(null);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm
                                           text-gray-700 hover:bg-purple-50 transition-colors"
                                        >
                                            <FiMessageSquare className="mr-3 text-purple-600 w-4 h-4" />
                                            Send Message
                                        </button>

                                        <div className="border-t my-1"></div>

                                        <button
                                            onClick={() => {
                                                setActiveRowDropdown(null);
                                                SetDeleteModal(true);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm
                                           text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <FiTrash2 className="mr-3 w-4 h-4" />
                                            Delete Client
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            default:
                return (
                    <span className="text-gray-700 font-medium text-sm">
                        {client[fieldId] || '-'}
                    </span>
                );
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        fetchClients(page, pagination.itemsPerPage);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (itemsPerPage) => {
        setPagination(prev => ({
            ...prev,
            itemsPerPage,
            currentPage: 1
        }));
    };

    // Settings Modal Component - Keep as is
    const SettingsModal = React.memo(() => {
        const [localColumnConfig, setLocalColumnConfig] = useState(columnConfig);
        const [localActiveDragId, setLocalActiveDragId] = useState(null);
        const [localActiveItemDragId, setLocalActiveItemDragId] = useState(null);
        const [editingColumnId, setEditingColumnId] = useState(null);
        const [tempColumnName, setTempColumnName] = useState('');

        useEffect(() => {
            if (settingsModalOpen) {
                setLocalColumnConfig(JSON.parse(JSON.stringify(columnConfig)));
                setLocalActiveDragId(null);
                setLocalActiveItemDragId(null);
                setEditingColumnId(null);
                setTempColumnName('');
            }
        }, [columnConfig, settingsModalOpen]);

        const handleModalDragEnd = (event) => {
            const { active, over } = event;
            
            if (!over || active.id === over.id) {
                setLocalActiveDragId(null);
                return;
            }
            
            const oldIndex = localColumnConfig.findIndex((col) => col.id === active.id);
            const newIndex = localColumnConfig.findIndex((col) => col.id === over.id);
            
            if (oldIndex === -1 || newIndex === -1) {
                setLocalActiveDragId(null);
                return;
            }
            
            const sourceColumn = localColumnConfig[oldIndex];
            const targetColumn = localColumnConfig[newIndex];
            
            const firstFixedIndex = localColumnConfig.findIndex(col => col.fixed);
            
            if (sourceColumn.fixed) {
                setLocalActiveDragId(null);
                return;
            }
            
            if (newIndex >= firstFixedIndex && newIndex < localColumnConfig.length) {
                if (firstFixedIndex > 0) {
                    const newConfig = arrayMove(localColumnConfig, oldIndex, firstFixedIndex - 1);
                    setLocalColumnConfig(newConfig);
                }
            } else {
                const newConfig = arrayMove(localColumnConfig, oldIndex, newIndex);
                setLocalColumnConfig(newConfig);
            }
            
            setLocalActiveDragId(null);
        };

        const handleModalItemDragEnd = (event, columnIndex) => {
            const { active, over } = event;
            
            if (active.id !== over.id) {
                const newConfig = [...localColumnConfig];
                const columnItems = newConfig[columnIndex].items;
                const oldIndex = columnItems.findIndex((item) => item.id === active.id);
                const newIndex = columnItems.findIndex((item) => item.id === over.id);
                
                newConfig[columnIndex].items = arrayMove(columnItems, oldIndex, newIndex);
                setLocalColumnConfig(newConfig);
            }
            
            setLocalActiveItemDragId(null);
        };

        const addItemToColumnInModal = (columnIndex, fieldId) => {
            const field = availableFields.find(f => f.id === fieldId);
            if (!field) return;

            const newConfig = [...localColumnConfig];
            if (newConfig[columnIndex].items.length < 5) {
                newConfig[columnIndex].items.push({
                    id: field.id,
                    label: field.label
                });
                setLocalColumnConfig(newConfig);
            }
        };

        const removeItemFromColumnInModal = (columnIndex, itemIndex) => {
            const newConfig = [...localColumnConfig];
            newConfig[columnIndex].items.splice(itemIndex, 1);
            setLocalColumnConfig(newConfig);
        };

        const addNewColumnInModal = () => {
            const newConfig = [...localColumnConfig];
            const newColumnId = `col-${Date.now()}`;
            
            const firstFixedIndex = newConfig.findIndex(col => col.fixed);
            const insertIndex = firstFixedIndex >= 0 ? firstFixedIndex : newConfig.length;
            
            newConfig.splice(insertIndex, 0, {
                id: newColumnId,
                name: `New Column`,
                items: [],
                fixed: false
            });
            setLocalColumnConfig(newConfig);
            
            setEditingColumnId(newColumnId);
            setTempColumnName('New Column');
        };

        const startEditingColumn = (columnId, currentName) => {
            setEditingColumnId(columnId);
            setTempColumnName(currentName);
        };

        const saveColumnName = (columnId) => {
            if (!tempColumnName.trim()) {
                setEditingColumnId(null);
                return;
            }
            
            const newConfig = localColumnConfig.map(col => 
                col.id === columnId ? { ...col, name: tempColumnName.trim() } : col
            );
            setLocalColumnConfig(newConfig);
            setEditingColumnId(null);
        };

        const cancelEditingColumn = () => {
            setEditingColumnId(null);
            setTempColumnName('');
        };

        const saveModalChanges = () => {
            saveColumnConfig(localColumnConfig);
            setSettingsModalOpen(false);
        };

        const resetToDefaultInModal = () => {
            setLocalColumnConfig(JSON.parse(JSON.stringify(defaultColumnConfig)));
            setEditingColumnId(null);
            setTempColumnName('');
        };

        const ModalSortableColumn = React.memo(({ column, index }) => {
            const {
                attributes,
                listeners,
                setNodeRef,
                transform,
                transition,
                isDragging
            } = useSortable({
                id: column.id,
                disabled: column.fixed || index >= localColumnConfig.findIndex(col => col.fixed)
            });

            const style = {
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
                zIndex: isDragging ? 1000 : 1,
                cursor: column.fixed || index >= localColumnConfig.findIndex(col => col.fixed) ? 'not-allowed' : 'move'
            };

            const firstFixedIndex = localColumnConfig.findIndex(col => col.fixed);
            const isDraggable = !column.fixed && index < firstFixedIndex;

            return (
                <motion.div
                    ref={setNodeRef}
                    style={style}
                    {...(isDraggable ? attributes : {})}
                    {...(isDraggable ? listeners : {})}
                    className={`border-2 rounded-xl p-4 transition-all duration-200 ${column.fixed
                        ? 'bg-blue-50 border-blue-300 shadow-sm cursor-not-allowed'
                        : !isDraggable
                        ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                        : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300 cursor-move'
                        }`}
                    whileHover={{ scale: isDraggable ? 1.02 : 1 }}
                >
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {isDraggable && (
                                <div className="cursor-grab active:cursor-grabbing">
                                    <FiMove className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                {editingColumnId === column.id ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={tempColumnName}
                                            onChange={(e) => setTempColumnName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveColumnName(column.id);
                                                if (e.key === 'Escape') cancelEditingColumn();
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            autoFocus
                                            placeholder="Column name"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => saveColumnName(column.id)}
                                                className="flex-1 px-3 py-1.5 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <FiCheckCircle className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={cancelEditingColumn}
                                                className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </div>
                                </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-gray-800 text-sm truncate">
                                                {column.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                {column.fixed && (
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                                                        Fixed
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-500">
                                                    {column.items.length} item{column.items.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                        {!column.fixed && (
                                            <button
                                                onClick={() => startEditingColumn(column.id, column.name)}
                                                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded flex-shrink-0 ml-2"
                                                title="Edit column name"
                                            >
                                                <FiEdit className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        {!column.fixed && column.items.length === 0 && editingColumnId !== column.id && (
                            <button
                                onClick={() => {
                                    const newConfig = [...localColumnConfig];
                                    newConfig.splice(index, 1);
                                    setLocalColumnConfig(newConfig);
                                }}
                                className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1.5 rounded hover:bg-red-50 ml-2 flex-shrink-0"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Column Items with Drag & Drop */}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={(event) => setLocalActiveItemDragId(event.active.id)}
                        onDragEnd={(event) => handleModalItemDragEnd(event, index)}
                        onDragCancel={() => setLocalActiveItemDragId(null)}
                    >
                        <SortableContext
                            items={column.items.map(item => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2 mb-3 min-h-[60px]">
                                {column.items.map((item, itemIndex) => (
                                    <ModalSortableItem
                                        key={item.id}
                                        item={item}
                                        columnIndex={index}
                                        itemIndex={itemIndex}
                                        columnId={column.id}
                                        removeItem={removeItemFromColumnInModal}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                        
                        {/* Drag overlay for items */}
                        <DragOverlay>
                            {localActiveItemDragId ? (
                                <div className="bg-white border border-blue-400 shadow-lg rounded-lg px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <FiMove className="w-3 h-3 text-blue-400" />
                                        <span className="font-medium text-gray-700 text-sm">
                                            {availableFields.find(f => f.id === localActiveItemDragId)?.label || 'Item'}
                                        </span>
                                    </div>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>

                    {/* Add Field Dropdown */}
                    {!column.fixed && column.items.length < 5 && editingColumnId !== column.id && (
                        <select
                            value=""
                            onChange={(e) => {
                                if (e.target.value) {
                                    addItemToColumnInModal(index, e.target.value);
                                    e.target.value = '';
                                }
                            }}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                        >
                            <option value="">Add field...</option>
                            {availableFields
                                .filter(field => field.id !== 'actions')
                                .filter(field =>
                                    !localColumnConfig.some(col =>
                                        col.items.some(item => item.id === field.id)
                                    ) ||
                                    localColumnConfig[index].items.some(item => item.id === field.id)
                                )
                                .map(field => (
                                    <option key={field.id} value={field.id}>
                                        {field.label}
                                    </option>
                                ))}
                        </select>
                    )}

                    {/* Empty State */}
                    {!column.fixed && column.items.length === 0 && editingColumnId !== column.id && (
                        <div className="text-center py-4 text-gray-400 text-sm">
                            <p>Drag fields here or select from dropdown</p>
                        </div>
                    )}
                </motion.div>
            );
        });

        const ModalSortableItem = React.memo(({ item, columnIndex, itemIndex, columnId, removeItem }) => {
            const {
                attributes,
                listeners,
                setNodeRef,
                transform,
                transition,
                isDragging
            } = useSortable({ id: item.id });

            const style = {
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
                zIndex: isDragging ? 1000 : 1
            };

            return (
                <motion.div
                    ref={setNodeRef}
                    style={style}
                    {...attributes}
                    {...listeners}
                    className={`flex items-center justify-between bg-white border px-3 py-2 rounded-lg text-sm transition-all duration-200
                        ${isDragging ? 'shadow-lg border-blue-400' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: itemIndex * 0.05 }}
                >
                    <div className="flex items-center gap-2">
                        <FiMove className="w-3 h-3 text-gray-400" />
                        <span className="font-medium text-gray-700">{item.label}</span>
                    </div>
                    <motion.button
                        onClick={() => removeItem(columnIndex, itemIndex)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FiX className="w-3 h-3" />
                    </motion.button>
                </motion.div>
            );
        });

        const DraggableField = React.memo(({ field }) => {
            const {
                attributes,
                listeners,
                setNodeRef,
                transform,
                transition,
                isDragging
            } = useSortable({ id: field.id });

            const style = {
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
                zIndex: isDragging ? 1000 : 1
            };

            return (
                <motion.div
                    ref={setNodeRef}
                    style={style}
                    {...attributes}
                    {...listeners}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:shadow-md hover:border-gray-400 hover:from-white hover:to-gray-50 cursor-move text-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="flex items-center justify-center gap-2">
                        <FiMove className="w-3 h-3 text-gray-400" />
                        {field.label}
                    </div>
                </motion.div>
            );
        });

        return (
            <AnimatePresence>
                {settingsModalOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSettingsModalOpen(false)}
                    >
                        <motion.div
                            className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center shrink-0">
                                <div>
                                    <h2 className="text-xl font-bold">Table Column Settings</h2>
                                    <p className="text-blue-100 text-sm mt-1">Drag and drop to rearrange columns and items. Click on column names to edit them.</p>
                                </div>
                                <motion.button
                                    onClick={() => setSettingsModalOpen(false)}
                                    className="text-white hover:text-blue-200 transition-colors duration-200 p-1 rounded-lg hover:bg-blue-500"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiX className="w-6 h-6" />
                                </motion.button>
                            </div>

                            {/* Modal Content - Scrollable area */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragStart={(event) => setLocalActiveDragId(event.active.id)}
                                    onDragEnd={handleModalDragEnd}
                                    onDragCancel={() => setLocalActiveDragId(null)}
                                >
                                    <SortableContext
                                        items={localColumnConfig.map(column => column.id)}
                                        strategy={horizontalListSortingStrategy}
                                    >
                                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-6">
                                            {localColumnConfig.map((column, index) => (
                                                <ModalSortableColumn
                                                    key={column.id}
                                                    column={column}
                                                    index={index}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                    
                                    {/* Drag overlay for columns */}
                                    <DragOverlay>
                                        {localActiveDragId ? (
                                            <div className="bg-white border-2 border-blue-300 shadow-xl rounded-xl p-4 w-48">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <FiMove className="w-4 h-4 text-blue-400" />
                                                    <h3 className="font-bold text-gray-800 text-sm">
                                                        {localColumnConfig.find(col => col.id === localActiveDragId)?.name || 'Column'}
                                                    </h3>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {localColumnConfig.find(col => col.id === localActiveDragId)?.items.length || 0} items
                                                </div>
                                            </div>
                                        ) : null}
                                    </DragOverlay>
                                </DndContext>

                                {/* Add Column Button */}
                                <div className="mb-6">
                                    <motion.button
                                        onClick={addNewColumnInModal}
                                        className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-xl text-gray-700 font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-200 flex items-center gap-2"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <FiPlus className="w-4 h-4" />
                                        Add New Column
                                    </motion.button>
                                </div>

                                {/* Available Fields with Drag & Drop */}
                                <div className="border-t pt-6">
                                    <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                                        <FiGrid className="w-4 h-4 text-blue-600" />
                                        Available Fields (Drag to columns)
                                    </h3>
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={(event) => {
                                            const { active, over } = event;
                                            if (over && active.id !== over.id) {
                                                const columnIndex = localColumnConfig.findIndex(col => col.id === over.id);
                                                if (columnIndex !== -1 && !localColumnConfig[columnIndex].fixed) {
                                                    addItemToColumnInModal(columnIndex, active.id);
                                                }
                                            }
                                        }}
                                    >
                                        <SortableContext
                                            items={availableFields
                                                .filter(field => field.id !== 'actions')
                                                .filter(field =>
                                                    !localColumnConfig.some(col =>
                                                        col.items.some(item => item.id === field.id)
                                                    )
                                                )
                                                .map(field => field.id)}
                                            strategy={horizontalListSortingStrategy}
                                        >
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                                {availableFields
                                                    .filter(field => field.id !== 'actions')
                                                    .filter(field =>
                                                        !localColumnConfig.some(col =>
                                                            col.items.some(item => item.id === field.id)
                                                        )
                                                    )
                                                    .map(field => (
                                                        <DraggableField
                                                            key={field.id}
                                                            field={field}
                                                        />
                                                    ))}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="border-t px-6 py-4 bg-gray-50 shrink-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <motion.button
                                        onClick={resetToDefaultInModal}
                                        className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium
                                                 border border-gray-300 rounded-lg text-gray-700
                                                 hover:bg-gray-200 transition-all duration-200 hover:shadow-sm gap-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiRefreshCw className="w-4 h-4" />
                                        Reset to Default
                                    </motion.button>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <motion.button
                                            onClick={() => setSettingsModalOpen(false)}
                                            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium
                                                       border border-gray-300 rounded-lg text-gray-700
                                                       hover:bg-gray-200 transition-all duration-200 hover:shadow-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Cancel
                                        </motion.button>

                                        <motion.button
                                            onClick={saveModalChanges}
                                            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium
                                                       bg-gradient-to-r from-blue-600 to-blue-700 text-white
                                                       rounded-lg hover:from-blue-700 hover:to-blue-800
                                                       transition-all duration-200 hover:shadow-md shadow-sm gap-2"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FiSave className="w-4 h-4" />
                                            Save Changes
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    });

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
                <div className="h-full flex flex-col">
                    {/* Main Card - Professional Design */}
                    <motion.div
                        className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full mx-2 sm:mx-4 md:mx-8 my-3 md:my-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Card Header - Professional */}
                        <div className="border-b border-gray-200 px-3 md:px-4 py-3 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 md:gap-3">
                                <div className="w-full md:w-auto">
                                    <h5 className="text-base md:text-lg font-bold text-gray-800 mb-0.5">
                                        Client Management
                                    </h5>
                                    <p className="text-gray-500 text-xs">
                                        Manage your clients efficiently with multiple view options
                                    </p>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
                                    {/* Table/Cards Toggle and Search */}
                                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full">
                                        {/* Table/Cards Toggle */}
                                        <div className="flex items-center gap-2">
                                            <div className="md:hidden w-full">
                                                <TableViewSwitch viewMode={viewMode} setViewMode={setViewMode} />
                                            </div>
                                            <div className="hidden md:block">
                                                <TableViewSwitch viewMode={viewMode} setViewMode={setViewMode} />
                                            </div>
                                            
                                            {/* Search Input */}
                                            <div className="flex-1 md:flex-none md:min-w-[200px] lg:min-w-[250px]">
                                                <div className="relative">
                                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search clients..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm bg-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2">
                                            {/* Filter Dropdown */}
                                            <div className="dropdown-container relative">
                                                <motion.button
                                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium flex items-center gap-2 shadow-sm text-sm"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FiFilter className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Filter</span>
                                                </motion.button>

                                                <AnimatePresence>
                                                    {showFilterDropdown && (
                                                        <motion.div
                                                            className="absolute right-0 md:left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-3"
                                                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                                            transition={{ duration: 0.15 }}
                                                        >
                                                            {/* Status Filter */}
                                                            <div className="mb-3">
                                                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                                    Status
                                                                </label>
                                                                <select
                                                                    value={selectedStatus}
                                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                                    className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                                >
                                                                    <option value="">All Status</option>
                                                                    {statusOptions.map(status => (
                                                                        <option key={status.value} value={status.value}>
                                                                            {status.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            {/* Group Filter */}
                                                            <div className="mb-3">
                                                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                                    Group
                                                                </label>
                                                                <select
                                                                    value={selectedGroup}
                                                                    onChange={(e) => setSelectedGroup(e.target.value)}
                                                                    className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                                >
                                                                    <option value="">All Groups</option>
                                                                    {groupOptions.map(group => (
                                                                        <option key={group.value} value={group.value}>
                                                                            {group.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex justify-between gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedStatus('');
                                                                        setSelectedGroup('');
                                                                    }}
                                                                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-100"
                                                                >
                                                                    Reset
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setShowFilterDropdown(false);
                                                                        fetchClients(1, pagination.itemsPerPage);
                                                                    }}
                                                                    className="w-full px-2 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                                                >
                                                                    Apply
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Add Client Button */}
                                            <motion.button
                                                onClick={() => navigate('/client/create')}
                                                className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm whitespace-nowrap"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FiUserPlus className="w-4 h-4" />
                                            </motion.button>
                                            
                                            {/* 3 Dot Menu */}
                                            <div className="relative dropdown-container">
                                                <motion.button
                                                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition shadow-sm"
                                                    whileHover={{ scale: 1.08 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FiMoreVertical className="w-4 h-4 text-gray-700" />
                                                </motion.button>

                                                <AnimatePresence>
                                                    {showMoreMenu && (
                                                        <motion.div
                                                            className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                                                            initial={{ opacity: 0, y: -8 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -8 }}
                                                        >
                                                            {/* Export Section */}
                                                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                                                                Export
                                                            </div>

                                                            <button
                                                                onClick={() => handleExport('pdf')}
                                                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                                            >
                                                                <PiFilePdfDuotone className="w-4 h-4 mr-2 text-red-500" />
                                                                Export as PDF
                                                            </button>

                                                            <button
                                                                onClick={() => handleExport('excel')}
                                                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                                            >
                                                                <PiMicrosoftExcelLogoDuotone className="w-4 h-4 mr-2 text-green-500" />
                                                                Export as Excel
                                                            </button>

                                                            <button
                                                                onClick={() => handleExport('whatsapp')}
                                                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                                            >
                                                                <FaWhatsapp className="w-4 h-4 mr-2 text-green-500" />
                                                                Share via WhatsApp
                                                            </button>

                                                            <button
                                                                onClick={() => handleExport('email')}
                                                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                                            >
                                                                <AiOutlineMail className="w-4 h-4 mr-2 text-blue-500" />
                                                                Share via Email
                                                            </button>

                                                            {/* Divider */}
                                                            <div className="h-px bg-gray-200 my-1" />

                                                            {/* Settings */}
                                                            <button
                                                                onClick={() => {
                                                                    if (viewMode === 'table') {
                                                                        setSettingsModalOpen(true);
                                                                        setShowMoreMenu(false);
                                                                    }
                                                                }}
                                                                className={`flex items-center w-full px-3 py-2 text-sm ${viewMode === 'table' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'}`}
                                                                disabled={viewMode !== 'table'}
                                                            >
                                                                <FiSettings className="w-4 h-4 mr-2" />
                                                                Settings {viewMode !== 'table' && '(Table view only)'}
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Client Display Area */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {viewMode === 'table' ? (
                                <ClientTable
                                    clients={filteredClients}
                                    selectedClients={selectedClients}
                                    handleClientSelect={handleClientSelect}
                                    selectAll={selectAll}
                                    handleSelectAll={handleSelectAll}
                                    columnConfig={columnConfig}
                                    renderCellContent={renderCellContent}
                                    loading={loading}
                                    toggleRowDropdown={toggleRowDropdown}
                                    activeRowDropdown={activeRowDropdown}
                                    setActiveRowDropdown={setActiveRowDropdown}
                                    handleStatusChange={handleStatusChange}
                                    openStatusModal={openStatusModal}
                                    navigate={navigate}
                                    handleExport={handleExport}
                                    showFirmsModal={openFirmsModal}
                                />
                            ) : (
                                <ClientCards
                                    clients={filteredClients}
                                    selectedClients={selectedClients}
                                    handleClientSelect={handleClientSelect}
                                    columnConfig={columnConfig}
                                    renderCellContent={renderCellContent}
                                    loading={loading}
                                    toggleRowDropdown={toggleRowDropdown}
                                    activeRowDropdown={activeRowDropdown}
                                    setActiveRowDropdown={setActiveRowDropdown}
                                    handleStatusChange={handleStatusChange}
                                    statusOptions={statusOptions}
                                    openStatusModal={openStatusModal}
                                    navigate={navigate}
                                    handleExport={handleExport}
                                    showFirmsModal={openFirmsModal}
                                />
                            )}
                        </div>

                        {/* Footer with Pagination */}
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                            itemsPerPage={pagination.itemsPerPage}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />

                        {/* Loading indicator for infinite scroll */}
                        {isFetchingMore && (
                            <div className="py-3 text-center">
                                <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                                    <FiLoader className="w-4 h-4 animate-spin" />
                                    Loading more clients...
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Floating Action Button for Selected Clients */}
            <AnimatePresence>
                {selectedClients.size > 0 && (
                    <motion.div
                        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                            <motion.button
                                className="px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 shadow-xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    // console.log("Send message to:", [...selectedClients]);
                                }}
                            >
                                <FiMail className="w-4 h-4" />
                                <span className="hidden sm:inline">Send Message</span>
                                <span className="sm:hidden">({selectedClients.size})</span>
                            </motion.button>
                            
                            <motion.button
                                className="px-3 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-semibold hover:from-green-700 hover:to-green-800 flex items-center gap-2 shadow-xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleExport('selected')}
                            >
                                <FiDownload className="w-4 h-4" />
                                <span className="hidden sm:inline">Export</span>
                                <span className="sm:hidden">({selectedClients.size})</span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Modal */}
            <SettingsModal />

            {/* Status Change Modal */}
            <StatusChangeModal
                isOpen={statusModal.open}
                onClose={closeStatusModal}
                clientId={statusModal.clientId}
                currentStatus={statusModal.currentStatus}
                onStatusChange={handleStatusChange}
                statusOptions={statusOptions}
            />

            {/* Firms Details Modal - UPDATED with professional alignment */}
            <FirmsDetailsModal
                isOpen={firmsModal.open}
                onClose={closeFirmsModal}
                firms={firmsModal.firms}
                clientName={firmsModal.clientName}
            />

            {/* Export Confirmation Modal */}
            <AnimatePresence>
                {exportModal.open && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-lg p-4 max-w-sm w-full mx-auto"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <PiExportBold className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-800 mb-2">
                                    Exporting {exportModal.type.toUpperCase()}
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm">
                                    Your {exportModal.type} export is being processed...
                                </p>
                                <div className="flex justify-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {deleteModal && <DeleteConfirmationModal
                title="Client Delete"
                onConfirm={(res) => {
                    SetDeleteModal(false)
                }}
            />
            }
        </div>
    );
};

export default ViewClients;