import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="border-b border-[#E5E7EB] bg-[#FAFAFA]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-10 bg-[#FFE600]" />
          <div className="text-[1.4rem] font-semibold tracking-[-0.02em] text-[#1A1A1A]">
            CX Studio
          </div>
        </div>

        <nav className="hidden items-center gap-10 text-[0.98rem] text-[#4B5563] lg:flex">
          <Link to="/#overview" className="transition hover:text-[#1A1A1A]">
            Overview
          </Link>
          <Link to="/#dimensions" className="transition hover:text-[#1A1A1A]">
            Dimensions
          </Link>
          <Link to="/#process" className="transition hover:text-[#1A1A1A]">
            Process
          </Link>
          <Link to="/start-assessment" className="transition hover:text-[#1A1A1A]">
            Start Assessment
          </Link>
        </nav>
      </div>
    </header>
  );
}
