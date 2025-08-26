declare module 'chinese-to-pinyin' {
  interface PinyinOptions {
    removeTone?: boolean;
    removeSpace?: boolean;
    keepRest?: boolean;
  }
  
  function chineseToPinyin(text: string, options?: PinyinOptions): string;
  
  export = chineseToPinyin;
}
