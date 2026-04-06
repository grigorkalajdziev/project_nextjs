import React, { useState, useEffect } from "react";
import { Badge, Spinner, Modal, Button } from "react-bootstrap";
import { IoFilter } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { useDispatch } from "react-redux";
import ProductForm from "./ProductForm";
import { database, ref, set, get, remove } from "../../../pages/api/register";
import { fetchProducts as fetchProductsAction } from "../../../redux/actions/productActions";
import { useToasts } from "react-toast-notifications";

const ProductsTab = ({ t, role, currentLanguage, user }) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const productsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products.filter((p) => {
      const name = currentLanguage === "mk" ? p.name?.mk : p.name?.en;
      const matchesSearch =
        !searchQuery || name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === "all" ||
        (p.category && p.category.includes(filterCategory));
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterCategory, products, currentLanguage]);

  useEffect(() => {
    const cats = new Set();
    products.forEach((p) => {
      if (Array.isArray(p.category)) p.category.forEach((cat) => cats.add(cat));
    });
    setCategories(Array.from(cats).sort());
  }, [products]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const snapshot = await get(ref(database, "products"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const productList = Object.entries(data)
          .map(([firebaseKey, product]) => ({ ...product, id: firebaseKey }))
          .filter(Boolean);
        setProducts(productList);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      addToast(t("error_loading_products"), { appearance: "error", autoDismiss: true });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FIXED: generates a proper numeric ID for new products
  const getNextProductId = async () => {
    const snapshot = await get(ref(database, "products"));
    if (!snapshot.exists()) return 0;

    const data = snapshot.val();
    const keys = Object.keys(data);

    // Find the highest numeric key (ignores any old string keys like "product_xxx")
    const maxNumericId = keys.reduce((max, key) => {
      const num = parseInt(key, 10);
      return !isNaN(num) && num > max ? num : max;
    }, -1);

    return maxNumericId + 1; // e.g. if highest is 33, returns 34
  };

  const handleSaveProduct = async (formData) => {
    setIsLoading(true);
    try {
      // If editing, keep existing id. If new, generate next numeric id.
      const productId = editingProduct?.id ?? await getNextProductId();

      await set(ref(database, `products/${productId}`), {
        ...formData,
        id: productId,
        updatedAt: new Date().toISOString(),
      });

      addToast(editingProduct ? t("product_updated") : t("product_added"), {
        appearance: "success",
        autoDismiss: true,
      });
      setShowForm(false);
      fetchProducts();                 // update local tab state
      dispatch(fetchProductsAction()); // sync Redux → shop page updates instantly
    } catch (err) {
      addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    setIsLoading(true);
    try {
      await remove(ref(database, `products/${pendingDeleteId}`));
      addToast(t("product_deleted"), { appearance: "success", autoDismiss: true });
      setShowDeleteModal(false);
      setPendingDeleteId(null);
      fetchProducts();                 // update local tab state
      dispatch(fetchProductsAction()); // sync Redux → shop page updates instantly
    } catch (err) {
      addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfFirst = (currentPage - 1) * productsPerPage;
  const indexOfLast = currentPage * productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (page) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const formatPrice = (priceEn, priceMk) => {
    const amount = currentLanguage === "en" ? priceEn : priceMk;
    const currency = currentLanguage === "en" ? "€" : "ден";
    return amount != null ? `${Number(amount).toFixed(2)} ${currency}` : "-";
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{t("products_services")}</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="my-account-area__content">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h3 className="mb-0">{t("products_services")}</h3>
        <div className="d-flex align-items-center gap-2">
          {products.length > 0 && (
            <span className="badge bg-primary" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>
              {filteredProducts.length} {t("products")}
            </span>
          )}
          {role === "admin" && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => { setEditingProduct(null); setShowForm(true); }}
              disabled={isLoading}
            >
              <i className="bi bi-plus-circle me-2"></i>
              {t("add_product")}
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {/* Filter Toggle */}
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
                <div className="col-md-6">
                  <label className="form-label">{t("search_products")}</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("search_placeholder")}
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      style={{ paddingLeft: "40px", paddingRight: searchQuery ? "40px" : "12px", fontSize: "12px" }}
                    />
                    <IoIosSearch
                      style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "20px", color: "#6c757d", pointerEvents: "none" }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                        style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#dc3545" }}
                      >✕</button>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    <i className="bi bi-funnel me-1"></i>
                    {t("filter_category")}
                  </label>
                  <select
                    className="form-select"
                    value={filterCategory}
                    onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                    style={{ fontSize: "12px" }}
                  >
                    <option value="all">{t("all_categories")}</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Products Table */}
          <div
            className="table-responsive"
            style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #dee2e6", position: "relative" }}
          >
            <table
              className="table table-hover table-striped mb-0"
              style={{ borderCollapse: "separate", borderSpacing: "0" }}
            >
              <thead className="table-primary" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr>
                  <th className="ps-3" style={{ minWidth: "90px" }}>
                    <i className="bi bi-upc me-2"></i>{t("sku")}
                  </th>
                  <th style={{ minWidth: "160px" }}>
                    <i className="bi bi-box me-2"></i>{t("name")}
                  </th>
                  <th style={{ minWidth: "120px" }}>
                    <i className="bi bi-tag me-2"></i>{t("category")}
                  </th>
                  <th style={{ minWidth: "110px" }}>
                    <i className="bi bi-currency-exchange me-2"></i>{t("price")}
                  </th>
                  <th className="text-center" style={{ minWidth: "80px" }}>
                    <i className="bi bi-percent me-2"></i>{t("discount")}
                  </th>
                  <th className="text-center" style={{ minWidth: "80px" }}>
                    <i className="bi bi-archive me-2"></i>{t("stock")}
                  </th>
                  <th className="text-center" style={{ minWidth: "100px" }}>
                    <i className="bi bi-star me-2"></i>{t("rating")}
                  </th>
                  <th className="text-center" style={{ minWidth: "80px" }}>
                    <i className="bi bi-graph-up me-2"></i>{t("sales")}
                  </th>
                  {role === "admin" && (
                    <th className="text-center pe-3" style={{ minWidth: "180px" }}>
                      <i className="bi bi-gear me-2"></i>{t("actions")}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr key={product.id} className="align-middle">
                      <td className="ps-3">
                        <span className="badge bg-secondary">{product.sku}</span>
                      </td>
                      <td>
                        <small className="text-dark fw-semibold">
                          {currentLanguage === "mk"
                            ? product.name?.mk || product.name?.en
                            : product.name?.en || product.name?.mk}
                        </small>
                      </td>
                      <td>
                        {Array.isArray(product.category) &&
                          product.category.map((cat) => (
                            <span key={cat} className="badge bg-info text-dark me-1">
                              <small>{cat}</small>
                            </span>
                          ))}
                      </td>
                      <td>
                        <small className="text-success">
                          {formatPrice(product.price?.en, product.price?.mk)}
                        </small>
                      </td>
                      <td className="text-center">
                        {product.discount > 0 ? (
                          <span className="badge bg-warning text-dark">{product.discount}%</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="text-center">
                        {product.stock > 0 ? (
                          <span className="badge bg-success"><small>{product.stock}</small></span>
                        ) : (
                          <span className="badge bg-danger"><small>{t("out_of_stock")}</small></span>
                        )}
                      </td>
                      <td className="text-center">
                        <small>
                          <span className="text-warning">{"★".repeat(product.rating || 0)}</span>
                          <span className="text-muted">{"★".repeat(5 - (product.rating || 0))}</span>
                        </small>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-info text-dark">
                          <small>{product.saleCount || 0}</small>
                        </span>
                      </td>
                      {role === "admin" && (
                        <td className="text-center pe-3">
                          <div className="d-flex gap-2 justify-content-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => { setEditingProduct(product); setShowForm(true); }}
                              disabled={isLoading}
                            >
                              <i className="bi bi-pencil me-1"></i>{t("edit")}
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => { setPendingDeleteId(product.id); setShowDeleteModal(true); }}
                              disabled={isLoading}
                            >
                              <i className="bi bi-trash me-1"></i>{t("delete")}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={role === "admin" ? 9 : 8} className="text-center py-5 text-muted">
                      <i className="bi bi-box" style={{ fontSize: "2rem", color: "#ccc", display: "block", marginBottom: "0.5rem" }}></i>
                      {t("no_products")}
                    </td>
                  </tr>
                )}
              </tbody>

              {currentProducts.length > 0 && (
                <tfoot className="table-secondary" style={{ position: "sticky", bottom: 0, zIndex: 1 }}>
                  <tr className="fw-bold">
                    <td colSpan={role === "admin" ? 7 : 6} className="ps-3">
                      <i className="bi bi-calculator me-2"></i>{t("total")}
                    </td>
                    <td className="text-center text-primary">
                      <small>{filteredProducts.reduce((sum, p) => sum + (p.saleCount || 0), 0)}</small>
                    </td>
                    {role === "admin" && <td className="pe-3" />}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-4 gap-2">
              <div className="text-muted text-center text-sm-start">
                <small>
                  {t("showing")} {Math.min(indexOfFirst + 1, filteredProducts.length)}–{Math.min(indexOfLast, filteredProducts.length)} {t("of")} {filteredProducts.length} {t("products")}
                </small>
              </div>
              <nav>
                <ul className="pagination mb-0 flex-wrap justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button type="button" className="page-link py-1 px-2" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                      {t("previous")}
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                      return (
                        <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? "active" : ""}`}>
                          <button type="button" className="page-link py-1 px-2" onClick={() => paginate(pageNumber)}>
                            {pageNumber}
                          </button>
                        </li>
                      );
                    } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                      return (
                        <li key={`ellipsis-${pageNumber}`} className="page-item disabled">
                          <span className="page-link py-1 px-2">...</span>
                        </li>
                      );
                    }
                    return null;
                  })}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button type="button" className="page-link py-1 px-2" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                      {t("next")}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}

          {/* Summary Stats */}
          <div className="row mt-4 g-3">
            {[
              { label: t("total_products") || t("products"), value: filteredProducts.length, color: "primary" },
              { label: t("in_stock"), value: filteredProducts.filter((p) => p.stock > 0).length, color: "success" },
              { label: t("out_of_stock"), value: filteredProducts.filter((p) => !p.stock || p.stock === 0).length, color: "danger" },
              { label: t("with_discount") || t("discount"), value: filteredProducts.filter((p) => p.discount > 0).length, color: "warning" },
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

      {/* Product Form Modal */}
      <ProductForm
        show={showForm}
        onHide={() => setShowForm(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
        categories={categories}
        isLoading={isLoading}
        currentLanguage={currentLanguage}
        t={t}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("confirm_delete")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("delete_warning")}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={isLoading}>
            {t("cancel")}
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct} disabled={isLoading}>
            {isLoading && <Spinner as="span" animation="border" size="sm" className="me-2" />}
            {t("delete_product")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductsTab;