import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { TwitterIcon, FacebookIcon, YoutubeIcon, InstagramIcon, BlueskyIcon } from '@hugeicons/core-free-icons';
// Update this import to use the new name, RedditLogoIcon
import { RedditLogoIcon } from '@phosphor-icons/react';

const SocialLinks = () => {
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
    <div className="card social-links-container">
         <div className="card-backdrop"></div>
      <h2 className="card-header">Social</h2>
      <div className="social-links-wrapper">
      <a
        href="https://twitter.com"
        target="_blank"
        rel="noopener"
        aria-label="Twitter"
        className="icon-link"
      >
        <HugeiconsIcon icon={TwitterIcon} size={32} strokeWidth={iconStrokeWidth} />
      </a>
      <a
        href="https://www.facebook.com"
        target="_blank"
        rel="noopener"
        aria-label="Facebook"
        className="icon-link"
      >
        <HugeiconsIcon icon={FacebookIcon} size={32} strokeWidth={iconStrokeWidth} />
      </a>
      <a
        href="https://www.youtube.com/feed/subscriptions"
        target="_blank"
        rel="noopener"
        aria-label="YouTube"
        className="icon-link"
      >
        <HugeiconsIcon icon={YoutubeIcon} size={32} strokeWidth={iconStrokeWidth} />
      </a>
      <a
        href="https://www.reddit.com"
        target="_blank"
        rel="noopener"
        aria-label="Reddit"
        className="icon-link"
      >
        {/* Update the component name here as well */}
        <RedditLogoIcon size={32} weight="regular" color="var(--social-icon-color)" />
      </a>
      <a
        href="https://www.instagram.com"
        target="_blank"
        rel="noopener"
        aria-label="Instagram"
        className="icon-link"
      >
        <HugeiconsIcon icon={InstagramIcon} size={32} strokeWidth={iconStrokeWidth} />
      </a>
      <a
        href="https://bsky.app"
        target="_blank"
        rel="noopener"
        aria-label="Bluesky"
        className="icon-link"
      >
        <HugeiconsIcon icon={BlueskyIcon} size={32} strokeWidth={iconStrokeWidth} />
      </a>
       </div>
    </div>
    
  );
};

export default SocialLinks;