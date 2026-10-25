import React from 'react';

/**
 * The story: a tower of floors standing beside four chapters that scroll past
 * it. The tower holds the one number the reader is working towards; the
 * chapters explain where it comes from.
 */
export default function Story({ towerValue, towerLabel, chapters, children }) {
  const isEmpty = towerValue === '' || towerValue === null || towerValue === undefined;
  return (
    <section className="story" id="story">
      {children}
      <div className="wrap story__grid">
        <aside className="tower" aria-label="What the Final must be">
          <div className="tower__sticky">
            <span className="tower__label">{towerLabel}</span>
            <span className={`tower__value mono${isEmpty ? ' tower__value--empty' : ''}`}>
              {isEmpty ? '' : towerValue}
            </span>
            <ol className="tower__floors">
              {chapters.map((c, i) => (
                <li className="tower__floor" key={c.id}>
                  <span className="tower__floor-no mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="tower__floor-name">{c.short}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className="chapters">
          {chapters.map((c) => (
            <article className="chapter" id={c.id} key={c.id}>
              <span className="chapter__no mono">{c.no}</span>
              <h2 className="chapter__title">{c.title}</h2>
              <p className="chapter__body">{c.body}</p>
              {c.detail ? <p className="chapter__detail">{c.detail}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
