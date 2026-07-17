import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  DocumentReference,
  CollectionReference
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOyrRlJz8voqUF7UXSe7Lsz-OfEnZcAP4",
  authDomain: "gen-lang-client-0930602584.firebaseapp.com",
  databaseURL: "https://gen-lang-client-0930602584-default-rtdb.firebaseio.com",
  projectId: "gen-lang-client-0930602584",
  storageBucket: "gen-lang-client-0930602584.firebasestorage.app",
  messagingSenderId: "140989933378",
  appId: "1:140989933378:web:1d77d39a8a7febe1a60adb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use custom Firestore Database ID provisioned on AI Studio
export const firestore = initializeFirestore(app, {}, "ai-studio-bnytopup-32bc94f9-ea19-46d8-a1ed-aee7ababc8f8");

// Mock db object to satisfy exports
export const db = {};

class DatabaseReference {
  constructor(public path: string) {}
}

export function ref(dbInstance: any, path: string = "") {
  return new DatabaseReference(path);
}

// Map Realtime Database style paths dynamically to standard Cloud Firestore references
export function getFirestoreRef(path: string): DocumentReference | CollectionReference {
  const parts = path.split("/").filter(Boolean);
  const collName = parts[0] || "default";

  // 1. Special single-segment paths that are actually documents
  if (collName === "banners" || collName === "payment_settings" || collName === "custom_prices") {
    if (parts.length <= 1) {
      return doc(firestore, collName, "default");
    } else {
      return doc(firestore, collName, parts[1]);
    }
  }

  // 2. Special paths with nested lists/tickets mapped to subcollections
  if (collName === "support_tickets") {
    if (parts.length === 1) {
      return collection(firestore, "support_tickets");
    } else if (parts.length === 2) {
      return collection(firestore, "support_tickets", parts[1], "tickets");
    } else {
      return doc(firestore, "support_tickets", parts[1], "tickets", parts[2]);
    }
  }

  if (collName === "orders") {
    if (parts.length === 1) {
      return collection(firestore, "orders");
    } else if (parts.length === 2) {
      return collection(firestore, "orders", parts[1], "user_orders");
    } else {
      return doc(firestore, "orders", parts[1], "user_orders", parts[2]);
    }
  }

  // 3. Default path translation based on segment count parity
  if (parts.length === 0) {
    return collection(firestore, "default");
  }

  if (parts.length % 2 === 1) {
    let refRef = collection(firestore, parts[0]);
    for (let i = 1; i < parts.length; i += 2) {
      if (parts[i] && parts[i + 1]) {
        refRef = collection(refRef as any, parts[i], parts[i + 1]);
      }
    }
    return refRef;
  } else {
    let refRef = doc(firestore, parts[0], parts[1]);
    for (let i = 2; i < parts.length; i += 2) {
      if (parts[i] && parts[i + 1]) {
        refRef = doc(refRef as any, parts[i], parts[i + 1]);
      }
    }
    return refRef;
  }
}

export function onValue(
  refObj: DatabaseReference,
  callback: (snapshot: any) => void,
  cancelCallback?: (error: any) => void
) {
  const fRef = getFirestoreRef(refObj.path);
  const isDoc = fRef instanceof DocumentReference;
  const parts = refObj.path.split("/").filter(Boolean);
  const collName = parts[0] || "default";
  const cacheKey = `rtdb_cache:${refObj.path}`;

  // Try loading from localStorage immediately to guarantee fast first-paint & fallback
  try {
    const cachedStr = localStorage.getItem(cacheKey);
    if (cachedStr) {
      const cached = JSON.parse(cachedStr);
      setTimeout(() => {
        try {
          callback({
            val: () => cached.valData,
            exists: () => cached.exists,
            key: parts.pop() || ""
          });
        } catch (e) {
          console.error("Error triggering cached onValue callback:", e);
        }
      }, 0);
    }
  } catch (e) {
    console.warn("Failed to parse cached RTDB data:", e);
  }

  const handleListenerError = (error: any) => {
    console.warn(`Firestore subscription error for path "${refObj.path}":`, error);
    if (error?.code === "resource-exhausted" || (error?.message && error.message.toLowerCase().includes("quota"))) {
      window.dispatchEvent(new CustomEvent("firebase-quota-exceeded", { detail: error }));
    }
    if (cancelCallback) {
      cancelCallback(error);
    }
  };

  if (isDoc) {
    const docRef = fRef as DocumentReference;
    return onSnapshot(
      docRef,
      (docSnap) => {
        let valData = docSnap.exists() ? docSnap.data() : null;
        if (collName === "banners" && valData && valData.list) {
          valData = valData.list;
        }

        // Cache success state
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              valData,
              exists: docSnap.exists()
            })
          );
        } catch (e) {
          console.warn("Failed to set local storage cache:", e);
        }

        callback({
          val: () => valData,
          exists: () => docSnap.exists(),
          key: docSnap.id
        });
      },
      handleListenerError
    );
  } else {
    const colRef = fRef as CollectionReference;
    return onSnapshot(
      colRef,
      (colSnap) => {
        const valData: any = {};
        colSnap.forEach((d) => {
          valData[d.id] = d.data();
        });

        // Cache success state
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              valData,
              exists: !colSnap.empty
            })
          );
        } catch (e) {
          console.warn("Failed to set local storage cache:", e);
        }

        callback({
          val: () => (colSnap.empty ? null : valData),
          exists: () => !colSnap.empty,
          key: colRef.id
        });
      },
      handleListenerError
    );
  }
}

