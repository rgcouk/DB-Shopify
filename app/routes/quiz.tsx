import { useState } from 'react';
import { Link } from 'react-router';

export default function Quiz() {
    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0);

    const questions = [
        {
            question: "You find a vibrant red mushroom with white spots. Snack or Trap?",
            options: ["Ancient Superfood", "Trap (Amanita Muscaria)", "Druid's Delight"],
            answer: 1,
        },
        {
            question: "A shelf-like bracket mushroom growing on a birch tree. Snack or Trap?",
            options: ["Snack (Chaga)", "Forest Waste", "Trap"],
            answer: 0,
        },
        {
            question: "It looks like a brain, but it's growing in the spring. Snack or Trap?",
            options: ["Ancient Memory Booster", "Trap (False Morel)", "Snack"],
            answer: 1,
        },
    ];

    const handleAnswer = (index: number) => {
        if (index === questions[step].answer) {
            setScore(score + 1);
        }
        setStep(step + 1);
    };

    return (
        <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center', minHeight: '80vh' }}>
            <h1 className="section-title" style={{ color: 'var(--color-dark)', marginBottom: '2rem' }}>SNACK OR TRAP?</h1>
            <p style={{ marginBottom: '4rem', opacity: 0.7 }}>The Druid's Test of Apothecary Knowledge.</p>

            {step < questions.length ? (
                <div className="quiz-card" style={{ maxWidth: '600px', margin: '0 auto', background: '#f8f8f8', padding: '3rem', border: '1px solid #eee' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{questions[step].question}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {questions[step].options.map((option, i) => (
                            <button
                                key={i}
                                className="btn-pill"
                                style={{ borderColor: 'var(--color-dark)', color: 'var(--color-dark)', background: 'transparent' }}
                                onClick={() => handleAnswer(i)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="quiz-result">
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        {score === questions.length ? "MASTER APOTHECARY" : score > 0 ? "INITIATE DRUID" : "STAY IN THE VILLAGE"}
                    </h2>
                    <p style={{ marginBottom: '2rem' }}>You correctly identified {score} out of {questions.length} forest finds.</p>
                    <Link to="/" className="btn-ancient">[ RETURN TO SANCTUARY ]</Link>
                </div>
            )}
        </div>
    );
}
