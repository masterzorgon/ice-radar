'use client';

import { ResourceCategory } from '@/data/resourcesData';
import { useLanguage } from '@/contexts/LanguageContext';
import Button from '@/components/ui/Button';

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
          <Button
            key={category.id}
            onClick={() => onTabChange(category.id)}
            variant={isActive ? 'primary' : 'secondary'}
            active={isActive}
            size="sm"
            className="whitespace-nowrap py-2"
          >
            [{name.toUpperCase()}]
          </Button>
        );
      })}
    </div>
  );
}
