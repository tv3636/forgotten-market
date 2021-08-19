import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import path from "path";
import InfoPageLayout from "../../components/InfoPageLayout";
import { postFilePaths, POSTS_PATH } from "../../lib/mdxUtils";
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
`;
const Description = styled.div``;
const BlogEntries = styled.ul`
  list-style: none;
  padding-inline-start: 0;
  margin-top: 3em;
`;
const BlogEntry = styled.li`
  margin: 2em 0;
`;

export default function Index({ posts }: { posts: Post[] }) {
  return (
    <InfoPageLayout title="Blog Posts: Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      <h1>Forgotten Blog Posts</h1>
      <BlogEntries>
        {posts.map((post) => (
          <BlogEntry key={post.filePath}>
            <Link
              as={`/posts/${post.filePath.replace(/\.mdx?$/, "")}`}
              href={`/posts/[slug]`}
            >
              <StyledAnchor>{post.data.title}</StyledAnchor>
            </Link>
            {post.data.description && (
              <Description>{post.data.description}</Description>
            )}
          </BlogEntry>
        ))}
      </BlogEntries>
    </InfoPageLayout>
  );
}

export function getStaticProps() {
  const posts = postFilePaths.map((filePath) => {
    const source = fs.readFileSync(path.join(POSTS_PATH, filePath));
    const { content, data } = matter(source);

    return {
      content,
      data,
      filePath
    };
  });

  return { props: { posts } };
}
