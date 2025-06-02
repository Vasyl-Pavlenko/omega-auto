import { useState } from 'react';

interface TyreDescriptionProps {
  description?: string;
}

export const TyreDescription = ({ description }: TyreDescriptionProps) => {
  const [expanded, setExpanded] = useState(false);

  if (!description) {
    return null;
  }

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 uppercase mb-3">Опис</h2>

      <p
        className={
          `text-gray-800 bg-gray-50 p-5 rounded-lg border border-gray-200 leading-relaxed whitespace-pre-line 
            ${expanded ? 'max-h-full' : 'max-h-32 overflow-hidden'} 
            ${expanded ? '' : 'line-clamp-4'}
          `
        }
      >
        {description}
      </p>

      {description.length > 300 && (
        <button
          type="button"
          className="mt-2 text-blue-600 font-semibold hover:underline focus:outline-none"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Згорнути' : 'Розгорнути'}
        >
          {expanded ? 'Згорнути' : 'Розгорнути'}
        </button>
      )}
    </section>
  );
};
