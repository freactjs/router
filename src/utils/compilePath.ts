import { raise } from "./raise";

export const compilePath = (path: string, caseSensitive: boolean = false): [RegExp, [string, number][], number] => {
  const parts = path.split('/');
  const params: [string, number][] = [];
  let patt = '^', wildcard = Infinity;

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '*') { // wildcard
      if (i < parts.length - 1)
        raise(`Invalid path '/${path}'. Wildcard use is only permitted at the very end.`);

      patt += "(/[a-zA-Z0-9.\\-/%_~!$&'()*+,;=:@]+)?";
      wildcard = i;
    } else if (parts[i].startsWith(':')) { // param
      params.push([parts[i].endsWith('?') ? parts[i].slice(1, -1) : parts[i].slice(1), i]);
      patt += "(/[a-zA-Z0-9.\\-%_~!$&'()*+,;=:@]+)";
      if (parts[i].endsWith('?')) patt += '?';
    } else { // exact
      let name = parts[i].endsWith('?') ? parts[i].slice(0, -1) : parts[i];
      name = encodeURI(name);
      name = name.replace(/[\\.*+^$?{}|()[\]]/g, "\\$&"); // Escape RegExp special chars
      patt += `(/${name})`;
      if (parts[i].endsWith('?')) patt += '?';
    }
  }

  patt += '$';
  return [new RegExp(patt, caseSensitive ? '' : 'i'), params, wildcard];
};
