import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { FaInfoCircle } from "react-icons/fa";

const getCategoryPath = (categories) => {
  const cat = (categories[0] || "").toLowerCase();
  if (cat === "decor")     return "/assets/images/product/decor/";
  if (cat === "fashion")   return "/assets/images/product/fashion/";
  if (cat === "cosmetics") return "/assets/images/product/cosmetics/";
  if (cat === "makeup")    return "/assets/images/product/cosmetics/";
  return "/assets/images/product/";
};

const ProductForm = ({
  show,
  onHide,
  product,
  onSave,
  categories,
  isLoading,
  currentLanguage,
  t,
}) => {
  const { addToast } = useToasts();

  const [formData, setFormData] = useState({
    name: { en: "", mk: "" },
    shortDescription: { en: "", mk: "" },
    fullDescription: { en: "", mk: "" },
    category: [],
    price: { en: 0, mk: 0 },
    discount: 0,
    stock: 0,
    sku: "",
    slug: "",
    tag: [],
    rating: 5,
    saleCount: 0,
    new: false,
    image: [],
    thumbImage: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [thumbImageFiles, setThumbImageFiles] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: { en: "", mk: "", ...(product.name || {}) },
        shortDescription: { en: "", mk: "", ...(product.shortDescription || {}) },
        fullDescription: { en: "", mk: "", ...(product.fullDescription || {}) },
        category: Array.isArray(product.category) ? product.category : [],
        price: { en: product.price?.en ?? 0, mk: product.price?.mk ?? 0 },
        discount: product.discount ?? 0,
        stock: product.stock ?? 0,
        sku: product.sku ?? "",
        slug: product.slug ?? "",
        tag: Array.isArray(product.tag) ? product.tag : [],
        rating: product.rating ?? 5,
        saleCount: product.saleCount ?? 0,
        new: product.new ?? false,
        image: Array.isArray(product.image) ? product.image : [],
        thumbImage: Array.isArray(product.thumbImage) ? product.thumbImage : [],
      });
      setTagInput("");
      setCategoryInput("");
      setErrors({});
    } else {
      resetForm();
    }
  }, [show, product]);

  const resetForm = () => {
    setFormData({
      name: { en: "", mk: "" },
      shortDescription: { en: "", mk: "" },
      fullDescription: { en: "", mk: "" },
      category: [],
      price: { en: 0, mk: 0 },
      discount: 0,
      stock: 0,
      sku: "",
      slug: "",
      tag: [],
      rating: 5,
      saleCount: 0,
      new: false,
      image: [],
      thumbImage: [],
    });
    setImageFiles([]);
    setThumbImageFiles([]);
    setErrors({});
    setTagInput("");
    setCategoryInput("");
  };

  const handleBilingualChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [currentLanguage]: value },
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleInputChange = (field, value, lang = null) => {
    if (lang) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const folder = getCategoryPath(formData.category);

    if (type === "image") {
      setImageFiles((prev) => [...prev, ...files]);
      setFormData((prev) => ({
        ...prev,
        image: [...prev.image, ...files.map((f) => `${folder}${f.name}`)],
      }));
    } else {
      setThumbImageFiles((prev) => [...prev, ...files]);
      setFormData((prev) => ({
        ...prev,
        thumbImage: [...prev.thumbImage, ...files.map((f) => `${folder}${f.name}`)],
      }));
    }
    e.target.value = "";
  };

  const removeImage = (index, type) => {
    if (type === "image") {
      setFormData((prev) => ({
        ...prev,
        image: prev.image.filter((_, i) => i !== index),
      }));
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setFormData((prev) => ({
        ...prev,
        thumbImage: prev.thumbImage.filter((_, i) => i !== index),
      }));
      setThumbImageFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (value && !formData.tag.includes(value)) {
      setFormData((prev) => ({ ...prev, tag: [...prev.tag, value] }));
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tag: prev.tag.filter((_, i) => i !== index),
    }));
  };

  const addCategory = () => {
    const value = categoryInput.trim();
    if (value && !formData.category.includes(value)) {
      setFormData((prev) => ({ ...prev, category: [...prev.category, value] }));
      setCategoryInput("");
    }
  };

  const removeCategory = (index) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name[currentLanguage]?.trim()) newErrors.name = "error_name_required";
    if (!formData.shortDescription[currentLanguage]?.trim()) newErrors.shortDescription = "error_short_description_required";
    if (!formData.fullDescription[currentLanguage]?.trim()) newErrors.fullDescription = "error_full_description_required";
    if (!formData.sku) newErrors.sku = "error_sku_required";
    if (!formData.slug) newErrors.slug = "error_slug_required";
    if (Number(formData.price.en) <= 0 || Number(formData.price.mk) <= 0)
      newErrors.price = "error_price_required";
    if (Number(formData.stock) < 0) newErrors.stock = "error_stock_negative";
    if (Number(formData.discount) < 0 || Number(formData.discount) > 100)
      newErrors.discount = "error_discount_range";
    if (formData.category.length === 0) newErrors.category = "error_category_required";

    if (Object.keys(newErrors).length) {
      Object.values(newErrors).forEach((msgKey) =>
        addToast(t(msgKey), { appearance: "error", autoDismiss: true })
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    await onSave(formData, imageFiles, thumbImageFiles);
    resetForm();
  };

  const categoryPath = getCategoryPath(formData.category);
  const noCategorySelected = formData.category.length === 0;

  return (
    <Modal show={show} onHide={onHide} centered size="xl" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {product ? t("edit_product") : t("add_product")}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Form>

          {/* ── Product Name ── */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("product_name")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />{t("desc_name")}</Form.Text>
                <Form.Control
                  type="text"
                  value={formData.name[currentLanguage]}
                  onChange={(e) => handleBilingualChange("name", e.target.value)}
                  isInvalid={!!errors.name}
                  placeholder={t("enter_name")}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ── Short Description ── */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("short_description")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />{t("desc_short_description")}</Form.Text>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.shortDescription[currentLanguage]}
                  onChange={(e) => handleBilingualChange("shortDescription", e.target.value)}
                  isInvalid={!!errors.shortDescription}
                  placeholder={t("enter_short_description")}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ── Full Description ── */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("full_description")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />{t("desc_full_description")}</Form.Text>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={formData.fullDescription[currentLanguage]}
                  onChange={(e) => handleBilingualChange("fullDescription", e.target.value)}
                  isInvalid={!!errors.fullDescription}
                  placeholder={t("enter_full_description")}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ── SKU & Slug ── */}
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("sku")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />{t("desc_sku")}</Form.Text>
                <Form.Control
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  isInvalid={!!errors.sku}
                  placeholder={t("example_sku")}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("slug")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />{t("desc_slug")}</Form.Text>
                <Form.Control
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  isInvalid={!!errors.slug}
                  placeholder={t("example_slug")}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ── Prices ── */}
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("price_eur")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />{t("desc_price_eur")}</Form.Text>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={formData.price.en}
                  onChange={(e) =>
                    handleInputChange("price", isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value), "en")
                  }
                  isInvalid={!!errors.price}
                  placeholder={t("enter_price")}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("price_mkd")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />{t("desc_price_mkd")}</Form.Text>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={formData.price.mk}
                  onChange={(e) =>
                    handleInputChange("price", isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value), "mk")
                  }
                  isInvalid={!!errors.price}
                  placeholder={t("enter_price")}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ── Discount, Stock, Rating ── */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("discount_percent")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />{t("desc_discount")}</Form.Text>
                <Form.Control
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) =>
                    handleInputChange("discount", isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))
                  }
                  isInvalid={!!errors.discount}
                  placeholder="0"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("stock")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />{t("desc_stock")}</Form.Text>
                <Form.Control
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    handleInputChange("stock", isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10))
                  }
                  isInvalid={!!errors.stock}
                  placeholder="0"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("rating_1_5")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />{t("desc_rating")}</Form.Text>
                <Form.Control
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) =>
                    handleInputChange("rating", isNaN(parseInt(e.target.value, 10)) ? 5 : parseInt(e.target.value, 10))
                  }
                  placeholder="5"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ── New & Sales Count ── */}
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("mark_as_new")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />{t("desc_mark_as_new")}</Form.Text>
                <Form.Check
                  type="checkbox"
                  label={t("mark_as_new")}
                  checked={formData.new}
                  onChange={(e) => handleInputChange("new", e.target.checked)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("sales_count")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />{t("desc_sales_count")}</Form.Text>
                <Form.Control
                  type="number"
                  min="0"
                  value={formData.saleCount}
                  onChange={(e) =>
                    handleInputChange("saleCount", isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10))
                  }
                  placeholder="0"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ── Categories ── */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("categories")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />{t("desc_categories")}</Form.Text>
                <div className="d-flex gap-2 mb-2">
                  <Form.Control
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    placeholder={t("enter_category_and_press_add")}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCategory(); } }}
                    isInvalid={!!errors.category}
                  />
                  <Button variant="outline-primary" onClick={addCategory}>{t("add")}</Button>
                </div>
                {formData.category.length > 0 && (
                  <div className="alert alert-info py-1 px-2 mb-2" style={{ fontSize: "0.82rem" }}>
                    📁 {t("image_save_path")}: <strong>{categoryPath}</strong>
                  </div>
                )}
                <div className="d-flex flex-wrap gap-2">
                  {formData.category.map((cat, idx) => (
                    <span key={idx} className="badge bg-primary">
                      {cat}
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-1"
                        style={{ fontSize: "0.7rem" }}
                        onClick={() => removeCategory(idx)}
                        aria-label={t("remove_category")}
                      />
                    </span>
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* ── Tags ── */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("tags")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />{t("desc_tags")}</Form.Text>
                <div className="d-flex gap-2 mb-2">
                  <Form.Control
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder={t("enter_tag_and_press_add")}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  />
                  <Button variant="outline-primary" onClick={addTag}>{t("add")}</Button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {formData.tag.map((tag, idx) => (
                    <span key={idx} className="badge bg-success">
                      {tag}
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-1"
                        style={{ fontSize: "0.7rem" }}
                        onClick={() => removeTag(idx)}
                        aria-label={t("remove_tag")}
                      />
                    </span>
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* ── Images ── */}
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("product_images")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />
                  {t("desc_product_images")}
                  {!noCategorySelected && (
                    <> {t("files_saved_to")}: <strong>{categoryPath}</strong></>
                  )}
                </Form.Text>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={noCategorySelected}
                  onChange={(e) => handleImageUpload(e, "image")}
                />
                {noCategorySelected && (
                  <Form.Text className="text-warning fw-semibold">
                    {t("warning_add_category_before_upload")}
                  </Form.Text>
                )}
                <small className="text-muted d-block mt-2">
                  {t("current_images")}: {formData.image.length}
                </small>
                <div className="mt-2">
                  {formData.image.map((img, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                      <span className="text-truncate" style={{ fontSize: "0.8rem" }}>{img}</span>
                      <Button variant="outline-danger" size="sm" onClick={() => removeImage(idx, "image")}>
                        {t("remove")}
                      </Button>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">{t("thumbnail_image")}</Form.Label>
                <Form.Text className="text-muted d-block mb-1" style={{ fontSize: "0.72rem" }}><FaInfoCircle className="me-1" style={{ color: "#0d6efd", flexShrink: 0, marginTop: "-2px" }} />
                  {t("desc_thumbnail_image")}
                  {!noCategorySelected && (
                    <> {t("files_saved_to")}: <strong>{categoryPath}</strong></>
                  )}
                </Form.Text>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={noCategorySelected}
                  onChange={(e) => handleImageUpload(e, "thumb")}
                />
                {noCategorySelected && (
                  <Form.Text className="text-warning fw-semibold">
                    {t("warning_add_category_before_upload")}
                  </Form.Text>
                )}
                <small className="text-muted d-block mt-2">
                  {t("current_thumbnails")}: {formData.thumbImage.length}
                </small>
                <div className="mt-2">
                  {formData.thumbImage.map((thumb, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                      <span className="text-truncate" style={{ fontSize: "0.8rem" }}>{thumb}</span>
                      <Button variant="outline-danger" size="sm" onClick={() => removeImage(idx, "thumb")}>
                        {t("remove")}
                      </Button>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>

        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          {t("cancel")}
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Spinner as="span" animation="border" size="sm" className="me-2" /> : null}
          {product ? t("update_product") : t("add_product")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductForm;