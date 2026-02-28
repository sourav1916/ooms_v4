import React from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

const NotesTab = ({ notes, onAddNote, variants }) => {
    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white rounded-lg border border-gray-200 p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Task Notes</h3>
                <motion.button
                    onClick={onAddNote}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiPlus className="w-4 h-4" />
                    Add Note
                </motion.button>
            </div>

            <div className="space-y-4">
                {notes.map((note, index) => (
                    <motion.div
                        key={note.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        <p className="text-gray-800 mb-2">{note.content}</p>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>By {note.author}</span>
                            <span>{note.date} | {note.time}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default NotesTab;