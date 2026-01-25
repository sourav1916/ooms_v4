import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiSettings, FiMoreVertical, FiSearch, FiFilter, FiDollarSign, FiPercent, FiCheckCircle, FiXCircle, FiCalendar, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, Sidebar } from '../../components/header';
import DateFilter from '../../components/DateFilter';

const Services = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('');

    // Form states
    const [createForm, setCreateForm] = useState({
        name: '',
        sac_code: '',
        fees: '',
        gst_rate: '',
        gst: '0',
        has_ay: '0'
    });

    const [editForm, setEditForm] = useState({
        service_id: '',
        name: '',
        sac_code: '',
        fees: '',
        gst_rate: '',
        gst: '0',
        has_ay: '0',
        status: '1'
    });

    // Mock Services data with dates
    const mockServicesData = [
        {
            service_id: 'service001',
            name: 'GST Registration',
            sac_code: '998311',
            fees: 1500.00,
            gst_rate: 18,
            gst: 270.00,
            has_ay: 1,
            status: 1,
            created_date: '2024-01-15',
            updated_date: '2024-01-20'
        },
        {
            service_id: 'service002',
            name: 'Income Tax Return Filing',
            sac_code: '998312',
            fees: 2000.00,
            gst_rate: 18,
            gst: 360.00,
            has_ay: 1,
            status: 1,
            created_date: '2024-01-10',
            updated_date: '2024-01-18'
        },
        {
            service_id: 'service003',
            name: 'Company Incorporation',
            sac_code: '998313',
            fees: 5000.00,
            gst_rate: 18,
            gst: 900.00,
            has_ay: 0,
            status: 1,
            created_date: '2024-01-05',
            updated_date: '2024-01-12'
        },
        {
            service_id: 'service004',
            name: 'TDS Return Filing',
            sac_code: '998314',
            fees: 800.00,
            gst_rate: 18,
            gst: 144.00,
            has_ay: 1,
            status: 0,
            created_date: '2024-01-20',
            updated_date: '2024-01-25'
        },
        {
            service_id: 'service005',
            name: 'Audit Services',
            sac_code: '998315',
            fees: 3000.00,
            gst_rate: 18,
            gst: 540.00,
            has_ay: 1,
            status: 1,
            created_date: '2024-01-18',
            updated_date: '2024-01-22'
        },
        {
            service_id: 'service006',
            name: 'GST Return Filing',
            sac_code: '998316',
            fees: 1200.00,
            gst_rate: 18,
            gst: 216.00,
            has_ay: 1,
            status: 1,
            created_date: '2024-01-12',
            updated_date: '2024-01-19'
        },
        {
            service_id: 'service007',
            name: 'Bookkeeping Services',
            sac_code: '998317',
            fees: 2500.00,
            gst_rate: 18,
            gst: 450.00,
            has_ay: 1,
            status: 1,
            created_date: '2024-01-08',
            updated_date: '2024-01-15'
        },
        {
            service_id: 'service008',
            name: 'Financial Consulting',
            sac_code: '998318',
            fees: 4000.00,
            gst_rate: 18,
            gst: 720.00,
            has_ay: 0,
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
        fetchServicesData();
    }, []);

    // Filter services when search term or date range changes
    useEffect(() => {
        filterServices();
    }, [searchTerm, dateRange, services]);

    // Simulate API call to fetch services data
    const fetchServicesData = async () => {
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            setServices(mockServicesData);
            setFilteredServices(mockServicesData);
            setLoading(false);
        }, 1000);
    };

    // Filter services based on search term and date range
    const filterServices = () => {
        let filtered = services;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.sac_code.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by date range
        if (dateRange) {
            const [from, to] = dateRange.split(' - ');
            const fromDate = new Date(from.split('/').reverse().join('-'));
            const toDate = new Date(to.split('/').reverse().join('-'));
            
            filtered = filtered.filter(service => {
                const serviceDate = new Date(service.created_date);
                return serviceDate >= fromDate && serviceDate <= toDate;
            });
        }

        setFilteredServices(filtered);
    };

    // Handle create form submit
    const handleCreateSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        console.log('Create form data:', createForm);
        
        // Add new service to the list
        const newService = {
            service_id: `service${String(services.length + 1).padStart(3, '0')}`,
            name: createForm.name,
            sac_code: createForm.sac_code,
            fees: parseFloat(createForm.fees),
            gst_rate: parseFloat(createForm.gst_rate),
            gst: parseFloat(createForm.gst),
            has_ay: parseInt(createForm.has_ay),
            status: 1,
            created_date: new Date().toISOString().split('T')[0],
            updated_date: new Date().toISOString().split('T')[0]
        };
        
        setServices(prev => [newService, ...prev]);
        
        // Close modal and reset form
        setShowCreateModal(false);
        setCreateForm({
            name: '',
            sac_code: '',
            fees: '',
            gst_rate: '',
            gst: '0',
            has_ay: '0'
        });
    };

    // Handle edit form submit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        console.log('Edit form data:', editForm);
        
        // Update service in the list
        setServices(prev => prev.map(service =>
            service.service_id === editForm.service_id
                ? { 
                    ...service, 
                    name: editForm.name,
                    sac_code: editForm.sac_code,
                    fees: parseFloat(editForm.fees),
                    gst_rate: parseFloat(editForm.gst_rate),
                    gst: parseFloat(editForm.gst),
                    has_ay: parseInt(editForm.has_ay),
                    status: parseInt(editForm.status),
                    updated_date: new Date().toISOString().split('T')[0]
                }
                : service
        ));
        
        // Close modal
        setShowEditModal(false);
    };

    // Handle edit button click
    const handleEditClick = (service) => {
        setSelectedService(service);
        setEditForm({
            service_id: service.service_id,
            name: service.name,
            sac_code: service.sac_code,
            fees: service.fees.toString(),
            gst_rate: service.gst_rate.toString(),
            gst: service.gst.toString(),
            has_ay: service.has_ay.toString(),
            status: service.status.toString()
        });
        setShowEditModal(true);
        setActiveDropdown(null);
    };

    // Calculate GST
    const calculateGST = (fees, gstRate) => {
        if (!fees || !gstRate) return '0';
        const gst = parseFloat(fees) * (parseFloat(gstRate) / 100);
        return gst.toFixed(2);
    };

    // Handle form changes with GST calculation
    const handleCreateChange = (field, value) => {
        const newForm = { ...createForm, [field]: value };
        
        if (field === 'fees' || field === 'gst_rate') {
            newForm.gst = calculateGST(
                field === 'fees' ? value : createForm.fees,
                field === 'gst_rate' ? value : createForm.gst_rate
            );
        }
        
        setCreateForm(newForm);
    };

    const handleEditChange = (field, value) => {
        const newForm = { ...editForm, [field]: value };
        
        if (field === 'fees' || field === 'gst_rate') {
            newForm.gst = calculateGST(
                field === 'fees' ? value : editForm.fees,
                field === 'gst_rate' ? value : editForm.gst_rate
            );
        }
        
        setEditForm(newForm);
    };

    // Toggle dropdown
    const toggleDropdown = (serviceId) => {
        setActiveDropdown(activeDropdown === serviceId ? null : serviceId);
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

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Calculate summary
    const summary = {
        totalServices: filteredServices.length,
        activeServices: filteredServices.filter(service => service.status === 1).length,
        totalRevenue: filteredServices.reduce((sum, service) => sum + service.fees, 0),
        totalGST: filteredServices.reduce((sum, service) => sum + service.gst, 0)
    };

    // Clear search
    const clearSearch = () => {
        setSearchTerm('');
        setDateRange('');
    };

    // Skeleton loader component
    const SkeletonRow = () => (
        <tr className="border-b border-gray-100 animate-pulse">
            <td className="p-3 text-center">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-6 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="space-y-1.5 mx-auto max-w-xs">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-36 mx-auto"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 mx-auto"></div>
                </div>
            </td>
            <td className="p-3 text-center">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="space-y-1 mx-auto max-w-xs">
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 mx-auto"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 mx-auto"></div>
                </div>
            </td>
            <td className="p-3 text-center">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-8 mx-auto"></div>
            </td>
        </tr>
    );

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

            {/* Main content */}
            <div className={`pt-16 transition-all duration-300 ease-in-out ${isMinimized ? 'md:pl-20' : 'md:pl-72'}`}>
                <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8 py-6">
                    <div className="h-full flex flex-col">
                        {/* Header with Stats */}
                        <div className="mb-6">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                                <div>
                                    <h5 className="text-2xl font-bold text-gray-800 mb-2">
                                        Services Management
                                    </h5>
                                    <p className="text-gray-600 text-sm">
                                        Manage and track all your services in one place
                                    </p>
                                </div>

                                <motion.button
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-600/40"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Add New Service
                                </motion.button>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Total Services</p>
                                            <h3 className="text-2xl font-bold text-gray-800">{summary.totalServices}</h3>
                                        </div>
                                        <div className="p-3 bg-indigo-50 rounded-lg">
                                            <FiSettings className="w-6 h-6 text-indigo-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Active Services</p>
                                            <h3 className="text-2xl font-bold text-green-600">{summary.activeServices}</h3>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <FiCheckCircle className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                                            <h3 className="text-2xl font-bold text-gray-800">₹{formatCurrency(summary.totalRevenue)}</h3>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <FiDollarSign className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Total GST</p>
                                            <h3 className="text-2xl font-bold text-orange-600">₹{formatCurrency(summary.totalGST)}</h3>
                                        </div>
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <FiPercent className="w-6 h-6 text-orange-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col h-full overflow-hidden">
                            {/* Filters Bar - Compact Design */}
                            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                                    {/* Search Input - Compact */}
                                    <div className="relative flex-1 min-w-0">
                                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search by name or SAC code"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all text-sm"
                                        />
                                    </div>
                                    
                                    {/* Date Filter - Compact */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-300 rounded-lg bg-white min-w-[140px]">
                                            <FiCalendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                            <DateFilter 
                                                onChange={handleDateFilterChange}
                                                className="text-sm w-full bg-transparent border-none outline-none"
                                            />
                                        </div>
                                        
                                        {/* Active Filters Badge */}
                                        {(searchTerm || dateRange) && (
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                                                    {searchTerm && (
                                                        <span className="flex items-center">
                                                            Search: "{searchTerm}"
                                                        </span>
                                                    )}
                                                    {dateRange && (
                                                        <span className="flex items-center ml-2">
                                                            <FiCalendar className="w-3 h-3 mr-1" />
                                                            {dateRange}
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={clearSearch}
                                                        className="ml-2 p-1 hover:bg-indigo-100 rounded-full transition-colors"
                                                    >
                                                        <FiX className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Results Count - Compact */}
                                    <div className="text-sm text-gray-600 whitespace-nowrap sm:ml-auto">
                                        <span className="font-semibold">{filteredServices.length}</span> of <span className="font-semibold">{services.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Table Container */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Table Header - Perfectly aligned */}
                                <div className="bg-gradient-to-r from-gray-50 to-indigo-50">
                                    <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-gray-200">
                                        <div className="col-span-1">
                                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                                                #
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                                                Service Details
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                                                SAC Code
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                                                Fees
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                                                GST Details
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                                                Status
                                            </div>
                                        </div>
                                        <div className="col-span-1">
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
                                    ) : filteredServices.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                    <FiSettings className="w-12 h-12 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 text-lg font-medium mb-2">
                                                    {services.length === 0 ? 'No services available' : 'No matching services found'}
                                                </p>
                                                <p className="text-gray-400 text-sm mb-4">
                                                    {services.length === 0 
                                                        ? 'Get started by creating your first service' 
                                                        : 'Try adjusting your search or filter criteria'}
                                                </p>
                                                <motion.button
                                                    onClick={() => setShowCreateModal(true)}
                                                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Create Your First Service
                                                </motion.button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-5">
                                            {filteredServices.map((service, index) => {
                                                const isDropdownOpen = activeDropdown === service.service_id;

                                                return (
                                                    <motion.div
                                                        key={service.service_id}
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

                                                        {/* Service Details Column */}
                                                        <div className="col-span-3 flex flex-col items-center justify-center text-center">
                                                            <div className="mb-2">
                                                                <div className="text-gray-800 font-semibold text-sm mb-1">
                                                                    {service.name}
                                                                </div>
                                                                {service.has_ay === 1 && (
                                                                    <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-2 py-1 rounded-full border border-green-200">
                                                                        Has AY
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-gray-500 text-xs">
                                                                Created: {formatDate(service.created_date)}
                                                            </div>
                                                        </div>

                                                        {/* SAC Code Column */}
                                                        <div className="col-span-2 flex items-center justify-center">
                                                            <span className="inline-flex items-center justify-center bg-gray-100 text-gray-800 font-mono text-sm px-3 py-2 rounded-lg min-w-[100px]">
                                                                {service.sac_code}
                                                            </span>
                                                        </div>

                                                        {/* Fees Column */}
                                                        <div className="col-span-2 flex items-center justify-center">
                                                            <span className="inline-flex items-center justify-center bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-bold text-sm px-3 py-2 rounded-lg border border-green-100 min-w-[110px]">
                                                                <FiDollarSign className="w-3 h-3 mr-1" />
                                                                ₹{formatCurrency(service.fees)}
                                                            </span>
                                                        </div>

                                                        {/* GST Details Column */}
                                                        <div className="col-span-2 flex flex-col items-center justify-center">
                                                            <div className="mb-1">
                                                                <span className="inline-flex items-center justify-center bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 font-bold text-sm px-3 py-1.5 rounded-lg border border-orange-100 min-w-[100px]">
                                                                    ₹{formatCurrency(service.gst)}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                                {service.gst_rate}% Rate
                                                            </span>
                                                        </div>

                                                        {/* Status Column */}
                                                        <div className="col-span-1 flex items-center justify-center">
                                                            {service.status === 1 ? (
                                                                <span className="inline-flex items-center justify-center bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-semibold text-sm px-3 py-1.5 rounded-lg border border-green-200 min-w-[80px]">
                                                                    <FiCheckCircle className="w-3 h-3 mr-1" />
                                                                    Active
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center justify-center bg-gradient-to-r from-red-50 to-pink-50 text-red-700 font-semibold text-sm px-3 py-1.5 rounded-lg border border-red-200 min-w-[80px]">
                                                                    <FiXCircle className="w-3 h-3 mr-1" />
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Actions Column */}
                                                        <div className="col-span-1 flex items-center justify-center">
                                                            <div className="dropdown-container relative">
                                                                <motion.button
                                                                    className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 group-hover:bg-indigo-100/50"
                                                                    onClick={() => toggleDropdown(service.service_id)}
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
                                                                                <button
                                                                                    onClick={() => handleEditClick(service)}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"
                                                                                >
                                                                                    <FiEdit className="w-4 h-4 mr-3" />
                                                                                    Edit Service
                                                                                </button>
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
                                                Showing <span className="font-semibold">{filteredServices.length}</span> of{" "}
                                                <span className="font-semibold">{services.length}</span> services
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-sm">
                                                    <span className="text-gray-600">Active: </span>
                                                    <span className="font-semibold text-green-600">{summary.activeServices}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-600">Revenue: </span>
                                                    <span className="font-semibold text-gray-800">₹{formatCurrency(summary.totalRevenue)}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-600">GST: </span>
                                                    <span className="font-semibold text-orange-600">₹{formatCurrency(summary.totalGST)}</span>
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

            {/* Create Service Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h5 className="text-xl font-bold text-gray-800">Create New Service</h5>
                                    <p className="text-gray-600 text-sm mt-1">Add a new service to your catalog</p>
                                </div>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCreateSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Service Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.name}
                                            onChange={(e) => handleCreateChange('name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="e.g., GST Registration"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            SAC Code *
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.sac_code}
                                            onChange={(e) => handleCreateChange('sac_code', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="e.g., 998311"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Service Fees (₹) *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-500">₹</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={createForm.fees}
                                                onChange={(e) => handleCreateChange('fees', e.target.value)}
                                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            GST Rate (%) *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={createForm.gst_rate}
                                                onChange={(e) => handleCreateChange('gst_rate', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                                placeholder="18.00"
                                                required
                                            />
                                            <span className="absolute right-3 top-3 text-gray-500">%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            GST Amount (₹)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-500">₹</span>
                                            <input
                                                type="text"
                                                value={createForm.gst}
                                                readOnly
                                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 font-medium outline-none"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Calculated automatically based on fees and GST rate</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Assessment Year Applicable
                                        </label>
                                        <select
                                            value={createForm.has_ay}
                                            onChange={(e) => handleCreateChange('has_ay', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            required
                                        >
                                            <option value="1">Yes, applicable</option>
                                            <option value="0">No, not applicable</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
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
                                        Create Service
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Edit Service Modal */}
            {showEditModal && selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h5 className="text-xl font-bold text-gray-800">Edit Service</h5>
                                    <p className="text-gray-600 text-sm mt-1">Update service details for {selectedService.name}</p>
                                </div>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleEditSubmit}>
                                <input type="hidden" name="service_id" value={editForm.service_id} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Service Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => handleEditChange('name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            SAC Code *
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.sac_code}
                                            onChange={(e) => handleEditChange('sac_code', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Service Fees (₹) *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-500">₹</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editForm.fees}
                                                onChange={(e) => handleEditChange('fees', e.target.value)}
                                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            GST Rate (%) *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editForm.gst_rate}
                                                onChange={(e) => handleEditChange('gst_rate', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                                required
                                            />
                                            <span className="absolute right-3 top-3 text-gray-500">%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            GST Amount (₹)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-500">₹</span>
                                            <input
                                                type="text"
                                                value={editForm.gst}
                                                readOnly
                                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 font-medium outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Assessment Year
                                        </label>
                                        <select
                                            value={editForm.has_ay}
                                            onChange={(e) => handleEditChange('has_ay', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        >
                                            <option value="1">Applicable</option>
                                            <option value="0">Not Applicable</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="1"
                                                    checked={editForm.status === '1'}
                                                    onChange={(e) => handleEditChange('status', e.target.value)}
                                                    className="mr-2"
                                                />
                                                <span className="flex items-center">
                                                    <FiCheckCircle className="w-4 h-4 text-green-600 mr-1" />
                                                    Active
                                                </span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="0"
                                                    checked={editForm.status === '0'}
                                                    onChange={(e) => handleEditChange('status', e.target.value)}
                                                    className="mr-2"
                                                />
                                                <span className="flex items-center">
                                                    <FiXCircle className="w-4 h-4 text-red-600 mr-1" />
                                                    Inactive
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-5 py-2.5 text-gray-600 hover:text-gray-800 rounded-xl text-sm font-medium transition-colors border border-gray-300 hover:bg-gray-50"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-medium shadow-md"
                                        whileHover={{ scale: 1.02, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Update Service
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

export default Services;