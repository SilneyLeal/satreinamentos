import React, { useState, useEffect } from 'react'

const CAROUSEL_IMAGES = [
  { src: '/images/img4815.jpg', alt: 'IMG_4815 - S.A Treinamento' },
  { src: '/images/sa-137.jpg', alt: 'S A Treinamento_ 137 - S.A Treinamento' },
  { src: '/images/img9788.jpg', alt: 'IMG_9788 - S.A Treinamento' },
  { src: '/images/sa-156.jpg', alt: 'S A Treinamento_ 156 - S.A Treinamento' },
  { src: '/images/img9825.jpg', alt: 'IMG_9825 - S.A Treinamento' },
  { src: '/images/img9772.jpg', alt: 'IMG_9772 - S.A Treinamento' },
  { src: '/images/img0177.jpg', alt: 'IMG_0177 - S.A Treinamento' },
]

const MARQUEE_UNITS = [
  'Unidade Antônio de Carvalho',
  'Unidade Protásio',
  'Unidade Pasqualini',
  'Unidade Antônio de Carvalho',
  'Unidade Protásio',
  'Unidade Pasqualini',
  'Unidade Antônio de Carvalho',
  'Unidade Protásio',
  'Unidade Pasqualini',
  'Unidade Antônio de Carvalho',
  'Unidade Protásio',
  'Unidade Pasqualini',
]

const ACCESS_CODE = 'sa2026'

