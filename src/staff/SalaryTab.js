import React from 'react';
import { motion } from 'framer-motion';

const SalaryTab = ({ salary, setSalary, variants }) => {
    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
        >
            {/* Salary List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary List</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sl</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apply OT/Fine</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Office Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Working Hour</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grace Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective From</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {salary.list.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">₹{item.amount}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div>Overtime: {item.applyOT}</div>
                                        <div>Fine: {item.applyFine}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.officeTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.workingHour}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.graceTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.effectiveFrom}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button className="text-blue-600 hover:text-blue-800">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paid Leave Days */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paid Leave Days</h3>
                <div className="grid grid-cols-7 gap-2">
                    {salary.list[0]?.paidLeave.map((day, index) => (
                        <div key={index} className="text-center p-2 bg-gray-50 rounded text-sm font-medium">
                            {day}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default SalaryTab;