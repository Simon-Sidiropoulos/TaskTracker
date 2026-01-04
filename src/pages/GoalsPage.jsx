import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, X, Target, CheckCircle, Circle } from 'lucide-react';
import { format } from 'date-fns';

function GoalCard({ goal, onUpdate, onDelete, onAddMilestone, onToggleMilestone }) {
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('');

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (milestoneTitle.trim()) {
      onAddMilestone(goal.id, { title: milestoneTitle });
      setMilestoneTitle('');
      setIsAddingMilestone(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-blue-600 dark:text-blue-400" size={24} />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {goal.title}
            </h3>
          </div>
          {goal.description && (
            <p className="text-gray-600 dark:text-gray-400 ml-8">
              {goal.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
        >
          <X size={18} />
        </button>
      </div>

      {goal.targetDate && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 ml-8">
          Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6 ml-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {goal.progress || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${goal.progress || 0}%` }}
          />
        </div>
      </div>

      {/* Milestones */}
      <div className="ml-8">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">
            Milestones
          </h4>
          <button
            onClick={() => setIsAddingMilestone(!isAddingMilestone)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Add Milestone
          </button>
        </div>

        {isAddingMilestone && (
          <form onSubmit={handleAddMilestone} className="mb-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={milestoneTitle}
                onChange={(e) => setMilestoneTitle(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Milestone title"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingMilestone(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {goal.milestones && goal.milestones.length > 0 ? (
          <div className="space-y-2">
            {goal.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <button
                  onClick={() => onToggleMilestone(goal.id, milestone.id)}
                  className="flex-shrink-0"
                >
                  {milestone.completed ? (
                    <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                  ) : (
                    <Circle className="text-gray-400" size={20} />
                  )}
                </button>
                <span
                  className={`flex-1 ${
                    milestone.completed
                      ? 'line-through text-gray-500 dark:text-gray-500'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {milestone.title}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-500 italic">
            No milestones yet. Add some to track your progress!
          </p>
        )}
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, addMilestone, toggleMilestone } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newGoal.title.trim()) {
      addGoal(newGoal);
      setNewGoal({ title: '', description: '', targetDate: '' });
      setIsAdding(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Goals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Set long-term goals and break them into milestones
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          New Goal
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Goal Title *
              </label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Learn a new language"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Describe your goal"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Date
              </label>
              <input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Create Goal
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Target size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            No goals yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create your first goal and start achieving!
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdate={updateGoal}
              onDelete={deleteGoal}
              onAddMilestone={addMilestone}
              onToggleMilestone={toggleMilestone}
            />
          ))}
        </div>
      )}
    </div>
  );
}
