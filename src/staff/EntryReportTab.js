import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import API_BASE_URL from "../utils/api-controller";
import getHeaders from "../utils/get-headers";

const EntryReportTab = ({ entryReport, setEntryReport, variants }) => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loginTimes, setLoginTimes] = useState([]);
    const [currentPunchStatus, setCurrentPunchStatus] = useState(null);
    const [dateFilter, setDateFilter] = useState({
        fromDate: getDefaultFromDate(),
        toDate: new Date().toISOString().split('T')[0]
    });

    // Get username from URL
    const getUsernameFromUrl = () => {
        const params = new URLSearchParams(location.search);
        return params.get('username');
    };

    // Get default from date (7 days ago)
    function getDefaultFromDate() {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split('T')[0];
    }

    // Fetch login times when component mounts or filters change
    useEffect(() => {
        fetchLoginTimes();
    }, [dateFilter.fromDate, dateFilter.toDate, location.search]);

    const fetchLoginTimes = async () => {
        const username = getUsernameFromUrl();
        if (!username) return;

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(
                `${API_BASE_URL}/attendance/showLoginTimes?username=${username}&from_date=${dateFilter.fromDate}&to_date=${dateFilter.toDate}`,
                {
                    method: 'GET',
                    headers: getHeaders()
                }
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch login times');
            }
            
            const data = await response.json();
            if (data.success) {
                setLoginTimes(data.data.login_times || []);
                // Update current punch status based on latest record
                if (data.data.login_times && data.data.login_times.length > 0) {
                    const latest = data.data.login_times[data.data.login_times.length - 1];
                    setCurrentPunchStatus({
                        isPunchedIn: !latest.punch_out,
                        lastPunch: latest
                    });
                }
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching login times:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDateFilterChange = (type, value) => {
        setDateFilter(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const handleApplyFilter = () => {
        fetchLoginTimes();
    };

    // Format date for display
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '—';
            
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                timeZone: 'Asia/Kolkata'
            });
        } catch (error) {
            return '—';
        }
    };

    // Format time
    const formatTime = (timeStr) => {
        if (!timeStr) return '—';
        if (typeof timeStr === 'string' && timeStr.match(/^\d{2}:\d{2}:\d{2}$/)) {
            const [hours, minutes, seconds] = timeStr.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
        }
        try {
            const date = new Date(timeStr);
            if (!isNaN(date.getTime())) {
                return date.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                    timeZone: 'Asia/Kolkata'
                });
            }
        } catch (error) {
            return '—';
        }
        return '—';
    };

    // Format duration from total_hours and total_minutes
    const formatDuration = (totalHours, totalMinutes) => {
        if (totalHours && totalMinutes !== undefined) {
            const hours = parseFloat(totalHours) || 0;
            const minutes = totalMinutes || 0;
            
            if (hours === 0 && minutes === 0) return '—';
            
            const hrs = Math.floor(hours);
            const mins = minutes % 60;
            
            if (hrs > 0 && mins > 0) {
                return `${hrs}h ${mins}m`;
            } else if (hrs > 0) {
                return `${hrs}h`;
            } else if (mins > 0) {
                return `${mins}m`;
            }
        }
        return '—';
    };

    // Get status color based on status
    const getStatusColor = (status) => {
        const colors = {
            'fine': 'bg-orange-100 text-orange-700 border-orange-200',
            'present': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'absent': 'bg-rose-100 text-rose-700 border-rose-200',
            'half_day': 'bg-amber-100 text-amber-700 border-amber-200',
            'overtime': 'bg-blue-100 text-blue-700 border-blue-200',
            'paid_leave': 'bg-purple-100 text-purple-700 border-purple-200',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    // Get status display text
    const getStatusDisplay = (status) => {
        if (!status) return '—';
        return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    };

    // Icons
    const ClockIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const LoginIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
    );

    const LogoutIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    );

    const RefreshIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
    );

    const CheckIcon = () => (
        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );

    const XIcon = () => (
        <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );

    const username = getUsernameFromUrl();

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
        >
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Entry Report - {entryReport.month}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {username ? `Viewing entries for user: ${username}` : 'Track employee login/logout records'}
                        </p>
                    </div>

                    {/* Date Filter */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={dateFilter.fromDate}
                                onChange={(e) => handleDateFilterChange('fromDate', e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="date"
                                value={dateFilter.toDate}
                                onChange={(e) => handleDateFilterChange('toDate', e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <button
                            onClick={handleApplyFilter}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Refresh"
                        >
                            <RefreshIcon />
                        </button>
                    </div>
                </div>

                {/* Login Times Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600">{error}</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Punch In Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Punch Out Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loginTimes.length > 0 ? (
                                    loginTimes.map((item, index) => (
                                        <motion.tr 
                                            key={item.id || index}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatDate(item.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <LoginIcon />
                                                    {formatTime(item.punch_in)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {item.punch_out ? (
                                                    <div className="flex items-center gap-2">
                                                        <LogoutIcon />
                                                        {formatTime(item.punch_out)}
                                                    </div>
                                                ) : (
                                                    <span className="text-amber-600 font-medium">Active</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {item.total_hours || item.total_minutes ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{item.total_hours ? `${item.total_hours} hrs` : '—'}</span>
                                                        <span className="text-xs text-gray-500">{item.total_minutes ? `${item.total_minutes} mins` : '—'}</span>
                                                    </div>
                                                ) : (
                                                    '—'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                                    {getStatusDisplay(item.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {item.is_verified ? (
                                                        <>
                                                            <CheckIcon />
                                                            <span className="text-xs text-emerald-600 font-medium">Verified</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XIcon />
                                                            <span className="text-xs text-rose-600 font-medium">Not Verified</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            {username ? (
                                                <>
                                                    No login records found for the selected date range.
                                                </>
                                            ) : (
                                                'No username provided in URL. Please select a staff member.'
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Table Footer */}
                {loginTimes.length > 0 && (
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 mt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Total {loginTimes.length} login record{loginTimes.length !== 1 ? 's' : ''}
                            </span>
                            {currentPunchStatus?.isPunchedIn && (
                                <span className="text-xs text-emerald-600 font-medium">
                                    ● Active session since {formatTime(currentPunchStatus.lastPunch.punch_in)}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default EntryReportTab;