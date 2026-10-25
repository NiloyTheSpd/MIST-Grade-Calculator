import React from 'react';

/**
 * The campus, in two lights: the night the semester ends in, and the day it
 * runs in. Real photographs of MIST, carried through the whole page.
 */
export function CampusNight({ className = '' }) {
  return (
    <figure className={`sky-photo sky-photo--night ${className}`}>
      <img
        src="/campus-bg-nt.jpg"
        alt="Tower 4 at night, the lit sky between the two blocks and the sky-bridge above the tree"
        width="960"
        height="540"
        loading="eager"
        fetchpriority="high"
        decoding="async"
      />
      <figcaption className="sky-photo__caption">
        Tower 4, after the light goes.
      </figcaption>
    </figure>
  );
}

export function CampusDay({ className = '' }) {
  return (
    <figure className={`sky-photo sky-photo--day ${className}`}>
      <img
        src="/campus-bg.jpg"
        alt="The MIST campus buildings seen across the trees in daylight"
        width="1080"
        height="675"
        loading="lazy"
        decoding="async"
      />
      <figcaption className="sky-photo__caption">
        The campus in the hour the semester runs in.
      </figcaption>
    </figure>
  );
}

/**
 * The skyline that closes the page: MIST's own buildings, drawn as blocks
 * with lit windows, standing behind the last line of copy.
 */
export function Skyline() {
  return (
    <div className="sky" aria-hidden="true">
      <div className="sky__block sky__block--a">
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
      </div>
      <div className="sky__block sky__block--b">
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
      </div>
      <div className="sky__bridge" />
      <div className="sky__block sky__block--c">
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
      </div>
      <div className="sky__block sky__block--d">
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
        <span className="sky__win" />
      </div>
    </div>
  );
}
