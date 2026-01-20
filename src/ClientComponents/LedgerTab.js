import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiDownload, FiTrendingUp, FiTrendingDown, FiDollarSign, FiCalendar, FiFilter, FiSearch, FiBarChart2, FiPieChart, FiRefreshCw, FiEye } from 'react-icons/fi';

const LedgerTab = () => {
    const [ledger, setLedger] = useState({
        period: "01/01/2024 - 31/01/2024",
        openingBalance: "0.00",
        closingBalance: "6500.00",
        entries: [
            { id: 1, date: "2024-01-15", description: "Consulting Fees - Q3 Services", debit: "15000", credit: "-", balance: "15000", type: "Income", category: "Professional Fees" },
            { id: 2, date: "2024-01-10", description: "Office Rent & Utilities", debit: "-", credit: "8500", balance: "6500", type: "Expense", category: "Office Expenses" },
            { id: 3, date: "2024-01-05", description: "Service Charges - Annual Contract", debit: "12000", credit: "-", balance: "18500", type: "Income", category: "Service Revenue" },
            { id: 4, date: "2024-01-20", description: "Software Subscriptions", debit: "-", credit: "5000", balance: "13500", type: "Expense", category: "Technology" },
            { id: 5, date: "2024-01-25", description: "Tax Consultation - Corporate Client", debit: "8000", credit: "-", balance: "21500", type: "Income", category: "Consultation" }
        ]
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [periodFilter, setPeriodFilter] = useState('Current Month');

    const filteredEntries = ledger.entries.filter(entry => {
        const matchesSearch = 
            entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = typeFilter === 'All' || entry.type === typeFilter;
        
        return matchesSearch && matchesType;
    });

    const calculateFinancialMetrics = () => {
        const totalIncome = ledger.entries
            .filter(entry => entry.type === 'Income')
            .reduce((sum, entry) => sum + parseInt(entry.debit === '-' ? 0 : entry.debit), 0);
        
        const totalExpenses = ledger.entries
            .filter(entry => entry.type === 'Expense')
            .reduce((sum, entry) => sum + parseInt(entry.credit === '-' ? 0 : entry.credit), 0);
        
        const netProfit = totalIncome - totalExpenses;
        const transactionCount = ledger.entries.length;
        
        return { totalIncome, totalExpenses, netProfit, transactionCount };
    };

    const metrics = calculateFinancialMetrics();

    const getTypeColor = (type) => {
        switch (type) {
            case 'Income': 
                return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
            case 'Expense': 
                return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200';
            default: 
                return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Income': return <FiTrendingUp className="w-4 h-4" />;
            case 'Expense': return <FiTrendingDown className="w-4 h-4" />;
            default: return <FiDollarSign className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Professional Fees': return 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700';
            case 'Service Revenue': return 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700';
            case 'Consultation': return 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700';
            case 'Office Expenses': return 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700';
            case 'Technology': return 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700';
            default: return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-xl p-6"
        >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                        Financial Ledger
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiCalendar className="w-4 h-4" />
                            Period: <span className="font-semibold text-gray-900">{ledger.period}</span>
                        </div>
                        <motion.button
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiRefreshCw className="w-3 h-3" />
                            Change Period
                        </motion.button>
                    </div>
                </div>
                <div className="flex gap-3">
                    <motion.button
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiFileText className="w-5 h-5" />
                        Generate Report
                    </motion.button>
                    <motion.button
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 font-semibold"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiDownload className="w-5 h-5" />
                        Export Data
                    </motion.button>
                </div>
            </div>

            {/* Financial Overview Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Opening Balance</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">₹{ledger.openingBalance}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                            <FiTrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Closing Balance</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">₹{ledger.closingBalance}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                            <FiTrendingDown className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Income</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">₹{metrics.totalIncome.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                            <FiBarChart2 className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Net Profit</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">₹{metrics.netProfit.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                            <FiPieChart className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search transactions by description or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                    />
                </div>
                <div className="flex gap-3">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
                    >
                        <option value="All">All Types</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                    <select
                        value={periodFilter}
                        onChange={(e) => setPeriodFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
                    >
                        <option value="Current Month">Current Month</option>
                        <option value="Last Month">Last Month</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                    </select>
                </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-semibold text-gray-900">Income Summary</div>
                        <FiTrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">₹{metrics.totalIncome.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">
                        {ledger.entries.filter(e => e.type === 'Income').length} income transactions
                    </div>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-semibold text-gray-900">Expense Summary</div>
                        <FiTrendingDown className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">₹{metrics.totalExpenses.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">
                        {ledger.entries.filter(e => e.type === 'Expense').length} expense transactions
                    </div>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-semibold text-gray-900">Balance Flow</div>
                        <FiDollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Opening:</span>
                            <span className="font-semibold text-gray-900">₹{ledger.openingBalance}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Net Change:</span>
                            <span className={`font-semibold ${metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {metrics.netProfit >= 0 ? '+' : ''}₹{metrics.netProfit.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                            <span className="text-gray-600">Closing:</span>
                            <span className="font-bold text-gray-900 text-lg">₹{ledger.closingBalance}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ledger Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Date & Type
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Debit (₹)
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Credit (₹)
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Balance (₹)
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredEntries.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                            <FiFileText className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No ledger entries found</h3>
                                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredEntries.map((entry, index) => (
                                    <motion.tr
                                        key={entry.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-slate-50/50 transition-all duration-300 ${
                                            entry.type === 'Income' ? 'bg-green-50/20' : 'bg-red-50/20'
                                        }`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <div className="font-medium text-gray-900">{entry.date}</div>
                                                <div className="flex items-center gap-2">
                                                    {getTypeIcon(entry.type)}
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(entry.type)}`}>
                                                        {entry.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <div className="font-medium text-gray-900">{entry.description}</div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(entry.category)}`}>
                                                        {entry.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`font-bold text-lg ${
                                                entry.debit === '-' ? 'text-gray-400' : 'text-green-600'
                                            }`}>
                                                {entry.debit === '-' ? '-' : `₹${parseInt(entry.debit).toLocaleString()}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`font-bold text-lg ${
                                                entry.credit === '-' ? 'text-gray-400' : 'text-red-600'
                                            }`}>
                                                {entry.credit === '-' ? '-' : `₹${parseInt(entry.credit).toLocaleString()}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                    parseInt(entry.balance) >= 0 
                                                        ? 'bg-gradient-to-r from-green-100 to-emerald-100' 
                                                        : 'bg-gradient-to-r from-red-100 to-pink-100'
                                                }`}>
                                                    <FiDollarSign className={`w-4 h-4 ${
                                                        parseInt(entry.balance) >= 0 ? 'text-green-600' : 'text-red-600'
                                                    }`} />
                                                </div>
                                                <div className="font-bold text-xl text-gray-900">
                                                    ₹{parseInt(entry.balance).toLocaleString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <motion.button
                                                    className="p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:shadow-md rounded-xl transition-all duration-200"
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </motion.button>
                                                <motion.button
                                                    className="p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 hover:shadow-md rounded-xl transition-all duration-200"
                                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FiFileText className="w-4 h-4" />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                {filteredEntries.length > 0 && (
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{filteredEntries.length}</span> of <span className="font-semibold">{ledger.entries.length}</span> entries • 
                                <span className="ml-2 font-semibold text-green-600">₹{metrics.totalIncome.toLocaleString()}</span> income • 
                                <span className="ml-2 font-semibold text-red-600">₹{metrics.totalExpenses.toLocaleString()}</span> expenses
                            </div>
                            <div className="flex items-center gap-3">
                                <motion.button
                                    className="px-4 py-2 text-gray-600 hover:bg-white rounded-lg font-medium transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Previous
                                </motion.button>
                                <div className="flex gap-1">
                                    <button className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-semibold">
                                        1
                                    </button>
                                    <button className="w-8 h-8 text-gray-600 hover:bg-white rounded-lg font-medium">
                                        2
                                    </button>
                                    <button className="w-8 h-8 text-gray-600 hover:bg-white rounded-lg font-medium">
                                        3
                                    </button>
                                </div>
                                <motion.button
                                    className="px-4 py-2 text-gray-600 hover:bg-white rounded-lg font-medium transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Next
                                </motion.button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Financial Insights */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                            <FiBarChart2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Financial Insights</h4>
                            <p className="text-sm text-gray-600">
                                Net profit margin: <span className={`font-bold ${metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {((metrics.netProfit / metrics.totalIncome) * 100).toFixed(1)}%
                                </span> • 
                                <span className="ml-3">Total transactions: <span className="font-bold text-gray-900">{metrics.transactionCount}</span></span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 font-semibold"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Add Entry
                        </motion.button>
                        <motion.button
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            View Charts
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiPieChart className="w-5 h-5 text-purple-600" />
                        Income Categories
                    </h4>
                    <div className="space-y-3">
                        {Array.from(new Set(ledger.entries.filter(e => e.type === 'Income').map(e => e.category))).map((category, index) => {
                            const categoryTotal = ledger.entries
                                .filter(e => e.type === 'Income' && e.category === category)
                                .reduce((sum, e) => sum + parseInt(e.debit === '-' ? 0 : e.debit), 0);
                            const percentage = (categoryTotal / metrics.totalIncome) * 100;
                            
                            return (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">{category}</span>
                                        <span className="font-semibold text-gray-900">₹{categoryTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiPieChart className="w-5 h-5 text-red-600" />
                        Expense Categories
                    </h4>
                    <div className="space-y-3">
                        {Array.from(new Set(ledger.entries.filter(e => e.type === 'Expense').map(e => e.category))).map((category, index) => {
                            const categoryTotal = ledger.entries
                                .filter(e => e.type === 'Expense' && e.category === category)
                                .reduce((sum, e) => sum + parseInt(e.credit === '-' ? 0 : e.credit), 0);
                            const percentage = (categoryTotal / metrics.totalExpenses) * 100;
                            
                            return (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">{category}</span>
                                        <span className="font-semibold text-gray-900">₹{categoryTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full bg-gradient-to-r from-red-500 to-pink-600"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default LedgerTab;