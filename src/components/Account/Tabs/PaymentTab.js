import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

const PaymentTab = ({
  t,
  role,
  currentLanguage,
  filteredOrdersForCharts,
  filteredOrdersForPayment,
  currentOrdersPayment,
  totalPagesPayment,
  currentPagePayment,
  handlePageChangePayment,
  formatTotal,
  parseAmount,
  conversionRate,
  filterYear,
  setFilterYear,
  formattedPaymentData,
  getMonthlyRevenue,
  getAverageOrderValue,
  PAYMENT_COLORS,
}) => {
  // Compute total from the pie chart's own data — avoids NaN when
  // grandTotalInDisplayCurrency (Orders-tab filtered) differs from chart data
  const pieTotal = formattedPaymentData.reduce((sum, e) => sum + e.value, 0);

  return (
    <div className="my-account-area__content">
      {role === "admin" && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <h3 className="mb-0">
              <i className="bi bi-graph-up-arrow me-2 text-primary"></i>
              {t("payment_analytics")}
            </h3>
            <div className="d-flex gap-2 flex-wrap">
              <select className="form-select form-select-sm" style={{ width: "auto" }} value={filterYear}
                onChange={(e) => { setFilterYear(e.target.value); }}>
                {[...Array(5)].map((_, idx) => {
                  const year = new Date().getFullYear() - idx;
                  return <option key={year} value={year.toString()}>{year}</option>;
                })}
              </select>
              <button className="btn btn-sm btn-outline-primary">
                <i className="bi bi-currency-exchange"></i>
                {currentLanguage === "mk" ? "MKD" : "EUR"}
              </button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="row mb-4 g-3">
            {[
              {
                icon: "bi-cash-stack", color: "primary",
                value: formatTotal(filteredOrdersForCharts.reduce((sum, order) => {
                  const mk = parseFloat(order.totalMK || 0); const en = parseFloat(order.totalEN || 0);
                  return currentLanguage === "mk" ? sum + (mk > 0 ? mk : en * conversionRate) : sum + (en > 0 ? en : mk / conversionRate);
                }, 0), currentLanguage),
                label: t("total_payments"),
              },
              { icon: "bi-calculator", color: "success", value: formatTotal(getAverageOrderValue(filteredOrdersForCharts), currentLanguage), label: t("avg_payment") },
              { icon: "bi-wallet2", color: "info", value: filteredOrdersForCharts.filter((o) => o.paymentMethod === "payment_cash").length, label: t("cash_payments") },
              { icon: "bi-bank", color: "warning", value: filteredOrdersForCharts.filter((o) => o.paymentMethod === "payment_bank").length, label: t("bank_payments") },
            ].map((stat, idx) => (
              <div className="col-md-3 col-sm-6" key={idx}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className={`text-${stat.color} mb-2`}>
                      <i className={`bi ${stat.icon}`} style={{ fontSize: "2rem" }}></i>
                    </div>
                    <h4 className="mb-1" style={{ fontSize: "1.3rem" }}>{stat.value}</h4>
                    <small className="text-muted">{stat.label}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="row mb-4">
            {/* Pie Chart */}
            <div className="col-lg-6 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3 d-flex align-items-center justify-content-center">
                    <i className="bi bi-pie-chart me-2 text-primary"></i>
                    {t("payment_method_distribution")}
                  </h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={formattedPaymentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="60%"
                        label={(entry) => `${entry.name} (${((entry.percent || 0) * 100).toFixed(1)}%)`}>
                        {formattedPaymentData.map((entry, index) => (
                          <Cell key={index} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatTotal(value, currentLanguage)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-3">
                    <table className="table table-sm table-borderless" style={{ fontSize: "0.75rem" }}>
                      <tbody>
                        {formattedPaymentData.map((entry, index) => (
                          <tr key={index}>
                            <td style={{ width: "20px" }}>
                              <span className="badge" style={{ backgroundColor: PAYMENT_COLORS[index % PAYMENT_COLORS.length], width: "12px", height: "12px", display: "inline-block" }}></span>
                            </td>
                            <td><small className="fw-bold">{entry.name}</small></td>
                            <td className="text-end">
                              <small className="text-muted">
                                {filteredOrdersForCharts.filter((o) =>
                                  (entry.name === (currentLanguage === "mk" ? "Готовина" : "Cash") && o.paymentMethod === "payment_cash") ||
                                  (entry.name === (currentLanguage === "mk" ? "Банка" : "Bank") && o.paymentMethod === "payment_bank")
                                ).length} {t("orders")}
                              </small>
                            </td>
                            <td className="text-end"><small className="fw-bold">{formatTotal(entry.value, currentLanguage)}</small></td>
                            <td className="text-end">
                              <span className="badge bg-light text-dark">{pieTotal > 0 && !isNaN(entry.value) ? ((entry.value / pieTotal) * 100).toFixed(1) : "0"}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="col-lg-6 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3 d-flex align-items-center justify-content-center">
                    <i className="bi bi-graph-up me-2 text-success"></i>
                    {t("monthly_payment_trends")}
                  </h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getMonthlyRevenue(filteredOrdersForCharts, parseInt(filterYear))}>
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => formatTotal(value, currentLanguage)} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#0088FE" name={currentLanguage === "mk" ? "Приход" : "Revenue"} />
                    </BarChart>
                  </ResponsiveContainer>
                  {(() => {
                    const monthlyData = getMonthlyRevenue(filteredOrdersForCharts, parseInt(filterYear));
                    const best = monthlyData.reduce((max, m) => m.revenue > max.revenue ? m : max, monthlyData[0]);
                    return (
                      <div className="row mt-3 g-2">
                        <div className="col-6">
                          <div className="card border-success"><div className="card-body text-center py-2">
                            <small className="text-muted d-block">{t("best_month")}</small>
                            <strong className="text-success">{best?.month || "-"}</strong>
                          </div></div>
                        </div>
                        <div className="col-6">
                          <div className="card border-info"><div className="card-body text-center py-2">
                            <small className="text-muted d-block">{t("total_months")}</small>
                            <strong className="text-info">{monthlyData.filter((m) => m.revenue > 0).length}</strong>
                          </div></div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Cash vs Bank Comparison */}
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3 d-flex align-items-center justify-content-center">
                    <i className="bi bi-bar-chart-line me-2 text-info"></i>
                    {t("payment_method_comparison")}
                  </h5>
                  <div className="row g-3">
                    {[
                      { method: "payment_cash", color: "success", icon: "bi-cash", label: t("payment_cash") },
                      { method: "payment_bank", color: "primary", icon: "bi-bank", label: t("payment_bank") },
                    ].map(({ method, color, icon, label }) => {
                      const methodOrders = filteredOrdersForCharts.filter((o) => o.paymentMethod === method);
                      const total = methodOrders.reduce((sum, order) => {
                        const mk = parseFloat(order.totalMK || 0); const en = parseFloat(order.totalEN || 0);
                        return currentLanguage === "mk" ? sum + (mk > 0 ? mk : en * conversionRate) : sum + (en > 0 ? en : mk / conversionRate);
                      }, 0);
                      return (
                        <div className="col-md-6" key={method}>
                          <div className={`card border-${color}`}>
                            <div className={`card-header bg-${color} text-white`}>
                              <h6 className="mb-0"><i className={`bi ${icon} me-2`}></i>{label}</h6>
                            </div>
                            <div className="card-body">
                              <div className="row text-center">
                                <div className="col-6 border-end">
                                  <h4 className={`text-${color} mb-1`}>{methodOrders.length}</h4>
                                  <small className="text-muted">{t("transactions")}</small>
                                </div>
                                <div className="col-6">
                                  <h4 className={`text-${color} mb-1`} style={{ fontSize: "1.2rem" }}>{formatTotal(total, currentLanguage)}</h4>
                                  <small className="text-muted">{t("total")}</small>
                                </div>
                              </div>
                              <hr />
                              <div className="text-center">
                                <small className="text-muted">{t("avg_transaction")}</small>
                                <h5 className={`text-${color} mt-1`}>{formatTotal(getAverageOrderValue(methodOrders), currentLanguage)}</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Payment Details Table (admin + guest) */}
      <div className="card border-0 shadow-sm mb-4 mt-4">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-3 d-flex align-items-center justify-content-center">
            <i className="bi bi-table me-2"></i>
            {t("payment_details")}
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="table table-hover mb-0">
              <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr>
                  {role === "admin" && <th className="ps-3" style={{ minWidth: "150px" }}><i className="bi bi-person me-2"></i>{t("user")}</th>}
                  <th style={{ minWidth: "120px" }}><i className="bi bi-receipt me-2"></i>{t("order")}</th>
                  <th style={{ minWidth: "110px" }}><i className="bi bi-calendar me-2"></i>{t("date")}</th>
                  <th style={{ minWidth: "150px" }}><i className="bi bi-credit-card me-2"></i>{t("payment_method")}</th>
                  <th className="text-end pe-3" style={{ minWidth: "130px" }}><i className="bi bi-currency-exchange me-2"></i>{t("amount")}</th>
                  <th className="text-center pe-3" style={{ minWidth: "100px" }}><i className="bi bi-info-circle me-2"></i>{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {currentOrdersPayment.map((order) => (
                  <tr key={order.id} className="align-middle">
                    {role === "admin" && <td className="ps-3"><small>{order.displayName}</small></td>}
                    <td><span className="badge bg-light text-dark border"><small>{order.orderNumber}</small></span></td>
                    <td><small>{order.date}</small></td>
                    <td>
                      <span className={`badge ${order.paymentMethod === "payment_cash" ? "bg-success" : "bg-primary"}`}>
                        <i className={`bi ${order.paymentMethod === "payment_cash" ? "bi-cash" : "bi-bank"} me-1`}></i>
                        <small>{order.paymentMethod === "payment_cash" ? t("payment_cash") : t("payment_bank")}</small>
                      </span>
                    </td>
                    <td className="text-end pe-3">
                      <small className="fw-bold">{formatTotal(order.displayTotal ?? (currentLanguage === "mk" ? order.totalMK : order.totalEN), currentLanguage)}</small>
                    </td>
                    <td className="text-center pe-3">
                      <span className={`badge ${order.status === "confirmed" ? "bg-success" : order.status === "pending" ? "bg-warning" : "bg-danger"}`}>
                        <small>{t(order.status)}</small>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-secondary" style={{ position: "sticky", bottom: 0, zIndex: 1 }}>
                <tr className="fw-bold">
                  <td colSpan={role === "admin" ? 4 : 3} className={role === "admin" ? "ps-3" : ""}>
                    <i className="bi bi-calculator me-2"></i>{t("total")}
                  </td>
                  <td className="text-end pe-3 text-primary">
                    {formatTotal(filteredOrdersForCharts.reduce((sum, order) => {
                      const mk = parseFloat(order.totalMK || 0); const en = parseFloat(order.totalEN || 0);
                      return currentLanguage === "mk" ? sum + (mk > 0 ? mk : en * conversionRate) : sum + (en > 0 ? en : mk / conversionRate);
                    }, 0), currentLanguage)}
                  </td>
                  <td className="pe-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Pagination */}
          {totalPagesPayment > 1 && (
            <div className="d-flex justify-content-between align-items-center p-3 border-top flex-wrap gap-3">
              <span className="text-muted small">{t("showing")} {currentOrdersPayment.length} {t("of")} {filteredOrdersForPayment.length} {t("orders")}</span>
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPagePayment === 1 ? "disabled" : ""}`}>
                    <button type="button" className="page-link py-1 px-2" onClick={() => handlePageChangePayment(currentPagePayment - 1)} disabled={currentPagePayment === 1}>{t("previous")}</button>
                  </li>
                  {[...Array(totalPagesPayment)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (pageNumber === 1 || pageNumber === totalPagesPayment || (pageNumber >= currentPagePayment - 1 && pageNumber <= currentPagePayment + 1)) {
                      return (
                        <li key={pageNumber} className={`page-item ${currentPagePayment === pageNumber ? "active" : ""}`}>
                          <button type="button" className="page-link py-1 px-2" onClick={() => handlePageChangePayment(pageNumber)}>{pageNumber}</button>
                        </li>
                      );
                    } else if (pageNumber === currentPagePayment - 2 || pageNumber === currentPagePayment + 2) {
                      return <li key={`ellipsis-${pageNumber}`} className="page-item disabled"><span className="page-link py-1 px-2">...</span></li>;
                    }
                    return null;
                  })}
                  <li className={`page-item ${currentPagePayment === totalPagesPayment ? "disabled" : ""}`}>
                    <button type="button" className="page-link py-1 px-2" onClick={() => handlePageChangePayment(currentPagePayment + 1)} disabled={currentPagePayment === totalPagesPayment}>{t("next")}</button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentTab;