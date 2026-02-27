import React, { useState, useEffect } from 'react';
import Reviews from '../backend/reviews';

function ReviewModal({ isOpen, onClose, mangaId, mangaTitle, mangaImage, onReviewSubmitted }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Load existing review if present
            Reviews.getMyReview(mangaId).then(existing => {
                if (existing) {
                    setRating(existing.rating || 0);
                    setComment(existing.comment || "");
                }
            });
        } else {
            setRating(0);
            setComment("");
        }
    }, [isOpen, mangaId]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Por favor, selecione as estrelas!");
            return;
        }

        setLoading(true);
        const success = await Reviews.submitReview(mangaId, mangaTitle, mangaImage, rating, comment);
        setLoading(false);

        if (success) {
            alert("Avaliação salva com sucesso!");
            if (onReviewSubmitted) onReviewSubmitted();
            onClose();
        } else {
            alert("Ocorreu um erro ao salvar a avaliação.");
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'var(--color1)', padding: '20px', borderRadius: '10px', width: '90%', maxWidth: '400px', color: 'white', border: '1px solid var(--color2)' }}>
                <h2>Avaliar {mangaTitle}</h2>
                <div style={{ display: 'flex', gap: '5px', margin: '15px 0', fontSize: '30px', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} onClick={() => setRating(star)} style={{ color: star <= rating ? 'gold' : 'gray' }}>
                            ★
                        </span>
                    ))}
                </div>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="O que achou deste mangá? (Opcional)"
                    style={{ width: '100%', minHeight: '100px', padding: '10px', backgroundColor: 'var(--color6)', color: 'white', border: '1px solid var(--color2)', borderRadius: '5px' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button onClick={onClose} disabled={loading} style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancelar</button>
                    <button onClick={handleSubmit} disabled={loading} style={{ padding: '10px 20px', backgroundColor: 'var(--color5)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{loading ? 'Salvando...' : 'Salvar Avaliação'}</button>
                </div>
            </div>
        </div>
    );
}

export default ReviewModal;
