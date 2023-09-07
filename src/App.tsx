import React, { useState } from "react";

type ProductCategory = "Fruits" | "Vegetables";

type Product = {
  category: ProductCategory;
  price: string;
  stocked: boolean;
  name: string;
};

type FilterableProductTableState = {
  filterText: string;
  inStockOnly: boolean;
};

type SearchbarProps = {
  onInStockOnlyChange: React.Dispatch<React.SetStateAction<boolean>>;
  onFilterTextChange: React.Dispatch<React.SetStateAction<string>>;
} & FilterableProductTableState;

type ProductTableProps = {
  products: Product[];
} & FilterableProductTableState;

const PRODUCTS: Product[] = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];

function ProductCategoryRow({ category }: Pick<Product, "category">) {
  return (
    <tr>
      <th colSpan={2}>{category}</th>
    </tr>
  );
}

function ProductRow({ product }: { product: Product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: "red" }}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

const groupProductsByCategory = (
  products: Product[]
): Map<ProductCategory, Product[]> => {
  const grouped = new Map<ProductCategory, Product[]>();
  products.forEach((product) => {
    const categoryProducts = grouped.get(product.category) || [];
    categoryProducts.push(product);
    grouped.set(product.category, categoryProducts);
  });
  return grouped;
};

const productFilter = (
  product: Product,
  filterText: string,
  inStockOnly: boolean
): boolean => {
  if (inStockOnly && !product.stocked) return false;
  if (filterText) {
    const lowerTrimedFilterText = filterText.toLowerCase().trim();
    if (!product.name.toLowerCase().includes(lowerTrimedFilterText))
      return false;
  }
  return true;
};

function ProductTable({
  products,
  filterText,
  inStockOnly,
}: ProductTableProps) {
  const filteredProducts = products.filter((product) =>
    productFilter(product, filterText, inStockOnly)
  );
  const groupedProducts = groupProductsByCategory(filteredProducts);
  const rows = Array.from(groupedProducts.entries()).flatMap(
    ([category, products]) => [
      <ProductCategoryRow key={category} category={category} />,
      ...products.map((product) => (
        <ProductRow key={product.name} product={product} />
      )),
    ]
  );

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function Searchbar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}: SearchbarProps) {
  return (
    <form>
      <input
        type="text"
        placeholder="Search..."
        value={filterText}
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />
        Only show productss in stock
      </label>
    </form>
  );
}

// Searchbarの検索テキスト, チェックボックスの状態を持つ
function FilterableProductTable({ products }: { products: Product[] }) {
  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <Searchbar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  );
}

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
