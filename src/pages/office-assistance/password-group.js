import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash, FiSettings, FiCheck, FiX, FiMoreVertical, FiSearch, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Header, Sidebar } from '../../components/header';
import DateFilter from '../../components/DateFilter';

const PasswordGroups = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('');

    // Form states
    const [createForm, setCreateForm] = useState({
        group_name: ''
    });

    const [editForm, setEditForm] = useState({
        password_group_id: '',
        group_name: ''
    });

    // Mock Password Groups data with dates
    const mockGroupsData = [
        {
            password_group_id: 'group001',
            group_name: 'GST Portal Groups',
            count: 5,
            status: 1,
            created_date: '2024-01-15',
            updated_date: '2024-01-20'
        },
        {
            password_group_id: 'group002',
            group_name: 'Income Tax Portal',
            count: 3,
            status: 1,
            created_date: '2024-01-10',
            updated_date: '2024-01-18'
        },
        {
            password_group_id: 'group003',
            group_name: 'Banking Portals',
            count: 8,
            status: 0,
            created_date: '2024-01-05',
            updated_date: '2024-01-12'
        },
        {
            password_group_id: 'group004',
            group_name: 'E-commerce Accounts',
            count: 0,
            status: 1,
            created_date: '2024-01-20',
            updated_date: '2024-01-25'
        },
        {
            password_group_id: 'group005',
            group_name: 'Social Media Accounts',
            count: 2,
            status: 1,
            created_date: '2024-01-18',
            updated_date: '2024-01-22'
        },
        {
            password_group_id: 'group006',
            group_name: 'Government Portals',
            count: 4,
            status: 1,
            created_date: '2024-01-12',
            updated_date: '2024-01-19'
        },
        {
            password_group_id: 'group007',
            group_name: 'Cloud Services',
            count: 6,
            status: 0,
            created_date: '2024-01-08',
            updated_date: '2024-01-15'
        },
        {
            password_group_id: 'group008',
            group_name: 'Payment Gateways',
            count: 3,
            status: 1,
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
                group.group_name.toLowerCase().includes(searchTerm.toLowerCase())
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
        // Simulate API call
        console.log('Create form data:', createForm);
        
        // Add new group to the list
        const newGroup = {
            password_group_id: `group${String(groups.length + 1).padStart(3, '0')}`,
            group_name: createForm.group_name,
            count: 0,
            status: 1,
            created_date: new Date().toISOString().split('T')[0],
            updated_date: new Date().toISOString().split('T')[0]
        };
        
        setGroups(prev => [newGroup, ...prev]);
        
        // Close modal and reset form
        setShowCreateModal(false);
        setCreateForm({ group_name: '' });
    };

    // Handle edit form submit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        console.log('Edit form data:', editForm);
        
        // Update group in the list
        setGroups(prev => prev.map(group =>
            group.password_group_id === editForm.password_group_id
                ? { ...group, group_name: editForm.group_name, updated_date: new Date().toISOString().split('T')[0] }
                : group
        ));
        
        // Close modal
        setShowEditModal(false);
    };

    // Handle edit button click
    const handleEditClick = (group) => {
        setSelectedGroup(group);
        setEditForm({
            password_group_id: group.password_group_id,
            group_name: group.group_name
        });
        setShowEditModal(true);
        setActiveDropdown(null);
    };

    // Handle status change
    const handleStatusChange = (group) => {
        // Simulate API call
        console.log('Changing status for group:', group.password_group_id);
        
        // Update status in the list
        setGroups(prev => prev.map(g =>
            g.password_group_id === group.password_group_id
                ? { ...g, status: g.status === 1 ? 0 : 1, updated_date: new Date().toISOString().split('T')[0] }
                : g
        ));
    };

    // Handle delete group
    const handleDeleteGroup = (group) => {
        if (group.count > 0) {
            alert('Cannot delete group with firms. Please remove all firms first.');
            return;
        }

        if (window.confirm('Are you sure? You won\'t be able to revert this!')) {
            // Simulate API call
            console.log('Deleting group:', group.password_group_id);
            
            // Remove group from the list
            setGroups(prev => prev.filter(g => g.password_group_id !== group.password_group_id));
        }
        setActiveDropdown(null);
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

    const handleEditChange = (field, value) => {
        setEditForm(prev => ({
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

    // Skeleton loader component
    const SkeletonRow = () => (
        <tr className="border-b border-gray-200 animate-pulse hover:bg-gray-50">
            <td className="p-4">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-8 mx-auto"></div>
            </td>
            <td className="p-4">
                <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-32"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-24"></div>
                </div>
            </td>
            <td className="p-4">
                <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-16 mx-auto"></div>
            </td>
            <td className="p-4">
                <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-12 mx-auto"></div>
            </td>
            <td className="p-4">
                <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-20 mx-auto"></div>
            </td>
        </tr>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
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
                <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8 py-6">
                    <div className="h-full flex flex-col">
                        {/* Header Section */}
                        <div className="mb-6">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white"
                            >
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div>
                                        <h1 className="text-3xl font-bold mb-2">Password Groups</h1>
                                        <p className="text-indigo-100 opacity-90">
                                            Manage your password groups and firms efficiently
                                        </p>
                                    </div>
                                    <motion.button
                                        onClick={() => setShowCreateModal(true)}
                                        className="px-5 py-3 bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiPlus className="w-4 h-4" />
                                        Add New Group
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Groups</p>
                                        <p className="text-3xl font-bold text-gray-800 mt-2">{summary.totalGroups}</p>
                                    </div>
                                    <div className="p-3 bg-indigo-50 rounded-lg">
                                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                                            <FiSettings className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Active Groups</p>
                                        <p className="text-3xl font-bold text-green-600 mt-2">{summary.activeGroups}</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
                                            <FiCheck className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Firms</p>
                                        <p className="text-3xl font-bold text-blue-600 mt-2">{summary.totalFirms}</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-md flex items-center justify-center">
                                            <FiPlus className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Main Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col h-full overflow-hidden">
                            {/* Card Header with Search and Filters */}
                            <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div>
                                        <h5 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                                            <div className="p-2 bg-indigo-100 rounded-lg">
                                                <FiFilter className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            All Password Groups
                                        </h5>
                                        <p className="text-gray-500 text-xs">
                                            Showing {filteredGroups.length} of {groups.length} groups
                                        </p>
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                        {/* Search Box */}
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Search groups by name..."
                                                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all w-full lg:w-64 shadow-sm hover:shadow-md"
                                            />
                                            <FiSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        </div>

                                        {/* Date Filter Component */}
                                        <DateFilter onChange={handleDateFilterChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Table Container */}
                            {/* Table Container */}
<div className="flex-1 flex flex-col overflow-hidden">
    {/* Table Header - Fixed */}
    <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="min-w-full">
            <div className="grid grid-cols-12 px-4 py-3">
                <div className="col-span-1 flex items-center justify-center px-2">
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">#</span>
                </div>
                <div className="col-span-4 flex items-center justify-center px-2">
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Group Name</span>
                </div>
                <div className="col-span-2 flex items-center justify-center px-2">
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Firms Count</span>
                </div>
                <div className="col-span-2 flex items-center justify-center px-2">
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</span>
                </div>
                <div className="col-span-3 flex items-center justify-center px-2">
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</span>
                </div>
            </div>
        </div>
    </div>

    {/* Scrollable Table Body */}
    <div className="flex-1 overflow-y-auto">
        {loading ? (
            // Skeleton Loaders with matching grid
            Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="grid grid-cols-12 px-4 py-4 border-b border-gray-100 animate-pulse">
                    <div className="col-span-1 flex items-center justify-center px-2">
                        <div className="h-6 bg-gray-200 rounded-lg w-8"></div>
                    </div>
                    <div className="col-span-4 flex items-center justify-center px-2">
                        <div className="h-6 bg-gray-200 rounded-lg w-full max-w-[200px]"></div>
                    </div>
                    <div className="col-span-2 flex items-center justify-center px-2">
                        <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
                    </div>
                    <div className="col-span-2 flex items-center justify-center px-2">
                        <div className="h-8 bg-gray-200 rounded-full w-12"></div>
                    </div>
                    <div className="col-span-3 flex items-center justify-center px-2">
                        <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
                    </div>
                </div>
            ))
        ) : filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                    <FiSettings className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">
                    {groups.length === 0 ? 'No password groups found' : 'No matching groups found'}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                    {groups.length === 0 ? 'Create your first password group to get started' : 'Try adjusting your search or filter criteria'}
                </p>
                <motion.button
                    onClick={() => setShowCreateModal(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Create New Group
                </motion.button>
            </div>
        ) : (
            filteredGroups.map((group, index) => {
                const isDropdownOpen = activeDropdown === group.password_group_id;

                return (
                    <motion.div
                        key={group.password_group_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-12 px-4 py-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group"
                    >
                        {/* # Column */}
                        <div className="col-span-1 flex items-center justify-center px-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-lg text-sm">
                                {index + 1}
                            </span>
                        </div>

                        {/* Group Name Column */}
                        <div className="col-span-4 flex flex-col items-center justify-center px-2">
                            <div className="text-gray-800 font-semibold text-sm text-center">
                                {group.group_name}
                            </div>
                            <div className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                                <span>Created: {formatDate(group.created_date)}</span>
                                <span className="text-gray-300">•</span>
                                <span>Updated: {formatDate(group.updated_date)}</span>
                            </div>
                        </div>

                        {/* Firms Count Column */}
                        <div className="col-span-2 flex items-center justify-center px-2">
                            <a
                                href={`/view-password-group-firms?password_group_id=${group.password_group_id}`}
                                className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 text-sm font-semibold rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 shadow-sm hover:shadow-md min-w-[100px] border border-indigo-100"
                            >
                                <span className="font-bold text-indigo-600">{group.count}</span>
                                <span className="ml-1 text-indigo-500">firms</span>
                            </a>
                        </div>

                        {/* Status Column */}
                        <div className="col-span-2 flex items-center justify-center px-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={group.status === 1}
                                    onChange={() => handleStatusChange(group)}
                                    className="sr-only peer"
                                />
                                <div className={`w-14 h-7 rounded-full peer ${group.status === 1 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-gray-300 to-gray-400'} peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-lg`}>
                                    {group.status === 1 ? (
                                        <FiCheck className="absolute left-1.5 top-1.5 w-4 h-4 text-white z-10" />
                                    ) : (
                                        <FiX className="absolute right-1.5 top-1.5 w-4 h-4 text-gray-500 z-10" />
                                    )}
                                </div>
                            </label>
                        </div>

                        {/* Actions Column */}
                        <div className="col-span-3 flex items-center justify-center px-2">
                            <div className="dropdown-container relative">
                                <motion.button
                                    className="p-2 text-gray-500 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
                                    onClick={() => toggleDropdown(group.password_group_id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiMoreVertical className="w-5 h-5" />
                                </motion.button>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                                    >
                                        <div className="py-1">
                                            <button
                                                onClick={() => handleEditClick(group)}
                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
                                            >
                                                <div className="p-1.5 bg-indigo-100 rounded-lg mr-3">
                                                    <FiEdit className="w-3.5 h-3.5 text-indigo-600" />
                                                </div>
                                                Edit Group
                                            </button>
                                            {group.count === 0 && (
                                                <button
                                                    onClick={() => handleDeleteGroup(group)}
                                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200"
                                                >
                                                    <div className="p-1.5 bg-red-100 rounded-lg mr-3">
                                                        <FiTrash className="w-3.5 h-3.5 text-red-600" />
                                                    </div>
                                                    Delete Group
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })
        )}
    </div>

    {/* Table Footer - Fixed */}
    <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="min-w-full">
            <div className="grid grid-cols-12 px-4 py-3">
                <div className="col-span-1 flex items-center justify-center px-2">
                    <div className="text-gray-500 text-xs">
                        #{filteredGroups.length}
                    </div>
                </div>
                <div className="col-span-4 flex items-center justify-center px-2">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span className="text-xs font-semibold text-gray-700">Summary</span>
                    </div>
                </div>
                <div className="col-span-2 flex items-center justify-center px-2">
                    <span className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs font-bold rounded-xl shadow-md min-w-[100px]">
                        {summary.totalFirms} Firms
                    </span>
                </div>
                <div className="col-span-2 flex items-center justify-center px-2">
                    <span className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-xl shadow-md min-w-[100px]">
                        {summary.activeGroups} Active
                    </span>
                </div>
                <div className="col-span-3 flex items-center justify-center px-2">
                    <div className="text-gray-500 text-xs">
                        Total: {summary.totalGroups} Groups
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h5 className="text-lg font-semibold text-white">Create New Group</h5>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-white hover:text-indigo-200 transition-colors text-xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCreateSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        <span className="flex items-center gap-2">
                                            <div className="p-1.5 bg-indigo-100 rounded-lg">
                                                <FiPlus className="w-3.5 h-3.5 text-indigo-600" />
                                            </div>
                                            Group Name
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.group_name}
                                        onChange={(e) => handleCreateChange('group_name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all hover:border-indigo-300"
                                        placeholder="Enter group name (e.g., Banking Portals)"
                                        required
                                        autoFocus
                                    />
                                    <p className="text-gray-400 text-xs mt-2">
                                        Choose a descriptive name for your password group
                                    </p>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl text-sm font-medium transition-all duration-200"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg text-sm font-semibold transition-all duration-200"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Create Group
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedGroup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h5 className="text-lg font-semibold text-white">Edit Group</h5>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-white hover:text-indigo-200 transition-colors text-xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleEditSubmit}>
                                <input type="hidden" name="password_group_id" value={editForm.password_group_id} />
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        <span className="flex items-center gap-2">
                                            <div className="p-1.5 bg-indigo-100 rounded-lg">
                                                <FiEdit className="w-3.5 h-3.5 text-indigo-600" />
                                            </div>
                                            Group Name
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.group_name}
                                        onChange={(e) => handleEditChange('group_name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all hover:border-indigo-300"
                                        placeholder="Enter group name"
                                        required
                                        autoFocus
                                    />
                                    <p className="text-gray-400 text-xs mt-2">
                                        Current group: <span className="font-medium text-indigo-600">{selectedGroup.group_name}</span>
                                    </p>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl text-sm font-medium transition-all duration-200"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg text-sm font-semibold transition-all duration-200"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Update Group
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

export default PasswordGroups;