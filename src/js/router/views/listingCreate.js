import { onCreateListing } from "../../ui/listing/create";
import { authGuard } from "../../utilities/authGuard";

authGuard();

console from = document.forms.createListing;

form.addEventListener("submit", onCreateListing);