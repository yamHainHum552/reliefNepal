"use client";

import { useEffect, useState } from "react";
import styles from "./about.module.css";

const heroSlides = [
  "/images/handwashing.jpg",
  "/images/Picture7.png",
  "/images/dhara.jpg",
  "/images/Picture2.jpg",
  "/images/Trackshoot-support.jpg",
  "/images/computer-learning.jpg",
];

const principles = [
  {
    title: "Our Vision",
    text: "Developed Society based on social, economic, political and gender equity.",
  },
  {
    title: "Our Mission",
    text: "To enhance the livelihoods of children, youth, women and marginalized sections of society by empowering them to become self-reliant, participate meaningfully in decision-making, and enjoy their rights.",
  },
  {
    title: "Our Goal",
    text: "Vulnerable and marginalized people, especially children, youth and people living in marginalized conditions, are empowered to participate in decision-making about issues affecting their livelihoods.",
  },
  {
    title: "Our Objectives",
    text: "Relief Nepal works to empower marginalized communities and improve their quality of life through the following objectives.",
    objectives: [
      {
        number: "01",
        text: "To empower women and marginalized groups, ensure human rights, increase school enrolment among school-age children, reduce domestic violence, the dowry system and human slavery, and promote animal welfare through social mobilization and institutional building.",
      },
      {
        number: "02",
        text: "To improve safe drinking water supply, sanitation and hygiene behavior among target groups and reduce communicable and waterborne diseases.",
      },
      {
        number: "03",
        text: "To increase access to basic health services and nutritional education for deprived and marginalized communities, women and children under five, and reduce the incidence of STDs and HIV/AIDS in the community.",
      },
      {
        number: "04",
        text: "To improve livelihoods through integrated management of agriculture, biodiversity, ecosystem services and renewable energy.",
      },
      {
        number: "05",
        text: "To promote the livelihoods of marginalized people by promoting local products and strengthening their links with potential market systems.",
      },
      {
        number: "06",
        text: "To facilitate child rights protection and promotion programs as a resource organization at the local level.",
      },
      {
        number: "07",
        text: "To conduct non-formal education and literacy programs in partnership with government organizations (GOs) and international non-governmental organizations (INGOs), targeting illiterate children, youth and women from Dalit and disadvantaged groups, and linking these programs with income-generating activities and savings and credit programs.",
      },
      {
        number: "08",
        text: "To work against social abuses such as the dowry system, child marriage, child labor and human trafficking, especially trafficking of girls and women, to ensure their rights.",
      },
      {
        number: "09",
        text: "To support and promote small-scale modern farming, animal husbandry and income-generating activities for marginalized, low-income groups in association with relevant agriculture development offices and financial institutions.",
      },
      {
        number: "10",
        text: "To provide relief and support to disaster-affected populations, including those affected by climate change hazards, in association with humanitarian support organizations.",
      },
    ],
  },
];

const boardMembers = [
  {
    sn: 1,
    name: "Mr. Durga Paudel",
    qualification: "BA",
    expertise: "Child Rights, WASH",
    designation: "Chairperson",
    contact: "9851022634",
    email: "durga.paudel@reliefnepal.org.np",
    experience: "22",
  },
  {
    sn: 2,
    name: "Mr. Danda Gurung",
    qualification: "BA",
    expertise: "DRM and Climate Change",
    designation: "Vice-Chairperson",
    contact: "9851018648",
    email: "danda.gurung@reliefnepal.org.np",
    experience: "19",
  },
  {
    sn: 3,
    name: "Ms. Deepa Rajbhandari",
    qualification: "BBS/ MA",
    expertise: "Social Mobilization, Livelihood",
    designation: "Secretary",
    contact: "9844064824",
    email: "deepa.rajbhandari@reliefnepal.org.np",
    experience: "15",
  },
  {
    sn: 4,
    name: "Ms. Sushma Acharya",
    qualification: "BA/ANM",
    expertise: "Health and Nutrition",
    designation: "Treasurer",
    contact: "9817696643",
    email: "samjhana.bk@reliefnepal.org.np",
    experience: "7",
  },
  {
    sn: 5,
    name: "Samjhana BK",
    qualification: "IA",
    expertise: "Education",
    designation: "Joint-Secretary",
    contact: "9844042670",
    email: "sushma.acharya@reliefnepal.org.np",
    experience: "1",
  },
  {
    sn: 6,
    name: "Ms. Sabita Kumari Dhakal",
    qualification: "B. Ed.",
    expertise: "Education, Child Rights",
    designation: "Member",
    contact: "9840934858",
    email: "sabita.dhakal@reliefnepal.org.np",
    experience: "17",
  },
  {
    sn: 7,
    name: "Bashanta Neopaney",
    qualification: "MA",
    expertise: "Livelihoods, Governance",
    designation: "Member",
    contact: "9841148986",
    email: "basanta.neupane@reliefnepal.org.np",
    experience: "1",
  },
];

