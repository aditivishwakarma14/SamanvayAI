import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Crown, X } from "lucide-react";
import { useSelector } from "react-redux";

import { createOrder } from "../features/createOrder.js";
import { verifyPayment } from "../features/verifyPayment.js";
import { loadRazorpay } from "../utils/loadRazorpay.js";

const COLORS = {
  background: "#07090C",
  surface: "#0d0f14",
  primary: "#6366F1",
  primaryLight: "#8ea2ff",
  primaryDark: "#35458A",
  hover: "#161D38",
  hoverBorder: "#4B5FC4",
  text: "#F1F5F9",
  muted: "#64748B",
  border: "rgba(255,255,255,0.06)",
  cardBorder: "rgba(255,255,255,0.08)",
};

function BillingDrawer({ open, onClose }) {
  const { userData } = useSelector((state) => state.user);

  const handleUpgrade = async (plan) => {
    try {
      const data = await createOrder(plan);

      const isLoaded = await loadRazorpay();

      if (!isLoaded) {
        console.error("Razorpay failed to load");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data?.order?.amount,
        currency: data?.order?.currency,
        name: "Samanvay AI",
        description: `${data?.plan?.name} Plan`,
        order_id: data?.order?.id,

        handler: async (response) => {
          try {
            const data = await verifyPayment(response);
            console.log(data);
          } catch (error) {
            console.log(error);
          }
        },

        theme: {
          color: COLORS.primary,
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25 }}
            className="fixed right-0 top-0 z-50 h-screen w-[380px] shadow-2xl flex flex-col"
            style={{
              backgroundColor: COLORS.background,
              borderLeft: `1px solid ${COLORS.border}`,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-5"
              style={{
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              <div>
                <div className="text-slate-100 text-lg font-semibold">
                  Billing
                </div>

                <div className="text-slate-500 text-sm">
                  Plans & Credits
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors bg-white/[0.05] hover:bg-white/[0.08]"
              >
                <X
                  size={18}
                  className="text-slate-400"
                />
              </button>
            </div>

            {/* Current Plan */}
            <div className="p-5">
              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${COLORS.cardBorder}`,
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-500 text-sm">
                      Current Plan
                    </p>

                    <h3 className="text-slate-100 text-xl font-bold">
                      {userData?.plan || "free"}
                    </h3>
                  </div>

                  <Crown
                    size={22}
                    className="text-yellow-400"
                  />
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Credits</span>

                    <span>
                      {userData?.credits || 0}/
                      {userData?.totalCredits || 100}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${(
                          ((userData?.credits || 0) /
                            (userData?.totalCredits || 1)) *
                          100
                        )}%`,
                        backgroundColor: COLORS.primary,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Plans */}
            <div className="px-5 flex-1 overflow-auto space-y-4">

              {/* Starter Plan */}
              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: `1px solid ${COLORS.cardBorder}`,
                }}
              >
                <h3 className="text-slate-100 font-semibold">
                  Starter Plan
                </h3>

                <p
                  className="text-2xl font-bold mt-2"
                  style={{
                    color: COLORS.primaryLight,
                  }}
                >
                  ₹199
                </p>

                <p className="text-slate-500 text-sm mt-1">
                  500 Credits
                </p>

                <button
                  className="mt-4 w-full rounded-xl py-2 text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: "rgba(99,102,241,0.10)",
                    color: COLORS.primaryLight,
                    border: `1px solid ${COLORS.primaryDark}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      COLORS.hover;

                    e.currentTarget.style.borderColor =
                      COLORS.hoverBorder;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(99,102,241,0.10)";

                    e.currentTarget.style.borderColor =
                      COLORS.primaryDark;
                  }}
                  onClick={() => handleUpgrade("starter")}
                >
                  Upgrade
                </button>
              </div>

              {/* Pro Plan */}
              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: `1px solid ${COLORS.cardBorder}`,
                }}
              >
                <h3 className="text-slate-100 font-semibold">
                  Pro Plan
                </h3>

                <p
                  className="text-2xl font-bold mt-2"
                  style={{
                    color: COLORS.primaryLight,
                  }}
                >
                  ₹499
                </p>

                <p className="text-slate-500 text-sm mt-1">
                  1000 Credits
                </p>

                <button
                  className="mt-4 w-full rounded-xl py-2 text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: "rgba(99,102,241,0.10)",
                    color: COLORS.primaryLight,
                    border: `1px solid ${COLORS.primaryDark}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      COLORS.hover;

                    e.currentTarget.style.borderColor =
                      COLORS.hoverBorder;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(99,102,241,0.10)";

                    e.currentTarget.style.borderColor =
                      COLORS.primaryDark;
                  }}
                  onClick={() => handleUpgrade("pro")}
                >
                  Upgrade
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BillingDrawer;