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
    FiDollarSign
} from 'react-icons/fi';
import { Header, Sidebar } from '../components/header';

const ManageAttendance = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [loading, setLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStaff, setSelectedStaff] = useState(new Set());
    const [bulkAction, setBulkAction] = useState('');

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
        }
    ];

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
    }, [selectedDate]);

    // Fetch attendance data
    const fetchAttendanceData = async () => {
        setLoading(true);
        setTimeout(() => {
            setAttendanceData(mockAttendanceData);
            setSelectedStaff(new Set());
            setBulkAction('');
            setLoading(false);
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

            // Show success message
            alert(`Successfully marked ${selectedStaff.size} staff as ${action}`);
        }, 1000);
    };

    // Individual status update
    const updateStaffStatus = async (staffId, status) => {
        setLoading(true);

        setTimeout(() => {
            console.log(`Updated staff ${staffId} to ${status}`);
            setLoading(false);
        }, 500);
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";

        switch (status) {
            case 'present':
                return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
            case 'half day':
                return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
            case 'absent':
                return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
            case 'paid leave':
                return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
            case 'idle':
                return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
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

    const allSelected = selectedStaff.size === attendanceData.length && attendanceData.length > 0;
    const someSelected = selectedStaff.size > 0 && selectedStaff.size < attendanceData.length;

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
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Manage Attendance</h1>
                        <p className="text-gray-600 mt-1">
                            Bulk attendance management
                        </p>
                    </div>

                    {/* Date Navigation Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">Attendance Management</h2>
                                <p className="text-gray-600">Select staff and update attendance in bulk</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Date Navigation */}
                                <div className="flex items-center bg-gray-50 rounded-lg p-2">
                                    <button
                                        onClick={() => navigateDate('prev')}
                                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-all duration-200"
                                    >
                                        <FiChevronLeft className="w-5 h-5" />
                                    </button>

                                    <div className="flex flex-col items-center px-4 py-2 min-w-40">
                                        <div className="text-lg font-semibold text-gray-800">
                                            {formatDisplayDate(selectedDate)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {getDayName(selectedDate)}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigateDate('next')}
                                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-all duration-200"
                                    >
                                        <FiChevronRight className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Today Button */}
                                <button
                                    onClick={() => navigateDate('today')}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                                >
                                    <FiCalendar className="w-4 h-4" />
                                    Today
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bulk Action Bar */}
                    {selectedStaff.size > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 rounded-lg p-2">
                                        <FiCheck className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-blue-900">
                                            {selectedStaff.size} staff selected
                                        </h3>
                                        <p className="text-blue-700 text-sm">
                                            Choose an action to apply to all selected staff
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={clearSelection}
                                        className="px-4 py-2 text-blue-700 hover:text-blue-900 font-medium rounded-lg transition-colors"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('present')}
                                        disabled={loading}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <FiCheckCircle className="w-4 h-4" />
                                        Mark Present
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('absent')}
                                        disabled={loading}
                                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <FiXCircle className="w-4 h-4" />
                                        Mark Absent
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Attendance List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Staff Member
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Duty Time
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Current Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Quick Actions
                                        </th>
                                        <th className="w-12 px-6 py-4 text-left">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={allSelected}
                                                    ref={input => {
                                                        if (input) {
                                                            input.indeterminate = someSelected;
                                                        }
                                                    }}
                                                    onChange={selectAllStaff}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : attendanceData.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                No staff records found
                                            </td>
                                        </tr>
                                    ) : (
                                        attendanceData.map((staff) => (
                                            <tr
                                                key={staff.attendence_id}
                                                className={`hover:bg-gray-50 transition-colors ${selectedStaff.has(staff.attendence_id) ? 'bg-blue-50' : ''
                                                    }`}
                                            >
                                                {/* Staff Info */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                                                            <span className="text-white font-semibold text-sm">
                                                                {staff.name.split(' ').map(n => n[0]).join('')}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                {staff.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {staff.designation}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{staff.mobile}</div>
                                                    <div className="text-sm text-gray-500">{staff.department}</div>
                                                </td>

                                                {/* Duty Time */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {staff.duty_time}
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-2 ${getStatusBadge(staff.status)}`}>
                                                        {getStatusIcon(staff.status)}
                                                        {staff.status.charAt(0).toUpperCase() + staff.status.slice(1).replace('_', ' ')}
                                                    </span>
                                                </td>

                                                {/* Time */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {staff.status === 'present' ? (
                                                        <div className="text-sm">
                                                            <div className="text-green-700 font-medium">In: {formatTimeDisplay(staff.in_time)}</div>
                                                            <div className="text-green-700">Out: {formatTimeDisplay(staff.out_time)}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">Not marked</span>
                                                    )}
                                                </td>

                                                {/* Quick Actions */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateStaffStatus(staff.attendence_id, 'present')}
                                                            disabled={loading}
                                                            className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                                                        >
                                                            Present
                                                        </button>
                                                        <button
                                                            onClick={() => updateStaffStatus(staff.attendence_id, 'absent')}
                                                            disabled={loading}
                                                            className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                                                        >
                                                            Absent
                                                        </button>
                                                    </div>
                                                </td>

                                                {/* Checkbox */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedStaff.has(staff.attendence_id)}
                                                        onChange={() => toggleStaffSelection(staff.attendence_id)}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        {attendanceData.length > 0 && (
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Showing {attendanceData.length} staff members
                                    </div>
                                    {selectedStaff.size > 0 && (
                                        <div className="text-sm font-medium text-blue-700">
                                            {selectedStaff.size} selected for bulk action
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageAttendance;