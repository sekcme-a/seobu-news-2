import { getParentCategories } from "@/utils/supabase/getCategories";
import Link from "next/link";

export default async function NavList() {
  const categories = await getParentCategories();

  return (
    <ul className="flex items-center gap-1">
      {categories?.map((category) => (
        <li key={category.id}>
          <Link
            href={`/${category.slug}`}
            className="text-gray-700 text-[17px] font-bold px-4 py-2
             hover:text-[#3c51b0] transition-colors rounded-md"
          >
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
