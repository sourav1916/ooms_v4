import React, { useState, useEffect, useMemo } from 'react';
import { IoTrash } from "react-icons/io5";

// Enhanced professional data for purchase
const partyOptions = [
    { id: 'supplier_1', type: 'supplier', name: 'ABC Suppliers Ltd', email: 'accounts@abcsuppliers.com', contact: 'Mr. Sharma', payment_terms: '30 days' },
    { id: 'supplier_2', type: 'supplier', name: 'XYZ Raw Materials', email: 'purchase@xyzraw.com', contact: 'Ms. Patel', payment_terms: '15 days' },
    { id: 'supplier_3', type: 'supplier', name: 'Global Equipment Co.', email: 'sales@globalequip.com', contact: 'Mr. Gupta', payment_terms: '45 days' },
    { id: 'vendor_1', type: 'vendor', name: 'Office Supplies Inc', email: 'orders@officesupplies.com', contact: 'Customer Service', credit_limit: '1,00,000' },
    { id: 'vendor_2', type: 'vendor', name: 'IT Solutions Provider', email: 'billing@itsolutions.com', contact: 'Technical Dept', credit_limit: '2,50,000' },
    { id: 'vendor_3', type: 'vendor', name: 'Professional Services Co.', email: 'accounts@proservices.com', contact: 'Accounts Dept', credit_limit: '5,00,000' },
    { id: 'contractor_1', type: 'contractor', name: 'Construction Contractors', license: 'CC12345', specialization: 'Civil Work' },
    { id: 'contractor_2', type: 'contractor', name: 'Electrical Works Ltd', license: 'EW67890', specialization: 'Electrical' }
];

const itemOptions = [
    { item_id: '1', name: 'Office Furniture', price: '15000', category: 'Assets', hsn_code: '94033000' },
    { item_id: '2', name: 'Computer Equipment', price: '45000', category: 'Assets', hsn_code: '84713000' },
    { item_id: '3', name: 'Raw Materials', price: '1200', category: 'Materials', hsn_code: '39269099' },
    { item_id: '4', name: 'Printing Services', price: '5000', category: 'Services', hsn_code: '998886' },
    { item_id: '5', name: 'Professional Services', price: '25000', category: 'Services', hsn_code: '998515' },
    { item_id: '6', name: 'Office Supplies', price: '800', category: 'Consumables', hsn_code: '39269099' },
    { item_id: '7', name: 'Software License', price: '18000', category: 'Software', hsn_code: '85234900' },
    { item_id: '8', name: 'Maintenance Services', price: '7500', category: 'Services', hsn_code: '998886' }
];

const appSettings = {
    company_name: 'Professional Accounting Services',
    gst_applicable: true,
    default_gst_rate: 18,
    currency: 'INR',
};

