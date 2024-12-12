import { MdClose } from "react-icons/md";
import { useLocalization } from "../../../context/LocalizationContext";

const SearchOverlay = ({ activeStatus, getActiveStatus }) => {
  const { t } = useLocalization();
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
        <form className="space-mb--20">
          <input type="search" placeholder={t("search_products_placeholder")} />
        </form>
        <div className="search-overlay__hint">{t("search_hint")}</div>
      </div>
      {/*=======  End of search overlay content  =======*/}
    </div>
  );
};

export default SearchOverlay;
