import React from 'react';
import { motion } from 'framer-motion';

const AttendanceTab = ({ attendance, setAttendance, variants }) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
        >
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <SummaryCard title="Total Days" value={attendance.summary.totalDays} />
                <SummaryCard title="Not Marked" value={attendance.summary.notMarked} />
                <SummaryCard title="Present" value={attendance.summary.present} />
                <SummaryCard title="Absent" value={attendance.summary.absent} />
                <SummaryCard title="Half Day" value={attendance.summary.halfDay} />
                <SummaryCard title="Over Time" value={attendance.summary.overTime} />
                <SummaryCard title="Fine Hours" value={attendance.summary.fineHours} />
                <SummaryCard title="Paid Leave" value={attendance.summary.paidLeave} />
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{attendance.month}</h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">Previous</button>
                        <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">Next</button>
                    </div>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                    {Array(31).fill(null).map((_, index) => {
                        const day = index + 1;
                        const dayData = attendance.calendar.find(d => d.date === day);
                        return (
                            <div
                                key={day}
                                className="aspect-square border border-gray-200 rounded p-1 hover:shadow-sm transition-shadow"
                            >
                                <div className="text-xs font-medium text-gray-600">{day}</div>
                                {dayData?.status && (
                                    <div className="text-[10px] mt-1 text-red-500">{dayData.status}</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

const SummaryCard = ({ title, value }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
        <div className="text-sm text-gray-600 mb-1">{title}</div>
        <div className="text-xl font-semibold text-gray-900">{value}</div>
    </div>
);

export default AttendanceTab;