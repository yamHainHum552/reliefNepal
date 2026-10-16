"use client";

import { useMemo, useState } from "react";
import "./photo.css";

const photos = [
  {
    id: 1,
    title: "Community Development Activities",
    category: "Community",
    src: "/images/Picture7.jpg",
  },
  {
    id: 2,
    title: "Environmental Conservation",
    category: "Environment",
    src: "/images/plant.jpg",
  },
  {
    id: 3,
    title: "Community Support Programme",
    category: "Community",
    src: "/images/Trackshoot-support.jpg",
  },
  {
    id: 4,
    title: "Girls' Group Activities",
    category: "Education",
    src: "/images/girls.group.jpg",
  },
  {
    id: 5,
    title: "Handwashing Awareness",
    category: "Health",
    src: "/images/handwashing.jpg",
  },
  {
    id: 6,
    title: "Youth Health Awareness",
    category: "Health",
    src: "/images/health.youth.jpg",
  },
  {
    id: 7,
    title: "Community Water Initiative",
    category: "WASH",
    src: "/images/dhara.jpg",
  },
  {
    id: 8,
    title: "Community Participation",
    category: "Community",
    src: "/images/grp.holding.jpg",
  },
  {
    id: 9,
    title: "Child Protection Programme",
    category: "Child Protection",
    src: "/images/protection.child.jpg",
  },
  {
    id: 10,
    title: "Relief for Earthquake Victims",
    category: "Disaster & Climate",
    src: "/images/climate.1.jpg",
  },
  {
    id: 11,
    title: "Relief for Earthquake Victims",
    category: "Disaster & Climate",
    src: "/images/climate.2.jpg",
  },
  {
    id: 12,
    title: "Relief for Earthquake Victims",
    category: "Disaster & Climate",
    src: "/images/climate.3.jpg",
  },
  {
    id: 13,
    title: "Relief for Earthquake Victims",
    category: "Disaster & Climate",
    src: "/images/climate.4.jpg",
  },
  {
    id: 14,
    title: "Relief for Earthquake Victims",
    category: "Disaster & Climate",
    src: "/images/climate.5.jpg",
  },
  {
    id: 15,
    title: "Child Protection Programme",
    category: "Child Protection",
    src: "/images/protection.hope.jpg",
  },
  {
    id: 16,
    title: "Child Protection Programme",
    category: "Child Protection",
    src: "/images/protection.minor.jpg",
  },
  {
    id: 17,
    title: "WASH Activities",
    category: "WASH",
    src: "/images/wash.1.jpg",
  },
  {
    id: 18,
    title: "WASH Activities",
    category: "WASH",
    src: "/images/wash.2.jpg",
  },
  {
    id: 19,
    title: "WASH Activities",
    category: "WASH",
    src: "/images/wash.3.jpg",
  },
];

