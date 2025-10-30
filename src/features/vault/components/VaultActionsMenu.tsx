import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical,
  Plus,
  Download,
  Upload,
  CheckSquare,
  FileText,
  FileImage,
  Database,
  Grid3X3,
  Zap,
  Copy,
  Star,
  Globe,
  Trash2
} from 'lucide-react';
import { VaultResource } from '../../../types';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';

interface VaultActionsMenuProps {
  resources: VaultResource[];
  selectedResources: string[];
  onQuickAdd: () => void;
  onBulkActions: () => void;
  onExport: (format: 'json' | 'csv' | 'md' | 'pdf') => void;
}

const VaultActionsMenu: React.FC<VaultActionsMenuProps> = ({
  resources,
  selectedResources,
  onQuickAdd,
  onBulkActions,
  onExport
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format: 'json' | 'csv' | 'md' | 'pdf') => {
    onExport(format);
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: Zap,
      label: 'Quick Add',
      action: () => {
        onQuickAdd();
        setIsOpen(false);
      },
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: CheckSquare,
      label: 'Bulk Actions',
      action: () => {
        onBulkActions();
        setIsOpen(false);
      },
      color: 'text-purple-600 dark:text-purple-400'
    },
    { type: 'divider' },
    {
      icon: Database,
      label: 'Export as JSON',
      action: () => handleExport('json'),
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Grid3X3,
      label: 'Export as CSV',
      action: () => handleExport('csv'),
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: FileText,
      label: 'Export as Markdown',
      action: () => handleExport('md'),
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: FileImage,
      label: 'Export as PDF',
      action: () => handleExport('pdf'),
      color: 'text-green-600 dark:text-green-400',
      disabled: resources.length === 0
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg text-slate-700 dark:text-dark-text amoled:text-amoled-text rounded-lg hover:bg-slate-200 dark:hover:bg-dark-border amoled:hover:bg-amoled-border transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
        <span className="text-sm font-medium">Actions</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-0 sm:transform-none top-full mt-2 w-48 sm:w-56 bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-lg z-50"
          >
            <div className="p-2">
              {menuItems.map((item, index) => {
                if (item.type === 'divider') {
                  return (
                    <div
                      key={index}
                      className="my-2 border-t border-slate-200 dark:border-dark-border amoled:border-amoled-border"
                    />
                  );
                }

                const Icon = item.icon!;
                return (
                  <button
                    key={index}
                    onClick={item.action}
                    disabled={item.disabled}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                      item.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-slate-50 dark:hover:bg-dark-bg amoled:hover:bg-amoled-bg'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-slate-700 dark:text-dark-text amoled:text-amoled-text">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VaultActionsMenu;