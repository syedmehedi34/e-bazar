// import mongoose from "mongoose";

// const couponSchema = new mongoose.Schema({
//   code: {
//     type: String,
//     required: true,
//     unique: true,
//     uppercase: true,
//   },
//   type: {
//     type: String,
//     enum: ["percentage", "fixed_amount", "free_shipping", "buy_x_get_y"],
//     required: true,
//   },
//   value: { type: Number, required: true }, // 15 for 15%, 500 for 500৳
//   minOrderAmount: { type: Number, default: 0 },

//   applicableTo: {
//     type: String,
//     enum: ["all", "specific_products", "specific_categories"],
//     default: "all",
//   },
//   productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
//   categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],

//   startDate: { type: Date },
//   endDate: { type: Date },
//   isActive: { type: Boolean, default: true },

//   usageLimit: { type: Number, default: null }, // total usage limit
//   perUserLimit: { type: Number, default: 1 },
//   usedCount: { type: Number, default: 0 },

//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date },
// });

// // Index for fast lookup
// couponSchema.index({ code: 1 });
// couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
