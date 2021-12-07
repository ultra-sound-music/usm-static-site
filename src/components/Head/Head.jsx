import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

const Head = ({ post = {} }) => {
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          siteLanguage
          title
          description
          siteUrl
          baseUrl
          image
          twitterUsername
        }
      }
    }
  `);

  const latoFont = process.env.GATSBY_FONT_LATO;
  const motorFont = process.env.GATSBY_FONT_MOTOR;    
  const defaults = data?.site?.siteMetadata ?? {};
  const baseUrl = defaults?.baseUrl ?? window.location.origin;

  if (!baseUrl) {
    console.error('Please set a baseUrl in your site metadata!');
    return null;
  }

  const siteLanguage = defaults?.siteLanguage;
  const twitterUsername = defaults?.twitterUsername;

  const title = post.title || defaults.title;
  const description = post.description || defaults.description;
  const url = new URL(post.path || '', defaults.baseUrl);
  const image = new URL(post.image || defaults.image, defaults.baseUrl);
  const article = !!post.article;

  const attributes = {
    lang: siteLanguage
  }

  return (
    <Helmet title={title} htmlAttributes={attributes}>
      <link rel="stylesheet" href={latoFont} />
      <link rel="stylesheet" href={motorFont} />

      {url && <link rel="canonical" href={url} />}
      {description && <meta name="description" content={description} />}
      {image && <meta name="image" content={image} />}

      {article && <meta property="og:type" content="article" />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />

      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {twitterUsername && <meta name="twitter:creator" content={twitterUsername} />}
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default Head;