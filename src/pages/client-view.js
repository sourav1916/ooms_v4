import React, { useState, useEffect } from 'react';
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

// Client Table Component - Mobile Responsive with SL No column
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
    handleStatusChange
}) => {
    const navigate = useNavigate();

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
                            <div key={itemIndex} className="min-h-[1.25rem] flex items-center">
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    // Mobile client card for table view
    const MobileClientCard = ({ client, index }) => {
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
                            checked={selectedClients.has(client.username)}
                            onChange={() => handleClientSelect(client.username)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-400 focus:ring-blue-500"
                        />
                        <div className="font-bold text-gray-800 text-sm w-4">{index + 1}</div>
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <FiUser className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800 text-sm">{client.name}</div>
                            <div className="text-xs text-gray-500">@{client.username}</div>
                        </div>
                    </div>
                    {/* Vertical 3-dot menu for mobile - Updated to vertical style */}
                    <div className="relative">
                        <motion.button
                            onClick={() => toggleRowDropdown(client.id)}
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
                            {activeRowDropdown === client.id && (
                                <motion.div
                                    className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                >
                                    <button
                                        onClick={() => {
                                            setActiveRowDropdown(null);
                                            navigate(`/client/profile`);
                                        }}
                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <FiEye className="mr-3" />
                                        View Details
                                    </button>

                                    <button
                                        onClick={() => {
                                            setActiveRowDropdown(null);
                                            navigate(`/client/edit/${client.id}`);
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
                                            // delete modal
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
                            <span>{client.mobile}</span>
                        </div>
                        <div className={`text-sm font-semibold ${client.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ₹{Math.abs(client.balance).toLocaleString()}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <FiUsers className="w-3 h-3 text-gray-400" />
                        <span>{client.firm_list.length} firms</span>
                    </div>

                    <div className="text-xs text-gray-500">
                        Guardian: {client.guardian_name}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Table Header - Fixed for desktop only */}
            <div className="hidden md:block border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                <div className="flex items-center min-w-max">
                    {/* Checkbox Column */}
                    <div className="w-10 p-3 flex-shrink-0">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-blue-600 rounded border-gray-400 focus:ring-blue-500"
                        />
                    </div>

                    {/* SL No Column - Added */}
                    <div className="w-10 p-3 font-bold text-gray-700 text-sm flex-shrink-0 text-center">
                        SL No
                    </div>

                    {/* Dynamic Columns - Equal width distribution */}
                    {columnConfig.map(column => (
                        <div
                            key={column.id}
                            className="p-3 font-semibold text-gray-700 text-sm flex-1 min-w-0 text-center"
                            style={{ flex: '1 1 0%' }}
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
                                <MobileClientCard key={client.id} client={client} index={index} />
                            ))}
                        </div>

                        {/* Desktop view - table */}
                        <div className="hidden md:block">
                            {clients.map((client, index) => (
                                <motion.div
                                    key={client.id}
                                    className="flex items-center border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    {/* Checkbox */}
                                    <div className="w-10 p-3 flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={selectedClients.has(client.username)}
                                            onChange={() => handleClientSelect(client.username)}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-400 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* SL No - Bold - Added */}
                                    <div className="w-10 p-3 flex-shrink-0 text-center">
                                        <span className="font-bold text-gray-800 text-sm">
                                            {index + 1}
                                        </span>
                                    </div>

                                    {/* Dynamic Columns - Equal width distribution */}
                                    {columnConfig.map(column => (
                                        <div 
                                            key={column.id} 
                                            className="p-3 flex-1 min-w-0 text-center"
                                            style={{ flex: '1 1 0%' }}
                                        >
                                            <div className="space-y-1">
                                                {column.items.map(item => (
                                                    <div key={item.id} className="min-h-[1.25rem] flex items-center justify-center">
                                                        {renderCellContent(client, item.id)}
                                                    </div>
                                                ))}
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

// Client Cards Component - Mobile Responsive with 3-dot menu
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
    statusOptions
}) => {
    const navigate = useNavigate();

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700';
            case 'INACTIVE': return 'bg-red-100 text-red-700';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Get status border color
    const getStatusBorderColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'border-green-300';
            case 'INACTIVE': return 'border-red-300';
            case 'PENDING': return 'border-yellow-300';
            default: return 'border-gray-300';
        }
    };

    // Format balance
    const formatBalance = (balance) => {
        return `₹${Math.abs(balance).toLocaleString()}`;
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
                    {clients.map((client, index) => (
                        <motion.div
                            key={client.id}
                            className={`bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden ${selectedClients.has(client.username) ? 'ring-2 ring-blue-500' : ''}`}
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
                                                checked={selectedClients.has(client.username)}
                                                onChange={() => handleClientSelect(client.username)}
                                                className="w-3.5 h-3.5 text-blue-600 rounded border-gray-400 focus:ring-blue-500 flex-shrink-0"
                                            />
                                            <div className="font-bold text-gray-800 text-xs w-4">{index + 1}</div>
                                            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                                                <FiUser className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-800 text-xs truncate">{client.name}</h3>
                                                <p className="text-xs text-gray-500 truncate">@{client.username}</p>
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-sm truncate">{client.guardian_name}</h4>
                                        <p className="text-gray-600 text-xs truncate">{client.firm_list.length} firms</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {/* Vertical 3-dot menu for cards - Updated to vertical style */}
                                        <div className="relative">
                                            <motion.button
                                                onClick={() => toggleRowDropdown(`card-${client.id}`)}
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
                                                {activeRowDropdown === `card-${client.id}` && (
                                                    <motion.div
                                                        className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                                                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                setActiveRowDropdown(null);
                                                                navigate(`/client/profile`);
                                                            }}
                                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <FiEye className="mr-3" />
                                                            View Details
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setActiveRowDropdown(null);
                                                                navigate(`/client/edit/${client.id}`);
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
                                                                // delete modal
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

                            {/* Card Body - Essential information with status dropdown */}
                            <div className="p-3">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-gray-700 text-xs">
                                            <FiPhone className="w-3 h-3 text-gray-400" />
                                            <span>{client.mobile}</span>
                                        </div>
                                        <div className={`text-xs font-semibold ${client.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {formatBalance(client.balance)}
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-700">
                                        <div className="font-medium mb-1">Firms:</div>
                                        {client.firm_list.map((firm, idx) => (
                                            <div key={idx} className="text-xs bg-gray-50 rounded p-1 border border-gray-200 mb-1">
                                                <div className="font-semibold">{firm.firm_name}</div>
                                                <div className="text-gray-600">PAN: {firm.pan} • File: {firm.file_no}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Status Dropdown */}
                                    <div className="pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs font-medium text-gray-600">Status:</span>
                                            <div className="flex-1">
                                                <select
                                                    value={client.status}
                                                    onChange={(e) => handleStatusChange(client.id, e.target.value)}
                                                    className={`w-full px-2 py-1 text-xs border ${getStatusBorderColor(client.status)} rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none transition-all font-medium
                                                        ${client.status === 'ACTIVE'
                                                            ? 'text-green-700'
                                                            : client.status === 'INACTIVE'
                                                                ? 'text-red-700'
                                                                : 'text-yellow-700'
                                                        }
                                                    `}
                                                >
                                                    {statusOptions.map((status) => (
                                                        <option key={status.value} value={status.value}>
                                                            {status.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
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
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
    const [isMobile, setIsMobile] = useState(false);

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
        { id: 'firm_list', label: 'Firms', type: 'array' },
        { id: 'pan', label: 'PAN', type: 'text' },
        { id: 'file_no', label: 'File No', type: 'text' },
        { id: 'status', label: 'Status', type: 'status' },
        { id: 'actions', label: 'Actions', type: 'actions' }
    ];

    // Default column configuration - SEPARATED STATUS AND ACTIONS
    const defaultColumnConfig = [
        {
            id: '1',
            name: 'Client Info',
            items: [
                { id: 'name', label: 'Client Name' },
                { id: 'guardian_name', label: 'Guardian Name' },
                { id: 'username', label: 'Username' }
            ]
        },
        {
            id: '2',
            name: 'Contact',
            items: [
                { id: 'mobile', label: 'Mobile' }
            ]
        },
        {
            id: '3',
            name: 'Firms',
            items: [
                { id: 'firm_list', label: 'Firm Details' },
                { id: 'firm_count', label: 'Total Firms' }
            ]
        },
        {
            id: '4',
            name: 'Financial',
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

    // Client data
    const [clients, setClients] = useState([
        {
            id: '1',
            username: 'client001',
            name: 'John Doe',
            guardian_name: 'Robert Doe',
            mobile: '9876543210',
            balance: -5000,
            status: 'ACTIVE',
            firm_list: [
                { firm_name: 'ABC Corp', pan: 'ABCDE1234F', file_no: 'FN001' },
                { firm_name: 'Doe Enterprises', pan: 'DOEAB5678G', file_no: 'FN002' }
            ]
        },
        {
            id: '2',
            username: 'client002',
            name: 'Jane Smith',
            guardian_name: 'William Smith',
            mobile: '9876543211',
            balance: 15000,
            status: 'ACTIVE',
            firm_list: [
                { firm_name: 'XYZ Solutions', pan: 'XYZAB9012H', file_no: 'FN003' }
            ]
        },
        {
            id: '3',
            username: 'client003',
            name: 'Mike Johnson',
            guardian_name: 'Thomas Johnson',
            mobile: '9876543212',
            balance: -2500,
            status: 'INACTIVE',
            firm_list: [
                { firm_name: 'Global Tech', pan: 'GLOTI3456J', file_no: 'FN004' }
            ]
        },
        {
            id: '4',
            username: 'client004',
            name: 'Sarah Wilson',
            guardian_name: 'James Wilson',
            mobile: '9876543213',
            balance: 7500,
            status: 'ACTIVE',
            firm_list: [
                { firm_name: 'Wilson & Co', pan: 'WILS5678K', file_no: 'FN005' },
                { firm_name: 'Tech Innovators', pan: 'TECH9012L', file_no: 'FN006' }
            ]
        },
        {
            id: '5',
            username: 'client005',
            name: 'David Brown',
            guardian_name: 'Richard Brown',
            mobile: '9876543214',
            balance: -12000,
            status: 'PENDING',
            firm_list: [
                { firm_name: 'Brown Industries', pan: 'BRWN3456M', file_no: 'FN007' }
            ]
        }
    ]);

    // Stats data
    const [clientStats] = useState({
        total: 156,
        active: 142,
        inactive: 14,
        withBalance: 89
    });

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
    const handleClientSelect = (username) => {
        const newSelected = new Set(selectedClients);
        if (newSelected.has(username)) {
            newSelected.delete(username);
        } else {
            newSelected.add(username);
        }
        setSelectedClients(newSelected);
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedClients(new Set());
        } else {
            const allUsernames = new Set(filteredClients.map(client => client.username));
            setSelectedClients(allUsernames);
        }
        setSelectAll(!selectAll);
    };

    // Format balance
    const formatBalance = (balance) => {
        return `₹${Math.abs(balance).toLocaleString()}`;
    };

    // Handle status change
    const handleStatusChange = (clientId, newStatus) => {
        setClients(prev => prev.map(client =>
            client.id === clientId ? { ...client, status: newStatus } : client
        ));
    };

    // Filter clients based on search and filters
    const filteredClients = clients.filter(client => {
        const matchesSearch = searchQuery === '' ||
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.mobile.includes(searchQuery) ||
            client.firm_list.some(firm =>
                firm.firm_name.toLowerCase().includes(searchQuery.toLowerCase())
            );

        const matchesStatus = selectedStatus === '' || client.status === selectedStatus;
        const matchesGroup = selectedGroup === ''; // Add group filtering logic if needed

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
        // Don't remove fixed columns (Status and Actions)
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
        const targetColumn = columnConfig[newIndex];
        
        // Find the index of the first fixed column
        const firstFixedIndex = columnConfig.findIndex(col => col.fixed);
        
        // Rules for dragging:
        // 1. Fixed columns cannot be dragged
        // 2. Cannot drag non-fixed columns to positions after fixed columns
        // 3. Cannot drag fixed columns at all
        if (sourceColumn.fixed) {
            setActiveDragId(null);
            return;
        }
        
        if (newIndex >= firstFixedIndex && newIndex < columnConfig.length) {
            // Trying to drag into or after fixed columns
            // Only allow dragging to positions before the first fixed column
            if (firstFixedIndex > 0) {
                const newConfig = arrayMove(columnConfig, oldIndex, firstFixedIndex - 1);
                saveColumnConfig(newConfig);
            }
        } else {
            // Normal drag within allowed area
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
        
        // Find the index where to insert (before the first fixed column)
        const firstFixedIndex = newConfig.findIndex(col => col.fixed);
        const insertIndex = firstFixedIndex >= 0 ? firstFixedIndex : newConfig.length - 1;
        
        newConfig.splice(insertIndex, 0, {
            id: newColumnId,
            name: `Column ${newConfig.length - 1}`,
            items: []
        });
        saveColumnConfig(newConfig);
    };

    // Sortable Column Component - Fixed version
    const SortableColumn = React.memo(({ column, index }) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging
        } = useSortable({
            id: column.id,
            disabled: column.fixed || index >= columnConfig.findIndex(col => col.fixed)
        });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.5 : 1,
            zIndex: isDragging ? 1000 : 1,
            cursor: column.fixed || index >= columnConfig.findIndex(col => col.fixed) ? 'not-allowed' : 'move'
        };

        // Find the first fixed column index
        const firstFixedIndex = columnConfig.findIndex(col => col.fixed);
        
        // Check if this column is in the draggable zone
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
                        <h3 className="font-bold text-gray-800 text-sm">
                            {column.name}
                            {column.fixed && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                    Fixed
                                </span>
                            )}
                            {!column.fixed && !isDraggable && (
                                <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">
                                    Locked
                                </span>
                            )}
                        </h3>
                    </div>
                    {!column.fixed && column.items.length === 0 && isDraggable && (
                        <button
                            onClick={() => {
                                const colIndex = columnConfig.findIndex(col => col.id === column.id);
                                if (colIndex !== -1) removeColumn(colIndex);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Column Items with Drag & Drop */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={(event) => setActiveItemDragId(event.active.id)}
                    onDragEnd={(event) => handleItemDragEnd(event, index)}
                    onDragCancel={() => setActiveItemDragId(null)}
                >
                    <SortableContext
                        items={column.items.map(item => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2 mb-3 min-h-[60px]">
                            {column.items.map((item, itemIndex) => (
                                <SortableItem
                                    key={item.id}
                                    item={item}
                                    columnIndex={index}
                                    itemIndex={itemIndex}
                                    columnId={column.id}
                                />
                            ))}
                        </div>
                    </SortableContext>
                    
                    {/* Drag overlay for items */}
                    <DragOverlay>
                        {activeItemDragId ? (
                            <div className="bg-white border border-blue-400 shadow-lg rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <FiMove className="w-3 h-3 text-blue-400" />
                                    <span className="font-medium text-gray-700 text-sm">
                                        {availableFields.find(f => f.id === activeItemDragId)?.label || 'Item'}
                                    </span>
                                </div>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>

                {/* Add Field Dropdown (only for non-fixed columns with space) */}
                {!column.fixed && column.items.length < 5 && (
                    <select
                        value=""
                        onChange={(e) => {
                            if (e.target.value) {
                                addItemToColumn(index, e.target.value);
                                e.target.value = '';
                            }
                        }}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    >
                        <option value="">Add field...</option>
                        {availableFields
                            .filter(field =>
                                !columnConfig.some(col =>
                                    col.items.some(item => item.id === field.id)
                                )
                            )
                            .map(field => (
                                <option key={field.id} value={field.id}>
                                    {field.label}
                                </option>
                            ))}
                    </select>
                )}

                {/* Empty State */}
                {!column.fixed && column.items.length === 0 && (
                    <div className="text-center py-4 text-gray-400 text-sm">
                        <p>Drag fields here or select from below</p>
                    </div>
                )}
            </motion.div>
        );
    });

    // Sortable Item Component
    const SortableItem = React.memo(({ item, columnIndex, itemIndex, columnId }) => {
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
                    onClick={() => removeItemFromColumn(columnIndex, itemIndex)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FiX className="w-3 h-3" />
                </motion.button>
            </motion.div>
        );
    });

    // Render cell content based on field type - Updated for compact layout and centered
    const renderCellContent = (client, fieldId) => {
        switch (fieldId) {
            case 'name':
                return (
                    <div className="flex items-center gap-2 justify-center">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <FiUser className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-sm">
                                {client.name}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                                @{client.username}
                            </div>
                        </div>
                    </div>
                );
            case 'guardian_name':
                return (
                    <span className="text-gray-700 font-medium text-sm">
                        {client.guardian_name || '-'}
                    </span>
                );
            case 'username':
                return (
                    <span className="text-gray-700 font-medium bg-gray-100 px-2 py-0.5 rounded text-xs">
                        {client.username}
                    </span>
                );
            case 'mobile':
                return (
                    <div className="flex items-center gap-2 text-gray-700 font-medium text-sm justify-center">
                        <FiPhone className="w-3 h-3 text-gray-400" />
                        {client.mobile}
                    </div>
                );
            case 'balance':
                return (
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${client.balance < 0
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                        {client.balance < 0 ? (
                            <FiTrendingDown className="w-3 h-3" />
                        ) : (
                            <FiTrendingUp className="w-3 h-3" />
                        )}
                        {formatBalance(client.balance)}
                    </div>
                );
            case 'firm_count':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        {client.firm_list.length} {client.firm_list.length === 1 ? 'firm' : 'firms'}
                    </span>
                );
            case 'firm_list':
                return (
                    <div className="space-y-1">
                        {client.firm_list.slice(0, 2).map((firm, idx) => (
                            <div key={idx} className="bg-gray-50 rounded p-1 border border-gray-200">
                                <div className="font-semibold text-gray-800 text-xs">
                                    {firm.firm_name}
                                </div>
                                <div className="text-xs text-gray-600 flex gap-1 mt-0.5">
                                    <span>PAN: {firm.pan}</span>
                                    <span>•</span>
                                    <span>File: {firm.file_no}</span>
                                </div>
                            </div>
                        ))}
                        {client.firm_list.length > 2 && (
                            <div className="text-xs text-gray-500 font-medium">
                                +{client.firm_list.length - 2} more
                            </div>
                        )}
                    </div>
                );
            case 'status':
                return (
                    <select
                        value={client.status}
                        onChange={(e) => handleStatusChange(client.id, e.target.value)}
                        className={`w-full px-2 py-1 text-xs border rounded
                            focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none transition-all font-medium
                            ${client.status === 'ACTIVE'
                                ? 'border-green-300 text-green-700'
                                : client.status === 'INACTIVE'
                                    ? 'border-red-300 text-red-700'
                                    : 'border-yellow-300 text-yellow-700'
                            }
                        `}
                    >
                        {statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                );
            case 'actions':
                return (
                    <div className="relative dropdown-container flex justify-center">
                        {/* Vertical 3-dot button - Updated to match TaskDisplay */}
                        <motion.button
                            onClick={() => toggleRowDropdown(client.id)}
                            className="w-8 h-8 flex flex-col items-center justify-center rounded-full
                           bg-gray-100 hover:bg-gray-200 transition-colors space-y-0.5"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                        </motion.button>

                        {/* Professional Dropdown - Compact */}
                        <AnimatePresence>
                            {activeRowDropdown === client.id && (
                                <motion.div
                                    className="absolute right-0 mt-1 w-52 bg-white rounded-lg
                                   shadow-xl border border-gray-200 z-50 overflow-hidden"
                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                setActiveRowDropdown(null);
                                                navigate(`/client/profile`);
                                            }}
                                            className="flex items-center w-full px-3 py-2 text-sm
                                           text-gray-700 hover:bg-blue-50 transition-colors"
                                        >
                                            <FiEye className="mr-2 text-blue-600 w-4 h-4" />
                                            View Details
                                        </button>

                                        <button
                                            onClick={() => {
                                                setActiveRowDropdown(null);
                                                navigate(`/client/edit/${client.id}`);
                                            }}
                                            className="flex items-center w-full px-3 py-2 text-sm
                                           text-gray-700 hover:bg-green-50 transition-colors"
                                        >
                                            <FiEdit className="mr-2 text-green-600 w-4 h-4" />
                                            Edit Client
                                        </button>

                                        <button
                                            onClick={() => {
                                                setActiveRowDropdown(null);
                                            }}
                                            className="flex items-center w-full px-3 py-2 text-sm
                                           text-gray-700 hover:bg-purple-50 transition-colors"
                                        >
                                            <FiMessageSquare className="mr-2 text-purple-600 w-4 h-4" />
                                            Send Message
                                        </button>

                                        <div className="border-t my-1"></div>

                                        <button
                                            onClick={() => {
                                                setActiveRowDropdown(null);
                                                SetDeleteModal(true);
                                            }}
                                            className="flex items-center w-full px-3 py-2 text-sm
                                           text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <FiTrash2 className="mr-2 w-4 h-4" />
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

    // Settings Modal Component with Drag & Drop - Fixed rerender
    const SettingsModal = React.memo(() => {
        const [localColumnConfig, setLocalColumnConfig] = useState(columnConfig);
        const [localActiveDragId, setLocalActiveDragId] = useState(null);
        const [localActiveItemDragId, setLocalActiveItemDragId] = useState(null);

        // Initialize with current column config - Fixed to prevent rerender
        useEffect(() => {
            if (settingsModalOpen) {
                setLocalColumnConfig(JSON.parse(JSON.stringify(columnConfig)));
                setLocalActiveDragId(null);
                setLocalActiveItemDragId(null);
            }
        }, [columnConfig, settingsModalOpen]);

        // Handle drag end for columns in modal
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
            
            // Find the index of the first fixed column
            const firstFixedIndex = localColumnConfig.findIndex(col => col.fixed);
            
            // Rules for dragging:
            // 1. Fixed columns cannot be dragged
            // 2. Cannot drag non-fixed columns to positions after fixed columns
            if (sourceColumn.fixed) {
                setLocalActiveDragId(null);
                return;
            }
            
            if (newIndex >= firstFixedIndex && newIndex < localColumnConfig.length) {
                // Trying to drag into or after fixed columns
                // Only allow dragging to positions before the first fixed column
                if (firstFixedIndex > 0) {
                    const newConfig = arrayMove(localColumnConfig, oldIndex, firstFixedIndex - 1);
                    setLocalColumnConfig(newConfig);
                }
            } else {
                // Normal drag within allowed area
                const newConfig = arrayMove(localColumnConfig, oldIndex, newIndex);
                setLocalColumnConfig(newConfig);
            }
            
            setLocalActiveDragId(null);
        };

        // Handle drag end for items within a column in modal
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

        // Add item to column in modal
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

        // Remove item from column in modal
        const removeItemFromColumnInModal = (columnIndex, itemIndex) => {
            const newConfig = [...localColumnConfig];
            newConfig[columnIndex].items.splice(itemIndex, 1);
            setLocalColumnConfig(newConfig);
        };

        // Add new column in modal
        const addNewColumnInModal = () => {
            const newConfig = [...localColumnConfig];
            const newColumnId = (Date.now()).toString();
            
            // Find the index where to insert (before the first fixed column)
            const firstFixedIndex = newConfig.findIndex(col => col.fixed);
            const insertIndex = firstFixedIndex >= 0 ? firstFixedIndex : newConfig.length - 1;
            
            newConfig.splice(insertIndex, 0, {
                id: newColumnId,
                name: `Column ${newConfig.length - 1}`,
                items: []
            });
            setLocalColumnConfig(newConfig);
        };

        // Save changes from modal
        const saveModalChanges = () => {
            saveColumnConfig(localColumnConfig);
            setSettingsModalOpen(false);
        };

        // Reset to default in modal
        const resetToDefaultInModal = () => {
            setLocalColumnConfig(JSON.parse(JSON.stringify(defaultColumnConfig)));
        };

        // Sortable Column Component for Modal
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

            // Find the first fixed column index
            const firstFixedIndex = localColumnConfig.findIndex(col => col.fixed);
            
            // Check if this column is in the draggable zone
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
                            <h3 className="font-bold text-gray-800 text-sm">
                                {column.name}
                                {column.fixed && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                        Fixed
                                    </span>
                                )}
                                {!column.fixed && !isDraggable && (
                                    <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">
                                        Locked
                                    </span>
                                )}
                            </h3>
                        </div>
                        {!column.fixed && column.items.length === 0 && isDraggable && (
                            <button
                                onClick={() => {
                                    const newConfig = [...localColumnConfig];
                                    newConfig.splice(index, 1);
                                    setLocalColumnConfig(newConfig);
                                }}
                                className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded hover:bg-red-50"
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

                    {/* Add Field Dropdown (only for non-fixed columns with space) */}
                    {!column.fixed && column.items.length < 5 && (
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
                                .filter(field =>
                                    !localColumnConfig.some(col =>
                                        col.items.some(item => item.id === field.id)
                                    )
                                )
                                .map(field => (
                                    <option key={field.id} value={field.id}>
                                        {field.label}
                                    </option>
                                ))}
                        </select>
                    )}

                    {/* Empty State */}
                    {!column.fixed && column.items.length === 0 && (
                        <div className="text-center py-4 text-gray-400 text-sm">
                            <p>Drag fields here or select from below</p>
                        </div>
                    )}
                </motion.div>
            );
        });

        // Sortable Item Component for Modal
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

        // Draggable Field Component for Available Fields
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
                            className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold">Table Column Settings</h2>
                                    <p className="text-blue-100 text-sm mt-1">Drag and drop to rearrange columns and items</p>
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

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto max-h-[70vh]">
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
                                                // Find which column was dropped on
                                                const columnIndex = localColumnConfig.findIndex(col => col.id === over.id);
                                                if (columnIndex !== -1 && !localColumnConfig[columnIndex].fixed) {
                                                    addItemToColumnInModal(columnIndex, active.id);
                                                }
                                            }
                                        }}
                                    >
                                        <SortableContext
                                            items={availableFields
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
                            <div className="border-t px-6 py-4 bg-gray-50">
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
                    {/* Main Card - Mobile responsive and compact */}
                    <motion.div
                        className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full mx-2 sm:mx-4 md:mx-8 my-3 md:my-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Card Header - Responsive and compact */}
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
                                            
                                            {/* Search Input - Mobile optimized */}
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

                                        {/* Action Buttons - Mobile optimized */}
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
                                                                    onClick={() => setShowFilterDropdown(false)}
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
                                                {/* <span className="hidden sm:inline">Add Client</span> */}
                                            </motion.button>
                                            
                                            {/* 3 Dot Menu (Export + Settings) */}
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

                                                            {/* Settings - Only enabled in table view */}
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
                                />
                            )}
                        </div>

                        {/* Footer - Mobile responsive and compact */}
                        <div className="border-t border-gray-200 px-3 md:px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                    <span className="font-semibold text-gray-800 text-sm">
                                        Showing {filteredClients.length} of {clients.length} clients
                                    </span>
                                    <div className="text-sm text-gray-600">
                                        {selectedClients.size} client(s) selected
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    {/* Action Buttons in Footer - Mobile responsive */}
                                    <motion.button
                                        className="px-2 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-medium transition-all duration-200 hover:from-blue-700 hover:to-blue-800 flex items-center gap-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={selectedClients.size === 0}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiMail className="w-3 h-3" />
                                        <span className="hidden sm:inline">Send Message</span>
                                    </motion.button>
                                    
                                    <motion.button
                                        className="px-2 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-xs font-medium transition-all duration-200 hover:from-green-700 hover:to-green-800 flex items-center gap-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={selectedClients.size === 0}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiDownload className="w-3 h-3" />
                                        <span className="hidden sm:inline">Export Selected</span>
                                    </motion.button>
                                    
                                    <motion.button
                                        className="px-2 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-xs font-medium transition-all duration-200 hover:from-purple-700 hover:to-purple-800 flex items-center gap-1 shadow-sm"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiPrinter className="w-3 h-3" />
                                        <span className="hidden sm:inline">Print All</span>
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Floating Action Button for Selected Clients - Mobile Optimized */}
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
                                    console.log("Send message to:", [...selectedClients]);
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

            {/* Export Confirmation Modal - Compact */}
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
                    console.log("Confirmed:", res);
                }}
            />
            }
        </div>
    );
};

export default ViewClients;