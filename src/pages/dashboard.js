import React, { useState, useEffect } from 'react';
import { Sidebar, Header } from '../components/header';
import {
    FiTrendingUp,
    FiUsers,
    FiUserCheck,
    FiShoppingCart,
    FiCreditCard,
    FiDollarSign,
    FiCalendar,
    FiPieChart,
    FiBarChart2,
    FiPlus,
    FiRefreshCw,
    FiEye,
    FiEyeOff,
    FiArrowUpRight,
    FiAward
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [loading, setLoading] = useState(false);
    const [blurEnabled, setBlurEnabled] = useState(false);
    const [stats, setStats] = useState({});
    const [taskStats, setTaskStats] = useState([]);
    const [topClients, setTopClients] = useState([]);
    const [serviceWiseSales, setServiceWiseSales] = useState([]);
    const [staffWiseSales, setStaffWiseSales] = useState([]);

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

    // Mock data - replace with actual API calls
    const mockStats = {
        total_sale: 1250000,
        pending_for_billing: 23,
        today_received: 45000,
        creditor: 125000,
        today_payment: 28000,
        debtor: 89000,
        today_birthday: 3,
        total_client: 456,
        new_client: 12,
        active_client: 389,
        total_stuff: 24,
        present_today: 18,
        task_create_today: 45,
        task_complete_today: 38,
        net_profit: 285000
    };

    const mockTaskStats = [
        {
            name: 'GST Filing',
            OD: 2,
            DT: 1,
            D7: 3,
            FT: 8,
            WIP: 5,
            PFC: 2,
            PFD: 1,
            CPL: 15,
            CNL: 0
        },
        {
            name: 'Income Tax',
            OD: 1,
            DT: 0,
            D7: 2,
            FT: 6,
            WIP: 3,
            PFC: 1,
            PFD: 0,
            CPL: 12,
            CNL: 1
        },
        {
            name: 'Company Registration',
            OD: 0,
            DT: 2,
            D7: 1,
            FT: 4,
            WIP: 2,
            PFC: 0,
            PFD: 1,
            CPL: 8,
            CNL: 0
        }
    ];

    const mockTopClients = [
        {
            name: 'Rajesh Kumar',
            guardian_name: 'Suresh Kumar',
            mobile: '+91 9876543210',
            email: 'rajesh@company.com',
            firms: 'Manufacturing, Trading',
            total: 450000
        },
        {
            name: 'Priya Sharma',
            guardian_name: 'Ramesh Sharma',
            mobile: '+91 9876543211',
            email: 'priya@company.com',
            firms: 'Services',
            total: 380000
        },
        {
            name: 'Amit Singh',
            guardian_name: 'Vikram Singh',
            mobile: '+91 9876543212',
            email: 'amit@company.com',
            firms: 'IT Services',
            total: 320000
        }
    ];

    // Load initial data
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        // Simulate API calls
        setTimeout(() => {
            setStats(mockStats);
            setTaskStats(mockTaskStats);
            setTopClients(mockTopClients);
            setLoading(false);
        }, 1500);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-IN').format(number);
    };

    const StatCard = ({ title, value, icon: Icon, color, link, isCurrency = false }) => (
        <a href={link} className="block">
            <motion.div 
                className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className={`rounded-lg p-3 mr-4 ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <div className={`text-lg font-semibold ${blurEnabled ? 'blur' : ''}`}>
                        {isCurrency ? formatCurrency(value) : formatNumber(value)}
                    </div>
                    <div className="text-sm text-gray-600">{title}</div>
                </div>
            </motion.div>
        </a>
    );

    const TaskStatusBadge = ({ count, color, link }) => (
        <a href={link} className="inline-block text-center">
            {count > 0 ? (
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${color}`}>
                    {count}
                </span>
            ) : (
                <span className="text-gray-400 text-sm">{count}</span>
            )}
        </a>
    );

    return (
        <div className="min-h-screen bg-gray-50">
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
                    {/* Subscription Alert */}
                    <motion.div 
                        className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FiAward className="w-5 h-5 text-red-600" />
                                <div>
                                    <div className="font-semibold text-red-800">
                                        ALERT: Your subscription will expire in 7 days.
                                    </div>
                                    <div className="text-red-600 text-sm">
                                        Renew your subscription to continue uninterrupted service
                                    </div>
                                </div>
                            </div>
                            <motion.button 
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Renew Now
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Sales Overview Card */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-end p-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FiTrendingUp className="w-5 h-5 text-green-600" />
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Congratulations! 🎉
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">Current FY Sales</p>
                                    <div className={`text-2xl font-bold text-green-600 mb-4 ${blurEnabled ? 'blur' : ''}`}>
                                        {formatCurrency(stats.total_sale || 0)}
                                    </div>
                                    <motion.button 
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        View Sales Report
                                    </motion.button>
                                </div>
                                <div className="hidden lg:block">
                                    <div className="w-24 h-24 bg-indigo-50 rounded-lg flex items-center justify-center">
                                        <FiBarChart2 className="w-12 h-12 text-indigo-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full">
                                <div className="p-6">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <StatCard
                                            title="Pending Billing"
                                            value={stats.pending_for_billing || 0}
                                            icon={FiCreditCard}
                                            color="bg-indigo-100 text-indigo-600"
                                            link="/view-billing"
                                        />
                                        <StatCard
                                            title="Creditors"
                                            value={stats.creditor || 0}
                                            icon={FiUsers}
                                            color="bg-cyan-100 text-cyan-600"
                                            link="/view-creditors"
                                            isCurrency
                                        />
                                        <StatCard
                                            title="Debtors"
                                            value={stats.debtor || 0}
                                            icon={FiShoppingCart}
                                            color="bg-red-100 text-red-600"
                                            link="/view-debtors"
                                            isCurrency
                                        />
                                        <StatCard
                                            title="Today Received"
                                            value={stats.today_received || 0}
                                            icon={FiDollarSign}
                                            color="bg-green-100 text-green-600"
                                            link="/view-received"
                                            isCurrency
                                        />
                                        <StatCard
                                            title="Today Payment"
                                            value={stats.today_payment || 0}
                                            icon={FiCreditCard}
                                            color="bg-orange-100 text-orange-600"
                                            link="/view-payments"
                                            isCurrency
                                        />
                                        <StatCard
                                            title="Today Birthday"
                                            value={stats.today_birthday || 0}
                                            icon={FiCalendar}
                                            color="bg-purple-100 text-purple-600"
                                            link="/view-birthday-today"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Task Summary */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
                        <div className="border-b border-gray-200 p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <h3 className="text-lg font-semibold text-gray-800">Task Summary</h3>
                                <div className="flex items-center gap-3">
                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <FiRefreshCw className="w-4 h-4" />
                                    </button>
                                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                                        <option value="">All Services</option>
                                        <option value="gst">GST Filing</option>
                                        <option value="tax">Income Tax</option>
                                        <option value="company">Company Registration</option>
                                    </select>
                                    <motion.button 
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiPlus className="w-4 h-4" />
                                        Create Task
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-gray-700 text-sm">SERVICE NAME</th>
                                            <th className="text-center p-4 font-semibold text-gray-700 text-sm">OD</th>
                                            <th className="text-center p-4 font-semibold text-gray-700 text-sm">DT</th>
                                            <th className="text-center p-4 font-semibold text-gray-700 text-sm">D7</th>
                                            <th className="text-center p-4 font-semibold text-gray-700 text-sm">FT</th>
                                            <th className="text-center p-4 font-semibold text-gray-700 text-sm">WIP</th>
                                            <th className="text-center p-4 font-semibold text-gray-700 text-sm">PFC</th>
                                            <th className="text-center p-4 font-semibold text-gray-700 text-sm">PFD</th>
                                            <th className="text-center p-4 font-semibold text-gray-700 text-sm">CPL</th>
                                            <th className="text-center p-4 font-semibold text-gray-700 text-sm">CNL</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {taskStats.map((service, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-medium text-gray-800">{service.name}</td>
                                                <td className="p-4 text-center">
                                                    <TaskStatusBadge
                                                        count={service.OD}
                                                        color="bg-red-100 text-red-800"
                                                        link="/view-task-od"
                                                    />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <TaskStatusBadge
                                                        count={service.DT}
                                                        color="bg-yellow-100 text-yellow-800"
                                                        link="/view-task-dt"
                                                    />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <TaskStatusBadge
                                                        count={service.D7}
                                                        color="bg-blue-100 text-blue-800"
                                                        link="/view-task-d7"
                                                    />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <TaskStatusBadge
                                                        count={service.FT}
                                                        color="bg-green-100 text-green-800"
                                                        link="/view-task-ft"
                                                    />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <TaskStatusBadge
                                                        count={service.WIP}
                                                        color="bg-blue-100 text-blue-800"
                                                        link="/view-task-wip"
                                                    />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <TaskStatusBadge
                                                        count={service.PFC}
                                                        color="bg-yellow-100 text-yellow-800"
                                                        link="/view-task-pfc"
                                                    />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <TaskStatusBadge
                                                        count={service.PFD}
                                                        color="bg-yellow-100 text-yellow-800"
                                                        link="/view-task-pfd"
                                                    />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <TaskStatusBadge
                                                        count={service.CPL}
                                                        color="bg-green-100 text-green-800"
                                                        link="/view-task-cpl"
                                                    />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <TaskStatusBadge
                                                        count={service.CNL}
                                                        color="bg-red-100 text-red-800"
                                                        link="/view-task-cnl"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Service Wise Sales */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="border-b border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-800">Service Wise Sales</h3>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <FiCalendar className="w-4 h-4" />
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                placeholder="Select date range"
                                            />
                                            <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <FiArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                    <div className="text-center">
                                        <FiPieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500">Service wise sales chart</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Staff Wise Sales */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="border-b border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-800">Staff Wise Sales</h3>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <FiCalendar className="w-4 h-4" />
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                placeholder="Select date range"
                                            />
                                            <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <FiArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                    <div className="text-center">
                                        <FiBarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500">Staff wise sales chart</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Clients */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
                        <div className="border-b border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Top 10 Clients by Sales
                                </h3>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        placeholder="Select date range"
                                    />
                                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                        <FiArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-gray-700 text-sm">#</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Name</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Contact</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Firms</th>
                                            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {topClients.map((client, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 text-gray-600">{index + 1}</td>
                                                <td className="p-4">
                                                    <div className="font-medium text-gray-800">{client.name}</div>
                                                    <div className="text-sm text-gray-500">C/O: {client.guardian_name}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-gray-700">{client.mobile}</div>
                                                    <div className="text-sm text-gray-500">{client.email}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-yellow-600 font-medium">{client.firms}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-green-600 font-bold">
                                                        {formatCurrency(client.total)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard
                                    title="Total Client"
                                    value={stats.total_client || 0}
                                    icon={FiUsers}
                                    color="bg-gray-100 text-gray-600"
                                    link="/view-client"
                                />
                                <StatCard
                                    title="New Client"
                                    value={stats.new_client || 0}
                                    icon={FiUsers}
                                    color="bg-indigo-100 text-indigo-600"
                                    link="/view-new-client"
                                />
                                <StatCard
                                    title="Active Client"
                                    value={stats.active_client || 0}
                                    icon={FiUsers}
                                    color="bg-green-100 text-green-600"
                                    link="/view-active-client"
                                />
                                <StatCard
                                    title="Net Profit"
                                    value={stats.net_profit || 0}
                                    icon={FiTrendingUp}
                                    color="bg-green-100 text-green-600"
                                    link="/view-finance-report"
                                    isCurrency
                                />
                                <StatCard
                                    title="Total Staff"
                                    value={stats.total_stuff || 0}
                                    icon={FiUsers}
                                    color="bg-red-100 text-red-600"
                                    link="/view-stuff"
                                />
                                <StatCard
                                    title="Present Today"
                                    value={stats.present_today || 0}
                                    icon={FiUserCheck}
                                    color="bg-red-100 text-red-600"
                                    link="/attendance"
                                />
                                <StatCard
                                    title="Task Create Today"
                                    value={stats.task_create_today || 0}
                                    icon={FiPlus}
                                    color="bg-indigo-100 text-indigo-600"
                                    link="/view-task-create-today"
                                />
                                <StatCard
                                    title="Task Complete Today"
                                    value={stats.task_complete_today || 0}
                                    icon={FiUserCheck}
                                    color="bg-green-100 text-green-600"
                                    link="/view-task-complete-today"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;