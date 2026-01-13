import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiCheck, FiX, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Header, Sidebar } from '../../components/header';
import DateFilter from '../../components/DateFilter';

const CAList = () => {
    // Header/Sidebar states
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });

    // Main states
    const [loading, setLoading] = useState(false);
    const [caList, setCaList] = useState([]);
    const [filteredCaList, setFilteredCaList] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCA, setSelectedCA] = useState(null);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [genders, setGenders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('');

    // Form states
    const [createForm, setCreateForm] = useState({
        name: '',
        guardian_name: '',
        mobile: '',
        email: '',
        dob: '',
        gender: '',
        state: '',
        dist: '',
        town: '',
        pincode: '',
        address_line_1: '',
        address_line_2: ''
    });

    const [editForm, setEditForm] = useState({
        username: '',
        name: '',
        guardian_name: '',
        mobile: '',
        email: '',
        dob: '',
        gender: '',
        state: '',
        dist: '',
        town: '',
        pincode: '',
        address_line_1: '',
        address_line_2: ''
    });

    // Mock CA data with dates
    const mockCAData = [
        {
            username: 'ca001',
            name: 'Rajesh Kumar',
            guardian_name: 'Suresh Kumar',
            mobile: '+91 9876543210',
            email: 'rajesh.kumar@ca.com',
            balance: 25000.50,
            loan: 5000.00,
            designation: 'Chartered Accountant',
            status: 1,
            created_date: '2024-01-15',
            updated_date: '2024-01-20'
        },
        {
            username: 'ca002',
            name: 'Priya Sharma',
            guardian_name: 'Ramesh Sharma',
            mobile: '+91 9876543211',
            email: 'priya.sharma@ca.com',
            balance: -1500.00,
            loan: 10000.00,
            designation: 'Tax Consultant',
            status: 1,
            created_date: '2024-01-10',
            updated_date: '2024-01-18'
        },
        {
            username: 'ca003',
            name: 'Amit Patel',
            guardian_name: 'Dinesh Patel',
            mobile: '+91 9876543212',
            email: 'amit.patel@ca.com',
            balance: 50000.75,
            loan: 0.00,
            designation: 'Audit Manager',
            status: 0,
            created_date: '2024-01-05',
            updated_date: '2024-01-12'
        },
        {
            username: 'ca004',
            name: 'Sneha Gupta',
            guardian_name: 'Anil Gupta',
            mobile: '+91 9876543213',
            email: 'sneha.gupta@ca.com',
            balance: 12000.00,
            loan: 2000.00,
            designation: 'GST Practitioner',
            status: 1,
            created_date: '2024-01-20',
            updated_date: '2024-01-25'
        },
        {
            username: 'ca005',
            name: 'Vikram Singh',
            guardian_name: 'Rajendra Singh',
            mobile: '+91 9876543214',
            email: 'vikram.singh@ca.com',
            balance: -5000.25,
            loan: 15000.00,
            designation: 'Financial Advisor',
            status: 1,
            created_date: '2024-01-18',
            updated_date: '2024-01-22'
        },
        {
            username: 'ca006',
            name: 'Anjali Mehta',
            guardian_name: 'Sanjay Mehta',
            mobile: '+91 9876543215',
            email: 'anjali.mehta@ca.com',
            balance: 35000.00,
            loan: 0.00,
            designation: 'Company Secretary',
            status: 1,
            created_date: '2024-01-12',
            updated_date: '2024-01-19'
        },
        {
            username: 'ca007',
            name: 'Rahul Verma',
            guardian_name: 'Amit Verma',
            mobile: '+91 9876543216',
            email: 'rahul.verma@ca.com',
            balance: 8000.00,
            loan: 3000.00,
            designation: 'Cost Accountant',
            status: 1,
            created_date: '2024-01-08',
            updated_date: '2024-01-15'
        },
        {
            username: 'ca008',
            name: 'Neha Reddy',
            guardian_name: 'Kumar Reddy',
            mobile: '+91 9876543217',
            email: 'neha.reddy@ca.com',
            balance: -7500.50,
            loan: 12000.00,
            designation: 'Tax Auditor',
            status: 0,
            created_date: '2024-01-25',
            updated_date: '2024-01-30'
        }
    ];

    // Mock states and districts data
    const mockStatesData = {
        states: [
            {
                state: "Delhi",
                districts: ["New Delhi", "Central Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"]
            },
            {
                state: "Maharashtra",
                districts: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad"]
            },
            {
                state: "Karnataka",
                districts: ["Bangalore", "Mysore", "Hubli", "Belgaum", "Mangalore", "Gulbarga"]
            },
            {
                state: "Tamil Nadu",
                districts: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode"]
            },
            {
                state: "Uttar Pradesh",
                districts: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Allahabad"]
            }
        ]
    };

    // Mock gender data
    const mockGenders = [
        { value: 'male', name: 'Male' },
        { value: 'female', name: 'Female' },
        { value: 'other', name: 'Other' }
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
        fetchCAData();
        loadStatesAndGenders();
    }, []);

    // Filter CA list when search term or date range changes
    useEffect(() => {
        filterCAList();
    }, [searchTerm, dateRange, caList]);

    // Load states and genders
    const loadStatesAndGenders = () => {
        setStates(mockStatesData.states);
        setGenders(mockGenders);
        
        // Set default state and load its districts
        if (mockStatesData.states.length > 0) {
            const defaultState = mockStatesData.states[0].state;
            setCreateForm(prev => ({ ...prev, state: defaultState }));
            setEditForm(prev => ({ ...prev, state: defaultState }));
            loadDistricts(defaultState);
        }
    };

    // Load districts for selected state
    const loadDistricts = (stateName) => {
        const state = mockStatesData.states.find(s => s.state === stateName);
        if (state) {
            setDistricts(state.districts);
            
            // Set default district
            if (state.districts.length > 0) {
                setCreateForm(prev => ({ ...prev, dist: state.districts[0] }));
                setEditForm(prev => ({ ...prev, dist: state.districts[0] }));
            }
        }
    };

    // Simulate API call to fetch CA data
    const fetchCAData = async () => {
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            setCaList(mockCAData);
            setFilteredCaList(mockCAData);
            setLoading(false);
        }, 1000);
    };

    // Filter CA list based on search term and date range
    const filterCAList = () => {
        let filtered = caList;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(ca =>
                ca.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ca.mobile.includes(searchTerm) ||
                ca.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ca.designation.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by date range
        if (dateRange) {
            const [from, to] = dateRange.split(' - ');
            const fromDate = new Date(from.split('/').reverse().join('-'));
            const toDate = new Date(to.split('/').reverse().join('-'));
            
            filtered = filtered.filter(ca => {
                const caDate = new Date(ca.created_date);
                return caDate >= fromDate && caDate <= toDate;
            });
        }

        setFilteredCaList(filtered);
    };

    // Handle create form submit
    const handleCreateSubmit = (e) => {
        e.preventDefault();
        console.log('Create form data:', createForm);
        
        // Add new CA to the list
        const newCA = {
            username: `ca${String(caList.length + 1).padStart(3, '0')}`,
            name: createForm.name,
            guardian_name: createForm.guardian_name,
            mobile: createForm.mobile,
            email: createForm.email,
            balance: 0.00,
            loan: 0.00,
            designation: 'Chartered Accountant',
            status: 1,
            created_date: new Date().toISOString().split('T')[0],
            updated_date: new Date().toISOString().split('T')[0]
        };
        
        setCaList(prev => [newCA, ...prev]);
        
        // Close modal and reset form
        setShowCreateModal(false);
        resetCreateForm();
    };

    // Handle edit form submit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        console.log('Edit form data:', editForm);
        
        // Update CA in the list
        setCaList(prev => prev.map(ca =>
            ca.username === editForm.username
                ? { 
                    ...ca, 
                    name: editForm.name,
                    guardian_name: editForm.guardian_name,
                    mobile: editForm.mobile,
                    email: editForm.email,
                    updated_date: new Date().toISOString().split('T')[0]
                }
                : ca
        ));
        
        // Close modal
        setShowEditModal(false);
    };

    // Handle edit button click
    const handleEditClick = (ca) => {
        setSelectedCA(ca);
        setEditForm({
            username: ca.username,
            name: ca.name,
            guardian_name: ca.guardian_name,
            mobile: ca.mobile,
            email: ca.email,
            dob: '',
            gender: 'male',
            state: states[0]?.state || '',
            dist: districts[0] || '',
            town: '',
            pincode: '',
            address_line_1: '',
            address_line_2: ''
        });
        setShowEditModal(true);
    };

    // Handle status change
    const handleStatusChange = (ca) => {
        console.log('Changing status for CA:', ca.username);
        
        // Update status in the list
        setCaList(prev => prev.map(c =>
            c.username === ca.username
                ? { ...c, status: c.status === 1 ? 0 : 1, updated_date: new Date().toISOString().split('T')[0] }
                : c
        ));
    };

    // Handle form changes
    const handleCreateChange = (field, value) => {
        const newForm = { ...createForm, [field]: value };
        
        if (field === 'state') {
            loadDistricts(value);
            newForm.dist = districts[0] || '';
        }
        
        setCreateForm(newForm);
    };

    const handleEditChange = (field, value) => {
        const newForm = { ...editForm, [field]: value };
        
        if (field === 'state') {
            loadDistricts(value);
            newForm.dist = districts[0] || '';
        }
        
        setEditForm(newForm);
    };

    // Reset create form
    const resetCreateForm = () => {
        setCreateForm({
            name: '',
            guardian_name: '',
            mobile: '',
            email: '',
            dob: '',
            gender: 'male',
            state: states[0]?.state || '',
            dist: districts[0] || '',
            town: '',
            pincode: '',
            address_line_1: '',
            address_line_2: ''
        });
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
        filterCAList();
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Calculate summary
    const summary = {
        totalCA: filteredCaList.length,
        activeCA: filteredCaList.filter(ca => ca.status === 1).length,
        totalBalance: filteredCaList.reduce((sum, ca) => sum + ca.balance, 0),
        totalLoan: filteredCaList.reduce((sum, ca) => sum + ca.loan, 0)
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
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-gray-200 rounded w-12"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-gray-200 rounded w-8 mx-auto"></div>
            </td>
        </tr>
    );

    // Show skeleton while loading
    if (loading && caList.length === 0) {
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
                                        Chartered Accountants
                                    </h5>
                                    <p className="text-gray-500 text-xs mt-1">
                                        Manage CA profiles and information
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
                                            placeholder="Search CAs..."
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
                                        Add CA
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
                                            <th className="text-left p-4 font-semibold text-gray-700">Name</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Mobile</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Balance</th>
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
                                        ) : filteredCaList.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-8 text-gray-500">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <FiEdit className="w-12 h-12 text-gray-300 mb-3" />
                                                        <p className="text-gray-500">
                                                            {caList.length === 0 ? 'No CA records found' : 'No CAs match your search criteria'}
                                                        </p>
                                                        <motion.button
                                                            onClick={() => setShowCreateModal(true)}
                                                            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Add Your First CA
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredCaList.map((ca, index) => (
                                                <tr
                                                    key={ca.username}
                                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                                                >
                                                    <td className="p-4 text-gray-600 font-medium">
                                                        {index + 1}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-gray-800 font-medium">
                                                            <a
                                                                href={`/view-ca-profile?username=${ca.username}`}
                                                                className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                                            >
                                                                {ca.name}
                                                            </a>
                                                        </div>
                                                        <div className="text-gray-500 text-sm mt-1">
                                                            {ca.designation}
                                                        </div>
                                                        <div className="text-gray-500 text-xs mt-1">
                                                            Created: {formatDate(ca.created_date)}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-gray-600">
                                                        {ca.mobile}
                                                    </td>
                                                    <td className="p-4 text-gray-600">
                                                        {ca.email}
                                                    </td>
                                                    <td className="p-4">
                                                        <a
                                                            href={`/view-ca-profile-ledger?username=${ca.username}`}
                                                            className={`inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded-lg min-w-[80px] ${
                                                                ca.balance < 0 
                                                                    ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            } transition-colors`}
                                                        >
                                                            ₹{formatCurrency(Math.abs(ca.balance))}
                                                        </a>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <label className="relative inline-flex items-center cursor-pointer justify-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={ca.status === 1}
                                                                onChange={() => handleStatusChange(ca)}
                                                                className="sr-only peer"
                                                            />
                                                            <div className={`w-12 h-6 rounded-full peer ${ca.status === 1 ? 'bg-indigo-600' : 'bg-gray-300'} peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:border after:border-gray-300`}>
                                                                {ca.status === 1 ? (
                                                                    <FiCheck className="absolute left-1 top-0.5 w-3 h-3 text-white z-10" />
                                                                ) : (
                                                                    <FiX className="absolute right-1 top-0.5 w-3 h-3 text-gray-500 z-10" />
                                                                )}
                                                            </div>
                                                        </label>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex justify-center">
                                                            <motion.button
                                                                onClick={() => handleEditClick(ca)}
                                                                className="p-2 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer group-hover:bg-indigo-100"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <FiEdit className="w-4 h-4" />
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
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
                                                    {summary.totalCA} CAs
                                                </span>
                                            </td>
                                            <td className="text-left p-4">
                                                <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                    {summary.activeCA} Active
                                                </span>
                                            </td>
                                            <td className="text-left p-4">
                                                <span className="inline-flex items-center justify-center bg-purple-100 text-purple-800 text-sm font-bold px-3 py-1.5 rounded-lg min-w-[80px]">
                                                    ₹{formatCurrency(summary.totalBalance)}
                                                </span>
                                            </td>
                                            <td className="text-center p-4">
                                                <span className="inline-flex items-center justify-center bg-orange-100 text-orange-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                    ₹{formatCurrency(summary.totalLoan)} Loan
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

            {/* Create CA Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto"
                    >
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h5 className="text-lg font-semibold text-gray-800">Create CA</h5>
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
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.name}
                                            onChange={(e) => handleCreateChange('name', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter Name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Guardian's Name
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.guardian_name}
                                            onChange={(e) => handleCreateChange('guardian_name', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter Father's Name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={createForm.mobile}
                                            onChange={(e) => handleCreateChange('mobile', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter Mobile Number"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            value={createForm.dob}
                                            onChange={(e) => handleCreateChange('dob', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gender
                                        </label>
                                        <select
                                            value={createForm.gender}
                                            onChange={(e) => handleCreateChange('gender', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        >
                                            {genders.map(gender => (
                                                <option key={gender.value} value={gender.value}>
                                                    {gender.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={createForm.email}
                                            onChange={(e) => handleCreateChange('email', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="example@gmail.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State
                                        </label>
                                        <select
                                            value={createForm.state}
                                            onChange={(e) => handleCreateChange('state', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        >
                                            {states.map(state => (
                                                <option key={state.state} value={state.state}>
                                                    {state.state}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            District
                                        </label>
                                        <select
                                            value={createForm.dist}
                                            onChange={(e) => handleCreateChange('dist', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        >
                                            {districts.map(district => (
                                                <option key={district} value={district}>
                                                    {district}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Village/Town
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.town}
                                            onChange={(e) => handleCreateChange('town', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Village/Town"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pin Code
                                        </label>
                                        <input
                                            type="tel"
                                            value={createForm.pincode}
                                            onChange={(e) => handleCreateChange('pincode', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Pin code"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address Line 1
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.address_line_1}
                                            onChange={(e) => handleCreateChange('address_line_1', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Address Line 1"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address Line 2
                                        </label>
                                        <input
                                            type="text"
                                            value={createForm.address_line_2}
                                            onChange={(e) => handleCreateChange('address_line_2', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Address Line 2"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2.5 text-gray-600 hover:text-gray-800 rounded-lg text-sm font-medium transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Create CA
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Edit CA Modal */}
            {showEditModal && selectedCA && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto"
                    >
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h5 className="text-lg font-semibold text-gray-800">Update CA</h5>
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
                                <input type="hidden" name="username" value={editForm.username} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => handleEditChange('name', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter Name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Guardian's Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.guardian_name}
                                            onChange={(e) => handleEditChange('guardian_name', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter Father's Name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={editForm.mobile}
                                            onChange={(e) => handleEditChange('mobile', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter Mobile Number"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            value={editForm.dob}
                                            onChange={(e) => handleEditChange('dob', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gender
                                        </label>
                                        <select
                                            value={editForm.gender}
                                            onChange={(e) => handleEditChange('gender', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        >
                                            {genders.map(gender => (
                                                <option key={gender.value} value={gender.value}>
                                                    {gender.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => handleEditChange('email', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="example@gmail.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State
                                        </label>
                                        <select
                                            value={editForm.state}
                                            onChange={(e) => handleEditChange('state', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        >
                                            {states.map(state => (
                                                <option key={state.state} value={state.state}>
                                                    {state.state}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            District
                                        </label>
                                        <select
                                            value={editForm.dist}
                                            onChange={(e) => handleEditChange('dist', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        >
                                            {districts.map(district => (
                                                <option key={district} value={district}>
                                                    {district}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Village/Town
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.town}
                                            onChange={(e) => handleEditChange('town', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Village/Town"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pin Code
                                        </label>
                                        <input
                                            type="tel"
                                            value={editForm.pincode}
                                            onChange={(e) => handleEditChange('pincode', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Pin code"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address Line 1
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.address_line_1}
                                            onChange={(e) => handleEditChange('address_line_1', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Address Line 1"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address Line 2
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.address_line_2}
                                            onChange={(e) => handleEditChange('address_line_2', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Address Line 2"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2.5 text-gray-600 hover:text-gray-800 rounded-lg text-sm font-medium transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Update CA
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

export default CAList;