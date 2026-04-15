import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/blog.module.css";

const posts = [
  {
    slug: "casting-alerts-background-work-los-angeles",
    title: "How to Set Up Casting Alerts for Background Work in Los Angeles",
    excerpt:
      "A step-by-step guide to configuring CastAlert so you never miss a background casting call in the LA market — from initial setup to advanced filtering.",
    date: "2026-04-14",
    tag: "Guide",
  },
];

export default function BlogIndex() {
  return (
    <>
      <Head>
        <title>Blog — CastAlert</title>
        <meta
          name="description"
          content="Tips, guides, and industry insights for working actors. Learn how to land more auditions with CastAlert."
        />
        <link rel="canonical" href="https://castalert-api.vercel.app/blog" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blog — CastAlert" />
        <meta
          property="og:description"
          content="Tips, guides, and industry insights for working actors. Learn how to land more auditions with CastAlert."
        />
        <meta property="og:url" content="https://castalert-api.vercel.app/blog" />
        <meta property="og:site_name" content="CastAlert" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Blog — CastAlert" />
        <meta
          name="twitter:description"
          content="Tips, guides, and industry insights for working actors."
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

        <div className={styles.header}>
          <p className={styles.headerLabel}>Blog</p>
          <h1 className={styles.headerTitle}>Industry tips & guides</h1>
        </div>

        <div className={styles.posts}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={styles.postCard}
            >
              <div className={styles.postMeta}>
                <span className={styles.postTag}>{post.tag}</span>
                <span>{post.date}</span>
              </div>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.postExcerpt}>{post.excerpt}</p>
            </Link>
          ))}
        </div>

        <footer className={styles.footer}>
          <span>&copy; {new Date().getFullYear()} CastAlert</span>
          <ul className={styles.footerLinks}>
            <li>
              <Link href="/landing">Home</Link>
            </li>
          </ul>
        </footer>
      </div>
    </>
  );
}
