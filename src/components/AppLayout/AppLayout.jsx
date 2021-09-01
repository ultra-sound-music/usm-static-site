import React from "react";
import Head from '../Head/Head';
// import TopNav from '../TopNav/TopNav';

import './AppLayout.scss';

export default function AppLayout({ children }) {
  return (
    <div className='AppLayout'>
      <Head />
      {/* <TopNav /> */}
      {children}
    </div>
  )
}