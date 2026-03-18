import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_BASE_URL from "../utils/api-controller";
import getHeaders from "../utils/get-headers";

const SalaryTab = ({ salary, setSalary, variants }) => {
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [salaryHistory, setSalaryHistory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [updatingDay, setUpdatingDay] = useState(null);
    const [weeklyOffData, setWeeklyOffData] = useState(null);
    const [loadingWeeklyOff, setLoadingWeeklyOff] = useState(false);
    const [newSalary, setNewSalary] = useState({
        username: '',
        monthly_salary: '',
        effective_from: ''
    });
    
    const location = useLocation();
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Extract username from URL query parameters
    const getUsernameFromUrl = () => {
        const params = new URLSearchParams(location.search);
        return params.get('username');
    };

    // Fetch salary history and weekly off when component mounts or username changes
    useEffect(() => {
        const username = getUsernameFromUrl();
        if (username) {
            setNewSalary(prev => ({ ...prev, username }));
            fetchSalaryHistory(username);
            fetchWeeklyOff(username);
        }
    }, [location.search]);

    const fetchWeeklyOff = async (username) => {
        try {
            setLoadingWeeklyOff(true);
            const response = await fetch(
                `${API_BASE_URL}/attendance/admin/get-weekly-off?username=${username}`,
                {
                    method: 'GET',
                    headers: getHeaders()
                }
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch weekly off');
            }
            
            const data = await response.json();
            if (data.success) {
                setWeeklyOffData(data.data);
                
                // Update salary state with weekly off data
                if (data.data && data.data.weekly_off && data.data.weekly_off.weekly_off_day) {
                    setSalary(prev => {
                        const updatedList = prev.list.map(item => {
                            if (item.isActive) {
                                return { 
                                    ...item, 
                                    paidLeave: [data.data.weekly_off.weekly_off_day]
                                };
                            }
                            return item;
                        });
                        return { ...prev, list: updatedList };
                    });
                }
            }
        } catch (err) {
            console.error('Error fetching weekly off:', err);
            toast.error(`Error fetching weekly off: ${err.message}`);
        } finally {
            setLoadingWeeklyOff(false);
        }
    };

    const fetchSalaryHistory = async (username) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(
                `${API_BASE_URL}/attendance/admin/salary-history?username=${username}`,
                {
                    method: 'GET',
                    headers: getHeaders()
                }
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch salary history');
            }
            
            const data = await response.json();
            if (data.success) {
                setSalaryHistory(data.data);
                
                // Update salary list with history data
                if (data.data.history && data.data.history.length > 0) {
                    const formattedHistory = data.data.history.map(item => ({
                        id: item.id,
                        salary_id: item.salary_id,
                        map_id: item.map_id,
                        amount: parseFloat(item.monthly_salary).toLocaleString('en-IN'),
                        monthly_salary: item.monthly_salary,
                        applyOT: 'No',
                        applyFine: 'No',
                        officeTime: '09:00 AM',
                        workingHour: '8 Hours',
                        graceTime: '15 mins',
                        effectiveFrom: new Date(item.effective_from).toLocaleDateString('en-IN'),
                        effectiveFrom_raw: item.effective_from,
                        effectiveTo: item.effective_to,
                        isActive: item.is_active === '1',
                        paidLeave: []
                    }));
                    
                    setSalary({
                        list: formattedHistory
                    });
                } else if (data.data.current) {
                    const currentItem = data.data.current;
                    const formattedCurrent = [{
                        id: currentItem.id,
                        salary_id: currentItem.salary_id,
                        map_id: currentItem.map_id,
                        amount: parseFloat(currentItem.monthly_salary).toLocaleString('en-IN'),
                        monthly_salary: currentItem.monthly_salary,
                        applyOT: 'No',
                        applyFine: 'No',
                        officeTime: '09:00 AM',
                        workingHour: '8 Hours',
                        graceTime: '15 mins',
                        effectiveFrom: new Date(currentItem.effective_from).toLocaleDateString('en-IN'),
                        effectiveFrom_raw: currentItem.effective_from,
                        effectiveTo: currentItem.effective_to,
                        isActive: currentItem.is_active === '1',
                        paidLeave: []
                    }];
                    
                    setSalary({
                        list: formattedCurrent
                    });
                }
            }
        } catch (err) {
            setError(err.message);
            toast.error(`Error fetching salary history: ${err.message}`);
            console.error('Error fetching salary history:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNewSalary = async () => {
        const username = getUsernameFromUrl();
        if (!username || !newSalary.monthly_salary || !newSalary.effective_from) {
            toast.warning('Please fill in all fields');
            return;
        }

        const loadingToast = toast.loading('Adding salary structure...');

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(
                `${API_BASE_URL}/attendance/admin/set-salary`,
                {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify({
                        username: username,
                        monthly_salary: parseFloat(newSalary.monthly_salary),
                        effective_from: newSalary.effective_from
                    })
                }
            );
            
            if (!response.ok) {
                throw new Error('Failed to add salary');
            }
            
            const data = await response.json();
            if (data.success) {
                toast.update(loadingToast, {
                    render: 'Salary added successfully!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000
                });
                setShowAddForm(false);
                setNewSalary(prev => ({ ...prev, monthly_salary: '', effective_from: '' }));
                fetchSalaryHistory(username);
            }
        } catch (err) {
            setError(err.message);
            toast.update(loadingToast, {
                render: `Failed to add salary: ${err.message}`,
                type: 'error',
                isLoading: false,
                autoClose: 5000
            });
            console.error('Error adding salary:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (day) => {
        const username = getUsernameFromUrl();
        if (!username) {
            toast.error('No username selected');
            return;
        }

        const currentActiveSalary = salary.list.find(item => item.isActive);
        const currentPaidLeaveDays = currentActiveSalary?.paidLeave || [];
        const isCurrentlyPaid = currentPaidLeaveDays.includes(day);
        
        if (!isCurrentlyPaid && currentPaidLeaveDays.length > 0) {
            const currentPaidDay = currentPaidLeaveDays[0];
            
            const confirmResult = await new Promise((resolve) => {
                toast.info(
                    <div>
                        <p className="font-medium">Change Weekly Off?</p>
                        <p className="text-sm mt-1">
                            You already have {currentPaidDay} as weekly off. 
                            Setting {day} as weekly off will replace it.
                        </p>
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => {
                                    toast.dismiss();
                                    resolve(true);
                                }}
                                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                            >
                                Yes, Replace
                            </button>
                            <button
                                onClick={() => {
                                    toast.dismiss();
                                    resolve(false);
                                }}
                                className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>,
                    {
                        autoClose: false,
                        closeOnClick: false,
                        draggable: false
                    }
                );
            });

            if (!confirmResult) {
                return;
            }
        }

        const newStatus = !isCurrentlyPaid;
        const action = newStatus ? 'Setting' : 'Removing';
        const toggleToast = toast.loading(`${action} ${day} as weekly off...`);

        try {
            setUpdatingDay(day);
            setError(null);
            
            const response = await fetch(
                `${API_BASE_URL}/attendance/admin/set-weekly-off`,
                {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify({
                        username: username,
                        weekly_off_day: day,
                        is_active: newStatus ? "1" : "0"
                    })
                }
            );
            
            if (!response.ok) {
                throw new Error('Failed to update weekly off');
            }
            
            const data = await response.json();
            if (data.success) {
                toast.update(toggleToast, {
                    render: newStatus 
                        ? `${day} is now set as weekly off` 
                        : `${day} removed from weekly off`,
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000
                });
                
                // Update weekly off data
                setWeeklyOffData({
                    ...weeklyOffData,
                    weekly_off: {
                        weekly_off_day: newStatus ? day : null,
                        is_active: newStatus
                    }
                });
                
                setSalary(prev => {
                    const updatedList = prev.list.map(item => {
                        if (item.isActive) {
                            const updatedPaidLeave = newStatus ? [day] : [];
                            return { ...item, paidLeave: updatedPaidLeave };
                        }
                        return item;
                    });
                    return { ...prev, list: updatedList };
                });
            }
        } catch (err) {
            setError(err.message);
            toast.update(toggleToast, {
                render: `Failed to update weekly off: ${err.message}`,
                type: 'error',
                isLoading: false,
                autoClose: 5000
            });
            console.error('Error updating weekly off:', err);
        } finally {
            setUpdatingDay(null);
        }
    };

    const handleEdit = (id) => {
        setEditingId(id);
        toast.info('Edit mode activated');
    };

    const handleSave = (id) => {
        setEditingId(null);
        toast.success('Salary updated successfully!');
    };

    const handleDelete = async (id) => {
        const confirmDelete = await new Promise((resolve) => {
            toast.warning(
                <div>
                    <p className="font-medium">Delete Salary Entry?</p>
                    <p className="text-sm mt-1">Are you sure you want to delete this salary entry? This action cannot be undone.</p>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => {
                                toast.dismiss();
                                resolve(true);
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                            Yes, Delete
                        </button>
                        <button
                            onClick={() => {
                                toast.dismiss();
                                resolve(false);
                            }}
                            className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>,
                {
                    autoClose: false,
                    closeOnClick: false,
                    draggable: false
                }
            );
        });

        if (confirmDelete) {
            toast.info('Delete functionality to be implemented');
            console.log('Deleting:', id);
        }
    };

    const ToggleSwitch = ({ enabled, onChange, isLoading }) => (
        <button
            onClick={onChange}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                enabled ? 'bg-indigo-600' : 'bg-gray-200'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isLoading ? 'Updating...' : ''}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                } ${isLoading ? 'animate-pulse' : ''}`}
            />
        </button>
    );

    const EditIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    );

    const DeleteIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );

    const PlusIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    );

    const ClockIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const InfoIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    const username = getUsernameFromUrl();

    // Get current weekly off day from either source
    const getCurrentWeeklyOffDay = () => {
        // First check weeklyOffData
        if (weeklyOffData?.weekly_off?.weekly_off_day) {
            return weeklyOffData.weekly_off.weekly_off_day;
        }
        // Then check salary state
        const activeSalary = salary.list.find(item => item.isActive);
        if (activeSalary?.paidLeave?.length > 0) {
            return activeSalary.paidLeave[0];
        }
        return null;
    };

    const currentWeeklyOffDay = getCurrentWeeklyOffDay();

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Salary Management</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {username ? `Managing salary for user: ${username}` : 'Configure salary structure and weekly off'}
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    disabled={!username}
                >
                    <PlusIcon />
                    Add Salary Structure
                </motion.button>
            </div>

            {/* Add Salary Form */}
            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Salary Structure</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                value={username || ''}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Username from URL</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary (₹)</label>
                            <input
                                type="number"
                                value={newSalary.monthly_salary}
                                onChange={(e) => setNewSalary({...newSalary, monthly_salary: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter amount"
                                min="0"
                                step="1000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Effective From</label>
                            <input
                                type="date"
                                value={newSalary.effective_from}
                                onChange={(e) => setNewSalary({...newSalary, effective_from: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddNewSalary}
                            disabled={loading || !newSalary.monthly_salary || !newSalary.effective_from}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Adding...' : 'Add Salary'}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    Error: {error}
                </div>
            )}

            {/* Staff Profile Info */}
            {(salaryHistory?.profile || weeklyOffData?.profile) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-4">
                        {(salaryHistory?.profile?.image || weeklyOffData?.profile?.image) ? (
                            <img 
                                src={salaryHistory?.profile?.image || weeklyOffData?.profile?.image} 
                                alt={salaryHistory?.profile?.name || weeklyOffData?.profile?.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-semibold text-lg">
                                    {(salaryHistory?.profile?.name || weeklyOffData?.profile?.name)?.charAt(0) || 'U'}
                                </span>
                            </div>
                        )}
                        <div>
                            <h3 className="font-semibold text-gray-900">{salaryHistory?.profile?.name || weeklyOffData?.profile?.name}</h3>
                            <p className="text-sm text-gray-600">{salaryHistory?.profile?.designation || weeklyOffData?.profile?.designation}</p>
                            <p className="text-xs text-gray-500">
                                {salaryHistory?.profile?.email || weeklyOffData?.profile?.email} • {salaryHistory?.profile?.mobile || weeklyOffData?.profile?.mobile}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Salary List Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-base font-semibold text-gray-900">Salary Structures</h3>
                </div>
                
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OT / Fine</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grace Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective From</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective To</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {salary.list.length > 0 ? (
                                        salary.list.map((item, index) => (
                                            <motion.tr 
                                                key={item.id || index}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`hover:bg-gray-50 transition-colors ${item.isActive ? 'bg-green-50' : ''}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <span className="font-medium">{salaryHistory?.profile?.designation || weeklyOffData?.profile?.designation || 'N/A'}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-semibold text-gray-900">₹{item.amount}</span>
                                                    <span className="text-xs text-gray-500 ml-1">/-</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.isActive ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                            item.applyOT === 'Yes' 
                                                                ? 'bg-blue-100 text-blue-700' 
                                                                : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            Overtime: {item.applyOT}
                                                        </span>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                            item.applyFine === 'Yes' 
                                                                ? 'bg-orange-100 text-orange-700' 
                                                                : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            Fine: {item.applyFine}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <ClockIcon />
                                                        <span>{item.officeTime}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {item.workingHour}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {item.graceTime}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                                        {item.effectiveFrom}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                                        {item.effectiveTo ? new Date(item.effectiveTo).toLocaleDateString('en-IN') : 'Current'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleEdit(item.id)}
                                                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                                            title="Edit"
                                                        >
                                                            <EditIcon />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                                            title="Delete"
                                                        >
                                                            <DeleteIcon />
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="11" className="px-6 py-8 text-center text-gray-500">
                                                {username ? (
                                                    <>
                                                        No salary structures found for user {username}. 
                                                        Click "Add Salary Structure" to create one.
                                                    </>
                                                ) : (
                                                    'No username provided in URL. Please select a staff member.'
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Total {salary.list.length} salary structure{salary.list.length !== 1 ? 's' : ''}
                                </span>
                                {salaryHistory && (
                                    <span className="text-xs text-gray-500">
                                        Last updated: {new Date().toLocaleDateString('en-IN')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Weekly Off Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900">Weekly Off</h3>
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                            One Day Only
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
                        <InfoIcon />
                        <p className="text-xs text-blue-700">
                            Only one day can be marked as weekly off. Selecting a new day will automatically replace the existing weekly off day.
                        </p>
                    </div>

                    {loadingWeeklyOff ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {weekDays.map((day, index) => {
                                const isPaidLeave = day === currentWeeklyOffDay;
                                const isUpdating = updatingDay === day;
                                
                                return (
                                    <motion.div
                                        key={day}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                                            isPaidLeave 
                                                ? 'bg-indigo-50 border border-indigo-200' 
                                                : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${isPaidLeave ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                                            <span className={`text-sm font-medium ${isPaidLeave ? 'text-indigo-700' : 'text-gray-700'}`}>
                                                {day}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs ${isPaidLeave ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>
                                                {isPaidLeave ? 'Weekly Off' : 'Working'}
                                            </span>
                                            <ToggleSwitch 
                                                enabled={isPaidLeave}
                                                onChange={() => handleToggle(day)}
                                                isLoading={isUpdating}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Display current weekly off info */}
                    {currentWeeklyOffDay && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-green-800">Current Weekly Off</h4>
                                    <p className="text-xs text-green-600 mt-1">
                                        {currentWeeklyOffDay} is set as weekly off
                                    </p>
                                </div>
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    Active
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Quick Info */}
                    <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                        <div className="flex items-start gap-3">
                            <div className="p-1 bg-indigo-100 rounded">
                                <ClockIcon />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-indigo-900">Weekly Off Configuration</h4>
                                <p className="text-xs text-indigo-700 mt-1">
                                    The selected day will be considered as the weekly off for this employee. 
                                    Only one day can be selected as weekly off at a time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard
                    title="Total Structures"
                    value={salary.list.length}
                    subtitle="Active salary structures"
                    color="blue"
                />
                <SummaryCard
                    title="Weekly Off Day"
                    value={currentWeeklyOffDay || 'Not Set'}
                    subtitle="Current weekly off day"
                    color="green"
                />
                <SummaryCard
                    title="Current Salary"
                    value={salaryHistory?.current ? `₹${parseFloat(salaryHistory.current.monthly_salary).toLocaleString('en-IN')}` : 'N/A'}
                    subtitle={salaryHistory?.current ? `Effective from ${new Date(salaryHistory.current.effective_from).toLocaleDateString('en-IN')}` : 'No active salary'}
                    color="purple"
                />
            </div>
        </motion.div>
    );
};

const SummaryCard = ({ title, value, subtitle, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-emerald-50 text-emerald-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all"
        >
            <h4 className="text-sm font-medium text-gray-500">{title}</h4>
            <p className={`text-2xl font-bold mt-2 ${colorClasses[color].split(' ')[1]}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </motion.div>
    );
};

export default SalaryTab;