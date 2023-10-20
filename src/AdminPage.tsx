import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import { onAuthStateChanged } from "firebase/auth/cordova";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../firebaseConfig";
import ReservationModal from "./ReservationModal";
import { doc, getDocFromServer, getFirestore, updateDoc } from "firebase/firestore";
import { resetPlayers } from "./Helpers/resetPLayers";
import { funcionamentoArr } from "../data";
import TimeslotsList from "./TimeslotsList";

export function AdminPage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>("Joquei");
  const [selectedCourt, setSelectedCourt] = useState<string | null>("Quadra-1");
  const [isCourtSelected, setIsCourtSelected] = useState(false);
  // const timeSlots = ['9:00 AM - 10:30 AM', '10:30 AM - 12:00 PM', '12:00 PM - 1:30 PM'];
  const [funcionamento, setFuncionamento] = useState<any[]>(funcionamentoArr);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<any | null>(null);
  const [selectedDay, setSelectedDay] = useState("")
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourtData, setSelectedCourtData] = useState<any[]>()

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
                  disponivel: timeSlot.disponivel
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
  const handleDisableTime = (currentTimeSlot: any, day: string) => {
    console.log(currentTimeSlot.slot)
    setSelectedTimeSlot(currentTimeSlot);
    setSelectedDay(day)
    if (currentTimeSlot) {
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
              if (timeSlot.slot === currentTimeSlot.slot) {
                console.log(timeSlot.disponivel, " valor disponivel atual")
                console.log(!timeSlot.disponivel, " valor disponivel negado")
                return {
                  ...timeSlot,
                  jogador1: userName,
                  jogador2: opponentName,
                  disponivel: !timeSlot.disponivel
                };
              }
              return timeSlot;
            });
            updatedFuncionamento[selectedLocationIndex].openingHours[selectedDayIndex].quadras[selectedQuadraIndex].timeSlots = updatedTimeSlots;
            // await updateFuncionamentoData(updatedFuncionamento); // Update the data in Firestore
            
            setSelectedTimeSlot(null);
            setFuncionamento(updatedFuncionamento);
            setSelectedCourtData(getSelectedCourtData());
          }
        }
      }
    }
  };

  async function handleSaveBtnClick ()  {
    await updateFuncionamentoData(funcionamento);
    console.log(funcionamento);
  }

  //todo: implementar handle para botão de salvar

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

  const handleCourtClick = async (courtName: string) => {
    setSelectedCourt(courtName);
    setIsCourtSelected(true);
    console.log(selectedCourtData)
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
      dia: day.dia,
      aberto: day.aberto,
      timeSlots: day.quadras
        .filter((quadra: any) => quadra.nomeQuadra === selectedCourt)
        .map((quadra: any) => {
          return quadra.timeSlots.map((timeslot: any) => ({
            ...timeslot,
            disponivel: timeslot.disponivel || false
          }))
        })
    }));
    // console.log("filtrados: ", filteredDays)D
    return filteredDays
  };

  // const selectedCourtData = getSelectedCourtData();
  // console.log(selectedCourtData)
  useEffect(() => {
    fetchData();
    // updateFuncionamentoData(funcionamentoArr)
  }, [])

  useEffect(() => {
    setSelectedCourtData(getSelectedCourtData());
    //adicionar funcionamento ao array
  }, [isCourtSelected, selectedCourt])

  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    // Set up the observer to check authentication status
    const auth = getAuth(firebaseApp)
    const unsubscribe = onAuthStateChanged(auth, (authenticated) => {
      if (authenticated) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false)
      }
    });

    // Unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleToggleAberto = (day: string) => {
    //todo: need to test this, but is seems like it's working
    const selectedLocationData = getSelectedLocationData();
    if (!selectedLocationData) return;
    if (!selectedCourtData) return;

    const updatedFuncionamento = JSON.parse(JSON.stringify(funcionamento));

    const selectedLocationIndex = updatedFuncionamento.findIndex((locationData: any) => locationData.name === selectedLocation);
    if (selectedLocationIndex !== -1) {
      const selectedDayIndex = selectedLocationData.openingHours.findIndex((dayData: any) => dayData.dia === day);
      if (selectedDayIndex !== -1) {
        
        const selectedQuadraIndex = updatedFuncionamento[selectedLocationIndex].openingHours[selectedDayIndex].quadras.findIndex((quadra: any) =>
            quadra.nomeQuadra === selectedCourt
          );
        if (selectedQuadraIndex !== -1) {
          // Toggle the value of aberto
          const daydata = updatedFuncionamento[selectedLocationIndex].openingHours[selectedDayIndex]
          daydata.aberto = !daydata.aberto;
          const updatedSelectedCourtData = [...selectedCourtData];
          const dayDataIndex = updatedSelectedCourtData.findIndex((dayData: any) => dayData.dia === day);
          if (dayDataIndex !== -1) {
            updatedSelectedCourtData[dayDataIndex].aberto = daydata.aberto
          }
          setFuncionamento(updatedFuncionamento)
          setSelectedCourtData(updatedSelectedCourtData);
          updateFuncionamentoData(updatedFuncionamento) // todo: implementar botão de salvar alterações
        }
      }
    }
  };
  useEffect(() => {
    console.log(funcionamento, "dentro do UE")
  },[funcionamento])
  
  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col justify-center items-center">
      {authenticated ? (
        <>
          <p>Welcome, you are authenticated!</p>
          <div className="bg-gray-950 text-white min-h-screen flex flex-col justify-center items-center">
            <h1 className="text-2xl text-center font-bold font-sans mb-4">
              Reserva de horários no Play e no Jóquei
            </h1>
            <button onClick={() => {resetPlayers(funcionamento, setFuncionamento, updateFuncionamentoData) }}
              className="bg-indigo-900 text-white px-2 py-1 rounded-md my-1 w-2/4">Resetar horários</button>
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
             <TimeslotsList
              selectedCourtData={selectedCourtData}
              selectedCourt={selectedCourt}
              handleTimeSlotClick={handleTimeSlotClick}
              handleToggleAberto={handleToggleAberto}
              handleDisableTime={handleDisableTime}
              handleSaveBtnClick={handleSaveBtnClick}
              />
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
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}