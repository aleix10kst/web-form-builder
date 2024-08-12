import { absoluteUrl } from "../utils"

export async function revalidateItems() {
  console.log("🔄 Revalidating...")
  await fetch(absoluteUrl("/api/revalidate"))
}
