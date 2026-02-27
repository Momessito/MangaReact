import { db, auth } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

class Reviews {
    static getUid() {
        if (auth.currentUser) return auth.currentUser.uid;
        return localStorage.getItem('firebase_uid');
    }

    // Submit or update a review
    static async submitReview(mangaId, mangaTitle, mangaImage, rating, comment) {
        try {
            const uid = this.getUid();
            if (!uid) throw new Error("Not logged in");

            // We use a custom document ID: uid_mangaId to easily overwrite existing review if evaluated again
            const reviewId = `${uid}_${mangaId}`;
            const reviewRef = doc(db, "reviews", reviewId);

            await setDoc(reviewRef, {
                userId: uid,
                mangaId: mangaId,
                mangaTitle: mangaTitle,
                mangaImage: mangaImage,
                rating: rating,
                comment: comment,
                timestamp: serverTimestamp()
            }, { merge: true });

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    // Get all reviews for a specific user
    static async getUserReviews(uid) {
        try {
            const reviewsRef = collection(db, "reviews");
            const q = query(reviewsRef, where("userId", "==", uid));
            const querySnapshot = await getDocs(q);

            let reviews = [];
            querySnapshot.forEach((docSnap) => {
                reviews.push({ id: docSnap.id, ...docSnap.data() });
            });
            // Sort client-side by rating or timestamp due to Firestore indexing limits on dynamic queries easily
            return reviews.sort((a, b) => b.rating - a.rating);
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    // Check if the current user already reviewed a manga
    static async getMyReview(mangaId) {
        try {
            const uid = this.getUid();
            if (!uid) return null;
            const reviewId = `${uid}_${mangaId}`;
            const reviewSnap = await getDoc(doc(db, "reviews", reviewId));

            if (reviewSnap.exists()) {
                return reviewSnap.data();
            }
            return null;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}

export default Reviews;
