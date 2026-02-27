import { auth, db } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

class User {

    static getHeaders() {
        return {
            "Content-Type": "application/json"
        };
    }

    // Helper to get current UID (fallback to localStorage if auth state is still initializing)
    static getUid() {
        if (auth.currentUser) return auth.currentUser.uid;
        return localStorage.getItem('firebase_uid');
    }

    static async register(email, password, nick) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user profile in Firestore
            await setDoc(doc(db, "users", user.uid), {
                nickname: nick,
                email: email,
                img: "",
                favorites: [],
                read: [],
                recentlyRead: [],
                friends: [],
                friendRequests: []
            });

            localStorage.setItem('firebase_uid', user.uid);
            return { status: 200 };
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') throw new Error("Email já em uso!");
            if (err.code === 'auth/weak-password') throw new Error("A senha deve ter pelo menos 6 caracteres!");
            throw new Error("Erro ao criar conta.");
        }
    }

    static async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            localStorage.setItem('firebase_uid', user.uid);
            return { status: 200 };
        } catch (err) {
            console.error(err);
            throw new Error("Credenciais inválidas.");
        }
    }

    static async getUser() {
        try {
            const uid = this.getUid();
            if (!uid) return null;

            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                return { data: { nickname: data.nickname || "User", email: data.email, img: data.img || '' } };
            }
            return null;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static async editUser(useredit) {
        try {
            const uid = this.getUid();
            if (!uid) return;

            const userRef = doc(db, "users", uid);
            const updates = {};

            if (useredit.nickname || (useredit.data && useredit.data.nickname)) {
                updates.nickname = useredit.nickname || useredit.data.nickname;
            }
            if (useredit.img || (useredit.data && useredit.data.img)) {
                updates.img = useredit.img || useredit.data.img;
            }
            if (useredit.email || (useredit.data && useredit.data.email)) {
                // Changing email in Firestore doesn't change Firebase Auth email natively without extra steps,
                // but we update it here for display.
                updates.email = useredit.email || useredit.data.email;
            }

            if (Object.keys(updates).length > 0) {
                await updateDoc(userRef, updates);
            }
        } catch (err) {
            console.error(err);
        }
    }

    static async editPassword(oldPass, newPass) {
        try {
            const user = auth.currentUser;
            if (!user) {
                alert("Sessão expirada. Faça login novamente.");
                return;
            }

            const credential = EmailAuthProvider.credential(user.email, oldPass);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPass);
            alert("Senha atualizada com sucesso!");
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                alert("A password antiga está incorreta!");
            } else {
                alert("Erro ao alterar senha.");
            }
        }
    }

    static async Exit() {
        try {
            await signOut(auth);
            localStorage.removeItem('firebase_uid');
            console.log('saiu');
        } catch (err) {
            console.error(err);
        }
    }

    // FIREBASE FAVORITES
    static async addFavorite(name, id) {
        try {
            const uid = this.getUid();
            if (!uid) throw new Error("Not logged in");

            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                favorites: arrayUnion(id)
            });
            return { status: 200 };
        } catch (err) {
            console.error(err);
        }
    }

    static async removeFavorite(id) {
        try {
            const uid = this.getUid();
            if (!uid) throw new Error("Not logged in");

            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                favorites: arrayRemove(id)
            });
            return { status: 200 };
        } catch (err) {
            console.error(err);
        }
    }

    static async getFavorites(limit = 100, offset = 0) {
        try {
            const uid = this.getUid();
            if (!uid) throw new Error("Not logged in");

            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                const favorites = userDoc.data().favorites || [];
                return { data: { data: favorites.map(id => ({ id })) } };
            }
            return { data: { data: [] } };
        } catch (err) {
            console.error(err);
            return { data: { data: [] } };
        }
    }

    static async isFavorited(id) {
        try {
            const uid = this.getUid();
            if (!uid) return null;

            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                const favorites = userDoc.data().favorites || [];
                return favorites.includes(id) ? 'reading' : null;
            }
            return null;
        } catch (err) {
            console.error("Not favorited or not logged in", err);
            return null;
        }
    }

    // FIREBASE READING HISTORY
    static async markMangaRead(mangaId, capId) {
        try {
            const uid = this.getUid();
            if (!uid) throw new Error("Not logged in");

            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                let recentlyRead = userDoc.data().recentlyRead || [];
                recentlyRead = recentlyRead.filter(id => id !== mangaId); // remove duplicate
                recentlyRead.unshift(mangaId); // prepend
                if (recentlyRead.length > 20) recentlyRead.pop();

                await updateDoc(userRef, {
                    read: arrayUnion(capId),
                    recentlyRead: recentlyRead
                });
            }
            return { status: 200 };
        } catch (err) {
            console.error(err);
        }
    }

    static async markMangaUnread(mangaId, capId) {
        try {
            const uid = this.getUid();
            if (!uid) throw new Error("Not logged in");

            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                read: arrayRemove(capId)
            });
            return { status: 200 };
        } catch (err) {
            console.error(err);
        }
    }

    static async listMangaRead(idManga) {
        try {
            const uid = this.getUid();
            if (!uid) return [];

            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                return userDoc.data().read || [];
            }
            return [];
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    static async getRecentlyRead() {
        try {
            const uid = this.getUid();
            if (!uid) return [];

            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                return userDoc.data().recentlyRead || [];
            }
            return [];
        } catch (err) {
            console.error(err);
            return [];
        }
    }
}

export default User;