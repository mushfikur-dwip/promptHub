import { db } from "@/lib/firebase-service";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(_: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const ratingsRef = collection(db, "ratings");
    const q = query(ratingsRef, where("prompt_id", "==", id));
    const querySnapshot = await getDocs(q);

    const ratings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}
