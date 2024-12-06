import React from 'react';
import { Dialog } from '@headlessui/react';
import { CalendarIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface WeeklyCommitmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const WeeklyCommitmentDialog: React.FC<WeeklyCommitmentDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Weekly Creator Commitment
          </Dialog.Title>

          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-4">
              By joining, you're committing to:
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <CalendarIcon className="h-6 w-6 text-indigo-500 mr-3" />
                <span className="text-sm">
                  Publishing at least one video every week
                </span>
              </li>
              <li className="flex items-start">
                <ClockIcon className="h-6 w-6 text-indigo-500 mr-3" />
                <span className="text-sm">
                  Maintaining consistent upload schedule
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-indigo-500 mr-3" />
                <span className="text-sm">
                  Building your creator streak
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
              onClick={onConfirm}
            >
              I'm Committed
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};