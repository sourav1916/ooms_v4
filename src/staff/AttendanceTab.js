import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import API_BASE_URL from "../utils/api-controller";
import getHeaders from "../utils/get-headers";

const AttendanceTab = ({ attendance, setAttendance, variants }) => {
    const location = useLocation();
    const [selectedMonth, setSelectedMonth] = useState(attendance.month || 'March 2024');
    const [selectedYear, setSelectedYear] = useState(2024);
    const [loading, setLoading] = useState(false);
    const [calendarLoading, setCalendarLoading] = useState(false);
    const [punchLoading, setPunchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loginTimes, setLoginTimes] = useState([]);
    const [calendarData, setCalendarData] = useState([]);
    const [currentPunchStatus, setCurrentPunchStatus] = useState(null);
    const [dateFilter, setDateFilter] = useState({
        fromDate: getDefaultFromDate(),
        toDate: new Date().toISOString().split('T')[0]
    });

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

    // Fetch calendar data when month/year changes
    useEffect(() => {
        fetchCalendarData();
    }, [selectedMonth, selectedYear, location.search]);

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

    const fetchCalendarData = async () => {
        const username = getUsernameFromUrl();
        if (!username) return;

        try {
            setCalendarLoading(true);
            
            // Get month and year numbers
            const monthIndex = months.indexOf(selectedMonth.split(' ')[0]) + 1;
            const year = selectedYear;
            
            const response = await fetch(
                `${API_BASE_URL}/attendance/calendar?username=${username}&month=${monthIndex}&year=${year}`,
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
                setCalendarData(data.data || []);
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

        // Get current location
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
                        fetchLoginTimes(); // Refresh login times
                        fetchCalendarData(); // Refresh calendar data
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

        // Get current location
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
                        fetchLoginTimes(); // Refresh login times
                        fetchCalendarData(); // Refresh calendar data
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
        const [currentMonth, currentYear] = selectedMonth.split(' ');
        const monthIndex = months.indexOf(currentMonth);
        
        if (monthIndex === 0) {
            // Go to previous year, December
            setSelectedYear(prev => prev - 1);
            setSelectedMonth(`December ${selectedYear - 1}`);
        } else {
            // Go to previous month
            setSelectedMonth(`${months[monthIndex - 1]} ${selectedYear}`);
        }
    };

    const handleNextMonth = () => {
        const [currentMonth, currentYear] = selectedMonth.split(' ');
        const monthIndex = months.indexOf(currentMonth);
        
        if (monthIndex === 11) {
            // Go to next year, January
            setSelectedYear(prev => prev + 1);
            setSelectedMonth(`January ${selectedYear + 1}`);
        } else {
            // Go to next month
            setSelectedMonth(`${months[monthIndex + 1]} ${selectedYear}`);
        }
    };

    const handleMonthSelect = (month) => {
        setSelectedMonth(`${month} ${selectedYear}`);
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        const [currentMonth] = selectedMonth.split(' ');
        setSelectedMonth(`${currentMonth} ${year}`);
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

    // Get calendar day color based on status
    const getCalendarDayColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'present':
            case 'fine':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200';
            case 'absent':
                return 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200';
            case 'half_day':
                return 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200';
            case 'overtime':
                return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';
            case 'paid_leave':
                return 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200';
            default:
                return 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100';
        }
    };

    // Format time values properly
    const formatTimeValue = (value, type) => {
        if (type === 'time') {
            if (typeof value === 'string' && value.includes('H')) return value;
            const hours = Math.floor(value) || 0;
            const minutes = Math.round((value - hours) * 60) || 0;
            return `${hours.toString().padStart(2, '0')} H : ${minutes.toString().padStart(2, '0')} M`;
        }
        return value;
    };

    // Simple SVG Icons
    const CalendarIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );

    const ChevronLeftIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    );

    const ChevronRightIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    );

    const UserIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );

    const ClockIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const BriefcaseIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );

    const BanknotesIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const ChevronDownIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );

    const LocationIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
    const summaryCards = [
        { title: "Total Days", value: attendance.summary.totalDays, icon: <CalendarIcon />, color: "blue", trend: "+2.5%" },
        { title: "Present", value: attendance.summary.present, icon: <UserIcon />, color: "emerald", trend: "+5.2%" },
        { title: "Absent", value: attendance.summary.absent, icon: <UserIcon />, color: "rose", trend: "-1.3%" },
        { title: "Not Marked", value: attendance.summary.notMarked, icon: <ClockIcon />, color: "amber" },
        { title: "Half Day", value: attendance.summary.halfDay, icon: <BriefcaseIcon />, color: "orange" },
        { title: "Over Time", value: attendance.summary.overTime, icon: <ClockIcon />, color: "blue", trend: "+8h", type: "time" },
        { title: "Fine Hours", value: attendance.summary.fineHours, icon: <BanknotesIcon />, color: "red", type: "time" },
        { title: "Paid Leave", value: attendance.summary.paidLeave, icon: <UserIcon />, color: "purple" },
    ];

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
        >
            {/* Header with Month Selection and Punch Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Attendance Overview</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {username ? `Managing attendance for user: ${username}` : 'Track and manage employee attendance records'}
                    </p>
                </div>
                
                {/* Punch In/Out Buttons */}
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePunchIn}
                        disabled={punchLoading || !username}
                        className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LoginIcon />
                        {punchLoading ? 'Processing...' : 'Punch In'}
                    </motion.button>
                    
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePunchOut}
                        disabled={punchLoading || !username}
                        className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LogoutIcon />
                        {punchLoading ? 'Processing...' : 'Punch Out'}
                    </motion.button>
                </div>
            </div>

            {/* Month & Year Selection */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Month Dropdown */}
                <div className="relative">
                    <select 
                        value={selectedMonth.split(' ')[0]}
                        onChange={(e) => handleMonthSelect(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                    >
                        {months.map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDownIcon />
                    </div>
                </div>

                {/* Year Dropdown */}
                <div className="relative">
                    <select 
                        value={selectedYear}
                        onChange={(e) => handleYearSelect(parseInt(e.target.value))}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDownIcon />
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button 
                        onClick={handlePreviousMonth}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                        title="Previous Month"
                    >
                        <ChevronLeftIcon />
                    </button>
                    <span className="px-3 py-1 text-sm font-semibold text-indigo-600 min-w-[140px] text-center">
                        {selectedMonth}
                    </span>
                    <button 
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                        title="Next Month"
                    >
                        <ChevronRightIcon />
                    </button>
                </div>

                {/* Export Button */}
                <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <CalendarIcon />
                    Export
                </button>
            </div>

            {/* Month Summary Badge */}
            <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full">
                    {selectedMonth} Summary
                </span>
                <span className="text-sm text-gray-500">
                    Showing attendance data for {selectedMonth}
                </span>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
                {summaryCards.map((card, index) => (
                    <SummaryCard 
                        key={card.title}
                        title={card.title}
                        value={card.type === 'time' ? formatTimeValue(card.value, 'time') : card.value}
                        icon={card.icon}
                        color={card.color}
                        trend={card.trend}
                        isTime={card.type === 'time'}
                    />
                ))}
            </div>

            {/* Calendar Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Calendar Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CalendarIcon />
                            <h3 className="text-base font-semibold text-gray-900">
                                {selectedMonth} Attendance Calendar
                            </h3>
                        </div>
                        {calendarLoading && (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                                <span className="text-sm text-gray-500">Loading...</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Present
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-amber-500 rounded-full"></span> Half Day
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-rose-500 rounded-full"></span> Absent
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Fine
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Week Days */}
                    <div className="grid grid-cols-7 gap-2 mb-3">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {Array(35).fill(null).map((_, index) => {
                            const day = index + 1;
                            const dayData = calendarData?.find(d => {
                                const date = new Date(d.date);
                                return date.getDate() === day;
                            });
                            const isCurrentMonth = day <= 31;
                            
                            if (!isCurrentMonth) {
                                return <div key={`empty-${index}`} className="aspect-square" />;
                            }

                            return (
                                <motion.div
                                    key={day}
                                    whileHover={{ scale: 1.02 }}
                                    className={`aspect-square rounded-lg border p-2 cursor-pointer transition-all ${getCalendarDayColor(dayData?.status)}`}
                                >
                                    <div className="h-full flex flex-col">
                                        <span className={`text-sm font-medium ${dayData?.status ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {day}
                                        </span>
                                        {dayData?.status && (
                                            <div className="mt-auto">
                                                <span className="text-[10px] font-medium">
                                                    {getStatusDisplay(dayData.status)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Login Times Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ClockIcon />
                            <h3 className="text-base font-semibold text-gray-900">Login/Logout Times</h3>
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
                </div>

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
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            {username ? (
                                                <>
                                                    No login records found for the selected date range. 
                                                    Use the Punch In button to start your session.
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
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
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
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuickActionCard
                    title="Mark Attendance"
                    description={`Quickly mark attendance for ${selectedMonth}`}
                    icon={<UserIcon />}
                    color="indigo"
                />
                <QuickActionCard
                    title="View Reports"
                    description={`Generate detailed reports for ${selectedMonth}`}
                    icon={<CalendarIcon />}
                    color="emerald"
                />
                <QuickActionCard
                    title="Manage Leave"
                    description="Approve or reject leave requests"
                    icon={<ClockIcon />}
                    color="amber"
                />
            </div>
        </motion.div>
    );
};

const SummaryCard = ({ title, value, icon, color = 'blue', trend, isTime = false }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        rose: 'bg-rose-50 text-rose-600',
        amber: 'bg-amber-50 text-amber-600',
        orange: 'bg-orange-50 text-orange-600',
        red: 'bg-red-50 text-red-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all"
        >
            <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                        trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                        {trend}
                    </span>
                )}
            </div>
            
            <div className="mt-1">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    {title}
                </h4>
                <p className={`font-bold text-gray-900 ${isTime ? 'text-sm' : 'text-xl'}`}>
                    {value}
                </p>
            </div>
        </motion.div>
    );
};

const QuickActionCard = ({ title, description, icon, color = 'indigo' }) => {
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
        emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
        amber: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-5 rounded-xl border border-gray-200 text-left transition-all ${colorClasses[color]}`}
        >
            <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                    {icon}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">{title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
            </div>
        </motion.button>
    );
};

export default AttendanceTab;