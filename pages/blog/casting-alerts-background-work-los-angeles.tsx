import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/blog.module.css";

export default function BackgroundWorkLA() {
  return (
    <>
      <Head>
        <title>
          How to Set Up Casting Alerts for Background Work in Los Angeles —
          CastAlert
        </title>
        <meta
          name="description"
          content="Step-by-step guide to configuring CastAlert for background casting calls in LA. Filter by production type, union status, and more."
        />
        <link
          rel="canonical"
          href="https://castalert-api.vercel.app/blog/casting-alerts-background-work-los-angeles"
        />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta
          property="og:title"
          content="How to Set Up Casting Alerts for Background Work in Los Angeles"
        />
        <meta
          property="og:description"
          content="Step-by-step guide to configuring CastAlert for background casting calls in LA. Filter by production type, union status, and more."
        />
        <meta
          property="og:url"
          content="https://castalert-api.vercel.app/blog/casting-alerts-background-work-los-angeles"
        />
        <meta property="og:site_name" content="CastAlert" />
        <meta property="article:published_time" content="2026-04-14T00:00:00Z" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="How to Set Up Casting Alerts for Background Work in LA"
        />
        <meta
          name="twitter:description"
          content="Step-by-step guide to configuring CastAlert for background casting calls in LA."
        />

        {/* JSON-LD BlogPosting Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline:
                "How to Set Up Casting Alerts for Background Work in Los Angeles",
              description:
                "Step-by-step guide to configuring CastAlert for background casting calls in LA. Filter by production type, union status, and more.",
              datePublished: "2026-04-14T00:00:00Z",
              author: {
                "@type": "Organization",
                name: "CastAlert",
              },
              publisher: {
                "@type": "Organization",
                name: "CastAlert",
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id":
                  "https://castalert-api.vercel.app/blog/casting-alerts-background-work-los-angeles",
              },
            }),
          }}
        />
      </Head>

      <div className={styles.page}>
        <nav className={styles.nav}>
          <Link href="/landing" className={styles.logo}>
            Cast<span className={styles.logoAccent}>Alert</span>
          </Link>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/landing">Home</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
          </ul>
        </nav>

        <article className={styles.article}>
          <Link href="/blog" className={styles.articleBack}>
            &larr; Back to blog
          </Link>

          <div className={styles.articleMeta}>
            <span className={styles.articleTag}>Guide</span>
            <span>April 14, 2026</span>
            <span>6 min read</span>
          </div>

          <h1 className={styles.articleTitle}>
            How to Set Up Casting Alerts for Background Work in Los Angeles
          </h1>

          <div className={styles.articleBody}>
            <p>
              Los Angeles is the busiest market for background work in the
              country. On any given week, dozens of productions are casting for
              background actors across film, television, commercials, and new
              media. The challenge is not a lack of opportunity — it is keeping
              up with the volume and responding before slots fill.
            </p>
            <p>
              CastAlert was built to solve exactly this problem. Instead of
              refreshing casting websites and email inboxes, you get a push
              notification the moment a relevant call goes live. Here is how to
              set it up for background work in the LA market.
            </p>

            <h2>Step 1: Download and Open CastAlert</h2>
            <p>
              CastAlert is available on the iOS App Store. Download it, open the
              app, and allow push notifications when prompted. This is critical
              — the entire value of CastAlert depends on real-time alerts
              reaching your lock screen.
            </p>

            <h2>Step 2: Set Your Role Type to Background</h2>
            <p>
              Navigate to <strong>Settings &rarr; Notifications</strong> and
              find the <strong>Role Types</strong> section. Toggle on{" "}
              <strong>Background</strong>. You can also enable{" "}
              <strong>Stand-In</strong> if you want to catch those calls too —
              stand-in work in LA pays better and often leads to recurring
              bookings on episodic shows.
            </p>
            <p>
              Leave the other role types (Lead, Supporting, Voice, Stunt)
              toggled off unless you are actively pursuing those categories. The
              fewer filters you enable, the less noise in your notifications.
            </p>

            <h2>Step 3: Choose Your Production Types</h2>
            <p>
              Background work spans every production category. In the LA market,
              the highest volume comes from:
            </p>
            <ul>
              <li>
                <strong>TV</strong> — Network and streaming shows cast
                background daily during production seasons.
              </li>
              <li>
                <strong>Film</strong> — Feature films need large crowd scenes,
                period-specific looks, and specific demographics.
              </li>
              <li>
                <strong>Commercial</strong> — Commercials often pay well for
                background, especially union spots.
              </li>
              <li>
                <strong>New Media</strong> — Streaming originals and digital
                content are a growing source of background bookings.
              </li>
            </ul>
            <p>
              Toggle on the production types you are available for. If you are
              open to everything, enable all of them.
            </p>

            <h2>Step 4: Set Your Union Status</h2>
            <p>
              This is one of the most important filters. If you are{" "}
              <strong>SAG-AFTRA</strong>, you will only want to see union calls
              (non-union work can jeopardize your membership). If you are{" "}
              <strong>non-union</strong>, you can see non-union calls — and keep
              an eye on union calls to plan your path to eligibility. Select{" "}
              <strong>Both</strong> if you want to see everything.
            </p>

            <h2>Step 5: Configure Quiet Hours</h2>
            <p>
              Casting calls for background work often post early — sometimes
              before 6 AM for same-day calls. If you do not want alerts waking
              you up, set quiet hours. CastAlert will hold notifications during
              your quiet window and deliver them when it ends, so you will not
              miss anything — just delay it.
            </p>
            <p>
              A recommended setup for LA background actors:{" "}
              <strong>quiet hours from 10 PM to 6 AM</strong>. Most same-day
              calls post between 6 AM and 9 AM, so you will catch them right
              when your quiet hours end.
            </p>

            <h2>Step 6: Act Fast</h2>
            <p>
              Background slots fill quickly, especially for union work on
              popular shows. When you get a CastAlert notification:
            </p>
            <ol>
              <li>Read the role details and check the deadline.</li>
              <li>
                Long-press the notification to <strong>Save for Later</strong>{" "}
                if you need a moment to check your availability.
              </li>
              <li>Submit your availability through the casting platform as soon as possible.</li>
            </ol>
            <p>
              The actors who book consistently are not necessarily the most
              experienced — they are the ones who respond first. CastAlert puts
              you at the front of the line.
            </p>

            <h2>Bonus: Use Smart Grouping</h2>
            <p>
              When multiple calls come in from the same casting director or
              production, CastAlert groups them together in your notification
              feed. This makes it easy to spot patterns — if a casting director
              is repeatedly posting for the same show, that production likely has
              ongoing background needs. Reach out directly or keep your
              availability open for their calls.
            </p>

            <p>
              Background work in LA is competitive, but it is also abundant. The
              key is speed and consistency. Set up CastAlert once, and let it do
              the monitoring for you.
            </p>
          </div>
        </article>

        <footer className={styles.footer}>
          <span>&copy; {new Date().getFullYear()} CastAlert</span>
          <ul className={styles.footerLinks}>
            <li>
              <Link href="/landing">Home</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
          </ul>
        </footer>
      </div>
    </>
  );
}
