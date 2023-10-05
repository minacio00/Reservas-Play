import React from "react";

interface ReservationModalProps {
    isModalOpen: boolean;
    userName: string;
    opponentName: string;
    selectedTimeSlot: any | null; // Adjust the type as needed
    handleUserNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleOpponentNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleModalClose: () => void;
    handleConfirmReservation: () => void;
  }

const ReservationModal :React.FC<ReservationModalProps> = ({
  isModalOpen,
  userName,
  opponentName,
  handleUserNameChange,
  handleOpponentNameChange,
  handleModalClose,
  handleConfirmReservation,
}) => {
  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-indigo-600 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Confirmar Reserva</h2>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Seu nome"
              value={userName}
              onChange={handleUserNameChange}
              className="w-full text-black px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Nome do oponente"
              value={opponentName}
              onChange={handleOpponentNameChange}
              className="w-full text-black px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleModalClose}
              className="text-gray-200 hover:text-gray-700 mr-2"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmReservation}
              className="bg-indigo-900 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ReservationModal;