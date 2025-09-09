import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { Application, PrepEntry, StarStory, CompanyResearch, NetworkingContact, UserProfile } from '../../../types';
import { User } from 'firebase/auth';

const Leaderboard = ({ 
    user,
    applications, 
    prepEntries, 
    stories, 
    companies, 
    contacts 
}: {
    user: (User & { publicUsername?: string }) | null;
    applications: Application[];
    prepEntries: PrepEntry[];
    stories: StarStory[];
    companies: CompanyResearch[];
    contacts: NetworkingContact[];
}) => {
    const { isPublishing, publishScore, fetchLeaderboard } = useLeaderboard(user?.uid);
    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
    const [selectedBoard, setSelectedBoard] = useState('weeklyApplications');

    const calculateScore = useCallback(() => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        switch(selectedBoard) {
            case 'weeklyApplications':
                return applications.filter(app => new Date(app.date) > oneWeekAgo).length;
            case 'weeklyPrepHours':
                return prepEntries
                    .filter(entry => new Date(entry.date) > oneWeekAgo)
                    .reduce((acc, entry) => acc + entry.time, 0) / 60;
            case 'totalStories':
                return stories.length;
            default:
                return 0;
        }
    }, [selectedBoard, applications, prepEntries, stories]);

    useEffect(() => {
        fetchLeaderboard(selectedBoard).then(setLeaderboardData);
    }, [selectedBoard, fetchLeaderboard]);

    const handlePublish = async () => {
        if (!user?.publicUsername) {
            alert("Something went wrong, username not found.");
            return;
        }
        const score = calculateScore();
        await publishScore(selectedBoard, score, user.publicUsername);
        fetchLeaderboard(selectedBoard).then(setLeaderboardData);
    };

    return (
        <div className="bg-white/5 p-6 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Leaderboards</h3>
            {/* This will be expanded with tabs/dropdowns later */}
            <p className="text-white/70 mb-4">Current category: {selectedBoard}</p>
            <motion.button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-6 py-2 rounded-full bg-cyan-500 text-white font-bold"
                whileHover={{ scale: 1.05 }}
            >
                {isPublishing ? 'Publishing...' : 'Publish My Score'}
            </motion.button>

            <div className="mt-6 space-y-2">
                {leaderboardData.map((entry, index) => (
                    <div key={entry.userId} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                        <p><span className="font-bold">#{index + 1}</span> {entry.username}</p>
                        <p className="font-bold text-cyan-400">{entry.score.toFixed(1)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;