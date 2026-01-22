import React, { useState, useEffect } from 'react';
import {
    FiChevronLeft,
    FiChevronRight,
    FiCalendar,
    FiCheck,
    FiCheckCircle,
    FiXCircle,
    FiUser,
    FiPhone,
    FiClock,
    FiAlertTriangle,
    FiDollarSign,
    FiUsers,
    FiRefreshCw,
    FiFilter,
    FiSearch,
    FiEdit,
    FiEye,
    FiDownload,
    FiPrinter,
    FiSend,
    FiMoreVertical
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, Sidebar } from '../components/header';

const ManageAttendance = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStaff, setSelectedStaff] = useState(new Set());
    const [bulkAction, setBulkAction] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');

    // Mock attendance data
    const mockAttendanceData = [
        {
            attendence_id: '1',
            username: 'staff001',
            name: 'John Doe',
            mobile: '+91 9876543210',
            duty_time: '09:00 - 18:00',
            status: 'idle',
            in_time: '00:00',
            out_time: '00:00',
            designation: 'Senior Developer',
            department: 'Engineering'
        },
        {
            attendence_id: '2',
            username: 'staff002',
            name: 'Jane Smith',
            mobile: '+91 9876543211',
            duty_time: '09:00 - 18:00',
            status: 'present',
            in_time: '09:15',
            out_time: '18:30',
            designation: 'Project Manager',
            department: 'Management'
        },
        {
            attendence_id: '3',
            username: 'staff003',
            name: 'Mike Johnson',
            mobile: '+91 9876543212',
            duty_time: '10:00 - 19:00',
            status: 'half day',
            in_time: '10:00',
            out_time: '14:00',
            designation: 'UI/UX Designer',
            department: 'Design'
        },
        {
            attendence_id: '4',
            username: 'staff004',
            name: 'Sarah Wilson',
            mobile: '+91 9876543213',
            duty_time: '09:00 - 18:00',
            status: 'absent',
            in_time: '00:00',
            out_time: '00:00',
            designation: 'QA Engineer',
            department: 'Engineering'
        },
        {
            attendence_id: '5',
            username: 'staff005',
            name: 'Robert Brown',
            mobile: '+91 9876543214',
            duty_time: '09:00 - 18:00',
            status: 'paid leave',
            in_time: '00:00',
            out_time: '00:00',
            designation: 'DevOps Engineer',
            department: 'Operations'
        },
        {
            attendence_id: '6',
            username: 'staff006',
            name: 'Emily Davis',
            mobile: '+91 9876543215',
            duty_time: '09:00 - 18:00',
            status: 'present',
            in_time: '09:05',
            out_time: '18:15',
            designation: 'Frontend Developer',
            department: 'Engineering'
        },
        {
            attendence_id: '7',
            username: 'staff007',
            name: 'David Wilson',
            mobile: '+91 9876543216',
            duty_time: '10:00 - 19:00',
            status: 'present',
            in_time: '10:10',
            out_time: '19:20',
            designation: 'Backend Developer',
            department: 'Engineering'
        },
        {
            attendence_id: '8',
            username: 'staff008',
            name: 'Lisa Anderson',
            mobile: '+91 9876543217',
            duty_time: '09:00 - 18:00',
            status: 'half day',
            in_time: '09:30',
            out_time: '13:45',
            designation: 'HR Manager',
            department: 'Human Resources'
        }
    ];

    // Departments for filter
    const departments = ['All Departments', 'Engineering', 'Management', 'Design', 'Operations', 'Human Resources'];

    // Format date for display
    const formatDisplayDate = (date) => {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getDayName = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    // Format time for display
    const formatTimeDisplay = (time) => {
        if (time === '00:00') return 'Not Marked';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    // Calculate working hours
    const calculateWorkingHours = (inTime, outTime) => {
        if (inTime === '00:00' || outTime === '00:00') return 'N/A';
        
        const [inHour, inMinute] = inTime.split(':').map(Number);
        const [outHour, outMinute] = outTime.split(':').map(Number);
        
        let totalMinutes = (outHour * 60 + outMinute) - (inHour * 60 + inMinute);
        if (totalMinutes < 0) totalMinutes += 24 * 60;
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        return `${hours}h ${minutes}m`;
    };

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

    // Initialize with current date
    useEffect(() => {
        fetchAttendanceData();
    }, [selectedDate, filterDepartment]);

    // Fetch attendance data
    const fetchAttendanceData = async () => {
        setTableLoading(true);
        setTimeout(() => {
            let filteredData = mockAttendanceData;
            
            if (filterDepartment && filterDepartment !== 'All Departments') {
                filteredData = filteredData.filter(staff => staff.department === filterDepartment);
            }
            
            if (searchQuery) {
                filteredData = filteredData.filter(staff =>
                    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    staff.mobile.includes(searchQuery) ||
                    staff.designation.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            
            setAttendanceData(filteredData);
            setSelectedStaff(new Set());
            setBulkAction('');
            setTableLoading(false);
        }, 800);
    };

    // Date navigation
    const navigateDate = (direction) => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setDate(newDate.getDate() - 1);
            } else if (direction === 'next') {
                newDate.setDate(newDate.getDate() + 1);
            } else if (direction === 'today') {
                return new Date();
            }
            return newDate;
        });
    };

    // Selection handlers
    const toggleStaffSelection = (staffId) => {
        const newSelected = new Set(selectedStaff);
        if (newSelected.has(staffId)) {
            newSelected.delete(staffId);
        } else {
            newSelected.add(staffId);
        }
        setSelectedStaff(newSelected);
    };

    const selectAllStaff = () => {
        if (selectedStaff.size === attendanceData.length) {
            setSelectedStaff(new Set());
        } else {
            const allIds = attendanceData.map(staff => staff.attendence_id);
            setSelectedStaff(new Set(allIds));
        }
    };

    const clearSelection = () => {
        setSelectedStaff(new Set());
        setBulkAction('');
    };

    // Bulk action handlers
    const handleBulkAction = async (action) => {
        if (selectedStaff.size === 0) return;

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log(`Bulk ${action} for staff:`, Array.from(selectedStaff));
            setSelectedStaff(new Set());
            setBulkAction('');
            setLoading(false);
        }, 1000);
    };

    // Individual status update
    const updateStaffStatus = async (staffId, status) => {
        setTableLoading(true);

        setTimeout(() => {
            console.log(`Updated staff ${staffId} to ${status}`);
            setTableLoading(false);
        }, 500);
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200";

        switch (status) {
            case 'present':
                return `${baseClasses} bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200 shadow-sm hover:shadow`;
            case 'half day':
                return `${baseClasses} bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200 shadow-sm hover:shadow`;
            case 'absent':
                return `${baseClasses} bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200 shadow-sm hover:shadow`;
            case 'paid leave':
                return `${baseClasses} bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200 shadow-sm hover:shadow`;
            case 'idle':
                return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200 shadow-sm hover:shadow`;
            default:
                return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200 shadow-sm hover:shadow`;
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'present': return <FiCheckCircle className="w-4 h-4" />;
            case 'half day': return <FiAlertTriangle className="w-4 h-4" />;
            case 'absent': return <FiXCircle className="w-4 h-4" />;
            case 'paid leave': return <FiDollarSign className="w-4 h-4" />;
            default: return <FiClock className="w-4 h-4" />;
        }
    };

    // Get status counts
    const getStatusCounts = () => {
        return {
            present: attendanceData.filter(staff => staff.status === 'present').length,
            absent: attendanceData.filter(staff => staff.status === 'absent').length,
            halfDay: attendanceData.filter(staff => staff.status === 'half day').length,
            paidLeave: attendanceData.filter(staff => staff.status === 'paid leave').length,
            idle: attendanceData.filter(staff => staff.status === 'idle').length,
            total: attendanceData.length
        };
    };

    const statusCounts = getStatusCounts();
    const allSelected = selectedStaff.size === attendanceData.length && attendanceData.length > 0;
    const someSelected = selectedStaff.size > 0 && selectedStaff.size < attendanceData.length;

    // Skeleton Loader
    const TableSkeleton = () => (
        <>
            {Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="border-b border-gray-200 animate-pulse">
                    <td className="px-6 py-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-28"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="h-8 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="h-5 bg-gray-200 rounded w-9 mx-auto"></div>
                    </td>
                </tr>
            ))}
        </>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-xs font-medium">Total Staff</p>
                                    <h3 className="text-lg font-bold mt-1">{statusCounts.total} Members</h3>
                                </div>
                                <FiUsers className="w-5 h-5 opacity-80" />
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-4 text-white shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-emerald-100 text-xs font-medium">Present Today</p>
                                    <h3 className="text-lg font-bold mt-1">{statusCounts.present} Staff</h3>
                                </div>
                                <FiCheckCircle className="w-5 h-5 opacity-80" />
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.2 }}
                            className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-100 text-xs font-medium">Absent Today</p>
                                    <h3 className="text-lg font-bold mt-1">{statusCounts.absent} Staff</h3>
                                </div>
                                <FiXCircle className="w-5 h-5 opacity-80" />
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.3 }}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-xs font-medium">On Leave</p>
                                    <h3 className="text-lg font-bold mt-1">{statusCounts.paidLeave} Staff</h3>
                                </div>
                                <FiAlertTriangle className="w-5 h-5 opacity-80" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Date Navigation Card */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6"
                    >
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="p-1.5 bg-blue-100 rounded-lg">
                                        <FiCalendar className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-800">
                                        Attendance Management
                                    </h2>
                                </div>
                                <p className="text-gray-500 text-xs font-medium">
                                    Select staff and update attendance in bulk
                                </p>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                <div className="flex gap-2">
                                    {/* Search Input */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search staff..."
                                            className="pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none transition-colors w-full lg:w-64 shadow-sm"
                                        />
                                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>

                                    {/* Department Filter */}
                                    <div className="relative">
                                        <select
                                            value={filterDepartment}
                                            onChange={(e) => setFilterDepartment(e.target.value)}
                                            className="pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none transition-colors appearance-none w-full lg:w-48 shadow-sm"
                                        >
                                            {departments.map(dept => (
                                                <option key={dept} value={dept === 'All Departments' ? '' : dept}>
                                                    {dept}
                                                </option>
                                            ))}
                                        </select>
                                        <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>

                                    {/* Refresh Button */}
                                    <motion.button
                                        onClick={fetchAttendanceData}
                                        disabled={tableLoading}
                                        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow disabled:opacity-50"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <FiRefreshCw className={`w-4 h-4 ${tableLoading ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Date Navigation Section */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-700 text-sm font-medium">Selected Date:</span>
                                    <span className="text-gray-900 font-bold text-lg">{getDayName(selectedDate)}, {formatDisplayDate(selectedDate)}</span>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    {/* Date Navigation */}
                                    <div className="flex items-center bg-gray-50 rounded-lg p-2 shadow-sm">
                                        <button
                                            onClick={() => navigateDate('prev')}
                                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-all duration-200 hover:shadow"
                                        >
                                            <FiChevronLeft className="w-5 h-5" />
                                        </button>

                                        <div className="flex flex-col items-center px-4 py-2 min-w-40">
                                            <div className="text-sm font-semibold text-gray-800">
                                                {formatDisplayDate(selectedDate)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {getDayName(selectedDate)}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigateDate('next')}
                                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-all duration-200 hover:shadow"
                                        >
                                            <FiChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Today Button */}
                                    <button
                                        onClick={() => navigateDate('today')}
                                        className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                                    >
                                        <FiCalendar className="w-4 h-4" />
                                        Today
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Enhanced Bulk Action Bar */}
                    <AnimatePresence>
                        {selectedStaff.size > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mb-6 shadow-lg"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2 shadow-sm">
                                            <FiCheck className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-blue-900 text-sm">
                                                {selectedStaff.size} staff member{selectedStaff.size !== 1 ? 's' : ''} selected
                                            </h3>
                                            <p className="text-blue-700 text-xs">
                                                Choose an action to apply to all selected staff
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={clearSelection}
                                            className="px-3 py-1.5 text-blue-700 hover:text-blue-900 font-medium text-xs rounded-lg border border-blue-300 bg-white hover:bg-blue-50 transition-colors"
                                        >
                                            Clear Selection
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction('present')}
                                            disabled={loading}
                                            className="px-4 py-1.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium text-xs rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow disabled:opacity-50"
                                        >
                                            <FiCheckCircle className="w-3 h-3" />
                                            Mark Present
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction('absent')}
                                            disabled={loading}
                                            className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium text-xs rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow disabled:opacity-50"
                                        >
                                            <FiXCircle className="w-3 h-3" />
                                            Mark Absent
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction('half day')}
                                            disabled={loading}
                                            className="px-4 py-1.5 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium text-xs rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow disabled:opacity-50"
                                        >
                                            <FiAlertTriangle className="w-3 h-3" />
                                            Half Day
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction('paid leave')}
                                            disabled={loading}
                                            className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-xs rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow disabled:opacity-50"
                                        >
                                            <FiDollarSign className="w-3 h-3" />
                                            Paid Leave
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Enhanced Attendance List Card */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                    >
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            STAFF MEMBER
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            CONTACT & DEPARTMENT
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            DUTY TIME
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            CURRENT STATUS
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            TIME & DURATION
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            QUICK ACTIONS
                                        </th>
                                        <th className="w-12 px-6 py-4 text-left">
                                            <div className="flex items-center justify-center">
                                                <div 
                                                    onClick={selectAllStaff}
                                                    className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-all duration-200 ${allSelected ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gray-200 hover:bg-gray-300'}`}
                                                    title={allSelected ? "Deselect All" : "Select All"}
                                                >
                                                    <div 
                                                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-all duration-200 ${allSelected ? 'translate-x-6' : 'translate-x-1'}`}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {tableLoading ? (
                                        <TableSkeleton />
                                    ) : attendanceData.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="p-3 bg-gray-100 rounded-full mb-3">
                                                        <FiUser className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <p className="text-gray-600 text-sm font-medium mb-1">No staff records found</p>
                                                    <p className="text-gray-500 text-xs mb-4">Try adjusting your search or filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        attendanceData.map((staff) => (
                                            <tr
                                                key={staff.attendence_id}
                                                className={`transition-all duration-150 ${selectedStaff.has(staff.attendence_id) 
                                                    ? 'bg-gradient-to-r from-blue-50 to-blue-25' 
                                                    : 'hover:bg-blue-50/20'
                                                }`}
                                            >
                                                {/* Enhanced Staff Info */}
                                                <td className="px-6 py-4 align-middle">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-sm">
                                                            <span className="text-white font-bold text-xs">
                                                                {staff.name.split(' ').map(n => n[0]).join('')}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900">
                                                                {staff.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                <FiUser className="w-3 h-3" />
                                                                {staff.designation}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Enhanced Contact */}
                                                <td className="px-6 py-4 align-middle">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-gray-800 font-medium text-xs">
                                                            <FiPhone className="w-3 h-3 text-blue-500" />
                                                            {staff.mobile}
                                                        </div>
                                                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
                                                            {staff.department}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Duty Time */}
                                                <td className="px-6 py-4 align-middle">
                                                    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                        <FiClock className="w-4 h-4 text-blue-500" />
                                                        {staff.duty_time}
                                                    </div>
                                                </td>

                                                {/* Enhanced Status */}
                                                <td className="px-6 py-4 align-middle">
                                                    <span className={`inline-flex items-center gap-2 ${getStatusBadge(staff.status)}`}>
                                                        {getStatusIcon(staff.status)}
                                                        <span className="text-xs font-semibold">
                                                            {staff.status.charAt(0).toUpperCase() + staff.status.slice(1).replace('_', ' ')}
                                                        </span>
                                                    </span>
                                                </td>

                                                {/* Enhanced Time Display */}
                                                <td className="px-6 py-4 align-middle">
                                                    {staff.status === 'present' || staff.status === 'half day' ? (
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-medium text-green-700">
                                                                    In: {formatTimeDisplay(staff.in_time)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-medium text-blue-700">
                                                                    Out: {formatTimeDisplay(staff.out_time)}
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                Worked: {calculateWorkingHours(staff.in_time, staff.out_time)}
                                                            </div>
                                                        </div>
                                                    ) : staff.status === 'absent' || staff.status === 'paid leave' ? (
                                                        <span className="text-xs text-gray-500 italic">
                                                            Not marked today
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-500 italic">
                                                            Waiting for check-in
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Enhanced Quick Actions */}
                                                <td className="px-6 py-4 align-middle">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => updateStaffStatus(staff.attendence_id, 'present')}
                                                            disabled={tableLoading}
                                                            className="px-2.5 py-1.5 bg-gradient-to-r from-green-100 to-green-50 text-green-700 text-xs font-medium rounded-lg border border-green-200 hover:from-green-200 hover:to-green-100 transition-all duration-200 hover:scale-105 disabled:opacity-50 shadow-sm"
                                                            title="Mark Present"
                                                        >
                                                            Present
                                                        </button>
                                                        <button
                                                            onClick={() => updateStaffStatus(staff.attendence_id, 'absent')}
                                                            disabled={tableLoading}
                                                            className="px-2.5 py-1.5 bg-gradient-to-r from-red-100 to-red-50 text-red-700 text-xs font-medium rounded-lg border border-red-200 hover:from-red-200 hover:to-red-100 transition-all duration-200 hover:scale-105 disabled:opacity-50 shadow-sm"
                                                            title="Mark Absent"
                                                        >
                                                            Absent
                                                        </button>
                                                        <button
                                                            onClick={() => updateStaffStatus(staff.attendence_id, 'half day')}
                                                            disabled={tableLoading}
                                                            className="px-2.5 py-1.5 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 text-xs font-medium rounded-lg border border-yellow-200 hover:from-yellow-200 hover:to-yellow-100 transition-all duration-200 hover:scale-105 disabled:opacity-50 shadow-sm"
                                                            title="Mark Half Day"
                                                        >
                                                            Half Day
                                                        </button>
                                                    </div>
                                                </td>

                                                {/* Toggle Switch */}
                                                <td className="px-6 py-4 align-middle">
                                                    <div className="flex items-center justify-center">
                                                        <div 
                                                            onClick={() => toggleStaffSelection(staff.attendence_id)}
                                                            className={`relative inline-flex items-center h-5 rounded-full w-9 cursor-pointer transition-all duration-200 ${selectedStaff.has(staff.attendence_id) ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gray-200 hover:bg-gray-300'}`}
                                                        >
                                                            <div 
                                                                className={`inline-block w-3 h-3 transform bg-white rounded-full transition-all duration-200 ${selectedStaff.has(staff.attendence_id) ? 'translate-x-5' : 'translate-x-1'}`}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Enhanced Table Footer */}
                        {attendanceData.length > 0 && (
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-3 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-600">
                                            Showing <span className="font-semibold">{attendanceData.length}</span> staff members
                                        </span>
                                        {selectedStaff.size > 0 && (
                                            <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                                                {selectedStaff.size} selected
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
                                            <FiDownload className="w-3 h-3" />
                                            Export
                                        </button>
                                        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
                                            <FiPrinter className="w-3 h-3" />
                                            Print
                                        </button>
                                        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
                                            <FiSend className="w-3 h-3" />
                                            Notify
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ManageAttendance;