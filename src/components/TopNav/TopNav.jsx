import React from "react";
import { Link } from "gatsby";

export function TopNav() {
  return (
    <div className='TopNav'>
      <div><Link to='/'>Home</Link></div>
      <div><Link to='/about'>About</Link></div>
    </div>
  )
}

export default TopNav;