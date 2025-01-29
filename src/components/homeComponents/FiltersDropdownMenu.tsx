import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CustomSquareButton from "../CustomSquareButton";
import ChevronDown from "@/assets/svgs/ChevronDown";
import { Dispatch, SetStateAction } from "react";

interface Props {
  filterItems: "Trending" | "Top Rated" | "Top Seller";
  setFilterItems: Dispatch<
    SetStateAction<"Trending" | "Top Rated" | "Top Seller">
  >;
  itemsPrice: "All" | "Paid" | "Free";
  setItemsPrice: Dispatch<SetStateAction<"All" | "Paid" | "Free">>;
}

export default function FiltersDropdownMenu({
  filterItems,
  setFilterItems,
  itemsPrice,
  setItemsPrice,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <CustomSquareButton
          title="Filters"
          Icon={ChevronDown}
          iconWidth={10}
          iconHeight={10}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white w-48">
        <DropdownMenuCheckboxItem
          checked={filterItems === "Trending"}
          onClick={() => setFilterItems("Trending")}
          className="text-darkGray hover:bg-primaryPurple focus:bg-primaryPurple"
        >
          Trending
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filterItems === "Top Rated"}
          onClick={() => setFilterItems("Top Rated")}
          className="text-darkGray hover:bg-primaryPurple focus:bg-primaryPurple"
        >
          Top Rated
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filterItems === "Top Seller"}
          onClick={() => setFilterItems("Top Seller")}
          className="text-darkGray hover:bg-primaryPurple focus:bg-primaryPurple"
        >
          Top Seller
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator className="bg-darkGray" />
        <DropdownMenuRadioGroup value={itemsPrice} className="flex flex-col">
          <DropdownMenuRadioItem
            className="text-darkGray focus:bg-primaryPurple"
            value="Free"
            onClick={() => setItemsPrice("Free")}
          >
            Free
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className="text-darkGray focus:bg-primaryPurple"
            value="Paid"
            onClick={() => setItemsPrice("Paid")}
          >
            Paid
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className="text-darkGray focus:bg-primaryPurple"
            value="All"
            onClick={() => setItemsPrice("All")}
          >
            All
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
