import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { useFoodLibrary } from '../../../lib/foods';

// ---------- SEASON OPTIONS ----------

const seasonOptions = [
  { value: 'spring', label: 'Spring (March–May)' },
  { value: 'summer', label: 'Summer (June–August)' },
  { value: 'autumn', label: 'Autumn (September–November)' },
  { value: 'winter', label: 'Winter (December–February)' }
];

// ---------- FOOD COMPATIBILITY (runs on the live food library) ----------
// Each food comes from GET /api/foods and carries rasa, guna, virya and a
// dosha effect. The rules below are the classical viruddha ahara pairs that
// can be read from those fields, plus virya and heaviness checks. There is no
// numeric score: the result is a level and the reasons behind it.

const RASA_EN = {
  Madhura: 'sweet',
  Amla: 'sour',
  Lavana: 'salty',
  Katu: 'pungent',
  Tikta: 'bitter',
  Kashaya: 'astringent'
};

const isMilk = (f) =>
  /(^|[^a-z])(milk|doodh)/i.test(f.name) &&
  !/butter\s*milk|coconut milk|almond milk/i.test(f.name);
const isCurd = (f) => /curd|yogurt|dahi|raita|pachadi/i.test(f.name);
const hasRasa = (f, r) => (f.ayurveda?.rasa || []).includes(r);
const hasGuna = (f, g) => (f.ayurveda?.guna || []).includes(g);
const doshaLabel = (k) => k[0].toUpperCase() + k.slice(1);
const viryaText = (v) => (v === 'Ushna' ? 'heating (Ushna)' : 'cooling (Sheeta)');

export const evaluateCompatibility = (a, b) => {
  if (!a || !b) return null;
  const avoid = [];
  const caution = [];
  const notes = [];

  const milkWith = (o) => {
    if (o.category === 'Fruit' || hasRasa(o, 'Amla')) {
      avoid.push(`Milk with fruit or sour foods (${o.name}) is a classical viruddha ahara (incompatible combination).`);
    }
    if (hasRasa(o, 'Lavana')) {
      avoid.push(`Milk with salty foods (${o.name}) is listed as incompatible in classical texts.`);
    }
  };
  if (isMilk(a)) milkWith(b);
  if (isMilk(b)) milkWith(a);

  if ((isCurd(a) && b.category === 'Fruit') || (isCurd(b) && a.category === 'Fruit')) {
    caution.push('Curd with fruit is traditionally discouraged because it can weaken digestion.');
  }

  const va = a.ayurveda?.virya;
  const vb = b.ayurveda?.virya;
  if (va && vb && va !== vb) {
    caution.push(
      `${a.name} is ${viryaText(va)} while ${b.name} is ${viryaText(vb)}. Opposite potencies in one meal can unsettle digestion in sensitive people.`
    );
  } else if (va && vb) {
    notes.push(`Both foods share the same potency (${va === 'Ushna' ? 'heating' : 'cooling'}).`);
  }

  if (hasGuna(a, 'Guru') && hasGuna(b, 'Guru')) {
    caution.push('Both foods are heavy (Guru). Together they can be slow to digest, especially at night.');
  } else if (hasGuna(a, 'Laghu') && hasGuna(b, 'Laghu')) {
    notes.push('Both foods are light (Laghu) and generally easy to digest together.');
  }

  const combined = ['vata', 'pitta', 'kapha'].map((k) => ({
    key: k,
    value: (a.ayurveda?.doshaEffect?.[k] || 0) + (b.ayurveda?.doshaEffect?.[k] || 0)
  }));
  const raises = combined.filter((d) => d.value > 0).map((d) => doshaLabel(d.key));
  const calms = combined.filter((d) => d.value < 0).map((d) => doshaLabel(d.key));

  const level = avoid.length ? 'avoid' : caution.length ? 'caution' : 'good';
  const summary =
    level === 'avoid'
      ? 'Better to avoid this combination'
      : level === 'caution'
      ? 'Use this combination with care'
      : 'No known conflict between these foods';
  const recommendation =
    level === 'avoid'
      ? 'Have these at separate meals rather than together.'
      : level === 'caution'
      ? 'Fine occasionally. Keep portions moderate and prefer having them at lunch, when digestion is strongest.'
      : 'This pair looks compatible. Keep portions balanced and notice how your digestion responds.';

  return { level, summary, reasons: [...avoid, ...caution, ...notes], recommendation, raises, calms };
};

