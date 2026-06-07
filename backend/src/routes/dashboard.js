import { Router } from 'express';
import { addTask, getDashboardState, updateTaskMilestone } from '../data/store.js';
import { localizeTask, normalizeLocale } from '../services/i18n.js';
import { sendNotification } from '../services/notify.js';

const router = Router();

router.get('/dashboard', (request, response) => {
  const locale = normalizeLocale(request.query.locale ?? 'en');
  const state = getDashboardState();

  response.json({
    locale,
    tasks: state.tasks.map((task) => localizeTask(task, locale)),
    telemetry: state.telemetry,
    regulations: state.regulations,
    inventory: state.inventory
  });
});

router.post('/tasks', (request, response) => {
  const locale = normalizeLocale(request.body?.locale ?? 'en');
  const title = request.body?.title ?? {};
  const summary = request.body?.summary ?? {};

  const createdTask = addTask({
    locale,
    status: request.body?.status,
    priority: request.body?.priority,
    carrier: request.body?.carrier,
    route: request.body?.route,
    title: {
      en: title.en ?? title,
      es: title.es ?? title
    },
    summary: {
      en: summary.en ?? summary,
      es: summary.es ?? summary
    },
    subtasks: request.body?.subtasks,
    milestone: request.body?.milestone
  });

  response.status(201).json({
    task: localizeTask(createdTask, locale)
  });
});

router.patch('/tasks/:taskId/milestone', async (request, response, next) => {
  try {
    const locale = normalizeLocale(request.body?.locale ?? 'en');
    const milestone = String(request.body?.milestone ?? '').trim();

    if (!milestone) {
      return response.status(400).json({
        error: 'A milestone is required.'
      });
    }

    const updatedTask = updateTaskMilestone(request.params.taskId, milestone);

    if (!updatedTask) {
      return response.status(404).json({
        error: 'Task not found.'
      });
    }

    const notification = request.body?.notifyOwner === false
      ? null
      : await sendNotification({ task: updatedTask, locale });

    response.json({
      task: localizeTask(updatedTask, locale),
      notification
    });
  } catch (error) {
    next(error);
  }
});

export default router;
