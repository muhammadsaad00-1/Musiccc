"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Send,
  CheckCircle,
  Calendar,
  MapPin,
  Music,
  DollarSign,
  User,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Clock,
  Shield,
  Star,
  Zap,
  PartyPopper,
  Briefcase,
  Users,
  Heart,
  Music2,
  User2,
  ChevronDown,
} from "lucide-react";
import { cities } from "@/lib/mockData";
import { API_BASE_URL } from "@/lib/api";

// ─── Country codes (all countries, flags via flagcdn.com) ────────────────────
// placeholder = local number format hint  |  maxLength = digits only (no spaces)
const COUNTRY_CODES = [
  { code: "+92", iso2: "pk", name: "Pakistan", placeholder: "3XX XXXXXXX", maxLength: 10 },
  { code: "+1", iso2: "us", name: "United States", placeholder: "201 555 0123", maxLength: 10 },
  { code: "+44", iso2: "gb", name: "United Kingdom", placeholder: "7911 123456", maxLength: 10 },
  { code: "+971", iso2: "ae", name: "UAE", placeholder: "50 123 4567", maxLength: 9 },
  { code: "+966", iso2: "sa", name: "Saudi Arabia", placeholder: "51 234 5678", maxLength: 9 },
  { code: "+974", iso2: "qa", name: "Qatar", placeholder: "3312 3456", maxLength: 8 },
  { code: "+965", iso2: "kw", name: "Kuwait", placeholder: "5012 3456", maxLength: 8 },
  { code: "+973", iso2: "bh", name: "Bahrain", placeholder: "3600 1234", maxLength: 8 },
  { code: "+968", iso2: "om", name: "Oman", placeholder: "9212 3456", maxLength: 8 },
  { code: "+91", iso2: "in", name: "India", placeholder: "98765 43210", maxLength: 10 },
  { code: "+880", iso2: "bd", name: "Bangladesh", placeholder: "1812 345678", maxLength: 10 },
  { code: "+93", iso2: "af", name: "Afghanistan", placeholder: "70 123 4567", maxLength: 9 },
  { code: "+355", iso2: "al", name: "Albania", placeholder: "66 123 4567", maxLength: 9 },
  { code: "+213", iso2: "dz", name: "Algeria", placeholder: "551 23 45 67", maxLength: 9 },
  { code: "+376", iso2: "ad", name: "Andorra", placeholder: "312 345", maxLength: 6 },
  { code: "+244", iso2: "ao", name: "Angola", placeholder: "923 123 456", maxLength: 9 },
  { code: "+54", iso2: "ar", name: "Argentina", placeholder: "11 2345 6789", maxLength: 10 },
  { code: "+374", iso2: "am", name: "Armenia", placeholder: "77 123456", maxLength: 8 },
  { code: "+61", iso2: "au", name: "Australia", placeholder: "412 345 678", maxLength: 9 },
  { code: "+43", iso2: "at", name: "Austria", placeholder: "664 123456", maxLength: 10 },
  { code: "+994", iso2: "az", name: "Azerbaijan", placeholder: "40 123 45 67", maxLength: 9 },
  { code: "+1242", iso2: "bs", name: "Bahamas", placeholder: "359 1234", maxLength: 7 },
  { code: "+975", iso2: "bt", name: "Bhutan", placeholder: "17 123 456", maxLength: 8 },
  { code: "+591", iso2: "bo", name: "Bolivia", placeholder: "71234567", maxLength: 8 },
  { code: "+387", iso2: "ba", name: "Bosnia & Herzegovina", placeholder: "61 123 456", maxLength: 8 },
  { code: "+267", iso2: "bw", name: "Botswana", placeholder: "71 123 456", maxLength: 8 },
  { code: "+55", iso2: "br", name: "Brazil", placeholder: "11 91234 5678", maxLength: 11 },
  { code: "+673", iso2: "bn", name: "Brunei", placeholder: "712 3456", maxLength: 7 },
  { code: "+359", iso2: "bg", name: "Bulgaria", placeholder: "48 123 456", maxLength: 9 },
  { code: "+226", iso2: "bf", name: "Burkina Faso", placeholder: "70 12 34 56", maxLength: 8 },
  { code: "+257", iso2: "bi", name: "Burundi", placeholder: "79 56 12 34", maxLength: 8 },
  { code: "+855", iso2: "kh", name: "Cambodia", placeholder: "91 234 567", maxLength: 8 },
  { code: "+237", iso2: "cm", name: "Cameroon", placeholder: "6 71 23 45 67", maxLength: 9 },
  { code: "+1", iso2: "ca", name: "Canada", placeholder: "204 555 0123", maxLength: 10 },
  { code: "+238", iso2: "cv", name: "Cape Verde", placeholder: "991 12 34", maxLength: 7 },
  { code: "+236", iso2: "cf", name: "Central African Republic", placeholder: "70 01 23 45", maxLength: 8 },
  { code: "+235", iso2: "td", name: "Chad", placeholder: "63 01 23 45", maxLength: 8 },
  { code: "+56", iso2: "cl", name: "Chile", placeholder: "9 1234 5678", maxLength: 9 },
  { code: "+86", iso2: "cn", name: "China", placeholder: "131 2345 6789", maxLength: 11 },
  { code: "+57", iso2: "co", name: "Colombia", placeholder: "321 1234567", maxLength: 10 },
  { code: "+269", iso2: "km", name: "Comoros", placeholder: "321 23 45", maxLength: 7 },
  { code: "+242", iso2: "cg", name: "Congo", placeholder: "06 123 4567", maxLength: 9 },
  { code: "+243", iso2: "cd", name: "Congo (DRC)", placeholder: "99 123 4567", maxLength: 9 },
  { code: "+506", iso2: "cr", name: "Costa Rica", placeholder: "8312 3456", maxLength: 8 },
  { code: "+385", iso2: "hr", name: "Croatia", placeholder: "91 234 5678", maxLength: 9 },
  { code: "+53", iso2: "cu", name: "Cuba", placeholder: "5 123 4567", maxLength: 8 },
  { code: "+357", iso2: "cy", name: "Cyprus", placeholder: "96 123456", maxLength: 8 },
  { code: "+420", iso2: "cz", name: "Czech Republic", placeholder: "601 123 456", maxLength: 9 },
  { code: "+45", iso2: "dk", name: "Denmark", placeholder: "32 12 34 56", maxLength: 8 },
  { code: "+253", iso2: "dj", name: "Djibouti", placeholder: "77 83 10 01", maxLength: 8 },
  { code: "+1767", iso2: "dm", name: "Dominica", placeholder: "235 1234", maxLength: 7 },
  { code: "+1809", iso2: "do", name: "Dominican Republic", placeholder: "234 5678", maxLength: 7 },
  { code: "+593", iso2: "ec", name: "Ecuador", placeholder: "99 123 4567", maxLength: 9 },
  { code: "+20", iso2: "eg", name: "Egypt", placeholder: "100 123 4567", maxLength: 10 },
  { code: "+503", iso2: "sv", name: "El Salvador", placeholder: "7012 3456", maxLength: 8 },
  { code: "+240", iso2: "gq", name: "Equatorial Guinea", placeholder: "222 123 456", maxLength: 9 },
  { code: "+291", iso2: "er", name: "Eritrea", placeholder: "07 123 456", maxLength: 7 },
  { code: "+372", iso2: "ee", name: "Estonia", placeholder: "5123 4567", maxLength: 8 },
  { code: "+268", iso2: "sz", name: "Eswatini", placeholder: "7612 3456", maxLength: 8 },
  { code: "+251", iso2: "et", name: "Ethiopia", placeholder: "91 123 4567", maxLength: 9 },
  { code: "+679", iso2: "fj", name: "Fiji", placeholder: "701 2345", maxLength: 7 },
  { code: "+358", iso2: "fi", name: "Finland", placeholder: "41 2345678", maxLength: 9 },
  { code: "+33", iso2: "fr", name: "France", placeholder: "6 12 34 56 78", maxLength: 9 },
  { code: "+241", iso2: "ga", name: "Gabon", placeholder: "06 03 12 34", maxLength: 8 },
  { code: "+220", iso2: "gm", name: "Gambia", placeholder: "301 2345", maxLength: 7 },
  { code: "+995", iso2: "ge", name: "Georgia", placeholder: "555 12 34 56", maxLength: 9 },
  { code: "+49", iso2: "de", name: "Germany", placeholder: "1512 3456789", maxLength: 11 },
  { code: "+233", iso2: "gh", name: "Ghana", placeholder: "23 123 4567", maxLength: 9 },
  { code: "+30", iso2: "gr", name: "Greece", placeholder: "691 234 5678", maxLength: 10 },
  { code: "+1473", iso2: "gd", name: "Grenada", placeholder: "403 1234", maxLength: 7 },
  { code: "+502", iso2: "gt", name: "Guatemala", placeholder: "5123 4567", maxLength: 8 },
  { code: "+224", iso2: "gn", name: "Guinea", placeholder: "601 12 34 56", maxLength: 9 },
  { code: "+245", iso2: "gw", name: "Guinea-Bissau", placeholder: "955 012 345", maxLength: 9 },
  { code: "+592", iso2: "gy", name: "Guyana", placeholder: "609 1234", maxLength: 7 },
  { code: "+509", iso2: "ht", name: "Haiti", placeholder: "34 10 1234", maxLength: 8 },
  { code: "+504", iso2: "hn", name: "Honduras", placeholder: "9123 4567", maxLength: 8 },
  { code: "+36", iso2: "hu", name: "Hungary", placeholder: "20 123 4567", maxLength: 9 },
  { code: "+354", iso2: "is", name: "Iceland", placeholder: "611 1234", maxLength: 7 },
  { code: "+62", iso2: "id", name: "Indonesia", placeholder: "812 3456 789", maxLength: 11 },
  { code: "+98", iso2: "ir", name: "Iran", placeholder: "912 345 6789", maxLength: 10 },
  { code: "+964", iso2: "iq", name: "Iraq", placeholder: "791 234 5678", maxLength: 10 },
  { code: "+353", iso2: "ie", name: "Ireland", placeholder: "85 123 4567", maxLength: 9 },
  { code: "+972", iso2: "il", name: "Israel", placeholder: "52 123 4567", maxLength: 9 },
  { code: "+39", iso2: "it", name: "Italy", placeholder: "312 345 6789", maxLength: 10 },
  { code: "+1876", iso2: "jm", name: "Jamaica", placeholder: "210 1234", maxLength: 7 },
  { code: "+81", iso2: "jp", name: "Japan", placeholder: "90 1234 5678", maxLength: 10 },
  { code: "+962", iso2: "jo", name: "Jordan", placeholder: "7 9012 3456", maxLength: 9 },
  { code: "+7", iso2: "kz", name: "Kazakhstan", placeholder: "701 234 5678", maxLength: 10 },
  { code: "+254", iso2: "ke", name: "Kenya", placeholder: "712 123456", maxLength: 9 },
  { code: "+686", iso2: "ki", name: "Kiribati", placeholder: "72001234", maxLength: 8 },
  { code: "+82", iso2: "kr", name: "South Korea", placeholder: "10 1234 5678", maxLength: 10 },
  { code: "+850", iso2: "kp", name: "North Korea", placeholder: "191 2345678", maxLength: 10 },
  { code: "+383", iso2: "xk", name: "Kosovo", placeholder: "43 201 234", maxLength: 8 },
  { code: "+996", iso2: "kg", name: "Kyrgyzstan", placeholder: "700 123 456", maxLength: 9 },
  { code: "+856", iso2: "la", name: "Laos", placeholder: "20 23 123 456", maxLength: 10 },
  { code: "+371", iso2: "lv", name: "Latvia", placeholder: "21 234 567", maxLength: 8 },
  { code: "+961", iso2: "lb", name: "Lebanon", placeholder: "71 123 456", maxLength: 8 },
  { code: "+266", iso2: "ls", name: "Lesotho", placeholder: "5012 3456", maxLength: 8 },
  { code: "+231", iso2: "lr", name: "Liberia", placeholder: "77 012 3456", maxLength: 8 },
  { code: "+218", iso2: "ly", name: "Libya", placeholder: "91 2345678", maxLength: 9 },
  { code: "+423", iso2: "li", name: "Liechtenstein", placeholder: "660 234 567", maxLength: 9 },
  { code: "+370", iso2: "lt", name: "Lithuania", placeholder: "612 34567", maxLength: 8 },
  { code: "+352", iso2: "lu", name: "Luxembourg", placeholder: "628 123 456", maxLength: 9 },
  { code: "+261", iso2: "mg", name: "Madagascar", placeholder: "32 12 345 67", maxLength: 9 },
  { code: "+265", iso2: "mw", name: "Malawi", placeholder: "991 23 456", maxLength: 8 },
  { code: "+60", iso2: "my", name: "Malaysia", placeholder: "12 345 6789", maxLength: 9 },
  { code: "+960", iso2: "mv", name: "Maldives", placeholder: "771 2345", maxLength: 7 },
  { code: "+223", iso2: "ml", name: "Mali", placeholder: "65 01 23 45", maxLength: 8 },
  { code: "+356", iso2: "mt", name: "Malta", placeholder: "9696 1234", maxLength: 8 },
  { code: "+692", iso2: "mh", name: "Marshall Islands", placeholder: "235 1234", maxLength: 7 },
  { code: "+222", iso2: "mr", name: "Mauritania", placeholder: "22 12 34 56", maxLength: 8 },
  { code: "+230", iso2: "mu", name: "Mauritius", placeholder: "5251 2345", maxLength: 8 },
  { code: "+52", iso2: "mx", name: "Mexico", placeholder: "55 1234 5678", maxLength: 10 },
  { code: "+691", iso2: "fm", name: "Micronesia", placeholder: "350 1234", maxLength: 7 },
  { code: "+373", iso2: "md", name: "Moldova", placeholder: "62 123 456", maxLength: 8 },
  { code: "+377", iso2: "mc", name: "Monaco", placeholder: "6 12 34 56 78", maxLength: 9 },
  { code: "+976", iso2: "mn", name: "Mongolia", placeholder: "8812 3456", maxLength: 8 },
  { code: "+382", iso2: "me", name: "Montenegro", placeholder: "67 622 901", maxLength: 8 },
  { code: "+212", iso2: "ma", name: "Morocco", placeholder: "650 123456", maxLength: 9 },
  { code: "+258", iso2: "mz", name: "Mozambique", placeholder: "82 123 4567", maxLength: 9 },
  { code: "+95", iso2: "mm", name: "Myanmar", placeholder: "9 212 3456", maxLength: 9 },
  { code: "+264", iso2: "na", name: "Namibia", placeholder: "81 123 4567", maxLength: 9 },
  { code: "+674", iso2: "nr", name: "Nauru", placeholder: "444 1234", maxLength: 7 },
  { code: "+977", iso2: "np", name: "Nepal", placeholder: "984 123 4567", maxLength: 10 },
  { code: "+31", iso2: "nl", name: "Netherlands", placeholder: "6 12345678", maxLength: 9 },
  { code: "+64", iso2: "nz", name: "New Zealand", placeholder: "21 234 5678", maxLength: 9 },
  { code: "+505", iso2: "ni", name: "Nicaragua", placeholder: "8123 4567", maxLength: 8 },
  { code: "+227", iso2: "ne", name: "Niger", placeholder: "93 12 34 56", maxLength: 8 },
  { code: "+234", iso2: "ng", name: "Nigeria", placeholder: "802 123 4567", maxLength: 10 },
  { code: "+389", iso2: "mk", name: "North Macedonia", placeholder: "72 345 678", maxLength: 8 },
  { code: "+47", iso2: "no", name: "Norway", placeholder: "406 12 345", maxLength: 8 },
  { code: "+63", iso2: "ph", name: "Philippines", placeholder: "905 123 4567", maxLength: 10 },
  { code: "+48", iso2: "pl", name: "Poland", placeholder: "512 345 678", maxLength: 9 },
  { code: "+351", iso2: "pt", name: "Portugal", placeholder: "912 345 678", maxLength: 9 },
  { code: "+1787", iso2: "pr", name: "Puerto Rico", placeholder: "234 5678", maxLength: 7 },
  { code: "+40", iso2: "ro", name: "Romania", placeholder: "712 345 678", maxLength: 9 },
  { code: "+7", iso2: "ru", name: "Russia", placeholder: "912 345 67 89", maxLength: 10 },
  { code: "+250", iso2: "rw", name: "Rwanda", placeholder: "720 123 456", maxLength: 9 },
  { code: "+1869", iso2: "kn", name: "Saint Kitts & Nevis", placeholder: "765 2917", maxLength: 7 },
  { code: "+1758", iso2: "lc", name: "Saint Lucia", placeholder: "284 5678", maxLength: 7 },
  { code: "+1784", iso2: "vc", name: "Saint Vincent", placeholder: "430 1234", maxLength: 7 },
  { code: "+685", iso2: "ws", name: "Samoa", placeholder: "72 12345", maxLength: 7 },
  { code: "+378", iso2: "sm", name: "San Marino", placeholder: "66 66 12 34", maxLength: 8 },
  { code: "+239", iso2: "st", name: "São Tomé & Príncipe", placeholder: "981 2345", maxLength: 7 },
  { code: "+221", iso2: "sn", name: "Senegal", placeholder: "70 123 45 67", maxLength: 9 },
  { code: "+381", iso2: "rs", name: "Serbia", placeholder: "60 1234567", maxLength: 9 },
  { code: "+248", iso2: "sc", name: "Seychelles", placeholder: "2 510 123", maxLength: 7 },
  { code: "+232", iso2: "sl", name: "Sierra Leone", placeholder: "25 123456", maxLength: 8 },
  { code: "+65", iso2: "sg", name: "Singapore", placeholder: "8123 4567", maxLength: 8 },
  { code: "+421", iso2: "sk", name: "Slovakia", placeholder: "912 123 456", maxLength: 9 },
  { code: "+386", iso2: "si", name: "Slovenia", placeholder: "31 234 567", maxLength: 8 },
  { code: "+677", iso2: "sb", name: "Solomon Islands", placeholder: "74 21234", maxLength: 7 },
  { code: "+252", iso2: "so", name: "Somalia", placeholder: "90 123 456", maxLength: 8 },
  { code: "+27", iso2: "za", name: "South Africa", placeholder: "71 123 4567", maxLength: 9 },
  { code: "+211", iso2: "ss", name: "South Sudan", placeholder: "977 123 456", maxLength: 9 },
  { code: "+34", iso2: "es", name: "Spain", placeholder: "612 34 56 78", maxLength: 9 },
  { code: "+94", iso2: "lk", name: "Sri Lanka", placeholder: "71 234 5678", maxLength: 9 },
  { code: "+249", iso2: "sd", name: "Sudan", placeholder: "91 123 1234", maxLength: 9 },
  { code: "+597", iso2: "sr", name: "Suriname", placeholder: "741 2345", maxLength: 7 },
  { code: "+46", iso2: "se", name: "Sweden", placeholder: "70 123 45 67", maxLength: 9 },
  { code: "+41", iso2: "ch", name: "Switzerland", placeholder: "78 123 45 67", maxLength: 9 },
  { code: "+963", iso2: "sy", name: "Syria", placeholder: "944 567 890", maxLength: 9 },
  { code: "+886", iso2: "tw", name: "Taiwan", placeholder: "912 345 678", maxLength: 9 },
  { code: "+992", iso2: "tj", name: "Tajikistan", placeholder: "917 12 3456", maxLength: 9 },
  { code: "+255", iso2: "tz", name: "Tanzania", placeholder: "621 234 567", maxLength: 9 },
  { code: "+66", iso2: "th", name: "Thailand", placeholder: "81 234 5678", maxLength: 9 },
  { code: "+228", iso2: "tg", name: "Togo", placeholder: "90 11 23 45", maxLength: 8 },
  { code: "+676", iso2: "to", name: "Tonga", placeholder: "771 5123", maxLength: 7 },
  { code: "+1868", iso2: "tt", name: "Trinidad & Tobago", placeholder: "291 1234", maxLength: 7 },
  { code: "+216", iso2: "tn", name: "Tunisia", placeholder: "20 123 456", maxLength: 8 },
  { code: "+90", iso2: "tr", name: "Turkey", placeholder: "501 234 5678", maxLength: 10 },
  { code: "+993", iso2: "tm", name: "Turkmenistan", placeholder: "66 123456", maxLength: 8 },
  { code: "+688", iso2: "tv", name: "Tuvalu", placeholder: "901 234", maxLength: 6 },
  { code: "+256", iso2: "ug", name: "Uganda", placeholder: "712 345678", maxLength: 9 },
  { code: "+380", iso2: "ua", name: "Ukraine", placeholder: "50 123 4567", maxLength: 9 },
  { code: "+598", iso2: "uy", name: "Uruguay", placeholder: "94 231 234", maxLength: 8 },
  { code: "+998", iso2: "uz", name: "Uzbekistan", placeholder: "90 123 45 67", maxLength: 9 },
  { code: "+678", iso2: "vu", name: "Vanuatu", placeholder: "591 2345", maxLength: 7 },
  { code: "+379", iso2: "va", name: "Vatican City", placeholder: "312 34 56 78", maxLength: 9 },
  { code: "+58", iso2: "ve", name: "Venezuela", placeholder: "412 1234567", maxLength: 10 },
  { code: "+84", iso2: "vn", name: "Vietnam", placeholder: "91 234 56 78", maxLength: 9 },
  { code: "+967", iso2: "ye", name: "Yemen", placeholder: "712 345 678", maxLength: 9 },
  { code: "+260", iso2: "zm", name: "Zambia", placeholder: "95 5123456", maxLength: 9 },
  { code: "+263", iso2: "zw", name: "Zimbabwe", placeholder: "71 234 5678", maxLength: 9 },
];

