import React, { useState, useEffect } from 'react';
import {
    FiRefreshCw,
    FiUser,
    FiPhone,
    FiMail,
    FiAlertTriangle,
    FiClock,
    FiCalendar,
    FiCheckCircle,
    FiArchive,
    FiHelpCircle,
    FiSearch,
    FiFilter,
    FiX,
    FiEye,
    FiEdit,
    FiTrash2
} from 'react-icons/fi';
import { IoTrash } from "react-icons/io5";
import { Header, Sidebar } from '../components/header';

const StaffReport = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [loading, setLoading] = useState(false);
    const [taskData, setTaskData] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [taskModal, setTaskModal] = useState({ open: false, type: '', staff: null, tasks: [] });

    // Mock services data
    const mockServices = [
        { service_id: '1', name: 'Income Tax Filing' },
        { service_id: '2', name: 'GST Registration' },
        { service_id: '3', name: 'Company Incorporation' },
        { service_id: '4', name: 'Audit Services' },
        { service_id: '5', name: 'Compliance Management' }
    ];

    // Mock task summary data
    const mockTaskData = [
        {
            username: 'staff001',
            name: 'John Doe',
            guardian_name: 'Robert Doe',
            mobile: '+91 9876543210',
            email: 'john.doe@company.com',
            OD: 5,
            DT: 3,
            D7: 8,
            FT: 12,
            WIP: 7,
            PFC: 2,
            PFD: 4
        },
        {
            username: 'staff002',
            name: 'Jane Smith',
            guardian_name: 'William Smith',
            mobile: '+91 9876543211',
            email: 'jane.smith@company.com',
            OD: 2,
            DT: 1,
            D7: 4,
            FT: 8,
            WIP: 3,
            PFC: 1,
            PFD: 2
        },
        {
            username: 'staff003',
            name: 'Mike Johnson',
            guardian_name: 'David Johnson',
            mobile: '+91 9876543212',
            email: 'mike.johnson@company.com',
            OD: 8,
            DT: 4,
            D7: 6,
            FT: 10,
            WIP: 5,
            PFC: 3,
            PFD: 6
        },
        {
            username: 'staff004',
            name: 'Sarah Wilson',
            guardian_name: 'James Wilson',
            mobile: '+91 9876543213',
            email: 'sarah.wilson@company.com',
            OD: 1,
            DT: 0,
            D7: 2,
            FT: 5,
            WIP: 2,
            PFC: 0,
            PFD: 1
        },
        {
            username: 'staff005',
            name: 'Robert Brown',
            guardian_name: 'Thomas Brown',
            mobile: '+91 9876543214',
            email: 'robert.brown@company.com',
            OD: 3,
            DT: 2,
            D7: 5,
            FT: 7,
            WIP: 4,
            PFC: 1,
            PFD: 3
        }
    ];

    // Mock task details data
    const mockTaskDetails = {
        'staff001': {
            'OD': [
                { id: 1, task_name: 'Tax Filing - ABC Corp', due_date: '2024-01-10', client: 'ABC Corporation', priority: 'High', status: 'Overdue' },
                { id: 2, task_name: 'GST Return - XYZ Ltd', due_date: '2024-01-12', client: 'XYZ Enterprises', priority: 'High', status: 'Overdue' },
                { id: 3, task_name: 'Audit Report - Global Inc', due_date: '2024-01-15', client: 'Global Solutions', priority: 'Medium', status: 'Overdue' }
            ],
            'DT': [
                { id: 4, task_name: 'Monthly Compliance', due_date: '2024-01-20', client: 'Tech Innovators', priority: 'High', status: 'Due Today' }
            ],
            'D7': [
                { id: 5, task_name: 'Quarterly Review', due_date: '2024-01-25', client: 'Manufacturing Corp', priority: 'Medium', status: 'Due in 7 Days' },
                { id: 6, task_name: 'Financial Statements', due_date: '2024-01-26', client: 'Service Providers', priority: 'High', status: 'Due in 7 Days' }
            ]
        },
        'staff002': {
            'DT': [
                { id: 7, task_name: 'Client Meeting Preparation', due_date: '2024-01-20', client: 'Retail Masters', priority: 'High', status: 'Due Today' }
            ],
            'D7': [
                { id: 8, task_name: 'Project Documentation', due_date: '2024-01-22', client: 'Digital Solutions', priority: 'Medium', status: 'Due in 7 Days' }
            ]
        }
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

    // Initialize data
    useEffect(() => {
        fetchServices();
        fetchTaskData();
    }, []);

    // Fetch services data
    const fetchServices = async () => {
        setTimeout(() => {
            setServices(mockServices);
        }, 500);
    };

    // Fetch task summary data
    const fetchTaskData = async () => {
        setLoading(true);

        setTimeout(() => {
            let filteredData = mockTaskData;
            
            if (selectedService) {
                filteredData = mockTaskData.filter(item => 
                    item.username.includes(selectedService)
                );
            }

            if (searchQuery) {
                filteredData = filteredData.filter(item =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.mobile.includes(searchQuery)
                );
            }
            
            setTaskData(filteredData);
            setLoading(false);
        }, 1000);
    };

    // Handle service filter change
    const handleServiceChange = (e) => {
        setSelectedService(e.target.value);
    };

    // Handle search
    const handleSearch = () => {
        fetchTaskData();
    };

    // Handle key press in search input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Reload data
    const handleReload = () => {
        fetchTaskData();
    };

    // Open task modal
    const openTaskModal = (type, staff) => {
        const tasks = mockTaskDetails[staff.username]?.[type] || [];
        setTaskModal({
            open: true,
            type: type,
            staff: staff,
            tasks: tasks
        });
    };

    // Close task modal
    const closeTaskModal = () => {
        setTaskModal({ open: false, type: '', staff: null, tasks: [] });
    };

    // Effect to refetch when service filter changes
    useEffect(() => {
        fetchTaskData();
    }, [selectedService]);

    // Get badge color based on task type and count
    const getBadgeClass = (count, type) => {
        if (count === 0) return 'text-gray-400 cursor-default';
        
        const baseClasses = 'inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold cursor-pointer transition-all hover:scale-110';
        
        switch (type) {
            case 'OD': // Overdue
                return `${baseClasses} bg-red-100 text-red-800 border border-red-200 hover:bg-red-200`;
            case 'DT': // Due Today
                return `${baseClasses} bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200`;
            case 'D7': // Due in 7 days
                return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200`;
            case 'FT': // Future Tasks
                return `${baseClasses} bg-green-100 text-green-800 border border-green-200 hover:bg-green-200`;
            case 'WIP': // Work in Progress
                return `${baseClasses} bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200`;
            case 'PFC': // Pending from Client
            case 'PFD': // Pending from Department
                return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200`;
        }
    };

    // Get icon for task type
    const getTaskIcon = (type) => {
        switch (type) {
            case 'OD': return <FiAlertTriangle className="w-3 h-3" />;
            case 'DT': return <FiClock className="w-3 h-3" />;
            case 'D7': return <FiCalendar className="w-3 h-3" />;
            case 'FT': return <FiCheckCircle className="w-3 h-3" />;
            case 'WIP': return <FiArchive className="w-3 h-3" />;
            case 'PFC':
            case 'PFD': return <FiHelpCircle className="w-3 h-3" />;
            default: return <FiHelpCircle className="w-3 h-3" />;
        }
    };

    // Get task type full name
    const getTaskTypeName = (type) => {
        switch (type) {
            case 'OD': return 'Overdue Tasks';
            case 'DT': return 'Due Today Tasks';
            case 'D7': return 'Due in 7 Days Tasks';
            case 'FT': return 'Future Tasks';
            case 'WIP': return 'Work in Progress Tasks';
            case 'PFC': return 'Pending from Client Tasks';
            case 'PFD': return 'Pending from Department Tasks';
            default: return 'Tasks';
        }
    };

    // Calculate totals
    const calculateTotals = () => {
        return taskData.reduce((acc, staff) => ({
            OD: acc.OD + staff.OD,
            DT: acc.DT + staff.DT,
            D7: acc.D7 + staff.D7,
            FT: acc.FT + staff.FT,
            WIP: acc.WIP + staff.WIP,
            PFC: acc.PFC + staff.PFC,
            PFD: acc.PFD + staff.PFD,
            total: acc.total + staff.OD + staff.DT + staff.D7 + staff.FT + staff.WIP + staff.PFC + staff.PFD
        }), { OD: 0, DT: 0, D7: 0, FT: 0, WIP: 0, PFC: 0, PFD: 0, total: 0 });
    };

    const totals = calculateTotals();

    // Skeleton loader component
    const SkeletonRow = () => (
        <tr className="border-b border-gray-100 animate-pulse">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
            </td>
            {Array.from({ length: 7 }).map((_, index) => (
                <td key={index} className="p-4">
                    <div className="h-8 bg-gray-200 rounded w-8 mx-auto"></div>
                </td>
            ))}
        </tr>
    );

    // Professional Modal Wrapper Component
    const ModalWrapper = ({ isOpen, onClose, title, children, size = 'max-w-4xl' }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen p-4">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        onClick={onClose}
                    />
                    {/* Professional Modal panel */}
                    <div className={`relative w-full ${size} bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]`}>
                        {/* Professional Header */}
                        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-300 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
                            <h2 className="text-xl font-bold">{title}</h2>
                            <button
                                onClick={onClose}
                                className="text-blue-200 hover:text-white p-1 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        );
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
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Pending Task List</h1>
                        <p className="text-gray-600 mt-1">
                            Staff-wise task summary and tracking
                        </p>
                    </div>

                    <div className="h-full flex flex-col">
                        {/* Main Card - Full height with scrolling */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
                            {/* Card Header - Fixed */}
                            <div className="border-b border-gray-200 px-6 py-4">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div>
                                        <h5 className="text-xl font-bold text-gray-800 mb-1">
                                            Pending Task Summary
                                        </h5>
                                        <p className="text-gray-500 text-sm">
                                            Staff-wise task tracking and management
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
                                                    onKeyPress={handleKeyPress}
                                                    placeholder="Search staff..."
                                                    className="pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none transition-colors w-full lg:w-64"
                                                />
                                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>

                                            {/* Service Filter */}
                                            <div className="relative">
                                                <select
                                                    value={selectedService}
                                                    onChange={handleServiceChange}
                                                    className="pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none transition-colors appearance-none w-full lg:w-48"
                                                >
                                                    <option value="">All Services</option>
                                                    {services.map(service => (
                                                        <option key={service.service_id} value={service.service_id}>
                                                            {service.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>

                                            {/* Action Buttons */}
                                            <button
                                                onClick={handleReload}
                                                disabled={loading}
                                                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm disabled:opacity-50"
                                            >
                                                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                                Refresh
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table Container with Fixed Header and Footer */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Table Header - Fixed */}
                                <div className="border-b border-gray-200">
                                    <table className="w-full text-sm">
                                        <colgroup>
                                            <col className="w-[25%]" /> {/* Staff Details */}
                                            <col className="w-[20%]" /> {/* Contact Info */}
                                            <col className="w-[8%]" /> {/* OD */}
                                            <col className="w-[8%]" /> {/* DT */}
                                            <col className="w-[8%]" /> {/* D7 */}
                                            <col className="w-[8%]" /> {/* FT */}
                                            <col className="w-[8%]" /> {/* WIP */}
                                            <col className="w-[8%]" /> {/* PFC */}
                                            <col className="w-[8%]" /> {/* PFD */}
                                        </colgroup>
                                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                            <tr>
                                                <th className="text-left p-4 font-semibold text-gray-700 align-middle">STAFF DETAILS</th>
                                                <th className="text-left p-4 font-semibold text-gray-700 align-middle">CONTACT INFO</th>
                                                <th className="text-center p-4 font-semibold text-gray-700 align-middle" title="Overdue Tasks">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="text-sm">OD</span>
                                                        <span className="text-xs font-normal text-gray-500 mt-1">Overdue</span>
                                                    </div>
                                                </th>
                                                <th className="text-center p-4 font-semibold text-gray-700 align-middle" title="Due Today">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="text-sm">DT</span>
                                                        <span className="text-xs font-normal text-gray-500 mt-1">Due Today</span>
                                                    </div>
                                                </th>
                                                <th className="text-center p-4 font-semibold text-gray-700 align-middle" title="Due in 7 Days">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="text-sm">D7</span>
                                                        <span className="text-xs font-normal text-gray-500 mt-1">7 Days</span>
                                                    </div>
                                                </th>
                                                <th className="text-center p-4 font-semibold text-gray-700 align-middle" title="Future Tasks">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="text-sm">FT</span>
                                                        <span className="text-xs font-normal text-gray-500 mt-1">Future</span>
                                                    </div>
                                                </th>
                                                <th className="text-center p-4 font-semibold text-gray-700 align-middle" title="Work in Progress">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="text-sm">WIP</span>
                                                        <span className="text-xs font-normal text-gray-500 mt-1">In Progress</span>
                                                    </div>
                                                </th>
                                                <th className="text-center p-4 font-semibold text-gray-700 align-middle" title="Pending from Client">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="text-sm">PFC</span>
                                                        <span className="text-xs font-normal text-gray-500 mt-1">From Client</span>
                                                    </div>
                                                </th>
                                                <th className="text-center p-4 font-semibold text-gray-700 align-middle" title="Pending from Department">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="text-sm">PFD</span>
                                                        <span className="text-xs font-normal text-gray-500 mt-1">From Dept</span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>

                                {/* Scrollable Table Body */}
                                <div className="flex-1 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <colgroup>
                                            <col className="w-[25%]" />
                                            <col className="w-[20%]" />
                                            <col className="w-[8%]" />
                                            <col className="w-[8%]" />
                                            <col className="w-[8%]" />
                                            <col className="w-[8%]" />
                                            <col className="w-[8%]" />
                                            <col className="w-[8%]" />
                                            <col className="w-[8%]" />
                                        </colgroup>
                                        <tbody className="bg-white">
                                            {loading ? (
                                                // Skeleton Loaders
                                                Array.from({ length: 6 }).map((_, index) => (
                                                    <SkeletonRow key={index} />
                                                ))
                                            ) : taskData.length === 0 ? (
                                                <tr>
                                                    <td colSpan="9" className="text-center py-8 text-gray-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FiUser className="w-12 h-12 text-gray-300 mb-3" />
                                                            <p className="text-gray-500">No task records found</p>
                                                            <p className="text-gray-400 text-sm mt-1">
                                                                Try adjusting your search or filters
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                taskData.map((staff, index) => (
                                                    <tr 
                                                        key={staff.username}
                                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                                                    >
                                                        <td className="p-4 align-middle">
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                    <FiUser className="w-5 h-5 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-semibold text-gray-800">{staff.name}</div>
                                                                    <div className="text-gray-500 text-sm mt-1">
                                                                        C/O: {staff.guardian_name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-gray-800 font-medium">
                                                                    <FiPhone className="w-3 h-3" />
                                                                    {staff.mobile}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                                    <FiMail className="w-3 h-3" />
                                                                    {staff.email}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {/* Task Count Cells - All aligned center */}
                                                        {['OD', 'DT', 'D7', 'FT', 'WIP', 'PFC', 'PFD'].map((type) => (
                                                            <td key={type} className="p-4 align-middle text-center">
                                                                {staff[type] > 0 ? (
                                                                    <button
                                                                        onClick={() => openTaskModal(type, staff)}
                                                                        className={getBadgeClass(staff[type], type)}
                                                                        title={`${staff[type]} ${getTaskTypeName(type)} - Click to view details`}
                                                                    >
                                                                        {getTaskIcon(type)}
                                                                        {staff[type]}
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-gray-400 text-sm">-</span>
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Table Footer - Fixed */}
                                <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                    <table className="w-full text-sm">
                                        <colgroup>
                                            <col className="w-[45%]" />
                                            <col className="w-[8%]" />
                                            <col className="w-[8%]" />
                                            <col className="w-[8%]" />
                                            <col className="w-[8%]" />
                                            <col className="w-[8%]" />
                                            <col className="w-[8%]" />
                                            <col className="w-[8%]" />
                                        </colgroup>
                                        <tfoot>
                                            <tr>
                                                <td className="p-4 font-bold text-gray-800 align-middle" colSpan="2">
                                                    Total Staff: {taskData.length} | Total Tasks: {totals.total}
                                                </td>
                                                {['OD', 'DT', 'D7', 'FT', 'WIP', 'PFC', 'PFD'].map((type) => (
                                                    <td key={type} className="p-4 text-center align-middle">
                                                        <span className={`inline-flex items-center justify-center text-sm font-bold px-3 py-1.5 rounded-lg border ${
                                                            type === 'OD' ? 'bg-red-100 text-red-800 border-red-200' :
                                                            type === 'DT' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                                            type === 'D7' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                            type === 'FT' ? 'bg-green-100 text-green-800 border-green-200' :
                                                            type === 'WIP' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                        }`}>
                                                            {totals[type]}
                                                        </span>
                                                    </td>
                                                ))}
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Details Modal */}
            <ModalWrapper
                isOpen={taskModal.open}
                onClose={closeTaskModal}
                title={`${getTaskTypeName(taskModal.type)} - ${taskModal.staff?.name || ''}`}
                size="max-w-6xl"
            >
                <div className="flex-1 flex flex-col p-6">
                    {/* Staff Info Header */}
                    {taskModal.staff && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <FiUser className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{taskModal.staff.name}</h3>
                                        <p className="text-gray-600 text-sm">
                                            {taskModal.staff.mobile} • {taskModal.staff.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-600">{taskModal.tasks.length}</div>
                                    <div className="text-gray-600 text-sm">{getTaskTypeName(taskModal.type)}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tasks Card with Scrollable Table */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col flex-1">
                        {/* Card Header */}
                        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50 rounded-t-lg">
                            <h4 className="text-lg font-semibold text-gray-800">Task Details</h4>
                        </div>

                        {/* Scrollable Table Container */}
                        <div className="flex-1 overflow-hidden flex flex-col">
                            {/* Table Header - Fixed */}
                            <div className="border-b border-gray-200">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">TASK NAME</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">CLIENT</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 align-middle">DUE DATE</th>
                                            <th className="text-center p-4 font-semibold text-gray-700 align-middle">PRIORITY</th>
                                            <th className="text-center p-4 font-semibold text-gray-700 align-middle">STATUS</th>
                                            <th className="text-center p-4 font-semibold text-gray-700 align-middle">ACTIONS</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>

                            {/* Scrollable Table Body */}
                            <div className="flex-1 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <tbody className="bg-white">
                                        {taskModal.tasks.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-8 text-gray-500">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <FiHelpCircle className="w-12 h-12 text-gray-300 mb-3" />
                                                        <p className="text-gray-500">No tasks found</p>
                                                        <p className="text-gray-400 text-sm mt-1">
                                                            No {getTaskTypeName(taskModal.type).toLowerCase()} for this staff member
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            taskModal.tasks.map((task) => (
                                                <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="p-4 align-middle">
                                                        <div className="font-medium text-gray-800">{task.task_name}</div>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <div className="text-gray-600">{task.client}</div>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <div className="text-gray-600">{task.due_date}</div>
                                                    </td>
                                                    <td className="p-4 align-middle text-center">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                            task.priority === 'High' ? 'bg-red-100 text-red-800' :
                                                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                            {task.priority}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 align-middle text-center">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                            task.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                                                            task.status === 'Due Today' ? 'bg-orange-100 text-orange-800' :
                                                            'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 align-middle text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="View Details">
                                                                <FiEye className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Edit Task">
                                                                <FiEdit className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete Task">
                                                                <FiTrash2 className="w-4 h-4" />
                                                            </button>
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
                </div>

                <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6 rounded-b-xl shadow-sm">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={closeTaskModal}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => {/* Handle bulk action */}}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Export Tasks
                        </button>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    );
};

export default StaffReport;