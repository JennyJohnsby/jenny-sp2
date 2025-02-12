export default async function router(
  pathname = window.location.pathname.split("?")[0],
) {
  switch (pathname) {
    case "/":
      await import("./views/home.js");
      break;
    case "/auth/":
      await import("./views/auth.js");
      break;
    case "/auth/login/":
      await import("./views/login.js");
      break;
    case "/auth/register/":
      await import("./views/register.js");
      break;
    case "/listing/":
      await import("./views/listing.js");
      break;
    case "/listings/edit/":
      await import("./views/listingEdit.js");
      break;
    case "/listings/create/":
      await import("./views/listingCreate.js");
      break;
    case "/profile/":
      await import("./views/profile.js");
      break;
    default:
      await import("./views/notFound.js");
  }
}
