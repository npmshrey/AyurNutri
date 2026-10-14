// Practice analytics, worked out in the browser from the practitioner's own
// records: GET /api/patients (each patient carries its weekly plans and the
// items the patient has ticked off) and GET /api/appointments/doctor/:id.
// Nothing on this page is estimated or filled in; when there is no data the
// section says so.
import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import useAuth from '../../../hooks/useAuth';
import { api, errorMessage } from '../../../lib/api';

const DOSHA_GROUPS = [
  { key: 'Vata', color: 'var(--dosha-vata)' },
  { key: 'Pitta', color: 'var(--dosha-pitta)' },
  { key: 'Kapha', color: 'var(--dosha-kapha)' },
  { key: 'Two doshas', color: 'var(--color-text-secondary)' },
  { key: 'Not recorded', color: 'var(--color-border)' },
];

const APPOINTMENT_STATUSES = ['Scheduled', 'Accepted', 'Completed', 'Rejected'];

const doshaGroup = (value) => {
  const v = String(value || '').toLowerCase();
  const found = ['vata', 'pitta', 'kapha'].filter((d) => v.includes(d));
  if (found.length === 0) return 'Not recorded';
  if (found.length > 1) return 'Two doshas';
  return found[0][0].toUpperCase() + found[0].slice(1);
};

/** Ticked items / planned items across every day of every weekly plan. */
const planTally = (plans = []) => {
  let done = 0;
  let total = 0;
  plans.forEach((plan) =>
    (plan.days || []).forEach((day) => {
      const items = [
        ...(day.meals?.breakfast || []),
        ...(day.meals?.lunch || []),
        ...(day.meals?.dinner || []),
        ...(day.exercises || []),
      ];
      total += items.length;
      done += items.filter((i) => i.checked).length;
    })
  );
  return { done, total };
};

const pct = (done, total) => (total ? Math.round((done / total) * 100) : null);

const lastSixMonths = () => {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: d.toLocaleString('en-IN', { month: 'short' }),
      patients: 0,
    };
  });
};

