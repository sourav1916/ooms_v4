import React, { useState, useEffect } from 'react';
import {
    FiPlus,
    FiEdit,
    FiTrash,
    FiCopy,
    FiSettings,
    FiMoreVertical,
    FiSearch,
    FiExternalLink,
    FiEye,
    FiEyeOff,
    FiGlobe,
    FiCalendar,
    FiFilter,
    FiBarChart2,
    FiKey,
    FiUser,
    FiLink
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, Sidebar } from '../../components/header';
import DateFilter from '../../components/DateFilter';

const ImportantLinks = () => {
    // Header/Sidebar states
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });

    // Main states
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState([]);
    const [filteredLinks, setFilteredLinks] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLink, setSelectedLink] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [showPassword, setShowPassword] = useState({});

    // Form states
    const [createForm, setCreateForm] = useState({
        name: '',
        username: '',
        password: '',
        link: '',
        remark: ''
    });

    const [editForm, setEditForm] = useState({
        link_id: '',
        name: '',
        username: '',
        password: '',
        link: '',
        remark: ''
    });

    // Mock Important Links data with dates
    const mockLinksData = [
        {
            link_id: 'link001',
            name: 'GST Portal',
            username: 'gstuser123',
            password: 'gstpass456',
            link: 'https://www.gst.gov.in',
            remark: 'Main GST portal for filing returns',
            created_date: '2024-01-15',
            updated_date: '2024-01-20',
            category: 'Government',
            visits: 42
        },
        {
            link_id: 'link002',
            name: 'Income Tax Portal',
            username: 'ituser789',
            password: 'itpass321',
            link: 'https://www.incometax.gov.in',
            remark: 'Income tax e-filing portal',
            created_date: '2024-01-10',
            updated_date: '2024-01-18',
            category: 'Government',
            visits: 28
        },
        {
            link_id: 'link003',
            name: 'Bank Portal',
            username: 'bankuser456',
            password: 'bankpass789',
            link: 'https://netbanking.examplebank.com',
            remark: 'Corporate banking portal',
            created_date: '2024-01-05',
            updated_date: '2024-01-12',
            category: 'Banking',
            visits: 156
        },
        {
            link_id: 'link004',
            name: 'Company Registration',
            username: '',
            password: '',
            link: 'https://www.mca.gov.in',
            remark: 'MCA portal for company registration',
            created_date: '2024-01-20',
            updated_date: '2024-01-25',
            category: 'Government',
            visits: 19
        },
        {
            link_id: 'link005',
            name: 'EPFO Portal',
            username: 'epfouser123',
            password: 'epfopass456',
            link: 'https://www.epfindia.gov.in',
            remark: 'Employee provident fund portal',
            created_date: '2024-01-18',
            updated_date: '2024-01-22',
            category: 'Government',
            visits: 31
        },
        {
            link_id: 'link006',
            name: 'RBI Portal',
            username: 'rbiuser789',
            password: 'rbipass123',
            link: 'https://www.rbi.org.in',
            remark: 'Reserve Bank of India portal',
            created_date: '2024-01-12',
            updated_date: '2024-01-19',
            category: 'Banking',
            visits: 23
        },
        {
            link_id: 'link007',
            name: 'SEBI Portal',
            username: 'sebiuser456',
            password: 'sebipass789',
            link: 'https://www.sebi.gov.in',
            remark: 'Securities and Exchange Board portal',
            created_date: '2024-01-08',
            updated_date: '2024-01-15',
            category: 'Financial',
            visits: 17
        },
        {
            link_id: 'link008',
            name: 'Customs Portal',
            username: 'customsuser123',
            password: 'customspass456',
            link: 'https://www.icegate.gov.in',
            remark: 'Indian Customs portal',
            created_date: '2024-01-25',
            updated_date: '2024-01-30',
            category: 'Government',
            visits: 14
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
        fetchLinksData();
    }, []);

    // Filter links when search term or date range changes
    useEffect(() => {
        filterLinks();
    }, [searchTerm, dateRange, links]);

    // Simulate API call to fetch links data
    const fetchLinksData = async () => {
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            setLinks(mockLinksData);
            setFilteredLinks(mockLinksData);
            setLoading(false);
        }, 1000);
    };

    // Filter links based on search term and date range
    const filterLinks = () => {
        let filtered = links;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(link =>
                link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                link.remark.toLowerCase().includes(searchTerm.toLowerCase()) ||
                link.link.toLowerCase().includes(searchTerm.toLowerCase()) ||
                link.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by date range
        if (dateRange) {
            const [from, to] = dateRange.split(' - ');
            const fromDate = new Date(from.split('/').reverse().join('-'));
            const toDate = new Date(to.split('/').reverse().join('-'));
            
            filtered = filtered.filter(link => {
                const linkDate = new Date(link.created_date);
                return linkDate >= fromDate && linkDate <= toDate;
            });
        }

        setFilteredLinks(filtered);
    };

    // Handle create form submit
    const handleCreateSubmit = (e) => {
        e.preventDefault();
        console.log('Create form data:', createForm);
        
        // Add new link to the list
        const newLink = {
            link_id: `link${String(links.length + 1).padStart(3, '0')}`,
            name: createForm.name,
            username: createForm.username,
            password: createForm.password,
            link: createForm.link,
            remark: createForm.remark,
            category: 'General',
            visits: 0,
            created_date: new Date().toISOString().split('T')[0],
            updated_date: new Date().toISOString().split('T')[0]
        };
        
        setLinks(prev => [newLink, ...prev]);
        
        // Close modal and reset form
        setShowCreateModal(false);
        setCreateForm({
            name: '',
            username: '',
            password: '',
            link: '',
            remark: ''
        });
    };

    // Handle edit form submit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        console.log('Edit form data:', editForm);
        
        // Update link in the list
        setLinks(prev => prev.map(link =>
            link.link_id === editForm.link_id
                ? { 
                    ...link, 
                    name: editForm.name,
                    username: editForm.username,
                    password: editForm.password,
                    link: editForm.link,
                    remark: editForm.remark,
                    updated_date: new Date().toISOString().split('T')[0]
                }
                : link
        ));
        
        // Close modal
        setShowEditModal(false);
    };

    // Handle edit button click
    const handleEditClick = (link) => {
        setSelectedLink(link);
        setEditForm({
            link_id: link.link_id,
            name: link.name,
            username: link.username,
            password: link.password,
            link: link.link,
            remark: link.remark
        });
        setShowEditModal(true);
        setActiveDropdown(null);
    };

    // Handle delete link
    const handleDeleteLink = (link) => {
        if (window.confirm('Are you sure? You won\'t be able to revert this!')) {
            console.log('Deleting link:', link.link_id);
            
            // Remove link from the list
            setLinks(prev => prev.filter(item => item.link_id !== link.link_id));
        }
        setActiveDropdown(null);
    };

    // Handle copy link
    const handleCopyLink = (link) => {
        navigator.clipboard.writeText(link.link).then(() => {
            // Show toast notification (you can implement a proper toast system)
            alert('Link copied to clipboard: ' + link.link);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    // Toggle password visibility
    const togglePasswordVisibility = (linkId) => {
        setShowPassword(prev => ({
            ...prev,
            [linkId]: !prev[linkId]
        }));
    };

    // Toggle dropdown
    const toggleDropdown = (linkId) => {
        setActiveDropdown(activeDropdown === linkId ? null : linkId);
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
        filterLinks();
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Calculate summary
    const summary = {
        totalLinks: filteredLinks.length,
        linksWithCredentials: filteredLinks.filter(link => link.username || link.password).length,
        totalCredentials: filteredLinks.filter(link => link.username && link.password).length,
        totalVisits: filteredLinks.reduce((sum, link) => sum + link.visits, 0)
    };

    // Get category color
    const getCategoryColor = (category) => {
        const colors = {
            'Government': 'bg-blue-100 text-blue-800',
            'Banking': 'bg-green-100 text-green-800',
            'Financial': 'bg-purple-100 text-purple-800',
            'General': 'bg-gray-100 text-gray-800'
        };
        return colors[category] || colors['General'];
    };

    // Skeleton Loading Component
    const SkeletonLoader = () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
                        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 mb-2"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-64"></div>
                    </div>

                    {/* Stats Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl shadow-sm"></div>
                        ))}
                    </div>

                    {/* Controls Skeleton */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                        </div>
                        <div className="w-48">
                            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                        </div>
                        <div className="w-32">
                            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                        </div>
                    </div>

                    {/* Table Skeleton */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse overflow-hidden">
                        <div className="border-b border-gray-200">
                            <div className="h-14 bg-gradient-to-r from-gray-100 to-gray-200"></div>
                        </div>
                        <div className="p-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg mb-3"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Professional Modal Wrapper Component
    const ModalWrapper = ({ isOpen, onClose, title, children, size = 'max-w-2xl' }) => {
        if (!isOpen) return null;

        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 overflow-y-auto"
                >
                    <div className="flex items-center justify-center min-h-screen p-4">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm"
                            onClick={onClose}
                        />
                        
                        {/* Professional Modal panel */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25 }}
                            className={`relative w-full ${size} bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden`}
                        >
                            {/* Professional Header */}
                            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <FiLink className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{title}</h2>
                                        <p className="text-indigo-200 text-sm opacity-90">Manage your important links</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            {children}
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    };

    // Show skeleton while loading
    if (loading && links.length === 0) {
        return <SkeletonLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
                    {/* Header with Gradient */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Important Links
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Secure management of all your important links and credentials
                                </p>
                            </div>

                            <motion.button
                                onClick={() => setShowCreateModal(true)}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FiPlus className="w-4 h-4" />
                                Add New Link
                            </motion.button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Total Links</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{summary.totalLinks}</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <FiGlobe className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">With Credentials</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{summary.linksWithCredentials}</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <FiKey className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Complete Sets</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{summary.totalCredentials}</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <FiUser className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Total Visits</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{summary.totalVisits}</p>
                                    </div>
                                    <div className="p-3 bg-indigo-50 rounded-lg">
                                        <FiBarChart2 className="w-6 h-6 text-indigo-600" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Search and Filter Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm"
                    >
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="Search by name, category, or remark..."
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all duration-300"
                                    />
                                    <FiSearch className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    <button
                                        onClick={handleSearch}
                                        className="absolute right-3 top-2.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                            <div className="w-full lg:w-auto">
                                <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-xl">
                                    <FiFilter className="w-4 h-4 text-gray-500 ml-2" />
                                    <DateFilter onChange={handleDateFilterChange} />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
                    >
                        {/* Table Header */}
                        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                            <div className="grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-gray-700">
                                <div className="col-span-1">#</div>
                                <div className="col-span-3">Link Details</div>
                                <div className="col-span-2">Credentials</div>
                                <div className="col-span-2">Category & Visits</div>
                                <div className="col-span-3">Remarks</div>
                                <div className="col-span-1 text-center">Actions</div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 8 }).map((_, index) => (
                                    <div key={index} className="p-4 animate-pulse">
                                        <div className="h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"></div>
                                    </div>
                                ))
                            ) : filteredLinks.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-4">
                                        <FiLink className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">No links found</h3>
                                    <p className="text-gray-500 mb-6">
                                        {links.length === 0 ? 'Get started by adding your first important link' : 'Try adjusting your search or filter'}
                                    </p>
                                    <motion.button
                                        onClick={() => setShowCreateModal(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiPlus className="w-4 h-4 inline mr-2" />
                                        Add New Link
                                    </motion.button>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {filteredLinks.map((link, index) => (
                                        <motion.div
                                            key={link.link_id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="p-4 hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <div className="grid grid-cols-12 gap-4 items-center">
                                                {/* Index */}
                                                <div className="col-span-1">
                                                    <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 font-semibold rounded-lg">
                                                        {index + 1}
                                                    </div>
                                                </div>

                                                {/* Link Details */}
                                                <div className="col-span-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                                            <FiGlobe className="w-5 h-5 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-800">{link.name}</h4>
                                                            <p className="text-gray-500 text-sm mt-1 truncate max-w-xs">
                                                                {link.link.replace(/^https?:\/\//, '')}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className="text-xs text-gray-500">
                                                                    <FiCalendar className="w-3 h-3 inline mr-1" />
                                                                    {formatDate(link.created_date)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Credentials */}
                                                <div className="col-span-2">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <FiUser className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm font-medium text-gray-700 truncate">
                                                                {link.username || 'No username'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FiKey className="w-4 h-4 text-gray-400" />
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    {showPassword[link.link_id] 
                                                                        ? link.password || 'No password'
                                                                        : '••••••••'
                                                                    }
                                                                </span>
                                                                {link.password && (
                                                                    <button
                                                                        onClick={() => togglePasswordVisibility(link.link_id)}
                                                                        className="text-gray-400 hover:text-gray-600"
                                                                    >
                                                                        {showPassword[link.link_id] ? (
                                                                            <FiEyeOff className="w-3 h-3" />
                                                                        ) : (
                                                                            <FiEye className="w-3 h-3" />
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Category & Visits */}
                                                <div className="col-span-2">
                                                    <div className="space-y-2">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(link.category)}`}>
                                                            {link.category}
                                                        </span>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <FiBarChart2 className="w-3 h-3" />
                                                            <span>{link.visits} visits</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Remarks */}
                                                <div className="col-span-3">
                                                    <p className="text-gray-600 text-sm line-clamp-2">{link.remark}</p>
                                                </div>

                                                {/* Actions */}
                                                <div className="col-span-1">
                                                    <div className="dropdown-container relative flex justify-center">
                                                        <div className="flex items-center gap-2">
                                                            <motion.button
                                                                onClick={() => handleCopyLink(link)}
                                                                className="p-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors duration-200"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                title="Copy Link"
                                                            >
                                                                <FiCopy className="w-4 h-4" />
                                                            </motion.button>
                                                            <motion.button
                                                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                                onClick={() => toggleDropdown(link.link_id)}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <FiMoreVertical className="w-4 h-4" />
                                                            </motion.button>
                                                        </div>
                                                        {activeDropdown === link.link_id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
                                                            >
                                                                <div className="py-1">
                                                                    <button
                                                                        onClick={() => handleEditClick(link)}
                                                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-200"
                                                                    >
                                                                        <FiEdit className="w-4 h-4 mr-3 text-indigo-600" />
                                                                        Edit Link
                                                                    </button>
                                                                    <button
                                                                        onClick={() => window.open(link.link, '_blank')}
                                                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-200"
                                                                    >
                                                                        <FiExternalLink className="w-4 h-4 mr-3 text-blue-600" />
                                                                        Open Link
                                                                    </button>
                                                                    <div className="border-t border-gray-100">
                                                                        <button
                                                                            onClick={() => handleDeleteLink(link)}
                                                                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                                                        >
                                                                            <FiTrash className="w-4 h-4 mr-3" />
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer */}
                        {filteredLinks.length > 0 && (
                            <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-4">
                                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-gray-600">
                                        Showing <span className="font-semibold">{filteredLinks.length}</span> of <span className="font-semibold">{links.length}</span> links
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold text-indigo-600">{summary.linksWithCredentials}</span> with credentials
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold text-green-600">{summary.totalCredentials}</span> complete sets
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Create Modal */}
            <ModalWrapper
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setCreateForm({
                        name: '',
                        username: '',
                        password: '',
                        link: '',
                        remark: ''
                    });
                }}
                title="Create New Link"
                size="max-w-2xl"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleCreateSubmit}>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Link Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.name}
                                        onChange={(e) => handleCreateChange('name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        placeholder="e.g., GST Portal"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all">
                                        <option>Government</option>
                                        <option>Banking</option>
                                        <option>Financial</option>
                                        <option>General</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.username}
                                        onChange={(e) => handleCreateChange('username', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        placeholder="Enter username"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={createForm.password}
                                            onChange={(e) => handleCreateChange('password', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                            onClick={() => {}}
                                        >
                                            <FiEye className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    value={createForm.link}
                                    onChange={(e) => handleCreateChange('link', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="https://example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Remarks
                                </label>
                                <textarea
                                    value={createForm.remark}
                                    onChange={(e) => handleCreateChange('remark', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="Add any notes or description..."
                                    rows="3"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-6">
                    <div className="flex justify-end gap-3">
                        <motion.button
                            type="button"
                            onClick={() => {
                                setShowCreateModal(false);
                                setCreateForm({
                                    name: '',
                                    username: '',
                                    password: '',
                                    link: '',
                                    remark: ''
                                });
                            }}
                            className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            onClick={handleCreateSubmit}
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-medium shadow-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Create Link
                        </motion.button>
                    </div>
                </div>
            </ModalWrapper>

            {/* Edit Modal */}
            <ModalWrapper
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedLink(null);
                }}
                title="Edit Link"
                size="max-w-2xl"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleEditSubmit}>
                        <input type="hidden" name="link_id" value={editForm.link_id} />
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Link Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => handleEditChange('name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        placeholder="Enter link name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all">
                                        <option>Government</option>
                                        <option>Banking</option>
                                        <option>Financial</option>
                                        <option>General</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.username}
                                        onChange={(e) => handleEditChange('username', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        placeholder="Enter username"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={editForm.password}
                                            onChange={(e) => handleEditChange('password', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                            placeholder="Enter password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                        >
                                            <FiEye className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    value={editForm.link}
                                    onChange={(e) => handleEditChange('link', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="https://example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Remarks
                                </label>
                                <textarea
                                    value={editForm.remark}
                                    onChange={(e) => handleEditChange('remark', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="Enter remark"
                                    rows="3"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-6">
                    <div className="flex justify-end gap-3">
                        <motion.button
                            type="button"
                            onClick={() => {
                                setShowEditModal(false);
                                setSelectedLink(null);
                            }}
                            className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            onClick={handleEditSubmit}
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-medium shadow-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Update Link
                        </motion.button>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    );
};

export default ImportantLinks;