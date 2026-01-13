import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiSettings, FiMoreVertical, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Header, Sidebar } from '../../components/header';
import DateFilter from '../../components/DateFilter';

const RecurringGroups = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('');

    // Form states
    const [createForm, setCreateForm] = useState({
        name: '',
        service_id: '',
        period: 'monthly',
        due_date_1: '',
        due_date_2: '',
        due_date_3: '',
        due_date_4: '',
        create_date_1: '',
        create_date_2: '',
        create_date_3: '',
        create_date_4: ''
    });

    const [editForm, setEditForm] = useState({
        group_id: '',
        name: '',
        service_id: '',
        period: 'monthly',
        due_date_1: '',
        due_date_2: '',
        due_date_3: '',
        due_date_4: '',
        create_date_1: '',
        create_date_2: '',
        create_date_3: '',
        create_date_4: '',
        status: '1'
    });

    // Mock Recurring Groups data with dates
    const mockGroupsData = [
        {
            group_id: 'group001',
            name: 'GST Filing - Monthly',
            service_name: 'GST Return Filing',
            service_id: 'service001',
            period: 'monthly',
            count: 15,
            fees: '₹1,500.00',
            due_date_1: '20th',
            create_date_1: '15th',
            status: 1,
            created_date: '2024-01-15',
            updated_date: '2024-01-20'
        },
        {
            group_id: 'group002',
            name: 'TDS Quarterly',
            service_name: 'TDS Return Filing',
            service_id: 'service002',
            period: 'quarterly',
            count: 8,
            fees: '₹800.00',
            due_date_1: '31st Jul',
            due_date_2: '31st Oct',
            due_date_3: '31st Jan',
            due_date_4: '31st May',
            create_date_1: '25th Jul',
            create_date_2: '25th Oct',
            create_date_3: '25th Jan',
            create_date_4: '25th May',
            status: 1,
            created_date: '2024-01-10',
            updated_date: '2024-01-18'
        },
        {
            group_id: 'group003',
            name: 'ITR Yearly',
            service_name: 'Income Tax Return',
            service_id: 'service003',
            period: 'yearly',
            count: 25,
            fees: '₹2,000.00',
            due_date_1: '31st Jul',
            create_date_1: '25th Jul',
            status: 1,
            created_date: '2024-01-05',
            updated_date: '2024-01-12'
        },
        {
            group_id: 'group004',
            name: 'Audit Half Yearly',
            service_name: 'Tax Audit',
            service_id: 'service004',
            period: 'half yearly',
            count: 5,
            fees: '₹3,000.00',
            due_date_1: '30th Sep',
            due_date_2: '31st Mar',
            create_date_1: '25th Sep',
            create_date_2: '25th Mar',
            status: 0,
            created_date: '2024-01-20',
            updated_date: '2024-01-25'
        },
        {
            group_id: 'group005',
            name: 'GST Quarterly',
            service_name: 'GST Return Filing',
            service_id: 'service001',
            period: 'quarterly',
            count: 12,
            fees: '₹1,500.00',
            due_date_1: '31st Jul',
            due_date_2: '31st Oct',
            due_date_3: '31st Jan',
            due_date_4: '31st May',
            create_date_1: '25th Jul',
            create_date_2: '25th Oct',
            create_date_3: '25th Jan',
            create_date_4: '25th May',
            status: 1,
            created_date: '2024-01-18',
            updated_date: '2024-01-22'
        },
        {
            group_id: 'group006',
            name: 'PF Monthly',
            service_name: 'EPF Return',
            service_id: 'service005',
            period: 'monthly',
            count: 18,
            fees: '₹1,200.00',
            due_date_1: '15th',
            create_date_1: '10th',
            status: 1,
            created_date: '2024-01-12',
            updated_date: '2024-01-19'
        }
    ];

    // Mock Services data
    const mockServices = [
        { service_id: 'service001', name: 'GST Return Filing' },
        { service_id: 'service002', name: 'TDS Return Filing' },
        { service_id: 'service003', name: 'Income Tax Return' },
        { service_id: 'service004', name: 'Tax Audit' },
        { service_id: 'service005', name: 'EPF Return' }
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
        fetchServices();
    }, []);

    // Filter groups when search term, date range, or service changes
    useEffect(() => {
        filterGroups();
    }, [searchTerm, dateRange, selectedService, groups]);

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

    // Simulate fetching services
    const fetchServices = async () => {
        setTimeout(() => {
            setServices(mockServices);
        }, 500);
    };

    // Filter groups based on search term, date range, and service
    const filterGroups = () => {
        let filtered = groups;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(group =>
                group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                group.service_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by service
        if (selectedService) {
            filtered = filtered.filter(group => group.service_id === selectedService);
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
            group_id: `group${String(groups.length + 1).padStart(3, '0')}`,
            name: createForm.name,
            service_name: services.find(s => s.service_id === createForm.service_id)?.name || '',
            service_id: createForm.service_id,
            period: createForm.period,
            count: 0,
            fees: '₹0.00',
            due_date_1: createForm.due_date_1,
            due_date_2: createForm.due_date_2,
            due_date_3: createForm.due_date_3,
            due_date_4: createForm.due_date_4,
            create_date_1: createForm.create_date_1,
            create_date_2: createForm.create_date_2,
            create_date_3: createForm.create_date_3,
            create_date_4: createForm.create_date_4,
            status: 1,
            created_date: new Date().toISOString().split('T')[0],
            updated_date: new Date().toISOString().split('T')[0]
        };
        
        setGroups(prev => [newGroup, ...prev]);
        
        // Close modal and reset form
        setShowCreateModal(false);
        setCreateForm({
            name: '',
            service_id: '',
            period: 'monthly',
            due_date_1: '',
            due_date_2: '',
            due_date_3: '',
            due_date_4: '',
            create_date_1: '',
            create_date_2: '',
            create_date_3: '',
            create_date_4: ''
        });
    };

    // Handle edit form submit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        console.log('Edit form data:', editForm);
        
        // Update group in the list
        setGroups(prev => prev.map(group =>
            group.group_id === editForm.group_id
                ? { 
                    ...group, 
                    name: editForm.name,
                    service_name: services.find(s => s.service_id === editForm.service_id)?.name || group.service_name,
                    service_id: editForm.service_id,
                    period: editForm.period,
                    due_date_1: editForm.due_date_1,
                    due_date_2: editForm.due_date_2,
                    due_date_3: editForm.due_date_3,
                    due_date_4: editForm.due_date_4,
                    create_date_1: editForm.create_date_1,
                    create_date_2: editForm.create_date_2,
                    create_date_3: editForm.create_date_3,
                    create_date_4: editForm.create_date_4,
                    status: parseInt(editForm.status),
                    updated_date: new Date().toISOString().split('T')[0]
                }
                : group
        ));
        
        // Close modal
        setShowEditModal(false);
    };

    // Handle edit button click
    const handleEditClick = (group) => {
        setSelectedGroup(group);
        setEditForm({
            group_id: group.group_id,
            name: group.name,
            service_id: group.service_id,
            period: group.period,
            due_date_1: group.due_date_1 || '',
            due_date_2: group.due_date_2 || '',
            due_date_3: group.due_date_3 || '',
            due_date_4: group.due_date_4 || '',
            create_date_1: group.create_date_1 || '',
            create_date_2: group.create_date_2 || '',
            create_date_3: group.create_date_3 || '',
            create_date_4: group.create_date_4 || '',
            status: group.status.toString()
        });
        setShowEditModal(true);
        setActiveDropdown(null);
    };

    // Handle status change
    const handleStatusChange = (group) => {
        // Simulate API call
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

    // Render date fields based on period
    const renderDateFields = (form, isEdit = false) => {
        const { period } = form;
        const handleChange = isEdit ? handleEditChange : handleCreateChange;

        switch (period) {
            case 'monthly':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Create Date
                            </label>
                            <input
                                type="text"
                                value={isEdit ? editForm.create_date_1 : createForm.create_date_1}
                                onChange={(e) => handleChange('create_date_1', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                placeholder="e.g., 15th"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Due Date
                            </label>
                            <input
                                type="text"
                                value={isEdit ? editForm.due_date_1 : createForm.due_date_1}
                                onChange={(e) => handleChange('due_date_1', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                placeholder="e.g., 20th"
                                required
                            />
                        </div>
                    </div>
                );

            case 'quarterly':
                return (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(num => (
                            <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Create Date Q{num}
                                    </label>
                                    <input
                                        type="text"
                                        value={isEdit ? editForm[`create_date_${num}`] : createForm[`create_date_${num}`]}
                                        onChange={(e) => handleChange(`create_date_${num}`, e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        placeholder={`e.g., 25th ${['Jul', 'Oct', 'Jan', 'May'][num-1]}`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Due Date Q{num}
                                    </label>
                                    <input
                                        type="text"
                                        value={isEdit ? editForm[`due_date_${num}`] : createForm[`due_date_${num}`]}
                                        onChange={(e) => handleChange(`due_date_${num}`, e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        placeholder={`e.g., 31st ${['Jul', 'Oct', 'Jan', 'May'][num-1]}`}
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'half yearly':
                return (
                    <div className="space-y-4">
                        {[1, 2].map(num => (
                            <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Create Date H{num}
                                    </label>
                                    <input
                                        type="text"
                                        value={isEdit ? editForm[`create_date_${num}`] : createForm[`create_date_${num}`]}
                                        onChange={(e) => handleChange(`create_date_${num}`, e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        placeholder={`e.g., 25th ${['Sep', 'Mar'][num-1]}`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Due Date H{num}
                                    </label>
                                    <input
                                        type="text"
                                        value={isEdit ? editForm[`due_date_${num}`] : createForm[`due_date_${num}`]}
                                        onChange={(e) => handleChange(`due_date_${num}`, e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        placeholder={`e.g., 30th ${['Sep', 'Mar'][num-1]}`}
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'yearly':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Create Date
                            </label>
                            <input
                                type="text"
                                value={isEdit ? editForm.create_date_1 : createForm.create_date_1}
                                onChange={(e) => handleChange('create_date_1', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                placeholder="e.g., 25th Jul"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Due Date
                            </label>
                            <input
                                type="text"
                                value={isEdit ? editForm.due_date_1 : createForm.due_date_1}
                                onChange={(e) => handleChange('due_date_1', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                placeholder="e.g., 31st Jul"
                                required
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Render date display for table
    const renderDateDisplay = (group) => {
        const { period } = group;

        switch (period) {
            case 'monthly':
                return (
                    <div className="text-xs space-y-1">
                        <div className="text-gray-600">• C: {group.create_date_1} | D: {group.due_date_1}</div>
                    </div>
                );

            case 'quarterly':
                return (
                    <div className="text-xs space-y-1">
                        <div className="text-gray-600">• C: {group.create_date_1} | D: {group.due_date_1}</div>
                        <div className="text-gray-600">• C: {group.create_date_2} | D: {group.due_date_2}</div>
                        <div className="text-gray-600">• C: {group.create_date_3} | D: {group.due_date_3}</div>
                        <div className="text-gray-600">• C: {group.create_date_4} | D: {group.due_date_4}</div>
                    </div>
                );

            case 'half yearly':
                return (
                    <div className="text-xs space-y-1">
                        <div className="text-gray-600">• C: {group.create_date_1} | D: {group.due_date_1}</div>
                        <div className="text-gray-600">• C: {group.create_date_2} | D: {group.due_date_2}</div>
                    </div>
                );

            case 'yearly':
                return (
                    <div className="text-xs space-y-1">
                        <div className="text-gray-600">• C: {group.create_date_1} | D: {group.due_date_1}</div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Calculate summary
    const summary = {
        totalGroups: filteredGroups.length,
        activeGroups: filteredGroups.filter(group => group.status === 1).length,
        totalFirms: filteredGroups.reduce((sum, group) => sum + group.count, 0),
        monthlyGroups: filteredGroups.filter(group => group.period === 'monthly').length,
        quarterlyGroups: filteredGroups.filter(group => group.period === 'quarterly').length
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
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </td>
            <td className="p-4">
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
            </td>
            <td className="p-4 text-center">
                <div className="h-6 bg-gray-200 rounded w-12 mx-auto"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-gray-200 rounded w-12"></div>
            </td>
            <td className="p-4">
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
                                            Recurring Groups
                                        </h5>
                                        <p className="text-gray-500 text-xs mt-1">
                                            Manage your recurring service groups and schedules
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

                                        {/* Service Filter */}
                                        <select 
                                            value={selectedService}
                                            onChange={(e) => setSelectedService(e.target.value)}
                                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        >
                                            <option value="">All Services</option>
                                            {services.map(service => (
                                                <option key={service.service_id} value={service.service_id}>
                                                    {service.name}
                                                </option>
                                            ))}
                                        </select>

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
                                                <th className="text-left p-4 font-semibold text-gray-700">Service</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Dates</th>
                                                <th className="text-center p-4 font-semibold text-gray-700">Firms</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Status</th>
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
                                                    <td colSpan="7" className="text-center py-8 text-gray-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FiSettings className="w-12 h-12 text-gray-300 mb-3" />
                                                            <p className="text-gray-500">
                                                                {groups.length === 0 ? 'No recurring groups found' : 'No groups match your search criteria'}
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
                                                                <div className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                        group.period === 'monthly' ? 'bg-indigo-100 text-indigo-800' :
                                                                        group.period === 'quarterly' ? 'bg-green-100 text-green-800' :
                                                                        group.period === 'half yearly' ? 'bg-orange-100 text-orange-800' :
                                                                        'bg-purple-100 text-purple-800'
                                                                    }`}>
                                                                        {group.period.toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div className="text-gray-500 text-xs mt-1">
                                                                    Created: {formatDate(group.created_date)}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-gray-800 font-medium">
                                                                    {group.service_name}
                                                                </div>
                                                                <div className="text-indigo-600 text-xs mt-1">
                                                                    Fees: {group.fees}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                {renderDateDisplay(group)}
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <a
                                                                    href={`/view-recurring-group-firms?group_id=${group.group_id}`}
                                                                    className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-lg hover:bg-indigo-200 transition-colors min-w-[60px]"
                                                                >
                                                                    {group.count}
                                                                </a>
                                                            </td>
                                                            <td className="p-4">
                                                                <label className="relative inline-flex items-center cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={group.status === 1}
                                                                        onChange={() => handleStatusChange(group)}
                                                                        className="sr-only peer"
                                                                    />
                                                                    <div className={`w-12 h-6 rounded-full peer ${group.status === 1 ? 'bg-indigo-600' : 'bg-gray-300'} peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:border after:border-gray-300`}></div>
                                                                </label>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="dropdown-container relative flex justify-center">
                                                                    <button
                                                                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group-hover:bg-gray-200"
                                                                        onClick={() => toggleDropdown(group.group_id)}
                                                                    >
                                                                        <FiMoreVertical className="w-4 h-4" />
                                                                    </button>
                                                                    {isDropdownOpen && (
                                                                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                                                                            <div className="py-1">
                                                                                <button
                                                                                    onClick={() => handleEditClick(group)}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                                >
                                                                                    <FiEdit className="w-4 h-4 mr-3" />
                                                                                    Edit
                                                                                </button>
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
                                                <td className="text-left p-4">
                                                    <span className="inline-flex items-center justify-center bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                        {summary.totalGroups} Groups
                                                    </span>
                                                </td>
                                                <td className="text-left p-4">
                                                    <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                        {summary.monthlyGroups} Monthly
                                                    </span>
                                                </td>
                                                <td className="text-center p-4">
                                                    <span className="inline-flex items-center justify-center bg-purple-100 text-purple-800 text-sm font-bold px-3 py-1.5 rounded-lg min-w-[60px]">
                                                        {summary.totalFirms}
                                                    </span>
                                                </td>
                                                <td className="text-left p-4">
                                                    <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                        {summary.activeGroups} Active
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

            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h5 className="text-lg font-semibold text-gray-800">Create Recurring Group</h5>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Group Name
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.name}
                                            onChange={(e) => handleCreateChange('name', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter group name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Service
                                        </label>
                                        <select
                                            value={createForm.service_id}
                                            onChange={(e) => handleCreateChange('service_id', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            required
                                        >
                                            <option value="">Select Service</option>
                                            {services.map(service => (
                                                <option key={service.service_id} value={service.service_id}>
                                                    {service.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Period
                                        </label>
                                        <select
                                            value={createForm.period}
                                            onChange={(e) => handleCreateChange('period', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            required
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="half yearly">Half Yearly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        {renderDateFields(createForm, false)}
                                    </div>
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
                                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <FiPlus className="w-4 h-4" />
                                        Create Group
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Group Modal */}
            {showEditModal && selectedGroup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h5 className="text-lg font-semibold text-gray-800">Edit Recurring Group</h5>
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
                                <input type="hidden" name="group_id" value={editForm.group_id} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Group Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => handleEditChange('name', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter group name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Service
                                        </label>
                                        <select
                                            value={editForm.service_id}
                                            onChange={(e) => handleEditChange('service_id', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            required
                                        >
                                            <option value="">Select Service</option>
                                            {services.map(service => (
                                                <option key={service.service_id} value={service.service_id}>
                                                    {service.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Period
                                        </label>
                                        <select
                                            value={editForm.period}
                                            onChange={(e) => handleEditChange('period', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            required
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="half yearly">Half Yearly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={editForm.status}
                                            onChange={(e) => handleEditChange('status', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            required
                                        >
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        {renderDateFields(editForm, true)}
                                    </div>
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

export default RecurringGroups;