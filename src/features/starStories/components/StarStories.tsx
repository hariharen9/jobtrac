import React from 'react';
import { Star, Plus, Trash2, Pencil } from 'lucide-react';
import { StarStory } from '../../../types';

interface StarStoriesProps {
  stories: StarStory[];
  onAddStory: () => void;
  onEditStory: (story: StarStory) => void;
  onDeleteStory: (id: string) => void;
  loading?: boolean;
}

const StarStories: React.FC<StarStoriesProps> = ({ stories, onAddStory, onEditStory, onDeleteStory, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Star className="w-5 h-5" />
            Behavioral Story Bank (STAR Method)
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading stories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Star className="w-5 h-5" />
          Behavioral Story Bank (STAR Method)
        </h2>
        <button
          onClick={onAddStory}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Story
        </button>
      </div>
      <div className="space-y-6">
        {stories.map(story => (
          <div key={story.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
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
        ))}
        {stories.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No behavioral stories yet. Click "Add Story" to start building your STAR method story bank!
          </div>
        )}
      </div>
    </div>
  );
};

export default StarStories;