import Comments from "@/app/components/Comments";
import getAllPosts from "@/lib/getAllPosts";
import getPost from "@/lib/getPost";
import getPostComments from "@/lib/getPostComment";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
    const { id } = params;
    const post = await getPost(id);

    return {
        title: post.title,
        description: post.body,
    };
}

// 1. Page starts loading
export default async function PostPage({ params }) {
    const { id } = params;

    // sequential data fetching
    // const posts = await getPost(id);
    // const comments = await getPostComments(id);

    // 2. Both fetches start immediately
    // parallel data fetching | using promise
    const postPromise = getPost(id);
    const commentsPromise = getPostComments(id);
    // const [post, comments] = await Promise.all([postPromise, commentsPromise]);
    // 3. Wait for post (blocks rendering)
    const post = await postPromise;


    // 4. Page renders with post data
    // 5. Suspense shows fallback for comments
    // 6. Comments resolve → replace fallback

    return (
        <div className="mt-6">
            <h2 className="text-blue-500">{post.title}</h2>
            <p className="mt-3">{post.body}</p>
            <hr />
            <Suspense fallback="<h1>Loading comments...</h1>">
                <Comments promise={commentsPromise} />
            </Suspense>
        </div>
    );
}

export async function generateStaticParams() {
    const posts = await getAllPosts();

    return posts.map((post) => ({
        id: post.id.toString(),
    }));
}
