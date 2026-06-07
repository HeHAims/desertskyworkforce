import { Router } from 'express';
import { getTaskById } from '../data/store.js';
import { normalizeLocale } from '../services/i18n.js';
import { sendNotification } from '../services/notify.js';

const router = Router();

// Enforce absolute primary dispatch line at the service layer; do not accept overrides.
router.post('/notify', async (request, response, next) => {
  try {
    const locale = normalizeLocale(request.body?.locale ?? 'en');
    const taskId = request.body?.taskId;
    const task = taskId ? getTaskById(taskId) : request.body?.task;

    if (!task) {
      return response.status(400).json({
        error: 'A task or taskId is required to send notification.'
      });
    }

    const result = await sendNotification({ task, locale });

    response.status(201).json({
      ok: true,
      notification: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;
