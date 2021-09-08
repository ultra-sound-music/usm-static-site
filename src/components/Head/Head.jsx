import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

const Head = ({ post = {} }) => {
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
          description
          baseUrl
        }
      }
    }
  `);

  const defaults = data.site.siteMetadata;
  const latoFont = process.env.GATSBY_FONT_LATO;
  const motorFont = process.env.GATSBY_FONT_MOTOR;  

  if (defaults.baseUrl === '' && typeof window !== 'undefined') {
    defaults.baseUrl = window.location.origin;
  }

  if (defaults.baseUrl === '') {
    console.error('Please set a baseUrl in your site metadata!');
    return null;
  }

  const title = post.title || defaults.title;
  const description = post.description || defaults.description;
  const url = new URL(post.path || '', defaults.baseUrl);
  const image = post.image ? new URL(post.image, defaults.baseUrl) : false;

  return (
    <Helmet>
      <title>{title}</title>

      <link rel="stylesheet" href={latoFont} />
      <link rel="stylesheet" href={motorFont} />

      <link rel="canonical" href={url} />
      <meta name="description" content={description} />
      {image && <meta name="image" content={image} />}

      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
    </Helmet>
  );
};

export default Head;