import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Button } from '@/components/ui/Button';

interface WeeklyCommitmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  channelName?: string;
}

export const WeeklyCommitmentDialog: React.FC<WeeklyCommitmentDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  channelName
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Weekly Creator Commitment
                </Dialog.Title>

                {channelName && (
                  <p className="mt-2 text-sm text-gray-500">
                    You're about to add <span className="font-medium">{channelName}</span> to weekly tracking.
                  </p>
                )}

                <div className="mt-4 space-y-4">
                  <p className="text-sm text-gray-500">
                    By joining, you're committing to:
                  </p>

                  <ul className="space-y-3">
                    <CommitmentItem
                      emoji="📅"
                      title="Weekly Uploads"
                      description="Upload at least one video every week"
                    />
                    <CommitmentItem
                      emoji="🎯"
                      title="Consistent Schedule"
                      description="Maintain a regular content schedule"
                    />
                    <CommitmentItem
                      emoji="🔥"
                      title="Build Your Streak"
                      description="Track your weekly streak and stay motivated"
                    />
                  </ul>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={onConfirm}>
                    I'm Committed
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

interface CommitmentItemProps {
  emoji: string;
  title: string;
  description: string;
}

const CommitmentItem: React.FC<CommitmentItemProps> = ({ emoji, title, description }) => (
  <li className="flex items-start space-x-3">
    <div className="flex-shrink-0 text-xl">{emoji}</div>
    <div>
      <p className="font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </li>
);