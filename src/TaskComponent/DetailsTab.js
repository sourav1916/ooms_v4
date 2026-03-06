import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiX, FiCheck, FiClipboard, FiLoader } from 'react-icons/fi';
import API_BASE_URL from "../utils/api-controller";
import getHeaders from "../utils/get-headers";
import axios from 'axios';

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

// Format time helper
const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

// Format date for API (YYYY-MM-DD)
const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
};

const DetailsTab = ({ taskData: initialData, task_id }) => {
    const [taskData, setTaskData] = useState(initialData);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(null);

    const handleEdit = (field, value) => {
        setEditingField(field);
        setEditValue(value);
        setSaveError(null);
        setSaveSuccess(null);
    };

    // Function to update task field via API
    const updateTaskField = async (field, value) => {
        const headers = getHeaders();
        if (!headers) {
            setSaveError('Authentication failed. Please login again.');
            return false;
        }

        try {
            setIsSaving(true);
            setSaveError(null);

            // Prepare the request body based on the field being updated
            let requestBody = {};

            // Map frontend fields to API fields
            switch (field) {
                case 'service':
                    requestBody = { service_name: value };
                    break;
                case 'status':
                    requestBody = { status: value.toLowerCase() };
                    break;
                case 'billing_status':
                    requestBody = { billing_status: value.toLowerCase() };
                    break;
                case 'fees':
                    requestBody = { fees: parseFloat(value) || 0 };
                    break;
                case 'tax_rate':
                    requestBody = { tax_rate: parseFloat(value) || 0 };
                    break;
                case 'due_date':
                case 'target_date':
                    requestBody = { [field]: formatDateForAPI(value) };
                    break;
                case 'is_recurring':
                case 'has_ca':
                case 'has_agent':
                    requestBody = { [field]: value === 'Yes' };
                    break;
                default:
                    // For other fields, assume they can be updated directly
                    requestBody = { [field]: value };
            }

            const response = await axios.post(
                `${API_BASE_URL}/task/details/update`,
                {
                    task_id: task_id,
                    ...requestBody
                },
                { headers }
            );

            if (response.data.success) {
                setSaveSuccess(`${field.replace('_', ' ')} updated successfully!`);
                
                // Update local state
                setTaskData(prev => {
                    const newData = { ...prev };
                    
                    // Handle nested updates
                    if (field === 'service') {
                        newData.service = { ...prev.service, name: value };
                    } else if (field === 'fees' || field === 'tax_rate') {
                        // Recalculate total if fees or tax rate changes
                        const fees = field === 'fees' ? parseFloat(value) : prev.charges?.fees;
                        const tax_rate = field === 'tax_rate' ? parseFloat(value) : prev.charges?.tax_rate;
                        const tax_value = (fees * tax_rate) / 100;
                        const total = fees + tax_value;
                        
                        newData.charges = {
                            ...prev.charges,
                            [field]: parseFloat(value),
                            tax_value,
                            total
                        };
                    } else if (field === 'due_date' || field === 'target_date') {
                        newData.dates = {
                            ...prev.dates,
                            [field]: value
                        };
                    } else if (field === 'is_recurring' || field === 'has_ca' || field === 'has_agent') {
                        newData[field] = value === 'Yes';
                    } else {
                        newData[field] = value;
                    }
                    
                    return newData;
                });
                
                return true;
            } else {
                setSaveError(response.data.message || 'Failed to update');
                return false;
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
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        if (!editingField) return;

        const success = await updateTaskField(editingField, editValue);
        if (success) {
            setEditingField(null);
            setEditValue('');
            
            // Clear success message after 3 seconds
            setTimeout(() => setSaveSuccess(null), 3000);
        }
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValue('');
        setSaveError(null);
    };

    const DetailRow = ({ label, value, field, type = 'text' }) => (
        <div className="flex justify-between items-center py-3 border-b border-gray-100 group">
            <span className="font-medium text-gray-700 text-sm">{label}</span>
            {editingField === field ? (
                <div className="flex items-center gap-2">
                    {type === 'select' ? (
                        <select
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                            autoFocus
                            disabled={isSaving}
                        >
                            <option value="">Select</option>
                            {field === 'status' && (
                                <>
                                    <option value="in process">In Process</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="cancelled">Cancelled</option>
                                </>
                            )}
                            {field === 'billing_status' && (
                                <>
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                    <option value="partial">Partial</option>
                                </>
                            )}
                            {field === 'is_recurring' || field === 'has_ca' || field === 'has_agent' ? (
                                <>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </>
                            ) : null}
                        </select>
                    ) : type === 'date' ? (
                        <input
                            type="date"
                            value={editValue ? new Date(editValue).toISOString().split('T')[0] : ''}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                            autoFocus
                            disabled={isSaving}
                        />
                    ) : (
                        <input
                            type={type}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                            autoFocus
                            disabled={isSaving}
                        />
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !editValue}
                        className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiCheck className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-medium">{value}</span>
                    <motion.button
                        onClick={() => handleEdit(field, value)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={isSaving}
                    >
                        <FiEdit className="w-4 h-4" />
                    </motion.button>
                </div>
            )}
        </div>
    );

    // Transform API data to display format
    const displayData = {
        service: taskData.service?.name || 'N/A',
        client: taskData.client?.profile?.name || 'N/A',
        firm: taskData.firm?.firm_name || 'N/A',
        status: taskData.status ? taskData.status.charAt(0).toUpperCase() + taskData.status.slice(1) : 'N/A',
        billing_status: taskData.billing_status ? taskData.billing_status.charAt(0).toUpperCase() + taskData.billing_status.slice(1) : 'N/A',
        fees: taskData.charges?.fees || 0,
        tax_rate: taskData.charges?.tax_rate || 0,
        tax_value: taskData.charges?.tax_value || 0,
        total: taskData.charges?.total || 0,
        due_date: formatDate(taskData.dates?.due_date),
        target_date: formatDate(taskData.dates?.target_date),
        create_date: formatDateTime(taskData.dates?.create_date),
        created_by: taskData.create_by?.name || 'N/A',
        modified_by: taskData.modify_by?.name || 'N/A',
        is_recurring: taskData.is_recurring ? 'Yes' : 'No',
        has_ca: taskData.has_ca ? 'Yes' : 'No',
        has_agent: taskData.has_agent ? 'Yes' : 'No'
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiClipboard className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Task Information</h3>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Task Details */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-600 mb-4 pb-2 border-b">Task Details</h4>
                    <DetailRow label="SERVICE" value={displayData.service} field="service" />
                    <DetailRow label="CLIENT" value={displayData.client} field="client" />
                    <DetailRow label="FIRM" value={displayData.firm} field="firm" />
                    <DetailRow label="STATUS" value={displayData.status} field="status" type="select" />
                    <DetailRow label="BILLING STATUS" value={displayData.billing_status} field="billing_status" type="select" />
                    <DetailRow label="FEES" value={`₹${displayData.fees}`} field="fees" type="number" />
                    <DetailRow label="TAX RATE" value={`${displayData.tax_rate}%`} field="tax_rate" type="number" />
                    <DetailRow label="TAX VALUE" value={`₹${displayData.tax_value}`} field="tax_value" />
                    <DetailRow label="TOTAL" value={`₹${displayData.total}`} field="total" />
                </div>

                {/* Right Column - Assignment Details */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-600 mb-4 pb-2 border-b">Assignment Details</h4>
                    <DetailRow label="DUE DATE" value={displayData.due_date} field="due_date" type="date" />
                    <DetailRow label="TARGET DATE" value={displayData.target_date} field="target_date" type="date" />
                    <DetailRow label="CREATE DATE" value={displayData.create_date} field="create_date" />
                    <DetailRow label="CREATED BY" value={displayData.created_by} field="created_by" />
                    <DetailRow label="MODIFIED BY" value={displayData.modified_by} field="modified_by" />
                    <DetailRow label="IS RECURRING" value={displayData.is_recurring} field="is_recurring" type="select" />
                    <DetailRow label="HAS CA" value={displayData.has_ca} field="has_ca" type="select" />
                    <DetailRow label="HAS AGENT" value={displayData.has_agent} field="has_agent" type="select" />
                </div>
            </div>

            {/* Staff Information */}
            {taskData.staffs && taskData.staffs.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-600 mb-4">Assigned Staff</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {taskData.staffs.map((staff, index) => (
                            <div key={staff.assign_id || index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <p className="font-medium text-gray-900">{staff.name}</p>
                                <p className="text-sm text-gray-600">{staff.email}</p>
                                <p className="text-sm text-gray-600">+{staff.country_code} {staff.mobile}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailsTab;