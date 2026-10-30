import type { Logger, ToolDef, World, WorldHost } from 'cortico/core/types.ts';
import type { WebSearchConfig } from './config.ts';
import { searchWeb } from './search.ts';
import { WEB_SEARCH_TOOL_DECLS } from './tools.ts';

export class WebSearchWorld implements World {
  readonly id = 'web-search';
  private readonly cfg: WebSearchConfig;
  private log: Logger | null = null;

  constructor(cfg: WebSearchConfig) {
    this.cfg = cfg;
  }

  envPromptVars(): Record<string, string> | null {
    return null;
  }

  tools(): ToolDef[] {
    return WEB_SEARCH_TOOL_DECLS.map((decl) => ({
      ...decl,
      handler: (args, ctx) => searchWeb(String(args.query ?? ''), ctx.signal),
    }));
  }

  async start(host: WorldHost): Promise<void> {
    this.log = host.log;
    if (!this.cfg.enabled) return;
    this.log.info('联网搜索已挂上');
  }

  async stop(): Promise<void> {}
}
