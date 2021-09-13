import fs from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import path from "path";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { postFilePaths, POSTS_PATH } from "../lib/mdxUtils";
import InfoPageLayout from "../components/InfoPageLayout";
import { ResponsiveImg } from "../components/ResponsivePixelImg";
import dynamic from "next/dynamic";

const WizardMap = dynamic(() => import("../components/Lore/WizardMapLeaflet"), {
  ssr: false
});

const components = {
  Head,
  InfoPageLayout,
  ResponsiveImg,
  WizardMap
};

export default function WtfPage({
  source,
  frontMatter
}: {
  source: { compiledSource: string; scope: any };
  frontMatter: any;
}) {
  return <MDXRemote {...source} components={components} />;
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = "wtf";
  const localizedPostFilePath = path.join(
    POSTS_PATH,
    "..",
    "md",
    `${slug}.${locale}.md`
  );
  const postFilePath = path.join(POSTS_PATH, "..", "md", `${slug}.md`);

  const postFilePathToLoad = fs.existsSync(localizedPostFilePath)
    ? localizedPostFilePath
    : postFilePath;

  const source = fs.readFileSync(postFilePathToLoad);
  const { content, data } = matter(source);
  const mdxSource = await serialize(content, {
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
