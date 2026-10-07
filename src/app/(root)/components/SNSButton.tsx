import { socialLinks } from "@/app/data/site";
export default function SNSButton() {
  return (
    <div className="social-grid">
      {socialLinks.map((link, index) => (
        <a
          className="social-card"
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="social-symbol" aria-hidden="true">
            {index === 0 ? "𝕏" : "◎"}
          </span>
          <span>
            <strong>{link.name}</strong>
            <small>{link.handle}</small>
          </span>
          <span className="social-arrow" aria-hidden="true">
            ↗
          </span>
          <span className="sr-only">（新しいタブで開きます）</span>
        </a>
      ))}
    </div>
  );
}