// ─── Event types ──────────────────────────────────────────────────────────────
const EVENT_TYPES = [
  "Wedding/Mehndi",
  "Concert",
  "Corporate Event",
  "Private Party",
  "Cruise",
  "Resort",
  "Festival",
  "Cultural Exchange",
  "Embassy / Diplomatic",
  "Government Event",
  "College Event",
  "Birthday Party",
];

// ─── Floating particles ───────────────────────────────────────────────────────
const FloatingParticles = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
};

// ─── Artist type card ─────────────────────────────────────────────────────────
const ArtistTypeCard = ({
  icon: Icon, label, value, selected, onClick, color,
}: {
  icon: any; label: string; value: string; selected: boolean; onClick: () => void; color: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 group flex flex-col items-center gap-2 ${selected
      ? `bg-gradient-to-br ${color} border-transparent shadow-lg scale-105`
      : "bg-[#0a0a0b]/80 border-gray-800 hover:border-gray-700 hover:bg-[#111]"
      }`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selected ? "bg-white/20" : "bg-gradient-to-br from-gray-800 to-gray-900"}`}>
      <Icon className={`w-6 h-6 ${selected ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
    </div>
    <span className={`text-sm font-medium ${selected ? "text-white" : "text-gray-400 group-hover:text-white"}`}>{label}</span>
    {selected && (
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
        <CheckCircle className="w-4 h-4 text-green-500" />
      </div>
    )}
  </button>
);

// ─── Flag image helper ────────────────────────────────────────────────────────
// Uses flagcdn.com — reliable, free, no API key needed.
// URL pattern: https://flagcdn.com/w20/{iso2_lowercase}.png
const FlagImg = ({ iso2, className = "" }: { iso2: string; className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={`https://flagcdn.com/w20/${iso2.toLowerCase()}.png`}
    srcSet={`https://flagcdn.com/w40/${iso2.toLowerCase()}.png 2x`}
    width={20}
    height={15}
    alt={iso2}
    className={`rounded-sm object-cover flex-shrink-0 ${className}`}
    style={{ display: "inline-block" }}
  />
);

// ─── Phone input with country code ───────────────────────────────────────────
const PhoneInput = ({
  value,
  onChange,
}: {
  value: { countryCode: string; number: string };
  onChange: (val: { countryCode: string; number: string }) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = COUNTRY_CODES.find((c) => c.code === value.countryCode) ?? COUNTRY_CODES[0];

  // Deduplicate by code+name (e.g. +1 Canada vs +1 US) and filter by search
  const filtered = COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex gap-2" ref={ref}>
      {/* Country code picker */}
      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => { setOpen(!open); setSearch(""); }}
          className="h-full px-3 py-4 bg-[#0a0a0b]/80 border-2 border-gray-800 rounded-2xl text-white flex items-center gap-2 hover:border-gray-700 transition-all duration-300 min-w-[100px]"
        >
          <FlagImg iso2={selected.iso2} />
          <span className="text-sm font-medium text-gray-300">{selected.code}</span>
          <ChevronDown className={`w-3 h-3 text-orange-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute z-[9999] top-full mt-2 left-0 w-72 bg-[#0f0f10] border-2 border-gray-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b border-gray-800">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or code..."
                autoFocus
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
              />
            </div>
            {/* List */}
            <div
              className="max-h-60 overflow-y-auto"
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
            >
              {filtered.map((c) => (
                <button
                  key={`${c.iso2}-${c.code}`}
                  type="button"
                  onClick={() => {
                    onChange({ countryCode: c.code, number: "" });
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${value.countryCode === c.code && selected.iso2 === c.iso2
                    ? "bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-400"
                    : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                    }`}
                >
                  <FlagImg iso2={c.iso2} className="w-5 h-[15px]" />
                  <span className="flex-1 text-left truncate">{c.name}</span>
                  <span className="text-gray-500 font-mono text-xs flex-shrink-0">{c.code}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-4 text-center text-sm text-gray-500">No results</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Number input — placeholder & maxLength adapt to selected country */}
      <input
        type="tel"
        value={value.number}
        onChange={(e) => {
          // Strip non-numeric chars, enforce maxLength
          const digits = e.target.value.replace(/[^\d\s]/g, "");
          if (digits.replace(/\s/g, "").length <= (selected.maxLength ?? 15)) {
            onChange({ ...value, number: digits });
          }
        }}
        required
        placeholder={selected.placeholder ?? "Enter number"}
        maxLength={(selected.maxLength ?? 15) + Math.floor((selected.maxLength ?? 15) / 3)} // account for spaces
        className="flex-1 px-5 py-4 bg-[#0a0a0b]/80 border-2 border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-0 focus:border-blue-500/50 transition-all duration-300 hover:border-gray-700"
      />
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function PostRequirementPage() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [loadingArtist, setLoadingArtist] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [loadingPackage, setLoadingPackage] = useState(false);

  const [phone, setPhone] = useState({ countryCode: "+92", number: "" });

  const [formData, setFormData] = useState({
    eventType: "",
    eventDate: "",
    eventLocation: "",
    budget: "",
    artistType: "",
    name: "",
    email: "",
    message: "",
  });

  const [citySearch, setCitySearch] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [showStepContent, setShowStepContent] = useState(true);

  // URL param pre-fill
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const artistSlug = urlParams.get("artist");
    const packageId = urlParams.get("package");

    if (artistSlug) {
      setLoadingArtist(true);
      fetch(`${API_BASE_URL}/performers/by-name/${encodeURIComponent(artistSlug)}`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.error) {
            setSelectedArtist(data);
            const categoryName = Array.isArray(data.category) ? data.category[0] : data.category;
            setFormData((prev) => ({
              ...prev,
              artistType: categoryName,
              message: `Interested in booking ${data.name} for my event.`,
            }));
          }
        })
        .catch(console.error)
        .finally(() => setLoadingArtist(false));
    }

    if (packageId) {
      setLoadingPackage(true);
      fetch(`${API_BASE_URL}/packages/${packageId}`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.error) {
            setSelectedPackage(data);
            let budgetRange = "";
            if (data.pricing < 100000) budgetRange = "100K-200K";
            else if (data.pricing < 200000) budgetRange = "100K-200K";
            else if (data.pricing < 300000) budgetRange = "200k-300k";
            else if (data.pricing < 500000) budgetRange = "300k-500k";
            else if (data.pricing < 700000) budgetRange = "500k-700k";
            else if (data.pricing < 1000000) budgetRange = "700k-1M";
            else if (data.pricing < 2000000) budgetRange = "1M+";
            else budgetRange = "2M+";

            setFormData((prev) => ({
              ...prev,
              eventType: data.event_type || "",
              budget: budgetRange,
              message: `Interested in booking the "${data.name}" package for my event. ${data.performers.length > 0
                ? `This package includes: ${data.performers.map((p: any) => p.name).join(", ")}.`
                : ""
                }`,
            }));
          }
        })
        .catch(console.error)
        .finally(() => setLoadingPackage(false));
    }
  }, []);

  useEffect(() => { setShowStepContent(true); }, [step]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node))
        setIsCityDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredCities = [
    ...cities.filter((city) => city.toLowerCase().includes(citySearch.toLowerCase())),
    "Other",
  ];

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        if (res.ok) setCategories(await res.json());
      } catch (e) { console.error(e); }
    }
    fetchCategories();
  }, []);

  const getMinDate = () => new Date().toISOString().split("T")[0];

  const budgetOptions = [
    { range: "100K-200K", label: "Basic", value: "100K-200K" },
    { range: "200K - 300K", label: "Standard", value: "200k-300k" },
    { range: "300K - 500k", label: "Premium", value: "300k-500k" },
    { range: "500K - 700K", label: "Luxury", value: "500k-700k" },
    { range: "700K - 1M", label: "Ultra Luxury", value: "700k-1M" },
    { range: "1M+", label: "Celebrity", value: "1M+" },
    { range: "2M+", label: "Exclusive", value: "2M+" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([k, v]) => submitData.append(k, v as any));
      // Combine country code + number
      submitData.append("phone", `${phone.countryCode}${phone.number}`);

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const packageId = urlParams.get("package");
        const eventName = urlParams.get("event_name") || "Custom";
        if (packageId && selectedPackage) {
          submitData.append("event_name", selectedPackage.name);
          submitData.append("package_id", packageId);
          submitData.append("package_name", selectedPackage.name);
        } else {
          submitData.append("event_name", eventName);
        }
        if (selectedArtist) {
          submitData.append("artist_name", selectedArtist.name);
          submitData.append("artist_id", selectedArtist.id);
        }
      } catch (_) {
        submitData.append("event_name", "Custom");
      }

      const res = await fetch(`${API_BASE_URL}/api/submit-requirement`, { method: "POST", body: submitData });
      if (res.ok) setIsSubmitted(true);
      else alert("Failed to submit request. Please try again.");
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setShowStepContent(false);
    setIsAnimating(true);
    setTimeout(() => { setStep(step + 1); setIsAnimating(false); }, 200);
  };
  const prevStep = () => {
    setShowStepContent(false);
    setIsAnimating(true);
    setTimeout(() => { setStep(step - 1); setIsAnimating(false); }, 200);
  };

  const stepLabels = ["Event", "Artist", "Budget", "Contact"];
  const totalSteps = 4;

  // ── Success screen ────────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] relative overflow-hidden">
        <FloatingParticles />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="relative text-center max-w-lg mx-auto px-6">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-green-500/30 blur-3xl rounded-full animate-ping" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40 rotate-3 hover:rotate-0 transition-transform duration-500">
              <PartyPopper className="w-14 h-14 text-white animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            You're{" "}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">All Set!</span>
          </h1>
          <p className="text-gray-400 text-lg mb-4 leading-relaxed">Your request has been submitted successfully.</p>
          <div className="bg-[#111113]/80 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6 mb-8">
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-gray-500">What happens next?</span>
              <span className="text-green-400 font-medium">24h Response</span>
            </div>
            <div className="space-y-3">
              {[
                { icon: CheckCircle, color: "green", text: "Request received" },
                { icon: Clock, color: "orange", text: "Team reviews your requirements" },
                { icon: Star, color: "pink", text: "Get personalized artist recommendations" },
              ].map(({ icon: Icon, color, text }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 text-${color}-400`} />
                  </div>
                  <span className="text-gray-300 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <a href="/" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-green-500/30 hover:scale-105 transition-all duration-300">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </a>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0b] py-12 sm:py-16 relative overflow-hidden">
      <FloatingParticles />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/15 via-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-300">Book Your Dream Artist</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Let's Plan Your{" "}
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Event</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">Tell us what you need and we'll find the perfect match</p>
        </div>

        {/* Selected Artist Card */}
        {selectedArtist && (
          <div className="mb-8 max-w-lg mx-auto">
            <div className="bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10 border border-orange-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-orange-500/50">
                  <Image
                    src={selectedArtist.profile_image_url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"}
                    alt={selectedArtist.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">Artist Selected</span>
                  </div>
                  <h3 className="text-white font-bold text-lg">{selectedArtist.name}</h3>
                  <p className="text-gray-400 text-sm">{selectedArtist.category} • {selectedArtist.locations?.[0] || "Pakistan"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-lg mx-auto relative">
            <div className="absolute top-5 left-8 right-8 h-1.5 bg-gray-800/80 rounded-full" />
            <div
              className="absolute top-5 left-8 h-1.5 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-lg shadow-pink-500/30"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * (100 - 10)}%` }}
            />
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${s < step
                  ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                  : s === step
                    ? "bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-xl shadow-pink-500/40 scale-110 ring-4 ring-pink-500/20"
                    : "bg-[#1a1a1a] text-gray-500 border border-gray-700"
                  }`}>
                  {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                <span className={`text-xs font-medium transition-colors duration-300 ${s <= step ? "text-white" : "text-gray-500"}`}>
                  {stepLabels[s - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/40 via-pink-500/40 to-purple-500/40 rounded-[28px] blur-lg opacity-50 transition-opacity" />
          <div className="relative bg-[#111113]/95 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8 sm:p-10 shadow-2xl">

            {/* ── Step 1: Event Details ────────────────────────────────────── */}
            <div className={`transition-all duration-300 ${step === 1 ? "opacity-100" : "hidden"} ${isAnimating ? "opacity-0 translate-x-4" : ""}`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Event Details</h2>
                  <p className="text-sm text-gray-500">When and where is your event?</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Event type dropdown – hardcoded */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <PartyPopper className="w-4 h-4 text-orange-400" />
                    What's the occasion? <span className="text-pink-400">*</span>
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-[#0a0a0b]/80 border-2 border-gray-800 rounded-2xl text-white focus:ring-0 focus:border-orange-500/50 transition-all duration-300 hover:border-gray-700 cursor-pointer appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f97316'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.5rem",
                    }}
                  >
                    <option value="">Select event type</option>
                    <option value="Wedding/Mehndi">Wedding/Mehndi</option>
                    <option value="Concert">Concert</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Private Party">Private Party</option>
                    <option value="Cruise">Cruise</option>
                    <option value="Resort">Resort</option>
                    <option value="Festival">Festival</option>
                    <option value="Cultural Exchange">Cultural Exchange</option>
                    <option value="Embassy / Diplomatic">Embassy / Diplomatic</option>
                    <option value="Government Event">Government Event</option>
                    <option value="College Event">College Event</option>
                    <option value="Birthday Party">Birthday Party</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Date */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      Date <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      min={getMinDate()}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-[#0a0a0b]/80 border-2 border-gray-800 rounded-2xl text-white focus:ring-0 focus:border-orange-500/50 transition-all duration-300 hover:border-gray-700 cursor-pointer"
                    />
                  </div>

                  {/* City */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                      <MapPin className="w-4 h-4 text-orange-400" />
                      City <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative z-[10000]" ref={cityDropdownRef}>
                      <input type="hidden" name="eventLocation" value={formData.eventLocation} required />
                      <input
                        type="text"
                        value={isCityDropdownOpen ? citySearch : formData.eventLocation}
                        onChange={(e) => {
                          setCitySearch(e.target.value);
                          if (!isCityDropdownOpen) setIsCityDropdownOpen(true);
                          if (e.target.value === "") setFormData({ ...formData, eventLocation: "" });
                        }}
                        onFocus={() => { setIsCityDropdownOpen(true); setCitySearch(""); }}
                        placeholder="Search city..."
                        className="w-full px-5 py-4 bg-[#0a0a0b]/80 border-2 border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-0 focus:border-orange-500/50 transition-all duration-300 hover:border-gray-700 cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f97316'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.5rem",
                        }}
                        autoComplete="off"
                      />
                      {isCityDropdownOpen && (
                        <div
                          className="absolute z-[9999] mt-2 w-full max-h-60 overflow-y-auto bg-[#0f0f10] border-2 border-gray-800 rounded-2xl shadow-2xl shadow-black/50"
                          data-lenis-prevent
                          onWheel={(e) => e.stopPropagation()}
                        >
                          {filteredCities.length > 0 ? (
                            filteredCities.map((city) => (
                              <button
                                key={city}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, eventLocation: city });
                                  setCitySearch("");
                                  setIsCityDropdownOpen(false);
                                }}
                                className={`w-full text-left px-5 py-3 text-sm transition-colors ${formData.eventLocation === city
                                  ? "bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-400 font-medium"
                                  : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                                  } first:rounded-t-2xl last:rounded-b-2xl`}
                              >
                                {city}
                              </button>
                            ))
                          ) : (
                            <div className="px-5 py-4 text-sm text-gray-500 text-center">No cities found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.eventType || !formData.eventDate || !formData.eventLocation}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-pink-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* ── Step 2: Artist Type ──────────────────────────────────────── */}
            <div className={`transition-all duration-300 ${step === 2 ? "opacity-100" : "hidden"} ${isAnimating ? "opacity-0 translate-x-4" : ""}`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Music className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedArtist ? "Artist Type (Auto-Selected)" : "Choose Artist Type"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedArtist ? `Based on ${selectedArtist.name}'s category` : "What kind of performer do you need?"}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {selectedArtist && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-blue-300 text-sm font-medium">
                          Artist type automatically selected based on {selectedArtist.name}
                        </p>
                        <p className="text-blue-400/70 text-xs mt-1">You can change this if you need a different type of artist</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  {categories.length > 0 ? (
                    categories.map((cat) => {
                      const artistTypeValue = cat.name;
                      const getIcon = (n: string) => {
                        if (n.toLowerCase().includes("singer")) return Music;
                        if (n.toLowerCase().includes("musician") || n.toLowerCase().includes("band")) return Users;
                        if (n.toLowerCase().includes("dj")) return Zap;
                        if (n.toLowerCase().includes("dancer")) return Heart;
                        if (n.toLowerCase().includes("comedian")) return Star;
                        if (n.toLowerCase().includes("qawwal")) return Music2;
                        if (n.toLowerCase().includes("bhangra")) return User2;
                        return Briefcase;
                      };
                      const getColor = (n: string) => {
                        if (n.toLowerCase().includes("singer")) return "from-purple-500 to-pink-600";
                        if (n.toLowerCase().includes("musician") || n.toLowerCase().includes("band")) return "from-blue-500 to-cyan-600";
                        if (n.toLowerCase().includes("dj")) return "from-yellow-500 to-orange-600";
                        if (n.toLowerCase().includes("dancer")) return "from-pink-500 to-rose-600";
                        if (n.toLowerCase().includes("comedian")) return "from-green-500 to-emerald-600";
                        if (n.toLowerCase().includes("qawwal")) return "from-indigo-500 to-violet-600";
                        if (n.toLowerCase().includes("bhangra")) return "from-red-500 to-yellow-600";
                        return "from-gray-500 to-gray-600";
                      };
                      return (
                        <ArtistTypeCard
                          key={cat.id}
                          icon={getIcon(cat.name)}
                          label={cat.name}
                          value={artistTypeValue}
                          color={getColor(cat.name)}
                          selected={formData.artistType === artistTypeValue}
                          onClick={() => setFormData({ ...formData, artistType: artistTypeValue })}
                        />
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-400">Loading categories...</div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="flex-1 py-4 bg-[#1a1a1a] text-gray-300 font-semibold rounded-2xl hover:bg-[#222] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 border border-gray-800">
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button type="button" onClick={nextStep} disabled={!formData.artistType} className="flex-1 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-pink-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed">
                    Continue <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Step 3: Budget ───────────────────────────────────────────── */}
            <div className={`transition-all duration-300 ${step === 3 ? "opacity-100" : "hidden"} ${isAnimating ? "opacity-0 translate-x-4" : ""}`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Set Your Budget</h2>
                  <p className="text-sm text-gray-500">How much would you like to spend? (PKR)</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {budgetOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: option.value })}
                      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-center ${formData.budget === option.value
                        ? "bg-gradient-to-br from-orange-500/20 to-pink-500/20 border-orange-500/50 shadow-lg shadow-orange-500/10"
                        : "bg-[#0a0a0b]/80 border-gray-800 hover:border-gray-700"
                        }`}
                    >
                      <div className={`text-lg font-bold mb-1 ${formData.budget === option.value ? "text-white" : "text-gray-300"}`}>
                        {option.range}
                      </div>
                      <div className="text-xs text-gray-500">{option.label}</div>
                      {formData.budget === option.value && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <MessageSquare className="w-4 h-4 text-orange-400" />
                    Additional Details (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any specific requirements, preferred songs, special requests..."
                    className="w-full px-5 py-4 bg-[#0a0a0b]/80 border-2 border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-0 focus:border-orange-500/50 transition-all duration-300 hover:border-gray-700 resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="flex-1 py-4 bg-[#1a1a1a] text-gray-300 font-semibold rounded-2xl hover:bg-[#222] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 border border-gray-800">
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button type="button" onClick={nextStep} className="flex-1 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-pink-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group">
                    Continue <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Step 4: Contact ──────────────────────────────────────────── */}
            <div className={`transition-all duration-300 ${step === 4 ? "opacity-100" : "hidden"} ${isAnimating ? "opacity-0 translate-x-4" : ""}`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Almost Done!</h2>
                  <p className="text-sm text-gray-500">How can we reach you?</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <User className="w-4 h-4 text-blue-400" />
                    Your Name <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Muhammad Ahmed"
                    className="w-full px-5 py-4 bg-[#0a0a0b]/80 border-2 border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-0 focus:border-blue-500/50 transition-all duration-300 hover:border-gray-700"
                  />
                </div>

                {/* Email */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <Mail className="w-4 h-4 text-blue-400" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    className="w-full px-5 py-4 bg-[#0a0a0b]/80 border-2 border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-0 focus:border-blue-500/50 transition-all duration-300 hover:border-gray-700"
                  />
                </div>

                {/* Phone – international format */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <Phone className="w-4 h-4 text-blue-400" />
                    Phone <span className="text-pink-400">*</span>
                  </label>
                  <PhoneInput value={phone} onChange={setPhone} />
                </div>

                {/* Booking summary */}
                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-5 border border-gray-800/50">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Booking Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {selectedArtist && (
                      <div className="col-span-2 pb-2 border-b border-gray-700/50">
                        <span className="text-gray-500">Selected Artist:</span>
                        <span className="text-orange-400 ml-2 font-semibold">{selectedArtist.name}</span>
                      </div>
                    )}
                    <div><span className="text-gray-500">Event:</span><span className="text-white ml-2">{formData.eventType || "-"}</span></div>
                    <div><span className="text-gray-500">Date:</span><span className="text-white ml-2">{formData.eventDate || "-"}</span></div>
                    <div><span className="text-gray-500">Location:</span><span className="text-white ml-2">{formData.eventLocation || "-"}</span></div>
                    <div><span className="text-gray-500">Artist Type:</span><span className="text-white ml-2 capitalize">{formData.artistType || "-"}</span></div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="flex-1 py-4 bg-[#1a1a1a] text-gray-300 font-semibold rounded-2xl hover:bg-[#222] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 border border-gray-800">
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.name || !phone.number}
                    className="flex-1 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-green-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                    ) : (
                      <><Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> Submit Request</>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </form>

        {/* Trust indicators */}
        <div className="mt-10 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 py-4 bg-[#111113]/60 rounded-2xl border border-gray-800/50">
            {[
              { icon: Zap, color: "green", text: "Quick Response" },
              { icon: Star, color: "orange", text: "500+ Artists" },
              { icon: Shield, color: "pink", text: "Secure Booking" },
            ].map(({ icon: Icon, color, text }, i) => (
              <>
                {i > 0 && <div key={`div-${i}`} className="hidden sm:block w-px h-6 bg-gray-700" />}
                <div key={text} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 text-${color}-400`} />
                  </div>
                  <span className="text-sm text-gray-400">{text}</span>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
        .animate-float { animation: float linear infinite; }
        select { scrollbar-width: thin; scrollbar-color: #f97316 #1a1a1a; }
        select::-webkit-scrollbar { width: 8px; }
        select::-webkit-scrollbar-track { background: #1a1a1a; border-radius: 10px; }
        select::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #f97316, #ec4899); border-radius: 10px; }
        select::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #ea580c, #db2777); }
        select option { background-color: #0a0a0b; color: #ffffff; padding: 12px; border-bottom: 1px solid #1a1a1a; }
        select option:checked { background: linear-gradient(to right, #f97316, #ec4899); color: white; }
      `}</style>
    </div>
  );
}