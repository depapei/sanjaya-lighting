"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface ICategoryInterface {
  [key: string]: any;
}

type CategoryTableProps = {
  data: ICategoryInterface[];
  onEdit: (Category: ICategoryInterface) => void;
  onClick: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function CategoryTable({
  data,
  onEdit,
  onDelete,
  onClick,
}: CategoryTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                No categories found
              </td>
            </tr>
          )}

          {data.map((item, index) => (
            <tr
              key={item.CategoryID}
              className="border-t hover:bg-gray-100 hover:cursor-pointer"
              onDoubleClick={() => onClick(item.CategoryID)}
            >
              <td className="px-4 py-3">{index + 1}</td>

              {/* Category INFO */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-gray-800">{item.Name}</p>
                  </div>
                </div>
              </td>

              {/* ACTION */}
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(item.CategoryID)}
                    className="rounded-md bg-amber-400 px-3 py-1 text-xs font-semibold text-gray-800 hover:bg-amber-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(item.CategoryID)}
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
