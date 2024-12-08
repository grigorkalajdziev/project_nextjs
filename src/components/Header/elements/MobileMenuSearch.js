import { IoIosSearch } from "react-icons/io";
import { useLocalization } from "../../../context/LocalizationContext";

const MobileMenuSearch = () => {
  const { t } = useLocalization();  
  return (
    <div className="offcanvas-mobile-menu__search">
      <form>
        <input type="search" placeholder={t("search_here")} />
        <button type="submit">
          <IoIosSearch />
        </button>
      </form>
    </div>
  );
};

export default MobileMenuSearch;
