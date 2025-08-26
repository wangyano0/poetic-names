import { NextRequest } from 'next/server';
export const runtime = 'nodejs';
import nodejieba from 'nodejieba';
import chineseToPinyin from 'chinese-to-pinyin';
import fs from 'fs';
import path from 'path';

type NameCard = {
  name: string;
  pinyin: string;
  source: { title: string; author?: string; dynasty?: string; sourceSet: string };
  originalVerse: string;
  meaning: string;
  // 新增：原文句子与英文
  lineCn?: string;
  lineEn?: string;
  meaningEn?: string;
  createdAt: string;
};

// 加载本地JSON文件
function loadLocalJson(source: string) {
  try {
    const jsonPath = path.join(process.cwd(), '..', 'json', `${source}.json`);
    const content = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`加载${source}.json失败:`, error);
    return [];
  }
}

// 加载黑名单词汇
function loadBlacklist(): string[] {
  try {
    const blacklistPath = path.join(process.cwd(), '..', 'config', 'blacklist.json');
    const content = fs.readFileSync(blacklistPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('加载黑名单失败，使用默认黑名单:', error);
    // 默认黑名单作为备用
    return [
      '屎', '尿', '屁', '痰', '脓', '疮', '疤', '瘤', '癌', '粪', '臭', '酸', '腥', '臊', '骚',
      '死', '亡', '病', '疾', '痛', '伤', '戚', '丧', '哀', '殃', '灾', '灭', '腐', '烂',
      '鬼', '鼠', '狐', '狸', '犬', '狗', '鸭', '鸡', '鹅', '鸟', '禽', '蝇', '蛇', '蟊',
      '奴', '贱', '贫', '庸', '蠢', '匪', '婆', '妇', '妹', '羞辱', '父母',
      '凶', '狠', '残', '暴', '虐', '杀', '屠', '宰', '割', '剁', '砍', '劈', '刺', '捅', '扎', '戳', '劫',
      '愁', '悲', '苦', '弃', '悔', '哀', '忧', '丑', '昏', '懒',
      '桀', '纣', '桧', '胸', '爪', '毛', '穴', '肉', '鱼', '血', '窥', '潦', '害', '靡', '畜', '牲', '氓',
      '砖', '瓦', '疯', '狂', '婢', '妾', '娼', '卒', '盗', '妖', '魔', '祟', '蛙', '虾', '蟹', '猪', '驴', '骡',
      '床', '霜'
    ];
  }
}

// 扩展的脏字和负面词过滤
function isCleanText(text: string): boolean {
  const blacklist = loadBlacklist();
  return !blacklist.some(word => text.includes(word));
}

// 虚词过滤 - 去掉无意义的字符
function isMeaningfulChar(char: string): boolean {
  const meaninglessChars = ['的', '了', '之', '乎', '也', '哉', '兮', '而', '以', '为', '于', '在', '有', '无', '不', '可', '能', '会', '要', '想', '说', '道', '曰', '云', '谓', '称', '叫', '做', '成', '变', '化', '生', '死', '来', '去', '到', '从', '向', '往', '回', '进', '出', '上', '下', '左', '右', '前', '后', '里', '外', '内', '中', '间', '边', '旁', '侧', '面', '方', '向', '位', '置', '地', '方', '处', '所', '时', '候', '刻', '分', '秒', '年', '月', '日', '天', '夜', '晚', '早', '午', '晨', '夕', '朝', '暮', '晓', '夜', '昼', '星', '辰', '光', '影', '色', '彩', '金', '银', '玉', '珠', '宝', '珍', '奇', '妙', '神', '仙', '灵'];
  return !meaninglessChars.includes(char);
}

// 拼音生成函数
function generatePinyin(name: string): string {
  try {
    // 使用chinese-to-pinyin库生成拼音
    const pinyinResult = chineseToPinyin(name, {
      removeTone: false, // 保留声调
      removeSpace: false, // 保留空格
      keepRest: true // 保留非中文字符
    });
    
    // 将拼音字符串按空格分割，首字母大写
    const pinyinArray = pinyinResult.split(' ');
    return pinyinArray.map((py: string) => {
      return py.charAt(0).toUpperCase() + py.slice(1);
    }).join(' ');
  } catch (error) {
    console.error('拼音生成失败:', error);
    // 回退到原字符
    return name;
  }
}

// 音律美感判断 - 简单的声调规则
function hasGoodTone(name: string): boolean {
  // 简化的声调判断（实际项目中可以使用更准确的拼音库）
  const tonePatterns = {
    // 避免连续相同声调
    '平平': false, '仄仄': false,
    // 推荐平仄搭配
    '平仄': true, '仄平': true
  };
  
  // 这里简化处理，实际应该用拼音库判断声调
  // 暂时返回true，后续可以集成拼音库
  return true;
}

// 从诗句中提取候选名字 - 完全重写版本，从整首诗中提取
function extractNames(text: string, maxLength: 1 | 2): string[] {
  if (!text || typeof text !== 'string') return [];
  
  const candidates: string[] = [];
  
  try {
    // 使用jieba分词提取候选词，增加候选词数量
    const words = nodejieba.extract(text, 25) // 大幅增加候选词数量
      .map((w: { word: string; weight: number }) => w.word)
      .filter((w: string) => {
        // 过滤条件：长度、纯中文、无脏字、有意义
        return w.length <= maxLength && 
               /^[\u4e00-\u9fa5]+$/.test(w) && 
               isCleanText(w) &&
               w.split('').every(char => isMeaningfulChar(char));
      });
    
    candidates.push(...words);
  } catch {
    console.warn('jieba分词失败，使用回退方案');
  }
  
  // 回退：逐字组合，从整首诗中提取
  const chars = text.replace(/[^\u4e00-\u9fa5]/g, '').split('').filter(isMeaningfulChar);
  
  if (maxLength === 2) {
    // 策略1：优先提取相邻的两个字
    for (let i = 0; i < chars.length - 1; i++) {
      const pair = chars.slice(i, i + 2).join('');
      if (isCleanText(pair) && pair.length === 2) {
        candidates.push(pair);
      }
    }
    
    // 策略2：间隔字符组合，增加多样性
    if (candidates.length < 12) {
      for (let i = 0; i < chars.length - 2; i++) {
        const pair = chars[i] + chars[i + 2];
        if (isCleanText(pair) && pair.length === 2) {
          candidates.push(pair);
        }
      }
    }
    
    // 策略3：更大间隔组合，避免单调
    if (candidates.length < 15) {
      for (let i = 0; i < chars.length - 3; i++) {
        const pair = chars[i] + chars[i + 3];
        if (isCleanText(pair) && pair.length === 2) {
          candidates.push(pair);
        }
      }
    }
    
    // 策略4：跳跃式组合，增加随机性
    if (candidates.length < 18) {
      for (let i = 0; i < chars.length - 4; i++) {
        const pair = chars[i] + chars[i + 4];
        if (isCleanText(pair) && pair.length === 2) {
          candidates.push(pair);
        }
      }
    }
    
    // 策略5：从诗句末尾开始提取，避免总是从头开始
    if (candidates.length < 20) {
      for (let i = chars.length - 2; i >= 0; i--) {
        const pair = chars.slice(i, i + 2).join('');
        if (isCleanText(pair) && pair.length === 2) {
          candidates.push(pair);
        }
      }
    }
    
  } else if (maxLength === 1) {
    // 单字名：从整首诗中提取有意义的字符
    chars.forEach(char => {
      if (isCleanText(char)) {
        candidates.push(char);
      }
    });
  }
  
  // 去重并过滤，增加音律美感判断
  const uniqueCandidates = Array.from(new Set(candidates))
    .filter(name => isCleanText(name) && name.length > 0)
    .filter(name => hasGoodTone(name)) // 添加音律美感过滤
    .sort(() => Math.random() - 0.5); // 随机排序，增加多样性
  
  return uniqueCandidates;
}

// 智能寓意生成系统 - 根据字义/来源/诗句关键词动态组合
function generateMeaning(
  name: string,
  source: { title: string; author?: string; dynasty?: string; sourceSet: string },
  poemText?: string
): string {
  // 扩展的字义词库 - 更丰富的文化内涵
  const meanings: Record<string, string[]> = {
    '清': ['清澈纯净', '清雅高洁', '清正廉洁', '清高自持'],
    '雅': ['高雅文雅', '雅致优美', '雅量高深', '雅俗共赏'],
    '嘉': ['美好吉祥', '嘉言善行', '嘉德懿行', '嘉惠后人'],
    '安': ['平安安定', '安详宁静', '安身立命', '安邦定国'],
    '明': ['明亮聪慧', '明理通达', '明德至善', '明察秋毫'],
    '乐': ['快乐愉悦', '乐天知命', '乐善好施', '乐而不淫'],
    '宁': ['宁静祥和', '宁折不弯', '宁死不屈', '宁缺毋滥'],
    '远': ['远大志向', '远见卓识', '远走高飞', '远交近攻'],
    '诗': ['诗意浪漫', '诗情画意', '诗书传家', '诗礼传家'],
    '云': ['云淡风轻', '云蒸霞蔚', '云开见日', '云行雨施'],
    '月': ['明月清辉', '月白风清', '月朗星稀', '月满则亏'],
    '风': ['风度翩翩', '风华正茂', '风清月朗', '风调雨顺'],
    '花': ['花容月貌', '花团锦簇', '花好月圆', '花枝招展'],
    '雪': ['雪白纯净', '雪中送炭', '雪泥鸿爪', '雪月风花'],
    '雨': ['雨润万物', '雨过天晴', '雨露均沾', '雨打芭蕉'],
    '山': ['山高水长', '山明水秀', '山清水秀', '山重水复'],
    '水': ['水润万物', '水到渠成', '水落石出', '水天一色'],
    '林': ['林木葱郁', '林下风致', '林泉高致', '林寒洞肃'],
    '竹': ['竹节高风', '竹报平安', '竹马之交', '竹柏异心'],
    '松': ['松柏长青', '松鹤延年', '松风明月', '松筠之节'],
    '梅': ['梅花傲雪', '梅开二度', '梅兰竹菊', '梅妻鹤子'],
    '兰': ['兰花幽香', '兰心蕙质', '兰质蕙心', '兰桂齐芳'],
    '菊': ['菊花傲霜', '菊月清秋', '菊韵悠长', '菊老荷枯'],
    '荷': ['荷花出淤泥而不染', '荷风送香', '荷塘月色', '荷衣蕙带'],
    '莲': ['莲花清净', '莲心不染', '莲开并蒂', '莲步轻移'],
    '桂': ['桂花飘香', '桂子飘香', '桂馥兰香', '桂殿兰宫'],
    '桃': ['桃花烂漫', '桃李满天下', '桃红柳绿', '桃夭李艳'],
    '李': ['李花如雪', '李代桃僵', '李下瓜田', '李郭仙舟'],
    '杏': ['杏花春雨', '杏林春暖', '杏花村酒', '杏脸桃腮'],
    '梨': ['梨花带雨', '梨园弟子', '梨云梦暖', '梨涡浅笑'],
    '樱': ['樱花烂漫', '樱唇杏脸', '樱笋时', '樱笋春盘'],
    '枫': ['枫叶如火', '枫林晚照', '枫桥夜泊', '枫落吴江'],
    '柳': ['柳絮飞扬', '柳暗花明', '柳绿花红', '柳眉星眼'],
    '杨': ['杨柳依依', '杨花飞絮', '杨花落尽', '杨花水性'],
    '柏': ['柏树常青', '柏舟之誓', '柏梁台诗', '柏舟之誓'],
    '槐': ['槐花飘香', '槐荫满庭', '槐安国梦', '槐花黄时'],
    '椿': ['椿萱并茂', '椿庭萱室', '椿龄萱寿', '椿庭萱室'],
    '楠': ['楠木成材', '楠木为梁', '楠木之材', '楠木成林'],
    '梓': ['梓材成器', '梓潼帝君', '梓潼文昌', '梓潼帝君'],
    '桐': ['桐花飘香', '桐叶知秋', '桐花万里', '桐叶知秋'],
    '梧': ['梧桐叶落', '梧桐夜雨', '梧桐相待', '梧桐夜雨'],
    '桑': ['桑梓情深', '桑榆暮景', '桑田沧海', '桑弧蓬矢'],
    '榆': ['榆钱满树', '榆木疙瘩', '榆柳成荫', '榆钱满树'],
    '美': ['美丽动人', '美不胜收', '美轮美奂', '美玉无瑕'],
    '丽': ['丽质天成', '丽日当空', '丽人行', '丽句清词'],
    '秀': ['秀外慧中', '秀色可餐', '秀出班行', '秀外慧中'],
    '慧': ['慧质兰心', '慧眼识珠', '慧心巧思', '慧根深种'],
    '智': ['智慧聪颖', '智勇双全', '智圆行方', '智珠在握'],
    '贤': ['贤良淑德', '贤妻良母', '贤才君子', '贤良方正'],
    '德': ['德才兼备', '德高望重', '德艺双馨', '德厚流光'],
    '仁': ['仁爱宽厚', '仁心仁术', '仁者爱人', '仁者无敌'],
    '义': ['义薄云天', '义无反顾', '义不容辞', '义正辞严'],
    '礼': ['礼贤下士', '礼尚往来', '礼轻情意重', '礼义廉耻'],
    '信': ['信守承诺', '信而有征', '信口开河', '信誓旦旦'],
    '温': ['温文尔雅', '温润如玉', '温故知新', '温良恭俭'],
    '柔': ['温柔似水', '柔情似水', '柔肠百转', '柔心弱骨'],
    '婉': ['婉约动人', '婉转悠扬', '婉言谢绝', '婉娩多姿'],
    '约': ['简约大方', '约定俗成', '约法三章', '约己爱民'],
    '静': ['静若处子', '静水流深', '静观默察', '静心养性'],
    '淑': ['淑女风范', '淑质英才', '淑德贤良', '淑质贞亮'],
    '娴': ['娴静优雅', '娴熟老练', '娴于辞令', '娴雅端庄'],
    '华': ['华美绝伦', '华而不实', '华章丽句', '华彩纷呈'],
    '英': ['英姿飒爽', '英明神武', '英雄豪杰', '英华外发'],
    '俊': ['俊美非凡', '俊逸超群', '俊采星驰', '俊秀不群'],
    '杰': ['杰出优秀', '杰作名篇', '杰士豪杰', '杰然特立'],
    '豪': ['豪迈不羁', '豪情万丈', '豪言壮语', '豪放不羁'],
    '雄': ['雄才大略', '雄心壮志', '雄姿英发', '雄才大略'],
    '伟': ['伟岸不凡', '伟业丰功', '伟绩丰功', '伟岸不群'],
    '壮': ['壮志凌云', '壮心不已', '壮丽辉煌', '壮心不已'],
    '强': ['强健有力', '强中更有强中手', '强弩之末', '强本弱末'],
    '健': ['健康向上', '健步如飞', '健谈善辩', '健壮有力'],
    '康': ['康泰安康', '康庄大道', '康乐和顺', '康强逢吉'],
    '泰': ['泰然自若', '泰山北斗', '泰然处之', '泰然自若'],
    '和': ['和和美美', '和风细雨', '和衷共济', '和而不同'],
    '平': ['平平安安', '平易近人', '平心静气', '平心而论'],
    '逸': ['逸致闲情', '逸兴遄飞', '逸群绝伦', '逸趣横生'],
    '文': ['文质彬彬', '文采风流', '文思敏捷', '文质彬彬'],
    '武': ['武艺高强', '文武双全', '武德高尚', '武艺超群'],
    '才': ['才高八斗', '才子佳人', '才思敏捷', '才高八斗'],
    '艺': ['艺高胆大', '艺术人生', '艺不压身', '艺高胆大'],
    '学': ['学富五车', '学而不厌', '学以致用', '学富五车'],
    '识': ['识多见广', '识时务者为俊杰', '识文断字', '识多见广'],
    '见': ['见多识广', '见微知著', '见义勇为', '见多识广'],
    '闻': ['闻一知十', '闻名遐迩', '闻过则喜', '闻一知十'],
    '思': ['思虑周全', '思前想后', '思贤如渴', '思虑周全'],
    '想': ['想入非非', '想方设法', '想当然耳', '想入非非'],
    '念': ['念念不忘', '念兹在兹', '念旧情深', '念念不忘'],
    '忆': ['忆苦思甜', '忆往昔峥嵘岁月', '忆江南', '忆苦思甜'],
    '怀': ['怀才不遇', '怀瑾握瑜', '怀古伤今', '怀才不遇'],
    '春': ['春意盎然', '春光明媚', '春色满园', '春意盎然'],
    '夏': ['夏日炎炎', '夏虫语冰', '夏雨雨人', '夏日炎炎'],
    '秋': ['秋高气爽', '秋收冬藏', '秋月春风', '秋高气爽'],
    '冬': ['冬日暖阳', '冬去春来', '冬暖夏凉', '冬日暖阳'],
    '晨': ['晨光熹微', '晨钟暮鼓', '晨兴夜寐', '晨光熹微'],
    '夕': ['夕阳西下', '夕照山红', '夕惕若厉', '夕阳西下'],
    '朝': ['朝气蓬勃', '朝三暮四', '朝思暮想', '朝气蓬勃'],
    '暮': ['暮色苍茫', '暮鼓晨钟', '暮云春树', '暮色苍茫'],
    '晓': ['晓风残月', '晓行夜宿', '晓以大义', '晓风残月'],
    '夜': ['夜阑人静', '夜以继日', '夜不闭户', '夜阑人静'],
    '昼': ['昼长夜短', '昼伏夜出', '昼思夜想', '昼长夜短'],
    '星': ['星光璀璨', '星月交辉', '星火燎原', '星光璀璨'],
    '辰': ['辰星闪烁', '辰时日出', '辰光初现', '辰星闪烁'],
    '影': ['影影绰绰', '影不离形', '影形相随', '影影绰绰'],
    '色': ['色彩斑斓', '色厉内荏', '色艺双绝', '色彩斑斓'],
    '彩': ['彩霞满天', '彩云追月', '彩凤随鸦', '彩霞满天'],
    '金': ['金玉满堂', '金碧辉煌', '金风玉露', '金玉满堂'],
    '银': ['银装素裹', '银花火树', '银汉迢迢', '银装素裹'],
    '玉': ['玉树临风', '玉洁冰清', '玉汝于成', '玉树临风'],
    '珠': ['珠光宝气', '珠联璧合', '珠圆玉润', '珠光宝气'],
    '宝': ['宝刀不老', '宝山空回', '宝相庄严', '宝刀不老'],
    '珍': ['珍稀罕见', '珍禽异兽', '珍馐美味', '珍稀罕见'],
    '奇': ['奇思妙想', '奇花异草', '奇珍异宝', '奇思妙想'],
    '妙': ['妙不可言', '妙手回春', '妙语连珠', '妙不可言'],
    '神': ['神采飞扬', '神机妙算', '神清气爽', '神采飞扬'],
    '仙': ['仙风道骨', '仙姿玉貌', '仙山琼阁', '仙风道骨'],
    '灵': ['灵机一动', '灵犀一点', '灵秀天成', '灵机一动']
  };
  
  // 数据源风格特征
  const sourceStyles: Record<string, { style: string; keywords: string[] }> = {
    'shijing': { 
      style: '质朴自然', 
      keywords: ['自然', '质朴', '清新', '纯真', '田园', '山水', '草木', '鸟兽'] 
    },
    'chuci': { 
      style: '宏大浪漫', 
      keywords: ['浪漫', '宏大', '神话', '香草', '美人', '神鸟', '奇幻', '想象'] 
    },
    'tangshi': { 
      style: '豪放开阔', 
      keywords: ['豪放', '开阔', '大气', '壮志', '边塞', '明月', '长风', '大漠'] 
    },
    'songci': { 
      style: '婉约深情', 
      keywords: ['婉约', '深情', '细腻', '柔情', '小桥', '流水', '落花', '春水'] 
    },
    'yuefu': { 
      style: '民歌质朴', 
      keywords: ['民歌', '质朴', '生动', '民间', '生活', '情感', '直白', '真挚'] 
    },
    'gushi': { 
      style: '古典雅致', 
      keywords: ['古典', '雅致', '传统', '文化', '历史', '经典', '传承', '底蕴'] 
    },
    'cifu': { 
      style: '华丽铺陈', 
      keywords: ['华丽', '铺陈', '辞藻', '优美', '典雅', '文采', '修辞', '艺术'] 
    }
  };
  
  // 分析名字中的字符，生成寓意
  const charMeanings: string[] = [];
  for (const char of name) {
    if (meanings[char]) {
      // 随机选择一个含义，增加多样性
      const randomMeaning = meanings[char][Math.floor(Math.random() * meanings[char].length)];
      charMeanings.push(randomMeaning);
    }
  }
  
  // 获取数据源风格
  const sourceStyle = sourceStyles[source.sourceSet] || sourceStyles['gushi'];

  // 诗句关键词（用于无字义时的兜底与增强）
  const poem = String(poemText || '');
  let poemKeywords: string[] = [];
  try {
    if (poem) {
      poemKeywords = nodejieba
        .extract(poem.replace(/<[^>]+>/g, ''), 6)
        .map((v: any) => v.word)
        .filter((w: string) => /^[\u4e00-\u9fa5]{1,3}$/.test(w))
        .slice(0, 3);
    }
  } catch {
    poemKeywords = [];
  }
  
  // 寓意生成模板池：按随机选取；穿插来源风格/诗句关键词/字义
  const connectors = ['蕴含', '寄托', '彰显', '融汇', '凝练', '映照', '传达'];
  const pick = <T,>(arr: T[]) => (arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined);
  const kw = poemKeywords.length ? poemKeywords.join('、') : sourceStyle.keywords.join('、');
  const c1 = pick(connectors) || '寄托';
  const c2 = pick(connectors) || '蕴含';

  const meaningTemplatesWithChars = [
    // 字义 + 文化象征
    `'${name.split('').join('、')}'字分别寓意${charMeanings.join('、')}，${sourceStyle.style}风格，${c1}${charMeanings[0]}之志。`,
    
    // 出处意境 + 字义
    `源自${source.author || '佚名'}《${source.title}》，${sourceStyle.style}意境，名字体现${charMeanings.join('、')}，${c2}文化底蕴。`,
    
    // 风格特征 + 字义组合
    `取意${charMeanings.join('、')}，${sourceStyle.style}风格，融合了${pick(sourceStyle.keywords) || '风雅'}与${pick(sourceStyle.keywords) || '清新'}的意境，寓意深远。`,
    
    // 文化传承 + 个人特质
    `名字${charMeanings.join('、')}，传承${sourceStyle.style}文化精髓，${c1}${charMeanings[0]}与${charMeanings[1] || charMeanings[0]}的美好祝愿。`,
    
    // 出处 + 风格 + 寓意
    `来自《${source.title}》的${sourceStyle.style}风格，名字寓意${charMeanings.join('、')}，体现深厚的文学底蕴。`,
    
    // 字义 + 风格 + 象征
    `以${charMeanings.join('、')}为名，${sourceStyle.style}风格，象征${charMeanings[0]}，承载美好的文化寓意。`,
  ];

  const meaningTemplatesNoChars = [
    `取意于${source.author || '佚名'}《${source.title}》，${sourceStyle.style}之美，融入“${kw}”意象，展现独特气质。`,
    `名字映照“${kw}”的意境，延续《${source.title}》的神韵，${sourceStyle.style}而不失新意。`,
    `从《${source.title}》汲取“${kw}”之神采，寓意清新而悠远。`,
    `承${sourceStyle.style}之韵，以“${kw}”为象，寄托美好祝愿。`,
    `源自《${source.title}》，取“${kw}”之意象，寓意雅致而悠远。`
  ];
  
  // 随机模板，无论是否命中字义都可使用
  const pool = charMeanings.length > 0 ? [...meaningTemplatesWithChars, ...meaningTemplatesNoChars] : meaningTemplatesNoChars;
  const randomTemplate = pool[Math.floor(Math.random() * pool.length)];
  return randomTemplate;
}

// 生成名字卡片
function toCard(name: string, row: Record<string, unknown>, sourceSet: string): NameCard {
  const meaning = generateMeaning(name, {
    title: (row.title as string) || '未知',
    author: (row.author as string) || '佚名',
    dynasty: (row.dynasty as string) || '未知',
    sourceSet
  }, String((row.content as string) || (row.excerpt as string) || ''));
  
  return {
    name,
    pinyin: generatePinyin(name),
    source: { 
      title: (row.title as string) || '未知', 
      author: (row.author as string) || '佚名', 
      dynasty: (row.dynasty as string) || '未知', 
      sourceSet 
    },
    originalVerse: (row.content as string) || (row.excerpt as string) || '原文缺失',
    meaning,
    createdAt: new Date().toISOString(),
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const surname: string = String(body.surname || '').trim();
  const sources: string[] = Array.isArray(body.sources) ? body.sources : [];
  const size = Math.max(3, Math.min(30, Number(body.size) || 12));
  const charCount = Number(body.charCount) === 1 ? 1 : 2;
  
  if (!surname) return new Response(JSON.stringify({ ok: false, error: 'surname required' }), { status: 400 });

  const candidates: NameCard[] = [];
  // 多来源均衡与去重复控制
  const perPoemMax = 1; // 每首诗最多取1个，保证同一来源内来自不同作品
  const perSourceTarget = Math.max(1, Math.ceil(size / Math.max(1, sources.length)));
  const sourcePickedCount: Record<string, number> = {};
  const poemPickedCount: Record<string, number> = {};
  const pickedNameSet = new Set<string>();
  
  // 严格按用户选择过滤数据源，确保数据源分类的真实性
  for (const source of sources) {
    console.log(`正在处理数据源: ${source}`);
    const data = loadLocalJson(source);
    if (!Array.isArray(data)) {
      console.warn(`${source}.json 数据格式错误，跳过`);
      continue;
    }
    
    console.log(`加载${source}.json，共${data.length}条记录`);
    
    // 随机打乱数据顺序，避免总是从第一句开始
    const shuffledData = [...data].sort(() => Math.random() - 0.5);
    
    // 处理每条记录，从整首诗中提取名字
    for (const item of shuffledData) {
      const text = item.content || item.excerpt || item.title || '';
      if (!text) continue;
      // 若该来源已达目标数量，则提前停止该来源
      if ((sourcePickedCount[source] || 0) >= perSourceTarget) break;
      
      // 从整首诗中提取候选名字，而不是只用开头一句
      const names = extractNames(text, charCount);
      if (names.length > 0) {
        console.log(`从"${item.title}"提取到${names.length}个候选名字:`, names);
        // 打散候选，避免固定顺序
        const shuffledNames = [...names].sort(() => Math.random() - 0.5);

        // 该诗的唯一标识
        const poemId = `${item.title || ''}__${item.author || ''}__${source}`;
        poemPickedCount[poemId] = poemPickedCount[poemId] || 0;

        for (const name of shuffledNames) {
          if ((sourcePickedCount[source] || 0) >= perSourceTarget) break;
          if (poemPickedCount[poemId] >= perPoemMax) break;

          const fullName = `${surname}${name}`;
          if (pickedNameSet.has(fullName)) continue; // 全局去重

          const card = toCard(fullName, item as Record<string, unknown>, source);
          candidates.push(card);
          pickedNameSet.add(fullName);

          poemPickedCount[poemId] += 1;
          sourcePickedCount[source] = (sourcePickedCount[source] || 0) + 1;

          if (candidates.length >= size * 4) break; // 生成更多候选，增加多样性
        }
      }
      
      if (candidates.length >= size * 4) break;
    }
    
    if (candidates.length >= size * 4) break;
  }
  
  console.log(`总共生成${candidates.length}个候选名字`);
  
  // 去重并选择最终结果
  const uniqueCards = new Map();
  for (const card of candidates) {
    if (!uniqueCards.has(card.name)) {
      uniqueCards.set(card.name, card);
    }
  }
  
  const finalCards: NameCard[] = Array.from(uniqueCards.values()).slice(0, size);

  // 提取一句原文（尽量包含名中的字），仅本地处理不走网络
  function extractLineFromOriginal(html: string, fullName: string): string {
    try {
      const text = (html || '')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      const sentences = text.split(/[。！？!\?\n]/).map(s => s.trim()).filter(Boolean);
      const given = fullName.slice(1); // 去掉姓氏
      const prefer = sentences.find(s => given.split('').some(ch => s.includes(ch)));
      return prefer || sentences[0] || '';
    } catch {
      return '';
    }
  }

  // 只提取中文句子；英文由前端懒加载翻译
  for (const c of finalCards) {
    c.lineCn = extractLineFromOriginal(c.originalVerse, c.name);
  }
  
  return Response.json({ 
    ok: true, 
    data: finalCards,
    stats: {
      totalCandidates: candidates.length,
      selectedCount: finalCards.length,
      uniqueCount: uniqueCards.size,
      sourcesUsed: sources,
      message: `严格按用户选择的数据源生成：${sources.join('、')}`
    }
  });
}


