
import { useEffect, useState } from 'react'
import {
  Heart, LayoutDashboard, Pill, Activity,
  CalendarDays, LogOut, Plus, CheckCircle2,
  Clock, AlertCircle
} from 'lucide-react'
import HealthRecords from './HealthRecords'
import Appointments from './Appointments'
import api from './api'

export default function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [medications, setMedications] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('dashboard')

  async function loadDashboard() {
    const [userResponse, profileResponse, medicationResponse] =
      await Promise.all([
        api.get('/auth/me'),
        api.get('/care-profiles/me'),
        api.get('/medications'),
      ])

    setUser(userResponse.data)
    setProfile(profileResponse.data)
    setMedications(medicationResponse.data)
  }

  useEffect(() => {
    if (localStorage.getItem('carecircle_token')) {
      loadDashboard().catch(() => {
        localStorage.removeItem('carecircle_token')
      })
    }
  }, [])

  async function login(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      localStorage.setItem(
        'carecircle_token',
        response.data.access_token
      )

      await loadDashboard()
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Unable to login.'
      )
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('carecircle_token')
    setUser(null)
    setProfile(null)
    setMedications([])
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <form
          onSubmit={login}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
        >
          <div className="flex items-center gap-3 text-emerald-700">
            <Heart size={36} />
            <h1 className="text-3xl font-bold">CareCircle</h1>
          </div>

          <p className="text-gray-500">
            Your health, supported by the people who care.
          </p>

          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-emerald-700 text-white p-3 rounded-lg font-semibold"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </main>
    )
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'health', label: 'Health Records', icon: Activity },
    { id: 'appointments', label: 'Appointments', icon: CalendarDays },
  ]

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-2 text-emerald-700 mb-10">
          <Heart size={28} />
          <span className="text-2xl font-bold">CareCircle</span>
        </div>

        <nav className="space-y-2">
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${
                  tab === item.id
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <button
          onClick={logout}
          className="mt-auto flex items-center gap-3 p-3 text-gray-500"
        >
          <LogOut size={20} /> Sign out
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-gray-500">CareCircle / {tab}</p>
            <h1 className="text-3xl font-bold mt-1">
              {tab === 'dashboard'
                ? 'Your Health Dashboard'
                : navItems.find(n => n.id === tab)?.label}
            </h1>
          </div>
          <div className="text-right">
            <p className="font-semibold">{user.full_name}</p>
            <p className="text-sm text-gray-500 capitalize">
              {user.role}
            </p>
          </div>
        </header>

        {tab === 'dashboard' && (
          <>
            <section className="bg-emerald-800 text-white rounded-2xl p-8 mb-8">
              <p className="text-emerald-100">Welcome back,</p>
              <h2 className="text-3xl font-bold mt-2">
                {user.full_name}
              </h2>
              <p className="mt-3 text-emerald-100">
                Your care information in one place.
              </p>
            </section>

            <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              <StatCard
                icon={Pill}
                title="Medications"
                value={medications.length}
                description="Registered medications"
              />
              <StatCard
                icon={Activity}
                title="Care Profile"
                value={profile ? 'Active' : 'Not created'}
                description="Personal health information"
              />
              <StatCard
                icon={CalendarDays}
                title="Appointments"
                value="0"
                description="Upcoming appointments"
              />
            </section>

            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-5">
                Your Medications
              </h2>

              {medications.length === 0 ? (
                <p className="text-gray-500">
                  No medications have been added yet.
                </p>
              ) : (
                medications.map(med => (
                  <div
                    key={med.id}
                    className="border-b py-4 flex justify-between"
                  >
                    <div>
                      <p className="font-semibold">{med.name}</p>
                      <p className="text-sm text-gray-500">
                        {med.dosage} · {med.frequency}
                      </p>
                    </div>
                    <Pill className="text-emerald-700" />
                  </div>
                ))
              )}
            </section>
          </>
        )}

        {tab === 'medications' && (
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-5">
              Medication Management
            </h2>

            {medications.length === 0 ? (
              <p className="text-gray-500">No medications found.</p>
            ) : (
              medications.map(med => (
                <div
                  key={med.id}
                  className="border rounded-lg p-4 mb-3"
                >
                  <h3 className="font-bold">{med.name}</h3>
                  <p className="text-gray-500">
                    {med.dosage} · {med.frequency}
                  </p>
                  <p className="text-sm mt-2">
                    {med.instructions || 'No additional instructions'}
                  </p>
                </div>
              ))
            )}
          </section>
        )}

        {tab === 'health' && <HealthRecords />}

        {tab === 'appointments' && <Appointments />}
      </main>
    </div>
  )
}

function StatCard({ icon: Icon, title, value, description }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <Icon className="text-emerald-700 mb-4" size={26} />
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  )
}
