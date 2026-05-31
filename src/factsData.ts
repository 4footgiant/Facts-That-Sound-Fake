import { Fact, Category, Achievement, LoadingMessage } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'animals',
    title: 'Animals',
    subheading: 'Nature was clearly unsupervised.',
    emoji: '🐙'
  },
  {
    id: 'space',
    title: 'Space',
    subheading: 'The universe is deeply concerning.',
    emoji: '👽'
  },
  {
    id: 'brain_damage',
    title: 'Brain Damage',
    subheading: 'Facts that permanently alter your thinking.',
    emoji: '🧠'
  },
  {
    id: 'sounds_illegal',
    title: 'Sounds Illegal',
    subheading: 'Somehow these are real.',
    emoji: '🚫'
  },
  {
    id: 'cursed',
    title: 'Cursed Facts',
    subheading: 'You’ll wish you didn’t know these.',
    emoji: '☠️'
  },
  {
    id: 'humans',
    title: 'Humans',
    subheading: 'Humans are weird little creatures.',
    emoji: '👤'
  },
  {
    id: 'history',
    title: 'History',
    subheading: 'Humanity has always been chaotic.',
    emoji: '📜'
  },
  {
    id: 'food',
    title: 'Food',
    subheading: 'Your appetite may not survive this.',
    emoji: '🍔'
  }
];

