export type Language = 'zh' | 'en' | 'bilingual';

export interface I18nTexts {
  // 页面标题
  pageTitle: {
    zh: string;
    en: string;
  };
  
  // 副标题
  subtitle: {
    zh: string;
    en: string;
  };
  
  // 描述
  description: {
    zh: string;
    en: string;
  };
  
  // 按钮文本
  buttons: {
    generate: {
      zh: string;
      en: string;
    };
    loading: {
      zh: string;
      en: string;
    };
    copy: {
      zh: string;
      en: string;
    };
    share: {
      zh: string;
      en: string;
    };
    viewDetails: {
      zh: string;
      en: string;
    };
    backToSummary: {
      zh: string;
      en: string;
    };
    refresh: {
      zh: string;
      en: string;
    };
    refreshing: {
      zh: string;
      en: string;
    };
  };
  
  // 表单标签
  form: {
    surname: {
      zh: string;
      en: string;
    };
    placeholder: {
      zh: string;
      en: string;
    };
  };
  
  // 数据源
  sources: {
    shijing: {
      zh: string;
      en: string;
      desc: {
        zh: string;
        en: string;
      };
    };
    chuci: {
      zh: string;
      en: string;
      desc: {
        zh: string;
        en: string;
      };
    };
    tangshi: {
      zh: string;
      en: string;
      desc: {
        zh: string;
        en: string;
      };
    };
    songci: {
      zh: string;
      en: string;
      desc: {
        zh: string;
        en: string;
      };
    };
  };
  
  // 筛选和排序
  filters: {
    filter: {
      zh: string;
      en: string;
    };
    sort: {
      zh: string;
      en: string;
    };
    view: {
      zh: string;
      en: string;
    };
    allLengths: {
      zh: string;
      en: string;
    };
    singleChar: {
      zh: string;
      en: string;
    };
    doubleChar: {
      zh: string;
      en: string;
    };
    byPinyin: {
      zh: string;
      en: string;
    };
    byPopularity: {
      zh: string;
      en: string;
    };
    gridView: {
      zh: string;
      en: string;
    };
    detailView: {
      zh: string;
      en: string;
    };
  };
  
  // 结果页面
  results: {
    title: {
      zh: string;
      en: string;
    };
    subtitle: {
      zh: string;
      en: string;
    };
    foundCount: {
      zh: string;
      en: string;
    };
  };
  
  // 名字卡片
  nameCard: {
    meaning: {
      zh: string;
      en: string;
    };
    source: {
      zh: string;
      en: string;
    };
    originalVerse: {
      zh: string;
      en: string;
    };
    sourceLabel: {
      zh: string;
      en: string;
    };
  };
  
  // 示例卡片
  examples: {
    title: {
      zh: string;
      en: string;
    };
    subtitle: {
      zh: string;
      en: string;
    };
    from: {
      zh: string;
      en: string;
    };
  };
  
  // 文学介绍
  literature: {
    title: {
      zh: string;
      en: string;
    };
  };
  
  // 理念阐述
  philosophy: {
    title: {
      zh: string;
      en: string;
    };
    cultural: {
      title: {
        zh: string;
        en: string;
      };
      desc: {
        zh: string;
        en: string;
      };
    };
    interpretation: {
      title: {
        zh: string;
        en: string;
      };
      desc: {
        zh: string;
        en: string;
      };
    };
    unique: {
      title: {
        zh: string;
        en: string;
      };
      desc: {
        zh: string;
        en: string;
      };
    };
  };
}

