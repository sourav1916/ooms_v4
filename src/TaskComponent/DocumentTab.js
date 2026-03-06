import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiFile,
    FiEye,
    FiTrash2,
    FiDownload,
    FiUpload,
    FiX,
    FiCheck,
    FiFileText,
    FiImage
} from 'react-icons/fi';

const DocumentsTab = ({ documents = [] }) => {
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
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
        if (selectedDocs.length === (documents || []).length) {
            setSelectedDocs([]);
        } else {
            setSelectedDocs((documents || []).map(doc => doc.id));
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
        // Add API call later
        setSelectedDocs([]);
    };

    const handleDelete = (id) => {
        // Add API call later
        setSelectedDocs(selectedDocs.filter(docId => docId !== id));
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
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
                                    checked={selectedDocs.length === (documents || []).length && (documents || []).length > 0}
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
                            {(documents || []).map((doc, index) => (
                                <motion.tr
                                    key={doc.id || index}
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
                                            <span className="font-medium">{doc.name || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{doc.remark || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                            {doc.type || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{doc.size || 'N/A'}</td>
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

                {(!documents || documents.length === 0) && (
                    <div className="text-center py-12 text-gray-500">
                        <FiFile className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No documents found. Click the button above to upload.</p>
                    </div>
                )}
            </div>

            {/* Upload Modal - Keep as is */}
            <AnimatePresence>
                {showUploadModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    >
                        {/* Modal content remains the same */}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DocumentsTab;