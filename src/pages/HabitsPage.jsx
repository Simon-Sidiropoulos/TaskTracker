import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, X, Flame, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subDays } from 'date-fns';

function HabitCard({ habit, onToggle, onDelete }) {
  const [showCalendar, setShowCalendar] = useState(false);
  
  const calculateStreak = () => {
    if (!habit.completions || habit.completions.length === 0) return 0;
    
    const sortedDates = [...habit.completions].sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const completionDate = new Date(sortedDates[i]);
      completionDate.setHours(0, 0, 0, 0);
      
      const expectedDate = subDays(currentDate, streak);
      
      if (isSameDay(completionDate, expectedDate)) {
        streak++;
      } else if (completionDate < expectedDate) {
        break;
      }
    }
    
    return streak;
  };

  const isCompletedToday = () => {
    if (!habit.completions) return false;
    const today = new Date().toISOString().split('T')[0];
    return habit.completions.includes(today);
  };

  const streak = calculateStreak();
  const completedToday = isCompletedToday();

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {habit.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(habit.id)}
          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Flame className={`${streak > 0 ? 'text-orange-500' : 'text-gray-400'}`} size={24} />
          <div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {streak}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              day streak
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
        >
          <CalendarIcon size={20} />
        </button>

        <button
          onClick={() => onToggle(habit.id, new Date())}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            completedToday
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {completedToday ? 'Completed ✓' : 'Mark Complete'}
        </button>
      </div>

      {showCalendar && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-600 dark:text-gray-400">
                {day}
              </div>
            ))}
            {daysInMonth.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isCompleted = habit.completions?.includes(dateStr);
              const isToday = isSameDay(day, new Date());
              
              return (
                <button
                  key={dateStr}
                  onClick={() => onToggle(habit.id, day)}
                  className={`aspect-square rounded text-xs font-medium transition-colors ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isToday
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HabitsPage() {
  const { habits, addHabit, deleteHabit, toggleHabitCompletion } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newHabit.name.trim()) {
      addHabit(newHabit);
      setNewHabit({ name: '', description: '' });
      setIsAdding(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Habits</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Build lasting habits with streak tracking
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          New Habit
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Habit Name *
              </label>
              <input
                type="text"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Drink 8 glasses of water"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Optional description"
                rows="2"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Create Habit
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

      {habits.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Flame size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            No habits yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create your first habit to start building streaks!
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={toggleHabitCompletion}
              onDelete={deleteHabit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
