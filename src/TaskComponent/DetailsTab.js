import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiX, FiCheck ,  FiClipboard } from 'react-icons/fi';

const DetailsTab = ({ taskData: initialData, variants }) => {
    const [taskData, setTaskData] = useState(initialData);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');

    const handleEdit = (field, value) => {
        setEditingField(field);
        setEditValue(value);
    };

    const handleSave = () => {
        if (editingField) {
            setTaskData(prev => ({
                ...prev,
                [editingField]: editValue
            }));
            setEditingField(null);
        }
    };

    const handleCancel = () => {
        setEditingField(null);
    };

    const DetailRow = ({ label, value, field }) => (
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="font-medium text-gray-700 text-sm">{label}</span>
            {editingField === field ? (
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                        autoFocus
                    />
                    <button
                        onClick={handleSave}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                        <FiCheck className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleCancel}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-medium">{value}</span>
                    <motion.button
                        onClick={() => handleEdit(field, value)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FiEdit className="w-4 h-4" />
                    </motion.button>
                </div>
            )}
        </div>
    );

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white rounded-lg border border-gray-200 p-6 group"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiClipboard className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Task Information</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-600 mb-4 pb-2 border-b">Task Details</h4>
                    <DetailRow label="FIRM" value={taskData.firm} field="firm" />
                    <DetailRow label="PAN" value={taskData.pan} field="pan" />
                    <DetailRow label="GST" value={taskData.gst || "N/A"} field="gst" />
                    <DetailRow label="STATUS" value={taskData.status} field="status" />
                    <DetailRow label="FEES" value={`₹${taskData.fees}`} field="fees" />
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-600 mb-4 pb-2 border-b">Assignment Details</h4>
                    <DetailRow label="CREATE DATE" value={taskData.createDate} field="createDate" />
                    <DetailRow label="CREATE BY" value={taskData.createBy} field="createBy" />
                    <DetailRow label="ASSIGNED CA" value={taskData.assignedCA || "Not Assigned"} field="assignedCA" />
                    <DetailRow label="MENTOR" value={taskData.mentor || "Not Assigned"} field="mentor" />
                    <DetailRow label="DUE DATE" value={taskData.dueDate} field="dueDate" />
                </div>
            </div>
        </motion.div>
    );
};

export default DetailsTab;