import { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowRight, ArrowUpRight,
  Bell, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft,
  ChevronRight, CircleHelp, Clock3, Copy, Download, Ellipsis, Filter,
  LayoutDashboard, ListFilter, Menu, MoreHorizontal, Plus, Search,
  Settings2, SlidersHorizontal, Sparkles, Users, X,
} from 'lucide-react';

const STORAGE = {
  appointments: 'abs-appointments-v1',
  customers: 'abs-customers-v1',
  schedule: 'abs-schedule-v1',
};

const seedCustomers = [
  { id: 'c1', name: 'Sofia Reyes', email: 'sofia.reyes@email.com', phone: '+63 917 234 9182', bookings: 12, lastVisit: 'Nov 3, 2026', spent: 18600, initials: 'SR', tone: 'lilac' },
  { id: 'c2', name: 'Mateo Santos', email: 'mateo.santos@email.com', phone: '+63 905 827 4410', bookings: 8, lastVisit: 'Nov 1, 2026', spent: 12400, initials: 'MS', tone: 'peach' },
  { id: 'c3', name: 'Isabella Cruz', email: 'isabella.cruz@email.com', phone: '+63 917 381 2054', bookings: 6, lastVisit: 'Oct 28, 2026', spent: 9100, initials: 'IC', tone: 'mint' },
  { id: 'c4', name: 'Lucas Garcia', email: 'lucas.garcia@email.com', phone: '+63 998 462 5177', bookings: 4, lastVisit: 'Oct 26, 2026', spent: 6400, initials: 'LG', tone: 'blue' },
  { id: 'c5', name: 'Amara Flores', email: 'amara.flores@email.com', phone: '+63 917 004 6261', bookings: 3, lastVisit: 'Oct 22, 2026', spent: 4800, initials: 'AF', tone: 'rose' },
  { id: 'c6', name: 'Enzo Mendoza', email: 'enzo.mendoza@email.com', phone: '+63 927 114 3902', bookings: 2, lastVisit: 'Oct 19, 2026', spent: 3200, initials: 'EM', tone: 'gold' },
  { id: 'c7', name: 'Lila Navarro', email: 'lila.navarro@email.com', phone: '+63 917 642 1108', bookings: 1, lastVisit: 'Oct 15, 2026', spent: 1600, initials: 'LN', tone: 'lilac' },
];

const seedAppointments = [
  { id: 'a1', customerId: 'c1', customer: 'Sofia Reyes', service: 'Signature facial', date: '2026-11-05', time: '09:00', duration: 60, status: 'Confirmed', color: 'violet', price: 2800, staff: 'Olivia Chen' },
  { id: 'a2', customerId: 'c2', customer: 'Mateo Santos', service: 'Consultation', date: '2026-11-05', time: '10:00', duration: 30, status: 'Checked in', color: 'blue', price: 0, staff: 'Olivia Chen' },
  { id: 'a3', customerId: 'c3', customer: 'Isabella Cruz', service: 'Deep tissue massage', date: '2026-11-05', time: '11:00', duration: 90, status: 'Confirmed', color: 'peach', price: 3500, staff: 'Mia Torres' },
  { id: 'a4', customerId: 'c4', customer: 'Lucas Garcia', service: 'Classic manicure', date: '2026-11-05', time: '13:00', duration: 60, status: 'Confirmed', color: 'mint', price: 1200, staff: 'Olivia Chen' },
  { id: 'a5', customerId: 'c5', customer: 'Amara Flores', service: 'Signature facial', date: '2026-11-05', time: '14:30', duration: 60, status: 'Pending', color: 'rose', price: 2800, staff: 'Mia Torres' },
  { id: 'a6', customerId: 'c6', customer: 'Enzo Mendoza', service: 'Haircut & styling', date: '2026-11-05', time: '16:00', duration: 60, status: 'Confirmed', color: 'blue', price: 1800, staff: 'Olivia Chen' },
  { id: 'a7', customerId: 'c7', customer: 'Lila Navarro', service: 'Brow shaping', date: '2026-11-06', time: '10:00', duration: 30, status: 'Confirmed', color: 'violet', price: 800, staff: 'Mia Torres' },
  { id: 'a8', customerId: 'c1', customer: 'Sofia Reyes', service: 'Classic manicure', date: '2026-11-06', time: '13:00', duration: 60, status: 'Confirmed', color: 'mint', price: 1200, staff: 'Olivia Chen' },
  { id: 'a9', customerId: 'c3', customer: 'Isabella Cruz', service: 'Deep tissue massage', date: '2026-11-07', time: '09:30', duration: 90, status: 'Pending', color: 'peach', price: 3500, staff: 'Mia Torres' },
  { id: 'a10', customerId: 'c4', customer: 'Lucas Garcia', service: 'Haircut & styling', date: '2026-11-09', time: '11:00', duration: 60, status: 'Confirmed', color: 'blue', price: 1800, staff: 'Olivia Chen' },
  { id: 'a11', customerId: 'c2', customer: 'Mateo Santos', service: 'Signature facial', date: '2026-11-10', time: '14:00', duration: 60, status: 'Confirmed', color: 'violet', price: 2800, staff: 'Mia Torres' },
];

