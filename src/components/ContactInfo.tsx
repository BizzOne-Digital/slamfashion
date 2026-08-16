import { Mail, Phone, MapPin } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { formatPhone } from "@/lib/utils";

interface ContactInfoProps {
  email: string;
  phone: string;
  location: string;
}

function InfoRow({
  icon: Icon,
  label,
  children,
  href,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
  href?: string;
}) {
  const content = (
    <div className="flex gap-4 py-5 border-b border-[#1F1F1F] last:border-b-0">
      <div className="shrink-0 w-10 h-10 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center">
        <Icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-muted">
          {label}
        </p>
        <div className="mt-1 text-sm text-white">{children}</div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block hover:opacity-80 transition-opacity">
        {content}
      </a>
    );
  }
  return content;
}

export function ContactInfo({ email, phone, location }: ContactInfoProps) {
  return (
    <div>
      <SectionTitle>Other Ways to Reach Us</SectionTitle>

      <InfoRow icon={Mail} label="Email" href={`mailto:${email}`}>
        {email}
      </InfoRow>

      <InfoRow icon={Phone} label="Phone" href={`tel:${phone}`}>
        {formatPhone(phone)}
      </InfoRow>

      <InfoRow icon={MapPin} label="Location">
        {location}
      </InfoRow>

      <div className="pt-6">
        <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-muted mb-4">
          Follow Us
        </p>
        <div className="flex gap-3">
          {["IG", "FB", "TT", "YT"].map((label) => (
            <a
              key={label}
              href="#"
              className="w-9 h-9 rounded-full border border-gold/40 bg-gold/5 flex items-center justify-center text-[9px] font-bold text-gold hover:bg-gold hover:text-black transition-colors"
              aria-label={label}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
