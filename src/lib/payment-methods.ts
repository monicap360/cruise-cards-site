// Ways to pay Cruises from Galveston. Person-to-person / check / cash keep card
// processing fees down — the savings help keep cruise pricing competitive.

export const PAY_MAIL_ADDRESS = "3501 Winnie St, Galveston, TX 77550";
export const PAY_ZELLE = "409-392-9626";
export const PAY_CASHAPP = "$galvestonmonica";
export const PAY_VENMO = "@4093929626";
export const PAY_APPT_HREF = "/book-a-call";

export type PaymentMethod = {
  key: string;
  icon: string;
  name: string;
  value?: string;       // copyable handle (Zelle/CashApp/Venmo/address)
  detail: string;
  apptButton?: boolean; // shows "Book in-person appointment"
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { key: "zelle", icon: "⚡", name: "Zelle", value: PAY_ZELLE, detail: "Send from your bank app to this number." },
  { key: "cashapp", icon: "💵", name: "Cash App", value: PAY_CASHAPP, detail: "Send to this $cashtag." },
  { key: "venmo", icon: "🅥", name: "Venmo", value: PAY_VENMO, detail: "Send to this Venmo." },
  { key: "check", icon: "✉️", name: "Mail a check", value: PAY_MAIL_ADDRESS, detail: "You’ll receive a receipt once the check clears." },
  { key: "cash", icon: "🤝", name: "Cash in person", detail: "By appointment at our Galveston office.", apptButton: true },
];
