"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";

const subjects = [
  "General Inquiry",
  "Order Help",
  "Team Orders & Partnerships",
  "Product Question",
  "Returns & Exchanges",
  "Other",
];

const inputClass =
  "w-full px-4 py-3.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm text-white text-sm placeholder:text-muted/60 focus:outline-none focus:border-gold/40 transition-colors";

const labelClass =
  "text-[10px] font-bold tracking-[0.16em] uppercase text-muted mb-2 block";

interface ContactFormProps {
  email: string;
  phone: string;
  defaultSubject?: string;
}

export function ContactForm({ email, phone, defaultSubject }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: defaultSubject || "General Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      form.subject
    )}&body=${encodeURIComponent(
      `Name: ${form.firstName} ${form.lastName}\nEmail: ${form.email}\nPhone: ${phone}\n\n${form.message}`
    )}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <CheckCircle className="w-12 h-12 text-gold mx-auto mb-4" />
        <h3 className="text-sm font-black uppercase tracking-wider text-white">
          Message Ready
        </h3>
        <p className="text-muted text-sm mt-2">
          Your email client should open shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-gold text-[10px] font-bold tracking-[0.2em] uppercase hover:underline"
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <SectionTitle>Send Us a Message</SectionTitle>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>
              First Name <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Last Name <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Email Address <span className="text-gold">*</span>
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Subject <span className="text-gold">*</span>
          </label>
          <select
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className={`${inputClass} appearance-none cursor-pointer`}
          >
            {subjects.map((s) => (
              <option key={s} value={s} className="bg-black">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Message <span className="text-gold">*</span>
          </label>
          <textarea
            required
            rows={6}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-white text-[11px] font-black tracking-[0.18em] uppercase rounded-sm hover:opacity-90 transition-opacity"
          >
            Send Message
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="mt-4 text-xs text-muted">
            We aim to respond within 24 hours.
          </p>
        </div>
      </div>
    </form>
  );
}
