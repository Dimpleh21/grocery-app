import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Tabar from "./components/Tabar";
import Items from "./components/Items";
import ViewCart from "./components/ViewCart";
import Offers from "./components/Offers";
export default function Home() {
  return (
    <div className="">
      <div className="flex flex-col">
        <Items />
      </div>

      <ViewCart />
    </div>
  );
}
