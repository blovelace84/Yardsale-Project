import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET all listings
export async function GET() {
  const listings = await db.listing.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(listings);
}

// POST new listing
export async function POST(req: Request) {
  const body = await req.json();

  const listing = await db.listing.create({
    data: {
      title: body.title,
      description: body.description,
      price: body.price,
      userId: body.userId, // temp until auth
    },
  });

  return NextResponse.json(listing);
}