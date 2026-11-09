import React, { useState, useEffect } from 'react'
import AdminPanel from './AdminPanel'
import ClowayWidget from './ClowayWidget'
import BlogPage from './BlogPage'
import { loadSiteData } from './defaultSiteData'

const ACCESS_CODE = 'sa2026'
const MASTER_RECOVERY_CODE = 'sfl2026'

export default function App() {
  // Detect /painel route or ?painel query parameter
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    const path = window.location.pathname.toLowerCase()
    const search = window.location.search.toLowerCase()
    return path === '/painel' || path.startsWith('/painel/') || search.includes('painel')
  })

  // Detect /blog route or ?blog query parameter (Aba Exclusiva do Blog)
  const [isBlogRoute, setIsBlogRoute] = useState(() => {
    const path = window.location.pathname.toLowerCase()
    const search = window.location.search.toLowerCase()
    return path === '/blog' || path.startsWith('/blog/') || search.includes('blog')
  })

  const openBlogTab = () => {
    setIsBlogRoute(true)
    window.history.pushState({}, '', '/blog')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeBlogTab = () => {
    setIsBlogRoute(false)
    window.history.pushState({}, '', isClowayModel ? '/cloway' : '/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Detect Modelo 2 (/cloway or ?cloway) vs Modelo 1 (Padrão WhatsApp)
  const [isClowayModel, setIsClowayModel] = useState(() => {
    const path = window.location.pathname.toLowerCase()
    const search = window.location.search.toLowerCase()
    return path === '/cloway' || path.startsWith('/cloway/') || search.includes('cloway')
  })

  // Cloway Chat Window open/close & context trigger
  const [clowayOpen, setClowayOpen] = useState(false)
  const [clowayContext, setClowayContext] = useState('')

  const openClowayWithPrompt = (promptText = '') => {
    setClowayOpen(true)
    if (promptText) {
      setClowayContext(promptText + ' [' + Date.now() + ']')
    }
  }

  const switchModel = (useCloway) => {
    setIsClowayModel(useCloway)
    if (!useCloway) {
      setClowayOpen(false)
      window.history.pushState({}, '', '/')
    } else {
      window.history.pushState({}, '', '/cloway')
    }
  }

  // Editable CMS site data loaded from localStorage (with full default fallback)
  const [siteData, setSiteData] = useState(() => loadSiteData())

  // Selected blog post for reading full article in modal
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase()
      const search = window.location.search.toLowerCase()
      setIsAdminRoute(path === '/painel' || path.startsWith('/painel/') || search.includes('painel'))
      setIsBlogRoute(path === '/blog' || path.startsWith('/blog/') || search.includes('blog'))
      setIsClowayModel(
        path === '/cloway' || path.startsWith('/cloway/') || search.includes('cloway')
      )
      setSiteData(loadSiteData())
    }
    const handleStorage = () => {
      setSiteData(loadSiteData())
    }
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  // Access Gate State (Homologação Restrita)
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem('sa_homolog_unlocked') === 'true'
    } catch {
      return false
    }
  })
  const [accessInput, setAccessInput] = useState('')
  const [accessError, setAccessError] = useState(false)

  const [activeSlide, setActiveSlide] = useState(0)
  const [activePlanIndex, setActivePlanIndex] = useState(0)

  const whatsappNumber = siteData.whatsappNumber || '5551999009900'

  const carouselImages = siteData.modalitiesSection?.carouselImages?.length
    ? siteData.modalitiesSection.carouselImages
    : [{ src: '/images/img4815.jpg', alt: 'S.A Treinamento' }]

  // Auto-advance carousel every 5s like Elementor's swiper settings (autoplay_speed: 5000)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [carouselImages.length])

  // Proteção do HTML / Código-fonte contra inspeção, cópia ou salvamento indevido
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (!isUnlocked) {
        e.preventDefault()
      }
    }
    const handleKeyDown = (e) => {
      const key = (e.key || '').toLowerCase()
      const ctrlOrMeta = e.ctrlKey || e.metaKey
      if (
        e.key === 'F12' ||
        (ctrlOrMeta && e.shiftKey && ['i', 'j', 'c'].includes(key)) ||
        (ctrlOrMeta && ['u', 's'].includes(key)) ||
        (!isUnlocked && ctrlOrMeta && key === 'p')
      ) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isUnlocked])

  // If user is on /painel, render the Admin CMS Panel directly
  if (isAdminRoute) {
    return (
      <AdminPanel
        onBackToSite={() => {
          window.history.pushState({}, '', '/')
          setSiteData(loadSiteData())
          setIsAdminRoute(false)
        }}
      />
    )
  }

  const handleUnlock = (e) => {
    e.preventDefault()
    const currentGatePass = (siteData.security?.gatePass || ACCESS_CODE).trim().toLowerCase()
    const typed = accessInput.trim().toLowerCase()
    if (typed === currentGatePass || typed === MASTER_RECOVERY_CODE) {
      setIsUnlocked(true)
      setAccessError(false)
      try {
        sessionStorage.setItem('sa_homolog_unlocked', 'true')
      } catch {
        // ignore storage errors
      }
    } else {
      setAccessError(true)
    }
  }

  // Bloqueio Real de DOM: Enquanto não digitar a senha (e o bloqueio estiver ativo), o HTML do site NÃO é renderizado na página
  const isGateActive = siteData.security?.gateEnabled !== false
  if (isGateActive && !isUnlocked) {
    return (
      <div
        onContextMenu={(e) => e.preventDefault()}
        className="fixed inset-0 z-[100] bg-[#0B0C0E] text-white flex flex-col justify-between p-6 overflow-hidden select-none"
      >
        {/* Glow Dourado de Fundo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-[#D4AF37]/12 blur-[140px]"
        />

        {/* Top Bar */}
        <div className="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs font-poppins uppercase tracking-[0.16em] text-white/60">
            <i className="fas fa-lock text-[#D4AF37]" aria-hidden="true"></i>
            <span>Ambiente de Homologação Restrito</span>
          </div>
          <span className="text-xs font-poppins tracking-widest text-white/40">
            PROJETO EXCLUSIVO • 2026
          </span>
        </div>

        {/* Center Card */}
        <div className="relative z-10 w-full max-w-md mx-auto my-auto">
          <div className="rounded-2xl bg-[#141416]/95 border border-[#D4AF37]/25 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95)] p-8 sm:p-10 backdrop-blur-xl text-center">
            <div className="flex justify-center mb-6">
              <img
                src="/images/logo-sa.png"
                alt="S.A Treinamento"
                className="w-24 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.25)] border border-[#D4AF37]/30"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[11px] font-poppins uppercase tracking-[0.14em] text-[#FFF2CD] mb-4">
              <span>Apresentação &amp; Acompanhamento Ao Vivo</span>
            </div>

            <h2 className="font-bebas italic text-4xl sm:text-5xl font-semibold sa-degrade-hero mb-2">
              Acesso Exclusivo S.A Treinamento
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-poppins leading-relaxed mb-7">
              Insira a credencial de acesso fornecida para visualizar a evolução e finalização do
              novo site oficial.
            </p>

            <form onSubmit={handleUnlock} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-poppins uppercase tracking-wider text-white/60 mb-1.5">
                  Credencial de Acesso
                </label>
                <input
                  type="password"
                  value={accessInput}
                  onChange={(e) => {
                    setAccessInput(e.target.value)
                    if (accessError) setAccessError(false)
                  }}
                  placeholder="Digite a senha de acesso..."
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#D4AF37] transition"
                />
                {accessError && (
                  <p className="text-xs text-red-400 mt-2 font-poppins">
                    Credencial inválida. Verifique a senha informada e tente novamente.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="sa-btn-gold w-full py-4 px-6 text-[24px] tracking-wider"
              >
                <span>Acessar Ambiente do Projeto</span>
                <i className="fas fa-arrow-right text-[18px] ml-2.5 sa-btn-icon" aria-hidden="true"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/40 pb-2">
          <span>© 2026 S.A Treinamento • Ambiente de Homologação</span>
          <span>Viva o agora, viva a S.A!</span>
        </div>
      </div>
    )
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % carouselImages.length)
  }

  // Dynamic Marquee Units derived from current units list
  const unitSingleLineNames = (siteData.unitsSection?.items || []).map((u) =>
    (u.name || '').replace(/\s*\n\s*/g, ' ').trim()
  )
  const marqueeUnits =
    unitSingleLineNames.length > 0
      ? [
          ...unitSingleLineNames,
          ...unitSingleLineNames,
          ...unitSingleLineNames,
          ...unitSingleLineNames,
        ]
      : [
          'Unidade Antônio de Carvalho',
          'Unidade Protásio',
          'Unidade Pasqualini',
          'Unidade Antônio de Carvalho',
          'Unidade Protásio',
          'Unidade Pasqualini',
        ]

  const bentoCards = siteData.about.cards || []
  const modalities = siteData.modalitiesSection.items || []
  const units = siteData.unitsSection?.items || []
  const plansList = siteData.plansSection?.plansList || []
  const currentPlan = plansList[activePlanIndex] || plansList[0] || {
    label: 'Mensal',
    title: 'Plano Mensal',
    subtitle: 'à partir de',
    price: 'R$97,00',
    note: '',
    features: [],
  }
  const testimonials = siteData.testimonials || []
  const blogPosts = siteData.blogSection?.posts || []

  // Strip timestamp suffix when passing initialContext to ClowayWidget
  const cleanClowayContext = clowayContext ? clowayContext.replace(/\s*\[\d+\]$/, '') : ''
  const assistantName = siteData.clowayConfig?.assistantName || 'SA Virtual'
  const clowayDisabled = siteData.clowayConfig?.mode === 'DESATIVADO'
  const showModelSwitcher =
    !clowayDisabled && siteData.clowayConfig?.showModelSwitcher !== false
  const activeClowayModel = !clowayDisabled && isClowayModel

  // Se o visitante clicou em "Blog" (ou acessou /blog), abre a Aba Exclusiva do Blog
  if (isBlogRoute) {
    return (
      <>
        <BlogPage
          siteData={siteData}
          onBackToHome={closeBlogTab}
          activeClowayModel={activeClowayModel}
          assistantName={assistantName}
          onOpenCloway={(prompt) => openClowayWithPrompt(prompt)}
        />
        {activeClowayModel && (
          <ClowayWidget
            isOpen={clowayOpen}
            onOpen={() => setClowayOpen(true)}
            onClose={() => setClowayOpen(false)}
            initialContext={cleanClowayContext}
            siteData={siteData}
          />
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white relative overflow-x-hidden">
      {/* ==================== FLOATING HEADER (elementor-228) ==================== */}
      <header className="relative z-30 w-full">
        {/* Mobile Logo Header */}
        <div className="md:hidden flex justify-center pt-8 pb-2">
          <a href="#topo" className="inline-block">
            <img
              src="/images/logo-sa.png"
              alt="S.A Treinamento"
              className="w-24 rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.5)] brightness-90"
            />
          </a>
        </div>

        {/* Desktop/Tablet Floating Glassmorphic Bar */}
        <div className="hidden md:flex sa-glass-header w-[85%] max-w-[1216px] mx-auto translate-y-[30px] px-6 py-2.5 items-center justify-between">
          <a href="#topo" className="inline-block ml-6 lg:ml-10">
            <img
              src="/images/logo-sa.png"
              alt="S.A Treinamento"
              className="w-[82px] rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.5)] brightness-90 hover:brightness-100 transition"
            />
          </a>

          <nav className="hidden lg:flex flex-wrap items-center justify-center gap-6 xl:gap-8 font-bebas tracking-wider text-xl text-white/90 italic">
            {(siteData.header?.navLinks || []).map((navItem, idx) => {
              const isBlogLink =
                (navItem.href || '').toLowerCase() === '#blog' ||
                (navItem.href || '').toLowerCase() === '/blog' ||
                (navItem.label || '').trim().toLowerCase() === 'blog'
              return (
                <a
                  key={idx}
                  href={isBlogLink ? '/blog' : navItem.href || '#topo'}
                  onClick={(e) => {
                    if (isBlogLink) {
                      e.preventDefault()
                      openBlogTab()
                    }
                  }}
                  className="hover:text-[#D4AF37] transition"
                >
                  {navItem.label}
                </a>
              )
            })}
          </nav>

          {activeClowayModel ? (
            <button
              type="button"
              onClick={() => openClowayWithPrompt(`Olá ${assistantName}! Quero tirar uma dúvida e agendar minha aula experimental.`)}
              className="sa-btn-gold px-7 py-3 text-[20px] tracking-[0.6px] leading-[0.9em] cursor-pointer"
            >
              <img
                src="/images/cloway-clo.webp"
                alt={assistantName}
                className="w-6 h-6 rounded-full object-cover border border-black/30 mr-2.5"
              />
              <span>Falar com a {assistantName} • IA 24h</span>
            </button>
          ) : (
            <a
              href="#oferta"
              className="sa-btn-gold px-8 py-3.5 text-[20px] tracking-[0.6px] leading-[0.9em]"
            >
              <i className="fab fa-whatsapp text-[20px] mr-2.5 sa-btn-icon" aria-hidden="true"></i>
              <span>{siteData.header?.ctaText || 'Contato pelo WhatsApp'}</span>
            </a>
          )}
        </div>
      </header>

      {/* ==================== HERO SECTION (880170b) ==================== */}
      <section
        id="topo"
        className="relative min-h-[860px] lg:min-h-[900px] flex flex-col justify-center pt-16 lg:pt-28 pb-12 -mt-6 lg:-mt-[80px] overflow-hidden bg-black"
      >
        {/* Background Image in Full Color with Soft Dark Vignette */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage: `url('${siteData.hero?.bgImage || '/images/img9788.jpg'}')`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 35% 50%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.82) 76%, #000000 100%)',
          }}
        />

        {/* Hero Main Container */}
        <div className="relative z-10 w-full max-w-[1216px] mx-auto px-6 lg:px-8 pt-12 lg:pt-16">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="font-bebas italic font-semibold text-[53px] sm:text-[68px] lg:text-[73px] leading-[1.05] sa-degrade-hero tracking-wide hover:scale-105 transition-transform duration-300 origin-left">
              {siteData.hero?.titleLine1}
            </h1>
            <h2 className="font-bebas italic font-semibold text-[82px] sm:text-[90px] lg:text-[96px] leading-[0.95] sa-degrade-hero tracking-wide -mt-1">
              {siteData.hero?.titleLine2}
            </h2>

            <p className="font-poppins font-light italic text-[15px] lg:text-[16px] text-white/95 max-w-[430px] pt-4 pb-6 leading-relaxed">
              {siteData.hero?.description}
            </p>

            {activeClowayModel ? (
              <button
                type="button"
                onClick={() => openClowayWithPrompt('📅 Agendar Aula Experimental')}
                className="sa-btn-gold px-8 sm:px-10 py-5 text-[22px] lg:text-[27px] tracking-wide cursor-pointer"
              >
                <img
                  src="/images/cloway-clo.webp"
                  alt={assistantName}
                  className="w-7 h-7 rounded-full object-cover border border-black/30 mr-2.5"
                />
                <span>Agendar Aula com a {assistantName}</span>
              </button>
            ) : (
              <a
                href="#oferta"
                className="sa-btn-gold px-8 sm:px-10 py-5 text-[22px] lg:text-[27px] tracking-wide"
              >
                <i className="fab fa-whatsapp text-[22px] mr-2.5 sa-btn-icon" aria-hidden="true"></i>
                <span>{siteData.hero?.ctaText || 'Agendar Aula Experimental'}</span>
              </a>
            )}

            {/* Client Avatars + Quote (c497cf0) */}
            <div className="mt-7 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center sa-profile-group">
                {(siteData.hero?.avatars || [
                  '/images/cliente3.webp',
                  '/images/cliente2.webp',
                  '/images/cliente1.webp',
                ]).map((avatarSrc, idx) => (
                  <img
                    key={idx}
                    src={avatarSrc}
                    alt={`Cliente S.A ${idx + 1}`}
                    className="sa-profile-item w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]/40"
                  />
                ))}
              </div>
              <p className="font-poppins font-medium italic text-[13px] sm:text-[16px] text-white leading-snug text-center sm:text-left">
                &ldquo;{siteData.hero?.quoteLine1} <br />
                {siteData.hero?.quoteLine2}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Marquee Carousel of Units at Bottom of Hero (d3886ea) */}
        <div className="relative z-10 mt-14 lg:mt-24 overflow-hidden w-full">
          <div className="sa-marquee-track gap-4 px-4">
            {[...marqueeUnits, ...marqueeUnits].map((unit, idx) => (
              <div
                key={idx}
                className="inline-flex items-center bg-[#222222] border border-[#7d7d7d]/50 px-3.5 py-2 rounded-[25px] shrink-0"
              >
                <span className="inline-flex items-center justify-center bg-black border border-[#7d7d7d]/50 p-2.5 mr-2.5 rounded-full text-[#FFD700] text-[15px]">
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                </span>
                <span className="bg-[#333333] border border-[#7d7d7d]/50 px-4 py-2 rounded-[25px] font-bebas font-medium tracking-[2.5px] text-[#F5F5F5] text-[17px]">
                  {unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION: MUITO PRAZER, NÓS SOMOS A S.A TREINAMENTO (61bbec6) ==================== */}
      <section
        id="sobre"
        className="sa-section-notched relative z-20 bg-white text-[#222222] pt-20 lg:pt-28 pb-24 lg:pb-32 -mt-6 lg:-mt-12"
      >
        <div className="max-w-[1216px] mx-auto px-4 sm:px-6">
          {/* Heading */}
          <div className="text-center flex flex-col items-center">
            <h2 className="font-bebas italic font-semibold text-[32px] sm:text-[44px] lg:text-[52px] text-[#222222] tracking-[0.5px] leading-none">
              {siteData.about?.subtitleTop}
            </h2>
            <h2 className="font-bebas italic font-semibold text-[58px] sm:text-[84px] lg:text-[110px] sa-degrade-title tracking-[0.5px] leading-none -mt-1">
              {siteData.about?.titleMain}
            </h2>
            <p className="font-poppins italic font-normal text-[15px] lg:text-[16px] text-[#222222] max-w-[780px] mt-2 leading-relaxed">
              {siteData.about?.description}
            </p>
          </div>

          {/* 7-Photo Bento Grid (c77d439) */}
          <div className="mt-10 lg:mt-16 flex flex-wrap justify-center gap-5">
            {bentoCards.map((card, index) => (
              <div
                key={index}
                className={`group relative w-full ${card.colClass} rounded-[40px] lg:rounded-[50px] overflow-hidden shadow-md cursor-pointer`}
              >
                <img
                  src={card.img}
                  alt={card.title}
                  loading="lazy"
                  className={`absolute inset-0 w-full h-full object-cover ${card.pos || 'object-center'} transition-transform duration-500 group-hover:scale-105`}
                />
                {/* Subtle dark vignette so image looks rich */}
                <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:opacity-0" />
                {/* Hover Content Overlay (Elementor #0000009C) */}
                <div className="relative z-10 h-full w-full bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-8 lg:p-12 flex flex-col justify-center rounded-[40px] lg:rounded-[50px]">
                  <h3 className="font-bebas font-semibold text-[36px] lg:text-[45px] leading-[1.2] text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="font-poppins text-[15px] lg:text-[17px] text-white/95 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION: VOCÊ SABE TUDO QUE A S.A TEM PARA OFERECER? (9cd31d1) ==================== */}
      <section
        id="modalidades"
        className="sa-section-notched relative z-20 bg-[#222222] text-white pt-20 lg:pt-28 pb-24 lg:pb-32 -mt-6 lg:-mt-14"
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6">
          {/* Heading */}
          <div className="text-center flex flex-col items-center">
            <h2 className="font-bebas italic font-semibold text-[39px] sm:text-[52px] lg:text-[62px] text-white tracking-[0.5px] leading-none">
              {siteData.modalitiesSection?.subtitleTop}
            </h2>
            <h2 className="font-bebas italic font-semibold text-[41px] sm:text-[54px] lg:text-[62px] sa-degrade-title tracking-[0.5px] leading-tight">
              {siteData.modalitiesSection?.titleMain}
            </h2>
            <p className="font-poppins italic font-normal text-[15px] lg:text-[16px] text-white/90 mt-1">
              {siteData.modalitiesSection?.description}
            </p>
          </div>

          {/* 2-Column Content: Left Image Carousel + Right 6 Modality Cards */}
          <div className="mt-8 lg:mt-12 flex flex-col lg:flex-row items-center gap-8">
            {/* Left Column: Image Carousel (c5d5468) */}
            <div className="w-full lg:w-[55%] p-2 sm:p-5">
              <div className="relative rounded-[20px] overflow-hidden shadow-2xl bg-[#161616] aspect-[3/2]">
                {carouselImages.map((slide, idx) => (
                  <img
                    key={`${slide.src}-${idx}`}
                    src={slide.src}
                    alt={slide.alt}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  />
                ))}

                {/* Prev Button */}
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Slide anterior"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-[#D4AF37] hover:scale-110 transition text-3xl sm:text-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] cursor-pointer"
                >
                  <i className="fas fa-chevron-circle-left" aria-hidden="true"></i>
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Próximo slide"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-[#D4AF37] hover:scale-110 transition text-3xl sm:text-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] cursor-pointer"
                >
                  <i className="fas fa-chevron-circle-right" aria-hidden="true"></i>
                </button>
              </div>

              {/* Pagination Dots Outside */}
              <div className="flex justify-center items-center gap-2.5 mt-4">
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Ir para o slide ${idx + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === activeSlide
                        ? 'bg-[#D4AF37] w-6'
                        : 'bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Modality Cards + CTA Button (74d9e66) */}
            <div className="w-full lg:w-[45%] flex flex-col gap-2.5 p-2 sm:p-5">
              {modalities.map((modName, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveSlide(idx % carouselImages.length)}
                  className="sa-gold-box px-5 py-4 cursor-pointer flex items-center justify-between"
                >
                  <h3 className="sa-gold-box-text font-bebas italic font-medium text-[21px] sm:text-[24px] xl:text-[26px] tracking-[1.2px] leading-tight">
                    {modName}
                  </h3>
                  <i
                    className="fas fa-dumbbell sa-gold-box-text text-lg opacity-80"
                    aria-hidden="true"
                  ></i>
                </div>
              ))}

              {activeClowayModel ? (
                <button
                  type="button"
                  onClick={() => openClowayWithPrompt('🏋️ Como funciona o treino na S.A?')}
                  className="sa-btn-gold w-full py-5 px-8 text-[22px] lg:text-[27px] mt-2 cursor-pointer"
                >
                  <img
                    src="/images/cloway-clo.webp"
                    alt={assistantName}
                    className="w-6 h-6 rounded-full object-cover border border-black/30 mr-2.5"
                  />
                  <span>Tirar Dúvidas &amp; Agendar com a {assistantName}</span>
                </button>
              ) : (
                <a
                  href="#oferta"
                  className="sa-btn-gold w-full py-5 px-8 text-[22px] lg:text-[27px] mt-2"
                >
                  <i
                    className="fas fa-arrow-alt-circle-right text-[20px] mr-2.5 sa-btn-icon"
                    aria-hidden="true"
                  ></i>
                  <span>{siteData.modalitiesSection?.ctaText || 'Agendar Aula Experimental'}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION: QUER TREINAR PERTO DE CASA? ESCOLHA A SUA UNIDADE! (b4eaa1c) ==================== */}
      <section
        id="unidades"
        className="sa-section-notched relative z-20 bg-white text-[#222222] pt-20 lg:pt-28 pb-24 lg:pb-28 -mt-6 lg:-mt-14"
      >
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6">
          {/* Heading */}
          <div className="text-center flex flex-col items-center">
            <h2 className="font-bebas italic font-semibold text-[30px] sm:text-[44px] lg:text-[52px] text-[#222222] tracking-[0.5px] leading-none">
              {siteData.unitsSection?.subtitleTop}
            </h2>
            <h2 className="font-bebas italic font-semibold text-[44px] sm:text-[68px] lg:text-[80px] sa-degrade-title tracking-[0.5px] leading-none mt-1">
              {siteData.unitsSection?.titleMain}
            </h2>
            <p className="font-poppins italic font-normal text-[15px] lg:text-[16px] text-[#222222] mt-2">
              {siteData.unitsSection?.description}
            </p>
          </div>

          {/* 3 Units Grid (88ddfd8) */}
          <div className="mt-8 lg:mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1216px] w-[96%] mx-auto">
            {units.map((unit, idx) => {
              const cleanUnitName = (unit.name || '').replace(/\s*\n\s*/g, ' ').trim()
              return (
                <div key={idx} className="flex flex-col">
                  {/* Unit Title Box */}
                  <div className="sa-gold-box p-5 text-center mb-2.5">
                    <h3 className="sa-gold-box-text font-bebas italic font-medium text-[30px] tracking-[1.3px] leading-[1.1] whitespace-pre-line">
                      {unit.name}
                    </h3>
                  </div>

                  {/* Unit Image */}
                  <img
                    src={unit.img}
                    alt={unit.mapTitle}
                    loading="lazy"
                    className="w-full h-[220px] object-cover rounded-t-[20px] shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                  />

                  {/* Google Maps Embed */}
                  <div className="rounded-b-[20px] overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.5)] bg-[#161616]">
                    <iframe
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(unit.mapQuery || unit.mapTitle || unit.name)}&t=m&z=13&output=embed&iwloc=near`}
                      title={unit.mapTitle}
                      aria-label={unit.mapTitle}
                      className="w-full h-[180px] border-0 brightness-[0.72] hover:brightness-100 transition duration-300"
                    />
                  </div>

                  {/* CTA Button */}
                  {activeClowayModel ? (
                    <button
                      type="button"
                      onClick={() =>
                        openClowayWithPrompt(`Quero agendar aula experimental na ${cleanUnitName}`)
                      }
                      className="sa-btn-gold w-full py-5 px-6 text-[22px] lg:text-[25px] mt-3 cursor-pointer"
                    >
                      <img
                        src="/images/cloway-clo.webp"
                        alt={assistantName}
                        className="w-6 h-6 rounded-full object-cover border border-black/30 mr-2"
                      />
                      <span>Agendar com a {assistantName}</span>
                    </button>
                  ) : (
                    <a
                      href="#oferta"
                      className="sa-btn-gold w-full py-5 px-6 text-[22px] lg:text-[26px] mt-3"
                    >
                      <i
                        className="fas fa-arrow-alt-circle-right text-[20px] mr-2.5 sa-btn-icon"
                        aria-hidden="true"
                      ></i>
                      <span>{unit.ctaText || 'Agendar Aula Experimental'}</span>
                    </a>
                  )}
                </div>
              )
            })}
          </div>

          {/* Heading for Plans Section at Bottom of White Container (c9f8394) */}
          <div id="planos" className="mt-16 lg:mt-20 text-center flex flex-col items-center">
            <h2 className="font-bebas italic font-semibold text-[32px] sm:text-[44px] lg:text-[52px] text-[#222222] tracking-[0.5px] leading-none">
              {siteData.plansSection?.subtitleTop}
            </h2>
            <h2 className="font-bebas italic font-semibold text-[46px] sm:text-[68px] lg:text-[80px] sa-degrade-title tracking-[0.5px] leading-none mt-1">
              {siteData.plansSection?.titleMain}
            </h2>
          </div>
        </div>
      </section>

      {/* ==================== SECTION: ABAS DE PLANOS (765512f) ==================== */}
      {plansList.length > 0 && (
        <section
          id="oferta"
          className="relative z-10 bg-[#131313] pt-16 lg:pt-20 pb-28 -mt-12 lg:-mt-16 flex flex-col items-center px-4"
        >
          {/* Glassmorphic Tabs Bar (8f9b4e3) */}
          <div
            role="tablist"
            aria-label="Escolha o seu plano"
            className="sa-tabs-heading inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 p-2"
          >
            {plansList.map((tab, idx) => {
              const active = activePlanIndex === idx
              return (
                <button
                  key={tab.id || idx}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActivePlanIndex(idx)}
                  className={`inline-flex items-center justify-center text-center min-w-[110px] sm:min-w-[132px] px-7 py-3 rounded-[18px] font-bebas italic text-[21px] leading-none tracking-[1.2px] transition-all cursor-pointer ${
                    active
                      ? 'sa-tab-btn-active'
                      : 'text-white/75 hover:text-white hover:-translate-y-0.5'
                  }`}
                >
                  <span className="inline-block text-center">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Active Plan Card (45b10b5 / de8ac8f / c7c448a) */}
          <div
            key={currentPlan.id || activePlanIndex}
            className="sa-tab-panel-animate mt-8 w-full max-w-[480px] bg-[#1F1F1F] rounded-[25px] shadow-[0_0_25px_rgba(0,0,0,0.75)] border border-white/5 px-6 sm:px-10 pt-8 pb-10 flex flex-col items-center text-center"
          >
            <h3 className="font-bebas font-semibold text-[34px] tracking-[1.3px] text-[#F5F5F5]">
              {currentPlan.title}
            </h3>

            <p className="font-poppins text-sm text-[#ACACAC] mt-1">
              {currentPlan.subtitle}
            </p>

            <div className="font-bebas font-semibold text-[70px] leading-none sa-degrade-hero tracking-[1px] my-1">
              {currentPlan.price}
            </div>

            {currentPlan.note && (
              <p className="font-poppins italic text-xs text-[#ACACAC] mb-2">
                {currentPlan.note}
              </p>
            )}

            {/* Plan Features List */}
            <ul className="w-full text-left space-y-3 my-6 px-2">
              {(currentPlan.features || []).map((feat, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-[#D4AF37] text-sm shrink-0">
                    <i className="far fa-arrow-alt-circle-right" aria-hidden="true"></i>
                  </span>
                  <span className="font-bebas font-normal text-[19px] tracking-[0.6px] text-[#F5F5F5]">
                    {feat}
                  </span>
                </li>
              ))}
            </ul>

            {activeClowayModel ? (
              <button
                type="button"
                onClick={() =>
                  openClowayWithPrompt(
                    `Quero saber mais sobre o ${currentPlan.title} e agendar uma aula experimental`
                  )
                }
                className="sa-btn-gold w-full py-5 px-8 text-[24px] lg:text-[26px] cursor-pointer"
              >
                <img
                  src="/images/cloway-clo.webp"
                  alt={assistantName}
                  className="w-6 h-6 rounded-full object-cover border border-black/30 mr-2.5"
                />
                <span>Agendar Aula com a {assistantName}</span>
              </button>
            ) : (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Olá! Gostaria de agendar uma aula experimental na S.A Treinamento e saber mais sobre o ${currentPlan.title}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="sa-btn-gold w-full py-5 px-8 text-[25px] lg:text-[27px]"
              >
                <i
                  className="fas fa-arrow-alt-circle-right text-[20px] mr-2.5 sa-btn-icon"
                  aria-hidden="true"
                ></i>
                <span>Agendar Aula Experimental</span>
              </a>
            )}

            <img
              src="/images/selos-carts-white.webp"
              alt="Formas de pagamento e segurança"
              className="w-1/2 max-w-[220px] mt-5 opacity-90"
            />
          </div>
        </section>
      )}

      {/* ==================== SECTION: BLOG DA S.A (#blog) ==================== */}
      {blogPosts.length > 0 && (
        <section
          id="blog"
          className="sa-section-notched relative z-20 bg-white text-[#222222] pt-20 lg:pt-28 pb-24 lg:pb-32 -mt-6 lg:-mt-14"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            {/* Heading */}
            <div className="text-center flex flex-col items-center">
              <h2 className="font-bebas italic font-semibold text-[30px] sm:text-[42px] lg:text-[50px] text-[#222222] tracking-[0.5px] leading-none">
                {siteData.blogSection?.subtitleTop || 'Conteúdos & Dicas'}
              </h2>
              <h2 className="font-bebas italic font-semibold text-[48px] sm:text-[68px] lg:text-[84px] sa-degrade-title tracking-[0.5px] leading-none mt-1">
                {siteData.blogSection?.titleMain || 'Blog da S.A'}
              </h2>
              <p className="font-poppins italic font-normal text-[15px] lg:text-[16px] text-[#222222] max-w-[720px] mt-2">
                {siteData.blogSection?.description}
              </p>
            </div>

            {/* Blog Cards Grid (Exibe apenas os 3 mais recentes na Home para não poluir a página inicial) */}
            <div className="mt-10 lg:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {blogPosts.slice(0, 3).map((post) => (
                <article
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group bg-[#141416] text-white rounded-[24px] overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.22)] border border-black/10 flex flex-col cursor-pointer hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="relative h-[220px] overflow-hidden">
                    <img
                      src={post.image || '/images/img4815.jpg'}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-transparent opacity-80" />
                    {post.category && (
                      <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#D4AF37] text-black font-poppins font-semibold text-[11px] uppercase tracking-wider shadow">
                        {post.category}
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-white/55 font-poppins mb-2.5">
                        {post.date && (
                          <span>
                            <i className="far fa-calendar-alt text-[#D4AF37] mr-1.5"></i>
                            {post.date}
                          </span>
                        )}
                        {post.readTime && (
                          <span>
                            <i className="far fa-clock text-[#D4AF37] mr-1.5"></i>
                            {post.readTime}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bebas italic text-[28px] leading-[1.1] tracking-wide text-white group-hover:text-[#D4AF37] transition-colors">
                        {post.title}
                      </h3>

                      <p className="font-poppins text-sm text-white/75 mt-2.5 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-poppins font-semibold uppercase tracking-wider text-[#D4AF37]">
                      <span>Ler matéria completa</span>
                      <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Botão para abrir a Aba Exclusiva do Blog com todos os artigos */}
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={openBlogTab}
                className="sa-btn-gold px-9 py-4 text-[23px] tracking-wider cursor-pointer"
              >
                <span>Ver Todos os Artigos no Blog ({blogPosts.length})</span>
                <i className="fas fa-arrow-right text-[18px] ml-2.5 sa-btn-icon"></i>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ==================== MODAL DE LEITURA DO ARTIGO DO BLOG ==================== */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#141416] border border-[#D4AF37]/30 rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="relative h-60 sm:h-72 shrink-0">
              <img
                src={selectedPost.image || '/images/img4815.jpg'}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-[#141416]/40 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                aria-label="Fechar artigo"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 hover:bg-[#D4AF37] text-white hover:text-black transition flex items-center justify-center text-lg cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
              {selectedPost.category && (
                <span className="absolute bottom-4 left-6 px-3.5 py-1 rounded-full bg-[#D4AF37] text-black font-poppins font-semibold text-xs uppercase tracking-wider">
                  {selectedPost.category}
                </span>
              )}
            </div>

            {/* Article Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="flex items-center gap-4 text-xs text-white/55 font-poppins">
                {selectedPost.date && (
                  <span>
                    <i className="far fa-calendar-alt text-[#D4AF37] mr-1.5"></i>
                    {selectedPost.date}
                  </span>
                )}
                {selectedPost.readTime && (
                  <span>
                    <i className="far fa-clock text-[#D4AF37] mr-1.5"></i>
                    {selectedPost.readTime}
                  </span>
                )}
              </div>

              <h2 className="font-bebas italic text-3xl sm:text-5xl leading-[1.08] sa-degrade-hero">
                {selectedPost.title}
              </h2>

              {selectedPost.excerpt && (
                <p className="font-poppins italic text-sm sm:text-base text-white/85 border-l-2 border-[#D4AF37] pl-4 py-1">
                  {selectedPost.excerpt}
                </p>
              )}

              <div className="font-poppins text-sm sm:text-base text-white/85 leading-relaxed space-y-4 pt-2 whitespace-pre-line">
                {selectedPost.content}
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                {activeClowayModel ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPost(null)
                      openClowayWithPrompt('📅 Agendar Aula Experimental')
                    }}
                    className="sa-btn-gold px-7 py-3.5 text-[22px] w-full sm:w-auto cursor-pointer"
                  >
                    <img
                      src="/images/cloway-clo.webp"
                      alt={assistantName}
                      className="w-6 h-6 rounded-full object-cover border border-black/30 mr-2"
                    />
                    <span>Agendar Aula com a {assistantName}</span>
                  </button>
                ) : (
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Olá! Li a matéria "${selectedPost.title}" no Blog da S.A e gostaria de agendar uma aula experimental.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="sa-btn-gold px-7 py-3.5 text-[22px] w-full sm:w-auto"
                  >
                    <i className="fab fa-whatsapp text-[20px] mr-2 sa-btn-icon"></i>
                    <span>Agendar Aula Experimental</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-poppins text-white/80 cursor-pointer"
                >
                  Fechar leitura
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SECTION: O QUE DIZEM NOSSOS ALUNOS? (bf0a35b - Mantido na página) ==================== */}
      <section
        id="depoimentos"
        className="sa-section-notched relative z-20 bg-[#131313] py-24 lg:py-36 px-6 lg:px-14 -mt-12"
      >
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left Heading (27%) */}
          <div className="w-full lg:w-[27%] text-center lg:text-left">
            <h2 className="font-bebas italic font-semibold text-[44px] lg:text-[52px] leading-[1.1] tracking-[0.5px] text-white">
              O que dizem <span className="text-[#D4AF37]">nossos Alunos?</span>
            </h2>
          </div>

          {/* Right 3 Testimonial Cards (ca691d2) */}
          <div className="w-full lg:w-[73%] grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/60 hover:bg-white transition-colors duration-300 rounded-[8px] px-5 pb-6 pt-0 flex flex-col shadow-lg"
              >
                <div className="-mt-5 mb-2 flex flex-col items-start">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37] shadow-md mb-2"
                  />
                  <h3 className="font-bebas font-semibold text-[20px] tracking-[1px] text-[#081526]">
                    {item.name}
                  </h3>
                </div>
                <p className="font-sora font-normal text-[13px] leading-[1.4] text-[#081526]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FOOTER (Sem o bloco "Inscreva-se já", conforme pedido do cliente) ==================== */}
      <footer className="relative z-20">
        {/* Top Online Attendance Banner (elementor-145) */}
        <div className="bg-white text-[#222222] py-8 px-6 border-b border-black/10">
          <div className="max-w-[1216px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              {activeClowayModel ? (
                <img
                  src="/images/cloway-clo.webp"
                  alt={assistantName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#D4AF37] text-3xl">
                  <i className="fab fa-whatsapp" aria-hidden="true"></i>
                </div>
              )}
              <div>
                <h3 className="font-bebas text-[28px] tracking-wide text-[#222222] leading-none">
                  {activeClowayModel ? (
                    <>
                      Atendimento 24h <b className="text-[#D4AF37]">com a {assistantName}</b>
                    </>
                  ) : (
                    <>
                      Atendimento <b className="text-[#D4AF37]">Online</b>
                    </>
                  )}
                </h3>
                <p className="font-poppins text-sm text-[#4C4C4C] mt-1">
                  {activeClowayModel
                    ? 'Tire dúvidas de planos e agende sua aula experimental agora mesmo com nossa Assistente Virtual'
                    : siteData.footer?.onlineBannerDesc}
                </p>
              </div>
            </div>

            {activeClowayModel ? (
              <button
                type="button"
                onClick={() => openClowayWithPrompt('📅 Agendar Aula Experimental')}
                className="bg-[#222222] hover:bg-[#383838] text-white font-manrope font-extrabold text-base px-8 py-4 rounded-[8px] transition inline-flex items-center gap-2.5 cursor-pointer shadow-md"
              >
                <img
                  src="/images/cloway-clo.webp"
                  alt={assistantName}
                  className="w-6 h-6 rounded-full object-cover border border-[#D4AF37]"
                />
                <span>Conversar com a {assistantName} Agora</span>
              </button>
            ) : (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#222222] hover:bg-[#4C4C4C] text-white font-manrope font-extrabold text-base px-9 py-4 rounded-[6px] transition inline-flex items-center gap-2"
              >
                <i className="fab fa-whatsapp text-lg text-[#D4AF37]" aria-hidden="true"></i>
                <span>Contato via WhatsApp</span>
              </a>
            )}
          </div>
        </div>

        {/* Main Footer Columns (e390baf) */}
        <div className="bg-[#0d0d0d] text-white py-20 px-6">
          <div className="max-w-[1216px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Col 1: Brand */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <img
                src="/images/logo-sa.png"
                alt="S.A Treinamento"
                className="w-[140px] rounded-xl mb-4"
              />
              <p className="font-poppins text-sm text-white/80 leading-relaxed">
                {siteData.footer?.brandDescription}
              </p>
              <div className="mt-4 text-xs text-white/50 space-y-0.5">
                <p>{siteData.footer?.companyName}</p>
                <p>{siteData.footer?.companyLocation}</p>
              </div>
            </div>

            {/* Col 2: Navigation / Links Úteis */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="font-poppins font-bold text-[#FFDE59] text-lg mb-4">
                {siteData.footer?.usefulLinksTitle || 'Links úteis'}
              </h4>
              <ul className="space-y-2.5 text-sm text-white/80">
                {(siteData.footer?.usefulLinks || []).map((linkItem, idx) => {
                  const isBlogFooterLink =
                    (linkItem.href || '').toLowerCase() === '#blog' ||
                    (linkItem.href || '').toLowerCase() === '/blog' ||
                    (linkItem.label || '').toLowerCase().includes('blog')
                  return (
                    <li key={idx}>
                      <a
                        href={isBlogFooterLink ? '/blog' : linkItem.href || '#topo'}
                        onClick={(e) => {
                          if (isBlogFooterLink) {
                            e.preventDefault()
                            openBlogTab()
                          }
                        }}
                        className="hover:text-[#D4AF37] transition"
                      >
                        {linkItem.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Col 3: Unidades & Atendimento */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="font-poppins font-bold text-[#FFDE59] text-lg mb-4">
                Nossas Unidades
              </h4>
              <ul className="space-y-2 text-sm text-white/80">
                {unitSingleLineNames.map((uName, idx) => (
                  <li key={idx}>• {uName}</li>
                ))}
                <li className="pt-2 text-[#D4AF37] font-medium">
                  {siteData.footer?.companyLocation || 'Porto Alegre - RS'}
                </li>
              </ul>
            </div>

            {/* Col 4: Redes Sociais */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="font-poppins font-bold text-[#FFDE59] text-lg mb-4">
                {siteData.footer?.socialTitle || 'Redes sociais'}
              </h4>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {(siteData.footer?.socialLinks || []).map((soc, idx) => {
                  const isWa = (soc.icon || '').includes('whatsapp')
                  if (activeClowayModel && isWa) {
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => openClowayWithPrompt('📅 Agendar Aula Experimental')}
                        title={`Atendimento ${assistantName}`}
                        className="w-11 h-11 rounded-lg bg-[#1F1F1F] border border-[#D4AF37]/40 flex items-center justify-center hover:bg-[#D4AF37] transition cursor-pointer overflow-hidden"
                      >
                        <img
                          src="/images/cloway-clo.webp"
                          alt={assistantName}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )
                  }
                  return (
                    <a
                      key={idx}
                      href={soc.url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={soc.platform || 'Rede Social'}
                      title={soc.platform || 'Rede Social'}
                      className="w-11 h-11 rounded-lg bg-[#1F1F1F] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition text-xl"
                    >
                      <i className={soc.icon || 'fas fa-globe'} aria-hidden="true"></i>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar (c375110) */}
        <div className="bg-white text-[#222222] py-5 px-6 text-sm">
          <div className="max-w-[1216px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <strong>© S.A Treinamento –</strong>
              <span>Todos os direitos reservados.</span>
            </div>
            <div className="text-xs text-[#4C4C4C]">
              Viva o agora, viva a S.A!
            </div>
          </div>
        </div>
      </footer>

      {/* ==================== WIDGET SA VIRTUAL / CLOWAY AI (ATIVO NO MODELO 2) ==================== */}
      {activeClowayModel && (
        <ClowayWidget
          isOpen={clowayOpen}
          onOpen={() => setClowayOpen(true)}
          onClose={() => setClowayOpen(false)}
          initialContext={cleanClowayContext}
          siteData={siteData}
        />
      )}

      {/* ==================== SELETOR DE APRESENTAÇÃO DOS 2 MODELOS (CANTO INFERIOR ESQUERDO) ==================== */}
      {showModelSwitcher && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-1 bg-[#111216]/95 backdrop-blur-md border border-[#D4AF37]/40 rounded-full p-1 shadow-2xl text-[11px] font-poppins">
          <button
            type="button"
            onClick={() => switchModel(false)}
            className={`px-3 py-1.5 rounded-full font-medium transition cursor-pointer ${
              !activeClowayModel
                ? 'bg-[#D4AF37] text-black font-semibold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Modelo 1: Padrão
          </button>
          <button
            type="button"
            onClick={() => switchModel(true)}
            className={`px-3 py-1.5 rounded-full font-medium transition flex items-center gap-1.5 cursor-pointer ${
              activeClowayModel
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#D4AF37] text-white font-semibold shadow'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <img
              src="/images/cloway-clo.webp"
              alt=""
              className="w-4 h-4 rounded-full object-cover border border-white/40"
            />
            <span>Modelo 2: + {assistantName}</span>
          </button>
        </div>
      )}
    </div>
  )
}
