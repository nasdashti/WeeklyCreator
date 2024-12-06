import React from 'react';

interface HistoricalDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
}

export const HistoricalDatePicker: React.FC<HistoricalDatePickerProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div>
      <label htmlFor="historicalDate" className="block text-sm font-medium text-gray-700">
        Historical Content Start Date (Optional)
      </label>
      <div className="mt-1">
        <input
          type="date"
          id="historicalDate"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          disabled={disabled}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">
        If you've been consistently uploading before joining, select your first video date
      </p>
    </div>
  );
};