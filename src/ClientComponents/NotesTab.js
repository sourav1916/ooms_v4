import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiEdit, FiTrash2, FiX, FiMessageSquare, FiUser, FiCalendar, 
  FiTag, FiFilter, FiSearch, FiBook, FiCheckCircle, FiEye, FiChevronLeft, 
  FiChevronRight, FiClock, FiPaperclip, FiBell, FiDownload, FiUpload,
  FiClock as FiReminderClock, FiAlertCircle, FiFile, FiType, FiCheck,
  FiAlertTriangle, FiInfo
} from 'react-icons/fi';
import { MdAttachFile, MdOutlineEventNote } from 'react-icons/md';
import { RiAttachment2 } from 'react-icons/ri';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [newNote, setNewNote] = useState({
        subject: '',
        note: '',
        priority: 'high',
        status: 'pending',
        reminder_date: null,
        attachments: []
    });
    
    const [uploadingAttachment, setUploadingAttachment] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const fileInputRef = useRef(null);
    
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
                    reminder_date: note.reminder_date ? new Date(note.reminder_date) : null,
                    attachments: note.attachments || [],
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
                    // Add reminder date formatted
                    formatted_reminder_date: note.reminder_date ? new Date(note.reminder_date).toLocaleDateString('en-US', {
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
            status: apiStatus,
            reminder_date: note.reminder_date || null,
            attachments: note.attachments || []
        });
        setShowEditModal(true);
    };

    // Handle file upload
    const handleFileUpload = async (file) => {
        if (!file) return null;
        
        const headers = getHeaders();
        if (!headers) {
            alert('Missing authentication headers');
            return null;
        }
        
        const fileId = Date.now() + Math.random();
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('username', clientUsername);
            
            const response = await axios.post(
                'https://api.ooms.in/api/v1/client/details/notes/upload-attachment',
                formData,
                {
                    headers: {
                        ...headers,
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
                    }
                }
            );
            
            if (response.data && response.data.success) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error uploading attachment:', error);
            alert('Failed to upload attachment');
            return null;
        } finally {
            setTimeout(() => {
                setUploadProgress(prev => {
                    const newProgress = { ...prev };
                    delete newProgress[fileId];
                    return newProgress;
                });
            }, 1000);
        }
    };

    // Handle attachment selection
    const handleAttachmentSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        // Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        const oversizedFiles = files.filter(file => file.size > maxSize);
        
        if (oversizedFiles.length > 0) {
            alert(`Some files exceed the 10MB limit. Please upload smaller files.`);
            return;
        }
        
        // Check total attachments limit
        if (newNote.attachments.length + files.length > 5) {
            alert(`Maximum 5 attachments allowed. You have ${newNote.attachments.length} attachments already.`);
            return;
        }
        
        setUploadingAttachment(true);
        const uploadedAttachments = [];
        
        for (const file of files) {
            const uploadedFile = await handleFileUpload(file);
            if (uploadedFile) {
                uploadedAttachments.push(uploadedFile);
            }
        }
        
        if (uploadedAttachments.length > 0) {
            setNewNote(prev => ({
                ...prev,
                attachments: [...prev.attachments, ...uploadedAttachments]
            }));
        }
        
        setUploadingAttachment(false);
        
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Remove attachment
    const removeAttachment = (index) => {
        setNewNote(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    // Download attachment
    const downloadAttachment = (attachment) => {
        if (attachment.url) {
            window.open(attachment.url, '_blank');
        } else if (attachment.file) {
            // Handle direct file download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(attachment.file);
            link.download = attachment.name || 'attachment';
            link.click();
        }
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

        // Validation
        if (!newNote.subject.trim()) {
            alert('Please enter a subject for the note');
            return;
        }
        
        if (!newNote.note.trim()) {
            alert('Please enter note content');
            return;
        }

        try {
            const requestBody = {
                subject: newNote.subject,
                note: newNote.note,
                priority: newNote.priority,
                status: newNote.status,
                username: clientUsername,
                reminder_date: newNote.reminder_date ? newNote.reminder_date.toISOString() : null,
                attachments: newNote.attachments
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
                    status: 'pending',
                    reminder_date: null,
                    attachments: []
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

        // Validation
        if (!newNote.subject.trim()) {
            alert('Please enter a subject for the note');
            return;
        }
        
        if (!newNote.note.trim()) {
            alert('Please enter note content');
            return;
        }

        try {
            const requestBody = {
                username: clientUsername,
                note_id: selectedNote.id,
                subject: newNote.subject,
                note: newNote.note,
                priority: newNote.priority,
                status: newNote.status,
                reminder_date: newNote.reminder_date ? newNote.reminder_date.toISOString() : null,
                attachments: newNote.attachments
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

    const getReminderStatus = (reminderDate) => {
        if (!reminderDate) return null;
        
        const now = new Date();
        const reminder = new Date(reminderDate);
        const diffTime = reminder - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffTime < 0) {
            return { color: 'text-red-600 bg-red-50 border-red-200', text: 'Overdue', icon: FiAlertTriangle };
        } else if (diffDays <= 1) {
            return { color: 'text-orange-600 bg-orange-50 border-orange-200', text: 'Due today', icon: FiAlertCircle };
        } else if (diffDays <= 3) {
            return { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', text: 'Upcoming', icon: FiBell };
        } else {
            return { color: 'text-blue-600 bg-blue-50 border-blue-200', text: 'Scheduled', icon: FiCalendar };
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
        const withReminders = notes.filter(n => n.reminder_date).length;
        const withAttachments = notes.filter(n => n.attachments && n.attachments.length > 0).length;
        
        return { total, active, completed, cancelled, highPriority, withReminders, withAttachments };
    };

    const stats = calculateNoteStats();

    // Get file icon based on file type
    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return <FiFile className="w-5 h-5 text-red-600" />;
            case 'doc':
            case 'docx':
                return <FiFile className="w-5 h-5 text-blue-600" />;
            case 'xls':
            case 'xlsx':
                return <FiFile className="w-5 h-5 text-green-600" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FiFile className="w-5 h-5 text-purple-600" />;
            default:
                return <FiPaperclip className="w-5 h-5 text-gray-600" />;
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Custom DatePicker styles
    const CustomDatePickerInput = ({ value, onClick }) => (
        <button
            type="button"
            className="w-full px-4 py-3 text-left border border-gray-300 rounded-xl bg-white hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 flex items-center justify-between"
            onClick={onClick}
        >
            <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                {value || 'Select date and time'}
            </span>
            <FiCalendar className="w-4 h-4 text-gray-400" />
        </button>
    );

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
                    {/* {clientUsername && (
                        <p className="text-xs text-gray-500">Client: {clientUsername}</p>
                    )} */}
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
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Notes</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                    <FiBook className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Notes</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.active}</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                                    <FiMessageSquare className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.completed}</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                    <FiCheckCircle className="w-5 h-5 text-purple-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">High Priority</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.highPriority}</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl flex items-center justify-center">
                                    <FiTag className="w-5 h-5 text-red-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">With Reminders</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.withReminders}</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                                    <FiBell className="w-5 h-5 text-orange-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">With Attachments</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.withAttachments}</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                                    <FiPaperclip className="w-5 h-5 text-indigo-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Cancelled</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.cancelled}</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-slate-100 rounded-xl flex items-center justify-center">
                                    <FiX className="w-5 h-5 text-gray-600" />
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
                            filteredNotes.map((note, index) => {
                                const reminderStatus = getReminderStatus(note.reminder_date);
                                
                                return (
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
                                                            <div className="flex items-start justify-between">
                                                                <h4 className="font-semibold text-gray-900">{note.subject}</h4>
                                                                {reminderStatus && (
                                                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${reminderStatus.color}`}>
                                                                        <reminderStatus.icon className="w-3 h-3" />
                                                                        {reminderStatus.text}
                                                                    </div>
                                                                )}
                                                            </div>
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
                                                            {note.reminder_date && (
                                                                <div className="flex items-center gap-2 text-gray-600">
                                                                    <FiBell className="w-4 h-4" />
                                                                    <span className="font-medium text-sm">
                                                                        {note.formatted_reminder_date}
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
                                                            {note.attachments && note.attachments.length > 0 && (
                                                                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                                                                    <FiPaperclip className="w-3 h-3" />
                                                                    {note.attachments.length} attachment{note.attachments.length > 1 ? 's' : ''}
                                                                </span>
                                                            )}
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
                                );
                            })
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
                                        • Set reminders for important follow-ups • Attach relevant documents • 
                                        Use clear subjects for easy identification • Add priority levels for important notes
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
                                <FiBell className="w-5 h-5 text-orange-600" />
                                Upcoming Reminders
                            </h4>
                            <div className="space-y-3">
                                {notes
                                    .filter(note => note.reminder_date && new Date(note.reminder_date) > new Date())
                                    .sort((a, b) => new Date(a.reminder_date) - new Date(b.reminder_date))
                                    .slice(0, 3)
                                    .map((note, index) => {
                                        const reminderStatus = getReminderStatus(note.reminder_date);
                                        return (
                                            <div key={index} className="p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer" onClick={() => openViewModal(note)}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="font-medium text-gray-900 truncate">{note.subject || 'Untitled Note'}</div>
                                                    <div className={`px-2 py-1 text-xs rounded-full ${reminderStatus?.color}`}>
                                                        {reminderStatus?.text}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600 flex items-center gap-2">
                                                    <FiBell className="w-3 h-3" />
                                                    {note.formatted_reminder_date}
                                                </div>
                                            </div>
                                        );
                                    })}
                                {notes.filter(note => note.reminder_date && new Date(note.reminder_date) > new Date()).length === 0 && (
                                    <div className="text-center py-4 text-gray-500">
                                        No upcoming reminders
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Professional View Note Modal */}
            <AnimatePresence>
                {showViewModal && selectedNote && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={(e) => e.target === e.currentTarget && setShowViewModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <FiMessageSquare className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">Note Details</h2>
                                            <p className="text-blue-100 text-sm mt-1">Complete view of note information</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        onClick={() => setShowViewModal(false)}
                                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FiX className="w-6 h-6 text-white" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="space-y-8">
                                    {/* Note Header Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject</label>
                                            <div className="text-lg font-semibold text-gray-900">{selectedNote.subject || 'No Subject'}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</label>
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${getPriorityColor(selectedNote.priority)}`}>
                                                <FiTag className="w-4 h-4" />
                                                {selectedNote.priority} Priority
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${getStatusColor(selectedNote.status)}`}>
                                                <FiCheckCircle className="w-4 h-4" />
                                                {selectedNote.status}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reminder Section */}
                                    {selectedNote.reminder_date && (
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                                                        <FiBell className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">Reminder</h3>
                                                        <p className="text-sm text-gray-600">{selectedNote.formatted_reminder_date}</p>
                                                    </div>
                                                </div>
                                                <div className={`px-4 py-2 rounded-lg font-medium ${getReminderStatus(selectedNote.reminder_date)?.color}`}>
                                                    {getReminderStatus(selectedNote.reminder_date)?.text}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Note Content */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-gray-700">Note Content</label>
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedNote.note}</p>
                                        </div>
                                    </div>

                                    {/* Attachments Section */}
                                    {selectedNote.attachments && selectedNote.attachments.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <FiPaperclip className="w-4 h-4" />
                                                    Attachments ({selectedNote.attachments.length})
                                                </label>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedNote.attachments.map((attachment, index) => (
                                                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                <div className="w-12 h-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    {getFileIcon(attachment.name || attachment.filename || 'file')}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="font-medium text-gray-900 text-sm truncate">
                                                                        {attachment.name || attachment.filename || 'Attachment'}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {attachment.size ? formatFileSize(attachment.size) : 'Size not available'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <motion.button
                                                                onClick={() => downloadAttachment(attachment)}
                                                                className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:shadow-md rounded-lg transition-all duration-200 flex-shrink-0 ml-3"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                title="Download attachment"
                                                            >
                                                                <FiDownload className="w-4 h-4" />
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Metadata Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <FiUser className="w-5 h-5 text-blue-600" />
                                                Created Information
                                            </h4>
                                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <FiUser className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{selectedNote.created_by_name}</div>
                                                    <div className="text-sm text-gray-600">{selectedNote.formatted_create_date}</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {selectedNote.modified_by_name && (
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                    <FiClock className="w-5 h-5 text-green-600" />
                                                    Last Updated
                                                </h4>
                                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                            </div>

                            {/* Modal Footer */}
                            <div className="border-t px-8 py-6 bg-gray-50 flex justify-end gap-4">
                                <motion.button
                                    onClick={() => setShowViewModal(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiX className="w-4 h-4" />
                                    Close
                                </motion.button>
                                <motion.button
                                    onClick={() => {
                                        setShowViewModal(false);
                                        openEditModal(selectedNote);
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiEdit className="w-4 h-4" />
                                    Edit Note
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Professional Add Note Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <FiPlus className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">Create New Note</h2>
                                            <p className="text-blue-100 text-sm mt-1">Add a new note with attachments and reminders</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setNewNote({
                                                subject: '',
                                                note: '',
                                                priority: 'high',
                                                status: 'pending',
                                                reminder_date: null,
                                                attachments: []
                                            });
                                        }}
                                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FiX className="w-6 h-6 text-white" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="space-y-8">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <FiType className="w-4 h-4" />
                                                Subject *
                                            </label>
                                            <input
                                                type="text"
                                                value={newNote.subject}
                                                onChange={(e) => setNewNote({...newNote, subject: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                                                placeholder="Enter note subject"
                                            />
                                            {!newNote.subject && (
                                                <p className="text-xs text-red-500 flex items-center gap-1">
                                                    <FiAlertCircle className="w-3 h-3" />
                                                    Subject is required
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <FiTag className="w-4 h-4" />
                                                Priority *
                                            </label>
                                            <select
                                                value={newNote.priority}
                                                onChange={(e) => setNewNote({...newNote, priority: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                                            >
                                                <option value="high">High Priority</option>
                                                <option value="medium">Medium Priority</option>
                                                <option value="low">Low Priority</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Status and Reminder */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <FiCheckCircle className="w-4 h-4" />
                                                Status *
                                            </label>
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
                                        
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <FiBell className="w-4 h-4" />
                                                Set Reminder
                                            </label>
                                            <div className="relative">
                                                <DatePicker
                                                    selected={newNote.reminder_date}
                                                    onChange={(date) => setNewNote({...newNote, reminder_date: date})}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    dateFormat="MMMM d, yyyy h:mm aa"
                                                    placeholderText="Select date and time"
                                                    minDate={new Date()}
                                                    popperClassName="z-50"
                                                    popperPlacement="bottom-start"
                                                    customInput={<CustomDatePickerInput />}
                                                />
                                                {newNote.reminder_date && (
                                                    <motion.button
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        onClick={() => setNewNote({...newNote, reminder_date: null})}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <FiX className="w-4 h-4" />
                                                    </motion.button>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">Optional: Set a reminder for follow-up</p>
                                        </div>
                                    </div>

                                    {/* Note Content */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <FiMessageSquare className="w-4 h-4" />
                                            Note Content *
                                        </label>
                                        <textarea
                                            value={newNote.note}
                                            onChange={(e) => setNewNote({...newNote, note: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 min-h-[200px] resize-none"
                                            placeholder="Enter your note content here..."
                                        />
                                        {!newNote.note && (
                                            <p className="text-xs text-red-500 flex items-center gap-1">
                                                <FiAlertCircle className="w-3 h-3" />
                                                Note content is required
                                            </p>
                                        )}
                                    </div>

                                    {/* Attachments Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <FiPaperclip className="w-4 h-4" />
                                                Attachments
                                            </label>
                                            <span className="text-xs text-gray-500">
                                                {newNote.attachments.length}/5 files • Max 10MB each
                                            </span>
                                        </div>
                                        
                                        {/* Upload Area */}
                                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                                             onClick={() => fileInputRef.current?.click()}>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleAttachmentSelect}
                                                className="hidden"
                                                multiple
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                                            />
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                                                <FiUpload className="w-8 h-8 text-blue-600" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Drop files here or click to upload</h4>
                                            <p className="text-sm text-gray-600">Supports PDF, Word, Excel, Images, and Text files</p>
                                            {uploadingAttachment && (
                                                <div className="mt-4">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-gradient-to-r from-blue-600 to-indigo-700 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${Object.values(uploadProgress)[0] || 0}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Uploading... {Object.values(uploadProgress)[0] || 0}%
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Attachments List */}
                                        {newNote.attachments.length > 0 && (
                                            <div className="space-y-3">
                                                <p className="text-sm font-medium text-gray-700">
                                                    Attached files ({newNote.attachments.length})
                                                </p>
                                                <div className="space-y-2">
                                                    {newNote.attachments.map((attachment, index) => (
                                                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                    <div className="w-12 h-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                        {getFileIcon(attachment.name || attachment.filename || 'file')}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="font-medium text-gray-900 text-sm truncate">
                                                                            {attachment.name || attachment.filename || `Attachment ${index + 1}`}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {attachment.size ? formatFileSize(attachment.size) : 'Uploaded'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <motion.button
                                                                        onClick={() => downloadAttachment(attachment)}
                                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        title="Download"
                                                                    >
                                                                        <FiDownload className="w-4 h-4" />
                                                                    </motion.button>
                                                                    <motion.button
                                                                        onClick={() => removeAttachment(index)}
                                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        title="Remove"
                                                                    >
                                                                        <FiX className="w-4 h-4" />
                                                                    </motion.button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="border-t px-8 py-6 bg-gray-50 flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <FiInfo className="w-4 h-4" />
                                        Fields marked with * are required
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <motion.button
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setNewNote({
                                                subject: '',
                                                note: '',
                                                priority: 'high',
                                                status: 'pending',
                                                reminder_date: null,
                                                attachments: []
                                            });
                                        }}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-all duration-300"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        onClick={handleAddNote}
                                        disabled={!newNote.subject || !newNote.note || uploadingAttachment}
                                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                            !newNote.subject || !newNote.note || uploadingAttachment
                                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-lg hover:shadow-blue-500/25'
                                        }`}
                                        whileHover={!newNote.subject || !newNote.note || uploadingAttachment ? {} : { scale: 1.05, y: -2 }}
                                        whileTap={!newNote.subject || !newNote.note || uploadingAttachment ? {} : { scale: 0.95 }}
                                    >
                                        <FiCheck className="w-4 h-4" />
                                        {uploadingAttachment ? 'Uploading...' : 'Create Note'}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Professional Edit Note Modal */}
            <AnimatePresence>
                {showEditModal && selectedNote && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <FiEdit className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">Edit Note</h2>
                                            <p className="text-blue-100 text-sm mt-1">Update note information and attachments</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        onClick={() => setShowEditModal(false)}
                                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FiX className="w-6 h-6 text-white" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Modal Content - Same as Add Modal but with existing values */}
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="space-y-8">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <FiType className="w-4 h-4" />
                                                Subject *
                                            </label>
                                            <input
                                                type="text"
                                                value={newNote.subject}
                                                onChange={(e) => setNewNote({...newNote, subject: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                                                placeholder="Enter note subject"
                                            />
                                            {!newNote.subject && (
                                                <p className="text-xs text-red-500 flex items-center gap-1">
                                                    <FiAlertCircle className="w-3 h-3" />
                                                    Subject is required
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <FiTag className="w-4 h-4" />
                                                Priority *
                                            </label>
                                            <select
                                                value={newNote.priority}
                                                onChange={(e) => setNewNote({...newNote, priority: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
                                            >
                                                <option value="high">High Priority</option>
                                                <option value="medium">Medium Priority</option>
                                                <option value="low">Low Priority</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Status and Reminder */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <FiCheckCircle className="w-4 h-4" />
                                                Status *
                                            </label>
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
                                        
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <FiBell className="w-4 h-4" />
                                                Set Reminder
                                            </label>
                                            <div className="relative">
                                                <DatePicker
                                                    selected={newNote.reminder_date}
                                                    onChange={(date) => setNewNote({...newNote, reminder_date: date})}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    dateFormat="MMMM d, yyyy h:mm aa"
                                                    placeholderText="Select date and time"
                                                    minDate={new Date()}
                                                    popperClassName="z-50"
                                                    popperPlacement="bottom-start"
                                                    customInput={<CustomDatePickerInput />}
                                                />
                                                {newNote.reminder_date && (
                                                    <motion.button
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        onClick={() => setNewNote({...newNote, reminder_date: null})}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <FiX className="w-4 h-4" />
                                                    </motion.button>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">Optional: Set a reminder for follow-up</p>
                                        </div>
                                    </div>

                                    {/* Note Content */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <FiMessageSquare className="w-4 h-4" />
                                            Note Content *
                                        </label>
                                        <textarea
                                            value={newNote.note}
                                            onChange={(e) => setNewNote({...newNote, note: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 min-h-[200px] resize-none"
                                            placeholder="Enter your note content here..."
                                        />
                                        {!newNote.note && (
                                            <p className="text-xs text-red-500 flex items-center gap-1">
                                                <FiAlertCircle className="w-3 h-3" />
                                                Note content is required
                                            </p>
                                        )}
                                    </div>

                                    {/* Attachments Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <FiPaperclip className="w-4 h-4" />
                                                Attachments
                                            </label>
                                            <span className="text-xs text-gray-500">
                                                {newNote.attachments.length}/5 files • Max 10MB each
                                            </span>
                                        </div>
                                        
                                        {/* Upload Area */}
                                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                                             onClick={() => fileInputRef.current?.click()}>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleAttachmentSelect}
                                                className="hidden"
                                                multiple
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                                            />
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                                                <FiUpload className="w-8 h-8 text-blue-600" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Drop files here or click to upload</h4>
                                            <p className="text-sm text-gray-600">Supports PDF, Word, Excel, Images, and Text files</p>
                                            {uploadingAttachment && (
                                                <div className="mt-4">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-gradient-to-r from-blue-600 to-indigo-700 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${Object.values(uploadProgress)[0] || 0}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Uploading... {Object.values(uploadProgress)[0] || 0}%
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Attachments List */}
                                        {newNote.attachments.length > 0 && (
                                            <div className="space-y-3">
                                                <p className="text-sm font-medium text-gray-700">
                                                    Attached files ({newNote.attachments.length})
                                                </p>
                                                <div className="space-y-2">
                                                    {newNote.attachments.map((attachment, index) => (
                                                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                    <div className="w-12 h-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                        {getFileIcon(attachment.name || attachment.filename || 'file')}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="font-medium text-gray-900 text-sm truncate">
                                                                            {attachment.name || attachment.filename || `Attachment ${index + 1}`}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {attachment.size ? formatFileSize(attachment.size) : 'Uploaded'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <motion.button
                                                                        onClick={() => downloadAttachment(attachment)}
                                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        title="Download"
                                                                    >
                                                                        <FiDownload className="w-4 h-4" />
                                                                    </motion.button>
                                                                    <motion.button
                                                                        onClick={() => removeAttachment(index)}
                                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        title="Remove"
                                                                    >
                                                                        <FiX className="w-4 h-4" />
                                                                    </motion.button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="border-t px-8 py-6 bg-gray-50 flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <FiInfo className="w-4 h-4" />
                                        Fields marked with * are required
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <motion.button
                                        onClick={() => setShowEditModal(false)}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-all duration-300"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        onClick={handleEditNote}
                                        disabled={!newNote.subject || !newNote.note || uploadingAttachment}
                                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                            !newNote.subject || !newNote.note || uploadingAttachment
                                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-lg hover:shadow-blue-500/25'
                                        }`}
                                        whileHover={!newNote.subject || !newNote.note || uploadingAttachment ? {} : { scale: 1.05, y: -2 }}
                                        whileTap={!newNote.subject || !newNote.note || uploadingAttachment ? {} : { scale: 0.95 }}
                                    >
                                        <FiCheck className="w-4 h-4" />
                                        {uploadingAttachment ? 'Uploading...' : 'Update Note'}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Professional Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && selectedNote && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <FiTrash2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Delete Note</h2>
                                        <p className="text-red-100 text-sm mt-1">This action cannot be undone</p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8">
                                <div className="text-center space-y-6">
                                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                                        <FiAlertTriangle className="w-10 h-10 text-red-600" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                                        <p className="text-gray-600">
                                            Are you sure you want to delete the note titled
                                            <span className="font-bold text-red-600"> "{selectedNote.subject}"</span>?
                                        </p>
                                        <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl text-left">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                <FiUser className="w-4 h-4" />
                                                <span>By: {selectedNote.author}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 italic line-clamp-2">{selectedNote.note}</p>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            This action is permanent and cannot be recovered.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="border-t px-8 py-6 bg-gray-50 flex justify-center gap-4">
                                <motion.button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-all duration-300"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={deleteNote}
                                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center gap-2"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                    Delete Note
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default NotesTab;