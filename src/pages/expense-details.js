import React, { useState, useEffect } from 'react';
import {
    FiSearch,
    FiPlus,
    FiX,
    FiMenu,
    FiEdit,
    FiFileText,
    FiTrash2
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import DateFilter from '../components/DateFilter';
import CreateExpenseModal from '../components/expense-form';
import { motion } from 'framer-motion';
import { Header, Sidebar } from '../components/header';

const ExpenseDetails = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [showCreateExpenseModal, setShowCreateExpenseModal] = useState(false);
    const [dateRange, setDateRange] = useState('');
    const [fromToDate, setFromToDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [totalCategories, setTotalCategories] = useState(0);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [activeRowDropdown, setActiveRowDropdown] = useState(null);
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [exportModal, setExportModal] = useState({ open: false, type: '', data: null });

    const [newCategoryForm, setNewCategoryForm] = useState({
        name: '',
        type: '',
        description: ''
    });

    // Handle expense form submission
    const handleCreateExpense = async (e) => {
        // Add your expense creation logic here
    };

    // Mock data for expense categories
    const mockCategoriesData = [
        {
            id: '1',
            name: 'Office Supplies',
            type: 'direct expense',
            description: 'Stationery, printing materials, office equipment',
            total_expenses: 15000,
            budget: 20000,
            status: 'active',
            created_date: '2024-01-15',
            expense_count: 12
        },
        {
            id: '2',
            name: 'Employee Salaries',
            type: 'direct expense',
            description: 'Monthly salaries and wages for employees',
            total_expenses: 75000,
            budget: 80000,
            status: 'active',
            created_date: '2024-01-10',
            expense_count: 45
        },
        {
            id: '3',
            name: 'Marketing Campaign',
            type: 'indirect expense',
            description: 'Digital marketing, advertisements, promotions',
            total_expenses: 25000,
            budget: 30000,
            status: 'active',
            created_date: '2024-01-20',
            expense_count: 8
        },
        {
            id: '4',
            name: 'Business Travel',
            type: 'reimbursable expense',
            description: 'Travel expenses, accommodation, transportation',
            total_expenses: 18000,
            budget: 25000,
            status: 'active',
            created_date: '2024-01-05',
            expense_count: 15
        },
        {
            id: '5',
            name: 'Software Subscriptions',
            type: 'indirect expense',
            description: 'Monthly/annual software licenses and subscriptions',
            total_expenses: 12000,
            budget: 15000,
            status: 'active',
            created_date: '2024-01-12',
            expense_count: 22
        },
        {
            id: '6',
            name: 'Utilities & Rent',
            type: 'direct expense',
            description: 'Electricity, water, internet, office rent',
            total_expenses: 45000,
            budget: 50000,
            status: 'active',
            created_date: '2024-01-01',
            expense_count: 6
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

    // Initialize with current month date range
    useEffect(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = today;

        const formatDate = (date) => {
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '/');
        };

        const from = formatDate(firstDay);
        const to = formatDate(lastDay);

        setDateRange(`${from} - ${to}`);
        setFromToDate(`From ${from} to ${to}`);
        fetchCategoriesData(from, to);
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Format percentage for budget utilization
    const formatPercentage = (expenses, budget) => {
        return ((expenses / budget) * 100).toFixed(1);
    };

    // Simulate API call to fetch categories data
    const fetchCategoriesData = async (from, to) => {
        setLoading(true);

        setTimeout(() => {
            const categoriesData = mockCategoriesData;
            setCategories(categoriesData);

            const total = categoriesData.reduce((acc, item) => acc + item.total_expenses, 0);
            setTotalCategories(total);
            setLoading(false);
        }, 1500);
    };

    // Handle search
    const handleSearch = () => {
        const [from, to] = dateRange.split(' - ');
        setFromToDate(`From ${from} to ${to}`);
        fetchCategoriesData(from, to);
    };

    // Handle date filter change
    const handleDateFilterChange = (filter) => {
        console.log('Selected filter:', filter);
        if (filter.range) {
            setDateRange(filter.range);
            const [from, to] = filter.range.split(' - ');
            setFromToDate(`From ${from} to ${to}`);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategoryForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle new category form submission
    const handleCreateCategory = async (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            console.log('Creating new expense category:', newCategoryForm);

            // Add new category to the list
            const newCategory = {
                id: (categories.length + 1).toString(),
                name: newCategoryForm.name,
                type: newCategoryForm.type,
                description: newCategoryForm.description,
                total_expenses: 0,
                budget: 0,
                status: 'active',
                created_date: new Date().toISOString().split('T')[0],
                expense_count: 0
            };

            setCategories(prev => [...prev, newCategory]);
            setNewCategoryForm({ name: '', type: '', description: '' });
            setShowAddCategoryModal(false);

            const [from, to] = dateRange.split(' - ');
            fetchCategoriesData(from, to);

            alert('Expense category created successfully!');
        }, 1000);
    };

    // Handle export
    const handleExport = (type, data = null) => {
        setExportModal({ open: true, type, data });

        // Simulate export process
        setTimeout(() => {
            setExportModal({ open: false, type: '', data: null });
            alert(`${type.toUpperCase()} export completed successfully!`);
        }, 1500);
    };

    // Format expense type for display
    const formatExpenseType = (type) => {
        return type.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Handle category deletion
    const handleDeleteCategory = (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            setCategories(prev => prev.filter(cat => cat.id !== categoryId));
            setActiveRowDropdown(null);
            alert('Category deleted successfully!');
        }
    };

    // Toggle row dropdown
    const toggleRowDropdown = (categoryId) => {
        setActiveRowDropdown(activeRowDropdown === categoryId ? null : categoryId);
    };

    // Close all dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setShowAddDropdown(false);
                setActiveRowDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Skeleton loader component
    const SkeletonRow = () => (
        <tr className="border-b border-slate-100 animate-pulse">
            <td className="p-4">
                <div className="h-4 bg-slate-200 rounded w-8"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-slate-200 rounded w-32"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-slate-200 rounded w-40"></div>
            </td>
            <td className="p-4 text-right">
                <div className="h-6 bg-slate-200 rounded w-16 ml-auto"></div>
            </td>
            <td className="p-4 text-right">
                <div className="h-6 bg-slate-200 rounded w-16 ml-auto"></div>
            </td>
            <td className="p-4 text-center">
                <div className="h-6 bg-slate-200 rounded w-12 mx-auto"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-slate-200 rounded w-8 ml-auto"></div>
            </td>
        </tr>
    );

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden">
            {/* Fixed Header */}
            <Header
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                isMinimized={isMinimized}
                setIsMinimized={setIsMinimized}
            />
            
            {/* Fixed Sidebar */}
            <Sidebar
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                isMinimized={isMinimized}
                setIsMinimized={setIsMinimized}
            />

            {/* Main Content Area - Scrollable */}
            <div className={`pt-16 transition-all duration-300 ease-in-out h-screen overflow-hidden ${isMinimized ? 'md:pl-20' : 'md:pl-72'}`}>
                <div className="h-full overflow-y-auto p-4">
                    <div className="h-full flex flex-col">
                        {/* Main Card - Full height with scrolling */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
                            {/* Card Header */}
                            <div className="border-b border-slate-200 px-6 py-4">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div>
                                        <h5 className="text-xl font-bold text-slate-800 mb-1">
                                            Expense Categories
                                        </h5>
                                        {fromToDate && (
                                            <p className="text-slate-500 text-xs mt-1">
                                                {fromToDate}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                        {/* Date Filter Component */}
                                        <DateFilter onChange={handleDateFilterChange} />

                                        <div className="flex gap-2">
                                            {/* Export Dropdown */}
                                            <div className="dropdown-container relative">
                                                <motion.button
                                                    onClick={() => setShowAddDropdown(!showAddDropdown)}
                                                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <PiExportBold className="w-4 h-4" />
                                                    Export
                                                </motion.button>

                                                {showAddDropdown && (
                                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => handleExport('pdf')}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                            >
                                                                <PiFilePdfDuotone className="w-4 h-4 mr-3 text-red-500" />
                                                                Export as PDF
                                                            </button>
                                                            <button
                                                                onClick={() => handleExport('excel')}
                                                                className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                            >
                                                                <PiMicrosoftExcelLogoDuotone className="w-4 h-4 mr-3 text-green-500" />
                                                                Export as Excel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Add New Button */}
                                            <motion.button
                                                onClick={() => setShowCreateExpenseModal(true)}
                                                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FiPlus className="w-4 h-4" />
                                                Add New
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table Container with Fixed Header and Footer */}
                            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                                {/* Table Header - Fixed */}
                                <div className="border-b border-slate-200 shrink-0">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                                            <tr>
                                                <th className="text-left p-4 font-semibold text-slate-700">Sl</th>
                                                <th className="text-left p-4 font-semibold text-slate-700">Category Name</th>
                                                <th className="text-left p-4 font-semibold text-slate-700">Type</th>
                                                <th className="text-left p-4 font-semibold text-slate-700">Description</th>
                                                <th className="text-right p-4 font-semibold text-slate-700">Total Expenses</th>
                                                <th className="text-right p-4 font-semibold text-slate-700">Budget</th>
                                                <th className="text-center p-4 font-semibold text-slate-700">Utilization</th>
                                                <th className="text-center p-4 font-semibold text-slate-700">Actions</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>

                                {/* Scrollable Table Body */}
                                <div className="flex-1 overflow-y-auto min-h-0">
                                    <table className="w-full text-sm">
                                        <tbody className="bg-white">
                                            {loading ? (
                                                // Skeleton Loaders
                                                Array.from({ length: 6 }).map((_, index) => (
                                                    <SkeletonRow key={index} />
                                                ))
                                            ) : categories.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center py-8 text-slate-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FiFileText className="w-12 h-12 text-slate-300 mb-3" />
                                                            <p className="text-slate-500">No expense categories found</p>
                                                            <motion.button
                                                                onClick={() => setShowAddCategoryModal(true)}
                                                                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                Create Your First Category
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                categories.map((category, index) => {
                                                    const isDropdownOpen = activeRowDropdown === category.id;
                                                    const utilization = formatPercentage(category.total_expenses, category.budget);
                                                    const utilizationColor = utilization > 90 ? 'bg-red-500' : utilization > 75 ? 'bg-yellow-500' : 'bg-green-500';

                                                    return (
                                                        <tr
                                                            key={category.id}
                                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors group"
                                                        >
                                                            <td className="p-4 text-slate-600 font-medium">{index + 1}</td>
                                                            <td className="p-4">
                                                                <div className="text-slate-800 font-medium">
                                                                    {category.name}
                                                                </div>
                                                                <div className="text-xs text-slate-500 mt-1">
                                                                    {category.expense_count} expenses
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                                    {formatExpenseType(category.type)}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="text-slate-600 max-w-xs truncate">
                                                                    {category.description}
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <span className="font-semibold text-slate-800">
                                                                    ₹{formatCurrency(category.total_expenses)}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <span className="font-semibold text-slate-700">
                                                                    ₹{formatCurrency(category.budget)}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <div className="flex items-center justify-center space-x-2">
                                                                    <div className="w-16 bg-slate-200 rounded-full h-2">
                                                                        <div
                                                                            className={`h-2 rounded-full ${utilizationColor} transition-all duration-300`}
                                                                            style={{ width: `${Math.min(100, utilization)}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="text-xs font-medium text-slate-700 min-w-[35px]">
                                                                        {utilization}%
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="dropdown-container relative flex justify-center">
                                                                    <motion.button
                                                                        className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group-hover:bg-slate-200"
                                                                        onClick={() => toggleRowDropdown(category.id)}
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                    >
                                                                        <FiMenu className="w-4 h-4" />
                                                                    </motion.button>
                                                                    {isDropdownOpen && (
                                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                                                                            <div className="py-1">
                                                                                <a
                                                                                    href={`/edit-expense-category?category_id=${category.id}`}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <FiEdit className="w-4 h-4 mr-3" />
                                                                                    Edit Category
                                                                                </a>
                                                                                <a
                                                                                    href={`/view-expenses-by-category?category_id=${category.id}`}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <FiFileText className="w-4 h-4 mr-3" />
                                                                                    View Expenses
                                                                                </a>
                                                                                <button
                                                                                    onClick={() => handleDeleteCategory(category.id)}
                                                                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                                                >
                                                                                    <FiTrash2 className="w-4 h-4 mr-3" />
                                                                                    Delete Category
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
                                <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 shrink-0">
                                    <table className="w-full text-sm">
                                        <tfoot>
                                            <tr>
                                                <td className="text-right p-4 font-bold text-slate-800" colSpan="4">
                                                    Total Expenses Across All Categories
                                                </td>
                                                <td className="text-right p-4">
                                                    <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-lg min-w-[80px]">
                                                        ₹{formatCurrency(totalCategories)}
                                                    </span>
                                                </td>
                                                <td className="p-4"></td>
                                                <td className="p-4"></td>
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

            {/* Export Confirmation Modal */}
            {exportModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-auto transform transition-all duration-300 scale-95 animate-fade-in">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <PiExportBold className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                Exporting {exportModal.type.toUpperCase()}
                            </h3>
                            <p className="text-slate-600 mb-6">
                                Your {exportModal.type} export is being processed...
                            </p>
                            <div className="flex justify-center space-x-3">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <CreateExpenseModal
                isOpen={showCreateExpenseModal}
                onClose={() => setShowCreateExpenseModal(false)}
                onSubmit={handleCreateExpense}
                loading={loading}
            />
        </div>
    );
};

export default ExpenseDetails;