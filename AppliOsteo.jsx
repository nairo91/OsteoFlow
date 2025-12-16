import React, { useState, useEffect } from 'react';
import {
Calendar,
Clock,
CheckCircle,
ChevronRight,
ChevronLeft,
User,
Menu,
X,
Star,
TrendingUp,
Users,
DollarSign,
MapPin,
Phone,
ShieldCheck,
Activity,
CreditCard,
Lock
} from 'lucide-react';

/* --- Styles for Custom Animations --- */
const customStyles = `
@keyframes fadeIn {
from { opacity: 0; transform: translateY(10px); }
to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
from { transform: translateY(100%); }
to { transform: translateY(0); }
}
@keyframes pulse-subtle {
0%, 100% { transform: scale(1); }
50% { transform: scale(1.02); }
}
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
.animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-pulse-subtle { animation: pulse-subtle 2s infinite; }

/* Custom Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
`;

/* --- DONNÉES FICTIVES (MOCK DATA) --- */
const SERVICES = [
{ id: 1, title: 'Consultation Initiale', duration: '60 min', price: 75, desc: 'Bilan complet et premier traitement.' },
{ id: 2, title: 'Séance de Suivi', duration: '45 min', price: 60, desc: 'Ajustement et continuité du soin.' },
{ id: 3, title: 'Urgence Douleur', duration: '30 min', price: 55, desc: 'Focus immédiat sur le soulagement de la
douleur.' },
];

const TESTIMONIALS = [
{ id: 1, name: "Sarah J.", role: "Coureuse", text: "Je ne pouvais plus courir depuis des mois. Deux séances et je suis
de retour sur la piste. Incroyable.", rating: 5 },
{ id: 2, name: "Marc Dupont", role: "Employé de bureau", text: "Les tensions dans la nuque à cause de l'écran étaient
insupportables. Le soulagement a été immédiat.", rating: 5 },
{ id: 3, name: "Elena R.", role: "Jeune Maman", text: "Doux, professionnel et très rassurant. Je recommande vivement
pour la récupération post-partum.", rating: 5 }
];

const AVAILABLE_SLOTS = [
{ time: '09:00', available: true },
{ time: '10:00', available: false }, // Réservé
{ time: '11:00', available: true },
{ time: '13:30', available: true },
{ time: '14:30', available: true },
{ time: '16:00', available: false }, // Réservé
];

/* --- COMPOSANTS --- */

// 1. Composants UI Réutilisables
const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
const baseStyle = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform active:scale-95 flex
items-center justify-center gap-2";
const variants = {
primary: "bg-emerald-700 text-white hover:bg-emerald-800 shadow-lg shadow-emerald-700/20",
secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
ghost: "text-emerald-700 hover:bg-emerald-50",
outline: "border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50"
};

return (
<button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${disabled
  ? 'opacity-50 cursor-not-allowed' : '' } ${className}`}>
  {children}
</button>
);
};

const Card = ({ children, className = '' }) => (
<div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow
  ${className}`}>
  {children}
</div>
);

// 2. Modal de Réservation (Le Tunnel de Conversion)
const BookingModal = ({ isOpen, onClose }) => {
const [step, setStep] = useState(1);
const [selection, setSelection] = useState({ service: null, date: null, time: null });
const [isProcessing, setIsProcessing] = useState(false);

useEffect(() => {
if (isOpen) document.body.style.overflow = 'hidden';
else document.body.style.overflow = 'unset';
return () => { document.body.style.overflow = 'unset'; };
}, [isOpen]);

const nextStep = () => setStep(s => s + 1);
const prevStep = () => setStep(s => s - 1);

const handleBook = () => {
setIsProcessing(true);
// Simulation appel API
setTimeout(() => {
setIsProcessing(false);
nextStep(); // Aller au succès
}, 2000);
};

if (!isOpen) return null;

return (
<div
  className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
  {/* Contenu Modal */}
  <div
    className="bg-white w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-slide-up sm:animate-fade-in overflow-hidden">

    {/* En-tête */}
    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
      <div className="flex items-center gap-2">
        {step > 1 && step < 5 && ( <button onClick={prevStep}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
          <ChevronLeft size={20} />
          </button>
          )}
          <h3 className="font-bold text-slate-800">
            {step === 1 && "Choisir un Soin"}
            {step === 2 && "Date & Heure"}
            {step === 3 && "Vos Coordonnées"}
            {step === 4 && "Acompte Sécurisé"}
            {step === 5 && "Confirmé"}
          </h3>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
        <X size={20} />
      </button>
    </div>

    {/* Barre de Progression */}
    {step < 5 && ( <div className="w-full bg-slate-100 h-1.5">
      <div className="bg-emerald-500 h-1.5 transition-all duration-500 ease-out" style={{ width: `${step * 25}%` }}>
      </div>
  </div>
  )}

  {/* Corps */}
  <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">

    {/* ÉTAPE 1: Services */}
    {step === 1 && (
    <div className="space-y-3 animate-fade-in">
      {SERVICES.map(service => (
      <div key={service.id} onClick={()=> { setSelection({...selection, service}); nextStep(); }}
        className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md
        cursor-pointer transition-all flex justify-between items-center"
        >
        <div>
          <h4 className="font-bold text-slate-800 group-hover:text-emerald-700">{service.title}</h4>
          <p className="text-sm text-slate-500 mt-1">{service.desc}</p>
          <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {service.duration}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-lg font-bold text-emerald-700">{service.price} €</span>
          <span className="text-xs text-slate-400">Dispo : Aujourd'hui</span>
        </div>
      </div>
      ))}
    </div>
    )}

    {/* ÉTAPE 2: Calendrier */}
    {step === 2 && (
    <div className="animate-fade-in">
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-slate-700">Octobre 2023</span>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-slate-100 rounded">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1 hover:bg-slate-100 rounded">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        {/* Grille Calendrier Mock */}
        <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
          {['L','M','M','J','V','S','D'].map(d => <span key={d} className="text-slate-400 text-xs">{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(30)].map((_, i) => {
          const day = i + 1;
          const isSelected = selection.date === day;
          const isToday = day === 15; // Mock aujourd'hui
          return (
          <button key={i} onClick={()=> setSelection({...selection, date: day, time: null})}
            className={`
            h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all
            ${isSelected ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-100 text-slate-600'}
            ${isToday ? 'border border-emerald-600 font-bold' : ''}
            `}
            >
            {day}
          </button>
          )
          })}
        </div>
      </div>

      {selection.date && (
      <div>
        <h4 className="text-sm font-bold text-slate-700 mb-3">Disponibilités pour le {selection.date} Oct</h4>
        <div className="grid grid-cols-3 gap-2">
          {AVAILABLE_SLOTS.map((slot, idx) => (
          <button key={idx} disabled={!slot.available} onClick={()=> { setSelection({...selection, time: slot.time});
            nextStep(); }}
            className={`
            py-2 px-3 rounded-lg text-sm font-medium border transition-all
            ${!slot.available
            ? 'bg-slate-100 text-slate-400 border-transparent cursor-not-allowed decoration-slice'
            : 'bg-white border-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white
            hover:border-emerald-600 shadow-sm'}
            `}
            >
            {slot.time}
          </button>
          ))}
        </div>
      </div>
      )}
    </div>
    )}

    {/* ÉTAPE 3: Détails */}
    {step === 3 && (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
        <div className="bg-emerald-200 p-2 rounded-full text-emerald-700 mt-1">
          <Calendar size={16} />
        </div>
        <div>
          <h4 className="font-bold text-emerald-900">{selection.service?.title}</h4>
          <p className="text-sm text-emerald-700">Le {selection.date} Oct à {selection.time}</p>
          <p className="text-xs text-emerald-600 mt-1">{selection.service?.duration} • {selection.service?.price} €</p>
        </div>
      </div>

      <form className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Nom Complet</label>
          <input type="text" placeholder="ex: Jean Dupont"
            className="w-full p-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Téléphone</label>
          <input type="tel" placeholder="+33 6 12 34 56 78"
            className="w-full p-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Motif de consultation
            (Optionnel)</label>
          <textarea rows="2" placeholder="Décrivez brièvement votre douleur..."
            className="w-full p-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"></textarea>
        </div>
      </form>
    </div>
    )}

    {/* ÉTAPE 4: Paiement */}
    {step === 4 && (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <p className="text-slate-500 mb-1">Pour sécuriser votre rendez-vous</p>
        <h3 className="text-2xl font-bold text-slate-800">Régler 20,00 € d'acompte</h3>
        <p className="text-xs text-slate-400 mt-2">Le solde de {selection.service.price - 20} € sera à régler sur place.
        </p>
      </div>

      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-slate-100 p-2 rounded-md">
            <CreditCard size={20} className="text-slate-600" />
          </div>
          <span className="font-medium text-slate-700">Carte Bancaire</span>
        </div>
        {/* Fake Stripe Input */}
        <div className="space-y-3">
          <input type="text" placeholder="0000 0000 0000 0000"
            className="w-full p-3 bg-slate-50 border-none rounded-lg font-mono text-sm focus:ring-0" />
          <div className="flex gap-3">
            <input type="text" placeholder="MM/AA"
              className="w-1/2 p-3 bg-slate-50 border-none rounded-lg font-mono text-sm focus:ring-0" />
            <input type="text" placeholder="CVC"
              className="w-1/2 p-3 bg-slate-50 border-none rounded-lg font-mono text-sm focus:ring-0" />
          </div>
        </div>
        <div className="absolute top-2 right-2 text-slate-300 group-hover:text-emerald-500 transition-colors">
          <Lock size={14} />
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center text-xs text-slate-400">
        <ShieldCheck size={12} /> Paiement chiffré SSL 256-bit sécurisé
      </div>
    </div>
    )}

    {/* ÉTAPE 5: Succès */}
    {step === 5 && (
    <div className="flex flex-col items-center justify-center h-full text-center py-8 animate-fade-in">
      <div
        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 animate-pulse-subtle">
        <CheckCircle size={40} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Réservation Confirmée !</h2>
      <p className="text-slate-500 mb-8 max-w-xs">Nous avons envoyé un SMS de confirmation sur votre téléphone. À
        bientôt le {selection.date} Oct à {selection.time}.</p>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-full mb-6 text-left">
        <h4 className="font-bold text-slate-700 text-sm mb-2">Et ensuite ?</h4>
        <ul className="text-sm text-slate-500 space-y-2">
          <li className="flex gap-2 items-start"><span className="text-emerald-500">•</span> Vous recevrez un rappel 24h
            avant.</li>
          <li className="flex gap-2 items-start"><span className="text-emerald-500">•</span> Merci d'arriver 5 minutes
            en avance.</li>
        </ul>
      </div>

      <Button variant="outline" onClick={onClose} className="w-full">Fermer & Retour à l'accueil</Button>
    </div>
    )}
  </div>

  {/* Pied de page Actions (Sticky) */}
  {step < 5 && ( <div className="p-4 border-t border-slate-100 bg-white">
    {step === 3 && (
    <Button onClick={nextStep} className="w-full">Continuer vers le Paiement</Button>
    )}
    {step === 4 && (
    <Button onClick={handleBook} disabled={isProcessing} className="w-full flex justify-between items-center px-4">
      <span>Payer l'acompte</span>
      {isProcessing ? <span className="animate-spin">⌛</span> : <span className="font-bold">20,00 €</span>}
    </Button>
    )}
    {(step === 1 || step === 2) && (
    <div className="text-center text-xs text-slate-400">
      {step === 1 ? "Sélectionnez un soin pour continuer" : "Sélectionnez un créneau horaire"}
    </div>
    )}
</div>
)}

</div>
</div>
);
};

// 3. Tableau de Bord Admin
const AdminDashboard = () => {
return (
<div className="min-h-screen bg-slate-50 animate-fade-in pb-20">
  <header className="bg-slate-900 text-white p-6 pb-12 rounded-b-3xl shadow-lg">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-xl font-bold">Bonjour, Dr. Alex</h1>
        <p className="text-slate-400 text-sm">Lundi, 15 Oct 2023</p>
      </div>
      <div className="bg-slate-800 p-2 rounded-full">
        <User size={20} className="text-emerald-400" />
      </div>
    </div>

    {/* Ligne Stats Clés */}
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
        <p className="text-xs text-slate-400 mb-1">Revenus</p>
        <p className="text-xl font-bold text-white">450 €</p>
        <div className="text-[10px] text-emerald-400 flex items-center gap-1">
          <TrendingUp size={10} /> +12%
        </div>
      </div>
      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
        <p className="text-xs text-slate-400 mb-1">RDV</p>
        <p className="text-xl font-bold text-white">6</p>
        <div className="text-[10px] text-slate-400">2 créneaux libres</div>
      </div>
      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
        <p className="text-xs text-slate-400 mb-1">Nouveaux</p>
        <p className="text-xl font-bold text-white">2</p>
        <div className="text-[10px] text-orange-400">Patients</div>
      </div>
    </div>
  </header>

  <main className="px-4 -mt-6">
    {/* Agenda à venir */}
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      <div className="p-4 border-b border-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Agenda du Jour</h3>
        <button className="text-emerald-600 text-xs font-semibold">Voir Calendrier</button>
      </div>
      <div className="divide-y divide-slate-50">
        {[
        { time: '09:00', patient: 'Liam Neeson', type: 'Initial', status: 'Terminé' },
        { time: '10:00', patient: 'Emma Watson', type: 'Suivi', status: 'En cours' },
        { time: '13:30', patient: 'Tom Hardy', type: 'Douleur Aiguë', status: 'À venir' },
        { time: '14:30', patient: 'Sarah Connor', type: 'Suivi', status: 'À venir' },
        ].map((appt, i) => (
        <div key={i} className="p-4 flex gap-4 items-center hover:bg-slate-50 transition-colors">
          <div className="w-12 text-center">
            <span className="block text-sm font-bold text-slate-700">{appt.time}</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800 text-sm">{appt.patient}</h4>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{appt.type}</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${appt.status==='Terminé' ? 'bg-slate-300' : appt.status==='En cours'
            ? 'bg-emerald-500 animate-pulse' : 'bg-orange-400' }`}></div>
        </div>
        ))}
      </div>
    </div>

    {/* Graphique Croissance Hebdo (CSS only) */}
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <h3 className="font-bold text-slate-800 mb-4 text-sm">Revenus Hebdomadaire</h3>
      <div className="h-32 flex items-end justify-between gap-2 px-2">
        {[40, 65, 30, 85, 50, 95, 60].map((h, i) => (
        <div key={i} className="w-full flex flex-col items-center gap-1 group">
          <div
            className="w-full bg-emerald-100 rounded-t-sm transition-all duration-500 group-hover:bg-emerald-500 relative"
            style={{ height: `${h}%` }}>
            <div
              className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg transition-opacity">
              {h*10} €</div>
          </div>
          <span className="text-[10px] text-slate-400">{['L','M','M','J','V','S','D'][i]}</span>
        </div>
        ))}
      </div>
    </div>
  </main>
</div>
);
};

// 4. Page d'Atterrissage Patient (Landing Page)
const LandingPage = ({ onBook }) => {
const [activeTestimonial, setActiveTestimonial] = useState(0);

return (
<div className="min-h-screen bg-white font-sans text-slate-800">
  {/* En-tête */}
  <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
    <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
          <Activity size={18} />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900">Osteo<span
            className="text-emerald-700">Flow</span></span>
      </div>
      <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
        <a href="#" className="hover:text-emerald-700 transition-colors">Soins</a>
        <a href="#" className="hover:text-emerald-700 transition-colors">À Propos</a>
        <a href="#" className="hover:text-emerald-700 transition-colors">Tarifs</a>
        <a href="#" className="hover:text-emerald-700 transition-colors">FAQ</a>
      </div>
      <Button onClick={onBook} className="hidden md:flex py-2 text-sm">Prendre Rendez-vous</Button>
      <button className="md:hidden p-2 text-slate-600">
        <Menu size={24} />
      </button>
    </div>
  </nav>

  {/* Section Héros */}
  <section className="pt-32 pb-20 px-4 md:px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
    <div className="space-y-6 animate-fade-in">
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
        <CheckCircle size={14} /> Disponible Aujourd'hui
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
        Soulager la Douleur.<br />
        <span className="text-emerald-700">Retrouver la Vie.</span>
      </h1>
      <p className="text-lg text-slate-500 max-w-md leading-relaxed">
        Soins ostéopathiques experts spécialisés dans le mal de dos, les blessures sportives et le stress. Retrouvez
        votre mobilité dans un cabinet calme et moderne.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <Button onClick={onBook} className="shadow-emerald-500/30 shadow-xl">Réserver une Séance</Button>
        <Button variant="secondary">En Savoir Plus</Button>
      </div>
      <div className="flex items-center gap-4 text-sm text-slate-400 pt-4">
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
          <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center
            justify-center overflow-hidden`}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*13}`} alt="User" />
          </div>
          ))}
        </div>
        <p>Recommandé par <strong className="text-slate-700">500+ patients</strong> cette année</p>
      </div>
    </div>
    <div
      className="relative h-[400px] md:h-[500px] bg-slate-100 rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in delay-100 group">
      <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000"
        alt="Cabinet Moderne"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg max-w-xs">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-full text-emerald-700">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Adresse</p>
            <p className="font-semibold text-slate-800">12 Av. de la Santé, Paris</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Grille des Services */}
  <section className="bg-slate-50 py-20 px-4 md:px-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Soins Sur Mesure</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">Nous ne traitons pas seulement les symptômes, nous trouvons la
          cause. Choisissez la séance adaptée à vos besoins.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {SERVICES.map((s) => (
        <Card key={s.id}
          className="relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={100} className="text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
          <p className="text-slate-500 mb-6 h-12">{s.desc}</p>
          <div className="flex items-end justify-between border-t border-slate-100 pt-4">
            <div>
              <span className="text-2xl font-bold text-emerald-700">{s.price} €</span>
              <span className="text-sm text-slate-400"> / séance</span>
            </div>
            <button onClick={onBook}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </Card>
        ))}
      </div>
    </div>
  </section>

  {/* Témoignages */}
  <section className="py-20 px-4 md:px-6 overflow-hidden">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-slate-900 mb-12">Histoires de Patients</h2>
      <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
        <div className="absolute top-6 left-8 text-6xl text-emerald-100 font-serif">"</div>
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) =>
            <Star key={i} size={20} className="text-yellow-400 fill-current" />)}
          </div>
          <p className="text-xl md:text-2xl font-medium text-slate-700 mb-8 italic leading-relaxed">
            {TESTIMONIALS[activeTestimonial].text}
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="text-right">
              <p className="font-bold text-slate-900">{TESTIMONIALS[activeTestimonial].name}</p>
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">
                {TESTIMONIALS[activeTestimonial].role}</p>
            </div>
            <div className="h-10 w-0.5 bg-slate-200"></div>
            <div className="flex gap-2">
              <button onClick={()=> setActiveTestimonial(prev => prev === 0 ? TESTIMONIALS.length - 1 : prev - 1)}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                <ChevronLeft size={20} className="text-slate-400" />
              </button>
              <button onClick={()=> setActiveTestimonial(prev => prev === TESTIMONIALS.length - 1 ? 0 : prev + 1)}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                <ChevronRight size={20} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Pied de page */}
  <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
    <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-4 text-white">
          <Activity size={20} className="text-emerald-500" />
          <span className="font-bold text-xl">OsteoFlow</span>
        </div>
        <p className="max-w-xs text-sm">Soins ostéopathiques professionnels dédiés au rétablissement de l'équilibre
          naturel et du mouvement de votre corps.</p>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4">Contact</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Phone size={14} /> +33 1 23 45 67 89
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={14} /> 12 Av. de la Santé, Paris
          </li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4">Légal</h4>
        <ul className="space-y-2 text-sm">
          <li>Politique de Confidentialité</li>
          <li>Conditions d'Utilisation</li>
        </ul>
      </div>
    </div>
  </footer>

  {/* Mobile Sticky CTA */}
  <div className="md:hidden fixed bottom-6 right-6 z-40">
    <button onClick={onBook}
      className="bg-emerald-600 text-white rounded-full p-4 shadow-2xl shadow-emerald-600/40 flex items-center gap-2 animate-pulse-subtle hover:scale-110 transition-transform">
      <Calendar size={24} />
      <span className="font-bold pr-2">Réserver</span>
    </button>
  </div>

</div>
);
};

// 5. Conteneur App
export default function App() {
const [view, setView] = useState('landing'); // 'landing' ou 'admin'
const [bookingOpen, setBookingOpen] = useState(false);

// Toggle pour Démo (Caché coin bas gauche)
return (
<div className="relative bg-white h-full w-full">
  <style>
    {
      customStyles
    }
  </style>

  {/* Contenu Principal */}
  {view === 'landing' ? (
  <LandingPage onBook={()=> setBookingOpen(true)} />
    ) : (
    <AdminDashboard />
    )}

    {/* Overlay Réservation */}
    <BookingModal isOpen={bookingOpen} onClose={()=> setBookingOpen(false)} />

      {/* Switch Admin Caché */}
      <div className="fixed bottom-4 left-4 z-50 opacity-50 hover:opacity-100 transition-opacity">
        <button onClick={()=> setView(v => v === 'landing' ? 'admin' : 'landing')}
          className="bg-slate-800 text-xs text-white px-3 py-1 rounded-full shadow-lg border border-slate-700 flex
          items-center gap-2"
          >
          {view === 'landing' ?
          <Lock size={10} /> :
          <User size={10} />}
          {view === 'landing' ? 'Vue Admin' : 'Vue Patient'}
        </button>
      </div>
</div>
);
}