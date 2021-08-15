import React from "react";
import Seo from '../Seo/Seo';
import TopNav from '../TopNav/TopNav';

export default function AppLayout({ children }) {
  return (
    <div style={{ margin: `0 auto`, maxWidth: 650, padding: `0 1rem` }}>
      <Seo />
      <TopNav />
      {children}
    </div>
  )
}