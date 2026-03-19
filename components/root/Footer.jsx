const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black-200 py-4 border-t border-zinc-900">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="mb-4 md:mb-0 text-xs font-semibold text-white">
          {/* <Image src={logo} alt="Logo" className="h-8 w-auto" /> */}
          LOGO
        </div>

        <div className="flex flex-wrap justify-center md:justify-start mb-4 md:mb-0">
          <ul className="flex space-x-4 text-xs font-semibold text-white">
            <li>
              <a href="/properties">Properties</a>
            </li>
            <li>
              <a href="/terms">Terms of Service</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-white mt-2 md:mt-0">
            &copy; {currentYear} CrystalClear. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
