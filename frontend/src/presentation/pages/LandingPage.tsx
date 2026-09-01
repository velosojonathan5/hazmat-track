const FEATURES = [
  {
    title: 'Checklist veicular digital',
    description:
      'Baseado na Resolução ANTT 5.998/22, na NBR 7.500/7.503 e nas normas do Contran. Não conformidades são identificadas automaticamente e cada inspeção gera um laudo em PDF.',
  },
  {
    title: 'Fiscalização ambiental',
    description:
      'Registro fotográfico com geolocalização automática e classificação da Escala de Ringelmann — evidência pronta para auditoria, direto do campo.',
  },
  {
    title: 'Dashboard de conformidade',
    description:
      'Indicadores de conformidade, não conformidades abertas e vistorias em tempo real, com filtro por veículo, carga e período.',
  },
];

const BENEFITS = [
  'Menos risco de autuação e passivo ambiental',
  'Evidência auditável em cada inspeção e vistoria',
  'Visibilidade centralizada de toda a operação',
  'Substitui planilha e papel por um fluxo digital único',
];

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="brand">
          <span className="brand-mark">HT</span>
          <h1>HazmatTrack</h1>
        </div>
        <button type="button" className="btn btn-secondary" onClick={onEnter}>
          Entrar
        </button>
      </nav>

      <section className="hero">
        <span className="hero-eyebrow">Gestão Ambiental &amp; Compliance</span>
        <h2 className="hero-title">
          Conformidade ambiental do transporte de carga perigosa, do checklist ao dashboard.
        </h2>
        <p className="hero-subtitle">
          HazmatTrack digitaliza a inspeção veicular, a fiscalização ambiental e os indicadores de
          conformidade da sua operação — com evidência auditável em cada etapa.
        </p>
        <div className="hero-actions">
          <button type="button" className="btn btn-primary" onClick={onEnter}>
            Entrar no sistema
          </button>
        </div>
        <p className="hero-target">
          Feito para indústrias que transportam ou geram carga perigosa — bebidas, papel e celulose,
          química e petroquímica — e respondem à fiscalização da ANTT, do IBAMA e de órgãos ambientais
          estaduais.
        </p>
      </section>

      <section className="landing-section">
        <div className="section-heading">
          <h2>Um fluxo único, do campo à gestão</h2>
          <p>Três módulos que cobrem a operação de ponta a ponta.</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map((feature, index) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-icon">{index + 1}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="benefit-band">
        <div className="landing-section">
          <ul className="benefit-list">
            {BENEFITS.map((benefit) => (
              <li key={benefit}>
                <span className="benefit-check">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="landing-footer">
        <span>HazmatTrack</span>
        <span>Gestão ambiental e compliance para transporte de carga perigosa</span>
      </footer>
    </div>
  );
}
