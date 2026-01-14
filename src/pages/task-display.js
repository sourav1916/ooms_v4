//previous code 
import React, { useState, useEffect } from 'react';
import { Sidebar, Header } from '../components/header';
import { useNavigate } from 'react-router-dom';
import { FiMoreHorizontal } from 'react-icons/fi';
import SettingsModal from "../components/SettingModal";
import {
    FiUsers,
    FiBriefcase,
    FiCalendar,
    FiDollarSign,
    FiUserCheck,
    FiUserPlus,
    FiFileText,
    FiPlus,
    FiSearch,
    FiRefreshCw,
    FiPaperclip,
    FiX,
    FiMic,
    FiStopCircle,
    FiDownload,
    FiTrash2,
    FiArrowRight,
    FiArrowLeft,
    FiUser,
    FiLoader,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiMoreVertical,
    FiInfo,
    FiEdit,
    FiEye,
    FiSettings,
    FiGrid,
    FiMail,
    FiPrinter,
    FiPhone,
    FiFilter,
    FiMessageSquare,
    FiMove,
    FiSave,
    FiList,
    FiChevronDown,
    FiChevronUp
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

// View Mode Toggle Component - Updated for header placement
const TableViewSwitch = ({ viewMode, setViewMode }) => {
    return (
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <motion.button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FiList className="w-3.5 h-3.5" />
                <span className="text-xs font-medium hidden sm:inline">Table</span>
            </motion.button>
            
            <motion.button
                onClick={() => setViewMode('card')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${viewMode === 'card' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FiGrid className="w-3.5 h-3.5" />
                <span className="text-xs font-medium hidden sm:inline">Cards</span>
            </motion.button>
        </div>
    );
};

// Task Table Component - Mobile Responsive
const TaskTable = ({ 
    tasks, 
    selectedTasks, 
    handleTaskSelect, 
    selectAll, 
    handleSelectAll, 
    columnConfig, 
    renderCellContent,
    loading,
    toggleRowDropdown,
    activeRowDropdown,
    handleGetInOut,
    setActiveRowDropdown,
    handleStatusChange
}) => {
    // Skeleton loader
    const SkeletonRow = () => (
        <div className="flex items-center border-b border-gray-100 animate-pulse p-4 md:p-4">
            <div className="w-10 md:w-12 flex-shrink-0 mr-3 md:mr-0">
                <div className="h-4 bg-gray-200 rounded w-4"></div>
            </div>
            {columnConfig.map((column, index) => (
                <div key={index} className="hidden md:block flex-1 p-4">
                    <div className="space-y-2">
                        {column.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="min-h-[1.5rem] flex items-center">
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Mobile task card for table view
    const MobileTaskCard = ({ task }) => (
        <motion.div
            className="bg-white border border-gray-200 rounded-lg p-4 mb-3 md:hidden"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Mobile Card Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={selectedTasks.has(task.id)}
                        onChange={() => handleTaskSelect(task.id)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-400 focus:ring-indigo-500"
                    />
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <FiBriefcase className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-800 text-sm">{task.name}</div>
                        <div className="text-xs text-gray-500">{task.task_id}</div>
                    </div>
                </div>
                {/* 3-dot menu for mobile */}
                <div className="relative">
                    <motion.button
                        onClick={() => toggleRowDropdown(task.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiMoreHorizontal className="w-4 h-4 text-gray-600" />
                    </motion.button>
                    
                    {/* Mobile dropdown */}
                    <AnimatePresence>
                        {activeRowDropdown === task.id && (
                            <motion.div
                                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            >
                                {/* Get In/Out option */}
                                {task.in_out ? (
                                    task.is_in_me ? (
                                        <button
                                            onClick={() => {
                                                handleGetInOut(task.id, 'out');
                                                setActiveRowDropdown(null);
                                            }}
                                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <FiArrowRight className="mr-3" />
                                            Get OUT
                                        </button>
                                    ) : (
                                        <div className="flex items-center w-full px-4 py-3 text-sm text-gray-500 bg-gray-50">
                                            <FiUserCheck className="mr-3" />
                                            {task.in_name} [{task.in_type?.toUpperCase() || 'USER'}]
                                        </div>
                                    )
                                ) : (
                                    <button
                                        onClick={() => {
                                            handleGetInOut(task.id, 'in');
                                            setActiveRowDropdown(null);
                                        }}
                                        className="flex items-center w-full px-4 py-3 text-sm text-indigo-600 hover:bg-indigo-50"
                                    >
                                        <FiArrowLeft className="mr-3" />
                                        GET IN
                                    </button>
                                )}

                                <div className="border-t my-1"></div>

                                <button
                                    onClick={() => {
                                        setActiveRowDropdown(null);
                                        // navigate to view
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <FiEye className="mr-3" />
                                    View Details
                                </button>

                                <button
                                    onClick={() => {
                                        setActiveRowDropdown(null);
                                        // navigate to edit
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <FiEdit className="mr-3" />
                                    Edit Task
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
                                    Delete Task
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Mobile Card Content */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>Due: {formatDate(task.due_date)}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                        ₹{task.fees.toLocaleString()}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <FiPhone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{task.mobile}</span>
                </div>

                <div className="text-sm text-gray-600">
                    Service: {task.service_name}
                </div>

                <div className="text-xs text-gray-500">
                    File: {task.file_no}
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Table Header - Fixed for desktop only */}
            <div className="hidden md:block border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                <div className="flex items-center min-w-max">
                    {/* Checkbox Column */}
                    <div className="w-12 p-4 flex-shrink-0">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-indigo-600 rounded border-gray-400 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Dynamic Columns - Properly aligned */}
                    {columnConfig.map(column => (
                        <div
                            key={column.id}
                            className="p-4 font-semibold text-gray-700 text-sm flex-1 min-w-[180px]"
                            style={{ 
                                minWidth: column.items.length > 1 ? '220px' : '180px',
                                maxWidth: column.items.length > 1 ? '280px' : '220px'
                            }}
                        >
                            <div className="truncate">{column.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile header - Using tasks.length instead of filteredTasks */}
            <div className="md:hidden border-b border-gray-200 bg-white px-4 py-3 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-indigo-600 rounded border-gray-400 focus:ring-indigo-500"
                        />
                        <span className="font-semibold text-gray-800">Tasks</span>
                    </div>
                    <span className="text-sm text-gray-600">{tasks.length} tasks</span>
                </div>
            </div>

            {/* Scrollable Table Body */}
            <div className="flex-1 overflow-y-auto overflow-x-auto">
                {loading ? (
                    // Skeleton Loaders
                    <div className="md:min-w-max">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <SkeletonRow key={index} />
                        ))}
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="flex items-center justify-center py-12 text-gray-500 px-4">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiUser className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No tasks found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                        </div>
                    </div>
                ) : (
                    <div className="md:min-w-max">
                        {/* Mobile view - cards */}
                        <div className="md:hidden px-4 py-2">
                            {tasks.map((task, index) => (
                                <MobileTaskCard key={task.id} task={task} />
                            ))}
                        </div>

                        {/* Desktop view - table */}
                        <div className="hidden md:block">
                            {tasks.map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    className={`flex items-center border-b border-gray-100 hover:bg-gray-50 transition-colors group ${task.in_out ? 'bg-indigo-50' : ''}`}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    {/* Checkbox */}
                                    <div className="w-12 p-4 flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={selectedTasks.has(task.id)}
                                            onChange={() => handleTaskSelect(task.id)}
                                            className="w-4 h-4 text-indigo-600 rounded border-gray-400 focus:ring-indigo-500"
                                        />
                                    </div>

                                    {/* Dynamic Columns - Properly aligned */}
                                    {columnConfig.map(column => (
                                        <div 
                                            key={column.id} 
                                            className="p-4 flex-1 min-w-[180px]"
                                            style={{ 
                                                minWidth: column.items.length > 1 ? '220px' : '180px',
                                                maxWidth: column.items.length > 1 ? '280px' : '220px'
                                            }}
                                        >
                                            <div className="space-y-2">
                                                {column.items.map(item => (
                                                    <div key={item.id} className="min-h-[1.5rem] flex items-center">
                                                        {renderCellContent(task, item.id, handleGetInOut, handleStatusChange)}
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

// Task Cards Component - Mobile Responsive with 3-dot menu
const TaskCards = ({ 
    tasks, 
    selectedTasks, 
    handleTaskSelect, 
    columnConfig,
    renderCellContent,
    loading,
    toggleRowDropdown,
    activeRowDropdown,
    handleGetInOut,
    setActiveRowDropdown,
    handleStatusChange,
    statusOptions
}) => {
    const navigate = useNavigate();

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-blue-100 text-blue-700';
            case 'IN_PROGRESS': return 'bg-orange-100 text-orange-700';
            case 'UNDER_REVIEW': return 'bg-purple-100 text-purple-700';
            case 'ON_HOLD': return 'bg-yellow-100 text-yellow-700';
            case 'COMPLETE': return 'bg-green-100 text-green-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Get status border color
    const getStatusBorderColor = (status) => {
        switch (status) {
            case 'PENDING': return 'border-blue-300';
            case 'IN_PROGRESS': return 'border-orange-300';
            case 'UNDER_REVIEW': return 'border-purple-300';
            case 'ON_HOLD': return 'border-yellow-300';
            case 'COMPLETE': return 'border-green-300';
            case 'CANCELLED': return 'border-red-300';
            default: return 'border-gray-300';
        }
    };

    // Format status
    const formatStatus = (status) => {
        switch (status) {
            case 'PENDING': return 'Pending';
            case 'IN_PROGRESS': return 'In Progress';
            case 'UNDER_REVIEW': return 'Under Review';
            case 'ON_HOLD': return 'On Hold';
            case 'COMPLETE': return 'Complete';
            case 'CANCELLED': return 'Cancelled';
            default: return status;
        }
    };

    // Skeleton loader
    const SkeletonCard = () => (
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6">
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            ) : tasks.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-gray-500 px-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiBriefcase className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No tasks found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {tasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            className={`bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden ${selectedTasks.has(task.id) ? 'ring-2 ring-indigo-500' : ''}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            {/* Card Header */}
                            <div className="p-4 md:p-6 border-b border-gray-100">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedTasks.has(task.id)}
                                                onChange={() => handleTaskSelect(task.id)}
                                                className="w-4 h-4 text-indigo-600 rounded border-gray-400 focus:ring-indigo-500 flex-shrink-0"
                                            />
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                                                <FiBriefcase className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-800 text-sm truncate">{task.name}</h3>
                                                <p className="text-xs text-gray-500 truncate">{task.task_id}</p>
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-sm md:text-base truncate">{task.service_name}</h4>
                                        <p className="text-gray-600 text-xs md:text-sm truncate">{task.firm_name}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {/* 3-dot menu for cards */}
                                        <div className="relative">
                                            <motion.button
                                                onClick={() => toggleRowDropdown(`card-${task.id}`)}
                                                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FiMoreHorizontal className="w-4 h-4 text-gray-600" />
                                            </motion.button>

                                            {/* Dropdown for cards */}
                                            <AnimatePresence>
                                                {activeRowDropdown === `card-${task.id}` && (
                                                    <motion.div
                                                        className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                                                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                                    >
                                                        {/* Get In/Out option */}
                                                        {task.in_out ? (
                                                            task.is_in_me ? (
                                                                <button
                                                                    onClick={() => {
                                                                        handleGetInOut(task.id, 'out');
                                                                        setActiveRowDropdown(null);
                                                                    }}
                                                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                                                                >
                                                                    <FiArrowRight className="mr-3" />
                                                                    Get OUT
                                                                </button>
                                                            ) : (
                                                                <div className="flex items-center w-full px-4 py-3 text-sm text-gray-500 bg-gray-50">
                                                                    <FiUserCheck className="mr-3" />
                                                                    {task.in_name} [{task.in_type?.toUpperCase() || 'USER'}]
                                                                </div>
                                                            )
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    handleGetInOut(task.id, 'in');
                                                                    setActiveRowDropdown(null);
                                                                }}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-indigo-600 hover:bg-indigo-50"
                                                            >
                                                                <FiArrowLeft className="mr-3" />
                                                                GET IN
                                                            </button>
                                                        )}

                                                        <div className="border-t my-1"></div>

                                                        <button
                                                            onClick={() => {
                                                                setActiveRowDropdown(null);
                                                                navigate(`/task/profile`);
                                                            }}
                                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <FiEye className="mr-3" />
                                                            View Details
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setActiveRowDropdown(null);
                                                                navigate(`/task/edit/${task.id}`);
                                                            }}
                                                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <FiEdit className="mr-3" />
                                                            Edit Task
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
                                                            Delete Task
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body - Essential information with status dropdown below file */}
                            <div className="p-4 md:p-6">
                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                                            <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                                            <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-800">
                                            <span className="inline-flex items-center gap-1">
                                                <FiDollarSign className="w-3 h-3" />
                                                ₹{task.fees.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                                        <FiPhone className="w-3.5 h-3.5 text-gray-400" />
                                        <span>{task.mobile}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                                        <FiUsers className="w-3.5 h-3.5 text-gray-400" />
                                        <span>{task.employees.length} assigned</span>
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        File: {task.file_no}
                                    </div>

                                    {/* Status Dropdown - Below File Number */}
                                    <div className="pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-gray-600">Status:</span>
                                            <div className="flex-1">
                                                <select
                                                    value={task.status}
                                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                    className={`w-full px-3 py-1.5 text-xs border ${getStatusBorderColor(task.status)} rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all font-medium
                                                        ${task.status === 'PENDING'
                                                            ? 'text-blue-700'
                                                            : task.status === 'IN_PROGRESS'
                                                                ? 'text-orange-700'
                                                                : task.status === 'UNDER_REVIEW'
                                                                    ? 'text-purple-700'
                                                                    : task.status === 'ON_HOLD'
                                                                        ? 'text-yellow-700'
                                                                        : task.status === 'COMPLETE'
                                                                            ? 'text-green-700'
                                                                            : 'text-red-700'
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

const TaskDisplay = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [columnConfig, setColumnConfig] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [activeRowDropdown, setActiveRowDropdown] = useState(null);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [exportModal, setExportModal] = useState({ open: false, type: '', data: null });
    const navigate = useNavigate();
    const [deleteModal, SetDeleteModal] = useState(false);
    const [deleteOtp, SetDeleteOtp] = useState('');
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
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

    const [columnsConfig, setColumnsConfig] = useState([
        { id: 'taskName', label: 'Task Name', visible: true },
        { id: 'owner', label: 'Owner', visible: true },
        { id: 'priority', label: 'Priority', visible: true },
        { id: 'dueDate', label: 'Due Date', visible: true },
    ]);

    // All available data fields from tasks
    const availableFields = [
        { id: 'id', label: 'ID', type: 'text' },
        { id: 'task_id', label: 'Task ID', type: 'text' },
        { id: 'create_date', label: 'Create Date', type: 'date' },
        { id: 'due_date', label: 'Due Date', type: 'date' },
        { id: 'days_left', label: 'Days Left', type: 'text' },
        { id: 'service_name', label: 'Service Name', type: 'text' },
        { id: 'fees', label: 'Fees', type: 'currency' },
        { id: 'firm_name', label: 'Firm Name', type: 'text' },
        { id: 'file_no', label: 'File No', type: 'text' },
        { id: 'name', label: 'Client Name', type: 'text' },
        { id: 'guardian_name', label: 'Guardian Name', type: 'text' },
        { id: 'pan', label: 'PAN', type: 'text' },
        { id: 'mobile', label: 'Mobile', type: 'text' },
        { id: 'status', label: 'Status', type: 'status' },
        { id: 'in_out', label: 'In/Out', type: 'boolean' },
        { id: 'is_in_me', label: 'Is In Me', type: 'boolean' },
        { id: 'is_recurring', label: 'Is Recurring', type: 'boolean' },
        { id: 'recurring_type', label: 'Recurring Type', type: 'text' },
        { id: 'employees', label: 'Employees', type: 'array' },
        { id: 'in_name', label: 'In Name', type: 'text' },
        { id: 'in_type', label: 'In Type', type: 'text' },
        { id: 'menu', label: 'Actions', type: 'actions' }
    ];

    // Default column configuration
    const defaultColumnConfig = [
        {
            id: '1',
            name: 'Dates',
            items: [
                { id: 'create_date', label: 'Create Date' },
                { id: 'due_date', label: 'Due Date' },
                { id: 'days_left', label: 'Days Left' }
            ]
        },
        {
            id: '2',
            name: 'Task',
            items: [
                { id: 'service_name', label: 'Service Name' },
                { id: 'fees', label: 'Fees' },
                { id: 'firm_name', label: 'Firm Name' },
                { id: 'file_no', label: 'File No' }
            ]
        },
        {
            id: '3',
            name: 'Client',
            items: [
                { id: 'name', label: 'Client Name' },
                { id: 'guardian_name', label: 'Guardian Name' },
                { id: 'pan', label: 'PAN' },
                { id: 'mobile', label: 'Mobile' }
            ]
        },
        {
            id: '4',
            name: 'Users',
            items: [
                { id: 'employees', label: 'Employees' }
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
                { id: 'menu', label: 'Actions' }
            ],
            fixed: true
        }
    ];

    // Initialize column config
    useEffect(() => {
        const savedConfig = localStorage.getItem('taskColumnConfig');
        if (savedConfig) {
            setColumnConfig(JSON.parse(savedConfig));
        } else {
            setColumnConfig(defaultColumnConfig);
        }
    }, []);

    // Save column config
    const saveColumnConfig = (config) => {
        setColumnConfig(config);
        localStorage.setItem('taskColumnConfig', JSON.stringify(config));
    };

    // Dummy data arrays
    const [taskStats] = useState({
        pending: 24,
        dueIn7Days: 8,
        completed: 156,
        cancelled: 12
    });

    const [statusOptions] = useState([
        { value: 'PENDING', name: 'Pending' },
        { value: 'IN_PROGRESS', name: 'In Progress' },
        { value: 'UNDER_REVIEW', name: 'Under Review' },
        { value: 'ON_HOLD', name: 'On Hold' },
        { value: 'COMPLETE', name: 'Complete' },
        { value: 'CANCELLED', name: 'Cancelled' }
    ]);

    const [serviceOptions] = useState([
        { value: '1', name: 'Tax Filing' },
        { value: '2', name: 'Audit Services' },
        { value: '3', name: 'GST Return' },
        { value: '4', name: 'Company Registration' },
        { value: '5', name: 'Accounting' },
        { value: '6', name: 'Legal Compliance' }
    ]);

    const [tasks, setTasks] = useState([
        {
            id: '1',
            task_id: 'TASK001',
            create_date: '2024-01-15',
            due_date: '2024-02-20',
            service_name: 'Tax Filing',
            fees: 5000,
            firm_name: 'ABC Corporation',
            file_no: 'FN001',
            name: 'John Doe',
            guardian_name: 'Robert Doe',
            pan: 'ABCDE1234F',
            mobile: '9876543210',
            status: 'PENDING',
            in_out: false,
            is_in_me: false,
            is_recurring: false,
            employees: [
                { employee_username: 'emp1', name: 'John Doe' },
                { employee_username: 'emp2', name: 'Jane Smith' }
            ]
        },
        {
            id: '2',
            task_id: 'TASK002',
            create_date: '2024-01-10',
            due_date: '2024-01-25',
            service_name: 'GST Return',
            fees: 3000,
            firm_name: 'XYZ Solutions',
            file_no: 'FN002',
            name: 'Jane Smith',
            guardian_name: 'William Smith',
            pan: 'XYZAB9012H',
            mobile: '9876543211',
            status: 'IN_PROGRESS',
            in_out: true,
            is_in_me: true,
            is_recurring: true,
            recurring_type: 'Monthly',
            employees: [
                { employee_username: 'emp3', name: 'Mike Johnson' }
            ]
        },
        {
            id: '3',
            task_id: 'TASK003',
            create_date: '2024-01-05',
            due_date: '2024-01-30',
            service_name: 'Audit Services',
            fees: 15000,
            firm_name: 'Global Tech',
            file_no: 'FN003',
            name: 'Mike Johnson',
            guardian_name: 'Thomas Johnson',
            pan: 'GLOTI3456J',
            mobile: '9876543212',
            status: 'UNDER_REVIEW',
            in_out: false,
            is_in_me: false,
            is_recurring: false,
            employees: [
                { employee_username: 'emp1', name: 'John Doe' },
                { employee_username: 'emp4', name: 'Sarah Wilson' }
            ]
        },
        {
            id: '4',
            task_id: 'TASK004',
            create_date: '2024-01-20',
            due_date: '2024-03-15',
            service_name: 'Company Registration',
            fees: 8000,
            firm_name: 'Wilson & Co',
            file_no: 'FN004',
            name: 'Sarah Wilson',
            guardian_name: 'James Wilson',
            pan: 'WILS5678K',
            mobile: '9876543213',
            status: 'COMPLETE',
            in_out: false,
            is_in_me: false,
            is_recurring: false,
            employees: [
                { employee_username: 'emp2', name: 'Jane Smith' }
            ]
        },
        {
            id: '5',
            task_id: 'TASK005',
            create_date: '2024-01-18',
            due_date: '2024-02-05',
            service_name: 'Legal Compliance',
            fees: 6000,
            firm_name: 'Brown Industries',
            file_no: 'FN005',
            name: 'David Brown',
            guardian_name: 'Richard Brown',
            pan: 'BRWN3456M',
            mobile: '9876543214',
            status: 'ON_HOLD',
            in_out: false,
            is_in_me: false,
            is_recurring: true,
            recurring_type: 'Quarterly',
            employees: [
                { employee_username: 'emp5', name: 'David Brown' },
                { employee_username: 'emp3', name: 'Mike Johnson' }
            ]
        }
    ]);

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Calculate days left
    const getDaysLeft = (dueDate) => {
        const due = new Date(dueDate);
        const today = new Date();
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'text-blue-600';
            case 'IN_PROGRESS': return 'text-orange-600';
            case 'UNDER_REVIEW': return 'text-purple-600';
            case 'ON_HOLD': return 'text-yellow-600';
            case 'COMPLETE': return 'text-green-600';
            case 'CANCELLED': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <FiLoader className="text-blue-600" />;
            case 'IN_PROGRESS': return <FiClock className="text-orange-600" />;
            case 'UNDER_REVIEW': return <FiEye className="text-purple-600" />;
            case 'ON_HOLD': return <FiXCircle className="text-yellow-600" />;
            case 'COMPLETE': return <FiCheckCircle className="text-green-600" />;
            case 'CANCELLED': return <FiXCircle className="text-red-600" />;
            default: return <FiLoader className="text-gray-600" />;
        }
    };

    // Handle export
    const handleExport = (type, data = null) => {
        setExportModal({ open: true, type, data });

        // Simulate export process
        setTimeout(() => {
            setExportModal({ open: false, type: '', data: null });
            alert(`${type.toUpperCase()} export completed successfully!`);
        }, 1500);
    };

    // Handle task selection
    const handleTaskSelect = (taskId) => {
        const newSelected = new Set(selectedTasks);
        if (newSelected.has(taskId)) {
            newSelected.delete(taskId);
        } else {
            newSelected.add(taskId);
        }
        setSelectedTasks(newSelected);
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedTasks(new Set());
        } else {
            const allTaskIds = new Set(filteredTasks.map(task => task.id));
            setSelectedTasks(allTaskIds);
        }
        setSelectAll(!selectAll);
    };

    // Handle status change
    const handleStatusChange = (taskId, newStatus) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
        ));
    };

    // Handle get in/out
    const handleGetInOut = (taskId, action) => {
        setTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                if (action === 'in') {
                    return {
                        ...task,
                        in_out: true,
                        is_in_me: true
                    };
                } else {
                    return {
                        ...task,
                        in_out: false,
                        is_in_me: false
                    };
                }
            }
            return task;
        }));
    };

    // Filter tasks based on search and filters
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = searchQuery === '' ||
            task.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.firm_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.file_no.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = selectedStatus === '' || task.status === selectedStatus;
        const matchesService = selectedService === '' || task.service_name === serviceOptions.find(s => s.value === selectedService)?.name;

        return matchesSearch && matchesStatus && matchesService;
    });

    // Toggle row dropdown
    const toggleRowDropdown = (taskId) => {
        setActiveRowDropdown(activeRowDropdown === taskId ? null : taskId);
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
        
        if (active.id !== over.id) {
            setColumnConfig((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                
                // Don't allow dragging fixed columns
                if (items[oldIndex].fixed) return items;
                
                const newConfig = arrayMove(items, oldIndex, newIndex);
                saveColumnConfig(newConfig);
                return newConfig;
            });
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
        // Insert before the fixed columns (Status and Actions)
        const insertIndex = newConfig.length - 2;
        newConfig.splice(insertIndex, 0, {
            id: newColumnId,
            name: `Column ${newConfig.length - 1}`,
            items: []
        });
        saveColumnConfig(newConfig);
    };

    // Sortable Column Component
    const SortableColumn = ({ column, index }) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging
        } = useSortable({
            id: column.id,
            disabled: column.fixed
        });

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
                className={`border-2 rounded-xl p-4 transition-all duration-200 ${column.fixed
                    ? 'bg-indigo-50 border-indigo-300 shadow-sm cursor-not-allowed'
                    : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300 cursor-move'
                    }`}
                whileHover={{ scale: column.fixed ? 1 : 1.02 }}
            >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {!column.fixed && (
                            <div className="cursor-grab active:cursor-grabbing">
                                <FiMove className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </div>
                        )}
                        <h3 className="font-bold text-gray-800 text-sm">
                            {column.name}
                            {column.fixed && (
                                <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                                    Fixed
                                </span>
                            )}
                        </h3>
                    </div>
                    {!column.fixed && column.items.length === 0 && (
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
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
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
    };

    // Sortable Item Component
    const SortableItem = ({ item, columnIndex, itemIndex, columnId }) => {
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
                    ${isDragging ? 'shadow-lg border-indigo-400' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
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
    };

    // Render cell content based on field type - Updated to include handleGetInOut parameter
    const renderCellContent = (task, fieldId, handleGetInOut, handleStatusChange) => {
        switch (fieldId) {
            case 'create_date':
                return (
                    <div className="text-gray-700 font-medium text-sm">
                        {formatDate(task.create_date)}
                    </div>
                );
            case 'due_date':
                return (
                    <div className="text-gray-700 font-medium text-sm">
                        {formatDate(task.due_date)}
                    </div>
                );
            case 'days_left':
                const daysLeft = getDaysLeft(task.due_date);
                const isOverdue = daysLeft < 0;
                return (
                    <span className={`text-xs font-bold ${isOverdue ? 'text-red-600' : daysLeft <= 7 ? 'text-orange-600' : 'text-green-600'}`}>
                        {isOverdue
                            ? `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) > 1 ? 's' : ''}`
                            : `Due in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`
                        }
                    </span>
                );
            case 'service_name':
                return (
                    <div className="font-semibold text-gray-800 text-sm">
                        {task.service_name}
                    </div>
                );
            case 'fees':
                return (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <FiDollarSign className="w-3 h-3" />
                        ₹{task.fees.toLocaleString()}
                    </div>
                );
            case 'firm_name':
                return (
                    <div className="text-gray-700 font-medium text-sm">
                        {task.firm_name}
                    </div>
                );
            case 'file_no':
                return (
                    <span className="text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded text-xs">
                        {task.file_no}
                    </span>
                );
            case 'name':
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                            <FiUser className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors text-sm">
                                {task.name}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                                {task.task_id}
                            </div>
                        </div>
                    </div>
                );
            case 'guardian_name':
                return (
                    <span className="text-gray-700 font-medium text-sm">
                        {task.guardian_name || '-'}
                    </span>
                );
            case 'pan':
                return (
                    <span className="text-gray-700 font-medium text-sm">
                        {task.pan}
                    </span>
                );
            case 'mobile':
                return (
                    <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                        <FiPhone className="w-3 h-3 text-gray-400" />
                        {task.mobile}
                    </div>
                );
            case 'employees':
                return (
                    <div className="flex -space-x-2">
                        {task.employees.map((emp, empIndex) => (
                            <div
                                key={emp.employee_username}
                                className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                                title={emp.name}
                            >
                                {emp.name.charAt(0)}
                            </div>
                        ))}
                    </div>
                );
            case 'status':
                return (
                    <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className={`w-full px-3 py-2 text-xs border rounded
                            focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all font-medium
                            ${task.status === 'PENDING'
                                ? 'border-indigo-300 text-indigo-700'
                                : task.status === 'IN_PROGRESS'
                                    ? 'border-orange-300 text-orange-700'
                                    : task.status === 'UNDER_REVIEW'
                                        ? 'border-purple-300 text-purple-700'
                                        : task.status === 'ON_HOLD'
                                            ? 'border-yellow-300 text-yellow-700'
                                            : task.status === 'COMPLETE'
                                                ? 'border-green-300 text-green-700'
                                                : 'border-red-300 text-red-700'
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
            case 'menu':
                return (
                    <div className="relative dropdown-container">
                        {/* Horizontal 3-dot button */}
                        <motion.button
                            onClick={() => toggleRowDropdown(task.id)}
                            className="w-9 h-9 flex items-center justify-center rounded-full
                           bg-gray-100 hover:bg-gray-200 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiMoreHorizontal className="w-5 h-5 text-gray-600" />
                        </motion.button>

                        {/* Professional Dropdown with Get In/Out option */}
                        <AnimatePresence>
                            {activeRowDropdown === task.id && (
                                <motion.div
                                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl
                                   shadow-xl border border-gray-200 z-50 overflow-hidden"
                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <div className="py-1">
                                        {/* Get In/Out Button in dropdown */}
                                        {task.in_out ? (
                                            task.is_in_me ? (
                                                <button
                                                    onClick={() => {
                                                        handleGetInOut(task.id, 'out');
                                                        setActiveRowDropdown(null);
                                                    }}
                                                    className="flex items-center w-full px-4 py-3 text-sm
                                                   text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <FiArrowRight className="mr-3 text-red-600" />
                                                    Get OUT
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="flex items-center w-full px-4 py-3 text-sm
                                                   text-gray-500 hover:bg-gray-50 transition-colors cursor-not-allowed"
                                                >
                                                    <FiUserCheck className="mr-3 text-gray-500" />
                                                    {task.in_name} [{task.in_type?.toUpperCase() || 'USER'}]
                                                </button>
                                            )
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    handleGetInOut(task.id, 'in');
                                                    setActiveRowDropdown(null);
                                                }}
                                                className="flex items-center w-full px-4 py-3 text-sm
                                               text-indigo-600 hover:bg-indigo-50 transition-colors"
                                            >
                                                <FiArrowLeft className="mr-3 text-indigo-600" />
                                                GET IN
                                            </button>
                                        )}

                                        <div className="border-t my-1"></div>

                                        <button
                                            onClick={() => {
                                                setActiveRowDropdown(null);
                                                navigate(`/task/profile`);
                                            }}
                                            className="flex items-center w-full px-4 py-3 text-sm
                                           text-gray-700 hover:bg-indigo-50 transition-colors"
                                        >
                                            <FiEye className="mr-3 text-indigo-600" />
                                            View Details
                                        </button>

                                        <button
                                            onClick={() => {
                                                setActiveRowDropdown(null);
                                                navigate(`/task/edit/${task.id}`);
                                            }}
                                            className="flex items-center w-full px-4 py-3 text-sm
                                           text-gray-700 hover:bg-green-50 transition-colors"
                                        >
                                            <FiEdit className="mr-3 text-green-600" />
                                            Edit Task
                                        </button>

                                        <div className="border-t my-1"></div>

                                        <button
                                            onClick={() => {
                                                setActiveRowDropdown(null);
                                                SetDeleteModal(true);
                                            }}
                                            className="flex items-center w-full px-4 py-3 text-sm
                                           text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <FiTrash2 className="mr-3" />
                                            Delete Task
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
                        {task[fieldId] || '-'}
                    </span>
                );
        }
    };

    // Settings Modal Component with Drag & Drop
    const SettingsModal = () => (
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
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Table Column Settings</h2>
                                <p className="text-indigo-100 text-sm mt-1">Drag and drop to rearrange columns and items</p>
                            </div>
                            <motion.button
                                onClick={() => setSettingsModalOpen(false)}
                                className="text-white hover:text-indigo-200 transition-colors duration-200 p-1 rounded-lg hover:bg-indigo-500"
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
                                onDragStart={(event) => setActiveDragId(event.active.id)}
                                onDragEnd={handleDragEnd}
                                onDragCancel={() => setActiveDragId(null)}
                            >
                                <SortableContext
                                    items={columnConfig.map(column => column.id)}
                                    strategy={horizontalListSortingStrategy}
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-6">
                                        {columnConfig.map((column, index) => (
                                            <SortableColumn
                                                key={column.id}
                                                column={column}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>

                            {/* Add Column Button */}
                            <div className="mb-6">
                                <motion.button
                                    onClick={addNewColumn}
                                    className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-xl text-gray-700 font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-200 flex items-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Add New Column
                                </motion.button>
                            </div>

                            {/* Available Fields */}
                            <div className="border-t pt-6">
                                <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                                    <FiGrid className="w-4 h-4 text-indigo-600" />
                                    Available Fields
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {availableFields
                                        .filter(field =>
                                            !columnConfig.some(col =>
                                                col.items.some(item => item.id === field.id)
                                            )
                                        )
                                        .map(field => (
                                            <motion.div
                                                key={field.id}
                                                className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:shadow-md hover:border-gray-400 hover:from-white hover:to-gray-50 cursor-pointer text-center"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    // Add to the first non-fixed column with space
                                                    const targetColumnIndex = columnConfig.findIndex(col =>
                                                        !col.fixed && col.items.length < 5
                                                    );
                                                    if (targetColumnIndex !== -1) {
                                                        addItemToColumn(targetColumnIndex, field.id);
                                                    }
                                                }}
                                            >
                                                {field.label}
                                            </motion.div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                       <div className="border-t px-6 py-4 bg-gray-50">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

    {/* LEFT */}
    <motion.button
      onClick={() => {
        saveColumnConfig(defaultColumnConfig);
        setSettingsModalOpen(false);
      }}
      className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium
                 border border-gray-300 rounded-lg text-gray-700
                 hover:bg-gray-200 transition-all duration-200 hover:shadow-sm gap-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FiRefreshCw className="w-4 h-4" />
      Reset to Default
    </motion.button>

    {/* RIGHT */}
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
        onClick={() => {
          saveColumnConfig(columnConfig);
          setSettingsModalOpen(false);
        }}
        className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium
                   bg-gradient-to-r from-indigo-600 to-indigo-700 text-white
                   rounded-lg hover:from-indigo-700 hover:to-indigo-800
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
                    {/* Main Card - Mobile responsive */}
                    <motion.div
                        className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full mx-2 sm:mx-4 md:mx-8 my-4 md:my-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Card Header - Responsive */}
                        <div className="border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 md:gap-4">
                                <div className="w-full md:w-auto">
                                    <h5 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
                                        Task Management
                                    </h5>
                                    <p className="text-gray-500 text-xs">
                                        Manage your tasks efficiently with multiple view options
                                    </p>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                    {/* Table/Cards Toggle and Search */}
                                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full">
                                        {/* Table/Cards Toggle */}
                                        <div className="flex items-center gap-2">
                                            <div className="md:hidden w-full">
                                                <TableViewSwitch viewMode={viewMode} setViewMode={setViewMode} />
                                            </div>
                                            <div className="hidden md:block">
                                                <TableViewSwitch viewMode={viewMode} setViewMode={setViewMode} />
                                            </div>
                                            
                                            {/* Search Input - Mobile optimized */}
                                            <div className="flex-1 md:flex-none md:min-w-[250px] lg:min-w-[300px]">
                                                <div className="relative">
                                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search tasks..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm bg-white"
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
                                                    className="px-3 md:px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium flex items-center gap-2 shadow-sm text-sm"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FiFilter className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Filter</span>
                                                </motion.button>

                                                <AnimatePresence>
                                                    {showFilterDropdown && (
                                                        <motion.div
                                                            className="absolute right-0 md:left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-4"
                                                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                                            transition={{ duration: 0.15 }}
                                                        >
                                                            {/* Status Filter */}
                                                            <div className="mb-4">
                                                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                                    Status
                                                                </label>
                                                                <select
                                                                    value={selectedStatus}
                                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                                                >
                                                                    <option value="">All Status</option>
                                                                    {statusOptions.map(status => (
                                                                        <option key={status.value} value={status.value}>
                                                                            {status.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            {/* Service Filter */}
                                                            <div className="mb-4">
                                                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                                    Service
                                                                </label>
                                                                <select
                                                                    value={selectedService}
                                                                    onChange={(e) => setSelectedService(e.target.value)}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                                                >
                                                                    <option value="">All Services</option>
                                                                    {serviceOptions.map(service => (
                                                                        <option key={service.value} value={service.value}>
                                                                            {service.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex justify-between gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedStatus('');
                                                                        setSelectedService('');
                                                                    }}
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
                                                                >
                                                                    Reset
                                                                </button>
                                                                <button
                                                                    onClick={() => setShowFilterDropdown(false)}
                                                                    className="w-full px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                                                >
                                                                    Apply
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Create Task Button */}
                                            <motion.button
                                                onClick={() => navigate('/task/create')}
                                                className="px-3 md:px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm whitespace-nowrap"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FiPlus className="w-4 h-4" />
                                                <span className="hidden sm:inline">Create Task</span>
                                            </motion.button>
                                            
                                            {/* 3 Dot Menu (Export + Settings) */}
                                            <div className="relative dropdown-container">
                                                <motion.button
                                                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition shadow-sm"
                                                    whileHover={{ scale: 1.08 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FiMoreVertical className="w-5 h-5 text-gray-700" />
                                                </motion.button>

                                                <AnimatePresence>
                                                    {showMoreMenu && (
                                                        <motion.div
                                                            className="absolute right-0 mt-2 w-56 sm:w-60 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
                                                            initial={{ opacity: 0, y: -8 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -8 }}
                                                        >
                                                            {/* Export Section */}
                                                            <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                                                                Export
                                                            </div>

                                                            <button
                                                                onClick={() => handleExport('pdf')}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50"
                                                            >
                                                                <PiFilePdfDuotone className="w-4 h-4 mr-3 text-red-500" />
                                                                Export as PDF
                                                            </button>

                                                            <button
                                                                onClick={() => handleExport('excel')}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50"
                                                            >
                                                                <PiMicrosoftExcelLogoDuotone className="w-4 h-4 mr-3 text-green-500" />
                                                                Export as Excel
                                                            </button>

                                                            <button
                                                                onClick={() => handleExport('whatsapp')}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50"
                                                            >
                                                                <FaWhatsapp className="w-4 h-4 mr-3 text-green-500" />
                                                                Share via WhatsApp
                                                            </button>

                                                            <button
                                                                onClick={() => handleExport('email')}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50"
                                                            >
                                                                <AiOutlineMail className="w-4 h-4 mr-3 text-blue-500" />
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
                                                                className={`flex items-center w-full px-4 py-3 text-sm ${viewMode === 'table' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'}`}
                                                                disabled={viewMode !== 'table'}
                                                            >
                                                                <FiSettings className="w-4 h-4 mr-3" />
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

                        {/* Task Display Area */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {viewMode === 'table' ? (
                                <TaskTable
                                    tasks={filteredTasks}
                                    selectedTasks={selectedTasks}
                                    handleTaskSelect={handleTaskSelect}
                                    selectAll={selectAll}
                                    handleSelectAll={handleSelectAll}
                                    columnConfig={columnConfig}
                                    renderCellContent={renderCellContent}
                                    loading={loading}
                                    toggleRowDropdown={toggleRowDropdown}
                                    activeRowDropdown={activeRowDropdown}
                                    handleGetInOut={handleGetInOut}
                                    setActiveRowDropdown={setActiveRowDropdown}
                                    handleStatusChange={handleStatusChange}
                                />
                            ) : (
                                <TaskCards
                                    tasks={filteredTasks}
                                    selectedTasks={selectedTasks}
                                    handleTaskSelect={handleTaskSelect}
                                    columnConfig={columnConfig}
                                    renderCellContent={renderCellContent}
                                    loading={loading}
                                    toggleRowDropdown={toggleRowDropdown}
                                    activeRowDropdown={activeRowDropdown}
                                    handleGetInOut={handleGetInOut}
                                    setActiveRowDropdown={setActiveRowDropdown}
                                    handleStatusChange={handleStatusChange}
                                    statusOptions={statusOptions}
                                />
                            )}
                        </div>

                        {/* Footer - Mobile responsive */}
                        <div className="border-t border-gray-200 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-gray-50 to-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <span className="font-semibold text-gray-800 text-sm">
                                        Showing {filteredTasks.length} of {tasks.length} tasks
                                    </span>
                                    <div className="text-sm text-gray-600">
                                        {selectedTasks.size} task(s) selected
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    {/* Action Buttons in Footer - Mobile responsive */}
                                    <motion.button
                                        className="px-3 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg text-xs md:text-sm font-medium transition-all duration-200 hover:from-indigo-700 hover:to-indigo-800 flex items-center gap-1 md:gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={selectedTasks.size === 0}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiMail className="w-3 h-3 md:w-4 md:h-4" />
                                        <span className="hidden sm:inline">Send Message</span>
                                    </motion.button>
                                    
                                    <motion.button
                                        className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-xs md:text-sm font-medium transition-all duration-200 hover:from-green-700 hover:to-green-800 flex items-center gap-1 md:gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={selectedTasks.size === 0}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiDownload className="w-3 h-3 md:w-4 md:h-4" />
                                        <span className="hidden sm:inline">Export Selected</span>
                                    </motion.button>
                                    
                                    <motion.button
                                        className="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-xs md:text-sm font-medium transition-all duration-200 hover:from-purple-700 hover:to-purple-800 flex items-center gap-1 md:gap-2 shadow-sm"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiPrinter className="w-3 h-3 md:w-4 md:h-4" />
                                        <span className="hidden sm:inline">Print All</span>
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Floating Action Button for Selected Tasks - Mobile Optimized */}
            <AnimatePresence>
                {selectedTasks.size > 0 && (
                    <motion.div
                        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                            <motion.button
                                className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-indigo-800 flex items-center gap-2 shadow-xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    console.log("Send message to:", [...selectedTasks]);
                                }}
                            >
                                <FiMail className="w-4 h-4" />
                                <span className="hidden sm:inline">Send Message</span>
                                <span className="sm:hidden">({selectedTasks.size})</span>
                            </motion.button>
                            
                            <motion.button
                                className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl text-sm font-semibold hover:from-green-700 hover:to-green-800 flex items-center gap-2 shadow-xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleExport('selected')}
                            >
                                <FiDownload className="w-4 h-4" />
                                <span className="hidden sm:inline">Export</span>
                                <span className="sm:hidden">({selectedTasks.size})</span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Modal */}
            <SettingsModal />

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
                            className="bg-white rounded-2xl p-6 max-w-sm w-full mx-auto"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <PiExportBold className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Exporting {exportModal.type.toUpperCase()}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Your {exportModal.type} export is being processed...
                                </p>
                                <div className="flex justify-center space-x-3">
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {deleteModal && <DeleteConfirmationModal
                title="Task Delete"
                onConfirm={(res) => {
                    SetDeleteModal(false)
                    console.log("Confirmed:", res);
                    // res = { confirmed: true, otp: "123456" }
                }}
            />
            }
        </div>
    );
};

export default TaskDisplay;