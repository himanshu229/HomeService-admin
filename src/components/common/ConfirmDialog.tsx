import React from "react";

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  loading?: boolean;
}

const ConfirmDialog: React.FC<Props> = ({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
  loading = false,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Are you sure?</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>
      <div className="flex gap-3 mt-6 justify-end">
        <button onClick={onCancel} className="btn-secondary" disabled={loading}>
          Cancel
        </button>
        <button onClick={onConfirm} className="btn-danger" disabled={loading}>
          {loading ? "Deleting..." : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
