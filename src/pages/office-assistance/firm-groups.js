import React, { useState, useEffect } from 'react';
import {
    FiPlus,
    FiEye,
    FiSettings,
    FiMoreVertical,
    FiCheck,
    FiX,
    FiSearch,
    FiFilter,
    FiCalendar,
    FiUsers,
    FiCheckCircle,
    FiXCircle,
    FiFolder
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, Sidebar } from '../../components/header';
import DateFilter from '../../components/DateFilter';
import getHeaders from "../../utils/get-headers";  // Add this import at top
import axios from 'axios';  // Add this import at top if not exists

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
        fetchGroupsData(searchTerm, 1, 10);  // Add searchTerm param
    }, []);


    // Add this new useEffect after existing ones
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchGroupsData(searchTerm, 1, 10);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);



    const BASE_URL = 'https://api.ooms.in/api/v1';  // Add this near top

    // REAL API - Replace the mock function
    const fetchGroupsData = async (search = '', page = 1, limit = 10) => {
        setLoading(true);
        try {
            const headers = getHeaders();
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString()
            });

            if (search) params.append('search', search);

            const response = await axios.get(
                `${BASE_URL}/group/list?${params.toString()}`,
                { headers }
            );

            if (response.data.success) {
                // Map backend → frontend fields
                const mapGroupToUI = (item) => ({
                    group_id: item.group_id,
                    groupid: item.group_id,        // Frontend uses both
                    name: item.name,
                    count: item.count,
                    status: item.status,
                    remark: item.remark || '',
                    created_date: item.created_date?.split('T')[0] || item.created_date || '',
                    createddate: item.created_date?.split('T')[0] || item.created_date || '',
                    updated_date: item.updated_date?.split('T')[0] || item.updated_date || '',
                    updateddate: item.updated_date?.split('T')[0] || item.updated_date || ''
                });

                setGroups(response.data.data.map(mapGroupToUI));
                setFilteredGroups(response.data.data.map(mapGroupToUI));
            } else {
                console.error('API Error:', response.data.message);
                setGroups([]);
                setFilteredGroups([]);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            setGroups([]);
            setFilteredGroups([]);
        } finally {
            setLoading(false);
        }
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
            <td className="p-4 text-center">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-6 mx-auto"></div>
            </td>
            <td className="p-4">
                <div className="space-y-1.5">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                </div>
            </td>
            <td className="p-4 text-center">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 mx-auto"></div>
            </td>
            <td className="p-4 text-center">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12 mx-auto"></div>
            </td>
            <td className="p-4 text-center">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-8 mx-auto"></div>
            </td>
        </tr>
    );

    // Show skeleton while loading
    if (loading && groups.length === 0) {
        return <SkeletonLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
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
                <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8 py-6">
                    <div className="h-full flex flex-col">
                        {/* Header with Stats */}
                        <div className="mb-6">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                                <div>
                                    <h5 className="text-2xl font-bold text-gray-800 mb-2">
                                        Firm Groups Management
                                    </h5>
                                    <p className="text-gray-600 text-sm">
                                        Organize and manage your client groups efficiently
                                    </p>
                                </div>

                                <motion.button
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-600/40"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Add New Group
                                </motion.button>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Total Groups</p>
                                            <h3 className="text-2xl font-bold text-gray-800">{summary.totalGroups}</h3>
                                        </div>
                                        <div className="p-3 bg-indigo-50 rounded-lg">
                                            <FiFolder className="w-6 h-6 text-indigo-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Active Groups</p>
                                            <h3 className="text-2xl font-bold text-green-600">{summary.activeGroups}</h3>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <FiCheckCircle className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Total Firms</p>
                                            <h3 className="text-2xl font-bold text-blue-600">{summary.totalFirms}</h3>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <FiUsers className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Inactive Groups</p>
                                            <h3 className="text-2xl font-bold text-red-600">{summary.totalGroups - summary.activeGroups}</h3>
                                        </div>
                                        <div className="p-3 bg-red-50 rounded-lg">
                                            <FiXCircle className="w-6 h-6 text-red-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col h-full overflow-hidden">
                            {/* Filters Bar */}
                            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                                    {/* Search Input */}
                                    <div className="relative flex-1 min-w-0">
                                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search groups by name or remark"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all text-sm"
                                        />
                                    </div>

                                    {/* Date Filter */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-300 rounded-lg bg-white min-w-[140px]">
                                            <FiCalendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                            <DateFilter
                                                onChange={handleDateFilterChange}
                                                className="text-sm w-full bg-transparent border-none outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Results Count */}
                                    <div className="text-sm text-gray-600 whitespace-nowrap sm:ml-auto">
                                        <span className="font-semibold">{filteredGroups.length}</span> of <span className="font-semibold">{groups.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Table Container */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Table Header */}
                                <div className="bg-gradient-to-r from-gray-50 to-indigo-50">
                                    <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-gray-200">
                                        <div className="col-span-1">
                                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                                                #
                                            </div>
                                        </div>
                                        <div className="col-span-5">
                                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                                                Group Details
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                                                Number Of Firms
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                                                Status
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                                                Actions
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Scrollable Table Body */}
                                <div className="flex-1 overflow-y-auto">
                                    {loading ? (
                                        <div className="p-5">
                                            {Array.from({ length: 8 }).map((_, index) => (
                                                <SkeletonRow key={index} />
                                            ))}
                                        </div>
                                    ) : filteredGroups.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                    <FiFolder className="w-12 h-12 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 text-lg font-medium mb-2">
                                                    {groups.length === 0 ? 'No firm groups available' : 'No matching groups found'}
                                                </p>
                                                <p className="text-gray-400 text-sm mb-4">
                                                    {groups.length === 0
                                                        ? 'Get started by creating your first firm group'
                                                        : 'Try adjusting your search or filter criteria'}
                                                </p>
                                                <motion.button
                                                    onClick={() => setShowCreateModal(true)}
                                                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Create Your First Group
                                                </motion.button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-5">
                                            {filteredGroups.map((group, index) => {
                                                const isDropdownOpen = activeDropdown === group.group_id;

                                                return (
                                                    <motion.div
                                                        key={group.group_id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="grid grid-cols-12 gap-2 py-3 border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 group"
                                                    >
                                                        {/* # Column */}
                                                        <div className="col-span-1 flex items-center justify-center">
                                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 font-semibold rounded-lg">
                                                                {index + 1}
                                                            </span>
                                                        </div>

                                                        {/* Group Details Column */}
                                                        <div className="col-span-5 flex flex-col items-center justify-center text-center">
                                                            <div className="mb-2">
                                                                <div className="text-gray-800 font-semibold text-sm mb-1">
                                                                    {group.name}
                                                                </div>
                                                                {group.remark && (
                                                                    <div className="text-gray-500 text-xs max-w-xs">
                                                                        {group.remark}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="text-gray-500 text-xs">
                                                                Created: {formatDate(group.created_date)}
                                                            </div>
                                                        </div>

                                                        {/* Number Of Firms Column */}
                                                        <div className="col-span-2 flex items-center justify-center">
                                                            <a
                                                                href={`/view-group-firms?group_id=${group.group_id}`}
                                                                className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 font-semibold text-sm rounded-lg border border-indigo-200 hover:from-indigo-100 hover:to-blue-100 transition-all min-w-[80px] shadow-sm"
                                                            >
                                                                <FiUsers className="w-3 h-3 mr-1" />
                                                                {group.count}
                                                            </a>
                                                        </div>

                                                        {/* Status Column */}
                                                        {/* Status Column */}
                                                        <div className="col-span-2 flex items-center justify-center">
                                                            <button
                                                                onClick={() => handleStatusChange(group)}
                                                                className="relative inline-flex items-center cursor-pointer focus:outline-none"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={group.status === 1}
                                                                    readOnly
                                                                    className="sr-only"
                                                                />
                                                                <div className={`w-14 h-7 rounded-full transition-colors duration-300 ease-in-out ${group.status === 1 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-gray-300 to-gray-400'}`}>
                                                                    <div className={`absolute top-0.5 ${group.status === 1 ? 'left-7' : 'left-0.5'} bg-white rounded-full h-6 w-6 transition-all duration-300 ease-in-out border border-gray-300 shadow-sm`}></div>
                                                                </div>
                                                                {group.status === 1 ? (
                                                                    <span className="absolute left-1.5 top-1 text-xs text-white z-10 font-medium">ON</span>
                                                                ) : (
                                                                    <span className="absolute right-1.5 top-1 text-xs text-gray-600 z-10 font-medium">OFF</span>
                                                                )}
                                                            </button>
                                                        </div>

                                                        {/* Actions Column */}
                                                        <div className="col-span-2 flex items-center justify-center">
                                                            <div className="dropdown-container relative">
                                                                <motion.button
                                                                    className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 group-hover:bg-indigo-100/50"
                                                                    onClick={() => toggleDropdown(group.group_id)}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                >
                                                                    <FiMoreVertical className="w-5 h-5" />
                                                                </motion.button>
                                                                <AnimatePresence>
                                                                    {isDropdownOpen && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                                            transition={{ duration: 0.15 }}
                                                                            className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
                                                                        >
                                                                            <div className="py-1">
                                                                                <a
                                                                                    href={`/view-group-firms?group_id=${group.group_id}`}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"
                                                                                    onClick={() => setActiveDropdown(null)}
                                                                                >
                                                                                    <FiEye className="w-4 h-4 mr-3" />
                                                                                    View Firms
                                                                                </a>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Table Footer */}
                                <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                    <div className="px-5 py-3">
                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                                            <div className="text-sm text-gray-600">
                                                Showing <span className="font-semibold">{filteredGroups.length}</span> of{" "}
                                                <span className="font-semibold">{groups.length}</span> groups
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-sm">
                                                    <span className="text-gray-600">Active: </span>
                                                    <span className="font-semibold text-green-600">{summary.activeGroups}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-600">Firms: </span>
                                                    <span className="font-semibold text-blue-600">{summary.totalFirms}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-600">Inactive: </span>
                                                    <span className="font-semibold text-red-600">{summary.totalGroups - summary.activeGroups}</span>
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

            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-b border-indigo-200 px-6 py-4 z-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h5 className="text-xl font-bold">Create New Group</h5>
                                    <p className="text-indigo-200 text-sm mt-1">Add a new firm group</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setCreateForm({ name: '', remark: '' });
                                    }}
                                    className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCreateSubmit}>
                                <div className="space-y-6 mb-8">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Group Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.name}
                                            onChange={(e) => handleCreateChange('name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="e.g., GST Clients"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Remark
                                        </label>
                                        <textarea
                                            value={createForm.remark}
                                            onChange={(e) => handleCreateChange('remark', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all min-h-[100px] resize-none"
                                            placeholder="Enter description for this group"
                                            rows="3"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                    <motion.button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setCreateForm({ name: '', remark: '' });
                                        }}
                                        className="px-5 py-2.5 text-gray-600 hover:text-gray-800 rounded-xl text-sm font-medium transition-colors border border-gray-300 hover:bg-gray-50"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-medium flex items-center gap-2 shadow-md"
                                        whileHover={{ scale: 1.02, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <FiPlus className="w-4 h-4" />
                                        Create Group
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

export default FirmGroups;