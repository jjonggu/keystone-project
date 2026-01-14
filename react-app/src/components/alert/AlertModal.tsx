import React from "react";

interface AlertModalProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ message, type, onClose }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[400px] text-center shadow-2xl animate-in fade-in zoom-in duration-300 border border-zinc-100">
        <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl ${
          type === "success" ? "bg-zinc-900 text-white" : "bg-red-50 text-red-600"
        }`}>
          {type === "success" ? "✓" : "!"}
        </div>
        <h3 className={`text-2xl font-black mb-2 tracking-tight ${
          type === "success" ? "text-black" : "text-red-600"
        }`}>
          {type === "success" ? "알림" : "오류"}
        </h3>
        <p className="text-zinc-500 mb-8 font-medium leading-relaxed whitespace-pre-wrap">
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-zinc-800 transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default AlertModal;