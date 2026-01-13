import React, { useState, useEffect } from 'react';
import {
    FiPlus,
    FiEye,
    FiSettings,
    FiMoreVertical,
    FiCheck,
    FiX,
    FiSearch
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Header, Sidebar } from '../../components/header';
import DateFilter from '../../components/DateFilter';

const FirmGroups = () => {
    // Header/Sidebar states
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });

    // Main states
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('');

    // Form states
    const [createForm, setCreateForm] = useState({
        name: '',
        remark: ''
    });

    // Mock Firm Groups data with dates
    const mockGroupsData = [
        {
            group_id: 'group001',
            name: 'GST Clients',
            count: 25,
            status: 1,
            remark: 'Clients requiring GST filing services',
            created_date: '2024-01-15',
            updated_date: '2024-01-20'
        },
        {
            group_id: 'group002',
            name: 'Income Tax Clients',
            count: 18,
            status: 1,
            remark: 'Individual and corporate tax clients',
            created_date: '2024-01-10',
            updated_date: '2024-01-18'
        },
        {
            group_id: 'group003',
            name: 'Corporate Clients',
            count: 12,
            status: 1,
            remark: 'Registered companies and corporations',
            created_date: '2024-01-05',
            updated_date: '2024-01-12'
        },
        {
            group_id: 'group004',
            name: 'Individual Clients',
            count: 35,
            status: 0,
            remark: 'Individual taxpayers',
            created_date: '2024-01-20',
            updated_date: '2024-01-25'
        },
        {
            group_id: 'group005',
            name: 'Startup Clients',
            count: 8,
            status: 1,
            remark: 'Newly incorporated startups',
            created_date: '2024-01-18',
            updated_date: '2024-01-22'
        },
        {
            group_id: 'group006',
            name: 'NGO Clients',
            count: 5,
            status: 1,
            remark: 'Non-profit organizations',
            created_date: '2024-01-12',
            updated_date: '2024-01-19'
        },
        {
            group_id: 'group007',
            name: 'Manufacturing Clients',
            count: 15,
            status: 1,
            remark: 'Manufacturing sector companies',
            created_date: '2024-01-08',
            updated_date: '2024-01-15'
        },
        {
            group_id: 'group008',
            name: 'Service Sector Clients',
            count: 22,
            status: 1,
            remark: 'Service industry businesses',
            created_date: '2024-01-25',
            updated_date: '2024-01-30'
        }
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

    // Initial data load
    useEffect(() => {
        fetchGroupsData();
    }, []);

    // Filter groups when search term or date range changes
    useEffect(() => {
        filterGroups();
    }, [searchTerm, dateRange, groups]);

    // Simulate API call to fetch groups data
    const fetchGroupsData = async () => {
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            setGroups(mockGroupsData);
            setFilteredGroups(mockGroupsData);
            setLoading(false);
        }, 1000);
    };

    // Filter groups based on search term and date range
    const filterGroups = () => {
        let filtered = groups;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(group =>
                group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                group.remark.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by date range
        if (dateRange) {
            const [from, to] = dateRange.split(' - ');
            const fromDate = new Date(from.split('/').reverse().join('-'));
            const toDate = new Date(to.split('/').reverse().join('-'));
            
            filtered = filtered.filter(group => {
                const groupDate = new Date(group.created_date);
                return groupDate >= fromDate && groupDate <= toDate;
            });
        }

        setFilteredGroups(filtered);
    };

    // Handle create form submit
    const handleCreateSubmit = (e) => {
        e.preventDefault();
        console.log('Create form data:', createForm);
        
        // Add new group to the list
        const newGroup = {
            group_id: `group${String(groups.length + 1).padStart(3, '0')}`,
            name: createForm.name,
            count: 0,
            status: 1,
            remark: createForm.remark,
            created_date: new Date().toISOString().split('T')[0],
            updated_date: new Date().toISOString().split('T')[0]
        };
        
        setGroups(prev => [newGroup, ...prev]);
        
        // Close modal and reset form
        setShowCreateModal(false);
        setCreateForm({
            name: '',
            remark: ''
        });
    };

    // Handle status change
    const handleStatusChange = (group) => {
        console.log('Changing status for group:', group.group_id);
        
        // Update status in the list
        setGroups(prev => prev.map(g =>
            g.group_id === group.group_id
                ? { ...g, status: g.status === 1 ? 0 : 1, updated_date: new Date().toISOString().split('T')[0] }
                : g
        ));
    };

    // Toggle dropdown
    const toggleDropdown = (groupId) => {
        setActiveDropdown(activeDropdown === groupId ? null : groupId);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle form changes
    const handleCreateChange = (field, value) => {
        setCreateForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle date filter change
    const handleDateFilterChange = (filter) => {
        console.log('Selected filter:', filter);
        if (filter.range) {
            setDateRange(filter.range);
        }
    };

    // Handle search
    const handleSearch = () => {
        filterGroups();
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Calculate summary
    const summary = {
        totalGroups: filteredGroups.length,
        activeGroups: filteredGroups.filter(group => group.status === 1).length,
        totalFirms: filteredGroups.reduce((sum, group) => sum + group.count, 0)
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
                    {/* Header Skeleton */}
                    <div className="mb-6 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-64"></div>
                    </div>

                    {/* Controls Skeleton */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-48">
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-32">
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    {/* Table Skeleton */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse">
                        <div className="border-b border-gray-200">
                            <div className="h-12 bg-gray-100 rounded-t-lg"></div>
                        </div>
                        <div className="p-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200">
                            <div className="h-16 bg-gray-100 rounded-b-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Skeleton row for table
    const SkeletonRow = () => (
        <tr className="border-b border-gray-100 animate-pulse">
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="p-4 text-center">
                <div className="h-6 bg-gray-200 rounded w-16 mx-auto"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-gray-200 rounded w-12"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-gray-200 rounded w-8 mx-auto"></div>
            </td>
        </tr>
    );

    // Professional Modal Wrapper Component
    const ModalWrapper = ({ isOpen, onClose, title, children, size = 'max-w-md' }) => {
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
                    <div className={`relative w-full ${size} bg-white rounded-lg shadow-xl flex flex-col max-h-[90vh]`}>
                        {/* Professional Header */}
                        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
                            <h2 className="text-xl font-bold">{title}</h2>
                            <button
                                onClick={onClose}
                                className="text-indigo-200 hover:text-white p-1 rounded-lg transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    // Show skeleton while loading
    if (loading && groups.length === 0) {
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
                    {/* Main Card - Full height with scrolling */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full">
                        {/* Card Header */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <h5 className="text-xl font-bold text-gray-800 mb-1">
                                        Firm Groups
                                    </h5>
                                    <p className="text-gray-500 text-xs mt-1">
                                        Manage your client groups and firms
                                    </p>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                    {/* Search Box */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                            placeholder="Search groups..."
                                            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all w-full lg:w-64"
                                        />
                                        <FiSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    </div>

                                    {/* Date Filter Component */}
                                    <DateFilter onChange={handleDateFilterChange} />

                                    <motion.button
                                        onClick={() => setShowCreateModal(true)}
                                        className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiPlus className="w-4 h-4" />
                                        Add Group
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Table Container with Fixed Header and Footer */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {/* Table Header - Fixed */}
                            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-gray-700">#</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Group Name</th>
                                            <th className="text-center p-4 font-semibold text-gray-700">Number Of Firms</th>
                                            <th className="text-center p-4 font-semibold text-gray-700">Status</th>
                                            <th className="text-center p-4 font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>

                            {/* Scrollable Table Body */}
                            <div className="flex-1 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <tbody className="bg-white">
                                        {loading ? (
                                            // Skeleton Loaders
                                            Array.from({ length: 8 }).map((_, index) => (
                                                <SkeletonRow key={index} />
                                            ))
                                        ) : filteredGroups.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-8 text-gray-500">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <FiSettings className="w-12 h-12 text-gray-300 mb-3" />
                                                        <p className="text-gray-500">
                                                            {groups.length === 0 ? 'No firm groups found' : 'No groups match your search criteria'}
                                                        </p>
                                                        <motion.button
                                                            onClick={() => setShowCreateModal(true)}
                                                            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Create Your First Group
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredGroups.map((group, index) => {
                                                const isDropdownOpen = activeDropdown === group.group_id;

                                                return (
                                                    <tr
                                                        key={group.group_id}
                                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                                                    >
                                                        <td className="p-4 text-gray-600 font-medium">
                                                            {index + 1}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-gray-800 font-medium">
                                                                {group.name}
                                                            </div>
                                                            {group.remark && (
                                                                <div className="text-gray-500 text-sm mt-1">
                                                                    {group.remark}
                                                                </div>
                                                            )}
                                                            <div className="text-gray-500 text-xs mt-1">
                                                                Created: {formatDate(group.created_date)}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <a
                                                                href={`/view-group-firms?group_id=${group.group_id}`}
                                                                className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-lg hover:bg-indigo-200 transition-colors min-w-[60px]"
                                                            >
                                                                {group.count}
                                                            </a>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <label className="relative inline-flex items-center cursor-pointer justify-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={group.status === 1}
                                                                    onChange={() => handleStatusChange(group)}
                                                                    className="sr-only peer"
                                                                />
                                                                <div className={`w-12 h-6 rounded-full peer ${group.status === 1 ? 'bg-indigo-600' : 'bg-gray-300'} peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:border after:border-gray-300`}>
                                                                    {group.status === 1 ? (
                                                                        <FiCheck className="absolute left-1 top-0.5 w-3 h-3 text-white z-10" />
                                                                    ) : (
                                                                        <FiX className="absolute right-1 top-0.5 w-3 h-3 text-gray-500 z-10" />
                                                                    )}
                                                                </div>
                                                            </label>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="dropdown-container relative flex justify-center">
                                                                <motion.button
                                                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group-hover:bg-gray-200"
                                                                    onClick={() => toggleDropdown(group.group_id)}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                >
                                                                    <FiMoreVertical className="w-4 h-4" />
                                                                </motion.button>
                                                                {isDropdownOpen && (
                                                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                                                                        <div className="py-1">
                                                                            <a
                                                                                href={`/view-group-firms?group_id=${group.group_id}`}
                                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                                onClick={() => setActiveDropdown(null)}
                                                                            >
                                                                                <FiEye className="w-4 h-4 mr-3" />
                                                                                View
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer - Fixed */}
                            <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                <table className="w-full text-sm">
                                    <tfoot>
                                        <tr>
                                            <td className="text-left p-4 font-bold text-gray-800" colSpan="2">
                                                Summary
                                            </td>
                                            <td className="text-center p-4">
                                                <span className="inline-flex items-center justify-center bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1.5 rounded-lg min-w-[60px]">
                                                    {summary.totalFirms}
                                                </span>
                                            </td>
                                            <td className="text-center p-4">
                                                <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                    {summary.activeGroups}/{summary.totalGroups}
                                                </span>
                                            </td>
                                            <td className="p-4"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Group Modal */}
            <ModalWrapper
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setCreateForm({
                        name: '',
                        remark: ''
                    });
                }}
                title="Add Group"
                size="max-w-md"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleCreateSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Group Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={createForm.name}
                                    onChange={(e) => handleCreateChange('name', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="Enter Group Name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Remark
                                </label>
                                <input
                                    type="text"
                                    value={createForm.remark}
                                    onChange={(e) => handleCreateChange('remark', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="Enter Group Remark"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6 rounded-b-lg shadow-sm">
                    <div className="flex justify-end gap-3">
                        <motion.button
                            type="button"
                            onClick={() => {
                                setShowCreateModal(false);
                                setCreateForm({
                                    name: '',
                                    remark: ''
                                });
                            }}
                            className="px-4 py-2.5 text-gray-600 hover:text-gray-800 rounded-lg text-sm font-medium transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            onClick={handleCreateSubmit}
                            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Add Group
                        </motion.button>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    );
};

export default FirmGroups;