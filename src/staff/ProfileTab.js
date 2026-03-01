import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';

const ProfileTab = ({ staffData, setStaffData, variants }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(staffData);

    const handleSave = () => {
        setStaffData(editedData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedData(staffData);
        setIsEditing(false);
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
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                        >
                            <FiSave className="w-4 h-4" />
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                            Cancel
                        </button>
                    </div>
                )}
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
                        value={value}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value}
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