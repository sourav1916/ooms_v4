import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFile, FiUpload, FiEye, FiDownload, FiFolder, FiFilter, FiSearch, FiHardDrive, FiCheckCircle, FiClock, FiFileText, FiImage, FiArchive, FiPrinter, FiTrash2 } from 'react-icons/fi';

const DocumentsTab = () => {
    const [documents, setDocuments] = useState([
        { id: 1, name: "PAN Card", type: "Identity", uploaded: "2024-01-15", size: "2.1 MB", category: "KYC", format: "PDF", status: "Verified", lastAccessed: "2024-01-20" },
        { id: 2, name: "Aadhaar Card - Front & Back", type: "Identity", uploaded: "2024-01-15", size: "1.8 MB", category: "KYC", format: "Image", status: "Verified", lastAccessed: "2024-01-18" },
        { id: 3, name: "Bank Statement - Jan 2024", type: "Financial", uploaded: "2024-01-10", size: "3.2 MB", category: "Financial", format: "PDF", status: "Pending Review", lastAccessed: "2024-01-12" },
        { id: 4, name: "GST Registration Certificate", type: "Business", uploaded: "2024-01-05", size: "1.5 MB", category: "Registration", format: "PDF", status: "Verified", lastAccessed: "2024-01-15" },
        { id: 5, name: "Company Incorporation Document", type: "Legal", uploaded: "2024-01-03", size: "4.8 MB", category: "Legal", format: "PDF", status: "Verified", lastAccessed: "2024-01-10" },
        { id: 6, name: "Audit Report FY 2023-24", type: "Financial", uploaded: "2024-01-20", size: "5.2 MB", category: "Audit", format: "PDF", status: "Pending Review", lastAccessed: "2024-01-22" }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = 
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter;
        const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getCategoryColor = (category) => {
        switch (category) {
            case 'KYC': 
                return 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200';
            case 'Financial': 
                return 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200';
            case 'Registration': 
                return 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border border-purple-200';
            case 'Legal': 
                return 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-200';
            case 'Audit': 
                return 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border border-yellow-200';
            default: 
                return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Verified': 
                return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
            case 'Pending Review': 
                return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200';
            case 'Expired': 
                return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200';
            default: 
                return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
        }
    };

    const getFormatIcon = (format) => {
        switch (format) {
            case 'PDF': return <FiFileText className="w-4 h-4" />;
            case 'Image': return <FiImage className="w-4 h-4" />;
            case 'Word': return <FiFileText className="w-4 h-4" />;
            case 'Excel': return <FiFileText className="w-4 h-4" />;
            default: return <FiArchive className="w-4 h-4" />;
        }
    };

    const getFormatColor = (format) => {
        switch (format) {
            case 'PDF': return 'text-red-600 bg-red-50';
            case 'Image': return 'text-blue-600 bg-blue-50';
            case 'Word': return 'text-blue-600 bg-blue-50';
            case 'Excel': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Identity': return <FiFile className="w-5 h-5" />;
            case 'Financial': return <FiFileText className="w-5 h-5" />;
            case 'Business': return <FiFolder className="w-5 h-5" />;
            case 'Legal': return <FiFileText className="w-5 h-5" />;
            default: return <FiFile className="w-5 h-5" />;
        }
    };

    const calculateDocumentStats = () => {
        const totalDocs = documents.length;
        const totalSize = documents.reduce((sum, doc) => {
            const size = parseFloat(doc.size);
            return sum + size;
        }, 0);
        const verifiedDocs = documents.filter(d => d.status === 'Verified').length;
        const pendingDocs = documents.filter(d => d.status === 'Pending Review').length;
        
        return { totalDocs, totalSize: totalSize.toFixed(1), verifiedDocs, pendingDocs };
    };

    const stats = calculateDocumentStats();

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
                        Document Repository
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">Securely store, manage, and organize client documents</p>
                </div>
                <div className="flex items-center gap-3">
                    <motion.button
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiUpload className="w-5 h-5" />
                        Upload Documents
                    </motion.button>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Documents</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDocs}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                            <FiFolder className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Size</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalSize} MB</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                            <FiHardDrive className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Verified</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.verifiedDocs}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                            <FiCheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending Review</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingDocs}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center">
                            <FiClock className="w-6 h-6 text-yellow-600" />
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
                        placeholder="Search documents by name, type, or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                    />
                </div>
                <div className="flex gap-3">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
                    >
                        <option value="All">All Categories</option>
                        <option value="KYC">KYC</option>
                        <option value="Financial">Financial</option>
                        <option value="Registration">Registration</option>
                        <option value="Legal">Legal</option>
                        <option value="Audit">Audit</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
                    >
                        <option value="All">All Status</option>
                        <option value="Verified">Verified</option>
                        <option value="Pending Review">Pending Review</option>
                        <option value="Expired">Expired</option>
                    </select>
                </div>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {filteredDocuments.length === 0 ? (
                    <div className="col-span-2 text-center py-12">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                            <FiFolder className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    filteredDocuments.map((doc, index) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white">
                                            {getTypeIcon(doc.type)}
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-lg font-bold text-gray-900">{doc.name}</h4>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(doc.category)}`}>
                                                    {doc.category}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(doc.status)}`}>
                                                    {doc.status}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getFormatColor(doc.format)}`}>
                                                    {doc.format}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <motion.button
                                            className="p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:shadow-md rounded-xl transition-all duration-200"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FiEye className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <div className="text-gray-500">Document Type</div>
                                            <div className="font-medium text-gray-900">{doc.type}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-gray-500">File Size</div>
                                            <div className="font-medium text-gray-900">{doc.size}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                        <div className="text-sm text-gray-600">
                                            Uploaded: <span className="font-medium text-gray-900">{doc.uploaded}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Last accessed: <span className="font-medium text-gray-900">{doc.lastAccessed}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between pt-3 border-t border-gray-200">
                                    <div className="flex gap-2">
                                        <motion.button
                                            className="p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:shadow-md rounded-xl transition-all duration-200 flex items-center gap-2"
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FiDownload className="w-4 h-4" />
                                            <span className="text-sm font-medium">Download</span>
                                        </motion.button>
                                        <motion.button
                                            className="p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 hover:shadow-md rounded-xl transition-all duration-200"
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FiPrinter className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                    <motion.button
                                        className="p-2.5 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:shadow-md rounded-xl transition-all duration-200"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                            <FiFolder className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Document Management</h4>
                            <p className="text-sm text-gray-600">
                                {stats.verifiedDocs} verified • {stats.pendingDocs} pending review • {stats.totalSize} MB total storage used
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 font-semibold"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Bulk Download
                        </motion.button>
                        <motion.button
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Share Documents
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Category Distribution & Storage Usage */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiFolder className="w-5 h-5 text-purple-600" />
                        Documents by Category
                    </h4>
                    <div className="space-y-3">
                        {Array.from(new Set(documents.map(d => d.category))).map((category, index) => {
                            const categoryCount = documents.filter(d => d.category === category).length;
                            const percentage = (categoryCount / documents.length) * 100;
                            
                            return (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">{category}</span>
                                        <span className="font-semibold text-gray-900">{categoryCount} documents</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
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
                        <FiHardDrive className="w-5 h-5 text-green-600" />
                        Storage Usage by Type
                    </h4>
                    <div className="space-y-3">
                        {Array.from(new Set(documents.map(d => d.type))).map((type, index) => {
                            const typeDocs = documents.filter(d => d.type === type);
                            const totalSize = typeDocs.reduce((sum, d) => sum + parseFloat(d.size), 0);
                            const percentage = (totalSize / parseFloat(stats.totalSize)) * 100;
                            
                            return (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">{type}</span>
                                        <span className="font-semibold text-gray-900">{totalSize.toFixed(1)} MB</span>
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
            </div>

            {/* Recent Uploads */}
            <div className="mt-6 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FiClock className="w-5 h-5 text-yellow-600" />
                        Recently Uploaded Documents
                    </h4>
                    <motion.button
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        View All
                    </motion.button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {documents
                        .sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded))
                        .slice(0, 3)
                        .map(doc => (
                            <div key={doc.id} className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFormatColor(doc.format)}`}>
                                            {getFormatIcon(doc.format)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 line-clamp-1">{doc.name}</div>
                                            <div className="text-xs text-gray-500">{doc.format} • {doc.size}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(doc.status)}`}>
                                        {doc.status}
                                    </span>
                                    <span className="text-xs text-gray-500">{doc.uploaded}</span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </motion.div>
    );
};

export default DocumentsTab;