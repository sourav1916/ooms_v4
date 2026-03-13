import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar, Header } from '../components/header';
import {
    FiUser,
    FiClock,
    FiDollarSign,
    FiAward,
    FiBriefcase,
    FiBookOpen,
    FiTrendingUp,
    FiFileText,
    FiCalendar,
    FiMail,
    FiPhone,
    FiMapPin,
    FiEdit2,
    FiLock,
    FiLogOut,
    FiHome,
    FiChevronRight,
    FiRefreshCw,
    FiX,
    FiStar,
    FiMaximize2,
    FiMinimize2
} from 'react-icons/fi';

// Import tab components
import ProfileTab from '../staff/ProfileTab';
import AttendanceTab from '../staff/AttendanceTab';
import ExpenseTab from '../staff/ExpenseTab';
import BonusFineTab from '../staff/BonusFineTab';
import SalaryTab from '../staff/SalaryTab';
import LedgerTab from '../staff/LedgerTab';
import LoanTab from '../staff/LoanTab';
import PerformanceTab from '../staff/PerformanceTab';
import EntryReportTab from '../staff/EntryReportTab';

// TabLink Component
const TabLink = ({ to, icon: Icon, label, isActive, onClick }) => {
    return (
        <motion.button
            onClick={() => onClick(to)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
            }`}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
        >
            <motion.div
                animate={{ 
                    rotate: isActive ? [0, 5, 0] : 0,
                    scale: isActive ? 1.1 : 1
                }}
                transition={{ duration: 0.2 }}
                className="mb-1"
            >
                <Icon className="w-4 h-4" />
            </motion.div>
            <span className="text-xs font-medium text-center leading-tight">{label}</span>
        </motion.button>
    );
};

// CompactTabIcon Component for minimized view
const CompactTabIcon = ({ to, icon: Icon, label, isActive, onClick }) => {
    return (
        <motion.button
            onClick={() => onClick(to)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[70px] ${
                isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
        >
            <Icon className="w-4 h-4 mb-1 mx-auto" />
            <span className="text-[10px] font-medium text-center leading-tight w-full">{label}</span>
        </motion.button>
    );
};

const StaffProfile = () => {
    const navigate = useNavigate();
    const { tab } = useParams();
    
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [tabsMinimized, setTabsMinimized] = useState(() => {
        const saved = localStorage.getItem('staffTabsMinimized');
        return saved ? JSON.parse(saved) : true; // Default to minimized
    });
    const [activeTab, setActiveTab] = useState(tab || 'profile');
    const [showSettings, setShowSettings] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    
    // Update active tab when URL changes
    useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        }
    }, [tab]);

    // Handle default tab
    useEffect(() => {
        if (!tab) {
            navigate('/staff/view/profile/profile', { replace: true });
        }
    }, [tab, navigate]);

    // Persist tabs minimized state
    useEffect(() => {
        localStorage.setItem('staffTabsMinimized', JSON.stringify(tabsMinimized));
    }, [tabsMinimized]);

    // Check mobile view on resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Staff data
    const [staffData, setStaffData] = useState({
        firstName: "Amarnath",
        lastName: "Kalam",
        fullName: "Amarnath Kalam",
        email: "kpt@gmail.com",
        phone: "+91 9876543210",
        joinDate: "18/06/2025",
        balance: "0.00",
        designation: "MANAGER",
        dateOfBirth: "18/06/2025",
        gender: "Male",
        address: {
            state: "Andhra Pradesh",
            district: "Anantapur",
            city: "ead",
            line1: "123 Main Street",
            line2: "Near City Center"
        }
    });

    // Sample data for tabs
    const [attendance, setAttendance] = useState({
        month: "Mar-2026",
        summary: {
            totalDays: 1,
            notMarked: 1,
            present: 0,
            absent: 0,
            halfDay: 0,
            overTime: "00 H : 00 M",
            fineHours: "00 H : 00 M",
            paidLeave: 0
        },
        calendar: generateCalendarData()
    });

    const [expenses, setExpenses] = useState([
        { id: 1, date: "2026-03-01", description: "Travel expenses", amount: "500.00", status: "Approved" },
        { id: 2, date: "2026-02-28", description: "Stationery", amount: "250.00", status: "Pending" }
    ]);

    const [bonusFine, setBonusFine] = useState([
        { id: 1, createDate: "2026-03-01", amount: "1000.00", type: "Bonus", description: "Performance bonus", status: "Paid" },
        { id: 2, createDate: "2026-02-15", amount: "500.00", type: "Fine", description: "Late arrival", status: "Deducted" }
    ]);

    const [salary, setSalary] = useState({
        list: [
            { 
                id: 1,
                amount: "0.00",
                applyOT: "No",
                applyFine: "No",
                officeTime: "10:00 AM",
                workingHour: "8 Hours : 0 Minutes",
                graceTime: "0 Minutes",
                effectiveFrom: "Jun-2025",
                paidLeave: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            }
        ]
    });

    const [ledger, setLedger] = useState({
        period: "01/03/2026 - 31/03/2026",
        entries: [],
        openingBalance: "0.00",
        totalDebit: "0.00",
        totalCredit: "0.00",
        closingBalance: "0.00"
    });

    const [loan, setLoan] = useState({
        period: "19/06/2025 - 31/12/2050",
        entries: [],
        openingBalance: "0.00",
        totalDebit: "0.00",
        totalCredit: "0.00",
        closingBalance: "0.00"
    });

    const [performance, setPerformance] = useState({
        period: "19/06/2025 - 31/12/2050",
        services: [],
        tasks: generateTaskData()
    });

    const [entryReport, setEntryReport] = useState({
        month: "Mar-2026",
        entries: [
            { id: 1, officeTime: "10:00 AM", entryTime: "09:55 AM", date: "01/03/2026", status: "On Time" },
            { id: 2, officeTime: "10:00 AM", entryTime: "10:15 AM", date: "02/03/2026", status: "Late" }
        ]
    });

    // Helper function to generate calendar data
    function generateCalendarData() {
        const days = [];
        const daysInMonth = 31;
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: i,
                day: new Date(2026, 2, i).toLocaleDateString('en-US', { weekday: 'short' }),
                status: i === 1 ? "Not Marked" : null
            });
        }
        return days;
    }

    // Helper function to generate task data
    function generateTaskData() {
        return [
            {
                id: 1,
                createDate: "10-02-2026",
                dueDate: "20-02-2026",
                targetDate: "20-02-2026",
                task: "Income Tax Return",
                fees: "2000.00",
                client: "RONIT ROY",
                assignor: "CHANDAN ROY",
                pan: "xxxxx3169A",
                mobile: "8900700707",
                status: "ASSIGNED"
            },
            {
                id: 2,
                createDate: "10-02-2026",
                dueDate: "20-02-2026",
                targetDate: "20-02-2026",
                task: "Income Tax Return",
                fees: "2000.00",
                client: "ABBAS ALI",
                assignor: "ABDUL AZIZ",
                pan: "ALUPA7087Q",
                mobile: "8638501062",
                status: "ASSIGNED"
            }
        ];
    }

    // Profile tabs with paths
    const profileTabs = [
        { id: 'profile', name: 'Profile', icon: FiUser },
        { id: 'attendance', name: 'Attendance', icon: FiClock },
        { id: 'expense', name: 'Expense', icon: FiDollarSign },
        { id: 'bonus-fine', name: 'Bonus/Fine', icon: FiAward },
        { id: 'salary', name: 'Salary', icon: FiBriefcase },
        { id: 'ledger', name: 'Ledger', icon: FiBookOpen },
        { id: 'loan', name: 'Loan', icon: FiDollarSign },
        { id: 'performance', name: 'Performance', icon: FiTrendingUp },
        { id: 'entry-report', name: 'Entry Report', icon: FiFileText }
    ];

    // Handle tab change with navigation
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        navigate(`/staff/view/profile/${tabId}`);
        setShowSettings(false);
    };

    // Toggle tabs minimized state
    const toggleTabsMinimized = () => {
        setTabsMinimized(!tabsMinimized);
    };

    // Handle edit profile
    const handleEditProfile = () => {
        console.log("Edit profile clicked");
        setShowSettings(false);
    };

    // Handle change password
    const handleChangePassword = () => {
        console.log("Change password clicked");
        setShowSettings(false);
    };

    // Handle force logout
    const handleForceLogout = () => {
        console.log("Force logout clicked");
        setShowSettings(false);
    };

    // Animation variants
    const tabContentVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
    };

    // Render content based on active tab
    const renderTabContent = () => {
        const props = {
            variants: tabContentVariants,
            staffData
        };

        switch (activeTab) {
            case 'profile':
                return <ProfileTab key="profile" staffData={staffData} setStaffData={setStaffData} {...props} />;
            case 'attendance':
                return <AttendanceTab key="attendance" attendance={attendance} setAttendance={setAttendance} {...props} />;
            case 'expense':
                return <ExpenseTab key="expense" expenses={expenses} setExpenses={setExpenses} {...props} />;
            case 'bonus-fine':
                return <BonusFineTab key="bonus-fine" bonusFine={bonusFine} setBonusFine={setBonusFine} {...props} />;
            case 'salary':
                return <SalaryTab key="salary" salary={salary} setSalary={setSalary} {...props} />;
            case 'ledger':
                return <LedgerTab key="ledger" ledger={ledger} setLedger={setLedger} {...props} />;
            case 'loan':
                return <LoanTab key="loan" loan={loan} setLoan={setLoan} {...props} />;
            case 'performance':
                return <PerformanceTab key="performance" performance={performance} setPerformance={setPerformance} {...props} />;
            case 'entry-report':
                return <EntryReportTab key="entry-report" entryReport={entryReport} setEntryReport={setEntryReport} {...props} />;
            default:
                return null;
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

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
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Breadcrumb Navigation */}
                        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                            <button 
                                onClick={() => navigate('/staff/view')}
                                className="hover:text-blue-600 flex items-center gap-1"
                            >
                                <FiHome className="w-4 h-4" />
                                Staff
                            </button>
                            <FiChevronRight className="w-4 h-4" />
                            <span className="font-medium text-gray-900">{staffData.fullName}</span>
                            <FiChevronRight className="w-4 h-4" />
                            <span className="capitalize">{activeTab.replace('-', ' ')}</span>
                        </div>

                        {/* Staff Header Card */}
                        <motion.div 
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6 relative"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="relative">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                                        <motion.div 
                                            className="relative flex-shrink-0"
                                            whileHover={{ scale: 1.03 }}
                                        >
                                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                                {staffData.firstName.charAt(0)}{staffData.lastName.charAt(0)}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                                        </motion.div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                                <h1 className="text-xl font-bold text-gray-900 truncate">{staffData.fullName}</h1>
                                                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                                                    <FiStar className="w-3 h-3" />
                                                    {staffData.designation}
                                                </span>
                                            </div>
                                            
                                            {/* Contact Info Grid */}
                                            <div className={`grid ${isMobileView ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'} gap-3`}>
                                                <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FiMail className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium text-gray-500">Email</p>
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{staffData.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FiPhone className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium text-gray-500">Phone</p>
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{staffData.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                                                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FiCalendar className="w-4 h-4 text-amber-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium text-gray-500">Joined</p>
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{staffData.joinDate}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FiMapPin className="w-4 h-4 text-emerald-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium text-gray-500">Location</p>
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{staffData.address.city}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 lg:mt-0 flex-shrink-0">
                                        <motion.button
                                            onClick={() => setShowSettings(!showSettings)}
                                            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FiUser className="w-5 h-5" />
                                        </motion.button>
                                        <motion.div 
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            Balance: ₹{staffData.balance}
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            {/* Settings Dropdown */}
                            <AnimatePresence>
                                {showSettings && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-6 top-20 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                                    >
                                        <button
                                            onClick={handleEditProfile}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <FiEdit2 className="w-4 h-4" />
                                            Edit Profile
                                        </button>
                                        <button
                                            onClick={handleChangePassword}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <FiLock className="w-4 h-4" />
                                            Change Password
                                        </button>
                                        <button
                                            onClick={handleForceLogout}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <FiLogOut className="w-4 h-4" />
                                            Force Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Enhanced Profile Tabs with Minimize Option */}
                        <motion.div 
                            className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6 overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="p-3 flex items-center justify-between">
                                {tabsMinimized ? (
                                    // Minimized view - icons with labels in one line
                                    <>
                                        <div className="flex items-center justify-center gap-1 flex-1 flex-wrap">
                                            {profileTabs.map((tabItem) => {
                                                const Icon = tabItem.icon;
                                                const isActive = activeTab === tabItem.id;
                                                return (
                                                    <CompactTabIcon
                                                        key={tabItem.id}
                                                        to={tabItem.id}
                                                        icon={Icon}
                                                        label={tabItem.name}
                                                        isActive={isActive}
                                                        onClick={handleTabChange}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <motion.button
                                            onClick={toggleTabsMinimized}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 ml-1 flex-shrink-0"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            title="Show full tabs"
                                        >
                                            <FiMaximize2 className="w-4 h-4" />
                                        </motion.button>
                                    </>
                                ) : (
                                    // Expanded view - grid layout with minimize button
                                    <>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 flex-1">
                                            {profileTabs.map((tabItem) => {
                                                const Icon = tabItem.icon;
                                                const isActive = activeTab === tabItem.id;
                                                return (
                                                    <TabLink
                                                        key={tabItem.id}
                                                        to={tabItem.id}
                                                        icon={Icon}
                                                        label={tabItem.name}
                                                        isActive={isActive}
                                                        onClick={handleTabChange}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <motion.button
                                            onClick={toggleTabsMinimized}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 ml-1 flex-shrink-0"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            title="Minimize tabs"
                                        >
                                            <FiMinimize2 className="w-4 h-4" />
                                        </motion.button>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Tab Content with AnimatePresence */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-lg border border-gray-200 shadow-sm p-5"
                            >
                                {renderTabContent()}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default StaffProfile;