"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  // Hero slideshow images from the public/images folder
  const images = [
    "/images/Picture7.jpg",
    "/images/plant.jpg",
    "/images/Trackshoot-support.jpg",
    "/images/girls.group.jpg",
    "/images/handwashing.jpg",
    "/images/health.youth.jpg",
    "/images/dhara.jpg",
    "/images/grp.holding.jpg",
    "/images/protection.child.jpg",
  ];

  const [activeImage, setActiveImage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");

  // Change the hero image every second
  
useEffect(() => {
  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Keep the current image still for visitors who prefer reduced motion.
  if (prefersReducedMotion) return;

  const interval = setInterval(() => {
    setActiveImage((current) => (current + 1) % images.length);
  }, 6000);

  return () => clearInterval(interval);
}, [images.length]);


  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Impact", href: "/impact" },
    { label: "Media", href: "/media" },
    { label: "Notice", href:"/notice"},
    { label: "Partners", href: "/partners" },
    { label: "Get Involved", href: "/get-involved" },
    { label: "Contact", href: "/contact" },
  ];

  const focusAreas = [
    {
      number: "01",
      icon: "♡",
      title: "Protection",
      description:
        "Promoting the rights, safety and dignity of children, women and marginalized communities.",
    },
    {
      number: "02",
      icon: "✚",
      title: "Health & Education",
      description:
        "Supporting healthier communities and more inclusive opportunities to learn.",
    },
    {
      number: "03",
      icon: "↗",
      title: "Disaster & Climate",
      description:
        "Strengthening preparedness, community resilience and humanitarian response.",
    },
    {
      number: "04",
      icon: "♧",
      title: "WASH",
      description:
        "Promoting access to safe water, sanitation and healthy hygiene practices.",
    },
    {
      number: "05",
      icon: "⌂",
      title: "Livelihoods",
      description:
        "Helping people build self-reliance through skills, opportunities and community action.",
    },
  ];

  const projects = [
    {
      title: "Creating HOPE for Women, Children and Families",
      category: "Protection & empowerment",
      description:
        "Supporting women, children and families through community-based protection, counselling and empowerment.",
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=85",
      link: "https://reliefnepal.org.np/ongoingprojects/creating-hope-for-women-children-and-families/",
    },
    {
      title: "Fund for Child Smile",
      category: "Child protection",
      description:
        "Working toward a safer, more supportive future where children can grow, learn and thrive.",
      image:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=85",
      link: "https://reliefnepal.org.np/on-going-projects/",
    },
    {
      title: "Humanitarian Response Partnership",
      category: "Emergency response",
      description:
        "Working with communities and partners to respond to humanitarian needs and strengthen resilience.",
      image:
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=85",
      link: "https://reliefnepal.org.np/on-going-projects/",
    },
  ];

  const resources = [
    {
      icon: "▤",
      title: "Annual Reports",
      description: "Explore our organizational progress and activities.",
      link: "https://reliefnepal.org.np/",
    },
    {
      icon: "▧",
      title: "Publications",
      description: "Read resources, publications and learning materials.",
      link: "https://reliefnepal.org.np/",
    },
    {
      icon: "▣",
      title: "Organization Profile",
      description: "Learn about our mission, vision and areas of work.",
      link: "https://reliefnepal.org.np/wp-content/uploads/2024/05/Org-Progile_Relief-Nepal_2024.pdf",
    },
  ];

  function handleSubscribe(event) {
    event.preventDefault();

    setNotice(
      "Thank you for your interest! Newsletter registration needs to be connected to the backend."
    );
  }

  return (
    <main className="rn-site">
      {/* Top contact bar */}
      <div className="rn-topbar">
        <div className="rn-container rn-topbar-inner">
          <p>
            <span className="rn-nepali">बालबालिकालाई सुनौँ</span>
            <span className="rn-tagline">Listen to Children...</span>
          </p>

          <div className="rn-top-contact">
            <a href="tel:+977047520915">☎ +977-047-520915</a>
            <span className="rn-top-divider">|</span>
            <a href="tel:+9779851001193">+977-9851001193</a>
          </div>
        </div>
      </div>

      {/* Header and navigation */}
      <header className="rn-header">
        <div className="rn-container rn-header-inner">
          <a className="rn-brand" href="/" aria-label="Relief Nepal home">
            <img
              className="rn-logo-image"
              src="/images/logo.jpg"
              alt="Relief Nepal — बालबालिकालाई सुनौँ"
            />
          </a>

          <button
            className="rn-menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            className={`rn-nav ${menuOpen ? "rn-nav-open" : ""}`}
            aria-label="Main navigation"
          >
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={item.label === "Home" ? "rn-nav-active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}

            <a
              href="/get-involved"
              className="rn-donate-button"
              onClick={() => setMenuOpen(false)}
            >
              Support Us <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero image slideshow */}
      <section className="rn-hero">
        <div className="rn-hero-shade">
          {images.map((image, index) => (
            <div
              key={image}
              className={`rn-hero-slide ${
                activeImage === index ? "active" : ""
              }`}
              style={{ backgroundImage: `url("${image}")` }}
              aria-hidden="true"
            />
          ))}

          <div className="rn-container rn-hero-content">
            <div className="rn-hero-actions">
              <a className="rn-button rn-button-primary" href="/our-work">
                Explore Our Work <span aria-hidden="true">→</span>
              </a>

              <a
                className="rn-button rn-button-outline"
                href="/get-involved"
              >
                Get Involved <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome section */}
      <section className="rn-welcome rn-section">
        <div className="rn-container rn-welcome-grid">
          <div className="rn-welcome-copy">
            <h2>
              Together, we can build a more <span>equitable Nepal.</span>
            </h2>

            <p>
              Relief Nepal, established in 2008 and headquartered in Sindhuli, 
              is a non-profit organization dedicated to improving the well-being of underserved children,
              families, and communities. Operating across the Bagmati, Madhesh, and Karnali provinces, 
              the organization successfully implemented diverse humanitarian and development projects between 2021 and 2025,
              directly benefiting more than 15,000 people annually.
            </p>

            <p>
             Moving forward, the organizational strategic plan for 2026–2030 centers 
             on five core sectors: Child Protection, Education, Employment and Income, Health and Nutrition, 
             and Resilient Humanitarian Actions and Disaster Preparedness. To ensure long-term sustainability, 
             Relief Nepal integrates three cross-cutting areas into these sectors, aligning its future programs with local, 
             provincial, and federal government priorities to actively contribute to Nepal’s SDG targets.
             
            </p>
          </div>
        </div>
      </section>

      {/* Focus areas */}
      <section className="rn-focus rn-section">
        <div className="rn-container">
          <div className="rn-section-heading">
            <div>
              <h2>Creating change where it matters.</h2>
            </div>
          </div>

          <div className="rn-focus-grid">
            {focusAreas.map((area) => (
              <article className="rn-focus-card" key={area.number}>
                <div className="rn-focus-card-top">
                  <span className="rn-focus-icon" aria-hidden="true">
                    {area.icon}
                  </span>
                  <span className="rn-focus-number">{area.number}</span>
                </div>

                <h3>{area.title}</h3>
                <p>{area.description}</p>

                <a href="/our-work" aria-label={`Explore ${area.title}`}>
                  <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="rn-projects rn-section">
        <div className="rn-container">
          <div className="rn-section-heading rn-projects-heading">
            <div>
              <h2>Projects that make a difference.</h2>
            </div>

            <a className="rn-text-link" href="/projects">
              View all projects <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="rn-project-grid">
            {projects.map((project, index) => (
              <article className="rn-project-card" key={project.title}>
                <a className="rn-project-image" href={project.link}>
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                  />
                  <span className="rn-project-index">
                    0{index + 1}
                  </span>
                </a>

                <div className="rn-project-content">
                  <span className="rn-project-category">
                    {project.category}
                  </span>

                  <h3>
                    <a href={project.link}>{project.title}</a>
                  </h3>

                  <p>{project.description}</p>

                  <a className="rn-text-link" href={project.link}>
                    Discover project <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="rn-resources rn-section">
        <div className="rn-container">
          <div className="rn-section-heading">
            <div>
              <h2>Learn more about our work.</h2>
            </div>
          </div>

          <div className="rn-resource-grid">
            {resources.map((resource) => (
              <a
                className="rn-resource-card"
                href={resource.link}
                key={resource.title}
                target="_blank"
                rel="noreferrer"
              >
                <span className="rn-resource-icon" aria-hidden="true">
                  {resource.icon}
                </span>

                <span className="rn-resource-copy">
                  <strong>{resource.title}</strong>
                  <small>{resource.description}</small>
                  <span className="rn-resource-link">
                    Explore resource ↗
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="rn-cta">
        <div className="rn-container rn-cta-inner">
          <div className="rn-cta-copy">
            <h2>Be part of positive change.</h2>
          </div>

          <div className="rn-cta-actions">
            <a className="rn-button rn-button-primary" href="/get-involved">
              Get Involved <span aria-hidden="true">→</span>
            </a>

            <a className="rn-cta-contact" href="/contact">
              Talk to our team <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="rn-footer">
        <div className="rn-container">
          <div className="rn-footer-main">
            <div className="rn-footer-about">
              <a className="rn-brand rn-footer-brand" href="/">
                <img
                  className="rn-logo-image"
                  src="/images/logo.jpg"
                  alt="Relief Nepal — बालबालिकालाई सुनौँ"
                />
              </a>

              <span className="rn-footer-nepali">
                बालबालिकालाई सुनौँ
              </span>
            </div>

            <div className="rn-footer-column">
              <h3>Get involved</h3>
              <a href="/get-involved">Support our work</a>
              <a href="/partners">Our partners</a>
              <a href="/transparency">Reports & transparency</a>
              <a href="/media">Media & resources</a>
              <a href="/contact">Contact us</a>
            </div>

            <div className="rn-footer-column rn-footer-contact">
              <h3>Contact us</h3>

              <span className="rn-footer-location">Head Office</span>
              <p>Kamalamai Municipality-6, Sindhuli, Nepal</p>
              <a href="tel:+977047520915">+977-047-520915</a>

              <span className="rn-footer-location">Secretariat Office</span>
              <p>Mahalaxmi Municipality-10, Lalitpur, Nepal</p>
              <a href="tel:+9779851001193">+977-9851001193</a>
              <a href="mailto:info@reliefnepal.org.np">info@reliefnepal.org.np </a>
              <a href="mailto:reliefns@gmail.com">
                reliefns@gmail.com
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="rn-footer-newsletter">
            <div>
              <h3>Stay connected.</h3>
              <p>Keep up with Relief Nepal's work and updates.</p>
            </div>

            <form
              className="rn-newsletter-form"
              onSubmit={handleSubscribe}
            >
              <label className="rn-visually-hidden" htmlFor="rn-email">
                Your email address
              </label>

              <input
                id="rn-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <button type="submit">
                Subscribe <span aria-hidden="true">→</span>
              </button>

              {notice && (
                <p className="rn-newsletter-notice" role="status">
                  {notice}
                </p>
              )}
            </form>
          </div>

          {/* Copyright */}
          <div className="rn-footer-bottom">
            <p>
              © {new Date().getFullYear()} Relief Nepal. All rights reserved.
            </p>
            <p>Community-led change for a more equitable society.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}