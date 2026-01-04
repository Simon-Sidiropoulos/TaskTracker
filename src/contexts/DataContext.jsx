import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);

  // Load data when user changes (login/logout/switch account)
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`data_${user.id}`);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setTasks(data.tasks || []);
          setHabits(data.habits || []);
          setGoals(data.goals || []);
          setTimeEntries(data.timeEntries || []);
        } catch (error) {
          console.error('Error loading data:', error);
          setTasks([]);
          setHabits([]);
          setGoals([]);
          setTimeEntries([]);
        }
      } else {
        // No data for this user yet
        setTasks([]);
        setHabits([]);
        setGoals([]);
        setTimeEntries([]);
      }
    } else {
      // User logged out, clear data
      setTasks([]);
      setHabits([]);
      setGoals([]);
      setTimeEntries([]);
    }
  }, [user]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`data_${user.id}`, JSON.stringify({
        tasks,
        habits,
        goals,
        timeEntries,
      }));
    }
  }, [tasks, habits, goals, timeEntries, user]);

  // Task operations
  const addTask = (task) => {
    const newTask = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'todo',
      ...task,
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, ...updates } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Habit operations
  const addHabit = (habit) => {
    const newHabit = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completions: [],
      ...habit,
    };
    setHabits([...habits, newHabit]);
    return newHabit;
  };

  const updateHabit = (id, updates) => {
    setHabits(habits.map(habit => habit.id === id ? { ...habit, ...updates } : habit));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const toggleHabitCompletion = (habitId, date) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completions = habit.completions || [];
        const dateStr = date.toISOString().split('T')[0];
        const index = completions.indexOf(dateStr);
        
        if (index > -1) {
          return { ...habit, completions: completions.filter(d => d !== dateStr) };
        } else {
          return { ...habit, completions: [...completions, dateStr] };
        }
      }
      return habit;
    }));
  };

  // Goal operations
  const addGoal = (goal) => {
    const newGoal = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      milestones: [],
      progress: 0,
      ...goal,
    };
    setGoals([...goals, newGoal]);
    return newGoal;
  };

  const updateGoal = (id, updates) => {
    setGoals(goals.map(goal => goal.id === id ? { ...goal, ...updates } : goal));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const addMilestone = (goalId, milestone) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newMilestone = {
          id: Date.now().toString(),
          completed: false,
          ...milestone,
        };
        return { ...goal, milestones: [...(goal.milestones || []), newMilestone] };
      }
      return goal;
    }));
  };

  const toggleMilestone = (goalId, milestoneId) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const milestones = goal.milestones.map(m => 
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const progress = (milestones.filter(m => m.completed).length / milestones.length) * 100;
        return { ...goal, milestones, progress: Math.round(progress) };
      }
      return goal;
    }));
  };

  // Time tracking operations
  const addTimeEntry = (entry) => {
    const newEntry = {
      id: Date.now().toString(),
      ...entry,
    };
    setTimeEntries([...timeEntries, newEntry]);
    return newEntry;
  };

  const updateTimeEntry = (id, updates) => {
    setTimeEntries(timeEntries.map(entry => entry.id === id ? { ...entry, ...updates } : entry));
  };

  const deleteTimeEntry = (id) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
  };

  return (
    <DataContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      habits,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabitCompletion,
      goals,
      addGoal,
      updateGoal,
      deleteGoal,
      addMilestone,
      toggleMilestone,
      timeEntries,
      addTimeEntry,
      updateTimeEntry,
      deleteTimeEntry,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
