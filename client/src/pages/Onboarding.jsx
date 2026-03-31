import { useState } from 'react';
import { saveUserProfile } from '../firebase';
import OnboardingStep from '../components/OnboardingStep';

const STEPS = [
  {
    id: 'goal',
    title: 'What is your main health goal?',
    subtitle: 'We personalise every food analysis based on this.',
    options: [
      { value: 'weight_loss', label: 'Lose weight', icon: '↓' },
      { value: 'muscle_gain', label: 'Build muscle', icon: '↑' },
      { value: 'energy', label: 'Boost energy', icon: '◎' },
      { value: 'gut_health', label: 'Gut health', icon: '○' },
      { value: 'general', label: 'General wellness', icon: '◇' },
    ]
  },
  {
    id: 'restriction',
    title: 'Any dietary restrictions?',
    subtitle: 'Suggestions will always respect your diet.',
    options: [
      { value: 'none', label: 'None', icon: '—' },
      { value: 'vegetarian', label: 'Vegetarian', icon: '◉' },
      { value: 'vegan', label: 'Vegan', icon: '◈' },
      { value: 'diabetic', label: 'Diabetic', icon: '△' },
      { value: 'lactose_free', label: 'Lactose-free', icon: '◌' },
    ]
  },
  {
    id: 'activity_level',
    title: 'How active are you?',
    subtitle: 'Helps us calibrate your calorie context.',
    options: [
      { value: 'sedentary', label: 'Mostly seated', icon: '▷' },
      { value: 'moderate', label: 'Moderately active', icon: '▶' },
      { value: 'active', label: 'Very active', icon: '▸' },
    ]
  }
];

export default function Onboarding({ user, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);

  const handleSelect = async (value) => {
    const step = STEPS[currentStep];
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setSaving(true);
      try {
        await saveUserProfile(user.uid, newAnswers);
        onComplete(newAnswers);
      } catch {
        setSaving(false);
      }
    }
  };

  const step = STEPS[currentStep];

  return (
    <main className="onboarding" role="main">
      <div className="onboarding-header">
        <div className="onboarding-logo" aria-hidden="true">NL</div>
        <h1 className="onboarding-title">NutriLens</h1>
        <p className="onboarding-subtitle">Personalised nutrition intelligence</p>
      </div>

      <div className="step-dots" role="progressbar" 
           aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={STEPS.length}
           aria-label={`Step ${currentStep + 1} of ${STEPS.length}`}>
        {STEPS.map((_, i) => (
          <span key={i} className={`dot ${i === currentStep ? 'active' : i < currentStep ? 'done' : ''}`} />
        ))}
      </div>

      <OnboardingStep
        step={step}
        onSelect={handleSelect}
        disabled={saving}
      />
    </main>
  );
}
