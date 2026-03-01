import React from 'react';
import { motion } from 'framer-motion';

const PerformanceTab = ({ performance, setPerformance, variants }) => {
    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
        >
            {/* Performance Report */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Performance Report</h3>
                    <div className="text-sm text-gray-600">{performance.period}</div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {performance.services.map((service, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm">{service.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{service.count}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">₹{service.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Task Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Table</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {performance.tasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{task.id}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div>Create: {task.createDate}</div>
                                        <div>Due: {task.dueDate}</div>
                                        <div>Target: {task.targetDate}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="font-medium">{task.task}</div>
                                        <div className="text-gray-600">FEES: ₹{task.fees}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div>{task.client}</div>
                                        <div className="text-gray-600">{task.assignor}</div>
                                        <div className="text-xs text-gray-500">PAN: {task.pan} MOBILE: {task.mobile}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                            {task.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default PerformanceTab;