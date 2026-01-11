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

  const getDisplayName = (category: ResourceCategory) => {
    return language === 'es' ? category.shortNameEs : category.shortName;
  };

  return (
    <>
      {/* Mobile dropdown */}
      <div className="md:hidden">
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value)}
            className="w-full appearance-none bg-transparent text-accent border-2 border-accent px-3 py-2 text-[8px] tracking-wider uppercase font-mono cursor-pointer focus:outline-none focus:ring-0"
          >
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
                className="bg-background text-accent"
              >
                [{getDisplayName(category).toUpperCase()}]
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-accent text-[8px]">
            ▼
          </div>
        </div>
      </div>

      {/* Desktop horizontal tabs */}
      <div className="hidden md:flex items-center gap-1 overflow-x-auto pb-2">
        {categories.map((category) => {
          const isActive = activeTab === category.id;
          const name = getDisplayName(category);

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
    </>
  );
}
