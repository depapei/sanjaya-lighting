"use client";

interface IProductInterface {
  [key: string]: any;
}

type ProductTableProps = {
  data: IProductInterface[];
  onEdit: (product: IProductInterface) => void;
  onClick: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function ProductTable({
  data,
  onEdit,
  onDelete,
  onClick,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Product</th>
            <th className="px-4 py-3 text-left">Price</th>
            <th className="px-4 py-3 text-left">Stock</th>
            <th className="px-4 py-3 text-center">Featured</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                No products found
              </td>
            </tr>
          )}

          {data.map((item, index) => (
            <tr
              key={item.ProductID}
              className="border-t hover:bg-gray-100 hover:cursor-pointer"
              onDoubleClick={() => onClick(item.ProductID)}
            >
              <td className="px-4 py-3">{index + 1}</td>

              {/* PRODUCT INFO */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {item.ImageBase64 ? (
                    <img
                      src={`data:${item.ImageMimeType};base64,${item.ImageBase64}`}
                      alt={item.Name}
                      className="h-10 w-10 rounded-md object-cover border"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-gray-200" />
                  )}

                  <div>
                    <p className="font-medium text-gray-800">{item.Name}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 whitespace-pre-line">
                      {item.Description}
                    </p>
                  </div>
                </div>
              </td>

              {/* PRICE */}
              <td className="px-4 py-3 font-medium text-gray-800">
                Rp {parseFloat(item.Price).toLocaleString("id-ID")}
              </td>

              {/* STOCK */}
              <td className="px-4 py-3">{item.Stock}</td>

              {/* FEATURED */}
              <td className="px-4 py-3 text-center">
                {item.IsFeatured ? (
                  <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-gray-800">
                    Yes
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>

              {/* STATUS */}
              <td className="px-4 py-3 text-center">
                {item.IsActive ? (
                  <span className="text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-red-500 font-medium">Inactive</span>
                )}
              </td>

              {/* ACTION */}
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(item.ProductID)}
                    className="rounded-md bg-amber-400 px-3 py-1 text-xs font-semibold text-gray-800 hover:bg-amber-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(item.ProductID)}
                    className="rounded-md border border-red-500 px-3 py-1 text-xs font-semibold text-red-500 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
