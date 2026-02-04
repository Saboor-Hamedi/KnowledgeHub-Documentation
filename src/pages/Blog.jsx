import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Tag,
  ChevronLeft,
  Save,
  AlertCircle,
  BookOpen,
  Terminal,
  Shield,
  Layers,
  Users,
  Cloud,
  Palette,
  Settings,
  ChevronRight,
  Menu,
  X,
  ChevronDown,
  User,
  Zap,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import DeleteConfirmModal from "../components/ui/DeleteConfirmModal";
import SidebarLayout from "../components/layout/SidebarLayout";
import ArticleLayout from "../components/layout/ArticleLayout";
import BreadCrumb from "../components/ui/BreadCrumb";
import SidebarTitle from "../components/ui/SidebarTitle";
import { checkActiveRoute } from "../components/utils/checkActiveRoute";
export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteOnSuccess, setDeleteOnSuccess] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("blog");
  const [error, setError] = useState(null);

  const recentPosts = posts.slice(0, 5); // Recent 5 for sidebar

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(username)")
      .eq("type", "blog")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setPosts(data);
    setLoading(false);
  }

  function requestDelete(id, onSuccess) {
    setPostToDelete(id);
    setDeleteOnSuccess(() => onSuccess); // Function wrapper to store function in state
    setDeleteModalOpen(true);
  }

  async function performDelete() {
    if (!postToDelete) return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postToDelete);
    if (error) {
      setError(error.message);
    } else {
      await fetchPosts();
      if (deleteOnSuccess) deleteOnSuccess();
    }
    setDeleteModalOpen(false);
    setPostToDelete(null);
    setDeleteOnSuccess(null);
  }

  function startEdit(post) {
    navigate("/create", { state: { editPost: post } });
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    fetchPosts();

    // Handle initial hash scroll
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  }, [location.hash]);


  const sidebarContent = (
    <div className="space-y-10">
      {/* Recent Updates Mini-list */}
      <div>
        <h5 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400 px-2">
          Recent Posts
        </h5>
        <div className="space-y-1">
          {recentPosts.map((p) => {
            const isActive = checkActiveRoute(`/blog/${p.id}`, {
              basePath: "/blog",
              isFirstItem: p.id === recentPosts[0].id,
              items: recentPosts,
              currentPath: location.pathname,
            });
            
            return (
              <SidebarTitle
                key={p.id}
                onClick={() => navigate(`/blog/${p.id}`)}
                title={p.title}
                isActive={isActive}
              />
            );
          })}
        </div>
      </div>
    </div>
  );

 
  return (
    <SidebarLayout sidebar={sidebarContent} variant="blog">
      {loading && posts.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-end mb-8"></div>

          {error && (
            <div className="mb-8 flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <Routes>
            <Route
              index
              element={
                <BlogFeed
                  posts={posts}
                  user={user}
                  startEdit={startEdit}
                  handleDelete={requestDelete}
                />
              }
            />
            <Route
              path=":id"
              element={
                <BlogDetail
                  user={user}
                  startEdit={startEdit}
                  handleDelete={requestDelete}
                />
              }
            />
          </Routes>
        </>
      )}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={performDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </SidebarLayout>
  );
}

const BlogFeed = ({ posts, user, startEdit, handleDelete }) => {
  // Show only the latest post on the index page
  const latestPost = posts.length > 0 ? posts[0] : null;

  return (
    <motion.div
      key="list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      {!latestPost ? (
        <div className="text-center py-20 px-4 glass rounded-3xl border-dashed border-2 border-gray-300">
          <div className="text-gray-500 italic">No posts published yet.</div>
        </div>
      ) : (
        <div className="space-y-12">
          <BreadCrumb
            label={latestPost.title}
            parentLink="/blog"
            parentLabel="Blog"
          />
          <ArticleLayout
            post={latestPost}
            user={user}
            onEdit={startEdit}
            onDelete={handleDelete}
            className="border-b border-gray-100 pb-12"
          />
        </div>
      )}
    </motion.div>
  );
};

const BlogDetail = ({ user, startEdit, handleDelete }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const { data } = await supabase
        .from("posts")
        .select("*, profiles(username)")
        .eq("id", id)
        .maybeSingle();

      setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
      </div>
    );

  if (!post)
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <div className="text-gray-500">Post not found.</div>
        <Link
          to="/blog"
          className="text-indigo-500 text-sm mt-4 inline-block hover:underline"
        >
          Back to blog
        </Link>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-20"
    >
      <div className="mb-8">
        <BreadCrumb label={post?.title} parentLink="/blog" parentLabel="Blog" />
      </div>

      <ArticleLayout
        post={post}
        user={user}
        onEdit={startEdit}
        onDelete={(id) => handleDelete(id, () => navigate("/blog"))}
      />
    </motion.div>
  );
};
