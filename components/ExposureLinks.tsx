import React from 'react';

const guides = [
  {
    href: '/guides/crypto-futures-profit-formula.html',
    title: 'Crypto futures profit formula',
    description: 'PnL formulas for long and short futures trades with leverage, fees, and ROI.',
  },
  {
    href: '/guides/leverage-roi-calculator.html',
    title: 'Leverage and ROI guide',
    description: 'How leverage changes position value, net profit, and percentage return.',
  },
  {
    href: '/guides/long-short-futures-pnl.html',
    title: 'Long vs short PnL',
    description: 'Quick answer page for comparing long and short trade outcomes.',
  },
  {
    href: '/guides/trading-fee-impact.html',
    title: 'Trading fee impact',
    description: 'How entry, exit, and referral payback affect net crypto futures profit.',
  },
];

const answers = [
  {
    question: 'How do I calculate crypto futures profit?',
    answer:
      'For a long trade, multiply position size by the percentage price increase. For a short trade, multiply position size by the percentage price decrease. Then subtract entry and exit fees.',
  },
  {
    question: 'What is the fastest way to estimate leveraged ROI?',
    answer:
      'Divide net profit by margin used, then multiply by 100. The calculator does this after applying leverage, direction, and trading fee assumptions.',
  },
  {
    question: 'Where should I start?',
    answer:
      'Open the calculator, enter entry price, target price, leverage, investment amount, and fee rate, then compare the net result before placing a trade.',
  },
];

const ExposureLinks: React.FC = () => (
  <section
    className="mt-8 rounded-lg border border-gray-800 bg-gray-950 p-5 shadow-lg"
    aria-labelledby="answer-guides-title"
  >
    <div className="max-w-4xl">
      <h2 id="answer-guides-title" className="text-lg font-bold text-cyan-300">
        Crypto futures answer guides
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-400">
        Short, crawlable guides for search engines and AI answer systems that need direct
        formulas, definitions, and trade examples.
      </p>
    </div>

    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {guides.map(guide => (
        <a
          key={guide.href}
          href={guide.href}
          className="block rounded-md border border-gray-800 bg-black p-4 transition-colors hover:border-cyan-700 hover:bg-gray-900"
        >
          <span className="text-sm font-semibold text-cyan-300">{guide.title}</span>
          <span className="mt-1 block text-xs leading-5 text-gray-500">{guide.description}</span>
        </a>
      ))}
    </div>

    <div className="mt-5 grid gap-3 lg:grid-cols-3">
      {answers.map(item => (
        <article key={item.question} className="rounded-md border border-gray-800 bg-black p-4">
          <h3 className="text-sm font-semibold text-gray-200">{item.question}</h3>
          <p className="mt-2 text-xs leading-5 text-gray-500">{item.answer}</p>
        </article>
      ))}
    </div>
  </section>
);

export default ExposureLinks;
