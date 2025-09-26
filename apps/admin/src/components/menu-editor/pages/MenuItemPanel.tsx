import { useSearch } from "@tanstack/react-router";
import MenuItemAdd from "../components/items/MenuItem";
import { useFindFirstMenuItem } from "@workspace/db/hooks/trpc";

// Default component to show when no dish is selected or when adding a new dish
function SelectCategoryComponent() {
  return (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Item Editor</h3>
        <p className="text-sm">Select a category or subcategory to manage items</p>
      </div>
    </div>
  );
}

export default function MenuItemPanel() {
  const searchParams = useSearch({ from: '/restaurant/manage/$restaurantId/menu/edit' }) as Record<string, any>
  const {data, isFetching} = useFindFirstMenuItem({
    where: {
      id: searchParams.dish
    }
  }, {
    enabled: searchParams.dish && searchParams.dish !== 'add'
  })
  // Check if dish parameter is missing or equals "add"
  const dishParam = searchParams.dish as string | undefined;
  const shouldShowSelectCategory = !dishParam;

  if (shouldShowSelectCategory) {
    return <SelectCategoryComponent />;
  }

  if(isFetching) {
    return <div>Fetching Dish</div>
  }

  // TODO: Add logic for when a specific dish is selected
  // This would render the actual menu item editor/form
  return (
    //@ts-ignore
    <MenuItemAdd menuItem={data} key={searchParams.dish}/>
  );
}