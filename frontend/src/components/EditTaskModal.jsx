import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTaskSchema } from '../schemas/task.schema';
import tasksService from '../services/tasks.service';

export function EditTaskModal({ task, onTaskUpdated, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || '',
      completed: task.completed || false,
    },
  });

  const onSubmit = async (data) => {
    try {
      await tasksService.update(task.id, data);
      onTaskUpdated(); 
      onClose();       
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-md border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white">Editar Tarea</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Título</label>
            <input
              type="text"
              {...register('title')}
              className="mt-1 w-full border border-slate-600 bg-slate-700 text-white p-2 rounded-md focus:outline-none focus:border-indigo-500"
            />
            {errors.title && (
              <p className="text-rose-400 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Descripción</label>
            <textarea
              {...register('description')}
              className="mt-1 w-full border border-slate-600 bg-slate-700 text-white p-2 rounded-md focus:outline-none focus:border-indigo-500"
              rows="3"
            />
            {errors.description && (
              <p className="text-rose-400 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="completed"
              {...register('completed')}
              className="w-4 h-4 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-800"
            />
            <label htmlFor="completed" className="text-sm font-medium text-slate-300">
              Completada
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-700/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}