const videos = [
  {
    id: 1,
    title: "Child Labour Report",
    category: "Child Protection",
    description: "A video showcasing the child labour report.",
    location: "",
    src: "/images/Child labour report.MOV",
  },
  {
    id: 2,
    title: "CFLG Ward Declaration",
    category: "Child Protection",
    description: "Child Friendly Local Governance Ward Declaration.",
    location: "Fikkal Gaupalika, Sindhuli",
    src: "/images/fikkal gaupalika 5 (1).mp4",
  },
  {
    id: 3,
    title: "COVID-19 Relief Distribution",
    category: "Disaster",
    description: "Relief distribution activities during COVID-19.",
    location: "Dudhauli Municipality, Sindhuli",
    src: "/images/DSC_0512.MOV",
  },
  {
    id: 4,
    title: "COVID-19 Relief Distribution",
    category: "Disaster",
    description: "Relief distribution activities during COVID-19.",
    location: "Dudhauli Municipality, Sindhuli",
    src: "/images/DSC_0514.MOV",
  },
  {
    id: 5,
    title: "Agriculture and Economic Empowerment",
    category: "Livelihood",
    description:
      "The impact of agriculture and economic empowerment programmes.",
    location: "Tinpatan Gaupalika, Sindhuli",
    src: "/images/Group Coltivation Bahuntilpungmp4.mp4",
  },
  {
    id: 6,
    title: "Literacy Journey of Kaushalya Devi",
    category: "Education",
    description:
      "The literacy journey of Kaushalya Devi.",
    location: "Fikkal Gaupalika, Sindhuli",
    src: "/images/MLC Final Video.mp4",
  },
  {
    id: 7,
    title: "Skills for Transformation (S4T)",
    category: "Livelihood",
    description:
      "Discover how Skills for Transformation strengthens local skills and promotes sustainable livelihoods.",
    location: "Bahuntilpung, Sindhuli",
    src: "/images/S4T Video.mp4",
  },
  {
    id: 8,
    title: "Stories of Change: Sher Bahadur Sarki and Bhoj Bahadur",
    category: "Livelihood",
    description:
      "Stories highlighting community resilience, personal growth, and positive change.",
    location: "Golanjor Gaupalika, Ward No. 1",
    src: "/images/Share & Bhoj Bahadur.mp4",
  },
  {
    id: 9,
    title: "Restrooms for Girls and People with Disabilities",
    category: "Health",
    description:
      "Construction progress of girls' and disability-friendly restrooms.",
    location: "Tinpatan Gaupalika, Ward No. 8",
    src: "/images/Shree Banketeshwor SS work progress_Kishori Project.mp4",
  },
  {
    id: 10,
    title: "Relief for Earthquake-Affected Schools",
    category: "Disaster",
    description:
      "Essential relief supplies for schools affected by the earthquake.",
    location: "Tinkanya Gaupalika, Sindhuli",
    src: "/images/Sindhuli Tinkanya 5 School Student Support by NJSI, TDH & Relief Nepal (1).mp4",
  },
  {
    id: 11,
    title: "CFLG Ward Declaration",
    category: "Child Protection",
    description: "Child Friendly Local Governance Ward Declaration.",
    location: "Tinpatan Gaupalika, Sindhuli",
    src: "/images/Tinpatan gaupalika 11.mp4",
  },
];

const audios = [
  {
    id: 1,
    title: "Success Story: Pabitra Shrestha",
    category: "Audio Stories",
    description:
      "The story of a 15-year-old girl and her experience in a Children's Club.",
    src: "/images/success-store.mp3",
  },
];

const tabs = [
  { label: "All Media", value: "all", icon: "▦" },
  { label: "Photos", value: "photos", icon: "▧" },
  { label: "Videos", value: "videos", icon: "▷" },
  { label: "Audio", value: "audio", icon: "♫" },
];

