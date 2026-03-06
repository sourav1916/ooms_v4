import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiDollarSign,
    FiCalendar,
    FiDownload,
    FiShare2,
    FiEdit,
    FiX
} from 'react-icons/fi';

const LedgerTab = ({ ledger = {
    period: "N/A - N/A",
    entries: [],
    openingBalance: 0,
    totalDebit: 0,
    totalCredit: 0,
    closingBalance: 0
} }) => {
    const [showDateModal, setShowDateModal] = useState(false);
    const [dateRange, setDateRange] = useState({
        startDate: ledger.period?.split(' - ')[0] || '',
        endDate: ledger.period?.split(' - ')[1] || ''
    });
    const [tempDateRange, setTempDateRange] = useState(dateRange);

    const handleDateUpdate = () => {
        setDateRange(tempDateRange);
        setShowDateModal(false);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <FiDollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Ledger Report</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">Period: {ledger.period || 'N/A'}</span>
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
                            <td className="px-4 py-3 text-right">{ledger.openingBalance || 0}</td>
                            <td className="px-4 py-3 text-right">0.00</td>
                            <td className="px-4 py-3 text-right">{ledger.openingBalance || 0}</td>
                        </tr>
                        <AnimatePresence>
                            {(ledger.entries || []).map((entry, index) => (
                                <motion.tr
                                    key={entry.id || index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3">{entry.date || 'N/A'}</td>
                                    <td className="px-4 py-3">{entry.particular || 'N/A'}</td>
                                    <td className="px-4 py-3">{entry.voucherType || 'N/A'}</td>
                                    <td className="px-4 py-3">{entry.voucherNo || 'N/A'}</td>
                                    <td className="px-4 py-3 text-right text-green-600">{entry.debit || '0.00'}</td>
                                    <td className="px-4 py-3 text-right text-red-600">{entry.credit || '0.00'}</td>
                                    <td className="px-4 py-3 text-right font-medium">{entry.balance || '0.00'}</td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        <tr className="bg-gray-50 font-semibold">
                            <td className="px-4 py-3" colSpan="5">Total</td>
                            <td className="px-4 py-3 text-right text-green-600">{ledger.totalDebit || 0}</td>
                            <td className="px-4 py-3 text-right text-red-600">{ledger.totalCredit || 0}</td>
                            <td className="px-4 py-3 text-right">{ledger.closingBalance || 0}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Date Range Modal - Keep as is */}
            <AnimatePresence>
                {showDateModal && (
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

export default LedgerTab;