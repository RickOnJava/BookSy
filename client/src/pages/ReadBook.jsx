import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { apiURL } from "../api/axios";

export default function ReadBook() {
  const { id } = useParams();
  const [streamUrl, setStreamUrl] = useState("");

  useEffect(() => {
  api.get(`/ebooks/${id}/stream-token`)
    .then(res => {
      setStreamUrl(
        `${apiURL}/api/ebooks/${id}/stream?token=${res.data.token}`
      );
    })
    .catch(() => {
      alert("You have not purchased this book");
    });
}, [id]);

  if (!streamUrl) return <p>Loading...</p>;

  return (
    <iframe
      src={streamUrl}
      className="w-full h-screen"
      title="ebook"
    />
  );
}
