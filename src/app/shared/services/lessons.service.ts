import { Injectable, signal } from '@angular/core';
import { Lesson } from '../models';

@Injectable({ providedIn: 'root' })
export class LessonsService {
  readonly completed = signal<string[]>(this.restore());
  readonly storageWarning = signal('');
  private lessons: Lesson[] = [
    {
      id: 'weather',
      title: 'Weather & climate',
      subject: 'Science',
      gradeLevel: 7,
      icon: '☁',
      minutes: 8,
      description: 'Get to know the winds that shape our islands.',
      progress: 0,
      content:
        'Weather describes conditions over hours or days. Climate describes patterns measured over decades. In the Philippines, Amihan is the northeast monsoon, bringing generally cooler, drier air to many areas. Habagat is the southwest monsoon, often bringing moist air and heavy rain to western parts of the country. Timing varies each year and rainfall differs by region. A monsoon is a seasonal wind pattern, not a typhoon. Check PAGASA advisories for current conditions.\n\nTry this: record cloud cover and rainfall at the same time for five days. You are observing weather; five days cannot establish a climate trend.',
      question: 'Which observation describes climate?',
      options: [
        'It rained this morning.',
        'A region has a wet season over many decades.',
        'Today is unusually windy.',
      ],
      answer: 1,
      explanation:
        'Climate describes long-term patterns. A single day describes weather.',
    },
    {
      id: 'farming',
      title: 'Math in the rice fields',
      subject: 'Math',
      gradeLevel: 8,
      icon: '▧',
      minutes: 6,
      description: 'Turn everyday measurements into useful skills.',
      progress: 0,
      content:
        'Area measures a surface in square units. A rectangular rice field that is 100 metres long and 50 metres wide has an area of 100 × 50 = 5,000 m². One hectare is exactly 10,000 m², so this field is 0.5 hectares. If a practice problem gives a yield of 4,000 kg per hectare, the expected harvest is 0.5 × 4,000 = 2,000 kg. Actual yields depend on growing conditions. A cavan is a traditional measure whose mass varies with the crop and local convention; always use the conversion stated in your problem.\n\nTry this: find the area of a 60 m × 40 m field, then divide by 10,000 to convert to hectares.',
      question: 'How many hectares is a 5,000 m² field?',
      options: ['5 hectares', '0.5 hectares', '50 hectares'],
      answer: 1,
      explanation: 'Divide 5,000 by 10,000 m² per hectare to get 0.5 hectares.',
    },
    {
      id: 'ecosystems',
      title: 'Life in our mangroves',
      subject: 'Science',
      gradeLevel: 7,
      icon: '♧',
      minutes: 7,
      description: 'Explore the connections in a coastal ecosystem.',
      progress: 0,
      content:
        'An ecosystem includes living things and their nonliving surroundings. Philippine mangrove forests connect land and sea. Mangrove trees are producers: they use sunlight to make sugars through photosynthesis. Fallen leaves become food for decomposers and small animals, supporting a wider food web. Fish and crabs find shelter among the roots. The roots can also reduce wave energy and trap sediment, though they do not eliminate storm risk.\n\nTry this: draw arrows showing energy moving from sunlight to a mangrove tree, then to a leaf-eating animal. Arrows point from the energy source to its consumer.',
      question: 'What role does a mangrove tree play in a food web?',
      options: ['Producer', 'Top predator', 'Decomposer'],
      answer: 0,
      explanation:
        'Mangrove trees make sugars using sunlight, so they are producers.',
    },
    {
      id: 'energy',
      title: 'Energy all around us',
      subject: 'Science',
      gradeLevel: 8,
      icon: 'ϟ',
      minutes: 8,
      description: 'Follow energy from the sun to your home.',
      progress: 0,
      content:
        'Energy can move between objects and change form. A solar panel converts light energy into electrical energy. A fan converts electrical energy into movement, with some energy transferred as heat and sound. Energy is conserved: it is transferred or transformed, not created from nothing. Power measures the rate of energy transfer. A 10-watt lamp used for 3 hours consumes 30 watt-hours of energy.\n\nTry this: list the energy transformations in a flashlight, starting with the chemical energy in its battery.',
      question: 'A solar panel mainly converts sunlight into what?',
      options: ['Chemical fuel', 'Electrical energy', 'Sound'],
      answer: 1,
      explanation:
        'Photovoltaic solar panels convert light into electrical energy.',
    },
    {
      id: 'fractions',
      title: 'Fractions at the market',
      subject: 'Math',
      gradeLevel: 7,
      icon: '½',
      minutes: 5,
      description: 'Build confidence with fractions and fair prices.',
      progress: 0,
      content:
        'Fractions represent parts of a whole. At a market, ½ kilogram plus ¼ kilogram equals ¾ kilogram. To add fractions, first use a common denominator: ½ = 2/4, so 2/4 + 1/4 = 3/4. If mangoes cost ₱120 per kilogram, ¾ kilogram costs 120 × 3/4 = ₱90. This assumes a constant price per kilogram.\n\nTry this: calculate the price of ½ kilogram of bananas at ₱80 per kilogram.',
      question: 'What is ½ + ¼?',
      options: ['2/6', '¾', '⅛'],
      answer: 1,
      explanation: 'Rewrite ½ as 2/4, then add 1/4 to get 3/4.',
    },
    {
      id: 'volcanoes',
      title: 'Inside a volcano',
      subject: 'Science',
      gradeLevel: 9,
      icon: '△',
      minutes: 9,
      description: 'Discover the science beneath the Philippine landscape.',
      progress: 0,
      content:
        'Many Philippine volcanoes form near plate boundaries where one tectonic plate sinks beneath another. Processes above the sinking plate can produce magma. Magma is molten rock below the surface; when it erupts, it is called lava. Eruptions can also release ash and gases. Volcano shape alone cannot predict the next eruption. PHIVOLCS monitors activity and issues volcano-specific bulletins and alert levels. Always follow official exclusion zones and local evacuation instructions.\n\nTry this: label a diagram with a magma chamber, a vent, lava, and an ash cloud.',
      question: 'What is magma called after it reaches the surface?',
      options: ['Lava', 'Sediment', 'A tectonic plate'],
      answer: 0,
      explanation:
        'Molten rock is called magma underground and lava at the surface.',
    },
  ];
  getAll(): Lesson[] {
    return this.lessons;
  }
  complete(id: string) {
    if (!this.lessons.some((l) => l.id === id) || this.completed().includes(id))
      return;
    this.completed.update((ids) => [...ids, id]);
    try {
      localStorage.setItem(
        'sciexplore-completed',
        JSON.stringify(this.completed()),
      );
    } catch {
      this.storageWarning.set(
        'Progress is saved for this session only. Browser storage is unavailable.',
      );
    }
  }
  private restore(): string[] {
    try {
      const value: unknown = JSON.parse(
        localStorage.getItem('sciexplore-completed') || '[]',
      );
      const valid = [
        'weather',
        'farming',
        'ecosystems',
        'energy',
        'fractions',
        'volcanoes',
      ];
      return Array.isArray(value)
        ? [
            ...new Set(
              value.filter(
                (id): id is string =>
                  typeof id === 'string' && valid.includes(id),
              ),
            ),
          ]
        : [];
    } catch {
      return [];
    }
  }
}
