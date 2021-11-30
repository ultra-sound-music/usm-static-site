import React from 'react';
import AppLayout from '../components/AppLayout/AppLayout';
import Container from '../components/Container/Container';
import MemPlayer from '../components/MemPlayer/MemPlayer';
import logo from '../images/logo.png';

import * as styles from './index.scss';

const DISCORD_URL = process.env.GATSBY_DISCORD_URL;
const TWITTER_URL = process.env.GATSBY_TWITTER_URL;
const WEBSOCKET_URL = process.env.GATSBY_WS_URL;

class Index extends React.Component {
  state = {
    hasMounted: false // Gatsby uses SSR. We use this flag to force React into re-rendering after hydrating the DOM on initial page load
  };

  constructor(props) {
    super(props);
    if (WEBSOCKET_URL) {
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
      <AppLayout withSocialLinks={true}>
        <Container adjustForNavBar={true}>
          <div className='Index'>
            <div className={styles.logo}>
              <img src={logo} className={styles.logoImg} alt="Logo" width="80px" height="120px" />
            </div>
            <div className={styles.header}>
              <h1 className={styles.title}>Ultra Sound Music</h1>
              <div className={styles.body}>Ever wonder what the mempool would sound like if it was an instrument?<br/>We wonder it all the time! So, we made this little player, see if you could figure it out...</div>
            </div>

            {enableMemPlayer && <MemPlayer />}            
          </div>
        </Container>
      </AppLayout>      
    );
  }
}

export default Index;