import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiClock,
    FiPlus,
    FiUser,
    FiCalendar,
    FiX
} from 'react-icons/fi';

const TimelogTab = ({ timelogs = [] }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [hours, setHours] = useState('');
    const [description, setDescription] = useState('');

    const totalHours = (timelogs || []).reduce((acc, log) => {
        const hours = parseInt(log.spent) || 0;
        return acc + hours;
    }, 0);

    const days = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;
    const minutes = 0;

    const handleAddTimelog = () => {
        if (hours && description) {
            // Add your API call here later
            setHours('');
            setDescription('');
            setShowAddModal(false);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FiClock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Time Logs</h3>
                        <p className="text-sm text-gray-600">
                            Total Time Spent: <span className="font-semibold">{days} Days, {remainingHours} Hours, {minutes} Minutes</span>
                        </p>
                    </div>
                </div>
                <motion.button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiPlus className="w-4 h-4" />
                    Add Time Log
                </motion.button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-gray-900">
                        <tr>
                            <th className="px-4 py-3 font-semibold">#</th>
                            <th className="px-4 py-3 font-semibold">CREATE</th>
                            <th className="px-4 py-3 font-semibold">NAME</th>
                            <th className="px-4 py-3 font-semibold">USER</th>
                            <th className="px-4 py-3 font-semibold">TIMESTAMP</th>
                            <th className="px-4 py-3 font-semibold">SPENT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {(timelogs || []).map((log, index) => (
                                <motion.tr
                                    key={log.id || index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <FiCalendar className="w-3 h-3 text-gray-400" />
                                            {log.createDate || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium">{log.name || 'N/A'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <FiUser className="w-3 h-3 text-gray-400" />
                                            {log.user || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{log.timestamp || 'N/A'}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                                            {log.spent || '0 hours'}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {(!timelogs || timelogs.length === 0) && (
                    <div className="text-center py-12 text-gray-500">
                        <FiClock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No time logs yet. Click the button above to add one.</p>
                    </div>
                )}
            </div>

            {/* Add Timelog Modal - Keep as is */}
            <AnimatePresence>
                {showAddModal && (
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
                            <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Add Time Log</h2>
                                <button 
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setHours('');
                                        setDescription('');
                                    }}
                                    className="text-white hover:text-orange-200"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="e.g., Document Review, Meeting"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hours Spent
                                    </label>
                                    <input
                                        type="number"
                                        value={hours}
                                        onChange={(e) => setHours(e.target.value)}
                                        placeholder="Enter hours"
                                        min="0"
                                        step="0.5"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setHours('');
                                        setDescription('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddTimelog}
                                    disabled={!hours || !description}
                                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Add Time Log
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TimelogTab;