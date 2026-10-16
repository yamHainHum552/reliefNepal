"use client";

import { useMemo, useState } from "react";
import "./project.css";

const projectNames = [
  "Fund for Child Smile",
  "Emergency Response and Relief Fund",
  "Hatemalo for child wellbeing & Integrated Development Project",
  "ELEVATE: Equitable Learning Environment for Al",
  "Nepal Flood and Landslide Landslide Response Project-Sindhuli-CANO ",
  "Nepal flood and Landslide Response Project (WVJPN)",
  "Nepal Flood and Landslide Response Project (Start Fund)-Sindhuli",
  "Nepal Flood and Landslide Response & Recovery Project",
  "Nepal Flood and Landslide Response 2024 Project (NEPRF)",
  "Creating Hope for women children and families",
  "Humanitarian Response Partnership in Bagmati Province",
  "Jagarcoat Earthquake Response project",
  "Humanitarian Response Program",
  "Sustainable Community Development Program in Nepal",
  "Humanitarian Response Program",
  "Covid-19 Recovery Project (TPCRP)",
  "Child Engagement & Sponsorship Project",
  "KISHORI Sindhuli",
  "Restoring the degraded watershed and livelihoods of Lakhandei river basin through Sustainable Land Management",
  "Migrant Resource Center and Associate Activities under the Safer Migration Project (SaMi)",
  "COVID-19",
  "Response Program",
  "WASH- SDG Gender Transformative and nutrition sensitive Project",
  "Agriculture and Economic Development Project (Local Value Chain Development)",
  "Promoting Essential Health and Sanitation Facilities for Rural People Phase-II",
  "Humanitarian Assistance to the Flood Affected People of Sarlahi District ",
  "Humanitarian Assistance to the Flood Affected People of Sarlahi District",
  "Emergency volunteer support-EU PEACH project",
  "Humanitarian Assistance to the Tornado Affected People of Bara",
  "Gender Sensitive Child Protection Projec",
  "School DRR and WASH support project in Sindhuli",
  "Humanitarian Assistance to the Flood Affected People of Rautahat and Sarlahi District",
  "Nepal Earthquake Recovery Projector WASH Sector",
  "Safer School Reconstruction and Renovation Project (2016/17)",
  "Recovery and Restoration of living conditions in earthquake affected districts of Nepal Phase II_2016/2017",
  "Safe Demolition and Debris Management project (2016/17)",
  "HOPE (Reducing the child labour in Municipality area of Sindhuli district)",
  "Fire and earthquake disaster affected community shelter and school construction",
  "Fire Disaster Affected Community",
  "Semi-permanent school construction and renovation",
  "Shelter and school renovation to the victims of earthquake in Nepal",
  "Immediate Relief to the victims of earthquake in Nepal",
  "Child Protection in Emergency",
  "Child Protection in Emergency in Sindhuli",
  "Recovery and restoration of living conditions in earthquakeaffected district of Nepal",
  "Relief for earthquake affected household in the district of Sindhuli",
  "Promoting Essential Health and Sanitation Facilities for Rural People-I",
  "Social and economic empowerment of rural women",
  "Safer Drinking Water supply project",
  "Deep Boring Water Supply Project",
  "Climate Change Environment Protection and Development",
  "Program for marginalized and Minority Youth",
  "PLWHA/Youth Relief and Rehabilitation Program",
  "Sports Goods Distribution",
  "Boutique Training",
  "Agriculture for Youth Program",
  "Reproductive Health Program",
];

