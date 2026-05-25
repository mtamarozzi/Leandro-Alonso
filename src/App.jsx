import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logoHero from '../Logo/Logo_branca.png';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  Globe, 
  Menu, 
  X, 
  Instagram, 
  Linkedin,
  Calendar,
  Layers,
  Activity,
  Zap,
  CheckCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

gsap.registerPlugin(ScrollTrigger);

// --- COMPONENTS ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ease-out flex items-center gap-8 px-6 py-3",
        scrolled
          ? "pill-container border-ivory/20 opacity-100 translate-y-0 pointer-events-auto"
          : "bg-transparent border-transparent opacity-0 -translate-y-4 pointer-events-none"
      )}>
        <div className="flex items-center gap-2">
          <img src={logoHero} alt="Leandro Alonso" className="h-10 w-auto object-contain" />
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/imoveis" className="font-data hover:text-champagne transition-colors">
            Imóveis
          </Link>
          {[{label: 'Diferenciais', href: '#expertise'}, {label: 'Como Funciona', href: '#protocolo'}, {label: 'Manifesto', href: '#filosofia'}, {label: 'Contato', href: '#contato'}].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="font-data hover:text-champagne transition-colors"
          >
            {link.label}
          </a>
        ))}
        </div>

        <a
          href="https://wa.me/5513981811433"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-magnetic btn-p-color rounded-full !px-5 !py-2 !text-[0.6rem] hidden md:inline-flex items-center justify-center whitespace-nowrap"
        >
          Agendar
        </a>

        <button
          className="md:hidden text-ivory hover:text-champagne transition-colors"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* Mobile Floating Menu */}
      <div className={cn(
        "fixed inset-0 z-[200] transition-all duration-500",
        menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-xl" onClick={() => setMenuOpen(false)} />
        <div className={cn(
          "absolute top-0 right-0 h-full w-full max-w-sm bg-obsidian border-l border-ivory/10 flex flex-col p-8 transition-transform duration-500",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex items-center justify-between mb-12">
            <img src={logoHero} alt="Leandro Alonso" className="h-12 w-auto object-contain" />
            <button
              className="text-ivory/60 hover:text-champagne transition-colors"
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-6 flex-1">
            <Link
              to="/imoveis"
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-bold text-ivory hover:text-champagne transition-colors border-b border-ivory/5 pb-6"
            >
              Imóveis
            </Link>
          {[{label: 'Diferenciais', href: '#expertise'}, {label: 'Como Funciona', href: '#protocolo'}, {label: 'Manifesto', href: '#filosofia'}, {label: 'Contato', href: '#contato'}].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-bold text-ivory hover:text-champagne transition-colors border-b border-ivory/5 pb-6"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="https://wa.me/5513981811433"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-magnetic btn-p-color rounded-full px-6 py-3 text-xs inline-flex items-center justify-center whitespace-nowrap mt-8"
          >
            Agendar Consultoria
          </a>
        </div>
      </div>
    </>
  );
};

const Hero = () => {
  const heroRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(text1Ref.current, { y: 60, opacity: 0, duration: 1.2, ease: "power3.out" })
        .from(text2Ref.current, { y: 80, opacity: 0, duration: 1.5, ease: "power4.out" }, "-=0.8")
        .from(btnRef.current, { scale: 0.8, opacity: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.6");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[100dvh] w-full flex flex-col overflow-hidden">
      {/* Background with Overlays */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/Imagens/3.jpg"
          alt="Santos - Consultoria Imobiliária"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/40" />
      </div>

      {/* Hero Logo — top left */}
      <div className="relative z-10 pt-8 pb-4 px-6 md:px-24">
        <img
          src={logoHero}
          alt="Leandro Alonso"
          className="w-64 md:w-96 h-auto object-contain transition-all duration-500"
        />
      </div>

      {/* Content — centered vertically and horizontally */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 md:px-24">
        {/* Title */}
        <h1 ref={text1Ref} className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-ivory leading-tight mb-4 max-w-5xl">
          Decisões imobiliárias mais inteligentes
        </h1>
        <h2 ref={text2Ref} className="text-4xl sm:text-5xl md:text-8xl font-drama text-champagne leading-[0.9] mb-10 max-w-5xl">
          começam com dados.
        </h2>

        {/* Subtitle */}
        <p className="text-ivory/70 text-base md:text-lg max-w-2xl mb-6 leading-relaxed">
          Leandro Alonso atua para transformar compra, venda e gestão de imóveis em estratégias seguras, rentáveis e orientadas pelo mercado.
        </p>

        {/* Support text */}
        <p className="text-ivory/40 text-sm md:text-base max-w-xl mb-12 leading-relaxed">
          Em vez de apostar em anúncios ou promessas, você recebe uma consultoria baseada em liquidez, valorização, documentação e análise real de mercado em Santos e região.
        </p>

        {/* CTA */}
        <div ref={btnRef} className="flex flex-col items-center gap-4">
          <a 
            href="https://wa.me/5513981811433" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-magnetic btn-p-color rounded-2xl group flex items-center gap-3 px-10 py-4 text-sm font-bold tracking-wider"
          >
            <span>QUERO UMA CONSULTORIA</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <span className="font-data !lowercase tracking-normal text-ivory/40 text-[0.6rem]">
            Atendimento personalizado • Compra • Venda • Gestão patrimonial
          </span>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="relative z-10 h-16" />
    </section>
  );
};

const CardShuffler = () => {
  const [items, setItems] = useState([
    { id: 1, title: "Preço", desc: "Análise de valor real versus preço de mercado para identificar as melhores oportunidades." },
    { id: 2, title: "Localização", desc: "Potencial de valorização e liquidez da região, história e tendências do bairro." },
    { id: 3, title: "Documentação", desc: "Verificação completa de regularidade, autorizações e segurança jurídica do imóvel." }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setItems(prev => {
        const next = [...prev];
        const last = next.pop();
        next.unshift(last);
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-64 relative w-full perspective-1000">
      {items.map((item, index) => (
        <div 
          key={item.id}
          className="absolute inset-0 bg-obsidian border border-ivory/10 p-6 rounded-3xl transition-all duration-1000 shadow-2xl"
          style={{
            zIndex: 10 - index,
            transform: `translateY(${index * -12}px) scale(${1 - index * 0.05})`,
            opacity: index === 0 ? 1 : 0.4,
            filter: index === 0 ? 'none' : 'blur(1px)'
          }}
        >
          <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center text-champagne mb-4">
            {index === 0 ? <Zap size={20} /> : <Layers size={20} />}
          </div>
          <h4 className="text-ivory font-bold mb-2">{item.title}</h4>
          <p className="text-ivory/60 text-xs leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  );
};

const TelemetryTypewriter = () => {
  const [text, setText] = useState("");
  const fullText = "ANÁLISE >> Comparativo de mercado: Gonzaga, Santos. Valorização 12 meses: +8.2%. Liquidez: Alta. Documentação: Regular. Recomendação: Favorável.";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i = (i + 1) % (fullText.length + 20);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-obsidian border border-ivory/5 rounded-3xl h-full font-mono text-[0.65rem]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-ivory/40 uppercase tracking-widest">Análise de Mercado</span>
      </div>
      <div className="text-champagne/80 leading-loose break-all">
        {text}<span className="inline-block w-1 h-3 bg-champagne ml-1 animate-ping" />
      </div>
      <div className="mt-8 border-t border-ivory/5 pt-4 opacity-30 flex justify-between">
        <span>SANTOS_MKT_V2</span>
        <span>Baixada Santista</span>
      </div>
    </div>
  );
};

const ProtocolScheduler = () => {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const [activeDay, setActiveDay] = useState(2);
  
  return (
    <div className="p-6 bg-obsidian/40 border border-ivory/10 rounded-3xl h-full">
      <div className="font-data mb-6 flex justify-between items-center">
        <span>AGENDAMENTO</span>
        <Calendar size={14} className="text-champagne" />
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => (
          <button 
            key={day}
            onClick={() => setActiveDay(i)}
            className={cn(
              "h-10 flex flex-col items-center justify-center rounded-xl transition-all duration-300",
              activeDay === i ? "bg-champagne text-obsidian shadow-lg shadow-champagne/20" : "border border-ivory/10 text-ivory/40 hover:border-champagne/40"
            )}
          >
            <span className="text-[0.5rem] uppercase font-bold">{day}</span>
          </button>
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-3">
        {[1,2].map(i => (
          <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-ivory/5 border border-ivory/5">
            <span className="text-[0.6rem] font-bold text-ivory opacity-60 italic">{i === 1 ? 'Consultoria Inicial' : 'Análise de Portfólio'}</span>
            <div className={cn("w-2 h-2 rounded-full", i === 1 ? "bg-emerald-500" : "bg-champagne")} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section id="expertise" className="py-16 md:py-24 px-6 md:px-24 bg-obsidian">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="font-data text-ivory/40">DIFERENCIAL 01</div>
          <CardShuffler />
          <h3 className="text-xl font-bold mt-4">Curadoria Inteligente</h3>
          <p className="text-ivory/40 text-sm leading-relaxed">Nem todo imóvel é uma boa oportunidade. Antes de recomendar qualquer opção, analisamos preço, localização, potencial de valorização, liquidez e histórico da região.</p>
          <p className="text-ivory/50 text-sm leading-relaxed">Você recebe apenas imóveis que realmente fazem sentido para o seu objetivo.</p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="font-data text-ivory/40">DIFERENCIAL 02</div>
          <div className="h-64">
            <TelemetryTypewriter />
          </div>
          <h3 className="text-xl font-bold mt-4">Transparência em Cada Decisão</h3>
          <p className="text-ivory/40 text-sm leading-relaxed">Você entende exatamente por que cada imóvel foi selecionado.</p>
          <p className="text-ivory/50 text-sm leading-relaxed">Apresentamos comparativos, dados de mercado, tendências de preço e todos os fatores que influenciam a compra ou a venda, para que a decisão seja feita com clareza e segurança.</p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="font-data text-ivory/40">DIFERENCIAL 03</div>
          <div className="h-64">
            <ProtocolScheduler />
          </div>
          <h3 className="text-xl font-bold mt-4">Consultoria de Precisão</h3>
          <p className="text-ivory/40 text-sm leading-relaxed">Cada cliente possui um objetivo diferente: morar, investir, vender ou proteger patrimônio.</p>
          <p className="text-ivory/50 text-sm leading-relaxed">Por isso, a estratégia é construída de forma personalizada, considerando seu momento, perfil e resultado esperado.</p>
        </div>
      </div>
    </section>
  );
};

const Philosophy = () => {
  const container = useRef(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".reveal-text", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: "power4.out"
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section id="filosofia" ref={container} className="relative py-24 md:py-48 px-6 md:px-24 bg-obsidian overflow-hidden">


      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <span className="font-data text-champagne block mb-8 reveal-text">O MANIFESTO</span>
        <h2 className="text-2xl md:text-4xl text-ivory/60 leading-relaxed reveal-text">
          A maioria do mercado tenta <span className="text-ivory/90">vender imóveis</span>.
        </h2>
        <h2 className="text-5xl md:text-8xl font-drama text-champagne mt-8 reveal-text leading-[0.9]">
          Nós ajudamos você a tomar a decisão certa.
        </h2>
        <p className="mt-16 text-ivory/50 font-sans text-lg max-w-3xl mx-auto leading-loose reveal-text md:whitespace-nowrap">
          A consultoria imobiliária não deve ser baseada em pressão, pressa ou achismos.
        </p>
        <p className="mt-6 text-ivory/40 font-sans text-base max-w-2xl mx-auto leading-loose reveal-text">
          Nosso trabalho é traduzir o mercado, proteger seu patrimônio e construir uma estratégia clara para que cada imóvel gere segurança, liquidez e valor ao longo do tempo.
        </p>
      </div>
    </section>
  );
};

const ProtocolCard = ({ number, title, desc, desc2, icon: Icon, colorClass, btnText }) => {
  const cardRef = useRef(null);
  
  return (
    <div className="sticky-card">
      <div
        className={cn(
          "w-full max-w-6xl bg-obsidian border border-ivory/10 rounded-3xl md:rounded-4xl py-10 px-6 md:py-16 md:px-14 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 relative group transition-all duration-700 overflow-hidden",
          "hover:border-champagne/40"
        )}
      >
        <div className="flex-1 min-w-0 space-y-4 md:space-y-6 w-full">
          <div className="font-mono text-champagne/40 text-2xl md:text-4xl reveal-num">{number}</div>
          <h3 className="text-2xl md:text-6xl font-bold text-ivory tracking-tight">{title}</h3>
          <p className="text-sm md:text-xl text-ivory/60 leading-relaxed">{desc}</p>
          {desc2 && <p className="text-base md:text-lg text-ivory/40 leading-relaxed max-w-xl">{desc2}</p>}
          <div className="pt-8">
            <button className="flex items-center gap-2 font-data text-champagne group-hover:gap-4 transition-all">
              {btnText || 'SAIBA MAIS'} <ArrowRight size={14} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 relative h-full w-full hidden md:flex items-center justify-center">
          <div className={cn("absolute inset-0 opacity-10 blur-3xl rounded-full", colorClass)} />
          <Icon size={320} className="text-ivory/5 transition-all duration-1000 group-hover:text-champagne/10 group-hover:scale-110" />
        </div>
      </div>
    </div>
  );
};

const Protocol = () => {
  const container = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".sticky-card");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: "top top",
            end: "bottom top",
            scrub: true,
            pin: true,
            pinSpacing: false,
          },
          scale: 0.9,
          filter: "blur(20px)",
          opacity: 0.3,
        });
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section id="protocolo" ref={container} className="bg-obsidian px-6 md:px-24">
      <ProtocolCard 
        number="01" 
        title="Mapeamento de Oportunidades" 
        desc="Analisamos o mercado, identificamos distorções de preço, imóveis com maior potencial e oportunidades alinhadas ao seu perfil."
        desc2="Antes de qualquer visita ou proposta, você já sabe quais opções realmente valem a pena."
        icon={Globe}
        colorClass="bg-blue-500"
        btnText="VER OPORTUNIDADES"
      />
      <ProtocolCard 
        number="02" 
        title="Segurança Jurídica e Patrimonial" 
        desc="Cada negociação é acompanhada com atenção à documentação, autorizações, regularidade do imóvel e proteção jurídica."
        desc2="O objetivo é evitar riscos e garantir uma compra, venda ou gestão patrimonial segura."
        icon={ShieldCheck}
        colorClass="bg-emerald-500"
        btnText="ENTENDER O PROCESSO"
      />
      <ProtocolCard 
        number="03" 
        title="Estratégia de Liquidez" 
        desc="Seja para vender mais rápido ou investir melhor, trabalhamos com uma estratégia voltada à liquidez."
        desc2="Preço, posicionamento, apresentação e timing são definidos para aumentar o valor percebido e acelerar resultados."
        icon={Activity}
        colorClass="bg-champagne"
        btnText="VER ESTRATÉGIA"
      />
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-obsidian border-t border-ivory/5 pt-16 md:pt-32 pb-12 px-6 md:px-24 rounded-t-4xl">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20 mb-16 md:mb-32">
          <div className="col-span-1 md:col-span-2">
            <img src={logoHero} alt="Leandro Alonso" className="w-40 md:w-72 h-auto object-contain mb-8" />
            <p className="text-ivory/40 text-lg max-w-sm mb-12">
              Consultoria imobiliária orientada por dados em Santos e região.
            </p>
            <div className="flex gap-6">
              <a href="https://instagram.com/leandro.alonso_imob" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-ivory/10 flex items-center justify-center text-ivory/40 hover:text-champagne hover:border-champagne transition-all">
                <Instagram size={20} />
              </a>
              <a href="https://wa.me/5513981811433" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-ivory/10 flex items-center justify-center text-ivory/40 hover:text-champagne hover:border-champagne transition-all">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="font-data text-ivory">SERVIÇOS</div>
            <ul className="space-y-4 text-ivory/40 text-sm">
              <li><a href="#expertise" className="hover:text-champagne transition-colors">Compra de Imóveis</a></li>
              <li><a href="#expertise" className="hover:text-champagne transition-colors">Venda de Imóveis</a></li>
              <li><a href="#expertise" className="hover:text-champagne transition-colors">Gestão Patrimonial</a></li>
              <li><a href="#protocolo" className="hover:text-champagne transition-colors">Consultoria</a></li>
            </ul>
          </div>
          
          <div id="contato" className="space-y-6">
            <div className="font-data text-ivory">CONTATO</div>
            <div className="text-ivory/40 text-sm leading-loose">
              Santos – SP<br />
              WhatsApp: (13) 98181-1433<br />
              Atendimento personalizado
            </div>
          </div>
        </div>
        
        <div className="border-t border-ivory/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-data !lowercase">consultoria ativa</span>
          </div>
          <div className="text-ivory/20 font-data text-[0.55rem]">
            © 2025 LEANDRO ALONSO. TODOS OS DIREITOS RESERVADOS.
          </div>
        </div>
      </div>
    </footer>
  );
};

const ForWho = () => {
  const container = useRef(null);
  const items = [
    "Quem deseja comprar um imóvel com mais segurança e menos risco.",
    "Quem quer vender sem depender apenas de anúncios e baixar o preço.",
    "Investidores que buscam imóveis com liquidez e potencial de valorização.",
    "Proprietários que desejam proteger e organizar seu patrimônio imobiliário.",
    "Pessoas que valorizam atendimento próximo, clareza e estratégia."
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".forwho-item", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        stagger: 0,
        duration: 1,
        ease: "power3.out"
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="py-24 md:py-40 px-6 md:px-24 bg-obsidian">
      <div className="max-w-4xl mx-auto">
        <span className="font-data text-champagne block mb-6 forwho-item">PARA QUEM É</span>
        <h2 className="text-3xl md:text-5xl font-bold text-ivory tracking-tight mb-16 forwho-item">
          Para quem esta consultoria é <span className="font-drama italic text-champagne">ideal</span>
        </h2>
        <div className="flex flex-col gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="forwho-item flex items-start gap-5 p-6 rounded-2xl border border-ivory/5 bg-ivory/[0.02] hover:border-champagne/30 transition-all duration-500 group"
            >
              <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-champagne/10 flex items-center justify-center group-hover:bg-champagne/20 transition-colors">
                <CheckCircle size={18} className="text-champagne" />
              </div>
              <p className="text-ivory/70 text-base md:text-lg leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutConsultant = () => {
  const container = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".about-reveal", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        stagger: 0,
        duration: 1.2,
        ease: "power3.out"
      });
    }, container);
    return () => ctx.revert();
  }, []);

  const highlights = [
    "Consultoria imobiliária orientada por dados",
    "Especialista em Santos e região",
    "Foco em liquidez e valorização",
    "Atendimento transparente e personalizado"
  ];

  return (
    <section ref={container} className="py-24 md:py-40 px-6 md:px-24 bg-obsidian overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <span className="font-data text-champagne block mb-6 about-reveal">SOBRE O CONSULTOR</span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Photo */}
          <div className="about-reveal relative flex justify-center md:justify-start">
            <div className="relative w-72 md:w-96 rounded-3xl overflow-hidden">
              <img
                src="/Imagens/Leandro.png"
                alt="Leandro Alonso"
                className="w-full h-auto object-cover"
              />
              {/* Gradient fade to blend with obsidian bg */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-obsidian/30 via-transparent to-obsidian/30" />
            </div>
          </div>

          {/* Text */}
          <div className="about-reveal space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-ivory tracking-tight">
              Conheça <span className="font-drama italic text-champagne">Leandro Alonso</span>
            </h2>

            <p className="text-ivory/60 text-base md:text-lg leading-relaxed">
              Leandro Alonso é consultor imobiliário em Santos – SP, atuando com foco em estratégia, dados e segurança patrimonial.
            </p>
            <p className="text-ivory/50 text-base leading-relaxed">
              Seu trabalho une análise de mercado, clareza nas negociações e atenção jurídica para ajudar clientes a comprar, vender e administrar imóveis com mais inteligência.
            </p>
            <p className="text-ivory/40 text-sm leading-relaxed">
              Mais do que intermediar negociações, Leandro acompanha cada etapa da jornada para que a decisão seja segura, bem fundamentada e alinhada aos objetivos do cliente.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-8 border-t border-ivory/10">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-ivory/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-champagne flex-shrink-0 mt-1.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Credibility = () => {
  const container = useRef(null);

  const metrics = [
    { value: "+200", label: "Imóveis negociados" },
    { value: "+150", label: "Clientes atendidos" },
    { value: "Santos", label: "e região" },
    { value: "100%", label: "Acompanhamento do início ao fechamento" }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".cred-reveal", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        stagger: 0,
        duration: 1.2,
        ease: "power3.out"
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="py-24 md:py-40 px-6 md:px-24 bg-obsidian relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-champagne/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <span className="font-data text-champagne block mb-6 cred-reveal">CREDIBILIDADE</span>
        <h2 className="text-3xl md:text-5xl font-bold text-ivory tracking-tight mb-6 cred-reveal">
          Por que clientes escolhem <span className="font-drama italic text-champagne">esse método</span>
        </h2>
        <p className="text-ivory/60 text-base md:text-lg max-w-2xl mb-6 leading-relaxed cred-reveal">
          Porque a decisão deixa de ser emocional e passa a ser estratégica.
        </p>
        <p className="text-ivory/40 text-base max-w-2xl mb-16 leading-relaxed cred-reveal">
          Com análise, documentação, posicionamento e acompanhamento próximo, cada negociação acontece com mais confiança, previsibilidade e resultado.
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 cred-reveal">
          {metrics.map((item, i) => (
            <div
              key={i}
              className="p-6 md:p-8 rounded-2xl border border-ivory/5 bg-ivory/[0.02] text-center hover:border-champagne/30 transition-all duration-500"
            >
              <div className="text-3xl md:text-4xl font-bold text-champagne mb-2">{item.value}</div>
              <div className="text-ivory/40 text-xs md:text-sm font-data">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const move = (e) => {
      el.style.transform = `translate(${e.clientX - 8}px, ${e.clientY - 8}px)`;
      el.style.opacity = '1';
    };
    const hide = () => { el.style.opacity = '0'; };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', hide);
    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', hide);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 bg-champagne rounded-full mix-blend-difference pointer-events-none z-[9999] hidden md:block transition-opacity duration-300"
      style={{ opacity: 0 }}
    />
  );
};

// --- MAIN APP ---

const App = () => {
  return (
    <div className="relative min-h-screen bg-obsidian text-ivory selection:bg-champagne selection:text-obsidian">
      {/* Noise Overlay Filter */}
      <div className="noise-overlay" />
      
      <Navbar />
      
      <main>
        <Hero />
        <Features />
        <Philosophy />
        <Protocol />
        <ForWho />
        <AboutConsultant />
        <Credibility />

        {/* CTA Final */}
        <section className="py-16 md:py-32 px-6 md:px-24 text-center bg-ivory text-obsidian rounded-3xl md:rounded-4xl mx-4 md:mx-12 my-16 md:my-24 overflow-hidden relative group">
          <div className="absolute inset-0 bg-obsidian opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700" />
          <h2 className="text-3xl md:text-7xl font-bold mb-8 tracking-tighter">
            Seu próximo imóvel não <br className="hidden md:block" /> 
            <span className="font-drama italic font-medium">precisa ser uma aposta.</span>
          </h2>
          <p className="text-obsidian/60 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Agende uma conversa e descubra qual é a melhor estratégia para comprar, vender ou proteger seu patrimônio com mais segurança.
          </p>
          <div className="flex justify-center">
            <a 
              href="https://wa.me/5513981811433" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-magnetic bg-obsidian text-ivory px-12 py-4 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs shadow-2xl !inline-flex !w-auto"
            >
              AGENDAR CONSULTORIA
            </a>
          </div>
          <p className="mt-8 text-obsidian text-base">
            Atendimento em Santos e região • WhatsApp: (13) 98181-1433
          </p>
        </section>
      </main>

      <Footer />

      <CustomCursor />
    </div>
  );
};

export default App;
