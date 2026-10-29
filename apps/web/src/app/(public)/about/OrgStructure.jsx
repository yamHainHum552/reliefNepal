'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './orgstructure.module.css';

/* ------------------------------------------------------------------ */
/* DATA — edit nodes / edges / steps here to change the chart          */
/* ------------------------------------------------------------------ */

const NODES = {
  ga: { label: 'General Assembly', note: 'Sets the mandate', tone: 'blue' },
  advisory: {
    label: 'Advisory Committee',
    note: 'Guides with expertise',
    tone: 'lightBlue',
  },
  eb: { label: 'Executive Board', note: 'Governs and oversees', tone: 'green' },
  hr: {
    label: 'Human Resource Department',
    note: 'People and policy',
    tone: 'lightGreen',
  },
  tl: { label: 'Team Leader', note: 'Leads day-to-day work', tone: 'blue' },
  ed: { label: 'Executive Director', note: 'Runs programs', tone: 'green' },
  afm: {
    label: 'Admin & Finance Manager',
    note: 'Runs operations',
    tone: 'blue',
  },
  iac: {
    label: 'Internal Audit Committee',
    note: 'Checks accountability',
    tone: 'green',
  },
};

// type "reports" = solid line (top → bottom). type "works" = dashed line (side by side).
const EDGES = [
  { id: 'ga-eb', from: 'ga', to: 'eb', type: 'reports' },
  { id: 'eb-tl', from: 'eb', to: 'tl', type: 'reports' },
  { id: 'tl-ed', from: 'tl', to: 'ed', type: 'reports' },
  { id: 'tl-afm', from: 'tl', to: 'afm', type: 'reports' },
  { id: 'tl-iac', from: 'tl', to: 'iac', type: 'reports' },
  { id: 'advisory-eb', from: 'advisory', to: 'eb', type: 'works' },
  { id: 'eb-hr', from: 'eb', to: 'hr', type: 'works' },
  // departments are added from the `organization` prop (dept-0, dept-1, ...)
];

// Which department each manager leads (index into the `organization` prop)
const DEPT_PARENTS = [
  { dept: 0, parent: 'ed' }, // Program Development and Management
  { dept: 1, parent: 'afm' }, // Administrative Department
  { dept: 2, parent: 'ed' }, // Monitoring, Evaluation and Knowledge Mgmt
  { dept: 3, parent: 'afm' }, // Finance and HR Management
];

// Display order of the department cards (keeps connecting lines from crossing)
const DEPT_ORDER = [0, 2, 1, 3];

const STEPS = [
  {
    id: 'governance',
    label: 'Governance',
    title: 'The Assembly sets the direction',
    copy: 'The General Assembly gives the mandate. The Advisory Committee works alongside the Executive Board with guidance and expertise.',
    nodes: ['ga', 'eb', 'advisory'],
    edges: ['ga-eb', 'advisory-eb'],
  },
  {
    id: 'leadership',
    label: 'Leadership',
    title: 'The Board appoints leadership',
    copy: 'The Executive Board oversees the Team Leader and works with the Human Resource Department on people and policy.',
    nodes: ['eb', 'tl', 'hr'],
    edges: ['eb-tl', 'eb-hr'],
  },
  {
    id: 'management',
    label: 'Management',
    title: 'Management turns plans into action',
    copy: 'The Team Leader coordinates the Executive Director and the Admin & Finance Manager, with the Internal Audit Committee keeping work transparent.',
    nodes: ['tl', 'ed', 'afm', 'iac'],
    edges: ['tl-ed', 'tl-afm', 'tl-iac'],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    title: 'Departments deliver in communities',
    copy: 'Four departments carry out programs, support operations, learn from results and manage finances and people.',
    nodes: ['ed', 'afm', 'dept-0', 'dept-1', 'dept-2', 'dept-3'],
    edges: ['dept-0', 'dept-1', 'dept-2', 'dept-3'].map((d) => `edge-${d}`),
  },
];

const PINNED_SCROLL_QUERY = '(min-width: 1200px) and (min-height: 780px)';

/* ------------------------------------------------------------------ */

