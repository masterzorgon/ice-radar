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
    <div className="bg-background border-2 border-accent-dim p-4 flex flex-col h-full">
      <div className="flex items-start gap-2 mb-2">
        <span className="text-accent text-[8px] tracking-wider shrink-0">[{'>'}]</span>
        <h3 className="text-accent text-[10px] tracking-wider leading-tight glow-text">{title}</h3>
      </div>

      <p className="text-accent-muted text-[8px] tracking-wider leading-relaxed flex-1 mb-4">
        {description}
      </p>

      <div className="flex flex-col gap-2 mt-auto">
        {resource.phone && (
          <a
            href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
            className="flex items-center gap-2 text-[8px] tracking-wider text-warning hover:text-warning/80"
          >
            <span>[TEL]</span>
            <span className="glow-warning">{resource.phone}</span>
          </a>
        )}

        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-transparent border-2 border-accent text-accent text-[8px] tracking-wider hover:bg-accent hover:text-background"
          >
            <span>[{t.resources?.visitLink || 'VISIT RESOURCE'}]</span>
            <span>{'>'}</span>
          </a>
        )}
      </div>
    </div>
  );
}
