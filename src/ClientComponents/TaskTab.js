import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiCheckCircle, FiClock, FiAlertCircle, FiUser, FiCalendar, FiFilter, FiSearch, FiTrendingUp, FiCheckSquare, FiList, FiTarget } from 'react-icons/fi';

const TaskTab = () => {
    const [tasks, setTasks] = useState([
        { id: 1, task: "GST Return Filing", dueDate: "2024-01-31", status: "Pending", assigned: "Rajesh", priority: "High", description: "File GSTR-1 and GSTR-3B for Q3", category: "Tax", progress: 30 },
        { id: 2, task: "TDS Payment", dueDate: "2024-01-20", status: "In Progress", assigned: "Priya", priority: "Medium", description: "Quarterly TDS payment and return filing", category: "Tax", progress: 65 },
        { id: 3, task: "Audit Report", dueDate: "2024-02-15", status: "Completed", assigned: "Ramesh", priority: "Low", description: "Annual financial audit completion", category: "Audit", progress: 100 },
        { id: 4, task: "Company Registration", dueDate: "2024-02-10", status: "Pending", assigned: "Suresh", priority: "High", description: "Private Ltd company registration documents", category: "Legal", progress: 20 },
        { id: 5, task: "Monthly Bookkeeping", dueDate: "2024-01-25", status: "In Progress", assigned: "Anitha", priority: "Medium", description: "Monthly accounts bookkeeping", category: "Accounting", progress: 75 }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = 
            task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.assigned.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
        
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': 
                return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
            case 'In Progress': 
                return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200';
            case 'Pending': 
                return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200';
            default: 
                return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <FiCheckCircle className="w-4 h-4" />;
            case 'In Progress': return <FiClock className="w-4 h-4" />;
            case 'Pending': return <FiAlertCircle className="w-4 h-4" />;
            default: return <FiList className="w-4 h-4" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': 
                return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200';
            case 'Medium': 
                return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200';
            case 'Low': 
                return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
            default: 
                return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Tax': return 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700';
            case 'Audit': return 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700';
            case 'Legal': return 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700';
            case 'Accounting': return 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700';
            default: return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700';
        }
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-600';
        if (progress >= 50) return 'bg-gradient-to-r from-blue-500 to-indigo-600';
        return 'bg-gradient-to-r from-yellow-500 to-amber-600';
    };

    const calculateTaskStats = () => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'Completed').length;
        const inProgress = tasks.filter(t => t.status === 'In Progress').length;
        const pending = tasks.filter(t => t.status === 'Pending').length;
        
        return { total, completed, inProgress, pending };
    };

    const stats = calculateTaskStats();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-xl p-6"
        >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                        Task Management
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">Track, assign, and manage client tasks efficiently</p>
                </div>
                <div className="flex items-center gap-3">
                    <motion.button
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiPlus className="w-5 h-5" />
                        New Task
                    </motion.button>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                            <FiTarget className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                            <FiCheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">In Progress</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.inProgress}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center">
                            <FiClock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl flex items-center justify-center">
                            <FiAlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search tasks, descriptions, or assigned to..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                    />
                </div>
                <div className="flex gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
                    >
                        <option value="All">All Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                            <FiTarget className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    filteredTasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white">
                                            <FiTarget className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-3 flex-1">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h4 className="text-lg font-bold text-gray-900">{task.task}</h4>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(task.category)}`}>
                                                    {task.category}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(task.status)}
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                                                    {task.priority} Priority
                                                </span>
                                            </div>
                                            
                                            <p className="text-gray-600">{task.description}</p>
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <FiUser className="w-4 h-4" />
                                                            <span className="font-medium">{task.assigned}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <FiCalendar className="w-4 h-4" />
                                                            <span className="font-medium">Due: {task.dueDate}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-semibold text-gray-700">
                                                        {task.progress}% Complete
                                                    </div>
                                                </div>
                                                
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <motion.div 
                                                        className={`h-2 rounded-full ${getProgressColor(task.progress)}`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${task.progress}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:shadow-md rounded-xl transition-all duration-200"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FiCheckSquare className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                        className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 hover:shadow-md rounded-xl transition-all duration-200"
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FiEdit className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                            <FiTrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Task Performance</h4>
                            <p className="text-sm text-gray-600">
                                <span className="font-bold text-green-600">{stats.completed}</span> of {stats.total} tasks completed • 
                                <span className="font-bold text-blue-600 ml-2">{stats.inProgress}</span> in progress • 
                                <span className="font-bold text-yellow-600 ml-2">{stats.pending}</span> pending
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 font-semibold"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Mark All Complete
                        </motion.button>
                        <motion.button
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Assign Tasks
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiCalendar className="w-5 h-5 text-blue-600" />
                        Upcoming Deadlines
                    </h4>
                    <div className="space-y-3">
                        {tasks
                            .filter(t => t.status !== 'Completed')
                            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                            .slice(0, 3)
                            .map(task => (
                                <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                    <div>
                                        <div className="font-medium text-gray-900">{task.task}</div>
                                        <div className="text-sm text-gray-600">{task.assigned}</div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                                        {task.dueDate}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiUser className="w-5 h-5 text-green-600" />
                        Team Workload
                    </h4>
                    <div className="space-y-3">
                        {Array.from(new Set(tasks.map(t => t.assigned))).map((assigned, index) => {
                            const assignedTasks = tasks.filter(t => t.assigned === assigned);
                            const completedCount = assignedTasks.filter(t => t.status === 'Completed').length;
                            const totalCount = assignedTasks.length;
                            
                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-900">{assigned}</span>
                                        <span className="text-sm text-gray-600">{completedCount}/{totalCount} completed</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                            style={{ width: `${(completedCount/totalCount) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskTab;