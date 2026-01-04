import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Play, Pause, Square, Clock, Calendar } from 'lucide-react';
import { format, formatDuration, intervalToDuration } from 'date-fns';

function Timer({ onStop }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [description, setDescription] = useState('');
  const [taskLink, setTaskLink] = useState('');
  const { tasks } = useData();

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    if (seconds > 0) {
      onStop({
        description,
        taskId: taskLink,
        startTime: new Date(Date.now() - seconds * 1000).toISOString(),
        endTime: new Date().toISOString(),
        duration: seconds,
      });
      setSeconds(0);
      setIsRunning(false);
      setDescription('');
      setTaskLink('');
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 shadow-lg border border-gray-200 dark:border-gray-600">
      <div className="text-center mb-6">
        <div className="text-6xl font-bold text-gray-800 dark:text-white mb-4">
          {formatTime(seconds)}
        </div>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What are you working on?"
          className="w-full px-4 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white mb-3"
        />
        <select
          value={taskLink}
          onChange={(e) => setTaskLink(e.target.value)}
          className="w-full px-4 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option value="">Link to a task (optional)</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={() => setIsRunning(true)}
            className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
          >
            <Play size={20} />
            Start
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsRunning(false)}
              className="flex items-center gap-2 px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors"
            >
              <Pause size={20} />
              Pause
            </button>
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              <Square size={20} />
              Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function TimeEntryCard({ entry, tasks, onDelete }) {
  const task = tasks.find((t) => t.id === entry.taskId);
  const duration = intervalToDuration({
    start: 0,
    end: entry.duration * 1000,
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-blue-600 dark:text-blue-400" size={18} />
            <span className="font-medium text-gray-800 dark:text-white">
              {entry.description || 'Untitled time entry'}
            </span>
          </div>
          
          {task && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Linked to: {task.title}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {format(new Date(entry.startTime), 'MMM dd, yyyy')}
            </span>
            <span>
              {format(new Date(entry.startTime), 'HH:mm')} - {format(new Date(entry.endTime), 'HH:mm')}
            </span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {formatDuration(duration, { format: ['hours', 'minutes'] })}
            </span>
          </div>
        </div>

        <button
          onClick={() => onDelete(entry.id)}
          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function TimePage() {
  const { timeEntries, addTimeEntry, deleteTimeEntry, tasks } = useData();
  const [filter, setFilter] = useState('all'); // all, today, week

  const handleStopTimer = (entry) => {
    addTimeEntry(entry);
  };

  const filteredEntries = timeEntries
    .filter((entry) => {
      if (filter === 'today') {
        return format(new Date(entry.startTime), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
      }
      if (filter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(entry.startTime) >= weekAgo;
      }
      return true;
    })
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

  const totalDuration = filteredEntries.reduce((sum, entry) => sum + entry.duration, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Time Tracking</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track time spent on tasks and projects
        </p>
      </div>

      <div className="mb-6">
        <Timer onStop={handleStopTimer} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
              Time Summary
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded text-sm ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setFilter('today')}
                className={`px-3 py-1 rounded text-sm ${
                  filter === 'today'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setFilter('week')}
                className={`px-3 py-1 rounded text-sm ${
                  filter === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                This Week
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-800 dark:text-white">
              {formatDuration(
                intervalToDuration({ start: 0, end: totalDuration * 1000 }),
                { format: ['hours', 'minutes'] }
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total time tracked
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Recent Entries
        </h2>
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Clock size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              No time entries yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start the timer to track your time!
            </p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <TimeEntryCard
              key={entry.id}
              entry={entry}
              tasks={tasks}
              onDelete={deleteTimeEntry}
            />
          ))
        )}
      </div>
    </div>
  );
}
