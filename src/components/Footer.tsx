import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#1c1c1c] text-white py-12 sm:py-16 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Social Navigation Links matching the demo exactly */}
        <div className="flex flex-col space-y-3 sm:space-y-3.5 mb-10 text-sm sm:text-base font-medium text-slate-300">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400 transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400 transition-colors"
          >
            Twitter
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400 transition-colors"
          >
            FaceBook
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400 transition-colors"
          >
            LinkedIn
          </a>
        </div>

        {/* Copyright notice matching screenshot */}
        <p className="text-xs sm:text-sm text-slate-400 tracking-wide mt-6">
          © 2026 Bản quyền Foodzy của Arioum
        </p>
      </div>
    </footer>
  );
};
