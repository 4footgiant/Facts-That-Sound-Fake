import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ShieldAlert } from 'lucide-react';

interface CustomDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function CustomDialog({
  isOpen,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'CANCEL',
  showCancel = false,
  onConfirm,
  onCancel
}: CustomDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-5 z-[999]" id="dialog_overlay">
          {/* Backdrop click doesn't close to prevent accident */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-sm bg-neutral-905 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            id="dialog_box"
          >
            {/* Header */}
            <div className="bg-[#0b0b0c] border-b border-neutral-900 p-4 flex items-center gap-2.5">
              <ShieldAlert size={16} className="text-red-500 shrink-0" />
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 font-bold uppercase truncate flex-1">
                {title}
              </span>
              <Terminal size={12} className="text-neutral-600 shrink-0" />
            </div>

            {/* Message Body */}
            <div className="p-5 flex-1 select-none">
              <p className="text-xs text-neutral-300 font-sans leading-relaxed whitespace-pre-line text-left">
                {message}
              </p>
            </div>

            {/* Actions Footer */}
            <div className="p-4 bg-[#0a0a0b] border-t border-neutral-900 grid grid-cols-2 gap-3 shrink-0">
              {showCancel ? (
                <button
                  onClick={onCancel}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-400 font-mono text-[10px] tracking-widest uppercase rounded-lg transition active:scale-97 cursor-pointer"
                  id="btn_dialog_cancel"
                >
                  {cancelText}
                </button>
              ) : (
                <div /> // Empty filler to align primary button to right side
              )}
              
              <button
                onClick={onConfirm}
                className="w-full py-2 bg-red-950/30 hover:bg-red-900/30 border border-red-900/50 hover:border-red-500/40 text-red-400 font-mono text-[10px] tracking-widest uppercase rounded-lg transition active:scale-97 cursor-pointer"
                id="btn_dialog_confirm"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