const FoodFacts = ({ food }) => {
  const a = food.ayurveda || {};
  const n = food.nutritionPerServing || {};
  return (
    <div className="bg-muted/40 rounded-lg p-3 text-sm text-text-secondary space-y-0.5">
      <div className="font-semibold text-primary mb-1">{food.name}</div>
      <div><span className="font-medium">Category: </span>{food.category}</div>
      <div><span className="font-medium">Rasa: </span>{(a.rasa || []).map((r) => `${r} (${RASA_EN[r] || r})`).join(', ')}</div>
      <div><span className="font-medium">Guna: </span>{(a.guna || []).join(', ')}</div>
      <div><span className="font-medium">Virya: </span>{a.virya ? viryaText(a.virya) : ''}</div>
      {n.caloriesKcal != null && (
        <div className="text-xs pt-1">
          {n.caloriesKcal} kcal per {food.serving?.description || 'serving'}
        </div>
      )}
    </div>
  );
};

const FoodCompatibilityTool = () => {
  const { foods, loading, error } = useFoodLibrary();
  const [food1, setFood1] = useState('');
  const [food2, setFood2] = useState('');
  const [result, setResult] = useState(null);

  const options = useMemo(
    () =>
      [...foods]
        .sort((x, y) => x.name.localeCompare(y.name))
        .map((f) => ({ value: f.id, label: f.name, description: f.category })),
    [foods]
  );
  const byId = (id) => foods.find((f) => f.id === id) || null;
  const selectedA = byId(food1);
  const selectedB = byId(food2);

  const pick = (setter) => (v) => {
    setter(v);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-text-secondary">
        <Icon name="Loader2" size={18} className="animate-spin" />
        Loading the food library
      </div>
    );
  }
  if (error) {
    return <p className="rounded-lg border border-error/30 bg-error/5 p-4 text-sm text-error">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Select
          label="First food"
          options={options}
          value={food1}
          onChange={pick(setFood1)}
          placeholder="Search the food library"
          searchable
        />
        <Select
          label="Second food"
          options={options}
          value={food2}
          onChange={pick(setFood2)}
          placeholder="Search the food library"
          searchable
        />
      </div>

      <div className="text-center">
        <Button
          onClick={() => setResult(evaluateCompatibility(selectedA, selectedB))}
          disabled={!selectedA || !selectedB || food1 === food2}
          iconName="Search"
          iconPosition="left"
        >
          Check compatibility
        </Button>
      </div>

      {selectedA && selectedB && (
        <div className="grid sm:grid-cols-2 gap-4">
          <FoodFacts food={selectedA} />
          <FoodFacts food={selectedB} />
        </div>
      )}

      {result && (
        <div
          className={`p-6 rounded-xl border-2 ${
            result.level === 'good'
              ? 'bg-success/10 border-success/30'
              : result.level === 'caution'
              ? 'bg-warning/10 border-warning/30'
              : 'bg-error/10 border-error/30'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <Icon
              name={result.level === 'avoid' ? 'AlertTriangle' : result.level === 'caution' ? 'AlertCircle' : 'CheckCircle'}
              size={24}
              className={result.level === 'avoid' ? 'text-error' : result.level === 'caution' ? 'text-warning' : 'text-success'}
            />
            <h4 className="text-lg font-semibold text-primary">{result.summary}</h4>
          </div>

          {result.reasons.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 text-text-secondary mb-3">
              {result.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}

          {(result.raises.length > 0 || result.calms.length > 0) && (
            <p className="text-sm text-text-secondary mb-3">
              Taken together, by the library's dosha effects, this pair
              {result.raises.length > 0 && <> tends to raise <strong className="text-text-primary">{result.raises.join(', ')}</strong></>}
              {result.raises.length > 0 && result.calms.length > 0 && ' and'}
              {result.calms.length > 0 && <> tends to calm <strong className="text-text-primary">{result.calms.join(', ')}</strong></>}.
            </p>
          )}

          <div className="bg-background/60 p-3 rounded-lg text-sm">
            <span className="font-medium text-primary">Suggestion: </span>
            <span className="text-text-secondary">{result.recommendation}</span>
          </div>

          <p className="text-xs text-text-secondary mt-3">
            General guidance from classical Ayurvedic rules and the food library's data. Individual
            needs vary, so follow your practitioner's advice.
          </p>
        </div>
      )}
    </div>
  );
};

// ---------- SEASONAL WELLNESS (DYNAMIC) ----------

export const getSeasonalGuidance = (season, dosha = 'vata') => {
  const guidance = {
    spring: {
      vata: {
        focus: 'Detoxification and lightening Kapha',
        foods: [
          'Light, warm vegetable soups',
          'Bitter greens (methi, mustard leaves)',
          'Spices like turmeric, ginger, black pepper',
          'Warm water with lemon and honey (if suitable)'
        ],
        avoid: [
          'Deep-fried snacks',
          'Cold dairy desserts',
          'Heavy sweets',
          'Refrigerated foods'
        ],
        lifestyle: [
          'Early morning brisk walk or yoga',
          'Dry brushing to stimulate lymph',
          'Gentle pranayama and meditation'
        ]
      }
    },
    summer: {
      vata: {
        focus: 'Cooling, hydration and protecting Pitta',
        foods: [
          'Sweet juicy fruits (watermelon, grapes, pomegranate)',
          'Coconut water',
          'Cucumber, mint, coriander chutneys',
          'Ghee in small amounts instead of very spicy oils'
        ],
        avoid: [
          'Very spicy, oily foods',
          'Alcohol and excess caffeine',
          'Eating in direct sun',
          'Skipping hydration'
        ],
        lifestyle: [
          'Avoid midday sun; choose morning/evening exercise',
          'Light cotton clothing',
          'Cooling pranayama (sheetali / sheetkari)'
        ]
      }
    },
    autumn: {
      vata: {
        focus: 'Grounding and calming mobile Vata',
        foods: [
          'Warm, moist foods like kichdi',
          'Root veggies with ghee or sesame oil',
          'Stewed fruits instead of raw',
          'Spices like cumin, fennel, ginger'
        ],
        avoid: [
          'Cold salads from the fridge',
          'Dry snacks (chips, popcorn in excess)',
          'Skipping meals',
          'Irregular sleep routine'
        ],
        lifestyle: [
          'Regular routine for meals and sleep',
          'Oil abhyanga with warm sesame oil',
          'Slow, grounding yoga and walks'
        ]
      }
    },
    winter: {
      vata: {
        focus: 'Nourishing and maintaining warmth',
        foods: [
          'Warm soups and stews',
          'Ghee in moderation with grains',
          'Nuts and seeds (almonds, sesame)',
          'Spices like black pepper, ginger, cinnamon'
        ],
        avoid: [
          'Cold drinks and ice-cream',
          'Raw, uncooked foods in excess',
          'Long fasting periods'
        ],
        lifestyle: [
          'Daily oil massage before a warm bath',
          'Regular moderate exercise',
          'Adequate sunlight exposure when possible'
        ]
      }
    }
  };

  return (
    (guidance[season] && guidance[season][dosha]) || {
      focus: 'Seasonal balance',
      foods: ['Seasonal, local foods', 'Warm, cooked meals'],
      avoid: ['Ultra-processed foods', 'Excessive cold or raw foods'],
      lifestyle: ['Regular routine', 'Adequate rest', 'Daily gentle movement']
    }
  );
};

// ---------- MAIN COMPONENTS ----------

const InteractiveTools = () => {
  const [activeTab, setActiveTab] = useState('compatibility');
  const [assessmentStep, setAssessmentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState({});

  const tools = [
    {
      id: 'compatibility',
      name: 'Food Compatibility Calculator',
      icon: 'Calculator',
      description: 'Compare two foods using Ayurvedic rules and modern nutrition.'
    },
    {
      id: 'seasonal',
      name: 'Seasonal Wellness Guide',
      icon: 'Calendar',
      description: 'Get tailored guidance based on the current season.'
    },
    {
      id: 'assessment',
      name: 'Constitutional Assessment',
      icon: 'User',
      description: 'Quick dosha-oriented lifestyle assessment.'
    }
  ];

  // ---------- TOOL 2: SEASONAL WELLNESS GUIDE ----------

  const SeasonalWellnessTool = () => {
    const [selectedSeason, setSelectedSeason] = useState('');
    const [guidance, setGuidance] = useState(null);

    const handleGetGuidance = () => {
      if (selectedSeason) {
        const result = getSeasonalGuidance(selectedSeason);
        setGuidance(result);
      }
    };

    return (
      <div className="space-y-6">
        <Select
          label="Current Season"
          options={seasonOptions}
          value={selectedSeason}
          onChange={setSelectedSeason}
          placeholder="Select current season"
          className="border-b border-border bg-transparent focus:outline-none focus:border-primary"
        />
        <div className="text-center">
          <Button
            onClick={handleGetGuidance}
            disabled={!selectedSeason}
            iconName="Compass"
            iconPosition="left"
          >
            Get Seasonal Guidance
          </Button>
        </div>
        {guidance && (
          <div className="bg-muted rounded-xl p-6 border border-brand-gold/20">
            <h4 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <Icon name="Target" size={20} className="mr-2" />
              {guidance.focus}
            </h4>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-success mb-2 flex items-center">
                  <Icon name="Plus" size={16} className="mr-1" />
                  Recommended Foods
                </h5>
                <div className="space-y-1">
                  {guidance.foods?.map((food, index) => (
                    <div
                      key={index}
                      className="text-sm text-text-secondary bg-success/10 px-2 py-1 rounded"
                    >
                      {food}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-error mb-2 flex items-center">
                  <Icon name="Minus" size={16} className="mr-1" />
                  Foods to Avoid
                </h5>
                <div className="space-y-1">
                  {guidance.avoid?.map((food, index) => (
                    <div
                      key={index}
                      className="text-sm text-text-secondary bg-error/10 px-2 py-1 rounded"
                    >
                      {food}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="font-medium text-primary mb-2 flex items-center">
                <Icon name="Heart" size={16} className="mr-1" />
                Lifestyle Recommendations
              </h5>
              <div className="flex flex-wrap gap-2">
                {guidance.lifestyle?.map((tip, index) => (
                  <span
                    key={index}
                    className="text-sm bg-brand-sage/20 text-primary px-3 py-1 rounded-md"
                  >
                    {tip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ---------- TOOL 3: CONSTITUTIONAL ASSESSMENT ----------

  const ConstitutionalAssessment = () => {
    const questions = [
      {
        id: 'body_frame',
        question: 'How would you describe your body frame?',
        options: [
          { value: 'vata', label: 'Thin, light, small-boned' },
          { value: 'pitta', label: 'Medium, well-proportioned' },
          { value: 'kapha', label: 'Large, heavy, big-boned' }
        ]
      },
      {
        id: 'appetite',
        question: 'How is your appetite typically?',
        options: [
          { value: 'vata', label: 'Variable, sometimes forget to eat' },
          { value: 'pitta', label: 'Strong, get irritable when hungry' },
          { value: 'kapha', label: 'Steady, can skip meals easily' }
        ]
      },
      {
        id: 'sleep',
        question: 'How would you describe your sleep pattern?',
        options: [
          { value: 'vata', label: 'Light sleeper, wake up easily' },
          { value: 'pitta', label: 'Moderate sleep, wake up refreshed' },
          { value: 'kapha', label: 'Deep sleeper, hard to wake up' }
        ]
      }
    ];

    const handleAnswer = (questionId, answer) => {
      setAssessmentData((prev) => ({
        ...prev,
        [questionId]: answer
      }));
    };

    const calculateResult = () => {
      const scores = { vata: 0, pitta: 0, kapha: 0 };
      Object.values(assessmentData).forEach((answer) => {
        scores[answer] = (scores[answer] || 0) + 1;
      });

      return Object.keys(scores).reduce((a, b) =>
        scores[a] > scores[b] ? a : b
      );
    };

    const getResult = () => {
      const result = calculateResult();
      const descriptions = {
        vata: {
          name: 'Vata Constitution',
          traits:
            'Creative, energetic, quick-thinking but prone to anxiety and irregularity when imbalanced.',
          recommendations:
            'Focus on warm, grounding foods, regular routines, oil massage, and adequate rest.'
        },
        pitta: {
          name: 'Pitta Constitution',
          traits:
            'Organized, focused, strong digestion but prone to irritability and acidity when imbalanced.',
          recommendations:
            'Choose cooling foods, avoid excessive heat/spice, prioritize relaxation and time in nature.'
        },
        kapha: {
          name: 'Kapha Constitution',
          traits:
            'Calm, stable, strong immunity but prone to sluggishness and weight gain when imbalanced.',
          recommendations:
            'Prefer light, spicy foods, regular vigorous exercise, and avoid oversleeping or overeating.'
        }
      };

      return descriptions[result];
    };

    if (assessmentStep > questions.length) {
      const result = getResult();
      return (
        <div className="text-center space-y-6">
          <div className="bg-muted rounded-xl p-8 border border-brand-gold/20">
            <Icon name="Award" size={48} className="text-brand-gold mx-auto mb-4" />
            <h4 className="text-2xl font-display font-semibold text-primary mb-3">
              {result?.name}
            </h4>
            <p className="text-text-secondary mb-4">{result?.traits}</p>
            <div className="bg-background/50 p-4 rounded-lg">
              <span className="font-medium text-primary">Lifestyle focus: </span>
              <span className="text-text-secondary">
                {result?.recommendations}
              </span>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => {
                setAssessmentStep(1);
                setAssessmentData({});
              }}
              variant="outline"
              iconName="RotateCcw"
              iconPosition="left"
            >
              Retake Assessment
            </Button>
            <Button
              iconName="Download"
              iconPosition="left"
              onClick={() => {
                const text = `${result?.name}\n\n${result?.traits}\n\nLifestyle focus: ${result?.recommendations}\n\nA short screening result from AyurNutri, not a clinical assessment.\n`;
                const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
                const a = document.createElement('a');
                a.href = url;
                a.download = 'ayurnutri-dosha-summary.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download Summary
            </Button>
          </div>
        </div>
      );
    }

    const currentQuestion = questions[assessmentStep - 1];

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="flex justify-center space-x-2 mb-4">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < assessmentStep ? 'bg-brand-gold' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-text-secondary">
            Question {assessmentStep} of {questions.length}
          </p>
        </div>
        <div className="bg-background rounded-xl p-6 organic-shadow">
          <h4 className="text-lg font-semibold text-primary mb-4">
            {currentQuestion.question}
          </h4>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  handleAnswer(currentQuestion.id, option.value);
                  setAssessmentStep((prev) => prev + 1);
                }}
                className="w-full text-left p-4 rounded-lg border border-border hover:border-brand-sage hover:bg-brand-sage/5 organic-transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full border-2 border-brand-sage" />
                  <span className="text-text-secondary">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ---------- MAIN RENDER ----------

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'compatibility':
        return <FoodCompatibilityTool />;
      case 'seasonal':
        return <SeasonalWellnessTool />;
      case 'assessment':
        return <ConstitutionalAssessment />;
      default:
        return <FoodCompatibilityTool />;
    }
  };

  return (
    <div className="bg-background rounded-2xl organic-shadow">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-display font-semibold text-primary mb-3">
          Interactive Learning Tools
        </h2>
        <p className="text-text-secondary">
          Experience Ayurvedic principles through hands-on tools that blend traditional
          wisdom with modern nutrition science.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className={`flex items-center space-x-3 px-6 py-4 border-b-2 organic-transition whitespace-nowrap ${
                activeTab === tool.id
                  ? 'border-brand-gold text-primary bg-brand-gold/5'
                  : 'border-transparent text-text-secondary hover:text-primary hover:bg-muted/30'
              }`}
            >
              <Icon name={tool.icon} size={18} />
              <div className="text-left">
                <div className="font-medium">{tool.name}</div>
                <div className="text-xs opacity-70">{tool.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">{renderActiveTab()}</div>
    </div>
  );
};

// Default export used by index.jsx
export default InteractiveTools;
