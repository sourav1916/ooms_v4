import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import Pagination from '../../components/paging-nation-component';
import API_BASE_URL from '../../utils/api-controller';
import getHeaders from '../../utils/get-headers';
import axios from 'axios';

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
    const [apiError, setApiError] = useState(null);
    const [apiSuccess, setApiSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pagination states
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        total_pages: 1,
        is_last_page: true
    });

    // Form states - Memoized to prevent unnecessary re-renders
    const initialCreateForm = useMemo(() => ({
        name: '',
        username: '',
        password: '',
        url: '',
        remark: '',
        category: 'Government'
    }), []);

    const initialEditForm = useMemo(() => ({
        link_id: '',
        name: '',
        username: '',
        password: '',
        url: '',
        remark: '',
        category: 'Government'
    }), []);

    const [createForm, setCreateForm] = useState(initialCreateForm);
    const [editForm, setEditForm] = useState(initialEditForm);

    // Categories options
    const categories = ['Government', 'Banking', 'Financial', 'General'];

    // ========== FUNCTION DEFINITIONS (in order of dependency) ==========

    // Format date
    const formatDate = useCallback((dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    }, []);

    // Get category color
    const getCategoryColor = useCallback((category) => {
        const colors = {
            'Government': 'bg-blue-100 text-blue-800',
            'Banking': 'bg-green-100 text-green-800',
            'Financial': 'bg-purple-100 text-purple-800',
            'General': 'bg-gray-100 text-gray-800'
        };
        return colors[category] || colors['General'];
    }, []);

    // Filter links based on search term and date range
    const filterLinks = useCallback(() => {
        let filtered = links;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(link =>
                link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (link.remark && link.remark.toLowerCase().includes(searchTerm.toLowerCase())) ||
                link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (link.category && link.category.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by date range
        if (dateRange) {
            const [from, to] = dateRange.split(' - ');
            const fromDate = new Date(from.split('/').reverse().join('-'));
            const toDate = new Date(to.split('/').reverse().join('-'));

            filtered = filtered.filter(link => {
                const linkDate = new Date(link.create_date);
                return linkDate >= fromDate && linkDate <= toDate;
            });
        }

        setFilteredLinks(filtered);
    }, [searchTerm, dateRange, links]);

    // Handle search
    const handleSearch = useCallback(() => {
        filterLinks();
    }, [filterLinks]);

    // Handle form changes
    const handleCreateChange = useCallback((field, value) => {
        setCreateForm(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleEditChange = useCallback((field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    // Handle date filter change
    const handleDateFilterChange = useCallback((filter) => {
        if (filter?.range) {
            setDateRange(filter.range);
        }
    }, []);

    // Toggle password visibility
    const togglePasswordVisibility = useCallback((linkId) => {
        setShowPassword(prev => ({
            ...prev,
            [linkId]: !prev[linkId]
        }));
    }, []);

    // Toggle dropdown
    const toggleDropdown = useCallback((linkId) => {
        setActiveDropdown(prev => prev === linkId ? null : linkId);
    }, []);

    // Reset create modal
    const resetCreateModal = useCallback(() => {
        setShowCreateModal(false);
        setCreateForm(initialCreateForm);
    }, [initialCreateForm]);

    // Reset edit modal
    const resetEditModal = useCallback(() => {
        setShowEditModal(false);
        setSelectedLink(null);
        setEditForm(initialEditForm);
    }, [initialEditForm]);

    // Handle copy link
    const handleCopyLink = useCallback((link) => {
        navigator.clipboard.writeText(link.url).then(() => {
            setApiSuccess('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            setApiError('Failed to copy link');
        });
    }, []);

    // Handle edit button click
   // Handle edit button click - get data from existing links state
// Handle edit button click
const handleEditClick = useCallback((link) => {
    console.log('Editing link with ID:', link.link_id); // Debug
    console.log('Full link object:', link); // Debug
    
    setSelectedLink(link);
    setEditForm({
        link_id: link.link_id,  // Make sure this matches exactly
        name: link.name,
        username: link.username || '',
        password: '', // Don't populate password
        url: link.url,
        remark: link.remark || '',
        category: link.category || 'Government'
    });
    setShowEditModal(true);
    setActiveDropdown(null);
}, []);
    // API call to fetch links data
    // API call to fetch links data
    const fetchLinksData = useCallback(async (page = 1, limit = 20) => {
        setLoading(true);
        setApiError(null);

        try {
            const headers = getHeaders();
            const response = await axios.get(`${API_BASE_URL}/assistance/important-link/list`, {
                headers,
                params: { page, limit }
            });

            if (response.data.success) {
                setLinks(response.data.data);
                setFilteredLinks(response.data.data);
                setPagination(response.data.meta);
            } else {
                setApiError(response.data.message || 'Failed to fetch links');
            }
        } catch (error) {
            console.error('Error fetching links:', error);
            setApiError(error.response?.data?.message || 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // API call to create link
    const handleCreateSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setApiError(null);
        setApiSuccess(null);

        try {
            const headers = getHeaders();
            const response = await axios.post(
                `${API_BASE_URL}/assistance/important-link/create`,
                {
                    name: createForm.name,
                    category: createForm.category,
                    url: createForm.url,
                    username: createForm.username,
                    password: createForm.password,
                    remark: createForm.remark
                },
                { headers }
            );

            if (response.data.success) {
                setApiSuccess('Link created successfully!');
                await fetchLinksData();
                resetCreateModal();
            } else {
                setApiError(response.data.message || 'Failed to create link');
            }
        } catch (error) {
            console.error('Error creating link:', error);
            setApiError(error.response?.data?.message || 'Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [createForm, fetchLinksData, resetCreateModal]);

    // API call to edit link
   // API call to edit link - DEBUG VERSION
const handleEditSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);
    setApiSuccess(null);

    // Debug: Log everything
    console.log('===== EDIT DEBUG =====');
    console.log('1. Edit Form Data:', editForm);
    console.log('2. Link ID being sent:', editForm.link_id);
    console.log('3. Link ID type:', typeof editForm.link_id);
    console.log('4. Link ID length:', editForm.link_id.length);
    
    // Check if this link exists in current state
    const linkInState = links.find(l => l.link_id === editForm.link_id);
    console.log('5. Link exists in state:', linkInState ? 'YES' : 'NO');
    if (linkInState) {
        console.log('6. Link state data:', linkInState);
    }

    // Check localStorage values
    console.log('7. localStorage branch:', localStorage.getItem('branchId'));
    console.log('8. localStorage userName:', localStorage.getItem('userName'));
    console.log('9. localStorage token:', localStorage.getItem('token') ? 'Present' : 'Missing');

    try {
        const headers = getHeaders();
        console.log('10. Headers being sent:', headers);

        // Prepare data - ONLY include fields that exist
        const editData = {
            link_id: editForm.link_id,
            name: editForm.name,
            category: editForm.category,
            url: editForm.url,
            username: editForm.username,
            remark: editForm.remark
        };

        // Only include password if it's provided (not empty)
        if (editForm.password && editForm.password.trim() !== '') {
            editData.password = editForm.password;
        }

        console.log('11. Request data:', editData);

        const response = await axios.put(
            `${API_BASE_URL}/assistance/important-link/edit`,
            editData,
            { headers }
        );

        console.log('12. Response:', response.data);

        if (response.data.success) {
            setApiSuccess('Link updated successfully!');
            await fetchLinksData();
            resetEditModal();
        } else {
            setApiError(response.data.message || 'Failed to update link');
        }
    } catch (error) {
        console.error('===== ERROR DEBUG =====');
        console.error('Error object:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        console.error('Error message:', error.response?.data?.message);
        
        if (error.response?.status === 404) {
            setApiError(`Link not found. ID: ${editForm.link_id}`);
        } else if (error.response?.status === 403) {
            setApiError('You do not have permission to edit this link');
        } else {
            setApiError(error.response?.data?.message || 'Network error. Please try again.');
        }
    } finally {
        setIsSubmitting(false);
    }
}, [editForm, links, fetchLinksData, resetEditModal]);

    // API call to delete link
    const handleDeleteLink = useCallback(async (link) => {
        if (!window.confirm('Are you sure? You won\'t be able to revert this!')) {
            return;
        }

        setIsSubmitting(true);
        setApiError(null);
        setApiSuccess(null);

        try {
            const headers = getHeaders();
            const response = await axios.delete(
                `${API_BASE_URL}/assistance/important-link/delete`,
                {
                    headers,
                    data: { link_id: link.link_id }
                }
            );

            if (response.data.success) {
                setApiSuccess('Link deleted successfully!');
                await fetchLinksData();
            } else {
                setApiError(response.data.message || 'Failed to delete link');
            }
        } catch (error) {
            console.error('Error deleting link:', error);
            setApiError(error.response?.data?.message || 'Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
            setActiveDropdown(null);
        }
    }, [fetchLinksData]);

 // Handle page change
const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
        fetchLinksData(newPage, pagination.limit);
    }
}, [pagination.total_pages, pagination.limit, fetchLinksData]);
// Handle limit change
const handleLimitChange = useCallback((newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    fetchLinksData(1, newLimit);
}, [fetchLinksData]);

// Handle custom page change
const handleCustomPageChange = useCallback((pageNum) => {
    if (pageNum >= 1 && pageNum <= pagination.total_pages) {
        fetchLinksData(pageNum, pagination.limit);
    }
}, [pagination.limit, fetchLinksData]);

    // Calculate summary
    const summary = useMemo(() => ({
        totalLinks: filteredLinks.length,
        linksWithCredentials: filteredLinks.filter(link => link.username).length,
        totalCredentials: filteredLinks.filter(link => link.username).length,
        totalVisits: filteredLinks.reduce((sum, link) => sum + (link.visits || 0), 0)
    }), [filteredLinks]);

    // ========== EFFECTS ==========

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
    }, [fetchLinksData]);

    // Filter links when search term or date range changes
    useEffect(() => {
        filterLinks();
    }, [searchTerm, dateRange, links, filterLinks]);

    // Clear messages after 3 seconds
    useEffect(() => {
        if (apiError || apiSuccess) {
            const timer = setTimeout(() => {
                setApiError(null);
                setApiSuccess(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [apiError, apiSuccess]);

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

    // ========== COMPONENTS ==========

    // Skeleton Loading Component
    const SkeletonLoader = useCallback(() => (
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
    ), [mobileMenuOpen, isMinimized]);

    // Professional Modal Wrapper Component
    const ModalWrapper = useCallback(({ isOpen, onClose, title, children, size = 'max-w-2xl' }) => {
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
    }, []);

    // Show skeleton while loading and no data
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
                    {/* Alert Messages */}
                    <AnimatePresence>
                        {apiError && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {apiError}
                            </motion.div>
                        )}
                        {apiSuccess && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {apiSuccess}
                            </motion.div>
                        )}
                    </AnimatePresence>

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
                                disabled={isSubmitting}
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
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{pagination.total}</p>
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
                                        <p className="text-gray-500 text-sm font-medium">Categories</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{categories.length}</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <FiFilter className="w-6 h-6 text-purple-600" />
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
                                        <p className="text-gray-500 text-sm font-medium">Page {pagination.page}</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{pagination.total_pages}</p>
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
                                <div className="col-span-2">Category & Created By</div>
                                <div className="col-span-3">Remarks</div>
                                <div className="col-span-1 text-center">Actions</div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
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
                                                                {link.url?.replace(/^https?:\/\//, '')}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className="text-xs text-gray-500">
                                                                    <FiCalendar className="w-3 h-3 inline mr-1" />
                                                                    {formatDate(link.create_date)}
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
                                                                {link.username && (
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

                                                {/* Category & Created By */}
                                                <div className="col-span-2">
                                                    <div className="space-y-2">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(link.category)}`}>
                                                            {link.category || 'General'}
                                                        </span>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <FiUser className="w-3 h-3" />
                                                            <span className="truncate">{link.create_by?.name || 'Unknown'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Remarks */}
                                                <div className="col-span-3">
                                                    <p className="text-gray-600 text-sm line-clamp-2">{link.remark || 'No remarks'}</p>
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
                                                                disabled={isSubmitting}
                                                            >
                                                                <FiCopy className="w-4 h-4" />
                                                            </motion.button>
                                                            <motion.button
                                                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                                onClick={() => toggleDropdown(link.link_id)}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                disabled={isSubmitting}
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
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        <FiEdit className="w-4 h-4 mr-3 text-indigo-600" />
                                                                        Edit Link
                                                                    </button>
                                                                    <button
                                                                        onClick={() => window.open(link.url, '_blank')}
                                                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-200"
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        <FiExternalLink className="w-4 h-4 mr-3 text-blue-600" />
                                                                        Open Link
                                                                    </button>
                                                                    <div className="border-t border-gray-100">
                                                                        <button
                                                                            onClick={() => handleDeleteLink(link)}
                                                                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                                                            disabled={isSubmitting}
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

                        {/* Footer with Pagination */}
                        {/* Find this section in your return statement - around where you had the Pagination component */}
                        {filteredLinks.length > 0 && (
                            <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                <Pagination
                                    pagination={pagination}
                                    onPageChange={handlePageChange}
                                    onLimitChange={handleLimitChange}
                                    onCustomPageChange={handleCustomPageChange}
                                    loading={isSubmitting}
                                    showPageInfo={true}
                                    showLimitSelector={true}
                                    showCustomInput={true}
                                    className=""
                                />
                                <div className="flex justify-center pb-4 text-sm text-gray-600">
                                    <span className="font-semibold text-indigo-600">{summary.linksWithCredentials}</span>&nbsp;with credentials
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Create Modal */}
            <ModalWrapper
                isOpen={showCreateModal}
                onClose={resetCreateModal}
                title="Create New Link"
                size="max-w-2xl"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleCreateSubmit} id="create-form">
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
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={createForm.category}
                                        onChange={(e) => handleCreateChange('category', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
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
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    value={createForm.url}
                                    onChange={(e) => handleCreateChange('url', e.target.value)}
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
                            onClick={resetCreateModal}
                            className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            form="create-form"
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-medium shadow-sm disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Link'}
                        </motion.button>
                    </div>
                </div>
            </ModalWrapper>

            {/* Edit Modal */}
            <ModalWrapper
                isOpen={showEditModal}
                onClose={resetEditModal}
                title="Edit Link"
                size="max-w-2xl"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleEditSubmit} id="edit-form">
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
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={editForm.category}
                                        onChange={(e) => handleEditChange('category', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
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
                                            placeholder="Enter new password (leave blank to keep current)"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    value={editForm.url}
                                    onChange={(e) => handleEditChange('url', e.target.value)}
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
                            onClick={resetEditModal}
                            className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            form="edit-form"
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-medium shadow-sm disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Link'}
                        </motion.button>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    );
};

export default ImportantLinks;