export const STORAGE_KEY = 'sa_treinamento_cms_data_v1'

export const DEFAULT_SITE_DATA = {
  whatsappNumber: '5551999009900',
  security: {
    adminUser: 'admin',
    adminPass: 'sa2026',
    gateEnabled: true,
    gatePass: 'sa2026',
  },
  clowayConfig: {
    mode: 'DEMO_COMERCIAL', // 'DEMO_COMERCIAL' | 'PRODUCAO_API' | 'DESATIVADO'
    assistantName: 'SA Virtual',
    apiUrl: 'https://api.cloway.com.br/v1',
    tenantId: '',
    licenseKey: '',
    showModelSwitcher: true,
  },
  header: {
    ctaText: 'Contato pelo WhatsApp',
    navLinks: [
      { label: 'A S.A Treinamento', href: '#sobre' },
      { label: 'Modalidades', href: '#modalidades' },
      { label: 'Unidades', href: '#unidades' },
      { label: 'Planos', href: '#planos' },
      { label: 'Blog', href: '#blog' },
    ],
  },
  hero: {
    titleLine1: 'Viva o Agora',
    titleLine2: 'Viva a S.A!',
    description:
      '+ de 8 anos transformando sua qualidade de vida com treinos personalizados, acompanhamento próximo e resultados que fazem a diferença.',
    ctaText: 'Agendar Aula Experimental',
    bgImage: '/images/img9788.jpg',
    quoteLine1: 'Não troco a S.A por nenhuma outra.',
    quoteLine2: 'Treinar na S.A mudou minha rotina.',
    avatars: ['/images/cliente3.webp', '/images/cliente2.webp', '/images/cliente1.webp'],
  },
  about: {
    subtitleTop: 'Muito prazer, nós somos a',
    titleMain: 'S.A Treinamento',
    description:
      'Proporcionamos um ambiente de acolhimento, orientação e estímulo em um espaço que incentiva o movimento como parte do seu estilo de vida equilibrado e prazeroso.',
    cards: [
      {
        img: '/images/img9825.jpg',
        pos: 'object-top',
        colClass: 'lg:w-[63%] min-h-[360px] lg:min-h-[400px]',
        title: 'Treinos 100% Personalizados',
        desc: 'Na S.A Treinamento seu treino é planejado de acordo com seus objetivos, histórico e rotina, garantindo evolução segura e constante.',
      },
      {
        img: '/images/sa-155.jpg',
        pos: 'object-bottom',
        colClass: 'lg:w-[34%] min-h-[300px] lg:min-h-[400px]',
        title: 'Acompanhamento Próximo',
        desc: 'Professores presentes em todos os momentos para orientar cada movimento, corrigir postura e manter sua motivação em alta.',
      },
      {
        img: '/images/img9772.jpg',
        pos: 'object-top',
        colClass: 'lg:w-[31.5%] min-h-[300px]',
        title: 'Ambiente Acolhedor',
        desc: 'Um espaço pensado para você se sentir bem, sem julgamentos e com uma comunidade que vibra com cada conquista sua.',
      },
      {
        img: '/images/img9788.jpg',
        pos: 'object-top',
        colClass: 'lg:w-[31.5%] min-h-[300px]',
        title: 'Estrutura Moderna',
        desc: 'Equipamentos selecionados e espaço amplo em nossas 3 unidades para você realizar seu treino com máximo conforto e eficiência.',
      },
      {
        img: '/images/sa-251.jpg',
        pos: 'object-center',
        colClass: 'lg:w-[31.5%] min-h-[300px]',
        title: 'Mais Qualidade de Vida',
        desc: 'Mais disposição para o dia a dia, redução do estresse, melhora do sono e fortalecimento para viver o agora com saúde.',
      },
      {
        img: '/images/img5815.jpg',
        pos: 'object-center',
        colClass: 'lg:w-[46%] min-h-[300px]',
        title: 'Equipe Especializada',
        desc: 'Mais de 8 anos de experiência transformando vidas através do movimento consciente, com profissionais apaixonados pelo que fazem.',
      },
      {
        img: '/images/img0177.jpg',
        pos: 'object-center',
        colClass: 'lg:w-[51%] min-h-[300px]',
        title: 'Resultados que Fazem a Diferença',
        desc: 'Metodologia validada por centenas de alunos que transformaram o exercício físico em uma parte prazerosa da rotina.',
      },
    ],
  },
  modalitiesSection: {
    subtitleTop: 'Você sabe tudo que a',
    titleMain: 'S.A tem PARA oferecer?',
    description: 'Conheça nossas modalidades e se surpreenda com a S.A Treinamentos!',
    ctaText: 'Agendar Aula Experimental',
    carouselImages: [
      { src: '/images/img4815.jpg', alt: 'IMG_4815 - S.A Treinamento' },
      { src: '/images/sa-137.jpg', alt: 'S A Treinamento_ 137 - S.A Treinamento' },
      { src: '/images/img9788.jpg', alt: 'IMG_9788 - S.A Treinamento' },
      { src: '/images/sa-156.jpg', alt: 'S A Treinamento_ 156 - S.A Treinamento' },
      { src: '/images/img9825.jpg', alt: 'IMG_9825 - S.A Treinamento' },
      { src: '/images/img9772.jpg', alt: 'IMG_9772 - S.A Treinamento' },
      { src: '/images/img0177.jpg', alt: 'IMG_0177 - S.A Treinamento' },
    ],
    items: [
      'Treinamento Funcional Personalizado',
      'Musculação com Acompamento Próximo',
      'Condicionamento Físico e Emagrecimento',
      'Fortalecimento Muscular e Prevenção de Lesões',
      'Mobilidade, Postura e Qualidade de Vida',
      'Preparação Física e Performance Esportiva',
    ],
  },
  unitsSection: {
    subtitleTop: 'Quer treinar perto de casa?',
    titleMain: 'Escolha a sua unidade!',
    description: 'Conheça nossas unidades em Porto Alegre e agende sua aula experimental!',
    items: [
      {
        name: 'Unidade\nProtásio',
        img: '/images/img9825.jpg',
        mapQuery: 'S.A Treinamento Unidade Protásio',
        mapTitle: 'S.A Treinamento Unidade Protásio',
        address: 'Av. Protásio Alves — Porto Alegre, RS',
        ctaText: 'Agendar Aula Experimental',
      },
      {
        name: 'Unidade\nAntônio de Carvalho',
        img: '/images/img4815.jpg',
        mapQuery: 'S.A Treinamento Antônio',
        mapTitle: 'S.A Treinamento Antônio',
        address: 'Av. Antônio de Carvalho — Porto Alegre, RS',
        ctaText: 'Agendar Aula Experimental',
      },
      {
        name: 'Unidade\nPasqualini',
        img: '/images/sa-137.jpg',
        mapQuery: 'S.A Treinamento Pasqualini',
        mapTitle: 'S.A Treinamento Pasqualini',
        address: 'Av. Eng. Ludolfo Boehl / Pasqualini — Porto Alegre, RS',
        ctaText: 'Agendar Aula Experimental',
      },
    ],
  },
  plansSection: {
    subtitleTop: 'Vem pra S.A treinamento',
    titleMain: 'Escolha o seu plano!',
    plansList: [
      {
        id: 'mensal',
        label: 'Mensal',
        title: 'Plano Mensal',
        subtitle: 'à partir de',
        price: 'R$97,00',
        note: 'sem fidelidade • consulte unidades',
        features: [
          'TREINOS PERSONALIZADOS COM ACOMPANHAMENTO',
          'AVALIAÇÃO FÍSICA E PLANEJAMENTO DE METAS',
          'HORÁRIOS FLEXÍVEIS EM NOSSAS UNIDADES',
          'AMBIENTE ACOLHEDOR E ESTRUTURA COMPLETA',
        ],
      },
      {
        id: 'anual',
        label: 'Anual',
        title: 'Plano Anual',
        subtitle: 'à partir de',
        price: 'R$114,00',
        note: 'pagamento mensal',
        features: [
          'MELHOR CUSTO-BENEFÍCIO PARA SUA CONSTÂNCIA',
          'TREINOS PERSONALIZADOS E REAVALIAÇÕES PERIÓDICAS',
          'ACOMPANHAMENTO PRÓXIMO DE PROFESSORES',
          'ACESSO COMPLETO À METODOLOGIA S.A TREINAMENTO',
        ],
      },
      {
        id: 'duplas',
        label: 'Duplas',
        title: 'Plano em duplas',
        subtitle: 'de R$126,00 por apenas',
        price: 'R$97,00',
        note: 'por pessoa • treine com um amigo ou familiar',
        features: [
          'DESCONTO ESPECIAL PARA TREINAR EM DUPLA',
          'TREINO INDIVIDUALIZADO PARA CADA OBJETIVO',
          'MAIS MOTIVAÇÃO E COMPROMETIMENTO NA ROTINA',
          'ACOMPANHAMENTO COMPLETO DA EQUIPE S.A',
        ],
      },
    ],
  },
  blogSection: {
    subtitleTop: 'Conteúdos & Dicas',
    titleMain: 'Blog da S.A',
    description:
      'Artigos, dicas práticas de treino, saúde e qualidade de vida preparados pela equipe da S.A Treinamento.',
    homeButtonText: 'Ver Todos os Artigos no Blog',
    homePreviewCount: 3,
    pageHeaderTitle: 'Blog da S.A',
    pageHeaderSubtitle: 'Portal de Conteúdos, Saúde & Movimento Consciente',
    pageBannerTag: 'Conteúdos & Dicas',
    pageBannerTitle: 'Blog da S.A Treinamento',
    pageBannerDesc:
      'Artigos, dicas práticas de treino, saúde e qualidade de vida preparados pela equipe da S.A Treinamento.',
    searchPlaceholder: 'Pesquisar artigo por assunto, palavra-chave ou título...',
    postsPerPage: 6,
    defaultAuthor: 'Equipe S.A Treinamento',
    articleCtaTitle: 'Quer colocar essas dicas em prática?',
    articleCtaDesc:
      'Agende uma aula experimental gratuita em uma de nossas 3 unidades em Porto Alegre!',
    pageFooterText: '© S.A Treinamento — Blog Oficial & Conteúdos',
    posts: [
      {
        id: 'beneficios-treinamento-funcional-personalizado',
        title: '5 benefícios do treinamento funcional personalizado para sua rotina',
        category: 'Treinamento & Saúde',
        date: '10 Nov 2026',
        readTime: '4 min de leitura',
        image: '/images/img4815.jpg',
        excerpt:
          'Descubra por que ter um treino adaptado às suas necessidades e acompanhado de perto acelera resultados e evita lesões.',
        content:
          'Muitas pessoas desistem das academias tradicionais porque se sentem perdidas entre aparelhos e fichas genéricas. Na S.A Treinamento, o foco é justamente o oposto: entender quem você é, qual é o seu histórico e o que o seu corpo precisa hoje.\n\n1. Respeito à sua individualidade biológica\nCada aluno tem uma rotina, nível de condicionamento e histórico articular. Um treino planejado sob medida garante que você evolua no ritmo certo.\n\n2. Prevenção ativa de dores e lesões\nCom um professor acompanhando cada série de perto, pequenos ajustes de postura fazem toda a diferença para proteger coluna, ombros e joelhos.\n\n3. Mais motivação e constância\nTreinar em um ambiente acolhedor, onde a equipe conhece você pelo nome, transforma o exercício na melhor hora do seu dia.\n\n4. Resultados reais no dia a dia\nMais disposição ao acordar, sono reparador, melhora do fôlego e redução do estresse.\n\n5. Evolução contínua\nSeus treinos evoluem junto com você, mantendo o estímulo sempre desafiador e prazeroso.',
      },
      {
        id: 'como-manter-constancia-nos-treinos',
        title: 'Como manter a constância nos treinos sem abrir mão da qualidade de vida',
        category: 'Qualidade de Vida',
        date: '08 Nov 2026',
        readTime: '3 min de leitura',
        image: '/images/sa-137.jpg',
        excerpt:
          'O segredo dos resultados duradouros não está em treinos extremos de uma semana, mas em criar um hábito prazeroso e sustentável.',
        content:
          'Quando pensamos em começar a treinar, é comum achar que precisamos mudar radicalmente toda a rotina da noite para o dia. Na prática, o que gera transformação verdadeira é a constância.\n\nComece com metas reais: definir de 2 a 3 dias fixos na semana já gera adaptações importantes na sua energia, humor e força muscular.\n\nOutro fator decisivo é o ambiente: quando você encontra um espaço sem julgamentos, com orientação próxima e pessoas que vibram com a sua evolução, ir treinar deixa de ser uma obrigação pesada e passa a ser um momento de cuidado pessoal.',
      },
      {
        id: 'fortalecimento-muscular-e-mobilidade',
        title: 'Fortalecimento muscular e mobilidade: o segredo para viver sem dores',
        category: 'Movimento Consciente',
        date: '05 Nov 2026',
        readTime: '5 min de leitura',
        image: '/images/img0177.jpg',
        excerpt:
          'Passar horas sentado no trabalho cobra um preço alto da postura. Veja como combinar força e mobilidade devolve liberdade ao seu corpo.',
        content:
          'Dores nas costas, tensão no pescoço e sensação de rigidez ao levantar são sinais claros de que o corpo precisa de movimento orientado.\n\nAo combinar exercícios de mobilidade articular com fortalecimento muscular progressivo, estabilizamos as articulações e tiramos a sobrecarga da coluna.\n\nNa S.A Treinamento, integramos mobilidade, estabilidade do core e força funcional em todas as sessões para que você conquiste um corpo forte, funcional e livre para aproveitar o agora.',
      },
    ],
  },
  testimonials: [
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
  ],
  footer: {
    onlineBannerDesc:
      'Agende sua aula experimental pelo WhatsApp em qualquer uma de nossas 3 unidades',
    brandDescription:
      'Transformando sua qualidade de vida há mais de 8 anos. Viva o agora, viva a S.A!',
    companyName: 'S.A TREINAMENTO FUNCIONAL',
    companyLocation: 'Porto Alegre • RS',
    usefulLinksTitle: 'Links úteis',
    usefulLinks: [
      { label: 'Início', href: '#topo' },
      { label: 'Sobre a S.A', href: '#sobre' },
      { label: 'Modalidades', href: '#modalidades' },
      { label: 'Nossas Unidades', href: '#unidades' },
      { label: 'Planos e Valores', href: '#planos' },
      { label: 'Blog da S.A', href: '#blog' },
    ],
    socialTitle: 'Redes sociais',
    socialLinks: [
      {
        platform: 'WhatsApp',
        icon: 'fab fa-whatsapp',
        url: 'https://wa.me/5551999009900',
      },
      {
        platform: 'Instagram',
        icon: 'fab fa-instagram',
        url: 'https://www.instagram.com/',
      },
      {
        platform: 'Facebook',
        icon: 'fab fa-facebook',
        url: 'https://www.facebook.com/',
      },
    ],
  },
}

