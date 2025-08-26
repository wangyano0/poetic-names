import React from 'react';
import { Language, i18nTexts, getText } from '@/lib/i18n';

type NameCardProps = {
  name: string;
  source: { title: string; author?: string; dynasty?: string; sourceSet: string };
  originalVerse: string;
  meaning: string;
  createdAt: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  language?: Language;
};

export default function NameCard(props: NameCardProps) {
  const { name, source, originalVerse, meaning, language = 'bilingual' } = props;

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
    
    // 来源标签
    tags.push({ text: getSourceName(source.sourceSet), color: '#f0f9ff', textColor: '#0369a1' });
    
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
      {/* 名字和拼音 - 新布局 */}
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
          fontSize: '18px', 
          color: '#6b7280', 
          fontWeight: '500',
          fontStyle: 'italic',
          marginBottom: '8px'
        }}>
          {displayPinyin}
        </div>
        <div style={{ 
          fontSize: '14px', 
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
        gap: '8px', 
        marginBottom: '20px',
        justifyContent: 'center'
      }}>
        {tags.map((tag, index) => (
          <span
            key={index}
            style={{
              padding: '4px 12px',
              backgroundColor: tag.color,
              color: tag.textColor,
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              border: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            {tag.text}
          </span>
        ))}
      </div>

      {/* 寓意和出处 - 合并显示 */}
      <div style={{ 
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          fontSize: '16px', 
          color: '#1f2937',
          lineHeight: '1.5',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          《{source.title}》，{source.author || '佚名'}，{source.dynasty || '未知朝代'}
        </div>
        <div style={{ 
          fontSize: '14px', 
          color: '#6b7280',
          lineHeight: '1.4'
        }}>
          {meaning}
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