export const LOADING_MESSAGES: LoadingMessage[] = [
  // Common
  { text: 'Loading forbidden knowledge...', rarity: 'Common' },
  { text: 'Reality integrity stabilising...', rarity: 'Common' },
  { text: 'Preparing brain damage...', rarity: 'Common' },
  { text: 'Consulting local experts...', rarity: 'Common' },
  { text: 'Decoding existential telemetry...', rarity: 'Common' },
  { text: 'Booting truth generator...', rarity: 'Common' },
  
  // Rare
  { text: 'Consulting the octopuses...', rarity: 'Rare' },
  { text: 'Definitely not government secrets...', rarity: 'Rare' },
  { text: 'Signal intercepted...', rarity: 'Rare' },
  { text: 'Scanning for FBI surveillance...', rarity: 'Rare' },
  { text: 'Preheating the microwave matrix...', rarity: 'Rare' },
  { text: 'Compiling glitch parameters...', rarity: 'Rare' },

  // Legendary
  { text: 'THEY ARE WATCHING', rarity: 'Legendary' },
  { text: '[REDACTED]', rarity: 'Legendary' },
  { text: 'SYSTEM ERROR: KNOWLEDGE OVERFLOW', rarity: 'Legendary' },
  { text: 'CONNECTING TO SACRED OCTOPUS CONCLAVE', rarity: 'Legendary' },
  { text: '3:00 AM PROTOCOLS INITIATED', rarity: 'Legendary' }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'Brain Slightly Cracked',
    description: 'Answer your first fact correctly.',
    icon: 'Sparkles',
    sarcasticRemark: 'Don’t celebrate yet. It gets worse.',
    isUnlocked: false
  },
  {
    id: 'streak_5',
    title: 'Suspiciously Smart',
    description: 'Get a streak of 5 correct answers.',
    icon: 'Flame',
    sarcasticRemark: 'The FBI is actively looking at your IP address.',
    isUnlocked: false
  },
  {
    id: 'streak_10',
    title: 'Reality Glitched',
    description: 'Get a streak of 10 correct answers.',
    icon: 'Radioactive',
    sarcasticRemark: 'You have transcended standard human limits. Go outside.',
    isUnlocked: false
  },
  {
    id: 'fail_3_streak',
    title: 'Gullible Earthling',
    description: 'Get 3 wrong answers in a row.',
    icon: 'Skull',
    sarcasticRemark: 'Honestly, we expected nothing, and you still disappointed.',
    isUnlocked: false
  },
  {
    id: 'octopus_cultist',
    title: 'Octopus Friend',
    description: 'Click on the hidden octopus easter egg 5 times.',
    icon: 'HelpCircle',
    sarcasticRemark: 'You have been added to the cephalopod safelist.',
    isUnlocked: false
  },
  {
    id: 'history_buff',
    title: 'Chaos Connoisseur',
    description: 'Answer 5 History facts correctly.',
    icon: 'Hourglass',
    sarcasticRemark: 'Congratulations, you understand how messed up ancestors were.',
    isUnlocked: false
  },
  {
    id: 'forbidden_knowledge',
    title: 'Watchlisted',
    description: 'Encounter a classified Forbidden-rarity fact.',
    icon: 'ShieldAlert',
    sarcasticRemark: 'A black van is currently parking outside your kitchen.',
    isUnlocked: false
  },
  {
    id: 'completionist',
    title: 'Brain Melt Complete',
    description: 'Discover at least 25 unique facts.',
    icon: 'Database',
    sarcasticRemark: 'Your brain is successfully flatlined. Achievement unlocked.',
    isUnlocked: false
  }
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export const getWittyExplanation = (factId: string, factText: string, isTrue: boolean): string => {
  const text = factText.toLowerCase();

  // Wombats
  if (text.includes('wombat')) {
    return 'Yes, this is completely true! The wombat is the only known animal in the world that produces cube-shaped feces due to how their intestines stretch flat in some areas and stiffen in others.';
  }
  // Great Dane / Juliana / bomb
  if (text.includes('juliana') || (text.includes('great dane') && text.includes('bomb'))) {
    return 'Unbelievably real. In 1941, Juliana stood over a bomb that had fallen through the roof of her owner\'s house and urinated on it, neutralising the fuse before it could explode.';
  }
  // Jellyfish
  if (text.includes('jellyfish') && (text.includes('immortal') || text.includes('polyp'))) {
    return 'True. Turritopsis dohrnii is biologically immortal. Instead of dying, its cells transdifferentiate back into a colonial state, allowing it to start its life cycle all over again.';
  }
  // Cuttlefish
  if (text.includes('cuttlefish')) {
    return 'Fake! While cuttlefish are master camouflage artists and can pulsate colors to hypnotize prey, they cannot generate functional QR codes. Although, that’s exactly what they want you to think.';
  }
  // Octopus
  if (text.includes('octopus') || text.includes('octopuses')) {
    if (text.includes('three hearts') || text.includes('blue blood') || text.includes('beak') || text.includes('bone')) {
      return 'Absolutely true. Their hearts pump copper-based blood, and since their only hard part is a keratin beak, a 50kg octopus can squeeze through an aperture the size of an orange.';
    }
  }
  // Koala
  if (text.includes('koala') && text.includes('fingerprint')) {
    return 'Yes! Koala fingerprints are so similar to ours that even under an electron microscope, researchers have difficulty telling them apart, causing forensic headaches in Australia.';
  }
  // Sagittarius B2
  if (text.includes('sagittarius b2') || text.includes('pints of beer') || text.includes('ethyl alcohol')) {
    return 'True! It is a massive molecular cloud made largely of alcohol (and propyl formate, which gives it the distinct smell of raspberries and rum). Sadly, it’s 26,050 light-years away.';
  }
  // Venus
  if (text.includes('venus') && text.includes('metal')) {
    return 'Yes. The crust of Venus is so hot that these metals vaporize into the upper atmosphere and precipitate as metallic "snowcap" frost on high altitude mountain ranges.';
  }
  // Uranus / Neptune / diamonds
  if ((text.includes('uranus') || text.includes('neptune')) && text.includes('diamond')) {
    return 'Completely real! Under thousands of miles of atmosphere, the intense heat and density crystallize carbon directly into diamonds, creating diamond icebergs in hot, liquid carbon oceans.';
  }
  // Sun cold / holographic
  if (text.includes('sun') && (text.includes('cold') || text.includes('holographic'))) {
    return 'Nonsense. The sun’s core is a raging, 15-million-degree thermonuclear furnace fusing hydrogen into helium. Anyone telling you the sun is cold is likely an undercover octopus.';
  }
  // Lunar / Pyramid / dome / NASA
  if (text.includes('lunar') || (text.includes('nasa') && text.includes('dome')) || text.includes('half-mile wide')) {
    return 'True. NASA researchers had to formally explain that the "glass dome" was actually a camera lens flare artifact on Apollo negatives that had been heavily blown out by conspiracy websites.';
  }
  // Paper fold
  if (text.includes('fold') && text.includes('paper') && text.includes('103')) {
    return 'Mathematically true. Exponential growth is terrifying. Folding a standard paper of 0.1mm thickness 103 times results in a thickness of 93 billion light-years.';
  }
  // Brain 20 watts
  if (text.includes('brain') && (text.includes('20 watts') || text.includes('refrigerator'))) {
    return 'True. Despite processing complex thoughts, visual graphics, and subconscious operations simultaneously, your brain behaves with the electrical footprint of an eco-friendly LED bulb.';
  }
  // Anechoic / Soundproof / eyes
  if (text.includes('anechoic') || (text.includes('soundproof') && text.includes('eyes'))) {
    return 'Fake! While you can hear your own heartbeat, the blood pulsing through your head, and a high-pitched ring in your nerves, you cannot hear your eyes rotate. That\'s just creepy folklore.';
  }
  // Wyoming / Center
  if (text.includes('wyoming') && (text.includes('waters') || text.includes('void') || text.includes('cartographical'))) {
    return 'Total lie. Wyoming is very much a contiguous block of land, and no part of interior USA is legally "international waters". Nice try though, internet.';
  }
  // Gravity tunnel / jump
  if (text.includes('tunnel') && text.includes('center of the earth') && text.includes('42 minutes')) {
    return 'Physically true! Ignoring air resistance and terminal heat, gravity would accelerate you to the center, decelerate you to a perfect stop at the exit, and then pull you back down forever.';
  }
  // Welsh Sunday / crossbow / longbow
  if (text.includes('welsh') || text.includes('hereford') || text.includes('cathedral boundaries')) {
    return 'True! This is one of those ancient, medieval statutes that was never repealed by Parliament, although carrying a combat longbow inside Hereford Cathedral will still get you arrested instantly.';
  }
  // Guinea pig / Switzerland
  if (text.includes('guinea pig') && text.includes('switzerland')) {
    return 'True. Swiss law treats several highly social animals this way. If one of your guinea pigs dies, there are actually specialized "guinea pig rental agencies" so you can get a temporary buddy for the survivor.';
  }
  // Laser Tokyo / advertiser / virtual squatting
  if (text.includes('tokyo') && (text.includes('laser pointer') || text.includes('squatting'))) {
    return 'Fake. Japanese laws cover standard property damage and light pollution, but "virtual squatting" is a sci-fi term we made up. But it sounds incredibly real!';
  }
  // Samoa / Birthday wife
  if (text.includes('samoa') || text.includes('wife\'s birthday') || text.includes('constitutional offense')) {
    return 'Yes! While rarely enforced aggressively, it is a real law. A wife can file an official complaint, and the husband can be summoned to explain himself to the village chiefs.';
  }
  // Texas / Coin magic
  if (text.includes('texas') && (text.includes('magic trick') || text.includes('service officer'))) {
    return 'Fake! No such specific "coin behind ear" law exists, but we definitely caution against reaching around police dogs since they might interpret your magic trick as an aggressive bite-invitation.';
  }
  // Spiders swallow
  if (text.includes('spider') && text.includes('swallow') && text.includes('sleeping')) {
    return 'COMPLETELY FAKE. This is a legendary internet myth started in 1993 specifically to test how quickly fake facts spread worldwide. Spiders actually hate human mouths—the heavy vibration of our breathing scares them away.';
  }
  // Eyelash roommates / Demodex
  if (text.includes('eyelash') || text.includes('demodex') || text.includes('mites')) {
    return 'Terrible, but completely true. They crawl on your face in the dark to find mates and lay eggs in your pores. Since they lack an excretory system, they swell up with waste and decompose inside your follicles.';
  }
  // Butterfly blood / sweat / tears
  if (text.includes('butterflies') || text.includes('butterfly') && (text.includes('sweat') || text.includes('tears') || text.includes('blood'))) {
    return 'True! This behavior is called "mud-puddle puddling". Butterflies seek out sodium, nitrogen, and essential minerals from blood, sweat, and rotting flesh because sweet flower nectar lacks them.';
  }
  // Vinegar egg
  if (text.includes('vinegar') || text.includes('egg') && text.includes('bounce')) {
    return 'True! The acetic acid in vinegar completely dissolves the calcium carbonate shell, leaving only the flexible inner membrane intact. It behaves exactly like a semi-clear rubber ball.';
  }
  // Cicadas / Spores / fungus
  if (text.includes('cicada') || text.includes('massospora') || text.includes('fungus')) {
    return 'Horrifyingly true. The fungus Massospora contains cathinone (an amphetamine). It causes males to act like females and wing-flick to attract both sexes, spreading spores like a living salt-shaker until they literally break in half.';
  }
  // Spit contracting micro-jets / gleet
  if (text.includes('gleet') || (text.includes('gland') && text.includes('saliva') && text.includes('spit'))) {
    return 'Yes! This is known as "gleeting". It most often happens when yawning or compressing the tongue just right, spraying a fine horizontal jet of saliva across the room.';
  }
  // Left lung cardiac notch
  if (text.includes('lung') && text.includes('smaller') && text.includes('heart')) {
    return 'True! Human anatomy is not perfectly symmetrical. The left lung has a special indentation called the "cardiac notch" where your heart nestles.';
  }
  // Human bioluminescent glow
  if (text.includes('bioluminescent') || (text.includes('glow') && text.includes('1,000 times dimmer'))) {
    return 'Completely real. Highly sensitive thermographic cameras prove that our skin glows due to metabolic chemical reactions, peaking around late afternoon.';
  }
  // Breathe and swallow low voice box
  if (text.includes('breathe and swallow') || text.includes('swallow at the exact')) {
    return 'True! This is because our voice box has evolved to drop low in the neck to enable complex speech, which sacrifices the ability to seal the airway from the esophagus simultaneously.';
  }
  // Dense bones fall LRP5
  if (text.includes('dense bones') || (text.includes('density') && text.includes('LRP5') && text.includes('fall'))) {
    return 'Fake! While the LRP5 gene mutation DOES make bones extremely dense (making them nearly unbreakable in car crashes), it doesn\'t make tendons or organs immortal. Gravitational physics will still damage you.';
  }
  // Hearing death last sensory
  if (text.includes('hearing') && text.includes('die') && text.includes('sensory')) {
    return 'True. Brain-wave studies of comatose and terminal patients show that the auditory cortex responds to sounds up to several minutes after heartbeat and breathing cease.';
  }
  // Modena Bologna / bucket
  if (text.includes('modena') || text.includes('bologna') || text.includes('bucket')) {
    return 'Yes, this is historical fact. The "War of the Bucket" was real. Modena won, and they still exhibit the stolen wooden bucket in their local cathedral belfry to this day.';
  }
  // Acoustic Kitty CIA
  if (text.includes('acoustic kitty') || (text.includes('cia') && text.includes('cat') && text.includes('microph'))) {
    return 'Unbelievably true. Project Acoustic Kitty (1960s) aimed to spy on Soviet embassies. On its first field test, the spy cat wandered into the street and was immediately flattened by a yellow cab.';
  }
  // Napoleon rabbits
  if (text.includes('napoleon') && text.includes('rabbit')) {
    return 'True! In 1807, Napoleon wanted to celebrate a treaty, so his chief of staff gathered thousands of rabbits. However, being domestic rabbits, they mistook Napoleon for a farmer with carrots, charging him in massive military formations.';
  }
  // Julius Caesar pirates
  if (text.includes('caesar') && text.includes('pirate')) {
    return 'True. Caesar behaved like an arrogant tourist, making the pirates quiet down while he slept, reading them poetry, and promising to return and execute them—a promise he precisely fulfilled.';
  }
  // Roman mouthwash urine portuguese
  if (text.includes('roman') && (text.includes('urine') || text.includes('mouthwash'))) {
    return 'True. It worked because urine contains high levels of ammonia, which is an extremely effective natural cleaning agent. The Roman government even taxed the sale of public urine.';
  }
  // Egyptian honey tomb
  if (text.includes('egyptian') && text.includes('honey') && text.includes('tomb')) {
    return 'True. Honey has unique chemistry: very low water, high acidity, and bees secrete hydrogen peroxide into it. Bacteria fail to grow, meaning it stays fresh for eternity.';
  }
  // Castoreum beaver anal
  if (text.includes('castoreum') || (text.includes('beaver') && text.includes('anal'))) {
    return 'True. Castoreum is a molasses-like liquid beaver use to mark territory. FDA-approved, it has been used for 80+ years as a natural flavoring, though modern manufacturers rarely use it today due to high cost.';
  }
  // Banana potassium-40 airport radioactivity
  if (text.includes('banana') && text.includes('radioactive')) {
    return 'Yes! It takes about 10 million bananas consumed at once to cause radiation poisoning, but "The Banana Equivalent Dose" is a real unit of radiation measurement used by safety technicians.';
  }
  // Nutmeg myristicin psychosis
  if (text.includes('nutmeg') && (text.includes('psychosis') || text.includes('toxic'))) {
    return 'Very true. Nutmeg contains myristicin, an organic psychoactive compound. Ingesting too much is extremely toxic, causing "nutmeg psychosis," intense headaches, and multi-day hangovers.';
  }

  // Generative fallbacks
  if (isTrue) {
    const truths = [
      "Incredible, but 100% verified! Our deep telemetry probes confirm that this is indeed genuine and fully accurate.",
      "This is classified as a genuine reality parameter. Our octopuses and field advisors have thoroughly vetted this telemetry.",
      "Absolutely authentic. Our underground research division has fully authenticated these parameters from local archives.",
      "Verified under secure protocols. It sounds completely illegal, but reality behaves exactly as reported.",
      "Confidential signal decoded: True. Mainstream filters actively suppress this observation, but our local index validates its accuracy completely."
    ];
    return truths[Math.abs(hashString(factId)) % truths.length];
  } else {
    const fakes = [
      "A total cognitive simulation! Our decryptors processed the signals and confirmed it is entirely custom fiction.",
      "Complete fabrication. This rumor was engineered as an atmospheric distracter to test human brain stability.",
      "Nice try, but this belongs to simulated telemetry. No physical or mathematical proof stands for this.",
      "Total fake! Our central scanners intercepted this transmission and tagged it as high-grade cyber-mythology.",
      "Incorrect transmission. This scenario was constructed inside an AI training set and leaked into the archive."
    ];
    return fakes[Math.abs(hashString(factId)) % fakes.length];
  }
};

export const FACTS_DATABASE: Fact[] = [];