const organization = [
  {
    title: "Program Development and Management",
    items: [
      "Child Protection",
      "Education & Health",
      "WASH",
      "Income Generation and Livelihood",
      "DRR and CCA",
    ],
  },
  {
    title: "Administrative Department",
    items: [
      "Office Management",
      "Staff Management",
      "Document Management",
      "Public Service Management",
      "Infrastructure Management",
      "Meeting Management",
      "Other activities management",
    ],
  },
  {
    title: "Monitoring, Evaluation and Knowledge Management Department",
    items: [
      "Monitoring & Evaluation Unit",
      "Policy and Advocacy Unit",
      "Publication and Communication Unit",
      "Research Unit",
    ],
  },
  {
    title: "Finance and Human Resource Management Department",
    items: [
      "Admin & Procurement Unit",
      "Finance Unit",
      "HR Unit",
      "Office Management",
    ],
  },
];


function OrgNode({ children, variant = "blue" }) {
  return (
    <div className={`${styles.orgNode} ${styles[variant]}`}>
      {children}
    </div>
  );
}

export default function AboutPage() {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className={styles.page}>
      {/* HERO */}
      <header className={styles.hero}>
        <div className={styles.heroSlides} aria-hidden="true">
          {heroSlides.map((image, index) => (
            <img
              key={image}
              className={`${styles.heroSlide} ${
                index === activeHeroSlide ? styles.heroSlideActive : ""
              }`}
              src={image}
              alt=""
            />
          ))}
        </div>

        <div className={styles.container}>
        </div>
      </header>

      {/* VISION, MISSION, GOAL AND OBJECTIVES */}
      <section
        className={styles.principles}
        aria-labelledby="principles-title"
      >
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>What guides us</p>
            <h2 id="principles-title">
              Vision, Mission, Goal &amp; Objectives
            </h2>
          </div>

          <div className={styles.principleGrid}>
            {principles.map((item, index) => (
              <article
                className={`${styles.principleCard} ${
                  item.objectives ? styles.objectivesCard : ""
                }`}
                key={item.title}
              >
                <span className={styles.number}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3>{item.title}</h3>
                <p>{item.text}</p>

                {item.objectives && (
                  <ol className={styles.objectiveList}>
                    {item.objectives.map((objective) => (
                      <li key={objective.number}>
                        <span className={styles.objectiveNumber}>
                          {objective.number}
                        </span>
                        <p>{objective.text}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BOARD MEMBERS */}
      <section
        className={styles.boardSection}
        aria-labelledby="board-title"
      >
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <h2 id="board-title">
              Currently Involved Board Members
            </h2>
            <p>
              Our board members bring diverse experience and expertise,
              guiding Relief Nepal’s vision and ensuring effective governance
              and accountability.
            </p>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.boardTable}>
              <thead>
                <tr>
                  <th scope="col">SN</th>
                  <th scope="col">Name</th>
                  <th scope="col">Qualification</th>
                  <th scope="col">Sectoral Expertise</th>
                  <th scope="col">Designation</th>
                  <th scope="col">Contact</th>
                  <th scope="col">Email</th>
                  <th scope="col">Years of Experience</th>
                </tr>
              </thead>

              <tbody>
                {boardMembers.map((member) => (
                  <tr key={member.sn}>
                    <td>
                      <span className={styles.memberNumber}>
                        {member.sn}
                      </span>
                    </td>
                    <td className={styles.memberName}>{member.name}</td>
                    <td>{member.qualification}</td>
                    <td>{member.expertise}</td>
                    <td>{member.designation}</td>
                    <td>
                      <a href={`tel:${member.contact}`}>
                        {member.contact}
                      </a>
                    </td>
                    <td>
                      <a href={`mailto:${member.email}`}>
                        {member.email}
                      </a>
                    </td>
                    <td>{member.experience}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={styles.tableNote}>
            Contact information is displayed as provided in the board member
            records.
          </p>
        </div>
      </section>

      {/* ORGANIZATIONAL STRUCTURE */}
      <section className={styles.orgSection} aria-labelledby="org-title">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>How we work ?</p>
            <h2 id="org-title">Organizational Structure</h2>
            <p>
              Our organizational structure supports effective governance,
              coordination, transparent management, and implementation of
              programs at every level.
            </p>
          </div>

          <div className={styles.orgChart}>
            {/* LEVEL 1: GENERAL ASSEMBLY */}
            <div className={styles.orgTop}>
              <OrgNode variant="blue">General Assembly</OrgNode>
              <span className={styles.orgArrow} aria-hidden="true" />
            </div>

            {/* LEVEL 2: EXECUTIVE BOARD AND SUPPORTING BODIES */}
            <div className={styles.orgLeadership}>
              <div className={styles.supportAdvisory}>
                <OrgNode variant="lightBlue">
                  Advisory Committee
                </OrgNode>
              </div>

              <div className={styles.orgMainLevels}>
                <OrgNode variant="green">Executive Board</OrgNode>

                <span className={styles.orgArrow} aria-hidden="true" />

                <OrgNode variant="blue">Team Leader</OrgNode>
              </div>

              <div className={styles.supportHR}>
                <OrgNode variant="lightGreen">
                  Human Resource Department
                </OrgNode>
              </div>
            </div>

            {/* LEVEL 3: THREE MANAGEMENT BODIES */}
            <div className={styles.managementTree}>
              <span className={styles.branchStem} aria-hidden="true" />

              <div className={styles.managementRow}>
                <OrgNode variant="green">
                  Executive Director
                </OrgNode>

                <OrgNode variant="blue">
                  Admin &amp; Finance Manager
                </OrgNode>

                <OrgNode variant="green">
                  Internal Audit Committee
                </OrgNode>
              </div>
            </div>

            {/* LEVEL 4: FOUR DEPARTMENTS */}
            <div className={styles.departmentTree}>
              <span className={styles.departmentStem} aria-hidden="true" />

              <div className={styles.departmentGrid}>
                {organization.map((department, index) => (
                  <article
                    className={styles.department}
                    key={department.title}
                  >
                    <div
                      className={`${styles.departmentHeading} ${
                        index % 2 === 0
                          ? styles.departmentBlue
                          : styles.departmentGreen
                      }`}
                    >
                      {department.title}
                    </div>

                    <ul>
                      {department.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
     
      {/* FUTURE DIRECTION */}
      <section className={styles.direction}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>
              Our priorities for 2026–2030
            </p>
            <h2>The Future We Are Working Toward</h2>
            <p>
              Our plans are guided by the Sustainable Development Goals
              and shaped around the needs of children, families,
              communities, and the country.
            </p>
          </div>

          <figure className={styles.sdgFeature}>
            <figcaption>
              <span className={styles.featureLabel}>
                Our priority framework
              </span>
              <h3>Sustainable Development Goals</h3>
              <p>
                These goals guide our shared commitment to a fairer,
                healthier, and more resilient future.
              </p>
            </figcaption>

            <img
              src="/images/about-sdg-priorities.png"
              alt="Sustainable Development Goals prioritized by Relief Nepal."
              loading="lazy"
            />
          </figure>

          <figure className={styles.programFeature}>
            <figcaption>
              <span className={styles.featureLabel}>
                Thematic program areas
              </span>
              <h3>Our Plan for 2026–2030</h3>
            </figcaption>

            <img
              src="/images/about-program-areas-2026-2030.png"
              alt="Relief Nepal's thematic program areas for 2026–2030."
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      {/* OUR JOURNEY */}
      <section className={styles.journey}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Our story so far</p>
            <h2>A Journey Built With Communities</h2>
            <p>
              From our registration to the work we do today, every step
              has been made possible through community partnership.
            </p>
          </div>

          <figure className={styles.journeyImage}>
            <img
              src="/images/about-journey.png"
              alt="Timeline of Relief Nepal's journey from registration in 2065 to the present."
              loading="lazy"
            />
          </figure>
        </div>
      </section>
    </main>
  );
}