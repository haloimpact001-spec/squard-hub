export interface FontStyle {
  name: string;
  convert: (text: string) => string;
}

const normal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const maps: Record<string, string> = {
  bold: '𝐁𝐂𝐃𝐅𝐆𝐇𝐉𝐊𝐋𝐍𝐎𝐏𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐞𝐟𝐠𝐢𝐣𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐰𝐱𝐲𝟎𝟏𝟐𝟒𝟓𝟔𝟖𝟗',
  italic: '𝐴𝐵𝐷𝐸𝐹𝐺𝐻𝐼𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑝𝑞𝑟𝑡𝑢𝑤𝑥𝑦𝑧0123456789',
  boldItalic: '𝑨𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗',
  script: '𝒜𝐵𝒟𝐸𝐹𝒢𝐻𝐼𝒦𝐿𝒩𝒪𝒫𝑅𝒮𝒯𝒰𝒱𝒲𝒴𝒵𝒶𝒷𝒸𝒹𝑒𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓋𝓌𝓍𝓎𝓏0123456789',
  boldScript: '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓳𝓴𝓶𝓷𝓸𝓺𝓻𝓼𝓽𝓾𝓿𝔁𝔂𝔃0123456789',
  fraktur: '𝔄𝔅ℭ𝔈𝔉𝔊ℌℑ𝔍𝔎𝔐𝔑𝔒𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔟𝔠𝔡𝔣𝔤𝔥𝔧𝔨𝔩𝔫𝔬𝔭𝔮𝔯𝔰𝔲𝔳𝔴𝔵𝔶𝔷0123456789',
  boldFraktur: '𝕬𝕭𝕮𝕯𝕰𝕱𝕳𝕴𝕵𝕷𝕸𝕹𝕻𝕼𝕽𝕿𝖀𝖁𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖎𝖏𝖑𝖒𝖓𝖕𝖖𝖗𝖙𝖚𝖛𝖝𝖞0123456789',
  doubleStruck: '𝔸ℂ𝔻𝔼𝔾ℍ𝕀𝕁𝕂𝕃𝕄𝕆ℙℚℝ𝕊𝕋𝕌𝕎𝕏𝕐𝕒𝕓𝕕𝕖𝕗𝕘𝕙𝕚𝕜𝕝𝕞𝕠𝕡𝕢𝕤𝕥𝕧𝕨𝕩𝕪𝕫𝟘𝟚𝟛𝟜𝟞𝟟𝟠',
  monospace: '𝙰𝙲𝙳𝙴𝙶𝙷𝙸𝙺𝙻𝙼𝙾𝙿𝚀𝚂𝚃𝚅𝚆𝚇𝚉𝚊𝚋𝚍𝚎𝚏𝚑𝚒𝚓𝚕𝚖𝚗𝚘𝚙𝚚𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝟶𝟷𝟸𝟺𝟻𝟼𝟽𝟾𝟿',
  circled: 'ⒶⒷⒹⒺⒻⒼⒽⒾⓀⓁⓂⓄⓅⓆⓈⓉⓊⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓣⓤⓥⓧⓨⓩ①②③④⑥⑦⑧⑨',
  squared: '🄰🄱🄳🄴🄵🄷🄸🄹🄻🄼🄽🄿🅀🅁🅃🅄🅆🅇🅉🅰🅱🅲🅳🅴🅶🅷🅸🅹🅺🅻🅽🅾🅿🆁🆂🆃🆄🆅🆆🆇🆈🆉0123456789',
  smallCaps: 'ᴀʙᴄᴅᴇғʜɪᴊᴋʟᴍɴᴏᴘǫsᴛᴜᴠᴡxʏᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ0123456789',
  fullwidth: 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｌｍｎｏｐｑｓｔｕｖｗｘｙｚ０１２３４５６７８９',
};

function mapText(text: string, targetMap: string): string {
  return Array.from(text).map(char => {
    const index = normal.indexOf(char);
    return index !== -1 && targetMap[index] ? targetMap[index] : char;
  }).join('');
}

