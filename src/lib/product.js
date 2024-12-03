import { useLocalization } from "../context/LocalizationContext";

// get products
export const getProducts = (products, category, type, limit) => {
  const finalProducts = category
    ? products.filter(
        (product) => product.category.filter((single) => single === category)[0]
      )
    : products;

  if (type && type === "new") {
    const newProducts = finalProducts.filter((single) => single.new);
    return newProducts.slice(0, limit ? limit : newProducts.length);
  }
  if (type && type === "popular") {
    return (
      finalProducts &&
      finalProducts
        .sort((a, b) => {
          return b.saleCount - a.saleCount;
        })
        .slice(0, limit ? limit : finalProducts.length)
    );
  }
  if (type && type === "topRated") {
    return (
      finalProducts &&
      finalProducts
        .sort((a, b) => {
          return b.rating - a.rating;
        })
        .slice(0, limit ? limit : finalProducts.length)
    );
  }
  if (type && type === "sale") {
    const saleItems =
      finalProducts &&
      finalProducts.filter((single) => single.discount && single.discount > 0);
    return saleItems.slice(0, limit ? limit : saleItems.length);
  }
  return (
    finalProducts &&
    finalProducts.slice(0, limit ? limit : finalProducts.length)
  );
};

// get product discount price
export const getDiscountPrice = (price, discount) => {
  return discount && discount > 0 ? price - price * (discount / 100) : price;
};

// get product cart quantity
export const getProductCartQuantity = (cartItems, product, color, size) => {
  let productInCart = cartItems.filter(
    (single) =>
      single.id === product.id &&
      (single.selectedProductColor
        ? single.selectedProductColor === color
        : true) &&
      (single.selectedProductSize ? single.selectedProductSize === size : true)
  )[0];
  if (cartItems.length >= 1 && productInCart) {
    if (product.variation) {
      return cartItems.filter(
        (single) =>
          single.id === product.id &&
          single.selectedProductColor === color &&
          single.selectedProductSize === size
      )[0].quantity;
    } else {
      return cartItems.filter((single) => product.id === single.id)[0].quantity;
    }
  } else {
    return 0;
  }
};

//get products based on category
export const getSortedProducts = (products, sortType, sortValue) => {
  if (products && sortType && sortValue) {
    if (sortType === "category") {
      return products.filter(
        (product) =>
          product.category.filter((single) => single === sortValue)[0]
      );
    }
    if (sortType === "tag") {
      return products.filter(
        (product) => product.tag.filter((single) => single === sortValue)[0]
      );
    }
    if (sortType === "color") {
      return products.filter(
        (product) =>
          product.variation &&
          product.variation.filter((single) => single.color === sortValue)[0]
      );
    }
    if (sortType === "size") {
      return products.filter(
        (product) =>
          product.variation &&
          product.variation.filter(
            (single) =>
              single.size.filter((single) => single.name === sortValue)[0]
          )[0]
      );
    }
    if (sortType === "filterSort") {
      let sortProducts = [...products];
      if (sortValue === "default") {
        return sortProducts;
      }
      if (sortValue === "priceHighToLow") {
        return sortProducts.sort((a, b) => {
          return b.price - a.price;
        });
      }
      if (sortValue === "priceLowToHigh") {
        return sortProducts.sort((a, b) => {
          return a.price - b.price;
        });
      }
    }
  }
  return products;
};

// get individual element
const getIndividualItemArray = (array) => {
  let individualItemArray = array.filter((v, i, self) => i === self.indexOf(v));
  return individualItemArray;
};

// get individual element object
const getIndividualColorObjectArray = (array) => {
  let individualObjectArray = array.filter((v, i, self) => {
    return (
      i ===
      self.findIndex(
        (t) => t.colorName === v.colorName && t.colorCode === v.colorCode
      )
    );
  });
  return individualObjectArray;
};

// get individual categories
export const getIndividualCategories = (products) => {
  const { t, currentLanguage } = useLocalization();

  let productCategories = [];
  products &&
    products.map((product) => {
      return (
        product.category &&
        product.category.map((single) => {
          productCategories.push(single);
        })
      );
    });
  const individualProductCategories = getIndividualItemArray(productCategories);

  const translatedCategories = individualProductCategories.map((category) => {
    // Check if translation exists for the category name
    if (t(`${category}`)) {
      return t(`${category}`);
    }
    return category; // Return the category name as-is if no translation is found
  });

  return translatedCategories;
};

// get individual tags
export const getIndividualTags = (products) => {
  const { t, currentLanguage } = useLocalization(); // Get translation function and current language

  let productTags = [];

  // Extract tags from products
  products &&
    products.map((product) => {
      return (
        product.tag &&
        product.tag.map((single) => {
          // Push the tag into the productTags array
          productTags.push(single);
        })
      );
    });

  // Remove duplicates using the helper function (assuming getIndividualItemArray is already defined)
  const individualProductTags = getIndividualItemArray(productTags);

  // Translate tags based on the current language
  const translatedTags = individualProductTags.map((tag) => {
    // Check if translation exists for the tag
    if (t(`${tag}`)) {
      return t(`${tag}`);
    }
    return tag; // Return the tag name as-is if no translation is found
  });

  return translatedTags;
};

// get individual colors
export const getIndividualColors = (products) => {
  let productColors = [];
  products &&
    products.map((product) => {
      return (
        product.variation &&
        product.variation.map((single) => {
          return productColors.push({
            colorName: single.color,
            colorCode: single.colorCode
          });
        })
      );
    });
  const individualProductColors = getIndividualColorObjectArray(productColors);
  return individualProductColors;
};

// get individual sizes
export const getProductsIndividualSizes = (products) => {
  let productSizes = [];
  products &&
    products.map((product) => {
      return (
        product.variation &&
        product.variation.map((single) => {
          return single.size.map((single) => {
            return productSizes.push(single.name);
          });
        })
      );
    });
  const individualProductSizes = getIndividualItemArray(productSizes);
  return individualProductSizes;
};

// get product individual sizes
export const getIndividualSizes = (product) => {
  let productSizes = [];
  product.variation &&
    product.variation.map((singleVariation) => {
      return (
        singleVariation.size &&
        singleVariation.size.map((singleSize) => {
          return productSizes.push(singleSize.name);
        })
      );
    });
  const individualSizes = getIndividualItemArray(productSizes);
  return individualSizes;
};

export const setActiveSort = (e) => {
  const filterButtons = document.querySelectorAll(
    ".single-sidebar-widget__list button, .tag-container button, .single-filter-widget__list button"
  );
  filterButtons.forEach((item) => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};

export const setActiveLayout = (e) => {
  const gridSwitchBtn = document.querySelectorAll(".grid-icons button");
  gridSwitchBtn.forEach((item) => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};
