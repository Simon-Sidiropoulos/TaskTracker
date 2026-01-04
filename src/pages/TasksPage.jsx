import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, X, Calendar, Flag, Tag, GripVertical, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

function SortableTask({ task, onUpdate, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const statusOptions = ['todo', 'in-progress', 'done'];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={20} />
        </button>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-gray-800 dark:text-white">
              {task.title}
            </h3>
            <button
              onClick={() => onDelete(task.id)}
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <X size={18} />
            </button>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <select
              value={task.status}
              onChange={(e) => onUpdate(task.id, { status: e.target.value })}
              className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <span className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority || 'medium']}`}>
              {task.priority || 'medium'}
            </span>

            {task.dueDate && (
              <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Calendar size={14} />
                {format(new Date(task.dueDate), 'MMM dd, yyyy')}
              </span>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="flex gap-1">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-3 space-y-1">
              {task.subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => {
                      const updatedSubtasks = [...task.subtasks];
                      updatedSubtasks[index] = { ...subtask, completed: !subtask.completed };
                      onUpdate(task.id, { subtasks: updatedSubtasks });
                    }}
                    className="rounded"
                  />
                  <span className={subtask.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [sortedTasks, setSortedTasks] = useState(tasks);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSortedTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      addTask(newTask);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
        tags: [],
      });
      setIsAdding(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !newTask.tags.includes(tagInput.trim())) {
      setNewTask({ ...newTask, tags: [...newTask.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setNewTask({ ...newTask, tags: newTask.tags.filter(t => t !== tag) });
  };

  // Update sortedTasks when tasks change
  useEffect(() => {
    setSortedTasks(tasks);
  }, [tasks]);

  const todoTasks = sortedTasks.filter(t => t.status === 'todo');
  const inProgressTasks = sortedTasks.filter(t => t.status === 'in-progress');
  const doneTasks = sortedTasks.filter(t => t.status === 'done');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your tasks with priorities and deadlines
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Task title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Task description"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Add tag and press Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Add
                </button>
              </div>
              {newTask.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newTask.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Create Task
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

      <div className="grid grid-cols-3 gap-6">
        {/* To Do Column */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
            To Do ({todoTasks.length})
          </h2>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={todoTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {todoTasks.map((task) => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* In Progress Column */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            In Progress ({inProgressTasks.length})
          </h2>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={inProgressTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {inProgressTasks.map((task) => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Done Column */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
            Done ({doneTasks.length})
          </h2>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={doneTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {doneTasks.map((task) => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
