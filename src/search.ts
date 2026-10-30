const SEARCH_URL = 'https://www.bing.com/search';
const RESULT_LIMIT = 5;
const SNIPPET_LIMIT = 180;

function decode(raw: string): string {
  const text = raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_all, digits: string) => String.fromCodePoint(Number(digits)))
    .replace(/&#x([0-9a-f]+);/gi, (_all, hex: string) => String.fromCodePoint(parseInt(hex, 16)));
  return text.replace(/\s+/g, ' ').trim();
}

function field(block: string, name: string): string {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return match ? decode(match[1]) : '';
}

export function formatResults(xml: string): string {
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];
  const lines: string[] = [];
  for (const block of blocks) {
    if (lines.length >= RESULT_LIMIT) break;
    const title = field(block, 'title');
    const link = field(block, 'link');
    const snippet = field(block, 'description').slice(0, SNIPPET_LIMIT);
    if (!title || !link || link.includes('bing.com/search')) continue;
    lines.push(`${lines.length + 1}. ${title}\n${link}\n${snippet}`);
  }
  return lines.join('\n\n');
}

export async function searchWeb(query: string, signal?: AbortSignal): Promise<string> {
  const text = query.trim().slice(0, 80);
  if (!text) return '要写清想搜的那一句。';
  const url = `${SEARCH_URL}?q=${encodeURIComponent(text)}&format=rss&count=${RESULT_LIMIT}`;
  const timeout = AbortSignal.timeout(12000);
  const used = signal ? AbortSignal.any([signal, timeout]) : timeout;
  let response: Response;
  try {
    response = await fetch(url, {
      signal: used,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
    });
  } catch {
    return '这次没连上搜索。';
  }
  if (!response.ok) return '这次没搜到。';
  const body = await response.text();
  const formatted = formatResults(body);
  if (!formatted) return '没有搜到。换个更短的说法再搜一次。';
  return formatted;
}
