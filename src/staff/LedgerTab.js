import React from 'react';
import { motion } from 'framer-motion';

const LedgerTab = ({ ledger, setLedger, variants }) => {
    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ledger Report</h3>
                <div className="text-sm text-gray-600">{ledger.period}</div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sl</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Particulars</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Debit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* Opening Balance Row */}
                        <tr className="bg-gray-50 font-medium">
                            <td colSpan="5" className="px-6 py-3 text-sm text-gray-900">Opening Balance</td>
                            <td className="px-6 py-3 text-sm text-gray-900">₹{ledger.openingBalance}</td>
                            <td className="px-6 py-3 text-sm text-gray-900">₹0.00</td>
                            <td className="px-6 py-3 text-sm text-gray-900">₹{ledger.openingBalance}</td>
                        </tr>

                        {/* Entries */}
                        {ledger.entries.map((entry, index) => (
                            <tr key={entry.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.date}</td>
                                <td className="px-6 py-4 text-sm">{entry.particular}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.voucherType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.voucherNo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">₹{entry.debit}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">₹{entry.credit}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">₹{entry.balance}</td>
                            </tr>
                        ))}

                        {/* Total Row */}
                        <tr className="bg-gray-50 font-medium">
                            <td colSpan="5" className="px-6 py-3 text-sm text-gray-900">Total</td>
                            <td className="px-6 py-3 text-sm text-gray-900">₹{ledger.totalDebit}</td>
                            <td className="px-6 py-3 text-sm text-gray-900">₹{ledger.totalCredit}</td>
                            <td className="px-6 py-3 text-sm text-gray-900">₹{ledger.closingBalance}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default LedgerTab;