export function loadSiteData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SITE_DATA
    const parsed = JSON.parse(raw)

    // Migrate legacy plans object to plansList array if needed
    let plansList = DEFAULT_SITE_DATA.plansSection.plansList
    if (Array.isArray(parsed.plansSection?.plansList) && parsed.plansSection.plansList.length > 0) {
      plansList = parsed.plansSection.plansList
    } else if (parsed.plansSection?.plans) {
      plansList = ['mensal', 'anual', 'duplas']
        .map((k) =>
          parsed.plansSection.plans[k] ? { id: k, ...parsed.plansSection.plans[k] } : null
        )
        .filter(Boolean)
    }

    // Migrate legacy instagramUrl / facebookUrl to socialLinks array if needed
    let socialLinks = DEFAULT_SITE_DATA.footer.socialLinks
    if (Array.isArray(parsed.footer?.socialLinks) && parsed.footer.socialLinks.length > 0) {
      socialLinks = parsed.footer.socialLinks
    } else if (parsed.footer?.instagramUrl || parsed.footer?.facebookUrl) {
      socialLinks = [
        {
          platform: 'WhatsApp',
          icon: 'fab fa-whatsapp',
          url: `https://wa.me/${parsed.whatsappNumber || DEFAULT_SITE_DATA.whatsappNumber}`,
        },
        ...(parsed.footer.instagramUrl
          ? [{ platform: 'Instagram', icon: 'fab fa-instagram', url: parsed.footer.instagramUrl }]
          : []),
        ...(parsed.footer.facebookUrl
          ? [{ platform: 'Facebook', icon: 'fab fa-facebook', url: parsed.footer.facebookUrl }]
          : []),
      ]
    }

    return {
      ...DEFAULT_SITE_DATA,
      ...parsed,
      security: {
        ...DEFAULT_SITE_DATA.security,
        ...(parsed.security || {}),
      },
      clowayConfig: {
        ...DEFAULT_SITE_DATA.clowayConfig,
        ...(parsed.clowayConfig || {}),
      },
      header: {
        ...DEFAULT_SITE_DATA.header,
        ...(parsed.header || {}),
        navLinks:
          Array.isArray(parsed.header?.navLinks) && parsed.header.navLinks.length > 0
            ? parsed.header.navLinks
            : DEFAULT_SITE_DATA.header.navLinks,
      },
      hero: { ...DEFAULT_SITE_DATA.hero, ...(parsed.hero || {}) },
      about: { ...DEFAULT_SITE_DATA.about, ...(parsed.about || {}) },
      modalitiesSection: {
        ...DEFAULT_SITE_DATA.modalitiesSection,
        ...(parsed.modalitiesSection || {}),
      },
      unitsSection: {
        ...DEFAULT_SITE_DATA.unitsSection,
        ...(parsed.unitsSection || {}),
      },
      plansSection: {
        ...DEFAULT_SITE_DATA.plansSection,
        ...(parsed.plansSection || {}),
        plansList,
      },
      blogSection: {
        ...DEFAULT_SITE_DATA.blogSection,
        ...(parsed.blogSection || {}),
      },
      footer: {
        ...DEFAULT_SITE_DATA.footer,
        ...(parsed.footer || {}),
        usefulLinks:
          Array.isArray(parsed.footer?.usefulLinks) && parsed.footer.usefulLinks.length > 0
            ? parsed.footer.usefulLinks
            : DEFAULT_SITE_DATA.footer.usefulLinks,
        socialLinks,
      },
    }
  } catch {
    return DEFAULT_SITE_DATA
  }
}

export function saveSiteData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    // Grava também no arquivo dados-site.json via PHP quando hospedado no servidor do cliente (FileZilla/Apache)
    fetch('/api-cms.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {})
    return true
  } catch {
    return false
  }
}

export function resetSiteData() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    fetch('/api-cms.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset' }),
    }).catch(() => {})
  } catch {
    // ignore
  }
  return DEFAULT_SITE_DATA
}

export async function syncFromPhpServer(onUpdate) {
  try {
    const res = await fetch('/api-cms.php?t=' + Date.now(), {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return
    const text = await res.text()
    if (!text || text.trim().startsWith('<?php') || text.trim().startsWith('<')) return
    const json = JSON.parse(text)
    if (json && json.header && json.hero) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(json))
      if (onUpdate) onUpdate(loadSiteData())
    }
  } catch {
    // Fallback silencioso para localStorage/DEFAULT_SITE_DATA quando em ambiente sem PHP (ex: Vercel)
  }
}
