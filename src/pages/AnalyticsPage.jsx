import { useData } from '../contexts/DataContext';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from 'date-fns';
import { TrendingUp, CheckCircle, Target, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  const { tasks, habits, goals, timeEntries } = useData();

  // Task completion stats
  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'done').length,
  };

  // Tasks by priority
  const tasksByPriority = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' },
  ];

  // Weekly task completion
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, 'yyyy-MM-dd');
  });

  const weeklyTaskData = last7Days.map(date => {
    const tasksCompleted = tasks.filter(t => 
      t.status === 'done' && t.updatedAt && format(new Date(t.updatedAt), 'yyyy-MM-dd') === date
    ).length;
    return {
      date: format(new Date(date), 'EEE'),
      completed: tasksCompleted,
    };
  });

  // Habit consistency
  const habitStats = habits.map(habit => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return format(date, 'yyyy-MM-dd');
    });
    
    const completedDays = last30Days.filter(date => 
      habit.completions?.includes(date)
    ).length;
    
    return {
      name: habit.name,
      consistency: Math.round((completedDays / 30) * 100),
    };
  });

  // Goal progress
  const goalProgress = goals.map(goal => ({
    name: goal.title.length > 20 ? goal.title.substring(0, 20) + '...' : goal.title,
    progress: goal.progress || 0,
  }));

  // Time tracking by day
  const timeByDay = last7Days.map(date => {
    const entries = timeEntries.filter(e => 
      format(new Date(e.startTime), 'yyyy-MM-dd') === date
    );
    const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0) / 60;
    return {
      date: format(new Date(date), 'EEE'),
      hours: parseFloat((totalMinutes / 60).toFixed(1)),
    };
  });

  // Total time this week
  const totalTimeThisWeek = timeEntries
    .filter(e => {
      const entryDate = new Date(e.startTime);
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      return entryDate >= weekStart && entryDate <= weekEnd;
    })
    .reduce((sum, e) => sum + e.duration, 0);

  const totalHours = Math.floor(totalTimeThisWeek / 3600);
  const totalMinutes = Math.floor((totalTimeThisWeek % 3600) / 60);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Insights and trends from your productivity data
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
            <TrendingUp className="text-gray-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {taskStats.completed}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Tasks Completed
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Target className="text-blue-600 dark:text-blue-400" size={24} />
            <TrendingUp className="text-gray-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {habits.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Active Habits
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Target className="text-purple-600 dark:text-purple-400" size={24} />
            <TrendingUp className="text-gray-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {goals.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Active Goals
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-orange-600 dark:text-orange-400" size={24} />
            <TrendingUp className="text-gray-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {totalHours}h {totalMinutes}m
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            This Week
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Task Completion Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Tasks Completed (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyTaskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="completed" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks by Priority */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Tasks by Priority
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={tasksByPriority}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {tasksByPriority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Habit Consistency */}
        {habitStats.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Habit Consistency (Last 30 Days)
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={habitStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="name" type="category" width={100} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="consistency" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Goal Progress */}
        {goalProgress.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Goal Progress
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={goalProgress} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="name" type="category" width={100} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="progress" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Time Tracking */}
        {timeEntries.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Time Tracked (Last 7 Days)
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timeByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
