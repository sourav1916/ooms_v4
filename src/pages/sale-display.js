import React, { useState, useEffect, useCallback } from 'react';
import {
    FiSearch,
    FiPlus,
    FiSettings,
    FiEdit,
    FiFileText,
    FiDollarSign,
    FiUsers,
    FiUser,
    FiCreditCard,
    FiX,
    FiMenu,
    FiPrinter,
    FiMail,
    FiMessageSquare,
    FiChevronRight,
    FiTrendingUp,
    FiFilter,
    FiChevronDown,
    FiChevronUp,
    FiChevronLeft,
    FiChevronRight as FiChevronRightIcon,
    FiEye,
    FiInfo,
    FiCalendar,
    FiHash,
    FiTag,
    FiHome,
    FiBriefcase,
    FiPercent,
    FiPlusCircle
} from 'react-icons/fi';
import { PiExportBold } from "react-icons/pi";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import { FaWhatsapp } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import { Header, Sidebar } from '../components/header';
import EmailSelectionModal from '../components/email-selection';
import MobileSelectionModal from '../components/mobile-selection';
import SaleForm from '../components/sales-form';
import DateFilter from '../components/DateFilter';
import API_BASE_URL from '../utils/api-controller';
import getHeaders from '../utils/get-headers';
import axios from 'axios';

