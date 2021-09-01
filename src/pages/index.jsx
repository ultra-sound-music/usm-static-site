import * as React from 'react';
import AppLayout from '../components/AppLayout/AppLayout';
import Container from '../components/Container/Container';
import Button from '../components/Button/Button';
import Logo from '../images/logo.svg';

import * as styles from './index.scss';

const Index = () => {
  return (
    <AppLayout>
      <Container>
        <div className={styles.logo}>
          <Logo />
        </div>
        <div className={styles.header}>
          <h1 className={styles.title}>Ultra Sound Music</h1>
          <h2 className={styles.subtitle}>Ultra Sound Music building a multi-chain Automated Music Maker on the Blockchain and DeFi ecosystem</h2>
        </div>

        <div className={styles.social}>
          <div className={styles.follow_us}>Follow us on Twitter to stay updated</div>
          <Button href='https://twitter.com/usmproject'>@usmproject</Button>
        </div>      
      </Container>
    </AppLayout>
  )
}

export default Index
