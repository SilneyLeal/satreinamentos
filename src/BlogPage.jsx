import React, { useState, useMemo } from 'react'

export default function BlogPage({
  siteData,
  onBackToHome,
  activeClowayModel,
  assistantName,
  onOpenCloway,
}) {
  const blogSection = siteData?.blogSection || {}
  const posts = blogSection.posts || []
  const whatsappNumber = siteData?.whatsappNumber || '5551999009900'
  const perPage = Number(blogSection.postsPerPage) > 0 ? Number(blogSection.postsPerPage) : 6

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [visibleCount, setVisibleCount] = useState(perPage)
  const [activePost, setActivePost] = useState(null)

  // Extract unique categories dynamically from all posts
  const categories = useMemo(() => {
    const set = new Set(['Todas'])
    posts.forEach((p) => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim())
      }
    })
    return Array.from(set)
  }, [posts])

  // Filter posts by category & search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'Todas' ||
        (post.category || '').trim().toLowerCase() === selectedCategory.toLowerCase()

      const q = searchQuery.trim().toLowerCase()
      if (!q) return matchesCategory

      const inTitle = (post.title || '').toLowerCase().includes(q)
      const inExcerpt = (post.excerpt || '').toLowerCase().includes(q)
      const inContent = (post.content || '').toLowerCase().includes(q)
      const inCat = (post.category || '').toLowerCase().includes(q)
      return matchesCategory && (inTitle || inExcerpt || inContent || inCat)
    })
  }, [posts, selectedCategory, searchQuery])

  const visiblePosts = filteredPosts.slice(0, visibleCount)

  // If user clicked a specific article to read in full view inside the Blog tab
  if (activePost) {
    return (
      <div className="min-h-screen bg-[#0D0E11] text-white font-poppins">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-[#141519]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                setActivePost(null)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black text-xs font-semibold transition cursor-pointer"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Voltar para Todos os Artigos</span>
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
            >
              Ir para o Início do Site
            </button>
          </div>
        </header>

        {/* Full Article Reader */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <article className="bg-[#141416] border border-[#D4AF37]/25 rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative h-64 sm:h-96">
              <img
                src={activePost.image || '/images/img4815.jpg'}
                alt={activePost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-[#141416]/35 to-transparent" />
              {activePost.category && (
                <span className="absolute bottom-5 left-6 sm:left-10 px-4 py-1.5 rounded-full bg-[#D4AF37] text-black font-poppins font-semibold text-xs uppercase tracking-wider shadow">
                  {activePost.category}
                </span>
              )}
            </div>

            <div className="p-6 sm:p-12 space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/55">
                {activePost.date && (
                  <span>
                    <i className="far fa-calendar-alt text-[#D4AF37] mr-1.5"></i>
                    {activePost.date}
                  </span>
                )}
                {activePost.readTime && (
                  <span>
                    <i className="far fa-clock text-[#D4AF37] mr-1.5"></i>
                    {activePost.readTime}
                  </span>
                )}
                <span>
                  • Por {activePost.author || blogSection.defaultAuthor || 'Equipe S.A Treinamento'}
                </span>
              </div>

              <h1 className="font-bebas italic text-4xl sm:text-6xl leading-[1.05] sa-degrade-hero">
                {activePost.title}
              </h1>

              {activePost.excerpt && (
                <p className="font-poppins italic text-base sm:text-lg text-white/90 border-l-4 border-[#D4AF37] pl-4 py-1 leading-relaxed">
                  {activePost.excerpt}
                </p>
              )}

              <div className="font-poppins text-sm sm:text-base text-white/85 leading-relaxed space-y-4 pt-2 whitespace-pre-line">
                {activePost.content}
              </div>

              {/* Call to Action Box inside Article */}
              <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1D1B16] to-[#141416] border border-[#D4AF37]/35 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-bebas italic text-3xl text-[#D4AF37]">
                    {blogSection.articleCtaTitle || 'Quer colocar essas dicas em prática?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 mt-1">
                    {blogSection.articleCtaDesc ||
                      'Agende uma aula experimental gratuita em uma de nossas 3 unidades em Porto Alegre!'}
                  </p>
                </div>

                {activeClowayModel ? (
                  <button
                    type="button"
                    onClick={() => onOpenCloway('📅 Agendar Aula Experimental')}
                    className="sa-btn-gold px-7 py-4 text-[22px] shrink-0 cursor-pointer"
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
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Olá! Li o artigo "${activePost.title}" no Blog da S.A e gostaria de agendar uma aula experimental.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="sa-btn-gold px-7 py-4 text-[22px] shrink-0"
                  >
                    <i className="fab fa-whatsapp text-[20px] mr-2 sa-btn-icon"></i>
                    <span>Agendar Aula Experimental</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0E11] text-white font-poppins flex flex-col justify-between">
      {/* ==================== HEADER DA PÁGINA DO BLOG (/blog) ==================== */}
      <header className="sticky top-0 z-40 bg-[#141519]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black text-xs font-semibold transition cursor-pointer"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Voltar ao Site</span>
            </button>

            <div className="flex items-center gap-3">
              <img
                src="/images/logo-sa.png"
                alt="S.A Treinamento"
                className="w-10 h-10 rounded-xl object-cover border border-[#D4AF37]/40"
              />
              <div>
                <h1 className="font-bebas italic text-2xl text-[#D4AF37] leading-none">
                  {blogSection.pageHeaderTitle || blogSection.titleMain || 'Blog da S.A'}
                </h1>
                <p className="text-[11px] text-white/55">
                  {blogSection.pageHeaderSubtitle ||
                    'Portal de Conteúdos, Saúde & Movimento Consciente'}
                </p>
              </div>
            </div>
          </div>

          <div>
            {activeClowayModel ? (
              <button
                type="button"
                onClick={() => onOpenCloway('📅 Agendar Aula Experimental')}
                className="sa-btn-gold px-6 py-2.5 text-[18px] cursor-pointer"
              >
                <img
                  src="/images/cloway-clo.webp"
                  alt={assistantName}
                  className="w-5 h-5 rounded-full object-cover border border-black/30 mr-2"
                />
                <span>Agendar com a {assistantName}</span>
              </button>
            ) : (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  'Olá! Vim pelo Blog da S.A Treinamento e gostaria de agendar uma aula experimental.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="sa-btn-gold px-6 py-2.5 text-[18px]"
              >
                <i className="fab fa-whatsapp text-[17px] mr-2 sa-btn-icon"></i>
                <span>Agendar Aula Experimental</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ==================== BANNER E BUSCA DO BLOG ==================== */}
      <div className="flex-1">
        <section className="relative py-14 sm:py-20 px-4 border-b border-white/10 bg-gradient-to-b from-[#171613] to-[#0D0E11]">
          <div className="max-w-5xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-xs uppercase tracking-widest text-[#FFF2CD]">
              <i className="fas fa-newspaper text-[#D4AF37]"></i>
              <span>{blogSection.pageBannerTag || blogSection.subtitleTop || 'Conteúdos & Dicas'}</span>
            </span>

            <h2 className="font-bebas italic text-5xl sm:text-7xl sa-degrade-hero leading-none">
              {blogSection.pageBannerTitle || blogSection.titleMain || 'Blog da S.A Treinamento'}
            </h2>

            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto">
              {blogSection.pageBannerDesc ||
                blogSection.description ||
                'Artigos, dicas práticas de treino, saúde e qualidade de vida preparados pela equipe da S.A Treinamento.'}
            </p>

            {/* Barra de Pesquisa + Filtro de Categorias */}
            <div className="pt-4 max-w-2xl mx-auto space-y-4">
              <div className="relative">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setVisibleCount(perPage)
                  }}
                  placeholder={
                    blogSection.searchPlaceholder ||
                    'Pesquisar artigo por assunto, palavra-chave ou título...'
                  }
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#141519] border border-white/15 focus:border-[#D4AF37] text-sm text-white placeholder-white/40 outline-none shadow-lg"
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {categories.map((cat) => {
                  const active = selectedCategory === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat)
                        setVisibleCount(perPage)
                      }}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                        active
                          ? 'bg-[#D4AF37] text-black font-semibold shadow'
                          : 'bg-white/5 hover:bg-white/10 text-white/75 border border-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== GRADE DE TODOS OS ARTIGOS ==================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-6 text-xs text-white/55">
            <span>
              Exibindo <strong className="text-white">{visiblePosts.length}</strong> de{' '}
              <strong className="text-[#D4AF37]">{filteredPosts.length}</strong> artigos publicados
            </span>
            {(searchQuery || selectedCategory !== 'Todas') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('Todas')
                }}
                className="text-[#D4AF37] hover:underline cursor-pointer"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-[#141519] rounded-3xl border border-white/10 p-8">
              <i className="fas fa-search text-3xl text-[#D4AF37] mb-3"></i>
              <h3 className="font-bebas italic text-3xl text-white">
                Nenhum artigo encontrado para sua busca
              </h3>
              <p className="text-xs text-white/60 mt-1">
                Tente buscar por outro termo ou selecione &ldquo;Todas&rdquo; nas categorias acima.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {visiblePosts.map((post, idx) => (
                  <article
                    key={post.id || idx}
                    onClick={() => {
                      setActivePost(post)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="group bg-[#141416] text-white rounded-[24px] overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.45)] border border-white/10 hover:border-[#D4AF37]/50 flex flex-col cursor-pointer hover:-translate-y-1.5 transition-all duration-300"
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
                        <span>Ler artigo completo</span>
                        <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Botão Carregar Mais (Paginação limpa quando tiver muitos artigos) */}
              {visibleCount < filteredPosts.length && (
                <div className="mt-12 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + perPage)}
                    className="px-8 py-4 rounded-2xl bg-[#141519] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 font-bebas italic text-2xl tracking-wider transition cursor-pointer shadow-lg"
                  >
                    Carregar Mais Artigos ({filteredPosts.length - visibleCount} restantes)
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* ==================== RODAPÉ SIMPLIFICADO DO BLOG ==================== */}
      <footer className="bg-[#141519] border-t border-white/10 py-6 px-6 text-xs text-white/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>
            {blogSection.pageFooterText || '© S.A Treinamento — Blog Oficial & Conteúdos'}
          </span>
          <button
            type="button"
            onClick={onBackToHome}
            className="text-[#D4AF37] hover:underline cursor-pointer"
          >
            ← Voltar para a Página Inicial
          </button>
        </div>
      </footer>
    </div>
  )
}
