import { Spinner } from "react-bootstrap";
import { IoIosSearch } from "react-icons/io";
import { IoFilter } from "react-icons/io5";

const DownloadTab = ({
  t,
  role,
  orders,
  currentLanguage,
  downloadingOrderId,
  selectedOrdersForDownload,
  selectAllDownload,
  downloadSearchQuery,
  setDownloadSearchQuery,
  downloadFilterPayment,
  setDownloadFilterPayment,
  downloadFilterStatus,
  setDownloadFilterStatus,
  showDownloadFilters,
  setShowDownloadFilters,
  filteredOrdersForDownload,
  currentOrdersDownload,
  totalPagesDownload,
  currentPageDown,
  handlePageChangeDown,
  downloadStats,
  downloadPdfEnhanced,
  toggleOrderSelection,
  toggleSelectAll,
  bulkDownloading,
  downloadBulkPdfs,
  setSelectedOrdersForDownload,
  setSelectAllDownload,
  setCurrentPageDown,
}) => {
  return (
    <div className="my-account-area__content">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h3 className="mb-0">
          <i className="bi bi-download me-2 text-primary"></i>
          {t("download")}
        </h3>

        {orders?.length > 0 && filteredOrdersForDownload?.length > 0 && (
          <div className="d-flex gap-2 flex-wrap">
            {selectedOrdersForDownload.length > 0 && (
              <>
                <span className="badge bg-info align-self-center px-3 py-2">
                  {selectedOrdersForDownload.length} {t("selected")}
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={downloadBulkPdfs}
                  disabled={bulkDownloading}
                >
                  {bulkDownloading ? (
                    <><Spinner as="span" animation="border" size="sm" className="me-2" />{t("downloading")}...</>
                  ) : (
                    <><i className="bi bi-download"></i>{t("download_selected")}</>
                  )}
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => { setSelectedOrdersForDownload([]); setSelectAllDownload(false); }}
                >
                  <i className="bi bi-x-circle"></i>{t("clear_selection")}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="bi bi-cart-x" style={{ fontSize: "3rem", color: "#ccc" }}></i>
            <p className="mt-3 mb-0 text-muted">{t("you_have_not_made_any_order_yet")}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Download Statistics */}
          <div className="row mb-4 g-3">
            {[
              { icon: "bi-file-earmark-pdf", color: "primary", value: downloadStats.total, label: t("available_invoices") },
              { icon: "bi-check-circle", color: "success", value: downloadStats.withHistory, label: t("downloaded_once") },
              { icon: "bi-arrow-down-circle", color: "info", value: downloadStats.totalDownloads, label: t("total_downloads") },
              { icon: "bi-graph-up", color: "warning", value: downloadStats.avgDownloadsPerOrder, label: t("avg_downloads") },
            ].map((stat, idx) => (
              <div className="col-md-3 col-sm-6" key={idx}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-3">
                    <div className={`text-${stat.color} mb-2`}>
                      <i className={`bi ${stat.icon}`} style={{ fontSize: "1.8rem" }}></i>
                    </div>
                    <h5 className="mb-1">{stat.value}</h5>
                    <small className="text-muted">{stat.label}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {/* Filters */}
              <div className="filter-section mb-4">
                <div className="d-flex align-items-center mb-3">
                  <button
                    type="button"
                    className={`btn btn-outline-secondary d-flex align-items-center justify-content-center me-3 filter-toggle ${showDownloadFilters ? "active" : ""}`}
                    onClick={() => setShowDownloadFilters((prev) => !prev)}
                    style={{ width: "45px", height: "45px", borderRadius: "50%", padding: 0 }}
                  >
                    <IoFilter size={22} className="filter-icon" />
                  </button>
                  <span>{t("filter")}</span>
                </div>

                {showDownloadFilters && (
                  <div className="row mb-3 g-3">
                    <div className="col-md-4">
                      <label className="form-label">{t("search")}</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("search_order_or_user")}
                          value={downloadSearchQuery}
                          onChange={(e) => { setDownloadSearchQuery(e.target.value); setCurrentPageDown(1); }}
                          style={{ paddingLeft: "40px", paddingRight: downloadSearchQuery ? "40px" : "12px", fontSize: "12px" }}
                        />
                        <IoIosSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "20px", color: "#6c757d", pointerEvents: "none" }} />
                        {downloadSearchQuery && (
                          <button type="button" onClick={() => { setDownloadSearchQuery(""); setCurrentPageDown(1); }}
                            style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#dc3545" }}>✕</button>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label"><i className="bi bi-credit-card me-1"></i>{t("filter_by_payment")}</label>
                      <select className="form-select" value={downloadFilterPayment} onChange={(e) => { setDownloadFilterPayment(e.target.value); setCurrentPageDown(1); }} style={{ fontSize: "12px" }}>
                        <option value="all">{t("all_payments")}</option>
                        <option value="payment_cash">{t("payment_cash")}</option>
                        <option value="payment_bank">{t("payment_bank")}</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label"><i className="bi bi-funnel me-1"></i>{t("filter_by_status")}</label>
                      <select className="form-select" value={downloadFilterStatus} onChange={(e) => { setDownloadFilterStatus(e.target.value); setCurrentPageDown(1); }} style={{ fontSize: "12px" }}>
                        <option value="all">{t("all_statuses")}</option>
                        <option value="pending">{t("pending")}</option>
                        <option value="confirmed">{t("confirmed")}</option>
                        <option value="cancelled">{t("cancelled")}</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto", border: "1px solid #dee2e6" }}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                    <tr>
                      <th style={{ width: "50px" }} className="ps-3 text-center align-middle">
                        <input type="checkbox" className="form-check-input" checked={selectAllDownload} onChange={toggleSelectAll} />
                      </th>
                      {role === "admin" && <th style={{ minWidth: "140px" }} className="align-middle"><small>{t("user")}</small></th>}
                      <th style={{ minWidth: "120px" }} className="align-middle"><small>{t("order")}</small></th>
                      <th style={{ minWidth: "100px" }} className="align-middle"><small>{t("date")}</small></th>
                      <th style={{ minWidth: "130px" }} className="align-middle"><small>{t("payment_method")}</small></th>
                      <th style={{ minWidth: "100px" }} className="text-center align-middle"><small>{t("status")}</small></th>
                      <th style={{ minWidth: "100px" }} className="text-center align-middle"><small>{t("action")}</small></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrdersDownload.map((order) => (
                      <tr key={order.id}>
                        <td className="ps-3">
                          <input type="checkbox" className="form-check-input" checked={selectedOrdersForDownload.includes(order.id)} onChange={() => toggleOrderSelection(order.id)} />
                        </td>
                        {role === "admin" && <td><small>{order.displayName}</small></td>}
                        <td>
                          <span className="badge bg-light text-dark border"><small>{order.orderNumber}</small></span>
                        </td>
                        <td><small>{order.date}</small></td>
                        <td>
                          <span className={`badge ${order.paymentMethod === "payment_cash" ? "bg-success" : "bg-primary"}`}>
                            <i className={`bi ${order.paymentMethod === "payment_cash" ? "bi-cash" : "bi-bank"} me-1`}></i>
                            <small>{order.paymentMethod === "payment_cash" ? t("payment_cash") : t("payment_bank")}</small>
                          </span>
                        </td>
                        <td className="text-center">
                          <span className={`badge ${order.status === "confirmed" ? "bg-success" : order.status === "pending" ? "bg-warning" : "bg-danger"}`}>
                            <small>{t(order.status)}</small>
                          </span>
                        </td>
                        <td className="text-center align-middle pe-3">
                          <div className="d-flex justify-content-center align-items-center">
                            <button
                              className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-1"
                              onClick={() => downloadPdfEnhanced(order)}
                              disabled={downloadingOrderId === order.id}
                              style={{ minWidth: "100px" }}
                            >
                              {downloadingOrderId === order.id ? (
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                              ) : (
                                <><i className="bi bi-download"></i><span className="small">{t("download")}</span></>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPagesDownload > 1 && (
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-4 gap-2">
                  <div className="text-muted text-center text-sm-start">
                    <small>{t("showing")} {currentOrdersDownload.length} {t("of")} {filteredOrdersForDownload.length} {t("orders")}</small>
                  </div>
                  <nav>
                    <ul className="pagination mb-0 flex-wrap justify-content-center">
                      <li className={`page-item ${currentPageDown === 1 ? "disabled" : ""}`}>
                        <button type="button" className="page-link py-1 px-2" onClick={() => handlePageChangeDown(currentPageDown - 1)} disabled={currentPageDown === 1}>{t("previous")}</button>
                      </li>
                      {[...Array(totalPagesDownload)].map((_, index) => {
                        const pageNumber = index + 1;
                        if (pageNumber === 1 || pageNumber === totalPagesDownload || (pageNumber >= currentPageDown - 1 && pageNumber <= currentPageDown + 1)) {
                          return (
                            <li key={pageNumber} className={`page-item ${currentPageDown === pageNumber ? "active" : ""}`}>
                              <button type="button" className="page-link py-1 px-2" onClick={() => handlePageChangeDown(pageNumber)}>{pageNumber}</button>
                            </li>
                          );
                        } else if (pageNumber === currentPageDown - 2 || pageNumber === currentPageDown + 2) {
                          return <li key={`ellipsis-${pageNumber}`} className="page-item disabled"><span className="page-link py-1 px-2">...</span></li>;
                        }
                        return null;
                      })}
                      <li className={`page-item ${currentPageDown === totalPagesDownload ? "disabled" : ""}`}>
                        <button type="button" className="page-link py-1 px-2" onClick={() => handlePageChangeDown(currentPageDown + 1)} disabled={currentPageDown === totalPagesDownload}>{t("next")}</button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DownloadTab;