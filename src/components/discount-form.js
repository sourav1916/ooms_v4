import React, { useState, useEffect, useMemo } from 'react';
import { FiX, FiCalendar, FiDollarSign, FiFileText, FiArrowRight, FiCreditCard, FiHash, FiPlus, FiUser, FiTrash2, FiChevronDown, FiMail, FiMessageSquare } from 'react-icons/fi';

// Enhanced professional data
const partyOptions = [
    { id: 'bank_1', type: 'bank', name: 'HDFC Bank', account: '1234567890', holder: 'John Doe', balance: '15,00,000' },
    { id: 'bank_2', type: 'bank', name: 'ICICI Bank', account: '0987654321', holder: 'Jane Smith', balance: '25,00,000' },
    { id: 'bank_3', type: 'bank', name: 'SBI', account: '1122334455', holder: 'Bob Wilson', balance: '18,00,000' },
    { id: 'client_1', type: 'client', name: 'ABC Corporation', email: 'abc@corp.com', contact: 'Corporate', outstanding: '2,50,000' },
    { id: 'client_2', type: 'client', name: 'XYZ Ltd', email: 'xyz@ltd.com', contact: 'Corporate', outstanding: '1,75,000' },
    { id: 'client_3', type: 'client', name: 'Individual Client', email: 'client@email.com', contact: 'Individual', outstanding: '45,000' },
    { id: 'ca_1', type: 'ca', name: 'CA Firm Associates', license: 'CA12345', specialization: 'Tax & Audit' },
    { id: 'ca_2', type: 'ca', name: 'Professional CA Services', license: 'CA67890', specialization: 'Accounting' },
    { id: 'capital_1', type: 'capital', name: 'Main Capital Account', account_number: 'CAP001', balance: '50,00,000' },
    { id: 'capital_2', type: 'capital', name: 'Reserve Capital', account_number: 'CAP002', balance: '25,00,000' }
];

const serviceOptions = [
    { service_id: '1', name: 'Tax Consultation', fees: '5000', category: 'Advisory', duration: '1 Session' },
    { service_id: '2', name: 'Audit Services', fees: '10000', category: 'Compliance', duration: 'Monthly' },
    { service_id: '3', name: 'Accounting Services', fees: '3000', category: 'Regular', duration: 'Monthly' },
    { service_id: '4', name: 'GST Filing', fees: '2000', category: 'Compliance', duration: 'Monthly' },
    { service_id: '5', name: 'Financial Planning', fees: '8000', category: 'Advisory', duration: '1 Session' },
    { service_id: '6', name: 'Company Incorporation', fees: '15000', category: 'Registration', duration: 'One-time' }
];

const appSettings = {
    company_name: 'Professional Accounting Services',
    gst_applicable: true,
    default_gst_rate: 18,
    currency: 'INR',
};

