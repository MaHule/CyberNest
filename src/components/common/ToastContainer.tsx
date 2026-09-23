import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-10 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        let borderClass = 'border-[#1e293b]';
        let bgClass = 'bg-[#111827]';
        let Icon = Info;
        let iconColor = 'text-[#38bdf8]';

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/50';
          bgClass = 'bg-[#0f1f1d]';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-500/50';
          bgClass = 'bg-[#201116]';
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/50';
          bgClass = 'bg-[#20180d]';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-3 p-3 rounded-lg border shadow-xl ${bgClass} ${borderClass} text-xs text-[#f1f5f9] animate-in fade-in slide-in-from-bottom-2 duration-150`}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[13px] leading-tight">{toast.title}</div>
              {toast.message && (
                <div className="text-[#94a3b8] text-[11px] mt-0.5 truncate font-mono">
                  {toast.message}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-[#64748b] hover:text-[#f1f5f9] p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
