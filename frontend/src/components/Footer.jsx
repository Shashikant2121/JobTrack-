const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-sm text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} JobTrack. All rights reserved.</p>

        <p>
          Created by{" "}
          <span className="font-semibold text-slate-700">Shashikant</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
