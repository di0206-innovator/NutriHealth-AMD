export default function OnboardingStep({ step, onSelect, disabled }) {
  return (
    <div className="onboarding-step fade-in-up">
      <h2 className="step-title">{step.title}</h2>
      <p className="step-subtitle">{step.subtitle}</p>
      
      <div className="step-options" role="listbox" aria-label={step.title}>
        {step.options.map(opt => (
          <button
            key={opt.value}
            className="option-btn glass-panel"
            onClick={() => onSelect(opt.value)}
            disabled={disabled}
            role="option"
            aria-selected="false"
          >
            <span className="option-icon" aria-hidden="true">{opt.icon}</span>
            <span className="option-label">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
