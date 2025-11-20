import React from 'react';
import Button from '../../../components/ui/Button';

/**
 * NavbarPatient - reproduces the top navbar from screenshots:
 * - centered nav links: Dashboard / Food Scan / Analytics / Sessions / Messages
 * - logout button on the right
 * - cream background and subtle shadow
 *
 * Props:
 *  - active: string (one of 'dashboard','food-scan','analytics','sessions','messages')
 *  - onNavigate: function(id)
 *  - logoUrl: optional string path to logo
 */

const NavbarPatient = ({
  active = 'dashboard',
  onNavigate = () => {},
  logoUrl = '/logo.png',
}) => {
  const nav = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'food-scan', label: 'Food Scan' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'messages', label: 'Messages' },
  ];

  return (
    <header className="bg-cream border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="AyurNutri"
              className="h-8 w-auto object-contain"
            />
          </div>

          {/* Middle: nav links */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex items-center gap-8">
              {nav.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => onNavigate(n.id)}
                    className={`text-sm font-medium transition-colors ${
                      active === n.id
                        ? 'text-emerald-800'
                        : 'text-emerald-600 hover:text-emerald-800'
                    }`}
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: logout */}
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="sm"
              className="bg-emerald-800 hover:bg-emerald-900 text-white"
              onClick={() => {
                /* TODO: implement logout */
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarPatient;
