import { revalidateItems } from "@/lib/actions/seed"

async function runSeed() {
  console.log("⌛️ Running seed...")

  const start = Date.now()

  // Add seed functions here

  await revalidateItems()

  const end = Date.now()

  console.log(`✅ Seed completed in ${end - start}ms`)

  process.exit(0)
}

runSeed().catch((err) => {
  console.error("❌ Seed failed", err)
  console.error(err)
  process.exit(1)
})
