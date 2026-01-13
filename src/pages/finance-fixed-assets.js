import React, { useState, useEffect } from 'react';
import { Sidebar, Header } from '../components/menus';
import {
    FiSearch,
    FiPlus,
    FiEdit,
    FiSettings,
    FiDollarSign,
    FiHome,
    FiPieChart
} from 'react-icons/fi';

const FixedAssets = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState('finance');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Form states
    const [formData, setFormData] = useState({
        name: '',
        remark: '',
        opening_balance: '',
        payment_date: ''
    });
    
    const [editFormData, setEditFormData] = useState({
        asset_id: '',
        name: '',
        remark: '',
        opening_balance: '',
        payment_date: ''
    });

    // Mock assets data
    const [assets, setAssets] = useState([
        {
            asset_id: '1',
            name: 'Office Building',
            remark: 'Main office premises',
            opening_balance: 5000000,
            opening_date: '01-01-2023',
            balance_due: 4500000
        },
        {
            asset_id: '2',
            name: 'Company Vehicles',
            remark: 'Fleet cars and trucks',
            opening_balance: 1500000,
            opening_date: '15-03-2023',
            balance_due: 1200000
        },
        {
            asset_id: '3',
            name: 'Computer Equipment',
            remark: 'Servers and workstations',
            opening_balance: 800000,
            opening_date: '20-06-2023',
            balance_due: 600000
        },
        {
            asset_id: '4',
            name: 'Furniture & Fixtures',
            remark: 'Office furniture',
            opening_balance: 300000,
            opening_date: '10-02-2023',
            balance_due: 250000
        }
    ]);

    // Filter assets based on search
    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.remark.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN').format(amount);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle create asset
    const handleCreateAsset = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newAsset = {
                asset_id: (assets.length + 1).toString(),
                ...formData,
                opening_balance: parseFloat(formData.opening_balance),
                balance_due: parseFloat(formData.opening_balance),
                opening_date: formData.payment_date
            };

            setAssets(prev => [...prev, newAsset]);
            setFormData({
                name: '',
                remark: '',
                opening_balance: '',
                payment_date: ''
            });
            setShowAddModal(false);
            setLoading(false);

            // Show success message
            alert('Asset created successfully!');
        }, 1000);
    };

    // Handle edit asset
    const handleEditAsset = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setAssets(prev => prev.map(asset =>
                asset.asset_id === editFormData.asset_id
                    ? {
                        ...asset,
                        name: editFormData.name,
                        remark: editFormData.remark,
                        opening_balance: parseFloat(editFormData.opening_balance),
                        opening_date: editFormData.payment_date
                    }
                    : asset
            ));

            setShowEditModal(false);
            setLoading(false);

            // Show success message
            alert('Asset updated successfully!');
        }, 1000);
    };

    // Handle edit button click
    const handleEditClick = (asset) => {
        setEditFormData({
            asset_id: asset.asset_id,
            name: asset.name,
            remark: asset.remark,
            opening_balance: asset.opening_balance.toString(),
            payment_date: asset.opening_date
        });
        setShowEditModal(true);
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    setSidebarOpen={setSidebarOpen}
                    activePage={activePage}
                    title="Fixed Assets"
                    subtitle="Manage company fixed assets"
                />

                <main className="flex-1 overflow-y-auto p-3">
                    <div className="max-w-7xl mx-auto">
                        {/* Finance Navigation */}
                        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-3">
                            <div className="flex space-x-2">
                                <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded text-sm font-medium">
                                    Report
                                </button>
                                <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded text-sm font-medium">
                                    Entry
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium">
                                    Assets
                                </button>
                                <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded text-sm font-medium">
                                    Analytics
                                </button>
                            </div>
                        </div>

                        {/* Main Card */}
                        <div className="bg-white rounded-md shadow-sm border border-slate-200">
                            {/* Card Header */}
                            <div className="border-b border-slate-200 px-4 py-3">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                                    <h5 className="text-lg font-semibold text-slate-800 mb-0">Fixed Assets</h5>
                                    <div className="flex flex-col lg:flex-row gap-2">
                                        <form className="flex gap-2">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search Anything"
                                                className="px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white outline-none"
                                            />
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors flex items-center gap-2"
                                            >
                                                <FiSearch className="w-4 h-4" />
                                            </button>
                                        </form>
                                        <button
                                            onClick={() => setShowAddModal(true)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <FiPlus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 border-t border-slate-200">
                                            <th className="text-left p-3 font-medium text-slate-700">Sl</th>
                                            <th className="text-left p-3 font-medium text-slate-700">Name</th>
                                            <th className="text-left p-3 font-medium text-slate-700">Remark</th>
                                            <th className="text-right p-3 font-medium text-slate-700">Balance Due</th>
                                            <th className="text-left p-3 font-medium text-slate-700">
                                                <FiSettings className="w-4 h-4" />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAssets.map((asset, index) => (
                                            <tr
                                                key={asset.asset_id}
                                                className="border-b border-slate-100 hover:bg-slate-50"
                                            >
                                                <td className="p-3 text-slate-600">{index + 1}</td>
                                                <td className="p-3 text-slate-800 font-medium">{asset.name}</td>
                                                <td className="p-3 text-slate-600">{asset.remark}</td>
                                                <td className="p-3 text-right">
                                                    <a
                                                        href={`/view-fixed-assets-ledger?asset_id=${asset.asset_id}`}
                                                        className="text-green-600 hover:text-green-800 font-medium"
                                                    >
                                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                            {formatCurrency(asset.balance_due)}
                                                        </span>
                                                    </a>
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => handleEditClick(asset)}
                                                        className="text-green-600 hover:text-green-800 cursor-pointer p-1 rounded hover:bg-green-50"
                                                        title="Edit Asset"
                                                    >
                                                        <FiEdit className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {filteredAssets.length === 0 && (
                                    <div className="text-center py-8 text-slate-400 text-sm">
                                        No assets found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Add Asset Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold text-slate-800">Add New Assets</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleCreateAsset} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter asset name"
                                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Remark</label>
                                <textarea
                                    name="remark"
                                    value={formData.remark}
                                    onChange={handleInputChange}
                                    placeholder="Enter remark"
                                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Opening Balance</label>
                                <input
                                    type="number"
                                    name="opening_balance"
                                    value={formData.opening_balance}
                                    onChange={handleInputChange}
                                    placeholder="Enter opening bal"
                                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Opening Date</label>
                                <input
                                    type="text"
                                    name="payment_date"
                                    value={formData.payment_date}
                                    onChange={handleInputChange}
                                    placeholder="DD-MM-YYYY"
                                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Submit'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 text-slate-600 border border-slate-300 rounded hover:bg-slate-50 text-sm font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Asset Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold text-slate-800">Edit Asset</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleEditAsset} className="p-4 space-y-4">
                            <input type="hidden" name="asset_id" value={editFormData.asset_id} />
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter asset name"
                                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Remark</label>
                                <textarea
                                    name="remark"
                                    value={editFormData.remark}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter remark"
                                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Opening Balance</label>
                                <input
                                    type="number"
                                    name="opening_balance"
                                    value={editFormData.opening_balance}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter opening bal"
                                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Opening Date</label>
                                <input
                                    type="text"
                                    name="payment_date"
                                    value={editFormData.payment_date}
                                    onChange={handleEditInputChange}
                                    placeholder="DD-MM-YYYY"
                                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Updating...' : 'Submit'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-4 py-2 text-slate-600 border border-slate-300 rounded hover:bg-slate-50 text-sm font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FixedAssets;