import { useState } from "react";

export const ReservationPage = () => {
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
    const [isCourtSelected, setIsCourtSelected] = useState(false);
    const timeSlots = ['9:00 AM - 10:30 AM', '10:30 AM - 12:00 PM', '12:00 PM - 1:30 PM'];
  
    const locations = [
      { name: 'joquei', courts: ['Quadra 1', 'Quadra 2', 'Quadra 3'] },
      { name: 'play', courts: ['Quadra 1'] },
    ];
  
    const handleLocationClick = (locationName: string) => {
      setSelectedLocation(locationName);
      setSelectedCourt(null); // Reset selected court when location changes
    };
  
    const handleCourtClick = (courtName: string) => {
      setSelectedCourt(courtName);
      setIsCourtSelected(true);
    };
  
    return (
        <div className="bg-gray-950 text-white min-h-screen flex flex-col justify-center items-center">
            <h1 className="text-2xl text-center font-bold font-sans mb-4">Reserva de horários no Play e no Jóquei</h1>
            <h2 className="text-xl text-center font-bold pb-2">Selecione um dos clubes:</h2>
            <div className="flex mb-4">
                {locations.map((location) => (
                    <button
                        key={location.name}
                        onClick={() => handleLocationClick(location.name)}
                        className={`${selectedLocation === location.name ? 'border-blue-500' : 'border-gray-300'
                            } border-2 p-2 mx-2 rounded-md`}
                    >
                        <img
                            src={`${location.name}.jpg`}
                            alt={`Location ${location.name}`}
                            className="w-32 h-32"
                        />
                    </button>
                ))}
            </div>
            {selectedLocation && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Quadras do {selectedLocation}</h2>
                    <div className="grid text-black grid-cols-1 gap-4">
                        {locations
                            .find((location) => location.name === selectedLocation)
                            ?.courts.map((courtName) => (
                                <div
                                    key={courtName}
                                    className={`${selectedCourt === courtName ? 'bg-blue-400' : 'bg-indigo-900'
                                        } p-4 rounded-md shadow-md text-white text-center cursor-pointer`}
                                    onClick={() => handleCourtClick(courtName)}
                                >
                                    <h3 className="text-lg font-semibold mb-2">{courtName}</h3>
                                </div>
                            ))}
                    </div>
                </div>
            )}
            {isCourtSelected && (
                <div>
                    <h2 className="text-xl font-semibold mt-4">Horários disponíveis</h2>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {timeSlots.map((timeSlot) => (
                            <button
                                key={timeSlot}
                                className="bg-indigo-900 text-white px-2 py-1 rounded-md my-1 w-full"
                            >
                                {timeSlot}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}