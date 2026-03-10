import {
  Award,
  Tag,
  Package,
  Star,
  Box,
  MapPin,
  Scale,
  Shield,
  Truck,
  Zap,
  RotateCcw,
  Clock,
} from "lucide-react";
import { IProduct, TabType } from "./types";
import StarRating from "./StarRating";

interface RatingBreakdown {
  star: number;
  count: number;
  pct: number;
}

interface Props {
  p: IProduct;
  activeTab: TabType;
  avgRating: number;
  reviewCount: number;
  positivePercent: number;
  ratingBreakdown: RatingBreakdown[];
  onTabChange: (tab: TabType) => void;
}

const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

const ProductTabs = ({
  p,
  activeTab,
  avgRating,
  reviewCount,
  positivePercent,
  ratingBreakdown,
  onTabChange,
}: Props) => {
  return (
    <div className="mt-12">
      {/* Tab nav */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-7 overflow-x-auto">
        {(
          ["description", "specifications", "reviews", "shipping"] as const
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`relative px-5 py-3 text-sm font-semibold capitalize whitespace-nowrap transition-all ${
              activeTab === tab
                ? "text-gray-900 dark:text-white"
                : "text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400"
            }`}
          >
            {tab}
            {tab === "reviews" && (
              <span className="ml-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded-full">
                {reviewCount}
              </span>
            )}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Description ── */}
      {activeTab === "description" && (
        <div className="max-w-3xl space-y-6">
          <p className="text-sm leading-7 text-gray-500 dark:text-gray-400">
            {p.description}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {[
              { icon: <Award size={13} />, label: "Brand", value: p.brand },
              { icon: <Tag size={13} />, label: "Category", value: p.category },
              {
                icon: <Package size={13} />,
                label: "Sub Category",
                value: p.subCategory,
              },
              {
                icon: <Star size={13} />,
                label: "Rating",
                value: `${avgRating.toFixed(1)} / 5`,
              },
              {
                icon: <Box size={13} />,
                label: "Stock",
                value: `${p.stock} units`,
              },
              {
                icon: <MapPin size={13} />,
                label: "Origin",
                value: p.countryOfOrigin || "N/A",
              },
              ...(p.weight > 0
                ? [
                    {
                      icon: <Scale size={13} />,
                      label: "Weight",
                      value: `${p.weight}g`,
                    },
                  ]
                : []),
              ...(p.warranty
                ? [
                    {
                      icon: <Shield size={13} />,
                      label: "Warranty",
                      value: p.warranty,
                    },
                  ]
                : []),
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-1 text-gray-400 mb-1.5">
                  {item.icon}
                  <span className="text-xs uppercase tracking-wide font-medium">
                    {item.label}
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          {(p?.dimensions?.length > 0 ||
            p?.dimensions?.width > 0 ||
            p?.dimensions?.height > 0) && (
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <p className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                <Box size={12} /> Dimensions (cm)
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Length", value: p.dimensions.length },
                  { label: "Width", value: p.dimensions.width },
                  { label: "Height", value: p.dimensions.height },
                ].map((d) => (
                  <div
                    key={d.label}
                    className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <p className="text-xl font-black text-gray-900 dark:text-white">
                      {d.value}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{d.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Specifications ── */}
      {activeTab === "specifications" && (
        <div className="max-w-xl">
          {p?.specifications?.length > 0 ? (
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
              {p.specifications.map((spec, i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800/50"}`}
                >
                  <div className="w-2/5 px-4 py-3 border-r border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-semibold text-gray-500">
                      {spec.key}
                    </p>
                  </div>
                  <div className="w-3/5 px-4 py-3">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {spec.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-14 text-center">
              <Box
                size={32}
                className="text-gray-200 dark:text-gray-800 mb-2"
              />
              <p className="text-sm text-gray-400">
                No specifications available
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Reviews ── */}
      {activeTab === "reviews" && (
        <div className="max-w-3xl space-y-5">
          {reviewCount > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col items-center justify-center min-w-[110px] gap-1.5">
                  <p className="text-5xl font-black text-gray-900 dark:text-white">
                    {avgRating.toFixed(1)}
                  </p>
                  <StarRating rating={avgRating} size={14} />
                  <p className="text-xs text-gray-400">{reviewCount} reviews</p>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {positivePercent}% positive
                  </span>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingBreakdown.map(({ star, count, pct }) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500 w-3">
                        {star}
                      </span>
                      <Star
                        size={10}
                        className="fill-amber-400 text-amber-400 shrink-0"
                      />
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-4 text-right">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {p.reviews.map((review, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                          {review.user.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {review.user}
                          </p>
                          <StarRating rating={review.rating} size={10} />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                            review.rating >= 4
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                              : review.rating >= 3
                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {review.rating}/5
                        </span>
                        {review.createdAt && (
                          <span className="text-xs text-gray-400 flex items-center gap-0.5">
                            <Clock size={9} /> {formatDate(review.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-14 text-center">
              <Star
                size={32}
                className="text-gray-200 dark:text-gray-800 mb-2"
              />
              <p className="text-sm text-gray-400">No reviews yet</p>
            </div>
          )}
        </div>
      )}

      {/* ── Shipping ── */}
      {activeTab === "shipping" && (
        <div className="max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              icon: <Truck size={18} />,
              title: p.freeShipping ? "Free Delivery" : "Standard Delivery",
              desc: p.freeShipping
                ? "Complimentary on this item"
                : "3-5 business days · ৳60",
              color: "bg-blue-50 dark:bg-blue-900/20 text-blue-500",
            },
            {
              icon: <Zap size={18} />,
              title: "Express Delivery",
              desc: "1-2 business days · ৳120",
              color: "bg-amber-50 dark:bg-amber-900/20 text-amber-500",
            },
            {
              icon: <RotateCcw size={18} />,
              title: "Easy Returns",
              desc: "7-day hassle-free policy",
              color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500",
            },
            {
              icon: <Package size={18} />,
              title: "Eco Packaging",
              desc: "Sustainable & protective",
              color: "bg-purple-50 dark:bg-purple-900/20 text-purple-500",
            },
            {
              icon: <Shield size={18} />,
              title: "Order Protection",
              desc: "Full refund guarantee",
              color: "bg-red-50 dark:bg-red-900/20 text-red-500",
            },
            ...(p.weight > 0
              ? [
                  {
                    icon: <Scale size={18} />,
                    title: "Package Weight",
                    desc: `Approx. ${p.weight}g`,
                    color: "bg-gray-100 dark:bg-gray-800 text-gray-500",
                  },
                ]
              : []),
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-sm transition-shadow"
            >
              <div className={`p-2 rounded-xl shrink-0 ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {item.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductTabs;
