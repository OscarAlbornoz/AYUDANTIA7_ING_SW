import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTaskSchema } from '../schemas/task.schema';
import tasksService from '../services/tasks.service';

export function EditTaskModal({ task, onTaskUpdated, onClose }) {
  const [apiError, setApiError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateTaskSchema),
    mode: 'onChange',
    defaultValues: {
      title: task.title,
      description: task.description || '',
      completed: task.completed,
    },
  });

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isSubmitting, onClose]);

  const onSubmit = async (data) => {
    try {
      setApiError(null);
      const updatedTask = await tasksService.update(task.id, data);
      onTaskUpdated(updatedTask);
    } catch (error) {
      setApiError(error.message || 'No se pudo actualizar la tarea.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="edit-task-title" className="text-xl font-semibold text-white">Editar tarea</h2>
            <p className="mt-1 text-sm text-slate-400">Actualiza los datos y guarda los cambios.</p>
          </div>
          <button type="button" onClick={onClose} disabled={isSubmitting} aria-label="Cerrar edición" className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50">×</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {apiError && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{apiError}</p>}

          <div>
            <label htmlFor="edit-task-name" className="mb-1.5 block text-sm font-medium text-slate-300">Título <span className="text-indigo-400">*</span></label>
            <input
              id="edit-task-name"
              autoFocus
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'edit-task-title-error' : undefined}
              {...register('title')}
              className={`w-full rounded-xl border bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:ring-2 ${errors.title ? 'border-rose-500 focus:ring-rose-500/30' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'}`}
            />
            {errors.title && <p id="edit-task-title-error" role="alert" className="mt-1.5 text-xs text-rose-400">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="edit-task-description" className="mb-1.5 block text-sm font-medium text-slate-300">Descripción <span className="text-xs text-slate-500">(opcional)</span></label>
            <textarea
              id="edit-task-description"
              rows="4"
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'edit-task-description-error' : undefined}
              {...register('description')}
              className={`w-full resize-y rounded-xl border bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:ring-2 ${errors.description ? 'border-rose-500 focus:ring-rose-500/30' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'}`}
            />
            {errors.description && <p id="edit-task-description-error" role="alert" className="mt-1.5 text-xs text-rose-400">{errors.description.message}</p>}
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-300">
            <input type="checkbox" {...register('completed')} className="h-4 w-4 accent-indigo-500" />
            Marcar como completada
          </label>

          <div className="flex justify-end gap-3 border-t border-slate-700 pt-4">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? 'Guardando...' : 'Guardar cambios'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}