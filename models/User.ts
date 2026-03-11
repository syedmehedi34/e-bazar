import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: true, unique: true },
    photo: {
      type: String,
      default:
        "uhttps://img.icons8.com/?size=100&id=undefined&format=png&color=000000r",
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "doctor", "admin"],
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
