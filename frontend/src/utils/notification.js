import { toast } from 'react-toastify';

/**
 * Show a notification toast
 * @param {string} message - The message to display
 * @param {string} type - The notification type: 'success', 'error', 'warning', 'info'
 * @param {Object} options - Additional options for toast
 */
export const showNotification = (message, type = 'info', options = {}) => {
  const defaultOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };
  
  const toastOptions = { ...defaultOptions, ...options };
  
  switch (type) {
    case 'success':
      toast.success(message, toastOptions);
      break;
    case 'error':
      toast.error(message, toastOptions);
      break;
    case 'warning':
      toast.warning(message, toastOptions);
      break;
    case 'info':
    default:
      toast.info(message, toastOptions);
  }
};

/**
 * Show a confirmation dialog
 * @param {string} message - The message to display
 * @param {function} onConfirm - Function to call if user confirms
 * @param {function} onCancel - Function to call if user cancels
 */
export const showConfirmation = (message, onConfirm, onCancel) => {
  if (window.confirm(message)) {
    onConfirm();
  } else if (onCancel) {
    onCancel();
  }
};

const notificationUtils = { showNotification, showConfirmation };

export default notificationUtils;
