import * as React from "react"
import { useStaticQuery, graphql, withPrefix } from "gatsby"
import { useLocalization } from "../hooks/use-localization"

const Head = ({ location, pageContext }) => {
  const { locale, config, defaultLang } = useLocalization()
  const data = useStaticQuery(graphql`
    query LocalizationSEOQuery {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `)
  const defaultSiteUrl = data.site.siteMetadata.siteUrl
  const { pathname } = location

  return (
    <>
      <html lang={pageContext.hrefLang} />
      <link rel="alternate" hrefLang="x-default" href={defaultSiteUrl} />
      <link
        rel="alternate"
        hrefLang={pageContext.hrefLang}
        href={`${defaultSiteUrl}${
          pathname === withPrefix(`/`) ? `` : pathname
        }`}
      />
      {config.map((l) => {
        let href

        if (l.code === locale) return null

        if (l.code === defaultLang) {
          href = `${defaultSiteUrl}${
            pageContext.originalPath === withPrefix(`/`)
              ? ``
              : pageContext.originalPath
          }`
        } else {
          href = `${defaultSiteUrl}${withPrefix(
            `/${l.code}${pageContext.originalPath}`
          )}`
        }

        return (
          <link
            key={l.code}
            rel="alternate"
            hrefLang={l.hrefLang}
            href={href}
          />
        )
      })}
      <meta
        property="og:locale"
        content={pageContext.hrefLang.replace(`-`, `_`)}
      />
      {config.map((l) => {
        if (l.code === locale) return null
        return (
          <meta
            key={l.code}
            property="og:locale:alternate"
            content={l.hrefLang.replace(`-`, `_`)}
          />
        )
      })}
    </>
  )
}

export { Head }
