import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readJson = (fileName) => JSON.parse(readFileSync(join(__dirname, fileName), 'utf8'));

const tasks = readJson('fleetTasks.json');
const telemetry = readJson('telemetryRecords.json');
const regulations = readJson('regulatoryTracks.json');
const inventory = readJson('inventoryItems.json');
const workspace = readJson('workspaceProfile.json');

const clone = (value) => JSON.parse(JSON.stringify(value));

let taskState = clone(tasks);

export const getDashboardState = () => ({
  tasks: clone(taskState),
  telemetry: clone(telemetry),
  regulations: clone(regulations),
  inventory: clone(inventory),
  workspace: clone(workspace)
});

export const addTask = (incomingTask) => {
  const createdTask = {
    id: `task-${String(taskState.length + 1).padStart(3, '0')}`,
    status: incomingTask.status ?? 'scheduled',
    priority: incomingTask.priority ?? 'medium',
    carrier: incomingTask.carrier ?? 'Client / Department',
    route: incomingTask.route ?? 'TBD',
    title: incomingTask.title,
    summary: incomingTask.summary,
    subtasks: incomingTask.subtasks ?? [],
    milestone: incomingTask.milestone ?? 'Job intake',
    updatedAt: new Date().toISOString(),
    locale: incomingTask.locale ?? 'en'
  };

  taskState = [createdTask, ...taskState];

  return clone(createdTask);
};

export const getTaskById = (taskId) => taskState.find((task) => task.id === taskId) ?? null;

export const updateTaskMilestone = (taskId, milestone) => {
  const taskIndex = taskState.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return null;
  }

  const updatedTask = {
    ...taskState[taskIndex],
    milestone,
    updatedAt: new Date().toISOString()
  };

  taskState = taskState.map((task, index) => (index === taskIndex ? updatedTask : task));

  return clone(updatedTask);
};
