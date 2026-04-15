import Head from "next/head";
import styles from "@/styles/landing.module.css";

const features = [
  {
    icon: "\u26a1",
    title: "Instant Alerts",
    desc: "Get notified the moment new casting calls drop — before the crowd sees them.",
  },
  {
    icon: "\ud83c\udfaf",
    title: "Smart Filters",
    desc: "Set your role type, union status, and production preferences. Only see what matters.",
  },
  {
    icon: "\ud83d\udcc5",
    title: "Deadline Tracking",
    desc: "Never miss a submission window. We surface deadlines front and center.",
  },
  {
    icon: "\ud83d\udd14",
    title: "Rich Notifications",
    desc: "Detailed push alerts with role info, production type, and casting director.",
  },
  {
    icon: "\ud83c\udfa5",
    title: "All Production Types",
    desc: "Film, TV, commercials, theater, voice, music video, and new media.",
  },
  {
    icon: "\ud83c\udf19",
    title: "Quiet Hours",
    desc: "Configure do-not-disturb windows so alerts respect your schedule.",
  },
];

function AppStoreBadge() {
  return (
    <a
      href="https://apps.apple.com/app/castalert/id6740000000"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.appStoreBadge}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <span className={styles.badgeText}>
        <span className={styles.badgeSmall}>Download on the</span>
        App Store
      </span>
    </a>
  );
}

export default function Landing() {
  return (
    <>
      <Head>
        <title>CastAlert — Never Miss a Casting Call Again</title>
        <meta
          name="description"
          content="CastAlert sends instant push notifications for new casting calls. Filter by role type, union status, and production type. Built for working actors."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://castalert-api.vercel.app/landing" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="CastAlert — Never Miss a Casting Call Again"
        />
        <meta
          property="og:description"
          content="Real-time push alerts for casting calls. Filter by role type, production, and union status. Built by actors, for actors."
        />
        <meta property="og:url" content="https://castalert-api.vercel.app/landing" />
        <meta property="og:site_name" content="CastAlert" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="CastAlert — Never Miss a Casting Call Again"
        />
        <meta
          name="twitter:description"
          content="Real-time push alerts for casting calls. Filter by role type, production, and union status."
        />

        {/* JSON-LD SoftwareApplication Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "CastAlert",
              operatingSystem: "iOS",
              applicationCategory: "EntertainmentApplication",
              description:
                "Real-time push notifications for casting calls. Filter by role type, union status, and production type. Built for working actors in Los Angeles and beyond.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "142",
              },
              featureList: [
                "Instant casting call push notifications",
                "Role type filtering (Background, Lead, Supporting, Voice, Stunt, Stand-In)",
                "Union status filtering (SAG-AFTRA, Non-Union)",
                "Production type filtering (Film, TV, Commercial, Theater, Voice, Music Video, New Media)",
                "Smart notification grouping by casting director",
                "Quiet hours configuration",
                "Deadline tracking",
              ],
              softwareVersion: "2.0.0",
              author: {
                "@type": "Organization",
                name: "TombstoneDash",
              },
            }),
          }}
        />
      </Head>

      <div className={styles.page}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            Cast<span className={styles.logoAccent}>Alert</span>
          </div>
          <ul className={styles.navLinks}>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
          </ul>
        </nav>

        <section className={styles.hero}>
          <span className={styles.badge}>Now on iOS</span>
          <h1 className={styles.headline}>
            Never miss a{" "}
            <span className={styles.headlineAccent}>casting call</span> again
          </h1>
          <p className={styles.subtitle}>
            Real-time push alerts for casting calls in your area. Filter by role
            type, production, and union status. Built by actors, for actors.
          </p>
          <AppStoreBadge />
        </section>

        <section id="features" className={styles.features}>
          <div className={styles.featuresInner}>
            <p className={styles.sectionLabel}>Features</p>
            <h2 className={styles.sectionTitle}>
              Everything you need to stay ahead
            </h2>
            <div className={styles.featureGrid}>
              {features.map((f) => (
                <div key={f.title} className={styles.featureCard}>
                  <div className={styles.featureIcon}>{f.icon}</div>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Start getting alerts today</h2>
          <p className={styles.ctaSubtitle}>
            Free to download. Set up in under a minute.
          </p>
          <AppStoreBadge />
        </section>

        <footer className={styles.footer}>
          <span>&copy; {new Date().getFullYear()} CastAlert</span>
          <ul className={styles.footerLinks}>
            <li>
              <a href="/blog">Blog</a>
            </li>
          </ul>
        </footer>
      </div>
    </>
  );
}
