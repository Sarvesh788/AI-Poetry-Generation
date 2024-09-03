import React, { useState } from 'react';
import './settingsModal.css';

const SettingsModal = ({ isOpen, onClose, onSave }) => {
    const [happiness, setHappiness] = useState(5);
    const [strength, setStrength] = useState(5);
    const [length, setLength] = useState(5);
    const [rhyme, setRhyme] = useState(5);
    const [grammar, setGrammar] = useState(5);

    const handleSave = () => {
        onSave({ happiness, strength, length, rhyme, grammar });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Settings</h2>
                <div className="slider-container">
                    <label>Happiness: {happiness}</label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={happiness}
                        onChange={(e) => setHappiness(Number(e.target.value))}
                    />
                </div>
                <div className="slider-container">
                    <label>Strength: {strength}</label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={strength}
                        onChange={(e) => setStrength(Number(e.target.value))}
                    />
                </div>
                <div className="slider-container">
                    <label>Length: {length}</label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                    />
                </div>
                <div className="slider-container">
                    <label>Rhyme: {rhyme}</label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={rhyme}
                        onChange={(e) => setRhyme(Number(e.target.value))}
                    />
                </div>
                <div className="slider-container">
                    <label>Grammar: {grammar}</label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={grammar}
                        onChange={(e) => setGrammar(Number(e.target.value))}
                    />
                </div>
                <div className="modal-buttons">
                    {/* <button onClick={onClose}>Cancel</button> */}
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