const defaultSchedule = [
  { day: 'Monday', short: 'Mon', enabled: true, start: '09:00', end: '17:00' },
  { day: 'Tuesday', short: 'Tue', enabled: true, start: '09:00', end: '17:00' },
  { day: 'Wednesday', short: 'Wed', enabled: true, start: '09:00', end: '17:00' },
  { day: 'Thursday', short: 'Thu', enabled: true, start: '09:00', end: '17:00' },
  { day: 'Friday', short: 'Fri', enabled: true, start: '09:00', end: '17:00' },
  { day: 'Saturday', short: 'Sat', enabled: true, start: '10:00', end: '15:00' },
  { day: 'Sunday', short: 'Sun', enabled: false, start: '10:00', end: '15:00' },
];

const services = [
  { name: 'Signature facial', duration: 60, price: 2800, color: 'violet' },
  { name: 'Deep tissue massage', duration: 90, price: 3500, color: 'peach' },
  { name: 'Classic manicure', duration: 60, price: 1200, color: 'mint' },
  { name: 'Haircut & styling', duration: 60, price: 1800, color: 'blue' },
  { name: 'Brow shaping', duration: 30, price: 800, color: 'rose' },
  { name: 'Consultation', duration: 30, price: 0, color: 'blue' },
];

const readStored = (key, fallback) => {
  try {
    const saved = window.localStorage.getItem(key);
    if (!saved) return fallback;
    const value = JSON.parse(saved);
    return Array.isArray(fallback) && !Array.isArray(value) ? fallback : value;
  } catch {
    return fallback;
  }
};
const writeStored = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not save ${key} in this browser:`, error);
  }
};

const dateAtNoon = (value) => new Date(`${value}T12:00:00`);
const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const addDays = (date, amount) => { const next = new Date(date); next.setDate(next.getDate() + amount); return next; };
const money = (value) => `₱${Number(value || 0).toLocaleString('en-PH')}`;
const fmtTime = (value) => {
  const [hour, minute] = value.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${period}`;
};
const initials = (name = '') => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

