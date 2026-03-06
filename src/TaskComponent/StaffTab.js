import React from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiUsers } from 'react-icons/fi';

const StaffTab = ({ staff = [], onAddStaff, onRemoveStaff }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FiUsers className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Assigned Staff</h3>
                </div>
                <motion.button
                    onClick={onAddStaff}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiPlus className="w-4 h-4" />
                    Assign Staff
                </motion.button>
            </div>

            <div className="space-y-3">
                {staff && staff.length > 0 ? (
                    staff.map((member, index) => (
                        <motion.div
                            key={member.id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <div className="flex-1">
                                <div className="font-semibold text-gray-900">{member.name || 'Unknown'}</div>
                                <div className="text-sm text-gray-600">{member.role || 'Staff'} • {member.email || 'No email'}</div>
                            </div>
                            <motion.button
                                onClick={() => onRemoveStaff?.(member.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiTrash2 className="w-4 h-4" />
                            </motion.button>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <FiUsers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No staff assigned yet. Click the button above to assign.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffTab;