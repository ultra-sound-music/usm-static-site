import React from "react";
import { Link } from 'gatsby';

import logo from '../../images/logo_white.svg';

import * as styles from './TopNav.scss'

export function TopNav({ withSocialLinks }) {
  const discordUrl = process.env.GATSBY_DISCORD_URL;
  const twitterUrl = process.env.GATSBY_TWITTER_URL;

  function renderSocialLinks() {
    return (
      <>
        {discordUrl && <div><a href={discordUrl} className={styles.socialLink} target="_blank" rel="noreferrer">Discord</a></div>}
        {twitterUrl && <div><a href={twitterUrl} className={styles.socialLink} target="_blank" rel="noreferrer">Twitter</a></div>}
      </>
    );
  }

  return (
    <div className={styles.topNav}>
      <div className={styles.mainNav}>
        <Link to='/'>
          <img src={logo} className={styles.logoImg} alt="Logo" width="40px" height="58.38px" />
        </Link>
      </div>
      <div className={styles.social}>
        {withSocialLinks ? renderSocialLinks() : <Link to='/memplayer' className={styles.memplayerLink}>Mempool Player</Link>}
      </div>
    </div>
  )
}

export default TopNav;