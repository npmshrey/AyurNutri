// Patient progress, worked out from the patient's own records:
// GET /api/patient/overview (clinical records with weekly plans and the items
// the patient has ticked) and GET /api/quiz/history/:id (dosha assessments).
// When there is nothing recorded yet the section says so instead of guessing.
import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import useAuth from '../../../hooks/useAuth';
import { api, errorMessage } from '../../../lib/api';

const tooltipStyle = {
  backgroundColor: 'var(--color-card)',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  color: 'var(--color-text-primary)',
};

const caloriesOf = (item) => {
  const f = item?.food || {};
  const kcal = f.nutritionPerServing?.caloriesKcal ?? f.calories ?? f.kcal;
  return typeof kcal === 'number' ? kcal : null;
};

const dayItems = (day) => [
  ...(day?.meals?.breakfast || []),
  ...(day?.meals?.lunch || []),
  ...(day?.meals?.dinner || []),
];

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const Panel = ({ title, note, children }) => (
  <div className="bg-card rounded-lg border border-border">
    <div className="p-4 border-b border-border">
      <h3 className="font-semibold text-text-primary">{title}</h3>
      {note && <p className="text-xs text-text-secondary mt-0.5">{note}</p>}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const Empty = ({ children }) => <p className="text-sm text-text-secondary py-6 text-center">{children}</p>;

const DOSHAS = [
  { key: 'vata', label: 'Vata', color: 'var(--dosha-vata)' },
  { key: 'pitta', label: 'Pitta', color: 'var(--dosha-pitta)' },
  { key: 'kapha', label: 'Kapha', color: 'var(--dosha-kapha)' },
];

const Analytics = () => {
  const { user } = useAuth();
  const patientId = user?._id || user?.id;

  const [records, setRecords] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!patientId) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([api.get('/api/patient/overview'), api.get(`/api/quiz/history/${patientId}`)])
      .then(([o, q]) => {
        if (cancelled) return;
        setRecords(o.data?.appointments || []);
        setHistory(q.data?.history || []);
      })
      .catch((err) => !cancelled && setError(errorMessage(err, "Couldn't load your progress.")))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  const data = useMemo(() => {
    const plans = records
      .flatMap((r) => r.weeklyPlans || [])
      .sort((a, b) => new Date(b.weekStartDate) - new Date(a.weekStartDate));

    let done = 0;
    let total = 0;
    plans.forEach((p) =>
      (p.days || []).forEach((d) => {
        const items = [...dayItems(d), ...(d.exercises || [])];
        total += items.length;
        done += items.filter((i) => i.checked).length;
      })
    );

    const latest = plans[0] || null;
    const days = (latest?.days || []).map((d, i) => {
      const items = [...dayItems(d), ...(d.exercises || [])];
      const meals = dayItems(d);
      const planned = meals.map(caloriesOf).filter((k) => k !== null);
      const eaten = meals.filter((m) => m.checked).map(caloriesOf).filter((k) => k !== null);
      return {
        day: d.date
          ? new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
          : `Day ${i + 1}`,
        completion: items.length ? Math.round((items.filter((x) => x.checked).length / items.length) * 100) : 0,
        planned: planned.length ? Math.round(planned.reduce((s, k) => s + k, 0)) : 0,
        eaten: eaten.length ? Math.round(eaten.reduce((s, k) => s + k, 0)) : 0,
        hasCalories: planned.length > 0,
      };
    });

    const assessments = [...history]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((h) => ({
        date: new Date(h.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        vata: h.result?.vata ?? 0,
        pitta: h.result?.pitta ?? 0,
        kapha: h.result?.kapha ?? 0,
        primary: h.result?.primaryDosha,
        createdAt: h.createdAt,
      }));

    return {
      plans,
      latest,
      days,
      showCalories: days.some((d) => d.hasCalories),
      done,
      total,
      completion: total ? Math.round((done / total) * 100) : null,
      assessments,
      lastAssessment: assessments[assessments.length - 1] || null,
    };
  }, [records, history]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-text-secondary py-16 justify-center">
        <Icon name="Loader2" size={18} className="animate-spin" />
        Loading your progress
      </div>
    );
  }

  if (error) {
    return <div className="rounded-lg border border-error/30 bg-error/5 p-4 text-sm text-error">{error}</div>;
  }

  const tiles = [
    { label: 'Weekly plans', value: data.plans.length, note: 'Shared with you by your practitioner' },
    {
      label: 'Plan items completed',
      value: data.completion === null ? 'None yet' : `${data.completion}%`,
      note: data.total ? `${data.done} of ${data.total} meals and exercises ticked off` : 'No plan items yet',
    },
    {
      label: 'Latest dosha result',
      value: data.lastAssessment?.primary || 'Not taken',
      note: data.lastAssessment ? `Assessment on ${formatDate(data.lastAssessment.createdAt)}` : 'Take the dosha assessment from your dashboard',
    },
    { label: 'Assessments taken', value: data.assessments.length, note: 'Dosha questionnaires you have completed' },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-primary">Your progress</h2>
        <p className="text-text-secondary mt-1">Based on your weekly plans and dosha assessments.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel
          title="This plan, day by day"
          note={data.latest ? `${data.latest.title}, starting ${formatDate(data.latest.weekStartDate)}` : undefined}
        >
          {data.days.length === 0 ? (
            <Empty>Your practitioner hasn't shared a weekly plan yet.</Empty>
          ) : (
            <div className="w-full h-64" role="img" aria-label="Bar chart of the share of plan items completed each day">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.days} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-text-secondary)" tickLine={false} fontSize={12} />
                  <YAxis domain={[0, 100]} unit="%" stroke="var(--color-text-secondary)" tickLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: 'var(--color-muted)' }} contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Completed']} />
                  <Bar dataKey="completion" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>

        <Panel title="Calories: planned and eaten" note="Per standard serving, from foods in this plan you have ticked off">
          {!data.showCalories ? (
            <Empty>No calorie information for the foods in your current plan.</Empty>
          ) : (
            <div className="w-full h-64" role="img" aria-label="Bar chart comparing planned and eaten calories each day">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.days} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-text-secondary)" tickLine={false} fontSize={12} />
                  <YAxis stroke="var(--color-text-secondary)" tickLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: 'var(--color-muted)' }} contentStyle={tooltipStyle} formatter={(v) => `${v} kcal`} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="planned" name="Planned" fill="var(--color-border)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="eaten" name="Eaten" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Panel>
      </div>

      <Panel title="Dosha assessments" note="Scores from each questionnaire you have taken">
        {data.assessments.length === 0 ? (
          <Empty>You haven't taken the dosha assessment yet.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-secondary border-b border-border">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  {DOSHAS.map((d) => (
                    <th key={d.key} className="py-2 pr-4 font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                        {d.label}
                      </span>
                    </th>
                  ))}
                  <th className="py-2 font-medium">Primary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...data.assessments].reverse().map((a) => (
                  <tr key={a.createdAt}>
                    <td className="py-2 pr-4 text-text-primary">{formatDate(a.createdAt)}</td>
                    {DOSHAS.map((d) => (
                      <td key={d.key} className="py-2 pr-4 tabular-nums">{a[d.key]}</td>
                    ))}
                    <td className="py-2 font-medium text-text-primary">{a.primary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </section>
  );
};

export default Analytics;
