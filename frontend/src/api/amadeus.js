export async function searchHotels(cityCode, checkInDate, checkOutDate, adults) {
  const res = await fetch(
    `https://hotelbooking-app-hvg8.onrender.com/api/hotel-list?cityCode=${cityCode}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}`
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }

  return await res.json();
}