const fundingAgencies = [
  "Relief Nepal (Core Fund)",
  "Relief Nepal (Core Fund)",
  "World Vision International Nepal",
  "Child Aid Network",
  "World Vision",
  "International Nepal",
  "World Vision International Nepal",
  "World Vision International Nepal",
  "Caritas Nepal",
  "World Vision International Nepal",
  "NATAN Worldwide Disaster Relief",
  "Finn Church Aid",
  "All hands & Hearts",
  "All hands & Hearts",
  "All hands & Hearts",
  "All hands & Hearts",
  "World Vision International Nepal(WVIN)",
  "World Vision International Nepal(WVIN)", 
  "World Vision International Nepal(WVIN)", 
  "International Union of Conservation Nature (IUCN)",
  "Respective Local Government",
  "Plan International Nepal",
  "Terre des Hommes (Germany), All hands and Hearts, Caritas Nepal, WVIN",
  "Plan International Nepal",
  "World Vision International Nepal(WVIN)",
  "Terre des Hommes, Germany Nepal Office",
  "Terre des Hommes, Germany Nepal Office",
  "Caritas Nepal",
  "Caritas Nepal / EU",
  "Caritas Nepal",
  "Plan International Nepal",
  "Concern World Wide",
  "Terre des Hommes, Germany Nepal Office",
  "Concern World Wide",
  "Plan International Nepal",
  "Nepal Jesuit Society Institute",
  "Caritas Nepal",
  "Nepal Jesuit Society Institute",
  "Nepal Jesuit Society Institute",
  "Terre des Hommes, Germany Nepal Office",
  "Plan International Nepal",
  "World Vision International Nepal(WVIN)",
  "Terre des Hommes, Germany Nepal Office",
  "Caritas Nepal",
  "Terre des Hommes, Germany Nepal Office",
  "Caritas Nepal",
  "Caritas Nepal",
  "Hatpate VDC",
  "Ministry of Youth and Sports/ Government of Nepal",
  "Ministry of Youth and Sports/ Government of Nepal",
  "Ministry of Youth and Sports/ Government of Nepal",
  "District Youth and Sports Committe",
  "Commercial and Skill development training Center",
  "District Sports Development Committee",
  "Women Development Office",
];

const themes = [
  "Support for most vulnerable Children",
  "Support for most vulnerable disaster affected community people",
  "Heath, Education, Protection, Child Right",
  "Education (ECD Management, Rupantran Class, Open Learning Environment & Tuition Class)",
  "Cash for work to rebuild community structure, wash facility improvement in Flood affected School and Heath Post, Livestock support to Flood affected families",
  "Emergency Relief Support to Flood affected households",
  "Emergency Relief Support to Flood affected households",
  "HD pipe and Motor Support for damaged water supply scheme",
  "Emergency Relief Support to Flood affected households and Drinking Water Restoration",
  "Health and Protection",
  "Humanitarian Response",
  "Humanitarian Response (NFI Kit Support & Temporary Learning Center",
  "Humanitarian Response",
  "Safer School Reconstruction, Livelihood, DRM, Health, Protection and WASH",
  "Humanitarian Response",
  "Economic/ Capacity Development",
  "Child protected and empowered",
  "menstrual hygiene management (MHM) through improved WASH",
  "DRM/CCA (Watershed Management",
  "Economic Development and Livelihood Promotion",
  "Health, Food Security, WASH, Nutrition and Livelihood Promotion",
  "Gender Transformative WASH and Nutrition",
  "Agroforestry, Economic Development, Livelihood and Nutrition Promotion",
  "WASH, Education, Youth empowerment, Reproductive health Agroforestry, Ecological rights",
  "Food Security, DRM, WASH",
  "Food Security, DRM, WASH",
  "DRM",
  "Emergency Relief-Food and Non-Food Item",
  "Child Protection",
  "Education, DRM, WASH",
  "Food Security, DRM, WASH",
  "WASH",
  "Education, DRM",
  "Agroforestry, WASH, Reproductive health Education, Soil Conservation",
  "DRM,Economic Development",
  "Child Protection, Livelihood, Capacity Building",
  "Education, DRM",
  "DRM",
  "School construction, DRM",
  "DRM, Education, SchoOL Construction",
  "Food Security, DRM, WASH, Education, Psychosocial support",
  "Child Protection, DRM",
  "Child Protection, DRM",
  "WASH, Education, Shelter, Livelihood, Youth empowerment Ecological right, Governance, Reproductive Health ",
  "Food Security, DRM",
  "WASH, Education, Health, Protection, Youth empowerment",
  "Organic Farming, Agroforestry, Women Empowerment, Saving/Credit, Livelihood",
  "WASH",
  "WASH",
  "CCA, Environment Conservation",
  "Social Mobilization",
  "Health",
  "Youth Empowerment",
  "Economic Development",
  "Livelihood, Youth empowerment",
  "Women Empowerment , Health",
  
];

