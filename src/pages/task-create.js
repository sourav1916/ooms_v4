import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Sidebar, Header } from '../components/header';
import Select from 'react-select';
import getHeaders from '../utils/get-headers';
import API_BASE_URL from '../utils/api-controller';
import {
    FiUsers,
    FiBriefcase,
    FiCalendar,
    FiDollarSign,
    FiUserCheck,
    FiUserPlus,
    FiFileText,
    FiPlus,
    FiSearch,
    FiRefreshCw,
    FiPaperclip,
    FiX,
    FiMic,
    FiStopCircle,
    FiDownload,
    FiTrash2,
    FiArrowRight,
    FiArrowLeft,
    FiUser,
    FiCheck,
    FiUpload,
    FiEdit,
    FiClock,
    FiLayers,
    FiEye
} from 'react-icons/fi';
import { FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const TaskCreate = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [currentStep, setCurrentStep] = useState(1);
    const [transitionDirection, setTransitionDirection] = useState('next');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        selectionType: 'firm',
        firm_id: '',
        group_id: '',
        service_category: '', // New field for service category
        service_id: '',
        ay: [],
        fees: '',
        due_date: '',
        ca: 'NOT APPLICABLE',
        agent: 'NOT APPLICABLE',
        mentor: 'NOT APPLICABLE',
        employees: [],
        notes: ''
    });

    // Subtask states
    const [subTasks, setSubTasks] = useState([]);
    const [subTaskForm, setSubTaskForm] = useState({
        type: 'service', // 'service' or 'manual'
        service_category: '', // New field for subtask service category
        service_id: '',
        manual_text: '',
        due_date: '',
        assigned_staff: []
    });
    const [showSubTaskForm, setShowSubTaskForm] = useState(false);

    // Service categories (fetched from API)
    const [serviceCategories, setServiceCategories] = useState([]);

    useEffect(() => {
        const fetchServiceCategories = async () => {
            const headers = getHeaders();
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
        fetchServiceCategories();
    }, []);

    // Services (fetched from API)
    const [services, setServices] = useState([]);

    // Filtered services based on selected category
    const [filteredServices, setFilteredServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            const headers = getHeaders();
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
        fetchServices();
    }, []);

    // Dummy data arrays
    const [firms] = useState([
        { firm_id: '1', firm_name: 'ABC Corporation', contact: 'John Doe', phone: '9876543210' },
        { firm_id: '2', firm_name: 'XYZ Enterprises', contact: 'Jane Smith', phone: '9876543211' },
        { firm_id: '3', firm_name: 'Global Solutions Ltd', contact: 'Mike Johnson', phone: '9876543212' },
        { firm_id: '4', firm_name: 'Tech Innovators Inc', contact: 'Sarah Wilson', phone: '9876543213' },
        { firm_id: '5', firm_name: 'Future Systems', contact: 'David Brown', phone: '9876543214' },
        { firm_id: '6', firm_name: 'Prime Services', contact: 'Emily Davis', phone: '9876543215' },
        { firm_id: '7', firm_name: 'Elite Business Group', contact: 'Chris Lee', phone: '9876543216' },
        { firm_id: '8', firm_name: 'NextGen Partners', contact: 'Amanda Clark', phone: '9876543217' }
    ]);

    const [groups] = useState([
        { group_id: '1', name: 'Corporate Clients', description: 'Large corporate accounts' },
        { group_id: '2', name: 'Small Business', description: 'Small and medium enterprises' },
        { group_id: '3', name: 'Startup Portfolio', description: 'Early stage companies' },
        { group_id: '4', name: 'Enterprise Solutions', description: 'Enterprise level clients' },
        { group_id: '5', name: 'Government Projects', description: 'Government and public sector' }
    ]);

    const [financialYears, setFinancialYears] = useState([
        { value: '2023-2024', label: 'FY 2023-2024', selected: false },
        { value: '2022-2023', label: 'FY 2022-2023', selected: false },
        { value: '2021-2022', label: 'FY 2021-2022', selected: false },
        { value: '2020-2021', label: 'FY 2020-2021', selected: false },
        { value: '2019-2020', label: 'FY 2019-2020', selected: false },
        { value: '2018-2019', label: 'FY 2018-2019', selected: false }
    ]);

    const [cas] = useState([
        { username: 'ca1', name: 'Mr. Sharma & Associates' },
        { username: 'ca2', name: 'Gupta Chartered Accountants' },
        { username: 'ca3', name: 'Patel & Company' },
        { username: 'ca4', name: 'Kumar Financial Services' },
        { username: 'ca5', name: 'Joshi Audit Firm' }
    ]);

    const [agents] = useState([
        { username: 'agent1', name: 'Rahul Mehta' },
        { username: 'agent2', name: 'Priya Singh' },
        { username: 'agent3', name: 'Amit Verma' },
        { username: 'agent4', name: 'Neha Kapoor' },
        { username: 'agent5', name: 'Sanjay Reddy' }
    ]);

    const [mentors] = useState([
        { username: 'mentor1', name: 'Rahul Mehta' },
        { username: 'mentor2', name: 'Priya Singh' },
        { username: 'mentor3', name: 'Amit Verma' },
        { username: 'mentor4', name: 'Neha Kapoor' },
        { username: 'mentor5', name: 'Sanjay Reddy' }
    ]);

    const [allEmployees, setAllEmployees] = useState([
        { username: 'emp1', name: 'John Doe', mobile: '9876543210', department: 'Development' },
        { username: 'emp2', name: 'Jane Smith', mobile: '9876543211', department: 'Design' },
        { username: 'emp3', name: 'Mike Johnson', mobile: '9876543212', department: 'Marketing' },
        { username: 'emp4', name: 'Sarah Wilson', mobile: '9876543213', department: 'Development' },
        { username: 'emp5', name: 'David Brown', mobile: '9876543214', department: 'Sales' }
    ]);

    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [showAyDiv, setShowAyDiv] = useState(false);

    // Staff for subtasks
    const [availableStaff, setAvailableStaff] = useState([
        { id: 'staff1', name: 'Alex Thompson', role: 'Developer', selected: false },
        { id: 'staff2', name: 'Maria Garcia', role: 'Designer', selected: false },
        { id: 'staff3', name: 'James Wilson', role: 'Manager', selected: false },
        { id: 'staff4', name: 'Lisa Chen', role: 'Analyst', selected: false },
        { id: 'staff5', name: 'Robert Brown', role: 'Tester', selected: false }
    ]);

    // Voice recording states
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recordingIntervalRef = useRef(null);

    // File attachment states
    const [attachedFiles, setAttachedFiles] = useState([]);
    const fileInputRef = useRef(null);

    // Step configurations
    const steps = [
        { number: 1, title: 'Client & Services', subtitle: 'Select client and service details' },
        { number: 2, title: 'Assign', subtitle: 'Assign employees and set due date' },
        { number: 3, title: 'Attachment', subtitle: 'Add notes and attachments' }
    ];

    // Persist sidebar minimized state
    useEffect(() => {
        localStorage.setItem('sidebarMinimized', JSON.stringify(isMinimized));
    }, [isMinimized]);

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [mobileMenuOpen]);

    // Filter services when category or services list changes
    useEffect(() => {
        if (formData.service_category) {
            const filtered = services.filter(service => service.category_id === formData.service_category);
            setFilteredServices(filtered);
        } else {
            setFilteredServices(services);
        }

        // Reset service_id when category changes
        if (formData.service_id) {
            const selectedService = services.find(service => service.service_id === formData.service_id);
            if (selectedService && formData.service_category && selectedService.category_id !== formData.service_category) {
                setFormData(prev => ({
                    ...prev,
                    service_id: ''
                }));
            }
        }
    }, [formData.service_category, formData.service_id, services]);

    // Navigation functions
    const nextStep = () => {
        if (currentStep < 3) {
            setTransitionDirection('next');
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setTransitionDirection('prev');
            setCurrentStep(currentStep - 1);
        }
    };

    // Financial Year Tab Functions
    const toggleFinancialYear = (yearValue) => {
        setFinancialYears(prev =>
            prev.map(year =>
                year.value === yearValue
                    ? { ...year, selected: !year.selected }
                    : year
            )
        );

        setFormData(prev => {
            const currentAy = [...prev.ay];
            if (currentAy.includes(yearValue)) {
                return {
                    ...prev,
                    ay: currentAy.filter(ay => ay !== yearValue)
                };
            } else {
                return {
                    ...prev,
                    ay: [...currentAy, yearValue]
                };
            }
        });
    };

    const selectAllFinancialYears = () => {
        setFinancialYears(prev =>
            prev.map(year => ({ ...year, selected: true }))
        );
        setFormData(prev => ({
            ...prev,
            ay: financialYears.map(year => year.value)
        }));
    };

    const clearAllFinancialYears = () => {
        setFinancialYears(prev =>
            prev.map(year => ({ ...year, selected: false }))
        );
        setFormData(prev => ({
            ...prev,
            ay: []
        }));
    };

    // Subtask Functions
    const handleSubTaskInputChange = (e) => {
        const { name, value } = e.target;
        setSubTaskForm(prev => ({
            ...prev,
            [name]: value
        }));

        // Handle service category change for subtasks
        if (name === 'service_category') {
            setSubTaskForm(prev => ({
                ...prev,
                service_id: '' // Reset service when category changes
            }));
        }
    };

    const toggleStaffSelection = (staffId) => {
        setAvailableStaff(prev =>
            prev.map(staff =>
                staff.id === staffId
                    ? { ...staff, selected: !staff.selected }
                    : staff
            )
        );

        setSubTaskForm(prev => {
            const currentStaff = [...prev.assigned_staff];
            if (currentStaff.includes(staffId)) {
                return {
                    ...prev,
                    assigned_staff: currentStaff.filter(id => id !== staffId)
                };
            } else {
                return {
                    ...prev,
                    assigned_staff: [...currentStaff, staffId]
                };
            }
        });
    };

    const addSubTask = () => {
        if ((subTaskForm.type === 'service' && !subTaskForm.service_id) ||
            (subTaskForm.type === 'manual' && !subTaskForm.manual_text) ||
            !subTaskForm.due_date) {
            alert('Please fill all required fields');
            return;
        }

        const newSubTask = {
            id: Math.random().toString(36).substr(2, 9),
            type: subTaskForm.type,
            description: subTaskForm.type === 'service'
                ? services.find(s => s.service_id === subTaskForm.service_id)?.name
                : subTaskForm.manual_text,
            due_date: subTaskForm.due_date,
            assigned_staff: subTaskForm.assigned_staff,
            staff_names: availableStaff
                .filter(staff => subTaskForm.assigned_staff.includes(staff.id))
                .map(staff => staff.name)
        };

        setSubTasks(prev => [...prev, newSubTask]);
        setSubTaskForm({
            type: 'service',
            service_category: '',
            service_id: '',
            manual_text: '',
            due_date: '',
            assigned_staff: []
        });
        setAvailableStaff(prev => prev.map(staff => ({ ...staff, selected: false })));
        setShowSubTaskForm(false);
    };

    const removeSubTask = (subTaskId) => {
        setSubTasks(prev => prev.filter(task => task.id !== subTaskId));
    };

    const cancelSubTask = () => {
        setSubTaskForm({
            type: 'service',
            service_category: '',
            service_id: '',
            manual_text: '',
            due_date: '',
            assigned_staff: []
        });
        setAvailableStaff(prev => prev.map(staff => ({ ...staff, selected: false })));
        setShowSubTaskForm(false);
    };

    // Voice recording functions
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setRecordedAudio(audioUrl);
                setAudioBlob(audioBlob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);

            recordingIntervalRef.current = setInterval(() => {
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
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            clearInterval(recordingIntervalRef.current);
        }
    };

    const deleteRecording = () => {
        setRecordedAudio(null);
        setAudioBlob(null);
        setRecordingTime(0);
        if (recordedAudio) {
            URL.revokeObjectURL(recordedAudio);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const downloadRecording = () => {
        if (audioBlob) {
            const url = URL.createObjectURL(audioBlob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `task-note-${new Date().toISOString().slice(0, 10)}.wav`;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    };

    // File attachment functions
    const handleFileAttach = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toLocaleDateString(),
            previewUrl: URL.createObjectURL(file) // 🔥 blob URL (not local path)
        }));

        setAttachedFiles(prev => [...prev, ...newFiles]);
        e.target.value = '';
    };

    const removeFile = (fileId) => {
        setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType) => {
        if (fileType.includes('image')) return '🖼️';
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('word') || fileType.includes('document')) return '📝';
        if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
        return '📎';
    };

    // Employee selection functions
    const addEmployee = (employee) => {
        setSelectedEmployees(prev => [...prev, employee]);
        setAllEmployees(prev => prev.filter(emp => emp.username !== employee.username));
        setFormData(prev => ({
            ...prev,
            employees: [...prev.employees, employee.username]
        }));
    };

    const removeEmployee = (employee) => {
        setAllEmployees(prev => [...prev, employee]);
        setSelectedEmployees(prev => prev.filter(emp => emp.username !== employee.username));
        setFormData(prev => ({
            ...prev,
            employees: prev.employees.filter(username => username !== employee.username)
        }));
    };

    const addAllEmployees = () => {
        setSelectedEmployees(prev => [...prev, ...allEmployees]);
        setFormData(prev => ({
            ...prev,
            employees: [...prev.employees, ...allEmployees.map(emp => emp.username)]
        }));
        setAllEmployees([]);
    };

    const removeAllEmployees = () => {
        setAllEmployees(prev => [...prev, ...selectedEmployees]);
        setFormData(prev => ({
            ...prev,
            employees: []
        }));
        setSelectedEmployees([]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'service_category') {
            // Reset service_id when category changes
            setFormData(prev => ({
                ...prev,
                service_id: ''
            }));
        }

        if (name === 'service_id') {
            const selectedService = services.find(service => service.service_id === value);
            if (selectedService) {
                setShowAyDiv(Number(selectedService.has_ay) === 1);
                if (Number(selectedService.has_ay) === 1) {
                    setFormData(prev => ({
                        ...prev,
                        fees: selectedService.fees
                    }));
                }
                // Auto-select the service category based on selected service
                setFormData(prev => ({
                    ...prev,
                    service_category: selectedService.category_id
                }));
            }
        }

        if (name === 'selectionType') {
            setFormData(prev => ({
                ...prev,
                firm_id: '',
                group_id: ''
            }));
        }
    };

    const handleDateChange = (e) => {
        const date = new Date(e.target.value);
        const formattedDate = date.toLocaleDateString('en-GB');
        setFormData(prev => ({
            ...prev,
            due_date: formattedDate
        }));
    };

    const handleFirmChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            firm_id: selectedOption ? selectedOption.value : ''
        }));
    };

    const handleGroupChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            group_id: selectedOption ? selectedOption.value : ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('Task created successfully!');
            setFormData({
                selectionType: 'firm',
                firm_id: '',
                group_id: '',
                service_category: '',
                service_id: '',
                ay: [],
                fees: '',
                due_date: '',
                ca: '',
                agent: 'NOT APPLICABLE',
                employees: [],
                notes: ''
            });
            setSubTasks([]);
            setShowAyDiv(false);
            setFinancialYears(prev => prev.map(year => ({ ...year, selected: false })));
            deleteRecording();
            setAttachedFiles([]);
            setAllEmployees([
                { username: 'emp1', name: 'John Doe', mobile: '9876543210', department: 'Development' },
                { username: 'emp2', name: 'Jane Smith', mobile: '9876543211', department: 'Design' },
                { username: 'emp3', name: 'Mike Johnson', mobile: '9876543212', department: 'Marketing' },
                { username: 'emp4', name: 'Sarah Wilson', mobile: '9876543213', department: 'Development' },
                { username: 'emp5', name: 'David Brown', mobile: '9876543214', department: 'Sales' }
            ]);
            setSelectedEmployees([]);
            setCurrentStep(1);
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Error creating task. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Prepare options for react-select
    const firmOptions = firms.map(firm => ({
        value: firm.firm_id,
        label: `${firm.firm_name} - ${firm.contact}`
    }));

    const groupOptions = groups.map(group => ({
        value: group.group_id,
        label: `${group.name}`
    }));

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            <Header
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                isMinimized={isMinimized}
                setIsMinimized={setIsMinimized}
            />
            <Sidebar
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                isMinimized={isMinimized}
                setIsMinimized={setIsMinimized}
            />

            {/* Main content */}
            <div className={`pt-16 transition-all duration-300 ease-in-out ${isMinimized ? 'md:pl-20' : 'md:pl-72'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                    {/* Main Card */}
                    <motion.div 
                        className="bg-white rounded-lg shadow-sm border border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-white rounded-t-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">Create New Task</h2>
                                    <p className="text-indigo-100 text-sm mt-1">Fill in the task details below</p>
                                </div>
                                <motion.button 
                                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiUpload className="w-4 h-4" />
                                    <span>Bulk Import</span>
                                </motion.button>
                            </div>
                        </div>

                        <div className="p-4">
                            {/* Enhanced Stepper */}
                            <div className="flex justify-center mb-8">
                                <div className="flex items-center space-x-6">
                                    {steps.map((step, index) => (
                                        <div key={step.number} className="flex items-center">
                                            <div className={`flex flex-col items-center transition-all duration-300 ${step.number === currentStep ? 'scale-105' : 'scale-100'
                                                }`}>
                                                <div className={`relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold border-2 transition-all duration-300 ${step.number === currentStep
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                    : step.number < currentStep
                                                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                                                        : 'bg-white border-gray-300 text-gray-500'
                                                    }`}>
                                                    {step.number < currentStep ? <FiCheck className="w-4 h-4" /> : step.number}
                                                    {step.number === currentStep && (
                                                        <div className="absolute -inset-2 bg-indigo-100 rounded-full animate-pulse opacity-50"></div>
                                                    )}
                                                </div>
                                                <div className="mt-3 text-center max-w-32">
                                                    <div className={`text-sm font-semibold transition-colors duration-300 ${step.number === currentStep ? 'text-indigo-600' : step.number < currentStep ? 'text-emerald-600' : 'text-gray-500'
                                                        }`}>
                                                        {step.title}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {step.subtitle}
                                                    </div>
                                                </div>
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div className={`w-16 h-1 mx-4 rounded-full transition-colors duration-300 ${step.number < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                                                    }`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Step Content with Smooth Transitions */}
                                <div className="relative">
                                    {/* Step 1: Client & Services */}
                                    <div className={`transition-all duration-500 ease-in-out ${currentStep === 1
                                        ? 'opacity-100 translate-x-0 block'
                                        : transitionDirection === 'next'
                                            ? 'opacity-0 -translate-x-full absolute inset-0'
                                            : 'opacity-0 translate-x-full absolute inset-0'
                                        }`}>
                                        <div className="space-y-4">
                                            {/* Radio Button Selection for Firm/Group */}
                                            <div className="mb-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Select Type <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex space-x-6">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="selectionType"
                                                            value="firm"
                                                            checked={formData.selectionType === 'firm'}
                                                            onChange={handleInputChange}
                                                            className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                                        />
                                                        <FiUser className="text-gray-600 text-base" />
                                                        <span className="text-sm font-medium text-gray-700">Firm</span>
                                                    </label>

                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="selectionType"
                                                            value="group"
                                                            checked={formData.selectionType === 'group'}
                                                            onChange={handleInputChange}
                                                            className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                                        />
                                                        <FiUsers className="text-gray-600 text-base" />
                                                        <span className="text-sm font-medium text-gray-700">Group</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Firm/Group Selection */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        {formData.selectionType === 'firm' ? 'Firm' : 'Group'} <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        {formData.selectionType === 'firm' ? (
                                                            <>
                                                                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base z-10" />
                                                                <Select
                                                                    options={firmOptions}
                                                                    value={firmOptions.find(option => option.value === formData.firm_id) || null}
                                                                    onChange={handleFirmChange}
                                                                    placeholder="Search firm..."
                                                                    isSearchable
                                                                    isClearable
                                                                    className="text-sm"
                                                                    styles={{
                                                                        control: (base) => ({
                                                                            ...base,
                                                                            paddingLeft: '40px',
                                                                            minHeight: '48px',
                                                                            border: '1px solid #d1d5db',
                                                                            borderRadius: '8px',
                                                                            fontSize: '14px',
                                                                            '&:hover': {
                                                                                borderColor: '#d1d5db'
                                                                            }
                                                                        }),
                                                                        placeholder: (base) => ({
                                                                            ...base,
                                                                            fontSize: '14px',
                                                                            color: '#9ca3af'
                                                                        }),
                                                                        menu: (base) => ({
                                                                            ...base,
                                                                            fontSize: '14px'
                                                                        })
                                                                    }}
                                                                />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base z-10" />
                                                                <Select
                                                                    options={groupOptions}
                                                                    value={groupOptions.find(option => option.value === formData.group_id) || null}
                                                                    onChange={handleGroupChange}
                                                                    placeholder="Search group..."
                                                                    isSearchable
                                                                    isClearable
                                                                    className="text-sm"
                                                                    styles={{
                                                                        control: (base) => ({
                                                                            ...base,
                                                                            paddingLeft: '40px',
                                                                            minHeight: '48px',
                                                                            border: '1px solid #d1d5db',
                                                                            borderRadius: '8px',
                                                                            fontSize: '14px',
                                                                            '&:hover': {
                                                                                borderColor: '#d1d5db'
                                                                            }
                                                                        }),
                                                                        placeholder: (base) => ({
                                                                            ...base,
                                                                            fontSize: '14px',
                                                                            color: '#9ca3af'
                                                                        }),
                                                                        menu: (base) => ({
                                                                            ...base,
                                                                            fontSize: '14px'
                                                                        })
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Service Category */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Service Category
                                                    </label>
                                                    <div className="relative">
                                                        <FiLayers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
                                                        <select
                                                            name="service_category"
                                                            value={formData.service_category}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-12 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 outline-none"
                                                        >
                                                            <option value="">All Categories</option>
                                                            {serviceCategories.map(category => (
                                                                <option key={category.category_id} value={category.category_id}>
                                                                    {category.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Service Selection */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Service <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
                                                        <select
                                                            name="service_id"
                                                            value={formData.service_id}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-12 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 outline-none"
                                                            required
                                                        >
                                                            <option value="">Select service...</option>
                                                            {filteredServices.map(service => (
                                                                <option key={service.service_id} value={service.service_id}>
                                                                    {service.name} - ₹{service.fees}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Service Fees */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Fees <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
                                                        <input
                                                            type="number"
                                                            name="fees"
                                                            value={formData.fees}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-12 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 outline-none"
                                                            placeholder="Enter amount"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Due Date */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Due Date <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
                                                        <input
                                                            type="date"
                                                            name="due_date"
                                                            onChange={handleDateChange}
                                                            className="w-full pl-12 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 outline-none"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Financial Year Tabs */}
                                            {showAyDiv && (
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Financial Years <span className="text-red-500">*</span>
                                                        </label>
                                                        <div className="flex space-x-2">
                                                            <motion.button
                                                                type="button"
                                                                onClick={selectAllFinancialYears}
                                                                className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                Select All
                                                            </motion.button>
                                                            <motion.button
                                                                type="button"
                                                                onClick={clearAllFinancialYears}
                                                                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                Clear All
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2">
                                                            {financialYears.map((year) => (
                                                                <motion.button
                                                                    key={year.value}
                                                                    type="button"
                                                                    onClick={() => toggleFinancialYear(year.value)}
                                                                    className={`p-3 text-sm font-medium rounded-lg border transition-all duration-200 ${year.selected
                                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm transform scale-105'
                                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                                                                        }`}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    {year.label}
                                                                </motion.button>
                                                            ))}
                                                        </div>
                                                        <div className="mt-3 text-sm text-gray-500">
                                                            Selected: {formData.ay.length} year(s)
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Subtasks Section */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Subtasks
                                                    </label>
                                                    <motion.button
                                                        type="button"
                                                        onClick={() => setShowSubTaskForm(true)}
                                                        className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FiPlus className="w-4 h-4" />
                                                        <span>Add Subtask</span>
                                                    </motion.button>
                                                </div>

                                                {/* Subtask Form */}
                                                <AnimatePresence>
                                                    {showSubTaskForm && (
                                                        <motion.div 
                                                            className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4"
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Subtask Type <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <select
                                                                        name="type"
                                                                        value={subTaskForm.type}
                                                                        onChange={handleSubTaskInputChange}
                                                                        className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                                                    >
                                                                        <option value="service">Choose from Service</option>
                                                                        <option value="manual">Manual Text</option>
                                                                    </select>
                                                                </div>

                                                                {subTaskForm.type === 'service' && (
                                                                    <div className="space-y-2">
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Service Category
                                                                        </label>
                                                                        <select
                                                                            name="service_category"
                                                                            value={subTaskForm.service_category}
                                                                            onChange={handleSubTaskInputChange}
                                                                            className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                                                        >
                                                                            <option value="">All Categories</option>
                                                                            {serviceCategories.map(category => (
                                                                                <option key={category.category_id} value={category.category_id}>
                                                                                    {category.name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {subTaskForm.type === 'service' ? (
                                                                    <div className="space-y-2">
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Service <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <select
                                                                            name="service_id"
                                                                            value={subTaskForm.service_id}
                                                                            onChange={handleSubTaskInputChange}
                                                                            className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                                                        >
                                                                            <option value="">Select service...</option>
                                                                            {subTaskForm.service_category
                                                                                ? services.filter(service => service.category_id === subTaskForm.service_category).map(service => (
                                                                                    <option key={service.service_id} value={service.service_id}>
                                                                                        {service.name}
                                                                                    </option>
                                                                                ))
                                                                                : services.map(service => (
                                                                                    <option key={service.service_id} value={service.service_id}>
                                                                                        {service.name}
                                                                                    </option>
                                                                                ))
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-2">
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Manual Text <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            name="manual_text"
                                                                            value={subTaskForm.manual_text}
                                                                            onChange={handleSubTaskInputChange}
                                                                            className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                                                            placeholder="Enter subtask description"
                                                                        />
                                                                    </div>
                                                                )}

                                                                <div className="space-y-2">
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Due Date <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <input
                                                                        type="date"
                                                                        name="due_date"
                                                                        value={subTaskForm.due_date}
                                                                        onChange={handleSubTaskInputChange}
                                                                        className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-medium text-gray-700">
                                                                    Assign Staff
                                                                </label>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {availableStaff.map(staff => (
                                                                        <motion.button
                                                                            key={staff.id}
                                                                            type="button"
                                                                            onClick={() => toggleStaffSelection(staff.id)}
                                                                            className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${staff.selected
                                                                                ? 'bg-green-600 text-white border-green-600 shadow-sm transform scale-105'
                                                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                                                                                }`}
                                                                            whileHover={{ scale: 1.05 }}
                                                                            whileTap={{ scale: 0.95 }}
                                                                        >
                                                                            {staff.name}
                                                                        </motion.button>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-end space-x-3">
                                                                <motion.button
                                                                    type="button"
                                                                    onClick={cancelSubTask}
                                                                    className="px-4 py-2.5 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    Cancel
                                                                </motion.button>
                                                                <motion.button
                                                                    type="button"
                                                                    onClick={addSubTask}
                                                                    className="px-4 py-2.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    Add Subtask
                                                                </motion.button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Subtasks Table */}
                                                {subTasks.length > 0 && (
                                                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                                        <table className="w-full">
                                                            <thead>
                                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                                    <th className="text-left p-4 text-sm font-medium text-gray-600 uppercase">Description</th>
                                                                    <th className="text-left p-4 text-sm font-medium text-gray-600 uppercase">Due Date</th>
                                                                    <th className="text-left p-4 text-sm font-medium text-gray-600 uppercase">Assigned Staff</th>
                                                                    <th className="text-left p-4 text-sm font-medium text-gray-600 uppercase">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {subTasks.map((task, index) => (
                                                                    <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                                        <td className="p-4 text-sm text-gray-800">
                                                                            <div className="flex items-center space-x-2">
                                                                                <span>{task.description}</span>
                                                                                {task.type === 'service' && (
                                                                                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">Service</span>
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-4 text-sm text-gray-600">
                                                                            <div className="flex items-center space-x-2">
                                                                                <FiClock className="w-4 h-4 text-gray-400" />
                                                                                <span>{task.due_date}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-4 text-sm text-gray-600">
                                                                            <div className="flex flex-wrap gap-1">
                                                                                {task.staff_names.map((name, idx) => (
                                                                                    <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                                                                        {name}
                                                                                    </span>
                                                                                ))}
                                                                                {task.staff_names.length === 0 && (
                                                                                    <span className="text-gray-400">Not assigned</span>
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-4">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeSubTask(task.id)}
                                                                                className="text-red-500 hover:text-red-700 p-1 transition-colors duration-200"
                                                                            >
                                                                                <FiTrash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 2: Assign */}
                                    <div className={`transition-all duration-500 ease-in-out ${currentStep === 2
                                        ? 'opacity-100 translate-x-0 block'
                                        : currentStep > 2
                                            ? 'opacity-0 -translate-x-full absolute inset-0'
                                            : 'opacity-0 translate-x-full absolute inset-0'
                                        }`}>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* CA Selection */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        CA <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiUserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
                                                        <select
                                                            name="ca"
                                                            value={formData.ca}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-12 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 outline-none"
                                                            required
                                                        >
                                                            <option value="NOT APPLICABLE">NOT APPLICABLE</option>
                                                            {cas.map(ca => (
                                                                <option key={ca.username} value={ca.username}>
                                                                    {ca.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Agent Selection */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Agent <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiUserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
                                                        <select
                                                            name="agent"
                                                            value={formData.agent}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-12 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 outline-none"
                                                            required
                                                        >
                                                            <option value="NOT APPLICABLE">NOT APPLICABLE</option>
                                                            {agents.map(agent => (
                                                                <option key={agent.username} value={agent.username}>
                                                                    {agent.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Mentor Selection */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Mentor <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FiUserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
                                                        <select
                                                            name="mentor"
                                                            value={formData.mentor}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-12 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 outline-none"
                                                            required
                                                        >
                                                            <option value="NOT APPLICABLE">NOT APPLICABLE</option>
                                                            {mentors.map(mentor => (
                                                                <option key={mentor.username} value={mentor.username}>
                                                                    {mentor.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Employee Selection - Two Box Layout */}
                                            <div className="space-y-3">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Employees <span className="text-red-500">*</span>
                                                </label>
                                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                                                    {/* Available Employees */}
                                                    <div className="lg:col-span-2">
                                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-64 overflow-hidden flex flex-col">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <h3 className="text-sm font-medium text-gray-700">Available Employees</h3>
                                                                <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                                                                    {allEmployees.length}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 overflow-y-auto space-y-2">
                                                                {allEmployees.map(employee => (
                                                                    <div
                                                                        key={employee.username}
                                                                        onClick={() => addEmployee(employee)}
                                                                        className="p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors duration-200"
                                                                    >
                                                                        <div className="font-medium text-sm text-gray-800">{employee.name}</div>
                                                                        <div className="text-sm text-gray-400">{employee.department} • {employee.mobile}</div>
                                                                    </div>
                                                                ))}
                                                                {allEmployees.length === 0 && (
                                                                    <div className="text-center text-gray-400 text-sm py-8">
                                                                        No employees available
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Transfer Controls */}
                                                    <div className="lg:col-span-1 flex lg:flex-col justify-center items-center space-y-3 lg:space-y-3 space-x-3 lg:space-x-0">
                                                        <motion.button
                                                            type="button"
                                                            onClick={addAllEmployees}
                                                            disabled={allEmployees.length === 0}
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
                                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-64 overflow-hidden flex flex-col">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <h3 className="text-sm font-medium text-gray-700">Selected Employees</h3>
                                                                <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                                                                    {selectedEmployees.length}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 overflow-y-auto space-y-2">
                                                                {selectedEmployees.map(employee => (
                                                                    <div
                                                                        key={employee.username}
                                                                        onClick={() => removeEmployee(employee)}
                                                                        className="p-3 bg-white border border-indigo-200 rounded-lg cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors duration-200"
                                                                    >
                                                                        <div className="font-medium text-sm text-gray-800">{employee.name}</div>
                                                                        <div className="text-sm text-gray-400">{employee.department} • {employee.mobile}</div>
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
                                    </div>

                                    {/* Step 3: Attachment */}
                                    <div className={`transition-all duration-500 ease-in-out ${currentStep === 3
                                        ? 'opacity-100 translate-x-0 block'
                                        : 'opacity-0 translate-x-full absolute inset-0'
                                        }`}>
                                        <div className="space-y-6">
                                            {/* Notes Field */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Notes
                                                </label>
                                                <div className="relative">
                                                    <FiFileText className="absolute left-3 top-3 transform -translate-y-1/2 text-gray-400 text-base" />
                                                    <textarea
                                                        name="notes"
                                                        value={formData.notes}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-12 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 outline-none resize-none"
                                                        placeholder="Additional instructions..."
                                                        rows="4"
                                                    />
                                                </div>
                                            </div>

                                            {/* Attachments and Voice Notes in One Row */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* File Attachments */}
                                                <div className="space-y-3">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Attachments
                                                    </label>
                                                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-64 flex flex-col">
                                                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Files ({attachedFiles.length})
                                                            </span>
                                                            <motion.button
                                                                type="button"
                                                                onClick={() => fileInputRef.current?.click()}
                                                                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <FiPlus className="w-4 h-4" />
                                                                <span>Add File</span>
                                                            </motion.button>
                                                            <input
                                                                type="file"
                                                                ref={fileInputRef}
                                                                onChange={handleFileAttach}
                                                                multiple
                                                                className="hidden"
                                                            />
                                                        </div>

                                                        {attachedFiles.length > 0 ? (
                                                            <div className="flex-1 overflow-y-auto">
                                                                <table className="w-full">
                                                                    <thead>
                                                                        <tr className="bg-gray-50 border-b border-gray-200">
                                                                            <th className="text-left p-3 text-sm font-medium text-gray-600 uppercase">File</th>
                                                                            <th className="text-left p-3 text-sm font-medium text-gray-600 uppercase">Size</th>
                                                                            <th className="text-left p-3 text-sm font-medium text-gray-600 uppercase"></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {attachedFiles.map(file => (
                                                                            <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                                                <td className="p-3 text-sm text-gray-800">
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <span className="text-base">{getFileIcon(file.type)}</span>
                                                                                        <span className="truncate max-w-[120px]">{file.name}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="p-3 text-sm text-gray-600">
                                                                                    {formatFileSize(file.size)}
                                                                                </td>
                                                                                <td className="p-3">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => window.open(file.previewUrl, "_blank")}
                                                                                        className="text-green-500 hover:text-green-700 p-1 transition-colors duration-200"
                                                                                    >
                                                                                        <FiEye className="w-4 h-4" />
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => removeFile(file.id)}
                                                                                        className="text-red-500 hover:text-red-700 p-1 transition-colors duration-200"
                                                                                    >
                                                                                        <FiTrash2 className="w-4 h-4" />
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        ) : (
                                                            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                                                                No files attached
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Voice Notes */}
                                                <div className="space-y-3">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Voice Notes
                                                    </label>
                                                    <div className="bg-white border border-gray-200 rounded-lg p-4 h-64 flex flex-col justify-center">
                                                        {!recordedAudio ? (
                                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                                <motion.button
                                                                    type="button"
                                                                    onClick={isRecording ? stopRecording : startRecording}
                                                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isRecording
                                                                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm'
                                                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                                                                        }`}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    {isRecording ? (
                                                                        <>
                                                                            <FiStopCircle className="w-4 h-4" />
                                                                            <span>Stop Recording</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <FiMic className="w-4 h-4" />
                                                                            <span>Start Recording</span>
                                                                        </>
                                                                    )}
                                                                </motion.button>

                                                                {isRecording && (
                                                                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                                                                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                                                                        <span className="font-mono font-medium">{formatTime(recordingTime)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-4">
                                                                <div className="flex items-center justify-center">
                                                                    <audio controls className="w-full max-w-xs text-sm">
                                                                        <source src={recordedAudio} type="audio/wav" />
                                                                    </audio>
                                                                </div>
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <span className="text-gray-600 font-mono">
                                                                        {formatTime(recordingTime)}
                                                                    </span>
                                                                    <div className="flex items-center space-x-2">
                                                                        <motion.button
                                                                            type="button"
                                                                            onClick={downloadRecording}
                                                                            className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:text-green-700 border border-green-600 rounded-lg transition-colors duration-200"
                                                                            whileHover={{ scale: 1.05 }}
                                                                            whileTap={{ scale: 0.95 }}
                                                                        >
                                                                            <FiDownload className="w-4 h-4" />
                                                                            <span>Save</span>
                                                                        </motion.button>

                                                                        <motion.button
                                                                            type="button"
                                                                            onClick={deleteRecording}
                                                                            className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 border border-red-600 rounded-lg transition-colors duration-200"
                                                                            whileHover={{ scale: 1.05 }}
                                                                            whileTap={{ scale: 0.95 }}
                                                                        >
                                                                            <FiTrash2 className="w-4 h-4" />
                                                                            <span>Delete</span>
                                                                        </motion.button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
                                    {currentStep > 1 ? (
                                        <motion.button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FiArrowLeft className="w-4 h-4" />
                                            <span>Previous</span>
                                        </motion.button>
                                    ) : (
                                        <div></div>
                                    )}

                                    {currentStep < 3 ? (
                                        <motion.button
                                            type="button"
                                            onClick={nextStep}
                                            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-indigo-200"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span>Next Step</span>
                                            <FiArrowRight className="w-4 h-4" />
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-emerald-200"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {submitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Creating Task...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FiPlus className="w-4 h-4" />
                                                    <span>Create Task</span>
                                                </>
                                            )}
                                        </motion.button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TaskCreate;