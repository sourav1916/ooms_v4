import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash, FiSettings, FiCheck, FiX, FiMoreVertical, FiSearch } from 'react-icons/fi';
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
        <tr className="border-b border-gray-200 animate-pulse">
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="p-4 text-center">
                <div className="h-6 bg-gray-200 rounded w-16 mx-auto"></div>
            </td>
            <td className="p-4 text-center">
                <div className="h-6 bg-gray-200 rounded w-12 mx-auto"></div>
            </td>
            <td className="p-4 text-center">
                <div className="h-6 bg-gray-200 rounded w-8 mx-auto"></div>
            </td>
        </tr>
    );

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
                <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8 py-6">
                    <div className="h-full flex flex-col">
                        {/* Main Card - Full height with scrolling */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
                            {/* Card Header */}
                            <div className="border-b border-gray-200 px-6 py-4">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div>
                                        <h5 className="text-xl font-bold text-gray-800 mb-1">
                                            Password Groups
                                        </h5>
                                        <p className="text-gray-500 text-xs mt-1">
                                            Manage your password groups and firms
                                        </p>
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                        {/* Search Box */}
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Search groups..."
                                                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all w-full lg:w-64"
                                            />
                                            <FiSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        </div>

                                        {/* Date Filter Component */}
                                        <DateFilter onChange={handleDateFilterChange} />

                                        <motion.button
                                            onClick={() => setShowCreateModal(true)}
                                            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
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
                                                <th className="text-center p-4 font-semibold text-gray-700">Firms Count</th>
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
                                                                {groups.length === 0 ? 'No password groups found' : 'No groups match your search criteria'}
                                                            </p>
                                                            <button
                                                                onClick={() => setShowCreateModal(true)}
                                                                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                                            >
                                                                Create Your First Group
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredGroups.map((group, index) => {
                                                    const isDropdownOpen = activeDropdown === group.password_group_id;

                                                    return (
                                                        <tr
                                                            key={group.password_group_id}
                                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                                                        >
                                                            <td className="p-4 text-gray-600 font-medium">
                                                                {index + 1}
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-gray-800 font-medium">
                                                                    {group.group_name}
                                                                </div>
                                                                <div className="text-gray-500 text-xs mt-1">
                                                                    Created: {formatDate(group.created_date)}
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <a
                                                                    href={`/view-password-group-firms?password_group_id=${group.password_group_id}`}
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
                                                                    <button
                                                                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group-hover:bg-gray-200"
                                                                        onClick={() => toggleDropdown(group.password_group_id)}
                                                                    >
                                                                        <FiMoreVertical className="w-4 h-4" />
                                                                    </button>
                                                                    {isDropdownOpen && (
                                                                        <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                                                                            <div className="py-1">
                                                                                <button
                                                                                    onClick={() => handleEditClick(group)}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                                >
                                                                                    <FiEdit className="w-4 h-4 mr-3" />
                                                                                    Edit
                                                                                </button>
                                                                                {group.count === 0 && (
                                                                                    <button
                                                                                        onClick={() => handleDeleteGroup(group)}
                                                                                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-indigo-50 transition-colors"
                                                                                    >
                                                                                        <FiTrash className="w-4 h-4 mr-3" />
                                                                                        Delete
                                                                                    </button>
                                                                                )}
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
                                                    <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-lg min-w-[80px]">
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
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all duration-300">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h5 className="text-lg font-semibold text-gray-800">Create New Group</h5>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCreateSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Group Name
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.group_name}
                                        onChange={(e) => handleCreateChange('group_name', e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        placeholder="Enter Group Name"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2.5 text-gray-600 hover:text-gray-800 rounded-lg text-sm font-medium transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Create Group
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedGroup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all duration-300">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h5 className="text-lg font-semibold text-gray-800">Edit Group</h5>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleEditSubmit}>
                                <input type="hidden" name="password_group_id" value={editForm.password_group_id} />
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Group Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.group_name}
                                        onChange={(e) => handleEditChange('group_name', e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        placeholder="Enter Group Name"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2.5 text-gray-600 hover:text-gray-800 rounded-lg text-sm font-medium transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Update Group
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordGroups;