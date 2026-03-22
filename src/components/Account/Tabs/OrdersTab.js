import { Badge, Spinner } from "react-bootstrap";
import { IoIosSearch } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { TbReportAnalytics } from "react-icons/tb";
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
} from "recharts";
import { PDFDownloadLink } from "@react-pdf/renderer";

const OrdersTab = ({
  t,
  role,
  orders,
  currentLanguage,
  formatTotal,
  parseAmount,
  conversionRate,
  filterYear,
  setFilterYear,
  filteredOrders,
  currentOrders,
  totalPages,
  currentPage,
  paginate,
  ordersOnCurrentPage,
  grandTotalInDisplayCurrency,
  filteredOrdersForCharts,
  getDailyRevenue,
  getMonthlyRevenue,
  getYearlyRevenue,
  getTopProducts,
  getAverageOrderValue,
  getOrderSuccessStats,
  formattedPaymentData,
  statusData,
  COLORS,
  PAYMENT_COLORS,
  dateRange,
  setDateRange,
  showFilters,
  setShowFilters,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterPayment,
  setFilterPayment,
  setCurrentPage,
  updateOrder,
  viewOrder,
  setPendingDeleteId,
  setShowDeleteModal,
}) => {
  return (
    <div className="my-account-area__content">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h3 className="mb-0">{t("orders")}</h3>
        {orders.length > 0 && (
          <span className="badge bg-primary" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>
            {orders.length} {t("total_orders")}
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="bi bi-cart-x" style={{ fontSize: "3rem", color: "#ccc" }}></i>
            <p className="mt-3 mb-0 text-muted">{t("you_have_not_made_any_order_yet")}</p>
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
                  className={`btn btn-outline-secondary d-flex align-items-center justify-content-center me-3 filter-toggle ${showFilters ? "active" : ""}`}
                  onClick={() => setShowFilters((prev) => !prev)}
                  style={{ width: "45px", height: "45px", borderRadius: "50%", padding: 0 }}
                >
                  <IoFilter size={22} className="filter-icon" />
                </button>
                <span>{t("filter")}</span>
              </div>

              {showFilters && (
                <div className="row mb-3 g-3">
                  <div className="col-md-4">
                    <label className="form-label">{t("search")}</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t("search_order_or_user")}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value.length > searchQuery.length) setCurrentPage(1); }}
                        style={{ paddingLeft: "40px", paddingRight: searchQuery ? "40px" : "12px", fontSize: "12px" }}
                      />
                      <IoIosSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "20px", color: "#6c757d", pointerEvents: "none" }} />
                      {searchQuery && (
                        <button type="button" onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                          style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#dc3545" }}>✕</button>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label"><i className="bi bi-funnel me-1"></i>{t("filter_by_status")}</label>
                    <select className="form-select" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} style={{ fontSize: "12px" }}>
                      <option value="all">{t("all_statuses")}</option>
                      <option value="pending">{t("pending")}</option>
                      <option value="confirmed">{t("confirmed")}</option>
                      <option value="cancelled">{t("cancelled")}</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label"><i className="bi bi-credit-card me-1"></i>{t("filter_by_payment")}</label>
                    <select className="form-select" value={filterPayment} onChange={(e) => { setFilterPayment(e.target.value); setCurrentPage(1); }} style={{ fontSize: "12px" }}>
                      <option value="all">{t("all_payments")}</option>
                      <option value="payment_cash">{t("payment_cash")}</option>
                      <option value="payment_bank">{t("payment_bank")}</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label"><i className="bi bi-calendar-year me-1"></i>{t("filter_by_year")}</label>
                    <select className="form-select" value={filterYear} onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(1); }} style={{ fontSize: "12px" }}>
                      {[...Array(5)].map((_, idx) => {
                        const year = new Date().getFullYear() - idx;
                        return <option key={year} value={year.toString()}>{year}</option>;
                      })}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Orders Table */}
            <div className="table-responsive" style={{ maxHeight: "350px", overflowY: "auto", border: "1px solid #dee2e6", position: "relative" }}>
              <table className="table table-hover table-striped mb-0" style={{ borderCollapse: "separate", borderSpacing: "0" }}>
                <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <tr>
                    {role === "admin" && <th className="ps-3 text-start" style={{ minWidth: "180px" }}><i className="bi bi-person me-2"></i>{t("user")}</th>}
                    <th className="text-start" style={{ minWidth: "110px" }}><i className="bi bi-receipt me-2"></i>{t("order")}</th>
                    <th className="text-start" style={{ minWidth: "110px" }}><i className="bi bi-calendar-date me-2"></i>{t("date")}</th>
                    <th className="text-start" style={{ minWidth: "120px" }}><i className="bi bi-calendar-check me-2"></i>{t("date_of_reservation")}</th>
                    <th className="text-start pe-3" style={{ minWidth: "60px" }}><i className="bi bi-clock me-2"></i>{t("time_of_reservation")}</th>
                    <th className="text-center pe-3" style={{ minWidth: "90px" }}><i className="bi bi-info-circle me-2"></i>{t("status")}</th>
                    <th className="text-end" style={{ minWidth: "130px" }}><i className="bi bi-currency-exchange me-2"></i>{t("total")}</th>
                    <th className="text-center pe-3" style={{ minWidth: "180px" }}><i className="bi bi-gear me-2"></i>{t("action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order.id} className="align-middle">
                      {role === "admin" && <td className="ps-3"><small>{order.displayName}</small></td>}
                      <td><span className="badge bg-secondary">{order.orderNumber}</span></td>
                      <td className="text-start pe-3"><small>{order.date}</small></td>
                      <td className="text-center pe-3"><small>{order.reservationDate}</small></td>
                      <td className="text-center pe-3"><small>{order.reservationTime}</small></td>
                      <td className="text-center">
                        {role === "admin" && order.status === "pending" ? (
                          <select value={order.status} onChange={(e) => updateOrder(order.id, null, e.target.value)}
                            className="form-select form-select-sm" style={{ maxWidth: "130px", margin: "0 auto" }}>
                            <option value="pending">{t("pending")}</option>
                            <option value="confirmed">{t("confirmed")}</option>
                            <option value="cancelled">{t("cancelled")}</option>
                          </select>
                        ) : (
                          <Badge pill bg={order.status === "pending" ? "warning" : order.status === "confirmed" ? "success" : order.status === "cancelled" ? "danger" : "secondary"} className="px-3 py-2">
                            {t(order.status)}
                          </Badge>
                        )}
                      </td>
                      <td className="text-end">
                        <small>{formatTotal(order.displayTotal ?? (currentLanguage === "mk" ? order.totalMK : order.totalEN), currentLanguage)}</small>
                      </td>
                      <td className="text-center pe-3">
                        <div className="d-flex gap-2 justify-content-center">
                          <button type="button" className="btn btn-sm btn-primary" onClick={() => viewOrder(order.id, order.userId)}>
                            <i className="bi bi-eye me-1"></i>{t("view")}
                          </button>
                          {role === "admin" && (
                            <button onClick={() => { setPendingDeleteId(order.id); setShowDeleteModal(true); }} className="btn btn-sm btn-outline-danger">
                              <i className="bi bi-trash me-1"></i>{t("delete")}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-secondary" style={{ position: "sticky", bottom: 0, zIndex: 1 }}>
                  <tr className="fw-bold">
                    <td colSpan={role === "admin" ? 6 : 5} className={role === "admin" ? "ps-3" : ""}>
                      <i className="bi bi-calculator me-2"></i>{t("grand_total_label")}
                    </td>
                    <td className="text-end text-primary">
                      <small>{formatTotal(grandTotalInDisplayCurrency, currentLanguage)}</small>
                    </td>
                    <td className="pe-3" />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                <div className="text-muted">
                  <small>{t("showing")} {ordersOnCurrentPage} {t("of")} {filteredOrders.length} {t("orders")}</small>
                </div>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button type="button" className="page-link py-1 px-2" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>{t("previous")}</button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                        return (
                          <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? "active" : ""}`}>
                            <button type="button" className="page-link py-1 px-2" onClick={() => paginate(pageNumber)}>{pageNumber}</button>
                          </li>
                        );
                      } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                        return <li key={`ellipsis-${pageNumber}`} className="page-item disabled"><span className="page-link py-1 px-2">...</span></li>;
                      }
                      return null;
                    })}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button type="button" className="page-link py-1 px-2" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>{t("next")}</button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}

            {/* Summary Stats */}
            <div className="row mt-4 g-3">
              {[
                { label: t("total_orders"), value: filteredOrdersForCharts.length, color: "primary" },
                { label: t("pending"), value: filteredOrders.filter((o) => o.status === "pending").length, color: "warning" },
                { label: t("confirmed"), value: filteredOrders.filter((o) => o.status === "confirmed").length, color: "success" },
                { label: t("cancelled"), value: filteredOrders.filter((o) => o.status === "cancelled").length, color: "danger" },
              ].map((stat) => (
                <div className="col-md-3" key={stat.label}>
                  <div className={`card border-${stat.color}`}>
                    <div className="card-body text-center py-3">
                      <small className="text-muted d-block">{stat.label}</small>
                      <h4 className={`mb-0 text-${stat.color}`}>{stat.value}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Financial Reports (admin only) */}
      {role === "admin" && orders.length > 0 && (
        <div className="financial-reports mt-4">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <h4 className="mb-0 text-center text-md-start">
              <TbReportAnalytics size={24} className="me-2" />
              {t("financial_reports")}
            </h4>
            <PDFDownloadLink
              fileName={`financial-report-${new Date().toISOString().split("T")[0]}.pdf`}
              className="btn btn-danger"
            >
              {({ loading }) => (
                <><i className="bi bi-file-pdf me-2"></i>{loading ? t("preparing_pdf") : t("download_pdf")}</>
              )}
            </PDFDownloadLink>
          </div>

          {/* Key Metrics */}
          <div className="row mb-4">
            {[
              { label: t("total_orders"), value: filteredOrdersForCharts.length, sub: t("all_time_orders") },
              {
                label: t("total_revenue"),
                value: formatTotal(filteredOrdersForCharts.reduce((sum, order) => {
                  const mk = parseFloat(order.totalMK || 0);
                  const en = parseFloat(order.totalEN || 0);
                  if (!mk && !en) {
                    const fallback = parseAmount(order.total || 0);
                    const cur = (order.currency || "MKD").toUpperCase();
                    return currentLanguage === "mk" ? sum + (cur === "MKD" ? fallback : fallback * conversionRate) : sum + (cur === "EUR" ? fallback : fallback / conversionRate);
                  }
                  return currentLanguage === "mk" ? sum + (mk > 0 ? mk : en * conversionRate) : sum + (en > 0 ? en : mk / conversionRate);
                }, 0), currentLanguage),
                sub: t("gross_revenue"),
              },
              { label: t("avg_order_value"), value: formatTotal(getAverageOrderValue(filteredOrdersForCharts), currentLanguage), sub: t("per_order_average") },
              {
                label: t("order_success_rate"),
                value: `${getOrderSuccessStats(filteredOrdersForCharts).successRate}%`,
                sub: `${getOrderSuccessStats(filteredOrdersForCharts).confirmed} ${t("confirmed_analysis")} / ${getOrderSuccessStats(filteredOrdersForCharts).total} ${t("total")}`,
              },
            ].map((metric, idx) => (
              <div className="col-12 col-md-3 mb-3" key={idx}>
                <div className="card text-center">
                  <div className="card-body">
                    <h6 className="text-muted">{metric.label}</h6>
                    <h3>{metric.value}</h3>
                    <small className="text-muted d-block mt-2">{metric.sub}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Daily Revenue Chart */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <TbReportAnalytics size={24} className="me-2" />
                    <h5>{t("daily_revenue_trend")}</h5>
                    <select className="form-select" style={{ width: "auto" }} value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                      <option value="7days">{t("last_7_days")}</option>
                      <option value="30days">{t("last_30_days")}</option>
                      <option value="90days">{t("last_90_days")}</option>
                    </select>
                  </div>
                  <div className="chart-container">
                    <ResponsiveContainer>
                      <BarChart data={getDailyRevenue(filteredOrdersForCharts, dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : 90)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" interval={4} height={50} />
                        <YAxis />
                        <Tooltip formatter={(value, name) => {
                          if (name === "revenue") return [formatTotal(value, currentLanguage), currentLanguage === "mk" ? "Приход" : "Revenue"];
                          return [value, currentLanguage === "mk" ? "Нарачки" : "Orders"];
                        }} />
                        <Bar dataKey="revenue" fill="#0088FE" />
                      </BarChart>
                    </ResponsiveContainer>

                    {/* Daily Revenue Table */}
                    <div className="mt-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0"><i className="bi bi-table me-2 text-primary"></i>{t("detailed_daily_breakdown")}</h6>
                        <span className="badge bg-primary">{getDailyRevenue(filteredOrdersForCharts, dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : 90).length} {t("days")}</span>
                      </div>
                      <div className="table-responsive" style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid #dee2e6", position: "relative" }}>
                        <table className="table table-hover table-striped mb-0">
                          <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                            <tr>
                              <th className="ps-3"><i className="bi bi-calendar-date me-2"></i>{t("date")}</th>
                              <th className="text-center"><i className="bi bi-cart-check me-2"></i>{t("orders")}</th>
                              <th className="text-end pe-3"><i className="bi bi-currency-exchange me-2"></i>{t("revenue")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getDailyRevenue(filteredOrdersForCharts, dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : 90).map((day, index) => (
                              <tr key={index} className="align-middle">
                                <td className="ps-3"><small className="text-dark">{day.date}</small></td>
                                <td className="text-center"><span className="badge bg-info text-dark"><small>{day.orders || 0}</small></span></td>
                                <td className="text-end pe-3"><small className="text-success">{formatTotal(day.revenue, currentLanguage)}</small></td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="table-secondary" style={{ position: "sticky", bottom: 0, zIndex: 1 }}>
                            <tr className="fw-bold">
                              <td className="ps-3"><i className="bi bi-calculator me-2"></i>{t("total")}</td>
                              <td className="text-center">
                                <span className="badge bg-dark">{getDailyRevenue(filteredOrdersForCharts, dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : 90).reduce((sum, day) => sum + (day.orders || 0), 0)}</span>
                              </td>
                              <td className="text-end pe-3 text-primary">
                                <small style={{ fontSize: "0.9rem" }}>{formatTotal(getDailyRevenue(filteredOrdersForCharts, dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : 90).reduce((sum, day) => sum + day.revenue, 0), currentLanguage)}</small>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Daily Summary Stats */}
                      {(() => {
                        const dailyData = getDailyRevenue(filteredOrdersForCharts, dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : 90);
                        const bestDay = dailyData.reduce((max, day) => day.revenue > max.revenue ? day : max, dailyData[0]);
                        return (
                          <div className="row mt-3 g-2">
                            <div className="col-md-4">
                              <div className="card border-primary">
                                <div className="card-body text-center py-2">
                                  <small className="text-muted d-block">{t("avg_daily_revenue")}</small>
                                  <strong className="text-primary">{formatTotal(dailyData.reduce((sum, day) => sum + day.revenue, 0) / dailyData.length, currentLanguage)}</strong>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="card border-success">
                                <div className="card-body text-center py-2">
                                  <small className="text-muted d-block">{t("best_day")}</small>
                                  <strong className="text-success">{formatTotal(bestDay?.revenue, currentLanguage)}</strong>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="card border-info">
                                <div className="card-body text-center py-2">
                                  <small className="text-muted d-block">{t("avg_orders_per_day")}</small>
                                  <strong className="text-info">{(dailyData.reduce((sum, day) => sum + (day.orders || 0), 0) / dailyData.length).toFixed(1)}</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-light rounded">
                    <small className="text-muted"><i className="bi bi-info-circle me-2"></i><strong>{t("analysis")}:</strong> {t("daily_revenue_description")}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <TbReportAnalytics size={24} className="me-2" />
                    <h5>{t("monthly_revenue")}</h5>
                    <span className="badge bg-secondary" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>
                      {filterYear === "all" ? t("all_years") : filterYear}
                    </span>
                  </div>
                  <div className="chart-container">
                    <ResponsiveContainer>
                      <BarChart data={getMonthlyRevenue(filteredOrdersForCharts, filterYear === "all" ? new Date().getFullYear() : parseInt(filterYear, 10))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [formatTotal(value, currentLanguage), currentLanguage === "mk" ? "Приход" : "Revenue"]} />
                        <Bar dataKey="revenue" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>

                    {/* Monthly Table */}
                    <div className="mt-4">
                      {(() => {
                        const monthlyData = getMonthlyRevenue(filteredOrdersForCharts, filterYear === "all" ? new Date().getFullYear() : parseInt(filterYear, 10));
                        const bestMonth = monthlyData.reduce((max, m) => m.revenue > max.revenue ? m : max, monthlyData[0]);
                        return (
                          <>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h6 className="mb-0"><i className="bi bi-table me-2 text-success"></i>{t("detailed_monthly_breakdown")}</h6>
                              <span className="badge bg-success">{monthlyData.length} {t("months")}</span>
                            </div>
                            <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #dee2e6", position: "relative" }}>
                              <table className="table table-hover table-striped mb-0">
                                <thead className="table-success" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                  <tr>
                                    <th className="ps-3" style={{ minWidth: "150px" }}><i className="bi bi-calendar3 me-2"></i>{t("month")}</th>
                                    <th className="text-center" style={{ minWidth: "100px" }}><i className="bi bi-cart-check me-2"></i>{t("orders")}</th>
                                    <th className="text-end" style={{ minWidth: "140px" }}><i className="bi bi-currency-exchange me-2"></i>{t("revenue")}</th>
                                    <th className="text-end pe-3" style={{ minWidth: "140px" }}><i className="bi bi-graph-up me-2"></i>{t("avg_per_day")}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {monthlyData.map((month, index) => (
                                    <tr key={index} className="align-middle">
                                      <td className="ps-3">
                                        <div className="d-flex align-items-center">
                                          <span className="badge bg-secondary me-2" style={{ minWidth: "30px" }}>{index + 1}</span>
                                          <small className="text-dark">{month.month}</small>
                                        </div>
                                      </td>
                                      <td className="text-center"><span className="badge bg-info text-dark"><small>{month.orders || 0}</small></span></td>
                                      <td className="text-end"><small className="text-success">{formatTotal(month.revenue, currentLanguage)}</small></td>
                                      <td className="text-end pe-3 text-muted"><small>{formatTotal(month.revenue / 30, currentLanguage)}</small></td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot className="table-secondary" style={{ position: "sticky", bottom: 0, zIndex: 1 }}>
                                  <tr className="fw-bold">
                                    <td className="ps-3"><i className="bi bi-calculator me-2"></i>{t("total")}</td>
                                    <td className="text-center"><span className="badge bg-dark">{monthlyData.reduce((sum, m) => sum + (m.orders || 0), 0)}</span></td>
                                    <td className="text-end text-primary"><strong>{formatTotal(monthlyData.reduce((sum, m) => sum + m.revenue, 0), currentLanguage)}</strong></td>
                                    <td className="text-end pe-3 text-primary"><strong>{formatTotal(monthlyData.reduce((sum, m) => sum + m.revenue, 0) / 365, currentLanguage)}</strong></td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                            <div className="row mt-3 g-2">
                              <div className="col-md-3"><div className="card border-success"><div className="card-body text-center py-2"><small className="text-muted d-block">{t("avg_monthly_revenue")}</small><strong className="text-success">{formatTotal(monthlyData.reduce((sum, m) => sum + m.revenue, 0) / monthlyData.length, currentLanguage)}</strong></div></div></div>
                              <div className="col-md-3"><div className="card border-primary"><div className="card-body text-center py-2"><small className="text-muted d-block">{t("best_month")}</small><strong className="text-primary">{bestMonth?.month}</strong></div></div></div>
                              <div className="col-md-3"><div className="card border-warning"><div className="card-body text-center py-2"><small className="text-muted d-block">{t("total_orders_year")}</small><strong className="text-warning">{monthlyData.reduce((sum, m) => sum + (m.orders || 0), 0)}</strong></div></div></div>
                              <div className="col-md-3"><div className="card border-info"><div className="card-body text-center py-2"><small className="text-muted d-block">{t("avg_monthly_orders")}</small><strong className="text-info">{(monthlyData.reduce((sum, m) => sum + (m.orders || 0), 0) / monthlyData.length).toFixed(1)}</strong></div></div></div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-light rounded">
                    <small className="text-muted"><i className="bi bi-info-circle me-2"></i><strong>{t("analysis")}:</strong> {t("monthly_revenue_description")}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Yearly Comparison */}
          {getYearlyRevenue(orders).length > 1 && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="mb-3"><TbReportAnalytics size={24} className="me-2" />{t("yearly_comparison")}</h5>
                    <div className="chart-container">
                      <ResponsiveContainer>
                        <BarChart data={getYearlyRevenue(orders)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip formatter={(value) => [formatTotal(value, currentLanguage), currentLanguage === "mk" ? "Приход" : "Revenue"]} />
                          <Bar dataKey="revenue" fill="#FFBB28" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Yearly Detailed Table */}
                    <div className="mt-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0"><i className="bi bi-table me-2 text-warning"></i>{t("detailed_yearly_breakdown")}</h6>
                        <span className="badge bg-warning text-dark">{getYearlyRevenue(orders).length} {t("years")}</span>
                      </div>
                      <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #dee2e6", position: "relative" }}>
                        <table className="table table-hover table-striped mb-0">
                          <thead className="table-warning" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                            <tr>
                              <th className="ps-3" style={{ minWidth: "100px" }}><i className="bi bi-calendar4-week me-2"></i>{t("year")}</th>
                              <th className="text-center" style={{ minWidth: "100px" }}><i className="bi bi-cart-check me-2"></i>{t("orders")}</th>
                              <th className="text-end" style={{ minWidth: "140px" }}><i className="bi bi-currency-exchange me-2"></i>{t("revenue")}</th>
                              <th className="text-end" style={{ minWidth: "120px" }}><i className="bi bi-graph-up-arrow me-2"></i>{t("growth")}</th>
                              <th className="text-end pe-3" style={{ minWidth: "140px" }}><i className="bi bi-calculator me-2"></i>{t("avg_monthly")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getYearlyRevenue(orders).map((yearEntry, index) => {
                              const previousYear = index > 0 ? getYearlyRevenue(orders)[index - 1] : null;
                              const growth = previousYear ? (((yearEntry.revenue - previousYear.revenue) / previousYear.revenue) * 100).toFixed(1) : 0;
                              return (
                                <tr key={index} className="align-middle">
                                  <td className="ps-3">
                                    <div className="d-flex align-items-center">
                                      <span className="badge bg-secondary me-2" style={{ minWidth: "30px" }}>{index + 1}</span>
                                      <small className="text-dark">{yearEntry.year}</small>
                                    </div>
                                  </td>
                                  <td className="text-center"><span className="badge bg-info text-dark"><small>{yearEntry.orders || 0}</small></span></td>
                                  <td className="text-end"><small className="text-warning">{formatTotal(yearEntry.revenue, currentLanguage)}</small></td>
                                  <td className="text-end">
                                    {index > 0 ? (
                                      <span className={`badge ${growth >= 0 ? "bg-success" : "bg-danger"}`}>
                                        {growth >= 0 ? "↑" : "↓"} {Math.abs(growth)}%
                                      </span>
                                    ) : (
                                      <span className="badge bg-secondary">-</span>
                                    )}
                                  </td>
                                  <td className="text-end pe-3 text-muted"><small>{formatTotal(yearEntry.revenue / 12, currentLanguage)}</small></td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot className="table-secondary" style={{ position: "sticky", bottom: 0, zIndex: 1 }}>
                            <tr className="fw-bold">
                              <td className="ps-3"><i className="bi bi-calculator me-2"></i>{t("total")}</td>
                              <td className="text-center"><span className="badge bg-dark">{getYearlyRevenue(orders).reduce((sum, y) => sum + (y.orders || 0), 0)}</span></td>
                              <td className="text-end text-primary"><strong>{formatTotal(getYearlyRevenue(orders).reduce((sum, y) => sum + y.revenue, 0), currentLanguage)}</strong></td>
                              <td className="text-end">
                                {(() => {
                                  const years = getYearlyRevenue(orders);
                                  if (years.length > 1) {
                                    const totalGrowth = (((years[years.length - 1].revenue - years[0].revenue) / years[0].revenue) * 100).toFixed(1);
                                    return <span className={`badge ${totalGrowth >= 0 ? "bg-success" : "bg-danger"}`}>{totalGrowth >= 0 ? "↑" : "↓"} {Math.abs(totalGrowth)}%</span>;
                                  }
                                  return <span className="badge bg-secondary">-</span>;
                                })()}
                              </td>
                              <td className="text-end pe-3 text-primary">
                                <strong>{formatTotal(getYearlyRevenue(orders).reduce((sum, y) => sum + y.revenue, 0) / (getYearlyRevenue(orders).length * 12), currentLanguage)}</strong>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Summary Stats */}
                      <div className="row mt-3 g-2">
                        <div className="col-md-3">
                          <div className="card border-warning"><div className="card-body text-center py-2">
                            <small className="text-muted d-block">{t("total_years")}</small>
                            <strong className="text-warning">{getYearlyRevenue(orders).length}</strong>
                          </div></div>
                        </div>
                        <div className="col-md-3">
                          <div className="card border-success"><div className="card-body text-center py-2">
                            <small className="text-muted d-block">{t("best_year")}</small>
                            <strong className="text-success">
                              {(() => { const yd = getYearlyRevenue(orders); return yd.reduce((max, y) => y.revenue > max.revenue ? y : max, yd[0]).year; })()}
                            </strong>
                          </div></div>
                        </div>
                        <div className="col-md-3">
                          <div className="card border-primary"><div className="card-body text-center py-2">
                            <small className="text-muted d-block">{t("avg_yearly_revenue")}</small>
                            <small className="text-primary">{formatTotal(getYearlyRevenue(orders).reduce((sum, y) => sum + y.revenue, 0) / getYearlyRevenue(orders).length, currentLanguage)}</small>
                          </div></div>
                        </div>
                        <div className="col-md-3">
                          <div className="card border-info"><div className="card-body text-center py-2">
                            <small className="text-muted d-block">{t("overall_growth")}</small>
                            <strong className="text-info">
                              {(() => {
                                const years = getYearlyRevenue(orders);
                                if (years.length > 1) {
                                  const growth = (((years[years.length - 1].revenue - years[0].revenue) / years[0].revenue) * 100).toFixed(1);
                                  return `${growth >= 0 ? "+" : ""}${growth}%`;
                                }
                                return "-";
                              })()}
                            </strong>
                          </div></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-light rounded">
                      <small className="text-muted"><i className="bi bi-info-circle me-2"></i><strong>{t("analysis")}:</strong> {t("yearly_comparison_description")}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment & Status Charts */}
          <div className="row">
            <div className="col-12 col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3"><TbReportAnalytics size={24} className="me-2" />{t("revenue_by_payment_method")}</h5>
                  <div className="chart-container">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={formattedPaymentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="60%" label={(entry) => `${entry.name} (${formatTotal(entry.value, currentLanguage)})`}>
                          {formattedPaymentData.map((entry, index) => (
                            <Cell key={index} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatTotal(value, currentLanguage)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Payment method breakdown table */}
                  {(() => {
                    const pieTotal = formattedPaymentData.reduce((sum, e) => sum + e.value, 0);
                    return (
                      <div className="mt-3">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>{t("payment_method")}</th>
                              <th className="text-end">{t("amount")}</th>
                              <th className="text-end">%</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formattedPaymentData.map((entry, index) => (
                              <tr key={index}>
                                <td>
                                  <span className="badge me-2" style={{ backgroundColor: PAYMENT_COLORS[index % PAYMENT_COLORS.length], width: "12px", height: "12px", display: "inline-block" }}></span>
                                  {entry.name}
                                </td>
                                <td className="text-end">{formatTotal(entry.value, currentLanguage)}</td>
                                <td className="text-end">
                                  {pieTotal > 0 && !isNaN(entry.value) ? ((entry.value / pieTotal) * 100).toFixed(1) : "0"}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}

                  <div className="mt-3 p-3 bg-light rounded">
                    <small className="text-muted"><i className="bi bi-info-circle me-2"></i><strong>{t("analysis")}:</strong> {t("revenue_by_payment_method_description")}</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3"><TbReportAnalytics size={24} className="me-2" />{t("revenue_by_status")}</h5>
                  <div className="chart-container">
                    <ResponsiveContainer>
                      <BarChart data={statusData(orders, filterYear).map((entry) => {
                        const label = entry.status === "pending" ? (currentLanguage === "mk" ? "Во тек" : "Pending")
                          : entry.status === "confirmed" ? (currentLanguage === "mk" ? "Потврдено" : "Confirmed")
                          : entry.status === "cancelled" ? (currentLanguage === "mk" ? "Откажано" : "Cancelled") : entry.status;
                        return { status: label, rawStatus: entry.status, Total: currentLanguage === "mk" ? entry.mkd : entry.eng };
                      })} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatTotal(value, currentLanguage)} />
                        <Bar dataKey="Total" name={currentLanguage === "mk" ? "Вкупно" : "Total"}>
                          {statusData(orders, filterYear).map((entry, index) => (
                            <Cell key={index} fill={COLORS[entry.status]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Status breakdown table */}
                  <div className="mt-3">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>{t("status")}</th>
                          <th className="text-end">{t("count")}</th>
                          <th className="text-end">{t("revenue")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statusData(orders, filterYear).map((entry) => {
                          const statusLabel = entry.status === "pending"
                            ? (currentLanguage === "mk" ? "Во тек" : "Pending")
                            : entry.status === "confirmed"
                              ? (currentLanguage === "mk" ? "Потврдено" : "Confirmed")
                              : entry.status === "cancelled"
                                ? (currentLanguage === "mk" ? "Откажано" : "Cancelled")
                                : entry.status;
                          return (
                            <tr key={entry.status}>
                              <td>
                                <span className="badge me-2" style={{ backgroundColor: COLORS[entry.status], width: "12px", height: "12px", display: "inline-block" }} />
                                {statusLabel}
                              </td>
                              <td className="text-end">{entry.count}</td>
                              <td className="text-end">{formatTotal(currentLanguage === "mk" ? entry.mkd : entry.eng, currentLanguage)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-3 p-3 bg-light rounded">
                    <small className="text-muted"><i className="bi bi-info-circle me-2"></i><strong>{t("analysis")}:</strong> {t("revenue_by_status_description")}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3">{t("top_products")}</h5>
                  {getTopProducts(orders, 5, filterYear).length > 0 ? (
                    <>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>#</th>
                              <th>{t("product_name")}</th>
                              <th className="text-center">{t("quantity_sold")}</th>
                              <th className="text-end">{t("revenue")}</th>
                              <th className="text-end">{t("avg_price")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getTopProducts(orders, 5, filterYear).map((product, index) => (
                              <tr key={index}>
                                <td><span className="badge bg-primary">{index + 1}</span></td>
                                <td><small>{product.name}</small></td>
                                <td className="text-center"><small>{product.count}</small></td>
                                <td className="text-end"><small>{formatTotal(product.revenue, currentLanguage)}</small></td>
                                <td className="text-end text-muted"><small>{formatTotal(product.revenue / product.count, currentLanguage)}</small></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-3 p-3 bg-light rounded">
                        <small className="text-muted"><i className="bi bi-info-circle me-2"></i><strong>{t("analysis")}:</strong> {t("top_products_description")}</small>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted">{t("no_products_found")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;