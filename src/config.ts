import type { WorldSection } from 'cortico/world.ts';

export interface WebSearchConfig extends WorldSection {
  enabled: boolean;
}

export const WEB_SEARCH_DEFAULTS: WebSearchConfig = {
  enabled: false,
};
