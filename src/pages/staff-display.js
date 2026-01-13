import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    FiSearch,
    FiSettings,
    FiUserCheck,
    FiDollarSign,
    FiGift,
    FiCreditCard,
    FiTrendingUp,
    FiUser,
    FiPlus,
    FiEdit,
    FiTrash2,
    FiX,
    FiMail,
    FiPhone,
    FiCalendar,
    FiMapPin
} from 'react-icons/fi';
import { IoTrash } from "react-icons/io5";
import { Header, Sidebar } from '../components/header';

const ViewStaff = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [loading, setLoading] = useState(false);
    const [staff, setStaff] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
    const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
    const [isDeleteStaffModalOpen, setIsDeleteStaffModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    // Form states
    const [staffForm, setStaffForm] = useState({
        name: '',
        guardian_name: '',
        mobile: '',
        email: '',
        designation: '',
        address: '',
        salary: '',
        joining_date: new Date().toISOString().split('T')[0],
        emergency_contact: '',
        bank_account: '',
        ifsc_code: '',
        pan_number: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Extended mock staff data
    const mockStaffData = [
        {
            id: '1',
            username: 'staff001',
            name: 'John Doe',
            guardian_name: 'Robert Doe',
            mobile: '+91 9876543210',
            email: 'john.doe@company.com',
            designation: 'senior developer',
            loan: '15000',
            balance: '25000',
            address: '123 Main Street, Bangalore, Karnataka',
            salary: '75000',
            joining_date: '2023-01-15',
            emergency_contact: '+91 9876543299',
            bank_account: '123456789012',
            ifsc_code: 'HDFC0001234',
            pan_number: 'ABCDE1234F'
        },
        {
            id: '2',
            username: 'staff002',
            name: 'Jane Smith',
            guardian_name: 'William Smith',
            mobile: '+91 9876543211',
            email: 'jane.smith@company.com',
            designation: 'project manager',
            loan: '10000',
            balance: '18500',
            address: '456 Oak Avenue, Mumbai, Maharashtra',
            salary: '85000',
            joining_date: '2023-02-20',
            emergency_contact: '+91 9876543298',
            bank_account: '234567890123',
            ifsc_code: 'ICIC0005678',
            pan_number: 'XYZAB5678G'
        },
        // ... (other staff data remains the same)
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
        fetchStaffData();
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Simulate API call to fetch staff data
    const fetchStaffData = async () => {
        setLoading(true);
        
        setTimeout(() => {
            setStaff(mockStaffData);
            setLoading(false);
        }, 1000);
    };

    // Handle search
    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setStaff(mockStaffData);
            return;
        }

        const filteredData = mockStaffData.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.mobile.includes(searchQuery) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.guardian_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setStaff(filteredData);
    };

    // Handle search input change with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== '') {
                handleSearch();
            } else {
                setStaff(mockStaffData);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle key press in search input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // State for dropdown menus
    const [activeRowDropdown, setActiveRowDropdown] = useState(null);

    // Toggle row dropdown
    const toggleRowDropdown = (username) => {
        setActiveRowDropdown(activeRowDropdown === username ? null : username);
    };

    // Close all dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setActiveRowDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle add staff
    const handleAddStaff = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Generate new staff ID and username
            const newId = (mockStaffData.length + 1).toString();
            const newUsername = `staff${String(newId).padStart(3, '0')}`;
            
            const newStaff = {
                id: newId,
                username: newUsername,
                ...staffForm,
                loan: '0',
                balance: '0'
            };

            // Add to staff list
            setStaff(prev => [newStaff, ...prev]);
            
            // Close modal and reset form
            setIsAddStaffModalOpen(false);
            resetForm();
            
            console.log('Staff added successfully:', newStaff);
        } catch (error) {
            console.error('Error adding staff:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle edit staff
    const handleEditStaff = async (e) => {
        e.preventDefault();
        if (isSubmitting || !selectedStaff) return;

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setStaff(prev => prev.map(staffMember => 
                staffMember.id === selectedStaff.id 
                    ? { ...staffMember, ...staffForm }
                    : staffMember
            ));
            
            setIsEditStaffModalOpen(false);
            resetForm();
            
            console.log('Staff updated successfully:', selectedStaff.id);
        } catch (error) {
            console.error('Error updating staff:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete staff
    const handleDeleteStaff = async () => {
        if (isSubmitting || !selectedStaff) return;

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setStaff(prev => prev.filter(staffMember => staffMember.id !== selectedStaff.id));
            setIsDeleteStaffModalOpen(false);
            
            console.log('Staff deleted successfully:', selectedStaff.id);
        } catch (error) {
            console.error('Error deleting staff:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open edit modal
    const openEditModal = (staffMember) => {
        setSelectedStaff(staffMember);
        setStaffForm({
            name: staffMember.name,
            guardian_name: staffMember.guardian_name,
            mobile: staffMember.mobile,
            email: staffMember.email,
            designation: staffMember.designation,
            address: staffMember.address,
            salary: staffMember.salary,
            joining_date: staffMember.joining_date,
            emergency_contact: staffMember.emergency_contact || '',
            bank_account: staffMember.bank_account || '',
            ifsc_code: staffMember.ifsc_code || '',
            pan_number: staffMember.pan_number || ''
        });
        setIsEditStaffModalOpen(true);
    };

    // Open delete modal
    const openDeleteModal = (staffMember) => {
        setSelectedStaff(staffMember);
        setIsDeleteStaffModalOpen(true);
    };

    // Reset form
    const resetForm = () => {
        setStaffForm({
            name: '',
            guardian_name: '',
            mobile: '',
            email: '',
            designation: '',
            address: '',
            salary: '',
            joining_date: new Date().toISOString().split('T')[0],
            emergency_contact: '',
            bank_account: '',
            ifsc_code: '',
            pan_number: ''
        });
        setSelectedStaff(null);
    };

    // Calculate totals
    const totalLoan = staff.reduce((acc, member) => acc + parseInt(member.loan || 0), 0);
    const totalBalance = staff.reduce((acc, member) => acc + parseInt(member.balance || 0), 0);
    const totalSalary = staff.reduce((acc, member) => acc + parseInt(member.salary || 0), 0);

    // Skeleton loader component
    const SkeletonRow = () => (
        <tr className="border-b border-gray-100 animate-pulse">
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-gray-200 rounded w-16 ml-auto"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-gray-200 rounded w-16 ml-auto"></div>
            </td>
            <td className="p-4">
                <div className="h-6 bg-gray-200 rounded w-8 ml-auto"></div>
            </td>
        </tr>
    );

    // Professional Modal Wrapper Component
    const ModalWrapper = ({ isOpen, onClose, title, children, size = 'max-w-md' }) => {
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
                    <div className={`relative w-full ${size} bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]`}>
                        {/* Professional Header */}
                        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-300 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
                            <h2 className="text-xl font-bold">{title}</h2>
                            <button
                                onClick={onClose}
                                className="text-blue-200 hover:text-white p-1 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        );
    };

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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">

                    <div className="h-full flex flex-col">
                        {/* Main Card - Full height with scrolling */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
                            {/* Card Header - Fixed */}
                            <div className="border-b border-gray-200 px-6 py-4">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div>
                                        <h5 className="text-xl font-bold text-gray-800 mb-1">
                                            Staff Members
                                        </h5>
                                        <p className="text-gray-500 text-sm">
                                            Manage and view all staff members
                                        </p>
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                                        <div className="flex gap-2">
                                            {/* Search Input */}
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    placeholder="Search staff..."
                                                    className="pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none transition-colors w-full lg:w-64"
                                                />
                                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>

                                            <button
                                                onClick={() => setIsAddStaffModalOpen(true)}
                                                className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                                            >
                                                <FiPlus className="w-4 h-4" />
                                                Add Staff
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table Container with Fixed Header and Footer */}
                            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                                {/* Table Header - Fixed */}
                                <div className="border-b border-gray-200 shrink-0">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                            <tr>
                                                <th className="text-left p-4 font-semibold text-gray-700">#</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">STAFF DETAILS</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">CONTACT INFO</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">DESIGNATION</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">LOAN</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">BALANCE</th>
                                                <th className="text-center p-4 font-semibold text-gray-700">ACTIONS</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>

                                {/* Scrollable Table Body */}
                                <div className="flex-1 overflow-y-auto min-h-0">
                                    <table className="w-full text-sm">
                                        <tbody className="bg-white">
                                            {loading ? (
                                                Array.from({ length: 8 }).map((_, index) => (
                                                    <SkeletonRow key={index} />
                                                ))
                                            ) : staff.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-8 text-gray-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <FiUser className="w-12 h-12 text-gray-300 mb-3" />
                                                            <p className="text-gray-500">No staff records found</p>
                                                            <button
                                                                onClick={() => setIsAddStaffModalOpen(true)}
                                                                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                                            >
                                                                Add Your First Staff Member
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                staff.map((staffMember, index) => {
                                                    const isDropdownOpen = activeRowDropdown === staffMember.username;

                                                    return (
                                                        <tr
                                                            key={staffMember.id}
                                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                                                        >
                                                            <td className="p-4 text-gray-600 font-medium">
                                                                {index + 1}
                                                            </td>
                                                            <td className="p-4">
                                                                <a
                                                                    href={`/view-stuff-profile?username=${staffMember.username}`}
                                                                    className="text-blue-600 hover:text-blue-800 font-medium block"
                                                                >
                                                                    {staffMember.name}
                                                                </a>
                                                                <div className="text-gray-500 text-sm mt-1">
                                                                    C/O: {staffMember.guardian_name}
                                                                </div>
                                                                <div className="text-gray-400 text-xs mt-1">
                                                                    Joined: {formatDate(staffMember.joining_date)}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="flex items-center gap-2 text-gray-800 font-medium">
                                                                    <FiPhone className="w-3 h-3" />
                                                                    {staffMember.mobile}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                                                    <FiMail className="w-3 h-3" />
                                                                    {staffMember.email}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase">
                                                                    {staffMember.designation}
                                                                </span>
                                                                <div className="text-green-600 text-sm font-medium mt-1">
                                                                    {formatCurrency(parseInt(staffMember.salary))}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <a
                                                                    href={`/view-stuff-profile-loan?username=${staffMember.username}`}
                                                                    className="inline-block"
                                                                >
                                                                    <span className="inline-flex items-center justify-center bg-red-50 text-red-700 text-sm font-semibold px-3 py-1.5 rounded-lg min-w-[80px]">
                                                                        {formatCurrency(parseInt(staffMember.loan))}
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td className="p-4">
                                                                <a
                                                                    href={`/view-stuff-profile-ledger?username=${staffMember.username}`}
                                                                    className="inline-block"
                                                                >
                                                                    <span className="inline-flex items-center justify-center bg-green-50 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-lg min-w-[80px]">
                                                                        {formatCurrency(parseInt(staffMember.balance))}
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="dropdown-container relative flex justify-center">
                                                                    <button
                                                                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group-hover:bg-gray-200"
                                                                        onClick={() => toggleRowDropdown(staffMember.username)}
                                                                    >
                                                                        <FiSettings className="w-4 h-4" />
                                                                    </button>
                                                                    {isDropdownOpen && (
                                                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                                                                            <div className="py-1">
                                                                                <a
                                                                                    href={`/view-stuff-profile?username=${staffMember.username}`}
                                                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <FiUserCheck className="w-4 h-4 mr-3" />
                                                                                    Attendance
                                                                                </a>
                                                                                <a
                                                                                    href={`/view-stuff-profile-expenses?username=${staffMember.username}`}
                                                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <FiDollarSign className="w-4 h-4 mr-3" />
                                                                                    Expenses
                                                                                </a>
                                                                                <a
                                                                                    href={`/view-stuff-profile-bonus-fine?username=${staffMember.username}`}
                                                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <FiGift className="w-4 h-4 mr-3" />
                                                                                    Bonus/Fine
                                                                                </a>
                                                                                <a
                                                                                    href={`/view-stuff-profile-salary?username=${staffMember.username}`}
                                                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <FiCreditCard className="w-4 h-4 mr-3" />
                                                                                    Salary
                                                                                </a>
                                                                                <a
                                                                                    href={`/view-stuff-profile-ledger?username=${staffMember.username}`}
                                                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <FiCreditCard className="w-4 h-4 mr-3" />
                                                                                    Ledger
                                                                                </a>
                                                                                <a
                                                                                    href={`/view-stuff-profile-performance?username=${staffMember.username}`}
                                                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <FiTrendingUp className="w-4 h-4 mr-3" />
                                                                                    Performance
                                                                                </a>
                                                                                <a
                                                                                    href={`/view-stuff-profile-profile?username=${staffMember.username}`}
                                                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                                                                    onClick={() => setActiveRowDropdown(null)}
                                                                                >
                                                                                    <FiUser className="w-4 h-4 mr-3" />
                                                                                    Profile
                                                                                </a>
                                                                                <div className="border-t border-gray-100 mt-1 pt-1">
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setActiveRowDropdown(null);
                                                                                            openEditModal(staffMember);
                                                                                        }}
                                                                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                                                                                    >
                                                                                        <FiEdit className="w-4 h-4 mr-3 text-green-600" />
                                                                                        Edit Staff
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setActiveRowDropdown(null);
                                                                                            openDeleteModal(staffMember);
                                                                                        }}
                                                                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors"
                                                                                    >
                                                                                        <FiTrash2 className="w-4 h-4 mr-3 text-red-600" />
                                                                                        Delete Staff
                                                                                    </button>
                                                                                </div>
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
                                <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 shrink-0">
                                    <table className="w-full text-sm">
                                        <tfoot>
                                            <tr>
                                                <td className="p-4 font-bold text-gray-800" colSpan="4">
                                                    Total Staff: {staff.length}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="inline-flex items-center justify-center bg-red-100 text-red-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                        {formatCurrency(totalLoan)}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="inline-flex items-center justify-center bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                        {formatCurrency(totalBalance)}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1.5 rounded-lg">
                                                        {formatCurrency(totalSalary)}/month
                                                    </span>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Staff Modal */}
            <ModalWrapper
                isOpen={isAddStaffModalOpen}
                onClose={() => {
                    setIsAddStaffModalOpen(false);
                    resetForm();
                }}
                title="Add New Staff Member"
                size="max-w-2xl"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleAddStaff}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={staffForm.name}
                                        onChange={(e) => setStaffForm({...staffForm, name: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Guardian Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={staffForm.guardian_name}
                                        onChange={(e) => setStaffForm({...staffForm, guardian_name: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        placeholder="Enter guardian name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        PAN Number
                                    </label>
                                    <input
                                        type="text"
                                        value={staffForm.pan_number}
                                        onChange={(e) => setStaffForm({...staffForm, pan_number: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        placeholder="ABCDE1234F"
                                        maxLength="10"
                                    />
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mobile Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={staffForm.mobile}
                                        onChange={(e) => setStaffForm({...staffForm, mobile: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        placeholder="+91 9876543210"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={staffForm.email}
                                        onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        placeholder="email@company.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Emergency Contact
                                    </label>
                                    <input
                                        type="tel"
                                        value={staffForm.emergency_contact}
                                        onChange={(e) => setStaffForm({...staffForm, emergency_contact: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        placeholder="+91 9876543299"
                                    />
                                </div>
                            </div>

                            {/* Employment Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Employment Details</h3>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Designation <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={staffForm.designation}
                                        onChange={(e) => setStaffForm({...staffForm, designation: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        required
                                    >
                                        <option value="">Select Designation</option>
                                        <option value="senior developer">Senior Developer</option>
                                        <option value="project manager">Project Manager</option>
                                        <option value="ui/ux designer">UI/UX Designer</option>
                                        <option value="quality assurance">Quality Assurance</option>
                                        <option value="devops engineer">DevOps Engineer</option>
                                        <option value="frontend developer">Frontend Developer</option>
                                        <option value="backend developer">Backend Developer</option>
                                        <option value="hr manager">HR Manager</option>
                                        <option value="sales executive">Sales Executive</option>
                                        <option value="accountant">Accountant</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Monthly Salary <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={staffForm.salary}
                                        onChange={(e) => setStaffForm({...staffForm, salary: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        placeholder="50000"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Joining Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={staffForm.joining_date}
                                        onChange={(e) => setStaffForm({...staffForm, joining_date: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        value={staffForm.address}
                                        onChange={(e) => setStaffForm({...staffForm, address: e.target.value})}
                                        rows="3"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        placeholder="Enter complete address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Bank Account Number
                                    </label>
                                    <input
                                        type="text"
                                        value={staffForm.bank_account}
                                        onChange={(e) => setStaffForm({...staffForm, bank_account: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        placeholder="123456789012"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        IFSC Code
                                    </label>
                                    <input
                                        type="text"
                                        value={staffForm.ifsc_code}
                                        onChange={(e) => setStaffForm({...staffForm, ifsc_code: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        placeholder="HDFC0001234"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6 rounded-b-xl shadow-sm">
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsAddStaffModalOpen(false);
                                resetForm();
                            }}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleAddStaff}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center min-w-[120px] justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding...
                                </>
                            ) : (
                                'Add Staff Member'
                            )}
                        </button>
                    </div>
                </div>
            </ModalWrapper>

            {/* Edit Staff Modal */}
            <ModalWrapper
                isOpen={isEditStaffModalOpen}
                onClose={() => {
                    setIsEditStaffModalOpen(false);
                    resetForm();
                }}
                title="Edit Staff Member"
                size="max-w-2xl"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleEditStaff}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={staffForm.name}
                                        onChange={(e) => setStaffForm({...staffForm, name: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Guardian Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={staffForm.guardian_name}
                                        onChange={(e) => setStaffForm({...staffForm, guardian_name: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        PAN Number
                                    </label>
                                    <input
                                        type="text"
                                        value={staffForm.pan_number}
                                        onChange={(e) => setStaffForm({...staffForm, pan_number: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        placeholder="ABCDE1234F"
                                        maxLength="10"
                                    />
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mobile Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={staffForm.mobile}
                                        onChange={(e) => setStaffForm({...staffForm, mobile: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={staffForm.email}
                                        onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Emergency Contact
                                    </label>
                                    <input
                                        type="tel"
                                        value={staffForm.emergency_contact}
                                        onChange={(e) => setStaffForm({...staffForm, emergency_contact: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Employment Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Employment Details</h3>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Designation <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={staffForm.designation}
                                        onChange={(e) => setStaffForm({...staffForm, designation: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        required
                                    >
                                        <option value="senior developer">Senior Developer</option>
                                        <option value="project manager">Project Manager</option>
                                        <option value="ui/ux designer">UI/UX Designer</option>
                                        <option value="quality assurance">Quality Assurance</option>
                                        <option value="devops engineer">DevOps Engineer</option>
                                        <option value="frontend developer">Frontend Developer</option>
                                        <option value="backend developer">Backend Developer</option>
                                        <option value="hr manager">HR Manager</option>
                                        <option value="sales executive">Sales Executive</option>
                                        <option value="accountant">Accountant</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Monthly Salary <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={staffForm.salary}
                                        onChange={(e) => setStaffForm({...staffForm, salary: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Joining Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={staffForm.joining_date}
                                        onChange={(e) => setStaffForm({...staffForm, joining_date: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        value={staffForm.address}
                                        onChange={(e) => setStaffForm({...staffForm, address: e.target.value})}
                                        rows="3"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Bank Account Number
                                    </label>
                                    <input
                                        type="text"
                                        value={staffForm.bank_account}
                                        onChange={(e) => setStaffForm({...staffForm, bank_account: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        IFSC Code
                                    </label>
                                    <input
                                        type="text"
                                        value={staffForm.ifsc_code}
                                        onChange={(e) => setStaffForm({...staffForm, ifsc_code: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6 rounded-b-xl shadow-sm">
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditStaffModalOpen(false);
                                resetForm();
                            }}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleEditStaff}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center min-w-[120px] justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                'Update Staff'
                            )}
                        </button>
                    </div>
                </div>
            </ModalWrapper>

            {/* Delete Staff Modal */}
            <ModalWrapper
                isOpen={isDeleteStaffModalOpen}
                onClose={() => {
                    setIsDeleteStaffModalOpen(false);
                    resetForm();
                }}
                title="Delete Staff Member"
                size="max-w-sm"
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IoTrash className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{selectedStaff?.name}</strong>? This action cannot be undone and all associated data will be permanently removed.
                        </p>
                    </div>
                </div>

                <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6 rounded-b-xl shadow-sm">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsDeleteStaffModalOpen(false);
                                resetForm();
                            }}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteStaff}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                </>
                            ) : (
                                'Delete Staff'
                            )}
                        </button>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    );
};

export default ViewStaff;