import React from 'react';
import { Star, Plus } from 'lucide-react';
import { StarStory } from '../../../types';
import StarStoryCard from './StarStoryCard';

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
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Story
        </button>
      </div>
      <div className="space-y-6">
        {stories.map(story => (
          <StarStoryCard 
            key={story.id} 
            story={story} 
            onEditStory={onEditStory} 
            onDeleteStory={onDeleteStory} 
          />
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

export default React.memo(StarStories);