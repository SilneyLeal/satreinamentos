import React, { useState, useEffect, useRef } from 'react'

const QUICK_REPLIES = [
  '📅 Agendar Aula Experimental',
  '💰 Quais são os planos e valores?',
  '📍 Onde ficam as 3 unidades?',
  '🏋️ Como funciona o treino na S.A?',
]

const UNITS_LIST = [
  { id: 'Protásio', name: 'Unidade Protásio', addr: 'Região Av. Protásio Alves — Porto Alegre' },
  {
    id: 'Antônio de Carvalho',
    name: 'Unidade Antônio de Carvalho',
    addr: 'Região Av. Antônio de Carvalho — Porto Alegre',
  },
  { id: 'Pasqualini', name: 'Unidade Pasqualini', addr: 'Região Pasqualini — Porto Alegre' },
]

const SHIFTS_LIST = ['Manhã (06h às 12h)', 'Tarde (12h às 17h)', 'Noite (17h às 21h)']
const DAYS_LIST = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira']

function getCurrentTimeStr() {
  const now = new Date()
  return (
    String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
  )
}

export default function ClowayWidget({ isOpen, onOpen, onClose, initialContext, siteData }) {
  const [mascotType, setMascotType] = useState('clo') // 'clo' (bonequinha 3D) or 'bot' (robozinho 3D)
  const [teaserVisible, setTeaserVisible] = useState(true)
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Booking wizard state inside chat: null | 'ASK_UNIT' | 'ASK_SHIFT' | 'ASK_DAY' | 'ASK_NAME' | 'ASK_PHONE' | 'DONE'
  const [bookingStep, setBookingStep] = useState(null)
  const [bookingData, setBookingData] = useState({
    unit: '',
    shift: '',
    day: '',
    name: '',
    phone: '',
  })

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      time: getCurrentTimeStr(),
      text: 'Oi! 👋 Eu sou a **Clô**, assistente virtual com IA da **S.A Treinamento**!\n\nEstou online 24h para tirar suas dúvidas sobre modalidades, unidades, planos ou **agendar sua Aula Experimental gratuita** agora mesmo. Como posso te ajudar hoje?',
    },
  ])

  const listRef = useRef(null)

  const avatarSrc = mascotType === 'clo' ? '/images/cloway-clo.webp' : '/images/cloway-bot.webp'

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, isTyping, isOpen])

  // Handle when user clicks a specific CTA button on the site (e.g. "Agendar na Unidade Protásio" or "Plano Mensal")
  useEffect(() => {
    if (initialContext && isOpen) {
      handleUserMessage(initialContext)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContext])

  const pushAiReply = (text, extra = {}) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          sender: 'ai',
          time: getCurrentTimeStr(),
          text,
          ...extra,
        },
      ])
    }, 650)
  }

  const startBookingFlow = (preselectedUnit = '') => {
    if (preselectedUnit) {
      setBookingData((prev) => ({ ...prev, unit: preselectedUnit }))
      setBookingStep('ASK_SHIFT')
      pushAiReply(
        `Perfeito! Vamos agendar sua **Aula Experimental** na **${preselectedUnit}**! 🎯\n\nQual turno fica melhor para a sua rotina?`,
        { options: SHIFTS_LIST }
      )
    } else {
      setBookingStep('ASK_UNIT')
      pushAiReply(
        'Show! Vamos agendar sua **Aula Experimental gratuita** agora mesmo! 🚀\n\nPrimeiro, qual das nossas **3 unidades em Porto Alegre** fica melhor para você?',
        {
          options: UNITS_LIST.map((u) => u.name),
        }
      )
    }
  }

  const handleUserMessage = (rawText) => {
    const text = String(rawText || '').trim()
    if (!text) return

    setTeaserVisible(false)
    setMessages((prev) => [
      ...prev,
      {
        id: 'user-' + Date.now(),
        sender: 'user',
        time: getCurrentTimeStr(),
        text,
      },
    ])

    const lower = text.toLowerCase()

    // Check if user wants to restart or cancel booking
    if (lower === 'cancelar' || lower === 'voltar') {
      setBookingStep(null)
      pushAiReply('Tudo bem! Cancelei o preenchimento. Como posso te ajudar agora?')
      return
    }

    // Active Booking Flow Steps
    if (bookingStep === 'ASK_UNIT') {
      let chosenUnit = text
      if (lower.includes('prot')) chosenUnit = 'Unidade Protásio'
      else if (lower.includes('ant') || lower.includes('carvalho'))
        chosenUnit = 'Unidade Antônio de Carvalho'
      else if (lower.includes('pasq')) chosenUnit = 'Unidade Pasqualini'

      setBookingData((prev) => ({ ...prev, unit: chosenUnit }))
      setBookingStep('ASK_SHIFT')
      pushAiReply(
        `Ótima escolha! A **${chosenUnit}** tem uma estrutura incrível. 💪\n\nEm qual **turno** você prefere fazer sua aula experimental?`,
        { options: SHIFTS_LIST }
      )
      return
    }

    if (bookingStep === 'ASK_SHIFT') {
      setBookingData((prev) => ({ ...prev, shift: text }))
      setBookingStep('ASK_DAY')
      pushAiReply(
        `Combinado (**${text}**)! E qual **dia da semana** fica melhor para você começar?`,
        { options: DAYS_LIST }
      )
      return
    }

    if (bookingStep === 'ASK_DAY') {
      setBookingData((prev) => ({ ...prev, day: text }))
      setBookingStep('ASK_NAME')
      pushAiReply('Perfeito! Como é o seu **nome completo** para eu reservar a vaga com o professor?')
      return
    }

    if (bookingStep === 'ASK_NAME') {
      setBookingData((prev) => ({ ...prev, name: text }))
      setBookingStep('ASK_PHONE')
      pushAiReply(
        `Prazer em te conhecer, **${text}**! 😊\n\nPor último, me confirma o seu **WhatsApp com DDD** para eu te enviar a confirmação e a localização da unidade:`
      )
      return
    }

    if (bookingStep === 'ASK_PHONE') {
      const finalData = { ...bookingData, phone: text }
      setBookingData(finalData)
      setBookingStep('DONE')
      const protocol = 'SA-' + Math.floor(1000 + Math.random() * 9000)
      pushAiReply(
        `🎉 **Aula Experimental Agendada com Sucesso!**\n\nConfira os dados da sua reserva:\n• **Aluno(a):** ${finalData.name}\n• **Unidade:** ${finalData.unit}\n• **Dia e Turno:** ${finalData.day} — ${finalData.shift}\n• **WhatsApp:** ${finalData.phone}\n• **Protocolo:** #${protocol}\n\nNossa equipe de professores da **${finalData.unit}** já recebeu seu agendamento na agenda e vai te esperar! Se tiver mais alguma dúvida sobre roupa de treino ou estacionamento, é só perguntar aqui. Viva o agora, viva a S.A! 💛🖤`,
        {
          isConfirmation: true,
          protocol,
        }
      )
      return
    }

    // Standard Conversational AI Intents for S.A Treinamento
    if (
      lower.includes('agendar') ||
      lower.includes('experimental') ||
      lower.includes('marcar') ||
      lower.includes('aula') ||
      lower.includes('quero começar') ||
      lower.includes('matrícula')
    ) {
      if (lower.includes('protásio') || lower.includes('protasio')) {
        startBookingFlow('Unidade Protásio')
      } else if (lower.includes('antônio') || lower.includes('antonio') || lower.includes('carvalho')) {
        startBookingFlow('Unidade Antônio de Carvalho')
      } else if (lower.includes('pasqualini')) {
        startBookingFlow('Unidade Pasqualini')
      } else {
        startBookingFlow()
      }
      return
    }

    if (
      lower.includes('plano') ||
      lower.includes('valor') ||
      lower.includes('preço') ||
      lower.includes('preco') ||
      lower.includes('mensalidade') ||
      lower.includes('custa') ||
      lower.includes('dupla')
    ) {
      pushAiReply(
        'Na **S.A Treinamento** temos 3 opções de planos pensadas para você treinar com acompanhamento completo:\n\n' +
          '1️⃣ **Plano Mensal:** a partir de **R$ 97,00** (sem fidelidade)\n' +
          '2️⃣ **Plano Anual:** a partir de **R$ 114,00/mês** (com reavaliações periódicas e acompanhamento completo)\n' +
          '3️⃣ **Plano em Duplas:** de R$ 126,00 por apenas **R$ 97,00 por pessoa** (ideal para treinar com amigo ou familiar!)\n\n' +
          'Todos os planos incluem avaliação física e treino 100% personalizado. Quer **agendar uma Aula Experimental gratuita** para conhecer antes de escolher?',
        {
          options: ['📅 Agendar Aula Experimental', '📍 Onde ficam as 3 unidades?'],
        }
      )
      return
    }

    if (
      lower.includes('unidade') ||
      lower.includes('endereço') ||
      lower.includes('endereco') ||
      lower.includes('onde fica') ||
      lower.includes('bairro') ||
      lower.includes('local')
    ) {
      pushAiReply(
        'Contamos com **3 unidades modernas em Porto Alegre (RS)**:\n\n' +
          '📍 **Unidade Protásio** (Região da Av. Protásio Alves)\n' +
          '📍 **Unidade Antônio de Carvalho** (Região da Av. Antônio de Carvalho)\n' +
          '📍 **Unidade Pasqualini** (Região Pasqualini)\n\n' +
          'Em qual delas fica mais prático para você fazer uma **Aula Experimental**?',
        {
          options: [
            'Agendar na Unidade Protásio',
            'Agendar na Unidade Antônio de Carvalho',
            'Agendar na Unidade Pasqualini',
          ],
        }
      )
      return
    }

    if (
      lower.includes('modalidade') ||
      lower.includes('funcional') ||
      lower.includes('musculação') ||
      lower.includes('musculacao') ||
      lower.includes('como funciona') ||
      lower.includes('diferencial')
    ) {
      pushAiReply(
        'Diferente das academias comuns onde você recebe uma ficha genérica e treina sozinho, na **S.A Treinamento** seu treino é **100% personalizado**!\n\n' +
          'Trabalhamos com:\n' +
          '• **Treinamento Funcional Personalizado**\n' +
          '• **Musculação com Acompanhamento Próximo**\n' +
          '• **Condicionamento Físico e Emagrecimento**\n' +
          '• **Fortalecimento Muscular, Mobilidade e Prevenção de Lesões**\n\n' +
          'Nossos professores ficam presentes o tempo todo corrigindo postura e ajustando cargas. Vamos marcar uma aula experimental para você sentir a diferença na prática?',
        {
          options: ['📅 Quero agendar minha Aula Experimental', '💰 Ver Planos e Valores'],
        }
      )
      return
    }

    if (
      lower.includes('dor') ||
      lower.includes('lesão') ||
      lower.includes('lesao') ||
      lower.includes('coluna') ||
      lower.includes('joelho') ||
      lower.includes('iniciante') ||
      lower.includes('sedent')
    ) {
      pushAiReply(
        'Pode ficar 100% tranquilo(a)! 🙌 Muitos dos nossos alunos chegaram justamente buscando aliviar dores nas costas, joelhos ou retomar o hábito de treinar sem risco.\n\n' +
          'Na sua primeira sessão, fazemos uma avaliação do seu histórico e montamos um treino focado em **mobilidade articular, fortalecimento do core e postura**, com o professor ao seu lado em cada exercício.\n\n' +
          'Quer agendar uma aula experimental para conversar com nossos professores?',
        {
          options: ['📅 Sim, agendar Aula Experimental', '📍 Ver unidades disponíveis'],
        }
      )
      return
    }

    if (lower.includes('horário') || lower.includes('horario') || lower.includes('abre')) {
      pushAiReply(
        'Nossas unidades contam com horários amplos na **manhã, tarde e noite** de segunda a sexta (e horários especiais aos sábados) para encaixar perfeitamente na sua rotina!\n\nQual turno você costuma preferir para treinar?',
        {
          options: [
            '📅 Agendar de Manhã',
            '📅 Agendar à Tarde',
            '📅 Agendar à Noite',
          ],
        }
      )
      return
    }

    // Fallback intelligent response
    pushAiReply(
      'Excelente pergunta! Na **S.A Treinamento** nós cuidamos de cada detalhe para que o treino seja a melhor hora do seu dia, com acompanhamento próximo nas nossas 3 unidades (Protásio, Antônio de Carvalho e Pasqualini) e planos a partir de **R$ 97,00**.\n\nO que você gostaria de fazer agora?',
      {
        options: [
          '📅 Agendar Aula Experimental',
          '💰 Ver Planos e Valores',
          '📍 Escolher Unidade',
        ],
      }
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return
    const msg = inputText
    setInputText('')
    handleUserMessage(msg)
  }

  // Render simple markdown (**bold** and line breaks)
  const renderFormattedText = (text) => {
    return String(text || '')
      .split('\n')
      .map((line, lineIdx) => (
        <React.Fragment key={lineIdx}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className="font-semibold text-[#FFF2CD]">
                  {part.slice(2, -2)}
                </strong>
              )
            }
            return <span key={partIdx}>{part}</span>
          })}
          {lineIdx < String(text || '').split('\n').length - 1 && <br />}
        </React.Fragment>
      ))
  }

  return (
    <>
      {/* ==================== BALÃO DE CONVITE (TEASER) AO LADO DO BONEQUINHO ==================== */}
      {!isOpen && teaserVisible && (
        <div
          onClick={() => {
            setTeaserVisible(false)
            onOpen()
          }}
          className="fixed bottom-24 right-5 sm:right-6 z-[75] max-w-[300px] bg-[#141519]/95 backdrop-blur-xl border border-[#D4AF37]/45 rounded-2xl p-4 shadow-[0_18px_50px_rgba(0,0,0,0.85)] cursor-pointer hover:border-[#D4AF37] transition-all animate-bounce"
          style={{ animationDuration: '3.2s' }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setTeaserVisible(false)
            }}
            aria-label="Fechar aviso"
            className="absolute top-2.5 right-2.5 text-white/40 hover:text-white text-xs px-1.5"
          >
            ✕
          </button>
          <div className="flex items-center gap-2.5 mb-1.5">
            <img
              src={avatarSrc}
              alt="Clô - Cloway AI"
              className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]"
            />
            <span className="text-xs font-poppins font-bold text-[#D4AF37]">
              Clô • Assistente IA 24h
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-xs font-poppins text-white/90 leading-snug">
            Oi! 👋 Posso tirar suas dúvidas de planos ou <strong>agendar sua Aula Experimental</strong> agora mesmo!
          </p>
        </div>
      )}

      {/* ==================== BOTÃO FLUTUANTE DO BONEQUINHO CLOWAY ==================== */}
      <div className="fixed bottom-5 right-5 sm:right-6 z-[80] flex items-center gap-3">
        <button
          type="button"
          onClick={() => (isOpen ? onClose() : onOpen())}
          aria-label="Abrir atendimento inteligente Cloway"
          className="group relative flex items-center gap-3 pl-2 pr-5 py-2 rounded-full bg-gradient-to-r from-[#1A1822] via-[#231F2E] to-[#1A1822] border-2 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.45)] hover:scale-105 transition-all cursor-pointer"
        >
          <div className="relative">
            <img
              src={avatarSrc}
              alt="Clô - Assistente Virtual Cloway"
              className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow-md"
            />
            <span
              title="Online 24h"
              className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#141519]"
            />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bebas italic text-xl tracking-wider text-[#FFD700] leading-none">
                Falar com a Clô
              </span>
              <span className="text-[9px] font-poppins font-bold uppercase px-1.5 py-0.5 rounded bg-[#7C3AED] text-white">
                IA 24h
              </span>
            </div>
            <span className="block text-[11px] font-poppins text-white/80">
              Dúvidas &amp; Agendar Aula
            </span>
          </div>
        </button>
      </div>

      {/* ==================== JANELA DO CHAT INTELIGENTE CLOWAY ==================== */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[85] w-[93vw] max-w-[410px] h-[580px] max-h-[80vh] rounded-3xl bg-[#111217] border border-[#D4AF37]/40 shadow-[0_25px_80px_rgba(0,0,0,0.92)] flex flex-col overflow-hidden font-poppins">
          {/* Header da Janela Cloway */}
          <div className="bg-gradient-to-r from-[#1B162A] via-[#2A1F3D] to-[#1E192B] border-b border-[#D4AF37]/30 px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={avatarSrc}
                  alt="Clô"
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#D4AF37]"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#1B162A]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white leading-tight">
                    Clô • S.A Treinamento
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7C3AED]/30 border border-[#A78BFA]/40 text-[#DDD6FE] font-semibold">
                    Cloway AI
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span>● Online agora</span>
                  <span className="text-white/40">• Atende e agenda 24h</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Alternar Bonequinho (Clô 3D / Robô 3D) para demonstração */}
              <button
                type="button"
                onClick={() => setMascotType((prev) => (prev === 'clo' ? 'bot' : 'clo'))}
                title="Trocar avatar do bonequinho (Clô / Robô)"
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] text-white/80 cursor-pointer transition"
              >
                {mascotType === 'clo' ? '🤖 Robô' : '👩 Clô'}
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar chat"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center cursor-pointer transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Lista de Mensagens */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#0D0E12]"
          >
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 text-[10px] text-white/45 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                <img src="/images/cloway-logo.png" alt="" className="w-3.5 h-3.5 rounded-sm" />
                Atendimento Inteligente &amp; Agendamento Automático
              </span>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                <div
                  className={`flex items-end gap-2 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <img
                      src={avatarSrc}
                      alt="Clô"
                      className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]/60 shrink-0 mb-1"
                    />
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B08328] text-black font-medium rounded-br-sm'
                        : msg.isConfirmation
                        ? 'bg-emerald-950/70 border border-emerald-500/40 text-white rounded-bl-sm'
                        : 'bg-[#1A1C23] border border-white/10 text-white/95 rounded-bl-sm'
                    }`}
                  >
                    <div>{renderFormattedText(msg.text)}</div>
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-black/65' : 'text-white/40'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>

                {/* Botões de Escolha Rápida dentro da mensagem da IA */}
                {msg.options && msg.options.length > 0 && (
                  <div className="pl-9 flex flex-wrap gap-1.5">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleUserMessage(opt)}
                        className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-[#1F1A2C] hover:bg-[#D4AF37] text-[#FFF2CD] hover:text-black border border-[#D4AF37]/40 transition cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Selo de Integração Cloway quando confirma agendamento */}
                {msg.isConfirmation && (
                  <div className="ml-9 p-2.5 rounded-xl bg-[#7C3AED]/15 border border-[#7C3AED]/40 text-[11px] text-[#DDD6FE] flex items-center gap-2">
                    <i className="fas fa-calendar-check text-emerald-400 text-sm"></i>
                    <span>
                      Sincronizado automaticamente com a Agenda &amp; CRM da <strong>Cloway AI</strong>.
                    </span>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2">
                <img
                  src={avatarSrc}
                  alt="Clô"
                  className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]/60"
                />
                <div className="px-3.5 py-2 rounded-2xl bg-[#1A1C23] border border-white/10 text-xs text-white/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                  <span className="ml-1 text-[11px]">Clô está digitando...</span>
                </div>
              </div>
            )}
          </div>

          {/* Sugestões Rápidas Fixas */}
          {!bookingStep && (
            <div className="px-3 py-2 bg-[#14151C] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_REPLIES.map((qr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleUserMessage(qr)}
                  className="shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 text-white/80 hover:text-[#FFF2CD] transition cursor-pointer"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Campo de Digitação */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-[#16171F] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                bookingStep === 'ASK_NAME'
                  ? 'Digite seu nome...'
                  : bookingStep === 'ASK_PHONE'
                  ? 'Digite seu WhatsApp com DDD...'
                  : 'Pergunte algo ou agende sua aula...'
              }
              className="flex-1 bg-[#0B0C0E] border border-white/15 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 outline-none"
            />
            <button
              type="submit"
              aria-label="Enviar mensagem"
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#9A6B1F] text-black flex items-center justify-center hover:brightness-110 transition cursor-pointer shrink-0"
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </form>

          {/* Rodapé Assinatura Cloway */}
          <div className="bg-[#0E0F14] py-1.5 px-4 text-center border-t border-white/5 flex items-center justify-center gap-1.5 text-[10px] text-white/45">
            <img src="/images/cloway-logo.png" alt="Cloway" className="w-3.5 h-3.5 rounded-sm" />
            <span>
              Tecnologia <strong className="text-[#A78BFA]">Cloway AI</strong> • Atendimento e
              Agendamento 24h
            </span>
          </div>
        </div>
      )}
    </>
  )
}
