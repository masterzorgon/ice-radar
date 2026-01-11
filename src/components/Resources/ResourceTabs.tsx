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
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {categories.map((category) => {
        const isActive = activeTab === category.id;
        const name = language === 'es' ? category.shortNameEs : category.shortName;

        return (
          <button
            key={category.id}
            onClick={() => onTabChange(category.id)}
            className={`
              px-3 py-2 text-[8px] tracking-wider whitespace-nowrap border-2
              ${isActive
                ? 'bg-accent text-background border-accent'
                : 'bg-transparent border-accent-dim text-accent-muted hover:text-accent hover:border-accent'
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
