import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { readRoleProfile } from './profileStorage';
import { roleProfileConfig } from './roleProfileConfig';

function initialsFromProfile(profile) {
  const first = profile?.firstName?.[0] || 'U';
  const last = profile?.lastName?.[0] || '';
  return `${first}${last}`.toUpperCase();
}

export default function ProfileLayout({
  children,
  title = 'Profile',
  basePath = '/profile',
  roleKey,
  tabs,
}) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : {};
        const key = roleKey || user.role || 'client';
        const currentProfile = readRoleProfile(key) || null;
        setProfile(currentProfile);
      } catch (err) {
        setProfile(null);
      }
    };
    load();
  }, [roleKey]);

  const roleTabs = useMemo(() => {
    if (tabs?.length) return tabs;

    const defaultTabs = [
      { to: `${basePath}`, label: 'Profile' },
      { to: `${basePath}/edit`, label: 'Edit Profile' },
      { to: `${basePath}/messages`, label: 'Messages' },
      { to: `${basePath}/finance`, label: 'Finance' },
      { to: `${basePath.replace(/\/profile$/, '') || basePath}`, label: 'Dashboard' },
    ];

    return defaultTabs;
  }, [basePath, tabs]);

  const roleMeta = roleKey ? roleProfileConfig[roleKey] : null;
  const displayName = profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : 'Your Profile';

  return (
    <div className="min-h-screen bg-gray-50 py-3">
      <div className="w-full px-3 sm:px-4 lg:px-5">
        <div className="flex flex-col gap-4 lg:flex-row">
          <aside className="w-full rounded-lg bg-white p-5 shadow lg:w-64">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 font-bold text-white text-xl">
                {initialsFromProfile(profile)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
                <p className="text-sm text-gray-500">{profile?.company || profile?.company_name || roleMeta?.roleLabel || 'Profile information'}</p>
              </div>
            </div>

            <nav className="mt-6 space-y-1">
              {roleTabs.map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.to === basePath}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-6">
              <NavLink to={`${basePath}/edit`} className="block w-full rounded-md bg-indigo-600 px-4 py-2 text-center text-white">
                Edit profile
              </NavLink>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="rounded-lg bg-white p-5 shadow">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <div className="mt-4">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
