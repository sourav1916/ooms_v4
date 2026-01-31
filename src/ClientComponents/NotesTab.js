import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiX, FiMessageSquare, FiUser, FiCalendar, FiTag, FiFilter, FiSearch, FiBook, FiCheckCircle, FiEye, FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';
import axios from 'axios';

const NotesTab = ({ clientUsername }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        total_pages: 1,
        is_last_page: true
    });
    const [meta, setMeta] = useState({
        total: 0,
        priority: { high: 0, medium: 0, low: 0 }
    });
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false); // New state for view modal
    const [selectedNote, setSelectedNote] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [newNote, setNewNote] = useState({
        subject: '',
        note: '',
        priority: 'high',
        status: 'pending'
    });
    
    // Get headers from localStorage
    const getHeaders = () => {
        try {
            const userDataStr = localStorage.getItem('user');
            let userName = '';
            let token = '';
            let branchId = '';

            if (userDataStr) {
                try {
                    const userData = JSON.parse(userDataStr);
                    userName = userData.username || userData.userName || '';
                    token = userData.token || '';
                    branchId = userData.branch || userData.branchId || '';
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            }

            // Fallback to individual localStorage items
            if (!userName) {
                userName = localStorage.getItem('userName') || localStorage.getItem('user_username') || '';
            }
            if (!token) {
                token = localStorage.getItem('token') || localStorage.getItem('user_token') || '';
            }
            if (!branchId) {
                branchId = localStorage.getItem('branchId') || localStorage.getItem('branch_id') || '';
            }
            
            console.log('Headers from localStorage:', { userName, token: token ? '***' + token.slice(-4) : 'empty', branchId });
            
            if (!userName || !token || !branchId) {
                console.error('Missing authentication data in localStorage');
                return null;
            }
            
            return {
                'Content-Type': 'application/json',
                'username': userName,
                'token': token,
                'branch': branchId
            };
        } catch (error) {
            console.error('Error getting headers from localStorage:', error);
            return null;
        }
    };
    
    const fetchNotes = async (page = 1, search = '') => {
        console.log('fetchNotes called with:', { clientUsername, page, search });
        
        if (!clientUsername) {
            console.error('Client username is required');
            setError('Client username is required');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Get headers
            const headers = getHeaders();
            if (!headers) {
                throw new Error('Missing authentication headers. Please login again.');
            }
            
            // Construct API URL with query parameters
            const apiUrl = `https://api.ooms.in/api/v1/client/details/notes/list`;
            
            // Prepare query parameters as shown in your example
            const params = {
                username: clientUsername,
                page_no: page,
                limit: 20,
                search: search
            };
            
            console.log('Making API call to:', apiUrl);
            console.log('With params:', params);
            console.log('With headers:', {
                ...headers,
                token: headers.token ? '***' + headers.token.slice(-4) : 'empty'
            });
            
            const response = await axios.get(apiUrl, {
                params: params,
                headers: headers,
                timeout: 10000 // 10 second timeout
            });
            
            console.log('API Response:', response.data);
            
            if (response.data && response.data.success) {
                const apiNotes = response.data.data.map(note => ({
                    id: note.note_id,
                    date: new Date(note.create_date).toISOString().split('T')[0],
                    note: note.note,
                    subject: note.subject,
                    author: note.create_by?.name || 'Unknown',
                    category: note.subject || 'General',
                    priority: note.priority ? note.priority.charAt(0).toUpperCase() + note.priority.slice(1) : 'Medium',
                    status: note.status ? note.status.charAt(0).toUpperCase() + note.status.slice(1) : 'Pending',
                    create_date: note.create_date,
                    modify_date: note.modify_date,
                    create_by: note.create_by,
                    modify_by: note.modify_by,
                    // Add formatted dates for display
                    formatted_create_date: new Date(note.create_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    formatted_modify_date: note.modify_date ? new Date(note.modify_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : null,
                    // Add creator and modifier names
                    created_by_name: note.create_by?.name || 'Unknown',
                    modified_by_name: note.modify_by?.name || null,
                    // Truncated note for display
                    truncated_note: note.note.length > 120 ? note.note.substring(0, 120) + '...' : note.note
                }));
                
                setNotes(apiNotes);
                setPagination(response.data.pagination || {
                    page: page,
                    limit: 20,
                    total: response.data.data.length,
                    total_pages: 1,
                    is_last_page: true
                });
                setMeta(response.data.meta || {
                    total: response.data.data.length,
                    priority: { high: 0, medium: 0, low: 0 }
                });
                setError(null);
                console.log('Notes set successfully:', apiNotes.length, 'notes loaded');
            } else {
                throw new Error(response.data?.message || 'Failed to fetch notes');
            }
        } catch (err) {
            console.error('Error fetching notes:', err);
            
            // Detailed error logging
            if (err.response) {
                console.error('Response status:', err.response.status);
                console.error('Response data:', err.response.data);
                console.error('Response headers:', err.response.headers);
                
                if (err.response.status === 401) {
                    setError('Authentication failed. Please login again.');
                } else if (err.response.status === 404) {
                    setError('API endpoint not found.');
                } else if (err.response.status === 500) {
                    setError('Server error. Please try again later.');
                } else {
                    setError(err.response.data?.message || `Error ${err.response.status}: Failed to fetch notes`);
                }
            } else if (err.request) {
                console.error('No response received:', err.request);
                setError('No response from server. Please check your internet connection.');
            } else if (err.code === 'ECONNABORTED') {
                setError('Request timeout. Please try again.');
            } else {
                setError(err.message || 'Error loading notes. Please try again.');
            }
            
            setNotes([]);
            setPagination({
                page: 1,
                limit: 20,
                total: 0,
                total_pages: 1,
                is_last_page: true
            });
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        console.log('Initial useEffect triggered, clientUsername:', clientUsername);
        if (clientUsername) {
            fetchNotes(1, '');
        } else {
            setError('Please select a client first.');
            setLoading(false);
        }
    }, [clientUsername]);

    // Handle search with debounce
    useEffect(() => {
        if (!clientUsername) return;
        
        const delayDebounceFn = setTimeout(() => {
            fetchNotes(1, searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, clientUsername]);

    // Open View Modal
    const openViewModal = (note) => {
        setSelectedNote(note);
        setShowViewModal(true);
    };

    // Open Edit Modal
    const openEditModal = (note) => {
        setSelectedNote(note);
        
        // Map the displayed status to API status values
        let apiStatus = 'pending';
        const displayStatus = note.status.toLowerCase();
        
        if (displayStatus === 'complete' || displayStatus === 'completed') {
            apiStatus = 'complete';
        } else if (displayStatus === 'cancel' || displayStatus === 'cancelled') {
            apiStatus = 'cancel';
        } else if (displayStatus === 'active') {
            apiStatus = 'pending'; // Map "active" to "pending" for API
        } else {
            apiStatus = displayStatus;
        }
        
        setNewNote({
            subject: note.subject || '',
            note: note.note || '',
            priority: note.priority.toLowerCase() || 'high',
            status: apiStatus
        });
        setShowEditModal(true);
    };

    // Create new note
    const handleAddNote = async () => {
        if (!clientUsername) {
            alert('Client username is required');
            return;
        }

        const headers = getHeaders();
        if (!headers) {
            alert('Missing authentication headers');
            return;
        }

        try {
            const requestBody = {
                subject: newNote.subject,
                note: newNote.note,
                priority: newNote.priority,
                status: newNote.status,
                username: clientUsername
            };

            console.log('Creating note with data:', requestBody);
            
            const response = await axios.post(
                `https://api.ooms.in/api/v1/client/details/notes/create`,
                requestBody,
                { headers }
            );

            if (response.data && response.data.success) {
                // Refresh notes list
                fetchNotes(1, searchTerm);
                setShowAddModal(false);
                // Reset form
                setNewNote({
                    subject: '',
                    note: '',
                    priority: 'high',
                    status: 'pending'
                });
                alert('Note created successfully!');
            } else {
                alert(`Failed to create note: ${response.data?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error creating note:', error);
            if (error.response) {
                alert(`Error ${error.response.status}: ${error.response.data?.message || 'Failed to create note'}`);
            } else {
                alert('Error creating note. Please try again.');
            }
        }
    };

    // Edit note
    const handleEditNote = async () => {
        if (!selectedNote?.id || !clientUsername) {
            alert('No note selected for editing');
            return;
        }

        const headers = getHeaders();
        if (!headers) {
            alert('Missing authentication headers');
            return;
        }

        try {
            const requestBody = {
                username: clientUsername,
                note_id: selectedNote.id,
                subject: newNote.subject,
                note: newNote.note,
                priority: newNote.priority,
                status: newNote.status
            };

            console.log('Updating note with data:', requestBody);
            
            const response = await axios.post(
                `https://api.ooms.in/api/v1/client/details/notes/edit`,
                requestBody,
                { headers }
            );

            if (response.data && response.data.success) {
                // Refresh notes list
                fetchNotes(1, searchTerm);
                setShowEditModal(false);
                alert('Note updated successfully!');
            } else {
                alert(`Failed to update note: ${response.data?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating note:', error);
            if (error.response) {
                alert(`Error ${error.response.status}: ${error.response.data?.message || 'Failed to update note'}`);
            } else {
                alert('Error updating note. Please try again.');
            }
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            fetchNotes(newPage, searchTerm);
        }
    };

    // Generate pagination numbers
    const generatePaginationNumbers = () => {
        const totalPages = pagination.total_pages;
        const currentPage = pagination.page;
        const pages = [];
        
        if (totalPages <= 5) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            // Calculate start and end
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            
            // Adjust if at the beginning
            if (currentPage <= 3) {
                end = 4;
            }
            
            // Adjust if at the end
            if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
            }
            
            // Add ellipsis after first page if needed
            if (start > 2) {
                pages.push('...');
            }
            
            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            // Add ellipsis before last page if needed
            if (end < totalPages - 1) {
                pages.push('...');
            }
            
            // Always show last page if not already included
            if (end < totalPages) {
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    // Filter notes based on priority filter
    const filteredNotes = notes.filter(note => {
        if (priorityFilter === 'All') return true;
        return note.priority === priorityFilter;
    });

    const deleteNote = async () => {
        if (!selectedNote) return;
        
        const headers = getHeaders();
        if (!headers) {
            alert('Missing authentication headers');
            return;
        }
        
        try {
            // API call to delete note
            const response = await axios.delete(
                `https://api.ooms.in/api/v1/client/details/notes/delete/${selectedNote.id}`,
                {
                    headers: headers,
                    data: { username: clientUsername }
                }
            );
            
            if (response.data && response.data.success) {
                // Remove from local state
                setNotes(notes.filter(note => note.id !== selectedNote.id));
                setShowDeleteModal(false);
                alert('Note deleted successfully!');
            } else {
                alert(`Failed to delete note: ${response.data?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Error deleting note. Please try again.');
        }
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
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'complete': 
            case 'completed': 
                return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
            case 'active': 
            case 'pending': 
                return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200';
            case 'cancel': 
            case 'cancelled': 
                return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200';
            default: 
                return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
        }
    };

    const calculateNoteStats = () => {
        const total = meta.total || notes.length;
        const active = notes.filter(n => {
            const status = n.status.toLowerCase();
            return status === 'active' || status === 'pending';
        }).length;
        const completed = notes.filter(n => {
            const status = n.status.toLowerCase();
            return status === 'complete' || status === 'completed';
        }).length;
        const cancelled = notes.filter(n => {
            const status = n.status.toLowerCase();
            return status === 'cancel' || status === 'cancelled';
        }).length;
        const highPriority = meta.priority?.high || notes.filter(n => n.priority === 'High').length;
        
        return { total, active, completed, cancelled, highPriority };
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
                    {clientUsername && (
                        <p className="text-xs text-gray-500">Client: {clientUsername}</p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <motion.button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiPlus className="w-5 h-5" />
                        Add New Note
                    </motion.button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <FiBook className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading notes...</h3>
                    <p className="text-gray-600">Please wait while we fetch your notes</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                        <FiMessageSquare className="w-10 h-10 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{error}</h3>
                    {!clientUsername && (
                        <p className="text-gray-600">Please select a client to view notes</p>
                    )}
                </div>
            )}

            {/* Stats Dashboard */}
            {!loading && !error && clientUsername && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
                                    <p className="text-sm font-medium text-gray-600">Cancelled</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.cancelled}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl flex items-center justify-center">
                                    <FiX className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">High Priority</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.highPriority}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                                    <FiTag className="w-6 h-6 text-orange-600" />
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
                                placeholder="Search notes, subjects or authors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                            />
                        </div>
                        <div className="flex gap-3">
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
                    <div className="space-y-4 mb-8">
                        {filteredNotes.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <FiMessageSquare className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {notes.length === 0 ? 'No notes found' : 'No matching notes'}
                                </h3>
                                <p className="text-gray-600">
                                    {notes.length === 0 ? 'Add a new note to get started' : 'Try adjusting your search or filter'}
                                </p>
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
                                                    {note.subject && (
                                                        <h4 className="font-semibold text-gray-900">{note.subject}</h4>
                                                    )}
                                                    <p className="text-gray-700 leading-relaxed">
                                                        {note.note.length > 120 ? note.truncated_note : note.note}
                                                        {note.note.length > 120 && (
                                                            <button 
                                                                onClick={() => openViewModal(note)}
                                                                className="ml-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                            >
                                                                Read more
                                                            </button>
                                                        )}
                                                    </p>
                                                    
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <FiUser className="w-4 h-4" />
                                                            <span className="font-medium">{note.author}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <FiCalendar className="w-4 h-4" />
                                                            <span className="font-medium">{note.date}</span>
                                                        </div>
                                                        {note.modify_date && note.modified_by_name && (
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <FiClock className="w-4 h-4" />
                                                                <span className="font-medium text-sm">
                                                                    Last updated by {note.modified_by_name}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap gap-2">
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
                                                onClick={() => openViewModal(note)}
                                                className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:shadow-md rounded-xl transition-all duration-200"
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                whileTap={{ scale: 0.9 }}
                                                title="View full note"
                                            >
                                                <FiEye className="w-4 h-4" />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => openEditModal(note)}
                                                className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 hover:shadow-md rounded-xl transition-all duration-200"
                                                whileHover={{ scale: 1.1, rotate: -5 }}
                                                whileTap={{ scale: 0.9 }}
                                                title="Edit note"
                                            >
                                                <FiEdit className="w-4 h-4" />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => openDeleteModal(note)}
                                                className="p-3 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:shadow-md rounded-xl transition-all duration-200"
                                                whileHover={{ scale: 1.1, rotate: -5 }}
                                                whileTap={{ scale: 0.9 }}
                                                title="Delete note"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination.total_pages > 1 && (
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                            <div className="text-sm text-gray-600">
                                Showing page {pagination.page} of {pagination.total_pages} • 
                                Total {pagination.total} notes
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {/* Previous Button */}
                                <motion.button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                                        pagination.page === 1 
                                            ? 'text-gray-400 cursor-not-allowed' 
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiChevronLeft className="w-4 h-4" />
                                    Previous
                                </motion.button>
                                
                                {/* Page Numbers */}
                                <div className="flex items-center gap-1">
                                    {generatePaginationNumbers().map((pageNum, index) => (
                                        pageNum === '...' ? (
                                            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                                                ...
                                            </span>
                                        ) : (
                                            <motion.button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl font-medium ${
                                                    pagination.page === pageNum
                                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md'
                                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                }`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {pageNum}
                                            </motion.button>
                                        )
                                    ))}
                                </div>
                                
                                {/* Next Button */}
                                <motion.button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.is_last_page}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                                        pagination.is_last_page 
                                            ? 'text-gray-400 cursor-not-allowed' 
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Next
                                    <FiChevronRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                            
                            <div className="text-sm text-gray-600 hidden md:block">
                                {pagination.limit} notes per page
                            </div>
                        </div>
                    )}

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
                                        • Use clear subjects for easy identification • Add priority levels for important notes • 
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
                                    const activeNotes = authorNotes.filter(n => {
                                        const status = n.status.toLowerCase();
                                        return status === 'active' || status === 'pending';
                                    }).length;
                                    
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
                                Priority Distribution
                            </h4>
                            <div className="space-y-3">
                                {['High', 'Medium', 'Low'].map((priority, index) => {
                                    const priorityCount = notes.filter(n => n.priority === priority).length;
                                    const percentage = notes.length > 0 ? (priorityCount / notes.length) * 100 : 0;
                                    
                                    return (
                                        <div key={index} className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700">{priority} Priority</span>
                                                <span className="font-semibold text-gray-900">{priorityCount} notes</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full ${
                                                        priority === 'High' ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                                                        priority === 'Medium' ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                                                        'bg-gradient-to-r from-green-500 to-emerald-600'
                                                    }`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* View Note Modal */}
            {showViewModal && selectedNote && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">View Note</h2>
                                    <p className="text-blue-100 text-sm mt-1">Complete note details</p>
                                </div>
                                <motion.button
                                    onClick={() => setShowViewModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiX className="w-6 h-6" />
                                </motion.button>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Subject</label>
                                <div className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-gray-900 font-medium">{selectedNote.subject}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Note Content</label>
                                <div className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 min-h-[200px]">
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedNote.note}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Priority</label>
                                    <div className={`w-full px-4 py-3 rounded-xl font-medium ${getPriorityColor(selectedNote.priority)}`}>
                                        {selectedNote.priority} Priority
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Status</label>
                                    <div className={`w-full px-4 py-3 rounded-xl font-medium ${getStatusColor(selectedNote.status)}`}>
                                        {selectedNote.status}
                                    </div>
                                </div>
                            </div>

                            {/* Author and Date Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <FiUser className="w-5 h-5 text-blue-600" />
                                        Created By
                                    </h4>
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                            <FiUser className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{selectedNote.created_by_name}</div>
                                            <div className="text-sm text-gray-600">{selectedNote.formatted_create_date}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                {selectedNote.modified_by_name && (
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <FiClock className="w-5 h-5 text-green-600" />
                                            Last Updated By
                                        </h4>
                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                                                <FiUser className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{selectedNote.modified_by_name}</div>
                                                <div className="text-sm text-gray-600">{selectedNote.formatted_modify_date}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="border-t px-8 py-6 bg-gray-50 flex justify-end gap-4">
                            <motion.button
                                onClick={() => setShowViewModal(false)}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Close
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Add Note Modal */}
            {showAddModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">Add New Note</h2>
                                    <p className="text-blue-100 text-sm mt-1">Enter note details below</p>
                                </div>
                                <motion.button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        // Reset form when modal is closed
                                        setNewNote({
                                            subject: '',
                                            note: '',
                                            priority: 'high',
                                            status: 'pending'
                                        });
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiX className="w-6 h-6" />
                                </motion.button>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Subject *</label>
                                <input
                                    type="text"
                                    value={newNote.subject}
                                    onChange={(e) => setNewNote({...newNote, subject: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                                    placeholder="Enter note subject"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Note Content *</label>
                                <textarea
                                    value={newNote.note}
                                    onChange={(e) => setNewNote({...newNote, note: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 min-h-[150px]"
                                    placeholder="Enter note content"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Priority *</label>
                                    <select
                                        value={newNote.priority}
                                        onChange={(e) => setNewNote({...newNote, priority: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                                    >
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Status *</label>
                                    <select
                                        value={newNote.status}
                                        onChange={(e) => setNewNote({...newNote, status: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="complete">Complete</option>
                                        <option value="cancel">Cancel</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="border-t px-8 py-6 bg-gray-50 flex justify-end gap-4">
                            <motion.button
                                onClick={() => {
                                    setShowAddModal(false);
                                    // Reset form when cancelled
                                    setNewNote({
                                        subject: '',
                                        note: '',
                                        priority: 'high',
                                        status: 'pending'
                                    });
                                }}
                                className="px-6 py-3 text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                onClick={handleAddNote}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Add Note
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Edit Note Modal */}
            {showEditModal && selectedNote && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">Edit Note</h2>
                                    <p className="text-blue-100 text-sm mt-1">Update note details</p>
                                </div>
                                <motion.button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiX className="w-6 h-6" />
                                </motion.button>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Subject *</label>
                                <input
                                    type="text"
                                    value={newNote.subject}
                                    onChange={(e) => setNewNote({...newNote, subject: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                                    placeholder="Enter note subject"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Note Content *</label>
                                <textarea
                                    value={newNote.note}
                                    onChange={(e) => setNewNote({...newNote, note: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 min-h-[150px]"
                                    placeholder="Enter note content"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Priority *</label>
                                    <select
                                        value={newNote.priority}
                                        onChange={(e) => setNewNote({...newNote, priority: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                                    >
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Status *</label>
                                    <select
                                        value={newNote.status}
                                        onChange={(e) => setNewNote({...newNote, status: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="complete">Complete</option>
                                        <option value="cancel">Cancel</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="border-t px-8 py-6 bg-gray-50 flex justify-end gap-4">
                            <motion.button
                                onClick={() => setShowEditModal(false)}
                                className="px-6 py-3 text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                onClick={handleEditNote}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Update Note
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

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