import React from 'react';
import chineseToPinyin from 'chinese-to-pinyin';
import { Language, i18nTexts, getText } from '@/lib/i18n';

type SummaryCardProps = {
  name: string;
  pinyin: string;
  source: { title: string; author?: string; dynasty?: string; sourceSet: string };
  originalVerse: string;
  meaning: string;
  lineCn?: string;
  lineEn?: string;
  meaningEn?: string;
  onViewDetails: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
  language?: Language;
};

export default function SummaryCard(props: SummaryCardProps) {
  const { name, pinyin, source, meaning, lineCn, lineEn, meaningEn, onViewDetails, onFavorite, isFavorited, language = 'bilingual', originalVerse } = props as SummaryCardProps & { originalVerse: string };

  const displayPinyin = pinyin;
  const [lineEnState, setLineEnState] = React.useState<string | undefined>(lineEn);
  const [meaningEnState, setMeaningEnState] = React.useState<string | undefined>(meaningEn);

  // 提取含名的诗句（中文）
  const extractLine = (html: string, target: string) => {
    try {
      const text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, '');
      const given = name.slice(1); // 默认姓氏为首字
      const idx = text.indexOf(given);
      if (idx >= 0) {
        // 句读分割
        const segments = text.split(/[。！？；!?.;]/).filter(Boolean);
        for (const seg of segments) {
          if (seg.includes(given)) return seg;
        }
      }
      // 兜底返回首句
      const first = text.split(/[。！？；!?.;]/).filter(Boolean)[0];
      return first || '';
    } catch {
      return '';
    }
  };

  const verseLine = extractLine(originalVerse || '', name);

  // 简易中文寓意到英文（作为后端 meaningEn 的兜底）
  const meaningEnFallback = (() => {
    const m = meaning || '';
    const map: Array<[RegExp, string]> = [
      [/清雅|高洁|纯净|明亮|聪慧/g, 'purity and elegance'],
      [/质朴|自然/g, 'simplicity and nature'],
      [/豪放|壮阔|雄浑/g, 'boldness and grandeur'],
      [/婉约|深情/g, 'grace and deep affection'],
      [/希望|美好|祝愿|吉祥/g, 'good wishes and auspice']
    ];
    let out = 'Symbolizes cultural refinement and carries good wishes.';
    for (const [re, en] of map) {
      if (re.test(m)) { out = `Symbolizes ${en}, reflecting classical aesthetics.`; break; }
    }
    return out;
  })();

  // 懒加载英文：使用 localStorage 缓存
  React.useEffect(() => {
    const key1 = `lineEn:${name}:${source.title}`;
    const key2 = `meaningEn:${name}:${source.title}`;
    if (!lineEnState) {
      const cached = typeof window !== 'undefined' ? localStorage.getItem(key1) : null;
      if (cached) setLineEnState(cached);
      else if (lineCn && lineCn.length > 0) {
        fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: lineCn, target: 'en' }) })
          .then(r => r.json()).then(d => { if (d?.ok && d.data) { setLineEnState(d.data); localStorage.setItem(key1, d.data); } });
      }
    }
    if (!meaningEnState) {
      const cached2 = typeof window !== 'undefined' ? localStorage.getItem(key2) : null;
      if (cached2) setMeaningEnState(cached2);
      else if (meaning) {
        fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: meaning, target: 'en' }) })
          .then(r => r.json()).then(d => { if (d?.ok && d.data) { setMeaningEnState(d.data); localStorage.setItem(key2, d.data); } });
      }
    }
  }, [name, source.title, lineCn, meaning]);

  // 来源中文名称映射
  const getSourceName = (sourceSet: string) => {
    const sourceMap: Record<string, string> = {
      'shijing': '诗经',
      'chuci': '楚辞', 
      'tangshi': '唐诗',
      'songci': '宋词',
      'yuefu': '乐府',
      'gushi': '古诗',
      'cifu': '辞赋'
    };
    return sourceMap[sourceSet] || sourceSet;
  };

  // 获取英文来源名称
  const getSourceNameEn = (sourceSet: string) => {
    const sourceMap: Record<string, string> = {
      'shijing': 'Classic of Poetry',
      'chuci': 'Songs of Chu', 
      'tangshi': 'Tang Poetry',
      'songci': 'Song Ci',
      'yuefu': 'Yuefu',
      'gushi': 'Ancient Poetry',
      'cifu': 'Ci Fu'
    };
    return sourceMap[sourceSet] || sourceSet;
  };

  // 生成标签
  const generateTags = () => {
    const tags = [];
    
    // 性别标签（根据名字特征判断，这里简化处理）
    if (name.includes('美') || name.includes('丽') || name.includes('秀') || name.includes('慧')) {
      tags.push({ text: '女', color: '#fce7f3', textColor: '#be185d' });
    } else if (name.includes('伟') || name.includes('强') || name.includes('豪') || name.includes('雄')) {
      tags.push({ text: '男', color: '#dbeafe', textColor: '#1d4ed8' });
    } else {
      tags.push({ text: '中性', color: '#f3e8ff', textColor: '#7c3aed' });
    }
    
    // 字数标签
    if (name.length === 1) {
      tags.push({ text: '单字名', color: '#ecfdf5', textColor: '#047857' });
    } else if (name.length === 2) {
      tags.push({ text: '双字名', color: '#fef3c7', textColor: '#d97706' });
    }
    
    // 来源标签（中英文）
    tags.push({ 
      text: getSourceName(source.sourceSet), 
      color: '#f0f9ff', 
      textColor: '#0369a1',
      subText: getSourceNameEn(source.sourceSet)
    });
    
    return tags;
  };

  const tags = generateTags();

  return (
    <div 
      onClick={onViewDetails}
      style={{
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
        e.currentTarget.style.borderColor = '#c79a5a';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.borderColor = '#e5e7eb';
      }}
    >
      {/* 顶部装饰条 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #c79a5a, #d4a574, #c79a5a)',
        borderRadius: '20px 20px 0 0'
      }} />

      {/* 名字和拼音 - 新布局（弱化拼音层级） */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <div style={{ 
          fontSize: '36px', 
          fontWeight: '800', 
          color: '#1f2937',
          marginBottom: '6px',
          letterSpacing: '2px'
        }}>
          {name}
        </div>
        <div style={{ 
          fontSize: '15px', 
          color: '#9ca3af', 
          fontWeight: 500,
          fontStyle: 'italic',
          marginBottom: '4px'
        }}>
          {displayPinyin}
        </div>
        <div style={{ 
          fontSize: '11px', 
          color: '#cbd5e1',
          fontWeight: 400
        }}>
          &ldquo;{displayPinyin}&rdquo;拼音
        </div>
      </div>

      {/* 标签系统 - 圆角 pill，柔和底色 */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '6px', 
        marginBottom: '16px',
        justifyContent: 'center'
      }}>
        {tags.map((tag, index) => (
          <span
            key={index}
            style={{
              padding: '4px 12px',
              backgroundColor: tag.color,
              color: tag.textColor,
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 600,
              border: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1px'
            }}
          >
            <span>{tag.text}</span>
            {tag.subText && (
              <span style={{ fontSize: '9px', opacity: 0.8 }}>
                {tag.subText}
              </span>
            )}
          </span>
        ))}
      </div>

      {/* 出处 + 诗句（单独高亮） + 解释：分离显示 */}
      <div style={{ 
        marginBottom: '16px',
        padding: '14px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          fontSize: '14px', 
          color: '#1f2937',
          lineHeight: '1.4',
          fontWeight: 600,
          marginBottom: '6px',
          textAlign: 'center'
        }}>
          《{source.title}》，{source.author || '佚名'}
        </div>
        {/* 诗句高亮 + 中文拼音 + 英文译文 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <div style={{ borderLeft: '3px solid #E5E7EB', paddingLeft: '10px', maxWidth: '90%', color: '#374151' }}>
            <div style={{ fontSize: '15px', lineHeight: '1.5' }}>「{lineCn || ''}」</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', marginTop: '4px' }}>
              {lineCn ? chineseToPinyin(lineCn, { removeTone: false, removeSpace: false, keepRest: true }) : ''}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', marginTop: '4px' }}>
              {lineEnState ? `${lineEnState}` : <span style={{ display: 'inline-block', height: '10px', width: '70%', background: '#e5e7eb', borderRadius: '4px' }} />}
            </div>
          </div>
        </div>
        <div style={{ 
          fontSize: '14px', 
          color: '#6b7280',
          lineHeight: '1.3',
          textAlign: 'center'
        }}>
          {meaning.length > 60 ? meaning.substring(0, 60) + '...' : meaning}
          <div style={{ marginTop: '4px', color: '#94a3b8', fontStyle: 'italic' }}>
            {meaningEnState ? meaningEnState : <span style={{ display: 'inline-block', height: '10px', width: '80%', background: '#e5e7eb', borderRadius: '4px' }} />}
          </div>
        </div>
      </div>

      {/* 评分/计数 - 简化显示 */}
    

      {/* 操作按钮 - 新布局 */}
      <div style={{ 
        display: 'flex', 
        gap: '10px',
        justifyContent: 'space-between',
        marginTop: 'auto'
      }}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          style={{
            flex: 1,
            padding: '10px 14px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
        >
          🔍 {getText(i18nTexts.buttons.viewDetails, language)}
        </button>
        {onFavorite && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onFavorite();
            }}
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: isFavorited ? '#ef4444' : '#f3f4f6',
              color: isFavorited ? 'white' : '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              if (!isFavorited) {
                e.currentTarget.style.backgroundColor = '#fee2e2';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              if (!isFavorited) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
        )}
      </div>
    </div>
  );
}
