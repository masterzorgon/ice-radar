'use client';

import { ResourceCategory } from '@/data/resourcesData';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResourceTabsProps {
  categories: ResourceCategory[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function ResourceTabs({ categories, activeTab, onTabChange }: ResourceTabsProps) {
  const { language } = useLanguage();

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-accent-dim/30 scrollbar-track-transparent pb-2">
      {categories.map((category) => {
        const isActive = activeTab === category.id;
        const name = language === 'es' ? category.shortNameEs : category.shortName;

        return (
          <button
            key={category.id}
            onClick={() => onTabChange(category.id)}
            className={`
              px-3 py-1.5 text-xs whitespace-nowrap transition-colors border
              ${isActive
                ? 'bg-accent/20 border-accent text-accent'
                : 'bg-black/30 border-accent-dim/30 text-foreground/50 hover:text-foreground/70 hover:border-accent-dim/50'
              }
            `}
          >
            [{name.toUpperCase()}]
          </button>
        );
      })}
    </div>
  );
}
