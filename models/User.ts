import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: true, unique: true },
    photo: {
      type: String,
      default:
        "https://img.icons8.com/?size=100&id=21441&format=png&color=000000",
    },
    password: { type: String, required: false, default: null },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    mobileNumber: { type: String, default: "", required: false },
    fullAddress: { type: String, default: "", trim: true, required: false },
    wishList: { type: [String], default: [], required: false },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models?.User || mongoose.model("User", UserSchema);

export default User;
