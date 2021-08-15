import * as React from 'react';
import AppLayout from '../components/AppLayout/AppLayout';
import { Link } from 'gatsby';

const NotFoundPage = () => {
  return (
    <AppLayout>
      <main>
        <h1>Page not found</h1>
        <p>Sorry{" "} <span role="img" aria-label="Pensive emoji">😔</span>{" "} we couldn’t find what you were looking for.</p>
        <p><Link to="/">Go home</Link>.</p>
      </main>
    </AppLayout>
  )
}

export default NotFoundPage
