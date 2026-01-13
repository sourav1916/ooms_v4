import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiSettings, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Header, Sidebar } from '../../components/header';

const AutoReminder = () => {
    // Header/Sidebar states
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });

    // Tab and content states
    const [activeTab, setActiveTab] = useState('whitelist');
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    // Whitelist states
    const [whitelist, setWhitelist] = useState([]);
    const [whitelistPage, setWhitelistPage] = useState(1);
    const [hasMoreWhitelist, setHasMoreWhitelist] = useState(true);
    const [isLoadingMoreWhitelist, setIsLoadingMoreWhitelist] = useState(false);
    const [showCreateWhitelistModal, setShowCreateWhitelistModal] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [searchWhitelist, setSearchWhitelist] = useState({
        schedule_id: '',
        query: ''
    });

    // Schedule states
    const [scheduleList, setScheduleList] = useState([]);
    const [showCreateScheduleModal, setShowCreateScheduleModal] = useState(false);
    const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    // Form states
    const [whitelistForm, setWhitelistForm] = useState({
        usernames: [],
        schedule_id: '',
        show_schedule: ''
    });

    const [scheduleForm, setScheduleForm] = useState({
        name: '',
        type: '',
        day: '',
        date: '',
        hour: ''
    });

    const [editScheduleForm, setEditScheduleForm] = useState({
        schedule_id: '',
        name: '',
        type: '',
        day: '',
        date: '',
        hour: '',
        status: '1'
    });

    // Mock data
    const mockWhitelistData = [
        {
            id: '1',
            username: 'client001',
            name: 'Rajesh Kumar',
            guardian_name: 'Suresh Kumar',
            mobile: '+91 9876543210',
            email: 'rajesh@example.com',
            balance: 25000.50,
            schedule_name: 'Daily Morning',
            type: 'daily',
            value_1: '09',
            value_2: ''
        },
        {
            id: '2',
            username: 'client002',
            name: 'Priya Sharma',
            guardian_name: 'Ramesh Sharma',
            mobile: '+91 9876543211',
            email: 'priya@example.com',
            balance: -1500.00,
            schedule_name: 'Weekly Monday',
            type: 'weekly',
            value_1: 'Monday',
            value_2: '10'
        },
        {
            id: '3',
            username: 'client003',
            name: 'Amit Patel',
            guardian_name: 'Dinesh Patel',
            mobile: '+91 9876543212',
            email: 'amit@example.com',
            balance: 50000.75,
            schedule_name: 'Monthly 15th',
            type: 'monthly',
            value_1: '15',
            value_2: '14'
        }
    ];

    const mockScheduleData = [
        {
            schedule_id: '1',
            name: 'Daily Morning',
            type: 'daily',
            value_1: '09',
            value_2: '',
            count: 15,
            status: '1'
        },
        {
            schedule_id: '2',
            name: 'Weekly Monday',
            type: 'weekly',
            value_1: 'Monday',
            value_2: '10',
            count: 8,
            status: '1'
        },
        {
            schedule_id: '3',
            name: 'Monthly 15th',
            type: 'monthly',
            value_1: '15',
            value_2: '14',
            count: 5,
            status: '0'
        }
    ];

    const mockSchedules = [
        { schedule_id: '1', name: 'Daily Morning', type: 'daily', value_1: '09', value_2: '' },
        { schedule_id: '2', name: 'Weekly Monday', type: 'weekly', value_1: 'Monday', value_2: '10' },
        { schedule_id: '3', name: 'Monthly 15th', type: 'monthly', value_1: '15', value_2: '14' }
    ];

    const mockClients = [
        { username: 'client001', firm_name: 'Rajesh Traders', name: 'Rajesh Kumar', mobile: '+91 9876543210', pan: 'ABCDE1234F' },
        { username: 'client002', firm_name: 'Priya Enterprises', name: 'Priya Sharma', mobile: '+91 9876543211', pan: 'BCDEF2345G' },
        { username: 'client003', firm_name: 'Amit & Co.', name: 'Amit Patel', mobile: '+91 9876543212', pan: 'CDEFG3456H' }
    ];

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

    // Last element observer for infinite scroll (Whitelist)
    const lastWhitelistElementRef = useCallback(node => {
        if (isLoadingMoreWhitelist) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMoreWhitelist) {
                loadMoreWhitelistData();
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoadingMoreWhitelist, hasMoreWhitelist]);

    // Initial data load
    useEffect(() => {
        fetchWhitelistData(true);
        fetchScheduleData();
        setSchedules(mockSchedules);
    }, []);

    // Whitelist functions
    const fetchWhitelistData = async (reset = false) => {
        if (reset) {
            setLoading(true);
            setWhitelistPage(1);
            setWhitelist([]);
        } else {
            setIsLoadingMoreWhitelist(true);
        }

        setTimeout(() => {
            let whitelistData;
            const startIndex = (reset ? 0 : (whitelistPage - 1) * 2);
            whitelistData = mockWhitelistData.slice(startIndex, startIndex + 2);

            if (reset) {
                setWhitelist(whitelistData);
                setHasMoreWhitelist(whitelistData.length > 0);
            } else {
                setWhitelist(prev => [...prev, ...whitelistData]);
                setHasMoreWhitelist(whitelistData.length > 0);
            }

            if (reset) {
                setLoading(false);
            } else {
                setIsLoadingMoreWhitelist(false);
            }
        }, 1000);
    };

    const loadMoreWhitelistData = () => {
        if (!hasMoreWhitelist || isLoadingMoreWhitelist) return;
        setWhitelistPage(prev => prev + 1);
        fetchWhitelistData(false);
    };

    const handleWhitelistSearch = (e) => {
        e.preventDefault();
        fetchWhitelistData(true);
    };

    const handleWhitelistSubmit = (e) => {
        e.preventDefault();
        console.log('Whitelist form data:', whitelistForm);
        setShowCreateWhitelistModal(false);
        resetWhitelistForm();
        fetchWhitelistData(true);
    };

    const handleDeleteWhitelist = (id) => {
        console.log('Deleting whitelist entry:', id);
        setWhitelist(prev => prev.filter(item => item.id !== id));
    };

    // Schedule functions
    const fetchScheduleData = () => {
        setLoading(true);
        setTimeout(() => {
            setScheduleList(mockScheduleData);
            setLoading(false);
        }, 1000);
    };

    const handleScheduleSubmit = (e) => {
        e.preventDefault();
        console.log('Schedule form data:', scheduleForm);
        setShowCreateScheduleModal(false);
        resetScheduleForm();
        fetchScheduleData();
    };

    const handleEditScheduleSubmit = (e) => {
        e.preventDefault();
        console.log('Edit schedule form data:', editScheduleForm);
        setShowEditScheduleModal(false);
        fetchScheduleData();
    };

    const handleEditScheduleClick = (schedule) => {
        setSelectedSchedule(schedule);
        setEditScheduleForm({
            schedule_id: schedule.schedule_id,
            name: schedule.name,
            type: schedule.type,
            day: schedule.type === 'weekly' ? schedule.value_1 : '',
            date: schedule.type === 'monthly' ? schedule.value_1 : '',
            hour: schedule.type === 'daily' ? schedule.value_1 : schedule.value_2,
            status: schedule.status
        });
        setShowEditScheduleModal(true);
    };

    const handleDeleteSchedule = (scheduleId) => {
        console.log('Deleting schedule:', scheduleId);
        setScheduleList(prev => prev.filter(item => item.schedule_id !== scheduleId));
    };

    // Helper functions
    const handleShowScheduleValues = (type, value_1, value_2) => {
        if (type === 'daily') {
            return `Daily at ${formatHour(value_1)}`;
        } else if (type === 'weekly') {
            return `Every ${value_1} at ${formatHour(value_2)}`;
        } else if (type === 'monthly') {
            return `Every ${value_1 === 'last day' ? 'last day' : `${value_1} day`} of month at ${formatHour(value_2)}`;
        } else {
            return `Invalid Type`;
        }
    };

    const formatHour = (hour) => {
        const hourNum = parseInt(hour);
        if (hourNum === 0) return '12 AM';
        if (hourNum === 12) return '12 PM';
        if (hourNum < 12) return `${hourNum} AM`;
        return `${hourNum - 12} PM`;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Form handlers
    const handleWhitelistChange = (field, value) => {
        const newForm = { ...whitelistForm, [field]: value };
        
        if (field === 'schedule_id') {
            const selectedSchedule = schedules.find(s => s.schedule_id === value);
            if (selectedSchedule) {
                newForm.show_schedule = handleShowScheduleValues(
                    selectedSchedule.type,
                    selectedSchedule.value_1,
                    selectedSchedule.value_2
                );
            } else {
                newForm.show_schedule = '';
            }
        }
        
        setWhitelistForm(newForm);
    };

    const handleScheduleChange = (field, value) => {
        setScheduleForm(prev => ({ ...prev, [field]: value }));
    };

    const handleEditScheduleChange = (field, value) => {
        setEditScheduleForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSearchWhitelistChange = (field, value) => {
        setSearchWhitelist(prev => ({ ...prev, [field]: value }));
    };

    // Reset forms
    const resetWhitelistForm = () => {
        setWhitelistForm({
            usernames: [],
            schedule_id: '',
            show_schedule: ''
        });
        setSelectedClients([]);
    };

    const resetScheduleForm = () => {
        setScheduleForm({
            name: '',
            type: '',
            day: '',
            date: '',
            hour: ''
        });
    };

    // Skeleton Loading Component
    const SkeletonLoader = () => (
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

            <div className={`pt-16 transition-all duration-300 ease-in-out ${isMinimized ? 'md:pl-20' : 'md:pl-72'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                    {/* Tabs Skeleton */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <div className="flex space-x-8">
                                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="h-6 bg-gray-200 rounded w-48"></div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="h-64 bg-gray-100 rounded"></div>
                                <div className="flex justify-center py-4">
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Render functions
    const renderWhitelistTab = () => (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                    <h5 className="text-lg font-semibold text-gray-800 mb-0">Reminder Whitelist</h5>
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleWhitelistSearch} className="flex gap-2">
                            <select
                                value={searchWhitelist.schedule_id}
                                onChange={(e) => handleSearchWhitelistChange('schedule_id', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none text-sm"
                            >
                                <option value="">All Schedule</option>
                                {schedules.map(schedule => (
                                    <option key={schedule.schedule_id} value={schedule.schedule_id}>
                                        {schedule.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={searchWhitelist.query}
                                onChange={(e) => handleSearchWhitelistChange('query', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none text-sm w-48"
                                placeholder="Search Anything"
                            />
                            <motion.button
                                type="submit"
                                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiSearch className="w-4 h-4" />
                            </motion.button>
                        </form>
                        <motion.button
                            onClick={() => setShowCreateWhitelistModal(true)}
                            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiPlus className="w-4 h-4" />
                            Add
                        </motion.button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left p-3 font-medium text-gray-700 border border-gray-200">#</th>
                                <th className="text-left p-3 font-medium text-gray-700 border border-gray-200">Name</th>
                                <th className="text-left p-3 font-medium text-gray-700 border border-gray-200">Contact</th>
                                <th className="text-right p-3 font-medium text-gray-700 border border-gray-200">Balance</th>
                                <th className="text-left p-3 font-medium text-gray-700 border border-gray-200">Schedule</th>
                                <th className="text-center p-3 font-medium text-gray-700 border border-gray-200">
                                    <FiSettings className="w-4 h-4 inline" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 border border-gray-200">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : whitelist.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500 border border-gray-200">
                                        No whitelist records found
                                    </td>
                                </tr>
                            ) : (
                                whitelist.map((item, index) => {
                                    const isLastElement = index === whitelist.length - 1;

                                    return (
                                        <tr
                                            key={item.id}
                                            ref={isLastElement ? lastWhitelistElementRef : null}
                                            className="border-b border-gray-200 hover:bg-gray-50"
                                        >
                                            <td className="p-3 text-gray-600 border border-gray-200">
                                                {index + 1}
                                            </td>
                                            <td className="p-3 border border-gray-200">
                                                <a
                                                    href={`/view-client-profile?username=${item.username}`}
                                                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                                                >
                                                    {item.name}
                                                    <br />
                                                    <span className="text-gray-600 font-normal">C/O: {item.guardian_name}</span>
                                                </a>
                                            </td>
                                            <td className="p-3 text-gray-600 border border-gray-200">
                                                {item.mobile}
                                                <br />
                                                {item.email}
                                            </td>
                                            <td className="p-3 text-right text-gray-600 border border-gray-200">
                                                ₹{formatCurrency(item.balance)}
                                            </td>
                                            <td className="p-3 border border-gray-200">
                                                {item.schedule_name}
                                                <br />
                                                <small className="text-indigo-600">
                                                    [{handleShowScheduleValues(item.type, item.value_1, item.value_2)}]
                                                </small>
                                            </td>
                                            <td className="p-3 text-center border border-gray-200">
                                                <motion.button
                                                    onClick={() => handleDeleteWhitelist(item.id)}
                                                    className="p-1 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </motion.button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Loading indicator for infinite scroll */}
                {isLoadingMoreWhitelist && (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                )}

                {/* No more records message */}
                {!hasMoreWhitelist && whitelist.length > 0 && (
                    <div className="text-center py-4 text-yellow-600 font-medium">
                        No More Records
                    </div>
                )}
            </div>
        </div>
    );

    const renderScheduleTab = () => (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                    <h5 className="text-lg font-semibold text-gray-800 mb-0">Reminder Schedule</h5>
                    <motion.button
                        onClick={() => setShowCreateScheduleModal(true)}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiPlus className="w-4 h-4" />
                        Create
                    </motion.button>
                </div>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left p-3 font-medium text-gray-700 border border-gray-200">#</th>
                                <th className="text-left p-3 font-medium text-gray-700 border border-gray-200">Name</th>
                                <th className="text-left p-3 font-medium text-gray-700 border border-gray-200">Type</th>
                                <th className="text-left p-3 font-medium text-gray-700 border border-gray-200">Schedule</th>
                                <th className="text-center p-3 font-medium text-gray-700 border border-gray-200">Count</th>
                                <th className="text-left p-3 font-medium text-gray-700 border border-gray-200">Status</th>
                                <th className="text-center p-3 font-medium text-gray-700 border border-gray-200">
                                    <FiSettings className="w-4 h-4 inline" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 border border-gray-200">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : scheduleList.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-gray-500 border border-gray-200">
                                        No schedule records found
                                    </td>
                                </tr>
                            ) : (
                                scheduleList.map((schedule, index) => (
                                    <tr key={schedule.schedule_id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-3 text-gray-600 border border-gray-200">
                                            {index + 1}
                                        </td>
                                        <td className="p-3 text-gray-600 border border-gray-200">
                                            {schedule.name}
                                        </td>
                                        <td className="p-3 text-gray-600 border border-gray-200">
                                            {schedule.type.toUpperCase()}
                                        </td>
                                        <td className="p-3 text-gray-600 border border-gray-200">
                                            {handleShowScheduleValues(schedule.type, schedule.value_1, schedule.value_2)}
                                        </td>
                                        <td className="p-3 text-center text-gray-600 border border-gray-200">
                                            {schedule.count}
                                        </td>
                                        <td className="p-3 border border-gray-200">
                                            {schedule.status === '1' ? (
                                                <span className="text-green-600">Active</span>
                                            ) : (
                                                <span className="text-red-600">Deactive</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-center border border-gray-200">
                                            <div className="flex justify-center gap-2">
                                                <motion.button
                                                    onClick={() => handleEditScheduleClick(schedule)}
                                                    className="p-1 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FiEdit className="w-4 h-4" />
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => handleDeleteSchedule(schedule.schedule_id)}
                                                    className="p-1 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // Show skeleton while loading
    if (loading && whitelist.length === 0 && scheduleList.length === 0) {
        return <SkeletonLoader />;
    }

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

            <div className={`pt-16 transition-all duration-300 ease-in-out ${isMinimized ? 'md:pl-20' : 'md:pl-72'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                    {/* Tabs */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('whitelist')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                        activeTab === 'whitelist'
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Whitelist
                                </button>
                                <button
                                    onClick={() => setActiveTab('schedule')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                        activeTab === 'schedule'
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Schedule
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'whitelist' ? renderWhitelistTab() : renderScheduleTab()}
                </div>
            </div>

            {/* Modals remain the same - just update styling to match */}
            {/* Create Whitelist Modal */}
            {showCreateWhitelistModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h5 className="text-lg font-semibold text-gray-800">Add to Whitelist</h5>
                                <button
                                    onClick={() => setShowCreateWhitelistModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleWhitelistSubmit}>
                                <div className="grid grid-cols-1 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Clients
                                        </label>
                                        <select
                                            multiple
                                            value={whitelistForm.usernames}
                                            onChange={(e) => handleWhitelistChange('usernames', Array.from(e.target.selectedOptions, option => option.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none h-32"
                                        >
                                            {mockClients.map(client => (
                                                <option key={client.username} value={client.username}>
                                                    Name: {client.firm_name} | Owner: {client.name} | Mobile: {client.mobile} | PAN: {client.pan}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple clients</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Schedule
                                            </label>
                                            <select
                                                value={whitelistForm.schedule_id}
                                                onChange={(e) => handleWhitelistChange('schedule_id', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                                required
                                            >
                                                <option value="">-Select Schedule-</option>
                                                {schedules.map(schedule => (
                                                    <option key={schedule.schedule_id} value={schedule.schedule_id}>
                                                        {schedule.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Schedule Details
                                            </label>
                                            <input
                                                type="text"
                                                value={whitelistForm.show_schedule}
                                                readOnly
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                                                placeholder="Select Schedule to view details"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowCreateWhitelistModal(false)}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Close
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Create
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Create Schedule Modal */}
            {showCreateScheduleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h5 className="text-lg font-semibold text-gray-800">Create Schedule</h5>
                                <button
                                    onClick={() => setShowCreateScheduleModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleScheduleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={scheduleForm.name}
                                            onChange={(e) => handleScheduleChange('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                            placeholder="Enter schedule name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type
                                        </label>
                                        <select
                                            value={scheduleForm.type}
                                            onChange={(e) => handleScheduleChange('type', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                            required
                                        >
                                            <option value="">-Select Type-</option>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Day
                                        </label>
                                        <select
                                            value={scheduleForm.day}
                                            onChange={(e) => handleScheduleChange('day', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                        >
                                            <option value="">-Select Day-</option>
                                            <option value="Sunday">Sunday</option>
                                            <option value="Monday">Monday</option>
                                            <option value="Tuesday">Tuesday</option>
                                            <option value="Wednesday">Wednesday</option>
                                            <option value="Thursday">Thursday</option>
                                            <option value="Friday">Friday</option>
                                            <option value="Saturday">Saturday</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date
                                        </label>
                                        <select
                                            value={scheduleForm.date}
                                            onChange={(e) => handleScheduleChange('date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                        >
                                            <option value="">-Select Date-</option>
                                            {Array.from({ length: 28 }, (_, i) => (
                                                <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                                    {String(i + 1).padStart(2, '0')}
                                                </option>
                                            ))}
                                            <option value="last day">Last day of Month</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hour
                                        </label>
                                        <select
                                            value={scheduleForm.hour}
                                            onChange={(e) => handleScheduleChange('hour', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                            required
                                        >
                                            <option value="">-Select Hour-</option>
                                            {Array.from({ length: 24 }, (_, i) => (
                                                <option key={i} value={String(i).padStart(2, '0')}>
                                                    {i === 0 ? '12 AM' : i === 12 ? '12 PM' : i < 12 ? `${i} AM` : `${i - 12} PM`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowCreateScheduleModal(false)}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Close
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Create
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Edit Schedule Modal */}
            {showEditScheduleModal && selectedSchedule && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h5 className="text-lg font-semibold text-gray-800">Update Schedule</h5>
                                <button
                                    onClick={() => setShowEditScheduleModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleEditScheduleSubmit}>
                                <input type="hidden" name="schedule_id" value={editScheduleForm.schedule_id} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editScheduleForm.name}
                                            onChange={(e) => handleEditScheduleChange('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                            placeholder="Enter schedule name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type
                                        </label>
                                        <select
                                            value={editScheduleForm.type}
                                            onChange={(e) => handleEditScheduleChange('type', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                            required
                                        >
                                            <option value="">-Select Type-</option>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Day
                                        </label>
                                        <select
                                            value={editScheduleForm.day}
                                            onChange={(e) => handleEditScheduleChange('day', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                        >
                                            <option value="">-Select Day-</option>
                                            <option value="Sunday">Sunday</option>
                                            <option value="Monday">Monday</option>
                                            <option value="Tuesday">Tuesday</option>
                                            <option value="Wednesday">Wednesday</option>
                                            <option value="Thursday">Thursday</option>
                                            <option value="Friday">Friday</option>
                                            <option value="Saturday">Saturday</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date
                                        </label>
                                        <select
                                            value={editScheduleForm.date}
                                            onChange={(e) => handleEditScheduleChange('date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                        >
                                            <option value="">-Select Date-</option>
                                            {Array.from({ length: 28 }, (_, i) => (
                                                <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                                    {String(i + 1).padStart(2, '0')}
                                                </option>
                                            ))}
                                            <option value="last day">Last day of Month</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hour
                                        </label>
                                        <select
                                            value={editScheduleForm.hour}
                                            onChange={(e) => handleEditScheduleChange('hour', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                            required
                                        >
                                            <option value="">-Select Hour-</option>
                                            {Array.from({ length: 24 }, (_, i) => (
                                                <option key={i} value={String(i).padStart(2, '0')}>
                                                    {i === 0 ? '12 AM' : i === 12 ? '12 PM' : i < 12 ? `${i} AM` : `${i - 12} PM`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={editScheduleForm.status}
                                            onChange={(e) => handleEditScheduleChange('status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                            required
                                        >
                                            <option value="1">Active</option>
                                            <option value="0">Deactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowEditScheduleModal(false)}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Close
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Update
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AutoReminder;