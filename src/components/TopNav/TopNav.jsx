import React from "react";

import * as styles from './TopNav.scss'

export function TopNav() {
  const discordUrl = process.env.GATSBY_DISCORD_URL;
  const twitterUrl = process.env.GATSBY_TWITTER_URL;

  return (
    <div className={styles.topNav}>
      <div className={styles.socialLinks}>
        {discordUrl && <div><a href={discordUrl} className={styles.socialLink}>Discord</a></div>}
        {twitterUrl && <div><a href={twitterUrl} className={styles.socialLink}>Twitter</a></div>}
      </div>
    </div>
  )
}

export default TopNav;