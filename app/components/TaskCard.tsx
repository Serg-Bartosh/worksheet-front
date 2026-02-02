'use client';
import { useState } from 'react';
import axios from 'axios';

interface Option {
    id: number;
    text: string;
}

interface TaskProps {
    id: number;
    instruction: string;
    options: Option[];
}

export default function TaskCard({ id, instruction, options }: TaskProps) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [status, setStatus] = useState<{ isCorrect: boolean; message: string; result: string } | null>(null);
    const [isPending, setIsPending] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;


    const handleAnswer = async (optionId: number) => {
        if (isPending) return;

        setIsPending(true);
        setSelectedId(optionId);
        const token = sessionStorage.getItem('session_token');

        try {
            const response = await axios.post(
                `${API_URL}/worksheet-tasks/answer/${id}`,
                { option_id: optionId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setStatus(response.data);
        } catch (error) {
            console.error("Error sending answer:", error);
            alert("Connection error. Please try again.");
            setSelectedId(null);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 transition-all">
            <h3 className="text-xl font-medium text-gray-800 mb-6">{instruction}</h3>

            <div className="space-y-3">
                {options.map((option) => {
                    const isSelected = selectedId === option.id;
                    const isCorrect = status?.isCorrect && isSelected;
                    const isWrong = status && !status.isCorrect && isSelected;

                    return (
                        <button
                            key={option.id}
                            onClick={() => handleAnswer(option.id)}
                            disabled={isPending}
                            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-300 transform active:scale-[0.98]
                                ${isSelected
                                    ? (status
                                        ? (isCorrect ? 'border-[#50c878] bg-[#50c878]/10' : 'border-red-500 bg-red-50')
                                        : 'border-[#50c878] bg-[#99e999]/10')
                                    : 'border-gray-100 hover:border-[#99e999] hover:bg-gray-50'}
                            `}
                        >
                            <div className="flex justify-between items-center">
                                <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {option.text}
                                </span>

                                {status && isSelected && (
                                    <span className={`flex items-center font-bold ${isCorrect ? "text-[#50c878]" : "text-red-500"}`}>
                                        {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {status && (
                <div className="mt-4 flex flex-col items-center animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className={`w-full p-3 rounded-lg text-center font-bold mb-2
                        ${status.isCorrect ? 'bg-[#50c878]/20 text-[#2d7a46]' : 'bg-red-100 text-red-700'}`}>
                        {status.message}
                    </div>

                    <button
                        onClick={() => { setStatus(null); setSelectedId(null); }}
                        className="text-xs text-gray-400 hover:text-[#50c878] transition-colors underline uppercase tracking-wider font-semibold"
                    >
                        Change my answer
                    </button>
                </div>
            )}
        </div>
    );
}