import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFile, FiUpload, FiEye, FiDownload, FiFolder, FiSearch,
  FiHardDrive, FiCheckCircle, FiClock, FiFileText, FiImage,
  FiArchive, FiPrinter, FiTrash2, FiPlus, FiX,
  FiChevronDown, FiChevronUp, FiGrid, FiList, FiCalendar,
  FiBriefcase, FiDollarSign, FiUsers, FiHome, FiCheckSquare,
  FiSquare, FiChevronLeft, FiChevronRight, FiMoreVertical,
  FiMail, FiMessageCircle, FiSend, FiPaperclip, FiLoader,
  FiAlertCircle, FiCheck, FiEdit2
} from 'react-icons/fi';
import { SiWhatsapp } from 'react-icons/si';
import axios from 'axios';
import Pagination from '../components/paging-nation-component';
import getHeaders from "../utils/get-headers";
import API_BASE_URL from "../utils/api-controller";

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
          {document?.file_url && (
            <div className="flex justify-center mb-4">
              {document.mime_type?.startsWith('image/') ? (
                <img 
                  src={document.file_url} 
                  alt="Document" 
                  className="max-w-full max-h-64 rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-full p-8 bg-gray-50 rounded-lg text-center">
                  <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Preview not available</p>
                </div>
              )}
            </div>
          )}
          {document && Object.entries(document).map(([key, value]) => 
            key !== 'id' && key !== 'firm_id' && key !== 'file_url' && key !== 'mime_type' && key !== 'size' && key !== 'create_date' && key !== 'type_value' && (
              <div key={key} className="flex border-b border-gray-100 pb-3">
                <span className="w-1/3 text-sm font-medium text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="w-2/3 text-sm text-gray-900">{value}</span>
              </div>
            )
          )}
          {document?.size && (
            <div className="flex border-b border-gray-100 pb-3">
              <span className="w-1/3 text-sm font-medium text-gray-600">File Size:</span>
              <span className="w-2/3 text-sm text-gray-900">{(document.size / 1024).toFixed(2)} KB</span>
            </div>
          )}
          {document?.create_date && (
            <div className="flex border-b border-gray-100 pb-3">
              <span className="w-1/3 text-sm font-medium text-gray-600">Uploaded On:</span>
              <span className="w-2/3 text-sm text-gray-900">{new Date(document.create_date).toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          {document?.file_url && (
            <a
              href={document.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Download
            </a>
          )}
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

// Create Category Modal
const CreateCategoryModal = ({ onClose, onCreate, loading }) => {
  const [name, setName] = useState('');
  const [remark, setRemark] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onCreate({ name: name.trim(), remark: remark.trim() });
    }
  };

  return (
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Remark</label>
              <textarea
                rows="3"
                placeholder="Enter remark (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                disabled={loading}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading || !name.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Category'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Edit Category Modal
const EditCategoryModal = ({ onClose, onEdit, loading, category }) => {
  const [name, setName] = useState(category?.name || '');
  const [remark, setRemark] = useState(category?.remark || '');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setRemark(category.remark || '');
    }
  }, [category]);

  const handleSubmit = () => {
    if (name.trim()) {
      onEdit({ name: name.trim(), remark: remark.trim() });
    }
  };

  return (
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
          <h3 className="text-xl font-bold text-gray-900">Edit Category</h3>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                placeholder="Enter category name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Remark</label>
              <textarea
                rows="3"
                placeholder="Enter remark (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                disabled={loading}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading || !name.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Category'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Send Modal Component
const SendModal = ({ document, selectedDocuments, onClose, onSubmit, loading }) => {
  const [sendOption, setSendOption] = useState('whatsapp');
  const [recipient, setRecipient] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [message, setMessage] = useState('');

  const handleFileAttachment = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (recipient.trim()) {
      onSubmit({
        sendOption,
        recipient: recipient.trim(),
        message: message.trim(),
        attachments
      });
    }
  };

  return (
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
            {!document && selectedDocuments?.length > 0 && (
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
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    sendOption === 'whatsapp'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  type="button"
                >
                  <SiWhatsapp className="w-5 h-5" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </button>
                <button
                  onClick={() => setSendOption('email')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    sendOption === 'email'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  type="button"
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
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Message (Optional)</label>
              <textarea
                rows="3"
                placeholder="Enter your message"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Attachments</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileAttachment}
                  className="hidden"
                  id="file-upload"
                  disabled={loading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FiPaperclip className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to attach files</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB each</p>
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                        type="button"
                        disabled={loading}
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
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !recipient.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Upload Modal Component
const UploadModal = ({ onClose, tab, firms, loadingFirms, assessmentYears, financialYears, loadingYears, documentTypes, loadingTypes, categories, loadingCategories, months, onSubmit, uploadLoading, uploadProgress, fileInputRef, uploadForm, handleUploadFormChange, handleFileSelect, removeFile }) => {
  const currentTabTypes = (() => {
    if (tab === 'income-tax') return documentTypes.it || [];
    if (tab === 'gst') return documentTypes.gst || [];
    if (tab === 'mca') return documentTypes.mca || [];
    return [];
  })();

  return (
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
            disabled={uploadLoading}
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Firm *</label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={uploadForm.firm_id}
                onChange={(e) => handleUploadFormChange('firm_id', e.target.value)}
                disabled={uploadLoading || loadingFirms}
              >
                <option value="">Choose a firm</option>
                {loadingFirms ? (
                  <option disabled>Loading firms...</option>
                ) : (
                  firms.map(firm => {
                    const firmId = firm.firm_id || firm.id;
                    const firmName = firm.firm_name || firm.name;
                    return (
                      <option key={firmId} value={firmId}>
                        {firmName}
                      </option>
                    );
                  })
                )}
              </select>
            </div>

            {(tab === 'income-tax' || tab === 'gst' || tab === 'mca') && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {tab === 'income-tax' ? 'Select Assessment Year *' : 'Select Financial Year *'}
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={uploadForm.year}
                  onChange={(e) => handleUploadFormChange('year', e.target.value)}
                  disabled={uploadLoading || loadingYears}
                >
                  <option value="">
                    {tab === 'income-tax' ? 'Choose assessment year' : 'Choose financial year'}
                  </option>
                  {loadingYears ? (
                    <option disabled>Loading years...</option>
                  ) : (
                    (tab === 'income-tax' ? assessmentYears : financialYears).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))
                  )}
                </select>
              </div>
            )}

            {tab === 'gst' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Month *</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={uploadForm.month}
                  onChange={(e) => handleUploadFormChange('month', e.target.value)}
                  disabled={uploadLoading}
                >
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
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={uploadForm.type}
                  onChange={(e) => handleUploadFormChange('type', e.target.value)}
                  disabled={uploadLoading || loadingTypes}
                >
                  <option value="">Choose type</option>
                  {loadingTypes ? (
                    <option disabled>Loading types...</option>
                  ) : (
                    currentTabTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.name}
                      </option>
                    ))
                  )}
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
                    value={uploadForm.name}
                    onChange={(e) => handleUploadFormChange('name', e.target.value)}
                    disabled={uploadLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={uploadForm.category}
                    onChange={(e) => handleUploadFormChange('category', e.target.value)}
                    disabled={uploadLoading || loadingCategories}
                  >
                    <option value="">Choose category</option>
                    {loadingCategories ? (
                      <option disabled>Loading categories...</option>
                    ) : (
                      categories.map(cat => (
                        <option key={cat.category_id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">File *</label>
              {!uploadForm.file ? (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploadLoading}
                  />
                  <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiFile className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{uploadForm.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(uploadForm.file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={removeFile}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={uploadLoading}
                    >
                      <FiX className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              )}
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Remark</label>
              <textarea
                rows="3"
                placeholder="Enter remark (If any)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={uploadForm.remark}
                onChange={(e) => handleUploadFormChange('remark', e.target.value)}
                disabled={uploadLoading}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              disabled={uploadLoading}
            >
              Cancel
            </button>
            <button 
              onClick={onSubmit}
              disabled={
                uploadLoading || 
                !uploadForm.firm_id || 
                ((tab === 'income-tax' || tab === 'gst' || tab === 'mca') && !uploadForm.year) ||
                (tab === 'gst' && !uploadForm.month) ||
                ((tab === 'income-tax' || tab === 'gst' || tab === 'mca') && !uploadForm.type) ||
                (tab === 'general' && (!uploadForm.name || !uploadForm.category)) ||
                !uploadForm.file
              }
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploadLoading ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Uploading...'}
                </>
              ) : (
                'Upload Document'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main DocumentsTab Component
const DocumentsTab = ({ clientUsername }) => {
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
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState(null);
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showGeneralDropdown, setShowGeneralDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const actionMenuRef = useRef(null);

  // API Data States
  const [assessmentYears, setAssessmentYears] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(false);
  const [firms, setFirms] = useState([]);
  const [loadingFirms, setLoadingFirms] = useState(false);
  
  // Document Types State
  const [documentTypes, setDocumentTypes] = useState({
    it: [],
    gst: [],
    mca: []
  });
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Categories State for General tab
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Documents State
  const [documents, setDocuments] = useState({
    'income-tax': [],
    'gst': [],
    'mca': [],
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

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    firm_id: '',
    year: '',
    type: '',
    month: '',
    name: '',
    category: '',
    remark: '',
    file: null
  });

  

  // File input ref
  const fileInputRef = useRef(null);

  // Months Data
  const months = useMemo(() => [
    'January 2024', 'February 2024', 'March 2024', 'April 2024',
    'May 2024', 'June 2024', 'July 2024', 'August 2024',
    'September 2024', 'October 2024', 'November 2024', 'December 2024'
  ], []);

  // Service Types for Task tab
  const serviceTypes = useMemo(() => ['Income Tax', 'GST', 'MCA', 'ROC', 'Audit'], []);

  // Tabs configuration
  const tabs = useMemo(() => [
    { id: 'income-tax', label: 'Income Tax', icon: FiBriefcase, color: 'blue' },
    { id: 'gst', label: 'GST', icon: FiDollarSign, color: 'green' },
    { id: 'mca', label: 'MCA', icon: FiUsers, color: 'purple' },
    { id: 'task', label: 'Task', icon: FiCheckCircle, color: 'orange' },
    { id: 'general', label: 'General', icon: FiHome, color: 'gray' },
  ], []);

  // Close action menu when clicking outside
  const handleClickOutside = useCallback((event) => {
    if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
      setActiveActionMenu(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleDropdownClose = (event) => {
      if (showGeneralDropdown && !event.target.closest('.dropdown-container')) {
        setShowGeneralDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleDropdownClose);
    return () => document.removeEventListener('mousedown', handleDropdownClose);
  }, [showGeneralDropdown]);

  // Fetch Firms for the current client
  useEffect(() => {
    const fetchFirms = async () => {
      if (!clientUsername) {
        console.error('Client username is required to fetch firms');
        return;
      }
      
      setLoadingFirms(true);
      const headers = getHeaders();
      if (!headers) {
        console.error('Authentication headers not found');
        setLoadingFirms(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/client/details/firms/list?username=${encodeURIComponent(clientUsername)}`, {
          method: 'GET',
          headers: headers
        });

        const data = await response.json();

        if (data.success && Array.isArray(data.data?.firms)) {
          setFirms(data.data.firms);
        } else {
          console.error('Failed to fetch firms:', data.message);
          setFirms([]);
        }
      } catch (error) {
        console.error('Error fetching firms:', error);
        setFirms([]);
      } finally {
        setLoadingFirms(false);
      }
    };

    if (clientUsername) {
      fetchFirms();
    }
  }, [clientUsername]);

  // Fetch Document Types
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      setLoadingTypes(true);
      const headers = getHeaders();
      if (!headers) {
        console.error('Authentication headers not found');
        setLoadingTypes(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/client/details/documents/types`, {
          method: 'GET',
          headers: headers
        });

        const data = await response.json();

        if (data.success && data.data) {
          setDocumentTypes(data.data);
        } else {
          console.error('Failed to fetch document types:', data.message);
        }
      } catch (error) {
        console.error('Error fetching document types:', error);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchDocumentTypes();
  }, []);

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
          const response = await fetch(`${API_BASE_URL}/utils/assisment-years`, {
            method: 'GET',
            headers: headers
          });

          const data = await response.json();

          if (data.success && Array.isArray(data.data)) {
            setAssessmentYears(data.data);
          } else {
            console.error('Failed to fetch assessment years:', data.message);
            setAssessmentYears([]);
          }
        } catch (error) {
          console.error('Error fetching assessment years:', error);
          setAssessmentYears([]);
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
          const response = await fetch(`${API_BASE_URL}/utils/financial-years`, {
            method: 'GET',
            headers: headers
          });

          const data = await response.json();

          if (data.success && Array.isArray(data.data)) {
            setFinancialYears(data.data);
          } else {
            console.error('Failed to fetch financial years:', data.message);
            setFinancialYears([]);
          }
        } catch (error) {
          console.error('Error fetching financial years:', error);
          setFinancialYears([]);
        } finally {
          setLoadingYears(false);
        }
      }
    };

    fetchFinancialYears();
  }, [activeTab]);

  // Fetch Categories for General tab
  useEffect(() => {
    const fetchCategories = async () => {
      if (activeTab === 'general') {
        setLoadingCategories(true);
        const headers = getHeaders();
        if (!headers) {
          console.error('Authentication headers not found');
          setLoadingCategories(false);
          return;
        }

        try {
          const searchParam = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
          const response = await fetch(`${API_BASE_URL}/client/details/documents/category-list${searchParam}`, {
            method: 'GET',
            headers: headers
          });

          const data = await response.json();

          if (data.success && Array.isArray(data.data)) {
            setCategories(data.data);
          } else {
            console.error('Failed to fetch categories:', data.message);
            setCategories([]);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
          setCategories([]);
        } finally {
          setLoadingCategories(false);
        }
      }
    };

    fetchCategories();
  }, [activeTab, searchTerm]);

  // Fetch Documents based on active tab
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!clientUsername) {
        console.error('Client username is required');
        return;
      }

      if (activeTab === 'income-tax' || activeTab === 'gst' || activeTab === 'mca') {
        setLoading(true);

        const headers = getHeaders();
        if (!headers) {
          console.error('Authentication headers not found');
          setLoading(false);
          return;
        }

        // Build query parameters
        const params = new URLSearchParams();
        
        // Add username as query parameter (required by backend)
        params.append('username', clientUsername);
        params.append('page', currentPage);
        params.append('limit', itemsPerPage);
        
        if (selectedFirm !== 'all') {
          params.append('firm_id', selectedFirm);
        }
        
        if (selectedYear !== 'all') {
          params.append('year', selectedYear);
        }
        
        if (selectedType !== 'all') {
          params.append('type', selectedType);
        }
        
        if (activeTab === 'gst' && selectedMonth !== 'all') {
          // Convert month format to match backend (e.g., "January 2024" to "january")
          const monthName = selectedMonth.split(' ')[0].toLowerCase();
          params.append('month', monthName);
        }
        
        if (searchTerm) {
          params.append('search', searchTerm);
        }

        let endpoint = '';
        if (activeTab === 'income-tax') endpoint = 'it';
        else if (activeTab === 'gst') endpoint = 'gst';
        else if (activeTab === 'mca') endpoint = 'mca';

        try {
          const response = await fetch(`${API_BASE_URL}/client/details/documents/list/${endpoint}?${params.toString()}`, {
            method: 'GET',
            headers: headers
          });

          const result = await response.json();

          if (result.success && Array.isArray(result.data)) {
            // Create a map of firm_id to firm_name for quick lookup
            const firmMap = {};
            firms.forEach(firm => {
              const firmId = firm.firm_id || firm.id;
              const firmName = firm.firm_name || firm.name;
              if (firmId) {
                firmMap[firmId] = firmName;
              }
            });

            // Transform API data to match your existing document structure
            const transformedData = result.data.map((doc, index) => {
              // Get firm name from the map using firm_id
              const firmName = firmMap[doc.firm_id] || 'Unknown Firm';
              
              // Get type name from document types if available
              let typeName = doc.type;
              if (documentTypes[endpoint]) {
                const typeObj = documentTypes[endpoint].find(t => t.value === doc.type);
                if (typeObj) {
                  typeName = typeObj.name;
                }
              }
              
              const baseDoc = {
                id: doc.document_id || index + 1,
                firm_id: doc.firm_id,
                firm: firmName,
                year: doc.f_year,
                type: typeName,
                type_value: doc.type,
                remark: doc.remark,
                file_url: doc.file,
                size: doc.size,
                mime_type: doc.mime_type,
                create_date: doc.create_date
              };

              if (activeTab === 'gst') {
                return {
                  ...baseDoc,
                  month: doc.month ? doc.month.charAt(0).toUpperCase() + doc.month.slice(1) + ' ' + doc.f_year?.split('-')[0] : ''
                };
              }

              return baseDoc;
            });

            setDocuments(prev => ({
              ...prev,
              [activeTab]: transformedData
            }));

            // Update pagination
            if (result.pagination) {
              setPagination(result.pagination);
            }
          } else {
            console.error(`Failed to fetch ${activeTab} documents:`, result.message);
            setDocuments(prev => ({
              ...prev,
              [activeTab]: []
            }));
          }
        } catch (error) {
          console.error(`Error fetching ${activeTab} documents:`, error);
          setDocuments(prev => ({
            ...prev,
            [activeTab]: []
          }));
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDocuments();
  }, [activeTab, currentPage, itemsPerPage, selectedFirm, selectedYear, selectedType, selectedMonth, searchTerm, clientUsername, firms, documentTypes]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFirm, selectedYear, selectedType, selectedMonth, selectedService, selectedCategory, searchTerm, activeTab]);

  // File upload function
  const uploadFileToServer = async (file) => {
    const headers = getHeaders();
    if (!headers) {
      throw new Error('Authentication headers not found');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress(0);
      
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
        timeout: 60000
      });

      if (response.data && response.data.success) {
        return {
          success: true,
          url: response.data.data?.url || response.data.url,
          filename: response.data.data?.filename || response.data.filename,
          message: response.data.message
        };
      } else {
        throw new Error(response.data?.message || 'File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          throw new Error(`Bad request: ${data?.message || 'Invalid file'}`);
        } else if (status === 413) {
          throw new Error('File too large. Maximum size is 10MB.');
        } else if (status === 415) {
          throw new Error('Unsupported file type.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(data?.message || `Upload failed with status ${status}`);
        }
      } else if (error.request) {
        throw new Error('No response from server. Check your internet connection.');
      } else {
        throw new Error(error.message || 'Upload failed');
      }
    } finally {
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  // Handle upload form changes
  const handleUploadFormChange = (field, value) => {
    setUploadForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle file selection for upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const maxSize = 10 * 1024 * 1024;
    
    if (file.size > maxSize) {
      alert(`File exceeds the 10MB limit. Please upload a smaller file.`);
      return;
    }
    
    setUploadForm(prev => ({
      ...prev,
      file: file
    }));
    
    if (activeTab === 'general' && !uploadForm.name) {
      const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.');
      setUploadForm(prev => ({
        ...prev,
        name: fileNameWithoutExt
      }));
    }
  };

  // Remove selected file
  const removeFile = () => {
    setUploadForm(prev => ({
      ...prev,
      file: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle upload submit
  const handleUploadSubmit = async () => {
    if (!clientUsername) {
      alert('Client username is required');
      return;
    }

    if (!uploadForm.firm_id) {
      alert('Please select a firm');
      return;
    }

    if ((activeTab === 'income-tax' || activeTab === 'gst' || activeTab === 'mca') && !uploadForm.year) {
      alert(`Please select ${activeTab === 'income-tax' ? 'assessment year' : 'financial year'}`);
      return;
    }

    if (activeTab === 'gst' && !uploadForm.month) {
      alert('Please select month');
      return;
    }

    if ((activeTab === 'income-tax' || activeTab === 'gst' || activeTab === 'mca') && !uploadForm.type) {
      alert('Please select document type');
      return;
    }

    if (activeTab === 'general') {
      if (!uploadForm.name) {
        alert('Please enter document name');
        return;
      }
      if (!uploadForm.category) {
        alert('Please select category');
        return;
      }
    }

    if (!uploadForm.file) {
      alert('Please select a file to upload');
      return;
    }

    setUploadLoading(true);
    setUploadProgress(0);

    try {
      const uploadResult = await uploadFileToServer(uploadForm.file);
      
      if (!uploadResult.success || !uploadResult.url) {
        throw new Error('File upload failed');
      }

      const documentData = {
        name: uploadForm.name || uploadForm.file.name.split('.')[0],
        url: uploadResult.url,
        year: uploadForm.year,
        type: uploadForm.type,
        remark: uploadForm.remark || ''
      };

      if (activeTab === 'gst' && uploadForm.month) {
        const monthMap = {
          'January': '01', 'February': '02', 'March': '03', 'April': '04',
          'May': '05', 'June': '06', 'July': '07', 'August': '08',
          'September': '09', 'October': '10', 'November': '11', 'December': '12'
        };
        const monthName = uploadForm.month.split(' ')[0];
        documentData.month = monthMap[monthName] || '01';
      }

      const requestBody = {
        username: clientUsername,
        firm_id: uploadForm.firm_id,
        documents: [documentData]
      };

      let endpoint = '';
      if (activeTab === 'income-tax') endpoint = 'it';
      else if (activeTab === 'gst') endpoint = 'gst';
      else if (activeTab === 'mca') endpoint = 'mca';
      else if (activeTab === 'general') {
        alert('General tab upload not implemented yet');
        setUploadLoading(false);
        return;
      }

      const headers = getHeaders();
      if (!headers) {
        throw new Error('Authentication headers not found');
      }

      const response = await axios.post(
        `${API_BASE_URL}/client/details/documents/create/${endpoint}?username=${encodeURIComponent(clientUsername)}`,
        requestBody,
        { headers }
      );

      if (response.data && response.data.success) {
        alert('Document uploaded successfully');
        setShowUploadModal(false);
        setUploadForm({
          firm_id: '',
          year: '',
          type: '',
          month: '',
          name: '',
          category: '',
          remark: '',
          file: null
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setCurrentPage(1);
      } else {
        alert('Failed to upload document: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error in upload flow:', error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          alert(`Bad request: ${data?.message || 'Invalid data'}`);
        } else if (status === 401) {
          alert('Authentication failed. Please login again.');
        } else if (status === 404) {
          alert('API endpoint not found.');
        } else if (status === 500) {
          alert('Server error. Please try again later.');
        } else {
          alert(data?.message || `Error ${status}: Failed to upload document`);
        }
      } else if (error.request) {
        alert('No response from server. Check your internet connection.');
      } else {
        alert(error.message || 'Error uploading document. Please try again.');
      }
    } finally {
      setUploadLoading(false);
      setUploadProgress(0);
    }
  };

  // Handle create category
  const handleCreateCategory = async (categoryData) => {
    setCategoryLoading(true);
    const headers = getHeaders();
    if (!headers) {
      setCategoryLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/client/details/documents/create-category`,
        categoryData,
        { headers }
      );

      if (response.data && response.data.success) {
        alert('Category created successfully');
        setShowCreateCategoryModal(false);
        
        const fetchResponse = await fetch(`${API_BASE_URL}/client/details/documents/category-list`, {
          method: 'GET',
          headers: headers
        });
        const data = await fetchResponse.json();
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      } else {
        alert('Failed to create category: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating category:', error);
      if (error.response) {
        alert(error.response.data?.message || 'Failed to create category');
      } else {
        alert('Failed to create category. Please try again.');
      }
    } finally {
      setCategoryLoading(false);
    }
  };

  // Handle edit category
  const handleEditCategory = async (categoryData) => {
    if (!selectedCategoryForEdit) return;

    setCategoryLoading(true);
    const headers = getHeaders();
    if (!headers) {
      setCategoryLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/client/details/documents/category-edit`,
        {
          category_id: selectedCategoryForEdit.category_id,
          ...categoryData
        },
        { headers }
      );

      if (response.data && response.data.success) {
        alert('Category updated successfully');
        setShowEditCategoryModal(false);
        setSelectedCategoryForEdit(null);
        
        const fetchResponse = await fetch(`${API_BASE_URL}/client/details/documents/category-list`, {
          method: 'GET',
          headers: headers
        });
        const data = await fetchResponse.json();
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      } else {
        alert('Failed to update category: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating category:', error);
      if (error.response) {
        alert(error.response.data?.message || 'Failed to update category');
      } else {
        alert('Failed to update category. Please try again.');
      }
    } finally {
      setCategoryLoading(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    setCategoryLoading(true);
    const headers = getHeaders();
    if (!headers) {
      setCategoryLoading(false);
      return;
    }

    try {
      const response = await axios({
        method: 'delete',
        url: `${API_BASE_URL}/client/details/documents/category-delete`,
        data: { category_id: categoryId },
        headers: headers
      });

      if (response.data && response.data.success) {
        alert('Category deleted successfully');
        
        const fetchResponse = await fetch(`${API_BASE_URL}/client/details/documents/category-list`, {
          method: 'GET',
          headers: headers
        });
        const data = await fetchResponse.json();
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      } else {
        alert('Failed to delete category: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error.response) {
        alert(error.response.data?.message || 'Failed to delete category');
      } else {
        alert('Failed to delete category. Please try again.');
      }
    } finally {
      setCategoryLoading(false);
    }
  };

  // Handle send submit
  const handleSendSubmit = async (sendData) => {
    if (!clientUsername) {
      console.error('Client username is required');
      return;
    }

    setSendLoading(true);
    const headers = getHeaders();
    if (!headers) {
      setSendLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('username', clientUsername);
    formData.append('sendOption', sendData.sendOption);
    formData.append('recipient', sendData.recipient);
    formData.append('message', sendData.message);
    
    if (selectedDocument) {
      formData.append('document_id', selectedDocument.id);
    } else {
      selectedDocuments.forEach((docId, index) => {
        formData.append(`document_ids[${index}]`, docId);
      });
    }

    sendData.attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          ...headers,
        },
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Documents sent successfully');
        setShowSendModal(false);
        if (!selectedDocument) {
          setSelectedDocuments([]);
        }
      } else {
        alert('Failed to send documents: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error sending documents:', error);
      alert('Failed to send documents. Please try again.');
    } finally {
      setSendLoading(false);
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

  // Open edit category modal
  const openEditCategoryModal = (category) => {
    setSelectedCategoryForEdit(category);
    setShowEditCategoryModal(true);
    setActiveActionMenu(null);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedDocuments.length === currentItems.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(currentItems.map(doc => doc.id));
    }
  };

  // Handle select single
  const handleSelect = (id) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter(docId => docId !== id));
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };

  // Get current year options based on active tab
  const getYearOptions = useCallback(() => {
    if (activeTab === 'income-tax') {
      return assessmentYears;
    } else if (activeTab === 'gst' || activeTab === 'mca') {
      return financialYears;
    }
    return [];
  }, [activeTab, assessmentYears, financialYears]);

  // Get year label based on active tab
  const getYearLabel = useCallback(() => {
    if (activeTab === 'income-tax') {
      return 'ALL AY';
    } else if (activeTab === 'gst' || activeTab === 'mca') {
      return 'ALL FY';
    }
    return 'All Years';
  }, [activeTab]);

  // Get document types for current tab
  const getCurrentTabTypes = useCallback(() => {
    if (activeTab === 'income-tax') {
      return documentTypes.it || [];
    } else if (activeTab === 'gst') {
      return documentTypes.gst || [];
    } else if (activeTab === 'mca') {
      return documentTypes.mca || [];
    }
    return [];
  }, [activeTab, documentTypes]);

  // Filter documents based on selected filters
  const getFilteredDocuments = useCallback(() => {
    let filtered = documents[activeTab] || [];

    if (selectedFirm !== 'all') {
      filtered = filtered.filter(doc => doc.firm_id === selectedFirm);
    }

    if (selectedYear !== 'all') {
      filtered = filtered.filter(doc => doc.year === selectedYear);
    }

    if (selectedType !== 'all' && activeTab !== 'task' && activeTab !== 'general') {
      filtered = filtered.filter(doc => doc.type_value === selectedType);
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
  }, [activeTab, documents, selectedFirm, selectedYear, selectedType, selectedMonth, selectedService, selectedCategory, searchTerm]);

  const filteredDocuments = getFilteredDocuments();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
    is_last_page: true
  });

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
              <div className="relative dropdown-container">
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
                  setSelectedDocuments([]);
                  setActiveActionMenu(null);
                  setSelectedYear('all');
                  setSelectedType('all');
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
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
              disabled={loadingFirms}
            >
              <option value="all">All Firms</option>
              {loadingFirms ? (
                <option disabled>Loading...</option>
              ) : (
                firms.map(firm => {
                  const firmId = firm.firm_id || firm.id;
                  const firmName = firm.firm_name || firm.name;
                  return (
                    <option key={firmId} value={firmId}>
                      {firmName}
                    </option>
                  );
                })
              )}
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
                disabled={loadingTypes}
              >
                <option value="all">All Types</option>
                {loadingTypes ? (
                  <option disabled>Loading...</option>
                ) : (
                  getCurrentTabTypes().map(type => (
                    <option key={type.value} value={type.value}>
                      {type.name}
                    </option>
                  ))
                )}
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
                  disabled={loadingCategories}
                >
                  <option value="all">All Categories</option>
                  {loadingCategories ? (
                    <option disabled>Loading...</option>
                  ) : (
                    categories.map(cat => (
                      <option key={cat.category_id} value={cat.name}>{cat.name}</option>
                    ))
                  )}
                </select>
              </div>
              <div className="flex-1 relative min-w-[200px]">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search categories..."
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
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Table Container */}
          {!loading && (
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
                          className={`hover:bg-gray-50 transition-colors ${
                            selectedDocuments.includes(doc.id) ? 'bg-blue-50/50' : ''
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
                          <td className="px-6 py-4 text-center align-middle relative action-menu-container" ref={actionMenuRef}>
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
                                {doc.file_url && (
                                  <a
                                    href={doc.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <FiDownload className="w-4 h-4" />
                                    Download
                                  </a>
                                )}
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
          )}
        </div>
      </div>

      {/* Categories Table for General Tab */}
      {activeTab === 'general' && categories.length > 0 && (
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remark</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created By</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Modified By</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Modified Date</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.category_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{category.remark || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {category.create_by?.name || category.create_by?.username || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {category.create_date ? new Date(category.create_date).toLocaleDateString() : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {category.modify_by?.name || category.modify_by?.username || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {category.modify_date ? new Date(category.modify_date).toLocaleDateString() : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditCategoryModal(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Category"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.category_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Category"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredDocuments.length > 0 && !loading && (
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
          <UploadModal 
            onClose={() => setShowUploadModal(false)} 
            tab={activeTab}
            firms={firms}
            loadingFirms={loadingFirms}
            assessmentYears={assessmentYears}
            financialYears={financialYears}
            loadingYears={loadingYears}
            documentTypes={documentTypes}
            loadingTypes={loadingTypes}
            categories={categories}
            loadingCategories={loadingCategories}
            months={months}
            onSubmit={handleUploadSubmit}
            uploadLoading={uploadLoading}
            uploadProgress={uploadProgress}
            fileInputRef={fileInputRef}
            uploadForm={uploadForm}
            handleUploadFormChange={handleUploadFormChange}
            handleFileSelect={handleFileSelect}
            removeFile={removeFile}
          />
        )}
        {showCreateCategoryModal && (
          <CreateCategoryModal 
            onClose={() => setShowCreateCategoryModal(false)} 
            onCreate={handleCreateCategory}
            loading={categoryLoading}
          />
        )}
        {showEditCategoryModal && (
          <EditCategoryModal 
            onClose={() => {
              setShowEditCategoryModal(false);
              setSelectedCategoryForEdit(null);
            }} 
            onEdit={handleEditCategory}
            loading={categoryLoading}
            category={selectedCategoryForEdit}
          />
        )}
        {showViewModal && selectedDocument && (
          <ViewModal document={selectedDocument} onClose={() => setShowViewModal(false)} />
        )}
        {showSendModal && (
          <SendModal
            document={selectedDocument}
            selectedDocuments={selectedDocuments}
            onClose={() => {
              setShowSendModal(false);
            }}
            onSubmit={handleSendSubmit}
            loading={sendLoading}
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