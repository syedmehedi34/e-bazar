"use client";
import React, { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { PiPhoneThin } from "react-icons/pi";
import { toast } from "react-toastify";
import { Send, MessageSquare } from "lucide-react";

interface FormData {
  fastName: string;
  lastName: string;
  email: string;
  message: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    fastName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (
      !formData.fastName ||
      !formData.lastName ||
      !formData.email ||
      !formData.message
    ) {
      return toast.error("Please fill in all fields!");
    }
    if (
      formData.fastName ||
      formData.email ||
      formData.lastName ||
      formData.message
    ) {
      toast.success("Your Message Send Successfully!");
      setFormData({ fastName: "", lastName: "", email: "", message: "" });
    }
  };

  const contactItems = [
    {
      icon: CiLocationOn,
      label: "Address",
      lines: ["E-Catalog Industries Ltd.", "Dhanmondi 04, Dhaka, 1208 BD"],
    },
    {
      icon: PiPhoneThin,
      label: "Let's Talk",
      lines: ["+880-1390000000", "+880-1600349990"],
    },
    {
      icon: AiOutlineMail,
      label: "Support Email",
      lines: ["e.catalog@infogamil.com", "e.support@gmail.com"],
    },
  ];

  return (
    <div className="min-h-screen mt-[62px] bg-gray-50 dark:bg-gray-950">
      {/* ── Hero Banner ── */}
      <section
        className="relative w-full h-[240px] md:h-[340px] lg:h-[400px]
                   flex items-center justify-center
                   bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url("/contact-hero.png")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/10" />
        <div
          className="absolute bottom-0 left-0 right-0 h-px
                        bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-70"
        />

        <div className="relative z-10 text-center text-white px-6 space-y-3">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                          bg-teal-500/20 border border-teal-500/30 backdrop-blur-sm"
          >
            <MessageSquare size={12} className="text-teal-400" />
            <span className="text-[11px] font-semibold text-teal-300 tracking-widest uppercase">
              We&apos;d love to hear from you
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-2xl">
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
              Us
            </span>
          </h1>
          <p className="text-base md:text-lg font-light text-white/80 max-w-xl mx-auto">
            We&apos;re here to help! Reach out with any questions, feedback, or
            partnership inquiries.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="container-custom py-12 px-4 sm:px-6 md:px-0">
        <div
          className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden
                        border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          {/* ── Form ── */}
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-900 p-8 md:p-10 space-y-6"
          >
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Send a Message
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fill in the form below and we&apos;ll get back to you shortly.
              </p>
            </div>

            {/* Name row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  className="block text-xs font-semibold uppercase tracking-wider
                                  text-gray-500 dark:text-gray-500"
                >
                  First Name
                </label>
                <input
                  name="fastName"
                  value={formData.fastName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-xl text-sm
                             bg-gray-50 dark:bg-gray-800
                             border border-gray-200 dark:border-gray-700
                             text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-600
                             focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15
                             transition-all duration-200"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  className="block text-xs font-semibold uppercase tracking-wider
                                  text-gray-500 dark:text-gray-500"
                >
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-xl text-sm
                             bg-gray-50 dark:bg-gray-800
                             border border-gray-200 dark:border-gray-700
                             text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-600
                             focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15
                             transition-all duration-200"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                className="block text-xs font-semibold uppercase tracking-wider
                                text-gray-500 dark:text-gray-500"
              >
                Email Address
              </label>
              <div className="relative">
                <AiOutlineMail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm
                             bg-gray-50 dark:bg-gray-800
                             border border-gray-200 dark:border-gray-700
                             text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-600
                             focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15
                             transition-all duration-200"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label
                className="block text-xs font-semibold uppercase tracking-wider
                                text-gray-500 dark:text-gray-500"
              >
                Your Message
              </label>
              <textarea
                rows={6}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className="w-full px-4 py-3 rounded-xl text-sm resize-none
                           bg-gray-50 dark:bg-gray-800
                           border border-gray-200 dark:border-gray-700
                           text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-600
                           focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15
                           transition-all duration-200"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2
                         py-3 rounded-xl text-sm font-semibold text-white
                         bg-gray-900 hover:bg-gray-700
                         dark:bg-teal-500 dark:hover:bg-teal-400
                         transition-all duration-200"
            >
              <Send size={15} />
              Send Message
            </button>
          </form>

          {/* ── Contact Info ── */}
          <div
            className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950
                          relative overflow-hidden p-8 md:p-10 space-y-0"
          >
            {/* Decorative */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full
                            bg-teal-500/8 blur-[70px] pointer-events-none"
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full
                            bg-teal-600/6 blur-[60px] pointer-events-none"
            />
            <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none">
              <defs>
                <pattern
                  id="dots"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1" cy="1" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>

            {/* Heading */}
            <div className="relative z-10 mb-8 space-y-1">
              <h2 className="text-xl font-bold text-white">
                Contact Information
              </h2>
              <p className="text-sm text-gray-400">
                Reach us through any of the channels below.
              </p>
            </div>

            {/* Info items */}
            <div className="relative z-10 space-y-7">
              {contactItems.map(({ icon: Icon, label, lines }) => (
                <div key={label} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/15
                                  flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <Icon size={18} className="text-teal-400" />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wider
                                  text-teal-400 mb-1"
                    >
                      {label}
                    </p>
                    {lines.map((line) => (
                      <p
                        key={line}
                        className="text-sm text-gray-300 leading-relaxed"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom accent */}
            <div className="relative z-10 mt-10 pt-8 border-t border-white/8">
              <p className="text-xs text-gray-500">
                Typically respond within{" "}
                <span className="text-teal-400 font-semibold">24 hours</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Map ── */}
        <div
          className="mt-8 rounded-2xl overflow-hidden
                        border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <iframe
            className="w-full h-[400px]"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.893739459512!2d90.370923974792!3d23.751168388747917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf529efccf5f%3A0x2febb133fe906d72!2s1208%2C%2004%20Dhanmondi%20Bridge%2C%20Dhaka%201205!5e0!3m2!1sen!2sbd!4v1760075990963!5m2!1sen!2sbd"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
