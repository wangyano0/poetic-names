"use client";

import React, { useRef, useState, useEffect } from "react";
import NameCard from "@/components/NameCard";
import SummaryCard from "@/components/SummaryCard";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Language, i18nTexts, getText } from "@/lib/i18n";

type Card = {
  name: string;
  source: { title: string; author?: string; dynasty?: string; sourceSet: string };
  originalVerse: string;
  meaning: string;
  createdAt: string;
};

export default function PoeticNameHome() {
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [surname, setSurname] = useState("");
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState<Language>('bilingual');
  const [sourceMap, setSourceMap] = useState<Record<string, boolean>>({
    shijing: true,
    chuci: false,
    tangshi: false,
    songci: false,
    yuefu: false,
    gushi: false,
    cifu: false,
  });

  // 新增状态
  const [viewMode, setViewMode] = useState<'summary' | 'detail'>('summary');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    gender: 'all' as 'all' | 'male' | 'female' | 'unisex',
    charCount: 'all' as 'all' | '1' | '2',
    sortBy: 'score' as 'score' | 'name' | 'popularity'
  });

  const sources = Object.entries(sourceMap)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const scrollToShowcase = () => {
    showcaseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  async function generate() {
    setError("");
    if (!surname.trim()) {
      setError("请输入姓氏");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: surname.trim(), surname: surname.trim(), sources, size: 12, charCount: 2 }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "生成失败");
      
      // 直接使用API返回的数据
      const enhancedCards = json.data;
      
      setCards(enhancedCards);
      setViewMode('summary');
      setSelectedCard(null);
      // 滚动到个性化寻名结果区域
      setTimeout(() => {
        showcaseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "生成失败");
    } finally {
      setLoading(false);
    }
  }

  // 切换来源后自动再生成（已输入姓氏时）
  useEffect(() => {
    if (surname.trim()) generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(sources)]);

  // 筛选和排序逻辑
  const filteredAndSortedCards = cards
    .filter(card => {
      if (filters.charCount !== 'all' && card.name.length.toString() !== filters.charCount) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
          return favorites.has(b.name) ? 1 : favorites.has(a.name) ? -1 : 0;
        default:
          return 0;
      }
    });

  const handleViewDetails = (card: Card) => {
    setSelectedCard(card);
    setViewMode('detail');
  };

  const handleBackToSummary = () => {
    setViewMode('summary');
    setSelectedCard(null);
  };

  const handleFavorite = (name: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(name)) {
      newFavorites.delete(name);
    } else {
      newFavorites.add(name);
    }
    setFavorites(newFavorites);
  };

  const handleSourceToggle = (key: string) => {
    setSourceMap(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 获取数据源图标的辅助函数
  const getSourceIcon = (sourceKey: string) => {
    const icons: Record<string, React.ReactElement> = {
      shijing: (
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.7" className="text-[#6B513E]">
          <path d="M4 5h16M6 9h12M4 13h16M6 17h12" />
        </svg>
      ),
      chuci: (
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.7" className="text-[#6B513E]">
          <path d="M12 3v18M3 12h18" />
        </svg>
      ),
      tangshi: (
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.7" className="text-[#6B513E]">
          <circle cx="12" cy="12" r="6" />
        </svg>
      ),
      songci: (
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.7" className="text-[#6B513E]">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    };
    return icons[sourceKey] || icons.shijing;
  };

  // 获取理念图标的辅助函数
  const getPhilosophyIcon = (key: string) => {
    const icons: Record<string, React.ReactElement> = {
      cultural: (
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.7" className="text-[#6B513E]">
          <path d="M4 6h16v12H4z" />
          <path d="M4 10h16" />
        </svg>
      ),
      interpretation: (
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.7" className="text-[#6B513E]">
          <path d="M12 19l-7-5V5l7 5 7-5v9z" />
        </svg>
      ),
      unique: (
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.7" className="text-[#6B513E]">
          <rect x="3" y="8" width="18" height="13" rx="2" />
          <path d="M3 12h18M12 8V5" />
        </svg>
      )
    };
    return icons[key] || icons.cultural;
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF6F1] text-neutral-800">
      {/* Language Switcher */}
      <LanguageSwitcher 
        currentLanguage={currentLanguage} 
        onLanguageChange={setCurrentLanguage} 
      />
      
      {/* ===== HERO ===== */}
      <section className="relative min-h-[80svh] lg:min-h-[75svh] overflow-hidden">
        {/* soft vignette / rice-paper feel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 600px at 20% -10%, rgba(199,154,90,0.12), rgba(0,0,0,0) 60%), radial-gradient(800px 400px at 80% 110%, rgba(110,78,46,0.08), rgba(0,0,0,0) 60%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-10 lg:py-20">
          <header className="text-center">
            <h1 className="font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl text-[#4A3728] tracking-wide font-bold">
              {getText(i18nTexts.pageTitle, currentLanguage)}
            </h1>
            <p className="mt-6 font-[470] text-xl sm:text-2xl text-neutral-600 italic">
              {getText(i18nTexts.subtitle, currentLanguage)}
            </p>
            <p className="mt-3 text-base text-neutral-500">
              {getText(i18nTexts.description, currentLanguage)}
            </p>
          </header>

          {/* tool */}
          <div className="mx-auto mt-8 max-w-xl">
            <form onSubmit={(e) => { e.preventDefault(); generate(); }}>
              <label htmlFor="surname" className="sr-only">
                Surname
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-neutral-300/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                <input
                  id="surname"
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder={getText(i18nTexts.form.placeholder, currentLanguage)}
                  className="w-full bg-transparent outline-none placeholder:text-neutral-400"
                />
                <span className="text-sm text-neutral-400">{getText(i18nTexts.form.surname, currentLanguage)}</span>
              </div>

              {/* source pills */}
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { key: 'shijing', source: 'shijing' },
                  { key: 'chuci', source: 'chuci' },
                  { key: 'tangshi', source: 'tangshi' },
                  { key: 'songci', source: 'songci' },
                ].map((s) => (
                  <li
                    key={s.key}
                    className={`rounded-2xl border cursor-pointer transition hover:-translate-y-0.5 hover:shadow md:p-4 p-3 text-center shadow-sm ${
                      sourceMap[s.key] 
                        ? 'border-[#C79A5A] bg-[#F4E7D6] shadow-md' 
                        : 'border-neutral-200 bg-white/90'
                    }`}
                    onClick={() => handleSourceToggle(s.key)}
                  >
                    <div className="font-medium text-neutral-800">
                      {getText(i18nTexts.sources[s.source as keyof typeof i18nTexts.sources], currentLanguage)}
                    </div>
                    <div className="mt-0.5 text-[11px] leading-snug text-neutral-500">
                      {/* {getText(i18nTexts.sources[s.source as keyof typeof i18nTexts.sources].desc, currentLanguage)} */}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-gradient-to-b from-[#D6A766] to-[#B97A37] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#B97A37]/25 transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A5A] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? getText(i18nTexts.buttons.loading, currentLanguage) : getText(i18nTexts.buttons.generate, currentLanguage)}
                </button>
              </div>

              {error && (
                <div className="mt-4 text-center text-sm text-red-600 bg-red-50 rounded-lg py-2">
                  {error}
                </div>
              )}

              {/* scroll hint */}
              <div className="mt-6 flex flex-col items-center gap-2 text-sm text-neutral-500">
                <span>{currentLanguage === 'zh' ? '向下滚动探索名字' : currentLanguage === 'en' ? 'Scroll to explore names' : '向下滚动探索名字 / Scroll to explore names'}</span>
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300/80 bg-white/70 shadow-sm transition hover:translate-y-0.5"
                  onClick={scrollToShowcase}
                  aria-label="Scroll to names"
                >
                  {/* down chevron */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* soft divider */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#FAF6F1]" />
      </section>

      {/* ===== RESULTS / SHOWCASE ===== */}
      <section ref={showcaseRef} className="scroll-mt-16 bg-gradient-to-b from-[#f5f5f4] to-[#fafaf9] py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-5">
          {/* 首页推荐区域 - 始终显示 */}
          <div className="mb-20">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#4A3728] font-bold text-center">
              {getText(i18nTexts.examples.title, currentLanguage)}
            </h2>
            <p className="mt-4 text-base text-neutral-600 text-center max-w-2xl mx-auto">
              {getText(i18nTexts.examples.subtitle, currentLanguage)}
            </p>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {exampleCards.map((c, i) => (
                <article
                  key={i}
                  className="group rounded-3xl border border-neutral-200/80 bg-white/95 p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl hover:border-[#C79A5A]/30 backdrop-blur-sm"
                >
                  <header className="flex items-baseline gap-3 mb-6">
                    <h3 className="font-serif text-4xl text-[#4A3728] font-bold">{c.name}</h3>
                    <span className="text-lg text-neutral-500 font-medium">{c.pinyin}</span>
                  </header>
                  <p className="text-lg italic text-neutral-700 mb-6 leading-relaxed">{c.meaning}</p>
                  <p className="text-base text-neutral-600 mb-6 font-medium">
                    {getText(i18nTexts.examples.from, currentLanguage)} <em className="not-italic text-[#C79A5A]">{c.sourceEn}</em>（{c.sourceCn}）
                  </p>
                  <blockquote className="rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 text-lg leading-relaxed text-neutral-800 border-l-4 border-[#C79A5A]">
                    <p className="text-xl font-medium mb-3">「{c.quoteCn}」</p>
                    <div className="text-base text-neutral-600 italic">&ldquo;{c.quoteEn}&rdquo;</div>
                  </blockquote>
                </article>
              ))}
            </div>
          </div>

          {/* 个性化搜索结果区域 - 仅在有搜索结果时显示 */}
          {cards.length > 0 && (
            <div ref={showcaseRef} className="border-t border-neutral-300/60 pt-16">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#4A3728] font-bold text-center">
                {getText(i18nTexts.results.title, currentLanguage)}
              </h2>
              <p className="mt-4 text-base text-neutral-600 text-center max-w-2xl mx-auto">
                {getText(i18nTexts.results.subtitle, currentLanguage)}「{surname}」{getText(i18nTexts.results.foundCount, currentLanguage)} {filteredAndSortedCards.length} 个名字
              </p>
              
              {/* 数据源使用情况显示 */}
              {/* <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
                  <span className="text-sm text-blue-700 font-medium">
                    📚 使用数据源: {sources.map(s => {
                      const sourceNames = {
                        shijing: '诗经',
                        chuci: '楚辞', 
                        tangshi: '唐诗',
                        songci: '宋词',
                        yuefu: '乐府',
                        gushi: '古诗',
                        cifu: '辞赋'
                      };
                      return sourceNames[s as keyof typeof sourceNames] || s;
                    }).join('、')}
                  </span>
                </div>
              </div> */}

              {/* 换一批按钮 */}
              <div className="mt-4 text-center">
              
              </div>

              {/* 工具栏：筛选、排序、视图切换 */}
              <div className="mt-6 flex flex-wrap gap-4 items-center justify-center bg-white/90 rounded-2xl p-6 border border-neutral-200/60 shadow-sm">
                {/* 筛选器 */}
            

                {/* 排序 */}
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-medium text-neutral-700">{getText(i18nTexts.filters.sort, currentLanguage)}:</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, sortBy: 'name' }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      filters.sortBy === 'name' 
                        ? 'bg-[#C79A5A] text-white shadow-md' 
                        : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    🔤 {getText(i18nTexts.filters.byPinyin, currentLanguage)}
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, sortBy: 'popularity' }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      filters.sortBy === 'popularity' 
                        ? 'bg-[#C79A5A] text-white shadow-md' 
                        : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    🔥 {getText(i18nTexts.filters.byPopularity, currentLanguage)}
                  </button>
                </div>

                {/* 视图切换 */}
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-medium text-neutral-700">{getText(i18nTexts.filters.view, currentLanguage)}:</span>
                  <button
                    onClick={() => setViewMode('summary')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      viewMode === 'summary' 
                        ? 'bg-[#C79A5A] text-white shadow-md' 
                        : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    📋 {getText(i18nTexts.filters.gridView, currentLanguage)}
                  </button>
                  <button
                    onClick={() => setViewMode('detail')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      viewMode === 'detail' 
                        ? 'bg-[#C79A5A] text-white shadow-md' 
                        : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    📖 {getText(i18nTexts.filters.detailView, currentLanguage)}
                  </button>
                  <button
                  onClick={generate}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#C79A5A] to-[#B8860B] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      🔄 {getText(i18nTexts.buttons.refreshing, currentLanguage)}
                    </>
                  ) : (
                    <>
                      🔄 {getText(i18nTexts.buttons.refresh, currentLanguage)}
                    </>
                  )}
                </button>
                </div>
              </div>

              {/* Content Area */}
              {viewMode === 'summary' ? (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredAndSortedCards.map((card) => (
                    <SummaryCard 
                      key={`${card.name}-${card.createdAt}`} 
                      {...card} 
                      language={currentLanguage}
                      onViewDetails={() => handleViewDetails(card)} 
                      onFavorite={() => handleFavorite(card.name)} 
                      isFavorited={favorites.has(card.name)} 
                    />
                  ))}
                </div>
              ) : (
                // 详情视图
                <div className="mt-8 flex flex-col items-center gap-6">
                  {/* 返回按钮 */}
                  <button
                    onClick={handleBackToSummary}
                    className="px-4 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 transition flex items-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    {getText(i18nTexts.buttons.backToSummary, currentLanguage)}
                  </button>

                  {/* 详情卡片 */}
                  {selectedCard && (
                    <div className="w-full max-w-md">
                      <NameCard
                        {...selectedCard}
                        language={currentLanguage}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===== EXPLORE SOURCES ===== */}
      <section className="bg-gradient-to-b from-white to-[#fafaf9] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#4A3728] font-bold text-center">
            {getText(i18nTexts.literature.title, currentLanguage)}
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(i18nTexts.sources).map(([key, source]) => (
              <div key={key} className="rounded-3xl border border-neutral-200 bg-white/95 p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl hover:border-[#C79A5A]/30 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F4E7D6] shadow-md">
                    {getSourceIcon(key)}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#4A3728]">{getText(source, currentLanguage)}</div>
                    <div className="text-sm text-neutral-500 font-medium">{getText(source, currentLanguage)}</div>
                  </div>
                </div>
                <p className="text-base leading-relaxed text-neutral-700 mb-3">{getText(source.desc, currentLanguage)}</p>
                <p className="text-sm text-neutral-600 italic">{getText(source.desc, currentLanguage)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PHILOSOPHY ===== */}
      <section className="bg-gradient-to-b from-[#f5f5f4] to-[#fafaf9] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#4A3728] font-bold text-center">
            {getText(i18nTexts.philosophy.title, currentLanguage)}
          </h2>

          <ol className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { key: 'cultural', icon: getPhilosophyIcon('cultural') },
              { key: 'interpretation', icon: getPhilosophyIcon('interpretation') },
              { key: 'unique', icon: getPhilosophyIcon('unique') }
            ].map((p) => {
              const philosophyItem = i18nTexts.philosophy[p.key as keyof typeof i18nTexts.philosophy];
              if ('title' in philosophyItem && 'desc' in philosophyItem) {
                return (
                  <li key={p.key} className="rounded-3xl border border-neutral-200 bg-white/95 p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl hover:border-[#C79A5A]/30 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0E6D9] shadow-md">
                        {p.icon}
                      </div>
                      <div>
                        <div className="text-xl font-bold text-[#4A3728]">
                          {getText(philosophyItem.title, currentLanguage)}
                        </div>
                        <div className="text-sm text-neutral-500 font-medium">
                          {getText(philosophyItem.title, currentLanguage)}
                        </div>
                      </div>
                    </div>
                    <p className="text-base leading-relaxed text-neutral-700 mb-3">
                      {getText(philosophyItem.desc, currentLanguage)}
                    </p>
                    <p className="text-sm text-neutral-600 italic">
                      {getText(philosophyItem.desc, currentLanguage)}
                    </p>
                  </li>
                );
              }
              return null;
            })}
          </ol>
        </div>
      </section>

      {/* footer placeholder */}
      <footer className="border-t border-neutral-200 bg-white/70 py-8 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} Poetic Name • Inspired by Chinese classics.
      </footer>
    </div>
  );
}

const exampleCards = [
  {
    name: "清扬",
    pinyin: "Qīng Yáng",
    meaning: "Meaning: Clear, pure, and spirited.",
    sourceEn: "The Book of Odes",
    sourceCn: "《诗经》",
    quoteCn: "有美一人，清扬婉兮。",
    quoteEn: "A beautiful lady, with clear eyes and a graceful brow.",
  },
  {
    name: "嘉树",
    pinyin: "Jiā Shù",
    meaning: "Meaning: A symbol of nobility and integrity.",
    sourceEn: "Songs of Chu",
    sourceCn: "《楚辞》",
    quoteCn: "后皇嘉树，橘徕服兮。",
    quoteEn: "Oh, you noble and beautiful orange tree, you are born to this soil.",
  },
  {
    name: "望舒",
    pinyin: "Wàng Shū",
    meaning: "Meaning: The mythical charioteer of the moon.",
    sourceEn: "Songs of Chu",
    sourceCn: "《楚辞》",
    quoteCn: "前望舒使先驱兮，后飞廉使奔属。",
    quoteEn: "I order Wang Shu, the moon's charioteer, to lead the way.",
  },
];




