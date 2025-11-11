
import { hasSpun, markSpun } from "@/spinTracker";
import { NextResponse } from "next/server";
function handleSpin(giver) {
    if (hasSpun(giver)) {
      return true;
    };

    markSpun(giver);
    return false;
}
export async function POST(req) {
    try {
        const { giver } = await req.json();
        const hasSpun = handleSpin(giver);
        console.log("HAS SPUN ", hasSpun)
            return NextResponse.json({ hasSpun: hasSpun }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({message: "ERROR"}, {status: 500})
    }
}