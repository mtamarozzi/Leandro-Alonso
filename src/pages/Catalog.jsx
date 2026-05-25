import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowLeft, BedDouble, Bath, Car, Maximize, MapPin } from 'lucide-react';
import logo from '../../Logo/Logo_branca.png';
import { supabase } from '../lib/supabase';

function formatBRL(v) {
  if (v == null) return null;
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

function priceLabel(p) {
  if (p.purpose === 'locacao') return p.rent_price ? `${formatBRL(p.rent_price)}/mês` : 'Sob consulta';
  return formatBRL(p.sale_price) || 'Sob consulta';
}

function coverUrl(media) {
  if (!media || !media.length) return null;
  const sorted = [...media].sort(
    (a, b) => (b.is_cover === true) - (a.is_cover === true) || (a.display_order ?? 0) - (b.display_order ?? 0)
  );
  return sorted[0]?.url || null;
}

const SELECT =
  'id,ref_code,purpose,status,city,neighborhood,bedrooms,suites,bathrooms,parking_spots,usable_area_m2,sale_price,rent_price,is_featured,media(url,is_cover,display_order)';

export default function Catalog() {
  const [properties, setProperties] = useState(null);
  const [error, setError] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!supabase) {
        setError('Catálogo indisponível no momento.');
        setProperties([]);
        return;
      }
      const { data, error: err } = await supabase
        .from('properties')
        .select(SELECT)
        .eq('is_public', true)
        .in('status', ['disponivel', 'reservado'])
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
      if (!alive) return;
      if (err) {
        setError('Não consegui carregar os imóveis agora.');
        setProperties([]);
        return;
      }
      setProperties(data || []);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (properties && properties.length && gridRef.current) {
      const ctx = gsap.context(() => {
        gsap.from('.cat-card', {
          opacity: 0,
          y: 32,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
        });
      }, gridRef);
      return () => ctx.revert();
    }
  }, [properties]);

  return (
    <div className="min-h-screen bg-obsidian text-ivory">
      {/* header */}
      <header className="sticky top-0 z-20 border-b border-ivory/10 bg-obsidian/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Leandro Alonso" className="h-8 w-auto" />
          </Link>
          <Link
            to="/"
            className="font-data flex items-center gap-2 text-ivory/60 transition hover:text-champagne"
          >
            <ArrowLeft size={14} /> Voltar ao site
          </Link>
        </div>
      </header>

      {/* hero da página */}
      <section className="mx-auto max-w-6xl px-6 pb-4 pt-14">
        <p className="font-data text-champagne">Catálogo</p>
        <h1 className="font-drama mt-3 text-4xl leading-tight text-ivory md:text-5xl">
          Imóveis selecionados
        </h1>
        <p className="mt-4 max-w-xl text-ivory/60">
          Oportunidades em Santos e região, com curadoria do Leandro Alonso.
        </p>
      </section>

      {/* grid */}
      <main ref={gridRef} className="mx-auto max-w-6xl px-6 pb-24 pt-8">
        {properties === null && <p className="font-data text-ivory/40">Carregando imóveis…</p>}

        {properties && properties.length === 0 && (
          <p className="text-ivory/50">{error || 'Nenhum imóvel disponível no momento.'}</p>
        )}

        {properties && properties.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => {
              const cover = coverUrl(p.media);
              return (
                <article
                  key={p.id}
                  className="cat-card group overflow-hidden rounded-3xl border border-ivory/10 bg-slate/30 transition hover:border-champagne/40"
                >
                  {/* foto */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate">
                    {cover ? (
                      <img
                        src={cover}
                        alt={`${p.neighborhood}, ${p.city}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate to-obsidian">
                        <span className="font-data text-ivory/30">Foto em breve</span>
                      </div>
                    )}
                    {p.status === 'reservado' && (
                      <span className="font-data absolute left-3 top-3 rounded-full bg-obsidian/80 px-3 py-1 text-champagne backdrop-blur">
                        Reservado
                      </span>
                    )}
                    <span className="font-data absolute right-3 top-3 rounded-full bg-champagne/90 px-3 py-1 text-obsidian">
                      {p.purpose === 'locacao' ? 'Locação' : p.purpose === 'lancamento' ? 'Lançamento' : 'Venda'}
                    </span>
                  </div>

                  {/* conteúdo */}
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-ivory/60">
                      <MapPin size={14} className="text-champagne" />
                      <span className="text-sm">
                        {p.neighborhood}, {p.city}
                      </span>
                    </div>

                    <p className="font-drama mt-2 text-2xl text-ivory">{priceLabel(p)}</p>

                    <div className="mt-4 flex flex-wrap gap-4 border-t border-ivory/10 pt-4 text-ivory/70">
                      {p.bedrooms > 0 && (
                        <span className="flex items-center gap-1.5 text-sm">
                          <BedDouble size={15} className="text-ivory/40" /> {p.bedrooms}
                        </span>
                      )}
                      {p.bathrooms > 0 && (
                        <span className="flex items-center gap-1.5 text-sm">
                          <Bath size={15} className="text-ivory/40" /> {p.bathrooms}
                        </span>
                      )}
                      {p.parking_spots > 0 && (
                        <span className="flex items-center gap-1.5 text-sm">
                          <Car size={15} className="text-ivory/40" /> {p.parking_spots}
                        </span>
                      )}
                      {p.usable_area_m2 && (
                        <span className="flex items-center gap-1.5 text-sm">
                          <Maximize size={15} className="text-ivory/40" /> {p.usable_area_m2} m²
                        </span>
                      )}
                    </div>

                    {p.ref_code && (
                      <p className="font-data mt-4 text-ivory/30">Ref. {p.ref_code}</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
