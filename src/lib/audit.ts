import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

interface AuditOptions {
  action: string;
  targetCollection: string;
  targetId: string;
  details?: string;
}

export const logAdminAction = async ({ action, targetCollection, targetId, details }: AuditOptions) => {
  try {
    const user = auth.currentUser;
    if (!user) return; // Only log authenticated actions

    await addDoc(collection(db, "audit_logs"), {
      uid: user.uid,
      action,
      targetCollection,
      targetId,
      details: details || "",
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to append audit log:", error);
  }
};
