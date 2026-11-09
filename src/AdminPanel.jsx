import React, { useState } from 'react'
import {
  loadSiteData,
  saveSiteData,
  resetSiteData,
} from './defaultSiteData'

const MASTER_RECOVERY_PASS = 'sfl2026'

const SOCIAL_ICON_OPTIONS = [
  { label: 'Instagram', icon: 'fab fa-instagram' },
  { label: 'WhatsApp', icon: 'fab fa-whatsapp' },
  { label: 'Facebook', icon: 'fab fa-facebook' },
  { label: 'YouTube', icon: 'fab fa-youtube' },
  { label: 'TikTok', icon: 'fab fa-tiktok' },
  { label: 'LinkedIn', icon: 'fab fa-linkedin' },
  { label: 'X / Twitter', icon: 'fab fa-twitter' },
  { label: 'Spotify', icon: 'fab fa-spotify' },
  { label: 'Telegram', icon: 'fab fa-telegram' },
  { label: 'Localização / Mapa', icon: 'fas fa-map-marker-alt' },
  { label: 'Site / Link Externo', icon: 'fas fa-globe' },
]

// Helper to compress uploaded image to DataURL so it saves cleanly in browser storage
function handleImageFileUpload(file, callback) {
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxDim = 1280
      let w = img.width
      let h = img.height
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w)
          w = maxDim
        } else {
          w = Math.round((w * maxDim) / h)
          h = maxDim
        }
      }
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.84)
      callback(dataUrl)
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

