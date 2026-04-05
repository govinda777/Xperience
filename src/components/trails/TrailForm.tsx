import React from 'react';
import { Field } from '../../types/trails';

interface TrailFormProps {
  fields: Field[];
  data: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
  onSubmit: () => void;
  onBack?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const TrailForm: React.FC<TrailFormProps> = ({
  fields,
  data,
  onChange,
  onSubmit,
  onBack,
  isFirst,
  isLast
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const renderField = (field: Field) => {
    const value = data[field.id] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition min-h-[120px]"
          />
        );
      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.required}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition bg-white"
          >
            <option value="">Selecione uma opção</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label key={opt.value} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => onChange(field.id, e.target.value)}
                  required={field.required}
                  className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((opt) => {
              const checkedValues = Array.isArray(value) ? value : [];
              const isChecked = checkedValues.includes(opt.value);

              return (
                <label key={opt.value} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    value={opt.value}
                    checked={isChecked}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...checkedValues, opt.value]
                        : checkedValues.filter((v: string) => v !== opt.value);
                      onChange(field.id, newValues);
                    }}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500 rounded"
                  />
                  <span className="text-gray-700">{opt.label}</span>
                </label>
              );
            })}
          </div>
        );
      case 'text':
      default:
        return (
          <input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-8">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className="block text-sm font-bold text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-100">
        {!isFirst && (
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 text-gray-600 font-bold hover:text-gray-800 transition"
          >
            Voltar
          </button>
        )}
        <div className={isFirst ? 'w-full flex justify-end' : ''}>
          <button
            type="submit"
            className="px-8 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLast ? 'Finalizar' : 'Próximo'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TrailForm;
