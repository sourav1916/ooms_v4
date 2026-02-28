import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiCheckSquare,
    FiPlus,
    FiEdit,
    FiTrash2,
    FiUser,
    FiX,
    FiCheck,
    FiChevronDown
} from 'react-icons/fi';

const SubtaskTab = ({ 
    subtasks = [],                    // Add default empty array
    availableStaff = [],               // Add default empty array
    variants 
}) => {
    const [subtaskList, setSubtaskList] = useState(subtasks);
    const [showModal, setShowModal] = useState(false);
    const [editingSubtask, setEditingSubtask] = useState(null);
    const [formData, setFormData] = useState({ name: '', assignedTo: '' });

    const getStatusBadge = (status) => {
        const colors = {
            'Completed': 'bg-green-100 text-green-800',
            'In Progress': 'bg-blue-100 text-blue-800',
            'On Hold': 'bg-yellow-100 text-yellow-800',
            'Pending': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || colors['Pending'];
    };

    const handleAdd = () => {
        if (formData.name.trim()) {
            const assignedStaff = availableStaff?.find(s => s.id === parseInt(formData.assignedTo));
            const newSubtask = {
                id: subtaskList.length + 1,
                name: formData.name,
                status: "Pending",
                assignedTo: formData.assignedTo,
                completedBy: assignedStaff ? assignedStaff.name : ""
            };
            setSubtaskList([...subtaskList, newSubtask]);
            resetForm();
        }
    };

    const handleUpdate = () => {
        if (formData.name.trim() && editingSubtask) {
            setSubtaskList(subtaskList.map(task => 
                task.id === editingSubtask.id 
                    ? { 
                        ...task, 
                        name: formData.name,
                        assignedTo: formData.assignedTo,
                        completedBy: availableStaff?.find(s => s.id === parseInt(formData.assignedTo))?.name || ""
                      }
                    : task
            ));
            resetForm();
        }
    };

    const handleDelete = (id) => {
        setSubtaskList(subtaskList.filter(task => task.id !== id));
    };

    const handleStatusChange = (id, newStatus) => {
        setSubtaskList(subtaskList.map(task => 
            task.id === id 
                ? { 
                    ...task, 
                    status: newStatus,
                    completedBy: newStatus === 'Completed' ? 'Current User' : task.completedBy
                  }
                : task
        ));
    };

    const resetForm = () => {
        setFormData({ name: '', assignedTo: '' });
        setEditingSubtask(null);
        setShowModal(false);
    };

    const openEditModal = (subtask) => {
        setEditingSubtask(subtask);
        setFormData({
            name: subtask.name,
            assignedTo: subtask.assignedTo || ''
        });
        setShowModal(true);
    };

    const getAssignedName = (id) => {
        if (!id) return '-';
        const staff = availableStaff?.find(s => s.id === parseInt(id));
        return staff ? staff.name : '-';
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
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FiCheckSquare className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Sub Tasks</h3>
                </div>
                <motion.button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiPlus className="w-4 h-4" />
                    Add Subtask
                </motion.button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-gray-900">
                        <tr>
                            <th className="px-4 py-3 font-semibold">#</th>
                            <th className="px-4 py-3 font-semibold">NAME</th>
                            <th className="px-4 py-3 font-semibold">STATUS</th>
                            <th className="px-4 py-3 font-semibold">ASSIGNED TO</th>
                            <th className="px-4 py-3 font-semibold">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {subtaskList?.map((task, index) => (
                                <motion.tr
                                    key={task.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium">{task.name}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            className={`px-2 py-1 rounded text-xs font-medium border-0 focus:ring-2 focus:ring-indigo-500 ${getStatusBadge(task.status)}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="On Hold">On Hold</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <FiUser className="w-3 h-3 text-gray-400" />
                                            {getAssignedName(task.assignedTo)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                onClick={() => openEditModal(task)}
                                                className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FiEdit className="w-4 h-4" />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDelete(task.id)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) || []}
                        </AnimatePresence>
                    </tbody>
                </table>

                {(!subtaskList || subtaskList.length === 0) && (
                    <div className="text-center py-12 text-gray-500">
                        <FiCheckSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No subtasks yet. Click the button above to add one.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Subtask Modal - Keep the same as before */}
            <AnimatePresence>
                {showModal && (
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
                            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold">
                                    {editingSubtask ? 'Edit Subtask' : 'Add Subtask'}
                                </h2>
                                <button onClick={resetForm} className="text-white hover:text-indigo-200">
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subtask Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="Enter subtask name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        autoFocus
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assign To
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.assignedTo}
                                            onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
                                        >
                                            <option value="">Choose staff member</option>
                                            {availableStaff?.map(staff => (
                                                <option key={staff.id} value={staff.id}>
                                                    {staff.name} - {staff.role}
                                                </option>
                                            )) || []}
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
                                <button onClick={resetForm} className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100">
                                    Cancel
                                </button>
                                <button
                                    onClick={editingSubtask ? handleUpdate : handleAdd}
                                    disabled={!formData.name.trim()}
                                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editingSubtask ? (
                                        <>
                                            <FiCheck className="w-4 h-4" />
                                            Update Subtask
                                        </>
                                    ) : (
                                        <>
                                            <FiPlus className="w-4 h-4" />
                                            Add Subtask
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SubtaskTab;