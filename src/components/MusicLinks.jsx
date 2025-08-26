import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { SoundcloudIcon, SpotifyIcon } from '@hugeicons/core-free-icons';
import { MusicNotesSimpleIcon, ImageSquareIcon } from '@phosphor-icons/react';
import { LiaBandcamp } from "react-icons/lia";

const MusicLinks = () => {
  const [iconStrokeWidth, setIconStrokeWidth] = useState(2);

  useEffect(() => {
    const computedStyles = getComputedStyle(document.documentElement);
    const strokeWidthValue = parseFloat(
      computedStyles.getPropertyValue('--link-icon-stroke-width')
    );

    if (!isNaN(strokeWidthValue)) {
      setIconStrokeWidth(strokeWidthValue);
    }
  }, []);

  return (
    <div className="card music-links-container">
         <div className="card-backdrop"></div>
      <h2 className="card-header">Music</h2>
      <div className="music-links-wrapper">
        <a
          href="https://bandcamp.com"
          target="_blank"
          rel="noopener"
          aria-label="Bandcamp"
          className="icon-link"
        >
          <LiaBandcamp size={32} weight="regular" color="var(--social-icon-color)" />
        </a>
        <a
          href="https://soundcloud.com/discover"
          target="_blank"
          rel="noopener"
          aria-label="SoundCloud"
          className="icon-link"
        >
          <HugeiconsIcon
            icon={SoundcloudIcon}
            size={32}
            stroke="var(--social-icon-color)"
            strokeWidth={iconStrokeWidth}
          />
        </a>
        <a
          href="https://open.spotify.com/"
          target="_blank"
          rel="noopener"
          aria-label="Spotify"
          className="icon-link"
        >
          <HugeiconsIcon
            icon={SpotifyIcon}
            size={32}
            stroke="var(--social-icon-color)"
            strokeWidth={iconStrokeWidth}
          />
        </a>
        <a
          href="https://www.qobuz.com/us-en/shop"
          target="_blank"
          rel="noopener"
          aria-label="Qobuz"
          className="icon-link icon-link-text"
        >
          QB
        </a>
        <a
          href="https://lucida.to/?NwW0Oby=ZppMmjW"
          target="_blank"
          rel="noopener"
          aria-label="Lucida"
          className="icon-link icon-link-text"
        >
          LD
        </a>
        <a
          href="https://getmusicbee.com/forum"
          target="_blank"
          rel="noopener"
          aria-label="MusicBee"
          className="icon-link icon-link-text"
        >
          MB
        </a>
        <a
          href="https://covers.musichoarders.xyz"
          target="_blank"
          rel="noopener"
          aria-label="Music Hoarders"
          className="icon-link"
        >
          <ImageSquareIcon size={32} weight="regular" color="var(--social-icon-color)" />
        </a>
      </div>
    </div>
  );
};

export default MusicLinks;