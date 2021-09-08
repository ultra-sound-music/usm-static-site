import React from 'react';
import AppLayout from '../components/AppLayout/AppLayout';
import Container from '../components/Container/Container';
import MemPlayer from '../components/MemPlayer/MemPlayer';
import logo from '../images/logo.png';

import * as styles from './index.scss';

const discordUrl = process.env.GATSBY_DISCORD_URL;
const twitterUrl = process.env.GATSBY_TWITTER_URL;
const enableMemPlayer = (process.env.GATSBY_ENABLE_MEM_PLAYER ?? '').toLowerCase() === 'true' ? true : false

class Index extends React.Component {
  renderSocialLinks = () => {
    return (
      <div className={styles.social}>
        {discordUrl && <div><a href={discordUrl} className={styles.socialLink} target="_blank" rel="noreferrer">Discord</a></div>}
        {twitterUrl && <a href={twitterUrl} className={styles.socialLink} target="_blank" rel="noreferrer">Twitter</a>}
      </div>      
    )    
  }

  render () {
    return (
      <AppLayout withNavBar={enableMemPlayer}>
        <Container adjustForNavBar={enableMemPlayer}>
          <div className={styles.Index}>
            <div className={styles.logo}>
              <img src={logo} className={styles.logoImg} alt="Logo" />
            </div>
            <div className={styles.header}>
              <h1 className={styles.title}>Ultra Sound Music</h1>
              <h2 className={styles.subtitle}>Building the crossroads between music and NFT’s. <br />Join our community to get notified on the launch.</h2>
            </div>

            {!enableMemPlayer && this.renderSocialLinks()}
            {enableMemPlayer && <MemPlayer />}            
          </div>
        </Container>
      </AppLayout>      
    );
  }
}

export default Index;