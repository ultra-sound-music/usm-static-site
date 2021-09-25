import React from 'react';
import AppLayout from '../components/AppLayout/AppLayout';
import Container from '../components/Container/Container';
import MemPlayer from '../components/MemPlayer/MemPlayer';
import logo from '../images/logo.png';

import * as styles from './index.scss';

const DISCORD_URL = process.env.GATSBY_DISCORD_URL;
const TWITTER_URL = process.env.GATSBY_TWITTER_URL;
const MEM_PLAYER_ENABLED = (process.env.GATSBY_MEM_PLAYER_ENABLED ?? '').toLowerCase() === 'true' ? true : false;
const WEBSOCKET_URL = process.env.GATSBY_WS_URL;

class Index extends React.Component {
  state = {
    hasMounted: false // Gatsby uses SSR. We use this flag to force React into re-rendering after hydrating the DOM on initial page load
  };

  constructor(props) {
    super(props);
    const memPlayerEnabled = MEM_PLAYER_ENABLED || new URLSearchParams(props?.location?.search ?? '').has('memplayer');
    if (memPlayerEnabled && WEBSOCKET_URL) {
      this.enableMemPlayer = true;
    } else {
      console.debug('Skipping MemPlayer initialization');
    }    
  }

  componentDidMount() {
    this.setState({
      hasMounted: true
    });
  }

  renderSocialLinks = () => {
    return (
      <div className={styles.social}>
        {DISCORD_URL && <div><a href={DISCORD_URL} className={styles.socialLink} target="_blank" rel="noreferrer">Discord</a></div>}
        {TWITTER_URL && <a href={TWITTER_URL} className={styles.socialLink} target="_blank" rel="noreferrer">Twitter</a>}
      </div>      
    )    
  }

  render () {
    const {
      enableMemPlayer = false
    } = this;

    if (!this.state.hasMounted) {
      return null;
    }

    return (
      <AppLayout withNavBar={enableMemPlayer}>
        <Container adjustForNavBar={enableMemPlayer}>
          <div className='Index'>
            <div className={styles.logo}>
              <img src={logo} className={styles.logoImg} alt="Logo" width="80px" height="120px" />
            </div>
            <div className={styles.header}>
              <h1 className={styles.title}>Ultra Sound Music</h1>
              <h2 className={styles.subtitle}>Building the crossroads between music and NFTs. <br />Join our community to get notified on the launch.</h2>
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