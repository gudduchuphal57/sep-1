"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  CreditCard,
  Download,
  Plus,
  ReceiptText,
  Search,
  Settings2,
  ShieldCheck,
  Trash2,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import type { DashboardTab } from "../sidebar";

type PaymentMethod = {
  id: string;
  brand: string;
  mark: string;
  ending: string;
  role: "Default" | "Backup";
  expires: string;
  holder: string;
};

type CardForm = {
  holder: string;
  brand: string;
  number: string;
  expires: string;
  isDefault: boolean;
};

const initialPaymentMethods: PaymentMethod[] = [
  {
    id: "visa",
    brand: "Google / Visa",
    mark: "G Pay",
    ending: "9862",
    role: "Default",
    expires: "12/2032",
    holder: "Muneeb Khan",
  },
  {
    id: "mastercard",
    brand: "Mastercard",
    mark: "●●",
    ending: "7299",
    role: "Backup",
    expires: "02/2030",
    holder: "Muneeb Khan",
  },
  {
    id: "apple",
    brand: "Apple Pay / JCB",
    mark: " Pay",
    ending: "9834",
    role: "Backup",
    expires: "08/2033",
    holder: "Muneeb Khan",
  },
];

const invoices: {
  id: string;
  date: string;
  amount: string;
  plan: string;
  status: string;
}[] = [
    {
      id: "INV-2026-001",
      date: "July 15, 2026",
      amount: "$29.00 USD",
      plan: "Starter",
      status: "Paid",
    },
    {
      id: "INV-2026-002",
      date: "June 15, 2026",
      amount: "$29.00 USD",
      plan: "Starter",
      status: "Paid",
    },
    {
      id: "INV-2026-003",
      date: "May 15, 2026",
      amount: "$49.00 USD",
      plan: "Professional",
      status: "Pending",
    }
  ];

const emptyCardForm: CardForm = {
  holder: "",
  brand: "Visa",
  number: "",
  expires: "",
  isDefault: false,
};

