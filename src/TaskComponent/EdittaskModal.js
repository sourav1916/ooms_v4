// components/EditTaskModal.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from 'rsuite';
import { toast } from 'react-hot-toast';
import SearchableSelectStatic from '../components/SearchableSelectStatic';
import getHeaders from '../utils/get-headers';
import API_BASE_URL from '../utils/api-controller';
import {
    FiX,
    FiUser,
    FiUsers,
    FiBriefcase,
    FiCalendar,
    FiDollarSign,
    FiUserCheck,
    FiUserPlus,
    FiFileText,
    FiPaperclip,
    FiMic,
    FiStopCircle,
    FiTrash2,
    FiArrowRight,
    FiArrowLeft,
    FiCheck,
    FiEye,
    FiLayers,
    FiLoader,
    FiSave,
    FiRefreshCw,
    FiSearch
} from 'react-icons/fi';
import 'rsuite/dist/rsuite.min.css';

const EditTaskModal = ({ isOpen, onClose, taskId, onTaskUpdated }) => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('firms-groups');

    // Form Data State
    const [formData, setFormData] = useState({
        firms: [],
        groups: [],
        service: {
            service_id: '',
            fees: '',
            due_date: '',
            has_financial_year: false,
            financial_years: [],
            has_assisment_year: false,
            assisment_years: []
        },
        subtasks: [],
        assignment: {
            staff: [],
            ca: '',
            agent: ''
        },
        notes: {
            text: [],
            attachments: [],
            voice: []
        }
    });

    // UI States
    const [serviceCategories, setServiceCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupsLoading, setGroupsLoading] = useState(false);
    const [assessmentYearsList, setAssessmentYearsList] = useState([]);
    const [financialYearsList, setFinancialYearsList] = useState([]);
    const [fullStaffList, setFullStaffList] = useState([]);
    const [staffLoading, setStaffLoading] = useState(false);

    // Selection States
    const [selectedFirmOptions, setSelectedFirmOptions] = useState([]);
    const [selectedGroupOptions, setSelectedGroupOptions] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);

    // Search States
    const [firmSearchQuery, setFirmSearchQuery] = useState('');
    const [firmSearchResults, setFirmSearchResults] = useState([]);
    const [firmSearchLoading, setFirmSearchLoading] = useState(false);
    const [caSearchQuery, setCaSearchQuery] = useState('');
    const [caSearchResults, setCaSearchResults] = useState([]);
    const [caSearchLoading, setCaSearchLoading] = useState(false);
    const [agentSearchQuery, setAgentSearchQuery] = useState('');
    const [agentSearchResults, setAgentSearchResults] = useState([]);
    const [agentSearchLoading, setAgentSearchLoading] = useState(false);
    const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');

    // Display States for selected items
    const [selectedCaDisplay, setSelectedCaDisplay] = useState(null);
    const [selectedAgentDisplay, setSelectedAgentDisplay] = useState(null);

    // Notes States
    const [voiceNotesList, setVoiceNotesList] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recordingIntervalRef = useRef(null);
    const recordingTimeRef = useRef(0);
    const fileInputRef = useRef(null);
    const [attachedFiles, setAttachedFiles] = useState([]);

    // Abort controllers for search
    const firmSearchAbortRef = useRef(null);
    const caSearchAbortRef = useRef(null);
    const agentSearchAbortRef = useRef(null);

    // Tabs configuration
    const tabs = [
        { id: 'firms-groups', label: 'Firms & Groups', icon: FiUsers },
        { id: 'services', label: 'Services', icon: FiBriefcase },
        { id: 'subtasks', label: 'Sub Tasks', icon: FiFileText },
        { id: 'team', label: 'Team', icon: FiUserCheck },
        { id: 'notes', label: 'Notes', icon: FiPaperclip }
    ];

    // Fetch initial data
    useEffect(() => {
        if (isOpen && taskId) {
            fetchTaskDetails();
            fetchServiceCategories();
            fetchServices();
            fetchAllGroups();
            fetchYears();
            fetchAllStaff();
        }
    }, [isOpen, taskId]);

    // Filter services when category changes
    useEffect(() => {
        if (formData.service?.service_category) {
            const filtered = services.filter(service => 
                service.category_id === formData.service.service_category
            );
            setFilteredServices(filtered);
        } else {
            setFilteredServices(services);
        }
    }, [formData.service?.service_category, services]);

    // Filter available employees based on search
    const filteredAvailableEmployees = React.useMemo(() => {
        const q = (employeeSearchQuery || '').trim().toLowerCase();
        if (!q) return allEmployees;
        return allEmployees.filter((emp) => {
            const name = (emp.name || '').toLowerCase();
            const mobile = (emp.mobile || '').toLowerCase();
            const email = (emp.email || '').toLowerCase();
            const dept = (emp.department || '').toLowerCase();
            return name.includes(q) || mobile.includes(q) || email.includes(q) || dept.includes(q);
        });
    }, [allEmployees, employeeSearchQuery]);

    // Fetch task details
    const fetchTaskDetails = async () => {
        setLoading(true);
        try {
            const headers = await getHeaders();
            const response = await fetch(`${API_BASE_URL}/task/edit/${taskId}`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                throw new Error('Failed to fetch task details');
            }

            const responseData = await response.json();
            if (responseData.success && responseData.data) {
                const taskData = responseData.data;
                setFormData(taskData);

                // Initialize selection states
                if (taskData.firms && Array.isArray(taskData.firms)) {
                    const firmOptions = taskData.firms.map(firm => ({
                        value: firm.firm_id,
                        label: firm.firm_name || firm.name,
                        __firm: firm
                    }));
                    setSelectedFirmOptions(firmOptions);
                }

                if (taskData.groups && Array.isArray(taskData.groups)) {
                    const groupOptions = taskData.groups.map(group => ({
                        value: group.group_id,
                        label: group.name,
                        firm_count: group.firm_count || 0
                    }));
                    setSelectedGroupOptions(groupOptions);
                }

                if (taskData.assignment?.staff && Array.isArray(taskData.assignment.staff)) {
                    const staffList = taskData.assignment.staff.map(username => ({
                        username,
                        name: username
                    }));
                    setSelectedEmployees(staffList);
                }

                if (taskData.assignment?.ca) {
                    setSelectedCaDisplay({ username: taskData.assignment.ca, name: taskData.assignment.ca });
                }

                if (taskData.assignment?.agent) {
                    setSelectedAgentDisplay({ username: taskData.assignment.agent, name: taskData.assignment.agent });
                }

                // Handle attachments
                if (taskData.notes?.attachments && Array.isArray(taskData.notes.attachments)) {
                    const mappedAttachments = taskData.notes.attachments.map(att => ({
                        id: Math.random().toString(36).substr(2, 9),
                        name: att.name || '',
                        remark: att.remark || '',
                        url: att.url,
                        uploading: false,
                        previewUrl: att.url
                    }));
                    setAttachedFiles(mappedAttachments);
                }

                // Handle voice notes
                if (taskData.notes?.voice && Array.isArray(taskData.notes.voice)) {
                    const mappedVoice = taskData.notes.voice.map(url => ({
                        id: Math.random().toString(36).substr(2, 9),
                        url,
                        uploading: false,
                        duration: 0
                    }));
                    setVoiceNotesList(mappedVoice);
                }
            }
        } catch (error) {
            console.error('Error fetching task details:', error);
            toast.error('Failed to load task details');
        } finally {
            setLoading(false);
        }
    };

    // Fetch service categories
    const fetchServiceCategories = async () => {
        const headers = await getHeaders();
        if (!headers) return;
        try {
            const res = await axios.get(`${API_BASE_URL}/service/category/list`, { headers });
            if (res.data?.success && Array.isArray(res.data.data)) {
                setServiceCategories(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch service categories:', err);
        }
    };

    // Fetch services
    const fetchServices = async () => {
        const headers = await getHeaders();
        if (!headers) return;
        try {
            const res = await axios.get(`${API_BASE_URL}/service/list`, { headers });
            if (res.data?.success && Array.isArray(res.data.data)) {
                setServices(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch services:', err);
        }
    };

    // Fetch all groups
    const fetchAllGroups = async () => {
        setGroupsLoading(true);
        const all = [];
        let page = 1;
        const limit = 100;
        const base = API_BASE_URL.replace(/\/$/, '');
        try {
            for (; ;) {
                const url = `${base}/group/list?search=&page=${page}&limit=${limit}`;
                const res = await fetch(url, { headers: await getHeaders() });
                const data = await res.json();
                const list = data?.data && Array.isArray(data.data) ? data.data : [];
                all.push(...list);
                const pagination = data?.pagination;
                if (pagination?.is_last_page) break;
                page += 1;
            }
            setGroups(all);
        } catch (err) {
            console.error('Failed to fetch groups:', err);
        } finally {
            setGroupsLoading(false);
        }
    };

    // Fetch years
    const fetchYears = async () => {
        const headers = await getHeaders();
        if (!headers) return;
        const base = API_BASE_URL.replace(/\/$/, '');
        try {
            const [ayRes, fyRes] = await Promise.all([
                fetch(`${base}/utils/assisment-years`, { headers }).then(r => r.json()),
                fetch(`${base}/utils/financial-years`, { headers }).then(r => r.json())
            ]);
            if (ayRes?.success && Array.isArray(ayRes.data)) setAssessmentYearsList(ayRes.data);
            if (fyRes?.success && Array.isArray(fyRes.data)) setFinancialYearsList(fyRes.data);
        } catch (err) {
            console.error('Failed to fetch years:', err);
        }
    };

    // Fetch all staff
    const fetchAllStaff = async () => {
        setStaffLoading(true);
        const all = [];
        let page = 1;
        const limit = 100;
        const base = API_BASE_URL.replace(/\/$/, '');
        const headers = await getHeaders();
        if (!headers) {
            setStaffLoading(false);
            return;
        }
        try {
            for (; ;) {
                const url = `${base}/settings/staff/list?search=&page=${page}&limit=${limit}`;
                const res = await fetch(url, { headers });
                const json = await res.json();
                const list = json?.data && Array.isArray(json.data) ? json.data : [];
                all.push(...list);
                const meta = json?.meta;
                if (meta?.is_last_page) break;
                page += 1;
            }
            const mapped = all.map((item) => ({
                username: item.username,
                name: item.profile?.name ?? item.username,
                mobile: item.profile?.mobile ?? '',
                email: item.profile?.email ?? '',
                department: item.designation ?? ''
            }));
            setFullStaffList(mapped);
            setAllEmployees(mapped);
        } catch (err) {
            console.error('Failed to fetch staff list:', err);
        } finally {
            setStaffLoading(false);
        }
    };

    // Firm search
    useEffect(() => {
        const term = (firmSearchQuery || '').trim();
        if (term.length < 3) {
            setFirmSearchResults([]);
            setFirmSearchLoading(false);
            return;
        }
        const t = setTimeout(async () => {
            setFirmSearchLoading(true);
            firmSearchAbortRef.current?.abort();
            const controller = new AbortController();
            firmSearchAbortRef.current = controller;
            try {
                const url = `${API_BASE_URL.replace(/\/$/, '')}/firm/search?search=${encodeURIComponent(term)}`;
                const res = await fetch(url, { headers: await getHeaders(), signal: controller.signal });
                const data = await res.json();
                const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
                const options = list.map(f => ({
                    value: f.firm_id,
                    label: f.client ? `${f.firm_name} – ${f.client.name}` : (f.firm_name || ''),
                    __firm: f
                }));
                setFirmSearchResults(options);
            } catch (err) {
                if (err?.name !== 'AbortError') setFirmSearchResults([]);
            } finally {
                setFirmSearchLoading(false);
            }
        }, 400);
        return () => {
            clearTimeout(t);
            firmSearchAbortRef.current?.abort();
        };
    }, [firmSearchQuery]);

    // CA search
    useEffect(() => {
        const term = (caSearchQuery || '').trim();
        if (term.length < 3) {
            setCaSearchResults([]);
            setCaSearchLoading(false);
            return;
        }
        const t = setTimeout(async () => {
            setCaSearchLoading(true);
            caSearchAbortRef.current?.abort();
            const controller = new AbortController();
            caSearchAbortRef.current = controller;
            try {
                const url = `${API_BASE_URL.replace(/\/$/, '')}/ca/search?search=${encodeURIComponent(term)}`;
                const res = await fetch(url, { headers: await getHeaders(), signal: controller.signal });
                const data = await res.json();
                const list = Array.isArray(data?.data) ? data.data : [];
                setCaSearchResults(list);
            } catch (err) {
                if (err?.name !== 'AbortError') setCaSearchResults([]);
            } finally {
                setCaSearchLoading(false);
            }
        }, 400);
        return () => {
            clearTimeout(t);
            caSearchAbortRef.current?.abort();
        };
    }, [caSearchQuery]);

    // Agent search
    useEffect(() => {
        const term = (agentSearchQuery || '').trim();
        if (term.length < 3) {
            setAgentSearchResults([]);
            setAgentSearchLoading(false);
            return;
        }
        const t = setTimeout(async () => {
            setAgentSearchLoading(true);
            agentSearchAbortRef.current?.abort();
            const controller = new AbortController();
            agentSearchAbortRef.current = controller;
            try {
                const url = `${API_BASE_URL.replace(/\/$/, '')}/agent/search?search=${encodeURIComponent(term)}`;
                const res = await fetch(url, { headers: await getHeaders(), signal: controller.signal });
                const data = await res.json();
                const list = Array.isArray(data?.data) ? data.data : [];
                setAgentSearchResults(list);
            } catch (err) {
                if (err?.name !== 'AbortError') setAgentSearchResults([]);
            } finally {
                setAgentSearchLoading(false);
            }
        }, 400);
        return () => {
            clearTimeout(t);
            agentSearchAbortRef.current?.abort();
        };
    }, [agentSearchQuery]);

    // Group options
    const groupOptions = groups.map(group => ({
        value: group.group_id,
        label: group.remark ? `${group.name} – ${group.remark}` : group.name,
        firm_count: group.firm_count ?? 0
    }));

    // Service options
    const serviceCategoryOptions = [
        { category_id: '', name: 'All Categories' },
        ...(serviceCategories.map(c => ({ category_id: c.category_id, name: c.name })))
    ];

    const mainServiceOptions = [
        { service_id: '', name: 'Select service...' },
        ...(filteredServices.map(s => ({ 
            service_id: s.service_id, 
            name: `${s.name} - ₹${s.fees || 0}` 
        })))
    ];

    // Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('service.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                service: {
                    ...prev.service,
                    [field]: value
                }
            }));
        }
    };

    const handleServiceSelect = (name, value) => {
        if (name === 'service_category') {
            setFormData(prev => ({
                ...prev,
                service: {
                    ...prev.service,
                    service_category: value,
                    service_id: ''
                }
            }));
        } else if (name === 'service_id') {
            const selectedService = services.find(s => String(s.service_id) === String(value));
            setFormData(prev => ({
                ...prev,
                service: {
                    ...prev.service,
                    service_id: value,
                    fees: selectedService?.fees || prev.service.fees,
                    service_category: selectedService?.category_id || prev.service.service_category
                }
            }));
        }
    };

    const handleToggleAY = () => {
        setFormData(prev => ({
            ...prev,
            service: {
                ...prev.service,
                has_assisment_year: !prev.service.has_assisment_year,
                assisment_years: !prev.service.has_assisment_year ? [] : prev.service.assisment_years
            }
        }));
    };

    const handleToggleFY = () => {
        setFormData(prev => ({
            ...prev,
            service: {
                ...prev.service,
                has_financial_year: !prev.service.has_financial_year,
                financial_years: !prev.service.has_financial_year ? [] : prev.service.financial_years
            }
        }));
    };

    const toggleAssessmentYear = (year) => {
        setFormData(prev => {
            const current = [...(prev.service.assisment_years || [])];
            const idx = current.indexOf(year);
            if (idx >= 0) current.splice(idx, 1);
            else current.push(year);
            return {
                ...prev,
                service: {
                    ...prev.service,
                    assisment_years: current
                }
            };
        });
    };

    const toggleFinancialYear = (year) => {
        setFormData(prev => {
            const current = [...(prev.service.financial_years || [])];
            const idx = current.indexOf(year);
            if (idx >= 0) current.splice(idx, 1);
            else current.push(year);
            return {
                ...prev,
                service: {
                    ...prev.service,
                    financial_years: current
                }
            };
        });
    };

    // Firm handlers
    const addFirm = (option) => {
        if (selectedFirmOptions.some(o => o.value === option.value)) return;
        const next = [...selectedFirmOptions, option];
        setSelectedFirmOptions(next);
        setFormData(prev => ({ 
            ...prev, 
            firms: next.map(o => o.__firm || { firm_id: o.value, firm_name: o.label })
        }));
    };

    const removeFirm = (option) => {
        const next = selectedFirmOptions.filter(o => o.value !== option.value);
        setSelectedFirmOptions(next);
        setFormData(prev => ({ 
            ...prev, 
            firms: next.map(o => o.__firm || { firm_id: o.value, firm_name: o.label })
        }));
    };

    const addAllFirmsFromResults = () => {
        const ids = new Set(selectedFirmOptions.map(o => o.value));
        const toAdd = firmSearchResults.filter(o => !ids.has(o.value));
        if (toAdd.length === 0) return;
        const next = [...selectedFirmOptions, ...toAdd];
        setSelectedFirmOptions(next);
        setFormData(prev => ({ 
            ...prev, 
            firms: next.map(o => o.__firm || { firm_id: o.value, firm_name: o.label })
        }));
    };

    const removeAllFirms = () => {
        setSelectedFirmOptions([]);
        setFormData(prev => ({ ...prev, firms: [] }));
    };

    // Group handlers
    const addGroup = (option) => {
        if (option.firm_count === 0) return;
        if (selectedGroupOptions.some(o => o.value === option.value)) return;
        const next = [...selectedGroupOptions, option];
        setSelectedGroupOptions(next);
        setFormData(prev => ({ 
            ...prev, 
            groups: next.map(o => ({ group_id: o.value, name: o.label }))
        }));
    };

    const removeGroup = (option) => {
        const next = selectedGroupOptions.filter(o => o.value !== option.value);
        setSelectedGroupOptions(next);
        setFormData(prev => ({ 
            ...prev, 
            groups: next.map(o => ({ group_id: o.value, name: o.label }))
        }));
    };

    // Employee handlers
    const addEmployee = (employee) => {
        setSelectedEmployees(prev => [...prev, employee]);
        setAllEmployees(prev => prev.filter(emp => emp.username !== employee.username));
        setFormData(prev => ({
            ...prev,
            assignment: {
                ...prev.assignment,
                staff: [...(prev.assignment.staff || []), employee.username]
            }
        }));
    };

    const removeEmployee = (employee) => {
        setAllEmployees(prev => [...prev, employee]);
        setSelectedEmployees(prev => prev.filter(emp => emp.username !== employee.username));
        setFormData(prev => ({
            ...prev,
            assignment: {
                ...prev.assignment,
                staff: (prev.assignment.staff || []).filter(username => username !== employee.username)
            }
        }));
    };

    const addAllEmployees = () => {
        const toAdd = filteredAvailableEmployees;
        setSelectedEmployees(prev => [...prev, ...toAdd]);
        setFormData(prev => ({
            ...prev,
            assignment: {
                ...prev.assignment,
                staff: [...(prev.assignment.staff || []), ...toAdd.map(emp => emp.username)]
            }
        }));
        setAllEmployees(prev => prev.filter(emp => !toAdd.some(e => e.username === emp.username)));
    };

    const removeAllEmployees = () => {
        setAllEmployees(prev => [...prev, ...selectedEmployees]);
        setFormData(prev => ({
            ...prev,
            assignment: {
                ...prev.assignment,
                staff: []
            }
        }));
        setSelectedEmployees([]);
    };

    // Date handlers - Fixed for YYYY-MM-DD format
    const parseDueDate = (str) => {
        if (!str || typeof str !== 'string') return null;
        // Handle YYYY-MM-DD format
        const parts = str.split('-');
        if (parts.length === 3) {
            const [y, m, d] = parts;
            return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        }
        return null;
    };

    const formatDueDateForDisplay = (dateStr) => {
        if (!dateStr) return null;
        // If it's already in YYYY-MM-DD format, parse it
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const [y, m, d] = parts;
            return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        }
        return null;
    };

    const handleDueDateChange = (date) => {
        if (date) {
            // Format to YYYY-MM-DD for API
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${y}-${m}-${d}`;
            
            setFormData(prev => ({
                ...prev,
                service: {
                    ...prev.service,
                    due_date: formattedDate
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                service: {
                    ...prev.service,
                    due_date: ''
                }
            }));
        }
    };

    // Submit handler
    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const headers = await getHeaders();
            
            // Prepare payload - ensure due_date is in YYYY-MM-DD format
            const payload = {
                firms: (formData.firms || []).map(f => f.firm_id),
                groups: (formData.groups || []).map(g => g.group_id),
                service: {
                    service_id: formData.service.service_id,
                    fees: parseFloat(formData.service.fees) || 0,
                    due_date: formData.service.due_date, // Already in YYYY-MM-DD format
                    has_financial_year: formData.service.has_financial_year || false,
                    financial_years: formData.service.financial_years || [],
                    has_assisment_year: formData.service.has_assisment_year || false,
                    assisment_years: formData.service.assisment_years || []
                },
                subtasks: formData.subtasks || [],
                assignment: {
                    staff: formData.assignment.staff || [],
                    ca: formData.assignment.ca || '',
                    agent: formData.assignment.agent || ''
                },
                notes: {
                    text: formData.notes.text || [],
                    attachments: attachedFiles
                        .filter(a => a.url && a.name)
                        .map(a => ({
                            name: a.name,
                            remark: a.remark || '',
                            url: a.url
                        })),
                    voice: voiceNotesList
                        .filter(v => v.url)
                        .map(v => v.url)
                }
            };

            console.log('Submitting payload:', payload); // Debug log

            const response = await fetch(`${API_BASE_URL}/task/edit/${taskId}`, {
                method: 'PUT',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();
            
            if (responseData.success) {
                toast.success('Task updated successfully');
                onTaskUpdated?.();
                onClose();
            } else {
                throw new Error(responseData.message || 'Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error(error.message || 'Failed to update task');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <FiBriefcase className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Edit Task</h2>
                                <p className="text-indigo-100 text-sm">Task ID: {taskId}</p>
                            </div>
                        </div>
                        <motion.button
                            onClick={onClose}
                            className="text-white hover:text-indigo-200 transition-colors p-2 rounded-lg hover:bg-white/10"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiX className="w-6 h-6" />
                        </motion.button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 px-6 bg-gray-50">
                        <div className="flex gap-1 overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                            activeTab === tab.id
                                                ? 'border-indigo-600 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <FiLoader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                                    <p className="text-gray-600">Loading task details...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Firms & Groups Tab */}
                                {activeTab === 'firms-groups' && (
                                    <div className="space-y-6">
                                        {/* Firms */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                <FiUser className="w-4 h-4 text-indigo-600" />
                                                Firms
                                            </label>
                                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                                                <div className="lg:col-span-2 min-w-0">
                                                    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex flex-col h-72">
                                                        <div className="p-3 border-b border-gray-200 bg-white">
                                                            <div className="relative">
                                                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                <input
                                                                    type="text"
                                                                    value={firmSearchQuery}
                                                                    onChange={(e) => setFirmSearchQuery(e.target.value)}
                                                                    placeholder="Search firms (min 3 characters)..."
                                                                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1.5">Type to search, then click to add</p>
                                                        </div>
                                                        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                                                            {firmSearchLoading && (
                                                                <div className="text-center text-gray-500 text-sm py-6">Searching...</div>
                                                            )}
                                                            {!firmSearchLoading && firmSearchQuery.trim().length < 3 && (
                                                                <div className="text-center text-gray-400 text-sm py-6">Type at least 3 characters</div>
                                                            )}
                                                            {!firmSearchLoading && firmSearchQuery.trim().length >= 3 && 
                                                                firmSearchResults.filter(f => !selectedFirmOptions.some(s => s.value === f.value)).length === 0 && (
                                                                <div className="text-center text-gray-400 text-sm py-6">No firms found</div>
                                                            )}
                                                            {!firmSearchLoading && firmSearchResults
                                                                .filter(f => !selectedFirmOptions.some(s => s.value === f.value))
                                                                .map((opt) => {
                                                                    const f = opt.__firm;
                                                                    const c = f?.client || {};
                                                                    return (
                                                                        <div
                                                                            key={opt.value}
                                                                            onClick={() => addFirm(opt)}
                                                                            className="p-2.5 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                                                                        >
                                                                            <div className="font-medium text-sm text-gray-900 truncate">{f?.firm_name || opt.label}</div>
                                                                            {c.name && <div className="text-xs text-gray-600 truncate">{c.name}</div>}
                                                                            <div className="flex flex-wrap gap-x-2 mt-0.5 text-xs text-gray-500">
                                                                                {(f?.pan_no || c.pan_number) && <span>PAN: {f?.pan_no || c.pan_number}</span>}
                                                                                {f?.branch_id && <span>Branch: {f.branch_id}</span>}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="lg:col-span-1 flex lg:flex-col justify-center items-center gap-2 lg:gap-3">
                                                    <motion.button
                                                        type="button"
                                                        onClick={addAllFirmsFromResults}
                                                        disabled={firmSearchResults.filter(f => !selectedFirmOptions.some(s => s.value === f.value)).length === 0}
                                                        className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FiArrowRight className="w-4 h-4" />
                                                    </motion.button>
                                                    <motion.button
                                                        type="button"
                                                        onClick={removeAllFirms}
                                                        disabled={selectedFirmOptions.length === 0}
                                                        className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FiArrowLeft className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                                <div className="lg:col-span-2 min-w-0">
                                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 h-72 overflow-hidden flex flex-col">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm font-medium text-gray-700">Selected Firms</span>
                                                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">{selectedFirmOptions.length}</span>
                                                        </div>
                                                        <div className="flex-1 overflow-y-auto space-y-1.5">
                                                            {selectedFirmOptions.map((opt) => {
                                                                const f = opt.__firm;
                                                                const c = f?.client || {};
                                                                return (
                                                                    <div
                                                                        key={opt.value}
                                                                        onClick={() => removeFirm(opt)}
                                                                        className="p-2.5 bg-white border border-indigo-200 rounded-lg cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors"
                                                                    >
                                                                        <div className="font-medium text-sm text-gray-900 truncate">{f?.firm_name || opt.label}</div>
                                                                        {c.name && <div className="text-xs text-gray-600 truncate">{c.name}</div>}
                                                                    </div>
                                                                );
                                                            })}
                                                            {selectedFirmOptions.length === 0 && (
                                                                <div className="text-center text-gray-400 text-sm py-8">No firms selected</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Groups */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                <FiUsers className="w-4 h-4 text-indigo-600" />
                                                Groups
                                            </label>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                                <div className="min-w-0">
                                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 h-72 overflow-hidden flex flex-col">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h3 className="text-sm font-medium text-gray-700">Available Groups</h3>
                                                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                                                                {groupOptions.filter(g => !selectedGroupOptions.some(s => s.value === g.value)).length}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 overflow-y-auto space-y-1.5">
                                                            {groupsLoading && (
                                                                <div className="text-center text-gray-500 text-sm py-6">Loading...</div>
                                                            )}
                                                            {!groupsLoading && groupOptions
                                                                .filter(g => !selectedGroupOptions.some(s => s.value === g.value))
                                                                .map((opt) => (
                                                                    <div
                                                                        key={opt.value}
                                                                        onClick={() => addGroup(opt)}
                                                                        className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${
                                                                            opt.firm_count === 0
                                                                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                                                                : 'bg-white border-gray-200 hover:bg-indigo-50 hover:border-indigo-200'
                                                                        }`}
                                                                    >
                                                                        <div className="font-medium text-sm text-gray-800 truncate">{opt.label}</div>
                                                                        <span className="text-xs text-gray-500">{opt.firm_count ?? 0} firm{(opt.firm_count ?? 0) !== 1 ? 's' : ''}</span>
                                                                    </div>
                                                                ))}
                                                            {!groupsLoading && groupOptions.filter(g => !selectedGroupOptions.some(s => s.value === g.value)).length === 0 && (
                                                                <div className="text-center text-gray-400 text-sm py-8">No groups available</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 h-72 overflow-hidden flex flex-col">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm font-medium text-gray-700">Selected Groups</span>
                                                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">{selectedGroupOptions.length}</span>
                                                        </div>
                                                        <div className="flex-1 overflow-y-auto space-y-1.5">
                                                            {selectedGroupOptions.map((opt) => (
                                                                <div
                                                                    key={opt.value}
                                                                    onClick={() => removeGroup(opt)}
                                                                    className="p-2.5 bg-white border border-indigo-200 rounded-lg cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors"
                                                                >
                                                                    <div className="font-medium text-sm text-gray-800 truncate">{opt.label}</div>
                                                                    <span className="text-xs text-gray-500">{opt.firm_count ?? 0} firm{(opt.firm_count ?? 0) !== 1 ? 's' : ''}</span>
                                                                </div>
                                                            ))}
                                                            {selectedGroupOptions.length === 0 && (
                                                                <div className="text-center text-gray-400 text-sm py-8">No groups selected</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Services Tab */}
                                {activeTab === 'services' && (
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Service Category</label>
                                                <SearchableSelectStatic
                                                    options={serviceCategoryOptions}
                                                    value={formData.service?.service_category || ''}
                                                    onChange={(val) => handleServiceSelect('service_category', val)}
                                                    placeholder="All Categories"
                                                    labelKey="name"
                                                    valueKey="category_id"
                                                    leftIcon={<FiLayers className="text-base" />}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Service <span className="text-red-500">*</span>
                                                </label>
                                                <SearchableSelectStatic
                                                    options={mainServiceOptions}
                                                    value={formData.service?.service_id || ''}
                                                    onChange={(val) => handleServiceSelect('service_id', val)}
                                                    placeholder="Select service..."
                                                    labelKey="name"
                                                    valueKey="service_id"
                                                    leftIcon={<FiBriefcase className="text-base" />}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Fees (₹) <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
                                                    <input
                                                        type="number"
                                                        name="service.fees"
                                                        value={formData.service?.fees || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-12 pr-3 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                                        placeholder="Enter amount"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Due Date <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative [&_.rs-picker]:w-full">
                                                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10 pointer-events-none w-4 h-4" />
                                                    <DatePicker
                                                        value={formData.service?.due_date ? formatDueDateForDisplay(formData.service.due_date) : null}
                                                        onChange={handleDueDateChange}
                                                        format="dd/MM/yyyy"
                                                        placeholder="Select due date"
                                                        oneTap
                                                        editable={false}
                                                        cleanable
                                                        className="w-full"
                                                        style={{ width: '100%' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Year toggles */}
                                        <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3">
                                            <p className="text-sm font-semibold text-gray-900 mb-2">Applicable for</p>
                                            <div className="flex flex-wrap gap-6">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        role="switch"
                                                        aria-checked={formData.service?.has_assisment_year}
                                                        onClick={handleToggleAY}
                                                        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                                            formData.service?.has_assisment_year ? 'bg-indigo-600' : 'bg-gray-200'
                                                        }`}
                                                    >
                                                        <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition ${
                                                            formData.service?.has_assisment_year ? 'translate-x-5' : 'translate-x-0.5'
                                                        }`} />
                                                    </button>
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-900">Assessment Year (AY)</span>
                                                        <p className="text-xs text-gray-500">Applicable for assessment year</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        role="switch"
                                                        aria-checked={formData.service?.has_financial_year}
                                                        onClick={handleToggleFY}
                                                        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                                            formData.service?.has_financial_year ? 'bg-indigo-600' : 'bg-gray-200'
                                                        }`}
                                                    >
                                                        <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition ${
                                                            formData.service?.has_financial_year ? 'translate-x-5' : 'translate-x-0.5'
                                                        }`} />
                                                    </button>
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-900">Financial Year (FY)</span>
                                                        <p className="text-xs text-gray-500">Applicable for financial year</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {formData.service?.has_assisment_year && (
                                            <div className="space-y-3">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Assessment Years (AY) <span className="text-red-500">*</span>
                                                </label>
                                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                                    <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2">
                                                        {assessmentYearsList.map((year) => (
                                                            <motion.button
                                                                key={year}
                                                                type="button"
                                                                onClick={() => toggleAssessmentYear(year)}
                                                                className={`p-3 text-sm font-medium rounded-lg border transition-all ${
                                                                    formData.service?.assisment_years?.includes(year)
                                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                                                }`}
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                            >
                                                                AY {year}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {formData.service?.has_financial_year && (
                                            <div className="space-y-3">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Financial Years (FY) <span className="text-red-500">*</span>
                                                </label>
                                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                                    <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2">
                                                        {financialYearsList.map((year) => (
                                                            <motion.button
                                                                key={year}
                                                                type="button"
                                                                onClick={() => toggleFinancialYear(year)}
                                                                className={`p-3 text-sm font-medium rounded-lg border transition-all ${
                                                                    formData.service?.financial_years?.includes(year)
                                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                                                }`}
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                            >
                                                                FY {year}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Team Tab */}
                                {activeTab === 'team' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* CA */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">CA</label>
                                                <div className="relative flex items-center w-full bg-white border border-gray-300 rounded-xl overflow-visible focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 min-h-[42px]">
                                                    <FiUserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 shrink-0 pointer-events-none z-10" />
                                                    {formData.assignment?.ca ? (
                                                        <>
                                                            <span className="flex-1 pl-9 pr-9 py-2.5 text-sm text-gray-900 truncate">
                                                                {selectedCaDisplay?.name ?? formData.assignment.ca}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        assignment: { ...prev.assignment, ca: '' }
                                                                    }));
                                                                    setSelectedCaDisplay(null);
                                                                }}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                                title="Clear"
                                                            >
                                                                <FiX className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <input
                                                                type="text"
                                                                value={caSearchQuery}
                                                                onChange={(e) => setCaSearchQuery(e.target.value)}
                                                                placeholder="Search CA (min 3 characters)..."
                                                                className="flex-1 min-w-0 pl-9 pr-3 py-2.5 text-sm border-0 bg-transparent focus:ring-0 focus:outline-none placeholder-gray-400"
                                                            />
                                                            {caSearchQuery.trim().length >= 3 && (
                                                                <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                                                                    {caSearchLoading && <div className="p-3 text-sm text-gray-500">Searching...</div>}
                                                                    {!caSearchLoading && caSearchResults.length === 0 && <div className="p-3 text-sm text-gray-500">No results</div>}
                                                                    {!caSearchLoading && caSearchResults.map((item) => (
                                                                        <button
                                                                            key={item.username}
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setFormData(prev => ({
                                                                                    ...prev,
                                                                                    assignment: { ...prev.assignment, ca: item.username }
                                                                                }));
                                                                                setSelectedCaDisplay({ username: item.username, name: item.name });
                                                                                setCaSearchQuery('');
                                                                                setCaSearchResults([]);
                                                                            }}
                                                                            className="w-full px-3 py-2.5 text-left text-sm hover:bg-indigo-50 flex flex-col border-b border-gray-100 last:border-0"
                                                                        >
                                                                            <span className="font-medium text-gray-900">{item.name}</span>
                                                                            {(item.mobile || item.email) && (
                                                                                <span className="text-xs text-gray-500">
                                                                                    {[item.mobile, item.email].filter(Boolean).join(' · ')}
                                                                                </span>
                                                                            )}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {caSearchQuery.trim().length > 0 && caSearchQuery.trim().length < 3 && (
                                                                <p className="absolute left-9 top-full mt-0.5 text-xs text-gray-500">Type at least 3 characters</p>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Agent */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">Agent</label>
                                                <div className="relative flex items-center w-full bg-white border border-gray-300 rounded-xl overflow-visible focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 min-h-[42px]">
                                                    <FiUserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 shrink-0 pointer-events-none z-10" />
                                                    {formData.assignment?.agent ? (
                                                        <>
                                                            <span className="flex-1 pl-9 pr-9 py-2.5 text-sm text-gray-900 truncate">
                                                                {selectedAgentDisplay?.name ?? formData.assignment.agent}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        assignment: { ...prev.assignment, agent: '' }
                                                                    }));
                                                                    setSelectedAgentDisplay(null);
                                                                }}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                                title="Clear"
                                                            >
                                                                <FiX className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <input
                                                                type="text"
                                                                value={agentSearchQuery}
                                                                onChange={(e) => setAgentSearchQuery(e.target.value)}
                                                                placeholder="Search Agent (min 3 characters)..."
                                                                className="flex-1 min-w-0 pl-9 pr-3 py-2.5 text-sm border-0 bg-transparent focus:ring-0 focus:outline-none placeholder-gray-400"
                                                            />
                                                            {agentSearchQuery.trim().length >= 3 && (
                                                                <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                                                                    {agentSearchLoading && <div className="p-3 text-sm text-gray-500">Searching...</div>}
                                                                    {!agentSearchLoading && agentSearchResults.length === 0 && <div className="p-3 text-sm text-gray-500">No results</div>}
                                                                    {!agentSearchLoading && agentSearchResults.map((item) => (
                                                                        <button
                                                                            key={item.username}
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setFormData(prev => ({
                                                                                    ...prev,
                                                                                    assignment: { ...prev.assignment, agent: item.username }
                                                                                }));
                                                                                setSelectedAgentDisplay({ username: item.username, name: item.name });
                                                                                setAgentSearchQuery('');
                                                                                setAgentSearchResults([]);
                                                                            }}
                                                                            className="w-full px-3 py-2.5 text-left text-sm hover:bg-indigo-50 flex flex-col border-b border-gray-100 last:border-0"
                                                                        >
                                                                            <span className="font-medium text-gray-900">{item.name}</span>
                                                                            {(item.mobile || item.email) && (
                                                                                <span className="text-xs text-gray-500">
                                                                                    {[item.mobile, item.email].filter(Boolean).join(' · ')}
                                                                                </span>
                                                                            )}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {agentSearchQuery.trim().length > 0 && agentSearchQuery.trim().length < 3 && (
                                                                <p className="absolute left-9 top-full mt-0.5 text-xs text-gray-500">Type at least 3 characters</p>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Employees */}
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-gray-700">Employees</label>
                                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                                                {/* Available Employees */}
                                                <div className="lg:col-span-2">
                                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[420px] flex flex-col overflow-hidden">
                                                        <div className="flex justify-between items-center mb-3 shrink-0">
                                                            <h3 className="text-sm font-medium text-gray-700">Available Employees</h3>
                                                            <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                                                                {allEmployees.length}
                                                            </span>
                                                        </div>
                                                        <div className="relative mb-2 shrink-0">
                                                            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                            <input
                                                                type="text"
                                                                value={employeeSearchQuery}
                                                                onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                                                                placeholder="Search by name, mobile, email, designation..."
                                                                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
                                                            {staffLoading && (
                                                                <div className="text-center text-gray-500 text-sm py-8">Loading staff...</div>
                                                            )}
                                                            {!staffLoading && filteredAvailableEmployees.length === 0 && (
                                                                <div className="text-center text-gray-400 text-sm py-8">
                                                                    {employeeSearchQuery.trim() ? 'No matching employees' : 'No employees available'}
                                                                </div>
                                                            )}
                                                            {!staffLoading && filteredAvailableEmployees.map(employee => (
                                                                <div
                                                                    key={employee.username}
                                                                    onClick={() => addEmployee(employee)}
                                                                    className="p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors duration-200"
                                                                >
                                                                    <div className="font-medium text-sm text-gray-800">{employee.name}</div>
                                                                    <div className="text-sm text-gray-400">
                                                                        {[employee.department, employee.mobile].filter(Boolean).join(' • ') || '—'}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Transfer Controls */}
                                                <div className="lg:col-span-1 flex lg:flex-col justify-center items-center space-y-3 lg:space-y-3 space-x-3 lg:space-x-0">
                                                    <motion.button
                                                        type="button"
                                                        onClick={addAllEmployees}
                                                        disabled={filteredAvailableEmployees.length === 0}
                                                        className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <FiArrowRight className="w-4 h-4" />
                                                    </motion.button>
                                                    <motion.button
                                                        type="button"
                                                        onClick={removeAllEmployees}
                                                        disabled={selectedEmployees.length === 0}
                                                        className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <FiArrowLeft className="w-4 h-4" />
                                                    </motion.button>
                                                </div>

                                                {/* Selected Employees */}
                                                <div className="lg:col-span-2">
                                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[420px] flex flex-col overflow-hidden">
                                                        <div className="flex justify-between items-center mb-3 shrink-0">
                                                            <h3 className="text-sm font-medium text-gray-700">Selected Employees</h3>
                                                            <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                                                                {selectedEmployees.length}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
                                                            {selectedEmployees.map(employee => (
                                                                <div
                                                                    key={employee.username}
                                                                    onClick={() => removeEmployee(employee)}
                                                                    className="p-3 bg-white border border-indigo-200 rounded-lg cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors duration-200"
                                                                >
                                                                    <div className="font-medium text-sm text-gray-800">{employee.name}</div>
                                                                    <div className="text-sm text-gray-400">
                                                                        {[employee.department, employee.mobile].filter(Boolean).join(' • ') || '—'}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {selectedEmployees.length === 0 && (
                                                                <div className="text-center text-gray-400 text-sm py-8">
                                                                    No employees selected
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Subtasks Tab */}
                                {activeTab === 'subtasks' && (
                                    <div className="text-center py-12 text-gray-500">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FiFileText className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 font-medium">Subtasks editing coming soon...</p>
                                        <p className="text-gray-400 text-sm mt-1">This feature is under development</p>
                                    </div>
                                )}

                                {/* Notes Tab */}
                                {activeTab === 'notes' && (
                                    <div className="text-center py-12 text-gray-500">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FiPaperclip className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 font-medium">Notes editing coming soon...</p>
                                        <p className="text-gray-400 text-sm mt-1">This feature is under development</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
                        <motion.button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={submitting}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            onClick={handleSubmit}
                            disabled={submitting || loading}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {submitting ? (
                                <>
                                    <FiLoader className="w-4 h-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <FiSave className="w-4 h-4" />
                                    Update Task
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditTaskModal;