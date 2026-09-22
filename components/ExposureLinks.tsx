import React from 'react';
import type { TranslationKey } from '../types';
import referenceAnswers from '../data/calculator-reference.json';

const guides: { href: string; label: TranslationKey }[] = [
  { href: '/guides/crypto-futures-profit-formula.html', label: 'guide_formula' },
  { href: '/guides/leverage-roi-calculator.html', label: 'guide_roi' },
  { href: '/guides/long-short-futures-pnl.html', label: 'guide_direction' },
  { href: '/guides/trading-fee-impact.html', label: 'guide_fees' },
];

const ExposureLinks: React.FC<{ t: (key: TranslationKey) => string }> = ({ t }) => (
  <section className="semantic-copy guide-links" aria-labelledby="guide-links-title">
    <h2 id="guide-links-title">{t('guides_title')}</h2>
    <nav aria-label={t('guides_title')}>
      {guides.map(guide => <a key={guide.href} href={guide.href} hrefLang="en">{t(guide.label)}</a>)}
    </nav>
    <p>{t('model_limits')}</p>
    <details>
      <summary>{t('reference_answers')}</summary>
      <div lang="en">{referenceAnswers.map(item => <article key={item.question}>
        <h3>{item.question}</h3><p>{item.answer}</p>
      </article>)}</div>
    </details>
  </section>
);

export default ExposureLinks;