export default function PhotoGallery() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [failedPhotos, setFailedPhotos] = useState([]);

  // Only include media entries with a source path.
  const availableVideos = useMemo(
    () => videos.filter((video) => video.src?.trim()),
    []
  );

  const availableAudios = useMemo(
    () => audios.filter((audio) => audio.src?.trim()),
    []
  );

  const allCategories = useMemo(
    () => [
      ...new Set([
        ...photos.map((item) => item.category),
        ...availableVideos.map((item) => item.category),
        ...availableAudios.map((item) => item.category),
      ]),
    ],
    [availableVideos, availableAudios]
  );

  const normalizedSearch = search.trim().toLowerCase();

  const filteredPhotos = useMemo(
    () =>
      photos.filter((item) => {
        const searchableText =
          `${item.title} ${item.category} ${item.location || ""}`.toLowerCase();

        return (
          searchableText.includes(normalizedSearch) &&
          (selectedCategory === "All Categories" ||
            item.category === selectedCategory) &&
          !failedPhotos.includes(item.id)
        );
      }),
    [normalizedSearch, selectedCategory, failedPhotos]
  );

  const filteredVideos = useMemo(
    () =>
      availableVideos.filter((item) => {
        const searchableText =
          `${item.title} ${item.category} ${item.description} ${item.location || ""}`.toLowerCase();

        return (
          searchableText.includes(normalizedSearch) &&
          (selectedCategory === "All Categories" ||
            item.category === selectedCategory)
        );
      }),
    [availableVideos, normalizedSearch, selectedCategory]
  );

  const filteredAudios = useMemo(
    () =>
      availableAudios.filter((item) => {
        const searchableText =
          `${item.title} ${item.category} ${item.description || ""}`.toLowerCase();

        return (
          searchableText.includes(normalizedSearch) &&
          (selectedCategory === "All Categories" ||
            item.category === selectedCategory)
        );
      }),
    [availableAudios, normalizedSearch, selectedCategory]
  );

  const showPhotos = activeTab === "all" || activeTab === "photos";
  const showVideos = activeTab === "all" || activeTab === "videos";
  const showAudios = activeTab === "all" || activeTab === "audio";

  const visibleCount =
    (showPhotos ? filteredPhotos.length : 0) +
    (showVideos ? filteredVideos.length : 0) +
    (showAudios ? filteredAudios.length : 0);

  function resetFilters() {
    setSearch("");
    setSelectedCategory("All Categories");
    setFailedPhotos([]);
  }

  return (
    <main className="rn-media-page">
      {/* HERO */}
      <section className="rn-media-hero">
        <div className="rn-media-hero-inner">
          <span className="rn-media-eyebrow">
            OUR STORIES • OUR IMPACT
          </span>

          <h1>Media &amp; Gallery</h1>

          <p>
            Explore the stories, people and activities behind our work.
            Discover photos, videos and audio from Relief Nepal's
            community initiatives and development programmes.
          </p>

          <a href="#media-gallery" className="rn-media-hero-button">
            Explore Our Gallery <span aria-hidden="true">↓</span>
          </a>

          <div className="rn-media-stats">
            <div>
              <strong>{filteredPhotos.length}</strong>
              <span>Photos</span>
            </div>
            <div>
              <strong>{availableVideos.length}</strong>
              <span>Videos</span>
            </div>
            <div>
              <strong>{availableAudios.length}</strong>
              <span>Audio Stories</span>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section
        className="rn-media-gallery rn-container"
        id="media-gallery"
      >
        <div className="rn-media-heading">
          <span className="rn-media-eyebrow">EXPLORE OUR MEDIA</span>
          <h2>Stories From the Field</h2>
          <p>
            Browse moments, experiences and updates from our work
            with communities across Nepal.
          </p>
        </div>

        {/* TABS */}
        <div className="rn-media-tabs" aria-label="Media type">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.value}
              className={
                activeTab === tab.value
                  ? "rn-media-tab active"
                  : "rn-media-tab"
              }
              onClick={() => setActiveTab(tab.value)}
              aria-pressed={activeTab === tab.value}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* SEARCH AND CATEGORY */}
        <div className="rn-media-filters">
          <label className="rn-media-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search photos, videos or audio..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search media"
            />
          </label>

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            aria-label="Filter media by category"
          >
            <option value="All Categories">All Categories</option>
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="rn-media-reset"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>

        <div className="rn-media-results">
          <span>
            Showing <strong>{visibleCount}</strong> media items
          </span>
          <span>Relief Nepal • Media Collection</span>
        </div>

        {/* PHOTOS */}
        {showPhotos && (
          <section className="rn-media-section">
            <div className="rn-media-section-heading">
              <div>
                <span className="rn-media-section-kicker">
                  VISUAL STORIES
                </span>
                <h3>Photo Gallery</h3>
              </div>
              <span className="rn-media-section-count">
                {filteredPhotos.length} photos
              </span>
            </div>

            {filteredPhotos.length > 0 ? (
              <div className="rn-photo-grid">
                {filteredPhotos.map((photo) => (
                  <article className="rn-photo-card" key={photo.id}>
                    <button
                      type="button"
                      className="rn-photo-image-button"
                      onClick={() => setSelectedPhoto(photo)}
                      aria-label={`View ${photo.title}`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.title}
                        loading="lazy"
                        onError={() =>
                          setFailedPhotos((current) =>
                            current.includes(photo.id)
                              ? current
                              : [...current, photo.id]
                          )
                        }
                      />
                      <span className="rn-photo-overlay">
                        <span aria-hidden="true">↗</span>
                        View Photo
                      </span>
                    </button>

                    <div className="rn-photo-info">
                      <span className="rn-media-category">
                        {photo.category}
                      </span>
                      <h4>{photo.title}</h4>
                      {photo.location && (
                        <p>
                          <span aria-hidden="true">⌖</span>{" "}
                          {photo.location}
                        </p>
                      )}
                      {photo.date && (
                        <span className="rn-photo-date">
                          {photo.date}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rn-media-no-items">
                No photos match your search or category, or the image
                files could not be found.
              </p>
            )}
          </section>
        )}

        {/* VIDEOS */}
        {showVideos && (
          <section className="rn-media-section">
            <div className="rn-media-section-heading">
              <div>
                <span className="rn-media-section-kicker">
                  WATCH OUR WORK
                </span>
                <h3>Video Gallery</h3>
              </div>
              <span className="rn-media-section-count">
                {filteredVideos.length} videos
              </span>
            </div>

            {filteredVideos.length > 0 ? (
              <div className="rn-video-grid">
                {filteredVideos.map((video) => (
                  <article className="rn-video-card" key={video.id}>
                    <div className="rn-video-player">
                     <video
                        controls
                        preload="metadata"
                        playsInline
                        controlsList="nodownload"
                      >
                        <source src={video.src} type="video/mp4" />
                        Your browser does not support video playback.
                      </video>
                    </div>

                    <div className="rn-video-info">
                      <span className="rn-media-category">
                        {video.category}
                      </span>
                      <h4>{video.title}</h4>
                      <p>{video.description}</p>
                      {video.location && (
                        <p className="rn-video-location">
                          <span aria-hidden="true">⌖</span>{" "}
                          {video.location}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rn-media-no-items">
                No videos match your search or category.
              </p>
            )}
          </section>
        )}

        {/* AUDIO */}
        {showAudios && (
          <section className="rn-media-section">
            <div className="rn-media-section-heading">
              <div>
                <span className="rn-media-section-kicker">
                  LISTEN &amp; LEARN
                </span>
                <h3>Audio Gallery</h3>
              </div>
              <span className="rn-media-section-count">
                {filteredAudios.length} audio files
              </span>
            </div>

            {filteredAudios.length > 0 ? (
              <div className="rn-audio-grid">
                {filteredAudios.map((audio) => (
                  <article className="rn-audio-card" key={audio.id}>
                    <div className="rn-audio-icon" aria-hidden="true">
                      ♫
                    </div>
                    <div className="rn-audio-info">
                      <span className="rn-media-category">
                        {audio.category}
                      </span>
                      <h4>{audio.title}</h4>
                      {audio.description && <p>{audio.description}</p>}
                      <audio controls preload="metadata">
                        <source src={audio.src} type="audio/mpeg" />
                        Your browser does not support audio playback.
                      </audio>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rn-media-no-items">
                No audio files match your search or category.
              </p>
            )}
          </section>
        )}

        {/* NO RESULTS */}
        {visibleCount === 0 && (
          <div className="rn-media-empty">
            <span aria-hidden="true">⌕</span>
            <h3>No media found</h3>
            <p>
              Try another search term or choose a different category.
            </p>
            <button type="button" onClick={resetFilters}>
              Show All Media
            </button>
          </div>
        )}
      </section>

      {/* CONTACT CTA */}
      <section className="rn-media-cta">
        <div className="rn-media-cta-inner">
          <div>
            <span className="rn-media-eyebrow">SHARE YOUR STORY</span>
            <h2>Be part of our community story.</h2>
            <p>
              Want to learn more about our programmes or collaborate
              with us? We would love to hear from you.
            </p>
          </div>
          <a href="/contact" className="rn-media-cta-button">
            Contact Us <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* PHOTO LIGHTBOX */}
      {selectedPhoto && (
        <div
          className="rn-photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            className="rn-photo-lightbox-close"
            aria-label="Close photo"
            onClick={() => setSelectedPhoto(null)}
          >
            ×
          </button>

          <div
            className="rn-photo-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
            />
            <h3>{selectedPhoto.title}</h3>
            {selectedPhoto.location && (
              <p>{selectedPhoto.location}</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}   