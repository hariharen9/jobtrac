import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Plus, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Filter, 
  Search,
  Hash,
  Tag
} from 'lucide-react';
import { CodingProblem, ProblemPlatform, ProblemDifficulty, ProblemStatus } from '../../../types';
import { formatDistanceToNow } from 'date-fns';
import EmptyState from '../../../components/shared/EmptyState';

interface ProblemTrackerProps {
  problems: CodingProblem[];
  onAddProblem: () => void;
  onEditProblem: (problem: CodingProblem) => void;
  onDeleteProblem: (id: string) => void;
}

const difficultyColors: Record<ProblemDifficulty, string> = {
  Easy: 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400',
  Hard: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400'
};

const statusColors: Record<ProblemStatus, string> = {
  Todo: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400',
  Solved: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
  Attempted: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
  'Revision Needed': 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400'
};

const ProblemTracker: React.FC<ProblemTrackerProps> = ({ 
  problems, 
  onAddProblem, 
  onEditProblem, 
  onDeleteProblem 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<ProblemPlatform | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ProblemDifficulty | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<ProblemStatus | 'All'>('All');

  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPlatform = selectedPlatform === 'All' || problem.platform === selectedPlatform;
      const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
      const matchesStatus = selectedStatus === 'All' || problem.status === selectedStatus;

      return matchesSearch && matchesPlatform && matchesDifficulty && matchesStatus;
    }).sort((a, b) => {
      // Sort by solved date (newest first) or created date
      const dateA = a.solvedDate ? new Date(a.solvedDate).getTime() : a.createdAt.toMillis();
      const dateB = b.solvedDate ? new Date(b.solvedDate).getTime() : b.createdAt.toMillis();
      return dateB - dateA;
    });
  }, [problems, searchTerm, selectedPlatform, selectedDifficulty, selectedStatus]);

  const stats = useMemo(() => {
    return {
      total: problems.length,
      solved: problems.filter(p => p.status === 'Solved').length,
      easy: problems.filter(p => p.difficulty === 'Easy' && p.status === 'Solved').length,
      medium: problems.filter(p => p.difficulty === 'Medium' && p.status === 'Solved').length,
      hard: problems.filter(p => p.difficulty === 'Hard' && p.status === 'Solved').length,
    };
  }, [problems]);

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Solved</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            {stats.solved} <span className="text-sm font-normal text-slate-400">/ {stats.total}</span>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
          <div className="text-sm text-green-600 dark:text-green-400 mb-1">Easy</div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.easy}</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
          <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Medium</div>
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.medium}</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
          <div className="text-sm text-red-600 dark:text-red-400 mb-1">Hard</div>
          <div className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.hard}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-dark-text amoled:text-amoled-text"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as ProblemPlatform | 'All')}
            className="px-3 py-2 bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-lg text-sm text-slate-700 dark:text-dark-text amoled:text-amoled-text outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Platforms</option>
            <option value="LeetCode">LeetCode</option>
            <option value="NeetCode">NeetCode</option>
            <option value="HackerRank">HackerRank</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as ProblemDifficulty | 'All')}
            className="px-3 py-2 bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-lg text-sm text-slate-700 dark:text-dark-text amoled:text-amoled-text outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddProblem}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Problem
          </motion.button>
        </div>
      </div>

      {/* Problem List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredProblems.map((problem) => (
            <motion.div
              key={problem.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-sm group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColors[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[problem.status]}`}>
                      {problem.status}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      {problem.platform}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {problem.link ? (
                      <a href={problem.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                        {problem.title}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      problem.title
                    )}
                  </h3>

                  {problem.tags && problem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {problem.tags.map((tag, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          <Hash className="w-3 h-3 text-slate-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  {problem.timeSpent && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {problem.timeSpent}m
                    </div>
                  )}
                  {problem.solvedDate && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {new Date(problem.solvedDate).toLocaleDateString()}
                    </div>
                  )}
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEditProblem(problem)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-300 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDeleteProblem(problem.id)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredProblems.length === 0 && (
          <EmptyState
            title="No Problems Found"
            message={searchTerm ? "Try adjusting your search or filters" : "Start tracking your coding journey by adding your first problem!"}
            buttonText="Add Problem"
            onButtonClick={onAddProblem}
            icon={<Code2 className="w-12 h-12 text-slate-400" />}
          />
        )}
      </div>
    </div>
  );
};

export default ProblemTracker;