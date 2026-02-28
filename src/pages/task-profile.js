import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar, Header } from '../components/header';
import {
    FiClipboard,
    FiMessageSquare,
    FiUsers,
    FiClock,
    FiCheckSquare,
    FiFile,
    FiDollarSign,
    FiCalendar,
    FiUser
} from 'react-icons/fi';

// Import tab components only
import DetailsTab from '../TaskComponent/DetailsTab';
import NotesTab from '../TaskComponent/NotesTab';
import StaffTab from '../TaskComponent/StaffTab';
import TimelogTab from '../TaskComponent/TimelogTab';
import SubtaskTab from '../TaskComponent/SubTaskTab';
import DocumentsTab from '../TaskComponent/DocumentTab';
import LedgerTab from '../TaskComponent/LedgerTab';

const TaskProfile = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        const saved = localStorage.getItem('sidebarMinimized');
        return saved ? JSON.parse(saved) : false;
    });
    const [activeTab, setActiveTab] = useState('details');
    
    // Task data
    const [taskData, setTaskData] = useState({
        title: "Income Tax Return",
        firm: "RONIT ROY [Individual]",
        pan: "xxxxx3169A",
        gst: "",
        status: "ASSIGNED",
        fees: "2000.00",
        createDate: "10/11/2025 | 12:30:04 AM",
        createBy: "RECURRING",
        assignedCA: "",
        mentor: "",
        dueDate: "20/11/2025"
    });

    // Sample data for tabs
    const [notes, setNotes] = useState([
        { id: 1, content: "Client needs to submit Form 16", author: "Admin", date: "15/11/2025", time: "10:30 AM" },
        { id: 2, content: "Documents verified and processed", author: "CA Rajesh", date: "16/11/2025", time: "02:15 PM" }
    ]);

    const [staff, setStaff] = useState([
        { id: 1, name: "Rajesh Kumar", role: "Senior CA", email: "rajesh@firm.com" },
        { id: 2, name: "Priya Sharma", role: "Tax Specialist", email: "priya@firm.com" }
    ]);

    const availableStaff = [
        { id: 1, name: "Rajesh Kumar", role: "Senior CA" },
        { id: 2, name: "Priya Sharma", role: "Tax Specialist" },
        { id: 3, name: "Amit Patel", role: "Junior CA" },
        { id: 4, name: "Sneha Reddy", role: "Audit Assistant" }
    ];

    const [timelogs, setTimelogs] = useState([
        { id: 1, createDate: "15/11/2025", name: "Document Review", user: "Rajesh", timestamp: "10:30 AM", spent: "2" },
        { id: 2, createDate: "16/11/2025", name: "Tax Calculation", user: "Priya", timestamp: "02:15 PM", spent: "1.5" }
    ]);

    const [subtasks, setSubtasks] = useState([
        { id: 1, name: "Collect Form 16", status: "Completed", assignedTo: "1", completedBy: "Rajesh" },
        { id: 2, name: "Verify Investments", status: "In Progress", assignedTo: "2", completedBy: "" },
        { id: 3, name: "File Return", status: "Pending", assignedTo: "", completedBy: "" }
    ]);

    const [documents, setDocuments] = useState([
        { id: 1, name: "Form16.pdf", remark: "Client submitted", type: "PDF", size: "2.3 MB" },
        { id: 2, name: "InvestmentProofs.pdf", remark: "Verified", type: "PDF", size: "1.8 MB" }
    ]);

    const [ledger, setLedger] = useState({
        period: "01/11/2025 - 26/11/2025",
        entries: [
            { id: 1, date: "14/11/2025", particular: "0 - CASH - 0 [CASH]", voucherType: "RECEIVED", voucherNo: "RCV/3", debit: "0.00", credit: "500.00", balance: "5,998.00" }
        ],
        openingBalance: "6,498.00",
        totalDebit: "6,498.00",
        totalCredit: "500.00",
        closingBalance: "5,998.00"
    });

    // Profile tabs
    const profileTabs = [
        { id: 'details', name: 'Details', icon: FiClipboard },
        { id: 'notes', name: 'Notes', icon: FiMessageSquare },
        { id: 'staff', name: 'Staff', icon: FiUsers },
        { id: 'timelog', name: 'Timelog', icon: FiClock },
        { id: 'subtask', name: 'Subtask', icon: FiCheckSquare },
        { id: 'documents', name: 'Documents', icon: FiFile },
        { id: 'ledger', name: 'Ledger', icon: FiDollarSign }
    ];

    // Animation variants
    const tabContentVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
    };

    // Render content based on active tab
    const renderTabContent = () => {
        const props = {
            variants: tabContentVariants,
            availableStaff
        };

        switch (activeTab) {
            case 'details':
                return <DetailsTab key="details" taskData={taskData} {...props} />;
            case 'notes':
                return <NotesTab key="notes" notes={notes} {...props} />;
            case 'staff':
                return <StaffTab key="staff" staff={staff} availableStaff={availableStaff} {...props} />;
            case 'timelog':
                return <TimelogTab key="timelog" timelogs={timelogs} {...props} />;
            case 'subtask':
                return <SubtaskTab key="subtask" subtasks={subtasks} availableStaff={availableStaff} {...props} />;
            case 'documents':
                return <DocumentsTab key="documents" documents={documents} {...props} />;
            case 'ledger':
                return <LedgerTab key="ledger" ledger={ledger} {...props} />;
            default:
                return null;
        }
    };

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
                    {/* Header Card */}
                    <motion.div 
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <motion.div 
                                    className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                >
                                    <FiClipboard className="w-6 h-6 text-blue-600" />
                                </motion.div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">{taskData.title}</h1>
                                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <FiUser className="w-3 h-3" />
                                            {taskData.firm}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FiCalendar className="w-3 h-3" />
                                            Due: {taskData.dueDate}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-semibold text-sm">
                                Fees: ₹{taskData.fees}
                            </div>
                        </div>
                    </motion.div>

                    {/* Profile Tabs */}
                    <motion.div 
                        className="bg-white rounded-lg border border-gray-200 p-1 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex overflow-x-auto">
                            {profileTabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                
                                return (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                                            isActive 
                                                ? 'bg-blue-100 text-blue-700' 
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.name}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {renderTabContent()}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default TaskProfile;