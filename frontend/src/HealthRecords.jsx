
import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Activity, Heart, Droplets, Wind, Plus } from 'lucide-react'

const initialReadings = [
  { date: 'Nov 11', glucose: 112, systolic: 126, diastolic: 82, heartRate: 76, spo2: 98 },
  { date: 'Nov 12', glucose: 124, systolic: 130, diastolic: 84, heartRate: 78, spo2: 97 },
  { date: 'Nov 13', glucose: 108, systolic: 122, diastolic: 80, heartRate: 74, spo2: 98 },
  { date: 'Nov 14', glucose: 118, systolic: 128, diastolic: 82, heartRate: 77, spo2: 98 },
  { date: 'Nov 15', glucose: 115, systolic: 124, diastolic: 80, heartRate: 75, spo2: 99 },
]

export default function HealthRecords() {
  const [readings, setReadings] = useState(initialReadings)
  const [form, setForm] = useState({
    glucose: '',
    systolic: '',
    diastolic: '',
    heartRate: '',
    spo2: '',
  })

  const latest = readings[readings.length - 1]

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function addReading(e) {
    e.preventDefault()

    const newReading = {
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      }),
      glucose: Number(form.glucose),
      systolic: Number(form.systolic),
      diastolic: Number(form.diastolic),
      heartRate: Number(form.heartRate),
      spo2: Number(form.spo2),
    }

    setReadings([...readings, newReading])
    setForm({
      glucose: '',
      systolic: '',
      diastolic: '',
      heartRate: '',
      spo2: '',
    })
  }

  const metrics = [
    {
      title: 'Blood Glucose',
      value: latest.glucose,
      unit: 'mg/dL',
      icon: Droplets,
    },
    {
      title: 'Blood Pressure',
      value: `${latest.systolic}/${latest.diastolic}`,
      unit: 'mmHg',
      icon: Heart,
    },
    {
      title: 'Heart Rate',
      value: latest.heartRate,
      unit: 'BPM',
      icon: Activity,
    },
    {
      title: 'Oxygen Saturation',
      value: latest.spo2,
      unit: '%',
      icon: Wind,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Health Records</h2>
        <p className="text-gray-500 mt-1">
          Track and review health measurements.
        </p>
      </div>

      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
        Demo data: readings entered here are stored only in this browser
        session and are not verified medical records.
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.title} className="bg-white rounded-xl p-5 shadow-sm">
              <Icon className="text-emerald-700 mb-3" size={25} />
              <p className="text-gray-500 text-sm">{metric.title}</p>
              <p className="text-2xl font-bold mt-1">
                {metric.value}{' '}
                <span className="text-sm font-normal text-gray-500">
                  {metric.unit}
                </span>
              </p>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-5">Glucose History</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={readings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="glucose"
                stroke="#047857"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-5">Blood Pressure History</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={readings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="systolic"
                name="Systolic"
                stroke="#047857"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="diastolic"
                name="Diastolic"
                stroke="#0ea5e9"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <form onSubmit={addReading} className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Plus className="text-emerald-700" />
          <h3 className="font-bold text-lg">Add Health Reading</h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ['glucose', 'Blood Glucose (mg/dL)'],
            ['systolic', 'Systolic BP (mmHg)'],
            ['diastolic', 'Diastolic BP (mmHg)'],
            ['heartRate', 'Heart Rate (BPM)'],
            ['spo2', 'SpO₂ (%)'],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-2">
                {label}
              </label>
              <input
                name={name}
                type="number"
                min="1"
                max={name === 'spo2' ? 100 : undefined}
                required
                value={form[name]}
                onChange={updateField}
                className="w-full border rounded-lg p-3"
                placeholder={`Enter ${label}`}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-5 bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800"
        >
          Save Reading
        </button>
      </form>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Recent Measurements</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Glucose</th>
                <th className="p-3">Blood Pressure</th>
                <th className="p-3">Heart Rate</th>
                <th className="p-3">SpO₂</th>
              </tr>
            </thead>
            <tbody>
              {[...readings].reverse().map((r, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">{r.glucose} mg/dL</td>
                  <td className="p-3">{r.systolic}/{r.diastolic}</td>
                  <td className="p-3">{r.heartRate} BPM</td>
                  <td className="p-3">{r.spo2}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
