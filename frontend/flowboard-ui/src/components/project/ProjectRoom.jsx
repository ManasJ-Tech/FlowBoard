import { useEffect, useState, useRef } from "react";
import { getRoomMessages, postRoomMessage } from "@/services/roomService";
import { connectSocket, disconnectSocket } from "@/services/socketService";
import { getUserById } from "@/services/userService";

function ProjectRoom({ projectId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [type, setType] = useState("suggestion");
  const [replyingTo, setReplyingTo] = useState(null);
  const listRef = useRef(null);
  const MESSAGE_LIMIT = 50; // show up to this many recent messages

  async function load() {
    try {
      const data = await getRoomMessages(projectId);
      const ordered = data.reverse(); // older -> newer
      const initial = ordered.slice(-MESSAGE_LIMIT);
      setMessages(initial);

      // resolve any missing user objects by fetching user info
      const missing = Array.from(new Set(initial.filter(m => !m.user && m.userId).map(m => m.userId)));
      if (missing.length) {
        const users = {};
        await Promise.all(missing.map(async (id) => {
          try {
            const u = await getUserById(id);
            users[id] = u;
          } catch (e) {
            // ignore
          }
        }));

        setMessages((cur) => cur.map(m => m.user ? m : ({ ...m, user: users[m.userId] || null })));
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();

    connectSocket((message) => {
      // only handle messages for this project topic
        if (String(message.projectId) === String(projectId)) {
        // ignore if we already have this id
        (async () => {
          setMessages((current) => {
            if (current.find((c) => c.id === message.id)) return current;
            return [...current, message].slice(-MESSAGE_LIMIT);
          });

          // if message lacks user but has userId, fetch and attach
          if (!message.user && message.userId) {
            try {
              const u = await getUserById(message.userId);
              setMessages((cur) => cur.map(m => m.id === message.id ? { ...m, user: u } : m));
            } catch (e) {
              // ignore
            }
          }
        })();

        // scroll to bottom
        setTimeout(() => {
          if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
        }, 50);
      }
    }, `/topic/project.${projectId}`);

    return () => {
      disconnectSocket();
    };
  }, [projectId]);

  async function handleSend(e) {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      const payload = {
        content: text,
        messageType: type,
        userId: Number(localStorage.getItem("userId")) || null,
      };

      if (replyingTo) payload.parentId = replyingTo;

      const saved = await postRoomMessage(projectId, payload);

      // append saved message (websocket may also deliver it; duplicate guarded above)
      setMessages((m) => [...m, saved].slice(-MESSAGE_LIMIT));

      // ensure saved has user object (server should populate it now)
      if (!saved.user && saved.userId) {
        try {
          const u = await getUserById(saved.userId);
          setMessages((cur) => cur.map(msg => msg.id === saved.id ? { ...msg, user: u } : msg));
        } catch (e) {}
      }

      setText("");
      setReplyingTo(null);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="rounded-xl border border-surface-strong bg-surface-soft p-4">
      <div ref={listRef} className="max-h-[60vh] overflow-auto space-y-3 mb-3">
        {messages.map((m) => (
          <div key={m.id || Math.random()} className="p-3 rounded-md border bg-surface">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-custom">{m.user?.fullName || m.user?.email || "Unknown"} • {new Date(m.createdAt).toLocaleString()}</div>
              <button onClick={() => setReplyingTo(m.id)} className="text-sm text-primary underline">Reply</button>
            </div>

            {m.parentMessage && (
              <div className="mt-2 p-2 rounded bg-surface-soft text-sm text-muted-custom">Replying to: {m.parentMessage.content}</div>
            )}

            <div className="mt-1 text-slate-900">{m.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 flex-col sm:flex-row">
        <div className="flex gap-2 items-center">
          <select value={type} onChange={(e) => setType(e.target.value)} className="px-2 rounded-md border">
          <option value="suggestion">Suggestion</option>
          <option value="issue">Issue</option>
          <option value="progress">Progress</option>
        </select>
        </div>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={replyingTo ? "Write a reply..." : "Write a message..."} className="flex-1 px-3 py-2 rounded-md border" />
        <div className="flex gap-2">
          {replyingTo && <button type="button" onClick={() => setReplyingTo(null)} className="px-3 py-2 rounded-md border">Cancel</button>}
          <button className="px-4 py-2 rounded-md bg-primary text-white">Send</button>
        </div>
      </form>
    </div>
  );
}

export default ProjectRoom;
