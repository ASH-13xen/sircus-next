"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function LeaderboardPage() {
  // This automatically updates in real-time!
  const topUsers = useQuery(api.users.getLeaderboard);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">🏆 Top Students</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {topUsers === undefined ? (
          <div className="p-4 text-center">Loading rankings...</div>
        ) : (
          topUsers.map((user, index) => (
            <div 
              key={user._id} 
              className={`flex items-center justify-between p-4 border-b ${
                index < 3 ? "bg-yellow-50" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`font-bold text-lg w-8 ${
                  index === 0 ? "text-yellow-600 text-2xl" : 
                  index === 1 ? "text-gray-500 text-xl" : 
                  index === 2 ? "text-orange-600 text-xl" : "text-gray-400"
                }`}>
                  #{index + 1}
                </span>
                
                {/* Avatar */}
                <img 
                  src={user.image || "/default-avatar.png"} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full bg-gray-200"
                />
                
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-blue-600">
                    {user.currentXP} XP  {/* Changed from totalSkills */}
                </p>
                <p className="text-xs text-gray-400">Experience</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}