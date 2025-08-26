import React from 'react';
import { Language } from '@/lib/i18n';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export default function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const languages: { value: Language; label: string; icon: string }[] = [
    // { value: 'zh', label: '中文', icon: '🇨🇳' },
    // { value: 'en', label: 'English', icon: '🇺🇸' },
    // { value: 'bilingual', label: '双语', icon: '🌐' }
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex bg-white/90 backdrop-blur-sm rounded-2xl border border-neutral-200/60 shadow-lg p-1">
        {languages.map((lang) => (
          <button
            key={lang.value}
            onClick={() => onLanguageChange(lang.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              currentLanguage === lang.value
                ? 'bg-[#C79A5A] text-white shadow-md'
                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
            }`}
          >
            <span className="text-lg">{lang.icon}</span>
            <span className="hidden sm:inline">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
