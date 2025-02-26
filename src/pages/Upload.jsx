import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";

const API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`;
const AI_CAPTION_API = "https://meme-api.com/generate"; // Example API for AI captions

export default function Upload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  // Upload Image to ImgBB
  const uploadImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage.split(",")[1]); // Extract Base64 data
      const response = await axios.post(API_URL, formData);
      const imageUrl = response.data.data.url;
      setUploadedUrl(imageUrl);

      // Store meme in local storage
      const userMemes = JSON.parse(localStorage.getItem("userMemes") || "[]");
      const newMeme = { image: imageUrl, caption };
      localStorage.setItem("userMemes", JSON.stringify([...userMemes, newMeme]));

      toast.success("Meme uploaded successfully!");
    } catch (error) {
      toast.error("Upload failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch AI Caption
  const generateAICaption = async () => {
    if (!selectedImage) {
      toast.error("Upload an image first!");
      return;
    }
    try {
      const response = await axios.get(AI_CAPTION_API);
      setCaption(response.data.text || "Generated Caption 🤖");
    } catch (error) {
      toast.error("Failed to generate caption.");
    }
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Upload Your Meme 🚀
      </h2>

      {/* Dropzone */}
      <div {...getRootProps()} className="border-2 border-dashed p-10 cursor-pointer rounded-lg bg-gray-100 dark:bg-gray-800">
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-500" />
        <p className="text-gray-500">Drag & drop an image or click to upload</p>
      </div>

      {/* Preview */}
      {selectedImage && (
        <motion.div
          className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img src={selectedImage} alt="Meme Preview" className="w-full h-60 object-cover rounded-lg" />

          {/* Caption Input */}
          <div className="mt-4">
            <textarea
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="Add a funny caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            {/* AI Caption Generator */}
            <button
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
              onClick={generateAICaption}
            >
              Generate AI Caption 🤖
            </button>
          </div>
        </motion.div>
      )}

      {/* Upload Button */}
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-500"
        onClick={uploadImage}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Meme"}
      </button>

      {/* Uploaded Image Link */}
      {uploadedUrl && (
        <p className="mt-4 text-green-600">
          Meme uploaded! <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="underline">View it here</a>
        </p>
      )}
    </div>
  );
}
