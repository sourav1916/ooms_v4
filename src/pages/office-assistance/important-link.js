import React, { useState, useEffect } from 'react';
import {
    FiPlus,
    FiEdit,
    FiTrash,
    FiCopy,
    FiSettings,
    FiMoreVertical,
    FiSearch
} from 'react-icons/fi';
import { motion } from 'framer-motion';
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
            updated_date: '2024-01-20'
        },
        {
            link_id: 'link002',
            name: 'Income Tax Portal',
            username: 'ituser789',
            password: 'itpass321',
            link: 'https://www.incometax.gov.in',
            remark: 'Income tax e-filing portal',
            created_date: '2024-01-10',
            updated_date: '2024-01-18'
        },
        {
            link_id: 'link003',
            name: 'Bank Portal',
            username: 'bankuser456',
            password: 'bankpass789',
            link: 'https://netbanking.examplebank.com',
            remark: 'Corporate banking portal',
            created_date: '2024-01-05',
            updated_date: '2024-01-12'
        },
        {
            link_id: 'link004',
            name: 'Company Registration',
            username: '',
            password: '',
            link: 'https://www.mca.gov.in',
            remark: 'MCA portal for company registration',
            created_date: '2024-01-20',
            updated_date: '2024-01-25'
        },
        {
            link_id: 'link005',
            name: 'EPFO Portal',
            username: 'epfouser123',
            password: 'epfopass456',
            link: 'https://www.epfindia.gov.in',
            remark: 'Employee provident fund portal',
            created_date: '2024-01-18',
            updated_date: '2024-01-22'
        },
        {
            link_id: 'link006',
            name: 'RBI Portal',
            username: 'rbiuser789',
            password: 'rbipass123',
            link: 'https://www.rbi.org.in',
            remark: 'Reserve Bank of India portal',
            created_date: '2024-01-12',
            updated_date: '2024-01-19'
        },
        {
            link_id: 'link007',
            name: 'SEBI Portal',
            username: 'sebiuser456',
            password: 'sebipass789',
            link: 'https://www.sebi.gov.in',
            remark: 'Securities and Exchange Board portal',
            created_date: '2024-01-08',
            updated_date: '2024-01-15'
        },
        {
            link_id: 'link008',
            name: 'Customs Portal',
            username: 'customsuser123',
            password: 'customspass456',
            link: 'https://www.icegate.gov.in',
            remark: 'Indian Customs portal',
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
                link.link.toLowerCase().includes(searchTerm.toLowerCase())
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
            alert('Link copied to clipboard: ' + link.link);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
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
        totalCredentials: filteredLinks.filter(link => link.username && link.password).length
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
                <div className="h-8 bg-gray-200 rounded w-16"></div>
            </td>
            <td className="p-4">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-gray-200 rounded w-8 mx-auto"></div>
            </td>
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
    if (loading && links.length === 0) {
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
                                        Important Links
                                    </h5>
                                    <p className="text-gray-500 text-xs mt-1">
                                        Manage your important links and credentials
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
                                            placeholder="Search links..."
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
                                        Add Link
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
                                            <th className="text-left p-4 font-semibold text-gray-700">Link</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Credentials</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Remark</th>
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
                                        ) : filteredLinks.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-8 text-gray-500">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <FiSettings className="w-12 h-12 text-gray-300 mb-3" />
                                                        <p className="text-gray-500">
                                                            {links.length === 0 ? 'No important links found' : 'No links match your search criteria'}
                                                        </p>
                                                        <motion.button
                                                            onClick={() => setShowCreateModal(true)}
                                                            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Create Your First Link
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredLinks.map((link, index) => {
                                                const isDropdownOpen = activeDropdown === link.link_id;

                                                return (
                                                    <tr
                                                        key={link.link_id}
                                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                                                    >
                                                        <td className="p-4 text-gray-600 font-medium">
                                                            {index + 1}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-gray-800 font-medium">
                                                                {link.name}
                                                            </div>
                                                            <div className="text-gray-500 text-xs mt-1">
                                                                Created: {formatDate(link.created_date)}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <motion.button
                                                                onClick={() => handleCopyLink(link)}
                                                                className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <FiCopy className="w-3 h-3" />
                                                                Copy Link
                                                            </motion.button>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-sm space-y-1">
                                                                <div className="text-gray-700">
                                                                    <span className="font-medium">Username:</span> 
                                                                    <span className={`ml-1 ${link.username ? 'text-gray-800' : 'text-gray-400'}`}>
                                                                        {link.username || 'N/A'}
                                                                    </span>
                                                                </div>
                                                                <div className="text-gray-700">
                                                                    <span className="font-medium">Password:</span> 
                                                                    <span className={`ml-1 ${link.password ? 'text-gray-800' : 'text-gray-400'}`}>
                                                                        {link.password || 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-gray-600">
                                                                {link.remark}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="dropdown-container relative flex justify-center">
                                                                <motion.button
                                                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group-hover:bg-gray-200"
                                                                    onClick={() => toggleDropdown(link.link_id)}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                >
                                                                    <FiMoreVertical className="w-4 h-4" />
                                                                </motion.button>
                                                                {isDropdownOpen && (
                                                                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                                                                        <div className="py-1">
                                                                            <button
                                                                                onClick={() => handleEditClick(link)}
                                                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                                                            >
                                                                                <FiEdit className="w-4 h-4 mr-3" />
                                                                                Edit
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteLink(link)}
                                                                                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-indigo-50 transition-colors"
                                                                            >
                                                                                <FiTrash className="w-4 h-4 mr-3" />
                                                                                Delete
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
                                                    {summary.totalLinks} Links
                                                </span>
                                            </td>
                                            <td className="text-left p-4">
                                                <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                    {summary.linksWithCredentials} with Credentials
                                                </span>
                                            </td>
                                            <td className="text-left p-4">
                                                <span className="inline-flex items-center justify-center bg-purple-100 text-purple-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                    {summary.totalCredentials} Complete
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
                size="max-w-4xl"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleCreateSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={createForm.name}
                                    onChange={(e) => handleCreateChange('name', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="Enter link name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={createForm.username}
                                    onChange={(e) => handleCreateChange('username', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="Enter username"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="text"
                                    value={createForm.password}
                                    onChange={(e) => handleCreateChange('password', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="Enter password"
                                />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={createForm.link}
                                    onChange={(e) => handleCreateChange('link', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="Enter link"
                                    required
                                />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Remark
                                </label>
                                <textarea
                                    value={createForm.remark}
                                    onChange={(e) => handleCreateChange('remark', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="Enter remark"
                                    rows="3"
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
                                    username: '',
                                    password: '',
                                    link: '',
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
                size="max-w-4xl"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleEditSubmit}>
                        <input type="hidden" name="link_id" value={editForm.link_id} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => handleEditChange('name', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="Enter link name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={editForm.username}
                                    onChange={(e) => handleEditChange('username', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="Enter username"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="text"
                                    value={editForm.password}
                                    onChange={(e) => handleEditChange('password', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="Enter password"
                                />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.link}
                                    onChange={(e) => handleEditChange('link', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="Enter link"
                                    required
                                />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Remark
                                </label>
                                <textarea
                                    value={editForm.remark}
                                    onChange={(e) => handleEditChange('remark', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                    placeholder="Enter remark"
                                    rows="3"
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
                                setShowEditModal(false);
                                setSelectedLink(null);
                            }}
                            className="px-4 py-2.5 text-gray-600 hover:text-gray-800 rounded-lg text-sm font-medium transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            onClick={handleEditSubmit}
                            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
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