export default function BillingTab({
  onNavigate,
}: {
  onNavigate: (tab: DashboardTab) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [cardModal, setCardModal] = useState<{
    mode: "add" | "edit";
    methodId?: string;
  } | null>(null);
  const [cardForm, setCardForm] = useState<CardForm>(emptyCardForm);
  const [cardError, setCardError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filteredInvoices = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return invoices;

    return invoices.filter((invoice) =>
      `${invoice.id} ${invoice.date} ${invoice.amount} ${invoice.plan} ${invoice.status}`
        .toLowerCase()
        .includes(value),
    );
  }, [query]);

  const toggleMethod = (id: string) => {
    setSelectedMethods((current) =>
      current.includes(id)
        ? current.filter((methodId) => methodId !== id)
        : [...current, id],
    );
  };

  const openAddCard = () => {
    setCardForm(emptyCardForm);
    setCardError("");
    setCardModal({ mode: "add" });
  };

  const openEditCard = (methodId?: string) => {
    const method = paymentMethods.find((item) => item.id === methodId);
    if (!method) return;

    setCardForm({
      holder: method.holder,
      brand: method.brand,
      number: `•••• •••• •••• ${method.ending}`,
      expires: method.expires,
      isDefault: method.role === "Default",
    });
    setCardError("");
    setCardModal({ mode: "edit", methodId: method.id });
  };

  const saveCard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const digits = cardForm.number.replace(/\D/g, "");

    if (
      !cardForm.holder.trim() ||
      !cardForm.brand.trim() ||
      digits.length < 4 ||
      !cardForm.expires.trim()
    ) {
      setCardError("Please complete all card details.");
      return;
    }

    const nextMethod: PaymentMethod = {
      id: cardModal?.methodId ?? `card-${Date.now()}`,
      brand: cardForm.brand.trim(),
      mark: cardForm.brand.trim().slice(0, 5),
      ending: digits.slice(-4),
      role: cardForm.isDefault ? "Default" : "Backup",
      expires: cardForm.expires.trim(),
      holder: cardForm.holder.trim(),
    };

    setPaymentMethods((current) => {
      const normalized = cardForm.isDefault
        ? current.map((method) => ({ ...method, role: "Backup" as const }))
        : current;

      return cardModal?.mode === "edit"
        ? normalized.map((method) =>
          method.id === cardModal.methodId ? nextMethod : method,
        )
        : [...normalized, nextMethod];
    });
    setCardModal(null);
  };

  const deleteSelectedMethods = () => {
    setPaymentMethods((current) =>
      current.filter((method) => !selectedMethods.includes(method.id)),
    );
    setSelectedMethods([]);
    setShowDeleteConfirm(false);
  };

  return (
    <section className="relative min-h-full overflow-hidden px-4 py-7 sm:px-6 sm:py-9 lg:px-9">
      <div className="pointer-events-none absolute -left-24 top-16 size-72 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-72 size-72 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1400px]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-[-.04em] text-zinc-950">
                Billing
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Active
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-5 text-zinc-500">
              Manage your current plan, payment methods, and invoice history.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-xs font-medium text-zinc-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
          >
            <ReceiptText size={15} /> Billing support
          </button>
        </div>

        <article className="relative mt-7 overflow-hidden rounded-[26px] border border-blue-100 bg-[linear-gradient(120deg,#eef5ff_0%,#ffffff_50%,#effcf8_100%)] p-5 shadow-[0_20px_55px_rgba(50,86,145,.11)] sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-16 size-48 rounded-full bg-blue-200/35 blur-3xl" />
          <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-[1.15fr_.8fr_.9fr_1fr_.8fr_auto] lg:items-center">
            <PlanMetric label="Your plan" value="Starter" />
            <PlanMetric label="Total amount" value="$0.00 USD" />
            <PlanMetric label="Cycle" value="Free forever" />
            <PlanMetric label="Next billing date" value="No upcoming charge" />
            <div>
              <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider text-zinc-400">
                <Users size={12} /> Members
              </span>
              <strong className="mt-1.5 block text-sm font-semibold text-zinc-900">
                1 member
              </strong>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("Plan")}
              className="h-10 rounded-xl bg-zinc-950 px-5 text-xs font-semibold text-white shadow-lg shadow-zinc-300/70 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Edit plan
            </button>
          </div>
        </article>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-zinc-950">
              Payment methods
            </h3>
            <p className="mt-1.5 text-[13px] text-zinc-500">
              Your bill is charged to the default payment method below.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedMethods.length > 0 && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-red-200 bg-white px-3.5 text-[11px] font-medium text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete
                {/* <span className="grid min-w-5 place-items-center rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-semibold text-red-700">
                  {selectedMethods.length}
                </span> */}
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                openEditCard(selectedMethods[0] ?? paymentMethods[0]?.id)
              }
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 text-[11px] font-medium text-zinc-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
            >
              <Settings2 size={14} /> Edit cards
            </button>
            <button
              type="button"
              onClick={openAddCard}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-blue-700 px-3.5 text-[11px] font-medium text-white shadow-lg shadow-blue-200 transition hover:bg-blue-800"
            >
              <Plus size={14} /> Add new card
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_35px_rgba(36,52,80,.06)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="border-b border-zinc-100 bg-zinc-50/75 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="w-12 px-4 py-3" />
                  <th className="px-4 py-3">Payment method</th>
                  <th className="px-4 py-3">Ending</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Date expired</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="w-14 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {paymentMethods.map((method) => {
                  const selected = selectedMethods.includes(method.id);

                  return (
                    <tr
                      key={method.id}
                      className="text-[13px] text-zinc-600 transition bg-white hover:bg-blue-50/35"
                    >
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => toggleMethod(method.id)}
                          aria-label={`Select ${method.brand}`}
                          className={`grid size-4 place-items-center rounded border ${selected ? "border-blue-600 bg-blue-600 text-white" : "border-zinc-200 bg-white"}`}
                        >
                          {selected && <Check size={10} strokeWidth={3} />}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="grid h-8 min-w-12 place-items-center rounded-lg border border-zinc-100 bg-white px-2 text-[9px] font-semibold text-zinc-700 shadow-sm">
                            {method.mark}
                          </span>
                          <strong className="font-medium text-zinc-800">
                            {method.brand}
                          </strong>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">Ending {method.ending}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-full px-2 py-1 text-[9px] font-semibold ${method.role === "Default" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}
                        >
                          {method.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">{method.expires}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-700">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          Working
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => openEditCard(method.id)}
                          aria-label={`Manage ${method.brand}`}
                          className="grid size-8 place-items-center rounded-lg border border-zinc-100 text-zinc-400 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Settings2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {paymentMethods.length === 0 && (
            <div className="grid place-items-center px-6 py-12 text-center">
              <Search size={20} className="text-zinc-300" />
              <p className="mt-3 text-xs font-medium text-zinc-700">
                {query ? "No matching card" : "No card is added"}
              </p>
              <p className="mt-1 text-[10px] text-zinc-400">
                {query
                  ? "Try another card."
                  : "Add your card for hassle free process."}
              </p>
            </div>
          )}
        </div>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-zinc-950">
              Invoices
            </h3>
            <p className="mt-1.5 text-[13px] text-zinc-500">
              Invoices are generated every 30 days and sent to your default
              payment method.
            </p>
          </div>
          <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 text-zinc-400 shadow-sm focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50 sm:w-64">
            <Search size={14} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search invoices"
              className="min-w-0 flex-1 bg-transparent text-xs text-zinc-800 outline-none placeholder:text-zinc-400"
            />
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_35px_rgba(36,52,80,.06)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="border-b border-zinc-100 bg-zinc-50/75 text-[9px] font-semibold uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="px-5 py-3">Invoice ID</th>
                  <th className="px-5 py-3">Date sent</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Plan</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="w-14 px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="text-[11px] text-zinc-600 transition hover:bg-blue-50/35"
                  >
                    <td className="px-5 py-4 font-medium text-zinc-800">
                      {invoice.id}
                    </td>
                    <td className="px-5 py-4">{invoice.date}</td>
                    <td className="px-5 py-4 font-medium text-zinc-800">
                      {invoice.amount}
                    </td>
                    <td className="px-5 py-4">{invoice.plan}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-semibold ${invoice.status === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${invoice.status === "Paid" ? "bg-emerald-500" : "bg-red-500"}`}
                        />
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        aria-label={`Download ${invoice.id}`}
                        className="grid size-8 place-items-center rounded-lg border border-zinc-100 text-zinc-400 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="grid place-items-center px-6 py-12 text-center">
              <Search size={20} className="text-zinc-300" />
              <p className="mt-3 text-xs font-medium text-zinc-700">
                {query ? "No matching invoices" : "No invoices yet"}
              </p>
              <p className="mt-1 text-[10px] text-zinc-400">
                {query
                  ? "Try another invoice number, plan, or status."
                  : "Your Starter plan is free, so there are no charges to show."}
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/55 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-blue-700 shadow-sm">
              <ShieldCheck size={17} />
            </span>
            <div>
              <p className="text-xs font-medium text-zinc-800">
                Payments are securely encrypted
              </p>
              <p className="mt-1 text-[10px] text-zinc-500">
                Card information is handled through compliant payment
                infrastructure.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 text-[10px] font-medium text-blue-700">
            <WalletCards size={14} /> {paymentMethods.length} payment methods
            connected
          </span>
        </div>
      </div>

      {cardModal && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-zinc-950/45 p-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close card form"
            onClick={() => setCardModal(null)}
            className="absolute inset-0 cursor-default"
          />

          <form
            onSubmit={saveCard}
            className="relative z-10 w-full max-w-md rounded-[26px] border border-white/80 bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,.25)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="grid size-10 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                  <CreditCard size={18} />
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-zinc-950">
                  {cardModal.mode === "add"
                    ? "Add payment card"
                    : "Edit payment card"}
                </h3>
                <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                  {cardModal.mode === "add"
                    ? "Add a card for future plan upgrades and purchases."
                    : "Update the saved details for this payment method."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCardModal(null)}
                className="grid size-9 shrink-0 place-items-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <CardField label="Cardholder name">
                <input
                  type="text"
                  value={cardForm.holder}
                  onChange={(event) =>
                    setCardForm((current) => ({
                      ...current,
                      holder: event.target.value,
                    }))
                  }
                  placeholder="Name on card"
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                />
              </CardField>

              <CardField label="Card number">
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardForm.number}
                  onChange={(event) =>
                    setCardForm((current) => ({
                      ...current,
                      number: event.target.value,
                    }))
                  }
                  placeholder="1234 5678 9012 3456"
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                />
              </CardField>

              <div className="grid grid-cols-2 gap-3">
                <CardField label="Card type">
                  <input
                    type="text"
                    value={cardForm.brand}
                    onChange={(event) =>
                      setCardForm((current) => ({
                        ...current,
                        brand: event.target.value,
                      }))
                    }
                    placeholder="Visa"
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  />
                </CardField>
                <CardField label="Expiry date">
                  <input
                    type="text"
                    value={cardForm.expires}
                    onChange={(event) =>
                      setCardForm((current) => ({
                        ...current,
                        expires: event.target.value,
                      }))
                    }
                    placeholder="MM/YYYY"
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  />
                </CardField>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 text-xs text-zinc-600">
                <input
                  type="checkbox"
                  checked={cardForm.isDefault}
                  onChange={(event) =>
                    setCardForm((current) => ({
                      ...current,
                      isDefault: event.target.checked,
                    }))
                  }
                  className="size-4 accent-blue-600"
                />
                Use as the default payment method
              </label>
            </div>

            {cardError && (
              <p role="alert" className="mt-3 text-[11px] text-red-600">
                {cardError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setCardModal(null)}
                className="h-11 flex-1 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-11 flex-1 rounded-xl bg-[linear-gradient(120deg,#315ff4,#6b4ff8)] text-xs font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5"
              >
                {cardModal.mode === "add" ? "Add card" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {showDeleteConfirm && selectedMethods.length > 0 && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close delete confirmation"
            onClick={() => setShowDeleteConfirm(false)}
            className="absolute inset-0 cursor-default"
          />

          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-payment-title"
            aria-describedby="delete-payment-description"
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-[28px] border border-white/80 bg-white p-6 text-center shadow-[0_30px_90px_rgba(15,23,42,.3)]"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-red-100/70 blur-3xl" />
            <div className="relative">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/60">
                <Trash2 size={24} strokeWidth={2.2} />
              </span>
              <h3
                id="delete-payment-title"
                className="mt-6 text-xl font-semibold tracking-tight text-zinc-950"
              >
                Delete {selectedMethods.length === 1 ? "payment method" : "payment methods"}?
              </h3>
              <p
                id="delete-payment-description"
                className="mx-auto mt-2 max-w-xs text-[12px] leading-5 text-zinc-500"
              >
                {selectedMethods.length === 1
                  ? "This card will be permanently removed from your account."
                  : `${selectedMethods.length} selected cards will be permanently removed from your account.`}
                {" "}This action cannot be undone.
              </p>

              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="h-11 flex-1 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={deleteSelectedMethods}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,#ef4444,#dc2626)] text-xs font-semibold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CardField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-[11px] font-medium text-zinc-700">
      {label}
      {children}
    </label>
  );
}

function PlanMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider text-zinc-400">
        {label === "Cycle" && <CalendarDays size={12} />}
        {label === "Total amount" && <CreditCard size={12} />}
        {label}
      </span>
      <strong className="mt-1.5 block text-sm font-semibold text-zinc-900">
        {value}
      </strong>
    </div>
  );
}
