import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiSave, FiX, FiRefreshCw } from 'react-icons/fi';
import API_BASE_URL from "../utils/api-controller";
import getHeaders from "../utils/get-headers";

const ProfileTab = ({ staffData, setStaffData, variants, username }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(staffData);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Update edited data when staffData changes
    useEffect(() => {
        setEditedData(staffData);
    }, [staffData]);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const headers = await getHeaders();
            if (!headers) {
                throw new Error('Authentication failed. Please login again.');
            }
            
            // Prepare data for API update
            const updateData = {
                firstName: editedData.firstName,
                lastName: editedData.lastName,
                email: editedData.email,
                mobile: editedData.phone.replace(/[^0-9]/g, ''), // Remove country code and spaces
                country_code: '91', // Default country code
                designation: editedData.designation,
                dob: editedData.dateOfBirth,
                gender: editedData.gender,
                address: {
                    state: editedData.address.state,
                    district: editedData.address.district,
                    city: editedData.address.city,
                    address_line_1: editedData.address.line1,
                    address_line_2: editedData.address.line2
                }
            };

            console.log('Updating profile with data:', updateData);

            const response = await fetch(
                `${API_BASE_URL}/settings/staff/profile/update/?username=${username}`,
                {
                    method: 'PUT', // or 'POST' depending on your API
                    headers: headers,
                    body: JSON.stringify(updateData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Failed to update profile: ${response.status}`);
            }

            console.log('Profile update response:', data);
            
            // Update parent component with new data
            setStaffData(editedData);
            setIsEditing(false);
            setSuccess('Profile updated successfully');
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
            
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Failed to update profile');
            
            // Clear error message after 5 seconds
            setTimeout(() => setError(null), 5000);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedData(staffData);
        setIsEditing(false);
        setError(null);
        setSuccess(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setEditedData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setEditedData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                <div className="flex items-center gap-3">
                    {/* Success Message */}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-lg"
                        >
                            {success}
                        </motion.div>
                    )}
                    
                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}
                    
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <FiEdit2 className="w-4 h-4" />
                            Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <FiRefreshCw className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="w-4 h-4" />
                                        Save
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <FiX className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* About Section */}
                <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-700 border-b pb-2">About</h3>
                    <div className="space-y-3">
                        <ProfileField
                            label="Designation"
                            value={editedData.designation}
                            name="designation"
                            isEditing={isEditing}
                            onChange={handleChange}
                        />
                        <ProfileField
                            label="Full Name"
                            value={editedData.fullName}
                            name="fullName"
                            isEditing={isEditing}
                            onChange={handleChange}
                        />
                        <ProfileField
                            label="Date of Birth"
                            value={editedData.dateOfBirth}
                            name="dateOfBirth"
                            isEditing={isEditing}
                            onChange={handleChange}
                            type="date"
                        />
                        <ProfileField
                            label="Gender"
                            value={editedData.gender}
                            name="gender"
                            isEditing={isEditing}
                            onChange={handleChange}
                            type="select"
                            options={['Male', 'Female', 'Other']}
                        />
                    </div>
                </div>

                {/* Contacts Section */}
                <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-700 border-b pb-2">Contacts</h3>
                    <div className="space-y-3">
                        <ProfileField
                            label="Mobile"
                            value={editedData.phone}
                            name="phone"
                            isEditing={isEditing}
                            onChange={handleChange}
                        />
                        <ProfileField
                            label="Email"
                            value={editedData.email}
                            name="email"
                            isEditing={isEditing}
                            onChange={handleChange}
                            type="email"
                        />
                    </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4 md:col-span-2">
                    <h3 className="text-md font-medium text-gray-700 border-b pb-2">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProfileField
                            label="State"
                            value={editedData.address.state}
                            name="address.state"
                            isEditing={isEditing}
                            onChange={handleChange}
                        />
                        <ProfileField
                            label="District"
                            value={editedData.address.district}
                            name="address.district"
                            isEditing={isEditing}
                            onChange={handleChange}
                        />
                        <ProfileField
                            label="City/Town"
                            value={editedData.address.city}
                            name="address.city"
                            isEditing={isEditing}
                            onChange={handleChange}
                        />
                        <ProfileField
                            label="Address Line 1"
                            value={editedData.address.line1}
                            name="address.line1"
                            isEditing={isEditing}
                            onChange={handleChange}
                        />
                        <ProfileField
                            label="Address Line 2"
                            value={editedData.address.line2}
                            name="address.line2"
                            isEditing={isEditing}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ProfileField = ({ label, value, name, isEditing, onChange, type = 'text', options = [] }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
            {isEditing ? (
                type === 'select' ? (
                    <select
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select {label}</option>
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )
            ) : (
                <p className="text-gray-900">{value || 'Not specified'}</p>
            )}
        </div>
    );
};

export default ProfileTab;