const locations = [
  "M/RMs of Sindhuli District",
  "M/RMs of Sindhuli District",
  "Phikkal, Golanjor & Tinpatan RM",
  "Dudhauli Municipality",
  "Phikkal-02,03,04,05 Golanjor RM- 01,02,03,04,06",
  "Phikkal, Golanjor RMs of Sindhuli District",
  "Golanjor-03,06,07 Sunkoshi-01, 03,05 Hariharpurgadi",
  "Phikkal rural Municipality ",
  "Golanjor RM-03,04, 05, 06, 07 Sunkoshi RM-01, 02, 03,04,05, 06 Phikkal RM- 02,03,04,05,06",
  "Dudhauli and Hariharpurgadhi R/M",
  "Bagmati Province",
  "Very & Nalgoad Rural Municipality Jagarcoat",
  "Tinpatan Rural Municipalities",
  "Sindhuli, Sindhupalchok, Nuwakot and Makwanpur",
  "Nepal",
  "Phikkal and Tinpatan RM",
  "Tinpatan, Phikkal & Golanjor RM",
  "Tinpatan, Phikkal & Golanjor RM",
  "Sindhuli-2 R/M and Sarlahi-8 R/M",
  "Kamalamai & Duhdauli Municipality, Tinpatan and Hariharpurgadhi RM",
  "Kamalamai & Duhdauli Municipality, Tinpatan, Golanjor, Phikkal, Marin, Sunkoshi and Hariharpurgadhi RM",
  "Kamalamai, Dudhauli, Marin, Tinpatan and Sunkoshi RM",
  "Tinpatan, Phikkal & Golanjor RM",
  "Kamalamai and Dudhauli Municipality",
  "Sarlahi (Dhanakaul RM, Barahatwa and Hariwaun Municapility)",
  "Sarlahi (Kaudana Rural Municapility)",
  "Sindhuli",
  "Bara",
  "Dudhauli municipality, Marin, Tinpatan, Sunkoshi & Golanjor RM",
  "Golanjor & Ghanlekh RM",
  "Sarlahi & Rautahat",
  "Hariharpur Gadhi & Golanjor RM",
  "Bitijor, Bastipur & Amale (Golanjor and Ghanlekh RM",
  "Golanjor RM",
  "Golanjor and Ghyanglekh RM",
  "Kamalamai Municipality",
  "Bhuwanesori & Tinkanya (Golanjor RM)",
  "Bhuwaneshwari",
  "Tinkanya (Golanjor RM)",
  "Tinkanya (Golanjor RM)",
  "Dhungkharcha (Kavrepalanchowk) & Sankharapur (kathmandu)",
  "Kamalamai Municipality",
  "Pokhari, Khangsang, Solphatana & Toshramkhola (Fikkal and Tinpatan RM)",
  "Sindhuli (Tinkanya & Ratanchura) & Kavrepalanchowk-Rayale",
  "Amale, Bastipur, Santishowri, Hatpate, Baseshowor Netrakali,Tamajor, Pipalmadhi, Mahendra Jhadi, & Hariharpur Gadhi (VDCs)",
  "Ranibash, Nipane & Hatpate (Kamalamai and Dudhauli Municipality)",
  "Baseswor (Golanjor RM)",
  "Hatpate (Dudhauli Municipality)",
  "Hatpate (Dudhauli Municipality)",
  "Nipane (Dudhauli Municipality)",
  "Nipane & Hatpate (Dudhauli Municipality)",
  "Hatpane (Dudhauli Municipality",
  "Hatpane (Dudhauli Municipality",
  "Hatpane (Dudhauli Municipality",
  "Nipane (Dudhauli Municipality)",
  "Nipane (Dudhauli Municipality)",
  
];

