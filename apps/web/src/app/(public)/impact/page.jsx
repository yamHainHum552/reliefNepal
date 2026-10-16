import styles from "./impact.module.css";

const programs = [
  {
    id: "protection",
    number: "01",
    icon: "01",
    title: "Protection",
    summary:
      "Promoting the rights, safety and dignity of children, women and marginalized communities.",
    projects: [
      {
        name: "Child Development Program",
        districts: "Dhanusha",
        period: "June 2008 - April 2009",
        partner: "Janaki Wonmen Awarness Society",
        image: "/images/protection.child.jpg",
      },
      {
        name: "Program for Marginalized and Minority Youth",
        districts: "Sindhuli",
        period: "May 2011 - April 2012",
        partner: "Ministry of Youth and Sports",
        image: "/images/protection.minor.jpg",
      },
      {
        name: "Creating Hope for Children",
        districts: "Sindhuli",
        period: "June 2013 - Till date",
        partner: "Plan Nepal",
        image: "/images/protection.hope.jpg",
      },
    ],
  },
  {
    id: "health-education",
    number: "02",
    icon: "02",
    title: "Health & Education",
    summary:
      "Supporting healthier communities and more inclusive opportunities to learn.",
    projects: [
      {
        name: "Reproductive Health Program",
        districts: "Sindhuli",
        period: "June 2009 - Jan 2010",
        partner: "Women Development Office",
        image: "/images/health.reproductive.jpg",
      },
      {
        name: "Youth Relief and rehabilition Program / PLWHA",
        districts: "Sindhuli",
        period: "May 2009 - April 2010",
        partner: "Ministry of Youth and Sports, Government of Nepal",
        image: "/images/heath.youth.jpg",
      },
      {
        name: "Disable Prevention and Rehabilitation Program",
        districts: "Sindhuli",
        period: "May 2014 - Till date",
        partner: "Kinder Mission Werk-Jerman / NHA / SKN JV CWS",
        image: "/images/heath.disable.jpg",
      },
    ],
  },
  {
    id: "disaster-climate",
    number: "03",
    icon: "03",
    title: "Disaster & Climate",
    summary:
      "Strengthening preparedness, community resilience and humanitarian response.",
    projects: [
      {
        name: "Climate Change Environment Protection and Development",
        districts: "Sindhuli",
        period: "Jan 2011 - May 2012",
        partner: "Ministry of Youth and Sports, Government of Nepal",
        image: "/images/climate.1.jpg",
      },
      {
        name: "Forest Development and Soil Management",
        districts: "Sindhuli",
        period: "April 2011 - May 2012",
        partner: "Goth Kharka Community Forestry Consumer Committee",
        image: "/images/climate.2.jpg",
      },
      {
        name: "Immediate Relief to the Victim in Sindhuli",
        districts: "Sindhuli",
        period: "April 2015 - Till date",
        partner: "Caritas Nepal",
        image: "/images/climate.3.jpg",
      },
      {
        name: "Immediate Relief to the Victim of Earthquake in Nepal",
        districts: "Kathmandu, Lalitpur and Kavre Palanchowk",
        period: "May 2015 - Till date",
        partner: "Terres Des hommes German",
        image: "/images/climate.4.jpg",
      },
      {
        name: "Recovery and Restoration of Living Conditions in 8 Earthquake Districts in Nepal",
        districts: "Kavre Palanchowk and Sindhuli",
        period: "April 2015 - Till date",
        partner: "Terres Des hommes German",
        image: "/images/climate.5.jpg",
      },
    ],
  },
  {
    id: "wash",
    number: "04",
    icon: "04",
    title: "WASH",
    summary:
      "Promoting access to safe water, sanitation and healthy hygiene practices.",
    projects: [
      {
        name: "Drinking Water Supply Project",
        districts: "Sindhuli",
        period: "May 2013 - April 2014",
        partner: "Hatpate VDC",
        image: "/images/wash.1.jpg",
      },
      {
        name: "Promoting Safe Drinking Water",
        districts: "Sindhuli",
        period: "May 2013 - April 2014",
        partner: "Caritas Nepal",
        image: "/images/wash.2.jpg",
      },
      {
        name: "Promoting Essential Health and Sanitation Facilities for Rural People",
        districts: "Sindhuli",
        period: "October 2014 - Till date",
        partner: "Terres Des hommes German",
        image: "/images/wash.3.jpg",
      },
    ],
  },
  {
    id: "livelihoods",
    number: "05",
    icon: "05",
    title: "Livelihoods",
    summary:
      "Helping people build self-reliance through skills, opportunities and community action.",
    projects: [
      {
        name: "Marginalized Community Emppowment Program (River Bank Farming)",
        districts: "Mahottari, Sarlahi and Rautahat",
        period: "August 2010 - September 2013",
        partner: "JWAS / NARDF",
        image: "/images/livelihood.1.png",
      },
      {
        name: "Community Empowerment Program",
        districts: "Sindhuli",
        period: "Feb 2013 - Till date",
        partner: "Caritas Nepal",
        image: "/images/livelihood.2.png",
      },
    ],
  },
];

