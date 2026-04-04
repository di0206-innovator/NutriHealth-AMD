import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VitalityRing from '../VitalityRing';

// Snippet 22: Frontend component tests with vitest
describe('VitalityRing', () => {
  it('displays the correct value and unit', () => {
    render(<VitalityRing value="450" unit="kcal" progress={0.5} label="Consumed" />);
    expect(screen.getByText('450')).toBeTruthy();
    expect(screen.getByText('kcal')).toBeTruthy();
    expect(screen.getByText('Consumed')).toBeTruthy();
  });

  it('renders the circular progress track', () => {
    const { container } = render(<VitalityRing value="450" progress={0.5} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2); // One for track, one for progress
  });
});
