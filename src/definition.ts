import type { WorldDefinition } from 'cortico/world.ts';
import type { DescribeText, EventDescribe } from 'cortico/core/types.ts';
import { describeTools } from 'cortico/world.ts';
import { WEB_SEARCH_DEFAULTS, type WebSearchConfig } from './config.ts';
import { WEB_SEARCH_TOOL_DECLS } from './tools.ts';
import { WebSearchWorld } from './world.ts';

const summaries: Record<string, DescribeText> = {
  web_search: { zh: '查网上现在的说法。', en: 'Looks up current pages on the web.' },
};

const events: EventDescribe[] = [];

export const definition: WorldDefinition<WebSearchConfig> = {
  id: 'web-search',
  label: '联网搜索',
  defaults: () => structuredClone(WEB_SEARCH_DEFAULTS),
  create: (ctx) => new WebSearchWorld(ctx.cfg),
  describe: { tools: describeTools(WEB_SEARCH_TOOL_DECLS, summaries), events },
};
