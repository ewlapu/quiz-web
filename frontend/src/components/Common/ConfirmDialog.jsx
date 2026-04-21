import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', type = 'danger' }) {
  const getIcon = () => {
    if (type === 'warning') {
      return <AlertCircle className="h-6 w-6 text-yellow-600" />;
    }
    if (type === 'primary' || type === 'info') {
      return <Info className="h-6 w-6 text-blue-600" />;
    }
    return <AlertTriangle className="h-6 w-6 text-red-600" />;
  };

  const getButtonClass = () => {
    if (type === 'danger') return 'btn-danger';
    if (type === 'warning') return 'btn-secondary';
    return 'btn-primary';
  };

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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getIcon()}
                  </div>
                  <div className="flex-1">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-2">
                      {title}
                    </Dialog.Title>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {typeof message === 'string' ? <p>{message}</p> : message}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                  <button onClick={onClose} className="btn btn-secondary">
                    Hủy
                  </button>
                  <button 
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }} 
                    className={`btn ${getButtonClass()}`}
                  >
                    {confirmText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
