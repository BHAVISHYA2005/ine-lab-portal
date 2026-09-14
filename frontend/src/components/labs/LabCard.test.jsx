import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LabCard from './LabCard.jsx';

const lab = {
  id: 2,
  title: 'Containerize a Web Service',
  category: 'docker',
  difficulty: 'intermediate',
  description: 'Package a service into a reproducible container.',
};

describe('LabCard', () => {
  it('renders lab metadata and a detail link', () => {
    render(<MemoryRouter><LabCard lab={lab} /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: lab.title })).toBeInTheDocument();
    expect(screen.getByText('docker')).toBeInTheDocument();
    expect(screen.getByText('intermediate')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open lab/i })).toHaveAttribute('href', '/labs/2');
  });
});
