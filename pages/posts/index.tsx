import { POSTS_PATH, postFilePaths } from "../../lib/mdxUtils";
import { fileLocale, pickBestByLocale } from "../../lib/localeTools";

import { GetStaticProps } from "next";
import InfoPageLayout from "../../components/InfoPageLayout";
import Link from "next/link";
import compact from "lodash/compact";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import styled from "@emotion/styled";

export type Post = {
  content: string;
  data: any;
  filePath: string;
};

const StyledAnchor = styled.a`
  font-size: 1.2em;
  margin-bottom: 0.3em;
  display: inline-block;
  cursor: pointer;
  text-decoration: none;

  &:hover > h2 {
    text-decoration: underline;
  }
`;
const Description = styled.div``;
const BlogEntries = styled.ul`
  list-style: none;
  padding-inline-start: 0;
`;
const BlogEntry = styled.li`
  margin: 2em 0;
`;

export default function Index({ posts }: { posts: Post[] }) {
  // sort the blog posts by their index in the descending order
  posts.sort((a:Post, b:Post) => {
    const indexA = a.data.index ? a.data.index : 99999;
    const indexB = b.data.index ? b.data.index : 99999;
    return indexB - indexA;
  })
  return (
    <InfoPageLayout title="Blog Posts: Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      <h1>Forgotten Blog Posts</h1>
      <BlogEntries>
        {posts.map((post) => (
          <BlogEntry key={post.filePath}>
            <Link
              as={`/posts/${post.filePath.replace(
                /(\.(\w\w-?(\w\w)?))?\.mdx?$/,
                ""
              )}`}
              href={`/posts/[slug]`}
              passHref={true}
            >
              <StyledAnchor>
                <h2>{post.data.index}. {post.data.title}</h2>
                {post.data.description && (
                  <Description>{post.data.description}</Description>
                )}
              </StyledAnchor>
            </Link>
          </BlogEntry>
        ))}
      </BlogEntries>
    </InfoPageLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({
  locale,
  locales,
  defaultLocale,
}) => {
  let posts = compact(
    postFilePaths.map((filePath) => {
      const { basename, localeExt } = fileLocale(filePath);
      const source = fs.readFileSync(path.join(POSTS_PATH, filePath));
      const { content, data } = matter(source);

      return {
        content,
        data,
        filePath,
        basename,
        locale: localeExt,
      };
    })
  );
  posts = pickBestByLocale(locale || "default", posts);

  return { props: { posts } };
};
