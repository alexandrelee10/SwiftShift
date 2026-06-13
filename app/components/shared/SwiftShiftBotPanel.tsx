"use client";

import { useEffect, useRef, useState } from "react";
import {
  Send,
  Truck,
  MessageCircle,
  Sparkles,
  Bot,
  User,
} from "lucide-react";

type KnowledgeEntry = {
  tags: string[];
  question: string;
  answer: string;
};

type ChatMessage = {
  role: "bot" | "user";
  text: string;
};

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    tags: ["bol", "bill of lading", "shipping document", "load document"],
    question: "What is a BOL?",
    answer:
      "A Bill of Lading (BOL) is a legal document between the shipper and carrier. It lists the freight, quantity, pickup, delivery, and condition of the load. Drivers usually need it at pickup, delivery, and for payment processing.",
  },
  {
    tags: ["pod", "proof of delivery", "delivery proof", "signed delivery"],
    question: "What is a POD?",
    answer:
      "A Proof of Delivery (POD) confirms the receiver accepted the freight. It is usually a signed BOL, delivery receipt, or uploaded document showing the load was delivered successfully.",
  },
  {
    tags: ["post load", "create load", "new load", "add load", "broker post"],
    question: "How do I post a load?",
    answer:
      "Go to the broker dashboard, open Post a Load, then enter the pickup, delivery, rate, weight, equipment type, dates, and commodity. Once submitted, the load appears on the load board.",
  },
  {
    tags: ["find load", "search load", "available loads", "load board", "loads near me"],
    question: "How do I find available loads?",
    answer:
      "Open the Load Board and use filters like pickup location, destination, equipment type, rate, weight, and pickup date. Select a load to view details before requesting it.",
  },
  {
    tags: ["book load", "claim load", "accept load", "request load", "request booking", "book a load"],
    question: "How do I book a load?",
    answer:
      "Open a load and click Request Load. The broker reviews your request. If approved, the load moves into your approved or active loads section.",
  },
  {
    tags: ["approved load", "load approved", "approval", "broker approved"],
    question: "What happens after a load is approved?",
    answer:
      "Once a broker approves your request, the load becomes available for trip actions. You may be able to start the trip, view documents, or receive dispatch instructions depending on your app setup.",
  },
  {
    tags: ["rejected load", "load rejected", "denied load", "request denied"],
    question: "Why was my load request rejected?",
    answer:
      "A broker may reject a request if the load was already assigned, your carrier profile is incomplete, equipment does not match, documents are missing, or the broker selected another driver.",
  },
  {
    tags: ["pending load", "pending request", "waiting approval", "requested load"],
    question: "What does pending mean?",
    answer:
      "Pending means your load request was submitted and is waiting for the broker to approve or reject it. No trip should start until the load is approved or assigned.",
  },
  {
    tags: ["dispatch", "dispatch board", "status", "load status", "statuses"],
    question: "What do the dispatch statuses mean?",
    answer:
      "Dispatch statuses show where the load is in its lifecycle, such as Available, Requested, Approved, Assigned, In Transit, Delivered, Completed, Cancelled, or Rejected.",
  },
  {
    tags: ["available status", "available load", "open load"],
    question: "What does Available mean?",
    answer:
      "Available means the load is open on the load board and drivers or carriers can request it if they match the requirements.",
  },
  {
    tags: ["assigned status", "assigned load", "load assigned"],
    question: "What does Assigned mean?",
    answer:
      "Assigned means the broker or dispatcher has selected a driver or carrier for the load. The load is no longer open for general requests.",
  },
  {
    tags: ["in transit", "on route", "driving load", "started trip"],
    question: "What does In Transit mean?",
    answer:
      "In Transit means the driver has started the trip and the freight is currently moving from pickup to delivery.",
  },
  {
    tags: ["delivered", "delivered status", "finish delivery"],
    question: "What does Delivered mean?",
    answer:
      "Delivered means the freight reached the receiver. The driver should upload the signed BOL or POD so the load can move toward completion and payment.",
  },
  {
    tags: ["completed", "completed load", "closed load"],
    question: "What does Completed mean?",
    answer:
      "Completed means the load has been delivered, required documents are submitted, and the broker or system has closed out the load.",
  },
  {
    tags: ["cancel load", "cancelled load", "load cancelled", "delete load"],
    question: "What does Cancelled mean?",
    answer:
      "Cancelled means the load is no longer active. It may have been removed by the broker, cancelled by the shipper, or made unavailable due to scheduling changes.",
  },
  {
    tags: ["rate confirmation", "rate con", "ratecon", "load confirmation"],
    question: "What is a rate confirmation?",
    answer:
      "A rate confirmation is an agreement between broker and carrier showing the rate, pickup and delivery details, special instructions, and payment terms for the load.",
  },
  {
    tags: ["rate", "load rate", "pay rate", "how much does load pay"],
    question: "Where can I see the load rate?",
    answer:
      "The load rate is usually shown on the load details page. Review the rate, miles, pickup, delivery, and requirements before requesting or accepting the load.",
  },
  {
    tags: ["rpm", "rate per mile", "dollars per mile", "pay per mile"],
    question: "What is rate per mile?",
    answer:
      "Rate per mile is the load pay divided by total miles. For example, a $1,500 load going 500 miles pays $3.00 per mile.",
  },
  {
    tags: ["deadhead", "deadhead miles", "empty miles"],
    question: "What are deadhead miles?",
    answer:
      "Deadhead miles are unpaid or empty miles driven before pickup or after delivery. Always consider deadhead when deciding if a load is worth taking.",
  },
  {
    tags: ["pickup", "pickup appointment", "pickup time", "shipper"],
    question: "Where do I find pickup details?",
    answer:
      "Open the load details page to view the pickup address, appointment time, shipper information, contact details, and special instructions.",
  },
  {
    tags: ["delivery", "drop off", "receiver", "consignee", "delivery appointment"],
    question: "Where do I find delivery details?",
    answer:
      "Open the load details page to view the delivery address, appointment time, receiver or consignee information, and delivery instructions.",
  },
  {
    tags: ["appointment", "appt", "late appointment", "missed appointment"],
    question: "What if I am late to an appointment?",
    answer:
      "Notify the broker or dispatcher as soon as possible. Update your ETA if the app supports tracking, and document any delays so everyone has accurate information.",
  },
  {
    tags: ["eta", "update eta", "estimated arrival", "arrival time"],
    question: "How do I update my ETA?",
    answer:
      "Go to your active trip and update the ETA if the option is available. If not, contact the broker or dispatcher directly with your new estimated arrival time.",
  },
  {
    tags: ["detention", "detention pay", "waiting at shipper", "waiting at receiver"],
    question: "What is detention?",
    answer:
      "Detention is extra pay that may apply when a driver waits too long at pickup or delivery. Brokers usually require arrival/departure times and documentation before approving detention.",
  },
  {
    tags: ["layover", "layover pay", "stuck overnight"],
    question: "What is layover pay?",
    answer:
      "Layover pay may apply when a driver is delayed overnight due to circumstances outside their control. Contact the broker or dispatcher and keep records of the delay.",
  },
  {
    tags: ["lumper", "lumper fee", "unloading fee", "lumper receipt"],
    question: "What is a lumper fee?",
    answer:
      "A lumper fee is a charge for unloading services at a facility. Save the lumper receipt and upload it if reimbursement is required.",
  },
  {
    tags: ["accessorial", "extra pay", "extra charges", "additional charges"],
    question: "What are accessorial charges?",
    answer:
      "Accessorial charges are extra fees beyond the base rate, such as detention, layover, lumper fees, truck ordered not used, driver assist, or extra stops.",
  },
  {
    tags: ["tonu", "truck ordered not used", "cancelled after dispatch"],
    question: "What is TONU?",
    answer:
      "TONU means Truck Ordered Not Used. It may apply when a carrier shows up or commits to a load, but the load gets cancelled after dispatch. Payment depends on broker terms.",
  },
  {
    tags: ["carrier vetting", "carrier verification", "mc number", "dot number", "authority"],
    question: "How is carrier vetting done?",
    answer:
      "Carrier vetting checks MC/DOT authority, insurance, safety ratings, operating status, carrier profile, and sometimes fraud prevention details before a carrier can book loads.",
  },
  {
    tags: ["insurance", "cargo insurance", "liability insurance", "certificate of insurance"],
    question: "What insurance do carriers need?",
    answer:
      "Carriers commonly need active auto liability and cargo insurance. Brokers may require a certificate of insurance before approving or assigning a load.",
  },
  {
    tags: ["mc", "mc number", "motor carrier number"],
    question: "What is an MC number?",
    answer:
      "An MC number is a federal operating authority number for carriers that transport regulated freight across state lines. Brokers use it to verify authority and eligibility.",
  },
  {
    tags: ["dot", "dot number", "usdot", "usdot number"],
    question: "What is a DOT number?",
    answer:
      "A DOT number identifies a commercial motor carrier for safety and compliance tracking. It is commonly used with MC authority during carrier verification.",
  },
  {
    tags: ["factoring", "sell invoice", "quick pay", "invoice factoring"],
    question: "How does factoring work?",
    answer:
      "Factoring lets a carrier sell an invoice to a factoring company for faster payment. The factoring company pays sooner but takes a fee.",
  },
  {
    tags: ["quick pay", "faster pay", "same day pay", "early payment"],
    question: "What is quick pay?",
    answer:
      "Quick pay is an option where a broker pays faster than standard terms, often for a small percentage fee. Availability depends on the broker.",
  },
  {
    tags: ["payment", "pay", "when do i get paid", "settlement", "paid for load", "get paid"],
    question: "When do I get paid for a load?",
    answer:
      "Payment usually starts after delivery and document submission. Standard terms may be 15, 30, or more days unless quick pay or factoring is available. You get paid as soon as you deliver and the receiver confirms delivery.",
  },
  {
    tags: ["invoice", "submit invoice", "billing", "invoice broker"],
    question: "How do I invoice a broker?",
    answer:
      "Submit the invoice with the signed BOL/POD, rate confirmation, and any required receipts. Make sure the load number and payment details are correct.",
  },
  {
    tags: ["documents", "upload document", "upload bol", "upload pod", "trip documents"],
    question: "Where do I upload my BOL or POD?",
    answer:
      "Go to the active or delivered trip, open Documents, choose the document type, then upload a photo or PDF of the BOL, POD, receipt, or related paperwork.",
  },
  {
    tags: ["document rejected", "rejected document", "bad upload", "document denied"],
    question: "Why was my document rejected?",
    answer:
      "A document may be rejected if it is blurry, incomplete, missing signatures, uploaded under the wrong type, or does not match the load.",
  },
  {
    tags: ["blurry document", "bad photo", "retake photo", "upload clear image"],
    question: "How do I upload a clear document?",
    answer:
      "Place the document on a flat surface, use good lighting, capture all corners, avoid shadows, and make sure signatures and load numbers are readable.",
  },
  {
    tags: ["download bol", "view bol", "bol pdf", "print bol"],
    question: "Can I download the BOL?",
    answer:
      "If the app supports generated BOLs, open the load documents section and select View, Download, or Print BOL.",
  },
  {
    tags: ["equipment", "trailer type", "truck type", "reefer", "flatbed", "dry van"],
    question: "What equipment types are supported?",
    answer:
      "Common supported equipment types include Dry Van, Reefer, Flatbed, Step Deck, Power Only, Box Truck, and Hotshot depending on the platform setup.",
  },
  {
    tags: ["dry van", "van trailer"],
    question: "What is a dry van?",
    answer:
      "A dry van is an enclosed trailer used for general freight that does not need temperature control.",
  },
  {
    tags: ["reefer", "refrigerated", "temperature controlled", "temp controlled"],
    question: "What is a reefer load?",
    answer:
      "A reefer load requires a refrigerated trailer to maintain a specific temperature. Always verify temperature settings before pickup and during transit.",
  },
  {
    tags: ["flatbed", "flat bed", "tarp", "straps", "chains"],
    question: "What is a flatbed load?",
    answer:
      "A flatbed load uses an open trailer for freight that may be oversized, heavy, or loaded by crane or forklift. Securement requirements must be followed carefully.",
  },
  {
    tags: ["power only", "drop trailer", "hook trailer"],
    question: "What is a power-only load?",
    answer:
      "Power-only means the carrier provides the tractor and pulls a trailer supplied by someone else. Confirm trailer location, condition, and return instructions.",
  },
  {
    tags: ["hazmat", "hazardous materials", "placards", "hazmat load"],
    question: "Can I haul hazmat loads?",
    answer:
      "Hazmat loads usually require the proper CDL endorsement, valid training, placards, paperwork, and carrier approval. Only accept hazmat if you are qualified and authorized.",
  },
  {
    tags: ["weight", "load weight", "heavy load", "overweight"],
    question: "Where can I see the load weight?",
    answer:
      "Load weight is usually shown in the load details. Always verify the weight before accepting so it matches your equipment and legal limits.",
  },
  {
    tags: ["commodity", "freight type", "what am i hauling", "load contents"],
    question: "Where can I see what I am hauling?",
    answer:
      "The commodity or freight description is listed in the load details and may also appear on the BOL or rate confirmation.",
  },
  {
    tags: ["start trip", "begin trip", "start load", "pickup started"],
    question: "How do I start a trip?",
    answer:
      "Open an approved or assigned load and click Start Trip if available. The trip should only start after you are approved, dispatched, or assigned.",
  },
  {
    tags: ["cannot start trip", "start button missing", "no start trip button"],
    question: "Why can't I start my trip?",
    answer:
      "The Start Trip button may be hidden if the load is not approved, not assigned, rejected, cancelled, already in transit, or missing required information.",
  },
  {
    tags: ["complete trip", "finish trip", "end trip", "mark delivered"],
    question: "How do I complete a trip?",
    answer:
      "After delivery, mark the load delivered if the option is available, then upload the signed BOL or POD so the broker can review and close the load.",
  },
  {
    tags: ["tracking", "track load", "load tracking", "location update"],
    question: "How does load tracking work?",
    answer:
      "Load tracking lets brokers or dispatchers see status updates during the trip. Depending on the app, tracking may use manual updates or location-based updates.",
  },
  {
    tags: ["broker", "broker dashboard", "broker account"],
    question: "What can brokers do?",
    answer:
      "Brokers can post loads, review driver or carrier requests, approve or reject bookings, assign loads, track shipments, and manage documents.",
  },
  {
    tags: ["driver", "driver dashboard", "driver account"],
    question: "What can drivers do?",
    answer:
      "Drivers can search available loads, request loads, view approved or assigned loads, start trips, upload documents, and track delivery progress.",
  },
  {
    tags: ["dispatcher", "dispatch user", "dispatch account"],
    question: "What can dispatchers do?",
    answer:
      "Dispatchers can help manage loads, assign drivers, monitor trip statuses, communicate updates, and keep paperwork organized.",
  },
  {
    tags: ["assign driver", "assign load", "assign carrier", "broker assign"],
    question: "How does a broker assign a load?",
    answer:
      "A broker can open the load assignment page, choose an available driver or carrier, confirm the assignment, and the load will move out of the open board.",
  },
  {
    tags: ["approve request", "approve driver", "approve carrier", "accept request"],
    question: "How does a broker approve a request?",
    answer:
      "The broker reviews the pending request, checks carrier details, then clicks Approve. After approval, the driver or carrier can move forward with the load.",
  },
  {
    tags: ["reject request", "deny request", "decline request"],
    question: "How does a broker reject a request?",
    answer:
      "The broker can reject a pending request if the carrier does not qualify, the load is no longer available, or another driver has been selected.",
  },
  {
    tags: ["account", "register", "sign up", "create account", "log in", "login"],
    question: "How do I create an account?",
    answer:
      "Click Sign Up, choose your role, then enter your name, email, password, contact information, and company details if required.",
  },
  {
    tags: ["forgot password", "reset password", "password reset", "can't login"],
    question: "What if I forgot my password?",
    answer:
      "Use the Forgot Password option if available. If the app does not support password reset yet, contact support for help.",
  },
  {
    tags: ["profile", "edit profile", "update profile", "account settings"],
    question: "How do I update my profile?",
    answer:
      "Go to Account or Settings, then update your contact details, company information, role details, or profile image if supported.",
  },
  {
    tags: ["notifications", "alerts", "new load alert", "load notification"],
    question: "How do notifications work?",
    answer:
      "Notifications may appear when a load is added, approved, rejected, assigned, updated, or when documents need attention.",
  },
  {
    tags: ["new load", "newly added", "unseen load", "load badge"],
    question: "Why do I see a new load badge?",
    answer:
      "A new load badge means there are loads or updates you have not viewed yet. Opening that section usually clears the unseen notification.",
  },
  {
    tags: ["search filters", "filter loads", "origin filter", "destination filter"],
    question: "How do load filters work?",
    answer:
      "Load filters help narrow results by origin, destination, pickup date, delivery date, equipment type, rate, weight, and status.",
  },
  {
    tags: ["sort loads", "highest rate", "newest loads", "best loads"],
    question: "Can I sort loads?",
    answer:
      "If sorting is available, you can organize loads by newest, highest rate, pickup date, distance, or rate per mile.",
  },
  {
    tags: ["save load", "favorite load", "bookmark load"],
    question: "Can I save a load for later?",
    answer:
      "If favorites or saved loads are supported, you can bookmark a load and return to it later. Keep in mind that saved loads may still be booked by someone else.",
  },
  {
    tags: ["support", "help", "contact", "customer service"],
    question: "How do I contact support?",
    answer:
      "Use the Help or Support option in the app, or email support@swiftshift.com with your name, load number, and a short explanation of the issue.",
  },
  {
    tags: ["bug", "issue", "app not working", "error", "broken"],
    question: "What should I do if something is not working?",
    answer:
      "Refresh the page first. If the issue continues, take a screenshot, note what you were trying to do, and contact support with the load number if relevant.",
  },
  {
    tags: ["mobile", "phone", "tablet", "responsive", "small screen"],
    question: "Can I use SwiftShift on mobile?",
    answer:
      "Yes, SwiftShift is designed to work on desktop and mobile screens. Some dashboard actions may be easier on a larger screen.",
  },
  {
    tags: ["load number", "reference number", "load id", "tracking number"],
    question: "Where is the load number?",
    answer:
      "The load number or reference ID is usually shown on the load card, load details page, documents, and broker dashboard.",
  },
  {
    tags: ["special instructions", "driver instructions", "pickup instructions", "delivery instructions"],
    question: "Where are special instructions?",
    answer:
      "Special instructions are usually listed on the load details page and may include appointment rules, facility notes, trailer requirements, or document instructions.",
  },
  {
    tags: ["multi stop", "multiple stops", "extra stop", "stop off"],
    question: "What is a multi-stop load?",
    answer:
      "A multi-stop load has more than one pickup or delivery location. Review every stop, appointment time, and required paperwork before accepting.",
  },
  {
    tags: ["drop and hook", "drop hook", "live load", "live unload"],
    question: "What is the difference between live load and drop-and-hook?",
    answer:
      "Live load means you wait while the trailer is loaded or unloaded. Drop-and-hook means you drop one trailer and hook to another, usually saving time.",
  },
  {
    tags: ["seal", "seal number", "trailer seal"],
    question: "What is a seal number?",
    answer:
      "A seal number identifies the security seal placed on a trailer. Drivers should verify the seal number matches the paperwork and report any mismatch immediately.",
  },
  {
    tags: ["trailer number", "trailer id", "trailer"],
    question: "Where do I find the trailer number?",
    answer:
      "The trailer number may be listed on the rate confirmation, BOL, load details, or physically on the trailer.",
  },
  {
    tags: ["carrier name", "carrier", "carrier info"],
    question: "Where is the carrier name shown?",
    answer:
      "The carrier name may appear on the BOL, rate confirmation, broker assignment, and load details depending on how the load was created.",
  },
  {
    tags: ["shipper", "shipper name", "pickup facility"],
    question: "Who is the shipper?",
    answer:
      "The shipper is the business or facility where the freight is picked up. Shipper details are usually listed in the pickup section.",
  },
  {
    tags: ["consignee", "receiver", "delivery facility"],
    question: "Who is the consignee?",
    answer:
      "The consignee is the receiver of the freight. Consignee details are usually listed in the delivery section of the load or BOL.",
  },
  {
    tags: ["fuel", "fuel cost", "fuel spending", "fuel expense"],
    question: "Can I track fuel spending?",
    answer:
      "If fuel tracking is enabled, fuel spending may appear on the driver dashboard or trip summary. Otherwise, keep receipts for your own records.",
  },
  {
    tags: ["earnings", "revenue", "driver pay", "load earnings"],
    question: "Where can I see my earnings?",
    answer:
      "Driver earnings may appear on the dashboard, completed loads, settlements, or revenue section depending on your account role and app setup.",
  },
  {
    tags: ["analytics", "reports", "metrics", "dashboard numbers"],
    question: "What do dashboard metrics show?",
    answer:
      "Dashboard metrics summarize activity like active loads, delivered loads, revenue, pending requests, fuel spending, and load performance.",
  },
  {
    tags: ["unauthorized", "access denied", "not allowed", "wrong role"],
    question: "Why am I seeing unauthorized?",
    answer:
      "Unauthorized usually means your account role does not have access to that page, or your session expired. Log back in or use the correct dashboard for your role.",
  },
  {
    tags: ["session", "logged out", "sign out", "logout"],
    question: "Why did I get logged out?",
    answer:
      "You may have been logged out because your session expired, your browser refreshed authentication data, or you signed in from another place.",
  },
  {
    tags: ["dark mode", "theme", "light mode"],
    question: "Does the app support dark mode?",
    answer:
      "If theme switching is enabled, you can change between light and dark mode from the settings or theme toggle.",
  },
  {
    tags: ["broker revenue", "revenue page", "load revenue"],
    question: "What is the revenue page for?",
    answer:
      "The revenue page helps brokers or dispatchers review earnings, posted loads, completed loads, and financial performance.",
  },
  {
    tags: ["documents page", "missing documents", "required documents"],
    question: "What documents are required?",
    answer:
      "Common required documents include the signed BOL, POD, rate confirmation, lumper receipt, detention proof, and any broker-specific paperwork.",
  },
  {
    tags: ["fraud", "double brokering", "scam", "fake carrier"],
    question: "How does SwiftShift help prevent fraud?",
    answer:
      "SwiftShift can help by organizing carrier verification, document records, load assignments, and clear communication. Brokers should still verify authority, insurance, and carrier details.",
  },
  {
    tags: ["duplicate request", "requested twice", "already requested"],
    question: "Why can't I request the same load again?",
    answer:
      "The app may block duplicate requests so brokers do not receive repeated submissions for the same load from the same driver or carrier.",
  },
  {
    tags: ["load disappeared", "missing load", "where did load go"],
    question: "Why did a load disappear?",
    answer:
      "A load may disappear if it was booked, assigned, cancelled, removed by the broker, filtered out, or moved to another status tab.",
  },
  {
    tags: ["empty board", "no loads", "no available loads"],
    question: "Why are there no loads showing?",
    answer:
      "There may be no loads matching your filters. Try clearing filters, checking another status tab, or refreshing the load board.",
  },
  {
    tags: ["refresh", "reload", "update page"],
    question: "Should I refresh the page?",
    answer:
      "Refreshing can help if the page looks outdated or a recent change is not showing. If the issue continues, contact support.",
  },
];

