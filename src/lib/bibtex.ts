/**
 * src/lib/bibtex.ts
 *
 * Parses raw .bib strings into a stable Pub[] shape.
 * Author names render as "First Last" (e.g. "Henrik von Coler"),
 * NOT BibTeX's "Last, First" storage format.
 *
 * Notes on @retorquere/bibtex-parser (v10):
 *   - Most fields come back as PLAIN STRINGS, not arrays.
 *   - `author` comes back as an array of {firstName, lastName, prefix?}.
 *   - `sentenceCase: false` is required, or titles get down-cased
 *     ("BIKES: A Moving..." -> "BIKES: a moving...").
 */

import { parse } from '@retorquere/bibtex-parser';

export type Pub = {
  key:       string;
  type:      string;     // 'article' | 'inproceedings' | 'book' | ...
  title:     string;
  authors:   string[];   // ["Laura Call Gomez", "Henrik von Coler"]
  venue:     string;     // journal | booktitle | publisher
  year:      number;
  doi?:      string;
  url?:      string;
  pdf?:      string;
  note?:     string;
  abstract?: string;
};

/** Fields may be string | string[] depending on the field. Normalize to string. */
function field(fields: Record<string, any>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = fields[k];
    if (v == null) continue;
    const s = Array.isArray(v) ? String(v[0] ?? '') : String(v);
    if (s.trim()) return s.trim();
  }
  return undefined;
}

/** "Henrik von Coler" from {firstName:'Henrik', lastName:'Coler', prefix:'von'} */
function authorList(fields: Record<string, any>): string[] {
  const raw = fields['author'] ?? fields['editor'];
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : [raw];

  return arr
    .map((a: any) => {
      if (typeof a === 'string') return a.trim();
      // A "literal" author (institution etc.) has no first/last split.
      if (a.literal) return String(a.literal).trim();
      const first  = String(a.firstName ?? '').trim();
      const prefix = String(a.prefix ?? '').trim();   // von, van der, de la
      const last   = String(a.lastName ?? '').trim();
      const suffix = String(a.suffix ?? '').trim();   // Jr., III
      const name = [first, prefix, last].filter(Boolean).join(' ');
      return suffix ? `${name}, ${suffix}` : name;
    })
    .filter(Boolean);
}

/**
 * Parse one or more raw .bib strings into a deduped, year-desc Pub[].
 * Later files win on duplicate keys.
 */
export function parseBib(...raws: (string | undefined)[]): Pub[] {
  const map = new Map<string, Pub>();

  for (const raw of raws) {
    if (!raw) continue;
    let entries: any[] = [];
    try {
      entries = parse(raw, { sentenceCase: false }).entries ?? [];
    } catch (err) {
      console.warn('[bibtex] parse failed for one file — skipping', err);
      continue;
    }

    for (const e of entries) {
      const f = e.fields ?? {};
      map.set(e.key, {
        key:      e.key,
        type:     String(e.type ?? 'misc').toLowerCase(),
        title:    field(f, 'title') ?? '(untitled)',
        authors:  authorList(f),
        venue:    field(f, 'journal', 'booktitle', 'publisher', 'school', 'institution') ?? '',
        year:     Number(field(f, 'year')) || 0,
        doi:      field(f, 'doi'),
        url:      field(f, 'url'),
        pdf:      field(f, 'pdf', 'file'),
        note:     field(f, 'note'),
        abstract: field(f, 'abstract'),
      });
    }
  }

  return [...map.values()].sort((a, b) => b.year - a.year);
}

/** Group into [year, Pub[]] pairs, newest first. */
export function groupByYear(pubs: Pub[]): [number, Pub[]][] {
  const m = new Map<number, Pub[]>();
  for (const p of pubs) {
    const list = m.get(p.year) ?? [];
    list.push(p);
    m.set(p.year, list);
  }
  return [...m.entries()].sort(([a], [b]) => b - a);
}

/**
 * Eagerly load every .bib file under src/data/bib/ as raw text.
 * Returns a map keyed by basename without extension: { bikes: "@inproceedings{...", ... }
 */
const bibModules = import.meta.glob('/src/data/bib/*.bib', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const BIB_FILES: Record<string, string> = Object.fromEntries(
  Object.entries(bibModules).map(([path, raw]) => [
    path.split('/').pop()!.replace(/\.bib$/, ''),
    raw,
  ])
);

/**
 * Resolve a frontmatter `bib:` value into Pub[].
 * Accepts a single name ("bikes") or a list (["bikes", "spatial"]).
 * Unknown names are warned about and skipped.
 */
export function pubsFor(bib: string | string[] | undefined): Pub[] {
  if (!bib) return [];
  const names = Array.isArray(bib) ? bib : [bib];
  const raws = names.map((n) => {
    const raw = BIB_FILES[n];
    if (!raw) {
      console.warn(
        `[bibtex] No such file src/data/bib/${n}.bib — ` +
        `available: ${Object.keys(BIB_FILES).join(', ') || '(none)'}`
      );
    }
    return raw;
  });
  return parseBib(...raws);
}
