// This file runs in the page context

const REPLACEMENT_PLACEHOLDER = '****';

// Nodes that are unsafe to rewrite textContent
// For example https://developer.chrome.com/docs/extensions/reference/api/action
// TODO: Figure out better support... textContent? :grimmace:
const IGNORED_NODES = new Set([
  'STYLE',
  'ARTICLE',
  'MAIN',
  'SECTION',
  'HEADER',
  'INPUT',
  'TEXTAREA',
  'ASIDE',
  'HEADER',
  'FOOTER',
  'NAV',
  'SEARCH',
  'DIV',
]);

type WordIndex = {
  nodeMap: Map<HTMLElement, string[]>;
  words: Map<string, Map<HTMLElement, number[]>>;
};

function collectPageWords(
  startElement: HTMLElement,
  badWordSet: Set<string>
): WordIndex {
  // const allNodes = startElement.getElementsByTagName('*');
  const idx: WordIndex = {
    words: new Map(),
    nodeMap: new Map(),
  };

  const domTree = document.createTreeWalker(
    startElement,
    NodeFilter.SHOW_ELEMENT,
    (node) => {
      if (!(node instanceof HTMLElement)) {
        return NodeFilter.FILTER_SKIP;
      }
      if (IGNORED_NODES.has(node.tagName) || node.tagName.includes('-')) {
        return NodeFilter.FILTER_SKIP;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  );

  while (domTree.nextNode()) {
    const node = domTree.currentNode;
    if (!(node instanceof HTMLElement)) {
      continue;
    }
    console.log(node.tagName);
    console.log('node', node);
    console.log('text content', node.textContent);

    const textArray = (node.textContent || '').split(/\b/);
    idx.nodeMap.set(node, textArray);

    // Track node where word is found
    for (let j = 0; j < textArray.length; j++) {
      const word = textArray[j].toLowerCase();
      if (!badWordSet.has(word)) {
        continue;
      }

      let wordMap = idx.words.get(word);
      if (wordMap !== undefined) {
        let bagIdxArray = wordMap.get(node);
        if (bagIdxArray) {
          bagIdxArray.push(j);
        } else {
          // This is a new node
          bagIdxArray = [j];
        }
        wordMap.set(node, bagIdxArray);
      } else {
        wordMap = new Map();
        wordMap.set(node, [j]);
      }

      idx.words.set(word, wordMap);
    }
  }

  return idx;
}

// Perform the bad word replacements
function replaceBadWords(wordIdx: WordIndex) {
  let nodesToRewrite = new Set<HTMLElement>();
  for (let [, nodeInfo] of wordIdx.words.entries()) {
    for (let [node, wordPositions] of nodeInfo.entries()) {
      let bagOfWords = wordIdx.nodeMap.get(node) ?? [];
      for (let pos of wordPositions) {
        bagOfWords[pos] = REPLACEMENT_PLACEHOLDER;
      }
      wordIdx.nodeMap.set(node, bagOfWords);
      nodesToRewrite.add(node);
    }
  }

  for (let node of nodesToRewrite) {
    node.textContent = (wordIdx.nodeMap.get(node) || []).join('');
  }
}

function reportStats(wordIdx: WordIndex) {
  (async () => {
    await chrome.runtime.sendMessage({
      stats: wordIdx.words.size,
    });
  })();
}

// Performs sanitization on the current page
function sanitizePage() {
  const body = document.getElementsByTagName('body')[0];
  const badWords = getBadWords();
  // Walk the nodes in the page and each word in the node
  const wordIdx = collectPageWords(body, badWords);

  // Walk all the bad words and check if they exist in any of the words
  replaceBadWords(wordIdx);

  // Report back stats on the profanity
  reportStats(wordIdx);
}

sanitizePage();

// Copied from https://github.com/jojoee/leo-profanity/blob/master/dictionary/default.json
function getBadWords(): Set<string> {
  return new Set([
    '2g1c',
    'acrotomophilia',
    'anal',
    'anilingus',
    'anus',
    'apeshit',
    'arsehole',
    'ass',
    'asshole',
    'assmunch',
    'autoerotic',
    'babeland',
    'bangbros',
    'bareback',
    'barenaked',
    'bastard',
    'bastardo',
    'bastinado',
    'bbw',
    'bdsm',
    'beaner',
    'beaners',
    'bestiality',
    'bimbos',
    'birdlock',
    'bitch',
    'bitches',
    'blowjob',
    'blumpkin',
    'bollocks',
    'bondage',
    'boner',
    'boob',
    'boobs',
    'bukkake',
    'bulldyke',
    'bullshit',
    'bunghole',
    'busty',
    'butt',
    'buttcheeks',
    'butthole',
    'camgirl',
    'camslut',
    'camwhore',
    'carpetmuncher',
    'circlejerk',
    'clit',
    'clitoris',
    'clusterfuck',
    'cock',
    'cocks',
    'coprolagnia',
    'coprophilia',
    'cornhole',
    'coon',
    'coons',
    'creampie',
    'cum',
    'cumming',
    'cunnilingus',
    'cunt',
    'darkie',
    'daterape',
    'deepthroat',
    'dendrophilia',
    'dick',
    'dildo',
    'dingleberry',
    'dingleberries',
    'doggiestyle',
    'doggystyle',
    'dolcett',
    'domination',
    'dominatrix',
    'dommes',
    'dvda',
    'ecchi',
    'ejaculation',
    'erotic',
    'erotism',
    'escort',
    'eunuch',
    'faggot',
    'fecal',
    'felch',
    'fellatio',
    'feltch',
    'femdom',
    'figging',
    'fingerbang',
    'fingering',
    'fisting',
    'footjob',
    'frotting',
    'fuck',
    'fuckin',
    'fucking',
    'fucktards',
    'fudgepacker',
    'futanari',
    'genitals',
    'goatcx',
    'goatse',
    'gokkun',
    'goodpoop',
    'goregasm',
    'grope',
    'g-spot',
    'guro',
    'handjob',
    'hardcore',
    'hentai',
    'homoerotic',
    'honkey',
    'hooker',
    'humping',
    'incest',
    'intercourse',
    'jailbait',
    'jigaboo',
    'jiggaboo',
    'jiggerboo',
    'jizz',
    'juggs',
    'kike',
    'kinbaku',
    'kinkster',
    'kinky',
    'knobbing',
    'lolita',
    'lovemaking',
    'masturbate',
    'milf',
    'motherfucker',
    'muffdiving',
    'nambla',
    'nawashi',
    'negro',
    'neonazi',
    'nigga',
    'nigger',
    'nimphomania',
    'nipple',
    'nipples',
    'nude',
    'nudity',
    'nympho',
    'nymphomania',
    'octopussy',
    'omorashi',
    'orgasm',
    'orgy',
    'paedophile',
    'paki',
    'panties',
    'panty',
    'pedobear',
    'pedophile',
    'pegging',
    'penis',
    'pissing',
    'pisspig',
    'playboy',
    'ponyplay',
    'poof',
    'poon',
    'poontang',
    'punany',
    'poopchute',
    'porn',
    'porno',
    'pornography',
    'pthc',
    'pubes',
    'pussy',
    'queaf',
    'queef',
    'quim',
    'raghead',
    'rape',
    'raping',
    'rapist',
    'rectum',
    'rimjob',
    'rimming',
    'sadism',
    'santorum',
    'scat',
    'schlong',
    'scissoring',
    'semen',
    'sex',
    'sexo',
    'sexy',
    'shemale',
    'shibari',
    'shit',
    'shitblimp',
    'shitty',
    'shota',
    'shrimping',
    'skeet',
    'slanteye',
    'slut',
    's&m',
    'smut',
    'snatch',
    'snowballing',
    'sodomize',
    'sodomy',
    'spic',
    'splooge',
    'spooge',
    'spunk',
    'strapon',
    'strappado',
    'suck',
    'sucks',
    'swastika',
    'swinger',
    'threesome',
    'throating',
    'tit',
    'tits',
    'titties',
    'titty',
    'topless',
    'tosser',
    'towelhead',
    'tranny',
    'tribadism',
    'tubgirl',
    'tushy',
    'twat',
    'twink',
    'twinkie',
    'undressing',
    'upskirt',
    'urophilia',
    'vagina',
    'vibrator',
    'vorarephilia',
    'voyeur',
    'vulva',
    'wank',
    'wetback',
    'yaoi',
    'yiffy',
    'zoophilia',
  ]);
}

export {};
