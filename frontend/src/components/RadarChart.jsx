import { Radar, RadarChart as RChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts'

export default function RadarChart({ models }) {
  const data = models.map(model => ({
    model: model.name.split(' ').slice(0, 2).join(' '),
    Fake: +(model.fake_prob * 100).toFixed(1),
    Real: +(model.real_prob * 100).toFixed(1),
  }))

  return (
    <div className="glass-card p-6">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Confidence Radar
      </h4>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="model"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#64748B', fontSize: 10 }}
            />
            <Radar
              name="Fake %"
              dataKey="Fake"
              stroke="#F87171"
              fill="#F87171"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar
              name="Real %"
              dataKey="Real"
              stroke="#34D399"
              fill="#34D399"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#94A3B8' }}
            />
          </RChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
