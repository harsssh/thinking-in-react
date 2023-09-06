type ProductCategory = "Fruits" | "Vegetables";

type Product = {
  category: ProductCategory;
  price: string;
  stocked: boolean;
  name: string;
};

type ProductRowProps = {
  product: Product;
};

type ProductTableProps = {
  products: Product[];
};

type FilterableProductTableProps = {
  products: Product[];
};

const PRODUCTS: Product[] = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];

function ProductCatagoryRow({ category }: Pick<Product, "category">) {
  return (
    <tr>
      <th colSpan={2}>{category}</th>
    </tr>
  );
}

function ProductRow({ product }: ProductRowProps) {
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

function ProductTable({ products }: ProductTableProps) {
  const rows: JSX.Element[] = [];
  let lastCategory: ProductCategory | null = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCatagoryRow
          category={product.category}
          key={product.category}
        />
      );
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

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

function Searchbar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" /> Only show productss in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }: FilterableProductTableProps) {
  return (
    <div>
      <Searchbar />
      <ProductTable products={products} />
    </div>
  );
}

function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}

export default App;