const durations = [
  "From 2018 regularly",
  "From 2018 regularly",
  "1stOctober 2025 to 30th march 2026",
  "April, 2024 – March, 2025",
  "1st December 2024 to 31st March 2025 ",
  "From 2024 Nov- Jan, 2025",
  "4th October 2024 to 15th November 2024",
  "2024-September to May 2025",
  "2nd October 2024 to 15 November 2024",
  "March 2021- Feb 2024",
  "April 2023-Dec 2027 December",
  "October 2024 to December 2024",
  "May-23 to Apr-24",
  "Jul-2018 to December 2016",
  "May 2023 - April 2024",
  "Feb 2022- September 2022",
  "Oct 2021 - September 2025",
  "Oct 2020 - Sep 2022",
  "June 2020 - July 2021",
  "June 2020 - July 2022",
  "Feb 2020 - Oct 2020",
  "April 2018 - Dec 2022",
  "Oct 2018 - Sept 2020",
  "Oct 2015 - Dec 2021",
  "July 2019 – September 2019",
  "July 2019 – September 2019",
  "Jan 2017 - Dec 2019",
  "2019 April one month",
  "Dec 2017-June 2019",
  "Jan 2018-May 2018",
  "August 2017-september 2017",
  "June 2016-June 2019",
  "Oct 2016-March 2018",
  "June 2016-June 2017",
  "Sept 2016 - March 2017",
  "May 2013- Dec 2016",
  "July 2016-Dec 2016",
  "April 2016-July 2016",
  "May 2016 -August 2016",
  "Dec 2015- Feb 2016",
  "May 2015 -July 2015",
  "May 2015- July 2015",
  "Oct 2015- Dec 2016",
  "June 2015- May 2016",
  "June 2015 -Dec 2015",
  "Feb 2013- Sept 2016",
  "May 2013- April 2014",
  "May 2013 - Aopril 2014",
  "March 2012- July 2012",
  "April 2011- July 2012",
  "May 2011- July 2011",
  "Jun 2011- July 2011",
  "Jan 2011- March 2011",
  "Feb 2010- July 2010",
  "June 2009- JUly 2009",
];

const budgets = [
  265000, 46000, 14448815, 19816968, 5788110, 2759750, 2986971.5, 
  2561100, 1915000, 9000000, "Stand by Partner", 4000000, 1300000, 
  260000000, 1300000, 7332100, 153302768, 5539726, 4875000, 42300000, 
  8600000, 7800000, 37848483, 24413064, 3774000, 998000,"Need Based", 
  150000, 10256000, 4765000, 2465000, 83531000, 19800000, 22700000, 
  2442000, 8231000, 2540000, 1550000, 1676000, 2252000, 2120000, 562000, 
  7600000, 8206000, 180000, 2980000, 1750000, 1174000, 264000, 205000,
  257000, 310000, 10000, 60000, 89860, 25000,
];

const projectData = projectNames.map((name, index) => ({
  id: index + 1,
  name,
  fundingAgency: fundingAgencies[index % fundingAgencies.length],
  theme: themes[index % themes.length],
  location: locations[index % locations.length],
  duration: durations[index % durations.length],
  budget: budgets[index % budgets.length] * (1 + Math.floor(index / 12)),
  contact: `Client Reference ${String(index + 1).padStart(3, "0")}`,
}));

