"use client";

import { MapPin, Phone, User } from "lucide-react";
import { SearchableSelect } from "./SearchableSelect";
import { InputField, SectionCard } from "./ui";
import { DeliveryAddress } from "@/app/(main)/checkout/types";

interface Props {
  address: DeliveryAddress;
  setField: (field: keyof DeliveryAddress) => (value: string) => void;
  setAddress: React.Dispatch<React.SetStateAction<DeliveryAddress>>;
  divisionNames: string[];
  districtNames: string[];
  upazilaNames: string[];
}

export function AddressForm({
  address,
  setField,
  setAddress,
  divisionNames,
  districtNames,
  upazilaNames,
}: Props) {
  return (
    <SectionCard icon={MapPin} title="Delivery Address">
      <div className="space-y-4">
        {/* Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Full Name"
            value={address.fullName}
            onChange={setField("fullName")}
            placeholder="Your full name"
            required
            icon={User}
          />
          <InputField
            label="Phone Number"
            value={address.phone}
            onChange={setField("phone")}
            placeholder="01XXXXXXXXX"
            required
            type="tel"
            icon={Phone}
          />
        </div>

        {/* Alt phone */}
        <InputField
          label="Alternative Phone"
          value={address.altPhone}
          onChange={setField("altPhone")}
          placeholder="01XXXXXXXXX (optional)"
          type="tel"
          icon={Phone}
        />

        {/* Cascade dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SearchableSelect
            label="Division"
            value={address.division}
            onChange={setField("division")}
            options={divisionNames}
            placeholder="Select division"
            required
          />
          <SearchableSelect
            label="District"
            value={address.district}
            onChange={setField("district")}
            options={districtNames}
            placeholder={
              address.division ? "Select district" : "Select division first"
            }
            required
            disabled={!address.division}
          />
          <SearchableSelect
            label="Upazila / Thana"
            value={address.upazila}
            onChange={setField("upazila")}
            options={upazilaNames}
            placeholder={
              address.district ? "Select upazila" : "Select district first"
            }
            required
            disabled={!address.district}
          />
        </div>

        {/* Full address */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Full Address <span className="text-red-400">*</span>
          </label>
          <textarea
            value={address.address}
            onChange={(e) => setField("address")(e.target.value)}
            placeholder="House no, Road no, Block, Flat, Landmark..."
            rows={3}
            required
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm
                       text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                       focus:ring-teal-500/30 focus:border-teal-500 transition-all resize-none hover:border-gray-300"
          />
        </div>

        {/* Address Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Address Type
          </label>
          <div className="flex gap-2">
            {(["home", "office", "other"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setAddress((p) => ({ ...p, addressType: type }))}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                            border-2 transition-all flex-1 justify-center
                  ${
                    address.addressType === type
                      ? "bg-teal-500 text-white border-teal-500 shadow-sm shadow-teal-100"
                      : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"
                  }`}
              >
                <span>
                  {type === "home" ? "🏠" : type === "office" ? "🏢" : "📍"}
                </span>
                <span className="hidden sm:inline capitalize">{type}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
