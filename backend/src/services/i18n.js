const messages = {
  en: {
    title: (task) => task.title?.en ?? task.title ?? 'Untitled job',
    summary: (task) => task.summary?.en ?? task.summary ?? '',
    notify: '[Desert Sky Workforce]: Job milestone update for owner review.'
  },
  es: {
    title: (task) => task.title?.es ?? task.title ?? 'Trabajo sin titulo',
    summary: (task) => task.summary?.es ?? task.summary ?? '',
    notify: '[Desert Sky Workforce]: Actualizacion de hito para revision del dueno.'
  }
};

export const normalizeLocale = (locale) => (String(locale).toLowerCase() === 'es' ? 'es' : 'en');

export const localizeTask = (task, locale) => {
  const language = normalizeLocale(locale);
  return {
    ...task,
    localizedTitle: messages[language].title(task),
    localizedSummary: messages[language].summary(task)
  };
};

export const buildNotificationBody = ({ task, locale }) => {
  const language = normalizeLocale(locale);
  const title = messages[language].title(task);
  const summary = messages[language].summary(task);

  return `${messages[language].notify}\nJob: ${title}\nMilestone: ${task.milestone ?? 'Review needed'}\nSummary: ${summary}`.trim();
};
