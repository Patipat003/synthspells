import Link from "next/link";
import { Home, Menu, Music, Plus } from "lucide-react";

type ModalProps = {
  openModal: () => void;
};

const MobileMenu = ({ openModal }: ModalProps) => {
  return (
    <div className="justify-end content-center drawer-end block md:hidden">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label
          htmlFor="my-drawer-4"
          className="drawer-button flex items-center gap-2 border-1 border-violet-800 bg-black/10 px-4 py-2 rounded-md font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </label>
      </div>

      <div className="drawer-side">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <ul className="menu bg-indigo-950 text-gray-300 px-4 sm:px-6 py-4 sticky top-0 z-50 border-b border-white/10 shadow-2xl backdrop-blur-sm min-h-full w-80 p-4">
          <li>
            <Link
              href="/"
              className="flex items-center gap-3 text-lg font-semibold transition-all duration-300 px-3 py-2 rounded-lg group"
            >
              <Home className="w-5 h-5 group-hover:animate-bounce" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/playlist"
              className="flex items-center gap-3 text-lg font-semibold transition-all duration-300 px-3 py-2 rounded-lg group"
            >
              <Music className="w-5 h-5 group-hover:animate-bounce" />
              <span>Playlist</span>
            </Link>
          </li>
          <li>
            <button
              onClick={openModal}
              className="flex items-center gap-3 text-lg font-semibold transition-all duration-300 px-3 py-2 rounded-lg group w-full text-left"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>New</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default MobileMenu;
