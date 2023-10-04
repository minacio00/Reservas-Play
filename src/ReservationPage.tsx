import 'firebase/firestore';
import { useEffect, useState } from "react";
import { firebaseApp } from "../firebaseConfig";
import {addDoc, collection, doc, getDoc, getFirestore } from "firebase/firestore";

export const ReservationPage = () => {
    const [selectedLocation, setSelectedLocation] = useState<string | null>("Joquei");
    const [selectedCourt, setSelectedCourt] = useState<string | null>("Quadra-1");
    const [isCourtSelected, setIsCourtSelected] = useState(false);
    const timeSlots = ['9:00 AM - 10:30 AM', '10:30 AM - 12:00 PM', '12:00 PM - 1:30 PM'];
    const [funcionamento, setFuncionamento] = useState<any[]>([]);
    
    const locations = [
      { name: 'joquei', courts: ['Quadra-1', 'Quadra-2', 'Quadra-3'] },
      { name: 'play', courts: ['Quadra-1'] },
    ];
    const handleLocationClick = (locationName: string) => {
      setSelectedLocation(locationName);
      setSelectedCourt(null); // Reset selected court when location changes
    };
  
    const handleCourtClick = (courtName: string) => {
      setSelectedCourt(courtName);
      setIsCourtSelected(true);
    };
    const fetchData =async () => {
        const db = getFirestore(firebaseApp);
        try {
            const docsRef = doc(db,"clubes","e6z5OS6uXNh1mhMeSlfu")
            const snapshot = await getDoc(docsRef)
            console.log(snapshot.data()?.funcionamento)
            const funcionamentoData = snapshot.data()?.funcionamento;
            setFuncionamento(funcionamentoData);
        //    const snap = addDoc(collection(db,"clubes"), {
        //     funcionamento
        //    })
        } catch (error) {
          console.log(error)
        }
    };
    const getSelectedLocationData = () => {
        return funcionamento.find((locationData) => locationData.name === selectedLocation);
      };
    
      const getSelectedCourtData = () => {
        const selectedLocationData = getSelectedLocationData();
        if (!selectedLocationData) return null;
        return selectedLocationData.openingHours.find((dayData: any) =>
          dayData.quadras.some((quadra: any) => quadra.nomeQuadra === selectedCourt)
        );
      };
    
      const selectedCourtData = getSelectedCourtData();
    useEffect(() => {
       fetchData();

    },[])
    
    return (
        <div className="bg-gray-950 text-white min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-2xl text-center font-bold font-sans mb-4">
            Reserva de horários no Play e no Jóquei
          </h1>
          <h2 className="text-xl text-center font-bold pb-2">
            Selecione um dos clubes:
          </h2>
          <div className="flex mb-4">
            {locations.map((location) => (
              <button
                key={location.name}
                onClick={() => handleLocationClick(location.name)}
                className={`${
                  selectedLocation === location.name ? 'border-blue-500' : 'border-gray-300'
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
                      className={`${
                        selectedCourt === courtName ? 'bg-blue-400' : 'bg-indigo-900'
                      } p-4 rounded-md shadow-md text-white text-center cursor-pointer`}
                      onClick={() => handleCourtClick(courtName)}
                    >
                      <h3 className="text-lg font-semibold mb-2">{courtName}</h3>
                    </div>
                  ))}
                    </div>
                </div>
            )}
            {isCourtSelected && selectedCourtData && (
                <div>
                    <h2 className="text-xl font-semibold mt-4">Horários disponíveis</h2>
                    <div className="grid grid-cols-1 gap-4 mt-2">
                        {selectedCourtData.quadras.map((quadra: any) => (
                            <div key={quadra.nomeQuadra}>
                                <h3 className="text-lg font-semibold">{quadra.nomeQuadra}</h3>
                                {quadra.timeSlots.map((timeSlot: any) => (
                                    <button
                                        key={timeSlot.slot} // Use a unique key for each button
                                        className="bg-indigo-900 text-white px-2 py-1 rounded-md my-1 w-full"
                                    >
                                        {timeSlot.slot} - {timeSlot.jogador1} vs {timeSlot.jogador2}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      );
}