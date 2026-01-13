import React, { useState, useEffect, useMemo } from 'react';
import { IoTrash } from "react-icons/io5";

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
        }
    }, [isOpen, initialPartyId]);

    const getSelectedParty = () => {
        return partyOptions.find(party => party.id === formData.party_id);
    };

    const getPartyDisplayText = (party) => {
        if (!party) return 'Select Party';

        switch (party.type) {
            case 'bank':
                return `${party.name} • ${party.account} • ${party.holder}`;
            case 'client':
                return `${party.name} • ${party.email} • ${party.contact}`;
            case 'ca':
                return `${party.name} • ${party.license}`;
            case 'capital':
                return `${party.name} • Balance: ₹${party.balance}`;
            default:
                return party.name;
        }
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
                company: appSettings.company_name
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

    const getServiceDetails = (serviceId) => {
        return serviceOptions.find(s => s.service_id === serviceId);
    };

    const formContent = (
        <div className="bg-white rounded-xl shadow-2xl flex flex-col h-full border border-gray-300">
            {/* Professional Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-300 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
                <div>
                    <h2 className="text-xl font-bold">Discount Invoice</h2>
                </div>
                {mode === 'modal' && (
                    <button
                        onClick={onClose}
                        className="text-blue-200 p-1 text-white rounded-lg bg-blue-500 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit}>
                    {/* Party Selection and Date Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                        {/* Party Selection - takes 4 columns */}
                        <div className="lg:col-span-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Party <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white cursor-pointer hover:border-blue-400 transition-colors"
                                    onClick={() => setShowPartyDropdown(!showPartyDropdown)}
                                >
                                    {formData.party_id ? (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-800 font-medium">
                                                {getPartyDisplayText(getSelectedParty())}
                                            </span>
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center text-gray-500">
                                            <span>Click to select a party...</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {showPartyDropdown && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                                        <div className="p-3 border-b border-gray-200 bg-gray-50">
                                            <input
                                                type="text"
                                                placeholder="Search by name, account, or email..."
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                        <div className="py-2">
                                            {filteredParties.map(party => (
                                                <div
                                                    key={party.id}
                                                    className={`px-4 py-3 cursor-pointer border-l-4 transition-colors ${formData.party_id === party.id
                                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                        : 'border-transparent hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => handlePartySelect(party.id)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3 mb-1">
                                                                <span className="font-semibold text-gray-900">{party.name}</span>
                                                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${party.type === 'bank' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                                    party.type === 'client' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                                        party.type === 'ca' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                                                            'bg-orange-100 text-orange-800 border border-orange-200'
                                                                    }`}>
                                                                    {party.type.toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {party.type === 'bank' && `Account: ${party.account} • ${party.holder} • Balance: ₹${party.balance}`}
                                                                {party.type === 'client' && `Email: ${party.email} • ${party.contact} • Outstanding: ₹${party.outstanding}`}
                                                                {party.type === 'ca' && `License: ${party.license} • ${party.specialization}`}
                                                                {party.type === 'capital' && `Account: ${party.account_number} • Balance: ₹${party.balance}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date - takes 1 column */}
                        <div className="lg:col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Invoice Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                name="payment_date"
                                value={formData.payment_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Discount Section - Half Width */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="lg:col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Discount Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleInputChange}
                                    placeholder="Enter discount amount"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            {/* Empty space to balance the layout */}
                        </div>
                    </div>

                    {/* Notes Section - Full Width */}
                    <div className="mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="text-md font-semibold text-gray-900 mb-3">Notes</h4>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Additional notes, reference numbers, or special instructions..."
                                name="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* Improved Footer Section */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4 rounded-b-xl shadow-sm">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    {/* Total Amount */}
                    <div className="text-sm">
                        <div className="font-semibold text-gray-900 text-lg">
                            Total Amount: {formatCurrency(formData.grand_total)}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                        {/* Send Options */}
                        <div className="flex items-center gap-4">
                            {/* Send Invoice Checkbox */}
                            <div className="flex items-center">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        checked
                                        type='checkbox'
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 whitespace-nowrap">
                                        Email to client
                                    </span>
                                </label>
                            </div>

                            {/* Send Invoice Checkbox */}
                            <div className="flex items-center">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        checked
                                        type='checkbox'
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 whitespace-nowrap">
                                        WhatsaApp to client
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-3">
                            {mode === 'modal' && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.party_id}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center min-w-[180px] justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    `Create Invoice - ${formatCurrency(formData.grand_total)}`
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
                <div className="flex items-center justify-center min-h-screen p-4">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        onClick={onClose}
                    />
                    {/* Professional Modal panel */}
                    <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl h-[90vh] flex flex-col">
                        {formContent}
                    </div>
                </div>
            </div>
        ) : null;
    }

    // Render as standalone page component
    return formContent;
};

export default DiscountForm;