'use client';

import { Resource } from '@/data/resourcesData';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const { language, t } = useLanguage();

  const title = language === 'es' ? resource.titleEs : resource.title;
  const description = language === 'es' ? resource.descriptionEs : resource.description;

  return (
    <div className="bg-black/50 border border-accent-dim/30 p-4 flex flex-col h-full">
      <div className="flex items-start gap-2 mb-2">
        <span className="text-accent text-xs shrink-0">[{'>'}]</span>
        <h3 className="text-accent text-sm font-bold leading-tight">{title}</h3>
      </div>

      <p className="text-foreground/60 text-xs leading-relaxed flex-1 mb-4">
        {description}
      </p>

      <div className="flex flex-col gap-2 mt-auto">
        {resource.phone && (
          <a
            href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
            className="flex items-center gap-2 text-xs text-warning hover:text-warning/80 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="font-mono">{resource.phone}</span>
          </a>
        )}

        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-accent/10 border border-accent/30 text-accent text-xs hover:bg-accent/20 hover:border-accent/50 transition-colors"
          >
            <span>{t.resources?.visitLink || 'VISIT RESOURCE'}</span>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
