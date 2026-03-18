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
    FiMoreVertical,
    FiCheckSquare,
    FiXSquare,
    FiStar,
    FiAward,
    FiMinusCircle,
    FiPlusCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, Sidebar } from '../components/header';
import API_BASE_URL from "../utils/api-controller";
import getHeaders from "../utils/get-headers";
import { toast } from 'react-hot-toast';

const ManageAttendance = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState({});
    const [attendanceData, setAttendanceData] = useState([]);
    const [absentStaff, setAbsentStaff] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStaff, setSelectedStaff] = useState(new Set());
    const [bulkAction, setBulkAction] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [summary, setSummary] = useState({
        total_staff: 0,
        present: 0,
        absent: 0,
        breakdown: {
            present: 0,
            half_day: 0,
            paid_leave: 0,
            fine: 0,
            bonus: 0,
            pending: 0
        }
    });

    // Modal state for manual verification
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [verifyForm, setVerifyForm] = useState({
        verify_status: 'present',
        manual_punch_in: '',
        manual_punch_out: '',
        admin_remarks: ''
    });

    // Departments for filter (will be populated from API)
    const [departments, setDepartments] = useState(['All Departments']);

    // Format date for API (YYYY-MM-DD)
    const formatDateForAPI = (date) => {
        return date.toISOString().split('T')[0];
    };

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
        if (!time || time === '00:00:00') return 'Not Marked';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    // Format datetime for display
    const formatDateTime = (datetime) => {
        if (!datetime) return 'Not Marked';
        const date = new Date(datetime);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200";

        switch (status?.code || status) {
            case 'present':
            case 'present':
                return `${baseClasses} bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200 shadow-sm hover:shadow`;
            case 'half_day':
            case 'half day':
                return `${baseClasses} bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200 shadow-sm hover:shadow`;
            case 'absent':
                return `${baseClasses} bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200 shadow-sm hover:shadow`;
            case 'paid_leave':
            case 'paid leave':
                return `${baseClasses} bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200 shadow-sm hover:shadow`;
            case 'bonus':
                return `${baseClasses} bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-200 shadow-sm hover:shadow`;
            case 'fine':
                return `${baseClasses} bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 border border-orange-200 shadow-sm hover:shadow`;
            case 'pending':
                return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200 shadow-sm hover:shadow`;
            default:
                return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200 shadow-sm hover:shadow`;
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        const statusCode = status?.code || status;
        switch (statusCode) {
            case 'present': return <FiCheckCircle className="w-4 h-4" />;
            case 'half_day': return <FiAlertTriangle className="w-4 h-4" />;
            case 'absent': return <FiXCircle className="w-4 h-4" />;
            case 'paid_leave': return <FiDollarSign className="w-4 h-4" />;
            case 'bonus': return <FiAward className="w-4 h-4" />;
            case 'fine': return <FiMinusCircle className="w-4 h-4" />;
            case 'pending': return <FiClock className="w-4 h-4" />;
            default: return <FiClock className="w-4 h-4" />;
        }
    };

    // Get status display text
    const getStatusDisplay = (status) => {
        if (status?.display) return status.display;
        if (typeof status === 'string') {
            return status.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }
        return 'Unknown';
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

    // Fetch attendance data when date or filter changes
    useEffect(() => {
        fetchAttendanceData();
    }, [selectedDate, filterDepartment]);

    // Extract unique departments from attendance data
    useEffect(() => {
        const depts = new Set();
        attendanceData.forEach(staff => {
            if (staff.profile?.department) {
                depts.add(staff.profile.department);
            }
        });
        absentStaff.forEach(staff => {
            if (staff.profile?.department) {
                depts.add(staff.profile.department);
            }
        });
        setDepartments(['All Departments', ...Array.from(depts)]);
    }, [attendanceData, absentStaff]);

    // Fetch attendance data from API
    const fetchAttendanceData = async () => {
        setTableLoading(true);
        try {
            const dateStr = formatDateForAPI(selectedDate);
            const response = await fetch(
                `${API_BASE_URL}/attendance/by-date?date=${dateStr}`,
                {
                    method: 'GET',
                    headers: getHeaders()
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch attendance data');
            }

            const result = await response.json();
            
            if (result.success) {
                // Transform API data to component format
                const presentStaff = result.data.attendance.map(item => ({
                    attendence_id: item.attendance_id,
                    username: item.username,
                    name: item.profile.name,
                    mobile: item.profile.mobile,
                    email: item.profile.email,
                    image: item.profile.image,
                    designation: item.profile.designation,
                    department: item.profile.department || 'General',
                    duty_time: '09:00 - 18:00', // This might come from a different API
                    status: item.status,
                    in_time: item.punch_details?.punch_in?.time || '00:00',
                    out_time: item.punch_details?.punch_out?.time || '00:00',
                    in_datetime: item.punch_details?.punch_in?.datetime,
                    out_datetime: item.punch_details?.punch_out?.datetime,
                    working_hours: item.working_hours,
                    is_verified: item.status.is_verified,
                    is_manual: item.is_manual,
                    manual_reason: item.manual_reason,
                    salary: item.salary
                }));

                // Transform absent staff data
                const absentStaffData = result.data.absent_staff.map(item => ({
                    attendence_id: `absent-${item.username}`,
                    username: item.username,
                    name: item.profile.name,
                    mobile: item.profile.mobile,
                    email: item.profile.email,
                    image: item.profile.image,
                    designation: item.profile.designation,
                    department: item.profile.department || 'General',
                    duty_time: '09:00 - 18:00',
                    status: { code: 'absent', display: '❌ Absent', is_verified: false },
                    in_time: '00:00',
                    out_time: '00:00',
                    is_verified: false,
                    salary: item.salary
                }));

                setAttendanceData(presentStaff);
                setAbsentStaff(absentStaffData);
                setSummary(result.data.summary);
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
            toast.error('Failed to load attendance data');
        } finally {
            setTableLoading(false);
        }
    };

    // Verify attendance
    const verifyAttendance = async () => {
        if (!selectedAttendance) return;

        setVerifyLoading(prev => ({ ...prev, [selectedAttendance.attendence_id]: true }));
        
        try {
            const payload = {
                attendance_id: selectedAttendance.attendence_id,
                verify_status: verifyForm.verify_status,
                admin_remarks: verifyForm.admin_remarks || `Verified as ${verifyForm.verify_status}`
            };

            // Add manual punch times if provided
            if (verifyForm.manual_punch_in) {
                payload.manual_punch_in = verifyForm.manual_punch_in;
            }
            if (verifyForm.manual_punch_out) {
                payload.manual_punch_out = verifyForm.manual_punch_out;
            }

            const response = await fetch(
                `${API_BASE_URL}/attendance/admin/verify`,
                {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                throw new Error('Failed to verify attendance');
            }

            const result = await response.json();
            
            if (result.success) {
                toast.success('Attendance verified successfully');
                setShowVerifyModal(false);
                setSelectedAttendance(null);
                setVerifyForm({
                    verify_status: 'present',
                    manual_punch_in: '',
                    manual_punch_out: '',
                    admin_remarks: ''
                });
                // Refresh data
                fetchAttendanceData();
            }
        } catch (error) {
            console.error('Error verifying attendance:', error);
            toast.error('Failed to verify attendance');
        } finally {
            setVerifyLoading(prev => ({ ...prev, [selectedAttendance.attendence_id]: false }));
        }
    };

    // Open verify modal
    const openVerifyModal = (attendance) => {
        setSelectedAttendance(attendance);
        setVerifyForm({
            verify_status: attendance.status?.code || 'present',
            manual_punch_in: attendance.in_datetime ? 
                new Date(attendance.in_datetime).toISOString().slice(0, 16) : '',
            manual_punch_out: attendance.out_datetime ? 
                new Date(attendance.out_datetime).toISOString().slice(0, 16) : '',
            admin_remarks: attendance.status?.remarks || ''
        });
        setShowVerifyModal(true);
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
        const allStaff = [...attendanceData, ...absentStaff];
        if (selectedStaff.size === allStaff.length) {
            setSelectedStaff(new Set());
        } else {
            const allIds = allStaff.map(staff => staff.attendence_id);
            setSelectedStaff(new Set(allIds));
        }
    };

    const clearSelection = () => {
        setSelectedStaff(new Set());
        setBulkAction('');
    };

    // Bulk action handler
    const handleBulkAction = async (action) => {
        if (selectedStaff.size === 0) return;

        setLoading(true);
        
        try {
            // For bulk actions, we need to verify each selected staff
            const selectedIds = Array.from(selectedStaff);
            
            // Find the actual attendance records (excluding absent ones)
            const selectedAttendances = attendanceData.filter(
                staff => selectedIds.includes(staff.attendence_id)
            );

            // Verify each attendance
            for (const attendance of selectedAttendances) {
                const payload = {
                    attendance_id: attendance.attendence_id,
                    verify_status: action,
                    admin_remarks: `Bulk verified as ${action}`
                };

                await fetch(
                    `${API_BASE_URL}/attendance/admin/verify`,
                    {
                        method: 'POST',
                        headers: getHeaders(),
                        body: JSON.stringify(payload)
                    }
                );
            }

            toast.success(`Bulk ${action} completed successfully`);
            setSelectedStaff(new Set());
            setBulkAction('');
            fetchAttendanceData();
        } catch (error) {
            console.error('Error in bulk action:', error);
            toast.error('Failed to complete bulk action');
        } finally {
            setLoading(false);
        }
    };

    // Get filtered data based on search and department
    const getFilteredData = () => {
        const allStaff = [...attendanceData, ...absentStaff];
        
        return allStaff.filter(staff => {
            // Department filter
            if (filterDepartment && filterDepartment !== 'All Departments') {
                if (staff.department !== filterDepartment) return false;
            }
            
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    staff.name.toLowerCase().includes(query) ||
                    staff.mobile.includes(query) ||
                    staff.designation?.toLowerCase().includes(query) ||
                    staff.email?.toLowerCase().includes(query)
                );
            }
            
            return true;
        });
    };

    const filteredData = getFilteredData();
    const allSelected = selectedStaff.size === filteredData.length && filteredData.length > 0;
    const someSelected = selectedStaff.size > 0 && selectedStaff.size < filteredData.length;

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
                                    <h3 className="text-lg font-bold mt-1">{summary.total_staff} Members</h3>
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
                                    <h3 className="text-lg font-bold mt-1">{summary.present} Staff</h3>
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
                                    <h3 className="text-lg font-bold mt-1">{summary.absent} Staff</h3>
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
                                    <p className="text-purple-100 text-xs font-medium">Pending Verification</p>
                                    <h3 className="text-lg font-bold mt-1">{summary.verification?.pending || 0} Staff</h3>
                                </div>
                                <FiClock className="w-5 h-5 opacity-80" />
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
                                    Verify and manage staff attendance
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
                                            onClick={() => handleBulkAction('half_day')}
                                            disabled={loading}
                                            className="px-4 py-1.5 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium text-xs rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow disabled:opacity-50"
                                        >
                                            <FiAlertTriangle className="w-3 h-3" />
                                            Half Day
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction('paid_leave')}
                                            disabled={loading}
                                            className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-xs rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow disabled:opacity-50"
                                        >
                                            <FiDollarSign className="w-3 h-3" />
                                            Paid Leave
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction('bonus')}
                                            disabled={loading}
                                            className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium text-xs rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow disabled:opacity-50"
                                        >
                                            <FiAward className="w-3 h-3" />
                                            Bonus
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction('fine')}
                                            disabled={loading}
                                            className="px-4 py-1.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium text-xs rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow disabled:opacity-50"
                                        >
                                            <FiMinusCircle className="w-3 h-3" />
                                            Fine
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
                                            VERIFICATION
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
                                    ) : filteredData.length === 0 ? (
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
                                        filteredData.map((staff) => (
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
                                                                {staff.name?.split(' ').map(n => n[0]).join('') || 'NA'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900">
                                                                {staff.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                <FiUser className="w-3 h-3" />
                                                                {staff.designation || 'No Designation'}
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
                                                            {staff.department || 'General'}
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
                                                            {getStatusDisplay(staff.status)}
                                                        </span>
                                                    </span>
                                                    {staff.status?.is_verified && (
                                                        <span className="ml-2 text-xs text-green-600">
                                                            ✓ Verified
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Enhanced Time Display */}
                                                <td className="px-6 py-4 align-middle">
                                                    {staff.in_time !== '00:00' ? (
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
                                                            {staff.working_hours && (
                                                                <div className="text-xs text-gray-500">
                                                                    Worked: {staff.working_hours.formatted}
                                                                    {staff.working_hours.extra_minutes > 0 && (
                                                                        <span className="text-green-600 ml-1">
                                                                            (+{Math.floor(staff.working_hours.extra_minutes/60)}h extra)
                                                                        </span>
                                                                    )}
                                                                    {staff.working_hours.less_minutes > 0 && (
                                                                        <span className="text-orange-600 ml-1">
                                                                            (-{Math.floor(staff.working_hours.less_minutes/60)}h less)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-500 italic">
                                                            Not marked today
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Verification Actions */}
                                                <td className="px-6 py-4 align-middle">
                                                    {staff.status?.code !== 'absent' && (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => openVerifyModal(staff)}
                                                                disabled={verifyLoading[staff.attendence_id]}
                                                                className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200 hover:from-blue-200 hover:to-blue-100 transition-all duration-200 hover:scale-105 disabled:opacity-50 shadow-sm flex items-center gap-1"
                                                            >
                                                                <FiCheckSquare className="w-3 h-3" />
                                                                {staff.status?.is_verified ? 'Re-verify' : 'Verify'}
                                                            </button>
                                                        </div>
                                                    )}
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
                        {filteredData.length > 0 && (
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-3 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-600">
                                            Showing <span className="font-semibold">{filteredData.length}</span> staff members
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
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

           {/* Verification Modal */}
<AnimatePresence>
    {showVerifyModal && selectedAttendance && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVerifyModal(false)}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Verify Attendance
                    </h3>
                    
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">{selectedAttendance.name}</p>
                        <p className="text-xs text-gray-500">{selectedAttendance.designation}</p>
                    </div>

                    {/* Current Punch Times Display */}
                    {selectedAttendance.in_time !== '00:00' && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1">
                                <FiClock className="w-3 h-3" />
                                CURRENT PUNCH TIMES
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-blue-600">Punch In</p>
                                    <p className="text-sm font-medium text-blue-900">
                                        {formatDateTime(selectedAttendance.in_datetime) || formatTimeDisplay(selectedAttendance.in_time)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600">Punch Out</p>
                                    <p className="text-sm font-medium text-blue-900">
                                        {selectedAttendance.out_time !== '00:00' 
                                            ? (formatDateTime(selectedAttendance.out_datetime) || formatTimeDisplay(selectedAttendance.out_time))
                                            : 'Not Marked'}
                                    </p>
                                </div>
                            </div>
                            {selectedAttendance.working_hours && (
                                <div className="mt-2 pt-2 border-t border-blue-200">
                                    <p className="text-xs text-blue-600">Total Working Hours</p>
                                    <p className="text-sm font-medium text-blue-900">
                                        {selectedAttendance.working_hours.formatted}
                                        {selectedAttendance.working_hours.extra_minutes > 0 && (
                                            <span className="text-green-600 ml-2 text-xs">
                                                (+{Math.floor(selectedAttendance.working_hours.extra_minutes/60)}h {selectedAttendance.working_hours.extra_minutes % 60}m extra)
                                            </span>
                                        )}
                                        {selectedAttendance.working_hours.less_minutes > 0 && (
                                            <span className="text-orange-600 ml-2 text-xs">
                                                (-{Math.floor(selectedAttendance.working_hours.less_minutes/60)}h {selectedAttendance.working_hours.less_minutes % 60}m less)
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Manual Entry Toggle */}
                    <div className="mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={verifyForm.isManual}
                                onChange={(e) => setVerifyForm({...verifyForm, isManual: e.target.checked})}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Enter Manual Punch Times</span>
                        </label>
                        <p className="text-xs text-gray-500 ml-6 mt-1">
                            Enable this to override the current punch times
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Status Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Verification Status
                            </label>
                            <select
                                value={verifyForm.verify_status}
                                onChange={(e) => {
                                    const newStatus = e.target.value;
                                    setVerifyForm({...verifyForm, verify_status: newStatus});
                                    
                                    // Auto-calculate fine/bonus based on working hours
                                    if (selectedAttendance.working_hours) {
                                        if (newStatus === 'bonus' && selectedAttendance.working_hours.extra_minutes === 0) {
                                            toast('No extra hours detected. Please verify working hours.', {
                                                icon: '⚠️',
                                                style: { background: '#FEF3C7', color: '#92400E' }
                                            });
                                        }
                                        if (newStatus === 'fine' && selectedAttendance.working_hours.less_minutes === 0) {
                                            toast('No less hours detected. Please verify working hours.', {
                                                icon: '⚠️',
                                                style: { background: '#FEF3C7', color: '#92400E' }
                                            });
                                        }
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="present">Present</option>
                                <option value="half_day">Half Day</option>
                                <option value="absent">Absent</option>
                                <option value="paid_leave">Paid Leave</option>
                                <option value="bonus">Bonus (Extra Hours)</option>
                                <option value="fine">Fine (Less Hours)</option>
                            </select>
                        </div>

                        {/* Working Hours Summary based on status */}
                        {verifyForm.verify_status === 'bonus' && selectedAttendance.working_hours?.extra_minutes > 0 && (
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-xs text-green-800 flex items-center gap-1">
                                    <FiAward className="w-3 h-3" />
                                    Bonus Amount: ₹{Math.floor(selectedAttendance.working_hours.extra_minutes / 60) * 100} 
                                    (₹100 per extra hour)
                                </p>
                            </div>
                        )}

                        {verifyForm.verify_status === 'fine' && selectedAttendance.working_hours?.less_minutes > 0 && (
                            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                <p className="text-xs text-orange-800 flex items-center gap-1">
                                    <FiMinusCircle className="w-3 h-3" />
                                    Fine Amount: ₹{Math.floor(selectedAttendance.working_hours.less_minutes / 60) * 50} 
                                    (₹50 per less hour)
                                </p>
                            </div>
                        )}

                        {/* Manual Punch In - Only shown when manual toggle is checked */}
                        {verifyForm.isManual && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Manual Punch In
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={verifyForm.manual_punch_in}
                                        onChange={(e) => setVerifyForm({...verifyForm, manual_punch_in: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Current: {formatDateTime(selectedAttendance.in_datetime) || 'Not Marked'}
                                    </p>
                                </div>

                                {/* Manual Punch Out */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Manual Punch Out
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={verifyForm.manual_punch_out}
                                        onChange={(e) => setVerifyForm({...verifyForm, manual_punch_out: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Current: {formatDateTime(selectedAttendance.out_datetime) || 'Not Marked'}
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Remarks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Remarks
                            </label>
                            <textarea
                                value={verifyForm.admin_remarks}
                                onChange={(e) => setVerifyForm({...verifyForm, admin_remarks: e.target.value})}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Enter verification remarks..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setShowVerifyModal(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={verifyAttendance}
                            disabled={verifyLoading[selectedAttendance.attendence_id]}
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {verifyLoading[selectedAttendance.attendence_id] ? (
                                <>
                                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <FiCheck className="w-4 h-4" />
                                    Verify
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )}
</AnimatePresence>
        </div>
    );
};

export default ManageAttendance;