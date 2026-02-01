import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiSettings, FiMoreVertical, FiSearch, FiFilter, FiDollarSign, FiPercent, FiCheckCircle, FiXCircle, FiCalendar, FiX, FiTag, FiGrid, FiList } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, Sidebar } from '../../components/header';
import DateFilter from '../../components/DateFilter';

// Get headers with proper authentication
const getHeaders = () => {
    try {
        // Try new keys first, then fallback to old keys
        const userName = localStorage.getItem('userName') || 
                         localStorage.getItem('user_username') || '';
        const token = localStorage.getItem('token') || 
                      localStorage.getItem('user_token') || '';
        const branchId = localStorage.getItem('branchId') || 
                         localStorage.getItem('branch_id') || '';
        
       
        
        if (!userName || !token || !branchId) {
            console.error('Missing authentication data in localStorage');
            // console.log('Available localStorage keys:', Object.keys(localStorage));
            return null;
        }
        
        return {
            'Content-Type': 'application/json',
            'username': userName,
            'token':token,
            'branch': branchId
        };
    } catch (error) {
        console.error('Error getting headers from localStorage:', error);
        return null;
    }
};

const Services = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('services'); // 'services' or 'categories'
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCategoryCreateModal, setShowCategoryCreateModal] = useState(false);
    const [showCategoryEditModal, setShowCategoryEditModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [categoryActiveDropdown, setCategoryActiveDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [categoryPage, setCategoryPage] = useState(1);
    const [categoryLimit, setCategoryLimit] = useState(10);
    const [categoryTotal, setCategoryTotal] = useState(0);
    const [categoryTotalPages, setCategoryTotalPages] = useState(1);
    const [apiError, setApiError] = useState('');

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

    const [categoryCreateForm, setCategoryCreateForm] = useState({
        name: ''
    });

    const [categoryEditForm, setCategoryEditForm] = useState({
        category_id: '',
        name: ''
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

    // Predefined categories
    const predefinedCategories = [
        'Tax Service',
        'Audit and Assurance Compliance',
        'Registration',
        'Accounting',
        'GST Services',
        'Company Law Services',
        'Financial Advisory'
    ];

    // API Base URL
    const API_BASE_URL = 'https://api.ooms.in/api/v1';

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
        fetchCategoriesData();
    }, []);

    // Filter services when search term or date range changes
    useEffect(() => {
        filterServices();
    }, [searchTerm, dateRange, services]);

    // Filter categories when search term changes
    useEffect(() => {
        filterCategories();
    }, [categorySearchTerm, categories]);

    // Fetch categories when page or limit changes
    useEffect(() => {
        if (activeTab === 'categories') {
            fetchCategoriesData();
        }
    }, [categoryPage, categoryLimit, activeTab]);

    // Check localStorage on mount
    useEffect(() => {
        console.log('LocalStorage contents:', Object.keys(localStorage));
    }, []);

    // Simulate API call to fetch services data
    const fetchServicesData = async () => {
        setLoading(true);
        setTimeout(() => {
            setServices(mockServicesData);
            setFilteredServices(mockServicesData);
            setLoading(false);
        }, 1000);
    };

    // Fetch categories from API
   // Fetch categories from API
const fetchCategoriesData = async () => {
    setLoading(true);
    setApiError('');
    
    const headers = getHeaders();
    
    if (!headers) {
        setApiError('Authentication failed. Please log in again.');
        setLoading(false);
        
        // Use mock data for testing
        setTimeout(() => {
            setCategories([
                {
                    id: 1,
                    category_id: 'cat001',
                    branch_id: '123456',
                    name: 'GST Services',
                    create_date: '2026-01-29T23:47:23.000Z',
                    create_by: {
                        username: '7364076458',
                        name: 'Sourav',
                        email: 'souravadhikary1916@gmail.com',
                        mobile: '9864972356',
                        user_type: 'user'
                    },
                    modify_date: '2026-01-29T23:49:04.000Z',
                    modify_by: {
                        username: '7364076458',
                        name: 'Sourav',
                        email: 'souravadhikary1916@gmail.com',
                        mobile: '9864972356',
                        user_type: 'user'
                    }
                }
            ]);
            setFilteredCategories([
                {
                    id: 1,
                    category_id: 'cat001',
                    branch_id: '123456',
                    name: 'GST Services',
                    create_date: '2026-01-29T23:47:23.000Z',
                    create_by: {
                        username: '7364076458',
                        name: 'Sourav',
                        email: 'souravadhikary1916@gmail.com',
                        mobile: '9864972356',
                        user_type: 'user'
                    },
                    modify_date: '2026-01-29T23:49:04.000Z',
                    modify_by: {
                        username: '7364076458',
                        name: 'Sourav',
                        email: 'souravadhikary1916@gmail.com',
                        mobile: '9864972356',
                        user_type: 'user'
                    }
                }
            ]);
            setCategoryTotal(1);
            setCategoryTotalPages(1);
            setLoading(false);
        }, 1000);
        return;
    }
    
    try {
        console.log('Fetching categories with headers:', headers);
        
        // SOLUTION 1: Try different fetch configurations for CORS
        const url = `${API_BASE_URL}/service/category/list?search=${categorySearchTerm}&page=${categoryPage}&limit=${categoryLimit}`;
        
        // Try with no-cors mode first (for testing)
        let response;
        
        try {
            // First try with standard fetch
            response = await fetch(url, {
                method: 'GET',
                headers: headers,
                mode: 'cors', // Explicitly set to cors
                credentials: 'omit' // Try 'omit' instead of 'include'
            });
        } catch (corsError) {
            console.log('CORS error, trying with different approach...', corsError);
            
            // Try with mode: 'no-cors' for debugging (but note: won't get response data)
            response = await fetch(url, {
                method: 'GET',
                headers: headers,
                mode: 'no-cors',
                credentials: 'omit'
            });
            
            console.log('Response with no-cors:', response);
            throw new Error('CORS issue detected. Please check API server configuration.');
        }
        
        console.log('Response status:', response.status);
        
        if (response.status === 401) {
            setApiError('Authentication failed. Please check your login credentials and try again.');
            throw new Error('Unauthorized - Invalid or expired token');
        }
        
        if (response.status === 0) {
            // This usually indicates a CORS error
            setApiError('Cannot connect to API server due to CORS restrictions. Please contact the administrator.');
            throw new Error('CORS policy blocked the request');
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success) {
            setCategories(data.data);
            setFilteredCategories(data.data);
            setCategoryTotal(data.pagination.total);
            setCategoryTotalPages(data.pagination.total_pages);
        } else {
            setApiError(data.message || 'Failed to fetch categories');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
            setApiError('CORS Error: Cannot connect to API server. This is a server configuration issue.');
            
            // Show helpful message about CORS
            console.error(`
                CORS ERROR DETECTED:
                The API server (https://api.ooms.in) is not configured to accept requests from your domain.
                
                SOLUTIONS:
                1. Ask the API server administrator to add your domain to CORS whitelist
                2. Use a proxy server
                3. Deploy frontend and backend on same domain
            `);
        } else {
            setApiError(error.message || 'Failed to connect to server');
        }
        
        // Fallback to mock data
        setCategories([
            {
                id: 1,
                category_id: 'cat001',
                branch_id: '123456',
                name: 'GST Services',
                create_date: '2026-01-29T23:47:23.000Z',
                create_by: {
                    username: '7364076458',
                    name: 'Sourav',
                    email: 'souravadhikary1916@gmail.com',
                    mobile: '9864972356',
                    user_type: 'user'
                },
                modify_date: '2026-01-29T23:49:04.000Z',
                modify_by: {
                    username: '7364076458',
                    name: 'Sourav',
                    email: 'souravadhikary1916@gmail.com',
                    mobile: '9864972356',
                    user_type: 'user'
                }
            }
        ]);
        setFilteredCategories([
            {
                id: 1,
                category_id: 'cat001',
                branch_id: '123456',
                name: 'GST Services',
                create_date: '2026-01-29T23:47:23.000Z',
                create_by: {
                    username: '7364076458',
                    name: 'Sourav',
                    email: 'souravadhikary1916@gmail.com',
                    mobile: '9864972356',
                    user_type: 'user'
                },
                modify_date: '2026-01-29T23:49:04.000Z',
                modify_by: {
                    username: '7364076458',
                    name: 'Sourav',
                    email: 'souravadhikary1916@gmail.com',
                    mobile: '9864972356',
                    user_type: 'user'
                }
            }
        ]);
        setCategoryTotal(1);
        setCategoryTotalPages(1);
    } finally {
        setLoading(false);
    }
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

    // Filter categories based on search term
    const filterCategories = () => {
        if (!categorySearchTerm) {
            setFilteredCategories(categories);
            return;
        }

        const filtered = categories.filter(category =>
            category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
        );
        setFilteredCategories(filtered);
    };

    // Handle create form submit
    const handleCreateSubmit = (e) => {
        e.preventDefault();
        console.log('Create form data:', createForm);
        
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
        console.log('Edit form data:', editForm);
        
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
        
        setShowEditModal(false);
    };

    // Handle category create form submit
    const handleCategoryCreateSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        
        const headers = getHeaders();
        
        if (!headers) {
            setApiError('Authentication failed. Please log in again.');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/service/category/create`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    name: categoryCreateForm.name
                })
            });
            
            if (response.status === 401) {
                setApiError('Authentication failed. Please check your login credentials.');
                throw new Error('Unauthorized');
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Refresh categories
                fetchCategoriesData();
                setShowCategoryCreateModal(false);
                setCategoryCreateForm({ name: '' });
            } else {
                setApiError(data.message || 'Failed to create category');
            }
        } catch (error) {
            console.error('Error creating category:', error);
            setApiError(error.message || 'Failed to create category');
            
            // Fallback - add to local state
            const newCategory = {
                id: categories.length + 1,
                category_id: `cat${String(categories.length + 1).padStart(3, '0')}`,
                branch_id: '123456',
                name: categoryCreateForm.name,
                create_date: new Date().toISOString(),
                create_by: {
                    username: 'current_user',
                    name: 'Current User',
                    email: 'user@example.com',
                    mobile: '0000000000',
                    user_type: 'user'
                },
                modify_date: new Date().toISOString(),
                modify_by: {
                    username: 'current_user',
                    name: 'Current User',
                    email: 'user@example.com',
                    mobile: '0000000000',
                    user_type: 'user'
                }
            };
            
            setCategories(prev => [newCategory, ...prev]);
            setFilteredCategories(prev => [newCategory, ...prev]);
            setShowCategoryCreateModal(false);
            setCategoryCreateForm({ name: '' });
        }
    };

    // Handle category edit form submit
    const handleCategoryEditSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        
        const headers = getHeaders();
        
        if (!headers) {
            setApiError('Authentication failed. Please log in again.');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/service/category/edit`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    name: categoryEditForm.name,
                    category_id: categoryEditForm.category_id
                })
            });
            
            if (response.status === 401) {
                setApiError('Authentication failed. Please check your login credentials.');
                throw new Error('Unauthorized');
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Refresh categories
                fetchCategoriesData();
                setShowCategoryEditModal(false);
            } else {
                setApiError(data.message || 'Failed to update category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            setApiError(error.message || 'Failed to update category');
            
            // Fallback - update local state
            setCategories(prev => prev.map(category =>
                category.category_id === categoryEditForm.category_id
                    ? {
                        ...category,
                        name: categoryEditForm.name,
                        modify_date: new Date().toISOString(),
                        modify_by: {
                            username: 'current_user',
                            name: 'Current User',
                            email: 'user@example.com',
                            mobile: '0000000000',
                            user_type: 'user'
                        }
                    }
                    : category
            ));
            
            setFilteredCategories(prev => prev.map(category =>
                category.category_id === categoryEditForm.category_id
                    ? {
                        ...category,
                        name: categoryEditForm.name,
                        modify_date: new Date().toISOString(),
                        modify_by: {
                            username: 'current_user',
                            name: 'Current User',
                            email: 'user@example.com',
                            mobile: '0000000000',
                            user_type: 'user'
                        }
                    }
                    : category
            ));
            
            setShowCategoryEditModal(false);
        }
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

    // Handle category edit button click
    const handleCategoryEditClick = (category) => {
        setSelectedCategory(category);
        setCategoryEditForm({
            category_id: category.category_id,
            name: category.name
        });
        setShowCategoryEditModal(true);
        setCategoryActiveDropdown(null);
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

    // Handle category form changes
    const handleCategoryCreateChange = (field, value) => {
        setCategoryCreateForm({ ...categoryCreateForm, [field]: value });
    };

    const handleCategoryEditChange = (field, value) => {
        setCategoryEditForm({ ...categoryEditForm, [field]: value });
    };

    // Select predefined category
    const selectPredefinedCategory = (categoryName) => {
        setCategoryCreateForm({ name: categoryName });
    };

    // Toggle dropdowns
    const toggleDropdown = (serviceId) => {
        setActiveDropdown(activeDropdown === serviceId ? null : serviceId);
    };

    const toggleCategoryDropdown = (categoryId) => {
        setCategoryActiveDropdown(categoryActiveDropdown === categoryId ? null : categoryId);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setActiveDropdown(null);
                setCategoryActiveDropdown(null);
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

    // Calculate summary for services
    const summary = {
        totalServices: filteredServices.length,
        activeServices: filteredServices.filter(service => service.status === 1).length
    };

    // Calculate summary for categories
    const categorySummary = {
        totalCategories: filteredCategories.length
    };

    // Clear search
    const clearSearch = () => {
        if (activeTab === 'services') {
            setSearchTerm('');
            setDateRange('');
        } else {
            setCategorySearchTerm('');
        }
    };

    // Handle pagination
    const handlePreviousPage = () => {
        if (categoryPage > 1) {
            setCategoryPage(categoryPage - 1);
        }
    };

    const handleNextPage = () => {
        if (categoryPage < categoryTotalPages) {
            setCategoryPage(categoryPage + 1);
        }
    };

    // Skeleton loader components
    const ServiceSkeletonRow = () => (
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

    const CategorySkeletonRow = () => (
        <tr className="border-b border-gray-100 animate-pulse">
            <td className="p-3 text-center">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-6 mx-auto"></div>
            </td>
            <td className="p-3">
                <div className="space-y-1.5">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                </div>
            </td>
            <td className="p-3">
                <div className="space-y-1.5">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                </div>
            </td>
            <td className="p-3">
                <div className="space-y-1.5">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                </div>
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
                    {apiError && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FiXCircle className="w-5 h-5 mr-2" />
                                    {apiError}
                                </div>
                                <button 
                                    onClick={() => setApiError('')}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <div className="h-full flex flex-col">
                        {/* Header with Tabs */}
                        <div className="mb-6">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                                <div>
                                    <h5 className="text-2xl font-bold text-gray-800 mb-2">
                                        Services & Categories Management
                                    </h5>
                                    <p className="text-gray-600 text-sm">
                                        Manage and track all your services and categories in one place
                                    </p>
                                </div>

                                <motion.button
                                    onClick={() => {
                                        if (activeTab === 'services') {
                                            setShowCreateModal(true);
                                        } else {
                                            setShowCategoryCreateModal(true);
                                        }
                                    }}
                                    className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-600/40"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FiPlus className="w-4 h-4" />
                                    {activeTab === 'services' ? 'Add New Service' : 'Add New Category'}
                                </motion.button>
                            </div>

                            {/* Tab Navigation */}
                            <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6">
                                <button
                                    onClick={() => setActiveTab('services')}
                                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'services' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'}`}
                                >
                                    <FiSettings className="w-4 h-4" />
                                    Services
                                </button>
                                <button
                                    onClick={() => setActiveTab('categories')}
                                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'categories' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'}`}
                                >
                                    <FiTag className="w-4 h-4" />
                                    Categories
                                </button>
                            </div>

                            {/* Stats Cards */}
                            {activeTab === 'services' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
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
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Total Categories</p>
                                                <h3 className="text-2xl font-bold text-gray-800">{categorySummary.totalCategories}</h3>
                                            </div>
                                            <div className="p-3 bg-indigo-50 rounded-lg">
                                                <FiTag className="w-6 h-6 text-indigo-600" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Page</p>
                                                <h3 className="text-2xl font-bold text-indigo-600">{categoryPage} of {categoryTotalPages}</h3>
                                            </div>
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <FiList className="w-6 h-6 text-blue-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                            value={activeTab === 'services' ? searchTerm : categorySearchTerm}
                                            onChange={(e) => activeTab === 'services' ? setSearchTerm(e.target.value) : setCategorySearchTerm(e.target.value)}
                                            placeholder={activeTab === 'services' ? "Search by name or SAC code" : "Search by category name"}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all text-sm"
                                        />
                                    </div>
                                    
                                    {/* Date Filter - Only for Services */}
                                    {activeTab === 'services' && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-300 rounded-lg bg-white min-w-[140px]">
                                                <FiCalendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                <DateFilter 
                                                    onChange={handleDateFilterChange}
                                                    className="text-sm w-full bg-transparent border-none outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Active Filters Badge */}
                                    {((activeTab === 'services' && (searchTerm || dateRange)) || (activeTab === 'categories' && categorySearchTerm)) && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                                                {activeTab === 'services' && searchTerm && (
                                                    <span className="flex items-center">
                                                        Search: "{searchTerm}"
                                                    </span>
                                                )}
                                                {activeTab === 'services' && dateRange && (
                                                    <span className="flex items-center ml-2">
                                                        <FiCalendar className="w-3 h-3 mr-1" />
                                                        {dateRange}
                                                    </span>
                                                )}
                                                {activeTab === 'categories' && categorySearchTerm && (
                                                    <span className="flex items-center">
                                                        Search: "{categorySearchTerm}"
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
                                    
                                    {/* Results Count - Compact */}
                                    <div className="text-sm text-gray-600 whitespace-nowrap sm:ml-auto">
                                        <span className="font-semibold">
                                            {activeTab === 'services' ? filteredServices.length : filteredCategories.length}
                                        </span> of{" "}
                                        <span className="font-semibold">
                                            {activeTab === 'services' ? services.length : categoryTotal}
                                        </span>
                                        {activeTab === 'categories' && ` (Page ${categoryPage}/${categoryTotalPages})`}
                                    </div>
                                </div>
                            </div>

                            {/* Table Container */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Table Header */}
                                <div className="bg-gradient-to-r from-gray-50 to-indigo-50">
                                    {activeTab === 'services' ? (
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
                                    ) : (
                                        <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-gray-200">
                                            <div className="col-span-1">
                                                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                                                    #
                                                </div>
                                            </div>
                                            <div className="col-span-4">
                                                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Category Details
                                                </div>
                                            </div>
                                            <div className="col-span-3">
                                                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Created By
                                                </div>
                                            </div>
                                            <div className="col-span-3">
                                                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Last Modified
                                                </div>
                                            </div>
                                            <div className="col-span-1">
                                                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                                                    Actions
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Scrollable Table Body */}
                                <div className="flex-1 overflow-y-auto">
                                    {loading ? (
                                        <div className="p-5">
                                            {Array.from({ length: 8 }).map((_, index) => (
                                                activeTab === 'services' ? <ServiceSkeletonRow key={index} /> : <CategorySkeletonRow key={index} />
                                            ))}
                                        </div>
                                    ) : (activeTab === 'services' ? filteredServices : filteredCategories).length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                    {activeTab === 'services' ? (
                                                        <FiSettings className="w-12 h-12 text-gray-400" />
                                                    ) : (
                                                        <FiTag className="w-12 h-12 text-gray-400" />
                                                    )}
                                                </div>
                                                <p className="text-gray-500 text-lg font-medium mb-2">
                                                    {activeTab === 'services' 
                                                        ? (services.length === 0 ? 'No services available' : 'No matching services found')
                                                        : (categories.length === 0 ? 'No categories available' : 'No matching categories found')
                                                    }
                                                </p>
                                                <p className="text-gray-400 text-sm mb-4">
                                                    {activeTab === 'services' 
                                                        ? (services.length === 0 
                                                            ? 'Get started by creating your first service' 
                                                            : 'Try adjusting your search or filter criteria')
                                                        : (categories.length === 0
                                                            ? 'Get started by creating your first category'
                                                            : 'Try adjusting your search criteria')
                                                    }
                                                </p>
                                                <motion.button
                                                    onClick={() => {
                                                        if (activeTab === 'services') {
                                                            setShowCreateModal(true);
                                                        } else {
                                                            setShowCategoryCreateModal(true);
                                                        }
                                                    }}
                                                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {activeTab === 'services' ? 'Create Your First Service' : 'Create Your First Category'}
                                                </motion.button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-5">
                                            {activeTab === 'services' ? (
                                                // Services Table Content
                                                filteredServices.map((service, index) => {
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
                                                })
                                            ) : (
                                                // Categories Table Content
                                                filteredCategories.map((category, index) => {
                                                    const isDropdownOpen = categoryActiveDropdown === category.category_id;

                                                    return (
                                                        <motion.div
                                                            key={category.category_id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="grid grid-cols-12 gap-2 py-3 border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50 transition-all duration-200 group"
                                                        >
                                                            {/* # Column */}
                                                            <div className="col-span-1 flex items-center justify-center">
                                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 font-semibold rounded-lg">
                                                                    {index + 1}
                                                                </span>
                                                            </div>

                                                            {/* Category Details Column */}
                                                            <div className="col-span-4 flex flex-col">
                                                                <div className="mb-2">
                                                                    <div className="text-gray-800 font-semibold text-sm mb-1">
                                                                        {category.name}
                                                                    </div>
                                                                    {/* <div className="text-gray-500 text-xs">
                                                                        ID: {category.category_id}
                                                                    </div> */}
                                                                </div>
                                                                <div className="text-gray-500 text-xs">
                                                                    Created: {formatDate(category.create_date)}
                                                                </div>
                                                            </div>

                                                            {/* Created By Column */}
                                                            <div className="col-span-3 flex flex-col">
                                                                <div className="text-gray-800 font-medium text-sm mb-1">
                                                                    {category.create_by?.name || 'N/A'}
                                                                </div>
                                                                <div className="text-gray-500 text-xs">
                                                                    {category.create_by?.username || 'N/A'}
                                                                </div>
                                                                <div className="text-gray-500 text-xs mt-1">
                                                                    {category.create_by?.email || ''}
                                                                </div>
                                                            </div>

                                                            {/* Last Modified Column */}
                                                            <div className="col-span-3 flex flex-col">
                                                                <div className="text-gray-800 font-medium text-sm mb-1">
                                                                    {category.modify_by?.name || category.create_by?.name || 'N/A'}
                                                                </div>
                                                                <div className="text-gray-500 text-xs">
                                                                    {formatDate(category.modify_date || category.create_date)}
                                                                </div>
                                                                <div className="text-gray-500 text-xs mt-1">
                                                                    {category.modify_by?.username || category.create_by?.username || 'N/A'}
                                                                </div>
                                                            </div>

                                                            {/* Actions Column */}
                                                            <div className="col-span-1 flex items-center justify-center">
                                                                <div className="dropdown-container relative">
                                                                    <motion.button
                                                                        className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 group-hover:bg-indigo-100/50"
                                                                        onClick={() => toggleCategoryDropdown(category.category_id)}
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
                                                                                        onClick={() => handleCategoryEditClick(category)}
                                                                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"
                                                                                    >
                                                                                        <FiEdit className="w-4 h-4 mr-3" />
                                                                                        Edit Category
                                                                                    </button>
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Table Footer */}
                                <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                    <div className="px-5 py-3">
                                        {activeTab === 'services' ? (
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
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                                                <div className="text-sm text-gray-600">
                                                    Showing <span className="font-semibold">{filteredCategories.length}</span> of{" "}
                                                    <span className="font-semibold">{categoryTotal}</span> categories (Page {categoryPage}/{categoryTotalPages})
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={handlePreviousPage}
                                                        disabled={categoryPage === 1}
                                                        className={`px-3 py-1.5 text-sm rounded-lg ${categoryPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        onClick={handleNextPage}
                                                        disabled={categoryPage === categoryTotalPages}
                                                        className={`px-3 py-1.5 text-sm rounded-lg ${categoryPage === categoryTotalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                                                    >
                                                        Next
                                                    </button>
                                                    <div className="text-sm text-gray-600 ml-2">
                                                        Limit:{" "}
                                                        <select
                                                            value={categoryLimit}
                                                            onChange={(e) => setCategoryLimit(Number(e.target.value))}
                                                            className="ml-1 px-2 py-1 border border-gray-300 rounded bg-white text-sm"
                                                        >
                                                            <option value="10">10</option>
                                                            <option value="20">20</option>
                                                            <option value="50">50</option>
                                                            <option value="100">100</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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

            {/* Create Category Modal */}
            {showCategoryCreateModal && (
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
                                    <h5 className="text-xl font-bold text-gray-800">Create New Category</h5>
                                    <p className="text-gray-600 text-sm mt-1">Add a new service category</p>
                                </div>
                                <button
                                    onClick={() => setShowCategoryCreateModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCategoryCreateSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={categoryCreateForm.name}
                                        onChange={(e) => handleCategoryCreateChange('name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        placeholder="Enter category name or select from suggestions below"
                                        required
                                    />
                                </div>

                                {/* Predefined Categories */}
                                <div className="mb-8">
                                    <h6 className="text-sm font-semibold text-gray-700 mb-3">Quick Suggestions:</h6>
                                    <div className="flex flex-wrap gap-2">
                                        {predefinedCategories.map((category, index) => (
                                            <motion.button
                                                key={index}
                                                type="button"
                                                onClick={() => selectPredefinedCategory(category)}
                                                className="px-4 py-2 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-indigo-300"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {category}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {apiError && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                        {apiError}
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowCategoryCreateModal(false)}
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
                                        Create Category
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Edit Category Modal */}
            {showCategoryEditModal && selectedCategory && (
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
                                    <h5 className="text-xl font-bold text-gray-800">Edit Category</h5>
                                    <p className="text-gray-600 text-sm mt-1">Update category details for {selectedCategory.name}</p>
                                </div>
                                <button
                                    onClick={() => setShowCategoryEditModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCategoryEditSubmit}>
                                <input type="hidden" name="category_id" value={categoryEditForm.category_id} />
                                
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={categoryEditForm.name}
                                        onChange={(e) => handleCategoryEditChange('name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div className="mb-6">
                                    <h6 className="text-sm font-semibold text-gray-700 mb-3">Category ID:</h6>
                                    <div className="px-4 py-3 bg-gray-50 text-gray-700 rounded-xl border border-gray-200">
                                        {categoryEditForm.category_id}
                                    </div>
                                </div>

                                {apiError && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                        {apiError}
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowCategoryEditModal(false)}
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
                                        Update Category
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