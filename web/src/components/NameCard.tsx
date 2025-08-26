import React from 'react';
import { Language, i18nTexts, getText } from '@/lib/i18n';
import chineseToPinyin from 'chinese-to-pinyin';

type NameCardProps = {
  name: string;
  pinyin: string;
  source: { title: string; author?: string; dynasty?: string; sourceSet: string };
  originalVerse: string;
  meaning: string;
  lineCn?: string;
  lineEn?: string;
  meaningEn?: string;
  createdAt: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  language?: Language;
};

export default function NameCard(props: NameCardProps) {
  const { name, pinyin, source, originalVerse, meaning, lineCn, lineEn, meaningEn, language = 'bilingual' } = props;
  const [lineEnState, setLineEnState] = React.useState<string | undefined>(lineEn);
  const [meaningEnState, setMeaningEnState] = React.useState<string | undefined>(meaningEn);

  const displayPinyin = pinyin;
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

  const handleCopy = () => {
    const text = `${name} - ${getSourceName(source.sourceSet)} - ${meaning}`;
    navigator.clipboard.writeText(text);
    // 可以添加复制成功的提示
  };

  const handleShare = () => {
    const text = `${name} - 来自《${source.title}》的优美名字`;
    if (navigator.share) {
      navigator.share({
        title: '诗意名字分享',
        text: text
      });
    } else {
      // 回退到复制
      handleCopy();
    }
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
      style={{
        width: '375px',
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* 名字和拼音 - 新布局（弱化拼音） */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ 
          fontSize: '42px', 
          fontWeight: '800', 
          color: '#1f2937',
          marginBottom: '8px',
          letterSpacing: '2px'
        }}>
          {name}
        </div>
        <div style={{ 
          fontSize: '16px', 
          color: '#9ca3af', 
          fontWeight: 500,
          fontStyle: 'italic',
          marginBottom: '8px'
        }}>
          {displayPinyin}
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#cbd5e1',
          fontWeight: 400
        }}>
          &ldquo;{displayPinyin}&rdquo;拼音
        </div>
      </div>

      {/* 标签系统 - 圆角 pill */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '8px', 
        marginBottom: '20px',
        justifyContent: 'center'
      }}>
        {tags.map((tag, index) => (
          <span
            key={index}
            style={{
              padding: '6px 14px',
              backgroundColor: tag.color,
              color: tag.textColor,
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              border: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            <span>{tag.text}</span>
            {tag.subText && (
              <span style={{ fontSize: '10px', opacity: 0.8 }}>
                {tag.subText}
              </span>
            )}
          </span>
        ))}
      </div>

      {/* 出处 + 诗句高亮 + 解释分离 */}
      <div style={{ 
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          fontSize: '16px', 
          color: '#1f2937',
          lineHeight: '1.5',
          fontWeight: 600,
          marginBottom: '8px'
        }}>
          《{source.title}》，{source.author || '佚名'}，{source.dynasty || '未知朝代'}
        </div>
        {lineCn && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <div style={{ borderLeft: '3px solid #E5E7EB', paddingLeft: '12px', maxWidth: '92%', color: '#374151' }}>
              <div style={{ fontSize: '15px', lineHeight: '1.6' }}>「{lineCn}」</div>
              <div style={{ fontSize: '13px', color: '#9ca3af', fontStyle: 'italic', marginTop: '6px' }}>
                {chineseToPinyin(lineCn, { removeTone: false, removeSpace: false, keepRest: true })}
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', marginTop: '6px' }}>
                {lineEnState ? `${lineEnState}` : <span style={{ display: 'inline-block', height: '12px', width: '75%', background: '#e5e7eb', borderRadius: '4px' }} />}
              </div>
            </div>
          </div>
        )}
        <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
          {meaning}
          <div style={{ marginTop: '6px', color: '#94a3b8', fontStyle: 'italic' }}>
            {meaningEnState ? meaningEnState : <span style={{ display: 'inline-block', height: '12px', width: '80%', background: '#e5e7eb', borderRadius: '4px' }} />}
          </div>
        </div>
      </div>

      {/* 评分/计数 - 简化显示 */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '20px',
        padding: '12px',
        backgroundColor: '#fef3c7',
        borderRadius: '8px',
        border: '1px solid #fde68a'
      }}>
        {/* <div style={{ 
          fontSize: '14px', 
          color: '#92400e',
          fontWeight: '600'
        }}>
          {Math.floor(Math.random() * 10) + 1} 推荐指数
        </div> */}
      </div>

      {/* 操作按钮 - 新布局 */}
      <div style={{ 
        display: 'flex', 
        gap: '12px',
        justifyContent: 'space-between'
      }}>
        <button 
          onClick={handleCopy}
          style={{
            flex: 1,
            padding: '12px 16px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
        >
          📋 {getText(i18nTexts.buttons.copy, language)}
        </button>
        
      </div>
    </div>
  );
}