function App() {
  const [appointments, setAppointments] = useState(() => readStored(STORAGE.appointments, seedAppointments));
  const [customers, setCustomers] = useState(() => readStored(STORAGE.customers, seedCustomers));
  const [schedule, setSchedule] = useState(() => readStored(STORAGE.schedule, defaultSchedule));
  const [view, setView] = useState('Overview');
  const [selectedDate, setSelectedDate] = useState(() => dateAtNoon('2026-11-05'));
  const [calendarMode, setCalendarMode] = useState('Week');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceDuration, setServiceDuration] = useState(60);
  const [bufferTime, setBufferTime] = useState(15);

  useEffect(() => { writeStored(STORAGE.appointments, appointments); }, [appointments]);
  useEffect(() => { writeStored(STORAGE.customers, customers); }, [customers]);
  useEffect(() => { writeStored(STORAGE.schedule, schedule); }, [schedule]);
  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(''), 2800);
    return () => clearTimeout(id);
  }, [toast]);

  const weekStart = useMemo(() => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d;
  }, [selectedDate]);
  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)), [weekStart]);
  const visibleAppointments = useMemo(() => appointments.filter((item) => {
    const matchesSearch = `${item.customer} ${item.service} ${item.staff}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [appointments, search, statusFilter]);
  const todayKey = '2026-11-05';
  const todayAppointments = appointments.filter((item) => item.date === todayKey).sort((a, b) => a.time.localeCompare(b.time));
  const formattedRange = `${weekDates[0].toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} – ${weekDates[6].toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const showToast = (message) => setToast(message);
  const shiftCalendar = (direction) => setSelectedDate((date) => {
    const next = new Date(date);
    if (calendarMode === 'Month') next.setMonth(next.getMonth() + direction);
    else next.setDate(next.getDate() + (calendarMode === 'Day' ? direction : direction * 7));
    return next;
  });
  const addAppointment = (entry) => {
    const service = services.find((item) => item.name === entry.service) || services[0];
    const existing = customers.find((customer) => customer.email.toLowerCase() === entry.email.toLowerCase());
    let customer = existing;
    if (!customer) {
      customer = {
        id: `c${Date.now()}`, name: entry.customer, email: entry.email, phone: entry.phone || '—',
        bookings: 0, lastVisit: 'New customer', spent: 0, initials: initials(entry.customer), tone: 'lilac',
      };
      setCustomers((items) => [customer, ...items]);
    }
    setAppointments((items) => [{
      id: `a${Date.now()}`, customerId: customer.id, customer: customer.name, service: service.name,
      date: entry.date, time: entry.time, duration: service.duration, status: entry.status,
      color: service.color, price: service.price, staff: entry.staff,
    }, ...items]);
    setCustomers((items) => items.map((item) => item.id === customer.id ? { ...item, bookings: item.bookings + 1 } : item));
    setModal(null);
    showToast('Appointment added to your calendar');
  };
  const addCustomer = (entry) => {
    const customer = {
      id: `c${Date.now()}`, ...entry, bookings: 0, lastVisit: 'New customer', spent: 0,
      initials: initials(entry.name), tone: ['lilac', 'peach', 'mint', 'blue', 'rose'][customers.length % 5],
    };
    setCustomers((items) => [customer, ...items]);
    setModal(null);
    showToast('Customer account created');
  };
  const changeStatus = (id, status) => {
    setAppointments((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    showToast(`Appointment marked ${status.toLowerCase()}`);
  };
  const exportCustomers = () => {
    const rows = [['Name', 'Email', 'Phone', 'Bookings', 'Lifetime spend'], ...customers.map((c) => [c.name, c.email, c.phone, c.bookings, c.spent])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = 'customers.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Customer list exported');
  };

  return (
    <div className="app-shell">
      {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><CalendarDays size={19} strokeWidth={2.5} /></div><span>daylight<span className="brand-dot">.</span></span></div>
        <div className="workspace-switcher">
          <div className="workspace-logo">S</div><div className="workspace-info"><strong>Solace Studio</strong><span>Appointment system</span></div><ChevronDown size={15} />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          <NavItem icon={LayoutDashboard} label="Overview" active={view === 'Overview'} onClick={() => { setView('Overview'); setMobileNav(false); }} />
          <NavItem icon={CalendarDays} label="Calendar" active={view === 'Calendar'} onClick={() => { setView('Calendar'); setMobileNav(false); }} />
          <NavItem icon={ListFilter} label="Appointments" count={appointments.length} active={view === 'Appointments'} onClick={() => { setView('Appointments'); setMobileNav(false); }} />
          <NavItem icon={Users} label="Customers" active={view === 'Customers'} onClick={() => { setView('Customers'); setMobileNav(false); }} />
        </nav>
        <div className="nav-label nav-label-spaced">MANAGE</div>
        <nav className="main-nav">
          <NavItem icon={SlidersHorizontal} label="Availability" active={view === 'Availability'} onClick={() => { setView('Availability'); setMobileNav(false); }} />
          <NavItem icon={Settings2} label="Services" active={view === 'Services'} onClick={() => { setView('Services'); setMobileNav(false); }} />
        </nav>
        <div className="sidebar-spacer" />
        <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={16} /></div><strong>Make every day count</strong><p>Share your booking link and let clients book around the clock.</p><button onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/book`); showToast('Booking link copied'); }}>Copy booking link <ArrowUpRight size={14} /></button></div>
        <button className="profile-button" onClick={() => showToast('Profile settings are up to date')}><div className="avatar avatar-profile">OC</div><span className="profile-details"><strong>Olivia Chen</strong><small>Studio owner</small></span><MoreHorizontal size={18} /></button>
      </aside>

      <main className="main-area">
        <header className="topbar"><button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setMobileNav(true)}><Menu size={19} /></button><div className="breadcrumb">Workspace <ChevronRight size={14} /> <strong>{view}</strong></div><div className="topbar-actions"><button className="help-link" onClick={() => showToast('Help center is coming soon')}><CircleHelp size={16} /> Help center</button><span className="topbar-divider" /><button className="icon-button notification-button" aria-label="Notifications" onClick={() => showToast('You’re all caught up')}><Bell size={18} /><i /></button><div className="avatar avatar-small">OC</div></div></header>
        <div className="page-content">
          {view === 'Overview' && <OverviewPage
            appointments={todayAppointments} allAppointments={appointments} customers={customers} selectedDate={selectedDate}
            weekDates={weekDates} formattedRange={formattedRange} calendarMode={calendarMode} setCalendarMode={setCalendarMode}
            setSelectedDate={setSelectedDate} shiftCalendar={shiftCalendar} onNew={() => setModal({ type: 'appointment' })}
            onViewCalendar={() => setView('Calendar')} onViewCustomers={() => setView('Customers')}
          />}
          {view === 'Calendar' && <CalendarPage appointments={visibleAppointments} selectedDate={selectedDate} setSelectedDate={setSelectedDate} weekDates={weekDates} formattedRange={formattedRange} calendarMode={calendarMode} setCalendarMode={setCalendarMode} shiftCalendar={shiftCalendar} onNew={() => setModal({ type: 'appointment' })} />}
          {view === 'Appointments' && <AppointmentsPage appointments={visibleAppointments} search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onNew={() => setModal({ type: 'appointment' })} onStatus={changeStatus} />}
          {view === 'Customers' && <CustomersPage customers={customers} search={search} setSearch={setSearch} onNew={() => setModal({ type: 'customer' })} onExport={exportCustomers} />}
          {view === 'Availability' && <AvailabilityPage schedule={schedule} setSchedule={setSchedule} serviceDuration={serviceDuration} setServiceDuration={setServiceDuration} bufferTime={bufferTime} setBufferTime={setBufferTime} onSave={() => showToast('Availability settings saved')} />}
          {view === 'Services' && <ServicesPage onToast={showToast} />}
        </div>
      </main>
      {modal && <Modal onClose={() => setModal(null)}><FormModal type={modal.type} onAppointment={addAppointment} onCustomer={addCustomer} customers={customers} selectedDate={selectedDate} /></Modal>}
      {toast && <div className="toast"><CheckCircle2 size={17} />{toast}</div>}
    </div>
  );
}

function NavItem({ icon: Icon, label, active, count, onClick }) {
  return <button className={`nav-item ${active ? 'nav-active' : ''}`} onClick={onClick}><Icon size={18} strokeWidth={active ? 2.15 : 1.8} /><span>{label}</span>{count && <small>{count}</small>}</button>;
}

function PageHeading({ eyebrow, title, subtitle, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div>;
}

function OverviewPage({ appointments, allAppointments, customers, selectedDate, weekDates, formattedRange, calendarMode, setCalendarMode, setSelectedDate, shiftCalendar, onNew, onViewCalendar, onViewCustomers }) {
  const revenue = appointments.filter((item) => item.status !== 'Pending' && item.status !== 'Cancelled').reduce((sum, item) => sum + item.price, 0);
  return <>
    <PageHeading eyebrow="THURSDAY, NOVEMBER 5, 2026" title="Good morning, Olivia" subtitle="Here’s what’s happening at your studio today." action={<button className="button button-primary" onClick={onNew}><Plus size={17} /> New appointment</button>} />
    <div className="stat-grid">
      <StatCard label="Appointments today" value={appointments.length} change="2 more than yesterday" direction="up" icon={CalendarDays} iconTone="sage" />
      <StatCard label="Confirmed" value={appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Checked in').length} change="Looking good" direction="steady" icon={CheckCircle2} iconTone="lavender" />
      <StatCard label="New customers" value="8" change="This week" direction="up" icon={Users} iconTone="peach" />
      <StatCard label="Today’s revenue" value={money(revenue)} change="12% above average" direction="up" icon={Activity} iconTone="blue" />
    </div>
    <div className="dashboard-grid">
      <section className="panel calendar-panel">
        <div className="panel-heading"><div><div className="panel-title">Your calendar</div><div className="muted-caption">A little overview of your week</div></div><button className="text-button" onClick={onViewCalendar}>Full calendar <ArrowRight size={15} /></button></div>
        <CalendarWidget appointments={allAppointments} selectedDate={selectedDate} setSelectedDate={setSelectedDate} weekDates={weekDates} formattedRange={formattedRange} calendarMode={calendarMode} setCalendarMode={setCalendarMode} shiftCalendar={shiftCalendar} />
      </section>
      <section className="panel today-panel">
        <div className="panel-heading"><div><div className="panel-title">Today’s appointments</div><div className="muted-caption">Thursday, November 5</div></div><button className="icon-button quiet-button" aria-label="More appointment options"><Ellipsis size={20} /></button></div>
        <div className="today-list">{appointments.map((item, index) => <AppointmentRow key={item.id} appointment={item} last={index === appointments.length - 1} compact />)}{!appointments.length && <EmptyState title="No bookings today" text="Your free time is all yours." />}</div>
        <button className="today-footer" onClick={onViewCalendar}>View all appointments <ArrowRight size={15} /></button>
      </section>
    </div>
    <div className="bottom-grid">
      <section className="panel service-performance"><div className="panel-heading"><div><div className="panel-title">Popular services</div><div className="muted-caption">What your clients are booking</div></div><button className="icon-button quiet-button" aria-label="More services"><Ellipsis size={20} /></button></div>
        <div className="service-bars"><ServiceBar name="Signature facial" bookings={34} percent={84} color="bar-violet" /><ServiceBar name="Deep tissue massage" bookings={26} percent={67} color="bar-blue" /><ServiceBar name="Classic manicure" bookings={19} percent={48} color="bar-peach" /><ServiceBar name="Haircut & styling" bookings={14} percent={36} color="bar-mint" /></div>
      </section>
      <section className="panel customers-panel"><div className="panel-heading"><div><div className="panel-title">Lovely regulars</div><div className="muted-caption">Your most loyal clients</div></div><button className="text-button" onClick={onViewCustomers}>All customers <ArrowRight size={15} /></button></div>
        <div className="regular-list">{customers.slice(0, 4).map((customer) => <div className="regular-row" key={customer.id}><Avatar customer={customer} /><span className="regular-name">{customer.name}<small>{customer.bookings} visits</small></span><strong>{money(customer.spent)}</strong></div>)}</div>
      </section>
    </div>
  </>;
}

function StatCard({ label, value, change, direction, icon: Icon, iconTone }) {
  return <div className="stat-card"><div className={`stat-icon ${iconTone}`}><Icon size={18} /></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong></div><div className={`stat-change ${direction === 'steady' ? 'change-steady' : ''}`}><ArrowUpRight size={13} /> {change}</div></div>;
}

function CalendarWidget({ appointments, selectedDate, setSelectedDate, weekDates, formattedRange, calendarMode, setCalendarMode, shiftCalendar }) {
  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1, 12);
  const monthGridStart = addDays(monthStart, -((monthStart.getDay() + 6) % 7));
  const monthDates = Array.from({ length: 42 }, (_, index) => addDays(monthGridStart, index));
  const displayedRange = calendarMode === 'Month'
    ? selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : calendarMode === 'Day'
      ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : formattedRange;
  return <>
    <div className="calendar-toolbar"><div className="date-nav"><button className="icon-button" onClick={() => shiftCalendar(-1)} aria-label="Previous date range"><ChevronLeft size={17} /></button><button className="icon-button" onClick={() => setSelectedDate(dateAtNoon('2026-11-05'))} aria-label="Go to today"><CalendarDays size={16} /></button><button className="icon-button" onClick={() => shiftCalendar(1)} aria-label="Next date range"><ChevronRight size={17} /></button><strong>{displayedRange}</strong></div><div className="segmented"><button className={calendarMode === 'Week' ? 'segment-active' : ''} onClick={() => setCalendarMode('Week')}>Week</button><button className={calendarMode === 'Day' ? 'segment-active' : ''} onClick={() => setCalendarMode('Day')}>Day</button></div></div>
    {calendarMode === 'Month' ? <div className="month-calendar"><div className="month-weekdays">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day}>{day}</span>)}</div><div className="month-days">{monthDates.map((date) => {
      const key = dateKey(date);
      const dayItems = appointments.filter((item) => item.date === key);
      return <button key={key} className={`month-day ${date.getMonth() !== selectedDate.getMonth() ? 'month-day-outside' : ''} ${key === '2026-11-05' ? 'month-day-today' : ''}`} onClick={() => setSelectedDate(date)}><span>{date.getDate()}</span>{dayItems.slice(0, 2).map((item) => <small key={item.id} className={`month-event event-${item.color}`}>{fmtTime(item.time)} {item.customer.split(' ')[0]}</small>)}{dayItems.length > 2 && <small className="month-more">+{dayItems.length - 2} more</small>}</button>;
    })}</div></div> : <div className="calendar-grid-wrap"><div className="calendar-grid" style={{ '--day-count': calendarMode === 'Day' ? 1 : 7 }}>
      <div className="time-column"><div className="day-header time-spacer" />{Array.from({ length: 9 }, (_, index) => <div className="time-label" key={index}>{index + 9 > 12 ? `${index + 9 - 12} PM` : index + 9 === 12 ? '12 PM' : `${index + 9} AM`}</div>)}</div>
      {(calendarMode === 'Day' ? [selectedDate] : weekDates).map((date) => {
        const key = dateKey(date);
        const dayAppointments = appointments.filter((item) => item.date === key);
        return <div className="day-column" key={key}><button className={`day-header ${key === '2026-11-05' ? 'day-today' : ''}`} onClick={() => setSelectedDate(date)}><span>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span><strong>{date.getDate()}</strong></button>
          <div className="day-slots">{Array.from({ length: 9 }, (_, index) => <div className="slot-line" key={index} />)}{dayAppointments.map((item) => <CalendarEvent key={item.id} item={item} />)}</div>
        </div>;
      })}
    </div></div>}
    <div className="calendar-legend"><span><i className="legend-dot legend-violet" />Facial</span><span><i className="legend-dot legend-blue" />Consultation</span><span><i className="legend-dot legend-peach" />Massage</span><span><i className="legend-dot legend-mint" />Nails & more</span></div>
  </>;
}

function CalendarEvent({ item }) {
  const [hour, minute] = item.time.split(':').map(Number);
  const top = ((hour - 9) * 60 + minute) / 60 * 46;
  const height = Math.max(item.duration / 60 * 46 - 4, 28);
  return <button className={`calendar-event event-${item.color}`} style={{ top: `${top}px`, height: `${height}px` }} title={`${fmtTime(item.time)} · ${item.customer} · ${item.service}`}><strong>{item.customer.split(' ')[0]}</strong><span>{fmtTime(item.time)}</span></button>;
}

function AppointmentRow({ appointment, last, compact = false }) {
  return <div className={`appointment-row ${last ? 'row-last' : ''} ${compact ? 'appointment-compact' : ''}`}><div className={`appointment-color color-${appointment.color}`} /><div className="appointment-time">{fmtTime(appointment.time)}<small>{appointment.duration} min</small></div><Avatar customer={{ name: appointment.customer, initials: initials(appointment.customer), tone: appointment.color }} small /><div className="appointment-main"><strong>{appointment.customer}</strong><span>{appointment.service}</span></div><StatusBadge status={appointment.status} />{!compact && <button className="icon-button row-more" aria-label={`Options for ${appointment.customer}`}><Ellipsis size={18} /></button>}</div>;
}

function AppointmentsPage({ appointments, search, setSearch, statusFilter, setStatusFilter, onNew, onStatus }) {
  return <><PageHeading eyebrow="BOOKING MANAGEMENT" title="Appointments" subtitle="Keep track of bookings and make every visit feel special." action={<button className="button button-primary" onClick={onNew}><Plus size={17} /> New appointment</button>} />
    <div className="summary-strip"><div><span>All bookings</span><strong>{appointments.length}</strong></div><div><span>Confirmed</span><strong>{appointments.filter((a) => a.status === 'Confirmed').length}</strong></div><div><span>Awaiting confirmation</span><strong>{appointments.filter((a) => a.status === 'Pending').length}</strong></div><div><span>Checked in</span><strong>{appointments.filter((a) => a.status === 'Checked in').length}</strong></div></div>
    <section className="panel data-panel"><div className="table-toolbar"><div className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search appointments" /></div><div className="toolbar-right"><select className="filter-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All</option><option>Confirmed</option><option>Pending</option><option>Checked in</option><option>Cancelled</option></select><button className="button button-secondary" onClick={() => setStatusFilter('All')}><Filter size={15} /> Filters</button></div></div>
      <div className="table-scroll"><table><thead><tr><th>CLIENT</th><th>SERVICE</th><th>DATE & TIME</th><th>TEAM MEMBER</th><th>STATUS</th><th>PRICE</th><th /></tr></thead><tbody>{appointments.slice().sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).map((item) => <tr key={item.id}><td><div className="table-person"><Avatar customer={{ name: item.customer, initials: initials(item.customer), tone: item.color }} small /><span>{item.customer}<small>{item.customerId ? 'Returning client' : 'Client'}</small></span></div></td><td>{item.service}<small className="cell-subline">{item.duration} minutes</small></td><td>{dateAtNoon(item.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}<small className="cell-subline">{fmtTime(item.time)}</small></td><td>{item.staff}</td><td><StatusBadge status={item.status} interactive onChange={(status) => onStatus(item.id, status)} /></td><td>{money(item.price)}</td><td><button className="icon-button" aria-label="Appointment options"><Ellipsis size={18} /></button></td></tr>)}</tbody></table>{appointments.length === 0 && <EmptyState title="No appointments found" text="Try a different search, or add a new booking." />}</div>
      <div className="table-footer"><span>Showing <strong>{appointments.length}</strong> appointments</span><div><button className="button button-secondary compact-button">Previous</button><button className="button button-secondary compact-button">Next <ArrowRight size={14} /></button></div></div>
    </section>
  </>;
}

function CustomersPage({ customers, search, setSearch, onNew, onExport }) {
  const filtered = customers.filter((item) => `${item.name} ${item.email} ${item.phone}`.toLowerCase().includes(search.toLowerCase()));
  const totalSpend = customers.reduce((sum, item) => sum + item.spent, 0);
  return <><PageHeading eyebrow="YOUR COMMUNITY" title="Customers" subtitle="Get to know the people who make your work meaningful." action={<><button className="button button-secondary" onClick={onExport}><Download size={16} /> Export</button><button className="button button-primary" onClick={onNew}><Plus size={17} /> Add customer</button></>} />
    <div className="customer-stats"><div><span>Total customers</span><strong>{customers.length}</strong><small><ArrowUpRight size={13} /> 8 added this month</small></div><div><span>Returning clients</span><strong>{customers.filter((c) => c.bookings > 1).length}</strong><small className="stat-neutral">Your community is growing</small></div><div><span>Lifetime revenue</span><strong>{money(totalSpend)}</strong><small><ArrowUpRight size={13} /> Across all visits</small></div></div>
    <section className="panel data-panel"><div className="table-toolbar"><div className="search-field customer-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, email, or phone" /></div><div className="toolbar-right"><button className="button button-secondary"><SlidersHorizontal size={15} /> Sort by <ChevronDown size={14} /></button></div></div>
      <div className="table-scroll"><table className="customer-table"><thead><tr><th>CUSTOMER</th><th>PHONE</th><th>APPOINTMENTS</th><th>LAST VISIT</th><th>LIFETIME SPEND</th><th /></tr></thead><tbody>{filtered.map((customer) => <tr key={customer.id}><td><div className="table-person"><Avatar customer={customer} /><span>{customer.name}<small>{customer.email}</small></span></div></td><td>{customer.phone}</td><td><span className="booking-count">{customer.bookings} {customer.bookings === 1 ? 'visit' : 'visits'}</span></td><td>{customer.lastVisit}</td><td><strong>{money(customer.spent)}</strong></td><td><button className="icon-button" aria-label={`More options for ${customer.name}`}><Ellipsis size={18} /></button></td></tr>)}</tbody></table>{filtered.length === 0 && <EmptyState title="No customers found" text="Try another name or email." />}</div><div className="table-footer"><span>Showing <strong>{filtered.length}</strong> of <strong>{customers.length}</strong> customers</span><div><button className="button button-secondary compact-button">Previous</button><button className="button button-secondary compact-button">Next <ArrowRight size={14} /></button></div></div></section>
  </>;
}

function CalendarPage({ appointments, selectedDate, setSelectedDate, weekDates, formattedRange, calendarMode, setCalendarMode, shiftCalendar, onNew }) {
  const displayedRange = calendarMode === 'Month'
    ? selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : calendarMode === 'Day'
      ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : formattedRange;
  return <><PageHeading eyebrow="PLAN YOUR WEEK" title="Calendar" subtitle="Your time, thoughtfully organized." action={<button className="button button-primary" onClick={onNew}><Plus size={17} /> New appointment</button>} />
    <section className="panel full-calendar-panel"><div className="calendar-toolbar full-calendar-toolbar"><div className="date-nav"><button className="icon-button" onClick={() => shiftCalendar(-1)} aria-label="Previous"><ChevronLeft size={17} /></button><button className="icon-button" onClick={() => setSelectedDate(dateAtNoon('2026-11-05'))}>Today</button><button className="icon-button" onClick={() => shiftCalendar(1)} aria-label="Next"><ChevronRight size={17} /></button><strong>{displayedRange}</strong></div><div className="segmented"><button className={calendarMode === 'Week' ? 'segment-active' : ''} onClick={() => setCalendarMode('Week')}>Week</button><button className={calendarMode === 'Day' ? 'segment-active' : ''} onClick={() => setCalendarMode('Day')}>Day</button><button className={calendarMode === 'Month' ? 'segment-active' : ''} onClick={() => setCalendarMode('Month')}>Month</button></div></div><CalendarWidget appointments={appointments} selectedDate={selectedDate} setSelectedDate={setSelectedDate} weekDates={weekDates} formattedRange={formattedRange} calendarMode={calendarMode} setCalendarMode={setCalendarMode} shiftCalendar={shiftCalendar} /></section>
    <section className="panel upcoming-panel"><div className="panel-heading"><div><div className="panel-title">Upcoming appointments</div><div className="muted-caption">Next on your schedule</div></div></div><div className="upcoming-grid">{appointments.filter((item) => item.date >= dateKey(selectedDate)).slice(0, 4).map((item) => <div className="upcoming-card" key={item.id}><div className={`upcoming-accent color-${item.color}`} /><div className="upcoming-date">{dateAtNoon(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div><strong>{item.customer}</strong><span>{item.service}</span><small><Clock3 size={13} /> {fmtTime(item.time)} · {item.duration} min</small></div>)}</div></section>
  </>;
}

function AvailabilityPage({ schedule, setSchedule, serviceDuration, setServiceDuration, bufferTime, setBufferTime, onSave }) {
  const updateDay = (index, patch) => setSchedule((days) => days.map((day, i) => i === index ? { ...day, ...patch } : day));
  return <><PageHeading eyebrow="SCHEDULING MANAGEMENT" title="Availability" subtitle="Set a rhythm that works for you and your clients." action={<button className="button button-primary" onClick={onSave}><Check size={16} /> Save changes</button>} />
    <div className="availability-layout"><section className="panel hours-panel"><div className="panel-heading"><div><div className="panel-title">Regular business hours</div><div className="muted-caption">Your weekly availability for online bookings</div></div><span className="saved-indicator"><i /> Booking link active</span></div><div className="hours-list">{schedule.map((day, index) => <div className={`hours-row ${day.enabled ? '' : 'hours-disabled'}`} key={day.day}><button className={`toggle ${day.enabled ? 'toggle-on' : ''}`} aria-label={`${day.enabled ? 'Disable' : 'Enable'} ${day.day}`} onClick={() => updateDay(index, { enabled: !day.enabled })}><i /></button><strong>{day.day}</strong>{day.enabled ? <div className="time-range"><select aria-label={`${day.day} opening time`} value={day.start} onChange={(e) => updateDay(index, { start: e.target.value })}><TimeOptions /></select><span>to</span><select aria-label={`${day.day} closing time`} value={day.end} onChange={(e) => updateDay(index, { end: e.target.value })}><TimeOptions /></select></div> : <span className="closed-label">Closed</span>}<button className="icon-button hours-more" aria-label={`${day.day} options`}><Ellipsis size={18} /></button></div>)}</div><div className="hours-note"><CircleHelp size={15} /> Clients can only book during your open hours. You can always add appointments outside these hours.</div></section>
      <div className="availability-side"><section className="panel preferences-panel"><div className="panel-title">Booking preferences</div><div className="muted-caption">Fine tune the details</div><label className="pref-field"><span>Default appointment length</span><select value={serviceDuration} onChange={(e) => setServiceDuration(Number(e.target.value))}><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">1 hour</option><option value="90">1 hour 30 minutes</option></select></label><label className="pref-field"><span>Buffer between appointments</span><select value={bufferTime} onChange={(e) => setBufferTime(Number(e.target.value))}><option value="0">No buffer</option><option value="10">10 minutes</option><option value="15">15 minutes</option><option value="30">30 minutes</option></select></label><label className="pref-field"><span>Advance booking window</span><select defaultValue="60"><option value="14">14 days</option><option value="30">30 days</option><option value="60">60 days</option><option value="90">90 days</option></select></label></section><section className="booking-link-card"><div className="link-illustration"><CalendarDays size={24} /></div><div><strong>Your booking page</strong><p>Share your link so clients can find a time that works.</p></div><button onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/book`); onSave(); }}>Copy link <Copy size={14} /></button></section></div></div>
  </>;
}

function TimeOptions() { return <>{Array.from({ length: 29 }, (_, i) => { const minutes = 7 * 60 + i * 30; const hour = Math.floor(minutes / 60); const minute = minutes % 60; const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`; return <option value={value} key={value}>{fmtTime(value)}</option>; })}</>; }

function ServicesPage({ onToast }) {
  return <><PageHeading eyebrow="WHAT YOU DO BEST" title="Services" subtitle="A clear menu makes choosing a little easier." action={<button className="button button-primary" onClick={() => onToast('Service editor is ready for your next update')}><Plus size={17} /> Add service</button>} />
    <div className="service-admin-grid">{services.map((service) => <div className="panel service-admin-card" key={service.name}><div className={`service-admin-icon ${service.color}`}><Sparkles size={18} /></div><button className="icon-button" aria-label={`Options for ${service.name}`}><Ellipsis size={18} /></button><h3>{service.name}</h3><p>Available for in-studio appointments</p><div className="service-admin-meta"><span><Clock3 size={14} /> {service.duration} min</span><strong>{service.price ? money(service.price) : 'Complimentary'}</strong></div></div>)}</div>
  </>;
}

function ServiceBar({ name, bookings, percent, color }) { return <div className="service-bar-row"><div className="service-bar-label"><strong>{name}</strong><span>{bookings} bookings</span></div><div className="service-track"><i className={color} style={{ width: `${percent}%` }} /></div></div>; }

function Avatar({ customer, small = false }) { return <div className={`avatar avatar-${customer.tone || 'lilac'} ${small ? 'avatar-small' : ''}`}>{customer.initials || initials(customer.name)}</div>; }

function StatusBadge({ status, interactive = false, onChange }) {
  if (interactive) return <select className={`status-select status-${status.toLowerCase().replaceAll(' ', '-')}`} value={status} onChange={(e) => onChange(e.target.value)} aria-label="Appointment status"><option>Confirmed</option><option>Pending</option><option>Checked in</option><option>Cancelled</option></select>;
  return <span className={`status-badge status-${status.toLowerCase().replaceAll(' ', '-')}`}><i />{status}</span>;
}

function EmptyState({ title, text }) { return <div className="empty-state"><div className="empty-icon"><CalendarDays size={19} /></div><strong>{title}</strong><span>{text}</span></div>; }

function Modal({ children, onClose }) {
  useEffect(() => { const onKey = (event) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="modal-card">{children}</div></div>;
}

function FormModal({ type, onAppointment, onCustomer, customers, selectedDate }) {
  const [serviceName, setServiceName] = useState(services[0].name);
  const selectedService = services.find((item) => item.name === serviceName) || services[0];
  const [customerChoice, setCustomerChoice] = useState('new');
  const [form, setForm] = useState({ customer: '', email: '', phone: '', name: '', date: dateKey(selectedDate), time: '09:00', status: 'Confirmed', staff: 'Olivia Chen' });
  const update = (key) => (event) => setForm((data) => ({ ...data, [key]: event.target.value }));
  const existing = customers.find((item) => item.id === customerChoice);
  const appointmentSubmit = (event) => { event.preventDefault(); onAppointment({ ...form, customer: existing?.name || form.customer, email: existing?.email || form.email, phone: existing?.phone || form.phone, service: serviceName, status: form.status }); };
  const customerSubmit = (event) => { event.preventDefault(); onCustomer({ name: form.name, email: form.email, phone: form.phone }); };
  if (type === 'customer') return <form onSubmit={customerSubmit}><div className="modal-heading"><div className="modal-icon"><Users size={19} /></div><button className="icon-button" type="button" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}><X size={18} /></button><h2>Add a customer</h2><p>Create a customer account for easier booking management.</p></div><div className="form-grid"><label className="form-field form-wide"><span>Full name</span><input required value={form.name} onChange={update('name')} placeholder="e.g. Jamie Rivera" autoFocus /></label><label className="form-field form-wide"><span>Email address</span><input required type="email" value={form.email} onChange={update('email')} placeholder="jamie@email.com" /></label><label className="form-field form-wide"><span>Phone number</span><input value={form.phone} onChange={update('phone')} placeholder="+63 9XX XXX XXXX" /></label></div><div className="modal-actions"><button className="button button-secondary" type="button" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}>Cancel</button><button className="button button-primary" type="submit"><Plus size={16} /> Create account</button></div></form>;
  return <form onSubmit={appointmentSubmit}><div className="modal-heading"><div className="modal-icon"><CalendarDays size={19} /></div><button className="icon-button" type="button" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}><X size={18} /></button><h2>Book an appointment</h2><p>Add a little something lovely to the calendar.</p></div><div className="form-grid"><label className="form-field form-wide"><span>Customer</span><select value={customerChoice} onChange={(e) => setCustomerChoice(e.target.value)}><option value="new">+ New customer</option>{customers.map((customer) => <option value={customer.id} key={customer.id}>{customer.name} · {customer.email}</option>)}</select></label>{customerChoice === 'new' && <><label className="form-field"><span>Customer name</span><input required value={form.customer} onChange={update('customer')} placeholder="Jamie Rivera" autoFocus /></label><label className="form-field"><span>Email address</span><input required type="email" value={form.email} onChange={update('email')} placeholder="jamie@email.com" /></label><label className="form-field form-wide"><span>Phone number <small>Optional</small></span><input value={form.phone} onChange={update('phone')} placeholder="+63 9XX XXX XXXX" /></label></>}<label className="form-field form-wide"><span>Service</span><select value={serviceName} onChange={(e) => setServiceName(e.target.value)}>{services.map((service) => <option key={service.name}>{service.name}</option>)}</select><small className="field-hint">{selectedService.duration} minutes · {selectedService.price ? money(selectedService.price) : 'Complimentary'}</small></label><label className="form-field"><span>Date</span><input required type="date" value={form.date} onChange={update('date')} /></label><label className="form-field"><span>Start time</span><select value={form.time} onChange={update('time')}><TimeOptions /></select></label><label className="form-field"><span>Team member</span><select value={form.staff} onChange={update('staff')}><option>Olivia Chen</option><option>Mia Torres</option></select></label><label className="form-field"><span>Status</span><select value={form.status} onChange={update('status')}><option>Confirmed</option><option>Pending</option></select></label></div><div className="modal-actions"><button className="button button-secondary" type="button" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}>Cancel</button><button className="button button-primary" type="submit"><Check size={16} /> Create booking</button></div></form>;
}

export default App;