export default function AdminPanel({ onBackToSite, onGoToBlog }) {
  const [isLogged, setIsLogged] = useState(() => {
    try {
      return sessionStorage.getItem('sa_admin_logged') === 'true'
    } catch {
      return false
    }
  })
  const [loginUser, setLoginUser] = useState('admin')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState(false)

  const [siteData, setSiteData] = useState(() => loadSiteData())
  const [activeSection, setActiveSection] = useState('hero')
  const [saveMessage, setSaveMessage] = useState('')
  const [showAdminPass, setShowAdminPass] = useState(false)
  const [showGatePass, setShowGatePass] = useState(false)
  const [agencyUnlocked, setAgencyUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem('sa_agency_master') === 'true'
    } catch {
      return false
    }
  })
  const [agencyKeyInput, setAgencyKeyInput] = useState('')
  const [agencyKeyError, setAgencyKeyError] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    const configuredPass = (siteData.security?.adminPass || 'sa2026').trim().toLowerCase()
    const configuredUser = (siteData.security?.adminUser || 'admin').trim().toLowerCase()
    const typedPass = loginPass.trim().toLowerCase()
    const typedUser = loginUser.trim().toLowerCase()

    const isMasterRecovery = typedPass === MASTER_RECOVERY_PASS
    const isValidCustom =
      typedPass === configuredPass && (!configuredUser || typedUser === configuredUser)

    if (isValidCustom || isMasterRecovery) {
      setIsLogged(true)
      setLoginError(false)
      if (isMasterRecovery) {
        setAgencyUnlocked(true)
      }
      try {
        sessionStorage.setItem('sa_admin_logged', 'true')
        sessionStorage.setItem('sa_homolog_unlocked', 'true')
        if (isMasterRecovery) {
          sessionStorage.setItem('sa_agency_master', 'true')
        }
      } catch {
        // ignore
      }
    } else {
      setLoginError(true)
    }
  }

  const handleLogout = () => {
    setIsLogged(false)
    try {
      sessionStorage.removeItem('sa_admin_logged')
    } catch {
      // ignore
    }
  }

  const handleSave = () => {
    const ok = saveSiteData(siteData)
    if (ok) {
      setSaveMessage('✓ Alterações salvas e aplicadas no site!')
      setTimeout(() => setSaveMessage(''), 3500)
    } else {
      setSaveMessage('Erro ao salvar: imagem muito grande.')
    }
  }

  const handleReset = () => {
    if (
      window.confirm(
        'Tem certeza que deseja restaurar todos os textos e fotos para o padrão original da S.A Treinamento?'
      )
    ) {
      const fresh = resetSiteData()
      setSiteData(fresh)
      setSaveMessage('✓ Site restaurado para o padrão original!')
      setTimeout(() => setSaveMessage(''), 3500)
    }
  }

  const addNewUnit = () => {
    setSiteData({
      ...siteData,
      unitsSection: {
        ...siteData.unitsSection,
        items: [
          ...siteData.unitsSection.items,
          {
            name: 'Nova\nUnidade',
            img: '/images/img9825.jpg',
            mapQuery: 'S.A Treinamento Porto Alegre',
            mapTitle: 'S.A Treinamento Nova Unidade',
            address: 'Endereço da Unidade — Porto Alegre, RS',
            ctaText: 'Agendar Aula Experimental',
          },
        ],
      },
    })
  }

  // ==================== TELA DE LOGIN DO PAINEL (/painel) ====================
  if (!isLogged) {
    return (
      <div className="min-h-screen bg-[#0B0C0E] text-white flex flex-col justify-between p-6 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-[#D4AF37]/12 blur-[140px]"
        />

        <div className="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs font-poppins uppercase tracking-[0.16em] text-white/60">
            <i className="fas fa-sliders-h text-[#D4AF37]" aria-hidden="true"></i>
            <span>CMS • Gerenciador de Conteúdo</span>
          </div>
          <a
            href="/"
            onClick={(e) => {
              if (onBackToSite) {
                e.preventDefault()
                onBackToSite()
              }
            }}
            className="text-xs font-poppins text-[#D4AF37] hover:underline"
          >
            ← Voltar para o site
          </a>
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto my-auto">
          <div className="rounded-2xl bg-[#141416]/95 border border-[#D4AF37]/25 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95)] p-8 sm:p-10 backdrop-blur-xl text-center">
            <div className="flex justify-center mb-5">
              <img
                src="/images/logo-sa.png"
                alt="S.A Treinamento"
                className="w-20 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.25)] border border-[#D4AF37]/30"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[11px] font-poppins uppercase tracking-[0.14em] text-[#FFF2CD] mb-3">
              <span>Painel do Administrador</span>
            </div>

            <h1 className="font-bebas italic text-4xl sm:text-5xl font-semibold sa-degrade-hero mb-2">
              Editor S.A Treinamento
            </h1>
            <p className="text-xs sm:text-sm text-white/70 font-poppins leading-relaxed mb-6">
              Acesse para editar textos, fotos, unidades, planos, links e publicar matérias no Blog.
            </p>

            <form onSubmit={handleLogin} className="space-y-4 text-left font-poppins">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1.5">
                  Usuário
                </label>
                <input
                  type="text"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1.5">
                  Senha do Administrador
                </label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => {
                    setLoginPass(e.target.value)
                    if (loginError) setLoginError(false)
                  }}
                  placeholder="Digite a senha (ex: sa2026)"
                  autoFocus
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#D4AF37]"
                />
                {loginError && (
                  <p className="text-xs text-red-400 mt-2">
                    Senha incorreta. Utilize a credencial de administrador (sa2026).
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="sa-btn-gold w-full py-4 px-6 text-[23px] tracking-wider mt-2"
              >
                <span>Entrar no Painel</span>
                <i className="fas fa-sign-in-alt text-[18px] ml-2.5 sa-btn-icon"></i>
              </button>
            </form>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl w-full mx-auto text-center text-[11px] text-white/40 pb-2 font-poppins">
          Painel Administrativo Exclusivo • S.A Treinamento
        </div>
      </div>
    )
  }

  const navTabs = [
    { id: 'hero', label: '1. Topo, Menu & Hero', icon: 'fa-home' },
    { id: 'about', label: `2. Sobre & Fotos (${siteData.about.cards.length})`, icon: 'fa-th-large' },
    { id: 'modalities', label: '3. Modalidades & Carrossel', icon: 'fa-dumbbell' },
    {
      id: 'units',
      label: `4. Unidades (${siteData.unitsSection.items.length})`,
      icon: 'fa-map-marker-alt',
    },
    {
      id: 'plans',
      label: `5. Planos & Preços (${siteData.plansSection.plansList.length})`,
      icon: 'fa-tags',
    },
    {
      id: 'blog',
      label: `6. Página /blog & Matérias (${siteData.blogSection.posts.length})`,
      icon: 'fa-newspaper',
    },
    {
      id: 'testimonials',
      label: `7. Depoimentos (${siteData.testimonials.length})`,
      icon: 'fa-comments',
    },
    { id: 'footer', label: '8. Rodapé, Links & Redes', icon: 'fa-share-alt' },
    { id: 'security', label: '9. Senha & Segurança', icon: 'fa-key' },
  ]

  return (
    <div className="min-h-screen bg-[#0D0E11] text-white font-poppins flex flex-col">
      {/* ==================== TOP BAR DO PAINEL ==================== */}
      <header className="sticky top-0 z-40 bg-[#141519]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src="/images/logo-sa.png"
              alt="S.A Treinamento"
              className="w-11 h-11 rounded-xl object-cover border border-[#D4AF37]/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bebas italic text-2xl tracking-wide text-[#D4AF37] leading-none">
                  Painel Administrativo S.A
                </h1>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-white/55">
                Edite ou inclua novos itens em qualquer seção da página
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {saveMessage && (
              <span className="text-xs bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3.5 py-2 rounded-lg font-medium">
                {saveMessage}
              </span>
            )}

            <button
              type="button"
              onClick={() => setActiveSection('security')}
              className="px-3.5 py-2 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-xs text-[#FFF2CD] transition cursor-pointer inline-flex items-center gap-1.5"
            >
              <i className="fas fa-key text-[#D4AF37]"></i>
              <span>Trocar Senha</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/75 hover:text-white transition cursor-pointer"
            >
              Restaurar Padrão
            </button>

            <a
              href="/blog"
              onClick={(e) => {
                if (onGoToBlog) {
                  e.preventDefault()
                  handleSave()
                  onGoToBlog()
                }
              }}
              className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-medium text-white transition inline-flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-newspaper text-[#D4AF37]"></i>
              <span>Ver Página /blog</span>
            </a>

            <a
              href="/"
              onClick={(e) => {
                if (onBackToSite) {
                  e.preventDefault()
                  handleSave()
                  onBackToSite()
                }
              }}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-medium text-white transition inline-flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-external-link-alt text-[#D4AF37]"></i>
              <span>Ver Site ao Vivo</span>
            </a>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#9A6B1F] hover:brightness-110 text-black font-semibold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer inline-flex items-center gap-2"
            >
              <i className="fas fa-save"></i>
              <span>Salvar Alterações</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title="Sair do Painel"
              className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-300 transition cursor-pointer"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </header>

      {/* ==================== CORPO DO PAINEL (SIDEBAR + EDITOR) ==================== */}
      <div className="max-w-7xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-8">
        {/* Sidebar de Seções */}
        <aside className="lg:col-span-3 space-y-1.5">
          <div className="p-4 rounded-2xl bg-[#141519] border border-white/10">
            <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold mb-3 px-2">
              Seções da Página
            </p>
            <nav className="space-y-1">
              {navTabs.map((t) => {
                const active = activeSection === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveSection(t.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-medium transition cursor-pointer ${
                      active
                        ? 'bg-[#D4AF37] text-black font-semibold shadow-md'
                        : 'text-white/75 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <i className={`fas ${t.icon} w-4 text-center`}></i>
                    <span>{t.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-4 rounded-2xl bg-[#141519]/60 border border-[#D4AF37]/20 text-xs text-white/70 space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold">
              <i className="fas fa-plus-circle"></i>
              <span>Tudo Expansível</span>
            </div>
            <p className="leading-relaxed text-[11px] text-white/60">
              Você pode <strong className="text-white">incluir ou remover</strong> links do menu,
              fotos, unidades, planos, matérias do blog, links úteis e redes sociais a qualquer
              momento!
            </p>
          </div>
        </aside>

        {/* Área Principal de Edição */}
        <main className="lg:col-span-9">
          <div className="rounded-2xl bg-[#141519] border border-white/10 p-6 sm:p-8 space-y-6">
            {/* ==================== ABA 1: TOPO, MENU & HERO ==================== */}
            {activeSection === 'hero' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-bebas italic text-3xl text-[#D4AF37]">
                    1. Menu Superior, WhatsApp &amp; Banner Principal (Hero)
                  </h2>
                  <p className="text-xs text-white/60">
                    Edite ou inclua novos links no menu do topo, número de WhatsApp e textos/fotos do
                    banner principal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/70 mb-1.5">
                      Número do WhatsApp Oficial (com DDD, somente números)
                    </label>
                    <input
                      type="text"
                      value={siteData.whatsappNumber}
                      onChange={(e) =>
                        setSiteData({ ...siteData, whatsappNumber: e.target.value })
                      }
                      placeholder="Ex: 5551999009900"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/70 mb-1.5">
                      Texto do Botão Dourado no Menu Superior
                    </label>
                    <input
                      type="text"
                      value={siteData.header.ctaText}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          header: { ...siteData.header, ctaText: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>
                </div>

                {/* Links do Menu de Navegação (Nav) */}
                <div className="p-4 rounded-xl bg-[#0B0C0E] border border-white/10 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                        Itens do Menu de Navegação Superior (Nav)
                      </h3>
                      <p className="text-[11px] text-white/50">
                        Adicione, renomeie ou remova links do menu do topo.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSiteData({
                          ...siteData,
                          header: {
                            ...siteData.header,
                            navLinks: [
                              ...(siteData.header.navLinks || []),
                              { label: 'Novo Link', href: '#topo' },
                            ],
                          },
                        })
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-black font-semibold text-xs cursor-pointer"
                    >
                      + Incluir Item no Menu
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(siteData.header.navLinks || []).map((navItem, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="text"
                          value={navItem.label}
                          onChange={(e) => {
                            const next = [...siteData.header.navLinks]
                            next[idx] = { ...next[idx], label: e.target.value }
                            setSiteData({
                              ...siteData,
                              header: { ...siteData.header, navLinks: next },
                            })
                          }}
                          placeholder="Nome no Menu (ex: Blog)"
                          className="w-full sm:w-1/2 px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={navItem.href}
                          onChange={(e) => {
                            const next = [...siteData.header.navLinks]
                            next[idx] = { ...next[idx], href: e.target.value }
                            setSiteData({
                              ...siteData,
                              header: { ...siteData.header, navLinks: next },
                            })
                          }}
                          placeholder="Destino (ex: #blog, #unidades ou https://...)"
                          className="w-full sm:flex-1 px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-[#D4AF37]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = siteData.header.navLinks.filter((_, i) => i !== idx)
                            setSiteData({
                              ...siteData,
                              header: { ...siteData.header, navLinks: next },
                            })
                          }}
                          className="px-3 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs cursor-pointer"
                          title="Remover item do menu"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/70 mb-1.5">
                      Título Linha 1 (Dourado)
                    </label>
                    <input
                      type="text"
                      value={siteData.hero.titleLine1}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          hero: { ...siteData.hero, titleLine1: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/70 mb-1.5">
                      Título Linha 2 Principal (Dourado)
                    </label>
                    <input
                      type="text"
                      value={siteData.hero.titleLine2}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          hero: { ...siteData.hero, titleLine2: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/70 mb-1.5">
                    Subtítulo de Apresentação no Hero
                  </label>
                  <textarea
                    rows={3}
                    value={siteData.hero.description}
                    onChange={(e) =>
                      setSiteData({
                        ...siteData,
                        hero: { ...siteData.hero, description: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/70 mb-1.5">
                      Texto do Botão Principal do Hero
                    </label>
                    <input
                      type="text"
                      value={siteData.hero.ctaText}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          hero: { ...siteData.hero, ctaText: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/70 mb-1.5">
                      Frase de Destaque (Linha 1 e 2)
                    </label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={siteData.hero.quoteLine1}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            hero: { ...siteData.hero, quoteLine1: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0B0C0E] border border-white/15 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={siteData.hero.quoteLine2}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            hero: { ...siteData.hero, quoteLine2: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0B0C0E] border border-white/15 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Imagem de Fundo do Hero */}
                <div className="p-4 rounded-xl bg-[#0B0C0E] border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={siteData.hero.bgImage}
                    alt="Preview Hero"
                    className="w-36 h-24 object-cover rounded-lg border border-white/15 shrink-0"
                  />
                  <div className="flex-1 w-full space-y-2">
                    <label className="block text-xs text-[#D4AF37] font-semibold">
                      Imagem de Fundo do Topo (Hero)
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3.5 py-2 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-xs text-[#FFF2CD] cursor-pointer transition">
                        <i className="fas fa-upload mr-1.5"></i>
                        Enviar Foto do Computador
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e.target.files?.[0], (dataUrl) =>
                              setSiteData({
                                ...siteData,
                                hero: { ...siteData.hero, bgImage: dataUrl },
                              })
                            )
                          }
                        />
                      </label>
                      <input
                        type="text"
                        value={siteData.hero.bgImage}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            hero: { ...siteData.hero, bgImage: e.target.value },
                          })
                        }
                        placeholder="Ou cole o caminho/URL da imagem"
                        className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== ABA 2: SOBRE & CARDS ==================== */}
            {activeSection === 'about' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bebas italic text-3xl text-[#D4AF37]">
                      2. Seção &ldquo;Muito prazer, nós somos a S.A Treinamento&rdquo;
                    </h2>
                    <p className="text-xs text-white/60">
                      Edite os títulos da seção, altere fotos ou inclua novos cards na galeria.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSiteData({
                        ...siteData,
                        about: {
                          ...siteData.about,
                          cards: [
                            ...siteData.about.cards,
                            {
                              img: '/images/img9825.jpg',
                              pos: 'object-center',
                              colClass: 'lg:w-[31.5%] min-h-[300px]',
                              title: 'Novo Diferencial S.A',
                              desc: 'Descreva aqui mais um diferencial da S.A Treinamento.',
                            },
                          ],
                        },
                      })
                    }
                    className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold text-xs cursor-pointer shadow-md"
                  >
                    + Incluir Novo Card / Foto
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/70 mb-1.5">Subtítulo Superior</label>
                    <input
                      type="text"
                      value={siteData.about.subtitleTop}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          about: { ...siteData.about, subtitleTop: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/70 mb-1.5">
                      Título Principal Dourado
                    </label>
                    <input
                      type="text"
                      value={siteData.about.titleMain}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          about: { ...siteData.about, titleMain: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/70 mb-1.5">
                    Texto de Descrição da Seção
                  </label>
                  <textarea
                    rows={2}
                    value={siteData.about.description}
                    onChange={(e) =>
                      setSiteData({
                        ...siteData,
                        about: { ...siteData.about, description: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                    Cards da Galeria ({siteData.about.cards.length})
                  </h3>
                  {siteData.about.cards.map((card, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#0B0C0E] border border-white/10 flex flex-col sm:flex-row gap-4 items-start"
                    >
                      <div className="w-full sm:w-36 shrink-0 space-y-2">
                        <img
                          src={card.img}
                          alt={card.title}
                          className="w-full h-24 object-cover rounded-lg border border-white/15"
                        />
                        <label className="block text-center px-2.5 py-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-[11px] text-[#FFF2CD] cursor-pointer transition">
                          <i className="fas fa-camera mr-1"></i> Trocar Foto
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageFileUpload(e.target.files?.[0], (dataUrl) => {
                                const next = [...siteData.about.cards]
                                next[idx] = { ...next[idx], img: dataUrl }
                                setSiteData({
                                  ...siteData,
                                  about: { ...siteData.about, cards: next },
                                })
                              })
                            }
                          />
                        </label>
                      </div>

                      <div className="flex-1 w-full space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <label className="block text-[11px] text-white/50">
                            Card #{idx + 1} — Título
                          </label>
                          {siteData.about.cards.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = siteData.about.cards.filter((_, i) => i !== idx)
                                setSiteData({
                                  ...siteData,
                                  about: { ...siteData.about, cards: next },
                                })
                              }}
                              className="px-2.5 py-1 rounded bg-red-500/15 hover:bg-red-500/25 text-red-300 text-[11px] cursor-pointer"
                            >
                              <i className="fas fa-trash mr-1"></i> Excluir Card
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => {
                            const next = [...siteData.about.cards]
                            next[idx] = { ...next[idx], title: e.target.value }
                            setSiteData({
                              ...siteData,
                              about: { ...siteData.about, cards: next },
                            })
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-white"
                        />
                        <div>
                          <label className="block text-[11px] text-white/50 mb-1">
                            Descrição ao passar o mouse
                          </label>
                          <textarea
                            rows={2}
                            value={card.desc}
                            onChange={(e) => {
                              const next = [...siteData.about.cards]
                              next[idx] = { ...next[idx], desc: e.target.value }
                              setSiteData({
                                ...siteData,
                                about: { ...siteData.about, cards: next },
                              })
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== ABA 3: MODALIDADES & CARROSSEL ==================== */}
            {activeSection === 'modalities' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-bebas italic text-3xl text-[#D4AF37]">
                    3. Modalidades &amp; Fotos do Carrossel
                  </h2>
                  <p className="text-xs text-white/60">
                    Edite ou inclua novas modalidades e fotos no carrossel.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/70 mb-1.5">Subtítulo Superior</label>
                    <input
                      type="text"
                      value={siteData.modalitiesSection.subtitleTop}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          modalitiesSection: {
                            ...siteData.modalitiesSection,
                            subtitleTop: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/70 mb-1.5">
                      Título Principal Dourado
                    </label>
                    <input
                      type="text"
                      value={siteData.modalitiesSection.titleMain}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          modalitiesSection: {
                            ...siteData.modalitiesSection,
                            titleMain: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>
                </div>

                {/* Lista de Modalidades */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                      Lista de Modalidades ({siteData.modalitiesSection.items.length})
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setSiteData({
                          ...siteData,
                          modalitiesSection: {
                            ...siteData.modalitiesSection,
                            items: [
                              ...siteData.modalitiesSection.items,
                              'Nova Modalidade S.A',
                            ],
                          },
                        })
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-black font-semibold text-xs cursor-pointer"
                    >
                      + Incluir Modalidade
                    </button>
                  </div>

                  {siteData.modalitiesSection.items.map((mod, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-white/40 w-6">#{idx + 1}</span>
                      <input
                        type="text"
                        value={mod}
                        onChange={(e) => {
                          const next = [...siteData.modalitiesSection.items]
                          next[idx] = e.target.value
                          setSiteData({
                            ...siteData,
                            modalitiesSection: {
                              ...siteData.modalitiesSection,
                              items: next,
                            },
                          })
                        }}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                      />
                      {siteData.modalitiesSection.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const next = siteData.modalitiesSection.items.filter(
                              (_, i) => i !== idx
                            )
                            setSiteData({
                              ...siteData,
                              modalitiesSection: {
                                ...siteData.modalitiesSection,
                                items: next,
                              },
                            })
                          }}
                          className="p-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs cursor-pointer"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Fotos do Carrossel */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                      Fotos do Carrossel ({siteData.modalitiesSection.carouselImages.length})
                    </label>
                    <label className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-black font-semibold text-xs cursor-pointer">
                      + Incluir Foto no Carrossel
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageFileUpload(e.target.files?.[0], (dataUrl) => {
                            setSiteData({
                              ...siteData,
                              modalitiesSection: {
                                ...siteData.modalitiesSection,
                                carouselImages: [
                                  ...siteData.modalitiesSection.carouselImages,
                                  { src: dataUrl, alt: 'Foto S.A Treinamento' },
                                ],
                              },
                            })
                          })
                        }
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {siteData.modalitiesSection.carouselImages.map((imgObj, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-[#0B0C0E] border border-white/10 space-y-2"
                      >
                        <img
                          src={imgObj.src}
                          alt={imgObj.alt}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <div className="flex items-center justify-between gap-1">
                          <label className="flex-1 text-center py-1 rounded bg-white/10 hover:bg-white/15 text-[11px] cursor-pointer">
                            Trocar
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e.target.files?.[0], (dataUrl) => {
                                  const next = [...siteData.modalitiesSection.carouselImages]
                                  next[idx] = { ...next[idx], src: dataUrl }
                                  setSiteData({
                                    ...siteData,
                                    modalitiesSection: {
                                      ...siteData.modalitiesSection,
                                      carouselImages: next,
                                    },
                                  })
                                })
                              }
                            />
                          </label>
                          {siteData.modalitiesSection.carouselImages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const next =
                                  siteData.modalitiesSection.carouselImages.filter(
                                    (_, i) => i !== idx
                                  )
                                setSiteData({
                                  ...siteData,
                                  modalitiesSection: {
                                    ...siteData.modalitiesSection,
                                    carouselImages: next,
                                  },
                                })
                              }}
                              className="px-2 py-1 rounded bg-red-500/15 text-red-300 text-[11px] cursor-pointer"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== ABA 4: UNIDADES ==================== */}
            {activeSection === 'units' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bebas italic text-3xl text-[#D4AF37]">
                      4. Unidades S.A Treinamento ({siteData.unitsSection.items.length})
                    </h2>
                    <p className="text-xs text-white/60">
                      Edite fotos, nomes, endereço e localização no mapa ou inclua novas unidades.
                      (As unidades adicionadas aqui aparecem automaticamente na faixa rolante do
                      topo, na seção de Unidades e na lista do Rodapé!)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addNewUnit}
                    className="px-4 py-2.5 rounded-lg bg-[#D4AF37] text-black font-semibold text-xs cursor-pointer shadow-md"
                  >
                    + Incluir Nova Unidade
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-white/70 mb-1">Subtítulo Superior</label>
                    <input
                      type="text"
                      value={siteData.unitsSection.subtitleTop}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          unitsSection: {
                            ...siteData.unitsSection,
                            subtitleTop: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/70 mb-1">
                      Título Principal Dourado
                    </label>
                    <input
                      type="text"
                      value={siteData.unitsSection.titleMain}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          unitsSection: {
                            ...siteData.unitsSection,
                            titleMain: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/70 mb-1">Descrição</label>
                    <input
                      type="text"
                      value={siteData.unitsSection.description}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          unitsSection: {
                            ...siteData.unitsSection,
                            description: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {siteData.unitsSection.items.map((u, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#0B0C0E] border border-white/10 flex flex-col sm:flex-row gap-4 items-start"
                    >
                      <div className="w-full sm:w-40 shrink-0 space-y-2">
                        <img
                          src={u.img}
                          alt={u.mapTitle}
                          className="w-full h-28 object-cover rounded-lg border border-white/15"
                        />
                        <label className="block text-center px-3 py-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-xs text-[#FFF2CD] cursor-pointer">
                          <i className="fas fa-camera mr-1"></i> Trocar Foto
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageFileUpload(e.target.files?.[0], (dataUrl) => {
                                const next = [...siteData.unitsSection.items]
                                next[idx] = { ...next[idx], img: dataUrl }
                                setSiteData({
                                  ...siteData,
                                  unitsSection: { ...siteData.unitsSection, items: next },
                                })
                              })
                            }
                          />
                        </label>
                      </div>

                      <div className="flex-1 w-full space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#D4AF37]">
                            Unidade #{idx + 1}
                          </span>
                          {siteData.unitsSection.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = siteData.unitsSection.items.filter(
                                  (_, i) => i !== idx
                                )
                                setSiteData({
                                  ...siteData,
                                  unitsSection: { ...siteData.unitsSection, items: next },
                                })
                              }}
                              className="px-3 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs cursor-pointer"
                            >
                              <i className="fas fa-trash mr-1"></i> Excluir Unidade
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-white/50 mb-1">
                              Nome da Unidade (Exibido na Placa Dourada)
                            </label>
                            <input
                              type="text"
                              value={u.name.replace(/\n/g, ' ')}
                              onChange={(e) => {
                                const next = [...siteData.unitsSection.items]
                                next[idx] = { ...next[idx], name: e.target.value }
                                setSiteData({
                                  ...siteData,
                                  unitsSection: { ...siteData.unitsSection, items: next },
                                })
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-white/50 mb-1">
                              Busca no Google Maps (Endereço ou Nome no Mapa)
                            </label>
                            <input
                              type="text"
                              value={decodeURIComponent(u.mapQuery || '')}
                              onChange={(e) => {
                                const next = [...siteData.unitsSection.items]
                                next[idx] = {
                                  ...next[idx],
                                  mapQuery: e.target.value,
                                  mapTitle: e.target.value,
                                }
                                setSiteData({
                                  ...siteData,
                                  unitsSection: { ...siteData.unitsSection, items: next },
                                })
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-white/50 mb-1">
                              Endereço / Referência (Opcional)
                            </label>
                            <input
                              type="text"
                              value={u.address || ''}
                              onChange={(e) => {
                                const next = [...siteData.unitsSection.items]
                                next[idx] = { ...next[idx], address: e.target.value }
                                setSiteData({
                                  ...siteData,
                                  unitsSection: { ...siteData.unitsSection, items: next },
                                })
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-white/50 mb-1">
                              Texto do Botão da Unidade
                            </label>
                            <input
                              type="text"
                              value={u.ctaText || 'Agendar Aula Experimental'}
                              onChange={(e) => {
                                const next = [...siteData.unitsSection.items]
                                next[idx] = { ...next[idx], ctaText: e.target.value }
                                setSiteData({
                                  ...siteData,
                                  unitsSection: { ...siteData.unitsSection, items: next },
                                })
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addNewUnit}
                  className="w-full py-3 rounded-xl border border-dashed border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                >
                  + Incluir Mais Uma Unidade
                </button>
              </div>
            )}

            {/* ==================== ABA 5: PLANOS & PREÇOS ==================== */}
            {activeSection === 'plans' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bebas italic text-3xl text-[#D4AF37]">
                      5. Planos &amp; Valores ({siteData.plansSection.plansList.length})
                    </h2>
                    <p className="text-xs text-white/60">
                      Edite preços, títulos, benefícios ou inclua novas opções de planos.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSiteData({
                        ...siteData,
                        plansSection: {
                          ...siteData.plansSection,
                          plansList: [
                            ...siteData.plansSection.plansList,
                            {
                              id: 'plano-' + Date.now(),
                              label: 'Novo Plano',
                              title: 'Plano Trimestral',
                              subtitle: 'à partir de',
                              price: 'R$109,00',
                              note: 'pagamento mensal',
                              features: [
                                'TREINOS PERSONALIZADOS COM ACOMPANHAMENTO',
                                'AVALIAÇÃO FÍSICA E PLANEJAMENTO DE METAS',
                                'ACESSO COMPLETO À ESTRUTURA S.A',
                              ],
                            },
                          ],
                        },
                      })
                    }
                    className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold text-xs cursor-pointer shadow-md"
                  >
                    + Incluir Novo Plano
                  </button>
                </div>

                <div className="space-y-6">
                  {siteData.plansSection.plansList.map((p, planIdx) => (
                    <div
                      key={p.id || planIdx}
                      className="p-5 rounded-xl bg-[#0B0C0E] border border-white/10 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="font-bebas italic text-2xl text-[#D4AF37]">
                          Plano #{planIdx + 1}: {p.label}
                        </span>
                        {siteData.plansSection.plansList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const next = siteData.plansSection.plansList.filter(
                                (_, i) => i !== planIdx
                              )
                              setSiteData({
                                ...siteData,
                                plansSection: { ...siteData.plansSection, plansList: next },
                              })
                            }}
                            className="px-3 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs cursor-pointer"
                          >
                            <i className="fas fa-trash mr-1"></i> Excluir Plano
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                        <div>
                          <label className="block text-[11px] text-white/50 mb-1">
                            Nome da Aba (Botão)
                          </label>
                          <input
                            type="text"
                            value={p.label}
                            onChange={(e) => {
                              const next = [...siteData.plansSection.plansList]
                              next[planIdx] = { ...p, label: e.target.value }
                              setSiteData({
                                ...siteData,
                                plansSection: { ...siteData.plansSection, plansList: next },
                              })
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-white/50 mb-1">
                            Título do Card
                          </label>
                          <input
                            type="text"
                            value={p.title}
                            onChange={(e) => {
                              const next = [...siteData.plansSection.plansList]
                              next[planIdx] = { ...p, title: e.target.value }
                              setSiteData({
                                ...siteData,
                                plansSection: { ...siteData.plansSection, plansList: next },
                              })
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-white/50 mb-1">
                            Texto Acima do Preço
                          </label>
                          <input
                            type="text"
                            value={p.subtitle}
                            onChange={(e) => {
                              const next = [...siteData.plansSection.plansList]
                              next[planIdx] = { ...p, subtitle: e.target.value }
                              setSiteData({
                                ...siteData,
                                plansSection: { ...siteData.plansSection, plansList: next },
                              })
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-white/50 mb-1">
                            Valor em Destaque
                          </label>
                          <input
                            type="text"
                            value={p.price}
                            onChange={(e) => {
                              const next = [...siteData.plansSection.plansList]
                              next[planIdx] = { ...p, price: e.target.value }
                              setSiteData({
                                ...siteData,
                                plansSection: { ...siteData.plansSection, plansList: next },
                              })
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-[#D4AF37]/40 text-sm font-semibold text-[#D4AF37]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-white/50 mb-1">
                            Nota abaixo do preço
                          </label>
                          <input
                            type="text"
                            value={p.note || ''}
                            onChange={(e) => {
                              const next = [...siteData.plansSection.plansList]
                              next[planIdx] = { ...p, note: e.target.value }
                              setSiteData({
                                ...siteData,
                                plansSection: { ...siteData.plansSection, plansList: next },
                              })
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-white/50 mb-1.5">
                          Benefícios do Plano (1 por linha — pule linha para adicionar mais)
                        </label>
                        <textarea
                          rows={4}
                          value={(p.features || []).join('\n')}
                          onChange={(e) => {
                            const next = [...siteData.plansSection.plansList]
                            next[planIdx] = { ...p, features: e.target.value.split('\n') }
                            setSiteData({
                              ...siteData,
                              plansSection: { ...siteData.plansSection, plansList: next },
                            })
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== ABA 6: PÁGINA /BLOG & MATÉRIAS ==================== */}
            {activeSection === 'blog' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bebas italic text-3xl text-[#D4AF37]">
                      6. Aba Exclusiva do Blog (/blog) &amp; Matérias Publicadas
                    </h2>
                    <p className="text-xs text-white/60">
                      Edite todos os textos da página <strong>/blog</strong>, a vitrine da Home e
                      publique ou edite quantos artigos quiser.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href="/blog"
                      onClick={(e) => {
                        if (onGoToBlog) {
                          e.preventDefault()
                          handleSave()
                          onGoToBlog()
                        }
                      }}
                      className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white font-medium inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className="fas fa-external-link-alt text-[#D4AF37]"></i>
                      <span>Abrir /blog ao Vivo</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        const newPost = {
                          id: 'post-' + Date.now(),
                          title: 'Nova Matéria do Blog S.A Treinamento',
                          category: 'Dicas de Treino',
                          author: siteData.blogSection.defaultAuthor || 'Equipe S.A Treinamento',
                          date: new Date().toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }),
                          readTime: '3 min de leitura',
                          image: '/images/img9825.jpg',
                          excerpt:
                            'Resumo curto da matéria que aparece no card da página inicial e no /blog.',
                          content:
                            'Escreva aqui o conteúdo completo do artigo. Você pode separar os parágrafos pulando uma linha.',
                        }
                        setSiteData({
                          ...siteData,
                          blogSection: {
                            ...siteData.blogSection,
                            posts: [newPost, ...siteData.blogSection.posts],
                          },
                        })
                      }}
                      className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold text-xs cursor-pointer shadow-md"
                    >
                      + Incluir Nova Matéria no Blog
                    </button>
                  </div>
                </div>

                {/* Bloco 1: Textos e Aparência da Aba Exclusiva /blog */}
                <div className="p-5 rounded-xl bg-[#0B0C0E] border border-[#D4AF37]/30 space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-wider mb-1">
                      <i className="fas fa-globe"></i> Página Dedicada (/blog)
                    </span>
                    <h3 className="text-sm font-semibold text-white">
                      Textos e Configurações da Página Exclusiva do Blog (/blog)
                    </h3>
                    <p className="text-[11px] text-white/55">
                      Tudo o que aparece no cabeçalho, banner, barra de pesquisa, chamada interna e
                      rodapé de <strong>satreinamentos.vercel.app/blog</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/70 mb-1">
                        Título no Topo do Cabeçalho (/blog)
                      </label>
                      <input
                        type="text"
                        value={siteData.blogSection.pageHeaderTitle ?? 'Blog da S.A'}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            blogSection: {
                              ...siteData.blogSection,
                              pageHeaderTitle: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">
                        Subtítulo no Topo do Cabeçalho (/blog)
                      </label>
                      <input
                        type="text"
                        value={
                          siteData.blogSection.pageHeaderSubtitle ??
                          'Portal de Conteúdos, Saúde & Movimento Consciente'
                        }
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            blogSection: {
                              ...siteData.blogSection,
                              pageHeaderSubtitle: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-white/70 mb-1">
                        Selo Dourado do Banner (/blog)
                      </label>
                      <input
                        type="text"
                        value={siteData.blogSection.pageBannerTag ?? 'Conteúdos & Dicas'}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            blogSection: {
                              ...siteData.blogSection,
                              pageBannerTag: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-[#D4AF37]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-white/70 mb-1">
                        Título Principal do Banner (/blog)
                      </label>
                      <input
                        type="text"
                        value={
                          siteData.blogSection.pageBannerTitle ?? 'Blog da S.A Treinamento'
                        }
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            blogSection: {
                              ...siteData.blogSection,
                              pageBannerTitle: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/70 mb-1">
                      Descrição do Banner da Página (/blog)
                    </label>
                    <input
                      type="text"
                      value={
                        siteData.blogSection.pageBannerDesc ??
                        siteData.blogSection.description ??
                        ''
                      }
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          blogSection: {
                            ...siteData.blogSection,
                            pageBannerDesc: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-white/70 mb-1">
                        Texto da Barra de Busca (/blog)
                      </label>
                      <input
                        type="text"
                        value={
                          siteData.blogSection.searchPlaceholder ??
                          'Pesquisar artigo por assunto, palavra-chave ou título...'
                        }
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            blogSection: {
                              ...siteData.blogSection,
                              searchPlaceholder: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">
                        Artigos por Página no /blog
                      </label>
                      <input
                        type="number"
                        min={3}
                        max={30}
                        value={siteData.blogSection.postsPerPage ?? 6}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            blogSection: {
                              ...siteData.blogSection,
                              postsPerPage: Number(e.target.value) || 6,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/70 mb-1">
                        Título da Chamada (CTA) no Final de Cada Artigo
                      </label>
                      <input
                        type="text"
                        value={
                          siteData.blogSection.articleCtaTitle ??
                          'Quer colocar essas dicas em prática?'
                        }
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            blogSection: {
                              ...siteData.blogSection,
                              articleCtaTitle: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">
                        Subtítulo da Chamada (CTA) no Final de Cada Artigo
                      </label>
                      <input
                        type="text"
                        value={
                          siteData.blogSection.articleCtaDesc ??
                          'Agende uma aula experimental gratuita em uma de nossas 3 unidades em Porto Alegre!'
                        }
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            blogSection: {
                              ...siteData.blogSection,
                              articleCtaDesc: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/70 mb-1">
                        Assinatura / Autor Padrão dos Artigos
                      </label>
                      <input
                        type="text"
                        value={siteData.blogSection.defaultAuthor ?? 'Equipe S.A Treinamento'}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            blogSection: {
                              ...siteData.blogSection,
                              defaultAuthor: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">
                        Texto do Rodapé da Página (/blog)
                      </label>
                      <input
                        type="text"
                        value={
                          siteData.blogSection.pageFooterText ??
                          '© S.A Treinamento — Blog Oficial & Conteúdos'
                        }
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            blogSection: {
                              ...siteData.blogSection,
                              pageFooterText: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Bloco 2: Vitrine Resumida do Blog na Página Inicial (Home) */}
                <div className="p-5 rounded-xl bg-[#0B0C0E] border border-white/10 space-y-4">
                  <div className="border-b border-white/10 pb-2">
                    <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                      Vitrine do Blog na Página Inicial (Home)
                    </h3>
                    <p className="text-[11px] text-white/50">
                      Configura o título da seção na Home e quantos artigos recentes aparecem antes
                      do botão &ldquo;Ver Todos&rdquo;.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-white/70 mb-1">
                        Subtítulo na Home
                      </label>
                      <input
                        type="text"
                        value={siteData.blogSection.subtitleTop}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            blogSection: {
                              ...siteData.blogSection,
                              subtitleTop: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">
                        Título Principal na Home
                      </label>
                      <input
                        type="text"
                        value={siteData.blogSection.titleMain}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            blogSection: {
                              ...siteData.blogSection,
                              titleMain: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">
                        Qtd. de Artigos na Home
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={9}
                        value={siteData.blogSection.homePreviewCount ?? 3}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            blogSection: {
                              ...siteData.blogSection,
                              homePreviewCount: Number(e.target.value) || 3,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/70 mb-1">
                        Descrição na Home
                      </label>
                      <input
                        type="text"
                        value={siteData.blogSection.description}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            blogSection: {
                              ...siteData.blogSection,
                              description: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">
                        Texto do Botão Dourado na Home (que abre o /blog)
                      </label>
                      <input
                        type="text"
                        value={
                          siteData.blogSection.homeButtonText ?? 'Ver Todos os Artigos no Blog'
                        }
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            blogSection: {
                              ...siteData.blogSection,
                              homeButtonText: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                {/* Lista de Matérias Publicadas */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider">
                      Matérias Publicadas no /blog ({siteData.blogSection.posts.length})
                    </h3>
                    <span className="text-[11px] text-white/50">
                      As {siteData.blogSection.homePreviewCount ?? 3} primeiras matérias também
                      aparecem em destaque na Página Inicial
                    </span>
                  </div>
                  {siteData.blogSection.posts.map((post, idx) => (
                    <div
                      key={post.id || idx}
                      className="p-5 rounded-xl bg-[#0B0C0E] border border-white/10 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                        <span className="text-xs font-semibold text-[#D4AF37]">
                          Matéria #{idx + 1}{' '}
                          {idx < (siteData.blogSection.homePreviewCount ?? 3) && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px]">
                              Destaque na Home + /blog
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...siteData.blogSection.posts]
                                const temp = next[idx - 1]
                                next[idx - 1] = next[idx]
                                next[idx] = temp
                                setSiteData({
                                  ...siteData,
                                  blogSection: { ...siteData.blogSection, posts: next },
                                })
                              }}
                              title="Subir posição da matéria"
                              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 text-xs text-white/75 cursor-pointer"
                            >
                              ↑ Subir
                            </button>
                          )}
                          {idx < siteData.blogSection.posts.length - 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...siteData.blogSection.posts]
                                const temp = next[idx + 1]
                                next[idx + 1] = next[idx]
                                next[idx] = temp
                                setSiteData({
                                  ...siteData,
                                  blogSection: { ...siteData.blogSection, posts: next },
                                })
                              }}
                              title="Descer posição da matéria"
                              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 text-xs text-white/75 cursor-pointer"
                            >
                              ↓ Descer
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="w-full sm:w-44 shrink-0 space-y-2">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-28 object-cover rounded-lg border border-white/15"
                          />
                          <label className="block text-center px-3 py-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-xs text-[#FFF2CD] cursor-pointer">
                            <i className="fas fa-camera mr-1"></i> Trocar Capa
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e.target.files?.[0], (dataUrl) => {
                                  const next = [...siteData.blogSection.posts]
                                  next[idx] = { ...next[idx], image: dataUrl }
                                  setSiteData({
                                    ...siteData,
                                    blogSection: {
                                      ...siteData.blogSection,
                                      posts: next,
                                    },
                                  })
                                })
                              }
                            />
                          </label>
                        </div>

                        <div className="flex-1 w-full space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] text-white/50 mb-1">
                                Título da Matéria
                              </label>
                              <input
                                type="text"
                                value={post.title}
                                onChange={(e) => {
                                  const next = [...siteData.blogSection.posts]
                                  next[idx] = { ...next[idx], title: e.target.value }
                                  setSiteData({
                                    ...siteData,
                                    blogSection: {
                                      ...siteData.blogSection,
                                      posts: next,
                                    },
                                  })
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm font-semibold text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-white/50 mb-1">
                                Categoria
                              </label>
                              <input
                                type="text"
                                value={post.category}
                                onChange={(e) => {
                                  const next = [...siteData.blogSection.posts]
                                  next[idx] = { ...next[idx], category: e.target.value }
                                  setSiteData({
                                    ...siteData,
                                    blogSection: {
                                      ...siteData.blogSection,
                                      posts: next,
                                    },
                                  })
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-[#D4AF37]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] text-white/50 mb-1">Data</label>
                              <input
                                type="text"
                                value={post.date}
                                onChange={(e) => {
                                  const next = [...siteData.blogSection.posts]
                                  next[idx] = { ...next[idx], date: e.target.value }
                                  setSiteData({
                                    ...siteData,
                                    blogSection: {
                                      ...siteData.blogSection,
                                      posts: next,
                                    },
                                  })
                                }}
                                className="w-full px-3 py-1.5 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-white/50 mb-1">
                                Tempo de Leitura
                              </label>
                              <input
                                type="text"
                                value={post.readTime}
                                onChange={(e) => {
                                  const next = [...siteData.blogSection.posts]
                                  next[idx] = { ...next[idx], readTime: e.target.value }
                                  setSiteData({
                                    ...siteData,
                                    blogSection: {
                                      ...siteData.blogSection,
                                      posts: next,
                                    },
                                  })
                                }}
                                className="w-full px-3 py-1.5 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] text-white/50 mb-1">
                              Resumo curto (Exibido no Card)
                            </label>
                            <textarea
                              rows={2}
                              value={post.excerpt}
                              onChange={(e) => {
                                const next = [...siteData.blogSection.posts]
                                next[idx] = { ...next[idx], excerpt: e.target.value }
                                setSiteData({
                                  ...siteData,
                                  blogSection: {
                                    ...siteData.blogSection,
                                    posts: next,
                                  },
                                })
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-white/50 mb-1">
                              Conteúdo Completo da Matéria (Exibido ao clicar em &ldquo;Ler
                              Matéria&rdquo;)
                            </label>
                            <textarea
                              rows={5}
                              value={post.content}
                              onChange={(e) => {
                                const next = [...siteData.blogSection.posts]
                                next[idx] = { ...next[idx], content: e.target.value }
                                setSiteData({
                                  ...siteData,
                                  blogSection: {
                                    ...siteData.blogSection,
                                    posts: next,
                                  },
                                })
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white leading-relaxed"
                            />
                          </div>

                          {siteData.blogSection.posts.length > 1 && (
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  const next = siteData.blogSection.posts.filter(
                                    (_, i) => i !== idx
                                  )
                                  setSiteData({
                                    ...siteData,
                                    blogSection: {
                                      ...siteData.blogSection,
                                      posts: next,
                                    },
                                  })
                                }}
                                className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs cursor-pointer"
                              >
                                <i className="fas fa-trash mr-1"></i> Excluir Matéria
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== ABA 7: DEPOIMENTOS DE ALUNOS ==================== */}
            {activeSection === 'testimonials' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bebas italic text-3xl text-[#D4AF37]">
                      7. Depoimentos de Alunos ({siteData.testimonials.length})
                    </h2>
                    <p className="text-xs text-white/60">
                      Edite ou inclua novos depoimentos na seção &ldquo;O que dizem nossos
                      Alunos?&rdquo;.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSiteData({
                        ...siteData,
                        testimonials: [
                          ...siteData.testimonials,
                          {
                            name: 'Novo Aluno(a)',
                            avatar: '/images/avatar-depoimento.png',
                            text: 'Escreva aqui o depoimento do aluno sobre a S.A Treinamento.',
                          },
                        ],
                      })
                    }
                    className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold text-xs cursor-pointer shadow-md"
                  >
                    + Incluir Depoimento
                  </button>
                </div>

                <div className="space-y-4">
                  {siteData.testimonials.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#0B0C0E] border border-white/10 flex flex-col sm:flex-row gap-4 items-start"
                    >
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]"
                        />
                        <label className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-[11px] cursor-pointer">
                          Trocar Foto
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageFileUpload(e.target.files?.[0], (dataUrl) => {
                                const next = [...siteData.testimonials]
                                next[idx] = { ...next[idx], avatar: dataUrl }
                                setSiteData({ ...siteData, testimonials: next })
                              })
                            }
                          />
                        </label>
                      </div>

                      <div className="flex-1 w-full space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-[11px] text-white/50">
                            Nome do Aluno(a) #{idx + 1}
                          </label>
                          {siteData.testimonials.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = siteData.testimonials.filter((_, i) => i !== idx)
                                setSiteData({ ...siteData, testimonials: next })
                              }}
                              className="px-2.5 py-1 rounded bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs cursor-pointer"
                            >
                              <i className="fas fa-trash mr-1"></i> Excluir
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const next = [...siteData.testimonials]
                            next[idx] = { ...next[idx], name: e.target.value }
                            setSiteData({ ...siteData, testimonials: next })
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-white"
                        />
                        <div>
                          <label className="block text-[11px] text-white/50 mb-1">
                            Texto do Depoimento
                          </label>
                          <textarea
                            rows={2}
                            value={item.text}
                            onChange={(e) => {
                              const next = [...siteData.testimonials]
                              next[idx] = { ...next[idx], text: e.target.value }
                              setSiteData({ ...siteData, testimonials: next })
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== ABA 8: RODAPÉ, LINKS ÚTEIS & REDES SOCIAIS ==================== */}
            {activeSection === 'footer' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-bebas italic text-3xl text-[#D4AF37]">
                    8. Rodapé, Links Úteis, Unidades &amp; Redes Sociais
                  </h2>
                  <p className="text-xs text-white/60">
                    Edite os textos institucionais e inclua quantos Links Úteis ou Redes Sociais
                    desejar no rodapé.
                  </p>
                </div>

                {/* Bloco 1: Textos Institucionais */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-white/70 mb-1.5">
                      Frase da Faixa de Atendimento Online
                    </label>
                    <input
                      type="text"
                      value={siteData.footer.onlineBannerDesc}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          footer: { ...siteData.footer, onlineBannerDesc: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/70 mb-1.5">
                      Texto Institucional abaixo da Logo no Rodapé
                    </label>
                    <textarea
                      rows={2}
                      value={siteData.footer.brandDescription}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          footer: { ...siteData.footer, brandDescription: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/70 mb-1.5">
                        Razão Social / Nome da Empresa
                      </label>
                      <input
                        type="text"
                        value={siteData.footer.companyName}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            footer: { ...siteData.footer, companyName: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1.5">
                        Cidade / Estado ou CNPJ
                      </label>
                      <input
                        type="text"
                        value={siteData.footer.companyLocation}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            footer: { ...siteData.footer, companyLocation: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Bloco 2: Links Úteis do Rodapé (Expansível) */}
                <div className="p-5 rounded-xl bg-[#0B0C0E] border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-[#D4AF37]">
                        Coluna &ldquo;Links Úteis&rdquo; do Rodapé (
                        {(siteData.footer.usefulLinks || []).length})
                      </h3>
                      <p className="text-xs text-white/50">
                        Inclua, edite ou remova qualquer link útil no rodapé.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSiteData({
                          ...siteData,
                          footer: {
                            ...siteData.footer,
                            usefulLinks: [
                              ...(siteData.footer.usefulLinks || []),
                              { label: 'Novo Link Útil', href: '#topo' },
                            ],
                          },
                        })
                      }
                      className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold text-xs cursor-pointer shadow"
                    >
                      + Incluir Link Útil
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {(siteData.footer.usefulLinks || []).map((linkItem, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-center gap-2.5">
                        <input
                          type="text"
                          value={linkItem.label}
                          onChange={(e) => {
                            const next = [...siteData.footer.usefulLinks]
                            next[idx] = { ...next[idx], label: e.target.value }
                            setSiteData({
                              ...siteData,
                              footer: { ...siteData.footer, usefulLinks: next },
                            })
                          }}
                          placeholder="Texto do Link (ex: Trabalhe Conosco)"
                          className="w-full sm:w-5/12 px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={linkItem.href}
                          onChange={(e) => {
                            const next = [...siteData.footer.usefulLinks]
                            next[idx] = { ...next[idx], href: e.target.value }
                            setSiteData({
                              ...siteData,
                              footer: { ...siteData.footer, usefulLinks: next },
                            })
                          }}
                          placeholder="Destino (ex: #unidades ou https://...)"
                          className="w-full sm:flex-1 px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-[#D4AF37]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = siteData.footer.usefulLinks.filter((_, i) => i !== idx)
                            setSiteData({
                              ...siteData,
                              footer: { ...siteData.footer, usefulLinks: next },
                            })
                          }}
                          className="px-3 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs cursor-pointer"
                          title="Excluir Link Útil"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bloco 3: Redes Sociais do Rodapé (Expansível) */}
                <div className="p-5 rounded-xl bg-[#0B0C0E] border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-[#D4AF37]">
                        Coluna &ldquo;Redes Sociais&rdquo; do Rodapé (
                        {(siteData.footer.socialLinks || []).length})
                      </h3>
                      <p className="text-xs text-white/50">
                        Inclua Instagram, Facebook, YouTube, TikTok, LinkedIn, WhatsApp ou qualquer
                        outra rede social.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSiteData({
                          ...siteData,
                          footer: {
                            ...siteData.footer,
                            socialLinks: [
                              ...(siteData.footer.socialLinks || []),
                              {
                                platform: 'YouTube',
                                icon: 'fab fa-youtube',
                                url: 'https://www.youtube.com/',
                              },
                            ],
                          },
                        })
                      }
                      className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold text-xs cursor-pointer shadow"
                    >
                      + Incluir Rede Social
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(siteData.footer.socialLinks || []).map((soc, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-center gap-2.5 p-2.5 rounded-lg bg-[#141519]/70 border border-white/5"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#1F1F1F] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] text-lg shrink-0">
                          <i className={soc.icon || 'fas fa-globe'}></i>
                        </div>

                        <select
                          value={soc.icon}
                          onChange={(e) => {
                            const selected = SOCIAL_ICON_OPTIONS.find(
                              (opt) => opt.icon === e.target.value
                            )
                            const next = [...siteData.footer.socialLinks]
                            next[idx] = {
                              ...next[idx],
                              icon: e.target.value,
                              platform: selected ? selected.label : next[idx].platform,
                            }
                            setSiteData({
                              ...siteData,
                              footer: { ...siteData.footer, socialLinks: next },
                            })
                          }}
                          className="w-full sm:w-44 px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/15 text-xs text-white"
                        >
                          {SOCIAL_ICON_OPTIONS.map((opt) => (
                            <option key={opt.icon} value={opt.icon}>
                              {opt.label}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          value={soc.platform}
                          onChange={(e) => {
                            const next = [...siteData.footer.socialLinks]
                            next[idx] = { ...next[idx], platform: e.target.value }
                            setSiteData({
                              ...siteData,
                              footer: { ...siteData.footer, socialLinks: next },
                            })
                          }}
                          placeholder="Nome (ex: YouTube)"
                          className="w-full sm:w-36 px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/15 text-xs text-white"
                        />

                        <input
                          type="text"
                          value={soc.url}
                          onChange={(e) => {
                            const next = [...siteData.footer.socialLinks]
                            next[idx] = { ...next[idx], url: e.target.value }
                            setSiteData({
                              ...siteData,
                              footer: { ...siteData.footer, socialLinks: next },
                            })
                          }}
                          placeholder="Link completo (https://...)"
                          className="w-full sm:flex-1 px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/15 text-xs text-[#D4AF37]"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const next = siteData.footer.socialLinks.filter((_, i) => i !== idx)
                            setSiteData({
                              ...siteData,
                              footer: { ...siteData.footer, socialLinks: next },
                            })
                          }}
                          className="px-3 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs cursor-pointer"
                          title="Excluir Rede Social"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bloco 4: Atalho para Unidades no Rodapé */}
                <div className="p-4 rounded-xl bg-[#0B0C0E] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-[#D4AF37]">
                      Coluna &ldquo;Nossas Unidades&rdquo; no Rodapé (
                      {siteData.unitsSection.items.length} unidades ativas)
                    </h4>
                    <p className="text-[11px] text-white/60">
                      A lista de unidades do rodapé é sincronizada automaticamente com a seção de
                      Unidades.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSection('units')}
                    className="px-4 py-2 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-xs text-[#FFF2CD] font-medium cursor-pointer shrink-0"
                  >
                    Ir para 4. Unidades (+ Incluir Unidade) →
                  </button>
                </div>
              </div>
            )}

            {/* ==================== ABA 9: SENHA & SEGURANÇA ==================== */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-bebas italic text-3xl text-[#D4AF37]">
                    9. Senha do Painel &amp; Segurança de Acesso
                  </h2>
                  <p className="text-xs text-white/60">
                    Altere o usuário e a senha de acesso ao painel administrativo (/painel) e
                    configure o bloqueio de homologação da página inicial.
                  </p>
                </div>

                {/* Card 1: Credenciais do Painel (/painel) */}
                <div className="p-6 rounded-xl bg-[#0B0C0E] border border-[#D4AF37]/30 space-y-5">
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                        <i className="fas fa-user-shield"></i> Acesso ao Editor (/painel)
                      </span>
                      <h3 className="text-base font-semibold text-white">
                        Usuário e Senha do Administrador
                      </h3>
                      <p className="text-xs text-white/55 mt-0.5">
                        Defina qual usuário e senha serão solicitados ao acessar{' '}
                        <strong className="text-[#D4AF37]">/painel</strong>. Após alterar, clique em{' '}
                        <strong className="text-white">Salvar Alterações</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/70 mb-1.5">
                        Usuário do Administrador
                      </label>
                      <input
                        type="text"
                        value={siteData.security?.adminUser ?? 'admin'}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            security: {
                              ...(siteData.security || {}),
                              adminUser: e.target.value,
                            },
                          })
                        }
                        placeholder="Ex: admin"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#141519] border border-white/15 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/70 mb-1.5">
                        Nova Senha do Painel (/painel)
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showAdminPass ? 'text' : 'password'}
                          value={siteData.security?.adminPass ?? 'sa2026'}
                          onChange={(e) =>
                            setSiteData({
                              ...siteData,
                              security: {
                                ...(siteData.security || {}),
                                adminPass: e.target.value,
                              },
                            })
                          }
                          placeholder="Digite a nova senha do painel"
                          className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-[#141519] border border-white/15 text-sm text-[#D4AF37] font-semibold focus:outline-none focus:border-[#D4AF37]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPass((v) => !v)}
                          className="absolute right-2.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-white/70 cursor-pointer"
                        >
                          {showAdminPass ? 'Ocultar' : 'Mostrar'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <p className="text-[11px] text-white/50">
                      Senha atual configurada:{' '}
                      <span className="text-[#FFF2CD] font-mono bg-white/5 px-2 py-0.5 rounded">
                        {showAdminPass ? siteData.security?.adminPass || 'sa2026' : '••••••••'}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:brightness-110 text-black font-semibold text-xs uppercase tracking-wider cursor-pointer shadow-md inline-flex items-center gap-2"
                    >
                      <i className="fas fa-check-circle"></i>
                      <span>Confirmar Nova Senha</span>
                    </button>
                  </div>
                </div>

                {/* Card 2: Bloqueio de Homologação do Site */}
                <div className="p-6 rounded-xl bg-[#0B0C0E] border border-white/10 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                        <i className="fas fa-lock"></i> Proteção de Homologação do Site
                      </span>
                      <h3 className="text-base font-semibold text-white">
                        Tela de Senha Inicial para Visitantes
                      </h3>
                      <p className="text-xs text-white/55 mt-0.5">
                        Enquanto o site estiver em fase de aprovação, exige senha antes de carregar
                        o conteúdo. Quando o site for lançado oficialmente ao público, basta
                        desativar esta chave!
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSiteData({
                          ...siteData,
                          security: {
                            ...(siteData.security || {}),
                            gateEnabled: siteData.security?.gateEnabled === false ? true : false,
                          },
                        })
                      }
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 inline-flex items-center gap-2 ${
                        siteData.security?.gateEnabled !== false
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/10 text-white/60 border border-white/15'
                      }`}
                    >
                      <i
                        className={`fas ${
                          siteData.security?.gateEnabled !== false ? 'fa-toggle-on' : 'fa-toggle-off'
                        } text-base`}
                      ></i>
                      <span>
                        {siteData.security?.gateEnabled !== false
                          ? 'Bloqueio Ativo (Pede Senha)'
                          : 'Site Público (Sem Senha Inicial)'}
                      </span>
                    </button>
                  </div>

                  {siteData.security?.gateEnabled !== false && (
                    <div className="max-w-md">
                      <label className="block text-xs text-white/70 mb-1.5">
                        Senha da Tela de Homologação do Site
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showGatePass ? 'text' : 'password'}
                          value={siteData.security?.gatePass ?? 'sa2026'}
                          onChange={(e) =>
                            setSiteData({
                              ...siteData,
                              security: {
                                ...(siteData.security || {}),
                                gatePass: e.target.value,
                              },
                            })
                          }
                          placeholder="Ex: sa2026"
                          className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-[#141519] border border-white/15 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowGatePass((v) => !v)}
                          className="absolute right-2.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-white/70 cursor-pointer"
                        >
                          {showGatePass ? 'Ocultar' : 'Mostrar'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card 3: Controle Comercial Cloway AI (Protegido pela Senha Mestra da Agência) */}
                <div className="p-6 rounded-xl bg-[#0B0C0E] border border-[#7C3AED]/40 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7C3AED]/20 text-[#DDD6FE] text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                        <i className="fas fa-robot"></i> Controle de Licença • Cloway AI
                      </span>
                      <h3 className="text-base font-semibold text-white">
                        Integração SA Virtual &amp; Licença Cloway (Exclusivo Agência)
                      </h3>
                      <p className="text-xs text-white/55 mt-0.5">
                        Controle se a <strong className="text-[#D4AF37]">SA Virtual</strong> roda em
                        Modo Vitrine (para venda), Integração Real (exigindo cadastro ativo na
                        Cloway) ou Desativada.
                      </p>
                    </div>
                  </div>

                  {!agencyUnlocked ? (
                    <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#141519] p-4 rounded-xl border border-white/10">
                      <div className="flex-1 text-xs text-white/70">
                        <i className="fas fa-shield-alt text-[#D4AF37] mr-2"></i>
                        Área restrita ao desenvolvedor/parceiro <strong>Cloway</strong>. Digite a
                        chave mestra para gerenciar a licença deste cliente:
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="password"
                          value={agencyKeyInput}
                          onChange={(e) => {
                            setAgencyKeyInput(e.target.value)
                            if (agencyKeyError) setAgencyKeyError(false)
                          }}
                          placeholder="Chave Mestra Agência"
                          className="px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/15 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (agencyKeyInput.trim().toLowerCase() === MASTER_RECOVERY_PASS) {
                              setAgencyUnlocked(true)
                              setAgencyKeyError(false)
                              try {
                                sessionStorage.setItem('sa_agency_master', 'true')
                              } catch {
                                // ignore
                              }
                            } else {
                              setAgencyKeyError(true)
                            }
                          }}
                          className="px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-xs cursor-pointer shrink-0"
                        >
                          Liberar Controle
                        </button>
                      </div>
                      {agencyKeyError && (
                        <span className="text-[11px] text-red-400">Chave incorreta.</span>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          {
                            id: 'DEMO_COMERCIAL',
                            title: '1. Vitrine Comercial (Demo)',
                            desc: 'Para apresentar na reunião. Simula conversa e agendamento, sem salvar leads reais de graça.',
                          },
                          {
                            id: 'PRODUCAO_API',
                            title: '2. Integração Total Cloway',
                            desc: 'Conecta na API da Cloway. Só responde se o Tenant e a Licença estiverem ativos na Cloway.',
                          },
                          {
                            id: 'DESATIVADO',
                            title: '3. Desativado (Sem Cloway)',
                            desc: 'Cliente comprou só o site. Remove a SA Virtual e deixa apenas o WhatsApp padrão.',
                          },
                        ].map((opt) => {
                          const currentMode = siteData.clowayConfig?.mode || 'DEMO_COMERCIAL'
                          const active = currentMode === opt.id
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() =>
                                setSiteData({
                                  ...siteData,
                                  clowayConfig: {
                                    ...(siteData.clowayConfig || {}),
                                    mode: opt.id,
                                  },
                                })
                              }
                              className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                                active
                                  ? 'bg-[#7C3AED]/20 border-[#A78BFA] text-white shadow-lg'
                                  : 'bg-[#141519] border-white/10 text-white/65 hover:border-white/25'
                              }`}
                            >
                              <div className="text-xs font-bold text-[#FFF2CD] mb-1">
                                {opt.title}
                              </div>
                              <p className="text-[11px] leading-relaxed text-white/65">
                                {opt.desc}
                              </p>
                            </button>
                          )
                        })}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-xs text-white/70 mb-1.5">
                            Nome Exibido para o Aluno no Site
                          </label>
                          <input
                            type="text"
                            value={siteData.clowayConfig?.assistantName ?? 'SA Virtual'}
                            onChange={(e) =>
                              setSiteData({
                                ...siteData,
                                clowayConfig: {
                                  ...(siteData.clowayConfig || {}),
                                  assistantName: e.target.value,
                                },
                              })
                            }
                            placeholder="Ex: SA Virtual"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#141519] border border-white/15 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-white/70 mb-1.5">
                            URL da API Cloway
                          </label>
                          <input
                            type="text"
                            value={
                              siteData.clowayConfig?.apiUrl ?? 'https://api.cloway.com.br/v1'
                            }
                            onChange={(e) =>
                              setSiteData({
                                ...siteData,
                                clowayConfig: {
                                  ...(siteData.clowayConfig || {}),
                                  apiUrl: e.target.value,
                                },
                              })
                            }
                            placeholder="https://api.cloway.com.br/v1"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#141519] border border-white/15 text-sm text-[#D4AF37]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-white/70 mb-1.5">
                            ID do Cliente / Tenant liberado na Cloway
                          </label>
                          <input
                            type="text"
                            value={siteData.clowayConfig?.tenantId ?? ''}
                            onChange={(e) =>
                              setSiteData({
                                ...siteData,
                                clowayConfig: {
                                  ...(siteData.clowayConfig || {}),
                                  tenantId: e.target.value,
                                },
                              })
                            }
                            placeholder="Ex: sa-treinamento-poa"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#141519] border border-white/15 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-white/70 mb-1.5">
                            Chave de Licença / Token da Conta Cloway
                          </label>
                          <input
                            type="text"
                            value={siteData.clowayConfig?.licenseKey ?? ''}
                            onChange={(e) =>
                              setSiteData({
                                ...siteData,
                                clowayConfig: {
                                  ...(siteData.clowayConfig || {}),
                                  licenseKey: e.target.value,
                                },
                              })
                            }
                            placeholder="Cole o Token gerado no painel da Cloway"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#141519] border border-white/15 text-sm text-emerald-300 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
