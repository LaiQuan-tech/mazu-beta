import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BeadCurtainMenu } from './BeadCurtainMenu';

describe('BeadCurtainMenu', () => {
  it('renders the primary navigation labels', () => {
    render(<BeadCurtainMenu activeSection="home" onMenuItemClick={vi.fn()} />);

    expect(screen.getByRole('button', { name: '首頁' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '會員中心' })).toBeTruthy();
  });

  it('reports the requested section when a bead is clicked', () => {
    const onMenuItemClick = vi.fn();
    render(<BeadCurtainMenu activeSection="home" onMenuItemClick={onMenuItemClick} />);

    fireEvent.click(screen.getByRole('button', { name: '預約問事' }));

    expect(onMenuItemClick).toHaveBeenCalledWith('booking');
  });

  it('marks the active section for assistive technology', () => {
    render(<BeadCurtainMenu activeSection="lamps" onMenuItemClick={vi.fn()} />);

    expect(screen.getByRole('button', { name: '光明點燈' }).getAttribute('aria-current')).toBe('page');
  });
});
