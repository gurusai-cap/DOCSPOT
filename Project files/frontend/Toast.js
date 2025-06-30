import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`toast-container ${type}`}> 
      {message}
      <style>{`
        .toast-container {
          position: fixed;
          top: 1.5rem;
          right: 2rem;
          z-index: 9999;
          min-width: 220px;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.08rem;
          box-shadow: 0 4px 24px rgba(25, 118, 210, 0.13);
          animation: toastIn 0.4s;
        }
        .toast-container.success {
          background: #e8f5e9;
          color: #388e3c;
        }
        .toast-container.error {
          background: #ffebee;
          color: #d32f2f;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Toast; 