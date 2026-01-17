import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
// import { availableFields, defaultColumnConfig } from '';

const SettingsModal = ({ 
  isOpen, 
  onClose, 
  columnConfig, 
  onSaveColumnConfig,
  onResetToDefault 
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Table Column Settings</h2>
              <p className="text-indigo-100 text-sm mt-1">Customize your task table view</p>
            </div>
            <motion.button 
              onClick={onClose}
              className="text-white hover:text-indigo-200 p-1 rounded-lg hover:bg-indigo-500"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {/* Column Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-6">
              {columnConfig.map((column, columnIndex) => (
                <motion.div 
                  key={column.id}
                  className={`border-2 rounded-xl p-4 ${column.fixed ? 'bg-indigo-50 border-indigo-300 shadow-sm' : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2">{column.name}</span>
                    {column.fixed && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">Fixed</span>}
                  </h3>
                  {/* Column items and add field select */}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t px-6 py-4 bg-gray-50 flex justify-between items-center">
            {/* Reset, Cancel, Save buttons */}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal;