const ViewSales = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('');
    const [fromToDate, setFromToDate] = useState('');
    const [sales, setSales] = useState([]);
    const [saleFormModal, setSaleFormModal] = useState(false);
    const [summary, setSummary] = useState({
        total: 0,
        tax: 0,
        grand_total: 0
    });

    // View Modal State
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // State for dropdown menus
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [activeRowDropdown, setActiveRowDropdown] = useState(null);
    const [exportModal, setExportModal] = useState({ open: false, type: '', data: null });

    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState('');

    const [isWhatsappModalOpen, setWhatsappModalOpen] = useState(false);
    const [selectedWhatsapp, setSelectedWhatsapp] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showAll, setShowAll] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const [apiStats, setApiStats] = useState(null);

    // Debounce search term
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    // Reset to first page when search term changes
    useEffect(() => {
        setCurrentPage(1);
        setShowAll(false);
    }, [debouncedSearchTerm, dateRange]);

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

    // Lock body scroll when view modal is open
    useEffect(() => {
        if (viewModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [viewModalOpen]);

    // Format date for API
    const formatDateForAPI = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    };

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
    }, []);

    // Fetch sales data from API
    const fetchSalesData = useCallback(async () => {
        if (!dateRange) return;

        setLoading(true);

        try {
            const [from, to] = dateRange.split(' - ');
            const fromDateFormatted = formatDateForAPI(from);
            const toDateFormatted = formatDateForAPI(to);

            // Determine pagination parameters
            const page = showAll ? 1 : currentPage;
            const limit = showAll ? 1000 : itemsPerPage;

            const params = {
                page_no: page,
                limit: limit,
                from_date: fromDateFormatted,
                to_date: toDateFormatted,
                search: debouncedSearchTerm || ''
            };

            // Get headers with authentication
            const headers = await getHeaders();
            
            const response = await axios.get(`${API_BASE_URL}/sale/list`, { 
                params,
                headers 
            });

            if (response.data.success) {
                const salesData = response.data.data;
                setSales(salesData);
                setTotalRecords(response.data.meta.total);
                setIsLastPage(response.data.meta.is_last_page);
                setApiStats(response.data.stats);

                // Calculate summary from stats if available
                if (response.data.stats) {
                    setSummary({
                        total: parseFloat(response.data.stats.amount) || 0,
                        tax: 0,
                        grand_total: parseFloat(response.data.stats.amount) || 0
                    });
                } else {
                    // Calculate summary from sales data if stats not provided
                    const summaryData = salesData.reduce((acc, sale) => ({
                        total: acc.total + parseFloat(sale.calculation?.total || sale.amount || 0),
                        tax: acc.tax + parseFloat(sale.calculation?.gst_value || 0),
                        grand_total: acc.grand_total + parseFloat(sale.calculation?.grand_total || sale.amount || 0)
                    }), { total: 0, tax: 0, grand_total: 0 });
                    setSummary(summaryData);
                }
            } else {
                console.error('API returned success false');
                setSales([]);
                setTotalRecords(0);
            }
        } catch (error) {
            console.error('Error fetching sales data:', error);
            setSales([]);
            setTotalRecords(0);
            
            if (error.response) {
                if (error.response.status === 401) {
                    console.error('Unauthorized access - please login again');
                } else if (error.response.status === 404) {
                    console.error('API endpoint not found');
                } else {
                    console.error('Server error:', error.response.status);
                }
            } else if (error.request) {
                console.error('Network error - no response received');
            } else {
                console.error('Error setting up request:', error.message);
            }
        } finally {
            setLoading(false);
        }
    }, [dateRange, debouncedSearchTerm, currentPage, itemsPerPage, showAll]);

    // Fetch data when dependencies change
    useEffect(() => {
        fetchSalesData();
    }, [fetchSalesData]);

    // Handle view sale details
    const handleViewSale = (sale) => {
        setSelectedSale(sale);
        setViewModalOpen(true);
        setActiveRowDropdown(null);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle search button click
    const handleSearch = () => {
        fetchSalesData();
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

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        const newLimit = parseInt(e.target.value);
        setItemsPerPage(newLimit);
        setCurrentPage(1);
        setShowAll(false);
    };

    // Handle show all toggle
    const handleShowAll = () => {
        setShowAll(true);
        setCurrentPage(1);
    };

    const handleShowLess = () => {
        setShowAll(false);
        setCurrentPage(1);
    };

    const handleSaleSuccess = (saleData) => {
        console.log('Sale created successfully:', saleData);
        fetchSalesData();
    };

    const handleEmailSubmit = (email) => {
        setSelectedEmail(email);
        setIsEmailModalOpen(false);
        console.log('Selected email:', email);
    };

    const handleWhatsappSubmit = (number) => {
        setSelectedWhatsapp(number);
        setWhatsappModalOpen(false);
        console.log('Selected number:', number);
    };

    const handleExport = async (type, data = null) => {
        setExportModal({ open: true, type, data });

        try {
            const headers = await getHeaders();
            
            const exportData = {
                type: type,
                data: data || sales,
                date_range: dateRange,
                search: searchTerm
            };

            const response = await axios.post(`${API_BASE_URL}/sale/export`, exportData, {
                headers,
                responseType: type === 'pdf' ? 'blob' : 'json'
            });

            if (type === 'pdf') {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `sales_report_${new Date().toISOString()}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } else if (type === 'excel') {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `sales_report_${new Date().toISOString()}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } else {
                alert(`${type.toUpperCase()} export completed successfully!`);
            }
        } catch (error) {
            console.error(`Error exporting ${type}:`, error);
            alert(`Failed to export ${type}. Please try again.`);
        } finally {
            setTimeout(() => {
                setExportModal({ open: false, type: '', data: null });
            }, 1500);
        }
    };

    // Get edit link and invoice link based on sale_type
    const getActionLinks = (sale) => {
        let editLink = '';
        let invoiceLink = '';

        switch (sale.sale_type) {
            case 'client':
                editLink = `/edit-sale-client?redirect=${window.location.href}&invoice_id=${sale.invoice_id}`;
                invoiceLink = `/preview-invoice-sale?invoice_id=${sale.invoice_id}`;
                break;
            case 'bank':
                editLink = `/edit-sale-bank?redirect=${window.location.href}&invoice_id=${sale.invoice_id}`;
                invoiceLink = `/preview-invoice-sale?invoice_id=${sale.invoice_id}`;
                break;
            default:
                editLink = '#';
                invoiceLink = '#';
        }

        return { editLink, invoiceLink };
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Format date with time
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return '0.00';
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numAmount);
    };

    // Get sale party name
    const getSalePartyName = (sale) => {
        if (sale.sale_type === 'client' && sale.sale_party) {
            return sale.sale_party.name || '';
        }
        if (sale.sale_type === 'bank' && sale.sale_party) {
            return sale.sale_party.holder || sale.sale_party.bank || '';
        }
        return '';
    };

    // Get sale type display name
    const getSaleTypeDisplay = (saleType) => {
        const typeMap = {
            'client': 'Client',
            'bank': 'Bank',
            'cash': 'Cash',
            'savings': 'Savings',
            'current': 'Current',
            'loan': 'Loan',
            'capital': 'Capital'
        };
        return typeMap[saleType] || saleType;
    };

    // Get sale party details for display
    const getSalePartyDetails = (sale) => {
        if (sale.sale_type === 'client' && sale.sale_party) {
            return {
                name: sale.sale_party.name,
                email: sale.sale_party.email,
                mobile: sale.sale_party.mobile,
                username: sale.sale_party.username
            };
        }
        if (sale.sale_type === 'bank' && sale.sale_party) {
            return {
                name: sale.sale_party.holder,
                bank: sale.sale_party.bank,
                account_no: sale.sale_party.account_no,
                ifsc: sale.sale_party.ifsc,
                branch: sale.sale_party.branch,
                type: sale.sale_party.type
            };
        }
        return null;
    };

    // Toggle row dropdown
    const toggleRowDropdown = (invoiceId) => {
        setActiveRowDropdown(activeRowDropdown === invoiceId ? null : invoiceId);
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

    // Get current items based on pagination
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = showAll ? sales.length : currentPage * itemsPerPage;
    const currentItems = showAll ? sales : sales.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    // Calculate paginated summary
    const paginatedSummary = currentItems.reduce((acc, sale) => ({
        total: acc.total + parseFloat(sale.calculation?.total || sale.amount || 0),
        tax: acc.tax + parseFloat(sale.calculation?.gst_value || 0),
        grand_total: acc.grand_total + parseFloat(sale.calculation?.grand_total || sale.amount || 0)
    }), { total: 0, tax: 0, grand_total: 0 });

    // Skeleton loader component
    const SkeletonRow = () => (
        <tr className="border-b border-slate-100 animate-pulse">
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-6 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-16 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-24 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-4 bg-slate-200 rounded w-16 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-6 bg-slate-200 rounded w-16 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-6 bg-slate-200 rounded w-16 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-6 bg-slate-200 rounded w-16 mx-auto"></div>
            </td>
            <td className="p-3 text-center">
                <div className="h-6 bg-slate-200 rounded w-10 mx-auto"></div>
            </td>
        </tr>
    );

    // Skeleton Loading Component for full page
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
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-10 bg-gray-200 rounded w-40"></div>
                                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="border-b border-slate-200">
                                <table className="w-full text-sm">
                                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                                        <tr>
                                            {[...Array(8)].map((_, i) => (
                                                <th key={i} className="text-center p-3">
                                                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div className="p-4">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="h-12 bg-gray-100 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // View Modal Component
    const ViewSaleModal = () => {
        if (!selectedSale) return null;

        const partyDetails = getSalePartyDetails(selectedSale);
        const calculation = selectedSale.calculation || {};
        
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => setViewModalOpen(false)}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-2xl">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <FiFileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Sale Details</h2>
                                    <p className="text-blue-100 text-sm">Invoice #{selectedSale.invoice_no}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewModalOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-slate-600 mb-2">
                                    <FiCalendar className="w-4 h-4" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Transaction Date</span>
                                </div>
                                <p className="text-slate-800 font-semibold">{formatDateTime(selectedSale.transaction_date)}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-slate-600 mb-2">
                                    <FiHash className="w-4 h-4" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Transaction ID</span>
                                </div>
                                <p className="text-slate-800 font-mono text-sm break-all">{selectedSale.transaction_id}</p>
                            </div>
                        </div>

                        {/* Party Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <FiUsers className="w-4 h-4 text-blue-600" />
                                Party Information
                            </h3>
                            <div className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-4 border border-slate-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Sale Type</p>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                            selectedSale.sale_type === 'client' ? 'bg-blue-100 text-blue-700' :
                                            selectedSale.sale_type === 'bank' ? 'bg-amber-100 text-amber-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                            {getSaleTypeDisplay(selectedSale.sale_type)}
                                        </span>
                                    </div>
                                    {partyDetails && (
                                        <>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Name</p>
                                                <p className="text-slate-800 font-medium">{partyDetails.name || 'N/A'}</p>
                                            </div>
                                            {partyDetails.email && (
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-1">Email</p>
                                                    <p className="text-slate-800">{partyDetails.email}</p>
                                                </div>
                                            )}
                                            {partyDetails.mobile && (
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-1">Mobile</p>
                                                    <p className="text-slate-800">{partyDetails.mobile}</p>
                                                </div>
                                            )}
                                            {partyDetails.bank && (
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-1">Bank</p>
                                                    <p className="text-slate-800">{partyDetails.bank}</p>
                                                </div>
                                            )}
                                            {partyDetails.account_no && (
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-1">Account No</p>
                                                    <p className="text-slate-800 font-mono">{partyDetails.account_no}</p>
                                                </div>
                                            )}
                                            {partyDetails.ifsc && (
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-1">IFSC Code</p>
                                                    <p className="text-slate-800 font-mono">{partyDetails.ifsc}</p>
                                                </div>
                                            )}
                                            {partyDetails.branch && (
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-1">Branch</p>
                                                    <p className="text-slate-800">{partyDetails.branch}</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Calculation Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <FiDollarSign className="w-4 h-4 text-green-600" />
                                Financial Details
                            </h3>
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Subtotal</p>
                                        <p className="text-lg font-bold text-green-700">₹{formatCurrency(calculation.subtotal || selectedSale.amount || 0)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Tax Rate</p>
                                        <p className="text-slate-800 font-medium">{calculation.tax_rate || '0'}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">GST Value</p>
                                        <p className="text-lg font-bold text-amber-600">₹{formatCurrency(calculation.gst_value || 0)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Discount Type</p>
                                        <p className="text-slate-800 capitalize">{calculation.discount_type || 'Not Applicable'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Discount Value</p>
                                        <p className="text-slate-800">₹{formatCurrency(calculation.discount_value || 0)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Additional Charges</p>
                                        <p className="text-slate-800">₹{formatCurrency(calculation.additional_charge || 0)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Round Off</p>
                                        <p className="text-slate-800">₹{formatCurrency(calculation.round_off || 0)}</p>
                                    </div>
                                    <div className="md:col-span-2 lg:col-span-3">
                                        <p className="text-xs text-slate-500 mb-1">Grand Total</p>
                                        <p className="text-2xl font-bold text-blue-600">₹{formatCurrency(calculation.grand_total || selectedSale.amount || 0)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Remark */}
                        {selectedSale.remark && (
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                    <FiMessageSquare className="w-4 h-4 text-purple-600" />
                                    Remarks
                                </h3>
                                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                    <p className="text-slate-700 italic">"{selectedSale.remark}"</p>
                                </div>
                            </div>
                        )}

                        {/* Created/Modified By */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {selectedSale.create_by && (
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                        <FiUser className="w-3 h-3" />
                                        Created By
                                    </p>
                                    <p className="font-medium text-slate-800">{selectedSale.create_by.name}</p>
                                    <p className="text-xs text-slate-500">{selectedSale.create_by.email}</p>
                                    <p className="text-xs text-slate-500">{selectedSale.create_by.mobile}</p>
                                </div>
                            )}
                            {selectedSale.modify_by && selectedSale.modify_by !== selectedSale.create_by && (
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                        <FiEdit className="w-3 h-3" />
                                        Last Modified By
                                    </p>
                                    <p className="font-medium text-slate-800">{selectedSale.modify_by.name}</p>
                                    <p className="text-xs text-slate-500">{selectedSale.modify_by.email}</p>
                                    <p className="text-xs text-slate-500">{selectedSale.modify_by.mobile}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="sticky bottom-0 bg-slate-50 px-6 py-4 rounded-b-2xl border-t border-slate-200 flex justify-end gap-3">
                        <button
                            onClick={() => setViewModalOpen(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => {
                                const { editLink } = getActionLinks(selectedSale);
                                if (editLink && editLink !== '#') {
                                    window.location.href = editLink;
                                }
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <FiEdit className="w-4 h-4" />
                            Edit Sale
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    // Show skeleton while loading
    if (loading && sales.length === 0) {
        return <SkeletonLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

            {/* Main Content Area - Full Page Scroll */}
            <div className={`pt-16 transition-all duration-300 ease-in-out ${isMinimized ? 'md:pl-20' : 'md:pl-72'}`}>
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Header Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-xs font-medium">Total Value</p>
                                    <h3 className="text-lg font-bold mt-1">₹{formatCurrency(summary.total)}</h3>
                                    {apiStats && (
                                        <p className="text-blue-100 text-[10px] mt-1">
                                            {apiStats.count} transactions
                                        </p>
                                    )}
                                </div>
                                <FiDollarSign className="w-5 h-5 opacity-80" />
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-4 text-white shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-emerald-100 text-xs font-medium">Total Tax</p>
                                    <h3 className="text-lg font-bold mt-1">₹{formatCurrency(summary.tax)}</h3>
                                </div>
                                <FiTrendingUp className="w-5 h-5 opacity-80" />
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.2 }}
                            className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg p-4 text-white shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-violet-100 text-xs font-medium">Grand Total</p>
                                    <h3 className="text-lg font-bold mt-1">₹{formatCurrency(summary.grand_total)}</h3>
                                </div>
                                <FiCreditCard className="w-5 h-5 opacity-80" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Card */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow-lg border border-slate-200"
                    >
                        {/* Card Header */}
                        <div className="border-b border-slate-200 px-6 py-4 bg-gradient-to-r from-slate-50 to-white sticky top-0 z-10">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1.5 bg-blue-100 rounded-lg">
                                            <FiDollarSign className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <h5 className="text-lg font-bold text-slate-800">
                                            Sale Register
                                        </h5>
                                    </div>
                                    {fromToDate && (
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <FiFilter className="w-3 h-3" />
                                            <p className="text-xs font-medium">
                                                {fromToDate}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                    {/* Search Input */}
                                    <div className="relative w-full lg:w-64">
                                        <input
                                            type="text"
                                            placeholder="Search by invoice no, party name..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    </div>

                                    {/* Date Filter Component */}
                                    <div className="w-full lg:w-auto">
                                        <DateFilter onChange={handleDateFilterChange} />
                                    </div>

                                    <div className="flex gap-2">
                                        {/* Export Dropdown */}
                                        <div className="dropdown-container relative">
                                            <motion.button
                                                onClick={() => setShowAddDropdown(!showAddDropdown)}
                                                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <PiExportBold className="w-4 h-4" />
                                                Export
                                                <FiChevronRight className={`w-3 h-3 transition-transform ${showAddDropdown ? 'rotate-90' : ''}`} />
                                            </motion.button>

                                            <AnimatePresence>
                                                {showAddDropdown && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 5 }}
                                                        className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden"
                                                    >
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => handleExport('pdf')}
                                                                className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-all duration-150 group"
                                                            >
                                                                <div className="p-1.5 bg-red-50 rounded mr-2 group-hover:bg-red-100 transition-colors">
                                                                    <PiFilePdfDuotone className="w-3.5 h-3.5 text-red-500" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="font-medium text-xs">Export as PDF</div>
                                                                </div>
                                                            </button>
                                                            <button
                                                                onClick={() => handleExport('excel')}
                                                                className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-all duration-150 group"
                                                            >
                                                                <div className="p-1.5 bg-green-50 rounded mr-2 group-hover:bg-green-100 transition-colors">
                                                                    <PiMicrosoftExcelLogoDuotone className="w-3.5 h-3.5 text-green-500" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="font-medium text-xs">Export as Excel</div>
                                                                </div>
                                                            </button>
                                                            <button
                                                                onClick={() => setWhatsappModalOpen(true)}
                                                                className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-all duration-150 group"
                                                            >
                                                                <div className="p-1.5 bg-green-50 rounded mr-2 group-hover:bg-green-100 transition-colors">
                                                                    <FaWhatsapp className="w-3.5 h-3.5 text-green-500" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="font-medium text-xs">Share via WhatsApp</div>
                                                                </div>
                                                            </button>
                                                            <button
                                                                onClick={() => setIsEmailModalOpen(true)}
                                                                className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-all duration-150 group"
                                                            >
                                                                <div className="p-1.5 bg-blue-50 rounded mr-2 group-hover:bg-blue-100 transition-colors">
                                                                    <AiOutlineMail className="w-3.5 h-3.5 text-blue-500" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="font-medium text-xs">Share via Email</div>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <motion.button
                                            onClick={() => setSaleFormModal(true)}
                                            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FiPlus className="w-4 h-4" />
                                            Add Sale
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[60px]">
                                            Sl No
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[80px]">
                                            Date
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[200px]">
                                            Particulars
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[120px]">
                                            Invoice No
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[100px]">
                                            Total Value
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[100px]">
                                            Tax
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[100px]">
                                            Grand Total
                                        </th>
                                        <th className="text-center p-3 font-semibold text-slate-700 text-[10px] uppercase tracking-wider min-w-[80px]">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {loading ? (
                                        [...Array(5)].map((_, index) => (
                                            <SkeletonRow key={index} />
                                        ))
                                    ) : currentItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-8 text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="p-3 bg-slate-100 rounded-full mb-3">
                                                        <FiFileText className="w-8 h-8 text-slate-400" />
                                                    </div>
                                                    <p className="text-slate-600 text-sm font-medium mb-1">No sales records found</p>
                                                    <p className="text-slate-500 text-xs mb-4">Try adjusting your search or date filter</p>
                                                    <motion.button
                                                        onClick={() => setSaleFormModal(true)}
                                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-semibold hover:shadow transition-all duration-200"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        Create Your First Sale
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((sale, index) => {
                                            const { editLink, invoiceLink } = getActionLinks(sale);
                                            const isDropdownOpen = activeRowDropdown === sale.invoice_id;
                                            const actualIndex = showAll ? index : (currentPage - 1) * itemsPerPage + index;
                                            const partyDetails = getSalePartyDetails(sale);

                                            return (
                                                <motion.tr
                                                    key={sale.invoice_id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="hover:bg-blue-50/20 transition-colors duration-150"
                                                >
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="text-slate-700 font-medium text-xs">
                                                            {actualIndex + 1}
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="font-medium text-slate-700 text-xs">
                                                            {formatDate(sale.transaction_date)}
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="mx-auto max-w-[200px]">
                                                            <div className="text-slate-800 font-semibold text-xs">
                                                                {getSalePartyName(sale) || 'N/A'}
                                                            </div>
                                                            <div className="flex flex-col items-center gap-1 mt-1">
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                                                                    sale.sale_type === 'client' ? 'bg-blue-100 text-blue-700' :
                                                                    sale.sale_type === 'bank' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-slate-100 text-slate-700'
                                                                }`}>
                                                                    {getSaleTypeDisplay(sale.sale_type)}
                                                                </span>
                                                                {partyDetails && partyDetails.mobile && (
                                                                    <span className="text-slate-500 text-[10px]">
                                                                        {partyDetails.mobile}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {sale.remark && (
                                                                <div className="text-slate-500 text-[10px] text-center mt-1 italic truncate">
                                                                    "{sale.remark}"
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <span className="inline-flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded text-xs border border-slate-300/50 shadow-xs">
                                                            {sale.invoice_no}
                                                        </span>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <span className="inline-flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100 text-green-800 font-bold px-3 py-1.5 rounded text-xs min-w-[90px] shadow-xs">
                                                            ₹{formatCurrency(sale.calculation?.total || sale.amount || 0)}
                                                        </span>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <span className="inline-flex items-center justify-center bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 font-bold px-3 py-1.5 rounded text-xs min-w-[90px] shadow-xs">
                                                            ₹{formatCurrency(sale.calculation?.gst_value || 0)}
                                                        </span>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <span className="inline-flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 font-bold px-3 py-1.5 rounded text-xs min-w-[90px] shadow-xs">
                                                            ₹{formatCurrency(sale.calculation?.grand_total || sale.amount || 0)}
                                                        </span>
                                                    </td>
                                                    <td className="text-center p-3 align-middle">
                                                        <div className="dropdown-container relative flex justify-center">
                                                            <motion.button
                                                                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-150 border border-slate-200 hover:border-blue-300"
                                                                onClick={() => toggleRowDropdown(sale.invoice_id)}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <FiMenu className="w-3.5 h-3.5" />
                                                            </motion.button>
                                                            <AnimatePresence>
                                                                {isDropdownOpen && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 5 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, y: 5 }}
                                                                        className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden"
                                                                    >
                                                                        <div className="py-1">
                                                                            <button
                                                                                onClick={() => handleViewSale(sale)}
                                                                                className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                            >
                                                                                <div className="p-1 bg-blue-50 rounded mr-2">
                                                                                    <FiEye className="w-3 h-3 text-blue-500" />
                                                                                </div>
                                                                                <div className="text-left">
                                                                                    <div className="font-medium">View Details</div>
                                                                                </div>
                                                                            </button>
                                                                            <a
                                                                                href={editLink}
                                                                                className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                onClick={() => setActiveRowDropdown(null)}
                                                                            >
                                                                                <div className="p-1 bg-blue-50 rounded mr-2">
                                                                                    <FiEdit className="w-3 h-3 text-blue-500" />
                                                                                </div>
                                                                                <div className="text-left">
                                                                                    <div className="font-medium">Edit Sale</div>
                                                                                </div>
                                                                            </a>
                                                                            {invoiceLink && (
                                                                                <a
                                                                                    href={invoiceLink}
                                                                                    className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <div className="p-1 bg-slate-50 rounded mr-2">
                                                                                        <FiFileText className="w-3 h-3 text-slate-600" />
                                                                                    </div>
                                                                                    <div className="text-left">
                                                                                        <div className="font-medium">View Invoice</div>
                                                                                    </div>
                                                                                </a>
                                                                            )}
                                                                            <div className="border-t border-slate-100 mt-1 pt-1">
                                                                                <button
                                                                                    className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                    onClick={() => handleExport('print', sale)}
                                                                                >
                                                                                    <div className="p-1 bg-slate-50 rounded mr-2">
                                                                                        <FiPrinter className="w-3 h-3 text-slate-600" />
                                                                                    </div>
                                                                                    <div className="text-left">
                                                                                        <div className="font-medium">Print</div>
                                                                                    </div>
                                                                                </button>
                                                                                <button
                                                                                    className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                    onClick={() => handleExport('whatsapp', sale)}
                                                                                >
                                                                                    <div className="p-1 bg-green-50 rounded mr-2">
                                                                                        <FaWhatsapp className="w-3 h-3 text-green-500" />
                                                                                    </div>
                                                                                    <div className="text-left">
                                                                                        <div className="font-medium">WhatsApp</div>
                                                                                    </div>
                                                                                </button>
                                                                                <button
                                                                                    className="flex items-center w-full px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 transition-colors duration-150"
                                                                                    onClick={() => handleExport('email', sale)}
                                                                                >
                                                                                    <div className="p-1 bg-blue-50 rounded mr-2">
                                                                                        <FiMail className="w-3 h-3 text-blue-500" />
                                                                                    </div>
                                                                                    <div className="text-left">
                                                                                        <div className="font-medium">Email</div>
                                                                                    </div>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            {!loading && totalRecords > itemsPerPage && !showAll && (
                                <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                                    <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 gap-3">
                                        <div className="text-xs text-slate-600">
                                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalRecords)} of {totalRecords} entries
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={itemsPerPage}
                                                onChange={handleItemsPerPageChange}
                                                className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value={10}>10 per page</option>
                                                <option value={25}>25 per page</option>
                                                <option value={50}>50 per page</option>
                                                <option value={100}>100 per page</option>
                                            </select>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                            >
                                                <FiChevronLeft className="w-3 h-3" />
                                                Previous
                                            </button>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    let pageNumber;
                                                    if (totalPages <= 5) {
                                                        pageNumber = i + 1;
                                                    } else if (currentPage <= 3) {
                                                        pageNumber = i + 1;
                                                    } else if (currentPage >= totalPages - 2) {
                                                        pageNumber = totalPages - 4 + i;
                                                    } else {
                                                        pageNumber = currentPage - 2 + i;
                                                    }
                                                    
                                                    return (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => setCurrentPage(pageNumber)}
                                                            className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                                                                currentPage === pageNumber
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                                                            }`}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages || isLastPage}
                                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                            >
                                                Next
                                                <FiChevronRightIcon className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={handleShowAll}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
                                            >
                                                Show All
                                                <FiChevronDown className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Show Less Button when showing all */}
                            {!loading && showAll && totalRecords > itemsPerPage && (
                                <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                                    <div className="flex justify-center px-4 py-3">
                                        <button
                                            onClick={handleShowLess}
                                            className="flex items-center gap-1 px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors shadow-sm"
                                        >
                                            Show Less
                                            <FiChevronUp className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Modals */}
            <SaleForm
                isOpen={saleFormModal}
                onClose={() => setSaleFormModal(false)}
                onSuccess={handleSaleSuccess}
                mode="modal"
            />

            <EmailSelectionModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                onSubmit={handleEmailSubmit}
            />

            <MobileSelectionModal
                isOpen={isWhatsappModalOpen}
                onClose={() => setWhatsappModalOpen(false)}
                onSubmit={handleWhatsappSubmit}
            />

            {/* View Sale Modal */}
            <AnimatePresence>
                {viewModalOpen && <ViewSaleModal />}
            </AnimatePresence>

            {/* Export Confirmation Modal */}
            <AnimatePresence>
                {exportModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="bg-white rounded-xl p-6 max-w-sm w-full mx-auto shadow-xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <PiExportBold className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">
                                    Exporting {exportModal.type.toUpperCase()}
                                </h3>
                                <p className="text-slate-600 mb-6 text-sm">
                                    Your {exportModal.type} export is being processed...
                                </p>
                                <div className="flex justify-center space-x-2 mb-6">
                                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <div className="text-xs text-slate-500">
                                    This will only take a moment...
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ViewSales;