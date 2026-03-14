// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dbConnect from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

/* ── GET /api/users/[id] ─────────────────────────────── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    const user = await User.findById(id).select("-password");
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET /api/users/[id]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

/* ── PATCH /api/users/[id] ───────────────────────────────
   User can update their own profile fields.
   Wishlist: pass { wishlist: { action: "add"|"remove", productId: "..." } }
   Other fields: pass any editable field directly e.g. { name, mobileNumber, fullAddress, photo }
──────────────────────────────────────────────────────── */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Users can only update themselves (admins can update anyone)
    const isAdmin = session.user.role?.includes("admin");
    if (!isAdmin && session.user.id !== id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // These fields can never be changed by anyone via this route
    const IMMUTABLE = new Set(["_id", "createdAt", "updatedAt", "__v"]);

    // Handle wishlist add/remove separately
    if (body.wishlist) {
      const { action, productId } = body.wishlist as {
        action: "add" | "remove";
        productId: string;
      };

      if (!productId) {
        return NextResponse.json(
          { message: "productId is required for wishlist update" },
          { status: 400 },
        );
      }

      const mongoUpdate =
        action === "add"
          ? { $addToSet: { wishList: productId } }
          : { $pull: { wishList: productId } };

      const updated = await User.findByIdAndUpdate(id, mongoUpdate, {
        returnDocument: "after",
      }).select("-password");
      if (!updated)
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );

      return NextResponse.json(
        { message: "Wishlist updated", user: updated },
        { status: 200 },
      );
    }

    // General profile update
    const update: Record<string, unknown> = {};
    for (const [field, value] of Object.entries(body)) {
      if (IMMUTABLE.has(field) || value === undefined) continue;
      // Only admin can change role
      if (field === "role" && !isAdmin) continue;
      update[field] = value;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 },
      );
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: update },
      { returnDocument: "after" },
    ).select("-password");
    if (!updated)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(
      { message: "User updated", user: updated },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH /api/users/[id]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
