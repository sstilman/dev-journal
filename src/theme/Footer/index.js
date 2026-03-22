import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { footerLinks, brandConfig, copyrightConfig } from '@site/src/data/footerLinks';
import styles from './Footer.module.css';

function FooterLink({ link }) {
  const isInternal = link.to && !link.href;
  const className = styles.footerLink;

  if (isInternal) {
    return (
      <li>
        <Link to={link.to} className={className}>
          {link.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <a
        href={link.href}
        target={link.href?.startsWith('http') ? '_blank' : undefined}
        rel={link.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {link.label}
      </a>
    </li>
  );
}

function LinkColumn({ column }) {
  return (
    <div className={styles.linkColumn}>
      <h4 className={styles.columnTitle}>{column.title}</h4>
      <ul className={styles.linkList}>
        {column.links.map((link, index) => (
          <FooterLink key={index} link={link} />
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { siteConfig } = useDocusaurusContext();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.brandSection}>
            <span className={styles.logoText}>{siteConfig.title}</span>
            <p className={styles.brandDescription}>
              {brandConfig.description.en}<br />
              {brandConfig.description.zh}
            </p>
          </div>

          <div className={styles.linksGrid}>
            {footerLinks.map((column, index) => (
              <LinkColumn key={index} column={column} />
            ))}
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            <p>© {currentYear} {siteConfig.title}. All rights reserved.</p>
          </div>
          <div className={styles.bottomRight}>
            <span className={styles.poweredBy}>
              Built with <a href={copyrightConfig.poweredByUrl} target="_blank" rel="noopener noreferrer">{copyrightConfig.poweredBy}</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
