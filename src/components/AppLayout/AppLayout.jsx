import React from "react";

import Head from '../Head/Head';
import TopNav from '../TopNav/TopNav';

import * as styles from './AppLayout.scss';

export default function AppLayout({ children, withSocialLinks }) {
  return (
    <div className={styles.AppLayout}>
      <Head />
      <TopNav withSocialLinks={withSocialLinks} />
      {children}
    </div>
  )
}