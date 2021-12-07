require('dotenv').config();

module.exports = {
  siteMetadata: {
    siteLanguage: "en",
    title: "Ultra Sound Music",
    description: "Ultra Sound Music: A unique, collaborative platform for virtual musicians to publish generative music on the blockchain.",
    siteUrl: "https://ultrasoundmusic.xyz",
    baseUrl: "https://ultrasoundmusic.xyz",    
    image: "/logo.png",
    twitterUsername: "@usmproject",
  },
  plugins: [
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        sassRuleModulesTest: /\.s[ac]ss$/i,
      }
    },
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
        name: `Ultra Sound  Music`,
        short_name: `usm`,        
        icon: "src/images/logo.png",
      },
    },
    "gatsby-plugin-mdx",
    // {
    //   resolve: "gatsby-plugin-react-svg",
    //   options: {
    //     rule: {
    //       include: /images/
    //     }
    //   }
    // },
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
