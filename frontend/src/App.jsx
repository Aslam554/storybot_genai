import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function App() {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [poem, setPoem] = useState("");
  const [loading, setLoading] = useState(false);
  const [writingType, setWritingType] = useState("story"); // "story" or "poem"

  const generateContent = async (type) => {
    if (!prompt) return;
    setLoading(true);
    setWritingType(type);
    
    try {
      const response = await axios.post("https://storybot-genai-1.onrender.com/generate", { prompt, type });
      if (type === "story") {
        setStory(response.data.story);
        setPoem(""); // Clear poem if a story is generated
      } else {
        setPoem(response.data.poem);
        setStory(""); // Clear story if a poem is generated
      }
    } catch (error) {
      if (type === "story") {
        setStory("Error generating story.");
      } else {
        setPoem("Error generating poem.");
      }
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    const content = writingType === "story" ? story : poem;
    navigator.clipboard.writeText(content);
    alert("Copied to clipboard! ✅");
  };

  const editContent = () => {
    setPrompt(writingType === "story" ? story : poem);
    setStory("");
    setPoem(""); // Clear display for editing
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <motion.h1
        className="text-4xl font-bold mb-6 text-center text-blue-400"
        animate={{ scale: 1.1 }}
      >
        ✨ StoryBot AI ✨
      </motion.h1>

      {/* Input Box */}
      <div className="w-full max-w-2xl">
        <textarea
          className="w-full p-4 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          placeholder="Enter a theme or idea..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="mt-4 flex space-x-4">
          <button
            className="w-1/2 bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-lg text-lg font-semibold transition-all"
            onClick={() => generateContent("story")}
            disabled={loading}
          >
            {loading && writingType === "story" ? "Generating..." : "Write Story 📖"}
          </button>
          <button
            className="w-1/2 bg-purple-500 hover:bg-purple-600 px-5 py-3 rounded-lg text-lg font-semibold transition-all"
            onClick={() => generateContent("poem")}
            disabled={loading}
          >
            {loading && writingType === "poem" ? "Generating..." : "Write Poem ✍️"}
          </button>
        </div>
      </div>

      {/* Story or Poem Output */}
      {(story || poem) && (
        <motion.div
          className="mt-6 p-6 bg-gray-800 rounded-lg w-full max-w-3xl relative shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Buttons at the Top */}
          <div className="flex justify-between mb-3">
            <button
              onClick={copyToClipboard}
              className="text-sm px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-all"
            >
              📋 Copy
            </button>
            <button
              onClick={editContent}
              className="text-sm px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-all"
            >
              ✏️ Edit
            </button>
          </div>

          {/* Story Display */}
          {story && (
            <div className="max-h-100 overflow-y-auto p-3 bg-gray-900 text-lg leading-relaxed custom-scrollbar">
              <p>{story}</p>
            </div>
          )}

          {/* Poem Display (Each Line Separately) */}
          {poem && (
            <div className="max-h-100 overflow-y-auto p-3 bg-gray-900 text-lg leading-relaxed custom-scrollbar">
              {poem.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default App;
