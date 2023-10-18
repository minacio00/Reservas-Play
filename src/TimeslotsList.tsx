import React from 'react';

interface Timeslot {
    dia: string;
    aberto: boolean;
    timeSlots: any[];
}

interface TimeslotsListProps {
    selectedCourtData: Timeslot[];
    selectedCourt: string | null
    handleToggleAberto: (day: string) => void;
    handleTimeSlotClick: (timeSlot: any, day: any) => void;
}

const TimeslotsList: React.FC<TimeslotsListProps> = ({
    selectedCourtData,
    selectedCourt,
    handleToggleAberto,
    handleTimeSlotClick,
}) => (
    <div>
        <h2 className="text-xl font-semibold mt-4">Horários disponíveis para {selectedCourt}</h2>
        <button className="bg-indigo-900 text-white px-2 py-1 rounded-md my-1 w-full">Salvar alterações</button>
        <div className="grid grid-cols-1 gap-2 mt-2">
            {selectedCourtData.map((dayData: Timeslot) => (
                <div key={dayData.dia}>
                    <h3 className="text-lg font-semibold">{dayData.dia}</h3>
                    {dayData.aberto? (
                        <button
                            onClick={() => handleToggleAberto(dayData.dia)}
                            className="bg-indigo-900 text-white px-2 py-1 rounded-md my-1 w-2/4"
                        >
                            Desativar dia
                        </button>
                    ) : (
                        <button
                            onClick={() => handleToggleAberto(dayData.dia)}
                            className="bg-indigo-900 text-white px-2 py-1 rounded-md my-1 w-2/4"
                        >
                            Ativar dia
                        </button>
                    )}
                    {dayData.timeSlots && dayData.timeSlots[0] ? (
                        dayData.timeSlots[0].map((timeSlot: any) => (
                            <div className="flex" key={timeSlot.slot}>
                                <button
                                    onClick={() => handleTimeSlotClick(timeSlot, dayData.dia)}
                                    className="bg-indigo-900 text-white px-2 py-1 rounded-md my-1 w-full"
                                >
                                    ({timeSlot.slot}) <br />
                                    {timeSlot.jogador1} vs {timeSlot.jogador2}
                                </button>
                                <div className="px-2">
                                    <label>ativo: </label>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No time slots available for this day.</p>
                    )}
                </div>
            ))}
        </div>
    </div>
);

export default TimeslotsList;