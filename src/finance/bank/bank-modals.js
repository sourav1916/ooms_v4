// finance/bank/bank-modals.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiDollarSign, FiShoppingBag, FiTruck, FiFileText, FiRepeat, FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Base Modal Component
const BaseModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                >
                    <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl pointer-events-auto mx-4">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <FiX className="w-6 h-6 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
                            {children}
                        </div>
                    </div>
                </motion.div>
            </>
        </AnimatePresence>
    );
};

// Receive Modal
export const ReceiveModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency, summary }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        onSubmit('RECEIVE', Object.fromEntries(formData));
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Receive from Client">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-blue-600 font-medium">Bank Name</p>
                            <p className="text-sm font-bold text-slate-700">{bankDetails?.bank || 'Current Bank'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 font-medium">Credit</p>
                            <p className="text-sm font-bold text-green-600">₹{formatCurrency(summary?.totalCredit || 0)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 font-medium">Debit</p>
                            <p className="text-sm font-bold text-red-600">₹{formatCurrency(summary?.totalDebit || 0)}</p>
                        </div>
                        <div className="col-span-3 mt-2 pt-2 border-t border-blue-200">
                            <p className="text-xs text-blue-600 font-medium">Current Balance</p>
                            <p className="text-lg font-bold text-blue-700">₹{formatCurrency(bankDetails?.balance || 0)}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Select Client <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="client"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Client</option>
                            <option value="1">Client 1</option>
                            <option value="2">Client 2</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="amount"
                                placeholder="Enter amount"
                                required
                                min="0.01"
                                step="0.01"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Enter description"
                            rows="3"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Select Bank <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="bank"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={bankId}>
                                {bankDetails?.bank || 'Current Bank'} - Balance: ₹{formatCurrency(bankDetails?.balance || 0)}
                            </option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-base font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

// Payment Modal
export const PaymentModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency , summary}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        onSubmit('PAYMENT', Object.fromEntries(formData));
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Payment to Client">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-red-600 font-medium">Bank Name</p>
                            <p className="text-sm font-bold text-slate-700">{bankDetails?.bank || 'Current Bank'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-red-600 font-medium">Credit</p>
                            <p className="text-sm font-bold text-green-600">₹{formatCurrency(summary?.totalCredit || 0)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-red-600 font-medium">Debit</p>
                            <p className="text-sm font-bold text-red-600">₹{formatCurrency(summary?.totalDebit || 0)}</p>
                        </div>
                        <div className="col-span-3 mt-2 pt-2 border-t border-red-200">
                            <p className="text-xs text-red-600 font-medium">Current Balance</p>
                            <p className="text-lg font-bold text-red-700">₹{formatCurrency(bankDetails?.balance || 0)}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Select Client <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="client"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Client</option>
                            <option value="1">Client 1</option>
                            <option value="2">Client 2</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="amount"
                                placeholder="Enter amount"
                                required
                                min="0.01"
                                step="0.01"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Enter description"
                            rows="3"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Payment Mode <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="payment_mode"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="cash">Cash</option>
                            <option value="cheque">Cheque</option>
                            <option value="online">Online Transfer</option>
                            <option value="card">Card</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Select Bank <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="bank"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={bankId}>
                                {bankDetails?.bank || 'Current Bank'} - Balance: ₹{formatCurrency(bankDetails?.balance || 0)}
                            </option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-base font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

// Sale Modal with Items
export const SaleModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency }) => {
    const [items, setItems] = useState([{ id: 1, service: '', description: '', price: 0 }]);
    const [total, setTotal] = useState(0);

    const addItem = () => {
        setItems([...items, { id: items.length + 1, service: '', description: '', price: 0 }]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id, field, value) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setItems(updatedItems);
        
        // Recalculate total
        const newTotal = updatedItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
        setTotal(newTotal);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            date: formData.get('date'),
            items: items,
            total: total,
            bank: formData.get('bank')
        };
        onSubmit('SALE', data);
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Sale from Bank">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-green-600 font-medium">Bank Name</p>
                            <p className="text-sm font-bold text-slate-700">{bankDetails?.bank || 'Current Bank'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-green-600 font-medium">Credit</p>
                            <p className="text-sm font-bold text-green-600">₹{formatCurrency(bankDetails?.balance || 0)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-green-600 font-medium">Debit</p>
                            <p className="text-sm font-bold text-red-600">₹0.00</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        required
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Items Table */}
                <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="p-3 text-left text-sm font-semibold text-slate-600">Item</th>
                                <th className="p-3 text-left text-sm font-semibold text-slate-600">Description</th>
                                <th className="p-3 text-right text-sm font-semibold text-slate-600">Price (₹)</th>
                                <th className="p-3 text-center text-sm font-semibold text-slate-600 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {items.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="p-2">
                                        <select
                                            value={item.service}
                                            onChange={(e) => updateItem(item.id, 'service', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Service</option>
                                            <option value="service1">Service 1</option>
                                            <option value="service2">Service 2</option>
                                            <option value="service3">Service 3</option>
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            placeholder="Description"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                                        />
                                    </td>
                                    <td className="p-2 text-center">
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                >
                    <FiPlus className="w-4 h-4" />
                    Add Item
                </button>

                {/* Summary */}
                <div className="bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-600">Total:</span>
                        <span className="text-lg font-bold text-slate-800">₹{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className="text-base font-medium text-slate-700">Payable:</span>
                        <span className="text-xl font-bold text-blue-600">₹{formatCurrency(total)}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Select Bank <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="bank"
                        required
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value={bankId}>
                            {bankDetails?.bank || 'Current Bank'} - Balance: ₹{formatCurrency(bankDetails?.balance || 0)}
                        </option>
                    </select>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-base font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

// Purchase Modal (similar to Sale)
export const PurchaseModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency }) => {
    const [items, setItems] = useState([{ id: 1, item: '', description: '', price: 0 }]);
    const [total, setTotal] = useState(0);

    const addItem = () => {
        setItems([...items, { id: items.length + 1, item: '', description: '', price: 0 }]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id, field, value) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setItems(updatedItems);
        
        const newTotal = updatedItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
        setTotal(newTotal);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            date: formData.get('date'),
            vendor: formData.get('vendor'),
            items: items,
            total: total,
            bank: formData.get('bank')
        };
        onSubmit('PURCHASE', data);
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Purchase">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-purple-600 font-medium">Bank Name</p>
                            <p className="text-sm font-bold text-slate-700">{bankDetails?.bank || 'Current Bank'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-purple-600 font-medium">Credit</p>
                            <p className="text-sm font-bold text-green-600">₹{formatCurrency(bankDetails?.balance || 0)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-purple-600 font-medium">Debit</p>
                            <p className="text-sm font-bold text-red-600">₹0.00</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Select Vendor <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="vendor"
                        required
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select Vendor</option>
                        <option value="1">Vendor 1</option>
                        <option value="2">Vendor 2</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        required
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Items Table */}
                <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="p-3 text-left text-sm font-semibold text-slate-600">Item</th>
                                <th className="p-3 text-left text-sm font-semibold text-slate-600">Description</th>
                                <th className="p-3 text-right text-sm font-semibold text-slate-600">Price (₹)</th>
                                <th className="p-3 text-center text-sm font-semibold text-slate-600 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {items.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.item}
                                            onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                                            placeholder="Item name"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            placeholder="Description"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                                        />
                                    </td>
                                    <td className="p-2 text-center">
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                >
                    <FiPlus className="w-4 h-4" />
                    Add Item
                </button>

                {/* Summary */}
                <div className="bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-600">Total:</span>
                        <span className="text-lg font-bold text-slate-800">₹{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className="text-base font-medium text-slate-700">Payable:</span>
                        <span className="text-xl font-bold text-blue-600">₹{formatCurrency(total)}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Select Bank <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="bank"
                        required
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value={bankId}>
                            {bankDetails?.bank || 'Current Bank'} - Balance: ₹{formatCurrency(bankDetails?.balance || 0)}
                        </option>
                    </select>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-base font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

// Expense Modal
export const ExpenseModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        onSubmit('EXPENSE', Object.fromEntries(formData));
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Expense from Bank">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-orange-600 font-medium">Bank Name</p>
                            <p className="text-sm font-bold text-slate-700">{bankDetails?.bank || 'Current Bank'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-orange-600 font-medium">Credit</p>
                            <p className="text-sm font-bold text-green-600">₹{formatCurrency(bankDetails?.balance || 0)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-orange-600 font-medium">Debit</p>
                            <p className="text-sm font-bold text-red-600">₹0.00</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Expense To <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="expense_to"
                            placeholder="Enter payee name"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="amount"
                                placeholder="Enter amount"
                                required
                                min="0.01"
                                step="0.01"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Enter description"
                            rows="3"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Expense Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Category</option>
                            <option value="rent">Rent</option>
                            <option value="salary">Salary</option>
                            <option value="electricity">Electricity</option>
                            <option value="travel">Travel</option>
                            <option value="office">Office Expenses</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            From Account (Bank) <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="bank"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={bankId}>
                                {bankDetails?.bank || 'Current Bank'} - Balance: ₹{formatCurrency(bankDetails?.balance || 0)}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Payment Mode <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="payment_mode"
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="cash">Cash</option>
                            <option value="cheque">Cheque</option>
                            <option value="online">Online Transfer</option>
                            <option value="card">Card</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-base font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

// Contra Modal
export const ContraModal = ({ isOpen, onClose, bankDetails, bankId, onSubmit, formatCurrency }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        onSubmit('CONTRA', Object.fromEntries(formData));
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Create Contra Entry">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-xs text-indigo-600 font-medium">From Bank</p>
                            <p className="text-sm font-bold text-slate-700">{bankDetails?.bank || 'Current Bank'}</p>
                            <p className="text-xs text-indigo-600 mt-1">Balance: ₹{formatCurrency(bankDetails?.balance || 0)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-indigo-600 font-medium">To Bank</p>
                            <p className="text-sm font-bold text-slate-700">To be selected</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <label className="block text-sm font-medium text-red-700 mb-2">
                            From Bank (Payment Out) <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="from_bank"
                            required
                            className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                        >
                            <option value={bankId}>
                                {bankDetails?.bank || 'Current Bank'} - Balance: ₹{formatCurrency(bankDetails?.balance || 0)}
                            </option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="amount"
                                placeholder="Enter amount"
                                required
                                min="0.01"
                                step="0.01"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Enter description"
                            rows="3"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <label className="block text-sm font-medium text-green-700 mb-2">
                            To Bank (Payment In) <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="to_bank"
                            required
                            className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                        >
                            <option value="">Select Bank</option>
                            <option value="1">Bank 1</option>
                            <option value="2">Bank 2</option>
                            <option value="3">Bank 3</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-base font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

// Modal Manager Component
export const TransactionModalManager = ({ 
    modalType, 
    isOpen, 
    onClose, 
    bankDetails, 
    bankId, 
    onSubmit,
    formatCurrency,
    summary 
}) => {
    const modalProps = {
        isOpen,
        onClose,
        bankDetails,
        bankId,
        onSubmit,
        formatCurrency,
        summary
    };

    switch(modalType) {
        case 'RECEIVE':
            return <ReceiveModal {...modalProps} />;
        case 'PAYMENT':
            return <PaymentModal {...modalProps} />;
        case 'SALE':
            return <SaleModal {...modalProps} />;
        case 'PURCHASE':
            return <PurchaseModal {...modalProps} />;
        case 'EXPENSE':
            return <ExpenseModal {...modalProps} />;
        case 'CONTRA':
            return <ContraModal {...modalProps} />;
        default:
            return null;
    }
};