import type { ToolSpec } from 'cortico/core/types.ts';

export const WEB_SEARCH_TOOL_DECLS: ToolSpec[] = [
  {
    name: 'web_search',
    tags: ['read'],
    description: '查网上现在的说法。只有别人问到、而自己不知道或需要今天的消息时才用。旧聊天用 memory_search，不要用这个。不要自己没事搜。query 写一句短的搜索词，不要写老大的私事。',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '要搜的短句，例如「今天上海天气」。' },
      },
      required: ['query'],
    },
  },
];
