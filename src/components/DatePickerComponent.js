import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar, ChevronDown } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

// Custom input component for date picker
const CustomDateInput = forwardRef(({ value, onClick, placeholder, error }, ref) => (
    <div className="relative group" onClick={onClick} ref={ref}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 text-indigo-500" />
        </div>
        <input
            type="text"
            readOnly
            className={`w-full pl-10 pr-10 py-2.5 text-sm border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 cursor-pointer hover:border-indigo-400 transition-all`}
            placeholder={placeholder}
            value={value || ''}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
    </div>
));

// Date Picker Component for Date of Birth
export default function DatePickerComponent({
    selectedDate,
    onDateChange,
    error,
    placeholder = "DD/MM/YYYY",
}) {
    return (
        <>
            <style>{`
                /* DatePicker Styles - Normal Header, Blue Dropdowns */
                .react-datepicker {
                    font-family: inherit;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.75rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .react-datepicker__header {
                    background: linear-gradient(to right, #eef2ff, #f5f3ff);
                    border-bottom: 1px solid #e5e7eb;
                    padding-top: 0.75rem;
                }
                .react-datepicker__current-month {
                    color: #374151;
                    font-weight: 600;
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                }
                .react-datepicker__day-names {
                    display: flex;
                    justify-content: space-around;
                    padding: 0.5rem 0;
                    margin: 0;
                }
                .react-datepicker__day-name {
                    color: #6b7280;
                    font-weight: 600;
                    font-size: 0.7rem;
                    width: 2rem;
                    line-height: 2rem;
                    margin: 0;
                    text-transform: uppercase;
                }
                .react-datepicker__month {
                    margin: 0.5rem;
                }
                .react-datepicker__week {
                    display: flex;
                    justify-content: space-around;
                }
                .react-datepicker__day {
                    width: 2rem;
                    height: 2rem;
                    line-height: 2rem;
                    margin: 0.125rem;
                    border-radius: 0.375rem;
                    color: #374151;
                    font-weight: 500;
                    font-size: 0.85rem;
                    transition: all 0.15s ease;
                }
                .react-datepicker__day:hover {
                    background-color: #eef2ff;
                    color: #4f46e5;
                }
                .react-datepicker__day--selected,
                .react-datepicker__day--in-range,
                .react-datepicker__day--in-selecting-range {
                    background-color: #4f46e5 !important;
                    color: white !important;
                    font-weight: 600;
                }
                .react-datepicker__day--range-start,
                .react-datepicker__day--range-end {
                    background-color: #4338ca !important;
                }
                .react-datepicker__day--keyboard-selected {
                    background-color: #eef2ff;
                    color: #4f46e5;
                }
                .react-datepicker__day--today {
                    font-weight: 700;
                    color: #4f46e5;
                    background-color: #eef2ff;
                }
                .react-datepicker__day--disabled {
                    color: #d1d5db;
                    cursor: not-allowed;
                }
                .react-datepicker__day--disabled:hover {
                    background-color: transparent;
                }
                .react-datepicker__day--outside-month {
                    color: #d1d5db;
                }
                .react-datepicker__navigation {
                    top: 0.75rem;
                }
                .react-datepicker__navigation-icon::before {
                    border-color: #6b7280;
                }
                .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
                    border-color: #4f46e5;
                }
                
                /* Year and Month Dropdown Styles - Professional Blue Theme */
                .react-datepicker__header__dropdown {
                    padding: 0.25rem 0 0.5rem 0;
                }
                
                .react-datepicker__year-dropdown-container,
                .react-datepicker__month-dropdown-container {
                    margin: 0 4px;
                }
                
                .react-datepicker__year-read-view,
                .react-datepicker__month-read-view {
                    color: #374151;
                    font-weight: 500;
                    font-size: 0.85rem;
                    background: white;
                    padding: 0.25rem 1.5rem 0.25rem 0.75rem;
                    border-radius: 0.375rem;
                    border: 1px solid #e5e7eb;
                    transition: all 0.15s ease;
                    position: relative;
                }
                
                .react-datepicker__year-read-view:hover,
                .react-datepicker__month-read-view:hover {
                    border-color: #4f46e5;
                    background-color: #f5f3ff;
                }
                
                .react-datepicker__year-read-view--down-arrow,
                .react-datepicker__month-read-view--down-arrow {
                    border-color: #6b7280;
                    top: 8px;
                    right: 4px;
                }
                
                .react-datepicker__year-read-view:hover .react-datepicker__year-read-view--down-arrow,
                .react-datepicker__month-read-view:hover .react-datepicker__month-read-view--down-arrow {
                    border-color: #4f46e5;
                }
                
                .react-datepicker__year-dropdown,
                .react-datepicker__month-dropdown {
                    background-color: white;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.75rem;
                    box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    padding: 0.5rem;
                    max-height: 250px;
                    overflow-y: auto;
                    min-width: 120px;
                }
                
                /* Custom scrollbar for dropdowns */
                .react-datepicker__year-dropdown::-webkit-scrollbar,
                .react-datepicker__month-dropdown::-webkit-scrollbar {
                    width: 6px;
                }
                
                .react-datepicker__year-dropdown::-webkit-scrollbar-track,
                .react-datepicker__month-dropdown::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                
                .react-datepicker__year-dropdown::-webkit-scrollbar-thumb,
                .react-datepicker__month-dropdown::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                
                .react-datepicker__year-dropdown::-webkit-scrollbar-thumb:hover,
                .react-datepicker__month-dropdown::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                
                .react-datepicker__year-option,
                .react-datepicker__month-option {
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    transition: all 0.15s ease;
                    color: #374151;
                    font-weight: 500;
                    font-size: 0.85rem;
                    cursor: pointer;
                }
                
                .react-datepicker__year-option:hover,
                .react-datepicker__month-option:hover {
                    background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
                    color: #4f46e5;
                    transform: translateX(2px);
                }
                
                .react-datepicker__year-option--selected,
                .react-datepicker__month-option--selected {
                    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%) !important;
                    color: white !important;
                    font-weight: 600;
                }
                
                .react-datepicker__year-option--selected:hover,
                .react-datepicker__month-option--selected:hover {
                    background: linear-gradient(135deg, #4338ca 0%, #4f46e5 100%) !important;
                }
                
                .react-datepicker__navigation--years {
                    display: none;
                }
                
                .datepicker-popper-custom {
                    z-index: 99999 !important;
                }
                
                /* Animation for dropdown */
                .react-datepicker-popper {
                    animation: slideUp 0.2s ease-out;
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

            <div className="relative w-full">
                <DatePicker
                    selected={selectedDate}
                    onChange={onDateChange}
                    customInput={<CustomDateInput placeholder={placeholder} error={error} />}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    maxDate={new Date()}
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    yearDropdownItemNumber={100}
                    popperClassName="!z-[99999]"
                    popperPlacement="bottom-start"
                    shouldCloseOnSelect={true}
                />
            </div>
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </>
    );
}