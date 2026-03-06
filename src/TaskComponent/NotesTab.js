import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiEdit, FiTrash2, FiX, FiMessageSquare, FiUser, FiCalendar, 
  FiTag, FiSearch, FiEye, FiChevronLeft, FiChevronRight, FiPaperclip, 
  FiAlertCircle, FiFile, FiCheck, FiMic, FiVolume2, FiDownload,
  FiExternalLink, FiImage, FiMusic, FiUpload, FiClock, FiBell
} from 'react-icons/fi';
import axios from 'axios';
import getHeaders from "../utils/get-headers";
import API_BASE_URL from "../utils/api-controller";

const NotesTab = ({ task_id }) => {
    console.log('NotesTab initialized with task_id:', task_id);
    
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        total_pages: 1,
        is_last_page: true
    });
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Updated newNote state to match payload structure
    const [newNote, setNewNote] = useState({
        type: 'text',
        textNotes: [''],
        attachments: [],
        voiceNotes: []
    });
    
    // File upload states
    const [uploadingAttachment, setUploadingAttachment] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const fileInputRef = useRef(null);
    
    // Voice recording states - from client notes
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
    
    // Fetch notes
    const fetchNotes = async (page = 1, search = '') => {
        if (!task_id) {
            setError('Task ID is required');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const headers = getHeaders();
            if (!headers) throw new Error('Authentication failed');
            
            const response = await axios.get(`${API_BASE_URL}/task/details/note/list`, {
                params: { task_id, page_no: page, limit: 20, search },
                headers
            });
            
            if (response.data?.success) {
                const apiNotes = response.data.data.map(note => ({
                    id: note.note_id,
                    note_id: note.note_id,
                    note: note.note,
                    subject: note.subject,
                    author: note.create_by?.name || 'Unknown',
                    priority: note.priority,
                    status: note.status,
                    create_date: note.create_date,
                    type: note.type || 'text',
                    file: note.file || null,
                    attachments: note.attachments || [],
                    formatted_date: new Date(note.create_date).toLocaleDateString(),
                    file_name: note.file ? note.file.split('/').pop() : null
                }));
                
                setNotes(apiNotes);
                setPagination(response.data.pagination || { page: 1, total_pages: 1 });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (task_id) fetchNotes(1, '');
        else setError('Please select a task');
    }, [task_id]);

    // Handle search
    useEffect(() => {
        if (!task_id) return;
        const timer = setTimeout(() => fetchNotes(1, searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Upload file - FIXED to handle WAV files properly
    const uploadFileToServer = async (file) => {
        if (!file) return null;
        
        const headers = getHeaders();
        if (!headers) {
            alert('Missing authentication headers');
            return null;
        }
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            // Add metadata for voice notes
            if (file.type.includes('audio') || file.name.endsWith('.wav')) {
                formData.append('file_type', 'voice_note');
                formData.append('note_type', 'voice');
                formData.append('mime_type', 'audio/wav');
            }
            
            console.log('Uploading file to server:', {
                name: file.name,
                type: file.type,
                size: file.size
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
                    timeout: 60000
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
            alert(`Upload failed: ${error.message}`);
            return null;
        } finally {
            setTimeout(() => {
                setUploadProgress(prev => {
                    const newProgress = { ...prev };
                    delete newProgress[file.name];
                    return newProgress;
                });
            }, 2000);
        }
    };

    // Text note handlers
    const handleTextNoteChange = (index, value) => {
        const updated = [...newNote.textNotes];
        updated[index] = value;
        setNewNote({...newNote, textNotes: updated});
    };

    const addTextNote = () => setNewNote({...newNote, textNotes: [...newNote.textNotes, '']});
    
    const removeTextNote = (index) => {
        if (newNote.textNotes.length > 1) {
            setNewNote({...newNote, textNotes: newNote.textNotes.filter((_, i) => i !== index)});
        }
    };

    // Attachment handlers
    const handleAttachmentFileSelect = async (index, file) => {
        const updated = [...newNote.attachments];
        updated[index] = { ...updated[index], file, name: file.name };
        setNewNote({...newNote, attachments: updated});
        
        setUploadingAttachment(true);
        const url = await uploadFileToServer(file);
        if (url) {
            updated[index].url = url;
            setNewNote({...newNote, attachments: updated});
        }
        setUploadingAttachment(false);
    };

    const addAttachment = () => setNewNote({
        ...newNote, 
        attachments: [...newNote.attachments, { name: '', remark: '', url: '' }]
    });
    
    const removeAttachment = (index) => setNewNote({
        ...newNote, 
        attachments: newNote.attachments.filter((_, i) => i !== index)
    });

    // Convert WebM to WAV - FIXED to handle audio properly
    const convertWebMToWav = async (webmBlob) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const arrayBuffer = await webmBlob.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            
            const numberOfChannels = audioBuffer.numberOfChannels;
            const sampleRate = audioBuffer.sampleRate;
            const length = audioBuffer.length;
            
            // Create WAV header and PCM data
            const wavSize = 44 + length * numberOfChannels * 2;
            const wavBuffer = new ArrayBuffer(wavSize);
            const view = new DataView(wavBuffer);
            
            // Write WAV header
            writeString(view, 0, 'RIFF');
            view.setUint32(4, 36 + length * numberOfChannels * 2, true);
            writeString(view, 8, 'WAVE');
            writeString(view, 12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true); // PCM format
            view.setUint16(22, numberOfChannels, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * numberOfChannels * 2, true);
            view.setUint16(32, numberOfChannels * 2, true);
            view.setUint16(34, 16, true); // 16-bit
            writeString(view, 36, 'data');
            view.setUint32(40, length * numberOfChannels * 2, true);
            
            // Write PCM audio data
            let offset = 44;
            for (let i = 0; i < length; i++) {
                for (let channel = 0; channel < numberOfChannels; channel++) {
                    const sample = audioBuffer.getChannelData(channel)[i];
                    // Convert float to 16-bit PCM
                    const int16 = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
                    view.setInt16(offset, int16, true);
                    offset += 2;
                }
            }
            
            return new Blob([wavBuffer], { type: 'audio/wav' });
            
        } catch (error) {
            console.error('Error converting to WAV:', error);
            throw error;
        }
    };

    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    // Voice recording functions - FIXED to convert to WAV before upload
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
            
            // Use audio/webm for recording (best browser support)
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
            
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };
            
            mediaRecorder.onstop = async () => {
                const webmBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                
                // Set preview URL (use WebM for browser playback)
                const previewUrl = URL.createObjectURL(webmBlob);
                setAudioURL(previewUrl);
                setAudioBlob(webmBlob);
                
                try {
                    // Convert to WAV for upload
                    setUploadingAttachment(true);
                    
                    // Show conversion message
                    const conversionMsg = document.createElement('div');
                    conversionMsg.className = 'text-sm text-purple-600 text-center mb-2';
                    conversionMsg.innerText = 'Converting audio format...';
                    document.getElementById('voice-recording-area')?.appendChild(conversionMsg);
                    
                    const wavBlob = await convertWebMToWav(webmBlob);
                    
                    // Remove conversion message
                    conversionMsg.remove();
                    
                    const timestamp = new Date().getTime();
                    const audioFile = new File([wavBlob], `voice-note-${timestamp}.wav`, { 
                        type: 'audio/wav' 
                    });
                    
                    console.log('Converted to WAV:', {
                        name: audioFile.name,
                        type: audioFile.type,
                        size: audioFile.size
                    });
                    
                    // Upload the WAV file
                    const fileUrl = await uploadFileToServer(audioFile);
                    
                    if (fileUrl) {
                        setNewNote(prev => ({
                            ...prev,
                            voiceNotes: [...prev.voiceNotes, { url: fileUrl }]
                        }));
                        alert('Voice note uploaded successfully!');
                    }
                    
                } catch (error) {
                    console.error('Error processing audio:', error);
                    alert('Failed to process audio. Please try again.');
                } finally {
                    setUploadingAttachment(false);
                }
                
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };
            
            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
            
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Error accessing microphone. Please check permissions.');
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
        }
    };

    // Format recording time - from client notes
    const formatRecordingTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Remove voice note
    const removeVoiceNote = (index) => {
        const updated = newNote.voiceNotes.filter((_, i) => i !== index);
        setNewNote({...newNote, voiceNotes: updated});
        if (updated.length === 0) {
            setAudioBlob(null);
            setAudioURL('');
        }
    };

    // Reset form
    const resetForm = () => {
        setNewNote({
            type: 'text',
            textNotes: [''],
            attachments: [],
            voiceNotes: []
        });
        setAudioBlob(null);
        setAudioURL('');
        setIsRecording(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    // Submit note
    const handleAddNote = async () => {
        if (!task_id) return alert('Task ID required');

        const payload = {
            task_id,
            notes: { text: [], attachments: [], voice: [] }
        };

        if (newNote.type === 'text') {
            payload.notes.text = newNote.textNotes.filter(t => t.trim());
            if (!payload.notes.text.length) return alert('Enter at least one note');
        } else if (newNote.type === 'file') {
            payload.notes.attachments = newNote.attachments
                .filter(a => a.url)
                .map(a => ({ name: a.name, remark: a.remark || '', url: a.url }));
            if (!payload.notes.attachments.length) return alert('Upload at least one file');
        } else if (newNote.type === 'voice') {
            payload.notes.voice = newNote.voiceNotes.map(v => v.url);
            if (!payload.notes.voice.length) return alert('Record at least one voice note');
        }

        console.log('Creating note with payload:', JSON.stringify(payload, null, 2));

        try {
            setSubmitting(true);
            const headers = getHeaders();
            const response = await axios.post(
                `${API_BASE_URL}/task/details/note/create`,
                payload,
                { headers: { ...headers, 'Content-Type': 'application/json' } }
            );
            
            if (response.data?.success) {
                fetchNotes(1, searchTerm);
                setShowAddModal(false);
                resetForm();
                alert('Note created successfully!');
            } else {
                alert(`Failed to create note: ${response.data?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error creating note:', error);
            console.error('Error response:', error.response?.data);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete note
    const deleteNote = async () => {
        if (!selectedNote) return;
        
        try {
            const headers = getHeaders();
            await axios.delete(
                `${API_BASE_URL}/task/details/note/delete/${selectedNote.id}`,
                { headers, data: { task_id } }
            );
            setNotes(notes.filter(n => n.id !== selectedNote.id));
            setShowDeleteModal(false);
        } catch (error) {
            alert('Error deleting note');
        }
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case 'voice': return <FiVolume2 className="w-5 h-5" />;
            case 'file': return <FiFile className="w-5 h-5" />;
            default: return <FiMessageSquare className="w-5 h-5" />;
        }
    };

    const getFileIcon = (fileName) => {
        const ext = fileName?.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <FiImage className="w-5 h-5 text-blue-600" />;
        if (['mp3', 'wav', 'ogg', 'm4a', 'webm'].includes(ext)) return <FiMusic className="w-5 h-5 text-purple-600" />;
        if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) return <FiFile className="w-5 h-5 text-green-600" />;
        return <FiPaperclip className="w-5 h-5 text-gray-600" />;
    };

    const isImageFile = (url) => {
        const ext = url?.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
    };

    const isAudioFile = (url) => {
        const ext = url?.split('.').pop().toLowerCase();
        return ['mp3', 'wav', 'ogg', 'm4a', 'webm'].includes(ext);
    };

    const isPdfFile = (url) => {
        const ext = url?.split('.').pop().toLowerCase();
        return ext === 'pdf';
    };

    // Handle audio playback in view modal
    const handlePlayAudio = (noteId) => {
        if (currentlyPlaying === noteId) {
            if (audioRefs.current[noteId]) {
                audioRefs.current[noteId].pause();
                setCurrentlyPlaying(null);
            }
        } else {
            if (currentlyPlaying && audioRefs.current[currentlyPlaying]) {
                audioRefs.current[currentlyPlaying].pause();
            }
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
            Object.values(audioRefs.current).forEach(audio => {
                if (audio) {
                    audio.pause();
                    audio.src = '';
                }
            });
        };
    }, [audioURL]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Notes</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and track all notes for this task</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow"
                >
                    <FiPlus className="w-4 h-4" />
                    Add Note
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
            </div>

            {/* Loading/Error */}
            {loading && (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                        <FiMessageSquare className="w-5 h-5 text-gray-400 animate-pulse" />
                    </div>
                    <p className="text-gray-600">Loading notes...</p>
                </div>
            )}
            
            {error && !loading && (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                        <FiAlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-red-600 mb-2">{error}</p>
                    <button 
                        onClick={() => fetchNotes(1, '')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Notes List */}
            {!loading && !error && (
                <div className="space-y-3">
                    {notes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                                <FiMessageSquare className="w-5 h-5 text-gray-400" />
                            </div>
                            <p className="text-gray-600 mb-2">No notes found</p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Add your first note
                            </button>
                        </div>
                    ) : (
                        notes.map((note) => (
                            <div 
                                key={note.id} 
                                className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                                onClick={() => { setSelectedNote(note); setShowViewModal(true); }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                                        note.type === 'text' ? 'bg-blue-100' :
                                        note.type === 'file' ? 'bg-green-100' :
                                        'bg-purple-100'
                                    }`}>
                                        <span className={
                                            note.type === 'text' ? 'text-blue-600' :
                                            note.type === 'file' ? 'text-green-600' :
                                            'text-purple-600'
                                        }>
                                            {getTypeIcon(note.type)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-medium text-gray-900 mb-1">
                                                    {note.subject || 'Untitled Note'}
                                                </h3>
                                                {note.type === 'file' && note.file_name && (
                                                    <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                                                        {getFileIcon(note.file_name)}
                                                        <span className="truncate">{note.file_name}</span>
                                                    </div>
                                                )}
                                                {note.type === 'voice' && (
                                                    <div className="flex items-center gap-1.5 text-sm text-purple-600 mb-2">
                                                        <FiVolume2 className="w-4 h-4" />
                                                        <span>Voice recording</span>
                                                    </div>
                                                )}
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {note.note}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setSelectedNote(note); setShowViewModal(true); }} 
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setSelectedNote(note); setShowDeleteModal(true); }} 
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-3 text-xs">
                                            <span className="flex items-center gap-1 text-gray-500">
                                                <FiUser className="w-3.5 h-3.5" />
                                                {note.author}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-500">
                                                <FiCalendar className="w-3.5 h-3.5" />
                                                {note.formatted_date}
                                            </span>
                                            {note.priority && (
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    note.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                    note.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                    {note.priority}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Pagination */}
            {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Page {pagination.page} of {pagination.total_pages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fetchNotes(pagination.page - 1, searchTerm)}
                            disabled={pagination.page === 1}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <FiChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => fetchNotes(pagination.page + 1, searchTerm)}
                            disabled={pagination.is_last_page}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <FiChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* View Note Modal - Updated UI */}
            <AnimatePresence>
                {showViewModal && selectedNote && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={(e) => e.target === e.currentTarget && setShowViewModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
                        >
                            {/* Header */}
                            <div className={`px-6 py-4 border-b ${
                                selectedNote.type === 'text' ? 'bg-blue-50' :
                                selectedNote.type === 'file' ? 'bg-green-50' :
                                'bg-purple-50'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                            selectedNote.type === 'text' ? 'bg-blue-100 text-blue-600' :
                                            selectedNote.type === 'file' ? 'bg-green-100 text-green-600' :
                                            'bg-purple-100 text-purple-600'
                                        }`}>
                                            {getTypeIcon(selectedNote.type)}
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                {selectedNote.subject || 'Note Details'}
                                            </h2>
                                            <p className="text-sm text-gray-600">
                                                {selectedNote.type === 'text' ? 'Text Note' :
                                                 selectedNote.type === 'file' ? 'File Attachment' :
                                                 'Voice Note'} • Added on {selectedNote.formatted_date}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowViewModal(false)}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                {/* Metadata */}
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                        <FiUser className="w-4 h-4" />
                                        {selectedNote.author}
                                    </span>
                                    {selectedNote.priority && (
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                                            selectedNote.priority === 'high' ? 'bg-red-100 text-red-700' :
                                            selectedNote.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            <FiTag className="w-4 h-4" />
                                            {selectedNote.priority} priority
                                        </span>
                                    )}
                                    {selectedNote.status && (
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                                            selectedNote.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            selectedNote.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            <FiClock className="w-4 h-4" />
                                            {selectedNote.status}
                                        </span>
                                    )}
                                </div>

                                {/* Text Content */}
                                {selectedNote.type === 'text' && (
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                            {selectedNote.note}
                                        </p>
                                    </div>
                                )}

                                {/* File Content */}
                                {selectedNote.type === 'file' && selectedNote.file && (
                                    <div className="space-y-4">
                                        {/* Preview */}
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            {isImageFile(selectedNote.file) && (
                                                <div className="space-y-4">
                                                    <img 
                                                        src={selectedNote.file} 
                                                        alt={selectedNote.file_name}
                                                        className="max-w-full max-h-96 mx-auto object-contain rounded-lg"
                                                    />
                                                </div>
                                            )}
                                            
                                            {isPdfFile(selectedNote.file) && (
                                                <iframe 
                                                    src={`${selectedNote.file}#toolbar=0`}
                                                    className="w-full h-96 border-0 rounded-lg"
                                                    title="PDF Preview"
                                                />
                                            )}

                                            {isAudioFile(selectedNote.file) && (
                                                <div className="space-y-4">
                                                    <audio 
                                                        ref={el => audioRefs.current[selectedNote.id] = el}
                                                        controls 
                                                        className="w-full"
                                                        onPlay={() => setCurrentlyPlaying(selectedNote.id)}
                                                        onPause={() => setCurrentlyPlaying(null)}
                                                        onEnded={() => setCurrentlyPlaying(null)}
                                                    >
                                                        <source src={selectedNote.file} />
                                                    </audio>
                                                </div>
                                            )}

                                            {!isImageFile(selectedNote.file) && 
                                             !isPdfFile(selectedNote.file) && 
                                             !isAudioFile(selectedNote.file) && (
                                                <div className="text-center py-8">
                                                    <FiFile className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                                    <p className="text-gray-600">Preview not available</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* File Info & Actions */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                {getFileIcon(selectedNote.file_name)}
                                                <div>
                                                    <p className="font-medium text-gray-900">{selectedNote.file_name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {selectedNote.file_name?.split('.').pop()?.toUpperCase()} file
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <a 
                                                    href={selectedNote.file} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Open in new tab"
                                                >
                                                    <FiExternalLink className="w-4 h-4" />
                                                </a>
                                                <a 
                                                    href={selectedNote.file} 
                                                    download={selectedNote.file_name}
                                                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Download"
                                                >
                                                    <FiDownload className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {selectedNote.note && (
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                                                <p className="text-gray-600">{selectedNote.note}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Voice Content */}
                                {selectedNote.type === 'voice' && selectedNote.file && (
                                    <div className="space-y-4">
                                        <div className="bg-purple-50 rounded-xl p-6">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                                    <FiVolume2 className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">Voice Recording</h3>
                                                    <p className="text-sm text-gray-600">{selectedNote.file_name || 'Voice note'}</p>
                                                </div>
                                            </div>
                                            
                                            <audio 
                                                ref={el => audioRefs.current[selectedNote.id] = el}
                                                controls 
                                                className="w-full mb-4"
                                                onPlay={() => setCurrentlyPlaying(selectedNote.id)}
                                                onPause={() => setCurrentlyPlaying(null)}
                                                onEnded={() => setCurrentlyPlaying(null)}
                                            >
                                                <source src={selectedNote.file} />
                                            </audio>

                                            <div className="flex justify-end gap-2">
                                                <a 
                                                    href={selectedNote.file} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                                                >
                                                    <FiExternalLink className="w-4 h-4" />
                                                </a>
                                                <a 
                                                    href={selectedNote.file} 
                                                    download={selectedNote.file_name || 'voice-note.wav'}
                                                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                >
                                                    <FiDownload className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {selectedNote.note && (
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                                                <p className="text-gray-600">{selectedNote.note}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Note Modal - Updated UI */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="px-6 py-4 border-b bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Add New Note</h2>
                                    <button
                                        onClick={() => {
                                            setShowAddModal(false);
                                            resetForm();
                                        }}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                {/* Note Type Selection */}
                                <div className="flex gap-2 mb-6">
                                    {['text', 'file', 'voice'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setNewNote({...newNote, type})}
                                            className={`flex-1 px-4 py-2.5 rounded-xl border capitalize transition-all duration-200 ${
                                                newNote.type === type 
                                                    ? type === 'text' ? 'bg-blue-600 text-white border-blue-600' :
                                                      type === 'file' ? 'bg-green-600 text-white border-green-600' :
                                                      'bg-purple-600 text-white border-purple-600'
                                                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>

                                {/* Text Notes */}
                                {newNote.type === 'text' && (
                                    <div className="space-y-4">
                                        {newNote.textNotes.map((text, i) => (
                                            <div key={i} className="flex gap-2">
                                                <textarea
                                                    value={text}
                                                    onChange={(e) => handleTextNoteChange(i, e.target.value)}
                                                    className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 min-h-[120px] resize-none"
                                                    placeholder="Enter your note..."
                                                />
                                                {newNote.textNotes.length > 1 && (
                                                    <button 
                                                        onClick={() => removeTextNote(i)} 
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg h-fit transition-colors"
                                                    >
                                                        <FiX className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button 
                                            onClick={addTextNote} 
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                                        >
                                            <FiPlus className="w-4 h-4" />
                                            Add another note
                                        </button>
                                    </div>
                                )}

                                {/* File Attachments */}
                                {newNote.type === 'file' && (
                                    <div className="space-y-4">
                                        {newNote.attachments.map((att, i) => (
                                            <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700">Attachment {i+1}</span>
                                                    <button 
                                                        onClick={() => removeAttachment(i)} 
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <FiX className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                
                                                {/* File Upload */}
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        onChange={(e) => handleAttachmentFileSelect(i, e.target.files[0])}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-500 transition-colors">
                                                        <FiUpload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                                                        <p className="text-sm text-gray-600">
                                                            {att.file ? att.file.name : 'Click to upload file'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* File Name */}
                                                <input
                                                    type="text"
                                                    value={att.name}
                                                    onChange={(e) => {
                                                        const updated = [...newNote.attachments];
                                                        updated[i].name = e.target.value;
                                                        setNewNote({...newNote, attachments: updated});
                                                    }}
                                                    placeholder="File name"
                                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                                />

                                                {/* Remark */}
                                                <input
                                                    type="text"
                                                    value={att.remark}
                                                    onChange={(e) => {
                                                        const updated = [...newNote.attachments];
                                                        updated[i].remark = e.target.value;
                                                        setNewNote({...newNote, attachments: updated});
                                                    }}
                                                    placeholder="Remark (optional)"
                                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                                />

                                                {/* Upload Progress */}
                                                {uploadProgress[att.file?.name] && (
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-600">Uploading...</span>
                                                            <span className="text-blue-600 font-medium">{uploadProgress[att.file.name]}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                            <div 
                                                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                                                style={{ width: `${uploadProgress[att.file.name]}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <button 
                                            onClick={addAttachment} 
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                                        >
                                            <FiPlus className="w-4 h-4" />
                                            Add another attachment
                                        </button>
                                    </div>
                                )}

                                {/* Voice Notes */}
                                {newNote.type === 'voice' && (
                                    <div id="voice-recording-area" className="space-y-4">
                                        {/* Recording Controls */}
                                        {!isRecording && newNote.voiceNotes.length === 0 && (
                                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                                                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-xl flex items-center justify-center">
                                                    <FiMic className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <h4 className="font-medium text-gray-900 mb-2">Record a voice note</h4>
                                                <p className="text-sm text-gray-600 mb-4">Click the button to start recording</p>
                                                <button
                                                    onClick={startRecording}
                                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200 font-medium"
                                                >
                                                    <FiMic className="w-4 h-4" />
                                                    Start Recording
                                                </button>
                                            </div>
                                        )}

                                        {/* Recording in Progress */}
                                        {isRecording && (
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                                                <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-xl flex items-center justify-center animate-pulse">
                                                    <FiMic className="w-6 h-6 text-white" />
                                                </div>
                                                <p className="text-red-600 font-medium mb-2">Recording... {formatRecordingTime(recordingTime)}</p>
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={stopRecording}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        Stop
                                                    </button>
                                                    <button
                                                        onClick={cancelRecording}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Recorded Voice Notes */}
                                        {newNote.voiceNotes.map((voice, i) => (
                                            <div key={i} className="border border-gray-200 rounded-xl p-4">
                                                <div className="flex items-center gap-3">
                                                    <audio controls src={voice.url} className="flex-1" />
                                                    <button
                                                        onClick={() => removeVoiceNote(i)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                                    >
                                                        <FiX className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add Another Button */}
                                        {!isRecording && newNote.voiceNotes.length > 0 && (
                                            <button
                                                onClick={startRecording}
                                                className="text-purple-600 hover:text-purple-700 text-sm font-medium inline-flex items-center gap-1"
                                            >
                                                <FiPlus className="w-4 h-4" />
                                                Record Another Voice Note
                                            </button>
                                        )}

                                        {/* Upload Progress */}
                                        {uploadingAttachment && (
                                            <div className="text-sm text-purple-600 text-center">
                                                Processing and uploading audio...
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddNote}
                                    disabled={submitting || uploadingAttachment || isRecording}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    {submitting ? 'Creating...' : uploadingAttachment ? 'Processing...' : isRecording ? 'Recording...' : 'Create Note'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Modal - Updated UI */}
            <AnimatePresence>
                {showDeleteModal && selectedNote && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b bg-red-50">
                                <h3 className="text-lg font-semibold text-red-600">Delete Note</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 mb-6">
                                    Are you sure you want to delete this note? This action cannot be undone.
                                </p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={deleteNote}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotesTab;