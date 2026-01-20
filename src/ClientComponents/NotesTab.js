import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiX, FiMessageSquare, FiUser, FiCalendar, FiTag, FiFilter, FiSearch, FiBook, FiCheckCircle, FiEye } from 'react-icons/fi';

const NotesTab = () => {
    const [notes, setNotes] = useState([
        { id: 1, date: "2024-01-15", note: "Client requested GST filing for Q3. Documents submitted and verified. Follow up scheduled for Jan 30.", author: "Rajesh Kumar", category: "Compliance", priority: "High", status: "Active" },
        { id: 2, date: "2024-01-10", note: "Discussion about tax planning strategies for FY 2024-25. Client considering investment options and seeking advice on deductions.", author: "Priya Sharma", category: "Advisory", priority: "Medium", status: "Active" },
        { id: 3, date: "2024-01-05", note: "New business registration completed successfully. All documents submitted to ROC. Certificate expected by Jan 25.", author: "Ramesh Patel", category: "Registration", priority: "High", status: "Completed" },
        { id: 4, date: "2024-01-20", note: "Annual audit meeting scheduled for Feb 5. Need to prepare financial statements and supporting documents.", author: "Rajesh Kumar", category: "Audit", priority: "Medium", status: "Pending" },
        { id: 5, date: "2024-01-18", note: "Client inquiry about digital signature renewal process. Provided guidance and sent checklist.", author: "Anitha Reddy", category: "Consultation", priority: "Low", status: "Active" }
    ]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');

    const filteredNotes = notes.filter(note => {
        const matchesSearch = 
            note.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.author.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = categoryFilter === 'All' || note.category === categoryFilter;
        const matchesPriority = priorityFilter === 'All' || note.priority === priorityFilter;
        
        return matchesSearch && matchesCategory && matchesPriority;
    });

    const deleteNote = () => {
        setNotes(notes.filter(note => note.id !== selectedNote.id));
        setShowDeleteModal(false);
    };

    const openDeleteModal = (note) => {
        setSelectedNote(note);
        setShowDeleteModal(true);
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Compliance': 
                return 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200';
            case 'Advisory': 
                return 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border border-purple-200';
            case 'Registration': 
                return 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200';
            case 'Audit': 
                return 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border border-yellow-200';
            case 'Consultation': 
                return 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-200';
            default: 
                return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200';
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': 
                return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
            case 'Completed': 
                return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200';
            case 'Pending': 
                return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200';
            default: 
                return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
        }
    };

    const calculateNoteStats = () => {
        const total = notes.length;
        const active = notes.filter(n => n.status === 'Active').length;
        const completed = notes.filter(n => n.status === 'Completed').length;
        const highPriority = notes.filter(n => n.priority === 'High').length;
        
        return { total, active, completed, highPriority };
    };

    const stats = calculateNoteStats();

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
                        Client Notes & Communication
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">Track important conversations, instructions, and client communications</p>
                </div>
                <div className="flex items-center gap-3">
                    <motion.button
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiPlus className="w-5 h-5" />
                        Add New Note
                    </motion.button>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Notes</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                            <FiBook className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Notes</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.active}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                            <FiMessageSquare className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                            <FiCheckCircle className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">High Priority</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.highPriority}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl flex items-center justify-center">
                            <FiTag className="w-6 h-6 text-red-600" />
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
                        placeholder="Search notes or authors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                    />
                </div>
                <div className="flex gap-3">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
                    >
                        <option value="All">All Categories</option>
                        <option value="Compliance">Compliance</option>
                        <option value="Advisory">Advisory</option>
                        <option value="Registration">Registration</option>
                        <option value="Audit">Audit</option>
                        <option value="Consultation">Consultation</option>
                    </select>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
                    >
                        <option value="All">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>

            {/* Notes List */}
            <div className="space-y-4">
                {filteredNotes.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                            <FiMessageSquare className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No notes found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    filteredNotes.map((note, index) => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white">
                                            <FiMessageSquare className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-3 flex-1">
                                            <p className="text-gray-700 leading-relaxed">{note.note}</p>
                                            
                                            <div className="flex flex-wrap items-center gap-3">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FiUser className="w-4 h-4" />
                                                    <span className="font-medium">{note.author}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FiCalendar className="w-4 h-4" />
                                                    <span className="font-medium">{note.date}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryColor(note.category)}`}>
                                                    {note.category}
                                                </span>
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getPriorityColor(note.priority)}`}>
                                                    {note.priority} Priority
                                                </span>
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(note.status)}`}>
                                                    {note.status}
                                                </span>
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
                                        <FiEye className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                        className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 hover:shadow-md rounded-xl transition-all duration-200"
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FiEdit className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                        onClick={() => openDeleteModal(note)}
                                        className="p-3 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:shadow-md rounded-xl transition-all duration-200"
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FiTrash2 className="w-4 h-4" />
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
                            <FiBook className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Note Management Tips</h4>
                            <p className="text-sm text-gray-600">
                                • Use clear categories for easy filtering • Add priority levels for important notes • 
                                Update status when actions are completed
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 font-semibold"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Bulk Actions
                        </motion.button>
                        <motion.button
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Export Notes
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Recent Authors */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiUser className="w-5 h-5 text-blue-600" />
                        Recent Authors
                    </h4>
                    <div className="space-y-3">
                        {Array.from(new Set(notes.map(n => n.author))).slice(0, 4).map((author, index) => {
                            const authorNotes = notes.filter(n => n.author === author);
                            const activeNotes = authorNotes.filter(n => n.status === 'Active').length;
                            
                            return (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                            <FiUser className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{author}</div>
                                            <div className="text-sm text-gray-600">{authorNotes.length} notes</div>
                                        </div>
                                    </div>
                                    <div className="text-sm px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full">
                                        {activeNotes} active
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiTag className="w-5 h-5 text-purple-600" />
                        Category Distribution
                    </h4>
                    <div className="space-y-3">
                        {Array.from(new Set(notes.map(n => n.category))).map((category, index) => {
                            const categoryCount = notes.filter(n => n.category === category).length;
                            const percentage = (categoryCount / notes.length) * 100;
                            
                            return (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">{category}</span>
                                        <span className="font-semibold text-gray-900">{categoryCount} notes</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedNote && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <FiTrash2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Delete Note</h2>
                                    <p className="text-red-100 text-sm mt-1">This action is permanent</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                                    <FiMessageSquare className="w-10 h-10 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                                    <p className="text-gray-600 mt-2">
                                        Are you sure you want to delete the note by 
                                        <span className="font-bold text-red-600"> {selectedNote.author}</span>?
                                        This action cannot be undone.
                                    </p>
                                    <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                                        <p className="text-sm text-gray-600 italic line-clamp-2">{selectedNote.note}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t px-8 py-6 bg-gray-50 flex justify-center gap-4">
                            <motion.button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-3 text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                onClick={deleteNote}
                                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Delete Note
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default NotesTab;