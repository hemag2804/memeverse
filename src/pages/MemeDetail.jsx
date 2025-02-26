import { useParams } from "react-router-dom";

export default function MemeDetail() {
  let { id } = useParams();
  return <div className="text-center text-2xl p-5">Meme Detail: {id}</div>;
}
