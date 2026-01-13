// ContraTransfer.js
import React, { useState, useEffect, useMemo } from 'react';
import { FiX, FiCalendar, FiDollarSign, FiFileText, FiArrowRight, FiCreditCard, FiHash } from 'react-icons/fi';

// Bank options data
const bankOptions = [
    { id: 'bank_1', name: 'HDFC Bank', account: '123456789012', holder: 'Company Name Ltd', balance: '10,50,000' },
    { id: 'bank_2', name: 'ICICI Bank', account: '987654321098', holder: 'Company Name Ltd', balance: '25,75,000' },
    { id: 'bank_3', name: 'State Bank of India', account: '456789012345', holder: 'Company Name Ltd', balance: '15,20,000' },
    { id: 'bank_4', name: 'Axis Bank', account: '321098765432', holder: 'Company Name Ltd', balance: '8,90,000' }
];

const appSettings = {
    company_name: 'Professional Accounting Services',
    currency: 'INR',
};

const ContraTransfer = ({
    isOpen = false,
    onClose = () => { },
    onSuccess = () => { },
    initialOutBankId = '',
    initialInBankId = '',
    mode = 'modal'
}) => {
    const [formData, setFormData] = useState({
        out_bank_id: initialOutBankId || '',
        in_bank_id: initialInBankId || '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        remark: '',
        transaction_ref_id: '' // New field added
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                out_bank_id: initialOutBankId || '',
                in_bank_id: initialInBankId || '',
                date: new Date().toISOString().split('T')[0],
                amount: '',
                remark: '',
                transaction_ref_id: '' // Reset new field
            });
        }
    }, [isOpen, initialOutBankId, initialInBankId]);

    const getSelectedOutBank = () => {
        return bankOptions.find(bank => bank.id === formData.out_bank_id);
    };

    const getSelectedInBank = () => {
        return bankOptions.find(bank => bank.id === formData.in_bank_id);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.out_bank_id || !formData.in_bank_id || !formData.amount || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const submissionData = {
                ...formData,
                selected_out_bank: getSelectedOutBank(),
                selected_in_bank: getSelectedInBank(),
                timestamp: new Date().toISOString(),
                company: appSettings.company_name
            };
            console.log('Contra Transfer submitted:', submissionData);
            onSuccess(submissionData);
            if (mode === 'modal') onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formContent = (
        <div className="bg-white rounded-xl shadow-2xl flex flex-col h-full border border-gray-300">
            {/* Fixed Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-300 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-xl">
                <div>
                    <h2 className="text-xl font-bold">Bank Transfer (Contra)</h2>
                </div>
                {mode === 'modal' && (
                    <button
                        onClick={onClose}
                        className="text-purple-200 hover:text-white p-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit}>
                    {/* Bank Transfer Section */}
                    <div className="mb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* From Bank */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    From Bank (Payment Out) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiCreditCard className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <select
                                        name="out_bank_id"
                                        value={formData.out_bank_id}
                                        onChange={handleInputChange}
                                        className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-400 transition-colors appearance-none bg-white"
                                        required
                                    >
                                        <option value="" disabled>Select From Bank</option>
                                        {bankOptions.map(bank => (
                                            <option key={bank.id} value={bank.id}>
                                                {bank.name} - {bank.account} - BAL: ₹{bank.balance}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {formData.out_bank_id && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        Selected: {getSelectedOutBank()?.name} - Balance: ₹{getSelectedOutBank()?.balance}
                                    </div>
                                )}
                            </div>

                            {/* To Bank */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    To Bank (Payment In) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiCreditCard className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <select
                                        name="in_bank_id"
                                        value={formData.in_bank_id}
                                        onChange={handleInputChange}
                                        className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-400 transition-colors appearance-none bg-white"
                                        required
                                    >
                                        <option value="" disabled>Select To Bank</option>
                                        {bankOptions.map(bank => (
                                            <option key={bank.id} value={bank.id}>
                                                {bank.name} - {bank.account} - BAL: ₹{bank.balance}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {formData.in_bank_id && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        Selected: {getSelectedInBank()?.name} - Balance: ₹{getSelectedInBank()?.balance}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Date and Amount Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Transfer Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiCalendar className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-400 transition-colors"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Transfer Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiDollarSign className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-400 transition-colors"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    placeholder="Enter transfer amount"
                                    required
                                    min="1"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Transaction Ref ID and Description Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Transaction Ref ID */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Transaction Reference ID
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiHash className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-400 transition-colors"
                                    name="transaction_ref_id"
                                    value={formData.transaction_ref_id}
                                    onChange={handleInputChange}
                                    placeholder="Enter transaction reference number"
                                    maxLength="50"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Bank transaction ID, UTR number, or transfer reference
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Transfer Description
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                                    <FiFileText className="w-5 h-5 text-gray-400" />
                                </div>
                                <textarea
                                    className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-400 transition-colors"
                                    name="remark"
                                    value={formData.remark}
                                    onChange={handleInputChange}
                                    placeholder="Enter transfer description or remarks..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Transfer Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Transfer Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-600 mb-1">From Bank</div>
                                <div className="font-semibold text-red-600 truncate">
                                    {getSelectedOutBank()?.name || 'Not selected'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Balance: {getSelectedOutBank() ? `₹${getSelectedOutBank().balance}` : 'N/A'}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-600 mb-1">Transfer Amount</div>
                                <div className="font-semibold text-purple-600 text-lg">
                                    {formData.amount ? `₹${Number(formData.amount).toLocaleString('en-IN')}` : '0.00'}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-600 mb-1">To Bank</div>
                                <div className="font-semibold text-green-600 truncate">
                                    {getSelectedInBank()?.name || 'Not selected'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Balance: {getSelectedInBank() ? `₹${getSelectedInBank().balance}` : 'N/A'}
                                </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-600 mb-1">Transaction Ref</div>
                                <div className="font-semibold text-blue-600 truncate">
                                    {formData.transaction_ref_id || 'Not provided'}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Fixed Footer */}
            <div className="flex-shrink-0 border-t border-gray-300 bg-gray-50 p-3 rounded-b-xl">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        <div className="font-semibold">
                            Transfer Amount: {formData.amount ? `₹${Number(formData.amount).toLocaleString('en-IN')}` : '0.00'}
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
                            disabled={isSubmitting || !formData.out_bank_id || !formData.in_bank_id || !formData.amount || formData.out_bank_id === formData.in_bank_id}
                            className="px-8 py-3 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing Transfer...
                                </>
                            ) : (
                                `Transfer Funds - ${formData.amount ? `₹${Number(formData.amount).toLocaleString('en-IN')}` : '0.00'}`
                            )}
                        </button>
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
                    {/* Professional Modal panel with fixed height */}
                    <div className="relative w-full max-w-6xl bg-white rounded-xl shadow-2xl h-[85vh] flex flex-col">
                        {formContent}
                    </div>
                </div>
            </div>
        ) : null;
    }

    // Render as standalone page component
    return formContent;
};

export default ContraTransfer;