export const fontStyles: FontStyle[] = [
  { name: 'Bold', convert: (t) => mapText(t, maps.bold) },
  { name: 'Italic', convert: (t) => mapText(t, maps.italic) },
  { name: 'Bold Italic', convert: (t) => mapText(t, maps.boldItalic) },
  { name: 'Script', convert: (t) => mapText(t, maps.script) },
  { name: 'Bold Script', convert: (t) => mapText(t, maps.boldScript) },
  { name: 'Fraktur', convert: (t) => mapText(t, maps.fraktur) },
  { name: 'Bold Fraktur', convert: (t) => mapText(t, maps.boldFraktur) },
  { name: 'Double-Struck', convert: (t) => mapText(t, maps.doubleStruck) },
  { name: 'Monospace', convert: (t) => mapText(t, maps.monospace) },
  { name: 'Circled', convert: (t) => mapText(t, maps.circled) },
  { name: 'Squared', convert: (t) => mapText(t, maps.squared) },
  { name: 'Small Caps', convert: (t) => mapText(t, maps.smallCaps) },
  { name: 'Fullwidth', convert: (t) => mapText(t, maps.fullwidth) },
  { name: 'Wide Spaced', convert: (t) => Array.from(t).join(' ') },
  { name: 'Upside Down', convert: (t) => {
    const upsideDownMap: Record<string, string> = {
      'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': '', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': '', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
      'A': 'Ɐ', 'B': 'q', 'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': 'פ', 'H': 'H', 'I': 'I', 'J': '', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'd', 'Q': 'b', 'R': 'ɹ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '', 'Z': 'Z',
      '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': '', '4': 'h', '5': 'S', '6': '9', '7': 'L', '8': '8', '9': '6', ' ': ' '
    };
    return Array.from(t).map(char => upsideDownMap[char] || char).reverse().join('');
  }},
  { name: '★彡 Star 彡★', convert: (t) => `★彡 ${t} 彡★` },
  { name: '༺ Tibetan ༻', convert: (t) => `༺ ${t} ༻` },
  { name: '『 Bracket 』', convert: (t) => `『${t}』` },
  { name: '꧁ Javanese ꧂', convert: (t) => `꧁ ${t} ꧂` },
  { name: '⚡ Lightning ', convert: (t) => `⚡ ${t} ⚡` },
  { name: '👑 Crown 👑', convert: (t) => `👑 ${t} 👑` },
  { name: '💥 Free Fire 💥', convert: (t) => `💥 ${t} 💥` },
  { name: '⚽ DLS ⚽', convert: (t) => `⚽ ${t} ` },
  { name: '💰 Lagos Life 💰', convert: (t) => `💰 ${t} 💰` },
  { name: '🏆 Champion 🏆', convert: (t) => `🏆 ${t} 🏆` },
  { name: '️ Defender 🛡️', convert: (t) => `🛡️ ${t} ️` },
  { name: '️ Toxic ☠️', convert: (t) => `☠️ ${t} ☠️` },
  // --- NAIJA VIBES (Cultural Relevance) ---
  { name: 'Naija Oga 👑', convert: (t) => `👑 𝕺𝖆_${t} 👑` },
  { name: 'Sapa Slayer 💸', convert: (t) => `💸 𝕾𝖆𝖕𝖆_${t} 💸` },
  { name: 'Japa King ✈️', convert: (t) => `✈️ 𝕵𝖆𝖕𝖆_${t} ️` },
  { name: 'Area Boy 🔫', convert: (t) => `🔫 𝕬𝖗𝖊𝖆_${t} 🔫` },
  { name: 'Lagos Vibes 🌴', convert: (t) => `🌴 𝖆𝖌𝖔𝖘_${t} 🌴` },
  { name: 'No Gree 🔥', convert: (t) => `🔥 𝕹𝖔_𝕲𝖗𝖊𝖊_${t} 🔥` },
];