export const i18nTexts: I18nTexts = {
  pageTitle: {
    zh: "古诗文起名 · 遇见一个有故事的名字",
    en: "Discover a Name with a Beautiful Story"
  },
  subtitle: {
    zh: "发现一个充满诗意的中文名字和美丽的故事",
    en: "Discover a Poetic Chinese Name with a Beautiful Story"
  },
  description: {
    zh: "取自《诗经》《楚辞》《唐诗》《宋词》，为您生成承载东方诗意与文化韵味的名字",
    en: "Inspired by the Book of Songs, Songs of Chu, Tang Poetry, and Song Lyrics, creating names that embody timeless Chinese elegance."
  },
  buttons: {
    generate: {
      zh: "开启寻名之旅",
      en: "Begin the Journey"
    },
    loading: {
      zh: "生成中…",
      en: "Generating..."
    },
    copy: {
      zh: "复制",
      en: "Copy"
    },
    share: {
      zh: "分享",
      en: "Share"
    },
    viewDetails: {
      zh: "查看详情",
      en: "View Details"
    },
    backToSummary: {
      zh: "返回网格视图",
      en: "Back to Grid"
    },
    refresh: {
      zh: "换一批名字",
      en: "Refresh Names"
    },
    refreshing: {
      zh: "重新生成中...",
      en: "Refreshing..."
    }
  },
  form: {
    surname: {
      zh: "姓氏",
      en: "Surname"
    },
    placeholder: {
      zh: "输入姓氏（如：李、王、陈）",
      en: "Enter Surname (e.g., Li, Wang, Chen)"
    }
  },
  sources: {
    shijing: {
      zh: "诗经",
      en: "Book of Odes",
      desc: {
        zh: "中国最古老的诗歌总集，名字风格自然、质朴，常见意象如芦苇、清风、明玉。",
        en: "The oldest collection of Chinese poetry, with names that feel natural and pure."
      }
    },
    chuci: {
      zh: "楚辞",
      en: "Songs of Chu",
      desc: {
        zh: "充满神话色彩与浪漫主义，名字华美、香醇，意象有香草、美人、神鸟。",
        en: "Rich in mythology and romantic imagination, with names that are ornate and lyrical."
      }
    },
    tangshi: {
      zh: "唐诗",
      en: "Tang Poetry",
      desc: {
        zh: "气象万千的诗歌顶峰，名字大气、开阔，常见大漠、明月、长风的意境。",
        en: "The pinnacle of Chinese poetry, with grand and visionary names."
      }
    },
    songci: {
      zh: "宋词",
      en: "Song Ci",
      desc: {
        zh: "情感细腻、格律优美，名字温婉、雅致，意象如小桥流水、落花、春水。",
        en: "Known for its delicate emotions and elegant rhythm, inspiring graceful names."
      }
    }
  },
  filters: {
    filter: {
      zh: "筛选",
      en: "Filter"
    },
    sort: {
      zh: "排序",
      en: "Sort"
    },
    view: {
      zh: "视图",
      en: "View"
    },
    allLengths: {
      zh: "全部字数",
      en: "All Lengths"
    },
    singleChar: {
      zh: "单字名",
      en: "Single Char"
    },
    doubleChar: {
      zh: "双字名",
      en: "Double Char"
    },
    byPinyin: {
      zh: "按拼音",
      en: "By Pinyin"
    },
    byPopularity: {
      zh: "按热度",
      en: "By Popularity"
    },
    gridView: {
      zh: "网格视图",
      en: "Grid View"
    },
    detailView: {
      zh: "详情视图",
      en: "Detail View"
    }
  },
  results: {
    title: {
      zh: "个性化寻名结果",
      en: "Personalized Name Results"
    },
    subtitle: {
      zh: "基于姓氏，为你精心挑选的诗意之选",
      en: "Carefully selected poetic names based on your surname"
    },
    foundCount: {
      zh: "共找到",
      en: "Found"
    }
  },
  nameCard: {
    meaning: {
      zh: "寓意",
      en: "Meaning"
    },
    source: {
      zh: "出处",
      en: "Source"
    },
    originalVerse: {
      zh: "原诗句",
      en: "Original Verse"
    },
    sourceLabel: {
      zh: "来源",
      en: "Source"
    }
  },
  examples: {
    title: {
      zh: "探寻诗意之名",
      en: "A Glimpse of Poetic Names"
    },
    subtitle: {
      zh: "先感受一下诗意名字的风格与故事，再开始你的专属寻名之旅。",
      en: "Experience the style and stories of poetic names before starting your personalized journey."
    },
    from: {
      zh: "来自",
      en: "From"
    }
  },
  literature: {
    title: {
      zh: "漫步文学瑰宝",
      en: "Journey Through Literary Treasures"
    }
  },
  philosophy: {
    title: {
      zh: "我们的理念：名字不仅是符号",
      en: "Our Philosophy: More Than Just a Name"
    },
    cultural: {
      title: {
        zh: "文化为根",
        en: "Rooted in Culture"
      },
      desc: {
        zh: "每个名字都源自流传千年的中华经典，兼顾历史脉络与现代审美。",
        en: "Rooted in millennia-old Chinese classics."
      }
    },
    interpretation: {
      title: {
        zh: "精心诠释",
        en: "Beautifully Interpreted"
      },
      desc: {
        zh: "提供发音、寓意与出处解读，帮助家长理解名字背后的诗意与故事。",
        en: "Each name comes with pronunciation, meaning, and cultural context."
      }
    },
    unique: {
      title: {
        zh: "独特赠礼",
        en: "A Unique Gift"
      },
      desc: {
        zh: "为孩子献上一份独一无二的名字礼物，让他/她一生可讲述、可传承。",
        en: "A unique gift — a name with a story to tell for a lifetime."
      }
    }
  }
};

// 获取文本的辅助函数
export function getText(texts: { zh: string; en: string }, language: Language): string {
  if (language === 'zh') return texts.zh;
  if (language === 'en') return texts.en;
  return `${texts.zh} / ${texts.en}`;
}

// 获取双语文本
export function getBilingualText(texts: { zh: string; en: string }): string {
  return `${texts.zh} / ${texts.en}`;
}
