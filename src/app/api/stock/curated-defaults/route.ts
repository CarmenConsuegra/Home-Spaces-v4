import { NextResponse } from "next/server";
import defaults from "../curated-defaults.json";

export async function GET() {
  return NextResponse.json(defaults);
}
