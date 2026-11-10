export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-slate-950/70 px-4 py-5 backdrop-blur-xl sm:px-6 sm:py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
        <p className="text-xs text-gray-400 sm:text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-white">
            Dulanjana Kumarasinghe
          </span>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}