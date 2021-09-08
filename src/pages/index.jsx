import React from 'react';
import AppLayout from '../components/AppLayout/AppLayout';
import Container from '../components/Container/Container';
import MemPlayer from '../components/MemPlayer/MemPlayer';
import Logo from '../images/logo.svg';

import * as styles from './index.scss';

class Index extends React.Component {
  state = {
    enableMemPlayer: false
  }

  componentDidMount() {
    this.setState({
      enableMemPlayer: (process.env.GATSBY_ENABLE_MEM_PLAYER ?? '').toLowerCase() === 'true' ? true : false
    });
  }

  renderSocialLinks = () => {
    return (
      <div className={styles.social}>
        <a className={styles.socialLink} href='https://twitter.com/usmproject'>Twitter</a>
      </div>      
    )    
  }

  render () {
    console.log('props', this.props)
    console.log('env', process.env.GATSBY_ENABLE_MEM_PLAYER);
    console.log('state', this.state.enableMemPlayer);
    return (
      <AppLayout withNavBar={this.state.enableMemPlayer}>
        <Container>
          <div className={styles.logo}>
            <Logo />
          </div>
          <div className={styles.header}>
            <h1 className={styles.title}>Ultra Sound Music</h1>
            <h2 className={styles.subtitle}>Building the crossroads between music and NFT’s. <br />Join our community to get notified on the launch.</h2>
          </div>

          {!this.state.enableMemPlayer && this.renderSocialLinks()}
          {this.state.enableMemPlayer && <MemPlayer />}
        </Container>
      </AppLayout>      
    );
  }
}

export default Index;