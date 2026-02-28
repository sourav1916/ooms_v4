import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiDollarSign,
    FiCalendar,
    FiDownload,
    FiShare2,
    FiEdit,
    FiX,
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';

const LedgerTab = ({ ledger: initialLedger, variants }) => {
    const [ledger, setLedger] = useState(initialLedger);
    const [showDateModal, setShowDateModal] = useState(false);
    const [dateRange, setDateRange] = useState({
        startDate: ledger.period.split(' - ')[0],
        endDate: ledger.period.split(' - ')[1]
    });
    const [tempDateRange, setTempDateRange] = useState(dateRange);

    const handleDateUpdate = () => {
        setDateRange(tempDateRange);
        setLedger(prev => ({
            ...prev,
            period: `${tempDateRange.startDate} - ${tempDateRange.endDate}`
        }));
        setShowDateModal(false);
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
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <FiDollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Ledger Report</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">Period: {ledger.period}</span>
                            <motion.button
                                onClick={() => setShowDateModal(true)}
                                className="p-1 text-teal-600 hover:bg-teal-50 rounded"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiEdit className="w-3 h-3" />
                            </motion.button>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <motion.button
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiDownload className="w-4 h-4" />
                        Export
                    </motion.button>
                    <motion.button
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiShare2 className="w-4 h-4" />
                        Share
                    </motion.button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-gray-900">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Sl</th>
                            <th className="px-4 py-3 font-semibold">Date</th>
                            <th className="px-4 py-3 font-semibold">Particulars</th>
                            <th className="px-4 py-3 font-semibold">Voucher Type</th>
                            <th className="px-4 py-3 font-semibold">Voucher No</th>
                            <th className="px-4 py-3 font-semibold text-right">Debit</th>
                            <th className="px-4 py-3 font-semibold text-right">Credit</th>
                            <th className="px-4 py-3 font-semibold text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-gray-50 font-semibold">
                            <td className="px-4 py-3" colSpan="5">Opening Balance</td>
                            <td className="px-4 py-3 text-right">{ledger.openingBalance}</td>
                            <td className="px-4 py-3 text-right">0.00</td>
                            <td className="px-4 py-3 text-right">{ledger.openingBalance}</td>
                        </tr>
                        <AnimatePresence>
                            {ledger.entries.map((entry, index) => (
                                <motion.tr
                                    key={entry.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3">{entry.date}</td>
                                    <td className="px-4 py-3">{entry.particular}</td>
                                    <td className="px-4 py-3">{entry.voucherType}</td>
                                    <td className="px-4 py-3">{entry.voucherNo}</td>
                                    <td className="px-4 py-3 text-right text-green-600">{entry.debit}</td>
                                    <td className="px-4 py-3 text-right text-red-600">{entry.credit}</td>
                                    <td className="px-4 py-3 text-right font-medium">{entry.balance}</td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        <tr className="bg-gray-50 font-semibold">
                            <td className="px-4 py-3" colSpan="5">Total</td>
                            <td className="px-4 py-3 text-right text-green-600">{ledger.totalDebit}</td>
                            <td className="px-4 py-3 text-right text-red-600">{ledger.totalCredit}</td>
                            <td className="px-4 py-3 text-right">{ledger.closingBalance}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Date Range Modal */}
            <AnimatePresence>
                {showDateModal && (
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
                            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Change Date Range</h2>
                                <button 
                                    onClick={() => {
                                        setShowDateModal(false);
                                        setTempDateRange(dateRange);
                                    }}
                                    className="text-white hover:text-teal-200"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="text"
                                            value={tempDateRange.startDate}
                                            onChange={(e) => setTempDateRange({...tempDateRange, startDate: e.target.value})}
                                            placeholder="DD/MM/YYYY"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="text"
                                            value={tempDateRange.endDate}
                                            onChange={(e) => setTempDateRange({...tempDateRange, endDate: e.target.value})}
                                            placeholder="DD/MM/YYYY"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowDateModal(false);
                                        setTempDateRange(dateRange);
                                    }}
                                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDateUpdate}
                                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 flex items-center gap-2"
                                >
                                    <FiCalendar className="w-4 h-4" />
                                    Update Range
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default LedgerTab;