export async function get(refObj: DatabaseReference) {
  const fRef = getFirestoreRef(refObj.path);
  const isDoc = fRef instanceof DocumentReference;
  const parts = refObj.path.split("/").filter(Boolean);
  const collName = parts[0] || "default";
  const cacheKey = `rtdb_cache:${refObj.path}`;

  try {
    if (isDoc) {
      const docRef = fRef as DocumentReference;
      const docSnap = await getDoc(docRef);
      let valData = docSnap.exists() ? docSnap.data() : null;
      if (collName === "banners" && valData && valData.list) {
        valData = valData.list;
      }

      // Cache success state
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            valData,
            exists: docSnap.exists()
          })
        );
      } catch (e) {
        console.warn("Failed to set local storage cache:", e);
      }

      return {
        val: () => valData,
        exists: () => docSnap.exists(),
        key: docSnap.id
      };
    } else {
      const colRef = fRef as CollectionReference;
      const colSnap = await getDocs(colRef);
      const valData: any = {};
      colSnap.forEach((d) => {
        valData[d.id] = d.data();
      });

      // Cache success state
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            valData,
            exists: !colSnap.empty
          })
        );
      } catch (e) {
        console.warn("Failed to set local storage cache:", e);
      }

      return {
        val: () => (colSnap.empty ? null : valData),
        exists: () => !colSnap.empty,
        key: colRef.id
      };
    }
  } catch (error: any) {
    if (error?.code === "resource-exhausted" || (error?.message && error.message.toLowerCase().includes("quota"))) {
      window.dispatchEvent(new CustomEvent("firebase-quota-exceeded", { detail: error }));
    }

    // Fallback to cache on failure
    try {
      const cachedStr = localStorage.getItem(cacheKey);
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        return {
          val: () => cached.valData,
          exists: () => cached.exists,
          key: parts.pop() || ""
        };
      }
    } catch (e) {
      console.warn("Failed to load cached RTDB data on error:", e);
    }

    throw error;
  }
}

export async function set(refObj: DatabaseReference, data: any) {
  const fRef = getFirestoreRef(refObj.path);
  const isDoc = fRef instanceof DocumentReference;

  if (isDoc) {
    const docRef = fRef as DocumentReference;
    const parts = refObj.path.split("/").filter(Boolean);
    const collName = parts[0] || "default";
    let finalData = data;
    if (collName === "banners") {
      if (Array.isArray(data)) {
        finalData = { list: data };
      } else if (data && data.list) {
        finalData = data;
      } else {
        finalData = { list: [] };
      }
    }
    await setDoc(docRef, finalData);
  } else {
    const colRef = fRef as CollectionReference;
    if (data && typeof data === "object") {
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          if (item) {
            const docId = item.id || String(i);
            const docRef = doc(firestore, colRef.path, docId);
            await setDoc(docRef, item);
          }
        }
      } else {
        for (const [key, val] of Object.entries(data)) {
          if (val) {
            const docRef = doc(firestore, colRef.path, key);
            await setDoc(docRef, val);
          }
        }
      }
    } else {
      throw new Error(`Cannot set a whole collection with non-object data: ${refObj.path}`);
    }
  }
}

export async function update(refObj: DatabaseReference, data: any) {
  const fRef = getFirestoreRef(refObj.path);
  const isDoc = fRef instanceof DocumentReference;

  if (isDoc) {
    const docRef = fRef as DocumentReference;
    await updateDoc(docRef, data);
  } else {
    const colRef = fRef as CollectionReference;
    if (data && typeof data === "object") {
      for (const [key, val] of Object.entries(data)) {
        if (val) {
          const docRef = doc(firestore, colRef.path, key);
          await setDoc(docRef, val, { merge: true });
        }
      }
    }
  }
}

export async function remove(refObj: DatabaseReference) {
  const fRef = getFirestoreRef(refObj.path);
  const isDoc = fRef instanceof DocumentReference;

  if (isDoc) {
    const docRef = fRef as DocumentReference;
    await deleteDoc(docRef);
  } else {
    const colRef = fRef as CollectionReference;
    const colSnap = await getDocs(colRef);
    for (const d of colSnap.docs) {
      await deleteDoc(d.ref);
    }
  }
}

export function push(refObj: DatabaseReference, data?: any): any {
  const fRef = getFirestoreRef(refObj.path);

  if (fRef instanceof CollectionReference) {
    const colRef = fRef as CollectionReference;
    const newDocRef = doc(colRef);
    if (data !== undefined) {
      setDoc(newDocRef, data);
    }
    return {
      key: newDocRef.id,
      path: refObj.path + "/" + newDocRef.id
    };
  } else {
    const docRef = fRef as DocumentReference;
    const subCol = collection(docRef, "items");
    const newDocRef = doc(subCol);
    if (data !== undefined) {
      setDoc(newDocRef, data);
    }
    return {
      key: newDocRef.id,
      path: refObj.path + "/items/" + newDocRef.id
    };
  }
}
