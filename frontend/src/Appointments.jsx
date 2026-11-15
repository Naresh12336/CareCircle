
import { useState } from 'react'
import { CalendarDays, Clock, MapPin, Plus, Trash2, Video } from 'lucide-react'

export default function Appointments() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Ananya Sharma',
      specialty: 'General Physician',
      date: '2026-11-18',
      time: '10:30',
      location: 'City Care Hospital',
      type: 'In-person',
    },
  ])

  const [form, setForm] = useState({
    doctor: '',
    specialty: '',
    date: '',
    time: '',
    location: '',
    type: 'In-person',
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function addAppointment(e) {
    e.preventDefault()

    setAppointments([
      ...appointments,
      { ...form, id: Date.now() },
    ])

    setForm({
      doctor: '',
      specialty: '',
      date: '',
      time: '',
      location: '',
      type: 'In-person',
    })
  }

  function cancelAppointment(id) {
    setAppointments(appointments.filter(a => a.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Appointments</h2>
        <p className="text-gray-500 mt-1">
          Organize upcoming doctor consultations.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        Demo appointments are stored in browser memory only.
        They are not saved to the healthcare database.
      </div>

      <form onSubmit={addAppointment}
        className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
          <Plus className="text-emerald-700" />
          Schedule Appointment
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            ['doctor', 'Doctor Name'],
            ['specialty', 'Specialization'],
            ['location', 'Hospital / Clinic'],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-2">
                {label}
              </label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-2">
              Appointment Date
            </label>
            <input
              type="date"
              name="date"
              min={new Date().toISOString().split('T')[0]}
              value={form.date}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Appointment Time
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Consultation Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option>In-person</option>
              <option>Online</option>
            </select>
          </div>
        </div>

        <button className="mt-5 bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold">
          Save Appointment
        </button>
      </form>

      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-5">
          Upcoming Appointments ({appointments.length})
        </h3>

        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments scheduled.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map(a => (
              <div key={a.id}
                className="border rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h4 className="font-bold text-lg">{a.doctor}</h4>
                  <p className="text-emerald-700 text-sm">{a.specialty}</p>

                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} /> {a.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={16} /> {a.time}
                    </p>
                    <p className="flex items-center gap-2">
                      {a.type === 'Online' ? <Video size={16} /> : <MapPin size={16} />}
                      {a.location} · {a.type}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => cancelAppointment(a.id)}
                  className="self-start flex items-center gap-2 text-red-600 border border-red-200 rounded-lg px-3 py-2 text-sm"
                >
                  <Trash2 size={16} /> Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
