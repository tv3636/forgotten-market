import fs from "fs";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import styled from "@emotion/styled";
import Layout from "../../components/InfoPageLayout";
import WizardArt from "../../components/WizardArt";
import { postFilePaths, POSTS_PATH } from "../../lib/mdxUtils";
import dynamic from "next/dynamic";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { GetStaticPaths, GetStaticProps } from "next";
// import CustomLink from "../../components/CustomLink";
// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components = {
  //   a: CustomLink,
  // It also works with dynamically-imported components, which is especially
  // useful for conditionally loading components for certain routes.
  // See the notes in README.md for more details.
  //   TestComponent: dynamic(() => import("../../components/TestComponent")),
  Head,
  WizardArt
};

const NavAnchor = styled.a`
  text-decoration: none;
  font-style: italic;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;

export default function PostPage({
  source,
  frontMatter
}: {
  source: { compiledSource: string; scope: any };
  frontMatter: any;
}) {
  const title = `${frontMatter.title} | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs`;
  return (
    <Layout title={title} description={frontMatter.description}>
      <header>
        <nav>
          <Link href="/posts">
            <NavAnchor>{"<"} All Posts</NavAnchor>
          </Link>
        </nav>
      </header>
      <div className="post-header">
        <h1>{frontMatter.title}</h1>
        {frontMatter.description && (
          <p className="description">{frontMatter.description}</p>
        )}
      </div>
      <MDXRemote {...source} components={components} />
      <style jsx>{`
        .post-header h1 {
          margin-bottom: 0;
        }
        .post-header {
          margin-bottom: 1rem;
        }
        .description {
          opacity: 0.6;
        }
      `}</style>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const localizedPostFilePath = path.join(
    POSTS_PATH,
    `${params?.slug}.${locale}.md`
  );
  const postFilePath = path.join(POSTS_PATH, `${params?.slug}.md`);
  const postFilePathToLoad = fs.existsSync(localizedPostFilePath)
    ? localizedPostFilePath
    : postFilePath;

  console.log("postFilePathToLoad: ", postFilePathToLoad);

  const source = fs.readFileSync(postFilePathToLoad);

  const { content, data } = matter(source);

  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings]
    },
    scope: data
  });

  return {
    props: {
      source: mdxSource,
      frontMatter: data
    }
  };
};

export const getStaticPaths: GetStaticPaths = async ({
  locales,
  defaultLocale
}) => {
  const paths = postFilePaths
    // Remove file extensions for page paths
    // including locales
    .map((path) => {
      const slug = path.replace(/(\.(\w\w-?(\w\w)?))?\.mdx?$/, "");
      const localeMatch = path.match(/(\.(\w\w-?(\w\w)?))?\.mdx?$/);
      const locale =
        localeMatch && localeMatch[2]
          ? localeMatch[2]
          : defaultLocale || "en-US";
      return { slug, locale };
    })
    // Map the path into the static paths object required by Next.js
    .map(({ slug, locale }) => ({ params: { slug }, locale }));

  return {
    paths,
    fallback: false
  };
};
