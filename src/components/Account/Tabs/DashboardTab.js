import { Spinner, Badge } from "react-bootstrap";
import { logActivity } from "../../../pages/lib/logActivity";

const DashboardTab = ({
  t,
  role,
  displayName,
  email,
  orders,
  userId,
  allUsers,
  isLoading,
  currentLanguage,
  formatTotal,
  parseAmount,
  conversionRate,
  setShowLogoutModal,
  setShowBroadcastModal,
  fetchSubscriberStats,
  fetchSchedule,
}) => {
  return (
    <div className="my-account-area__content">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h3 className="mb-0">{t("dashboard")}</h3>
        <button
          onClick={async () => {
            await logActivity({
              username: email || "",
              userId: userId || "",
              action: "LOGOUT",
            });
            setShowLogoutModal(true);
          }}
          className="btn btn-danger"
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <>
              <i className="bi bi-box-arrow-right me-2"></i>
              {t("logout")}
            </>
          )}
        </button>
      </div>

      {/* Welcome Card */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <div
              className={`${role === "admin" ? "bg-danger" : "bg-primary"} text-white rounded-circle d-flex align-items-center justify-content-center me-3`}
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                padding: 0,
              }}
            >
              <i
                className={`bi ${role === "admin" ? "bi-shield-check" : "bi-person"}`}
              ></i>
            </div>
            <div>
              <h4 className="mb-1">
                {t("hello_user")} {displayName || ""}!
              </h4>
              {role === "admin" && (
                <Badge bg="danger">
                  <i className="bi bi-shield-check me-1"></i>
                  {t("admin")}
                </Badge>
              )}
              <p className="text-muted mb-0">{email}</p>
            </div>
          </div>
          <p className="mb-0">
            {role === "admin"
              ? t("admin_dashboard_welcome") || t("dashboard_welcome")
              : t("dashboard_welcome")}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4 g-3">
        {role === "admin" ? (
          <>
            <div className="col-md-3 col-sm-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="text-primary mb-2">
                    <i
                      className="bi bi-cart-check"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <h3 className="mb-1">{orders.length}</h3>
                  <small className="text-muted">{t("all_orders")}</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="text-warning mb-2">
                    <i
                      className="bi bi-clock-history"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <h3 className="mb-1">
                    {orders.filter((o) => o.status === "pending").length}
                  </h3>
                  <small className="text-muted">{t("pending_review")}</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="text-info mb-2">
                    <i
                      className="bi bi-people"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <h3 className="mb-1">{allUsers.length}</h3>
                  <small className="text-muted">{t("total_users")}</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="text-success mb-2">
                    <i
                      className="bi bi-currency-exchange"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <h3 className="mb-1" style={{ fontSize: "1.3rem" }}>
                    {formatTotal(
                      orders.reduce((sum, order) => {
                        const mk = parseFloat(order.totalMK || 0);
                        const en = parseFloat(order.totalEN || 0);
                        return currentLanguage === "mk"
                          ? sum + (mk > 0 ? mk : en * conversionRate)
                          : sum + (en > 0 ? en : mk / conversionRate);
                      }, 0),
                      currentLanguage,
                    )}
                  </h3>
                  <small className="text-muted">{t("total_revenue")}</small>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="col-md-3 col-sm-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="text-primary mb-2">
                    <i
                      className="bi bi-cart-check"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <h3 className="mb-1">{orders.length}</h3>
                  <small className="text-muted">{t("my_orders")}</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="text-warning mb-2">
                    <i
                      className="bi bi-clock-history"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <h3 className="mb-1">
                    {orders.filter((o) => o.status === "pending").length}
                  </h3>
                  <small className="text-muted">{t("pending")}</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="text-success mb-2">
                    <i
                      className="bi bi-check-circle"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <h3 className="mb-1">
                    {orders.filter((o) => o.status === "confirmed").length}
                  </h3>
                  <small className="text-muted">{t("confirmed")}</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="text-info mb-2">
                    <i
                      className="bi bi-currency-exchange"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <h3 className="mb-1" style={{ fontSize: "1.3rem" }}>
                    {formatTotal(
                      orders.reduce((sum, order) => {
                        const mk = parseFloat(order.totalMK || 0);
                        const en = parseFloat(order.totalEN || 0);
                        return currentLanguage === "mk"
                          ? sum + (mk > 0 ? mk : en * conversionRate)
                          : sum + (en > 0 ? en : mk / conversionRate);
                      }, 0),
                      currentLanguage,
                    )}
                  </h3>
                  <small className="text-muted">{t("total_spent")}</small>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-bottom">
            <div className="d-flex justify-content-between align-items-center w-100">
              <h5 className="mb-0 d-flex align-items-center gap-1">
                <i className="bi bi-clock-history text-primary"></i>
                {role === "admin"
                  ? t("recent_system_orders")
                  : t("recent_orders")}
              </h5>
              <small className="text-muted text-end">
                {t("last_5_orders")}
              </small>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    {role === "admin" && <th className="ps-3">{t("user")}</th>}
                    <th className={role === "admin" ? "" : "ps-3"}>
                      {t("order")}
                    </th>
                    <th>{t("date")}</th>
                    <th className="text-center">{t("status")}</th>
                    <th className="text-end pe-3">{t("total")}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="align-middle">
                      {role === "admin" && (
                        <td className="ps-3">
                          <small className="fw-bold">{order.displayName}</small>
                        </td>
                      )}
                      <td className={role === "admin" ? "" : "ps-3"}>
                        <span className="badge bg-secondary">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td>
                        <small>{order.date}</small>
                      </td>
                      <td className="text-center">
                        <Badge
                          pill
                          bg={
                            order.status === "pending"
                              ? "warning"
                              : order.status === "confirmed"
                                ? "success"
                                : "danger"
                          }
                          className="px-3 py-2"
                        >
                          {t(order.status)}
                        </Badge>
                      </td>
                      <td className="text-end pe-3">
                        <small>
                          {formatTotal(
                            order.displayTotal ??
                              (currentLanguage === "mk"
                                ? order.totalMK
                                : order.totalEN),
                            currentLanguage,
                          )}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0">
            <i className="bi bi-lightning-charge me-2 text-warning"></i>
            {t("quick_actions")}
          </h5>
        </div>
        <div className="card-body">
          {role === "admin" ? (
            <div className="row g-3">
              {[
                {
                  key: "orders",
                  icon: "bi-cart-check",
                  label: t("manage_orders"),
                  color: "primary",
                },
                {
                  key: "users",
                  icon: "bi-people",
                  label: t("view_users"),
                  color: "info",
                },
                {
                  key: "orders",
                  icon: "bi-graph-up",
                  label: t("view_reports"),
                  color: "success",
                  isReports: true,
                },
                {
                  key: "accountDetails",
                  icon: "bi-person-gear",
                  label: t("edit_profile"),
                  color: "secondary",
                },
              ].map((action, idx) => (
                <div className="col-md-3 col-sm-6" key={idx}>
                  <button
                    className={`btn btn-outline-${action.color} w-100`}
                    style={{ paddingTop: 0, paddingBottom: "0.5rem" }}
                    onClick={() => {
                      if (action.isReports) {
                        document
                          .querySelector('[data-rr-ui-event-key="orders"]')
                          ?.click();
                        setTimeout(() => {
                          document
                            .querySelector(".financial-reports")
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                        }, 100);
                      } else {
                        document
                          .querySelector(
                            `[data-rr-ui-event-key="${action.key}"]`,
                          )
                          ?.click();
                      }
                    }}
                  >
                    <i
                      className={`bi ${action.icon} d-block mb-2`}
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                    <small>{action.label}</small>
                  </button>
                </div>
              ))}
              <div className="col-md-3 col-sm-6">
                <button
                  className="btn btn-outline-warning w-100"
                  style={{ paddingTop: 0, paddingBottom: "0.5rem" }}
                  onClick={() => {
                    setShowBroadcastModal(true);
                    fetchSubscriberStats();
                    fetchSchedule();
                  }}
                >
                  <i
                    className="bi bi-send d-block mb-2"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  <small>{t("send_newsletter")}</small>
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {[
                {
                  key: "orders",
                  icon: "bi-cart-check",
                  label: t("view_orders"),
                  color: "primary",
                },
                {
                  key: "accountDetails",
                  icon: "bi-person-gear",
                  label: t("edit_profile"),
                  color: "success",
                },
                {
                  key: "download",
                  icon: "bi-download",
                  label: t("download_invoices"),
                  color: "info",
                },
              ].map((action, idx) => (
                <div className="col-md-4 col-sm-6" key={idx}>
                  <button
                    className={`btn btn-outline-${action.color} w-100`}
                    style={{ paddingTop: 0, paddingBottom: "0.5rem" }}
                    onClick={() =>
                      document
                        .querySelector(`[data-rr-ui-event-key="${action.key}"]`)
                        ?.click()
                    }
                  >
                    <i
                      className={`bi ${action.icon} d-block mb-2`}
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                    <small>{action.label}</small>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