export default function App() {
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

  // 'completed' shows the finished version; 'raw' shows the exact unfinished texts from satreinamento.com.br
  const [viewMode, setViewMode] = useState('completed')
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeTab, setActiveTab] = useState('mensal')
  const [whatsappNumber] = useState('5551999009900')

  const isCompleted = viewMode === 'completed'

  const handleUnlock = (e) => {
    e.preventDefault()
    if (accessInput.trim().toLowerCase() === ACCESS_CODE) {
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

  // Auto-advance carousel every 5s like Elementor's swiper settings (autoplay_speed: 5000)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length)
  }

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
  }

  const bentoCards = [
    {
      img: '/images/img9825.jpg',
      pos: 'object-top',
      colClass: 'lg:w-[63%] min-h-[360px] lg:min-h-[400px]',
      title: isCompleted ? 'Treinos 100% Personalizados' : 'What is Lorem Ipsum?',
      desc: isCompleted
        ? 'Na S.A Treinamento seu treino é planejado de acordo com seus objetivos, histórico e rotina, garantindo evolução segura e constante.'
        : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s',
    },
    {
      img: '/images/sa-155.jpg',
      pos: 'object-bottom',
      colClass: 'lg:w-[34%] min-h-[300px] lg:min-h-[400px]',
      title: isCompleted ? 'Acompanhamento Próximo' : 'What is Lorem Ipsum?',
      desc: isCompleted
        ? 'Professores presentes em todos os momentos para orientar cada movimento, corrigir postura e manter sua motivação em alta.'
        : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s',
    },
    {
      img: '/images/img9772.jpg',
      pos: 'object-top',
      colClass: 'lg:w-[31.5%] min-h-[300px]',
      title: isCompleted ? 'Ambiente Acolhedor' : 'What is Lorem Ipsum?',
      desc: isCompleted
        ? 'Um espaço pensado para você se sentir bem, sem julgamentos e com uma comunidade que vibra com cada conquista sua.'
        : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s',
    },
    {
      img: '/images/img9788.jpg',
      pos: 'object-top',
      colClass: 'lg:w-[31.5%] min-h-[300px]',
      title: isCompleted ? 'Estrutura Moderna' : 'What is Lorem Ipsum?',
      desc: isCompleted
        ? 'Equipamentos selecionados e espaço amplo em nossas 3 unidades para você realizar seu treino com máximo conforto e eficiência.'
        : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s',
    },
    {
      img: '/images/sa-251.jpg',
      pos: 'object-center',
      colClass: 'lg:w-[31.5%] min-h-[300px]',
      title: isCompleted ? 'Mais Qualidade de Vida' : 'What is Lorem Ipsum?',
      desc: isCompleted
        ? 'Mais disposição para o dia a dia, redução do estresse, melhora do sono e fortalecimento para viver o agora com saúde.'
        : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s',
    },
    {
      img: '/images/img5815.jpg',
      pos: 'object-center',
      colClass: 'lg:w-[46%] min-h-[300px]',
      title: isCompleted ? 'Equipe Especializada' : 'What is Lorem Ipsum?',
      desc: isCompleted
        ? 'Mais de 8 anos de experiência transformando vidas através do movimento consciente, com profissionais apaixonados pelo que fazem.'
        : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s thrilling chapters awaiting you in our package.',
    },
    {
      img: '/images/img0177.jpg',
      pos: 'object-center',
      colClass: 'lg:w-[51%] min-h-[300px]',
      title: isCompleted ? 'Resultados que Fazem a Diferença' : 'What is Lorem Ipsum?',
      desc: isCompleted
        ? 'Metodologia validada por centenas de alunos que transformaram o exercício físico em uma parte prazerosa da rotina.'
        : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s thrilling chapters awaiting you in our package.',
    },
  ]

  const modalities = isCompleted
    ? [
        'Treinamento Funcional Personalizado',
        'Musculação com Acompanhamento Próximo',
        'Condicionamento Físico e Emagrecimento',
        'Fortalecimento Muscular e Prevenção de Lesões',
        'Mobilidade, Postura e Qualidade de Vida',
        'Preparação Física e Performance Esportiva',
      ]
    : [
        'Adicione nome da modalidade',
        'Adicione nome da modalidade',
        'Adicione nome da modalidade',
        'Adicione nome da modalidade',
        'Adicione nome da modalidade',
        'Adicione nome da modalidade',
      ]

  const units = [
    {
      name: 'Unidade\nProtásio',
      img: '/images/img9825.jpg',
      mapQuery: 'S.A%20Treinamento%20Unidade%20Prot%C3%A1sio',
      mapTitle: 'S.A Treinamento Unidade Protásio',
      address: 'Av. Protásio Alves — Porto Alegre, RS',
    },
    {
      name: 'Unidade\nAntônio de Carvalho',
      img: isCompleted ? '/images/img4815.jpg' : '/images/img9825.jpg',
      mapQuery: 'S.A%20Treinamento%20Ant%C3%B4nio',
      mapTitle: 'S.A Treinamento Antônio',
      address: 'Av. Antônio de Carvalho — Porto Alegre, RS',
    },
    {
      name: 'Unidade\nPasqualini',
      img: isCompleted ? '/images/sa-137.jpg' : '/images/img9825.jpg',
      mapQuery: 'S.A%20Treinamento%20Pasqualini',
      mapTitle: 'S.A Treinamento Pasqualini',
      address: 'Av. Eng. Ludolfo Boehl / Pasqualini — Porto Alegre, RS',
    },
  ]

  const plans = {
    mensal: {
      title: 'Plano Mensal',
      subtitle: 'à partir de',
      price: 'R$97,00',
      note: isCompleted ? 'sem fidelidade • consulte unidades' : null,
      features: isCompleted
        ? [
            'TREINOS PERSONALIZADOS COM ACOMPANHAMENTO',
            'AVALIAÇÃO FÍSICA E PLANEJAMENTO DE METAS',
            'HORÁRIOS FLEXÍVEIS EM NOSSAS UNIDADES',
            'AMBIENTE ACOLHEDOR E ESTRUTURA COMPLETA',
          ]
        : [
            'ACESSO A BIBLIOTECA DE SEÇÕES',
            'PLUGIN PRO ELEMENTS',
            'AULAS DE PERSONALIZAÇÃO E OTIMIZAÇÃO',
            'ATUALIZAÇÕES SEMANAIS',
          ],
    },
    anual: {
      title: 'Plano Anual',
      subtitle: 'à partir de',
      price: 'R$114,00',
      note: 'pagamento mensal',
      features: isCompleted
        ? [
            'MELHOR CUSTO-BENEFÍCIO PARA SUA CONSTÂNCIA',
            'TREINOS PERSONALIZADOS E REAVALIAÇÕES PERIÓDICAS',
            'ACOMPANHAMENTO PRÓXIMO DE PROFESSORES',
            'ACESSO COMPLETO À METODOLOGIA S.A TREINAMENTO',
          ]
        : [
            'ACESSO A BIBLIOTECA DE SEÇÕES',
            'PLUGIN PRO ELEMENTS',
            'AULAS DE PERSONALIZAÇÃO E OTIMIZAÇÃO',
            'ATUALIZAÇÕES SEMANAIS',
          ],
    },
    duplas: {
      title: 'Plano em duplas',
      subtitle: 'de R$126,00 por apenas',
      price: 'R$97,00',
      note: isCompleted ? 'por pessoa • treine com um amigo ou familiar' : null,
      features: isCompleted
        ? [
            'DESCONTO ESPECIAL PARA TREINAR EM DUPLA',
            'TREINO INDIVIDUALIZADO PARA CADA OBJETIVO',
            'MAIS MOTIVAÇÃO E COMPROMETIMENTO NA ROTINA',
            'ACOMPANHAMENTO COMPLETO DA EQUIPE S.A',
          ]
        : [
            'ACESSO A BIBLIOTECA DE SEÇÕES',
            'PLUGIN PRO ELEMENTS',
            'AULAS DE PERSONALIZAÇÃO E OTIMIZAÇÃO',
            'ATUALIZAÇÕES SEMANAIS',
          ],
    },
  }

  const testimonials = isCompleted
    ? [
        {
          name: 'Amanda Alves',
          avatar: '/images/avatar-depoimento.png',
          text: 'Não troco a S.A por nenhuma outra! Desde que comecei a treinar aqui minha disposição mudou completamente. Os professores acompanham cada exercício de perto e o astral da turma é incrível.',
        },
        {
          name: 'Juliana Martins',
          avatar: '/images/cliente2.webp',
          text: 'Eu sempre tive dificuldade de manter constância em academias convencionais. Na S.A encontrei acolhimento, orientação de verdade e um treino pensado pra minha rotina. Recomendo de olhos fechados!',
        },
        {
          name: 'Rafael Oliveira',
          avatar: '/images/cliente1.webp',
          text: 'Estrutura excelente e profissionais super atenciosos. Mais de um ano treinando na unidade e os resultados na minha saúde, postura e qualidade de vida fizeram toda a diferença.',
        },
      ]
    : [
        {
          name: 'Amanda Alves',
          avatar: '/images/avatar-depoimento.png',
          text: 'Lorem ipsum dolor sit amet. Qui aperiam quibusdam cum unde facere a voluptas sint ut galisum officia quo sunt adipisci. Est tenetur culpa quo sunt nihil et voluptates accusamus in ratione necessitatibus quo eaque fugiat.',
        },
        {
          name: 'Amanda Alves',
          avatar: '/images/avatar-depoimento.png',
          text: 'Lorem ipsum dolor sit amet. Qui aperiam quibusdam cum unde facere a voluptas sint ut galisum officia quo sunt adipisci. Est tenetur culpa quo sunt nihil et voluptates accusamus in ratione necessitatibus quo eaque fugiat.',
        },
        {
          name: 'Amanda Alves',
          avatar: '/images/avatar-depoimento.png',
          text: 'Lorem ipsum dolor sit amet. Qui aperiam quibusdam cum unde facere a voluptas sint ut galisum officia quo sunt adipisci. Est tenetur culpa quo sunt nihil et voluptates accusamus in ratione necessitatibus quo eaque fugiat.',
        },
      ]

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white relative overflow-x-hidden">
      {/* ==================== TELA DE ACESSO EXCLUSIVO (GATE DE HOMOLOGAÇÃO) ==================== */}
      {!isUnlocked && (
        <div className="fixed inset-0 z-[100] bg-[#0B0C0E] text-white flex flex-col justify-between p-6 overflow-hidden select-none">
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
                Insira a credencial de acesso fornecida para visualizar a evolução e finalização do novo site oficial.
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
      )}

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

          {isCompleted && (
            <nav className="hidden lg:flex items-center gap-8 font-bebas tracking-wider text-xl text-white/90 italic">
              <a href="#sobre" className="hover:text-[#D4AF37] transition">
                A S.A Treinamento
              </a>
              <a href="#modalidades" className="hover:text-[#D4AF37] transition">
                Modalidades
              </a>
              <a href="#unidades" className="hover:text-[#D4AF37] transition">
                Unidades
              </a>
              <a href="#planos" className="hover:text-[#D4AF37] transition">
                Planos
              </a>
              <a href="#depoimentos" className="hover:text-[#D4AF37] transition">
                Alunos
              </a>
            </nav>
          )}

          <a
            href="#oferta"
            className="sa-btn-gold px-8 py-3.5 text-[20px] tracking-[0.6px] leading-[0.9em]"
          >
            <i className="fab fa-whatsapp text-[20px] mr-2.5 sa-btn-icon" aria-hidden="true"></i>
            <span>Contato pelo WhatsApp</span>
          </a>
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
          style={{ backgroundImage: `url('/images/img9788.jpg')` }}
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
              Viva o Agora
            </h1>
            <h2 className="font-bebas italic font-semibold text-[82px] sm:text-[90px] lg:text-[96px] leading-[0.95] sa-degrade-hero tracking-wide -mt-1">
              Viva a S.A!
            </h2>

            <p className="font-poppins font-light italic text-[15px] lg:text-[16px] text-white/95 max-w-[430px] pt-4 pb-6 leading-relaxed">
              + de 8 anos transformando sua qualidade de vida com treinos personalizados,
              acompanhamento próximo e resultados que fazem a diferença.
            </p>

            <a
              href="#oferta"
              className="sa-btn-gold px-8 sm:px-10 py-5 text-[22px] lg:text-[27px] tracking-wide"
            >
              <i className="fab fa-whatsapp text-[22px] mr-2.5 sa-btn-icon" aria-hidden="true"></i>
              <span>Agendar Aula Experimental</span>
            </a>

            {/* Client Avatars + Quote (c497cf0) */}
            <div className="mt-7 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center sa-profile-group">
                <img
                  src="/images/cliente3.webp"
                  alt="Cliente S.A 1"
                  className="sa-profile-item w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]/40"
                />
                <img
                  src="/images/cliente2.webp"
                  alt="Cliente S.A 2"
                  className="sa-profile-item w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]/40"
                />
                <img
                  src="/images/cliente1.webp"
                  alt="Cliente S.A 3"
                  className="sa-profile-item w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]/40"
                />
              </div>
              <p className="font-poppins font-medium italic text-[13px] sm:text-[16px] text-white leading-snug text-center sm:text-left">
                &ldquo;Não troco a S.A por nenhuma outra. <br />
                Treinar na S.A mudou minha rotina.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Marquee Carousel of Units at Bottom of Hero (d3886ea) */}
        <div className="relative z-10 mt-14 lg:mt-24 overflow-hidden w-full">
          <div className="sa-marquee-track gap-4 px-4">
            {[...MARQUEE_UNITS, ...MARQUEE_UNITS].map((unit, idx) => (
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
              Muito prazer, nós somos a
            </h2>
            <h2 className="font-bebas italic font-semibold text-[58px] sm:text-[84px] lg:text-[110px] sa-degrade-title tracking-[0.5px] leading-none -mt-1">
              S.A Treinamento
            </h2>
            <p className="font-poppins italic font-normal text-[15px] lg:text-[16px] text-[#222222] max-w-[780px] mt-2 leading-relaxed">
              Proporcionamos um ambiente de acolhimento, orientação e estímulo em um espaço{' '}
              <br className="hidden lg:inline" />
              que incentiva o movimento como parte do seu estilo de vida equilibrado e prazeroso.
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
                  className={`absolute inset-0 w-full h-full object-cover ${card.pos} transition-transform duration-500 group-hover:scale-105`}
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
              Você sabe tudo que a
            </h2>
            <h2 className="font-bebas italic font-semibold text-[41px] sm:text-[54px] lg:text-[62px] sa-degrade-title tracking-[0.5px] leading-tight">
              S.A tem PARA oferecer?
            </h2>
            <p className="font-poppins italic font-normal text-[15px] lg:text-[16px] text-white/90 mt-1">
              Conheça nossas modalidades e se surpreenda com a S.A Treinamentos!
            </p>
          </div>

          {/* 2-Column Content: Left Image Carousel + Right 6 Modality Cards */}
          <div className="mt-8 lg:mt-12 flex flex-col lg:flex-row items-center gap-8">
            {/* Left Column: Image Carousel (c5d5468) */}
            <div className="w-full lg:w-[55%] p-2 sm:p-5">
              <div className="relative rounded-[20px] overflow-hidden shadow-2xl bg-[#161616] aspect-[3/2]">
                {CAROUSEL_IMAGES.map((slide, idx) => (
                  <img
                    key={slide.src}
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
                {CAROUSEL_IMAGES.map((_, idx) => (
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

            {/* Right Column: 6 Modality Cards + CTA Button (74d9e66) */}
            <div className="w-full lg:w-[45%] flex flex-col gap-2.5 p-2 sm:p-5">
              {modalities.map((modName, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveSlide(idx % CAROUSEL_IMAGES.length)}
                  className="sa-gold-box px-5 py-4 cursor-pointer flex items-center justify-between"
                >
                  <h3 className="sa-gold-box-text font-bebas italic font-medium text-[21px] sm:text-[24px] xl:text-[26px] tracking-[1.2px] leading-tight">
                    {modName}
                  </h3>
                  {isCompleted && (
                    <i
                      className="fas fa-dumbbell sa-gold-box-text text-lg opacity-80"
                      aria-hidden="true"
                    ></i>
                  )}
                </div>
              ))}

              <a
                href="#oferta"
                className="sa-btn-gold w-full py-5 px-8 text-[22px] lg:text-[27px] mt-2"
              >
                <i
                  className="fas fa-arrow-alt-circle-right text-[20px] mr-2.5 sa-btn-icon"
                  aria-hidden="true"
                ></i>
                <span>Agendar Aula Experimental</span>
              </a>
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
              Quer treinar perto de casa?
            </h2>
            <h2 className="font-bebas italic font-semibold text-[44px] sm:text-[68px] lg:text-[80px] sa-degrade-title tracking-[0.5px] leading-none mt-1">
              Escolha a sua unidade!
            </h2>
            <p className="font-poppins italic font-normal text-[15px] lg:text-[16px] text-[#222222] mt-2">
              Conheça nossas modalidades e se surpreenda com a S.A Treinamentos!
            </p>
          </div>

          {/* 3 Units Grid (88ddfd8) */}
          <div className="mt-8 lg:mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1216px] w-[96%] mx-auto">
            {units.map((unit, idx) => (
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
                    src={`https://maps.google.com/maps?q=${unit.mapQuery}&t=m&z=13&output=embed&iwloc=near`}
                    title={unit.mapTitle}
                    aria-label={unit.mapTitle}
                    className="w-full h-[180px] border-0 brightness-[0.72] hover:brightness-100 transition duration-300"
                  />
                </div>

                {/* CTA Button */}
                <a
                  href="#oferta"
                  className="sa-btn-gold w-full py-5 px-6 text-[22px] lg:text-[26px] mt-3"
                >
                  <i
                    className="fas fa-arrow-alt-circle-right text-[20px] mr-2.5 sa-btn-icon"
                    aria-hidden="true"
                  ></i>
                  <span>Agendar Aula Experimental</span>
                </a>
              </div>
            ))}
          </div>

          {/* Heading for Plans Section at Bottom of White Container (c9f8394) */}
          <div id="planos" className="mt-16 lg:mt-20 text-center flex flex-col items-center">
            <h2 className="font-bebas italic font-semibold text-[32px] sm:text-[44px] lg:text-[52px] text-[#222222] tracking-[0.5px] leading-none">
              Vem pra S.A treinamento
            </h2>
            <h2 className="font-bebas italic font-semibold text-[46px] sm:text-[68px] lg:text-[80px] sa-degrade-title tracking-[0.5px] leading-none mt-1">
              Escolha o seu plano!
            </h2>
          </div>
        </div>
      </section>

      {/* ==================== SECTION: ABAS DE PLANOS (765512f) ==================== */}
      {/* Note: On the live site, the previous developer left this section with elementor-hidden-desktop/tablet/mobile because the bullet points still said "PLUGIN PRO ELEMENTS". In 'completed' mode it is visible and finished! */}
      {(isCompleted || viewMode === 'raw') && (
        <section
          id="oferta"
          className="relative z-10 bg-[#131313] pt-16 lg:pt-20 pb-28 -mt-12 lg:-mt-16 flex flex-col items-center px-4"
        >
          {!isCompleted && (
            <div className="mb-6 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-poppins">
              Nota: No site atual em WordPress, o antigo dev ocultou este bloco porque deixou os textos de curso Elementor abaixo.
            </div>
          )}

          {/* Glassmorphic Tabs Bar (8f9b4e3) */}
          <div
            role="tablist"
            aria-label="Escolha o seu plano"
            className="sa-tabs-heading flex flex-wrap items-center justify-center gap-3 sm:gap-10 px-4 py-2"
          >
            {[
              { id: 'mensal', label: 'Mensal' },
              { id: 'anual', label: 'Anual' },
              { id: 'duplas', label: 'Duplas' },
            ].map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-7 py-3 rounded-[18px] font-bebas italic text-[21px] tracking-[1.2px] transition-all cursor-pointer ${
                    active
                      ? 'sa-tab-btn-active'
                      : 'text-white/75 hover:text-white hover:-translate-y-0.5'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Active Plan Card (45b10b5 / de8ac8f / c7c448a) */}
          <div
            key={activeTab}
            className="sa-tab-panel-animate mt-8 w-full max-w-[480px] bg-[#1F1F1F] rounded-[25px] shadow-[0_0_25px_rgba(0,0,0,0.75)] border border-white/5 px-6 sm:px-10 pt-8 pb-10 flex flex-col items-center text-center"
          >
            <h3 className="font-bebas font-semibold text-[34px] tracking-[1.3px] text-[#F5F5F5]">
              {plans[activeTab].title}
            </h3>

            <p className="font-poppins text-sm text-[#ACACAC] mt-1">
              {plans[activeTab].subtitle}
            </p>

            <div className="font-bebas font-semibold text-[70px] leading-none sa-degrade-hero tracking-[1px] my-1">
              {plans[activeTab].price}
            </div>

            {plans[activeTab].note && (
              <p className="font-poppins italic text-xs text-[#ACACAC] mb-2">
                {plans[activeTab].note}
              </p>
            )}

            {/* Plan Features List */}
            <ul className="w-full text-left space-y-3 my-6 px-2">
              {plans[activeTab].features.map((feat, i) => (
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

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Olá! Gostaria de agendar uma aula experimental na S.A Treinamento e saber mais sobre o ${plans[activeTab].title}.`
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

            <img
              src="/images/selos-carts-white.webp"
              alt="Formas de pagamento e segurança"
              className="w-1/2 max-w-[220px] mt-5 opacity-90"
            />
          </div>
        </section>
      )}

      {/* ==================== SECTION: O QUE DIZEM NOSSOS ALUNOS? (bf0a35b) ==================== */}
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

      {/* ==================== FOOTER (elementor-233) ==================== */}
      <footer className="relative z-20">
        {/* Top Online Attendance Banner (elementor-145) */}
        <div className="bg-white text-[#222222] py-8 px-6 border-b border-black/10">
          <div className="max-w-[1216px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#D4AF37] text-3xl">
                <i className="fab fa-whatsapp" aria-hidden="true"></i>
              </div>
              <div>
                <h3 className="font-bebas text-[28px] tracking-wide text-[#222222] leading-none">
                  Atendimento <b className="text-[#D4AF37]">Online</b>
                </h3>
                <p className="font-poppins text-sm text-[#4C4C4C] mt-1">
                  {isCompleted
                    ? 'Agende sua aula experimental pelo WhatsApp em qualquer uma de nossas 3 unidades'
                    : 'Segunda à Sexta-feira de 09h às 18h'}
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#222222] hover:bg-[#4C4C4C] text-white font-manrope font-extrabold text-base px-9 py-4 rounded-[6px] transition inline-flex items-center gap-2"
            >
              <i className="fab fa-whatsapp text-lg text-[#D4AF37]" aria-hidden="true"></i>
              <span>Contato via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Newsletter Section (elementor-894) */}
        <div className="bg-[#1A1A1A] border-b border-white/10 py-10 px-6">
          <div className="max-w-[1216px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h2 className="font-bebas text-[40px] font-bold text-[#FFDE59] leading-none">
                Inscreva-se já!
              </h2>
              <p className="font-poppins text-base text-white/80 mt-1">
                Inscreva-se para ficar sempre atualizado com dicas e novidades da S.A Treinamento
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert('Inscrição recebida com sucesso!')
              }}
              className="w-full lg:w-[58%] grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <input
                type="text"
                placeholder="Nome"
                required
                className="bg-white text-[#222222] rounded-[8px] px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <input
                type="email"
                placeholder="E-mail"
                required
                className="bg-white text-[#222222] rounded-[8px] px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <button
                type="submit"
                className="sa-btn-gold rounded-[8px] py-3.5 px-6 text-[22px] tracking-wider"
              >
                ASSINAR
              </button>
            </form>
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
                {isCompleted
                  ? 'Transformando sua qualidade de vida há mais de 8 anos. Viva o agora, viva a S.A!'
                  : 'Seu melhor texto aqui!'}
              </p>
              <div className="mt-4 text-xs text-white/50 space-y-0.5">
                <p>{isCompleted ? 'S.A TREINAMENTO FUNCIONAL' : 'EMPRESA LTDA'}</p>
                <p>{isCompleted ? 'Porto Alegre • RS' : '00.999.000/0001-00'}</p>
              </div>
            </div>

            {/* Col 2: Navigation / Links Úteis */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="font-poppins font-bold text-[#FFDE59] text-lg mb-4">Links úteis</h4>
              <ul className="space-y-2.5 text-sm text-white/80">
                <li>
                  <a href="#topo" className="hover:text-[#D4AF37] transition">
                    Início
                  </a>
                </li>
                <li>
                  <a href="#sobre" className="hover:text-[#D4AF37] transition">
                    Sobre a S.A
                  </a>
                </li>
                <li>
                  <a href="#modalidades" className="hover:text-[#D4AF37] transition">
                    Modalidades
                  </a>
                </li>
                <li>
                  <a href="#unidades" className="hover:text-[#D4AF37] transition">
                    Nossas 3 Unidades
                  </a>
                </li>
                <li>
                  <a href="#planos" className="hover:text-[#D4AF37] transition">
                    Planos e Valores
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Unidades & Atendimento */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="font-poppins font-bold text-[#FFDE59] text-lg mb-4">
                {isCompleted ? 'Nossas Unidades' : 'Atendimento'}
              </h4>
              {isCompleted ? (
                <ul className="space-y-2 text-sm text-white/80">
                  <li>• Unidade Protásio</li>
                  <li>• Unidade Antônio de Carvalho</li>
                  <li>• Unidade Pasqualini</li>
                  <li className="pt-2 text-[#D4AF37] font-medium">Porto Alegre - RS</li>
                </ul>
              ) : (
                <div className="space-y-2 text-sm text-white/80">
                  <p>(11) 99900-9900</p>
                  <p>contato@email.com</p>
                  <p>Rua Teste, 00</p>
                  <p>Segunda à Sexta-feira de 09h às 18h</p>
                </div>
              )}
            </div>

            {/* Col 4: Redes Sociais */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="font-poppins font-bold text-[#FFDE59] text-lg mb-4">Redes sociais</h4>
              <div className="flex items-center gap-4">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="w-11 h-11 rounded-lg bg-[#1F1F1F] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition text-xl"
                >
                  <i className="fab fa-whatsapp" aria-hidden="true"></i>
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-11 h-11 rounded-lg bg-[#1F1F1F] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition text-xl"
                >
                  <i className="fab fa-instagram" aria-hidden="true"></i>
                </a>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-11 h-11 rounded-lg bg-[#1F1F1F] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition text-xl"
                >
                  <i className="fab fa-facebook" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar (c375110) */}
        <div className="bg-white text-[#222222] py-5 px-6 text-sm">
          <div className="max-w-[1216px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <strong>© {isCompleted ? 'S.A Treinamento' : 'Modelo WP'} –</strong>
              <span>Todos os direitos reservados.</span>
            </div>
            <div className="text-xs text-[#4C4C4C]">
              Viva o agora, viva a S.A!
            </div>
          </div>
        </div>
      </footer>

      {/* ==================== FLOATING MODE SWITCHER FOR PREVIEW ==================== */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 bg-black/90 backdrop-blur-md border border-[#D4AF37]/50 rounded-full p-1.5 shadow-2xl text-xs font-poppins">
        <button
          type="button"
          onClick={() => setViewMode('completed')}
          className={`px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer ${
            isCompleted
              ? 'bg-[#D4AF37] text-black font-semibold'
              : 'text-white/75 hover:text-white'
          }`}
        >
          ✓ Site Finalizado
        </button>
        <button
          type="button"
          onClick={() => setViewMode('raw')}
          className={`px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer ${
            !isCompleted
              ? 'bg-[#D4AF37] text-black font-semibold'
              : 'text-white/75 hover:text-white'
          }`}
        >
          Espelho Original (Inacabado)
        </button>
      </div>
    </div>
  )
}

