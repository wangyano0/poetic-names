const fs = require('fs');
const path = require('path');

// 加载黑名单词汇
function loadBlacklist() {
  try {
    const blacklistPath = path.join(__dirname, '..', 'config', 'blacklist.json');
    const content = fs.readFileSync(blacklistPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('加载黑名单失败:', error);
    return [];
  }
}

// 测试黑名单过滤功能
function isCleanText(text, blacklist) {
  return !blacklist.some(word => text.includes(word));
}

// 测试
const blacklist = loadBlacklist();
console.log('黑名单词汇数量:', blacklist.length);
console.log('前20个黑名单词汇:', blacklist.slice(0, 20));

// 测试一些名字
const testNames = ['明月', '清风', '屎尿', '美丽', '鬼怪', '阳光', '死亡', '希望', '疾病', '智慧'];

console.log('\n测试名字过滤结果:');
testNames.forEach(name => {
  const isClean = isCleanText(name, blacklist);
  console.log(`${name}: ${isClean ? '✅ 通过' : '❌ 被过滤'}`);
});

// 测试包含黑名单词汇的名字
console.log('\n测试包含黑名单词汇的名字:');
const dirtyNames = ['屎明', '鬼月', '死清', '病风', '奴美', '贱丽'];
dirtyNames.forEach(name => {
  const isClean = isCleanText(name, blacklist);
  console.log(`${name}: ${isClean ? '✅ 通过' : '❌ 被过滤'}`);
});
