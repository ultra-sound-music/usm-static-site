require('dotenv').config();

module.exports = {
  siteMetadata: {
    baseUrl: "http://localhost:8000",
    title: "Ultra Sound Music",
    siteLanguage: "en"
  },
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-gatsby-cloud",
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-google-gtag",  // https://www.gatsbyjs.com/plugins/gatsby-plugin-google-gtag/
      options: {
        trackingIds: [
          process.env.GOOGLE_ANALYTICS_ID
        ],
        gtagConfig: {
          anonymize_ip: true,
          cookie_expires: 0,
          send_page_view: true
        },
        pluginConfig: {
          head: false,
          respectDNT: true
        },
      },
    },
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-mdx",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    }
  ],
};
