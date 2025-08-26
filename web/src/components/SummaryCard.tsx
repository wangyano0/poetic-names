import React from 'react';
import { Language, i18nTexts, getText } from '@/lib/i18n';

type SummaryCardProps = {
  name: string;
  pinyin: string;
  source: { title: string; author?: string; dynasty?: string; sourceSet: string };
  originalVerse: string;
  meaning: string;
  onViewDetails: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
  language?: Language;
};

export default function SummaryCard(props: SummaryCardProps) {
  const { name, source, meaning, onViewDetails, onFavorite, isFavorited, language = 'bilingual' } = props;

  // 生成拼音（简化版）
  const generatePinyin = (name: string) => {
    const pinyinMap: Record<string, string> = {
      '张': 'Zhāng', '王': 'Wáng', '李': 'Lǐ', '赵': 'Zhào', '陈': 'Chén',
      '刘': 'Liú', '杨': 'Yáng', '黄': 'Huáng', '周': 'Zhōu', '吴': 'Wú',
      '清': 'Qīng', '扬': 'Yáng', '若': 'Ruò', '溪': 'Xī', '流': 'Liú', '光': 'Guāng',
      '嘉': 'Jiā', '树': 'Shù', '望': 'Wàng', '舒': 'Shū', '廉': 'Lián', '贞': 'Zhēn',
      '美': 'Měi', '丽': 'Lì', '秀': 'Xiù', '慧': 'Huì', '智': 'Zhì', '贤': 'Xián',
      '德': 'Dé', '仁': 'Rén', '义': 'Yì', '礼': 'Lǐ', '信': 'Xìn', '温': 'Wēn',
      '柔': 'Róu', '婉': 'Wǎn', '约': 'Yuē', '静': 'Jìng', '淑': 'Shū', '娴': 'Xián',
      '华': 'Huá', '英': 'Yīng', '俊': 'Jùn', '杰': 'Jié', '豪': 'Háo', '雄': 'Xióng',
      '伟': 'Wěi', '壮': 'Zhuàng', '强': 'Qiáng', '健': 'Jiàn', '康': 'Kāng', '泰': 'Tài',
      '和': 'Hé', '平': 'Píng', '安': 'Ān', '宁': 'Níng', '逸': 'Yì', '文': 'Wén',
      '武': 'Wǔ', '才': 'Cái', '艺': 'Yì', '学': 'Xué', '识': 'Shí', '见': 'Jiàn',
      '闻': 'Wén', '思': 'Sī', '想': 'Xiǎng', '念': 'Niàn', '忆': 'Yì', '怀': 'Huái',
      '春': 'Chūn', '夏': 'Xià', '秋': 'Qiū', '冬': 'Dōng', '晨': 'Chén', '夕': 'Xī',
      '朝': 'Zhāo', '暮': 'Mù', '晓': 'Xiǎo', '夜': 'Yè', '昼': 'Zhòu', '星': 'Xīng',
      '辰': 'Chén', '影': 'Yǐng', '色': 'Sè', '彩': 'Cǎi', '金': 'Jīn',
      '银': 'Yín', '玉': 'Yù', '珠': 'Zhū', '宝': 'Bǎo', '珍': 'Zhēn', '奇': 'Qí',
      '妙': 'Miào', '神': 'Shén', '仙': 'Xiān', '灵': 'Líng'
    };
    
    return name.split('').map(char => pinyinMap[char] || char).join(' ');
  };

  const displayPinyin = generatePinyin(name);

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
    
    // 来源标签
    tags.push({ text: getSourceName(source.sourceSet), color: '#f0f9ff', textColor: '#0369a1' });
    
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
        overflow: 'hidden'
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

      {/* 名字和拼音 - 新布局 */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <div style={{ 
          fontSize: '32px', 
          fontWeight: '800', 
          color: '#1f2937',
          marginBottom: '6px',
          letterSpacing: '2px'
        }}>
          {name}
        </div>
        <div style={{ 
          fontSize: '16px', 
          color: '#6b7280', 
          fontWeight: '500',
          fontStyle: 'italic',
          marginBottom: '4px'
        }}>
          {displayPinyin}
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#9ca3af',
          fontWeight: '400'
        }}>
          &ldquo;{displayPinyin}&rdquo;拼音
        </div>
      </div>

      {/* 标签系统 */}
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
              padding: '3px 10px',
              backgroundColor: tag.color,
              color: tag.textColor,
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '600',
              border: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            {tag.text}
          </span>
        ))}
      </div>

      {/* 寓意和出处 - 合并显示，更紧凑 */}
      <div style={{ 
        marginBottom: '16px',
        padding: '14px',
        backgroundColor: '#f8fafc',
        borderRadius: '10px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          fontSize: '14px', 
          color: '#1f2937',
          lineHeight: '1.4',
          fontWeight: '500',
          marginBottom: '6px',
          textAlign: 'center'
        }}>
          《{source.title}》，{source.author || '佚名'}
        </div>
        <div style={{ 
          fontSize: '13px', 
          color: '#6b7280',
          lineHeight: '1.3',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          {meaning.length > 60 ? meaning.substring(0, 60) + '...' : meaning}
        </div>
      </div>

      {/* 评分/计数 - 简化显示 */}
    

      {/* 操作按钮 - 新布局 */}
      <div style={{ 
        display: 'flex', 
        gap: '10px',
        justifyContent: 'space-between'
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
