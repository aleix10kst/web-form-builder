export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Your site name",
  description: "The description of the site",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://your-side.dev",
  ogImage: "https://your-site-rul.dev/opengraph-image.png",
  links: {
    x: "https://twitter.com/your-username",
    github: "https://github.com/your-username/your-site-repo.dev",
    githubProfile: "https://github.com/your-username",
    discord: "https://discord.com/users/your-username",
    calDotCom: "https://cal.com/your-username",
  },
}
