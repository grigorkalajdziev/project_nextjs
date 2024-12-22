import { MdClose } from "react-icons/md";
import { useRouter } from "next/router";
import { useState } from "react";
import { useLocalization } from "../../../context/LocalizationContext";

const SearchOverlay = ({ activeStatus, getActiveStatus  }) => {  
  const { t } = useLocalization(); 
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop/left-sidebar?search=${searchTerm}`);
      getActiveStatus(false);
      document.querySelector("body").classList.remove("overflow-hidden");
    }
  }

  return (
    <div className={`search-overlay ${activeStatus ? "active" : ""}`}>
      {/*=======  close icon  =======*/}
      <button
        className="search-overlay__close-icon"
        onClick={() => {
          getActiveStatus(false);
          document.querySelector("body").classList.remove("overflow-hidden");
        }}
      >
        <MdClose />
      </button>
      {/*=======  End of close icon  =======*/}
      {/*=======  search overlay content  =======*/}
      <div className="search-overlay__content">
        <form className="space-mb--20" onSubmit={handleSearch}>
          <input type="search" placeholder={t("search_products_placeholder")} value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}/>
        </form>
        <div className="search-overlay__hint">{t("search_hint")}</div>
      </div>
      {/*=======  End of search overlay content  =======*/}
    </div>
  );
};

export default SearchOverlay;
