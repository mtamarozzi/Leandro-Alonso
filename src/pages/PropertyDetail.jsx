import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowLeft, BedDouble, Bath, Car, Maximize, MapPin, Building2, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '../../Logo/Logo_branca.png';
import { supabase } from '../lib/supabase';

function formatBRL(v, { cents = false } = {}) {
  if (v == null) return null;
  return v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
}

function priceLabel(p) {
  if (p.purpose === 'locacao') return p.rent_price ? `${formatBRL(p.rent_price)}/mês` : 'Sob consulta';
  return formatBRL(p.sale_price) || 'Sob consulta';
}

function sortMedia(media) {
  if (!media) return [];
  return [...media].sort(
    (a, b) => (b.is_cover === true) - (a.is_cover === true) || (a.display_order ?? 0) - (b.display_order ?? 0)
  );
}

const SELECT =
  'id,ref_code,purpose,kind,status,city,neighborhood,full_address,floor,usable_area_m2,bedrooms,suites,bathrooms,parking_spots,garage_type,is_furnished,has_balcony,pet_friendly,sale_price,rent_price,condo_fee,iptu,total_monthly,guarantee_type,availability,highlights,public_description,development_name,media(url,is_cover,display_order,caption)';

const isUuid = (s) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(undefined); // undefined=loading, null=not found
  const [activeIdx, setActiveIdx] = useState(0);
  const rootRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!supabase) {
        setProperty(null);
        return;
      }
      let q = supabase
        .from('properties')
        .select(SELECT)
        .eq('is_public', true)
        .in('status', ['disponivel', 'reservado']);
      q = isUuid(id) ? q.eq('id', id) : q.ilike('ref_code', id);
      const { data, error } = await q.limit(1).maybeSingle();
      if (!alive) return;
      setProperty(error || !data ? null : data);
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    if (property && rootRef.current) {
      const ctx = gsap.context(() => {
        // fromTo (não from): destino explícito evita o bug do StrictMode que
        // deixava elementos travados em opacidade intermediária.
        gsap.fromTo(
          '.pd-anim',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, clearProps: 'opacity,transform' }
        );
      }, rootRef);
      return () => ctx.revert();
    }
  }, [property]);

  function prevPhoto() {
    setActiveIdx((i) => (i - 1 + media.length) % media.length);
  }
  function nextPhoto() {
    setActiveIdx((i) => (i + 1) % media.length);
  }

  function talkToDorinda() {
    const ref = property.ref_code ? `${property.ref_code} ` : '';
    const msg = `Oi! Tenho interesse no imóvel ${ref}(${property.neighborhood}, ${property.city}). Pode me passar mais detalhes?`;
    window.dispatchEvent(new CustomEvent('dorinda:open', { detail: { message: msg } }));
  }

  const media = property ? sortMedia(property.media) : [];
  const purposeLabel =
    property?.purpose === 'locacao' ? 'Locação' : property?.purpose === 'lancamento' ? 'Lançamento' : 'Venda';

  return (
    <div ref={rootRef} className="min-h-screen bg-obsidian text-ivory">
      <header className="sticky top-0 z-20 border-b border-ivory/10 bg-obsidian/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Leandro Alonso" className="h-8 w-auto" />
          </Link>
          <Link to="/imoveis" className="font-data flex items-center gap-2 text-ivory/60 transition hover:text-champagne">
            <ArrowLeft size={14} /> Voltar ao catálogo
          </Link>
        </div>
      </header>

      {property === undefined && (
        <p className="mx-auto max-w-6xl px-6 py-20 font-data text-ivory/40">Carregando imóvel…</p>
      )}

      {property === null && (
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-drama text-2xl text-ivory">Imóvel não encontrado</p>
          <p className="mt-2 text-ivory/60">Esse imóvel pode ter saído do catálogo.</p>
          <Link to="/imoveis" className="font-data mt-6 inline-flex items-center gap-2 text-champagne">
            <ArrowLeft size={14} /> Ver outros imóveis
          </Link>
        </div>
      )}

      {property && (
        <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
          {/* galeria */}
          <div className="pd-anim">
            <div className="group relative aspect-[16/10] overflow-hidden rounded-3xl border border-ivory/10 bg-slate">
              {media.length ? (
                <img
                  src={media[activeIdx]?.url}
                  alt={`${property.neighborhood}, ${property.city}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate to-obsidian">
                  <span className="font-data text-ivory/30">Fotos em breve</span>
                </div>
              )}

              {/* setas de navegação — sempre visíveis no mobile, no hover no desktop */}
              {media.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevPhoto}
                    aria-label="Foto anterior"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-obsidian/50 text-ivory opacity-100 ring-1 ring-ivory/15 backdrop-blur transition hover:bg-obsidian/70 hover:text-champagne focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={nextPhoto}
                    aria-label="Próxima foto"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-obsidian/50 text-ivory opacity-100 ring-1 ring-ivory/15 backdrop-blur transition hover:bg-obsidian/70 hover:text-champagne focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <span className="font-data absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-obsidian/60 px-3 py-1 text-xs text-ivory/80 backdrop-blur">
                    {activeIdx + 1} / {media.length}
                  </span>
                </>
              )}

              <span className="font-data absolute right-4 top-4 rounded-full bg-champagne/90 px-3 py-1 text-obsidian">
                {purposeLabel}
              </span>
              {property.status === 'reservado' && (
                <span className="font-data absolute left-4 top-4 rounded-full bg-obsidian/80 px-3 py-1 text-champagne backdrop-blur">
                  Reservado
                </span>
              )}
            </div>

            {media.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {media.map((m, i) => (
                  <button
                    key={m.url}
                    onClick={() => setActiveIdx(i)}
                    className={
                      'h-20 w-28 shrink-0 overflow-hidden rounded-xl border transition ' +
                      (i === activeIdx ? 'border-champagne' : 'border-ivory/10 opacity-60 hover:opacity-100')
                    }
                  >
                    <img src={m.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* corpo */}
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* coluna principal */}
            <div className="lg:col-span-2">
              <div className="pd-anim flex items-center gap-2 text-ivory/60">
                <MapPin size={16} className="text-champagne" />
                <span>
                  {property.neighborhood}, {property.city}
                  {property.floor ? ` · ${property.floor}` : ''}
                </span>
              </div>
              <h1 className="font-drama pd-anim mt-2 text-3xl text-ivory sm:text-4xl">
                {property.development_name || `${purposeLabel} em ${property.neighborhood}`}
              </h1>

              {/* specs */}
              <div className="pd-anim mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {property.usable_area_m2 && <Spec icon={Maximize} label="Área útil" value={`${property.usable_area_m2} m²`} />}
                {property.bedrooms > 0 && <Spec icon={BedDouble} label="Dormitórios" value={property.bedrooms} />}
                {property.suites > 0 && <Spec icon={BedDouble} label="Suítes" value={property.suites} />}
                {property.bathrooms > 0 && <Spec icon={Bath} label="Banheiros" value={property.bathrooms} />}
                {property.parking_spots > 0 && <Spec icon={Car} label="Vagas" value={property.parking_spots} />}
                {property.kind && <Spec icon={Building2} label="Tipo" value={property.kind} />}
              </div>

              {property.highlights && (
                <div className="pd-anim mt-10">
                  <h2 className="font-data text-champagne">Destaques</h2>
                  <p className="mt-3 whitespace-pre-wrap leading-relaxed text-ivory/80">{property.highlights}</p>
                </div>
              )}

              {property.public_description && (
                <div className="pd-anim mt-8">
                  <h2 className="font-data text-champagne">Sobre o imóvel</h2>
                  <p className="mt-3 whitespace-pre-wrap leading-relaxed text-ivory/80">{property.public_description}</p>
                </div>
              )}
            </div>

            {/* coluna lateral: preço + CTA */}
            <aside className="pd-anim lg:col-span-1">
              <div className="pill-container sticky top-24 rounded-3xl p-6" style={{ backgroundColor: 'rgba(13,13,18,0.6)' }}>
                <p className="font-drama text-3xl text-ivory">{priceLabel(property)}</p>
                <div className="mt-3 space-y-1 text-sm text-ivory/60">
                  {property.condo_fee != null && <p>Condomínio {formatBRL(property.condo_fee, { cents: true })}</p>}
                  {property.iptu != null && <p>IPTU {formatBRL(property.iptu, { cents: true })}</p>}
                  {property.purpose === 'locacao' && property.guarantee_type && <p>Garantia: {property.guarantee_type}</p>}
                </div>

                <button
                  onClick={talkToDorinda}
                  className="btn-magnetic btn-p-color mt-6 w-full rounded-2xl"
                >
                  <MessageCircle size={16} /> Falar com a Dorinda sobre esse imóvel
                </button>

                {property.ref_code && <p className="font-data mt-4 text-center text-ivory/30">Ref. {property.ref_code}</p>}
              </div>
            </aside>
          </div>
        </main>
      )}
    </div>
  );
}

function Spec({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-ivory/10 bg-slate/30 p-4">
      <Icon size={18} className="text-champagne" />
      <p className="font-data mt-2 text-ivory/40">{label}</p>
      <p className="mt-0.5 text-ivory">{value}</p>
    </div>
  );
}
