import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiX, FiCheck, FiClipboard, FiLoader, FiUser, FiUsers, FiBriefcase, FiUserCheck, FiUserPlus, FiSearch, FiArrowRight, FiArrowLeft, FiCalendar, FiSave, FiRefreshCw } from 'react-icons/fi';
import API_BASE_URL from "../utils/api-controller";
import getHeaders from "../utils/get-headers";
import axios from 'axios';
import 'rsuite/dist/rsuite.min.css';
import { toast } from 'react-hot-toast';

// Add custom styles for DatePicker
const datePickerStyles = `
  .rs-picker-popup {
    z-index: 9999 !important;
  }
  .rs-picker-toolbar {
    z-index: 9999 !important;
  }
  .rs-picker-date-menu {
    z-index: 9999 !important;
  }
`;

// Format date helper
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Format date for API (YYYY-MM-DD)
const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
};

const DetailsTab = ({ taskData: initialData, task_id, onTaskUpdated }) => {
    const [taskData, setTaskData] = useState(initialData);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(null);

    // New state for complex fields
    const [selectedFirmOptions, setSelectedFirmOptions] = useState([]);
    const [selectedGroupOptions, setSelectedGroupOptions] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [staffLoading, setStaffLoading] = useState(false);
    const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
    
    // Search states
    const [firmSearchQuery, setFirmSearchQuery] = useState('');
    const [firmSearchResults, setFirmSearchResults] = useState([]);
    const [firmSearchLoading, setFirmSearchLoading] = useState(false);
    const [caSearchQuery, setCaSearchQuery] = useState('');
    const [caSearchResults, setCaSearchResults] = useState([]);
    const [caSearchLoading, setCaSearchLoading] = useState(false);
    const [agentSearchQuery, setAgentSearchQuery] = useState('');
    const [agentSearchResults, setAgentSearchResults] = useState([]);
    const [agentSearchLoading, setAgentSearchLoading] = useState(false);
    
    // Client search based on selected firms
    const [clientSearchQuery, setClientSearchQuery] = useState('');
    const [clientSearchResults, setClientSearchResults] = useState([]);
    const [clientSearchLoading, setClientSearchLoading] = useState(false);
    
    // Group search
    const [groupSearchQuery, setGroupSearchQuery] = useState('');
    const [groupSearchResults, setGroupSearchResults] = useState([]);
    const [groupSearchLoading, setGroupSearchLoading] = useState(false);
    
    // Abort controllers
    const firmSearchAbortRef = useRef(null);
    const caSearchAbortRef = useRef(null);
    const agentSearchAbortRef = useRef(null);
    const clientSearchAbortRef = useRef(null);
    const groupSearchAbortRef = useRef(null);

    // Data lists
    const [serviceCategories, setServiceCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupsLoading, setGroupsLoading] = useState(false);
    const [assessmentYearsList, setAssessmentYearsList] = useState([]);
    const [financialYearsList, setFinancialYearsList] = useState([]);
    const [fullStaffList, setFullStaffList] = useState([]);

    // Display states
    const [selectedCaDisplay, setSelectedCaDisplay] = useState(null);
    const [selectedAgentDisplay, setSelectedAgentDisplay] = useState(null);
    const [selectedClientDisplay, setSelectedClientDisplay] = useState(null);
    const [firmOwnerDisplay, setFirmOwnerDisplay] = useState(null);

    // Initialize data when component mounts
    useEffect(() => {
        if (taskData) {
            initializeComplexFields();
            fetchSupportingData();
        }
    }, [taskData]);

    // Filter services when category changes
    useEffect(() => {
        if (taskData.service?.category_id) {
            const filtered = services.filter(service => 
                service.category_id === taskData.service.category_id
            );
            setFilteredServices(filtered);
        } else {
            setFilteredServices(services);
        }
    }, [taskData.service?.category_id, services]);

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

    // Initialize complex fields from taskData
    const initializeComplexFields = () => {
        setEditedData({ ...taskData });
        
        // Initialize firms
        if (taskData.firms && Array.isArray(taskData.firms)) {
            const firmOptions = taskData.firms.map(firm => ({
                value: firm.firm_id || firm.id,
                label: firm.firm_name || firm.name || 'Unknown Firm',
                owner_name: firm.owner_name || firm.owner?.name || 'N/A',
                owner_username: firm.owner_username || firm.owner?.username,
                __firm: firm
            }));
            setSelectedFirmOptions(firmOptions);
            
            // Set firm owner from the first firm (assuming single firm)
            if (firmOptions.length > 0) {
                setFirmOwnerDisplay({
                    name: firmOptions[0].owner_name,
                    username: firmOptions[0].owner_username
                });
            }
        }

        // Initialize groups
        if (taskData.groups && Array.isArray(taskData.groups)) {
            const groupOptions = taskData.groups.map(group => ({
                value: group.group_id || group.id,
                label: group.name || group.group_name || 'Unknown Group',
                firm_count: group.firm_count || 0,
                __group: group
            }));
            setSelectedGroupOptions(groupOptions);
        }

        // Initialize staff
        if (taskData.staffs && Array.isArray(taskData.staffs)) {
            const staffList = taskData.staffs.map(staff => ({
                username: staff.username,
                name: staff.name || staff.username,
                mobile: staff.mobile || '',
                email: staff.email || '',
                department: staff.designation || ''
            }));
            setSelectedEmployees(staffList);
        }

        // Initialize CA - Updated to handle the new structure
        if (taskData.has_ca && taskData.ca) {
            setSelectedCaDisplay({ 
                username: taskData.ca.username, 
                name: taskData.ca.name,
                email: taskData.ca.email,
                mobile: taskData.ca.mobile,
                country_code: taskData.ca.country_code
            });
        } else if (taskData.assignment?.ca) {
            // Fallback for old structure
            setSelectedCaDisplay({ 
                username: taskData.assignment.ca, 
                name: taskData.assignment.ca 
            });
        }

        // Initialize Agent
        if (taskData.assignment?.agent) {
            setSelectedAgentDisplay({ 
                username: taskData.assignment.agent, 
                name: taskData.assignment.agent 
            });
        }

        // Initialize Client
        if (taskData.client) {
            setSelectedClientDisplay({
                client_id: taskData.client.client_id,
                name: taskData.client.profile?.name || taskData.client.name || 'Unknown Client'
            });
        }
    };

    // Fetch supporting data
    const fetchSupportingData = async () => {
        const headers = await getHeaders();
        if (!headers) return;

        try {
            // Fetch service categories
            const catRes = await axios.get(`${API_BASE_URL}/service/category/list`, { headers });
            if (catRes.data?.success) {
                setServiceCategories(catRes.data.data || []);
            }

            // Fetch services
            const servicesRes = await axios.get(`${API_BASE_URL}/service/list`, { headers });
            if (servicesRes.data?.success) {
                setServices(servicesRes.data.data || []);
            }

            // Fetch groups
            fetchAllGroups();
            
            // Fetch years
            fetchYears();
            
            // Fetch staff
            fetchAllStaff();
        } catch (err) {
            console.error('Error fetching supporting data:', err);
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

    // Group search - fixed to use the correct endpoint
    useEffect(() => {
        const term = (groupSearchQuery || '').trim();
        if (term.length < 3) { // Changed from 2 to 3 to match API requirement
            setGroupSearchResults([]);
            setGroupSearchLoading(false);
            return;
        }
        const t = setTimeout(async () => {
            setGroupSearchLoading(true);
            groupSearchAbortRef.current?.abort();
            const controller = new AbortController();
            groupSearchAbortRef.current = controller;
            try {
                const url = `${API_BASE_URL.replace(/\/$/, '')}/group/search?search=${encodeURIComponent(term)}`;
                const res = await fetch(url, { headers: await getHeaders(), signal: controller.signal });
                const data = await res.json();
                if (data.success) {
                    const list = Array.isArray(data?.data) ? data.data : [];
                    const options = list.map(g => ({
                        value: g.group_id,
                        label: g.name || 'Unknown Group',
                        firm_count: g.firm_count || 0,
                        __group: g
                    }));
                    setGroupSearchResults(options);
                } else {
                    setGroupSearchResults([]);
                }
            } catch (err) {
                if (err?.name !== 'AbortError') setGroupSearchResults([]);
            } finally {
                setGroupSearchLoading(false);
            }
        }, 400);
        return () => {
            clearTimeout(t);
            groupSearchAbortRef.current?.abort();
        };
    }, [groupSearchQuery]);

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
            
            // Update all employees list excluding selected ones
            const selectedUsernames = new Set(selectedEmployees.map(emp => emp.username));
            setAllEmployees(mapped.filter(emp => !selectedUsernames.has(emp.username)));
            
            // Update CA and Agent display names
            if (taskData.assignment?.ca) {
                const caStaff = mapped.find(s => s.username === taskData.assignment.ca);
                setSelectedCaDisplay(caStaff || { username: taskData.assignment.ca, name: taskData.assignment.ca });
            }
            
            if (taskData.assignment?.agent) {
                const agentStaff = mapped.find(s => s.username === taskData.assignment.agent);
                setSelectedAgentDisplay(agentStaff || { username: taskData.assignment.agent, name: taskData.assignment.agent });
            }
        } catch (err) {
            console.error('Failed to fetch staff list:', err);
        } finally {
            setStaffLoading(false);
        }
    };

    // Client search based on selected firms - fixed to handle the API response properly
    useEffect(() => {
        const searchClients = async () => {
            if (selectedFirmOptions.length === 0) {
                setClientSearchResults([]);
                return;
            }

            const term = (clientSearchQuery || '').trim();
            if (term.length < 3) { // Changed from 2 to 3 to match API requirement
                setClientSearchResults([]);
                return;
            }

            setClientSearchLoading(true);
            clientSearchAbortRef.current?.abort();
            const controller = new AbortController();
            clientSearchAbortRef.current = controller;

            try {
                // Get firm IDs from selected firms
                const firmIds = selectedFirmOptions.map(f => f.value);
                
                // Search clients across selected firms
                const url = `${API_BASE_URL.replace(/\/$/, '')}/client/search?firm_ids=${firmIds.join(',')}&search=${encodeURIComponent(term)}`;
                const res = await fetch(url, { 
                    headers: await getHeaders(), 
                    signal: controller.signal 
                });
                const data = await res.json();
                
                // Check if the response was successful
                if (data.success) {
                    const list = Array.isArray(data?.data) ? data.data : [];
                    setClientSearchResults(list);
                } else {
                    // If API returns error, show empty results
                    if (data.message && data.message.includes("at least 3 characters")) {
                        // This is expected, just don't show results
                        setClientSearchResults([]);
                    } else {
                        console.error('Client search error:', data.message);
                        setClientSearchResults([]);
                    }
                }
            } catch (err) {
                if (err?.name !== 'AbortError') {
                    console.error('Client search error:', err);
                    setClientSearchResults([]);
                }
            } finally {
                setClientSearchLoading(false);
            }
        };

        const timeoutId = setTimeout(searchClients, 400);
        return () => {
            clearTimeout(timeoutId);
            clientSearchAbortRef.current?.abort();
        };
    }, [clientSearchQuery, selectedFirmOptions]);

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
                if (data.success) {
                    const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
                    const options = list.map(f => ({
                        value: f.firm_id,
                        label: f.client ? `${f.firm_name} – ${f.client.name}` : (f.firm_name || ''),
                        owner_name: f.owner_name || f.owner?.name || 'N/A',
                        owner_username: f.owner_username || f.owner?.username,
                        firm_name: f.firm_name,
                        client_name: f.client?.name,
                        __firm: f
                    }));
                    setFirmSearchResults(options);
                } else {
                    setFirmSearchResults([]);
                }
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
                if (data.success) {
                    const list = Array.isArray(data?.data) ? data.data : [];
                    setCaSearchResults(list);
                } else {
                    setCaSearchResults([]);
                }
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
                if (data.success) {
                    const list = Array.isArray(data?.data) ? data.data : [];
                    setAgentSearchResults(list);
                } else {
                    setAgentSearchResults([]);
                }
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

    // Handle edit button click
    const handleEditClick = () => {
        setEditedData({ ...taskData });
        setIsEditing(true);
        setSaveError(null);
        setSaveSuccess(null);
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedData(null);
        initializeComplexFields();
        setSaveError(null);
        setSaveSuccess(null);
    };

    // Handle save changes
    const handleSaveChanges = async () => {
        const headers = getHeaders();
        if (!headers) {
            setSaveError('Authentication failed. Please login again.');
            return;
        }

        setIsSaving(true);
        setSaveError(null);

        try {
            // Prepare payload
            const payload = {
                firms: selectedFirmOptions.map(f => f.value),
                groups: selectedGroupOptions.map(g => g.value),
                service: {
                    service_id: editedData?.service?.service_id || taskData.service?.service_id,
                    fees: parseFloat(editedData?.charges?.fees || taskData.charges?.fees || 0),
                    due_date: editedData?.dates?.due_date || taskData.dates?.due_date,
                    has_financial_year: taskData.service?.has_financial_year || false,
                    financial_years: taskData.service?.financial_years || [],
                    has_assisment_year: taskData.service?.has_assisment_year || false,
                    assisment_years: taskData.service?.assisment_years || []
                },
                assignment: {
                    staff: selectedEmployees.map(emp => emp.username),
                    ca: selectedCaDisplay?.username || '',
                    agent: selectedAgentDisplay?.username || ''
                },
                client_id: selectedClientDisplay?.client_id || taskData.client?.client_id,
                status: taskData.status,
                billing_status: taskData.billing_status,
                tax_rate: taskData.charges?.tax_rate || 0
            };

            const response = await axios.put(
                `${API_BASE_URL}/task/edit/${task_id}`,
                payload,
                { headers }
            );

            if (response.data.success) {
                setSaveSuccess('Task updated successfully!');
                
                // Update taskData with edited values
                setTaskData(prev => ({
                    ...prev,
                    firms: selectedFirmOptions.map(f => f.__firm),
                    groups: selectedGroupOptions.map(g => ({ group_id: g.value, name: g.label })),
                    assignment: {
                        ...prev.assignment,
                        staff: selectedEmployees.map(emp => emp.username),
                        ca: selectedCaDisplay?.username || '',
                        agent: selectedAgentDisplay?.username || ''
                    },
                    client: selectedClientDisplay ? {
                        client_id: selectedClientDisplay.client_id,
                        profile: { name: selectedClientDisplay.name }
                    } : prev.client,
                    ca: selectedCaDisplay ? {
                        username: selectedCaDisplay.username,
                        name: selectedCaDisplay.name,
                        email: selectedCaDisplay.email,
                        mobile: selectedCaDisplay.mobile,
                        country_code: selectedCaDisplay.country_code
                    } : null,
                    has_ca: !!selectedCaDisplay
                }));

                setIsEditing(false);
                
                if (onTaskUpdated) {
                    onTaskUpdated();
                }
                
                setTimeout(() => setSaveSuccess(null), 3000);
            } else {
                setSaveError(response.data.message || 'Failed to update task');
            }
        } catch (err) {
            console.error('Error updating task:', err);
            if (err.response) {
                setSaveError(err.response.data?.message || `Error ${err.response.status}: Update failed`);
            } else if (err.request) {
                setSaveError('No response from server. Please check your connection.');
            } else {
                setSaveError(`Error: ${err.message}`);
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Complex field handlers
    const addFirm = async (option) => {
        if (selectedFirmOptions.some(o => o.value === option.value)) return;
        const next = [...selectedFirmOptions, option];
        setSelectedFirmOptions(next);
        
        // Set firm owner from the selected firm
        if (next.length > 0) {
            setFirmOwnerDisplay({
                name: option.owner_name,
                username: option.owner_username
            });
        }
    };

    const removeFirm = async (option) => {
        const next = selectedFirmOptions.filter(o => o.value !== option.value);
        setSelectedFirmOptions(next);
        
        // Update firm owner if firms remain
        if (next.length > 0) {
            setFirmOwnerDisplay({
                name: next[0].owner_name,
                username: next[0].owner_username
            });
        } else {
            setFirmOwnerDisplay(null);
        }
    };

    // Fixed group add function
    const addGroup = async (option) => {
        if (option.firm_count === 0) {
            toast?.error?.('Cannot add group with no firms');
            return;
        }
        if (selectedGroupOptions.some(o => o.value === option.value)) return;
        const next = [...selectedGroupOptions, option];
        setSelectedGroupOptions(next);
        setGroupSearchQuery('');
        setGroupSearchResults([]);
    };

    const removeGroup = async (option) => {
        const next = selectedGroupOptions.filter(o => o.value !== option.value);
        setSelectedGroupOptions(next);
    };

    const addEmployee = async (employee) => {
        setSelectedEmployees(prev => [...prev, employee]);
        setAllEmployees(prev => prev.filter(emp => emp.username !== employee.username));
    };

    const removeEmployee = async (employee) => {
        setAllEmployees(prev => [...prev, employee]);
        setSelectedEmployees(prev => prev.filter(emp => emp.username !== employee.username));
    };

    const addAllEmployees = async () => {
        const toAdd = filteredAvailableEmployees;
        setSelectedEmployees(prev => [...prev, ...toAdd]);
        setAllEmployees(prev => prev.filter(emp => !toAdd.some(e => e.username === emp.username)));
    };

    const removeAllEmployees = async () => {
        setAllEmployees(prev => [...prev, ...selectedEmployees]);
        setSelectedEmployees([]);
    };

    const handleCaSelect = async (item) => {
        setSelectedCaDisplay({ 
            username: item.username, 
            name: item.name,
            email: item.email,
            mobile: item.mobile,
            country_code: item.country_code
        });
        setCaSearchQuery('');
        setCaSearchResults([]);
    };

    const handleCaClear = async () => {
        setSelectedCaDisplay(null);
    };

    const handleAgentSelect = async (item) => {
        setSelectedAgentDisplay({ username: item.username, name: item.name });
        setAgentSearchQuery('');
        setAgentSearchResults([]);
    };

    const handleAgentClear = async () => {
        setSelectedAgentDisplay(null);
    };

    // Client selection handler
    const handleClientSelect = async (client) => {
        setSelectedClientDisplay({
            client_id: client.client_id,
            name: client.name
        });
        setClientSearchQuery('');
        setClientSearchResults([]);
    };

    const handleClientClear = async () => {
        setSelectedClientDisplay(null);
    };

    const toggleAssessmentYear = async (year) => {
        const current = [...(taskData.service?.assisment_years || [])];
        const idx = current.indexOf(year);
        if (idx >= 0) current.splice(idx, 1);
        else current.push(year);
        
        // Sort years in descending order
        current.sort((a, b) => b - a);
        
        setTaskData(prev => ({
            ...prev,
            service: {
                ...prev.service,
                assisment_years: current
            }
        }));
    };

    const toggleFinancialYear = async (year) => {
        const current = [...(taskData.service?.financial_years || [])];
        const idx = current.indexOf(year);
        if (idx >= 0) current.splice(idx, 1);
        else current.push(year);
        
        // Sort years in descending order
        current.sort((a, b) => b - a);
        
        setTaskData(prev => ({
            ...prev,
            service: {
                ...prev.service,
                financial_years: current
            }
        }));
    };

    // Format due date for DatePicker
    const formatDueDateForDisplay = (dateStr) => {
        if (!dateStr) return null;
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const [y, m, d] = parts;
            return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        }
        return null;
    };

    // Transform API data to display format
    const displayData = {
        service: taskData.service?.name || 'N/A',
        service_category: taskData.service?.category_name || 'N/A',
        client: taskData.client?.profile?.name || taskData.client?.name || 'N/A',
        firm: taskData.firm?.firm_name || 'N/A',
        firm_owner: firmOwnerDisplay?.name || taskData.firm?.owner_name || 'N/A',
        status: taskData.status ? taskData.status.charAt(0).toUpperCase() + taskData.status.slice(1) : 'N/A',
        billing_status: taskData.billing_status ? taskData.billing_status.charAt(0).toUpperCase() + taskData.billing_status.slice(1) : 'N/A',
        fees: taskData.charges?.fees || 0,
        tax_rate: taskData.charges?.tax_rate || 0,
        tax_value: taskData.charges?.tax_value || 0,
        total: taskData.charges?.total || 0,
        due_date: formatDate(taskData.dates?.due_date),
        target_date: formatDate(taskData.dates?.target_date),
        create_date: taskData.dates?.create_date ? new Date(taskData.dates.create_date).toLocaleString() : 'N/A',
        created_by: taskData.create_by?.name || 'N/A',
        modified_by: taskData.modify_by?.name || 'N/A',
        is_recurring: taskData.is_recurring ? 'Yes' : 'No',
        has_ca: taskData.has_ca ? 'Yes' : 'No',
        has_agent: taskData.has_agent ? 'Yes' : 'No'
    };

    const DetailRow = ({ label, value, field, type = 'text', options = [] }) => (
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="font-medium text-gray-700 text-sm">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">{value}</span>
            </div>
        </div>
    );

    return (
        <>
            <style>{datePickerStyles}</style>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FiClipboard className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Task Information</h3>
                    </div>
                    
                    {/* Edit/Save/Cancel Buttons */}
                    <div className="flex items-center gap-3">
                        {!isEditing ? (
                            <motion.button
                                onClick={handleEditClick}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiEdit className="w-4 h-4" />
                                Edit Task
                            </motion.button>
                        ) : (
                            <>
                                <motion.button
                                    onClick={handleSaveChanges}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isSaving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                                    Save Changes
                                </motion.button>
                                <motion.button
                                    onClick={handleCancelEdit}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium text-sm flex items-center gap-2 disabled:opacity-50"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiX className="w-4 h-4" />
                                    Cancel
                                </motion.button>
                            </>
                        )}
                    </div>

                    {/* Status Messages */}
                    <div className="flex items-center gap-3">
                        {saveSuccess && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-1"
                            >
                                <FiCheck className="w-4 h-4" />
                                {saveSuccess}
                            </motion.div>
                        )}
                        {saveError && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-1"
                            >
                                <FiX className="w-4 h-4" />
                                {saveError}
                            </motion.div>
                        )}
                    </div>
                </div>

                {!isEditing ? (
                    // View Mode
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Task Details */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-600 mb-4 pb-2 border-b">Task Details</h4>
                            <DetailRow label="CLIENT" value={displayData.client} />
                            <DetailRow label="SERVICE" value={displayData.service} />
                            <DetailRow label="SERVICE CATEGORY" value={displayData.service_category} />
                            <DetailRow label="FIRM" value={displayData.firm} />
                            <DetailRow label="FIRM OWNER" value={displayData.firm_owner} />
                            <DetailRow label="STATUS" value={displayData.status} />
                            <DetailRow label="BILLING STATUS" value={displayData.billing_status} />
                            <DetailRow label="FEES" value={`₹${displayData.fees}`} />
                            <DetailRow label="TAX RATE" value={`${displayData.tax_rate}%`} />
                            <DetailRow label="TAX VALUE" value={`₹${displayData.tax_value}`} />
                            <DetailRow label="TOTAL" value={`₹${displayData.total}`} />
                            <DetailRow label="IS RECURRING" value={displayData.is_recurring} />
                        </div>

                        {/* Right Column - Assignment Details */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-600 mb-4 pb-2 border-b">Assignment Details</h4>
                            <DetailRow label="DUE DATE" value={displayData.due_date} />
                            <DetailRow label="TARGET DATE" value={displayData.target_date} />
                            <DetailRow label="CREATE DATE" value={displayData.create_date} />
                            <DetailRow label="CREATED BY" value={displayData.created_by} />
                            <DetailRow label="MODIFIED BY" value={displayData.modified_by} />
                            <DetailRow label="CA" value={selectedCaDisplay?.name || (selectedCaDisplay?.username) || 'N/A'} />
                            <DetailRow label="AGENT" value={selectedAgentDisplay?.name || 'N/A'} />
                            <DetailRow label="HAS CA" value={displayData.has_ca} />
                            <DetailRow label="HAS AGENT" value={displayData.has_agent} />
                        </div>
                    </div>
                ) : (
                    // Edit Mode
                    <>
                        {/* Firms Section */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FiUser className="w-4 h-4" /> Firms
                            </h4>
                            <div className="space-y-3">
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={firmSearchQuery}
                                        onChange={(e) => setFirmSearchQuery(e.target.value)}
                                        placeholder="Search firms to add (min 3 characters)..."
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                
                                {/* Search Results */}
                                {firmSearchQuery.trim().length >= 3 && (
                                    <div className="bg-white border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                                        {firmSearchLoading && (
                                            <div className="p-3 text-sm text-gray-500 text-center">Searching...</div>
                                        )}
                                        {!firmSearchLoading && firmSearchResults.length === 0 && (
                                            <div className="p-3 text-sm text-gray-500 text-center">No firms found</div>
                                        )}
                                        {!firmSearchLoading && firmSearchResults
                                            .filter(f => !selectedFirmOptions.some(s => s.value === f.value))
                                            .map((opt) => (
                                                <div
                                                    key={opt.value}
                                                    onClick={() => addFirm(opt)}
                                                    className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                                                >
                                                    <div className="font-medium text-sm">{opt.label}</div>
                                                    <div className="text-xs text-gray-500">Owner: {opt.owner_name}</div>
                                                </div>
                                            ))}
                                    </div>
                                )}

                                {/* Selected Firms */}
                                <div className="flex flex-wrap gap-2">
                                    {selectedFirmOptions.map(opt => (
                                        <div
                                            key={opt.value}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                                        >
                                            <span>{opt.label}</span>
                                            <span className="text-xs text-blue-600">(Owner: {opt.owner_name})</span>
                                            <button
                                                onClick={() => removeFirm(opt)}
                                                className="p-0.5 hover:bg-blue-200 rounded"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Groups Section - Fixed */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FiUsers className="w-4 h-4" /> Groups
                            </h4>
                            <div className="space-y-3">
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={groupSearchQuery}
                                        onChange={(e) => setGroupSearchQuery(e.target.value)}
                                        placeholder="Search groups to add (min 3 characters)..."
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                
                                {/* Search Results */}
                                {groupSearchQuery.trim().length >= 3 && (
                                    <div className="bg-white border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                                        {groupSearchLoading && (
                                            <div className="p-3 text-sm text-gray-500 text-center">Searching...</div>
                                        )}
                                        {!groupSearchLoading && groupSearchResults.length === 0 && (
                                            <div className="p-3 text-sm text-gray-500 text-center">No groups found</div>
                                        )}
                                        {!groupSearchLoading && groupSearchResults
                                            .filter(g => !selectedGroupOptions.some(s => s.value === g.value))
                                            .map((opt) => (
                                                <div
                                                    key={opt.value}
                                                    onClick={() => opt.firm_count > 0 && addGroup(opt)}
                                                    className={`p-2 border-b border-gray-100 last:border-0 cursor-pointer ${
                                                        opt.firm_count === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
                                                    }`}
                                                >
                                                    <div className="font-medium text-sm">{opt.label}</div>
                                                    <div className="text-xs text-gray-500">{opt.firm_count || 0} firms</div>
                                                </div>
                                            ))}
                                    </div>
                                )}

                                {/* Selected Groups */}
                                <div className="flex flex-wrap gap-2">
                                    {selectedGroupOptions.map(opt => (
                                        <div
                                            key={opt.value}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                                        >
                                            <span>{opt.label}</span>
                                            <span className="text-xs text-blue-600">({opt.firm_count} firms)</span>
                                            <button
                                                onClick={() => removeGroup(opt)}
                                                className="p-0.5 hover:bg-blue-200 rounded"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Task Details */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-600 mb-4 pb-2 border-b">Task Details</h4>
                                
                                {/* Client Selection - Fixed */}
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-700 text-sm">CLIENT</span>
                                    <div className="flex items-center gap-2">
                                        {selectedClientDisplay ? (
                                            <>
                                                <span className="text-gray-900">{selectedClientDisplay.name}</span>
                                                <button
                                                    onClick={handleClientClear}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <FiX className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={clientSearchQuery}
                                                    onChange={(e) => setClientSearchQuery(e.target.value)}
                                                    placeholder={selectedFirmOptions.length === 0 ? "Select firms first..." : "Search client (min 3 chars)..."}
                                                    disabled={selectedFirmOptions.length === 0}
                                                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                />
                                                {clientSearchQuery.trim().length >= 3 && (
                                                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[250px] max-h-60 overflow-y-auto">
                                                        {clientSearchLoading && <div className="p-2 text-sm text-center">Searching...</div>}
                                                        {!clientSearchLoading && clientSearchResults.length === 0 && (
                                                            <div className="p-2 text-sm text-gray-500 text-center">No clients found</div>
                                                        )}
                                                        {!clientSearchLoading && clientSearchResults.map(client => (
                                                            <button
                                                                key={client.client_id}
                                                                onClick={() => handleClientSelect(client)}
                                                                className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 border-b border-gray-100 last:border-0"
                                                            >
                                                                <div className="font-medium">{client.name}</div>
                                                                {client.email && <div className="text-xs text-gray-500">{client.email}</div>}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                {clientSearchQuery.trim().length > 0 && clientSearchQuery.trim().length < 3 && (
                                                    <p className="absolute left-0 top-full mt-0.5 text-xs text-gray-500">Type at least 3 characters</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-700 text-sm">SERVICE</span>
                                    <select
                                        value={taskData.service?.service_id || ''}
                                        onChange={(e) => setTaskData(prev => ({
                                            ...prev,
                                            service: { ...prev.service, service_id: e.target.value }
                                        }))}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="">Select</option>
                                        {services.map(s => (
                                            <option key={s.service_id} value={s.service_id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-700 text-sm">SERVICE CATEGORY</span>
                                    <select
                                        value={taskData.service?.category_id || ''}
                                        onChange={(e) => setTaskData(prev => ({
                                            ...prev,
                                            service: { ...prev.service, category_id: e.target.value }
                                        }))}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="">Select</option>
                                        {serviceCategories.map(c => (
                                            <option key={c.category_id} value={c.category_id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-700 text-sm">STATUS</span>
                                    <select
                                        value={taskData.status || ''}
                                        onChange={(e) => setTaskData(prev => ({ ...prev, status: e.target.value }))}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="in process">In Process</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                        <option value="assigned">Assigned</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-700 text-sm">BILLING STATUS</span>
                                    <select
                                        value={taskData.billing_status || ''}
                                        onChange={(e) => setTaskData(prev => ({ ...prev, billing_status: e.target.value }))}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="overdue">Overdue</option>
                                        <option value="partial">Partial</option>
                                    </select>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-700 text-sm">FEES (₹)</span>
                                    <input
                                        type="number"
                                        value={taskData.charges?.fees || 0}
                                        onChange={(e) => setTaskData(prev => ({
                                            ...prev,
                                            charges: { ...prev.charges, fees: parseFloat(e.target.value) || 0 }
                                        }))}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-24"
                                    />
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-700 text-sm">TAX RATE (%)</span>
                                    <input
                                        type="number"
                                        value={taskData.charges?.tax_rate || 0}
                                        onChange={(e) => setTaskData(prev => ({
                                            ...prev,
                                            charges: { ...prev.charges, tax_rate: parseFloat(e.target.value) || 0 }
                                        }))}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-20"
                                    />
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-700 text-sm">IS RECURRING</span>
                                    <select
                                        value={taskData.is_recurring ? 'Yes' : 'No'}
                                        onChange={(e) => setTaskData(prev => ({ ...prev, is_recurring: e.target.value === 'Yes' }))}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>

                            {/* Right Column - Assignment Details */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-600 mb-4 pb-2 border-b">Assignment Details</h4>
                                
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-700 text-sm">DUE DATE</span>
                                    <input
                                        type="date"
                                        value={taskData.dates?.due_date ? new Date(taskData.dates.due_date).toISOString().split('T')[0] : ''}
                                        onChange={(e) => setTaskData(prev => ({
                                            ...prev,
                                            dates: { ...prev.dates, due_date: e.target.value }
                                        }))}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-700 text-sm">TARGET DATE</span>
                                    <input
                                        type="date"
                                        value={taskData.dates?.target_date ? new Date(taskData.dates.target_date).toISOString().split('T')[0] : ''}
                                        onChange={(e) => setTaskData(prev => ({
                                            ...prev,
                                            dates: { ...prev.dates, target_date: e.target.value }
                                        }))}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                
                                {/* CA Selection - Updated with detailed display */}
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-700 text-sm">CA</span>
                                    <div className="flex items-center gap-2">
                                        {selectedCaDisplay ? (
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <div className="text-gray-900 font-medium">{selectedCaDisplay.name}</div>
                                                    {(selectedCaDisplay.email || selectedCaDisplay.mobile) && (
                                                        <div className="text-xs text-gray-500">
                                                            {selectedCaDisplay.email && <div>{selectedCaDisplay.email}</div>}
                                                            {selectedCaDisplay.mobile && <div>+{selectedCaDisplay.country_code || '91'} {selectedCaDisplay.mobile}</div>}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={handleCaClear}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Remove CA"
                                                >
                                                    <FiX className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={caSearchQuery}
                                                    onChange={(e) => setCaSearchQuery(e.target.value)}
                                                    placeholder="Search CA..."
                                                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                />
                                                {caSearchQuery.trim().length >= 3 && (
                                                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[300px] max-h-80 overflow-y-auto">
                                                        {caSearchLoading && <div className="p-2 text-sm text-center">Searching...</div>}
                                                        {!caSearchLoading && caSearchResults.length === 0 && (
                                                            <div className="p-2 text-sm text-gray-500 text-center">No results</div>
                                                        )}
                                                        {!caSearchLoading && caSearchResults.map(item => (
                                                            <button
                                                                key={item.username}
                                                                onClick={() => handleCaSelect(item)}
                                                                className="w-full px-3 py-2.5 text-left text-sm hover:bg-blue-50 border-b border-gray-100 last:border-0"
                                                            >
                                                                <div className="font-medium text-gray-900">{item.name}</div>
                                                                <div className="text-xs text-gray-500 mt-0.5 space-y-0.5">
                                                                    {item.email && <div>{item.email}</div>}
                                                                    {item.mobile && <div>+{item.country_code || '91'} {item.mobile}</div>}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Agent Selection */}
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-700 text-sm">Agent</span>
                                    <div className="flex items-center gap-2">
                                        {selectedAgentDisplay ? (
                                            <>
                                                <span className="text-gray-900">{selectedAgentDisplay.name}</span>
                                                <button
                                                    onClick={handleAgentClear}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <FiX className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={agentSearchQuery}
                                                    onChange={(e) => setAgentSearchQuery(e.target.value)}
                                                    placeholder="Search Agent..."
                                                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                />
                                                {agentSearchQuery.trim().length >= 3 && (
                                                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                                                        {agentSearchLoading && <div className="p-2 text-sm">Searching...</div>}
                                                        {!agentSearchLoading && agentSearchResults.length === 0 && (
                                                            <div className="p-2 text-sm text-gray-500">No results</div>
                                                        )}
                                                        {!agentSearchLoading && agentSearchResults.map(item => (
                                                            <button
                                                                key={item.username}
                                                                onClick={() => handleAgentSelect(item)}
                                                                className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 border-b border-gray-100 last:border-0"
                                                            >
                                                                <div className="font-medium">{item.name}</div>
                                                                {item.mobile && <div className="text-xs text-gray-500">{item.mobile}</div>}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-700 text-sm">HAS CA</span>
                                    <select
                                        value={taskData.has_ca ? 'Yes' : 'No'}
                                        onChange={(e) => setTaskData(prev => ({ ...prev, has_ca: e.target.value === 'Yes' }))}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="font-medium text-gray-700 text-sm">HAS AGENT</span>
                                    <select
                                        value={taskData.has_agent ? 'Yes' : 'No'}
                                        onChange={(e) => setTaskData(prev => ({ ...prev, has_agent: e.target.value === 'Yes' }))}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Assessment Years */}
                        {taskData.service?.has_assisment_year && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-600 mb-4">Assessment Years (AY)</h4>
                                <div className="flex flex-wrap gap-2">
                                    {assessmentYearsList.map(year => (
                                        <button
                                            key={year}
                                            onClick={() => toggleAssessmentYear(year)}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                                                taskData.service?.assisment_years?.includes(year)
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            AY {year}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Financial Years */}
                        {taskData.service?.has_financial_year && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-600 mb-4">Financial Years (FY)</h4>
                                <div className="flex flex-wrap gap-2">
                                    {financialYearsList.map(year => (
                                        <button
                                            key={year}
                                            onClick={() => toggleFinancialYear(year)}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                                                taskData.service?.financial_years?.includes(year)
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            FY {year}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Staff Information */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
                                <FiUsers className="w-4 h-4" /> Assigned Staff
                            </h4>
                            
                            {/* Employee search and selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">Available Employees</p>
                                    <div className="relative mb-2">
                                        <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={employeeSearchQuery}
                                            onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                                            placeholder="Search employees..."
                                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                                        {staffLoading && <div className="p-3 text-sm text-gray-500">Loading...</div>}
                                        {!staffLoading && filteredAvailableEmployees.map(emp => (
                                            <div
                                                key={emp.username}
                                                onClick={() => addEmployee(emp)}
                                                className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                                            >
                                                <div className="font-medium text-sm">{emp.name}</div>
                                                <div className="text-xs text-gray-500">{emp.department || emp.mobile}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={addAllEmployees}
                                        disabled={filteredAvailableEmployees.length === 0}
                                        className="mt-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Add All
                                    </button>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">Selected Employees</p>
                                    <div className="bg-white border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                                        {selectedEmployees.map(emp => (
                                            <div
                                                key={emp.username}
                                                onClick={() => removeEmployee(emp)}
                                                className="p-2 hover:bg-red-50 cursor-pointer border-b border-gray-100 last:border-0"
                                            >
                                                <div className="font-medium text-sm">{emp.name}</div>
                                                <div className="text-xs text-gray-500">{emp.department || emp.mobile}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={removeAllEmployees}
                                        disabled={selectedEmployees.length === 0}
                                        className="mt-2 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Remove All
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default DetailsTab;