export default function ImpactPage() {
  return (
    <main className={`rn-site rn-impact-page ${styles.page}`}>
      <div className="rn-topbar">
        <div className="rn-container rn-topbar-inner">
          <p><span className="rn-tagline">Listen to Children...</span></p>
          <div className="rn-top-contact">
            <a href="tel:+977047520915">+977-047-520915</a>
            <span className="rn-top-divider">|</span>
            <a href="mailto:info@reliefnepal.org.np">info@reliefnepal.org.np</a>
          </div>
        </div>
      </div>

      <header className={`rn-header ${styles.header}`}>
        <div className="rn-container rn-header-inner">
          <a className="rn-brand" href="/" aria-label="Relief Nepal home">
            <img className="rn-logo-image" src="/images/logo.jpg" alt="Relief Nepal" />
          </a>
          <nav className={`rn-nav ${styles.nav}`} aria-label="Main navigation">
            <a href="/">Home</a>
            <a href="/about">About Us</a>
            <a href="/projects">Projects</a>
            <a className="rn-nav-active" href="/impact" aria-current="page">Impact</a>
            <a href="/stories">Stories</a>
            <a href="/media">Media</a>
            <a href="/notice">Notice</a>
            <a href="/partners">Partners</a>
            <a href="/get involved">Get Involved</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={`rn-container ${styles.heroInner}`}>
          <span className={styles.eyebrow}>Our impact</span>
          <h1>Creating change where it matters.</h1>
          <p>
            Relief Nepal works alongside communities to protect rights, expand
            opportunities and build resilience. Explore our programs and the
            projects contributing to that change.
          </p>
          <a className={styles.heroLink} href="#impact-areas">Explore our work <span aria-hidden="true">â†“</span></a>
        </div>
        <span className={styles.heroAccent} aria-hidden="true" />
      </section>

      <section className={styles.areas} id="impact-areas" aria-labelledby="impact-areas-title">
        <div className="rn-container">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>Where we work</span>
              <h2 id="impact-areas-title">Our areas of impact</h2>
            </div>
            <p>Choose an area to explore its projects and community partnerships.</p>
          </div>
          <div className={styles.areaGrid}>
            {programs.map((area) => (
              <a className={styles.areaCard} href={`#${area.id}`} key={area.id}>
                <span className={styles.areaNumber}>{area.number}</span>
                <span className={styles.areaTitle}>{area.title}</span>
                <span className={styles.areaSummary}>{area.summary}</span>
                <span className={styles.areaLink}>Explore area <span aria-hidden="true">â†—</span></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {programs.map((area, index) => (
        <section
          className={`${styles.programSection} ${index % 2 ? styles.alternate : ""}`}
          id={area.id}
          key={area.id}
          aria-labelledby={`${area.id}-title`}
        >
          <div className="rn-container">
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>Focus area {area.number}</span>
                <h2 id={`${area.id}-title`}>{area.title}</h2>
              </div>
              <p>{area.summary}</p>
            </div>
            <div className={styles.projectGrid}>
              {area.projects.map((project, projectIndex) => (
                <article className={styles.projectCard} key={`${area.id}-${project.name}`}>
                  <div className={styles.projectImage}>
                    <img src={project.image} alt={project.name} loading="lazy" />
                    <span className={styles.projectIndex}>{String(projectIndex + 1).padStart(2, "0")}</span>
                  </div>
                  <div className={styles.projectBody}>
                    <span className={styles.projectCategory}>{area.title} program</span>
                    <h3>{project.name}</h3>
                    <dl className={styles.projectDetails}>
                      <div>
                        <dt>Coverage districts</dt>
                        <dd>{project.districts}</dd>
                      </div>
                      <div>
                        <dt>Project period</dt>
                        <dd>{project.period}</dd>
                      </div>
                      <div>
                        <dt>Funding partner</dt>
                        <dd>{project.partner}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <footer className="rn-footer">
        <div className="rn-container">
          <div className="rn-footer-main">
            <div className="rn-footer-about">
              <img className="rn-logo-image rn-footer-logo" src="/images/logo.jpg" alt="Relief Nepal" />
            </div>
            <div className="rn-footer-quick-contact">
              <h3>Quick contact:</h3>
              <div>
                <strong>Head Office:</strong>
                <p>Kamalamai Municipality-6, Sindhuli</p>
                <p>Contact No: <a href="tel:+977047520915">+977-047-520915</a></p>
                <p>Email: <a href="mailto:reliefns@gmail.com">reliefns@gmail.com</a></p>
              </div>
            </div>
          </div>
          <div className="rn-footer-bottom">
            <p>Â© {new Date().getFullYear()} Relief Nepal. All rights reserved.</p>
            <p>Community-led change for a more equitable society.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}




