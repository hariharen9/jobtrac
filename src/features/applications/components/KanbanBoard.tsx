import React, { useState, useRef, useMemo } from 'react';
import { MoreHorizontal, ExternalLink, Pencil, Trash2, Plus } from 'lucide-react';
import { Application, ApplicationStatus } from '../../../types';
import { statusColors } from '../../../utils/statusColors';

interface KanbanBoardProps {
  applications: Application[];
  onAddApplication: () => void;
  onEditApplication: (application: Application) => void;
  onDeleteApplication: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
  loading?: boolean;
}

interface KanbanColumn {
  id: ApplicationStatus;
  title: string;
  color: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  onAddApplication,
  onEditApplication,
  onDeleteApplication,
  onUpdateStatus,
  loading = false
}) => {
  const [draggedItem, setDraggedItem] = useState<Application | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const columns: KanbanColumn[] = [
    { id: 'To Apply', title: 'To Apply', color: 'bg-gray-50 dark:bg-gray-800/50 amoled:bg-amoled-card' },
    { id: 'Applied', title: 'Applied', color: 'bg-blue-50 dark:bg-blue-900/20 amoled:bg-amoled-card' },
    { id: 'HR Screen', title: 'HR Screen', color: 'bg-yellow-50 dark:bg-yellow-900/20 amoled:bg-amoled-card' },
    { id: 'Tech Screen', title: 'Tech Screen', color: 'bg-orange-50 dark:bg-orange-900/20 amoled:bg-amoled-card' },
    { id: 'Round 1', title: 'Round 1', color: 'bg-purple-50 dark:bg-purple-900/20 amoled:bg-amoled-card' },
    { id: 'Manager Round', title: 'Manager Round', color: 'bg-indigo-50 dark:bg-indigo-900/20 amoled:bg-amoled-card' },
    { id: 'Final Round', title: 'Final Round', color: 'bg-pink-50 dark:bg-pink-900/20 amoled:bg-amoled-card' },
    { id: 'Offer', title: 'Offer', color: 'bg-green-50 dark:bg-green-900/20 amoled:bg-amoled-card' },
    { id: 'Rejected', title: 'Rejected', color: 'bg-red-50 dark:bg-red-900/20 amoled:bg-amoled-card' },
    { id: 'Ghosted', title: 'Ghosted', color: 'bg-gray-100 dark:bg-gray-700/50 amoled:bg-amoled-card' }
  ];

  // Group applications by status
  const applicationsByStatus = useMemo(() => {
    return applications.reduce((acc, app) => {
      if (!acc[app.status]) {
        acc[app.status] = [];
      }
      acc[app.status].push(app);
      return acc;
    }, {} as Record<ApplicationStatus, Application[]>);
  }, [applications]);

  const handleDragStart = (e: React.DragEvent, application: Application) => {
    setDraggedItem(application);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverColumn(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    void e; // Explicitly ignore the parameter
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ApplicationStatus) => {
    e.preventDefault();
    dragCounter.current = 0;
    
    if (draggedItem && draggedItem.status !== targetStatus) {
      onUpdateStatus(draggedItem.id, targetStatus);
    }
    
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            <MoreHorizontal className="w-5 h-5" />
            Application Pipeline
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading pipeline...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
          <MoreHorizontal className="w-5 h-5" />
          Application Pipeline
        </h2>
        <button
          onClick={onAddApplication}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center sm:justify-start"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </button>
      </div>

      {/* Mobile View - Vertical Cards */}
      <div className="lg:hidden space-y-6">
        {columns.map(column => {
          const columnApplications = applicationsByStatus[column.id] || [];
          
          return (
            <div key={column.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${statusColors[column.id].split(' ')[0]}`}></span>
                  {column.title}
                </h3>
                <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                  {columnApplications.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {columnApplications.map(app => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onEdit={onEditApplication}
                    onDelete={onDeleteApplication}
                    isDragging={false}
                  />
                ))}
                
                {columnApplications.length === 0 && (
                  <div className="text-center py-6 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                    No applications
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View - Horizontal Kanban */}
      <div className="hidden lg:block">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map(column => {
            const columnApplications = applicationsByStatus[column.id] || [];
            const isDropTarget = dragOverColumn === column.id;
            
            return (
              <div
                key={column.id}
                className={`flex-shrink-0 w-72 ${column.color} rounded-lg transition-all duration-200 ${
                  isDropTarget ? 'ring-2 ring-indigo-500 shadow-lg scale-105' : ''
                }`}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${statusColors[column.id].split(' ')[0]}`}></span>
                      {column.title}
                    </h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-full">
                      {columnApplications.length}
                    </span>
                  </div>
                </div>

                {/* Column Content */}
                <div className="p-4 space-y-3 min-h-[200px]">
                  {columnApplications.map(app => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      onEdit={onEditApplication}
                      onDelete={onDeleteApplication}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedItem?.id === app.id}
                    />
                  ))}
                  
                  {columnApplications.length === 0 && !isDropTarget && (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-lg">
                      Drop applications here
                    </div>
                  )}
                  
                  {isDropTarget && columnApplications.length === 0 && (
                    <div className="text-center py-8 text-indigo-600 dark:text-indigo-400 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                      Drop here to move to {column.title}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {applications.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          No applications yet. Click "Add Application" to get started!
        </div>
      )}
    </div>
  );
};

// Application Card Component
interface ApplicationCardProps {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
  onDragStart?: (e: React.DragEvent, application: Application) => void;
  onDragEnd?: () => void;
  isDragging: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging
}) => {
  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart ? (e) => onDragStart(e, application) : undefined}
      onDragEnd={onDragEnd}
      className={`bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : 'hover:scale-[1.02]'
      } ${onDragStart ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text truncate">
            {application.company}
          </h4>
          <a
            href={application.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            {application.role}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(application);
            }}
            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
            aria-label="Edit application"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(application.id);
            }}
            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
            aria-label="Delete application"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex justify-between">
          <span>Applied:</span>
          <span className="font-medium">{application.date}</span>
        </div>
        
        {application.location && (
          <div className="flex justify-between">
            <span>Location:</span>
            <span className="font-medium">{application.location}</span>
          </div>
        )}
        
        {application.referral === 'Y' && (
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 text-xs px-2 py-1 rounded-full">
              Referral
            </span>
          </div>
        )}
        
        {application.nextStep && (
          <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-600 rounded text-xs">
            <span className="font-medium">Next: </span>
            {application.nextStep}
          </div>
        )}
        
        {application.notes && (
          <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-600 rounded text-xs">
            <div className="font-medium mb-1">Notes:</div>
            <div className="line-clamp-2">{application.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;
