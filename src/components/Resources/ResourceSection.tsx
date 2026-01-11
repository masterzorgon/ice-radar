'use client';

import { ResourceCategory } from '@/data/resourcesData';
import { useLanguage } from '@/contexts/LanguageContext';
import ResourceCard from './ResourceCard';

interface ResourceSectionProps {
  category: ResourceCategory;
}

export default function ResourceSection({ category }: ResourceSectionProps) {
  const { language } = useLanguage();

  const name = language === 'es' ? category.nameEs : category.name;
  const description = language === 'es' ? category.descriptionEs : category.description;

  return (
    <div className="flex flex-col h-full">
      {/* Section header */}
      <div className="mb-4 border-b-2 border-accent-dim pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-accent text-[10px] tracking-wider glow-text">[{category.id.toUpperCase()}]</span>
          <span className="text-accent-muted text-[8px] tracking-wider">{name.toUpperCase()}</span>
        </div>
        <p className="text-accent-muted/50 text-[8px] tracking-wider">{'>'} {description}</p>
      </div>

      {/* Resource cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1">
        {category.resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}
