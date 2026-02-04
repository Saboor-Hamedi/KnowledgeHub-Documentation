import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { Save, AlertCircle, ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import MarkdownEditor from "../components/MarkdownEditor";

export default function CreatePost() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const textareaRef = useRef(null);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("blog");
  const [editingPost, setEditingPost] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [title]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);
    });

    if (location.state?.editPost) {
      const post = location.state.editPost;
      setEditingPost(post);
      setTitle(post.title);
      setContent(post.content);
      setPostType(post.type === "update" ? "blog" : post.type || "blog");
    } else if (location.state?.type) {
      setPostType(location.state.type);
    }
  }, [location.state, navigate]);

  async function handleSave() {
    if (!user) return;
    if (!title || !content) {
      setError("Title and content are required");
      return;
    }

    setSaving(true);
    setError(null);

    const postData = {
      title,
      content,
      language: "markdown",
      type: postType,
      user_id: user.id,
    };

    let result;
    if (editingPost) {
      result = await supabase
        .from("posts")
        .update(postData)
        .eq("id", editingPost.id)
        .select();
    } else {
      result = await supabase.from("posts").insert([postData]).select();
    }

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      if (postType === "documentation") {
        navigate(`/doc/snippet/${result.data[0].id}`);
      } else {
        navigate("/blog");
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-medium hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-3">
              {/* Post Type Toggle */}
              <div className="inline-flex bg-gray-100/80 rounded-lg p-0.5">
                <button
                  onClick={() => setPostType("blog")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                    postType === "blog"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Blog
                </button>
                <button
                  onClick={() => setPostType("documentation")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                    postType === "documentation"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Doc
                </button>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving || title.length === 0}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm ${
                  saving || title.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white hover:shadow-md active:scale-[0.98]"
                }`}
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : editingPost ? "Update" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-8">
          <div className="prose max-w-none prose-lg mx-auto w-full">
            {/* Title Input */}
            <div className="relative group">
              <textarea
                ref={textareaRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  postType === "documentation"
                    ? "Document title..."
                    : "Post title..."
                }
                className="w-full bg-transparent text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 border-0 focus:ring-0 outline-none placeholder:text-gray-400 placeholder:font-normal resize-none overflow-hidden py-2 sm:py-3 leading-tight transition-colors"
                rows={1}
              />

              {/* Title Character Counter (Optional) */}
              <div className="absolute -bottom-6 right-0 text-xs text-gray-400">
                {title.length}/100
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm font-medium"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Divider */}
            <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Editor Area */}
            <div className="w-full">
              <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="Start writing..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
