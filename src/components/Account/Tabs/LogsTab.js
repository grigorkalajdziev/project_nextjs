import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useLocalization } from "../../../context/LocalizationContext";
import { IoIosSearch } from "react-icons/io";
import { IoFilter } from "react-icons/io5";

function formatDate(iso, lang) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(lang === "en" ? "en-GB" : "mk-MK", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const LOGS_PER_PAGE = 6;

export default function LogsTab() {
  const { currentLanguage } = useLocalization();
  const lang = currentLanguage;

  const tr = {
    title:        lang === "en" ? "Activity Logs"                 : "Логови на активности",
    totalLogs:    lang === "en" ? "Total Logs"                    : "Вкупно Логови",
    filter:       lang === "en" ? "Filter"                        : "Филтер",
    search:       lang === "en" ? "Search"                        : "Пребарување",
    searchPh:     lang === "en" ? "Search user, details or IP..." : "Пребарај корисник, детали или IP...",
    action:       lang === "en" ? "Filter by action"              : "Филтрирај по акција",
    allActions:   lang === "en" ? "All actions"                   : "Сите акции",
    user:         lang === "en" ? "User"                          : "Корисник",
    actionCol:    lang === "en" ? "Action"                        : "Акција",
    details:      lang === "en" ? "Details"                       : "Детали",
    ip:           lang === "en" ? "IP Address"                    : "IP Адреса",
    dateTime:     lang === "en" ? "Date & Time"                   : "Датум и Време",
    loading:      lang === "en" ? "Loading logs..."               : "Се вчитуваат логови...",
    noLogs:       lang === "en" ? "No logs found."                : "Нема пронајдени логови.",
    showing:      lang === "en" ? "Showing"                       : "Прикажани",
    of:           lang === "en" ? "of"                            : "од",
    logs:         lang === "en" ? "Logs"                          : "Логови",
    grandTotal:   lang === "en" ? "Total:"                        : "Вкупно:",
    previous:     lang === "en" ? "Prev."                         : "Прет.",
    next:         lang === "en" ? "Next."                         : "След.",
  };

  const ACTION_LABELS = {
    LOGIN:             { label: lang === "en" ? "Login"            : "Најава",            color: "#2EAD65", bg: "#d1fae5" },
    LOGOUT:            { label: lang === "en" ? "Logout"           : "Одјава",            color: "#6b7280", bg: "#f3f4f6" },
    ORDER_PLACED:      { label: lang === "en" ? "Order"            : "Нарачка",           color: "#1e40af", bg: "#dbeafe" },
    ORDER_DELETED:     { label: lang === "en" ? "Order Deleted"    : "Избришана нарачка", color: "#991b1b", bg: "#fee2e2" },
    ORDER_STATUS:      { label: lang === "en" ? "Order Status"     : "Статус нарачка",    color: "#92400e", bg: "#fef3c7" },
    PROFILE_UPDATED:   { label: lang === "en" ? "Profile"          : "Профил",            color: "#5b21b6", bg: "#ede9fe" },
    PASSWORD_CHANGED:  { label: lang === "en" ? "Password"         : "Лозинка",           color: "#9d174d", bg: "#fce7f3" },
    PDF_DOWNLOAD:      { label: lang === "en" ? "PDF Download"     : "PDF преземање",     color: "#075985", bg: "#e0f2fe" },
    BULK_PDF_DOWNLOAD: { label: lang === "en" ? "Bulk PDF"         : "Bulk PDF",          color: "#155e75", bg: "#cffafe" },
    SCHEDULE_SAVED:    { label: lang === "en" ? "Schedule Saved"   : "Распоред зачуван",  color: "#166534", bg: "#dcfce7" },
    SCHEDULE_TOGGLED:  { label: lang === "en" ? "Schedule Toggled" : "Распоред вклучен",  color: "#14532d", bg: "#f0fdf4" },
    PAGE_VISIT:        { label: lang === "en" ? "Page Visit"       : "Посета",            color: "#4c1d95", bg: "#f5f3ff" },
  };

  const [logs, setLogs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filterAction, setFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setPage]    = useState(1);

  useEffect(() => {
    const db = getDatabase();
    get(ref(db, "activityLogs")).then((snapshot) => {
      if (snapshot.exists()) {
        const arr = Object.entries(snapshot.val()).map(([id, val]) => ({ id, ...val }));
        arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLogs(arr);
      }
    }).finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.username?.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase()) ||
      log.ip?.includes(search);
    return matchSearch && (filterAction === "all" || log.action === filterAction);
  });

  const totalPages = Math.ceil(filtered.length / LOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * LOGS_PER_PAGE;
  const paginated  = filtered.slice(startIndex, startIndex + LOGS_PER_PAGE);

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="my-account-area__content">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h3 className="mb-0">{tr.title}</h3>
        {logs.length > 0 && (
          <span className="badge bg-primary" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>
            {filtered.length} {tr.totalLogs}
          </span>
        )}
      </div>

      <div className="card">
        <div className="card-body">

          {/* Filter Section — identical to OrdersTab */}
          <div className="filter-section mb-4">
            <div className="d-flex align-items-center mb-3">
              <button
                type="button"
                className={`btn btn-outline-secondary d-flex align-items-center justify-content-center me-3 filter-toggle ${showFilters ? "active" : ""}`}
                onClick={() => setShowFilters((prev) => !prev)}
                style={{ width: "45px", height: "45px", borderRadius: "50%", padding: 0 }}
              >
                <IoFilter size={22} className="filter-icon" />
              </button>
              <span>{tr.filter}</span>
            </div>

            {showFilters && (
              <div className="row mb-3 g-3">
                {/* Search */}
                <div className="col-md-6">
                  <label className="form-label">{tr.search}</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={tr.searchPh}
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      style={{ paddingLeft: "40px", paddingRight: search ? "40px" : "12px", fontSize: "12px" }}
                    />
                    <IoIosSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "20px", color: "#6c757d", pointerEvents: "none" }} />
                    {search && (
                      <button
                        type="button"
                        onClick={() => { setSearch(""); setPage(1); }}
                        style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#dc3545" }}
                      >✕</button>
                    )}
                  </div>
                </div>

                {/* Action filter */}
                <div className="col-md-6">
                  <label className="form-label">
                    <i className="bi bi-funnel me-1"></i>{tr.action}
                  </label>
                  <select
                    className="form-select"
                    value={filterAction}
                    onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                    style={{ fontSize: "12px" }}
                  >
                    <option value="all">{tr.allActions}</option>
                    {Object.entries(ACTION_LABELS).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          {loading ? (
            <p className="text-muted">{tr.loading}</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted">{tr.noLogs}</p>
          ) : (
            <>
              <div className="table-responsive" style={{ maxHeight: "350px", overflowY: "auto", border: "1px solid #dee2e6", position: "relative" }}>
                <table className="table table-hover table-striped mb-0" style={{ borderCollapse: "separate", borderSpacing: "0" }}>
                  <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                    <tr>
                      <th className="ps-3 text-start" style={{ minWidth: "180px" }}>
                        <i className="bi bi-person me-2"></i>{tr.user}
                      </th>
                      <th className="text-start" style={{ minWidth: "140px" }}>
                        <i className="bi bi-lightning me-2"></i>{tr.actionCol}
                      </th>
                      <th className="text-start" style={{ minWidth: "200px" }}>
                        <i className="bi bi-info-circle me-2"></i>{tr.details}
                      </th>
                      <th className="text-start" style={{ minWidth: "130px" }}>
                        <i className="bi bi-geo me-2"></i>{tr.ip}
                      </th>
                      <th className="text-start pe-3" style={{ minWidth: "150px" }}>
                        <i className="bi bi-calendar-date me-2"></i>{tr.dateTime}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((log) => {
                      const meta = ACTION_LABELS[log.action] ?? { label: log.action, color: "#374151", bg: "#f3f4f6" };
                      return (
                        <tr key={log.id} className="align-middle">
                          <td className="ps-3"><small>{log.username || "—"}</small></td>
                          <td>
                            <span
                              className="badge rounded-pill px-3 py-2"
                              style={{ backgroundColor: meta.bg, color: meta.color, fontWeight: 600, fontSize: "0.75rem" }}
                            >
                              {meta.label}
                            </span>
                          </td>
                          <td className="text-muted"><small>{log.details || "—"}</small></td>
                          <td className="font-monospace text-muted"><small>{log.ip || "—"}</small></td>
                          <td className="text-muted pe-3"><small>{formatDate(log.createdAt, lang)}</small></td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="table-secondary" style={{ position: "sticky", bottom: 0, zIndex: 1 }}>
                    <tr className="fw-bold">
                      <td colSpan={4} className="ps-3">
                        <i className="bi bi-calculator me-2"></i>
                        {tr.showing} {startIndex + 1}–{Math.min(startIndex + LOGS_PER_PAGE, filtered.length)} {tr.of} {filtered.length} {tr.logs}
                      </td>
                      <td className="text-end pe-3 text-primary">
                        <small>{tr.grandTotal} {filtered.length}</small>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Pagination — identical to OrdersTab */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                  <div className="text-muted">
                    <small>{tr.showing} {paginated.length} {tr.of} {filtered.length} {tr.logs}</small>
                  </div>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button type="button" className="page-link py-1 px-2" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>{tr.previous}</button>
                      </li>
                      {renderPageNumbers().map((p, i) =>
                        p === "..." ? (
                          <li key={`e-${i}`} className="page-item disabled"><span className="page-link py-1 px-2">...</span></li>
                        ) : (
                          <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
                            <button type="button" className="page-link py-1 px-2" onClick={() => handlePageChange(p)}>{p}</button>
                          </li>
                        )
                      )}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button type="button" className="page-link py-1 px-2" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>{tr.next}</button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}