import './App.css'
import { useEffect, useState } from 'react'

function Sidebar({ active, open, setOpen, theme, setTheme }) {
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  const close = () => setOpen(false)
  const Link = ({ href, children }) => (
    <a href={href} className={active === href.slice(1) ? 'active' : ''} onClick={close}>
      {children}
    </a>
  )
  return (
    <>
      <button className={`sidebar-toggle ${open ? 'active' : ''}`} aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
        <span className="bars" />
      </button>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <a href="#home" className="brand" onClick={close}>AI Developer</a>
        <div className="links">
          <Link href="#projects">Projects</Link>
          <Link href="#experience">Experience</Link>
          <Link href="#skills">Skills</Link>
          <Link href="#contact">Contact</Link>
        </div>
        <div className="actions">
          <button className="button small" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
        <div className="footer muted">© {new Date().getFullYear()}</div>
      </aside>
    </>
  )
}

function Hero() {
  return (
    <header id="home" className="section hero" data-reveal="fade-up">
      <h1>Hi, I'm <b>Muhammad Mobeen</b> <br/> an AI Developer</h1>
      <p>Building AI products, agents, and scalable LLM systems.</p>
      <div className="cta">
        <a href="https://github.com/mobeen0" className="button" target="_blank" rel="noreferrer">View Projects</a>
        <a href="mailto:muhammad.mobeen100@gmail.com?subject=Inquiry%20from%20portfolio&body=Hi%20Mobeen,%0A%0A" className="button alt">Get in touch</a>
      </div>
    </header>
  )
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} AI Developer · Built with React + Vite</p>
    </footer>
  )
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])
  useEffect(() => {
    const cls = 'sidebar-open'
    if (open) document.body.classList.add(cls)
    else document.body.classList.remove(cls)
    return () => document.body.classList.remove(cls)
  }, [open])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    )
    const ids = ['home', 'projects', 'experience', 'skills', 'contact']
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.matches('a[href^="#"]')) {
        const href = e.target.getAttribute('href')
        const target = document.querySelector(href)
        if (target) {
          e.preventDefault()
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    const revealEls = document.querySelectorAll('[data-reveal]')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('reveal')
        })
      },
      { threshold: 0.15 }
    )
    revealEls.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // no remote fetch for experience; using curated roles

  useEffect(() => {
    const handleTilt = (e) => {
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const rx = ((y / rect.height) - 0.5) * -8
      const ry = ((x / rect.width) - 0.5) * 8
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`
    }
    const resetTilt = (e) => {
      e.currentTarget.style.transform = ''
    }
    const cards = document.querySelectorAll('.card')
    cards.forEach((c) => {
      c.addEventListener('mousemove', handleTilt)
      c.addEventListener('mouseleave', resetTilt)
    })
    return () => {
      cards.forEach((c) => {
        c.removeEventListener('mousemove', handleTilt)
        c.removeEventListener('mouseleave', resetTilt)
      })
    }
  }, [])

  return (
    <>
      <Sidebar active={active} open={open} setOpen={setOpen} theme={theme} setTheme={setTheme} />
      <Hero />
      <Section id="projects" title="Featured Projects">
        <div className="grid" data-reveal="fade-up">
          {PROJECTS.map((p) => (
            <article key={p.id} className="card" data-reveal="fade-up">
              <img src={p.image} alt="" className="card-img" />
              <div className="card-body">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="tags">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
                <div className="actions">
                  {p.code && <a className="button small alt" href={p.code} target="_blank" rel="noreferrer">Code</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="experience" title="Experience">
        <div className="roles" data-reveal="fade-up">
          {ROLES.map((role) => (
            <article key={role.id} className="card role">
              <div className="card-body">
                <h3>{role.title}</h3>
                <p className="muted">{role.company} · {role.period}</p>
                <ul className="bullets">
                  {role.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="skills" title="Skills">
        <div className="skill-groups" data-reveal="fade-up">
          {Object.entries(SKILL_GROUPS).map(([group, skills]) => (
            <article key={group} className="skill-card">
              <h3 className="skill-title">{group}</h3>
              <div className="skill-badges">
                {skills.map((s) => (
                  <span key={s} className="badge">{s}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="contact" title="Contact">
        <div className="contact" data-reveal="fade-up">
          <p className="muted">Prefer email? Reach me directly.</p>
          <a className="button" href="mailto:muhammad.mobeen100@gmail.com?subject=Inquiry%20from%20portfolio&body=Hi%20Mobeen,%0A%0A">Email me</a>
        </div>
      </Section>

      <Footer />
    </>
  )
}

const PROJECTS = [
  {
    id: 'ocr-service',
    title: 'OCR Microservice',
    description: 'High-accuracy OCR pipeline with preprocessing, language detection, and async queue for scale.',
    tags: ['Python', 'FastAPI', 'Tesseract/PaddleOCR', 'Celery', 'Docker'],
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop',
    demo: '#',
    code: '#',
  },
  {
    id: 'intelligent-doc-agent',
    title: 'Intelligent Document Search Agent',
    description: 'RAG-based agent indexing PDFs and docs with reranking and semantic filters for precise retrieval.',
    tags: ['TypeScript', 'Python', 'Qdrant/FAISS', 'Rerankers', 'LangChain'],
    image: 'https://images.unsplash.com/photo-1496065187959-7f07b8353c55?q=80&w=1600&auto=format&fit=crop',
    demo: '#',
    code: '#',
  },
  {
    id: 'text2sql-agent',
    title: 'Text-to-SQL Agent',
    description: 'LLM agent that translates natural language into optimized SQL with schema introspection and safeguards.',
    tags: ['Node.js', 'PostgreSQL', 'LLM', 'Guardrails'],
    image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1600&auto=format&fit=crop',
    demo: '#',
    code: '#',
  },
]

const SKILL_GROUPS = {
  'AI / LLM': [
    'LLM Systems',
    'Agents & Tools',
    'RAG Pipelines',
    'Prompt Engineering',
    'LangChain',
    'LlamaIndex',
  ],
  'Backend': [
    'FastAPI',
    'Node.js',
    'REST / Webhooks',
    'Auth & RBAC',
  ],
  'Data & Infra': [
    'Vector Databases',
    'PostgreSQL',
    'Docker',
    'MLOps & Observability',
  ],
  'Frontend': [
    'React',
    'Next.js',
    'Tailwind / CSS',
  ],
}

const ROLES = [
  {
    id: 'intern-ml',
    title: 'Machine Learning Intern',
    company: 'Your Company / Lab',
    period: 'Jun 2024 – Sep 2024',
    highlights: [
      'Built OCR and document parsing pipelines; boosted accuracy with preprocessing and layout heuristics',
      'Prototyped RAG pipelines for internal knowledge base; improved hit-rate with reranking',
      'Automated evaluations and telemetry to monitor model drift and latency',
    ],
  },
  {
    id: 'ai-developer',
    title: 'AI Developer (Freelance / Part-time)',
    company: 'Client Projects',
    period: '2023 – Present',
    highlights: [
      'Shipped Text-to-SQL agent with schema-aware plans and execution safeguards',
      'Delivered intelligent document search agent with chunking, hybrid search, and filters',
      'Containerized services and set up CI for rapid iteration and deployment',
    ],
  },
]

export default App
