import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiDownload, FiEye, FiFileText, FiCalendar, FiDollarSign, FiCheckCircle, FiClock, FiXCircle, FiFilter, FiSearch } from 'react-icons/fi';

const QuotationTab = () => {
    const [quotations, setQuotations] = useState([
        { id: 1, quoteNo: "QTN-001", date: "2024-01-15", service: "GST Filing - Quarterly", amount: "2500", status: "Accepted", description: "Quarterly GST return filing for Q3", clientName: "Venkatesh R", dueDate: "2024-02-15" },
        { id: 2, quoteNo: "QTN-002", date: "2024-01-10", service: "Income Tax Return", amount: "3000", status: "Pending", description: "Income tax return filing for FY 2023-24", clientName: "Ramappa Enterprises", dueDate: "2024-01-31" },
        { id: 3, quoteNo: "QTN-003", date: "2024-01-05", service: "Company Registration", amount: "8000", status: "Rejected", description: "Private limited company registration", clientName: "Banashankari Traders", dueDate: "2024-01-20" },
        { id: 4, quoteNo: "QTN-004", date: "2024-01-20", service: "Audit Services", amount: "15000", status: "Accepted", description: "Annual financial audit", clientName: "Venkatesh R", dueDate: "2024-02-28" },
        { id: 5, quoteNo: "QTN-005", date: "2024-01-18", service: "Bookkeeping", amount: "5000", status: "Pending", description: "Monthly bookkeeping services", clientName: "Ramappa Enterprises", dueDate: "2024-02-18" }
    ]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredQuotations = quotations.filter(quote => {
        const matchesSearch = 
            quote.quoteNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.clientName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'All' || quote.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted': 
                return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
            case 'Pending': 
                return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200';
            case 'Rejected': 
                return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200';
            default: 
                return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Accepted': return <FiCheckCircle className="w-4 h-4" />;
            case 'Pending': return <FiClock className="w-4 h-4" />;
            case 'Rejected': return <FiXCircle className="w-4 h-4" />;
            default: return <FiFileText className="w-4 h-4" />;
        }
    };

    const calculateTotalRevenue = () => {
        return quotations
            .filter(quote => quote.status === 'Accepted')
            .reduce((sum, quote) => sum + parseInt(quote.amount), 0);
    };

    const getStatusCount = (status) => {
        return quotations.filter(quote => quote.status === status).length;
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
                        Quotation Management
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">Manage client proposals, approvals, and service agreements</p>
                </div>
                <div className="flex items-center gap-3">
                    <motion.button
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiPlus className="w-5 h-5" />
                        New Quotation
                    </motion.button>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Quotations</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{quotations.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                            <FiFileText className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Accepted</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{getStatusCount('Accepted')}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                            <FiCheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{getStatusCount('Pending')}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center">
                            <FiClock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">₹{calculateTotalRevenue()}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                            <FiDollarSign className="w-6 h-6 text-green-600" />
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
                        placeholder="Search by quote number, service, or client..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                    />
                </div>
                <div className="flex gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
                    >
                        <option value="All">All Status</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <motion.button
                        className="px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:shadow-md transition-all duration-300 font-medium flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiFilter className="w-4 h-4" />
                        Filter
                    </motion.button>
                </div>
            </div>

            {/* Quotations Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Quote Details
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Service
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredQuotations.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                            <FiFileText className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No quotations found</h3>
                                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredQuotations.map((quote, index) => (
                                    <motion.tr
                                        key={quote.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                        <FiFileText className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{quote.quoteNo}</div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <FiCalendar className="w-3.5 h-3.5" />
                                                            {quote.date}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600 pl-13">{quote.clientName}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="font-medium text-gray-900">{quote.service}</div>
                                                <div className="text-sm text-gray-600 max-w-xs">{quote.description}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                                                    <FiDollarSign className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-lg">₹{quote.amount}</div>
                                                    <div className="text-xs text-gray-500">Due: {quote.dueDate}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(quote.status)}
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(quote.status)}`}>
                                                    {quote.status}
                                                </span>
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
                                                    <FiEdit className="w-4 h-4" />
                                                </motion.button>
                                                <motion.button
                                                    className="p-2.5 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 hover:shadow-md rounded-xl transition-all duration-200"
                                                    whileHover={{ scale: 1.1, y: -2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FiDownload className="w-4 h-4" />
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
                {filteredQuotations.length > 0 && (
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{filteredQuotations.length}</span> of <span className="font-semibold">{quotations.length}</span> quotations
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

            {/* Quick Actions */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                            <FiFileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Quick Actions</h4>
                            <p className="text-sm text-gray-600">Generate new quotations or manage existing ones efficiently</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 font-semibold"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Generate PDF
                        </motion.button>
                        <motion.button
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Export to Excel
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default QuotationTab;