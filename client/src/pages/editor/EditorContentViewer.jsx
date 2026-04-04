import React from "react";
import { Link, useParams } from "react-router-dom";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";

export default function EditorContentViewer() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { id } = useParams();
  const [frameComment, setFrameComment] = React.useState("");
  const [comments, setComments] = React.useState([
    { id: 1, frame: "00:18", text: "Tighten this sentence for clarity." },
    { id: 2, frame: "00:44", text: "Replace this visual with product screenshot." },
  ]);

  const addComment = () => {
    if (!frameComment.trim()) return;
    setComments((prev) => [...prev, { id: Date.now(), frame: "Now", text: frameComment.trim() }]);
    setFrameComment("");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <EditorNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Content Viewer</h1>
                <p className="mt-2 text-sm text-slate-500">Content ID: {id}. Annotate frame-level feedback and submit for formal review.</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/content/${id}/versions`} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Version history</Link>
                <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">Submit for review</button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.5fr,1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 text-sm font-medium text-slate-700">Stream Preview</div>
              <div className="flex h-96 items-center justify-center rounded-xl bg-slate-900 text-slate-100">Media stream preview canvas</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Frame Comments</h2>
              <div className="mt-3 space-y-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">{comment.frame}</p>
                    <p className="mt-1 text-sm text-slate-700">{comment.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <textarea
                  rows={3}
                  value={frameComment}
                  onChange={(e) => setFrameComment(e.target.value)}
                  placeholder="Leave frame-level comment"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
                <button onClick={addComment} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Add comment</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


