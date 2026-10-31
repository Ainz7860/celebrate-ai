// ============================================================
// CelebrateAI — Dashboard Timeline Tab (Luxury Cyber-Luxe)
// ============================================================

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { daysUntil, todayString } from '@/lib/dates';
import type { TimelinePlan, Task, TaskPriority, TaskCategory } from '@/lib/types';

interface TimelineTabProps {
  timeline: TimelinePlan;
  eventDate: string;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onAddTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  timeline,
  eventDate,
  onUpdateTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // New Task Form
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('high');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('planning');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  useEffect(() => {
    setNewTaskDeadline(todayString());
  }, []);

  const tasks = timeline.tasks;
  const completionRate =
    timeline.totalCount > 0
      ? Math.round((timeline.completedCount / timeline.totalCount) * 100)
      : 0;

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
        const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => a.deadline.localeCompare(b.deadline));
  }, [tasks, searchQuery, filterStatus, filterPriority]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    const task: Task = {
      id: uuidv4(),
      name: newTaskName.trim(),
      description: newTaskDescription.trim(),
      deadline: newTaskDeadline,
      category: newTaskCategory,
      priority: newTaskPriority,
      status: newTaskDeadline < todayString() ? 'overdue' : 'pending',
      notes: '',
      isUserCreated: true,
    };

    onAddTask(task);
    setIsAddModalOpen(false);
    setNewTaskName('');
    setNewTaskDescription('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Timeline Header Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block">
            Total Milestones
          </span>
          <p className="text-2xl sm:text-3xl font-black text-white font-display mt-2 font-mono">
            {timeline.totalCount}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">Scheduled deliverables</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30 shadow-lg shadow-emerald-950/40">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest block">
            Completed Tasks
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-300 font-display mt-2 font-mono">
            {timeline.completedCount}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">{completionRate}% execution progress</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-rose-500/30 shadow-lg shadow-rose-950/40">
          <span className="text-[11px] font-bold text-rose-300 uppercase tracking-widest block">
            Overdue Tasks
          </span>
          <p
            className={`text-2xl sm:text-3xl font-black font-display mt-2 font-mono ${
              timeline.overdueCount > 0 ? 'text-rose-400 animate-pulse' : 'text-white'
            }`}
          >
            {timeline.overdueCount}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">Requires immediate attention</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 shadow-lg shadow-amber-950/40">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
            Upcoming Next 7 Days
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-300 font-display mt-2 font-mono">
            {timeline.upcomingCount}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">Approaching deadlines</span>
        </div>
      </div>

      {/* Progress Bar Card */}
      <Card padding="sm">
        <ProgressBar
          value={completionRate}
          label="Overall Milestones Execution"
          sublabel={`${timeline.completedCount} of ${timeline.totalCount} completed (${completionRate}%)`}
          color={completionRate > 75 ? 'emerald' : 'violet'}
          size="md"
        />
      </Card>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 glass-panel rounded-2xl border border-white/10">
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Search milestone tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-stone-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <select
            aria-label="Filter Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs px-3 py-2 bg-[#120D26] border border-white/15 rounded-xl text-stone-200 focus:outline-none focus:border-violet-400 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="overdue">Overdue</option>
            <option value="done">Completed</option>
          </select>

          <select
            aria-label="Filter Priority"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-xs px-3 py-2 bg-[#120D26] border border-white/15 rounded-xl text-stone-200 focus:outline-none focus:border-violet-400 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<span>+</span>}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3.5">
        {filteredTasks.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center text-stone-400 text-xs">
            No milestones match your selected filter criteria.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const dueDays = daysUntil(task.deadline);
            const isDone = task.status === 'done';

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isDone
                    ? 'border-white/5 bg-white/2 opacity-60'
                    : task.status === 'overdue'
                    ? 'border-rose-500/40 bg-rose-950/20 shadow-lg shadow-rose-950/30'
                    : 'glass-panel hover:border-violet-500/40'
                }`}
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={(e) =>
                      onUpdateTask(task.id, {
                        status: e.target.checked ? 'done' : 'pending',
                      })
                    }
                    className="mt-1 h-5 w-5 text-violet-600 rounded-lg border-white/20 bg-white/10 focus:ring-violet-500 cursor-pointer"
                  />

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className={`text-sm sm:text-base font-bold text-white tracking-tight ${
                          isDone ? 'line-through text-stone-500' : ''
                        }`}
                      >
                        {task.name}
                      </span>
                      <Badge variant={task.priority} size="sm">
                        {task.priority}
                      </Badge>
                      <Badge variant={task.status} size="sm">
                        {task.status}
                      </Badge>
                      <span className="text-[10px] text-violet-300 font-bold uppercase tracking-wider">
                        {task.category}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Meta & Actions */}
                <div className="flex items-center gap-4 sm:shrink-0 text-xs pl-9 sm:pl-0">
                  <div className="text-right">
                    <span className="block font-bold text-white font-mono">{task.deadline}</span>
                    <span
                      className={`text-[11px] font-mono ${
                        isDone
                          ? 'text-stone-500'
                          : dueDays < 0
                          ? 'text-rose-400 font-extrabold'
                          : dueDays <= 7
                          ? 'text-amber-400 font-bold'
                          : 'text-stone-400'
                      }`}
                    >
                      {isDone
                        ? 'Done ✓'
                        : dueDays < 0
                        ? `${Math.abs(dueDays)} days overdue!`
                        : dueDays === 0
                        ? 'Due today!'
                        : `${dueDays} days remaining`}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-stone-500 hover:text-rose-400 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Milestone Task"
        subtitle="Schedule a deliverable or action item"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Task Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Schedule venue walk-through with florist"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Target Deadline *
              </label>
              <input
                type="date"
                value={newTaskDeadline}
                onChange={(e) => setNewTaskDeadline(e.target.value)}
                className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Priority
              </label>
              <select
                aria-label="Priority"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                className="w-full text-sm px-4 py-2.5 bg-[#120D26] border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              aria-label="Category"
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
              className="w-full text-sm px-4 py-2.5 bg-[#120D26] border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
            >
              <option value="planning">Planning & Management</option>
              <option value="venue">Venue</option>
              <option value="catering">Catering & Bar</option>
              <option value="photography">Photography / Video</option>
              <option value="decorations">Decorations & Florals</option>
              <option value="entertainment">Entertainment & Music</option>
              <option value="transport">Transport</option>
              <option value="legal">Legal & Permits</option>
              <option value="invitations">Invitations & RSVPs</option>
              <option value="attire">Attire & Styling</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Description & Guidance
            </label>
            <textarea
              rows={3}
              placeholder="Provide instructions, contacts, or requirements for this task..."
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/8">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
