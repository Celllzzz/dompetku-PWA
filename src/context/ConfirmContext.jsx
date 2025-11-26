import { createContext, useContext, useState } from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "danger",
    isExiting: false, // Tambahan State Animasi
  });

  const showConfirm = (title, message, onConfirmAction, type = "danger") => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: onConfirmAction,
      type,
      isExiting: false, // Reset animasi
    });
  };

  const closeConfirm = () => {
    // 1. Set flag exiting menjadi TRUE
    setConfirmState((prev) => ({ ...prev, isExiting: true }));

    // 2. Tunggu 300ms (durasi animasi CSS), baru tutup total
    setTimeout(() => {
      setConfirmState((prev) => ({ ...prev, isOpen: false, isExiting: false }));
    }, 300);
  };

  const handleYes = () => {
    if (confirmState.onConfirm) {
      confirmState.onConfirm();
    }
    closeConfirm();
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}

      {confirmState.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          
          {/* Backdrop: Fade In/Out menggunakan transition Tailwind biasa */}
          <div 
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
              confirmState.isExiting ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={closeConfirm}
          ></div>

          {/* Modal Box: Menggunakan keyframes custom kita */}
          <div className={`bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative z-10 
            ${confirmState.isExiting ? 'animate-popup-out' : 'animate-popup-in'}`
          }>
            
            <div className="p-6 pb-0 flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                confirmState.type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
              }`}>
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {confirmState.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {confirmState.message}
              </p>
            </div>

            <div className="p-6 flex gap-3">
              <button 
                onClick={closeConfirm}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleYes}
                className={`flex-1 py-3 px-4 text-white font-semibold rounded-xl shadow-lg transition-transform active:scale-95 ${
                  confirmState.type === 'danger' 
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                }`}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};