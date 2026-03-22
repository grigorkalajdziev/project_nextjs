import { Badge } from "react-bootstrap";
import { IoIosSearch } from "react-icons/io";
import { IoFilter } from "react-icons/io5";

const UsersTab = ({
  t,
  allUsers,
  userSearchQuery, setUserSearchQuery,
  userFilterRole, setUserFilterRole,
  currentPageUsers, setCurrentPageUsers,
  usersPerPage,
  showUserFilters, setShowUserFilters,
}) => {
  const filteredUsers = allUsers
    .filter((usr) => {
      const searchLower = userSearchQuery.toLowerCase();
      return (
        usr.displayName?.toLowerCase().includes(searchLower) ||
        usr.email?.toLowerCase().includes(searchLower) ||
        usr.firstName?.toLowerCase().includes(searchLower) ||
        usr.lastName?.toLowerCase().includes(searchLower)
      );
    })
    .filter((usr) => (userFilterRole === "all" ? true : usr.role === userFilterRole));

  const totalPagesUsers = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPageUsers * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="my-account-area__content">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h3 className="mb-0">{t("users")}</h3>
        {allUsers.length > 0 && (
          <span className="badge bg-primary" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>
            {allUsers.length} {t("total_users")}
          </span>
        )}
      </div>

      {allUsers.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="bi bi-people" style={{ fontSize: "3rem", color: "#ccc" }}></i>
            <p className="mt-3 mb-0 text-muted">{t("no_users_found")}</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            {/* Filters */}
            <div className="filter-section mb-4">
              <div className="d-flex align-items-center mb-3">
                <button
                  type="button"
                  className={`btn btn-outline-secondary d-flex align-items-center justify-content-center me-3 filter-toggle ${showUserFilters ? "active" : ""}`}
                  onClick={() => setShowUserFilters((prev) => !prev)}
                  style={{ width: "45px", height: "45px", borderRadius: "50%", padding: 0 }}
                >
                  <IoFilter size={22} className="filter-icon" />
                </button>
                <span>{t("filter")}</span>
              </div>

              {showUserFilters && (
                <div className="row mb-3 g-3">
                  <div className="col-md-6">
                    <label className="form-label">{t("search")}</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t("search_user_name_email")}
                        value={userSearchQuery}
                        onChange={(e) => { setUserSearchQuery(e.target.value); if (e.target.value.length > userSearchQuery.length) setCurrentPageUsers(1); }}
                        style={{ paddingLeft: "40px", paddingRight: userSearchQuery ? "40px" : "12px", fontSize: "12px" }}
                      />
                      <IoIosSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "20px", color: "#6c757d", pointerEvents: "none" }} />
                      {userSearchQuery && (
                        <button type="button" onClick={() => { setUserSearchQuery(""); setCurrentPageUsers(1); }}
                          style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#dc3545" }}>✕</button>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label"><i className="bi bi-funnel me-1"></i>{t("filter_by_role")}</label>
                    <select className="form-select" value={userFilterRole} onChange={(e) => { setUserFilterRole(e.target.value); setCurrentPageUsers(1); }} style={{ fontSize: "12px" }}>
                      <option value="all">{t("all_roles")}</option>
                      <option value="admin">{t("admin")}</option>
                      <option value="guest">{t("guest")}</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Users Table */}
            <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto", border: "1px solid #dee2e6", position: "relative" }}>
              <table className="table table-hover table-striped mb-0">
                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <tr>
                    <th className="ps-3 text-start" style={{ minWidth: "200px" }}><i className="bi bi-person me-2"></i>{t("name")}</th>
                    <th className="text-start" style={{ minWidth: "200px" }}><i className="bi bi-envelope me-2"></i>{t("email")}</th>
                    <th className="text-start" style={{ minWidth: "120px" }}><i className="bi bi-telephone me-2"></i>{t("phone")}</th>
                    <th className="text-start" style={{ minWidth: "150px" }}><i className="bi bi-geo-alt me-2"></i>{t("city")}</th>
                    <th className="text-start" style={{ minWidth: "150px" }}><i className="bi bi-flag me-2"></i>{t("country")}</th>
                    <th className="text-center" style={{ minWidth: "100px" }}><i className="bi bi-shield me-2"></i>{t("role")}</th>
                    <th className="text-center pe-3" style={{ minWidth: "120px" }}><i className="bi bi-ticket-perforated me-2"></i>{t("coupon")}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((usr) => (
                    <tr key={usr.uid} className="align-middle">
                      <td className="ps-3">
                        <small className="fw-bold">{usr.displayName || `${usr.firstName} ${usr.lastName}`.trim()}</small>
                      </td>
                      <td><small>{usr.email}</small></td>
                      <td><small>{usr.phone || "-"}</small></td>
                      <td><small>{usr.city || "-"}</small></td>
                      <td><small>{usr.country || "-"}</small></td>
                      <td className="text-center">
                        <Badge pill bg={usr.role === "admin" ? "danger" : "secondary"} className="px-3 py-2">
                          {t(usr.role)}
                        </Badge>
                      </td>
                      <td className="text-center pe-3">
                        {usr.coupon ? <span className="badge bg-success"><small>{usr.coupon}</small></span> : <small className="text-muted">-</small>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPagesUsers > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                <div className="text-muted">
                  <small>{t("showing")} {currentUsers.length} {t("of")} {filteredUsers.length} {t("users")}</small>
                </div>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPageUsers === 1 ? "disabled" : ""}`}>
                      <button type="button" className="page-link py-1 px-2" onClick={() => setCurrentPageUsers(currentPageUsers - 1)} disabled={currentPageUsers === 1}>{t("previous")}</button>
                    </li>
                    {[...Array(totalPagesUsers)].map((_, index) => {
                      const pageNumber = index + 1;
                      if (pageNumber === 1 || pageNumber === totalPagesUsers || (pageNumber >= currentPageUsers - 1 && pageNumber <= currentPageUsers + 1)) {
                        return (
                          <li key={pageNumber} className={`page-item ${currentPageUsers === pageNumber ? "active" : ""}`}>
                            <button type="button" className="page-link py-1 px-2" onClick={() => setCurrentPageUsers(pageNumber)}>{pageNumber}</button>
                          </li>
                        );
                      } else if (pageNumber === currentPageUsers - 2 || pageNumber === currentPageUsers + 2) {
                        return <li key={`ellipsis-${pageNumber}`} className="page-item disabled"><span className="page-link py-1 px-2">...</span></li>;
                      }
                      return null;
                    })}
                    <li className={`page-item ${currentPageUsers === totalPagesUsers ? "disabled" : ""}`}>
                      <button type="button" className="page-link py-1 px-2" onClick={() => setCurrentPageUsers(currentPageUsers + 1)} disabled={currentPageUsers === totalPagesUsers}>{t("next")}</button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}

            {/* Summary Stats */}
            <div className="row mt-4 g-3">
              <div className="col-md-4">
                <div className="card border-primary"><div className="card-body text-center py-3">
                  <small className="text-muted d-block">{t("total_users")}</small>
                  <h4 className="mb-0 text-primary">{allUsers.length}</h4>
                </div></div>
              </div>
              <div className="col-md-4">
                <div className="card border-danger"><div className="card-body text-center py-3">
                  <small className="text-muted d-block">{t("admins")}</small>
                  <h4 className="mb-0 text-danger">{allUsers.filter((u) => u.role === "admin").length}</h4>
                </div></div>
              </div>
              <div className="col-md-4">
                <div className="card border-secondary"><div className="card-body text-center py-3">
                  <small className="text-muted d-block">{t("guests")}</small>
                  <h4 className="mb-0 text-secondary">{allUsers.filter((u) => u.role === "guest").length}</h4>
                </div></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;
