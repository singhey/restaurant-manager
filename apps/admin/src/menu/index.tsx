import { useFindManyMenuItem } from "../hooks"


function Menu() {
  const {data, isFetching} = useFindManyMenuItem({
    select: {
      id: true
    },
    where: {
      restaurantId: '123'
    }
  })

  if(isFetching) {
    return <div>Loading</div>
  }

  return <div>
    {
      
    }
  </div>
}