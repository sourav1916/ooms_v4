import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import API_BASE_URL from "../utils/api-controller";
import getHeaders from "../utils/get-headers";

const AttendanceTab = ({ attendance, setAttendance, variants }) => {
    const location = useLocation();
    const [selectedMonth, setSelectedMonth] = useState('March');
    const [selectedYear, setSelectedYear] = useState(2026);
    const [loading, setLoading] = useState(false);
    const [calendarLoading, setCalendarLoading] = useState(false);
    const [punchLoading, setPunchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [monthlySummary, setMonthlySummary] = useState(null);
    const [calendarData, setCalendarData] = useState(null);
    const [staffInfo, setStaffInfo] = useState(null);
    const [period, setPeriod] = useState(null);
    const [selectedDayDetails, setSelectedDayDetails] = useState(null);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = [2023, 2024, 2025, 2026];

    // Get username from URL
    const getUsernameFromUrl = () => {
        const params = new URLSearchParams(location.search);
        return params.get('username');
    };

    // Fetch monthly summary when month/year changes
    useEffect(() => {
        fetchMonthlySummary();
    }, [selectedMonth, selectedYear, location.search]);

    // Fetch calendar data when month/year changes
    useEffect(() => {
        fetchCalendarData();
    }, [selectedMonth, selectedYear, location.search]);

    const fetchMonthlySummary = async () => {
        const username = getUsernameFromUrl();
        if (!username) return;

        try {
            setLoading(true);
            setError(null);
            
            const monthIndex = months.indexOf(selectedMonth) + 1;
            
            const response = await fetch(
                `${API_BASE_URL}/attendance/staff-monthly-summary/${username}?month=${monthIndex}&year=${selectedYear}`,
                {
                    method: 'GET',
                    headers: getHeaders()
                }
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch monthly summary');
            }
            
            const data = await response.json();
            if (data.success) {
                setMonthlySummary(data.data.summary);
                setStaffInfo(data.data.staff_info);
                setPeriod(data.data.period);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching monthly summary:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCalendarData = async () => {
        const username = getUsernameFromUrl();
        if (!username) return;

        try {
            setCalendarLoading(true);
            
            const monthIndex = months.indexOf(selectedMonth) + 1;
            
            const response = await fetch(
                `${API_BASE_URL}/attendance/attendance-calendar/${username}?month=${monthIndex}&year=${selectedYear}`,
                {
                    method: 'GET',
                    headers: getHeaders()
                }
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch calendar data');
            }
            
            const data = await response.json();
            if (data.success) {
                setCalendarData(data.data);
            }
        } catch (err) {
            console.error('Error fetching calendar data:', err);
        } finally {
            setCalendarLoading(false);
        }
    };

    const handlePunchIn = async () => {
        const username = getUsernameFromUrl();
        if (!username) {
            alert('No username found in URL');
            return;
        }

        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setPunchLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const response = await fetch(
                        `${API_BASE_URL}/attendance/punch-in`,
                        {
                            method: 'POST',
                            headers: getHeaders(),
                            body: JSON.stringify({
                                username: username,
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            })
                        }
                    );

                    if (!response.ok) {
                        throw new Error('Failed to punch in');
                    }

                    const data = await response.json();
                    if (data.success) {
                        alert('Punch In successful!');
                        fetchMonthlySummary();
                        fetchCalendarData();
                    }
                } catch (err) {
                    setError(err.message);
                    console.error('Error punching in:', err);
                    alert('Failed to punch in: ' + err.message);
                } finally {
                    setPunchLoading(false);
                }
            },
            (error) => {
                setError('Failed to get location: ' + error.message);
                setPunchLoading(false);
                alert('Failed to get location: ' + error.message);
            }
        );
    };

    const handlePunchOut = async () => {
        const username = getUsernameFromUrl();
        if (!username) {
            alert('No username found in URL');
            return;
        }

        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setPunchLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const response = await fetch(
                        `${API_BASE_URL}/attendance/punch-out`,
                        {
                            method: 'POST',
                            headers: getHeaders(),
                            body: JSON.stringify({
                                username: username,
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            })
                        }
                    );

                    if (!response.ok) {
                        throw new Error('Failed to punch out');
                    }

                    const data = await response.json();
                    if (data.success) {
                        alert('Punch Out successful!');
                        fetchMonthlySummary();
                        fetchCalendarData();
                    }
                } catch (err) {
                    setError(err.message);
                    console.error('Error punching out:', err);
                    alert('Failed to punch out: ' + err.message);
                } finally {
                    setPunchLoading(false);
                }
            },
            (error) => {
                setError('Failed to get location: ' + error.message);
                setPunchLoading(false);
                alert('Failed to get location: ' + error.message);
            }
        );
    };

    // Handle month navigation
    const handlePreviousMonth = () => {
        const monthIndex = months.indexOf(selectedMonth);
        
        if (monthIndex === 0) {
            setSelectedYear(prev => prev - 1);
            setSelectedMonth('December');
        } else {
            setSelectedMonth(months[monthIndex - 1]);
        }
    };

    const handleNextMonth = () => {
        const monthIndex = months.indexOf(selectedMonth);
        
        if (monthIndex === 11) {
            setSelectedYear(prev => prev + 1);
            setSelectedMonth('January');
        } else {
            setSelectedMonth(months[monthIndex + 1]);
        }
    };

    const handleMonthSelect = (month) => {
        setSelectedMonth(month);
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year);
    };

    const handleDayClick = (dayData) => {
        setSelectedDayDetails(dayData);
    };

    // Format date for display
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '—';
            
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
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
            const [hours, minutes] = timeStr.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
        }
        return '—';
    };

    // Get professional status color for calendar
    const getStatusColor = (status, isToday = false) => {
        const baseColors = {
            'present': 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200',
            'absent': 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200',
            'half_day': 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200',
            'paid_leave': 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
            'fine': 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200',
            'bonus': 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200',
            'pending': 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200',
            'weekly_off': 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200',
            'future': 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
        };
        
        if (isToday) {
            return 'bg-indigo-100 text-indigo-700 border-indigo-300 ring-2 ring-indigo-200';
        }
        
        return baseColors[status?.toLowerCase()] || 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100';
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const badges = {
            'present': { label: 'Present', color: 'bg-emerald-100 text-emerald-800' },
            'absent': { label: 'Absent', color: 'bg-rose-100 text-rose-800' },
            'half_day': { label: 'Half Day', color: 'bg-amber-100 text-amber-800' },
            'paid_leave': { label: 'Paid Leave', color: 'bg-blue-100 text-blue-800' },
            'fine': { label: 'Fine', color: 'bg-orange-100 text-orange-800' },
            'bonus': { label: 'Bonus', color: 'bg-purple-100 text-purple-800' },
            'pending': { label: 'Pending', color: 'bg-gray-100 text-gray-800' },
            'weekly_off': { label: 'Weekly Off', color: 'bg-yellow-100 text-yellow-800' },
            'future': { label: 'Future', color: 'bg-gray-100 text-gray-500' }
        };
        return badges[status?.toLowerCase()] || { label: status || '—', color: 'bg-gray-100 text-gray-700' };
    };

    // SVG Icons - Professional outline icons
    const CalendarIcon = ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );

    const ChevronLeftIcon = ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
    );

    const ChevronRightIcon = ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
    );

    const ChevronDownIcon = ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
    );

    const UserIcon = ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );

    const LoginIcon = ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
    );

    const LogoutIcon = ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    );

    const ClockIcon = ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const LocationIcon = ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    const BriefcaseIcon = ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );

    const username = getUsernameFromUrl();

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-gray-50 p-6"
        >
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Attendance Overview</h1>
                            {staffInfo && (
                                <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                                    <span className="font-medium text-gray-900">{staffInfo.name}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>{staffInfo.designation}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>{staffInfo.email}</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Punch In/Out Buttons */}
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handlePunchIn}
                                disabled={punchLoading || !username}
                                className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                <LoginIcon className="w-4 h-4" />
                                {punchLoading ? 'Processing...' : 'Punch In'}
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handlePunchOut}
                                disabled={punchLoading || !username}
                                className="px-4 py-2 bg-white text-rose-600 text-sm font-medium rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <LogoutIcon className="w-4 h-4" />
                                {punchLoading ? 'Processing...' : 'Punch Out'}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Controls Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Month Dropdown */}
                        <div className="relative">
                            <select 
                                value={selectedMonth}
                                onChange={(e) => handleMonthSelect(e.target.value)}
                                className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer min-w-[140px]"
                            >
                                {months.map(month => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                            </div>
                        </div>

                        {/* Year Dropdown */}
                        <div className="relative">
                            <select 
                                value={selectedYear}
                                onChange={(e) => handleYearSelect(parseInt(e.target.value))}
                                className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer min-w-[100px]"
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button 
                                onClick={handlePreviousMonth}
                                className="p-2 hover:bg-white rounded-lg transition-colors"
                                title="Previous Month"
                            >
                                <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="px-4 py-1 text-sm font-medium text-indigo-600 min-w-[140px] text-center">
                                {selectedMonth} {selectedYear}
                            </span>
                            <button 
                                onClick={handleNextMonth}
                                className="p-2 hover:bg-white rounded-lg transition-colors"
                                title="Next Month"
                            >
                                <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>

                        {/* Period Info */}
                        {period && (
                            <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <CalendarIcon className="w-4 h-4 inline mr-1" />
                                {formatDate(period.start_date)} - {formatDate(period.end_date)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Month Summary Badge */}
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full">
                        {selectedMonth} {selectedYear} Summary
                    </span>
                    {monthlySummary && (
                        <span className="text-sm text-gray-500">
                            Attendance: {monthlySummary.attendance_percentage || '0%'}
                        </span>
                    )}
                </div>

                {/* Summary Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12 text-red-600">{error}</div>
                        ) : monthlySummary ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Days</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Not Marked</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Half Day</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Over Time</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine Hours</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Leave</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-2xl font-bold text-gray-900">{monthlySummary.total_days || 0}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-2xl font-bold text-emerald-600">{monthlySummary.present || 0}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-2xl font-bold text-rose-600">{monthlySummary.absent || 0}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-2xl font-bold text-amber-600">{monthlySummary.not_marked || 0}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-2xl font-bold text-amber-600">{monthlySummary.half_day || 0}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <span className="text-lg font-bold text-blue-600">
                                                    {monthlySummary.over_time?.formatted || '0h 0m'}
                                                </span>
                                                {monthlySummary.over_time?.hours > 0 && (
                                                    <span className="block text-xs text-gray-500">
                                                        {monthlySummary.over_time.hours}h {monthlySummary.over_time.minutes_remainder || 0}m
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <span className="text-lg font-bold text-orange-600">
                                                    {monthlySummary.fine_hours?.formatted || '0h 0m'}
                                                </span>
                                                {monthlySummary.fine_hours?.hours > 0 && (
                                                    <span className="block text-xs text-gray-500">
                                                        {monthlySummary.fine_hours.hours}h {monthlySummary.fine_hours.minutes_remainder || 0}m
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-2xl font-bold text-purple-600">{monthlySummary.paid_leave || 0}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                No summary data available for the selected month
                            </div>
                        )}
                    </div>
                </div>

                {/* Calendar Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Calendar Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <CalendarIcon className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">
                                        {selectedMonth} {selectedYear} Attendance Calendar
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Click on a day to view details
                                    </p>
                                </div>
                            </div>
                            
                            {calendarLoading && (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
                                    <span className="text-sm text-gray-500">Loading...</span>
                                </div>
                            )}

                            {/* Legend */}
                            {calendarData?.legend && (
                                <div className="flex flex-wrap items-center gap-3">
                                    {calendarData.legend.slice(0, 5).map(item => (
                                        <span key={item.status} className="flex items-center gap-1.5 text-xs">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                                            <span className="text-gray-600">{item.label}</span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Week Days */}
                        <div className="grid grid-cols-7 gap-2 mb-3">
                            {weekDays.map(day => (
                                <div key={day} className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarData?.calendar_weeks?.map((week, weekIndex) => 
                                week.map((dayData, dayIndex) => {
                                    if (!dayData) {
                                        return <div key={`empty-${weekIndex}-${dayIndex}`} className="aspect-square" />;
                                    }

                                    const statusBadge = getStatusBadge(dayData.status);
                                    const isToday = dayData.is_today;

                                    return (
                                        <motion.button
                                            key={`${weekIndex}-${dayIndex}`}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => handleDayClick(dayData)}
                                            className={`aspect-square rounded-lg border p-2 transition-all ${getStatusColor(dayData.status, isToday)}`}
                                        >
                                            <div className="h-full flex flex-col">
                                                <div className="flex items-start justify-between">
                                                    <span className={`text-sm font-medium ${isToday ? 'text-indigo-700' : ''}`}>
                                                        {dayData.day}
                                                    </span>
                                                    {dayData.has_attendance && (
                                                        <span className="text-[8px] font-medium px-1 py-0.5 bg-white bg-opacity-50 rounded">
                                                            {dayData.status === 'present' ? '✓' : dayData.status === 'absent' ? '✗' : ''}
                                                        </span>
                                                    )}
                                                </div>
                                                {dayData.status !== 'future' && dayData.status !== 'weekly_off' && (
                                                    <div className="mt-auto">
                                                        <span className="text-[9px] font-medium block truncate">
                                                            {statusBadge.label}
                                                        </span>
                                                    </div>
                                                )}
                                                {dayData.is_weekly_off && (
                                                    <span className="text-[9px] text-gray-500 mt-auto">Week Off</span>
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Calendar Footer with Summary */}
                    {calendarData?.summary && (
                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                            <div className="flex flex-wrap items-center gap-4 text-xs">
                                <span className="text-gray-600">
                                    <span className="font-medium text-gray-900">Total:</span> {calendarData.summary.total_days}
                                </span>
                                <span className="text-emerald-600">
                                    <span className="font-medium">Present:</span> {calendarData.summary.present}
                                </span>
                                <span className="text-rose-600">
                                    <span className="font-medium">Absent:</span> {calendarData.summary.absent}
                                </span>
                                <span className="text-amber-600">
                                    <span className="font-medium">Half Day:</span> {calendarData.summary.half_day}
                                </span>
                                <span className="text-blue-600">
                                    <span className="font-medium">Leave:</span> {calendarData.summary.paid_leave}
                                </span>
                                <span className="text-purple-600">
                                    <span className="font-medium">Bonus:</span> {calendarData.summary.bonus}
                                </span>
                                <span className="text-orange-600">
                                    <span className="font-medium">Fine:</span> {calendarData.summary.fine}
                                </span>
                                <span className="text-yellow-600">
                                    <span className="font-medium">Week Off:</span> {calendarData.summary.weekly_off}
                                </span>
                                <span className="text-indigo-600 font-medium ml-auto">
                                    {calendarData.summary.attendance_percentage}% Attendance
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Staff Info Section */}
                {staffInfo && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-sm font-semibold text-gray-900">Staff Information</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                {staffInfo.image ? (
                                    <img 
                                        src={staffInfo.image} 
                                        alt={staffInfo.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
                                        <UserIcon className="w-8 h-8 text-indigo-600" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900">{staffInfo.name}</h4>
                                    <p className="text-sm text-gray-600 mb-3">{staffInfo.designation}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <span className="text-xs text-gray-500">Email</span>
                                            <p className="text-sm font-medium text-gray-900">{staffInfo.email}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">Mobile</span>
                                            <p className="text-sm font-medium text-gray-900">{staffInfo.mobile}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">Guardian</span>
                                            <p className="text-sm font-medium text-gray-900">
                                                {staffInfo.guardian_name} ({staffInfo.care_of})
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">Date of Birth</span>
                                            <p className="text-sm font-medium text-gray-900">{formatDate(staffInfo.date_of_birth)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Day Details Modal */}
                {selectedDayDetails && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl shadow-xl max-w-md w-full"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {formatDate(selectedDayDetails.date)}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedDayDetails(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className={`w-10 h-10 rounded-full ${getStatusColor(selectedDayDetails.status)} flex items-center justify-center`}>
                                            <span className="text-lg">{selectedDayDetails.icon}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{selectedDayDetails.status_display}</p>
                                            <p className="text-sm text-gray-500">
                                                {selectedDayDetails.day_of_week}, {selectedDayDetails.date}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedDayDetails.details && (
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedDayDetails.details.punch_in && (
                                                <div className="p-3 border border-gray-200 rounded-lg">
                                                    <span className="text-xs text-gray-500">Punch In</span>
                                                    <p className="font-medium text-gray-900">
                                                        {formatTime(selectedDayDetails.details.punch_in)}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedDayDetails.details.punch_out && (
                                                <div className="p-3 border border-gray-200 rounded-lg">
                                                    <span className="text-xs text-gray-500">Punch Out</span>
                                                    <p className="font-medium text-gray-900">
                                                        {formatTime(selectedDayDetails.details.punch_out)}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedDayDetails.details.total_hours && (
                                                <div className="p-3 border border-gray-200 rounded-lg">
                                                    <span className="text-xs text-gray-500">Total Hours</span>
                                                    <p className="font-medium text-gray-900">
                                                        {selectedDayDetails.details.total_hours}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedDayDetails.details.calculated_amount && (
                                                <div className="p-3 border border-gray-200 rounded-lg">
                                                    <span className="text-xs text-gray-500">Amount</span>
                                                    <p className="font-medium text-gray-900">
                                                        ₹{selectedDayDetails.details.calculated_amount}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {selectedDayDetails.details?.is_verified && (
                                        <div className="flex items-center gap-2 text-sm text-emerald-600">
                                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                                            Verified Attendance
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AttendanceTab;