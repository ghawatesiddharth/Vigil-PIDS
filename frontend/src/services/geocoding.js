import axios from "axios";

const GEOCODING_URL =
  "https://nominatim.openstreetmap.org/reverse";

export async function getLocationName(
  latitude,
  longitude
) {
  try {
    const response = await axios.get(
      GEOCODING_URL,
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: "json",
          zoom: 10,
          addressdetails: 1,
        },

        headers: {
          Accept:
            "application/json",
        },
      }
    );

    const address =
      response.data?.address || {};

    const city =
      address.city ||
      address.town ||
      address.municipality ||
      address.village ||
      address.county ||
      "Unknown location";

    const state =
      address.state || "";

    const country =
      address.country || "";

    return {
      city,
      state,
      country,
      displayName:
        [city, state, country]
          .filter(Boolean)
          .join(", "),
    };

  } catch (error) {

    console.error(
      "Reverse geocoding failed:",
      error
    );

    return {
      city: "Unknown location",
      state: "",
      country: "",
      displayName:
        "Selected map location",
    };
  }
}