import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiSettings, FiMoreVertical, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
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

    // Handle search
    const handleSearch = () => {
        filterServices();
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
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
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
                                            Services
                                        </h5>
                                        <p className="text-gray-500 text-xs mt-1">
                                            Manage your services and pricing
                                        </p>
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                        {/* Search Box */}
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Search services..."
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
                                            Add Service
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
                                                <th className="text-left p-4 font-semibold text-gray-700">Service Name</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">SAC Code</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Fees</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">GST</th>
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
                                            ) : filteredServices.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-8 text-gray-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FiSettings className="w-12 h-12 text-gray-300 mb-3" />
                                                            <p className="text-gray-500">
                                                                {services.length === 0 ? 'No services found' : 'No services match your search criteria'}
                                                            </p>
                                                            <button
                                                                onClick={() => setShowCreateModal(true)}
                                                                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                                            >
                                                                Create Your First Service
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredServices.map((service, index) => {
                                                    const isDropdownOpen = activeDropdown === service.service_id;

                                                    return (
                                                        <tr
                                                            key={service.service_id}
                                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                                                        >
                                                            <td className="p-4 text-gray-600 font-medium">
                                                                {index + 1}
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-gray-800 font-medium">
                                                                    {service.name}
                                                                    {service.has_ay === 1 && (
                                                                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                                            Assessment Year
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-gray-500 text-xs mt-1">
                                                                    Created: {formatDate(service.created_date)}
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-gray-600 font-mono">
                                                                {service.sac_code}
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="inline-flex items-center justify-center bg-green-50 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-lg min-w-[80px]">
                                                                    ₹{formatCurrency(service.fees)}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-gray-600">
                                                                    <div className="font-medium">₹{formatCurrency(service.gst)}</div>
                                                                    <div className="text-xs text-gray-500">({service.gst_rate}%)</div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                {service.status === 1 ? (
                                                                    <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-sm font-semibold px-3 py-1.5 rounded-lg">
                                                                        Active
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center justify-center bg-red-100 text-red-800 text-sm font-semibold px-3 py-1.5 rounded-lg">
                                                                        Inactive
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="dropdown-container relative flex justify-center">
                                                                    <button
                                                                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group-hover:bg-gray-200"
                                                                        onClick={() => toggleDropdown(service.service_id)}
                                                                    >
                                                                        <FiMoreVertical className="w-4 h-4" />
                                                                    </button>
                                                                    {isDropdownOpen && (
                                                                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                                                                            <div className="py-1">
                                                                                <button
                                                                                    onClick={() => handleEditClick(service)}
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
                                                        {summary.totalServices} Services
                                                    </span>
                                                </td>
                                                <td className="text-left p-4">
                                                    <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                        ₹{formatCurrency(summary.totalRevenue)}
                                                    </span>
                                                </td>
                                                <td className="text-left p-4">
                                                    <span className="inline-flex items-center justify-center bg-orange-100 text-orange-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                        ₹{formatCurrency(summary.totalGST)}
                                                    </span>
                                                </td>
                                                <td className="text-left p-4">
                                                    <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                        {summary.activeServices} Active
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

            {/* Create Service Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h5 className="text-lg font-semibold text-gray-800">Create Service</h5>
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
                                            Service Name
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.name}
                                            onChange={(e) => handleCreateChange('name', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter service name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SAC Code
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.sac_code}
                                            onChange={(e) => handleCreateChange('sac_code', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter SAC code"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fees
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.fees}
                                            onChange={(e) => handleCreateChange('fees', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter service fees"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            GST Rate (%)
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.gst_rate}
                                            onChange={(e) => handleCreateChange('gst_rate', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter GST rate"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            GST Amount
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.gst}
                                            readOnly
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Assessment Applicable
                                        </label>
                                        <select
                                            value={createForm.has_ay}
                                            onChange={(e) => handleCreateChange('has_ay', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            required
                                        >
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
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
                                        Create Service
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Service Modal */}
            {showEditModal && selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h5 className="text-lg font-semibold text-gray-800">Edit Service</h5>
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
                                <input type="hidden" name="service_id" value={editForm.service_id} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Service Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => handleEditChange('name', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter service name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SAC Code
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.sac_code}
                                            onChange={(e) => handleEditChange('sac_code', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter SAC code"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fees
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.fees}
                                            onChange={(e) => handleEditChange('fees', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter service fees"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            GST Rate (%)
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.gst_rate}
                                            onChange={(e) => handleEditChange('gst_rate', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter GST rate"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            GST Amount
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.gst}
                                            readOnly
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Assessment Applicable
                                        </label>
                                        <select
                                            value={editForm.has_ay}
                                            onChange={(e) => handleEditChange('has_ay', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            required
                                        >
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
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
                                        Update Service
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

export default Services;