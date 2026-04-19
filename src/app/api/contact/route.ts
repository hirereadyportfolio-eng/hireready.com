import { NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp, getFirestore } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";

// Initialize Firebase for Server Side
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// EMAIL SERVICE PLACEHOLDER: If you decide to add an email service later (e.g., Resend, SendGrid),
// you can initialize the client here.

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, organization, role, message, website_url } = body;

    // 1. Anti-Spam: Honeypot check
    if (website_url) {
      console.warn("Spam submission blocked via honeypot.");
      // Return 200 to confuse bots and prevent retries, but don't save or process.
      return NextResponse.json({ message: "Lead captured successfully" }, { status: 200 });
    }

    // 2. Save to Firestore
    const leadData = {
      name,
      email,
      organization,
      role,
      message,
      createdAt: serverTimestamp(),
      status: "new",
      source: "contact-page",
    };

    await addDoc(collection(db, "leads"), leadData);

    /**
     * EMAIL ADAPTER PLACEHOLDER:
     * If you want to send notifications:
     * 1. Send admin notification about the new lead.
     * 2. Send auto-reply thank you email to student/company.
     */
    console.log(`New lead saved to Firestore: ${email} (${role})`);

    return NextResponse.json({ message: "Lead captured successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Lead capture error:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}
