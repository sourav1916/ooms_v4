import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFile, FiUpload, FiEye, FiDownload, FiFolder, FiSearch,
  FiHardDrive, FiCheckCircle, FiClock, FiFileText, FiImage,
  FiArchive, FiPrinter, FiTrash2, FiPlus, FiX,
  FiChevronDown, FiChevronUp, FiGrid, FiList, FiCalendar,
  FiBriefcase, FiDollarSign, FiUsers, FiHome, FiCheckSquare,
  FiSquare, FiChevronLeft, FiChevronRight, FiMoreVertical,
  FiMail, FiMessageCircle, FiSend, FiPaperclip
} from 'react-icons/fi';
import { SiWhatsapp } from 'react-icons/si';
import Pagination from '../components/paging-nation-component';
import getHeaders from "../utils/get-headers";
import BASE_URL from "../utils/api-controller";


const DocumentsTab = () => {
  const [activeTab, setActiveTab] = useState('income-tax');
  const [selectedFirm, setSelectedFirm] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [sendOption, setSendOption] = useState('whatsapp');
  const [recipient, setRecipient] = useState('');
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showGeneralDropdown, setShowGeneralDropdown] = useState(false);
  const [attachments, setAttachments] = useState([]);

  // API Data States
  const [assessmentYears, setAssessmentYears] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(false);

  // Fetch Assessment Years for Income Tax
  useEffect(() => {
    const fetchAssessmentYears = async () => {
      if (activeTab === 'income-tax') {
        setLoadingYears(true);

        const headers = getHeaders();
        if (!headers) {
          console.error('Authentication headers not found');
          setLoadingYears(false);
          return;
        }

        try {
          const response = await fetch(`${BASE_URL}/utils/assisment-years`, {
            method: 'GET',
            headers: headers
          });

          const data = await response.json();

          if (data.success) {
            setAssessmentYears(data.data);
          } else {
            console.error('Failed to fetch assessment years:', data.message);
            // Fallback data in case of error
            setAssessmentYears([
              '2025-2026', '2024-2025', '2023-2024', '2022-2023',
              '2021-2022', '2020-2021', '2019-2020', '2018-2019',
              '2017-2018', '2016-2017'
            ]);
          }
        } catch (error) {
          console.error('Error fetching assessment years:', error);
          // Fallback data in case of error
          setAssessmentYears([
            '2025-2026', '2024-2025', '2023-2024', '2022-2023',
            '2021-2022', '2020-2021', '2019-2020', '2018-2019',
            '2017-2018', '2016-2017'
          ]);
        } finally {
          setLoadingYears(false);
        }
      }
    };

    fetchAssessmentYears();
  }, [activeTab]);

  // Fetch Financial Years for GST and MCA
  useEffect(() => {
    const fetchFinancialYears = async () => {
      if (activeTab === 'gst' || activeTab === 'mca') {
        setLoadingYears(true);

        const headers = getHeaders();
        if (!headers) {
          console.error('Authentication headers not found');
          setLoadingYears(false);
          return;
        }

        try {
          const response = await fetch(`${BASE_URL}/utils/financial-years`, {
            method: 'GET',
            headers: headers
          });

          const data = await response.json();

          if (data.success) {
            setFinancialYears(data.data);
          } else {
            console.error('Failed to fetch financial years:', data.message);
            // Fallback data in case of error
            setFinancialYears([
              '2025-2026', '2024-2025', '2023-2024', '2022-2023',
              '2021-2022', '2020-2021', '2019-2020', '2018-2019',
              '2017-2018', '2016-2017'
            ]);
          }
        } catch (error) {
          console.error('Error fetching financial years:', error);
          // Fallback data in case of error
          setFinancialYears([
            '2025-2026', '2024-2025', '2023-2024', '2022-2023',
            '2021-2022', '2020-2021', '2019-2020', '2018-2019',
            '2017-2018', '2016-2017'
          ]);
        } finally {
          setLoadingYears(false);
        }
      }
    };

    fetchFinancialYears();
  }, [activeTab]);

  // Firms Data
  const firms = [
    { id: 1, name: 'ABC Enterprises', type: 'Private Limited' },
    { id: 2, name: 'XYZ Pvt Ltd', type: 'Private Limited' },
    { id: 3, name: 'Tech Solutions', type: 'LLP' },
    { id: 4, name: 'Global Traders', type: 'Partnership' },
    { id: 5, name: 'Startup Innovations', type: 'Private Limited' },
  ];

  // Months Data
  const months = [
    'January 2024', 'February 2024', 'March 2024', 'April 2024',
    'May 2024', 'June 2024', 'July 2024', 'August 2024',
    'September 2024', 'October 2024', 'November 2024', 'December 2024'
  ];

  // Types Data for different tabs
  const incomeTaxTypes = ['ITR Returns', 'Form 16', 'Tax Audit Report', 'Advance Tax', 'TDS Returns'];
  const gstTypes = ['GSTR-1', 'GSTR-3B', 'GSTR-9', 'GSTR-4', 'GSTR-5'];
  const mcaTypes = ['AOC-4', 'DIR-3 KYC', 'MCA-21', 'INC-20A', 'PAS-3'];
  const serviceTypes = ['Income Tax', 'GST', 'MCA', 'ROC', 'Audit'];
  const categories = ['Identity', 'Financial', 'Legal', 'Registration', 'Audit', 'Contracts'];

  // Dummy Data for tables
  const [documents, setDocuments] = useState({
    'income-tax': [
      { id: 1, firm: 'ABC Enterprises', year: '2023-24', type: 'ITR Returns', remark: 'Filed successfully' },
      { id: 2, firm: 'XYZ Pvt Ltd', year: '2023-24', type: 'Form 16', remark: 'Employee details' },
      { id: 3, firm: 'Tech Solutions', year: '2022-23', type: 'Tax Audit Report', remark: 'Under review' },
      { id: 4, firm: 'Global Traders', year: '2023-24', type: 'Advance Tax', remark: 'Paid' },
      { id: 5, firm: 'Startup Innovations', year: '2023-24', type: 'TDS Returns', remark: 'Quarterly' },
      { id: 6, firm: 'ABC Enterprises', year: '2022-23', type: 'ITR Returns', remark: 'Filed' },
      { id: 7, firm: 'Tech Solutions', year: '2023-24', type: 'Form 16', remark: 'New employee' },
      { id: 8, firm: 'Global Traders', year: '2022-23', type: 'Tax Audit Report', remark: 'Completed' },
    ],
    'gst': [
      { id: 9, firm: 'ABC Enterprises', year: '2023-24', type: 'GSTR-1', month: 'January 2024', remark: 'Monthly return' },
      { id: 10, firm: 'XYZ Pvt Ltd', year: '2023-24', type: 'GSTR-3B', month: 'December 2023', remark: 'Filed' },
      { id: 11, firm: 'Tech Solutions', year: '2023-24', type: 'GSTR-9', month: 'Annual 2023', remark: 'Annual return' },
      { id: 12, firm: 'Global Traders', year: '2022-23', type: 'GSTR-1', month: 'December 2022', remark: 'Filed' },
    ],
    'mca': [
      { id: 13, firm: 'ABC Enterprises', year: '2023-24', type: 'AOC-4', remark: 'Financial statements' },
      { id: 14, firm: 'XYZ Pvt Ltd', year: '2023-24', type: 'DIR-3 KYC', remark: 'Director KYC' },
      { id: 15, firm: 'Tech Solutions', year: '2022-23', type: 'MCA-21', remark: 'Annual filing' },
      { id: 16, firm: 'Startup Innovations', year: '2023-24', type: 'INC-20A', remark: 'Incorporation' },
    ],
    'task': [
      { id: 17, firm: 'ABC Enterprises', service: 'Income Tax', name: 'ITR Filing 2024', remark: 'Complete by Jan 30' },
      { id: 18, firm: 'XYZ Pvt Ltd', service: 'GST', name: 'GSTR-1 Filing', remark: 'Monthly return' },
      { id: 19, firm: 'Tech Solutions', service: 'MCA', name: 'Annual Return', remark: 'Due date Feb 15' },
      { id: 20, firm: 'Global Traders', service: 'Income Tax', name: 'Advance Tax Payment', remark: 'Q4 payment' },
    ],
    'general': [
      { id: 21, firm: 'ABC Enterprises', name: 'PAN Card', category: 'Identity', remark: 'Verified document' },
      { id: 22, firm: 'XYZ Pvt Ltd', name: 'Bank Statement', category: 'Financial', remark: 'December 2023' },
      { id: 23, firm: 'Tech Solutions', name: 'GST Certificate', category: 'Registration', remark: 'New registration' },
      { id: 24, firm: 'Global Traders', name: 'Partnership Deed', category: 'Legal', remark: 'Original' },
    ]
  });

  // Get current year options based on active tab
  const getYearOptions = () => {
    if (activeTab === 'income-tax') {
      return assessmentYears;
    } else if (activeTab === 'gst' || activeTab === 'mca') {
      return financialYears;
    }
    return [];
  };

  // Get year label based on active tab
  const getYearLabel = () => {
    if (activeTab === 'income-tax') {
      return 'ALL AY';
    } else if (activeTab === 'gst' || activeTab === 'mca') {
      return 'ALL FY';
    }
    return 'All Years';
  };

  // Filter documents based on selected filters
  const getFilteredDocuments = () => {
    let filtered = documents[activeTab] || [];

    if (selectedFirm !== 'all') {
      filtered = filtered.filter(doc => doc.firm === selectedFirm);
    }

    if (selectedYear !== 'all') {
      filtered = filtered.filter(doc => doc.year === selectedYear);
    }

    if (selectedType !== 'all' && activeTab !== 'task' && activeTab !== 'general') {
      filtered = filtered.filter(doc => doc.type === selectedType);
    }

    if (activeTab === 'gst' && selectedMonth !== 'all') {
      filtered = filtered.filter(doc => doc.month === selectedMonth);
    }

    if (activeTab === 'task' && selectedService !== 'all') {
      filtered = filtered.filter(doc => doc.service === selectedService);
    }

    if (activeTab === 'general' && selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        Object.values(doc).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filtered;
  };

  const filteredDocuments = getFilteredDocuments();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  // Handle select all
  const handleSelectAll = () => {
    if (selectedDocuments.length === currentItems.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(currentItems.map(doc => doc.id));
    }
  };

  // Handle select single (toggle)
  const handleSelect = (id) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter(docId => docId !== id));
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };

  // Handle view document
  const handleView = (doc) => {
    setSelectedDocument(doc);
    setShowViewModal(true);
    setActiveActionMenu(null);
  };

  // Handle send document
  const handleSend = (doc) => {
    setSelectedDocument(doc);
    setShowSendModal(true);
    setActiveActionMenu(null);
  };

  // Handle bulk send
  const handleBulkSend = () => {
    setSelectedDocument(null);
    setShowSendModal(true);
  };

  // Handle send submit
  const handleSendSubmit = () => {
    // Handle send logic here
    if (selectedDocument) {
      console.log('Sending single document:', selectedDocument.id, 'via:', sendOption, 'to:', recipient, 'attachments:', attachments);
    } else {
      console.log('Sending multiple documents:', selectedDocuments, 'via:', sendOption, 'to:', recipient, 'attachments:', attachments);
    }
    setShowSendModal(false);
    setRecipient('');
    setAttachments([]);
    if (!selectedDocument) {
      setSelectedDocuments([]);
    }
  };

  // Handle file attachment
  const handleFileAttachment = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeActionMenu && !event.target.closest('.action-menu-container')) {
        setActiveActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeActionMenu]);

  // Tabs configuration
  const tabs = [
    { id: 'income-tax', label: 'Income Tax', icon: FiBriefcase, color: 'blue' },
    { id: 'gst', label: 'GST', icon: FiDollarSign, color: 'green' },
    { id: 'mca', label: 'MCA', icon: FiUsers, color: 'purple' },
    { id: 'task', label: 'Task', icon: FiCheckCircle, color: 'orange' },
    { id: 'general', label: 'General', icon: FiHome, color: 'gray' },
  ];

  // View Modal Component
  const ViewModal = ({ document, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-900">Document Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
          <div className="space-y-4">
            {Object.entries(document).map(([key, value]) => (
              key !== 'id' && (
                <div key={key} className="flex border-b border-gray-100 pb-3">
                  <span className="w-1/3 text-sm font-medium text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="w-2/3 text-sm text-gray-900">{value}</span>
                </div>
              )
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Upload Modal Component
  const UploadModal = ({ onClose, tab }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-900">Upload Document</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Firm *</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Choose a firm</option>
                {firms.map(firm => (
                  <option key={firm.id} value={firm.id}>{firm.name}</option>
                ))}
              </select>
            </div>

            {(tab === 'income-tax' || tab === 'gst' || tab === 'mca') && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {tab === 'income-tax' ? 'Select Assessment Year *' : 'Select Financial Year *'}
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">
                    {tab === 'income-tax' ? 'Choose assessment year' : 'Choose financial year'}
                  </option>
                  {(tab === 'income-tax' ? assessmentYears : financialYears).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            )}

            {tab === 'gst' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Month *</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Choose a month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            )}

            {(tab === 'income-tax' || tab === 'gst' || tab === 'mca') && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Type *</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Choose type</option>
                  {(tab === 'income-tax' ? incomeTaxTypes :
                    tab === 'gst' ? gstTypes : mcaTypes).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                </select>
              </div>
            )}

            {tab === 'general' && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    placeholder="Enter document name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Choose category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">File *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Remark</label>
              <textarea
                rows="3"
                placeholder="Enter remark (If any)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all font-medium">
              Upload Document
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Create Category Modal
  const CreateCategoryModal = ({ onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-900">Create Category</h3>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                placeholder="Enter category name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all font-medium">
              Create Category
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Send Modal Component with Attachments
  const SendModal = ({ document, onClose, onSubmit }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-900">
            Send {document ? 'Document' : 'Documents'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
          <div className="space-y-6">
            {!document && selectedDocuments.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  Sending {selectedDocuments.length} selected document(s)
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Send via *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSendOption('whatsapp')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${sendOption === 'whatsapp'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <SiWhatsapp className="w-5 h-5" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </button>
                <button
                  onClick={() => setSendOption('email')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${sendOption === 'email'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <FiMail className="w-5 h-5" />
                  <span className="text-sm font-medium">Email</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {sendOption === 'whatsapp' ? 'Phone Number *' : 'Email Address *'}
              </label>
              <input
                type={sendOption === 'whatsapp' ? 'tel' : 'email'}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={sendOption === 'whatsapp' ? 'Enter phone number' : 'Enter email address'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Message (Optional)</label>
              <textarea
                rows="3"
                placeholder="Enter your message"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Attachments</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileAttachment}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FiPaperclip className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to attach files</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB each</p>
                </label>
              </div>

              {/* Display attached files */}
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <FiFile className="w-4 h-4" />
                {document ? 'Selected document will be attached automatically' : 'Selected documents will be attached automatically'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all font-medium flex items-center justify-center gap-2"
            >
              <FiSend className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-xl"
    >
      {/* Header with Tabs */}
      <div className="border-b border-gray-200 px-6 pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Document Management System
          </h2>
          <div className="flex items-center gap-3">
            {activeTab === 'general' ? (
              <div className="relative">
                <motion.button
                  onClick={() => setShowGeneralDropdown(!showGeneralDropdown)}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiPlus className="w-5 h-5" />
                  Add New
                  <FiChevronDown className="w-4 h-4" />
                </motion.button>

                {showGeneralDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={() => {
                        setShowUploadModal(true);
                        setShowGeneralDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiUpload className="w-4 h-4" />
                      Upload Document
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateCategoryModal(true);
                        setShowGeneralDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiPlus className="w-4 h-4" />
                      Create Category
                    </button>
                  </div>
                )}
              </div>
            ) : (
              activeTab !== 'task' && (
                <motion.button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiPlus className="w-5 h-5" />
                  Add Document
                </motion.button>
              )
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedDocuments([]); // Clear selections when changing tabs
                  setActiveActionMenu(null);
                  setSelectedYear('all'); // Reset year filter when changing tabs
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium transition-all relative whitespace-nowrap ${activeTab === tab.id
                    ? `text-${tab.color}-600 bg-white border-t-2 border-l border-r border-gray-200 -mb-px`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === tab.id ? `text-${tab.color}-600` : ''}`} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${tab.color}-600`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-6 border-b border-gray-200 bg-gray-50/50">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            <FiUsers className="w-5 h-5 text-gray-400" />
            <select
              value={selectedFirm}
              onChange={(e) => setSelectedFirm(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-medium"
            >
              <option value="all">All Firms</option>
              {firms.map(firm => (
                <option key={firm.id} value={firm.name}>{firm.name}</option>
              ))}
            </select>
          </div>

          {(activeTab === 'income-tax' || activeTab === 'gst' || activeTab === 'mca') && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
              <FiCalendar className="w-5 h-5 text-gray-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm font-medium"
                disabled={loadingYears}
              >
                <option value="all">{getYearLabel()}</option>
                {loadingYears ? (
                  <option disabled>Loading...</option>
                ) : (
                  getYearOptions().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))
                )}
              </select>
            </div>
          )}

          {(activeTab === 'income-tax' || activeTab === 'gst' || activeTab === 'mca') && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
              <FiFileText className="w-5 h-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm font-medium"
              >
                <option value="all">All Types</option>
                {(activeTab === 'income-tax' ? incomeTaxTypes :
                  activeTab === 'gst' ? gstTypes : mcaTypes).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
              </select>
            </div>
          )}

          {activeTab === 'gst' && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
              <FiCalendar className="w-5 h-5 text-gray-400" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm font-medium"
              >
                <option value="all">All Months</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'task' && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
              <FiBriefcase className="w-5 h-5 text-gray-400" />
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm font-medium"
              >
                <option value="all">All Services</option>
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'general' && (
            <>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                <FiGrid className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-sm font-medium"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 relative min-w-[200px]">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedDocuments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-blue-700">
                {selectedDocuments.length} document(s) selected
              </span>
              <button
                onClick={() => setSelectedDocuments([])}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Clear selection
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkSend}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <FiSend className="w-4 h-4" />
                Send Selected
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete Selected
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Table Section */}
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Table Container with fixed layout */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="w-16 px-6 py-4 text-left">
                    <button
                      onClick={handleSelectAll}
                      className="text-gray-500 hover:text-gray-700"
                      title={selectedDocuments.length === currentItems.length ? "Deselect all" : "Select all"}
                    >
                      {selectedDocuments.length === currentItems.length && currentItems.length > 0 ? (
                        <div className="relative inline-block">
                          <div className="w-10 h-5 bg-blue-600 rounded-full transition-colors"></div>
                          <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform"></div>
                        </div>
                      ) : (
                        <div className="relative inline-block">
                          <div className="w-10 h-5 bg-gray-300 rounded-full transition-colors"></div>
                          <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform"></div>
                        </div>
                      )}
                    </button>
                  </th>

                  {/* Dynamic Table Headers based on active tab */}
                  {activeTab === 'income-tax' && (
                    <>
                      <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Firm</th>
                      <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assessment Year</th>
                      <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                      <th className="w-1/3 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remark</th>
                      <th className="w-24 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">View</th>
                      <th className="w-24 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </>
                  )}

                  {activeTab === 'gst' && (
                    <>
                      <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Firm</th>
                      <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Financial Year</th>
                      <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                      <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Month</th>
                      <th className="w-1/4 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remark</th>
                      <th className="w-24 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">View</th>
                      <th className="w-24 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </>
                  )}

                  {activeTab === 'mca' && (
                    <>
                      <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Firm</th>
                      <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Financial Year</th>
                      <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                      <th className="w-1/3 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remark</th>
                      <th className="w-24 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">View</th>
                      <th className="w-24 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </>
                  )}

                  {activeTab === 'task' && (
                    <>
                      <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Firm</th>
                      <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                      <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="w-1/3 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remark</th>
                      <th className="w-24 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">View</th>
                      <th className="w-24 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </>
                  )}

                  {activeTab === 'general' && (
                    <>
                      <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Firm</th>
                      <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                      <th className="w-1/3 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remark</th>
                      <th className="w-24 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">View</th>
                      <th className="w-24 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {currentItems.length > 0 ? (
                    currentItems.map((doc, index) => (
                      <motion.tr
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`hover:bg-gray-50 transition-colors ${selectedDocuments.includes(doc.id) ? 'bg-blue-50/50' : ''
                          }`}
                      >
                        <td className="px-6 py-4 align-middle">
                          <button
                            onClick={() => handleSelect(doc.id)}
                            className="text-gray-500 hover:text-gray-700"
                            title={selectedDocuments.includes(doc.id) ? "Deselect" : "Select"}
                          >
                            {selectedDocuments.includes(doc.id) ? (
                              <div className="relative inline-block">
                                <div className="w-10 h-5 bg-blue-600 rounded-full transition-colors"></div>
                                <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform"></div>
                              </div>
                            ) : (
                              <div className="relative inline-block">
                                <div className="w-10 h-5 bg-gray-300 rounded-full transition-colors"></div>
                                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform"></div>
                              </div>
                            )}
                          </button>
                        </td>

                        {/* Dynamic Table Cells based on active tab */}
                        {activeTab === 'income-tax' && (
                          <>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm font-medium text-gray-900 truncate" title={doc.firm}>{doc.firm}</div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm text-gray-600">{doc.year}</div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium truncate block max-w-[120px]" title={doc.type}>
                                {doc.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm text-gray-600 truncate" title={doc.remark}>{doc.remark}</div>
                            </td>
                          </>
                        )}

                        {activeTab === 'gst' && (
                          <>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm font-medium text-gray-900 truncate" title={doc.firm}>{doc.firm}</div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm text-gray-600">{doc.year}</div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium truncate block max-w-[120px]" title={doc.type}>
                                {doc.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm text-gray-600 truncate" title={doc.month}>{doc.month}</div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm text-gray-600 truncate" title={doc.remark}>{doc.remark}</div>
                            </td>
                          </>
                        )}

                        {activeTab === 'mca' && (
                          <>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm font-medium text-gray-900 truncate" title={doc.firm}>{doc.firm}</div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm text-gray-600">{doc.year}</div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium truncate block max-w-[120px]" title={doc.type}>
                                {doc.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm text-gray-600 truncate" title={doc.remark}>{doc.remark}</div>
                            </td>
                          </>
                        )}

                        {activeTab === 'task' && (
                          <>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm font-medium text-gray-900 truncate" title={doc.firm}>{doc.firm}</div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium truncate block max-w-[120px]" title={doc.service}>
                                {doc.service}
                              </span>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm font-medium text-gray-900 truncate" title={doc.name}>{doc.name}</div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm text-gray-600 truncate" title={doc.remark}>{doc.remark}</div>
                            </td>
                          </>
                        )}

                        {activeTab === 'general' && (
                          <>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm font-medium text-gray-900 truncate" title={doc.firm}>{doc.firm}</div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm font-medium text-gray-900 truncate" title={doc.name}>{doc.name}</div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-medium truncate block max-w-[120px]" title={doc.category}>
                                {doc.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-sm text-gray-600 truncate" title={doc.remark}>{doc.remark}</div>
                            </td>
                          </>
                        )}

                        {/* View Column */}
                        <td className="px-6 py-4 text-center align-middle">
                          <button
                            onClick={() => handleView(doc)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                        </td>

                        {/* Actions Column with 3-dot menu */}
                        <td className="px-6 py-4 text-center align-middle relative action-menu-container">
                          <button
                            onClick={() => setActiveActionMenu(activeActionMenu === doc.id ? null : doc.id)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <FiMoreVertical className="w-5 h-5" />
                          </button>

                          {/* Action Menu */}
                          {activeActionMenu === doc.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                              <button
                                onClick={() => {
                                  handleView(doc);
                                  setActiveActionMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <FiEye className="w-4 h-4" />
                                View
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <FiDownload className="w-4 h-4" />
                                Download
                              </button>
                              <button
                                onClick={() => handleSend(doc)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <FiSend className="w-4 h-4" />
                                Send
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <FiTrash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FiFolder className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {filteredDocuments.length > 0 && (
        <div className="px-6 pb-6">
          <Pagination
            pagination={{
              page: currentPage,
              limit: itemsPerPage,
              total: filteredDocuments.length,
              total_pages: totalPages,
              is_last_page: currentPage === totalPages
            }}
            onPageChange={setCurrentPage}
            onLimitChange={setItemsPerPage}
            onCustomPageChange={setCurrentPage}
            loading={false}
            showPageInfo={true}
            showLimitSelector={true}
            showCustomInput={true}
          />
        </div>
      )}
      {/* Modals */}
      <AnimatePresence>
        {showUploadModal && (
          <UploadModal onClose={() => setShowUploadModal(false)} tab={activeTab} />
        )}
        {showCreateCategoryModal && (
          <CreateCategoryModal onClose={() => setShowCreateCategoryModal(false)} />
        )}
        {showViewModal && selectedDocument && (
          <ViewModal document={selectedDocument} onClose={() => setShowViewModal(false)} />
        )}
        {showSendModal && (
          <SendModal
            document={selectedDocument}
            onClose={() => {
              setShowSendModal(false);
              setRecipient('');
              setAttachments([]);
            }}
            onSubmit={handleSendSubmit}
          />
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </motion.div>
  );
};

export default DocumentsTab;