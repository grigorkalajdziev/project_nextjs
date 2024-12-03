import { MdClose } from "react-icons/md";

const SearchOverlay = ({ activeStatus, getActiveStatus }) => {
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
          <input type="search" placeholder="Search Products..." />
        </form>
        <div className="search-overlay__hint"># Hit enter to search</div>
      </div>
      {/*=======  End of search overlay content  =======*/}
    </div>
  );
};

export default SearchOverlay;
