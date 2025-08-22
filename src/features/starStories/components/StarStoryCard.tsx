import React from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { StarStory } from '../../../types';

interface StarStoryCardProps {
  story: StarStory;
  onEditStory: (story: StarStory) => void;
  onDeleteStory: (id: string) => void;
}

const StarStoryCard: React.FC<StarStoryCardProps> = ({ story, onEditStory, onDeleteStory }) => {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 flex justify-between items-center">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{story.title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditStory(story)}
            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            aria-label="Edit story"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDeleteStory(story.id as string)}
            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label="Delete story"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4 space-y-3 text-sm">
        <div>
          <strong className="text-blue-700 dark:text-blue-400 font-semibold">Situation:</strong>
          <p className="mt-1 text-slate-700 dark:text-slate-300">{story.situation}</p>
        </div>
        <div>
          <strong className="text-purple-700 dark:text-purple-400 font-semibold">Task:</strong>
          <p className="mt-1 text-slate-700 dark:text-slate-300">{story.task}</p>
        </div>
        <div>
          <strong className="text-orange-700 dark:text-orange-400 font-semibold">Action:</strong>
          <p className="mt-1 text-slate-700 dark:text-slate-300">{story.action}</p>
        </div>
        <div>
          <strong className="text-green-700 dark:text-green-400 font-semibold">Result:</strong>
          <p className="mt-1 text-slate-700 dark:text-slate-300">{story.result}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StarStoryCard);
