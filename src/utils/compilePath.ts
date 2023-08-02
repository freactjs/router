import { raise } from "./raise";

export const compilePath = (path: string): [RegExp, number, [string, number][], number | null] => {
  const parts = path.split('/');
  const params: [string, number][] = [];
  let specificity = 0, isSpecific = 1, patt = '^', wildcard = null;

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '*') { // wildcard
      if (i < parts.length - 1)
        raise(`Invalid path '/${path}'. Wildcard use is only permitted at the very end.`);

      patt += "(\\/[a-zA-Z0-9.\\-\\/%_~!$&'()*+,;=:@]+)?";
      isSpecific = 0;
      wildcard = i;
    } else if (parts[i].startsWith(':')) { // param
      isSpecific = 0;
      params.push([parts[i].endsWith('?') ? parts[i].slice(1, -1) : parts[i].slice(1), i]);
      patt += "(\\/([a-zA-Z0-9.\\-%_~!$&'()*+,;=:@])+)";
      if (parts[i].endsWith('?')) patt += '?';
    } else { // exact
      patt += `(\\/${parts[i].endsWith('?') ? parts[i].slice(0, -1) : parts[i]})`; // TODO: Escape regex chars
      if (parts[i].endsWith('?')) patt += '?';
    }

    specificity += isSpecific;
  }

  patt += '$';
  return [new RegExp(patt, 'i'), specificity, params, wildcard];
};
