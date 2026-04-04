import React from "react";
import { Link } from "react-router-dom";

function IconWrapper({ children, className = "" }) {
  return (
    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${className}`}>
      {children}
    </span>
  );
}

const icons = {
  alert: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  refresh: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2v6h-6" />
      <path d="M3 11a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 13a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  ),
  plus: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  chart: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  card: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  list: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  bullet: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
};

function iconForLabel(label) {
  const value = (label || "").toLowerCase();
  if (value.includes("publish") || value.includes("performance") || value.includes("throughput")) return icons.chart;
  if (value.includes("review") || value.includes("queue") || value.includes("approval")) return icons.list;
  if (value.includes("message")) return icons.list;
  if (value.includes("active") || value.includes("online") || value.includes("team") || value.includes("editor")) return icons.list;
  return icons.card;
}

function StatCard({ title, value, note }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{title}</div>
        <IconWrapper className="bg-blue-50 text-blue-600">
          {iconForLabel(title)}
        </IconWrapper>
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
      <p className="mt-2 text-sm text-slate-500">{note}</p>
    </div>
  );
}

function SideCard({ id, title, items, emptyText }) {
  return (
    <div id={id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
        <IconWrapper className="h-7 w-7 bg-slate-100 text-slate-600">{iconForLabel(title)}</IconWrapper>
        <span>{title}</span>
      </h3>
      {items?.length ? (
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
              <span className="text-slate-400">{icons.bullet}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-500">{emptyText}</p>
      )}
    </div>
  );
}

function TrendChart() {
  return (
    <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="grid h-52 grid-rows-5 gap-3">
        {[...Array(5)].map((_, row) => (
          <div key={`row-${row}`} className="border-b border-dashed border-slate-200" />
        ))}
      </div>
      <div className="relative -mt-40 h-40 w-full">
        <div className="absolute bottom-10 left-[5%] h-1 w-[18%] rounded-full bg-blue-400" />
        <div className="absolute bottom-16 left-[22%] h-1 w-[18%] rounded-full bg-blue-500" />
        <div className="absolute bottom-12 left-[39%] h-1 w-[18%] rounded-full bg-blue-500" />
        <div className="absolute bottom-20 left-[56%] h-1 w-[18%] rounded-full bg-blue-600" />
        <div className="absolute bottom-26 left-[73%] h-1 w-[18%] rounded-full bg-blue-700" />
      </div>
      <div className="mt-3 flex justify-between text-xs text-slate-400">
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
        <span>Week 4</span>
        <span>Week 5</span>
      </div>
    </div>
  );
}

export default function RoleDashboardView({
  portalLabel,
  headline,
  subtitle,
  primaryAction,
  secondaryAction,
  stats,
  mainSection,
  sideSections,
  activitySection,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <span className="text-amber-700">{icons.alert}</span>
        <span>Some dashboard widgets failed to load. Showing the data we could retrieve.</span>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{portalLabel}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{headline}</h1>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          </div>
          <div className="flex gap-3">
            <Link
              to={secondaryAction.to}
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <span className="mr-2">{icons.refresh}</span>
              {secondaryAction.label}
            </Link>
            <Link
              to={primaryAction.to}
              className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <span className="mr-2">{icons.plus}</span>
              {primaryAction.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <div id={mainSection.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <IconWrapper className="bg-blue-50 text-blue-600">{icons.chart}</IconWrapper>
            <span>{mainSection.title}</span>
          </h3>
          <p className="mt-1 text-sm text-slate-500">{mainSection.subtitle}</p>
          <TrendChart />
        </div>

        <div className="space-y-4">
          {sideSections.map((section) => (
            <SideCard key={section.id} {...section} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <IconWrapper className="bg-slate-100 text-slate-600">{icons.list}</IconWrapper>
          <span>{activitySection.title}</span>
        </h3>
        {activitySection.items?.length ? (
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {activitySection.items.map((item) => (
              <li key={item} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                <span className="text-blue-500">{icons.bullet}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500">{activitySection.emptyText}</p>
        )}
      </section>
    </div>
  );
}
