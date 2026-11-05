import { Chakra } from './components/Chakra'
import { useDepth } from './components/useDepth'
import { CONTACT_EMAIL, PRODUCTS } from './content'
import logoTile from './assets/logo/logo-tile.svg'
import './App.css'

function Nav() {
  return (
    <header className="nav">
      <div className="wrap">
        <a className="brand" href="#top">
          <img src={logoTile} alt="" width="40" height="40" />
          Seshat Infotech
        </a>
        <nav aria-label="Primary">
          <ul>
            <li><a href="#products">Products</a></li>
            <li><a href="#about">About</a></li>
            <li><a className="btn" href="#contact">Get in touch</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  const { ref } = useDepth()
  return (
    <section className="hero" aria-labelledby="hero-title" ref={ref}>
      <Chakra />
      <div className="wrap hero__copy">
        <h1 id="hero-title">Software that holds up.</h1>
        <p className="lede">
          Seshat Infotech is a product company. We make TryOnMe, Collab and PathoGen, and we are
          building the next one.
        </p>
        <div className="actions">
          <a className="btn" href="#products">See our products</a>
          <a className="btn btn--ghost" href="#contact">Talk to us</a>
        </div>
      </div>
      <nav className="quick" aria-label="Products">
        <div className="wrap">
          {PRODUCTS.map((product) => (
            <a key={product.id} href={`#${product.id}`}>{product.name}</a>
          ))}
          <a className="next" href="#products">More on the way</a>
        </div>
      </nav>
    </section>
  )
}

function Products() {
  return (
    <section className="products" id="products" aria-labelledby="products-title">
      <div className="wrap">
        <div className="head">
          <h2 id="products-title">Our products</h2>
          <p>Three in the world today. Every new product gets its own panel here.</p>
        </div>

        {PRODUCTS.map(({ id, name, tagline, body, Art }) => (
          <article className="panel" id={id} key={id}>
            <div className="copy">
              <h3>{name}</h3>
              <p className="tag">{tagline}</p>
              <p className="desc">{body}</p>
              <a className="btn btn--ink" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`About ${name}`)}`}>
                Ask about {name}
              </a>
            </div>
            <div className="art">
              <Art />
            </div>
          </article>
        ))}

        <article className="panel panel--next">
          <div className="copy">
            <h3><span className="dot" />The next one</h3>
            <p className="desc">A fourth product is in the works. Write to us if you want to hear when it is ready.</p>
          </div>
        </article>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <div>
          <h2 id="about-title">Named for the goddess of records.</h2>
          <p>
            Seshat, in Egyptian myth, wrote down what mattered and measured the ground before
            anything was built on it. The star above her head is our mark. It is the only Egyptian
            thing about us.
          </p>
        </div>
        <ul className="creed">
          <li>Write it down.</li>
          <li>Measure first.</li>
          <li>Build to last.</li>
        </ul>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <footer className="contact" id="contact">
      <div className="wrap">
        <h2>Tell us what you want to build.</h2>
        <a className="mail" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        <div className="foot">
          <span className="foot__brand">
            <img src={logoTile} alt="" width="36" height="36" />
            © 2026 Seshat Infotech
          </span>
          <span>{PRODUCTS.map((p) => p.name).join(', ')}</span>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Products />
        <About />
      </main>
      <Contact />
    </>
  )
}
