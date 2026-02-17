import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiEdit, FiTrash2, FiX, FiMessageSquare, FiUser, FiCalendar, 
  FiTag, FiFilter, FiSearch, FiBook, FiCheckCircle, FiEye, FiChevronLeft, 
  FiChevronRight, FiClock, FiPaperclip, FiBell, FiDownload, FiUpload,
  FiClock as FiReminderClock, FiAlertCircle, FiFile, FiType, FiCheck,
  FiAlertTriangle, FiInfo, FiMic, FiMicOff, FiVolume2
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
    
    // Updated newNote state - removed attachments
    const [newNote, setNewNote] = useState({
        subject: '',
        note: '',
        priority: 'high',
        status: 'pending',
        reminder_date: null,
        type: 'text', // text, file, or voice
        file: null // For file/voice upload
    });
    
    // Voice recording states
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioURL, setAudioURL] = useState('');
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    
    // Audio playback tracking
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
    const audioRefs = useRef({});
    
    const [uploadingAttachment, setUploadingAttachment] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const fileInputRef = useRef(null);
    
    // Download attachment (for backward compatibility with existing notes)
    const downloadAttachment = (attachment) => {
        if (attachment.url) {
            window.open(attachment.url, '_blank');
        } else if (attachment.file) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(attachment.file);
            link.download = attachment.name || 'attachment';
            link.click();
        }
    };
    
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
                    type: note.type || 'text',
                    file: note.file || note.voice || null,
                    attachments: note.attachments || [],
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
                    formatted_reminder_date: note.reminder_date ? new Date(note.reminder_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : null,
                    created_by_name: note.create_by?.name || 'Unknown',
                    modified_by_name: note.modify_by?.name || null,
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
            apiStatus = 'pending';
        } else {
            apiStatus = displayStatus;
        }
        
        setNewNote({
            subject: note.subject || '',
            note: note.note || '',
            priority: note.priority.toLowerCase() || 'high',
            status: apiStatus,
            reminder_date: note.reminder_date || null,
            type: note.type || 'text',
            file: note.file || null
        });
        setShowEditModal(true);
    };

    const uploadFileToServer = async (file) => {
        if (!file) return null;
        
        const headers = getHeaders();
        if (!headers) {
            alert('Missing authentication headers');
            return null;
        }
        
        try {
            const formData = new FormData();
            
            // Ensure WAV files are properly named
            let uploadFile = file;
            
            // If it's a WAV file, ensure it has correct extension
            if (file.type === 'audio/wav' && !file.name.toLowerCase().endsWith('.wav')) {
                const wavFile = new File([file], `${file.name.replace(/\.[^/.]+$/, "")}.wav`, { 
                    type: 'audio/wav' 
                });
                uploadFile = wavFile;
            }
            
            formData.append('file', uploadFile);
            
            // Add metadata for server - explicitly state it's audio
            formData.append('file_type', 'voice_note');
            formData.append('note_type', 'voice');
            formData.append('mime_type', 'audio/wav');
            
            console.log('Uploading file to server:', {
                name: uploadFile.name,
                type: uploadFile.type,
                size: uploadFile.size,
                extension: uploadFile.name.split('.').pop()
            });
            
            const response = await axios.post(
                'https://api.ooms.in/api/v1/upload',
                formData,
                {
                    headers: {
                        ...headers,
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
                    },
                    timeout: 60000 // 60 second timeout for audio files
                }
            );
            
            console.log('Upload response:', response.data);
            
            if (response.data && response.data.success) {
                return response.data.url || response.data.data?.url;
            } else {
                throw new Error(response.data?.message || 'Upload failed');
            }
            
        } catch (error) {
            console.error('Error uploading file:', error);
            
            // Detailed error handling
            if (error.response) {
                const { status, data } = error.response;
                
                if (status === 400) {
                    if (data?.message?.includes('MIME type')) {
                        alert(`Server rejected file type: ${file.type}. The system is now converting recordings to WAV format which should be accepted.`);
                    } else if (data?.message?.includes('audio')) {
                        alert(`Audio file error: ${data.message}. Please try recording again.`);
                    } else {
                        alert(`Upload failed: ${data?.message || 'Bad request'}`);
                    }
                } else if (status === 413) {
                    alert('File too large. Maximum size is 10MB.');
                } else if (status === 415) {
                    alert('Unsupported media type. The system is converting to WAV format. Please try again.');
                } else if (status >= 500) {
                    alert('Server error. Please try again later.');
                }
            } else if (error.request) {
                alert('No response from server. Check your internet connection.');
            } else {
                alert(`Upload error: ${error.message}`);
            }
            
            return null;
        } finally {
            // Clear progress after delay
            setTimeout(() => {
                setUploadProgress(prev => {
                    const newProgress = { ...prev };
                    delete newProgress[file.name];
                    return newProgress;
                });
            }, 2000);
        }
    };

    // Handle file selection for file type notes
    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        
        if (file.size > maxSize) {
            alert(`File exceeds the 10MB limit. Please upload a smaller file.`);
            return;
        }
        
        setUploadingAttachment(true);
        
        // Upload file to server
        const fileUrl = await uploadFileToServer(file);
        
        if (fileUrl) {
            setNewNote(prev => ({
                ...prev,
                type: 'file',
                file: fileUrl,
                note: `File uploaded: ${file.name}`,
                subject: prev.subject || file.name
            }));
        }
        
        setUploadingAttachment(false);
        
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Voice recording functions - FIXED TO CONVERT TO WAV FORMAT
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    channelCount: 1,
                    sampleRate: 44100,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
            
            // Use audio/webm for recording (most compatible with browsers)
            const mimeType = 'audio/webm';
            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
            
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };
            
            mediaRecorder.onstop = async () => {
                // Create WebM blob from recorded chunks
                const webmBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                
                // Convert WebM to WAV format for server compatibility
                const wavBlob = await convertWebMToWav(webmBlob);
                
                // Create audio file with correct WAV format
                const timestamp = new Date().getTime();
                const audioFile = new File([wavBlob], `voice-note-${timestamp}.wav`, { 
                    type: 'audio/wav' 
                });
                
                console.log('Final audio file:', {
                    name: audioFile.name,
                    type: audioFile.type,
                    size: audioFile.size
                });
                
                // Update audio preview (still use original for playback)
                setAudioBlob(webmBlob); // Keep original for preview
                const audioUrl = URL.createObjectURL(webmBlob);
                setAudioURL(audioUrl);
                
                // Upload the WAV file (server will accept this)
                setUploadingAttachment(true);
                const fileUrl = await uploadFileToServer(audioFile);
                
                if (fileUrl) {
                    setNewNote(prev => ({
                        ...prev,
                        type: 'voice',
                        file: fileUrl,
                        note: `Voice note (${formatRecordingTime(recordingTime)})`,
                        subject: prev.subject || 'Voice Note'
                    }));
                    alert('Voice note uploaded successfully!');
                } else {
                    alert('Failed to upload voice note. Please try again.');
                }
                
                setUploadingAttachment(false);
                
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };
            
            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            
            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
            
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Error accessing microphone. Please check permissions.');
        }
    };

    // Add this helper function to convert WebM to WAV
    const convertWebMToWav = async (webmBlob) => {
        try {
            // Create an audio context to process the audio
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Convert blob to array buffer
            const arrayBuffer = await webmBlob.arrayBuffer();
            
            // Decode the WebM audio data
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            
            // Get audio parameters
            const numberOfChannels = audioBuffer.numberOfChannels;
            const sampleRate = audioBuffer.sampleRate;
            const length = audioBuffer.length;
            
            // Calculate WAV file size
            const wavSize = 44 + length * numberOfChannels * 2; // 44 bytes header + PCM data
            
            // Create array buffer for WAV file
            const wavBuffer = new ArrayBuffer(wavSize);
            const view = new DataView(wavBuffer);
            
            // Write WAV header
            // RIFF identifier
            writeString(view, 0, 'RIFF');
            // File length minus RIFF identifier length and file description length
            view.setUint32(4, 36 + length * numberOfChannels * 2, true);
            // RIFF type
            writeString(view, 8, 'WAVE');
            // Format chunk identifier
            writeString(view, 12, 'fmt ');
            // Format chunk length
            view.setUint32(16, 16, true);
            // Sample format (PCM)
            view.setUint16(20, 1, true);
            // Channel count
            view.setUint16(22, numberOfChannels, true);
            // Sample rate
            view.setUint32(24, sampleRate, true);
            // Byte rate (sample rate * block align)
            view.setUint32(28, sampleRate * numberOfChannels * 2, true);
            // Block align (channel count * bytes per sample)
            view.setUint16(32, numberOfChannels * 2, true);
            // Bits per sample
            view.setUint16(34, 16, true);
            // Data chunk identifier
            writeString(view, 36, 'data');
            // Data chunk length
            view.setUint32(40, length * numberOfChannels * 2, true);
            
            // Write PCM audio data
            let offset = 44;
            for (let i = 0; i < length; i++) {
                for (let channel = 0; channel < numberOfChannels; channel++) {
                    const sample = audioBuffer.getChannelData(channel)[i];
                    // Convert to 16-bit PCM
                    const int16 = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
                    view.setInt16(offset, int16, true);
                    offset += 2;
                }
            }
            
            // Create WAV blob
            const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
            
            return wavBlob;
            
        } catch (error) {
            console.error('Error converting WebM to WAV:', error);
            // Fallback: use original blob but rename as WAV
            // This is less ideal but better than nothing
            console.log('Falling back to WebM with .wav extension');
            return new Blob([webmBlob], { type: 'audio/wav' });
        }
    };

    // Helper function to write strings to DataView
    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setAudioBlob(null);
            setAudioURL('');
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            
            // Reset note type to text
            setNewNote(prev => ({
                ...prev,
                type: 'text',
                file: null
            }));
        }
    };

    // Format recording time
    const formatRecordingTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Remove file/voice
    const removeFile = () => {
        setNewNote(prev => ({
            ...prev,
            type: 'text',
            file: null,
            note: '',
            subject: prev.type === 'file' ? '' : prev.subject
        }));
        setAudioBlob(null);
        setAudioURL('');
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
        
        if (newNote.type === 'text' && !newNote.note.trim()) {
            alert('Please enter note content');
            return;
        }

        try {
            // Prepare request body based on note type
            let requestBody = {
                username: clientUsername,
                subject: newNote.subject,
                priority: newNote.priority,
                status: newNote.status,
                type: newNote.type,
                reminder_date: newNote.reminder_date ? newNote.reminder_date.toISOString() : null
            };

            // Add note content or file based on type
            if (newNote.type === 'text') {
                requestBody.note = newNote.note;
            } else if (newNote.type === 'file' || newNote.type === 'voice') {
                requestBody.note = newNote.note;
                requestBody.file = newNote.file;
                // Add file_type for voice notes to help server identify
                if (newNote.type === 'voice') {
                    requestBody.file_type = 'voice';
                }
            }

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
                    type: 'text',
                    file: null
                });
                // Reset voice recording
                setAudioBlob(null);
                setAudioURL('');
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
        
        if (newNote.type === 'text' && !newNote.note.trim()) {
            alert('Please enter note content');
            return;
        }

        try {
            // Prepare request body based on note type
            let requestBody = {
                username: clientUsername,
                note_id: selectedNote.id,
                subject: newNote.subject,
                priority: newNote.priority,
                status: newNote.status,
                type: newNote.type,
                reminder_date: newNote.reminder_date ? newNote.reminder_date.toISOString() : null
            };

            // Add note content or file based on type
            if (newNote.type === 'text') {
                requestBody.note = newNote.note;
            } else if (newNote.type === 'file' || newNote.type === 'voice') {
                requestBody.note = newNote.note;
                requestBody.file = newNote.file;
                // Add file_type for voice notes to help server identify
                if (newNote.type === 'voice') {
                    requestBody.file_type = 'voice';
                }
            }

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
                // Reset voice recording
                setAudioBlob(null);
                setAudioURL('');
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
        
        return { total, active, completed, cancelled };
    };

    const stats = calculateNoteStats();

    // Get file icon based on file type
    const getFileIcon = (fileName) => {
        const extension = fileName?.split('.').pop().toLowerCase() || '';
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
            case 'mp3':
            case 'wav':
            case 'ogg':
            case 'webm':
                return <FiVolume2 className="w-5 h-5 text-orange-600" />;
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

    // Get note type badge color
    const getTypeBadgeColor = (type) => {
        switch (type) {
            case 'text':
                return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200';
            case 'file':
                return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
            case 'voice':
                return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200';
            default:
                return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
        }
    };

    // Get note type icon
    const getTypeIcon = (type) => {
        switch (type) {
            case 'text':
                return <FiMessageSquare className="w-4 h-4" />;
            case 'file':
                return <FiFile className="w-4 h-4" />;
            case 'voice':
                return <FiMic className="w-4 h-4" />;
            default:
                return <FiMessageSquare className="w-4 h-4" />;
        }
    };

    // Handle audio playback
    const handlePlayAudio = (noteId) => {
        if (currentlyPlaying === noteId) {
            // Pause if currently playing
            if (audioRefs.current[noteId]) {
                audioRefs.current[noteId].pause();
                setCurrentlyPlaying(null);
            }
        } else {
            // Pause any currently playing audio
            if (currentlyPlaying && audioRefs.current[currentlyPlaying]) {
                audioRefs.current[currentlyPlaying].pause();
            }
            
            // Play new audio
            if (audioRefs.current[noteId]) {
                audioRefs.current[noteId].play()
                    .then(() => setCurrentlyPlaying(noteId))
                    .catch(err => console.error('Error playing audio:', err));
            }
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (audioURL) {
                URL.revokeObjectURL(audioURL);
            }
            // Cleanup audio refs
            Object.values(audioRefs.current).forEach(audio => {
                if (audio) {
                    audio.pause();
                    audio.src = '';
                }
            });
        };
    }, [audioURL]);

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

            {/* Stats Dashboard - UPDATED with only Total, Pending, Complete, Cancel */}
            {!loading && !error && clientUsername && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <motion.div 
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -mr-8 -mt-8"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Notes</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <FiBook className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                        All notes
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-full -mr-8 -mt-8"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Pending</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.active}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                        <FiClock className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                        Active notes
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-8 -mt-8"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Completed</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                                        <FiCheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        Finished notes
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full -mr-8 -mt-8"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Cancelled</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.cancelled}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                                        <FiX className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    Cancelled notes
                                    </span>
                                </div>
                            </div>
                        </motion.div>
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

                    {/* Notes List - UPDATED WITH VOICE PLAYBACK */}
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
                                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white ${
                                                        note.type === 'text' ? 'bg-gradient-to-r from-blue-600 to-indigo-700' :
                                                        note.type === 'file' ? 'bg-gradient-to-r from-green-600 to-emerald-700' :
                                                        'bg-gradient-to-r from-purple-600 to-pink-700'
                                                    }`}>
                                                        {getTypeIcon(note.type)}
                                                    </div>
                                                    <div className="space-y-3 flex-1">
                                                        {note.subject && (
                                                            <div className="flex items-start justify-between">
                                                                <h4 className="font-semibold text-gray-900">{note.subject}</h4>
                                                                <div className="flex items-center gap-2">
                                                                    {reminderStatus && (
                                                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${reminderStatus.color}`}>
                                                                            <reminderStatus.icon className="w-3 h-3" />
                                                                            {reminderStatus.text}
                                                                        </div>
                                                                    )}
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getTypeBadgeColor(note.type)}`}>
                                                                        {getTypeIcon(note.type)}
                                                                        {note.type === 'text' ? 'Text' : note.type === 'file' ? 'File' : 'Voice'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Note Content with Voice Playback */}
                                                        {note.type === 'voice' ? (
                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-2 text-gray-700">
                                                                    <FiVolume2 className="w-4 h-4 text-purple-600" />
                                                                    <span className="text-sm text-gray-600">{note.note}</span>
                                                                </div>
                                                                {note.file && (
                                                                    <div className="flex items-center gap-3">
                                                                        <audio 
                                                                            ref={el => audioRefs.current[note.id] = el}
                                                                            src={note.file}
                                                                            preload="metadata"
                                                                            onEnded={() => setCurrentlyPlaying(null)}
                                                                            className="hidden"
                                                                        />
                                                                        <motion.button
                                                                            onClick={() => handlePlayAudio(note.id)}
                                                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                                                currentlyPlaying === note.id
                                                                                    ? 'bg-gradient-to-r from-red-600 to-pink-700 text-white'
                                                                                    : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200'
                                                                            }`}
                                                                            whileHover={{ scale: 1.05 }}
                                                                            whileTap={{ scale: 0.95 }}
                                                                        >
                                                                            <FiVolume2 className="w-4 h-4" />
                                                                            {currentlyPlaying === note.id ? 'Playing...' : 'Play Voice Note'}
                                                                        </motion.button>
                                                                        <span className="text-xs text-gray-500">
                                                                            Click to preview
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : note.type === 'file' ? (
                                                            <div className="flex items-center gap-2 text-gray-700">
                                                                <FiFile className="w-4 h-4 text-green-600" />
                                                                <span>{note.note}</span>
                                                            </div>
                                                        ) : (
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
                                                        )}
                                                        
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
                                                            {note.file && (
                                                                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                                                                    <FiPaperclip className="w-3 h-3" />
                                                                    {note.type === 'voice' ? 'Audio file' : 'File attached'}
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
                                        • Create text notes for quick messages • Upload files for documents • 
                                        Record voice notes for verbal instructions • Set reminders for important follow-ups
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

            {/* Professional View Note Modal - UPDATED FOR VOICE PLAYBACK */}
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
                            <div className={`px-8 py-6 ${
                                selectedNote.type === 'text' ? 'bg-gradient-to-r from-blue-600 to-indigo-700' :
                                selectedNote.type === 'file' ? 'bg-gradient-to-r from-green-600 to-emerald-700' :
                                'bg-gradient-to-r from-purple-600 to-pink-700'
                            } text-white`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            {getTypeIcon(selectedNote.type)}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">Note Details</h2>
                                            <p className="text-opacity-90 text-sm mt-1">
                                                {selectedNote.type === 'text' ? 'Text Note' : 
                                                 selectedNote.type === 'file' ? 'File Attachment' : 
                                                 'Voice Note'}
                                            </p>
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

                                    {/* Type Display */}
                                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                    selectedNote.type === 'text' ? 'bg-gradient-to-r from-blue-100 to-indigo-100' :
                                                    selectedNote.type === 'file' ? 'bg-gradient-to-r from-green-100 to-emerald-100' :
                                                    'bg-gradient-to-r from-purple-100 to-pink-100'
                                                }`}>
                                                    {getTypeIcon(selectedNote.type)}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">Note Type</h3>
                                                    <p className="text-sm text-gray-600">
                                                        {selectedNote.type === 'text' ? 'Text Note' : 
                                                         selectedNote.type === 'file' ? 'File Attachment' : 
                                                         'Voice Recording'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-4 py-2 rounded-lg font-medium ${getTypeBadgeColor(selectedNote.type)}`}>
                                                {selectedNote.type === 'text' ? 'TEXT' : 
                                                 selectedNote.type === 'file' ? 'FILE' : 
                                                 'VOICE'}
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
                                            {selectedNote.type === 'voice' ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                                            <FiVolume2 className="w-8 h-8 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">Voice Recording</h4>
                                                            <p className="text-sm text-gray-600">{selectedNote.note}</p>
                                                        </div>
                                                    </div>
                                                    {selectedNote.file && (
                                                        <div className="mt-4 space-y-4">
                                                            <audio 
                                                                controls 
                                                                className="w-full" 
                                                                preload="metadata"
                                                                onPlay={() => setCurrentlyPlaying(selectedNote.id)}
                                                                onPause={() => setCurrentlyPlaying(null)}
                                                                onEnded={() => setCurrentlyPlaying(null)}
                                                            >
                                                                <source src={selectedNote.file} type="audio/mpeg" />
                                                                <source src={selectedNote.file} type="audio/webm" />
                                                                <source src={selectedNote.file} type="audio/ogg" />
                                                                <source src={selectedNote.file} type="audio/wav" />
                                                                Your browser does not support the audio element.
                                                            </audio>
                                                            <div className="flex justify-end gap-3">
                                                                <motion.button
                                                                    onClick={() => window.open(selectedNote.file, '_blank')}
                                                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-lg hover:shadow-md transition-all duration-200 flex items-center gap-2"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    <FiDownload className="w-4 h-4" />
                                                                    Download Audio
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : selectedNote.type === 'file' ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                                                            <FiFile className="w-8 h-8 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">File Attachment</h4>
                                                            <p className="text-sm text-gray-600">{selectedNote.note}</p>
                                                        </div>
                                                    </div>
                                                    {selectedNote.file && (
                                                        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-12 h-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                                                                        {getFileIcon(selectedNote.file)}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium text-gray-900">
                                                                            {selectedNote.file.split('/').pop()}
                                                                        </div>
                                                                        <div className="text-sm text-gray-500">
                                                                            File attached
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <motion.button
                                                                    onClick={() => window.open(selectedNote.file, '_blank')}
                                                                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:shadow-md transition-all duration-200 flex items-center gap-2"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    <FiDownload className="w-4 h-4" />
                                                                    Download File
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedNote.note}</p>
                                            )}
                                        </div>
                                    </div>

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

            {/* Professional Add Note Modal - REMOVED ADDITIONAL ATTACHMENTS */}
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
                                            <p className="text-blue-100 text-sm mt-1">Add a new note with text, file, or voice</p>
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
                                                type: 'text',
                                                file: null
                                            });
                                            // Stop recording if in progress
                                            if (isRecording) {
                                                stopRecording();
                                            }
                                            setAudioBlob(null);
                                            setAudioURL('');
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
                                    {/* Note Type Selection */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <FiType className="w-4 h-4" />
                                            Note Type *
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <motion.button
                                                type="button"
                                                onClick={() => setNewNote(prev => ({ ...prev, type: 'text', file: null }))}
                                                className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-3 ${
                                                    newNote.type === 'text' 
                                                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md' 
                                                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                                                }`}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                                                    newNote.type === 'text' 
                                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700' 
                                                        : 'bg-gradient-to-r from-blue-100 to-indigo-100'
                                                }`}>
                                                    <FiMessageSquare className={`w-8 h-8 ${newNote.type === 'text' ? 'text-white' : 'text-blue-600'}`} />
                                                </div>
                                                <div className="text-center">
                                                    <h4 className="font-semibold text-gray-900">Text Note</h4>
                                                    <p className="text-sm text-gray-600 mt-1">Write a text note</p>
                                                </div>
                                                {newNote.type === 'text' && (
                                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                        <FiCheck className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </motion.button>

                                            <motion.button
                                                type="button"
                                                onClick={() => setNewNote(prev => ({ ...prev, type: 'file', file: null }))}
                                                className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-3 ${
                                                    newNote.type === 'file' 
                                                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md' 
                                                        : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                                                }`}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                                                    newNote.type === 'file' 
                                                        ? 'bg-gradient-to-r from-green-600 to-emerald-700' 
                                                        : 'bg-gradient-to-r from-green-100 to-emerald-100'
                                                }`}>
                                                    <FiFile className={`w-8 h-8 ${newNote.type === 'file' ? 'text-white' : 'text-green-600'}`} />
                                                </div>
                                                <div className="text-center">
                                                    <h4 className="font-semibold text-gray-900">File Note</h4>
                                                    <p className="text-sm text-gray-600 mt-1">Upload a document/file</p>
                                                </div>
                                                {newNote.type === 'file' && (
                                                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                                        <FiCheck className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </motion.button>

                                            <motion.button
                                                type="button"
                                                onClick={() => setNewNote(prev => ({ ...prev, type: 'voice', file: null }))}
                                                className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-3 ${
                                                    newNote.type === 'voice' 
                                                        ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md' 
                                                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                                                }`}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                                                    newNote.type === 'voice' 
                                                        ? 'bg-gradient-to-r from-purple-600 to-pink-700' 
                                                        : 'bg-gradient-to-r from-purple-100 to-pink-100'
                                                }`}>
                                                    <FiMic className={`w-8 h-8 ${newNote.type === 'voice' ? 'text-white' : 'text-purple-600'}`} />
                                                </div>
                                                <div className="text-center">
                                                    <h4 className="font-semibold text-gray-900">Voice Note</h4>
                                                    <p className="text-sm text-gray-600 mt-1">Record a voice message</p>
                                                </div>
                                                {newNote.type === 'voice' && (
                                                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                                        <FiCheck className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>

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

                                    {/* Content based on type */}
                                    {newNote.type === 'text' && (
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
                                    )}

                                    {newNote.type === 'file' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <FiFile className="w-4 h-4" />
                                                    File Upload *
                                                </label>
                                                <span className="text-xs text-gray-500">
                                                    Max 10MB per file
                                                </span>
                                            </div>
                                            
                                            {/* File Upload Area */}
                                            {!newNote.file ? (
                                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer"
                                                    onClick={() => fileInputRef.current?.click()}>
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handleFileSelect}
                                                        className="hidden"
                                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt,.zip,.rar"
                                                    />
                                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl flex items-center justify-center">
                                                        <FiUpload className="w-8 h-8 text-green-600" />
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">Click to upload file</h4>
                                                    <p className="text-sm text-gray-600">Supports PDF, Word, Excel, Images, and Text files</p>
                                                    {uploadingAttachment && (
                                                        <div className="mt-4">
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div 
                                                                    className="bg-gradient-to-r from-green-600 to-emerald-700 h-2 rounded-full transition-all duration-300"
                                                                    style={{ width: `${Object.values(uploadProgress)[0] || 0}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-2">
                                                                Uploading... {Object.values(uploadProgress)[0] || 0}%
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                                                                <FiFile className="w-8 h-8 text-green-600" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">File Selected</h4>
                                                                <p className="text-sm text-gray-600">
                                                                    {newNote.file.split('/').pop() || 'Uploaded file'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <motion.button
                                                                onClick={() => window.open(newNote.file, '_blank')}
                                                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                title="Preview"
                                                            >
                                                                <FiEye className="w-4 h-4" />
                                                            </motion.button>
                                                            <motion.button
                                                                onClick={removeFile}
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
                                            )}
                                            
                                            {/* Note Description */}
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <FiMessageSquare className="w-4 h-4" />
                                                    Description
                                                </label>
                                                <textarea
                                                    value={newNote.note}
                                                    onChange={(e) => setNewNote({...newNote, note: e.target.value})}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 min-h-[100px] resize-none"
                                                    placeholder="Add a description for this file..."
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {newNote.type === 'voice' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <FiMic className="w-4 h-4" />
                                                    Voice Recording *
                                                </label>
                                            </div>
                                            
                                            {/* Voice Recording Area */}
                                            {!isRecording && !audioURL && !newNote.file ? (
                                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-500 transition-colors">
                                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl flex items-center justify-center">
                                                        <FiMic className="w-8 h-8 text-purple-600" />
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">Record a voice note</h4>
                                                    <p className="text-sm text-gray-600 mb-4">Click the record button to start recording</p>
                                                    <motion.button
                                                        onClick={startRecording}
                                                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2 mx-auto"
                                                        whileHover={{ scale: 1.05, y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FiMic className="w-5 h-5" />
                                                        Start Recording
                                                    </motion.button>
                                                    <p className="text-xs text-gray-500 mt-4">
                                                        Note: You'll need to allow microphone access
                                                    </p>
                                                </div>
                                            ) : isRecording ? (
                                                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8 text-center">
                                                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-red-600 to-pink-700 rounded-full flex items-center justify-center animate-pulse">
                                                        <FiMic className="w-10 h-10 text-white" />
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">Recording in progress...</h4>
                                                    <div className="text-2xl font-bold text-red-600 mb-6">
                                                        {formatRecordingTime(recordingTime)}
                                                    </div>
                                                    <div className="flex justify-center gap-4">
                                                        <motion.button
                                                            onClick={stopRecording}
                                                            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center gap-2"
                                                            whileHover={{ scale: 1.05, y: -2 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <FiCheck className="w-5 h-5" />
                                                            Stop Recording
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={cancelRecording}
                                                            className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-all duration-300"
                                                            whileHover={{ scale: 1.05, y: -2 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Cancel
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                                                <FiVolume2 className="w-8 h-8 text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">Recording Complete</h4>
                                                                <p className="text-sm text-gray-600">
                                                                    Duration: {formatRecordingTime(recordingTime)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {audioURL && (
                                                                <audio controls className="w-48">
                                                                    <source src={audioURL} type="audio/mpeg" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                            )}
                                                            <motion.button
                                                                onClick={removeFile}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                title="Re-record"
                                                            >
                                                                <FiX className="w-4 h-4" />
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                    {uploadingAttachment && (
                                                        <div className="mt-4">
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div 
                                                                    className="bg-gradient-to-r from-purple-600 to-pink-700 h-2 rounded-full transition-all duration-300"
                                                                    style={{ width: `${Object.values(uploadProgress)[0] || 0}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-2 text-center">
                                                                Uploading audio... {Object.values(uploadProgress)[0] || 0}%
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {/* Note Description */}
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <FiMessageSquare className="w-4 h-4" />
                                                    Description
                                                </label>
                                                <textarea
                                                    value={newNote.note}
                                                    onChange={(e) => setNewNote({...newNote, note: e.target.value})}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 min-h-[100px] resize-none"
                                                    placeholder="Add a description for this voice note..."
                                                />
                                            </div>
                                        </div>
                                    )}
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
                                                type: 'text',
                                                file: null
                                            });
                                            // Stop recording if in progress
                                            if (isRecording) {
                                                stopRecording();
                                            }
                                            setAudioBlob(null);
                                            setAudioURL('');
                                        }}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-all duration-300"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        onClick={handleAddNote}
                                        disabled={!newNote.subject || 
                                                 (newNote.type === 'text' && !newNote.note) || 
                                                 (newNote.type === 'file' && !newNote.file) ||
                                                 (newNote.type === 'voice' && !newNote.file) ||
                                                 uploadingAttachment ||
                                                 isRecording}
                                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                            !newNote.subject || 
                                            (newNote.type === 'text' && !newNote.note) || 
                                            (newNote.type === 'file' && !newNote.file) ||
                                            (newNote.type === 'voice' && !newNote.file) ||
                                            uploadingAttachment ||
                                            isRecording
                                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-lg hover:shadow-blue-500/25'
                                        }`}
                                        whileHover={!newNote.subject || 
                                                   (newNote.type === 'text' && !newNote.note) || 
                                                   (newNote.type === 'file' && !newNote.file) ||
                                                   (newNote.type === 'voice' && !newNote.file) ||
                                                   uploadingAttachment ||
                                                   isRecording ? {} : { scale: 1.05, y: -2 }}
                                        whileTap={!newNote.subject || 
                                                 (newNote.type === 'text' && !newNote.note) || 
                                                 (newNote.type === 'file' && !newNote.file) ||
                                                 (newNote.type === 'voice' && !newNote.file) ||
                                                 uploadingAttachment ||
                                                 isRecording ? {} : { scale: 0.95 }}
                                    >
                                        <FiCheck className="w-4 h-4" />
                                        {uploadingAttachment ? 'Uploading...' : isRecording ? 'Recording...' : 'Create Note'}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Professional Edit Note Modal - REMOVED ADDITIONAL ATTACHMENTS */}
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
                                            <p className="text-blue-100 text-sm mt-1">Update note information</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        onClick={() => {
                                            setShowEditModal(false);
                                            // Stop recording if in progress
                                            if (isRecording) {
                                                stopRecording();
                                            }
                                            setAudioBlob(null);
                                            setAudioURL('');
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
                                    {/* Note Type Selection */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <FiType className="w-4 h-4" />
                                            Note Type *
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <motion.button
                                                type="button"
                                                onClick={() => setNewNote(prev => ({ ...prev, type: 'text', file: null }))}
                                                className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-3 ${
                                                    newNote.type === 'text' 
                                                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md' 
                                                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                                                }`}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                                                    newNote.type === 'text' 
                                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700' 
                                                        : 'bg-gradient-to-r from-blue-100 to-indigo-100'
                                                }`}>
                                                    <FiMessageSquare className={`w-8 h-8 ${newNote.type === 'text' ? 'text-white' : 'text-blue-600'}`} />
                                                </div>
                                                <div className="text-center">
                                                    <h4 className="font-semibold text-gray-900">Text Note</h4>
                                                    <p className="text-sm text-gray-600 mt-1">Write a text note</p>
                                                </div>
                                                {newNote.type === 'text' && (
                                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                        <FiCheck className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </motion.button>

                                            <motion.button
                                                type="button"
                                                onClick={() => setNewNote(prev => ({ ...prev, type: 'file', file: null }))}
                                                className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-3 ${
                                                    newNote.type === 'file' 
                                                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md' 
                                                        : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                                                }`}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                                                    newNote.type === 'file' 
                                                        ? 'bg-gradient-to-r from-green-600 to-emerald-700' 
                                                        : 'bg-gradient-to-r from-green-100 to-emerald-100'
                                                }`}>
                                                    <FiFile className={`w-8 h-8 ${newNote.type === 'file' ? 'text-white' : 'text-green-600'}`} />
                                                </div>
                                                <div className="text-center">
                                                    <h4 className="font-semibold text-gray-900">File Note</h4>
                                                    <p className="text-sm text-gray-600 mt-1">Upload a document/file</p>
                                                </div>
                                                {newNote.type === 'file' && (
                                                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                                        <FiCheck className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </motion.button>

                                            <motion.button
                                                type="button"
                                                onClick={() => setNewNote(prev => ({ ...prev, type: 'voice', file: null }))}
                                                className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-3 ${
                                                    newNote.type === 'voice' 
                                                        ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md' 
                                                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                                                }`}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                                                    newNote.type === 'voice' 
                                                        ? 'bg-gradient-to-r from-purple-600 to-pink-700' 
                                                        : 'bg-gradient-to-r from-purple-100 to-pink-100'
                                                }`}>
                                                    <FiMic className={`w-8 h-8 ${newNote.type === 'voice' ? 'text-white' : 'text-purple-600'}`} />
                                                </div>
                                                <div className="text-center">
                                                    <h4 className="font-semibold text-gray-900">Voice Note</h4>
                                                    <p className="text-sm text-gray-600 mt-1">Record a voice message</p>
                                                </div>
                                                {newNote.type === 'voice' && (
                                                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                                        <FiCheck className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>

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

                                    {/* Content based on type */}
                                    {newNote.type === 'text' && (
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
                                    )}

                                    {newNote.type === 'file' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <FiFile className="w-4 h-4" />
                                                    File Upload *
                                                </label>
                                                <span className="text-xs text-gray-500">
                                                    Max 10MB per file
                                                </span>
                                            </div>
                                            
                                            {/* File Upload Area */}
                                            {!newNote.file ? (
                                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer"
                                                    onClick={() => fileInputRef.current?.click()}>
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handleFileSelect}
                                                        className="hidden"
                                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt,.zip,.rar"
                                                    />
                                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl flex items-center justify-center">
                                                        <FiUpload className="w-8 h-8 text-green-600" />
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">Click to upload file</h4>
                                                    <p className="text-sm text-gray-600">Supports PDF, Word, Excel, Images, and Text files</p>
                                                    {uploadingAttachment && (
                                                        <div className="mt-4">
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div 
                                                                    className="bg-gradient-to-r from-green-600 to-emerald-700 h-2 rounded-full transition-all duration-300"
                                                                    style={{ width: `${Object.values(uploadProgress)[0] || 0}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-2">
                                                                Uploading... {Object.values(uploadProgress)[0] || 0}%
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                                                                <FiFile className="w-8 h-8 text-green-600" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">File Selected</h4>
                                                                <p className="text-sm text-gray-600">
                                                                    {newNote.file.split('/').pop() || 'Uploaded file'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <motion.button
                                                                onClick={() => window.open(newNote.file, '_blank')}
                                                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                title="Preview"
                                                            >
                                                                <FiEye className="w-4 h-4" />
                                                            </motion.button>
                                                            <motion.button
                                                                onClick={removeFile}
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
                                            )}
                                            
                                            {/* Note Description */}
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <FiMessageSquare className="w-4 h-4" />
                                                    Description
                                                </label>
                                                <textarea
                                                    value={newNote.note}
                                                    onChange={(e) => setNewNote({...newNote, note: e.target.value})}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 min-h-[100px] resize-none"
                                                    placeholder="Add a description for this file..."
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {newNote.type === 'voice' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <FiMic className="w-4 h-4" />
                                                    Voice Recording *
                                                </label>
                                            </div>
                                            
                                            {/* Voice Recording Area */}
                                            {!isRecording && !audioURL && !newNote.file ? (
                                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-500 transition-colors">
                                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl flex items-center justify-center">
                                                        <FiMic className="w-8 h-8 text-purple-600" />
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">Record a voice note</h4>
                                                    <p className="text-sm text-gray-600 mb-4">Click the record button to start recording</p>
                                                    <motion.button
                                                        onClick={startRecording}
                                                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2 mx-auto"
                                                        whileHover={{ scale: 1.05, y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FiMic className="w-5 h-5" />
                                                        Start Recording
                                                    </motion.button>
                                                    <p className="text-xs text-gray-500 mt-4">
                                                        Note: You'll need to allow microphone access
                                                    </p>
                                                </div>
                                            ) : isRecording ? (
                                                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8 text-center">
                                                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-red-600 to-pink-700 rounded-full flex items-center justify-center animate-pulse">
                                                        <FiMic className="w-10 h-10 text-white" />
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">Recording in progress...</h4>
                                                    <div className="text-2xl font-bold text-red-600 mb-6">
                                                        {formatRecordingTime(recordingTime)}
                                                    </div>
                                                    <div className="flex justify-center gap-4">
                                                        <motion.button
                                                            onClick={stopRecording}
                                                            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center gap-2"
                                                            whileHover={{ scale: 1.05, y: -2 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <FiCheck className="w-5 h-5" />
                                                            Stop Recording
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={cancelRecording}
                                                            className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-all duration-300"
                                                            whileHover={{ scale: 1.05, y: -2 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Cancel
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                                                <FiVolume2 className="w-8 h-8 text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">Recording Complete</h4>
                                                                <p className="text-sm text-gray-600">
                                                                    Duration: {formatRecordingTime(recordingTime)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {audioURL && (
                                                                <audio controls className="w-48">
                                                                    <source src={audioURL} type="audio/mpeg" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                            )}
                                                            <motion.button
                                                                onClick={removeFile}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                title="Re-record"
                                                            >
                                                                <FiX className="w-4 h-4" />
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                    {uploadingAttachment && (
                                                        <div className="mt-4">
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div 
                                                                    className="bg-gradient-to-r from-purple-600 to-pink-700 h-2 rounded-full transition-all duration-300"
                                                                    style={{ width: `${Object.values(uploadProgress)[0] || 0}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-2 text-center">
                                                                Uploading audio... {Object.values(uploadProgress)[0] || 0}%
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {/* Note Description */}
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <FiMessageSquare className="w-4 h-4" />
                                                    Description
                                                </label>
                                                <textarea
                                                    value={newNote.note}
                                                    onChange={(e) => setNewNote({...newNote, note: e.target.value})}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 min-h-[100px] resize-none"
                                                    placeholder="Add a description for this voice note..."
                                                />
                                            </div>
                                        </div>
                                    )}
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
                                            setShowEditModal(false);
                                            // Stop recording if in progress
                                            if (isRecording) {
                                                stopRecording();
                                            }
                                            setAudioBlob(null);
                                            setAudioURL('');
                                        }}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-all duration-300"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        onClick={handleEditNote}
                                        disabled={!newNote.subject || 
                                                 (newNote.type === 'text' && !newNote.note) || 
                                                 (newNote.type === 'file' && !newNote.file) ||
                                                 (newNote.type === 'voice' && !newNote.file) ||
                                                 uploadingAttachment ||
                                                 isRecording}
                                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                            !newNote.subject || 
                                            (newNote.type === 'text' && !newNote.note) || 
                                            (newNote.type === 'file' && !newNote.file) ||
                                            (newNote.type === 'voice' && !newNote.file) ||
                                            uploadingAttachment ||
                                            isRecording
                                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-lg hover:shadow-blue-500/25'
                                        }`}
                                        whileHover={!newNote.subject || 
                                                   (newNote.type === 'text' && !newNote.note) || 
                                                   (newNote.type === 'file' && !newNote.file) ||
                                                   (newNote.type === 'voice' && !newNote.file) ||
                                                   uploadingAttachment ||
                                                   isRecording ? {} : { scale: 1.05, y: -2 }}
                                        whileTap={!newNote.subject || 
                                                 (newNote.type === 'text' && !newNote.note) || 
                                                 (newNote.type === 'file' && !newNote.file) ||
                                                 (newNote.type === 'voice' && !newNote.file) ||
                                                 uploadingAttachment ||
                                                 isRecording ? {} : { scale: 0.95 }}
                                    >
                                        <FiCheck className="w-4 h-4" />
                                        {uploadingAttachment ? 'Uploading...' : isRecording ? 'Recording...' : 'Update Note'}
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
                                                {getTypeIcon(selectedNote.type)}
                                                <span>Type: {selectedNote.type === 'text' ? 'Text' : selectedNote.type === 'file' ? 'File' : 'Voice'}</span>
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