const PurchaseForm = ({
    isOpen = false,
    onClose = () => { },
    onSuccess = () => { },
    initialPartyId = '',
    mode = 'modal'
}) => {
    const [formData, setFormData] = useState({
        party_id: initialPartyId || '',
        purchase_date: new Date().toISOString().split('T')[0],
        bill_number: `BILL-${Date.now().toString().slice(-6)}`,
        items: [{ item_id: '', description: '', quantity: 1, price: '', amount: 0 }],
        subtotal: 0,
        discount: 0,
        discount_type: 'percentage',
        sgst_rate: appSettings.gst_applicable ? appSettings.default_gst_rate / 2 : 0,
        cgst_rate: appSettings.gst_applicable ? appSettings.default_gst_rate / 2 : 0,
        sgst_amount: 0,
        cgst_amount: 0,
        round_off: 0,
        grand_total: 0,
        payment_terms: '30 days',
        delivery_date: '',
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
            (party.email && party.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (party.contact && party.contact.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm]);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                party_id: initialPartyId || '',
                purchase_date: new Date().toISOString().split('T')[0],
                bill_number: `BILL-${Date.now().toString().slice(-6)}`,
                items: [{ item_id: '', description: '', quantity: 1, price: '', amount: 0 }],
                subtotal: 0,
                discount: 0,
                discount_type: 'percentage',
                sgst_rate: appSettings.gst_applicable ? appSettings.default_gst_rate / 2 : 0,
                cgst_rate: appSettings.gst_applicable ? appSettings.default_gst_rate / 2 : 0,
                sgst_amount: 0,
                cgst_amount: 0,
                round_off: 0,
                grand_total: 0,
                payment_terms: '30 days',
                delivery_date: '',
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
        if (!party) return 'Select Supplier/Vendor';

        switch (party.type) {
            case 'supplier':
                return `${party.name} • ${party.email} • ${party.contact}`;
            case 'vendor':
                return `${party.name} • ${party.email} • Credit: ₹${party.credit_limit}`;
            case 'contractor':
                return `${party.name} • ${party.license} • ${party.specialization}`;
            default:
                return party.name;
        }
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { item_id: '', description: '', quantity: 1, price: '', amount: 0 }
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
                    [field]: field === 'price' || field === 'quantity' ? Number(value) || 0 : value
                };

                // Calculate amount
                updatedItem.amount = (updatedItem.quantity || 1) * (updatedItem.price || 0);

                return updatedItem;
            }
            return item;
        });

        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const handleItemSelect = (index, itemId) => {
        const item = itemOptions.find(i => i.item_id === itemId);
        if (item) {
            const updatedItems = formData.items.map((itemData, i) =>
                i === index ? {
                    ...itemData,
                    item_id: itemId,
                    price: Number(item.price),
                    amount: (itemData.quantity || 1) * Number(item.price)
                } : itemData
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
            console.log('Purchase Form submitted:', submissionData);
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

    const getItemDetails = (itemId) => {
        return itemOptions.find(i => i.item_id === itemId);
    };

    const formContent = (
        <div className="bg-white rounded-xl shadow-2xl flex flex-col h-full border border-gray-300">
            {/* Professional Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-300 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-xl">
                <div>
                    <h2 className="text-xl font-bold">Purchase Bill</h2>
                </div>
                {mode === 'modal' && (
                    <button
                        onClick={onClose}
                        className="text-green-200 p-1 text-white rounded-lg bg-green-500 transition-colors"
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
                        {/* Party Selection - takes 3 columns */}
                        <div className="lg:col-span-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Supplier/Vendor <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white cursor-pointer hover:border-green-400 transition-colors"
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
                                            <span>Click to select supplier/vendor...</span>
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
                                                placeholder="Search by name, email, or contact..."
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                                                        ? 'bg-green-50 border-green-500 text-green-700'
                                                        : 'border-transparent hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => handlePartySelect(party.id)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3 mb-1">
                                                                <span className="font-semibold text-gray-900">{party.name}</span>
                                                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${party.type === 'supplier' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                                    party.type === 'vendor' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                                                        'bg-orange-100 text-orange-800 border border-orange-200'
                                                                    }`}>
                                                                    {party.type.toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {party.type === 'supplier' && `Email: ${party.email} • ${party.contact} • Terms: ${party.payment_terms}`}
                                                                {party.type === 'vendor' && `Email: ${party.email} • Credit Limit: ₹${party.credit_limit}`}
                                                                {party.type === 'contractor' && `License: ${party.license} • ${party.specialization}`}
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
                                Bill Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-colors"
                                name="purchase_date"
                                value={formData.purchase_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Delivery Date - takes 1 column */}
                        <div className="lg:col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Delivery Date
                            </label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-colors"
                                name="delivery_date"
                                value={formData.delivery_date}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Purchase Items</h3>
                            <button
                                type="button"
                                onClick={addItem}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Item
                            </button>
                        </div>

                        <div className="overflow-hidden border border-gray-300 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Item</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Qty</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {formData.items.map((item, index) => {
                                        const itemDetail = getItemDetails(item.item_id);
                                        return (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <select
                                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        value={item.item_id}
                                                        onChange={(e) => handleItemSelect(index, e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select Item</option>
                                                        {itemOptions.map(item => (
                                                            <option key={item.item_id} value={item.item_id}>
                                                                {item.name} - {formatCurrency(item.price)} ({item.category})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        placeholder="Item description..."
                                                        value={item.description}
                                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        placeholder="1"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        placeholder="0.00"
                                                        value={item.price}
                                                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                                    {formatCurrency(item.amount)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        disabled={formData.items.length <= 1}
                                                        className="inline-flex items-center px-2 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <IoTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="text-md font-semibold text-gray-900 mb-3">Purchase Details</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        name="payment_terms"
                                        value={formData.payment_terms}
                                        onChange={handleInputChange}
                                    >
                                        <option value="7 days">7 days</option>
                                        <option value="15 days">15 days</option>
                                        <option value="30 days">30 days</option>
                                        <option value="45 days">45 days</option>
                                        <option value="60 days">60 days</option>
                                        <option value="Cash">Cash</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Purchase notes, delivery instructions, or reference numbers..."
                                        name="notes"
                                        rows={3}
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Discount Section */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="text-md font-semibold text-gray-900 mb-3">Discount & Tax Settings</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        name="discount_type"
                                        value={formData.discount_type}
                                        onChange={handleInputChange}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Discount {formData.discount_type === 'percentage' ? '(%)' : '(₹)'}
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleInputChange}
                                        min="0"
                                        step={formData.discount_type === 'percentage' ? '0.1' : '1'}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Totals Section */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <h4 className="text-md font-semibold text-gray-900 mb-3">Purchase Summary</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium">{formatCurrency(formData.subtotal)}</span>
                                </div>

                                {formData.discount > 0 && (
                                    <div className="flex justify-between items-center text-red-600">
                                        <span>Discount:</span>
                                        <span>-{formatCurrency(
                                            formData.discount_type === 'percentage'
                                                ? formData.subtotal * (formData.discount / 100)
                                                : Number(formData.discount)
                                        )}</span>
                                    </div>
                                )}

                                {appSettings.gst_applicable && (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">SGST ({formData.sgst_rate}%):</span>
                                            <span className="font-medium">{formatCurrency(formData.sgst_amount)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">CGST ({formData.cgst_rate}%):</span>
                                            <span className="font-medium">{formatCurrency(formData.cgst_amount)}</span>
                                        </div>
                                    </>
                                )}

                                {Math.abs(formData.round_off) > 0.01 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Round Off:</span>
                                        <span className="font-medium">{formatCurrency(formData.round_off)}</span>
                                    </div>
                                )}

                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                                        <span>Total Payable:</span>
                                        <span>{formatCurrency(formData.grand_total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="flex-shrink-0 border-t border-gray-300 bg-gray-50 p-3 rounded-b-xl">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        <div className="font-semibold">Total Payable: {formatCurrency(formData.grand_total)}</div>
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
                        <div className="flex space-x-3">
                            {mode === 'modal' && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.party_id}
                                className="px-8 py-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Purchase Bill...
                                    </>
                                ) : (
                                    `Create Purchase - ${formatCurrency(formData.grand_total)}`
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
                    <div className="relative w-full max-w-6xl bg-white rounded-xl shadow-2xl h-[90vh] flex flex-col">
                        {formContent}
                    </div>
                </div>
            </div>
        ) : null;
    }

    // Render as standalone page component
    return formContent;
};

export default PurchaseForm;