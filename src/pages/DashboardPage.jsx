import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { CheckSquare, Target, Clock, TrendingUp, Flame, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { tasks, habits, goals, timeEntries } = useData();

  const todayTasks = tasks.filter(t => 
    t.dueDate && format(new Date(t.dueDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const upcomingTasks = tasks
    .filter(t => t.status !== 'done' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const activeHabits = habits.slice(0, 3);

  const activeGoals = goals
    .filter(g => g.progress < 100)
    .sort((a, b) => (b.progress || 0) - (a.progress || 0))
    .slice(0, 3);

  const todayTimeEntries = timeEntries.filter(e =>
    format(new Date(e.startTime), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const todayTotalTime = todayTimeEntries.reduce((sum, e) => sum + e.duration, 0);
  const todayHours = Math.floor(todayTotalTime / 3600);
  const todayMinutes = Math.floor((todayTotalTime % 3600) / 60);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's your productivity overview
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <Link to="/tasks" className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <CheckSquare size={32} className="mb-3" />
          <div className="text-3xl font-bold mb-1">{tasks.filter(t => t.status !== 'done').length}</div>
          <div className="text-blue-100">Active Tasks</div>
        </Link>

        <Link to="/habits" className="bg-linear-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <Flame size={32} className="mb-3" />
          <div className="text-3xl font-bold mb-1">{habits.length}</div>
          <div className="text-green-100">Daily Habits</div>
        </Link>

        <Link to="/goals" className="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <Target size={32} className="mb-3" />
          <div className="text-3xl font-bold mb-1">{goals.length}</div>
          <div className="text-purple-100">Active Goals</div>
        </Link>

        <Link to="/time" className="bg-linear-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <Clock size={32} className="mb-3" />
          <div className="text-3xl font-bold mb-1">{todayHours}h {todayMinutes}m</div>
          <div className="text-orange-100">Today's Time</div>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Today's Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Due Today
            </h2>
            <Link to="/tasks" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </Link>
          </div>
          {todayTasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              No tasks due today
            </p>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <span className="flex-1 text-gray-800 dark:text-white">{task.title}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.status === 'done' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Upcoming Tasks
            </h2>
            <Link to="/tasks" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              No upcoming tasks
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="flex-1 text-gray-800 dark:text-white">{task.title}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {format(new Date(task.dueDate), 'MMM dd')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Habits & Goals */}
      <div className="grid grid-cols-2 gap-6">
        {/* Active Habits */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Today's Habits
            </h2>
            <Link to="/habits" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </Link>
          </div>
          {activeHabits.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              No habits to track
            </p>
          ) : (
            <div className="space-y-3">
              {activeHabits.map((habit) => {
                const today = new Date().toISOString().split('T')[0];
                const isCompleted = habit.completions?.includes(today);
                return (
                  <div key={habit.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      {isCompleted && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="flex-1 text-gray-800 dark:text-white">{habit.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Goals */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Goal Progress
            </h2>
            <Link to="/goals" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </Link>
          </div>
          {activeGoals.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              No active goals
            </p>
          ) : (
            <div className="space-y-4">
              {activeGoals.map((goal) => (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {goal.title}
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {goal.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${goal.progress || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
