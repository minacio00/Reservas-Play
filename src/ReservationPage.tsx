import 'firebase/firestore';
import { useEffect, useState } from "react";
import { firebaseApp } from "../firebaseConfig";
import {doc, getDocFromServer, getFirestore, updateDoc } from "firebase/firestore";
import ReservationModal from './ReservationModal';
import TimeslotsList from './TimeslotsList';

export const ReservationPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>("Joquei");
  const [selectedCourt, setSelectedCourt] = useState<string | null>("Quadra-1");
  const [isCourtSelected, setIsCourtSelected] = useState(false);
  // const timeSlots = ['9:00 AM - 10:30 AM', '10:30 AM - 12:00 PM', '12:00 PM - 1:30 PM'];
  const [funcionamento, setFuncionamento] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<any | null>(null);
  const [selectedDay, setSelectedDay] = useState("")
  const [isLoading, setIsLoading] = useState(true);

  const handleTimeSlotClick = (timeSlot: any, day: any) => {
    setSelectedTimeSlot(timeSlot);
    setIsModalOpen(true);
    setSelectedDay(day)
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTimeSlot(null);
    setUserName("");
    setOpponentName("");
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleOpponentNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpponentName(event.target.value);
  };

  const handleConfirmReservation = async () => {
    if (selectedTimeSlot) {
      const updatedFuncionamento = [...funcionamento]; // Create a copy of funcionamento
      const selectedLocationIndex = updatedFuncionamento.findIndex((locationData) => locationData.name === selectedLocation);
      if (selectedLocationIndex !== -1) {
        const selectedDayIndex = updatedFuncionamento[selectedLocationIndex].openingHours.findIndex((dayData: any) =>
            dayData.dia === selectedDay
            //dayData.quadras.some((quadra: any) => quadra.nomeQuadra === selectedCourt)
          
        );
        if (selectedDayIndex !== -1) {
          const selectedQuadraIndex = updatedFuncionamento[selectedLocationIndex].openingHours[selectedDayIndex].quadras.findIndex((quadra: any) =>
            quadra.nomeQuadra === selectedCourt
          );
          if (selectedQuadraIndex !== -1) {
            const updatedTimeSlots = updatedFuncionamento[selectedLocationIndex].openingHours[selectedDayIndex].quadras[selectedQuadraIndex].timeSlots.map((timeSlot: any) => {
              if (timeSlot.slot === selectedTimeSlot.slot) {
                return {
                  ...timeSlot,
                  jogador1: userName,
                  jogador2: opponentName,
                };
              }
              return timeSlot;
            });
            updatedFuncionamento[selectedLocationIndex].openingHours[selectedDayIndex].quadras[selectedQuadraIndex].timeSlots = updatedTimeSlots;
            await updateFuncionamentoData(updatedFuncionamento); // Update the data in Firestore
            handleModalClose();
          }
        }
      }
    }
  };

  const updateFuncionamentoData = async (updatedFuncionamento: any) => {
    const db = getFirestore(firebaseApp);
    const docRef = doc(db, "clubes", "tHBvy8cXxteUH7HfhrGE");
    await updateDoc(docRef, { funcionamento: updatedFuncionamento });
  };

  const locations = [
    { name: 'play', courts: ['Quadra-1'] },
    { name: 'joquei', courts: ['Quadra-1', 'Quadra-2', 'Quadra-3'] },
  ];
  const handleLocationClick = (locationName: string) => {
    setSelectedLocation(locationName);
    setSelectedCourt(null); // Reset selected court when location changes
    setIsCourtSelected(false);
  };

  const handleCourtClick = (courtName: string) => {
    setSelectedCourt(courtName);
    setIsCourtSelected(true);
  };
  const fetchData = async () => {
    const db = getFirestore(firebaseApp);
    try {
      const docsRef = doc(db, "clubes", "tHBvy8cXxteUH7HfhrGE")
      const snapshot = await getDocFromServer(docsRef) //todo: from server
      // console.log(snapshot.data()?.funcionamento)
      const funcionamentoData = snapshot.data()?.funcionamento;
      setFuncionamento(funcionamentoData);
      setIsLoading(false);
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
    const filteredDays = selectedLocationData.openingHours.map((day: any) => ({
      aberto: day.aberto,
      dia: day.dia,
      timeSlots: day.quadras
        .filter((quadra: any) => quadra.nomeQuadra === selectedCourt)
        .map((quadra: any) => quadra.timeSlots)
    }));
    console.log("filtrados: ", filteredDays)
    return filteredDays
  };

  const selectedCourtData = getSelectedCourtData();
  useEffect(() => {
    fetchData();

  }, [])
  if (isLoading) {
    return (
      <div className="bg-gray-950 text-white font-bold min-h-screen flex flex-col justify-center items-center">
        <p>Carregando...</p>
      </div>
    )
  } else {
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

        {isCourtSelected && selectedCourtData && (
          <div>
            <h2 className="text-xl font-semibold mt-4">Horários disponíveis para {selectedCourt}</h2>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {selectedCourtData.map((dayData: any) => (
                
                <div key={dayData.dia}>
                  <h3 className="text-lg font-semibold">{dayData.dia}</h3>
                  {dayData.timeSlots && dayData.timeSlots[0] ? (
                    dayData.timeSlots[0].map((timeSlot: any) => (
                      
                      <div key={timeSlot.slot}>
                        {timeSlot.disponivel === true ? (
                          <button
                            onClick={() => handleTimeSlotClick(timeSlot, dayData.dia)}
                            className="bg-indigo-900 text-white px-2 py-1 rounded-md my-1 w-full"
                          >
                            ({timeSlot.slot}) <br />
                            {timeSlot.jogador1} vs {timeSlot.jogador2}
                          </button>
                        ) : (
                          <span></span>
                        )}

                      </div>
                    ))
                  ) : (
                    <p>No time slots available for this day.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <ReservationModal
          isModalOpen={isModalOpen}
          userName={userName}
          opponentName={opponentName}
          selectedTimeSlot={selectedTimeSlot} // Pass the selected time slot
          handleUserNameChange={handleUserNameChange}
          handleOpponentNameChange={handleOpponentNameChange}
          handleModalClose={handleModalClose}
          handleConfirmReservation={handleConfirmReservation}
        />
      </div>
    );
  }

}