const csvCell = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const Panel = ({ title, note, children }) => (
  <div className="bg-card rounded-lg border border-border">
    <div className="p-4 border-b border-border">
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {note && <p className="text-xs text-text-secondary mt-0.5">{note}</p>}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const Empty = ({ children }) => (
  <p className="text-sm text-text-secondary py-6 text-center">{children}</p>
);

const AnalyticsSuite = () => {
  const { user } = useAuth();
  const doctorId = user?._id || user?.id;

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!doctorId) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([api.get('/api/patients'), api.get(`/api/appointments/doctor/${doctorId}`)])
      .then(([p, a]) => {
        if (cancelled) return;
        setPatients(Array.isArray(p.data) ? p.data : []);
        setAppointments(a.data?.appointments || []);
      })
      .catch((err) => !cancelled && setError(errorMessage(err, "Couldn't load your practice data.")))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [doctorId]);

  const stats = useMemo(() => {
    const rows = patients.map((p) => {
      const tally = planTally(p.weeklyPlans);
      return { patient: p, plans: (p.weeklyPlans || []).length, ...tally, completion: pct(tally.done, tally.total) };
    });

    const allDone = rows.reduce((s, r) => s + r.done, 0);
    const allTotal = rows.reduce((s, r) => s + r.total, 0);

    const months = lastSixMonths();
    patients.forEach((p) => {
      if (!p.createdAt) return;
      const d = new Date(p.createdAt);
      const m = months.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
      if (m) m.patients += 1;
    });

    const dosha = DOSHA_GROUPS.map((g) => ({
      ...g,
      count: patients.filter((p) => doshaGroup(p.dosha) === g.key).length,
    }));

    const conditionMap = new Map();
    patients.forEach((p) => {
      const c = String(p.condition || '').trim();
      if (!c) return;
      const k = c.toLowerCase();
      const prev = conditionMap.get(k);
      conditionMap.set(k, { label: prev?.label || c, count: (prev?.count || 0) + 1 });
    });
    const conditions = [...conditionMap.values()].sort((a, b) => b.count - a.count).slice(0, 6);

    const apptCounts = APPOINTMENT_STATUSES.map((s) => ({
      status: s,
      count: appointments.filter((a) => a.status === s).length,
    }));

    return {
      rows,
      withPlans: rows.filter((r) => r.plans > 0).length,
      planCount: rows.reduce((s, r) => s + r.plans, 0),
      completion: pct(allDone, allTotal),
      allDone,
      allTotal,
      months,
      dosha,
      conditions,
      apptCounts,
    };
  }, [patients, appointments]);

  const exportCsv = () => {
    const header = ['Name', 'Age', 'Dosha', 'Condition', 'Status', 'Weekly plans', 'Items done', 'Items planned', 'Completion %', 'Added on'];
    const lines = stats.rows.map(({ patient: p, plans, done, total, completion }) =>
      [
        p.name,
        p.age,
        p.dosha,
        p.condition,
        p.status,
        plans,
        done,
        total,
        completion ?? '',
        p.createdAt ? new Date(p.createdAt).toISOString().slice(0, 10) : '',
      ]
        .map(csvCell)
        .join(',')
    );
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ayurnutri-patients-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-text-secondary py-16 justify-center">
        <Icon name="Loader2" size={18} className="animate-spin" />
        Loading your practice data
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-error/30 bg-error/5 p-4 text-sm text-error">{error}</div>
    );
  }

  const tiles = [
    {
      label: 'Patients',
      value: patients.length,
      note: `${stats.withPlans} with at least one weekly plan`,
    },
    {
      label: 'Weekly plans',
      value: stats.planCount,
      note: 'Across all your patients',
    },
    {
      label: 'Plan items completed',
      value: stats.completion === null ? 'None yet' : `${stats.completion}%`,
      note: stats.allTotal ? `${stats.allDone} of ${stats.allTotal} meals and exercises ticked off` : 'No plan items to track yet',
    },
    {
      label: 'Appointment requests',
      value: appointments.length,
      note: `${stats.apptCounts[0].count} waiting for your reply`,
    },
  ];

  const maxDosha = Math.max(1, ...stats.dosha.map((d) => d.count));
  const maxAppt = Math.max(1, ...stats.apptCounts.map((a) => a.count));
  const planRows = stats.rows
    .filter((r) => r.total > 0)
    .sort((a, b) => (b.completion ?? 0) - (a.completion ?? 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-primary">Practice analytics</h2>
          <p className="text-text-secondary">Worked out from your patient records and appointments.</p>
        </div>
        <Button variant="outline" iconName="Download" onClick={exportCsv} disabled={!patients.length}>
          Export patients (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((t) => (
          <div key={t.label} className="bg-card rounded-lg p-4 border border-border">
            <h3 className="text-sm font-medium text-text-secondary">{t.label}</h3>
            <p className="text-2xl font-bold text-text-primary mt-1">{t.value}</p>
            <p className="text-xs text-text-secondary mt-1">{t.note}</p>
          </div>
        ))}
      </div>

      {patients.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <Icon name="Users" size={28} className="mx-auto text-text-secondary" />
          <p className="mt-3 font-medium text-text-primary">No patients yet</p>
          <p className="mt-1 text-sm text-text-secondary">
            Charts appear here once you add patients from the Patients section.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Panel title="New patients" note="Patients added in each of the last six months">
              <div className="w-full h-64" role="img" aria-label="Bar chart of patients added per month">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.months} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--color-text-secondary)" tickLine={false} />
                    <YAxis allowDecimals={false} stroke="var(--color-text-secondary)" tickLine={false} />
                    <Tooltip
                      cursor={{ fill: 'var(--color-muted)' }}
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        color: 'var(--color-text-primary)',
                      }}
                    />
                    <Bar dataKey="patients" name="Patients added" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Dosha mix" note="Primary dosha recorded on each patient's profile">
              <ul className="space-y-3">
                {stats.dosha.map((d) => (
                  <li key={d.key} className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-3 text-sm">
                    <span className="flex items-center gap-2 text-text-primary">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                      {d.key}
                    </span>
                    <span className="h-2.5 rounded-sm bg-muted overflow-hidden">
                      <span
                        className="block h-full rounded-sm"
                        style={{ width: `${(d.count / maxDosha) * 100}%`, backgroundColor: d.color }}
                      />
                    </span>
                    <span className="text-right font-medium text-text-primary tabular-nums">{d.count}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Appointment requests" note="By current status">
              {appointments.length === 0 ? (
                <Empty>No appointment requests yet.</Empty>
              ) : (
                <ul className="space-y-3">
                  {stats.apptCounts.map((a) => (
                    <li key={a.status} className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-3 text-sm">
                      <span className="text-text-primary">{a.status === 'Scheduled' ? 'Awaiting reply' : a.status}</span>
                      <span className="h-2.5 rounded-sm bg-muted overflow-hidden">
                        <span
                          className="block h-full rounded-sm bg-primary"
                          style={{ width: `${(a.count / maxAppt) * 100}%` }}
                        />
                      </span>
                      <span className="text-right font-medium text-text-primary tabular-nums">{a.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Conditions" note="Most common conditions recorded on patient profiles">
              {stats.conditions.length === 0 ? (
                <Empty>No conditions recorded yet.</Empty>
              ) : (
                <ul className="divide-y divide-border">
                  {stats.conditions.map((c) => (
                    <li key={c.label} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-text-primary">{c.label}</span>
                      <span className="text-text-secondary tabular-nums">
                        {c.count} {c.count === 1 ? 'patient' : 'patients'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>

          <Panel title="Plan follow-through" note="Share of planned meals and exercises each patient has ticked off">
            {planRows.length === 0 ? (
              <Empty>None of your patients has a weekly plan with items yet.</Empty>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-text-secondary border-b border-border">
                      <th className="py-2 pr-4 font-medium">Patient</th>
                      <th className="py-2 pr-4 font-medium">Plans</th>
                      <th className="py-2 pr-4 font-medium">Items done</th>
                      <th className="py-2 font-medium w-1/3">Completion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {planRows.map((r) => (
                      <tr key={r.patient._id}>
                        <td className="py-2 pr-4 text-text-primary">{r.patient.name}</td>
                        <td className="py-2 pr-4 tabular-nums">{r.plans}</td>
                        <td className="py-2 pr-4 tabular-nums">
                          {r.done} / {r.total}
                        </td>
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <span className="h-2 flex-1 rounded-sm bg-muted overflow-hidden">
                              <span className="block h-full bg-primary" style={{ width: `${r.completion}%` }} />
                            </span>
                            <span className="w-10 text-right tabular-nums text-text-primary">{r.completion}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </>
      )}
    </div>
  );
};

export default AnalyticsSuite;