const FALLBACK_ANSWER =
  "I'm not sure about that one yet. Try asking about loads, BOL/POD, dispatch statuses, payments, or factoring — or contact support@swiftshift.com.";

function findAnswer(userText: string): string {
  const text = userText.toLowerCase();
  let best: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;

    for (const tag of entry.tags) {
      if (text.includes(tag.toLowerCase())) {
        score += tag.split(" ").length;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return best ? best.answer : FALLBACK_ANSWER;
}

export default function SwiftShiftBotPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Hi, I'm the SwiftShift assistant. Ask me about loads, BOL/POD, dispatch, or payments.",
    },
  ]);

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const reply = findAnswer(trimmed);

    setMessages((currentMessages) => [
      ...currentMessages,
      { role: "user", text: trimmed },
      { role: "bot", text: reply },
    ]);

    setInput("");
  };

  const suggestions = KNOWLEDGE_BASE.slice(0, 4);

  return (
    <div className="flex h-[620px] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl shadow-stone-400/30 sm:w-[420px]">
      {/* Header */}
      <div className="relative overflow-hidden bg-stone-950 px-5 py-4 text-white">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <Truck size={21} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold tracking-wide">
                SwiftShift Assistant
              </h2>

              <span className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online
              </span>
            </div>

            <p className="mt-0.5 truncate text-xs text-stone-300">
              Loads, documents, dispatch, and payments
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-stone-50 via-white to-stone-50 px-4 py-5"
      >
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={`${message.role}-${index}`}
              className={`flex items-end gap-2 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white shadow-sm">
                  <Bot size={14} />
                </div>
              )}

              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? "rounded-br-md bg-stone-950 text-white"
                    : "rounded-bl-md border border-stone-200 bg-white text-stone-800"
                }`}
              >
                {message.text}
              </div>

              {isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-700 shadow-sm">
                  <User size={14} />
                </div>
              )}
            </div>
          );
        })}

        {messages.length === 1 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
              <Sparkles size={14} />
              Try asking
            </div>

            <div className="grid grid-cols-1 gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.question}
                  type="button"
                  onClick={() => send(suggestion.question)}
                  className="group flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-3 py-3 text-left text-sm text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50 hover:shadow-md"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700 transition group-hover:bg-stone-950 group-hover:text-white">
                    <MessageCircle size={16} />
                  </span>

                  <span className="font-medium">{suggestion.question}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-stone-200 bg-white p-4">
        <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 shadow-inner">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                send(input);
              }
            }}
            placeholder="Ask about loads, BOL, payments..."
            className="min-w-0 flex-1 bg-transparent px-1 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
          />

          <button
            type="button"
            onClick={() => send(input)}
            disabled={!input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-950 text-white shadow-sm transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] text-stone-400">
          SwiftShift support answers are based on your saved help topics.
        </p>
      </div>
    </div>
  );
}