import { db, auth } from '../firebase';
import {
    doc, getDoc, updateDoc, arrayUnion, arrayRemove,
    collection, query, where, getDocs, addDoc,
    onSnapshot, orderBy, serverTimestamp
} from 'firebase/firestore';

class Social {
    static getUid() {
        if (auth.currentUser) return auth.currentUser.uid;
        return localStorage.getItem('firebase_uid');
    }

    // --- USER SEARCH ---
    static async searchUsers(nicknameSearch) {
        try {
            // Because Firestore doesn't support native partial text search easily, 
            // we fetch all users (assuming small userbase) or exact match.
            // For a production app, use Algolia/Elasticsearch. Here we just fetch all and filter.
            const usersRef = collection(db, "users");
            const querySnapshot = await getDocs(usersRef);
            let results = [];
            const myUid = this.getUid();

            querySnapshot.forEach((docSnap) => {
                if (docSnap.id !== myUid) {
                    const data = docSnap.data();
                    if (data.nickname && data.nickname.toLowerCase().includes(nicknameSearch.toLowerCase())) {
                        results.push({ uid: docSnap.id, ...data });
                    }
                }
            });
            return results;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    // --- FRIEND REQUESTS ---
    static async sendFriendRequest(targetUid) {
        try {
            const uid = this.getUid();
            if (!uid || uid === targetUid) return;

            const targetRef = doc(db, "users", targetUid);
            await updateDoc(targetRef, {
                friendRequests: arrayUnion(uid)
            });
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    static async acceptFriendRequest(requesterUid) {
        try {
            const myUid = this.getUid();
            if (!myUid) return false;

            const myRef = doc(db, "users", myUid);
            const requesterRef = doc(db, "users", requesterUid);

            // 1. Remove from my requests, add to my friends
            await updateDoc(myRef, {
                friendRequests: arrayRemove(requesterUid),
                friends: arrayUnion(requesterUid)
            });

            // 2. Add me to requester's friends
            await updateDoc(requesterRef, {
                friends: arrayUnion(myUid)
            });

            // 3. Optional: Setup a chat document
            await this.createOrGetChatRoom(myUid, requesterUid);

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    static async declineFriendRequest(requesterUid) {
        try {
            const myUid = this.getUid();
            if (!myUid) return false;

            const myRef = doc(db, "users", myUid);
            await updateDoc(myRef, {
                friendRequests: arrayRemove(requesterUid)
            });
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    static async getMyProfileData() {
        try {
            const uid = this.getUid();
            if (!uid) return null;
            const docSnap = await getDoc(doc(db, "users", uid));
            if (docSnap.exists()) {
                return docSnap.data();
            }
            return null;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static listenToMyProfile(callback) {
        try {
            const uid = this.getUid();
            if (!uid) return () => { };
            return onSnapshot(doc(db, "users", uid), (docSnap) => {
                if (docSnap.exists()) {
                    callback(docSnap.data());
                } else {
                    callback(null);
                }
            });
        } catch (err) {
            console.error(err);
            return () => { };
        }
    }

    static async getUsersProfiles(uidList) {
        try {
            if (!uidList || uidList.length === 0) return [];
            let profiles = [];
            for (let id of uidList) {
                const docSnap = await getDoc(doc(db, "users", id));
                if (docSnap.exists()) {
                    profiles.push({ uid: id, ...docSnap.data() });
                }
            }
            return profiles;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    // --- CHATS ---
    static async createOrGetChatRoom(uid1, uid2) {
        try {
            const chatsRef = collection(db, "chats");
            // Check if chat already exists
            const q = query(chatsRef, where("participants", "array-contains", uid1));
            const querySnapshot = await getDocs(q);

            let existingChatId = null;
            querySnapshot.forEach((docSnap) => {
                const participants = docSnap.data().participants;
                if (participants.includes(uid2)) {
                    existingChatId = docSnap.id;
                }
            });

            if (existingChatId) return existingChatId;

            // Create new chat room
            const newChat = await addDoc(chatsRef, {
                participants: [uid1, uid2]
            });
            return newChat.id;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static async sendMessage(chatId, text) {
        try {
            const uid = this.getUid();
            if (!uid) return;

            const messagesRef = collection(db, `chats/${chatId}/messages`);
            await addDoc(messagesRef, {
                senderId: uid,
                text: text,
                timestamp: serverTimestamp()
            });
        } catch (err) {
            console.error(err);
        }
    }

    static listenToMessages(chatId, callback) {
        const messagesRef = collection(db, `chats/${chatId}/messages`);
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        return onSnapshot(q, (snapshot) => {
            const msgs = [];
            snapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() });
            });
            callback(msgs);
        });
    }
}

export default Social;
