import { IoIosSearch } from "react-icons/io";

const MobileMenuSearch = () => {
  return (
    <div className="offcanvas-mobile-menu__search">
      <form>
        <input type="search" placeholder="Search here" />
        <button type="submit">
          <IoIosSearch />
        </button>
      </form>
    </div>
  );
};

export default MobileMenuSearch;