const DiscountForm = ({
    isOpen = false,
    onClose = () => { },
    onSuccess = () => { },
    initialPartyId = '',
    mode = 'modal'
}) => {
    const [formData, setFormData] = useState({
        party_id: initialPartyId || '',
        payment_date: new Date().toISOString().split('T')[0],
        invoice_number: `INV-${Date.now().toString().slice(-6)}`,
        items: [{ service_id: '', description: '', price: '', amount: 0 }],
        subtotal: 0,
        discount: 0,
        discount_type: 'percentage',
        sgst_rate: appSettings.gst_applicable ? appSettings.default_gst_rate / 2 : 0,
        cgst_rate: appSettings.gst_applicable ? appSettings.default_gst_rate / 2 : 0,
        sgst_amount: 0,
        cgst_amount: 0,
        round_off: 0,
        grand_total: 0,
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPartyDropdown, setShowPartyDropdown] = useState(false);
    const [sendEmail, setSendEmail] = useState(true);
    const [sendWhatsApp, setSendWhatsApp] = useState(true);

    // Filter parties based on search
    const filteredParties = useMemo(() => {
        if (!searchTerm) return partyOptions;
        return partyOptions.filter(party =>
            party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (party.account && party.account.includes(searchTerm)) ||
            (party.email && party.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm]);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                party_id: initialPartyId || '',
                payment_date: new Date().toISOString().split('T')[0],
                invoice_number: `INV-${Date.now().toString().slice(-6)}`,
                items: [{ service_id: '', description: '', price: '', amount: 0 }],
                subtotal: 0,
                discount: 0,
                discount_type: 'percentage',
                sgst_rate: appSettings.gst_applicable ? appSettings.default_gst_rate / 2 : 0,
                cgst_rate: appSettings.gst_applicable ? appSettings.default_gst_rate / 2 : 0,
                sgst_amount: 0,
                cgst_amount: 0,
                round_off: 0,
                grand_total: 0,
                notes: ''
            });
            setSearchTerm('');
            setShowPartyDropdown(false);
            setSendEmail(true);
            setSendWhatsApp(true);
        }
    }, [isOpen, initialPartyId]);

    const getSelectedParty = () => {
        return partyOptions.find(party => party.id === formData.party_id);
    };

    const getPartyDisplayText = (party) => {
        if (!party) return 'Select Party';
        
        switch (party.type) {
            case 'bank':
                return `${party.name} • ${party.account}`;
            case 'client':
                return `${party.name} • ${party.email}`;
            case 'ca':
                return `${party.name} • ${party.license}`;
            case 'capital':
                return `${party.name} • Balance: ₹${party.balance}`;
            default:
                return party.name;
        }
    };

    const getPartyTypeBadge = (type) => {
        const typeConfig = {
            bank: { color: 'bg-green-100 text-green-800', label: 'BANK' },
            client: { color: 'bg-blue-100 text-blue-800', label: 'CLIENT' },
            ca: { color: 'bg-purple-100 text-purple-800', label: 'CA' },
            capital: { color: 'bg-orange-100 text-orange-800', label: 'CAPITAL' }
        };
        const config = typeConfig[type] || { color: 'bg-gray-100 text-gray-800', label: type.toUpperCase() };
        return `text-xs font-bold px-2 py-1 rounded ${config.color}`;
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { service_id: '', description: '', price: '', amount: 0 }
            ]
        }));
    };

    const removeItem = (index) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = formData.items.map((item, i) => {
            if (i === index) {
                const updatedItem = {
                    ...item,
                    [field]: field === 'price' ? Number(value) || 0 : value
                };

                // Calculate amount
                updatedItem.amount = updatedItem.price || 0;

                return updatedItem;
            }
            return item;
        });

        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const handleServiceChange = (index, serviceId) => {
        const service = serviceOptions.find(s => s.service_id === serviceId);
        if (service) {
            const updatedItems = formData.items.map((item, i) =>
                i === index ? {
                    ...item,
                    service_id: serviceId,
                    price: Number(service.fees),
                    amount: Number(service.fees)
                } : item
            );

            setFormData(prev => ({
                ...prev,
                items: updatedItems
            }));
        }
    };

    const handlePartySelect = (partyId) => {
        setFormData(prev => ({ ...prev, party_id: partyId }));
        setShowPartyDropdown(false);
        setSearchTerm('');
    };

    // Calculate totals
    useEffect(() => {
        let subtotal = 0;
        formData.items.forEach(item => {
            subtotal += Number(item.amount) || 0;
        });

        // Calculate discount
        let discountAmount = 0;
        if (formData.discount_type === 'percentage') {
            discountAmount = subtotal * (Number(formData.discount) / 100);
        } else {
            discountAmount = Number(formData.discount) || 0;
        }

        const amountAfterDiscount = Math.max(0, subtotal - discountAmount);
        const sgst_amount = amountAfterDiscount * (Number(formData.sgst_rate) / 100);
        const cgst_amount = amountAfterDiscount * (Number(formData.cgst_rate) / 100);

        let grand_total = amountAfterDiscount + sgst_amount + cgst_amount;
        const round_off = Math.round(grand_total) - grand_total;
        grand_total = Math.round(grand_total);

        setFormData(prev => ({
            ...prev,
            subtotal,
            sgst_amount,
            cgst_amount,
            round_off,
            grand_total
        }));
    }, [formData.items, formData.discount, formData.discount_type, formData.sgst_rate, formData.cgst_rate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.party_id || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const submissionData = {
                ...formData,
                selected_party: getSelectedParty(),
                timestamp: new Date().toISOString(),
                company: appSettings.company_name,
                send_email: sendEmail,
                send_whatsapp: sendWhatsApp
            };
            console.log('Form submitted:', submissionData);
            onSuccess(submissionData);
            if (mode === 'modal') onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getServiceDetails = (serviceId) => {
        return serviceOptions.find(s => s.service_id === serviceId);
    };

    const getServiceCategoryBadge = (category) => {
        const categoryConfig = {
            'Advisory': 'bg-purple-100 text-purple-800',
            'Compliance': 'bg-blue-100 text-blue-800',
            'Regular': 'bg-green-100 text-green-800',
            'Registration': 'bg-orange-100 text-orange-800'
        };
        return categoryConfig[category] || 'bg-gray-100 text-gray-800';
    };

    const formContent = (
        <div className="bg-white rounded-xl shadow-2xl flex flex-col h-full border border-gray-200">
            {/* Compact Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
                <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-white/10 rounded-lg">
                        <FiDollarSign className="w-5 h-5" />
                    </div>
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-bold">Discount Invoice</h2>
                        <span className="text-blue-200 text-sm hidden sm:inline">|</span>
                        <p className="text-blue-100 text-xs sm:text-sm hidden sm:block">{appSettings.company_name}</p>
                    </div>
                </div>
                {mode === 'modal' && (
                    <button
                        onClick={onClose}
                        className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-500 rounded-lg transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-gray-50">
                <form onSubmit={handleSubmit}>
                    {/* Party Selection and Date Section - Compact */}
                    <div className="mb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Party Selection */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Select Party <span className="text-red-500">*</span>
                                    </label>
                                    <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">Required</span>
                                </div>
                                <div className="relative">
                                    <div
                                        className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg bg-white cursor-pointer hover:border-blue-400 transition-all duration-200 shadow-sm group"
                                        onClick={() => setShowPartyDropdown(!showPartyDropdown)}
                                    >
                                        {formData.party_id ? (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="p-1 bg-blue-100 text-blue-600 rounded group-hover:bg-blue-200 transition-colors">
                                                        <FiUser className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                                            {getSelectedParty()?.name}
                                                        </div>
                                                        <div className="text-xs text-gray-600 truncate max-w-[200px]">
                                                            {getPartyDisplayText(getSelectedParty())}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={getPartyTypeBadge(getSelectedParty()?.type)}>
                                                        {getSelectedParty()?.type?.toUpperCase()}
                                                    </span>
                                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between text-gray-500 group-hover:text-gray-600 transition-colors">
                                                <div className="flex items-center space-x-2">
                                                    <FiUser className="w-4 h-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
                                                    <span className="text-sm">Select party...</span>
                                                </div>
                                                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {showPartyDropdown && (
                                        <div className="absolute z-40 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-fadeIn">
                                            <div className="p-2 border-b border-gray-200 bg-gray-50">
                                                <input
                                                    type="text"
                                                    placeholder="Search parties..."
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="py-1">
                                                {filteredParties.map(party => (
                                                    <div
                                                        key={party.id}
                                                        className={`px-3 py-2 cursor-pointer hover:bg-gray-50 border-l-2 transition-all duration-200 ${formData.party_id === party.id
                                                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                            : 'border-transparent hover:border-blue-300'
                                                            }`}
                                                        onClick={() => handlePartySelect(party.id)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="p-1 bg-blue-100 text-blue-600 rounded">
                                                                    <FiUser className="w-3 h-3" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{party.name}</div>
                                                                    <div className="text-xs text-gray-600">
                                                                        {party.type === 'bank' && `Account: ${party.account}`}
                                                                        {party.type === 'client' && `Email: ${party.email}`}
                                                                        {party.type === 'ca' && `License: ${party.license}`}
                                                                        {party.type === 'capital' && `Account: ${party.account_number}`}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                {party.type === 'bank' && (
                                                                    <span className="text-xs text-gray-500">₹{party.balance}</span>
                                                                )}
                                                                {party.type === 'client' && (
                                                                    <span className="text-xs text-gray-500">₹{party.outstanding}</span>
                                                                )}
                                                                <span className={getPartyTypeBadge(party.type)}>
                                                                    {party.type?.toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {formData.party_id && (
                                    <div className="mt-1.5 text-xs text-gray-600 flex items-center space-x-2 animate-fadeIn">
                                        {getSelectedParty()?.type === 'bank' && (
                                            <>
                                                <span className="font-medium">Balance: ₹{getSelectedParty()?.balance}</span>
                                                <span className="text-gray-400">•</span>
                                            </>
                                        )}
                                        {getSelectedParty()?.type === 'client' && (
                                            <>
                                                <span className="font-medium">Outstanding: ₹{getSelectedParty()?.outstanding}</span>
                                                <span className="text-gray-400">•</span>
                                            </>
                                        )}
                                        <span className="text-gray-500">{getSelectedParty()?.contact || getSelectedParty()?.holder || getSelectedParty()?.specialization || ''}</span>
                                    </div>
                                )}
                            </div>

                            {/* Date Input */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Invoice Date <span className="text-red-500">*</span>
                                    </label>
                                    <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">Required</span>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                        <FiCalendar className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        className="pl-9 w-full pr-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 shadow-sm bg-white text-sm"
                                        name="payment_date"
                                        value={formData.payment_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mt-1.5 text-xs text-gray-500">
                                    Selected: {formatDate(formData.payment_date)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Discount Section - Compact */}
                    <div className="mb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Discount Amount */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Discount Amount <span className="text-red-500">*</span>
                                    </label>
                                    <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">Required</span>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="number"
                                        className="pl-9 w-full pr-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 shadow-sm text-sm"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleInputChange}
                                        placeholder="Enter discount amount"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Discount Type */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Discount Type
                                    </label>
                                    <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">Optional</span>
                                </div>
                                <div className="relative">
                                    <select
                                        className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 shadow-sm text-sm appearance-none bg-white"
                                        name="discount_type"
                                        value={formData.discount_type}
                                        onChange={handleInputChange}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="amount">Fixed Amount (₹)</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                                        <FiChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Invoice Number */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Invoice Number
                                    </label>
                                    <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">Auto-generated</span>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                        <FiHash className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="pl-9 w-full pr-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 shadow-sm text-sm bg-gray-50"
                                        name="invoice_number"
                                        value={formData.invoice_number}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Items Section - Compact */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-sm font-bold text-gray-900">Service Items</h3>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded transition-all duration-200 hover:bg-gray-200">
                                    {formData.items.length} service{formData.items.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={addItem}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium  bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                            >
                                <FiPlus className="w-3.5 h-3.5 mr-1.5 transition-transform duration-200 group-hover:rotate-90" />
                                Add Service
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.items.map((item, index) => {
                                const service = getServiceDetails(item.service_id);
                                return (
                                    <div 
                                        key={index} 
                                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                            {/* Service Item - 5 columns */}
                                            <div className="md:col-span-5">
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="text-xs font-medium text-gray-700">Service</label>
                                                    {service && (
                                                        <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${getServiceCategoryBadge(service.category)}`}>
                                                            {service.category}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FiFileText className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <select
                                                        className="pl-10 w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 appearance-none bg-white"
                                                        value={item.service_id}
                                                        onChange={(e) => handleServiceChange(index, e.target.value)}
                                                        required
                                                    >
                                                        <option value="" disabled>Select Service</option>
                                                        {serviceOptions.map(service => (
                                                            <option key={service.service_id} value={service.service_id}>
                                                                {service.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <FiChevronDown className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description - 4 columns */}
                                            <div className="md:col-span-4">
                                                <label className="text-xs font-medium text-gray-700 mb-1 block">Description</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="pl-10 w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200"
                                                        placeholder="Service description..."
                                                        value={item.description}
                                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Amount and Delete - 3 columns */}
                                            <div className="md:col-span-3">
                                                <div className="flex items-end space-x-2 h-full">
                                                    <div className="flex-1">
                                                        <label className="text-xs font-medium text-gray-700 mb-1 block">Price</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <FiDollarSign className="w-4 h-4 text-gray-400" />
                                                            </div>
                                                            <input
                                                                type="number"
                                                                className="pl-10 w-full pr-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 text-right"
                                                                placeholder="0.00"
                                                                value={item.price}
                                                                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        disabled={formData.items.length <= 1}
                                                        className="p-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {service && (
                                            <div className="mt-2 text-xs text-gray-500">
                                                Duration: {service.duration} • Default Fee: {formatCurrency(service.fees)}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notes Section - Compact */}
                    <div className="mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100 shadow-sm transition-all duration-300 hover:shadow-md">
                            <div className="flex items-center mb-3">
                                <div className="p-1.5 bg-blue-600 text-white rounded-lg mr-2 transition-transform duration-200 hover:rotate-3">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                </div>
                                <h4 className="text-sm font-bold text-gray-900">Notes & Instructions</h4>
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                </div>
                                <textarea
                                    className="pl-10 w-full px-3 py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-200"
                                    placeholder="Additional notes, payment terms, or special instructions..."
                                    name="notes"
                                    rows={3}
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 transition-opacity duration-200 hover:opacity-100">
                                Payment terms, reference numbers, or any special instructions
                            </p>
                        </div>
                    </div>

                    {/* Invoice Summary - Compact */}
                    <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100 shadow-sm transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center mb-3">
                            <div className="p-1.5 bg-blue-600 text-white rounded-lg mr-2 transition-transform duration-200 hover:rotate-3">
                                <FiFileText className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900">Invoice Summary</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:border-blue-300 hover:shadow-sm">
                                <div className="text-xs text-gray-600 mb-1">Subtotal</div>
                                <div className="font-semibold text-gray-900 text-lg">
                                    {formatCurrency(formData.subtotal)}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:border-green-300 hover:shadow-sm">
                                <div className="text-xs text-gray-600 mb-1">Discount</div>
                                <div className="font-semibold text-green-600 text-lg">
                                    {formatCurrency(formData.discount_type === 'percentage' ? 
                                        formData.subtotal * (Number(formData.discount) / 100) : 
                                        Number(formData.discount) || 0)}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:border-purple-300 hover:shadow-sm">
                                <div className="text-xs text-gray-600 mb-1">GST</div>
                                <div className="font-semibold text-purple-600 text-sm">
                                    SGST: {formatCurrency(formData.sgst_amount)}<br/>
                                    CGST: {formatCurrency(formData.cgst_amount)}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:border-red-300 hover:shadow-sm">
                                <div className="text-xs text-gray-600 mb-1">Grand Total</div>
                                <div className="font-semibold text-red-600 text-lg">
                                    {formatCurrency(formData.grand_total)}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Compact Footer */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4 rounded-b-xl shadow-lg">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    {/* Send Options */}
                    <div className="w-full lg:w-auto">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <label className="flex items-center cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={sendEmail}
                                                onChange={() => setSendEmail(!sendEmail)}
                                                className="sr-only"
                                            />
                                            <div className={`w-4 h-4 border rounded transition-all duration-200 flex items-center justify-center ${sendEmail ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white group-hover:border-blue-400'}`}>
                                                {sendEmail && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-2 flex items-center space-x-1">
                                            <FiMail className="w-3.5 h-3.5 text-gray-600" />
                                            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                                                Email to client
                                            </span>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <label className="flex items-center cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={sendWhatsApp}
                                                onChange={() => setSendWhatsApp(!sendWhatsApp)}
                                                className="sr-only"
                                            />
                                            <div className={`w-4 h-4 border rounded transition-all duration-200 flex items-center justify-center ${sendWhatsApp ? 'bg-green-600 border-green-600' : 'border-gray-300 bg-white group-hover:border-green-400'}`}>
                                                {sendWhatsApp && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-2 flex items-center space-x-1">
                                            <FiMessageSquare className="w-3.5 h-3.5 text-gray-600" />
                                            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                                                WhatsApp to client
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                        {/* Amount Display */}
                        <div className="hidden lg:flex items-center space-x-4">
                            <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 transition-all duration-200 hover:border-blue-300 hover:shadow-sm">
                                <div className="text-xs text-blue-700 font-semibold">
                                    Date: <span className="text-sm">{formatDate(formData.payment_date)}</span>
                                </div>
                            </div>
                            <div className="px-3 py-1.5 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 transition-all duration-200 hover:border-green-300 hover:shadow-sm">
                                <div className="text-xs text-green-700 font-semibold">
                                    Total: <span className="text-sm">{formatCurrency(formData.grand_total)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {mode === 'modal' && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 shadow-sm hover:shadow"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.party_id || formData.items.some(item => !item.service_id || !item.price)}
                                className="px-5 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow hover:shadow-md transform hover:-translate-y-0.5 min-w-[140px] flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <FiArrowRight className="w-3.5 h-3.5 mr-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                                        Create Invoice
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Render as modal or standalone component
    if (mode === 'modal') {
        return isOpen ? (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => {
                            setShowPartyDropdown(false);
                            onClose();
                        }}
                    />
                    {/* Compact Modal panel */}
                    <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl h-[85vh] flex flex-col transform transition-all duration-300 scale-100 animate-fadeIn">
                        {formContent}
                    </div>
                </div>
            </div>
        ) : null;
    }

    // Render as standalone page component
    return formContent;
};

// Add CSS for animations
const styles = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
    }
`;

// Add styles to document head
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

export default DiscountForm;