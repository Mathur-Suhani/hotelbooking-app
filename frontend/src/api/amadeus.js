export async function searchHotels(cityCode, checkInDate, checkOutDate, adults) {
  const res = await fetch(
    `http://localhost:5000/api/hotel-list?cityCode=${cityCode}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}`
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }

  return await res.json();
}
