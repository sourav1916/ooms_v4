import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiFile,
    FiPlus,
    FiEye,
    FiTrash2,
    FiDownload,
    FiUpload,
    FiX,
    FiCheck,
    FiFileText,
    FiImage
} from 'react-icons/fi';

const DocumentsTab = ({ documents: initialDocuments, variants }) => {
    const [documents, setDocuments] = useState(initialDocuments);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [uploadData, setUploadData] = useState({
        name: '',
        remark: '',
        file: null
    });

    const getFileIcon = (type) => {
        switch(type?.toLowerCase()) {
            case 'pdf':
                return <FiFileText className="w-5 h-5 text-red-500" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <FiImage className="w-5 h-5 text-green-500" />;
            default:
                return <FiFile className="w-5 h-5 text-blue-500" />;
        }
    };

    const handleSelectAll = () => {
        if (selectedDocs.length === documents.length) {
            setSelectedDocs([]);
        } else {
            setSelectedDocs(documents.map(doc => doc.id));
        }
    };

    const handleSelectDoc = (id) => {
        if (selectedDocs.includes(id)) {
            setSelectedDocs(selectedDocs.filter(docId => docId !== id));
        } else {
            setSelectedDocs([...selectedDocs, id]);
        }
    };

    const handleDeleteSelected = () => {
        setDocuments(documents.filter(doc => !selectedDocs.includes(doc.id)));
        setSelectedDocs([]);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadData({
                name: file.name.split('.')[0],
                remark: '',
                file: file
            });
        }
    };

    const handleUpload = () => {
        if (uploadData.name.trim() && uploadData.file) {
            const newDoc = {
                id: documents.length + 1,
                name: uploadData.name,
                remark: uploadData.remark,
                type: uploadData.file.name.split('.').pop().toUpperCase(),
                size: `${(uploadData.file.size / 1024 / 1024).toFixed(1)} MB`
            };
            setDocuments([newDoc, ...documents]);
            setUploadData({ name: '', remark: '', file: null });
            setShowUploadModal(false);
        }
    };

    const handleDelete = (id) => {
        setDocuments(documents.filter(doc => doc.id !== id));
        setSelectedDocs(selectedDocs.filter(docId => docId !== id));
    };

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white rounded-lg border border-gray-200 p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <FiFile className="w-5 h-5 text-cyan-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                </div>
                <div className="flex items-center gap-2">
                    {selectedDocs.length > 0 && (
                        <>
                            <motion.button
                                onClick={handleDeleteSelected}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiTrash2 className="w-4 h-4" />
                                Delete Selected ({selectedDocs.length})
                            </motion.button>
                            <button
                                onClick={() => setSelectedDocs([])}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                            >
                                Clear
                            </button>
                        </>
                    )}
                    <motion.button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiUpload className="w-4 h-4" />
                        Upload Document
                    </motion.button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-gray-900">
                        <tr>
                            <th className="px-4 py-3 w-12">
                                <input
                                    type="checkbox"
                                    checked={selectedDocs.length === documents.length && documents.length > 0}
                                    onChange={handleSelectAll}
                                    className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                                />
                            </th>
                            <th className="px-4 py-3 font-semibold">#</th>
                            <th className="px-4 py-3 font-semibold">Name</th>
                            <th className="px-4 py-3 font-semibold">Remark</th>
                            <th className="px-4 py-3 font-semibold">Type</th>
                            <th className="px-4 py-3 font-semibold">Size</th>
                            <th className="px-4 py-3 font-semibold">View</th>
                            <th className="px-4 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {documents.map((doc, index) => (
                                <motion.tr
                                    key={doc.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedDocs.includes(doc.id)}
                                            onChange={() => handleSelectDoc(doc.id)}
                                            className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                                        />
                                    </td>
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {getFileIcon(doc.type)}
                                            <span className="font-medium">{doc.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{doc.remark || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{doc.size}</td>
                                    <td className="px-4 py-3">
                                        <motion.button
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FiEye className="w-4 h-4" />
                                        </motion.button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FiDownload className="w-4 h-4" />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDelete(doc.id)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {documents.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <FiFile className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No documents found. Click the button above to upload.</p>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Upload Document</h2>
                                <button 
                                    onClick={() => {
                                        setShowUploadModal(false);
                                        setUploadData({ name: '', remark: '', file: null });
                                    }}
                                    className="text-white hover:text-cyan-200"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Document Name
                                    </label>
                                    <input
                                        type="text"
                                        value={uploadData.name}
                                        onChange={(e) => setUploadData({...uploadData, name: e.target.value})}
                                        placeholder="Enter document name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        File
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                        />
                                        <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                                            uploadData.file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-cyan-400'
                                        }`}>
                                            {uploadData.file ? (
                                                <div className="text-green-700">
                                                    <FiCheck className="w-6 h-6 mx-auto mb-2" />
                                                    <p className="text-sm font-medium">{uploadData.file.name}</p>
                                                    <p className="text-xs mt-1">
                                                        {(uploadData.file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="text-gray-600">
                                                    <FiUpload className="w-6 h-6 mx-auto mb-2" />
                                                    <p className="text-sm">Click to upload or drag and drop</p>
                                                    <p className="text-xs mt-1">PDF, DOC, XLS, JPG, PNG (Max 10MB)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Remark (Optional)
                                    </label>
                                    <textarea
                                        value={uploadData.remark}
                                        onChange={(e) => setUploadData({...uploadData, remark: e.target.value})}
                                        rows="2"
                                        placeholder="Enter remarks"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none"
                                    />
                                </div>
                            </div>

                            <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowUploadModal(false);
                                        setUploadData({ name: '', remark: '', file: null });
                                    }}
                                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={!uploadData.name.trim() || !uploadData.file}
                                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiUpload className="w-4 h-4" />
                                    Upload Document
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DocumentsTab;