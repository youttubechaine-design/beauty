import {useEffect, useState, type FormEvent} from 'react';
import {CheckCircle2, Phone} from 'lucide-react';
import {SALON_SERVICES} from '../data/services';

interface BookingFormProps {
  selectedServiceId: string;
  phoneDisplay: string | null;
}

export function BookingForm({
  selectedServiceId,
  phoneDisplay,
}: BookingFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceId, setServiceId] = useState(
    selectedServiceId || SALON_SERVICES[0].id
  );
  const [mode, setMode] = useState<'atelier' | 'mobile'>('atelier');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedServiceId) {
      setServiceId(selectedServiceId);
      if (selectedServiceId === 'onglerie-mobile-domicile') {
        setMode('mobile');
      }
    }
  }, [selectedServiceId]);

  const selectedService =
    SALON_SERVICES.find((s) => s.id === serviceId) ?? SALON_SERVICES[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (trimmedName.length < 2) {
      setErrorMsg('Veuillez renseigner votre nom complet.');
      return;
    }
    if (trimmedPhone.length < 8) {
      setErrorMsg('Veuillez saisir un numéro de téléphone valide.');
      return;
    }

    setSubmitted(true);
  };

  const telHref = phoneDisplay
    ? `tel:${phoneDisplay.replace(/\s+/g, '')}`
    : null;

  if (submitted) {
    return (
      <div className="bg-white border border-black/10 rounded-lg p-8 flex flex-col justify-between h-full">
        <div>
          <div className="inline-flex items-center gap-2 text-[#5E2334] font-medium text-sm mb-4">
            <CheckCircle2 className="w-5 h-5" />
            <span>Demande de rendez-vous enregistrée</span>
          </div>
          <h3 className="font-serif text-3xl font-semibold text-[#161414] mb-3">
            Merci, {name}
          </h3>
          <p className="text-sm text-[#57524E] leading-relaxed mb-6">
            Votre récapitulatif est prêt. Pour confirmer immédiatement l’heure exacte de votre passage, appelez directement le salon ou préparez un message avec vos préférences.
          </p>

          <dl className="border-t border-b border-black/8 py-5 space-y-3 text-sm mb-6">
            <div className="flex justify-between gap-4">
              <dt className="text-[#7A746E]">Prestation</dt>
              <dd className="font-medium text-[#161414] text-right">
                {selectedService.title}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#7A746E]">Formule</dt>
              <dd className="font-medium text-[#161414] text-right">
                {mode === 'atelier'
                  ? 'En atelier à Treichville'
                  : 'Déplacement à domicile'}
              </dd>
            </div>
            {date && (
              <div className="flex justify-between gap-4">
                <dt className="text-[#7A746E]">Date souhaitée</dt>
                <dd className="font-medium text-[#161414] tabular-nums">
                  {date}
                </dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-[#7A746E]">Votre contact</dt>
              <dd className="font-medium text-[#161414] tabular-nums">{phone}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {telHref && (
            <a
              href={telHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5E2334] text-white text-sm font-medium rounded-lg hover:bg-[#4B1B29] transition-colors whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              <span>Appeler {phoneDisplay}</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="px-4 py-2.5 text-sm font-medium text-[#161414] border border-black/15 rounded-lg hover:bg-[#F2F0EE] transition-colors whitespace-nowrap"
          >
            Modifier la demande
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-black/10 rounded-lg p-7 md:p-8 space-y-5"
      noValidate
    >
      <div>
        <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#161414] mb-1.5">
          Prendre rendez-vous
        </h3>
        <p className="text-sm text-[#57524E]">
          Choisissez votre soin en atelier à Treichville ou en service mobile à domicile.
        </p>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="px-4 py-3 rounded-md bg-[#FDF2F2] border border-[#5E2334]/25 text-xs font-medium text-[#5E2334]"
        >
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="booking-name"
            className="block text-xs font-medium text-[#161414] mb-1.5"
          >
            Nom complet
          </label>
          <input
            id="booking-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex. Aminata Koné"
            className="w-full px-3.5 py-2.5 text-sm bg-[#F9F8F6] border border-black/12 rounded-lg focus:outline-none focus:border-[#5E2334] focus:ring-1 focus:ring-[#5E2334]"
          />
        </div>
        <div>
          <label
            htmlFor="booking-phone"
            className="block text-xs font-medium text-[#161414] mb-1.5"
          >
            Téléphone
          </label>
          <input
            id="booking-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+225 07 XX XX XX XX"
            className="w-full px-3.5 py-2.5 text-sm bg-[#F9F8F6] border border-black/12 rounded-lg focus:outline-none focus:border-[#5E2334] focus:ring-1 focus:ring-[#5E2334] tabular-nums"
          />
        </div>
      </div>

      <div>
        <span className="block text-xs font-medium text-[#161414] mb-1.5">
          Lieu de la prestation
        </span>
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#F2F0EE] rounded-lg">
          <button
            type="button"
            onClick={() => setMode('atelier')}
            className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === 'atelier'
                ? 'bg-white text-[#161414] shadow-xs'
                : 'text-[#57524E] hover:text-[#161414]'
            }`}
          >
            En atelier (Treichville)
          </button>
          <button
            type="button"
            onClick={() => setMode('mobile')}
            className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === 'mobile'
                ? 'bg-white text-[#161414] shadow-xs'
                : 'text-[#57524E] hover:text-[#161414]'
            }`}
          >
            À domicile (Mobile)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="booking-service"
            className="block text-xs font-medium text-[#161414] mb-1.5"
          >
            Prestation souhaitée
          </label>
          <select
            id="booking-service"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-[#F9F8F6] border border-black/12 rounded-lg focus:outline-none focus:border-[#5E2334] focus:ring-1 focus:ring-[#5E2334]"
          >
            {SALON_SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="booking-date"
            className="block text-xs font-medium text-[#161414] mb-1.5"
          >
            Date souhaitée
          </label>
          <input
            id="booking-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-[#F9F8F6] border border-black/12 rounded-lg focus:outline-none focus:border-[#5E2334] focus:ring-1 focus:ring-[#5E2334] tabular-nums"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="booking-notes"
          className="block text-xs font-medium text-[#161414] mb-1.5"
        >
          Précisions (quartier si à domicile, style souhaité)
        </label>
        <textarea
          id="booking-notes"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ex. Pose gel amande nude, disponible dès 14h…"
          className="w-full px-3.5 py-2.5 text-sm bg-[#F9F8F6] border border-black/12 rounded-lg focus:outline-none focus:border-[#5E2334] focus:ring-1 focus:ring-[#5E2334]"
        />
      </div>

      <div className="pt-1 flex flex-wrap items-center justify-between gap-4">
        <button
          type="submit"
          className="px-6 py-3 bg-[#5E2334] text-white text-sm font-medium rounded-lg hover:bg-[#4B1B29] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Confirmer ma demande
        </button>

        {telHref && (
          <a
            href={telHref}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#161414] hover:text-[#5E2334] transition-colors tabular-nums whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Ou appeler : {phoneDisplay}</span>
          </a>
        )}
      </div>
    </form>
  );
}
