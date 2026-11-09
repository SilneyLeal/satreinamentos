import React, { useState } from 'react'
import {
  DEFAULT_SITE_DATA,
  loadSiteData,
  saveSiteData,
  resetSiteData,
} from './defaultSiteData'

const ADMIN_PASSWORDS = ['sa2026', 'admin2026', 'admin']

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

export default function AdminPanel({ onBackToSite }) {
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

  const handleLogin = (e) => {
    e.preventDefault()
    if (ADMIN_PASSWORDS.includes(loginPass.trim().toLowerCase())) {
      setIsLogged(true)
      setLoginError(false)
      try {
        sessionStorage.setItem('sa_admin_logged', 'true')
        sessionStorage.setItem('sa_homolog_unlocked', 'true')
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
              Acesse para editar textos, fotos, unidades, planos e publicar matérias no Blog.
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
    { id: 'hero', label: '1. Topo & Hero', icon: 'fa-home' },
    { id: 'about', label: '2. Sobre & 7 Fotos', icon: 'fa-th-large' },
    { id: 'modalities', label: '3. Modalidades & Carrossel', icon: 'fa-dumbbell' },
    { id: 'units', label: '4. Unidades (3)', icon: 'fa-map-marker-alt' },
    { id: 'plans', label: '5. Planos & Preços', icon: 'fa-tags' },
    { id: 'blog', label: '6. Blog & Matérias', icon: 'fa-newspaper' },
    { id: 'testimonials', label: '7. Depoimentos', icon: 'fa-comments' },
    { id: 'footer', label: '8. Rodapé & Redes', icon: 'fa-share-alt' },
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
                Edite textos, fotos, planos, unidades e matérias do Blog em tempo real
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
              onClick={handleReset}
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/75 hover:text-white transition cursor-pointer"
            >
              Restaurar Padrão
            </button>

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
              <i className="fas fa-lightbulb"></i>
              <span>Dica Rápida</span>
            </div>
            <p className="leading-relaxed text-[11px] text-white/60">
              Você pode subir fotos direto do seu computador ou celular clicando em{' '}
              <strong className="text-white">Enviar Foto</strong> em qualquer imagem, e depois clicar em{' '}
              <strong className="text-[#D4AF37]">Salvar Alterações</strong>.
            </p>
          </div>
        </aside>

        {/* Área Principal de Edição */}
        <main className="lg:col-span-9">
          <div className="rounded-2xl bg-[#141519] border border-white/10 p-6 sm:p-8 space-y-6">
            {/* ==================== ABA 1: TOPO & HERO ==================== */}
            {activeSection === 'hero' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-bebas italic text-3xl text-[#D4AF37]">
                    1. Topo, WhatsApp &amp; Banner Principal (Hero)
                  </h2>
                  <p className="text-xs text-white/60">
                    Altere os títulos principais, botão de chamada, foto de fundo e número de WhatsApp.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/70 mb-1.5">
                      Número do WhatsApp (com DDD, somente números)
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
                      Texto do Botão no Menu Superior
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

            {/* ==================== ABA 2: SOBRE & 7 CARDS ==================== */}
            {activeSection === 'about' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-bebas italic text-3xl text-[#D4AF37]">
                    2. Seção &ldquo;Muito prazer, nós somos a S.A Treinamento&rdquo;
                  </h2>
                  <p className="text-xs text-white/60">
                    Edite os títulos da seção e cada um dos 7 blocos de fotos e textos.
                  </p>
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
                    7 Cards da Galeria (Foto + Texto ao passar o mouse)
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
                        <div>
                          <label className="block text-[11px] text-white/50 mb-1">
                            Card #{idx + 1} — Título
                          </label>
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
                        </div>
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
                    Edite os nomes das modalidades e as fotos que passam no carrossel ao lado.
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
                      Lista de Modalidades
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
                      className="px-3 py-1 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs text-[#FFF2CD] cursor-pointer"
                    >
                      + Adicionar Modalidade
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
                          className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs cursor-pointer"
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
                    <label className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-xs text-[#FFF2CD] cursor-pointer">
                      + Enviar Nova Foto para o Carrossel
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
                      4. Unidades S.A Treinamento
                    </h2>
                    <p className="text-xs text-white/60">
                      Edite fotos, nomes e localização no mapa das unidades ativas.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
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
                              mapTitle: 'S.A Treinamento',
                              address: 'Porto Alegre, RS',
                            },
                          ],
                        },
                      })
                    }
                    className="px-3.5 py-2 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs text-[#FFF2CD] cursor-pointer"
                  >
                    + Adicionar Unidade
                  </button>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-white/50 mb-1">
                              Nome da Unidade
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
                              Busca no Google Maps (Endereço ou Nome)
                            </label>
                            <input
                              type="text"
                              value={decodeURIComponent(u.mapQuery)}
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

                        {siteData.unitsSection.items.length > 1 && (
                          <div className="flex justify-end">
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
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs cursor-pointer"
                            >
                              <i className="fas fa-trash mr-1"></i> Excluir Unidade
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== ABA 5: PLANOS & PREÇOS ==================== */}
            {activeSection === 'plans' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-bebas italic text-3xl text-[#D4AF37]">
                    5. Planos &amp; Valores (Mensal, Anual e Duplas)
                  </h2>
                  <p className="text-xs text-white/60">
                    Edite preços, títulos, observações e os benefícios de cada plano.
                  </p>
                </div>

                <div className="space-y-6">
                  {['mensal', 'anual', 'duplas'].map((planKey) => {
                    const p = siteData.plansSection.plans[planKey]
                    return (
                      <div
                        key={planKey}
                        className="p-5 rounded-xl bg-[#0B0C0E] border border-white/10 space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="font-bebas italic text-2xl text-[#D4AF37]">
                            Aba: {p.label || planKey.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[11px] text-white/50 mb-1">
                              Título do Card
                            </label>
                            <input
                              type="text"
                              value={p.title}
                              onChange={(e) => {
                                setSiteData({
                                  ...siteData,
                                  plansSection: {
                                    ...siteData.plansSection,
                                    plans: {
                                      ...siteData.plansSection.plans,
                                      [planKey]: { ...p, title: e.target.value },
                                    },
                                  },
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
                                setSiteData({
                                  ...siteData,
                                  plansSection: {
                                    ...siteData.plansSection,
                                    plans: {
                                      ...siteData.plansSection.plans,
                                      [planKey]: { ...p, subtitle: e.target.value },
                                    },
                                  },
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
                                setSiteData({
                                  ...siteData,
                                  plansSection: {
                                    ...siteData.plansSection,
                                    plans: {
                                      ...siteData.plansSection.plans,
                                      [planKey]: { ...p, price: e.target.value },
                                    },
                                  },
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
                                setSiteData({
                                  ...siteData,
                                  plansSection: {
                                    ...siteData.plansSection,
                                    plans: {
                                      ...siteData.plansSection.plans,
                                      [planKey]: { ...p, note: e.target.value },
                                    },
                                  },
                                })
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-sm text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-white/50 mb-1.5">
                            Benefícios do Plano (1 por linha)
                          </label>
                          <textarea
                            rows={4}
                            value={p.features.join('\n')}
                            onChange={(e) => {
                              setSiteData({
                                ...siteData,
                                plansSection: {
                                  ...siteData.plansSection,
                                  plans: {
                                    ...siteData.plansSection.plans,
                                    [planKey]: {
                                      ...p,
                                      features: e.target.value.split('\n'),
                                    },
                                  },
                                },
                              })
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[#141519] border border-white/15 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ==================== ABA 6: BLOG & MATÉRIAS ==================== */}
            {activeSection === 'blog' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bebas italic text-3xl text-[#D4AF37]">
                      6. Blog S.A Treinamento — Publicar &amp; Editar Matérias
                    </h2>
                    <p className="text-xs text-white/60">
                      Adicione artigos, dicas de treino, fotos de capa e conteúdos completos para os alunos.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newPost = {
                        id: 'post-' + Date.now(),
                        title: 'Nova Matéria do Blog S.A Treinamento',
                        category: 'Dicas de Treino',
                        date: new Date().toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        }),
                        readTime: '3 min de leitura',
                        image: '/images/img9825.jpg',
                        excerpt:
                          'Resumo curto da matéria que aparece no card da página inicial.',
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
                    + Nova Matéria no Blog
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-white/70 mb-1">Subtítulo da Seção</label>
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
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/70 mb-1">Título Principal</label>
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
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/70 mb-1">Descrição</label>
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
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/15 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  {siteData.blogSection.posts.map((post, idx) => (
                    <div
                      key={post.id || idx}
                      className="p-5 rounded-xl bg-[#0B0C0E] border border-white/10 space-y-4"
                    >
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
                              Conteúdo Completo da Matéria (Exibido ao clicar em &ldquo;Ler Artigo&rdquo;)
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
                                className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs cursor-pointer"
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
                <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-bebas italic text-3xl text-[#D4AF37]">
                      7. Depoimentos de Alunos
                    </h2>
                    <p className="text-xs text-white/60">
                      Edite os depoimentos exibidos na seção &ldquo;O que dizem nossos Alunos?&rdquo;.
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
                    className="px-3.5 py-2 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs text-[#FFF2CD] cursor-pointer"
                  >
                    + Adicionar Depoimento
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
                        <div>
                          <label className="block text-[11px] text-white/50 mb-1">
                            Nome do Aluno(a)
                          </label>
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
                        </div>
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

            {/* ==================== ABA 8: RODAPÉ & REDES ==================== */}
            {activeSection === 'footer' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-bebas italic text-3xl text-[#D4AF37]">
                    8. Rodapé, Atendimento &amp; Redes Sociais
                  </h2>
                  <p className="text-xs text-white/60">
                    Edite as informações institucionais e links das redes sociais no rodapé.
                  </p>
                </div>

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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/70 mb-1.5">
                        Link do Instagram
                      </label>
                      <input
                        type="text"
                        value={siteData.footer.instagramUrl}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            footer: { ...siteData.footer, instagramUrl: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1.5">
                        Link do Facebook
                      </label>
                      <input
                        type="text"
                        value={siteData.footer.facebookUrl}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            footer: { ...siteData.footer, facebookUrl: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C0E] border border-white/15 text-sm text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
