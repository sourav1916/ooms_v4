import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AttendanceTab = ({ attendance, setAttendance, variants }) => {
    const [selectedMonth, setSelectedMonth] = useState(attendance.month || 'March 2024');
    const [selectedYear, setSelectedYear] = useState(2024);
    
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = [2023, 2024, 2025];

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
        // Here you would typically fetch attendance data for the selected month
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        const [currentMonth] = selectedMonth.split(' ');
        setSelectedMonth(`${currentMonth} ${year}`);
        // Here you would typically fetch attendance data for the selected month/year
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

    const getStatusColor = (status) => {
        const colors = {
            'Present': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Absent': 'bg-rose-100 text-rose-700 border-rose-200',
            'Half Day': 'bg-amber-100 text-amber-700 border-amber-200',
            'Over Time': 'bg-blue-100 text-blue-700 border-blue-200',
            'Fine Hours': 'bg-orange-100 text-orange-700 border-orange-200',
            'Paid Leave': 'bg-purple-100 text-purple-700 border-purple-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Present': return '✓';
            case 'Absent': return '✗';
            case 'Half Day': return '½';
            case 'Over Time': return '+';
            case 'Fine Hours': return '!';
            case 'Paid Leave': return 'P';
            default: return '';
        }
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
            {/* Header with Month Selection */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Attendance Overview</h2>
                    <p className="text-sm text-gray-500 mt-1">Track and manage employee attendance records</p>
                </div>
                
                {/* Month & Year Selection */}
                <div className="flex items-center gap-3">
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
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Present
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-rose-500 rounded-full"></span> Absent
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-amber-500 rounded-full"></span> Half Day
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
                            const dayData = attendance.calendar?.find(d => d.date === day);
                            const isCurrentMonth = day <= 31;
                            
                            if (!isCurrentMonth) {
                                return <div key={`empty-${index}`} className="aspect-square" />;
                            }

                            return (
                                <motion.div
                                    key={day}
                                    whileHover={{ scale: 1.02 }}
                                    className={`aspect-square rounded-lg border p-2 cursor-pointer transition-all
                                        ${dayData?.status 
                                            ? 'hover:shadow-md border-gray-200' 
                                            : 'border-gray-100 bg-gray-50 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="h-full flex flex-col">
                                        <span className={`text-sm font-medium ${dayData?.status ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {day}
                                        </span>
                                        {dayData?.status && (
                                            <div className="mt-auto">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(dayData.status)}`}>
                                                    <span className="mr-0.5">{getStatusIcon(dayData.status)}</span>
                                                    {dayData.status}
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