const formatBudget = (amount) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function Projects() {
  const [search, setSearch] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("All Themes");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [currentPage, setCurrentPage] = useState(1);

  const projectsPerPage = 8;

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projectData.filter((project) => {
      const matchesSearch = [
        project.name,
        project.fundingAgency,
        project.theme,
        project.location,
        project.duration,
        project.contact,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesTheme =
        selectedTheme === "All Themes" ||
        project.theme === selectedTheme;

      const matchesLocation =
        selectedLocation === "All Locations" ||
        project.location === selectedLocation;

      return matchesSearch && matchesTheme && matchesLocation;
    });
  }, [search, selectedTheme, selectedLocation]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / projectsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const visibleProjects = filteredProjects.slice(
    (safePage - 1) * projectsPerPage,
    safePage * projectsPerPage
  );

  function resetFilters() {
    setSearch("");
    setSelectedTheme("All Themes");
    setSelectedLocation("All Locations");
    setCurrentPage(1);
  }

  return (
    <main className="rn-project-page">
      <section className="rn-project-hero">
        <div className="rn-project-hero-inner">
          <span className="rn-project-eyebrow">
            OUR WORK • OUR IMPACT
          </span>

          <h1>Projects That Create Lasting Change</h1>

          <p>
            Explore development initiatives supporting healthier,
            safer, more inclusive and resilient communities across Nepal.
          </p>

          <a href="#project-directory" className="rn-project-hero-button">
            Explore Our Projects <span aria-hidden="true">↓</span>
          </a>

          <div className="rn-project-hero-stats">
            <div>
              <strong>56</strong>
              <span>Sample Projects</span>
            </div>
            <div>
              <strong>8</strong>
              <span>Development Themes</span>
            </div>
            <div>
              <strong>14</strong>
              <span>Sample Locations</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="rn-project-directory rn-container"
        id="project-directory"
      >
        <div className="rn-project-section-heading">
          <span className="rn-project-eyebrow">PROJECT DIRECTORY</span>
          <h2>Explore Our Projects</h2>
          <p>
            Find project information by name, funding agency, theme or location.
          </p>
        </div>

        <div className="rn-project-filters">
          <label className="rn-project-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search projects, agencies, themes..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Search projects"
            />
          </label>

          <select
            value={selectedTheme}
            onChange={(event) => {
              setSelectedTheme(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by project theme"
          >
            <option>All Themes</option>
            {themes.map((theme) => (
              <option key={theme}>{theme}</option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(event) => {
              setSelectedLocation(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by location"
          >
            <option>All Locations</option>
            {locations.map((location) => (
              <option key={location}>{location}</option>
            ))}
          </select>

          <button
            type="button"
            className="rn-project-reset"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>

        <div className="rn-project-results-bar">
          <p>
            Showing <strong>{filteredProjects.length === 0 ? 0 : (safePage - 1) * projectsPerPage + 1}–{Math.min(safePage * projectsPerPage, filteredProjects.length)}</strong> of{" "}
            <strong>{filteredProjects.length}</strong> projects
          </p>
          <span>Development • Partnership • Impact</span>
        </div>

        {visibleProjects.length > 0 ? (
          <div className="rn-project-grid">
            {visibleProjects.map((project) => (
              <article className="rn-project-card" key={project.id}>
                <div className="rn-project-card-top">
                  <span className="rn-project-number">
                    PROJECT {String(project.id).padStart(2, "0")}
                  </span>
                  <span className="rn-project-theme">
                    {project.theme}
                  </span>
                </div>

                <h3>{project.name}</h3>

                <div className="rn-project-details">
                  <div className="rn-project-detail">
                    <span className="rn-project-detail-icon" aria-hidden="true">◈</span>
                    <div>
                      <span className="rn-project-label">
                        Funding Agency / Client
                      </span>
                      <strong>{project.fundingAgency}</strong>
                    </div>
                  </div>

                  <div className="rn-project-detail">
                    <span className="rn-project-detail-icon" aria-hidden="true">⌖</span>
                    <div>
                      <span className="rn-project-label">Project Location</span>
                      <strong>{project.location}, Nepal</strong>
                    </div>
                  </div>

                  <div className="rn-project-detail">
                    <span className="rn-project-detail-icon" aria-hidden="true">◷</span>
                    <div>
                      <span className="rn-project-label">Duration of Project</span>
                      <strong>{project.duration}</strong>
                    </div>
                  </div>

                  <div className="rn-project-detail">
                    <span className="rn-project-detail-icon" aria-hidden="true">↗</span>
                    <div>
                      <span className="rn-project-label">Total Budget</span>
                      <strong>{formatBudget(project.budget)}</strong>
                    </div>
                  </div>

                  <div className="rn-project-detail rn-project-contact">
                    <span className="rn-project-detail-icon" aria-hidden="true">◎</span>
                    <div>
                      <span className="rn-project-label">
                        Contact Reference of Client
                      </span>
                      <strong>{project.contact}</strong>
                    </div>
                  </div>
                </div>

                <div className="rn-project-card-footer">
                  <span>Relief Nepal • Project Portfolio</span>
                  <span aria-hidden="true">↗</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rn-project-empty">
            <span aria-hidden="true">⌕</span>
            <h3>No projects found</h3>
            <p>Try a different keyword or change your filters.</p>
            <button type="button" onClick={resetFilters}>
              Show All Projects
            </button>
          </div>
        )}

        {filteredProjects.length > projectsPerPage && (
          <nav className="rn-project-pagination" aria-label="Project pages">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  type="button"
                  key={page}
                  className={safePage === page ? "active" : ""}
                  aria-current={safePage === page ? "page" : undefined}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
            >
              Next →
            </button>
          </nav>
        )}
      </section>

      <section className="rn-project-cta">
        <div className="rn-project-cta-inner">
          <div>
            <span className="rn-project-eyebrow">LET'S WORK TOGETHER</span>
            <h2>Interested in partnering with us?</h2>
            <p>
              Connect with Relief Nepal to discuss development priorities
              and opportunities for collaboration.
            </p>
          </div>
          <a href="/contact" className="rn-project-cta-button">
            Contact Us <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}