export default function OrgStructure({ organization = [] }) {
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const sceneRef = useRef(null);
  const nodeRefs = useRef({});
  const [paths, setPaths] = useState({});
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [step, setStep] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  const setNodeRef = useCallback(
    (id) => (el) => {
      if (el) nodeRefs.current[id] = el;
    },
    [],
  );

  // all edges, including department edges built from props
  const edges = [
    ...EDGES,
    ...DEPT_PARENTS.filter((d) => organization[d.dept]).map((d) => ({
      id: `edge-dept-${d.dept}`,
      from: d.parent,
      to: `dept-${d.dept}`,
      type: 'reports',
    })),
  ];

  /* ---------- measure nodes and build connector paths ---------- */
  const measure = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const box = scene.getBoundingClientRect();
    const rect = (id) => {
      const el = nodeRefs.current[id];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        left: r.left - box.left,
        right: r.right - box.left,
        top: r.top - box.top,
        bottom: r.bottom - box.top,
        cx: r.left - box.left + r.width / 2,
        cy: r.top - box.top + r.height / 2,
      };
    };

    const next = {};
    edges.forEach((e) => {
      const a = rect(e.from);
      const b = rect(e.to);
      if (!a || !b) return;
      if (e.type === 'works') {
        const [l, r] = a.cx < b.cx ? [a, b] : [b, a];
        next[e.id] = `M${l.right} ${l.cy}H${r.left}`;
      } else {
        // children of the same parent share one horizontal "bus" line
        const mid = a.bottom + (b.top - a.bottom) / 2;
        next[e.id] = `M${a.cx} ${a.bottom}V${mid}H${b.cx}V${b.top}`;
      }
    });
    setPaths(next);
    setSize({ w: box.width, h: box.height });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  useEffect(() => {
    measure();
    const scene = sceneRef.current;
    if (!scene) return;
    const ro = new ResizeObserver(measure);
    ro.observe(scene);
    window.addEventListener('resize', measure);
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  /* ---------- reveal when scrolled into view ---------- */
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ---------- map page scroll to the organization story ---------- */
  useEffect(() => {
    const track = trackRef.current;
    const wrap = wrapRef.current;
    if (!track || !wrap) return;

    let frame = 0;
    const updateFromScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const trackTop = track.getBoundingClientRect().top + window.scrollY;
        const pinned = window.matchMedia(PINNED_SCROLL_QUERY).matches;
        const scrollDistance = Math.max(
          0,
          track.offsetHeight -
            (pinned ? wrap.offsetHeight : window.innerHeight),
        );
        const progress = scrollDistance
          ? Math.min(
              1,
              Math.max(0, (window.scrollY - trackTop) / scrollDistance),
            )
          : 0;
        const nextStep = Math.min(
          Math.floor(progress * STEPS.length),
          STEPS.length - 1,
        );

        setStep((current) => (current === nextStep ? current : nextStep));
        wrap.style.setProperty(
          '--scroll-progress',
          String(Math.min(1, Math.max(0, progress * STEPS.length - nextStep))),
        );
      });
    };

    updateFromScroll();
    window.addEventListener('scroll', updateFromScroll, { passive: true });
    window.addEventListener('resize', updateFromScroll);
    const resizeObserver = new ResizeObserver(updateFromScroll);
    resizeObserver.observe(track);
    resizeObserver.observe(wrap);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateFromScroll);
      window.removeEventListener('resize', updateFromScroll);
      resizeObserver.disconnect();
    };
  }, []);

  const selectStep = useCallback(
    (index) => {
      const track = trackRef.current;
      const wrap = wrapRef.current;
      const pinned = window.matchMedia(PINNED_SCROLL_QUERY).matches;
      const scrollDistance =
        track && wrap
          ? Math.max(
              0,
              track.offsetHeight -
                (pinned ? wrap.offsetHeight : window.innerHeight),
            )
          : 0;

      if (!track || scrollDistance === 0) {
        setStep(index);
        return;
      }

      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      const progress = (index + 0.08) / STEPS.length;
      window.scrollTo({
        top: trackTop + scrollDistance * progress,
        behavior: reduced ? 'auto' : 'smooth',
      });
    },
    [reduced],
  );

  const active = STEPS[step];
  const isNodeLit = (id) => active.nodes.includes(id);
  const isEdgeLit = (id) => active.edges.includes(id);

  const orderedDepts = DEPT_ORDER.filter((i) => organization[i]);

  return (
    <div className={styles.scrollTrack} ref={trackRef}>
      <div
        ref={wrapRef}
        className={`${styles.wrap} ${inView ? styles.inView : ''}`}
      >
        {/* ---------- Legend ---------- */}
        <div className={styles.legend}>
          <span>
            <i className={styles.legendSolid} /> Reports to
          </span>
          <span>
            <i className={styles.legendDashed} /> Works with
          </span>
        </div>

        {/* ---------- Chart ---------- */}
        <div className={styles.scene} ref={sceneRef}>
          <svg
            className={styles.lines}
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
            aria-hidden="true"
          >
            {edges.map((e, i) => {
              const d = paths[e.id];
              if (!d) return null;
              const lit = isEdgeLit(e.id);
              return (
                <g key={e.id} style={{ '--i': i }}>
                  {/* base line */}
                  <path
                    d={d}
                    pathLength="100"
                    className={`${styles.line} ${e.type === 'works' ? styles.dashed : ''} ${
                      lit ? styles.lineLit : ''
                    }`}
                  />
                  {/* flowing signal + travelling dot on active lines */}
                  {lit && !reduced && (
                    <g key={`${e.id}-${step}`}>
                      <path d={d} pathLength="100" className={styles.signal} />
                      <circle r="4" className={styles.dot}>
                        <animateMotion
                          dur="2.2s"
                          repeatCount="indefinite"
                          path={d}
                          keyPoints={e.type === 'works' ? '0;1;0' : '0;1'}
                          keyTimes={e.type === 'works' ? '0;0.5;1' : '0;1'}
                          calcMode="linear"
                        />
                      </circle>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Row 1 */}
          <div className={`${styles.row} ${styles.rowCenter}`}>
            <Node
              id="ga"
              lit={isNodeLit('ga')}
              index={0}
              setRef={setNodeRef('ga')}
            />
          </div>

          {/* Row 2 */}
          <div className={`${styles.row} ${styles.rowThree}`}>
            <Node
              id="advisory"
              lit={isNodeLit('advisory')}
              index={1}
              setRef={setNodeRef('advisory')}
            />
            <Node
              id="eb"
              lit={isNodeLit('eb')}
              index={1}
              setRef={setNodeRef('eb')}
            />
            <Node
              id="hr"
              lit={isNodeLit('hr')}
              index={1}
              setRef={setNodeRef('hr')}
            />
          </div>

          {/* Row 3 */}
          <div className={`${styles.row} ${styles.rowCenter}`}>
            <Node
              id="tl"
              lit={isNodeLit('tl')}
              index={2}
              setRef={setNodeRef('tl')}
            />
          </div>

          {/* Row 4 */}
          <div className={`${styles.row} ${styles.rowThree}`}>
            <Node
              id="ed"
              lit={isNodeLit('ed')}
              index={3}
              setRef={setNodeRef('ed')}
            />
            <Node
              id="afm"
              lit={isNodeLit('afm')}
              index={3}
              setRef={setNodeRef('afm')}
            />
            <Node
              id="iac"
              lit={isNodeLit('iac')}
              index={3}
              setRef={setNodeRef('iac')}
            />
          </div>

          {/* Row 5 — departments */}
          <div className={styles.deptGrid}>
            {orderedDepts.map((deptIndex, pos) => {
              const dept = organization[deptIndex];
              const id = `dept-${deptIndex}`;
              const lit = isNodeLit(id);
              const green = deptIndex % 2 === 1;
              return (
                <article
                  key={dept.title}
                  ref={setNodeRef(id)}
                  className={`${styles.dept} ${lit ? styles.deptLit : ''} ${
                    green ? styles.deptGreen : styles.deptBlue
                  }`}
                  style={{ '--i': 4 + pos * 0.4 }}
                >
                  <h4>{dept.title}</h4>
                  <ul>
                    {dept.items.map((item, k) => (
                      <li key={item} style={{ '--k': k }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>

        {/* ---------- Story / steps ---------- */}
        <div className={styles.story}>
          <div
            className={styles.tabs}
            role="tablist"
            aria-label="How the organization works"
          >
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                type="button"
                aria-selected={i === step}
                className={`${styles.tab} ${i === step ? styles.tabActive : ''}`}
                onClick={() => selectStep(i)}
              >
                <span>{s.label}</span>
                {i === step && <b className={styles.progress} />}
              </button>
            ))}
          </div>

          <div className={styles.copy} key={active.id} aria-live="polite">
            <h3>{active.title}</h3>
            <p>{active.copy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Node({ id, lit, index, setRef }) {
  const n = NODES[id];
  return (
    <button
      ref={setRef}
      type="button"
      className={`${styles.node} ${styles[n.tone]} ${lit ? styles.nodeLit : ''}`}
      style={{ '--i': index }}
      aria-pressed={lit}
    >
      <strong>{n.label}</strong>
      <span>{n.note}</span>
    </button>
  );
}
